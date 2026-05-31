---
title: "Temporal Tables with Entity Framework Core: Complete Guide to Auditing Data Changes"
subtitle: "Discover how to use SQL Server temporal tables with Entity Framework Core to automatically track data changes, query historical data, and implement robust auditing in your .NET applications. This comprehensive guide includes code samples, real-world scenarios, and best practices for production use."
date: "May 31 2026"
author: "Stefan Đokić"
category: "Entity Framework"
readTime: "12 minutes"
meta_description: "Discover how to use SQL Server temporal tables with Entity Framework Core to automatically track data changes, query historical data, and implement robust auditing in your .NET applications. This comprehensive guide includes code samples, real-world scenarios, and best practices for production use."
---

## The Problem: Auditing in the Real World

Imagine you're building an e-commerce platform. A customer contacts support claiming their order was modified without their consent - the shipping address changed after they placed the order. Your operations team needs to answer:

- What did this order look like at the time of placement?
- Who (or what process) changed the shipping address, and when?
- Can we restore the previous state without breaking referential integrity?

The naive approach - adding `CreatedAt`, `UpdatedAt`, and `ModifiedBy` columns - only tells you *when* the last change happened. You lose the full history. A custom audit log table works, but it requires discipline: every developer must remember to write to it, and every `SaveChanges()` call must be intercepted consistently.

**SQL Server Temporal Tables solve this at the database engine level**, and **Entity Framework Core 6+** exposes them through a clean, first-class API. No triggers. No custom interceptors. No risk of an audit entry being skipped.

This article walks through a realistic scenario from scratch: building a production-grade audit system for an e-commerce platform's `Order` and `OrderItem` entities.

---

## What Are Temporal Tables?

Introduced in SQL Server 2016 and standardized in SQL:2011, **system-versioned temporal tables** are tables that automatically maintain a full history of row changes. The database engine tracks:

- The **current state** of every row (main table)
- Every **previous state** with the exact time range it was valid (history table)

Two hidden `datetime2` period columns - typically `ValidFrom` and `ValidTo` - define the time range during which a row version was current. These are populated and managed entirely by SQL Server, not by application code.

```
┌──────────────────────────────────────────────────────────┐
│                      Orders (main)                       │
│  Id │ CustomerId │ ShippingAddress   │ ValidFrom │ ValidTo│
│─────┼────────────┼───────────────────┼───────────┼────────│
│  1  │    42      │ "123 Main St"     │ 2026-05-25│ 9999.. │  ← current
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                   OrdersHistory                          │
│  Id │ CustomerId │ ShippingAddress   │ ValidFrom │ ValidTo│
│─────┼────────────┼───────────────────┼───────────┼────────│
│  1  │    42      │ "456 Oak Ave"     │ 2026-05-20│ 2026-05-25│ ← old version
│  1  │    42      │ "789 Pine Rd"     │ 2026-05-15│ 2026-05-20│ ← even older
└──────────────────────────────────────────────────────────┘
```

When a row is **updated**, the old version is moved to the history table with its `ValidTo` set to the current UTC timestamp. When a row is **deleted**, the same happens - the history table becomes its only record.

---

## How SQL Server Temporal Tables Work Internally

Understanding the internals prevents surprises in production.

**On INSERT:** A new row is added to the main table. `ValidFrom` is set to the current transaction time. `ValidTo` is set to `9999-12-31 23:59:59.9999999` (representing "still current").

**On UPDATE:** SQL Server atomically:
1. Copies the current row to the history table, setting its `ValidTo` to the transaction time
2. Updates the main table row, setting `ValidFrom` to the transaction time

**On DELETE:** SQL Server copies the current row to the history table with `ValidTo` set to now. The main table row is removed.

> **Important:** All timestamps are in UTC and are set by SQL Server itself. Your application cannot override them. This is actually a security feature - it makes the audit trail tamper-evident.

---

## Setting Up EF Core Temporal Tables

### Prerequisites

- .NET 6 or later
- EF Core 6 or later (`Microsoft.EntityFrameworkCore.SqlServer`)
- SQL Server 2016+ (or Azure SQL Database)

