---
title: "How I fixed a heavy database sync operation with Dapper Plus"
subtitle: "Dapper Plus is not just a faster Dapper - it’s a higher-level abstraction that makes bulk workflows simpler to write, easier to read and hugely more efficient"
date: "August 06 2025"
category: "Entity Framework"
readTime: "Read Time: 6 minutes"
meta_description: "Dapper Plus is not just a faster Dapper - it’s a higher-level abstraction that makes bulk workflows simpler to write, easier to read and hugely more efficient"
---

<!--START-->
## Background
When I had to sync thousands of complex orders with nested items from an external ERP system, my classic Dapper solution hit a wall.

- Insert/update 500+ orders
-  Replace 10,000+ associated items
- Run every hour via background job

The result? 40+ seconds of runtime and massive CPU load.

That’s when I switched to [Dapper Plus](https://dapper-plus.net/?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday) - and dropped execution time to just under 2 seconds.

This article gives you everything: a real problem, working .NET 9 code, full schema, and in-depth explanations so you can learn how to use [Dapper Plus](https://thecodeman.net/posts/building-high-performance-import-feature-with-dapper-plus) effectively and confidently.

## Why Does Dapper Slow Down in Bulk Write Scenarios?

Dapper excels at micro-ORM read operations. But when you need to perform thousands of inserts, updates, or deletes, the number of round-trips to the database becomes a major bottleneck.

- ❌ The Classic Pain:
- One INSERT per row = 10,000+ DB calls
- No batching by default
- Requires manual upsert logic
- Complicated transactions when mixing operations

The bigger your data, the worse the performance.

- ✅ The Dapper Plus Fix:
- Uses SqlBulkCopy under the hood
- Handles INSERT, UPDATE, DELETE, MERGE in bulk
- Supports entity mappings, partial updates, conditions
- Works with SQL Server, [PostgreSQL](https://thecodeman.net/posts/debug-and-test-multi-environment-postgres), MySQL, Oracle, SQLite

##  My Real Scenario: Order Sync with Items

We get a CSV export or ERP API payload every hour with updated order data. Each order has:

-  Customer info
- Status (Pending, Processed, Shipped...)
- A collection of order items

We want to:

1. Upsert each order (insert if not exists, update if exists)
2. Replace associated items (delete old, insert new)
The classic Dapper version worked - but barely. It ran for 20+ seconds on 500 orders and ~10,000 items.

Let’s dive into the structure.

## SQL Schema (Two Tables)

Here’s the table definition we use to model the orders and their related items. This structure is a common one found in many systems.

```sql
CREATE TABLE Orders (
Id INT PRIMARY KEY,
Customer NVARCHAR(100),
Status NVARCHAR(50),
TotalAmount DECIMAL(18,2),
CreatedAt DATETIME2
);

CREATE TABLE OrderItems (
Id INT PRIMARY KEY,
OrderId INT FOREIGN KEY REFERENCES Orders(Id),
Product NVARCHAR(100),
Quantity INT,
Price DECIMAL(18,2)
);
```
Why OrderItems Has Its Own Primary Key?
Dapper Plus requires a primary key for operations like BulkUpdate, BulkMerge, and BulkDelete. That’s why we don’t just rely on (OrderId, Product).

## Models in C# (.NET 9)

These are our strongly typed C# models for orders and order items.

```csharp
public class Order
{
    public int Id { get; set; }
    public string Customer { get; set; } = default!;
    public string Status { get; set; } = default!;
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<OrderItem> Items { get; set; } = new();
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public string Product { get; set; } = default!;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}
```

## Generate Test Data

To simulate a real sync, we generate 500 orders with 20 items each (total 10,000 rows).

```csharp
List<Order> GenerateOrders(int count)
{
    var rng = new Random();
    var orders = new List<Order>();

    for (int i = 1; i <= count; i++)
    {
        var order = new Order
        {
            Id = i,
            Customer = $"Customer {i}",
            Status = "Pending",
            CreatedAt = DateTime.UtcNow,
            Items = new List<OrderItem>()
        };

        int itemsCount = rng.Next(1, 5);
        for (int j = 1; j <= itemsCount; j++)
        {
            order.Items.Add(new OrderItem
            {
                Id = i * 10 + j, // unique ID across orders
                Product = $"Product {j}",
                Quantity = rng.Next(1, 10),
                Price = rng.Next(10, 100)
            });
        }

        orders.Add(order);
    }

    return orders;
}
```
This creates the data we'll use for both [benchmarking](https://thecodeman.net/posts/benchmarking-in-dotnet-step-by-step) and testing Dapper vs Dapper Plus.

## The Classic Dapper Sync - Old approach we used

Let’s look at what a naive Dapper implementation might look like:

```csharp
public async Task SyncOrdersWithClassicDapperAsync(List<Order> orders)
{
    foreach (var order in orders)
    {
        // Recalculate total before insert
        order.TotalAmount = order.Items.Sum(x => x.Price * x.Quantity);

        // Try UPDATE Order first
        var rowsAffected = await _connection.ExecuteAsync(
            @"
UPDATE Orders
SET Customer = @Customer,
Status = @Status,
TotalAmount = @TotalAmount,
CreatedAt = @CreatedAt
WHERE Id = @Id", order);

        // If not updated, INSERT Order
        if (rowsAffected == 0)
        {
            await _connection.ExecuteAsync(
                @"
INSERT INTO Orders (Id, Customer, Status, TotalAmount, CreatedAt)
VALUES (@Id, @Customer, @Status, @TotalAmount, @CreatedAt)", order);
        }

        // Delete existing OrderItems (optional if recreating)
        await _connection.ExecuteAsync(
            "DELETE FROM OrderItems WHERE OrderId = @OrderId",
            new { OrderId = order.Id });

        // Set OrderId and insert new items
        foreach (var item in order.Items)
        {
            item.OrderId = order.Id;

            await _connection.ExecuteAsync(
                @"
INSERT INTO OrderItems (Id, OrderId, Product, Quantity, Price)
VALUES (@Id, @OrderId, @Product, @Quantity, @Price)", item);
        }
    }
}
```

Why It’s Slow:
- 500 Orders = 500 UPSERTs
- 10,000 Items = 10,000 INSERTs + 500 DELETEs
- That’s 11,000+ round-trips
- SQL Server can't batch or pipeline those

Time: ~20s

## The Dapper Plus Solution

```csharp
public async Task SyncOrdersWithDapperPlusAsync(List<Order> orders)
{
    DapperPlusManager.Entity<Order>().Table("Orders");
    DapperPlusManager.Entity<OrderItem>().Table("OrderItems");

    using var transaction = _connection.BeginTransaction();
    foreach (var order in orders)
    {
        order.TotalAmount = order.Items.Sum(x => x.Price * x.Quantity);

        foreach (var item in order.Items)
        {
            item.OrderId = order.Id; // Make sure FK is set
        }
    }

    // Build all OrderItems (flattened)
    var allItems = orders.SelectMany(o => o.Items).ToList();

    // Build dummy OrderItems just to delete by OrderId
    var itemsToDelete = orders.Select(o => new OrderItem { OrderId = o.Id }).ToList();

    // Delete old OrderItems (must match key + FK mapping in config)
    await transaction.BulkDeleteAsync(itemsToDelete);

    // Insert new OrderItems
    await transaction.BulkInsertAsync(allItems);

    // Merge Orders
    await transaction.BulkMergeAsync(orders);

    transaction.Commit();
}
```

Why It’s Better:

- Only 3 round-trips to DB
- Uses SqlBulkCopy under the hood
- Merge is smarter and faster than manual update/insert
- Fully transactional
- Much easier to read

Time: ~1.5s

Dapper Plus leverages:

- **SqlBulkCopy** for inserts (fastest possible way to insert thousands of rows into SQL Server)
- **MERGE/UPDATE/INSERT batching** for updates
- **Compiled expression trees** for mappings
- **Smart column matching** and **key detection** via config or reflection
It reduces network I/O, CPU overhead, and ADO.NET complexity behind the scenes.

Dapper Plus is not just a faster Dapper - it’s a higher-level abstraction that makes bulk workflows:

- Simpler to write
- Easier to read
- Hugely more efficient
## Extra Dapper Plus Features You’ll Love

### Column Filtering

Sometimes you don’t want to update the entire row - just one or two fields (like status flags or timestamps). Instead of updating all columns, you can tell Dapper Plus exactly which ones to include, reducing locking and improving write efficiency.

```csharp
await connection.BulkUpdateAsync(orders, opts =>
    opts.ColumnInputExpression = x => new { x.Status });
```

### Batch Size Control

When inserting or updating large numbers of rows, you may want to limit how many records are sent per round-trip to the database. This avoids timeouts or memory pressure in constrained environments.

```csharp
await connection.BulkInsertAsync(orders, opts => opts.BatchSize = 500);
```

### Audit Logging

Need to track which entities are being processed? Dapper Plus gives you hooks like BeforeBulkAction and AfterBulkAction, so you can log or modify behavior dynamically.

```csharp
DapperPlusManager.Entity<Order>().BeforeBulkAction = (e, t) =>
    Console.WriteLine($"{t} - {((Order)e).Id}");
```

### Composite Keys

If your table doesn’t use a single primary key but rather a combination of fields (e.g., TenantId + Code), Dapper Plus lets you configure composite keys so it knows how to identify rows during merge and delete operations.

```csharp
DapperPlusManager.Entity<YourType>().Key(x => new { x.TenantId, x.Code });
```

### Async Everything

All Dapper Plus methods - BulkInsertAsync, BulkUpdateAsync, BulkDeleteAsync, 
BulkMergeAsync - support asynchronous operations, letting you integrate smoothly with modern .NET async workflows for high scalability. All operations support full async variants.

## Wrapping Up

Bulk data operations are a reality in most serious applications - from importing data and syncing systems to cleaning up large datasets. 

While Dapper gives you raw performance and control, it quickly becomes inefficient and verbose when you move beyond a few hundred records.

That’s where [Dapper Plus](https://dapper-plus.net/?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday) shines. It keeps everything familiar and low-friction for Dapper users, but gives you:

- Enterprise-grade performance with [bulk operations](https://thecodeman.net/posts/speed-up-your-efapps-with-entity-framework-extensions)
- Clean and maintainable code
- Built-in support for transactions, batching, selective updates, and much more

If your application handles thousands of inserts, updates, or deletes - Dapper Plus will save you time, headaches, and infrastructure costs.

- 👉 Whether you're syncing ERP data, importing CSVs, or cleaning stale records, Dapper Plus is the upgrade you didn’t know you needed.

[Check online examples here](https://dapper-plus.net/online-examples?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday).

That's all from me today. 

 
P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->




