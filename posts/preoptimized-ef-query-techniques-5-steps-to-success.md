---
title: "5 EF Core Query Techniques I Use in Every .NET 10 Project"
subtitle: "Most EF Core performance problems aren't discovered - they're written. Here are 5 techniques I apply from day one to avoid slow queries, wasted memory, and N+1 disasters."
date: "Jan 19 2026"
category: "Entity Framework"
readTime: "Read Time: 10 minutes"
meta_description: "Learn 5 EF Core query optimization techniques for .NET 10: projections, N+1 prevention with Include, AsNoTracking, avoiding cartesian explosions, and AsSplitQuery. Production-ready code examples included."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">Many thanks to the sponsors who make it possible for this newsletter to be free for readers.<br/><br/><a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a></p>
</div>

## The Background

Let's be honest:

Most EF Core performance problems aren't discovered. **They're written.**

Someone puts a database call inside a `foreach` loop. Someone loads an entire entity when they only need two fields. Someone adds `.Include()` on three collections and wonders why the query takes 8 seconds.

I've seen all of these in production. Multiple times. And almost every time, the "optimization" was really just rewriting the query the way it should have been written from the beginning.

That's why I don't think about EF Core performance as something you fix later. I think about it as **5 techniques you apply from day one**.

In this article, I'll walk you through each technique with practical code examples, explain exactly what happens at the SQL level, and show you the patterns I use in every .NET 10 project.

Let's dive in.

## 1. Project Only the Fields You Need

This is the single most impactful change you can make to an EF Core query.

By default, when you call `.ToListAsync()` on a `DbSet`, EF Core generates a `SELECT *` - it loads every column in the table into a fully tracked entity object. If your table has 30 columns but you only need Name and Email for a list view, you're transferring 28 columns of data you'll never use.

Here's what most developers write:

```csharp
// Bad: loads all columns, tracks every entity
var employees = await context.Employees.ToListAsync();
```

Here's what I write instead:

```csharp
// Good: loads only what's needed, no tracking overhead
var employees = await context.Employees
    .Select(e => new EmployeeListDto
    {
        Id = e.Id,
        Name = e.Name,
        Email = e.Email
    })
    .ToListAsync();
```

```csharp
public record EmployeeListDto(int Id, string Name, string Email);
```

What happens at the SQL level:

```sql
-- Bad query
SELECT [e].[Id], [e].[Name], [e].[Email], [e].[Phone], [e].[Address],
       [e].[Department], [e].[Salary], [e].[HireDate], [e].[ManagerId],
       [e].[CreatedAt], [e].[UpdatedAt] ...
FROM [Employees] AS [e]

-- Good query
SELECT [e].[Id], [e].[Name], [e].[Email]
FROM [Employees] AS [e]
```

Why this matters:
<br/>
- **Less data transferred** from database to application - especially critical over network connections
<br/>
- **Lower memory usage** - you're not allocating objects with fields you'll never read
<br/>
- **No change tracking overhead** - projections into DTOs are automatically untracked
<br/>
- **Faster serialization** - smaller objects serialize faster in API responses

**My rule:** if the query is for a read-only operation (list views, search results, reports, API responses), always project into a DTO. Never return the full entity unless you plan to update it.

## 2. Prevent N+1 Queries with Eager Loading

The N+1 problem is the most common EF Core performance killer I've seen in real projects. And it's the sneakiest - because the code looks perfectly normal.

Here's how it happens:

```csharp
// This generates 1 query
var orders = await context.Orders.ToListAsync();

foreach (var order in orders)
{
    // This generates 1 query PER ORDER (N queries)
    foreach (var item in order.Items)
    {
        Console.WriteLine($"{item.ProductName}: {item.Quantity}");
    }
}
```

If you have 100 orders, this code executes **101 SQL queries**. One for the orders, and one for each order's items. This is the N+1 problem.

The fix is eager loading with `.Include()`:

```csharp
// This generates 1 query that joins Orders and OrderItems
var orders = await context.Orders
    .Include(o => o.Items)
    .ToListAsync();

foreach (var order in orders)
{
    // No additional queries - items are already loaded
    foreach (var item in order.Items)
    {
        Console.WriteLine($"{item.ProductName}: {item.Quantity}");
    }
}
```

With `.Include()`, EF Core generates a single SQL query with a JOIN. All the data comes back in one round-trip.

For nested relationships, use `.ThenInclude()`:

```csharp
var orders = await context.Orders
    .Include(o => o.Items)
        .ThenInclude(i => i.Product)
    .Include(o => o.Customer)
    .ToListAsync();
```

This loads Orders → Items → Product and Orders → Customer in a single query.