### Step 1: Define Your Entities

```csharp
// Models/Order.cs
public class Order
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string ShippingAddress { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; }

    public Customer Customer { get; set; } = null!;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

// Models/OrderItem.cs
public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }

    public Order Order { get; set; } = null!;
}
```

Notice that **the entities themselves have no audit columns**. No `ValidFrom`, no `ValidTo`, no `ModifiedBy`. The temporal infrastructure is purely a concern of the data layer configuration.

### Step 2: Configure Temporal Tables in DbContext

```csharp
// Data/AppDbContext.cs
public class AppDbContext : DbContext
{
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Customer> Customers => Set<Customer>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("Orders", t => t.IsTemporal(temporal =>
            {
                temporal.HasPeriodStart("ValidFrom");
                temporal.HasPeriodEnd("ValidTo");
                temporal.UseHistoryTable("OrdersHistory", "audit");
            }));

            entity.Property(o => o.TotalAmount)
                  .HasColumnType("decimal(18,2)");

            entity.Property(o => o.Status)
                  .HasMaxLength(50);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.ToTable("OrderItems", t => t.IsTemporal(temporal =>
            {
                temporal.HasPeriodStart("ValidFrom");
                temporal.HasPeriodEnd("ValidTo");
                temporal.UseHistoryTable("OrderItemsHistory", "audit");
            }));

            entity.Property(i => i.UnitPrice)
                  .HasColumnType("decimal(18,2)");
        });
    }
}
```

A few deliberate choices here:
- **`"audit"` schema** - history tables are placed in a separate schema, keeping the main schema clean and making it easy to manage permissions (e.g., only DBAs can read `audit.*`)
- **Explicit period column names** - `ValidFrom` / `ValidTo` are conventional but you can use `PeriodStart` / `PeriodEnd` if your team prefers
- **Both `Order` and `OrderItem` are temporal** - this is important for the point-in-time scenario; you need the full picture

### Step 3: Create and Apply the Migration

```bash
dotnet ef migrations add AddTemporalTables --output-dir Data/Migrations
dotnet ef database update
```

Inspect the generated migration to understand what EF Core does under the hood:

```csharp
// Excerpt from the generated migration
migrationBuilder.CreateTable(
    name: "Orders",
    columns: table => new
    {
        Id = table.Column<int>(nullable: false)
            .Annotation("SqlServer:Identity", "1, 1"),
        // ... other columns ...
        ValidFrom = table.Column<DateTime>(nullable: false)
            .Annotation("SqlServer:IsTemporal", true)
            .Annotation("SqlServer:TemporalPeriodStartColumnName", "ValidFrom"),
        ValidTo = table.Column<DateTime>(nullable: false)
            .Annotation("SqlServer:IsTemporal", true)
            .Annotation("SqlServer:TemporalPeriodEndColumnName", "ValidTo")
    },
    constraints: table =>
    {
        table.PrimaryKey("PK_Orders", x => x.Id);
    })
    .Annotation("SqlServer:IsTemporal", true)
    .Annotation("SqlServer:TemporalHistoryTableName", "OrdersHistory")
    .Annotation("SqlServer:TemporalHistoryTableSchema", "audit")
    .Annotation("SqlServer:TemporalPeriodStartColumnName", "ValidFrom")
    .Annotation("SqlServer:TemporalPeriodEndColumnName", "ValidTo");
```

The SQL Server generated is something like:

```sql
CREATE TABLE [Orders] (
    [Id]              INT           NOT NULL IDENTITY,
    [CustomerId]      INT           NOT NULL,
    [ShippingAddress] NVARCHAR(MAX) NOT NULL,
    [Status]          NVARCHAR(50)  NOT NULL,
    [TotalAmount]     DECIMAL(18,2) NOT NULL,
    [CreatedAt]       DATETIME2     NOT NULL,
    [ValidFrom]       DATETIME2     GENERATED ALWAYS AS ROW START NOT NULL,
    [ValidTo]         DATETIME2     GENERATED ALWAYS AS ROW END   NOT NULL,
    PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo]),
    CONSTRAINT [PK_Orders] PRIMARY KEY ([Id])
)
WITH (SYSTEM_VERSIONING = ON (
    HISTORY_TABLE = [audit].[OrdersHistory]
));
```

