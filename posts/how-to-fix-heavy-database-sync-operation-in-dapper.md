---
title: "How I fixed a heavy database sync operation with Dapper Plus"
subtitle: "Dapper Plus is not just a faster Dapper - it’s a higher-level abstraction that makes bulk workflows simpler to write, easier to read and hugely more efficient"
readTime: "Read Time: 6 minutes"
date: "August 06 2025"
category: "Entity Framework"
meta_description: "Dapper Plus is not just a faster Dapper - it’s a higher-level abstraction that makes bulk workflows simpler to write, easier to read and hugely more efficient"
---

<!--START-->
&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  
##### When I had to sync thousands of complex orders with nested items from an external ERP system, my classic Dapper solution hit a wall.
&nbsp;  

##### • Insert/update 500+ orders
##### •  Replace 10,000+ associated items
##### • Run every hour via background job
&nbsp;  

##### The result? 40+ seconds of runtime and massive CPU load.
&nbsp;  

##### That’s when I switched to [Dapper Plus](https://dapper-plus.net/?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday) - and dropped execution time to just under 2 seconds.
&nbsp;  

##### This article gives you everything: a real problem, working .NET 9 code, full schema, and in-depth explanations so you can learn how to use Dapper Plus effectively and confidently.

&nbsp;  
&nbsp;  
### Why Does Dapper Slow Down in Bulk Write Scenarios?
&nbsp;  
&nbsp; 

##### Dapper excels at micro-ORM read operations. But when you need to perform thousands of inserts, updates, or deletes, the number of round-trips to the database becomes a major bottleneck.
&nbsp; 

##### **❌ The Classic Pain:**
##### • One INSERT per row = 10,000+ DB calls
##### • No batching by default
##### • Requires manual upsert logic
##### • Complicated transactions when mixing operations
&nbsp; 

##### The bigger your data, the worse the performance.
&nbsp; 

##### **✅ The Dapper Plus Fix:**
##### • Uses SqlBulkCopy under the hood
##### • Handles INSERT, UPDATE, DELETE, MERGE in bulk
##### • Supports entity mappings, partial updates, conditions
##### • Works with SQL Server, PostgreSQL, MySQL, Oracle, SQLite

&nbsp;  
&nbsp;  
###  My Real Scenario: Order Sync with Items
&nbsp;  
&nbsp;  

##### We get a CSV export or ERP API payload every hour with updated order data. Each order has:
&nbsp;  

##### •  Customer info
##### • Status (Pending, Processed, Shipped...)
##### • A collection of order items
&nbsp;  

##### We want to:
&nbsp;  

##### 1. Upsert each order (insert if not exists, update if exists)
##### 2. Replace associated items (delete old, insert new)
##### The classic Dapper version worked - but barely. It ran for 20+ seconds on 500 orders and ~10,000 items.
&nbsp;  

##### Let’s dive into the structure.

&nbsp;  
&nbsp;  
### SQL Schema (Two Tables)
&nbsp;  
&nbsp;  

##### Here’s the table definition we use to model the orders and their related items. This structure is a common one found in many systems.

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
##### Why OrderItems Has Its Own Primary Key?
&nbsp;  
##### Dapper Plus requires a primary key for operations like BulkUpdate, BulkMerge, and BulkDelete. That’s why we don’t just rely on (OrderId, Product).

&nbsp;  
&nbsp;  
### Models in C# (.NET 9)
&nbsp;  
&nbsp;  

##### These are our strongly typed C# models for orders and order items.

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

&nbsp;  
&nbsp;  
### Generate Test Data
&nbsp;  
&nbsp;  

##### To simulate a real sync, we generate 500 orders with 20 items each (total 10,000 rows).

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
##### This creates the data we'll use for both benchmarking and testing Dapper vs Dapper Plus.

&nbsp;  
&nbsp;  
### The Classic Dapper Sync - Old approach we used
&nbsp;  
&nbsp;  

##### Let’s look at what a naive Dapper implementation might look like:

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

##### Why It’s Slow:
&nbsp;  
##### • 500 Orders = 500 UPSERTs
##### • 10,000 Items = 10,000 INSERTs + 500 DELETEs
##### • That’s 11,000+ round-trips
##### • SQL Server can't batch or pipeline those
&nbsp;  

