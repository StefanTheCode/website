---
title: "Improve EF Core Performance with Compiled Queries"
subtitle: "Compiled queries in .NET emerged as a response to the performance challenges faced in data retrieval operations, particularly in applications using ORMs like Entity Framework. "
date: "Nov 20 2023"
category: "Entity Framework"
readTime: "Read Time: 2 minutes"
meta_description: "Unlock the secrets to enhancing Entity Framework Core performance with Stefan Đokić's guide on compiled queries. Learn to optimize database interactions in .NET applications by utilizing compiled queries for faster execution and efficient resource use. Ideal for developers seeking to refine EF Core operations and achieve superior performance in data-intensive .NET environments."
---

&nbsp;  
##### <b>Many thanks to the sponsors who make it possible for this newsletter to be free for readers.</b>
&nbsp;  
##### • If you have ever used Postman to debug and write tests for your REST APIs, guess what, those are the same concepts you need to know for [writing tests for your gRPC requests in Postman](https://blog.postman.com/testing-grpc-apis-with-postman/). For more info about gRPC, they created a great beginner article [here](https://blog.postman.com/what-is-grpc/).  
&nbsp;  
##### **• Struggling with slow EF Core performance?**
##### Unlock up to 14x faster operations and cut execution time by 94% with [high-performance library for EF Core](https://entityframework-extensions.net/).  Seamlessly enhance your app with Bulk Insert, Update, Delete, and Merge—fully integrated into your existing EF Core workflows.
##### Trusted by 5,000+ developers since 2014. Ready to boost your performance? **[Explore the solution](https://entityframework-extensions.net/)**

&nbsp;
<hr style='background-color: #fff'>
&nbsp;

### The background
&nbsp;
&nbsp;
##### <b>Compiled queries in .NET</b> emerged as a response to the performance challenges faced in data retrieval operations, particularly in applications using ORMs like Entity Framework.
&nbsp;
##### Before the introduction of compiled queries, every data retrieval operation required the ORM to translate LINQ queries into SQL queries, a process that was both time-consuming and resource-intensive.
&nbsp;
##### This translation had to be done every time a query was executed, significantly impacting performance, especially in applications with high database interaction.
&nbsp;
##### Let's dive in...

&nbsp;
&nbsp;
### How To Create Compiled Queries
&nbsp;
&nbsp;

##### Let's say we have a Domain class that represents a data model:
![User Domain Class](/images/blog/posts/improve-ef-core-performance-with-compiled-queries/user-domain-class.png)
&nbsp;
##### How can we construct a basic query to retrieve a User using its Id?
&nbsp;
##### Very simple...
![Getting User By Id](/images/blog/posts/improve-ef-core-performance-with-compiled-queries/getting-user-by-id.png)
&nbsp;
##### Now, how do we convert this query into a Complied Query?
![Compiled Query](/images/blog/posts/improve-ef-core-performance-with-compiled-queries/compiled-query.png)
&nbsp;

##### What we have done here?
&nbsp;
##### <b>• GetUser field</b>: This is a static field of type Func< AppDbContext, int, User>. It's a compiled query using Entity Framework's EF.CompileQuery method.
&nbsp;
##### <b>• GetUser Method</b>: his is a public instance method that takes an int id as a parameter. It uses the static GetUser field (the compiled query) to retrieve a User object from the database. It does so by passing this (the current instance of AppDbContext) and the provided id to the compiled query.
&nbsp;
##### And now we can just call the method created within the our context:
![Using Compiled Query](/images/blog/posts/improve-ef-core-performance-with-compiled-queries/using-compiled-query.png)

&nbsp;
&nbsp;
### Why to use Compiled Queries?
&nbsp;
&nbsp;

####  <b>Improved Performance</b> 
&nbsp;
##### The primary advantage is faster execution time, as the query translation from LINQ to SQL is done only once and reused, which is particularly beneficial for queries executed frequently.
&nbsp;
####  <b>Efficient Resource Utilization</b> 
&nbsp;
##### Since the query is compiled once and cached, it reduces CPU usage and resource consumption associated with the query compilation process.
&nbsp;
####  <b>Automatic Caching</b> 
&nbsp;
##### EF Core automatically compiles and caches the most common queries, reducing the need for manual intervention and simplifying development.


&nbsp;
&nbsp;
### When <span style='color: red'>Not</span> to use Compiled Queries?
&nbsp;
&nbsp;

####  <b>Highly Dynamic Queries</b> 
&nbsp;
##### Avoid them if your queries change frequently or are dynamically constructed based on various conditions.
&nbsp;
####  <b>Infrequently Executed Queries</b> 
&nbsp;
##### Not necessary for queries executed rarely, as the performance benefit may be negligible.
&nbsp;
####  <b>Limited Resource Environments</b> 
&nbsp;
##### If memory usage is a concern, be cautious with the number of compiled queries.


&nbsp;
&nbsp;
### Conclusion
&nbsp;
&nbsp;
##### Compiled queries in EF Core are a powerful feature for optimizing database access in specific scenarios. They are most beneficial for improving performance in scenarios with repetitive and frequent database queries. However, their use should be balanced against the potential drawbacks, such as increased memory usage and complexity, especially in applications with dynamic query patterns or limited resources.
&nbsp;
##### That's all from me for today.
&nbsp;

## <b > dream BIG! </b>