---

## Real-World Scenario: E-Commerce Order Auditing

### Writing Data (No Changes Required)

Standard EF Core operations automatically trigger temporal tracking:

```csharp
// OrderService.cs
public class OrderService
{
    private readonly AppDbContext _db;

    public OrderService(AppDbContext db) => _db = db;

    public async Task<Order> PlaceOrderAsync(int customerId, CreateOrderDto dto)
    {
        var order = new Order
        {
            CustomerId = customerId,
            ShippingAddress = dto.ShippingAddress,
            Status = "Pending",
            TotalAmount = dto.Items.Sum(i => i.Quantity * i.UnitPrice),
            CreatedAt = DateTime.UtcNow,
            Items = dto.Items.Select(i => new OrderItem
            {
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        // SQL Server silently sets ValidFrom = UTC_NOW, ValidTo = 9999-12-31
        return order;
    }

    public async Task UpdateShippingAddressAsync(int orderId, string newAddress)
    {
        var order = await _db.Orders.FindAsync(orderId)
            ?? throw new OrderNotFoundException(orderId);

        order.ShippingAddress = newAddress;
        await _db.SaveChangesAsync();

        // SQL Server moves the old row to OrdersHistory,
        // sets its ValidTo = now, then updates the main row.
        // Zero application code needed.
    }
}
```

### Reading Current Data

Current data queries work exactly as before - temporal tables are transparent:

```csharp
var activeOrders = await _db.Orders
    .Include(o => o.Items)
    .Where(o => o.Status != "Cancelled")
    .ToListAsync();
```

---

## Advanced Querying Patterns

This is where temporal tables really shine. EF Core 7+ exposes five temporal query operators.

### 1. `TemporalAll()` - Full History for an Entity

Retrieve every version of a specific order to build a complete change log:

```csharp
public async Task<IEnumerable<OrderAuditEntry>> GetOrderHistoryAsync(int orderId)
{
    return await _db.Orders
        .TemporalAll()
        .Where(o => o.Id == orderId)
        .OrderBy(o => EF.Property<DateTime>(o, "ValidFrom"))
        .Select(o => new OrderAuditEntry
        {
            ShippingAddress = o.ShippingAddress,
            Status = o.Status,
            TotalAmount = o.TotalAmount,
            ValidFrom = EF.Property<DateTime>(o, "ValidFrom"),
            ValidTo = EF.Property<DateTime>(o, "ValidTo")
        })
        .ToListAsync();
}
```

Sample output for our disputed order scenario:

```
ValidFrom            ValidTo              Status     ShippingAddress
───────────────────────────────────────────────────────────────────
2026-05-15 09:00:00  2026-05-20 14:32:11  Pending    "789 Pine Rd"
2026-05-20 14:32:11  2026-05-25 08:17:44  Processing "456 Oak Ave"
2026-05-25 08:17:44  9999-12-31 23:59:59  Shipped    "123 Main St"  ← current
```

This directly answers the customer's complaint - we can see exactly when the address changed.

### 2. `TemporalAsOf()` - Point-in-Time Snapshot

Reconstruct the complete state of an order as it existed at a specific moment:

```csharp
public async Task<OrderSnapshot?> GetOrderSnapshotAsync(int orderId, DateTime asOf)
{
    // Get the order as it was at the given point in time
    var order = await _db.Orders
        .TemporalAsOf(asOf)
        .Include(o => o.Items)  // EF Core also applies TemporalAsOf to includes
        .FirstOrDefaultAsync(o => o.Id == orderId);

    if (order is null) return null;

    return new OrderSnapshot
    {
        OrderId = orderId,
        AsOf = asOf,
        ShippingAddress = order.ShippingAddress,
        Status = order.Status,
        Items = order.Items.Select(i => new OrderItemSnapshot
        {
            ProductName = i.ProductName,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice
        }).ToList()
    };
}
```