##### Time: ~20s

&nbsp;  
&nbsp;  
### The Dapper Plus Solution
&nbsp;  
&nbsp;  

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

##### Why It’s Better:
&nbsp;  

##### • Only 3 round-trips to DB
##### • Uses SqlBulkCopy under the hood
##### • Merge is smarter and faster than manual update/insert
##### • Fully transactional
##### • Much easier to read
&nbsp;  

##### Time: ~1.5s
&nbsp;  

##### Dapper Plus leverages:
&nbsp;  

##### • **SqlBulkCopy** for inserts (fastest possible way to insert thousands of rows into SQL Server)
##### • **MERGE/UPDATE/INSERT batching** for updates
##### • **Compiled expression trees** for mappings
##### • **Smart column matching** and **key detection** via config or reflection
&nbsp;  
##### It reduces network I/O, CPU overhead, and ADO.NET complexity behind the scenes.
&nbsp;  

##### Dapper Plus is not just a faster Dapper - it’s a higher-level abstraction that makes bulk workflows:
&nbsp;  

##### • Simpler to write
##### • Easier to read
##### • Hugely more efficient
&nbsp;  
&nbsp;  
### Extra Dapper Plus Features You’ll Love
&nbsp;  
&nbsp;  

#### Column Filtering
&nbsp;  

##### Sometimes you don’t want to update the entire row - just one or two fields (like status flags or timestamps). Instead of updating all columns, you can tell Dapper Plus exactly which ones to include, reducing locking and improving write efficiency.

```csharp

await connection.BulkUpdateAsync(orders, opts =>
    opts.ColumnInputExpression = x => new { x.Status });
```
&nbsp;  

#### Batch Size Control
&nbsp;  

##### When inserting or updating large numbers of rows, you may want to limit how many records are sent per round-trip to the database. This avoids timeouts or memory pressure in constrained environments.

```csharp

await connection.BulkInsertAsync(orders, opts => opts.BatchSize = 500);
```
&nbsp;  

#### Audit Logging
&nbsp;  

##### Need to track which entities are being processed? Dapper Plus gives you hooks like BeforeBulkAction and AfterBulkAction, so you can log or modify behavior dynamically.

```csharp

DapperPlusManager.Entity<Order>().BeforeBulkAction = (e, t) =>
    Console.WriteLine($"{t} - {((Order)e).Id}");
```
&nbsp;  

#### Composite Keys
&nbsp;  

##### If your table doesn’t use a single primary key but rather a combination of fields (e.g., TenantId + Code), Dapper Plus lets you configure composite keys so it knows how to identify rows during merge and delete operations.

```csharp

DapperPlusManager.Entity<YourType>().Key(x => new { x.TenantId, x.Code });
```
&nbsp;  

#### Async Everything
&nbsp;  

##### All Dapper Plus methods - BulkInsertAsync, BulkUpdateAsync, BulkDeleteAsync, 
##### BulkMergeAsync - support asynchronous operations, letting you integrate smoothly with modern .NET async workflows for high scalability. All operations support full async variants.


&nbsp;  
&nbsp;  
### Wrapping Up
&nbsp;  
&nbsp;  

##### Bulk data operations are a reality in most serious applications - from importing data and syncing systems to cleaning up large datasets. 
&nbsp;  

##### While Dapper gives you raw performance and control, it quickly becomes inefficient and verbose when you move beyond a few hundred records.
&nbsp;  

##### That’s where [Dapper Plus](https://dapper-plus.net/?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday) shines. It keeps everything familiar and low-friction for Dapper users, but gives you:
&nbsp;  

##### • Enterprise-grade performance with bulk operations
##### • Clean and maintainable code
##### • Built-in support for transactions, batching, selective updates, and much more
&nbsp;  

##### If your application handles thousands of inserts, updates, or deletes - Dapper Plus will save you time, headaches, and infrastructure costs.
&nbsp;  

##### 👉 Whether you're syncing ERP data, importing CSVs, or cleaning stale records, Dapper Plus is the upgrade you didn’t know you needed.
&nbsp;  

##### [Check online examples here](https://dapper-plus.net/online-examples?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday).
&nbsp;  

##### That's all from me today. 

&nbsp;  
 
##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->