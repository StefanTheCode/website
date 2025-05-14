---
title: "Speed Up Your EF Core Apps with Entity Framework Extensions - preview"
subtitle: "If you're using Entity Framework Core (EF Core), you've probably hit some performance walls when trying to insert or update a large number of records."
readTime: "Read Time: 5 minutes"
date: "May 12 2025"
category: "Entity Framework"
photoUrl: "/images/blog/newsletter21.png"
category: "APIs"
meta_description: "EF Extensions is a commercial library developed by ZZZ Projects that supercharges Entity Framework (both EF Core and EF6) by adding true bulk operation capabilities. "
---

<!--START-->
##### Startups can’t afford to lose users over broken features. With TestSprite’s fully autonomous AI testing, you can catch issues early with less effort from your QA team—and greater accuracy. Ship faster, smarter, and with confidence. Try it now at [testsprite.com](testsprite.com).
&nbsp;
##### [Join here](testsprite.com)

&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  
##### In the world of modern .NET applications, performance matters more than ever. Whether you're working on a SaaS product, a data processing pipeline, or a high-traffic web app, how quickly and efficiently your application interacts with the database can be a game-changer. 
&nbsp;  

##### If you're using Entity Framework Core (EF Core), you've probably hit some performance walls when trying to insert or update a large number of records.
&nbsp;  

##### Let’s be honest - EF Core is great for most use cases. It offers an elegant abstraction over SQL, integrates beautifully with LINQ, and keeps your code clean. 
&nbsp;  

##### But when it comes to bulk operations, EF Core begins to struggle. It was never designed for high-volume scenarios.
&nbsp;  

##### That’s where [Entity Framework Extensions (EF Extensions)](https://entityframework-extensions.net/) steps in. 
&nbsp;  

##### It fills the gaps left by EF Core and gives your application the power to perform thousands - even millions - of operations in seconds. 
&nbsp;  

##### In this article, we’ll explore why EF Extensions is more than just a faster alternative, and how it helps you build scalable, high-performing .NET apps without compromising on code quality or maintainability.

&nbsp;  
&nbsp;  
### Understanding EF Core’s Limitations
&nbsp;  
&nbsp;  
##### To understand why EF Extensions is such a game-changer, we first need to look at what EF Core does - and doesn’t do - well.
&nbsp;  

##### EF Core is fantastic for writing readable, maintainable data access code. 
&nbsp;  

##### However, when you start pushing it with large datasets, it quickly reveals some limitations:
&nbsp;  
##### **• EF6: SaveChanges() isn’t built for speed.** It sends one SQL command per entity. If you're inserting 10,000 records, that's 10,000 round-trips. Alotugh, this has been changed in EF Core.
##### **• Change tracking adds overhead.** EF Core tries to track every entity you insert, which consumes memory and slows down performance.
##### **• Bulk insert, update, and delete support is limited.** Until EF Core 8, there was no built-in way to update or delete records in bulk - and even now, it's still fairly basic.
&nbsp;  

##### So, if you're dealing with anything more than a few hundred records, you’re either writing raw SQL (which can get messy) or looking for alternatives.

&nbsp;  
&nbsp;  
### Enter EF Extensions: A Turbocharger for Your Data Layer
&nbsp;  
&nbsp;  

##### EF Extensions is a commercial library developed by [ZZZ Projects](https://zzzprojects.com/) that supercharges Entity Framework (both EF Core and EF6) by adding true bulk operation capabilities. 
&nbsp;  

##### And the best part? 
&nbsp;  

##### It integrates directly into your existing DbContext, so you don’t need to overhaul your architecture.
&nbsp;  

##### With EF Extensions, you get methods like:
&nbsp;  

##### • BulkInsert
##### • BulkUpdate
##### • BulkDelete
##### • BulkMerge (a.k.a. UPSERT)
##### • BulkSaveChanges
&nbsp;  

##### These aren’t just slightly faster alternatives - they are **orders of magnitude faster** than EF Core's native operations. 
&nbsp;  

##### Behind the scenes, they leverage techniques like SqlBulkCopy, optimized SQL generation, and batch execution, all while keeping your code clean and familiar.


&nbsp;  
&nbsp;  
### Real-World Example: Inserting 100,000 Records
&nbsp;  
&nbsp;  

##### Let’s say you’re importing a CSV file with 100,000 new customers. If you use EF Core:

```csharp

foreach (var customer in customers)
{
    context.Customers.Add(customer);
}
await context.SaveChangesAsync();
```
&nbsp;  

##### You’ll likely wait several minutes for the operation to complete. The database gets overwhelmed with thousands of small inserts, and your application’s memory usage will spike due to EF’s change tracking.
&nbsp;  

##### Now compare that to EF Extensions [(Try this example online)](https://dotnetfiddle.net/rohWxy):