**But wait - there's a catch.** When you `.Include()` multiple collections (not just references), EF Core generates a JOIN that can result in a **cartesian explosion**. I'll cover that in section 4 and tell you exactly when to use `.AsSplitQuery()` instead.

**How to detect N+1 queries in development:**

The easiest way is to enable simple logging in your `DbContext`:

```csharp
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder.LogTo(Console.WriteLine, LogLevel.Information);
}
```

If you see multiple `SELECT` statements firing during what should be a single operation, you have an N+1 problem.

## 3. Use AsNoTracking for Read-Only Queries

Every time you query entities through EF Core, the DbContext **tracks** them. It creates a snapshot of every property value so it can detect changes when you call `SaveChangesAsync()`.

This tracking is essential for updates. But for read-only queries? It's pure waste.

Here's the difference:

```csharp
// With tracking (default) - EF Core creates internal snapshots
var products = await context.Products.ToListAsync();

// Without tracking - no snapshots, no overhead
var products = await context.Products
    .AsNoTracking()
    .ToListAsync();
```

The performance difference is significant. In benchmarks with 10,000 entities:
<br/>
- **With tracking:** ~120ms query time, ~40MB memory allocated for snapshots
<br/>
- **Without tracking:** ~70ms query time, ~15MB memory allocated

That's roughly **40% faster** and **60% less memory** - for free.

**When to use `AsNoTracking()`:**
<br/>
- API endpoints that return data (GET requests)
<br/>
- List views, search results, reports
<br/>
- Background jobs that read data for processing
<br/>
- Any query where you won't call `SaveChangesAsync()` on those entities

**When NOT to use it:**
<br/>
- When you need to update or delete the entities
<br/>
- When you need identity resolution (same entity referenced multiple times in the query result)

**Pro tip:** If your entire application is read-heavy (like most APIs), you can set `AsNoTracking` as the default behavior:

```csharp
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
}
```

Now all queries are untracked by default. When you need tracking for an update, explicitly opt in:

```csharp
var product = await context.Products
    .AsTracking()
    .FirstOrDefaultAsync(p => p.Id == id);
```

This is the pattern I use in every project. Default to no tracking, opt in when needed. It eliminates an entire category of performance waste.

**Even better - combine it with projections:**

If you're already projecting into a DTO (technique #1), `AsNoTracking()` is applied automatically. EF Core doesn't track projected results. So this:

```csharp
var products = await context.Products
    .Select(p => new ProductDto(p.Id, p.Name, p.Price))
    .ToListAsync();
```

...is already untracked. No need to add `.AsNoTracking()` explicitly. But I still add it when querying full entities for clarity.

## 4. Understand and Avoid Cartesian Explosions

This is the technique that most developers don't know about until they hit it in production - and by then the query is already taking 30 seconds.

A **cartesian explosion** happens when you `.Include()` multiple collections on the same entity. EF Core generates a single SQL query with multiple JOINs, and the result set grows multiplicatively.

Here's a concrete example:

```csharp
// This can cause a cartesian explosion
var authors = await context.Authors
    .Include(a => a.Books)
    .Include(a => a.Awards)
    .ToListAsync();
```

If an author has 10 books and 5 awards, the SQL result set for that author contains **50 rows** (10 x 5). With 100 authors, you could be looking at **thousands of duplicate rows** - even though you only have a few hundred actual records.

The generated SQL looks like this:

```sql
SELECT [a].[Id], [a].[Name],
       [b].[Id], [b].[Title],
       [w].[Id], [w].[AwardName]
FROM [Authors] AS [a]
LEFT JOIN [Books] AS [b] ON [a].[Id] = [b].[AuthorId]
LEFT JOIN [Awards] AS [w] ON [a].[Id] = [w].[AuthorId]
```

Every combination of every book with every award for each author produces a row. The data transferred explodes. Memory usage spikes. The query crawls.

**How to detect it:** If you notice a query that returns way more rows than expected, or if your API endpoint suddenly gets slow after adding a second `.Include()`, you probably have a cartesian explosion.

**Three ways to fix it:**

**Option 1: Use AsSplitQuery() (most common fix)**

```csharp
var authors = await context.Authors
    .Include(a => a.Books)
    .Include(a => a.Awards)
    .AsSplitQuery()
    .ToListAsync();
```

Instead of one massive JOIN query, EF Core generates separate SQL queries:

```sql
-- Query 1: Authors
SELECT [a].[Id], [a].[Name] FROM [Authors] AS [a]

-- Query 2: Books
SELECT [b].[Id], [b].[Title], [b].[AuthorId]
FROM [Books] AS [b]
WHERE [b].[AuthorId] IN (SELECT [a].[Id] FROM [Authors] AS [a])

-- Query 3: Awards
SELECT [w].[Id], [w].[AwardName], [w].[AuthorId]
FROM [Awards] AS [w]
WHERE [w].[AuthorId] IN (SELECT [a].[Id] FROM [Authors] AS [a])
```