> **Key insight:** When you use `TemporalAsOf()` with `Include()`, EF Core applies the temporal filter to the related entity too. The `OrderItems` you get back are the ones that existed at that exact timestamp - not the current items. This is critical for getting a consistent snapshot.

### 3. `TemporalBetween()` - Changes Within a Window

Find all orders that were modified during a specific time window (e.g., during a suspicious batch process that ran at 3 AM):

```csharp
var suspiciousWindow = new
{
    Start = new DateTime(2026, 5, 20, 3, 0, 0, DateTimeKind.Utc),
    End   = new DateTime(2026, 5, 20, 4, 0, 0, DateTimeKind.Utc)
};

// TemporalBetween: rows where ValidFrom >= start AND ValidFrom < end
var changedDuringWindow = await _db.Orders
    .TemporalBetween(suspiciousWindow.Start, suspiciousWindow.End)
    .Select(o => new
    {
        o.Id,
        o.Status,
        ValidFrom = EF.Property<DateTime>(o, "ValidFrom")
    })
    .ToListAsync();
```

### 4. `TemporalFromTo()` - Overlapping Time Ranges

Unlike `TemporalBetween`, `TemporalFromTo` includes rows that were *active* during the range - even if they started before it:

```csharp
// TemporalFromTo: rows where ValidFrom < end AND ValidTo > start
// (i.e., the row was valid at any point during the window)
var ordersActiveLastWeek = await _db.Orders
    .TemporalFromTo(DateTime.UtcNow.AddDays(-7), DateTime.UtcNow)
    .Where(o => o.Status == "Processing")
    .ToListAsync();
```

### 5. `TemporalContainedIn()` - Rows Entirely Within a Range

Only returns rows that were *created and deleted* entirely within the specified range. Useful for finding short-lived records:

```csharp
// Only rows where ValidFrom >= start AND ValidTo <= end
var shortLivedStatuses = await _db.Orders
    .TemporalContainedIn(
        DateTime.UtcNow.AddHours(-1),
        DateTime.UtcNow)
    .ToListAsync();
```

### Temporal Operator Comparison

| Operator | Includes rows where... | Typical use case |
|---|---|---|
| `TemporalAll()` | Any version exists | Full audit log |
| `TemporalAsOf(t)` | `ValidFrom <= t < ValidTo` | Point-in-time restore |
| `TemporalBetween(s, e)` | `ValidFrom >= s AND ValidFrom < e` | "What changed during this window?" |
| `TemporalFromTo(s, e)` | `ValidFrom < e AND ValidTo > s` | "What was active during this window?" |
| `TemporalContainedIn(s, e)` | `ValidFrom >= s AND ValidTo <= e` | "What was born and died in this window?" |

---

## Handling Migrations Safely in Production

Enabling temporal tables on an **existing production table** is more delicate than creating one from scratch. Here's a safe approach.

### Scenario: Enabling Temporal on an Existing `Orders` Table

If you already have an `Orders` table in production, EF Core will generate an `AlterTable` migration. However, this can cause issues if the table is large or if there are active transactions.

**Option A: Let EF Core Generate the Migration (Recommended for small tables)**

```bash
dotnet ef migrations add EnableTemporalOnOrders
```

Inspect the generated migration before applying:

```csharp
// The generated migration will look roughly like:
migrationBuilder.AlterTable(
    name: "Orders",
    oldAnnotations: new Dictionary<string, object?>(), // was not temporal
    newAnnotations: new Dictionary<string, object?>
    {
        { "SqlServer:IsTemporal", true },
        { "SqlServer:TemporalHistoryTableName", "OrdersHistory" },
        { "SqlServer:TemporalHistoryTableSchema", "audit" },
        { "SqlServer:TemporalPeriodStartColumnName", "ValidFrom" },
        { "SqlServer:TemporalPeriodEndColumnName", "ValidTo" }
    }
);
```

**Option B: Use Raw SQL for Large Tables**

For large tables in production, use a custom migration with raw SQL to have full control:

