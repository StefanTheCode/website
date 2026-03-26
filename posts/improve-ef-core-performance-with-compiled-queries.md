---
title: "Improve EF Core Performance with Compiled Queries"
subtitle: "Compiled queries in .NET emerged as a response to the performance challenges faced in data retrieval operations, particularly in applications using ORMs like Entity Framework. "
date: "Nov 20 2023"
category: "Entity Framework"
readTime: "Read Time: 2 minutes"
meta_description: "Unlock the secrets to enhancing Entity Framework Core performance with Stefan Đokić's guide on compiled queries. Learn to optimize database interactions in .NET applications by utilizing compiled queries for faster execution and efficient resource use. Ideal for developers seeking to refine EF Core operations and achieve superior performance in data-intensive .NET environments."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• If you have ever used Postman to debug and write tests for your REST APIs, guess what, those are the same concepts you need to know for <a href="https://blog.postman.com/testing-grpc-apis-with-postman/" style="color: #a5b4fc; text-decoration: underline;">writing tests for your gRPC requests in Postman</a>. For more info about gRPC, they created a great beginner article <a href="https://blog.postman.com/what-is-grpc/" style="color: #a5b4fc; text-decoration: underline;">here</a>.</p>
<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">**• Struggling with slow EF Core performance?** Unlock up to 14x faster operations and cut execution time by 94% with <a href="https://entityframework-extensions.net/" style="color: #a5b4fc; text-decoration: underline;">high-performance library for EF Core</a>.  Seamlessly enhance your app with Bulk Insert, Update, Delete, and Merge—fully integrated into your existing EF Core workflows. Trusted by 5,000+ developers since 2014. Ready to boost your performance? **<a href="https://entityframework-extensions.net/" style="color: #a5b4fc; text-decoration: underline;">Explore the solution</a>**</p>
<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;"><hr style='background-color: #fff'></p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## The background
**Compiled queries in .NET** emerged as a response to the performance challenges faced in data retrieval operations, particularly in applications using ORMs like Entity Framework.
Before the introduction of compiled queries, every data retrieval operation required the ORM to translate LINQ queries into SQL queries, a process that was both time-consuming and resource-intensive.
This translation had to be done every time a query was executed, significantly impacting performance, especially in applications with high database interaction.
Let's dive in...

## How To Create Compiled Queries

Let's say we have a Domain class that represents a data model:
![User Domain Class](/images/blog/posts/improve-ef-core-performance-with-compiled-queries/user-domain-class.png)
How can we construct a basic query to retrieve a User using its Id?
Very simple...
![Getting User By Id](/images/blog/posts/improve-ef-core-performance-with-compiled-queries/getting-user-by-id.png)
Now, how do we convert this query into a Complied Query?
![Compiled Query](/images/blog/posts/improve-ef-core-performance-with-compiled-queries/compiled-query.png)

What we have done here?
**• GetUser field**: This is a static field of type Func< AppDbContext, int, User>. It's a compiled query using Entity Framework's EF.CompileQuery method.
**• GetUser Method**: his is a public instance method that takes an int id as a parameter. It uses the static GetUser field (the compiled query) to retrieve a User object from the database. It does so by passing this (the current instance of AppDbContext) and the provided id to the compiled query.
And now we can just call the method created within the our context:
![Using Compiled Query](/images/blog/posts/improve-ef-core-performance-with-compiled-queries/using-compiled-query.png)

## Why to use Compiled Queries?

### Improved Performance
The primary advantage is faster execution time, as the query translation from LINQ to SQL is done only once and reused, which is particularly beneficial for queries executed frequently.
### Efficient Resource Utilization
Since the query is compiled once and cached, it reduces CPU usage and resource consumption associated with the query compilation process.
### Automatic Caching
EF Core automatically compiles and caches the most common queries, reducing the need for manual intervention and simplifying development.

## When <span style='color: red'>Not</span> to use Compiled Queries?

### Highly Dynamic Queries
Avoid them if your queries change frequently or are dynamically constructed based on various conditions.
### Infrequently Executed Queries
Not necessary for queries executed rarely, as the performance benefit may be negligible.
### Limited Resource Environments
If memory usage is a concern, be cautious with the number of compiled queries.


For additional EF Core performance strategies, see [4 EF Core Tips to Improve Performance](https://thecodeman.net/posts/4-entity-framework-tips-to-improve-performances) and [Pre-Optimized EF Core Query Techniques](https://thecodeman.net/posts/preoptimized-ef-query-techniques-5-steps-to-success).

## Wrapping Up
Compiled queries in EF Core are a powerful feature for optimizing database access in specific scenarios. They are most beneficial for improving performance in scenarios with repetitive and frequent database queries. However, their use should be balanced against the potential drawbacks, such as increased memory usage and complexity, especially in applications with dynamic query patterns or limited resources.
That's all from me for today.

## dream BIG!

<!--END-->
