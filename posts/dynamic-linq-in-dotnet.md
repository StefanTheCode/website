---
title: "Dynamic LINQ that still executes as real LINQ"
subtitle: "Stop redeploying for every new filter - Dynamic LINQ that still executes as real LINQ..."
date: "October 18 2025"
category: "Entity Framework"
meta_description: "Learn when to use AddDbContext (scoped), AddDbContextFactory, and AddDbContextPool in EF Core. See production-ready patterns for web requests, background jobs, and singletons—plus thread-safety gotchas and code you can paste into your .NET app."
---

<!--START-->
&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  

##### You know the drill: a simple search endpoint ships… then comes the Slack ping:
&nbsp;  

##### - *“Can we also filter by status? *
##### - *By last logon? *
##### - *Sort by any column? *
##### - *Let Marketing save segments?”*
&nbsp;  

##### Your nice LINQ turns into an if-forest, and every tweak means a redeploy.
&nbsp;  
 
##### This issue is a practical deep-dive into **dynamic predicates** that still execute as real LINQ (so EF Core translates them to SQL). 
&nbsp;  

##### We’ll cover when to use them, how they work, the **handful of methods you’ll actually need**, and guardrails to keep things safe.  


&nbsp;  
&nbsp;  
### Why dynamic predicates?
&nbsp;  
&nbsp;  

##### **Unbounded filters:** Admin UIs, report builders, saved searches - users mix fields/ops you can’t predict at compile time.

##### **Tenant variability:** White-label apps where each customer wants slightly different rules.
##### **Keep EF perf:** The library parses your string into a lambda and calls the **real LINQ method** (Where, OrderBy, …) on IQueryable; EF still pushes work to SQL.
&nbsp;  
 
##### If your filters are **user-defined, tenant-defined, or frequently changing**, dynamic LINQ turns constant code churn into simple rule updates.

&nbsp;  
&nbsp;  
### How it works (quick mental model)?
&nbsp;  
&nbsp;  

##### With [C# Eval Expression](https://eval-expression.net/?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday), you supply an expression as a string and call a Dynamic extension: [WhereDynamic](https://eval-expression.net/linq-dynamic#linq-wheredynamic-method?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday), [OrderByDynamic](https://eval-expression.net/linq-dynamic#linq-orderbydynamic-method?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday), [SelectDynamic](https://eval-expression.net/linq-dynamic#linq-selectdynamic-method?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday), [FirstOrDefaultDynamic](https://eval-expression.net/linq-dynamic#linq-firstordefaultdynamic-method?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday), etc. 
&nbsp;  

##### Under the hood, it parses to an expression tree and invokes the actual LINQ operator. It works for IEnumerable<T> and IQueryable<T> (including EF Core).  
&nbsp;  
##### You can write either:
##### **• Body-only form:**

```csharp

 x => x.Status == 0 && x.LastLogon >= DateTime.Now.AddMonths(-1)"
```
&nbsp;  

##### **• Full-lambda form:** 

```csharp

x => x.Status == 0 && x.LastLogon >= DateTime.Now.AddMonths(-1) 
```

&nbsp;  
&nbsp;  
###  The 80/20 you’ll actually use
&nbsp;  
&nbsp;  

##### We’ll stay focused on the handful you’ll reach for daily:
&nbsp;  

##### • WhereDynamic - dynamic filtering
##### • OrderByDynamic / ThenByDynamic - dynamic sorting
##### • SelectDynamic - dynamic projection
##### • FirstOrDefaultDynamic - dynamic singular retrieval
&nbsp;  

##### I’ll show before → after where it helps, plus tips that keep the code clean.
&nbsp;  

##### **Why:** Singletons must not capture scoped DbContext; creating a fresh one per call avoids threading and lifetime bugs. 

&nbsp;  
&nbsp;  
### WhereDynamic: dynamic filtering (the workhorse)  
&nbsp;  
&nbsp;  

##### **Before:** branch explosion

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

##### **After:** a single dynamic predicate  

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

##### **Why this is better:** one pipeline, no duplicated queries, and you can keep adding optional criteria without touching the query shape. This is the exact scenario the docs lead with, including both **body-only** and **full-lambda** styles.
&nbsp;  

#### Passing variables instead of literals
&nbsp;  

##### You don’t have to inject literal values into the string. Pass a context object (anonymous type/dictionary/expando/class) and reference its members by name inside the expression:

```csharp

var env = new {
    IsActive = CustomerStatus.IsActive,
    LastMonth = DateTime.Now.AddMonths(-1)
};

var recentActive = await context.Customers
    .WhereDynamic(x => "x.Status == IsActive && x.LastLogon >= LastMonth", env)
    .ToListAsync();
```
&nbsp;  
&nbsp;  
### OrderByDynamic (+ ThenByDynamic): dynamic sorting  
&nbsp;  
&nbsp;  

##### Let the user choose the sort column and direction at runtime (from a whitelist). 
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