```csharp

// 100+ options to customize your saves

// Insert only customers that don't exist with a custom key
context.BulkInsert(customers, options => {
    options.InsertIfNotExists = true;
    options.ColumnPrimaryKeyExpression = customer => customer.Code;
});

// Merge (Upsert) with related child entities (Order, OrderItem)
context.BulkMerge(orders, options => {
    options.IncludeGraph = true;
});
```

&nbsp;  

##### The entire operation is completed in seconds. EF Extensions batches your inserts, disables unnecessary tracking, and reduces round-trips to the database.
&nbsp;  

##### That’s a huge win - not just in performance, but in developer sanity.
&nbsp;  
##### Check the [benchmarks online](https://dotnetfiddle.net/cFWgKV).
&nbsp;  
&nbsp;  
### Advanced Features That Save Development Time
&nbsp;  
&nbsp;  

##### EF Extensions isn’t just about making things faster. It also makes complex scenarios easier.
&nbsp;  

#### [Bulk Updates Without the Noise](https://entityframework-extensions.net/bulk-update)
&nbsp;  

##### Want to deactivate 50,000 customers who haven’t logged in for a year? 
&nbsp;  

##### No need to fetch them first or loop through them:

```csharp

await context.BulkUpdate(inactiveCustomers);
```
&nbsp;  
##### Check the [benchmarks online](https://dotnetfiddle.net/ope4nq).
&nbsp;  

#### [Bulk Merge (UPSERT)](https://entityframework-extensions.net/bulk-merge)
&nbsp;  

##### Synchronizing data from an external API? 
##### EF Extensions can merge existing records and insert new ones in a single call:

```csharp

await context.BulkMerge(products);
```
&nbsp;  

##### No need to write complicated logic to check if each record exists — EF Extensions handles it.
&nbsp;  

#### [BulkDelete With Zero Fuss](https://entityframework-extensions.net/bulk-delete)
&nbsp;  

##### Cleaning up logs or expired sessions?

```csharp

await context.BulkDelete(expiredLogs);
```
&nbsp;  

##### No loading into memory, no loops, just clean and efficient SQL.
&nbsp;  
##### Check the [benchmarks online](https://dotnetfiddle.net/zzMQgZ).
&nbsp;  

##### I have tested it in my test API, these are result: 
&nbsp;  

##### • Insert operations are up to 13x faster, cutting execution time by 91%
##### • Update operations see a 5x speed boost, with 80% less time spent
##### • Delete operations perform 3x faster, reducing processing time by 67%
&nbsp;  
##### You can check their [online benchmarks](https://dotnetfiddle.net/Authors/63783/ZZZ%20Projects).
&nbsp;  
##### Whether you're working with large datasets or optimizing API response times, bulk extensions can make a huge difference.

&nbsp;  
&nbsp;  
### Potential Real Production Use Cases
&nbsp;  
&nbsp;  

##### Thousands of companies use EF Extensions in real systems every day. Here are a few real-world examples:
&nbsp;  

##### • E-commerce platforms use it to import thousands of new products each night.
##### • CRM systems use BulkUpdate to tag customer segments in campaigns.
##### • Financial apps use BulkMerge to sync daily transaction feeds.
##### • Analytics dashboards use it to insert millions of rows from event data streams.
&nbsp;  

##### If your application touches large amounts of data regularly, EF Extensions can save you hours of development and runtime.

&nbsp;  
&nbsp;  
### Safety and Transactions
&nbsp;  
&nbsp;  

##### EF Extensions supports [transactions](https://entityframework-extensions.net/transaction), so you can wrap multiple operations in a single transaction block just like you would with EF Core:

```csharp
var transaction = context.Database.BeginTransaction();
try
{
    context.BulkSaveChanges();
    transaction.Commit();
}
catch
{
    transaction.Rollback();
}
```
&nbsp;  

##### This makes it ideal for financial systems, audit trails, and other mission-critical workflows where consistency is key.

&nbsp;  
&nbsp;  
### Best Practices and Tips
&nbsp;  
&nbsp; 

##### • Use bulk operations in **batches** of 1,000–10,000 records depending on your DB capacity
##### • Disable AutoMapOutputDirection if you don’t need EF to map generated IDs back
##### • Use IncludeGraph for inserting related entities like orders and line items
##### • Don’t mix SaveChanges() and bulk operations in the same transaction unless you understand the implications
&nbsp; 

##### And most importantly, test with your actual datasets - you’ll likely be blown away by the performance gain.
&nbsp;  
&nbsp;  
### Wrapping Up
&nbsp;  
&nbsp;  

##### EF Core is a great tool for day-to-day database work, but when you need to move serious data, it needs help. Entity Framework Extensions gives you that help - and then some. 
&nbsp;  

##### It’s fast, safe, customizable, and built by people who understand what it takes to scale .NET applications.
&nbsp;  

##### If you find yourself writing raw SQL or fighting performance bottlenecks in EF Core, give EF Extensions a try. You might never go back.
&nbsp;  

##### Learn more: [https://entityframework-extensions.net](https://entityframework-extensions.net)
&nbsp;  

##### That's all from me today. 
&nbsp;  
 
##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->