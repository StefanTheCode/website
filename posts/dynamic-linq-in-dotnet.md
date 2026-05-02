---
title: "Dynamic LINQ that still executes as real LINQ"
subtitle: "Stop redeploying for every new filter - Dynamic LINQ that still executes as real LINQ..."
date: "October 18 2025"
category: "Entity Framework"
readTime: "Read Time: 5 minutes"
meta_description: "Learn when to use AddDbContext (scoped), AddDbContextFactory, and AddDbContextPool in EF Core. See production-ready patterns for web requests, background jobs, and singletons—plus thread-safety gotchas and code you can paste into your .NET app."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored - I write these deep dives in my free time and keep them free for everyone. If your company sells AI tools, dev tools, courses, or services that .NET developers would actually use, sponsoring an issue is the most direct way to reach them.</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>
## Background

You know the drill: a simple search endpoint ships… then comes the Slack ping:

- *“Can we also filter by status? *
- *By last logon? *
- *Sort by any column? *
- *Let Marketing save segments?”*

Your nice LINQ turns into an if-forest, and every tweak means a redeploy.
 
This issue is a practical deep-dive into **dynamic predicates** that still execute as real LINQ (so EF Core translates them to SQL). 

We’ll cover when to use them, how they work, the **handful of methods you’ll actually need**, and guardrails to keep things safe.  

## Why dynamic predicates?

**Unbounded filters:** Admin UIs, report builders, saved searches - users mix fields/ops you can’t predict at compile time.

**Tenant variability:** White-label apps where each customer wants slightly different rules.
**Keep EF perf:** The library parses your string into a lambda and calls the **real LINQ method** (Where, OrderBy, …) on IQueryable; EF still pushes work to SQL.
 
If your filters are **user-defined, tenant-defined, or frequently changing**, dynamic LINQ turns constant code churn into simple rule updates.

## How it works (quick mental model)?