```csharp
public partial class EnableTemporalOnOrders : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Add the period columns (cannot be NOT NULL directly on populated table)
        migrationBuilder.Sql(@"
            ALTER TABLE [Orders]
            ADD [ValidFrom] DATETIME2 GENERATED ALWAYS AS ROW START HIDDEN
                CONSTRAINT DF_Orders_ValidFrom DEFAULT '2000-01-01 00:00:00.0000000',
                [ValidTo]   DATETIME2 GENERATED ALWAYS AS ROW END HIDDEN
                CONSTRAINT DF_Orders_ValidTo   DEFAULT '9999-12-31 23:59:59.9999999',
                PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo]);
        ");

        // Enable system versioning with history table
        migrationBuilder.Sql(@"
            ALTER TABLE [Orders]
            SET (SYSTEM_VERSIONING = ON (
                HISTORY_TABLE = [audit].[OrdersHistory],
                DATA_CONSISTENCY_CHECK = ON
            ));
        ");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(@"
            ALTER TABLE [Orders] SET (SYSTEM_VERSIONING = OFF);
            ALTER TABLE [Orders] DROP PERIOD FOR SYSTEM_TIME;
            ALTER TABLE [Orders] DROP COLUMN [ValidFrom];
            ALTER TABLE [Orders] DROP COLUMN [ValidTo];
            DROP TABLE IF EXISTS [audit].[OrdersHistory];
        ");
    }
}
```

> **Warning:** The `Down` migration above drops all history. In production, you'd likely want to retain the history table and simply disable system versioning rather than destroying the data.

---

## Performance Considerations

Temporal tables are not free - understand the trade-offs before enabling them everywhere.

### Write Overhead

Every `UPDATE` or `DELETE` requires SQL Server to write an additional row to the history table. For tables with heavy write throughput (e.g., session tables, event logs), this can be significant.

**Benchmark approach:**

```csharp
// Measure the overhead in your actual workload
var sw = Stopwatch.StartNew();
for (int i = 0; i < 10_000; i++)
{
    var order = await _db.Orders.FindAsync(targetOrderId);
    order!.Status = $"Status_{i}";
    await _db.SaveChangesAsync();
}
sw.Stop();
Console.WriteLine($"10,000 updates: {sw.ElapsedMilliseconds}ms");
```

In typical OLTP scenarios, the overhead is 5–15%. For high-throughput scenarios, consider whether the history granularity you need is worth this cost.

### History Table Growth

History tables can grow very large over time. Strategies to manage this:

**1. Stretch Database / Archiving (SQL Server Enterprise)**

Move old history rows to cold storage automatically.

**2. Manual Archiving with Raw SQL**

```csharp
// Archive and purge history older than 2 years
public async Task ArchiveOldHistoryAsync()
{
    var cutoff = DateTime.UtcNow.AddYears(-2);

    await _db.Database.ExecuteSqlRawAsync(@"
        -- First, move to archive table
        INSERT INTO [audit].[OrdersHistoryArchive]
        SELECT * FROM [audit].[OrdersHistory]
        WHERE [ValidTo] < {0};

        -- Then delete from live history
        -- Note: must disable versioning first to delete from history
        ALTER TABLE [Orders] SET (SYSTEM_VERSIONING = OFF);

        DELETE FROM [audit].[OrdersHistory]
        WHERE [ValidTo] < {0};

        ALTER TABLE [Orders] SET (SYSTEM_VERSIONING = ON (
            HISTORY_TABLE = [audit].[OrdersHistory]
        ));
    ", cutoff);
}
```

**3. Index the History Table**

EF Core creates a clustered index on the period columns in the history table. For point-in-time queries on specific entities, add a non-clustered index:

```sql
-- Add this as a raw SQL migration
CREATE NONCLUSTERED INDEX IX_OrdersHistory_IdValidFrom
ON [audit].[OrdersHistory] ([Id], [ValidFrom] DESC);
```

### Read Performance

`TemporalAll()` and `TemporalBetween()` scan the history table. For audit dashboards with large history tables, always filter aggressively and use the right indexes.

---

## Common Pitfalls and How to Avoid Them