No cartesian product. Each query returns only the data it needs. EF Core stitches the results together in memory.

**Option 2: Use projections to avoid the Include entirely**

```csharp
var authors = await context.Authors
    .Select(a => new AuthorDetailDto
    {
        Id = a.Id,
        Name = a.Name,
        Books = a.Books.Select(b => new BookDto(b.Id, b.Title)).ToList(),
        Awards = a.Awards.Select(w => new AwardDto(w.Id, w.AwardName)).ToList()
    })
    .ToListAsync();
```

This is often the best solution because you also get the benefits of technique #1 - loading only the fields you need.

**Option 3: Set split queries as the global default**

```csharp
optionsBuilder.UseSqlServer(connectionString, options =>
{
    options.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
});
```

With this, all queries with multiple `.Include()` calls automatically use split behavior. You can opt out for specific queries with `.AsSingleQuery()`.

**My recommendation:** I use **split queries as the global default** and override with `.AsSingleQuery()` only when I know the collections are small and a single round-trip is more efficient. This protects you from accidental cartesian explosions.

## 5. Use AsSplitQuery() Strategically

Since I covered `AsSplitQuery()` above as a fix for cartesian explosions, let me go deeper on **when to use it and when not to**.

`AsSplitQuery()` splits a multi-Include query into separate SQL statements. This is great for avoiding data duplication - but it comes with trade-offs.

**When AsSplitQuery() helps:**
<br/>
- Multiple collection navigations (`.Include(x => x.Collection1).Include(x => x.Collection2)`)
<br/>
- Large datasets where the cartesian product would be massive
<br/>
- Queries where the JOIN version produces a slow execution plan

**When AsSplitQuery() hurts:**
<br/>
- Single collection Include (no cartesian risk)
<br/>
- High-latency database connections where round-trips are expensive
<br/>
- Scenarios requiring data consistency (split queries can see different data if rows change between queries)

Here's a practical comparison:

```csharp
// Single Include - no cartesian risk, use single query
var orders = await context.Orders
    .Include(o => o.Items)
    .ToListAsync();

// Multiple Includes - cartesian risk, use split query
var orders = await context.Orders
    .Include(o => o.Items)
    .Include(o => o.Payments)
    .Include(o => o.ShippingHistory)
    .AsSplitQuery()
    .ToListAsync();
```

**The rule I follow:** one collection Include = single query. Two or more collection Includes = split query.

For reference Includes (navigation to a single entity), there's no cartesian risk:

```csharp
// This is fine without AsSplitQuery - Customer is a reference, not a collection
var orders = await context.Orders
    .Include(o => o.Customer)
    .Include(o => o.Items)
    .ToListAsync();
```

Reference Includes don't multiply rows - they're just LEFT JOINs that add columns. It's only **collection** Includes that create the cartesian multiplication.

## Putting It All Together

Here's what a typical query looks like in my projects when I apply all 5 techniques:

```csharp
public async Task<List<OrderSummaryDto>> GetOrderSummaries(
    int customerId,
    CancellationToken cancellationToken)
{
    return await context.Orders
        .AsNoTracking()                              // Technique 3: no tracking for reads
        .Where(o => o.CustomerId == customerId)
        .Include(o => o.Items)
        .Include(o => o.Payments)
        .AsSplitQuery()                              // Technique 5: prevent cartesian explosion
        .Select(o => new OrderSummaryDto              // Technique 1: project only needed fields
        {
            OrderId = o.Id,
            OrderDate = o.CreatedAt,
            TotalAmount = o.Items.Sum(i => i.Price * i.Quantity),
            ItemCount = o.Items.Count,
            IsPaid = o.Payments.Any(p => p.Status == PaymentStatus.Completed)
        })
        .OrderByDescending(o => o.OrderDate)
        .ToListAsync(cancellationToken);              // Technique 2: no N+1 - everything in one call
}
```

This query:
<br/>
- Loads only the fields needed for the summary view
<br/>
- Has no change tracking overhead
<br/>
- Prevents cartesian explosion with split queries
<br/>
- Executes in a minimal number of database round-trips
<br/>
- Passes `CancellationToken` for proper request cancellation

This is the pattern I start with for every read query. It's not premature optimization - it's writing the query correctly from day one.

## Common Mistakes I Still See in Code Reviews