With [C# Eval Expression](https://eval-expression.net/?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday), you supply an expression as a string and call a Dynamic extension: [WhereDynamic](https://eval-expression.net/linq-dynamic#linq-wheredynamic-method?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday), [OrderByDynamic](https://eval-expression.net/linq-dynamic#linq-orderbydynamic-method?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday), [SelectDynamic](https://eval-expression.net/linq-dynamic#linq-selectdynamic-method?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday), [FirstOrDefaultDynamic](https://eval-expression.net/linq-dynamic#linq-firstordefaultdynamic-method?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday), etc. 

Under the hood, it parses to an expression tree and invokes the actual LINQ operator. It works for IEnumerable<T> and IQueryable<T> (including EF Core).  
You can write either:
- Body-only form:

```csharp
 x => x.Status == 0 && x.LastLogon >= DateTime.Now.AddMonths(-1)"
```

**- Full-lambda form:** 

```csharp
x => x.Status == 0 && x.LastLogon >= DateTime.Now.AddMonths(-1) 
```

##  The 80/20 you’ll actually use

We’ll stay focused on the handful you’ll reach for daily:

- WhereDynamic - dynamic filtering
- OrderByDynamic / ThenByDynamic - dynamic sorting
- SelectDynamic - dynamic projection
- FirstOrDefaultDynamic - dynamic singular retrieval

I’ll show before → after where it helps, plus tips that keep the code clean.

**Why:** Singletons must not capture scoped DbContext; creating a fresh one per call avoids threading and lifetime bugs. 

## WhereDynamic: dynamic filtering (the workhorse)  

**Before:** branch explosion

```csharp
var q = context.Customers.AsQueryable();

if (onlyActive)
    q = q.Where(x => x.Status == CustomerStatus.IsActive);

if (since is not null)
    q = q.Where(x => x.LastLogon >= since);

if (!string.IsNullOrWhiteSpace(search))
    q = q.Where(x => x.Name.Contains(search));

var list = await q.OrderBy(x => x.Name).ToListAsync();
```

**After:** a single dynamic predicate  

```csharp
// using System.Linq;
// using Z.Expressions;

string filter = "x => true";

if (onlyActive)
    filter += " && x.Status == 0"; // assuming enum 0 = IsActive

if (since is not null)
    filter += $@" && x.LastLogon >= DateTime.Parse(""{since:yyyy-MM-dd}"")";

if (!string.IsNullOrWhiteSpace(search))
    filter += $@" && x.Name.Contains(""{search}"")";

var list = await context.Customers
    .WhereDynamic(filter)
    .OrderBy(x => x.Name)
    .ToListAsync();
```

**Why this is better:** one pipeline, no duplicated queries, and you can keep adding optional criteria without touching the query shape. This is the exact scenario the docs lead with, including both **body-only** and **full-lambda** styles.

### Passing variables instead of literals

You don’t have to inject literal values into the string. Pass a context object (anonymous type/dictionary/expando/class) and reference its members by name inside the expression:

```csharp
var env = new {
    IsActive = CustomerStatus.IsActive,
    LastMonth = DateTime.Now.AddMonths(-1)
};

var recentActive = await context.Customers
    .WhereDynamic(x => "x.Status == IsActive && x.LastLogon >= LastMonth", env)
    .ToListAsync();
```
## OrderByDynamic (+ ThenByDynamic): dynamic sorting  

Let the user choose the sort column and direction at runtime (from a whitelist). 
```csharp
string sort = sortColumn switch
{
    "Name"        => "x => x.Name",
    "LastLogon"    => "x => x.LastLogon",
    "TotalSpent"    => "x => x.TotalSpent",
    _                   => "x => x.Name"
};

var ordered = await context.Customers
    .OrderByDynamic(sort)
    .ThenByDynamic("x => x.CustomerID")
    .ToListAsync();
```

The method catalog includes OrderByDynamic and ThenByDynamic (and their descending variants). These are designed specifically for the “user picks column” scenario.  

## SelectDynamic: shape the payload dynamically  

For export/report screens or slim API payloads, project only what the client asked for:  
```csharp
// Client picks columns: "CustomerID,Name,Country"
var projections = selectedColumns.Split(',')
    .Select(c => c.Trim())
    .Where(c => allowedCols.Contains(c));

var selectExpr = "x => new { " + string.Join(", ", projections.Select(c => $"{c} = x.{c}")) + " }";

var rows = await context.Customers
    .WhereDynamic("x => x.Status == 0")
    .SelectDynamic(selectExpr)
    .ToListAsync();
```
The catalog lists SelectDynamic as a first-class operator; EF still handles translation.   

## FirstOrDefaultDynamic: quick “find one” rules  

Perfect for “open this result” or validation checks based on runtime criteria: 
```csharp
var one = await context.Customers
    .FirstOrDefaultDynamic("x => x.Email == \\\"stefan@thecodeman.net\\\" && x.Status == 0");
```

This method is documented alongside the rest of the Dynamic operators and called out by name in the reference.   

## Bonus: Execute<T> for chained dynamic pipelines (use sparingly)  

If you truly need to run several LINQ steps in a single dynamic string (filter → order → select → ToList), there’s an Execute<T> API:  
```csharp
var env = new { IsActive = CustomerStatus.IsActive, LastMonth = DateTime.Now.AddMonths(-1) };

var result = context.Customers.Execute<IEnumerable>(
    "Where(x => x.Status == IsActive && x.LastLogon >= LastMonth)" +
    ".Select(x => new { x.CustomerID, x.Name })" +
    ".OrderBy(x => x.CustomerID).ToList()", env);
```
This is the “escape hatch” - powerful, but I prefer *Dynamic methods for readability and composition. 

## Real-world patterns you can ship this week

1. Admin "Query Builder"
- UI emits: field + operator + value
- Backend maps allowed fields/ops → builds WhereDynamic (and optional OrderByDynamic)
**- Outcome:** one query pipeline, virtually endless combinations, no branch explosion

2. Marketing "Segment Builder"
- Segments saved as readable expressions (e.g., “Active, DACH, (last 90 days OR ≥ €500), opted-in, not test accounts”)
- App loads rule → WhereDynamic → persists results
**- Outcome:** rules evolve without touching code or redeploying

3. Multi-tenant rules
- Each tenant stores a few predicates (or basic allow/deny filters)
- Compose them at request time and apply dynamically
**- Outcome:** fewer forks/flags, cleaner release model

## Read this

**Whitelist fields/operators:** Don’t expose your whole model; map UI → allow-list.

**Validate expressions:** Reject unknown tokens/fields before execution.

**Stay on IQueryable until the end**. Apply dynamic ops before ToList() so EF can translate them to SQL. 

**Normalize values:** Use ISO dates or pass parameters (env object) rather than free-text parsing.

**Snapshot test saved rules:** Load → run → assert counts/shapes for critical segments.

**Keep it readable:** Prefer small, composable strings; centralize building helpers.

### When not to use it

If you’ve got 2-3 fixed filters that rarely change, static LINQ stays the simplest (and perfectly fine). Dynamic shines as variability and optionality grow.


For LINQ performance strategies, see [LINQ Performance Optimization](https://thecodeman.net/posts/linq-performance-otpimization-tips-and-tricks) and [PLINQ](https://thecodeman.net/posts/getting-started-with-plinq).

## Wrapping Up 

Dynamic LINQ isn’t about being clever - it’s about removing friction between what users want to filter and what developers have to ship. 

When rules live in the UI/DB and compile into **real LINQ** under the hood, you trade if-forests and redeploys for a single, clean pipeline that scales with your product’s complexity. 

Admin dashboards, reporting, saved segments, multi-tenant tweaks - these become configuration problems, not engineering sprints.
 
If your filters are **user-defined, tenant-defined, or constantly changing**, WhereDynamic, OrderByDynamic, SelectDynamic, and FirstOrDefaultDynamic give you the 80/20 you need: **[clean code](https://thecodeman.net/posts/clean-code-best-practices), runtime flexibility, and EF-level performance**. 

Add a safe allow-list, validate input, keep everything on IQueryable until materialization, and you’ll have a solution that’s both powerful and predictable.
 
If the thought “I’m shipping features, not rewriting queries” resonates, this is the way forward.

Deep dive and runnable examples:

- [My First LINQ Dynamic](https://eval-expression.net/my-first-linq-dynamic?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday)
- [C# Eval Expression](https://eval-expression.net/?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday)

That's all from me for today. 
<!--END-->