### Pitfall 1: Scaffolding Temporal Tables in Reverse Engineering

If you're using `dotnet ef dbcontext scaffold` on an existing temporal database, EF Core may not correctly infer the temporal configuration. Always verify the scaffolded `DbContext` and add `IsTemporal()` configuration manually if needed.

### Pitfall 2: Soft Deletes and Temporal Tables

If your entity uses a soft delete pattern (an `IsDeleted` flag), temporal tables still track those flag changes. This means "deleted" rows are still in the main table, just with `IsDeleted = true` - and every time someone queries history, they'll need to account for this. Consider whether you need both mechanisms, or whether temporal hard-deletes alone are sufficient for your compliance requirements.

### Pitfall 3: Bulk Operations Bypass EF Core (and Still Work with Temporal)

```csharp
// This bypasses EF Core's change tracking but STILL works with temporal tables
// because temporal is enforced at the SQL Server level
await _db.Database.ExecuteSqlRawAsync(
    "UPDATE Orders SET Status = 'Archived' WHERE CreatedAt < {0}",
    DateTime.UtcNow.AddYears(-1));
// ✅ SQL Server still records history for every row updated above
```

However, if you use a third-party bulk library that directly calls `SqlBulkCopy`, be aware it bypasses triggers but NOT temporal tables - temporal is at the engine level.

### Pitfall 4: EF Core Migrations on Temporal Tables Require Care

When adding a new column to a temporal table, EF Core must also add it to the history table. EF Core handles this automatically in migrations, but if you've ever manually altered the history table, the migration will fail. **Never modify the history table schema directly.**

### Pitfall 5: Forgetting UTC

Temporal table timestamps are always UTC. If your application uses local time, conversions can cause subtle bugs in historical queries:

```csharp
// ❌ Wrong - using local time
var asOf = DateTime.Now.AddDays(-1);

// ✅ Correct - always use UTC
var asOf = DateTime.UtcNow.AddDays(-1);

var snapshot = await _db.Orders
    .TemporalAsOf(asOf)
    .FirstOrDefaultAsync(o => o.Id == orderId);
```

---

## When NOT to Use Temporal Tables

Temporal tables are powerful, but they're not always the right tool:

- **High-frequency write tables** (e.g., real-time telemetry, session state): The write overhead and history growth will be a problem. Use a dedicated time-series database or event store instead.
- **PII / GDPR sensitivity**: Temporal tables make it *harder* to delete data - the history table retains old versions. If you need to support "right to be forgotten" requests, you'll need a custom deletion process that disables versioning, purges history, and re-enables it. This is operationally complex.
- **Tables with BLOBs or large `NVARCHAR(MAX)` columns**: Every update copies the entire row to history, including large fields. This can make the history table grow extremely fast.
- **Cross-database consistency requirements**: Temporal timestamps are per-database. If a business transaction spans multiple databases, the temporal records will have slightly different timestamps, making cross-database point-in-time reconstruction unreliable.

---

## Summary

SQL Server temporal tables, exposed through Entity Framework Core's `IsTemporal()` API, give you a production-grade audit trail with minimal application code. Here's what we covered:

1. **The problem** temporal tables solve: complete, tamper-evident data history without custom audit code
2. **How SQL Server manages history** at the engine level using period columns and atomic row moves
3. **EF Core configuration** including separate audit schemas, explicit period column names, and proper DbContext setup
4. **Real-world CRUD** - normal EF Core operations, no changes required
5. **Five temporal query operators**: `TemporalAll`, `TemporalAsOf`, `TemporalBetween`, `TemporalFromTo`, `TemporalContainedIn`
6. **Production migration strategies** for enabling temporal on existing tables safely
7. **Performance trade-offs** including write overhead, history table growth, and indexing
8. **Common pitfalls**: UTC timestamps, soft deletes, manual schema changes, and GDPR implications

The key takeaway: for compliance-sensitive domains like finance, healthcare, and e-commerce, temporal tables are one of the highest-value, lowest-effort features you can add to a .NET application. The auditing happens whether your developers remember to do it or not.

That's all from me today.

---