After reviewing EF Core code across many projects, these are the patterns that consistently cause problems:
<br/>
- **Loading full entities for list views** - if your endpoint returns a list of 50 items, you don't need all 30 columns per entity
<br/>
- **Missing `.Include()` for lazy-loaded navigation properties** - EF Core doesn't lazy-load by default, so accessing `order.Items` without an Include returns null or an empty collection, leading to silent bugs
<br/>
- **Using `.ToList()` before `.Where()`** - this loads the entire table into memory and filters in C# instead of SQL
<br/>
- **Calling `.Count()` when you need `.Any()`** - `COUNT(*)` scans the whole result set while `EXISTS` stops at the first match
<br/>
- **Forgetting `AsNoTracking` in API controllers** - every GET endpoint is a read-only operation, yet most codebases track every query

## Frequently Asked Questions

### What is the N+1 query problem in EF Core?

The N+1 problem occurs when your code executes one query to load a list of entities, then executes N additional queries to load related data for each entity - usually triggered by accessing a navigation property inside a loop. For example, loading 100 orders and then accessing each order's items generates 101 queries instead of 1. The fix is eager loading with `.Include()`, which generates a single SQL query with a JOIN that loads parents and children together.

### When should I use AsNoTracking in EF Core?

Use `AsNoTracking()` for any query where you won't update or delete the returned entities. This includes API GET endpoints, list views, search results, reports, and background jobs that read data for processing. EF Core's change tracking creates internal snapshots of every tracked entity, which consumes memory and slows down materialization. In benchmarks, `AsNoTracking()` is typically 30-50% faster with 50-60% less memory allocation for large result sets.

### What is a cartesian explosion in Entity Framework Core?

A cartesian explosion happens when a single EF Core query includes multiple collection navigations (e.g., `.Include(x => x.Books).Include(x => x.Awards)`). EF Core generates a SQL query with multiple JOINs, and every combination of child rows produces a row in the result set. If an entity has 10 books and 5 awards, the result contains 50 rows for that one entity. The fix is to use `.AsSplitQuery()`, which generates separate SQL queries for each Include and stitches the results together in memory.

### What is the difference between AsSplitQuery and AsSingleQuery in EF Core?

`AsSingleQuery()` (the default) generates one SQL query with JOINs for all Includes. This is efficient when you only have one collection Include, but causes cartesian explosions with multiple collection Includes. `AsSplitQuery()` generates separate SQL queries for each Include - one for the parent, one for each collection. This avoids data duplication but requires more database round-trips. Use split queries when you have two or more collection Includes. Use single query when you have only reference navigations or one collection Include.

### Should I use projections or Include in EF Core?

Use **projections** (`Select()` into a DTO) when you need a subset of fields for read-only operations like API responses, list views, or reports. Use **Include** when you need the full entity graph for updates or when you need all fields. Projections are almost always the better choice for read paths because they generate more efficient SQL (fewer columns), skip change tracking automatically, and prevent over-fetching. If you're building an API, most of your queries should be projections.

### How do I detect slow EF Core queries in development?

Enable simple logging in your `DbContext` with `optionsBuilder.LogTo(Console.WriteLine, LogLevel.Information)` to see every SQL query in the console. For more advanced analysis, use the `.TagWith()` method to label queries in SQL Profiler or Application Insights. In production, use [EF Core interceptors](https://thecodeman.net/posts/ef-interceptors-in-dotnet) to log queries that exceed a duration threshold. You can also enable sensitive data logging during development with `optionsBuilder.EnableSensitiveDataLogging()` to see parameter values in logged queries.

### Can I set AsNoTracking as the default for all queries?

Yes. In your `DbContext` configuration, add `optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)`. This makes all queries untracked by default. When you need tracking for an update operation, explicitly opt in with `.AsTracking()` on that specific query. This is the pattern I recommend for API-heavy applications where the majority of operations are reads.

## Wrapping Up

EF Core performance is not something you fix after the fact. It's something you build in from day one.

These 5 techniques cover the vast majority of performance problems I've seen in real projects:
<br/>
- Project only the fields you need
<br/>
- Prevent N+1 queries with eager loading
<br/>
- Use `AsNoTracking()` for read-only operations
<br/>
- Understand and avoid cartesian explosions
<br/>
- Use `AsSplitQuery()` strategically for multi-collection Includes

None of this is premature optimization. It's writing correct queries from the start. The difference between a 200ms endpoint and a 5-second endpoint is almost always one of these techniques.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

For more EF Core deep dives, check out [EF Core Compiled Queries](https://thecodeman.net/posts/improve-ef-core-performance-with-compiled-queries), [EF Core Interceptors](https://thecodeman.net/posts/ef-interceptors-in-dotnet), and [4 EF Core Performance Tips](https://thecodeman.net/posts/4-entity-framework-tips-to-improve-performances).

<!--END-->