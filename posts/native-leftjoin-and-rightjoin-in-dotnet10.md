---
title: "Native LeftJoin and RightJoin LINQ Operators in .NET 10 - Finally!"
subtitle: "EF Core 10 Brings True LeftJoin & RightJoin Support - Clean LINQ, Better SQL"
date: "November 18 2025"
category: "Entity Framework"
readTime: "Read Time: 6 minutes"
meta_description: "EF Core 10 finally adds native LeftJoin and RightJoin LINQ operators. Learn how they work and see real-world examples using orders, shipments, employee directories, and workstation assignments."
---

<!--START-->
This issue is made possible thanks to **[ZZZ Projects](https://zzzprojects.com/?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday)**, who help keep this newsletter free for everyone. A huge shout-out to them for their support of our community.
EF Core too slow? Insert data 14x faster and cut saving time by 94%.
[👉 Boost performance with Bulk Insert](https://entityframework-extensions.net/bulk-insert?utm_source=stefandjokic&utm_medium=linkedin&utm_campaign=birthday)

## The “simple” join that was never simple  

Every .NET dev who’s touched a relational database knows LEFT JOIN and RIGHT JOIN. 
But in LINQ, writing a proper left join has always felt… heavier than it should.
 
Instead of something obvious like LeftJoin, we’ve been chaining GroupJoin, SelectMany, and DefaultIfEmpty in exactly the right order, hoping the next developer remembers the pattern and doesn’t “optimize” it into an inner join.
With **.NET 10** (LTS, supported until November 2028) and **EF Core 10**, we finally get **first-class LeftJoin and RightJoin operators** in LINQ. 

These operators read like SQL, translate to proper LEFT JOIN / RIGHT JOIN, and remove a ton of boilerplate.
 
In this article:
 
- Why were LeftJoin and RightJoin added
- How they map to EF Core queries and SQL
- Real-world examples you’ll actually use in production 
- Subtle details & limitations you should know before migrating

## Before EF Core 10: Left joins were always a ceremony 

Let’s remind ourselves what EF Core used to require for a left join:

```csharp
var query =
    from a in A
    join b in B on a.Id equals b.AId into g
    from b in g.DefaultIfEmpty()
    select new { a, b };
```

Or the even uglier method-syntax variant.
This syntax works, but:
- It’s noisy
- It’s easy to break
- juniors constantly forget DefaultIfEmpty()
- It doesn't resemble SQL at all 

## What EF Core 10 adds

You now have:
```csharp
LeftJoin()
RightJoin()
```
Supported by LINQ-to-Entities, meaning EF Core properly translates them to:
- LEFT JOIN 
- RIGHT JOIN
…with clean, readable, intention-revealing syntax.

## Real-World Example #1 (LeftJoin)    

Orders + Latest Shipment Tracking

*“Show all orders and the date of their most recent shipment, even if the order hasn’t been shipped yet.”*

This is a real scenario from e-commerce, logistics, and supply-chain systems.
 
Entities:

```csharp
public class Order
{
    public Guid Id          { get; set; }
    public string Customer  { get; set; } = default!;
    public DateTime Created { get; set; }
}

public class Shipment
{
    public Guid Id        { get; set; }
    public Guid OrderId   { get; set; }
    public DateTime Sent  { get; set; }
}
```
EF Core 10 LeftJoin Query
We first compute a “latest shipment per order”:  

```csharp
var latestShipments = db.Shipments
    .GroupBy(s => s.OrderId)
    .Select(g => new
    {
        OrderId = g.Key,
        LastShipment = g.Max(x => x.Sent)
    });
```

Then we join orders with (optional) shipment info:
 
```csharp
var query = db.Orders
    .LeftJoin(
        latestShipments,
        order => order.Id,
        shipment => shipment.OrderId,
        (order, shipment) => new
        {
            order.Id,
            order.Customer,
            order.Created,
            LastShipment = shipment?.LastShipment
        }
    )
    .OrderByDescending(x => x.Created);
```

Why this example matters
- It’s a real-world ecommerce/logistics use case.
- It shows a typical “latest entry per group” pattern.
- It leverages grouping + left join in a clean, readable way

## Real-World Example #2 (RightJoin)  

Employee Directory + Optional Workstation Assignment
*“Show all workstations and who is assigned to them, including empty workstations.”*
This is extremely common in:
 
- office management
- manufacturing floors
- call centers
- corporate IT asset management

Entities:

```csharp
public class Workstation
{
    public int Id          { get; set; }
    public string Location { get; set; } = default!;
}

public class Employee
{
    public Guid Id        { get; set; }
    public string Name    { get; set; } = default!;
    public int? StationId { get; set; }
}
```

EF Core 10 RightJoin Query

```csharp
var query = db.Employees
    .RightJoin(
        db.Workstations,
        emp => emp.StationId,
        ws  => ws.Id,
        (emp, ws) => new
        {
            WorkstationId = ws.Id,
            ws.Location,
            EmployeeName = emp?.Name
        }
    )
    .OrderBy(x => x.WorkstationId);
```

Why this example matters
 
- RightJoin makes sense here because the right table (workstations) is the primary dataset.
- It reflects real organizational data flows.
- It shows how to handle optional assignments cleanly.

## What about LINQ query syntax?

If you’re hoping for a new C# keyword like:

```csharp
from p in Products
left join r in Reviews on p.Id equals r.ProductId
select ...
```
…that’s not what shipped in .NET 10.
As of .NET 10 / C# 14, LeftJoin and RightJoin are **extension methods** only on IQueryable<T> / IEnumerable<T>. There are **no new query-expression keywords** for left/right joins, and the existing join in query syntax still behaves the same way as before (inner join, plus the old group join + DefaultIfEmpty pattern for left joins).
So you effectively have two options:
1. Stick to method syntax for joins

This is the “happy path” for EF Core 10 and the one the team clearly optimized for:

```csharp
var query = db.Orders
    .LeftJoin(
        db.Shipments,
        order    => order.Id,
        shipment => shipment.OrderId,
        (order, shipment) => new { order, shipment }
    );
```
This gives you a clear intention and first-class translation to SQL LEFT JOIN / RIGHT JOIN. 

2. Use query syntax around method calls (if you really want)

You can technically wrap a method-based join inside a query expression:

```csharp
var query =
    from x in db.Orders.LeftJoin(
        db.Shipments,
        o => o.Id,
        s => s.OrderId,
        (o, s) => new { o, s })
    where x.o.Created >= cutoff
    select new { x.o.Id, x.s?.Sent };
```
But this is really just query syntax “around” the method chain. You’re not getting new query operators - you’re still using the LeftJoin extension method under the hood.

In practice, most teams that adopt LeftJoin / RightJoin will:

- Keep query syntax for simple from / where / select queries.
- Use method syntax (with the new join operators) whenever an outer join is involved.

That’s also the most readable compromise in code reviews.

## Gotchas and best practices

LeftJoin and RightJoin look simple, but there are a few things worth keeping in mind when you start using them in real EF Core 10 codebases.

### 1. Always treat one side as nullable
By definition:
- LeftJoin → the right side is nullable.
- RightJoin → the left side is nullable.
Make that explicit in your projections and avoid accidental NullReferenceExceptions:
```csharp
var result = db.Orders
    .LeftJoin(
        latestShipments,
        o  => o.Id,
        ls => ls.OrderId,
        (o, ls) => new
        {
            o.Id,
            LastShipment = ls?.LastShipment,
            ShipmentLabel = ls != null
                ? $"Shipped at {ls.LastShipment:g}"
                : "Not shipped yet"
        }
    );
```

This pattern makes intent obvious and avoids the temptation to treat the joined entity as non-null.
### 2. Keep projections small and focused
Just because you can return entire entities on both sides doesn’t mean you should.
 
Prefer projecting **exactly what you need**:
- Smaller SQL result sets
- Less data materialization
- Faster queries and less memory pressure

```csharp
select new OrderSummaryDto
{
    Id           = o.Id,
    Customer     = o.Customer,
    LastShipment = ls?.LastShipment
};
```

This is especially important when you join large tables (orders, events, logs, telemetry, etc.).

### 3. Index your join keys
LeftJoin/RightJoin don’t magically optimize the database - they still compile to regular SQL joins. The usual relational rule still applies:
Join keys must be indexed if you care about performance.
Typical examples:
- FK columns: Shipments.OrderId, Reviews.ProductId, JobExecution.JobId
- Business keys used in joins: ClientId, ExternalId, BankReference
Without indexes, large outer joins will happily turn into table scans.

## Wrapping Up 

.NET 10 and EF Core 10 are a big release - complex types, improved JSON support, named query filters, better ExecuteUpdate, and more.

But for everyday data access, **LeftJoin and RightJoin quietly fix one of the most annoying gaps in LINQ:**
 
- No more GroupJoin + SelectMany + DefaultIfEmpty rituals
- Queries that **look like** LEFT JOIN / RIGHT JOIN
- Cleaner, more maintainable EF Core code that you can safely hand to juniors
If you have codebases full of hand-rolled left joins:
 
- Start by refactoring the ugliest ones into LeftJoin
- Wire them into real features - dashboards, reports, export pipelines
- Use this as a teaching moment for your team: *“This is how we express joins in EF Core 10 from now on.”*
 
And because this is an LTS release, you can confidently adopt these operators in production and enjoy them for years.

That's all from me for today. 
<!--END-->