##### The method catalog includes OrderByDynamic and ThenByDynamic (and their descending variants). These are designed specifically for the “user picks column” scenario.  

&nbsp;  
&nbsp;  
### SelectDynamic: shape the payload dynamically  
&nbsp;  
&nbsp;  

##### For export/report screens or slim API payloads, project only what the client asked for:  
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
##### The catalog lists SelectDynamic as a first-class operator; EF still handles translation.   

&nbsp;  
&nbsp;  
### FirstOrDefaultDynamic: quick “find one” rules  
&nbsp;  
&nbsp;  

##### Perfect for “open this result” or validation checks based on runtime criteria: 
```csharp

var one = await context.Customers
    .FirstOrDefaultDynamic("x => x.Email == \\\"stefan@thecodeman.net\\\" && x.Status == 0");
```

##### This method is documented alongside the rest of the Dynamic operators and called out by name in the reference.   

&nbsp;  
&nbsp;  
### Bonus: Execute<T> for chained dynamic pipelines (use sparingly)  
&nbsp;  
&nbsp;  

##### If you truly need to run several LINQ steps in a single dynamic string (filter → order → select → ToList), there’s an Execute<T> API:  
```csharp

var env = new { IsActive = CustomerStatus.IsActive, LastMonth = DateTime.Now.AddMonths(-1) };

var result = context.Customers.Execute<IEnumerable>(
    "Where(x => x.Status == IsActive && x.LastLogon >= LastMonth)" +
    ".Select(x => new { x.CustomerID, x.Name })" +
    ".OrderBy(x => x.CustomerID).ToList()", env);
```
##### This is the “escape hatch” - powerful, but I prefer *Dynamic methods for readability and composition. 

&nbsp;  
&nbsp;  
### Real-world patterns you can ship this week
&nbsp;  
&nbsp;  

##### **1. Admin "Query Builder"**
##### • UI emits: field + operator + value
##### • Backend maps allowed fields/ops → builds WhereDynamic (and optional OrderByDynamic)
##### **• Outcome:** one query pipeline, virtually endless combinations, no branch explosion
&nbsp;  

##### **2. Marketing "Segment Builder"**
##### • Segments saved as readable expressions (e.g., “Active, DACH, (last 90 days OR ≥ €500), opted-in, not test accounts”)
##### • App loads rule → WhereDynamic → persists results
##### **• Outcome:** rules evolve without touching code or redeploying
&nbsp;  

##### **3. Multi-tenant rules**
##### • Each tenant stores a few predicates (or basic allow/deny filters)
##### • Compose them at request time and apply dynamically
##### **• Outcome:** fewer forks/flags, cleaner release model

&nbsp;  
&nbsp;  
### Read this
&nbsp;  
&nbsp;

##### **Whitelist fields/operators:** Don’t expose your whole model; map UI → allow-list.
&nbsp;

##### **Validate expressions:** Reject unknown tokens/fields before execution.
&nbsp;

##### **Stay on IQueryable until the end**. Apply dynamic ops before ToList() so EF can translate them to SQL. 
&nbsp;

##### **Normalize values:** Use ISO dates or pass parameters (env object) rather than free-text parsing.
&nbsp;

##### **Snapshot test saved rules:** Load → run → assert counts/shapes for critical segments.
&nbsp;

##### **Keep it readable:** Prefer small, composable strings; centralize building helpers.
&nbsp;

#### When not to use it
&nbsp;

##### If you’ve got 2-3 fixed filters that rarely change, static LINQ stays the simplest (and perfectly fine). Dynamic shines as variability and optionality grow.

&nbsp;  
&nbsp;  
### Conclusion 
&nbsp;  
&nbsp;  

##### Dynamic LINQ isn’t about being clever - it’s about removing friction between what users want to filter and what developers have to ship. 
&nbsp;  

##### When rules live in the UI/DB and compile into **real LINQ** under the hood, you trade if-forests and redeploys for a single, clean pipeline that scales with your product’s complexity. 
&nbsp;  

##### Admin dashboards, reporting, saved segments, multi-tenant tweaks - these become configuration problems, not engineering sprints.
&nbsp;  
 
##### If your filters are **user-defined, tenant-defined, or constantly changing**, WhereDynamic, OrderByDynamic, SelectDynamic, and FirstOrDefaultDynamic give you the 80/20 you need: **clean code, runtime flexibility, and EF-level performance**. 
&nbsp;  

##### Add a safe allow-list, validate input, keep everything on IQueryable until materialization, and you’ll have a solution that’s both powerful and predictable.
&nbsp;  
 
##### If the thought “I’m shipping features, not rewriting queries” resonates, this is the way forward.
&nbsp;  

##### Deep dive and runnable examples:
&nbsp;  

##### • [My First LINQ Dynamic](https://eval-expression.net/my-first-linq-dynamic?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday)
##### • [C# Eval Expression](https://eval-expression.net/?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday)
&nbsp;  

##### That's all from me for today. 
<!--END-->
