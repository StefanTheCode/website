---
newsletterTitle: "#42 Stefan's Newsletter"
title: "Improve EF Core Performance with Compiled Queries"
subtitle: "Compiled queries in .NET emerged as a response to the performance challenges faced in data retrieval operations, particularly in applications using ORMs like Entity Framework."
date: "Nov 20 2023"
photoUrl: "/images/blog/newsletter21.png"
---

<br>
##### <b>Many thanks to the sponsors who make it possible for this newsletter to be free for readers.</b>
<br>
<br>
##### • If you have ever used Postman to debug and write tests for your REST APIs, guess what, those are the same concepts you need to know for [writing tests for your gRPC requests in Postman](https://blog.postman.com/testing-grpc-apis-with-postman/). For more info about gRPC, they created a great beginner article [here](https://blog.postman.com/what-is-grpc/).  
<br>
<br>
#####• If you’re an existing Java developer who wants to go full stack or pick up another frontend framework, [this book](https://packt.link/EYtrA) is your concise introduction to <b>React</b>. Along the way, you’ll explore modern libraries and tools, such as Gradle, Vite, Vitest, and React Query. For the first time ever, it also covers React development with the in-demand TypeScript.

<br>
<hr style='background-color: #fff'>
<br>

### The background
<br>
<br>
##### <b>Compiled queries in .NET</b> emerged as a response to the performance challenges faced in data retrieval operations, particularly in applications using ORMs like Entity Framework.
<br>
##### Before the introduction of compiled queries, every data retrieval operation required the ORM to translate LINQ queries into SQL queries, a process that was both time-consuming and resource-intensive.
<br>
##### This translation had to be done every time a query was executed, significantly impacting performance, especially in applications with high database interaction.
<br>
##### Let's dive in...

<br>
<br>
### How To Create Compiled Queries
<br>
<br>

##### Let's say we have a Domain class that represents a data model:
![User Domain Class](/images/blog/posts/improve-ef-core-performance-with-compiled-queries/user-domain-class.png)
<br>
##### How can we construct a basic query to retrieve a User using its Id?
<br>
##### Very simple...
![Getting User By Id](/images/blog/posts/improve-ef-core-performance-with-compiled-queries/getting-user-by-id.png)
<br>
##### Now, how do we convert this query into a Complied Query?
![Compiled Query](/images/blog/posts/improve-ef-core-performance-with-compiled-queries/compiled-query.png)
<br>

##### What we have done here?
<br>
##### <b>• GetUser field</b>: This is a static field of type Func< AppDbContext, int, User>. It's a compiled query using Entity Framework's EF.CompileQuery method.
<br>
##### <b>• GetUser Method</b>: his is a public instance method that takes an int id as a parameter. It uses the static GetUser field (the compiled query) to retrieve a User object from the database. It does so by passing this (the current instance of AppDbContext) and the provided id to the compiled query.
<br>
##### And now we can just call the method created within the our context:
![Using Compiled Query](/images/blog/posts/improve-ef-core-performance-with-compiled-queries/using-compiled-query.png)

<br>
<br>
### Why to use Compiled Queries?
<br>
<br>

####  <b>Improved Performance</b> 
<br>
##### The primary advantage is faster execution time, as the query translation from LINQ to SQL is done only once and reused, which is particularly beneficial for queries executed frequently.
<br>
####  <b>Efficient Resource Utilization</b> 
<br>
##### Since the query is compiled once and cached, it reduces CPU usage and resource consumption associated with the query compilation process.
<br>
####  <b>Automatic Caching</b> 
<br>
##### EF Core automatically compiles and caches the most common queries, reducing the need for manual intervention and simplifying development.


<br>
<br>
### When <span style='color: red'>Not</span> to use Compiled Queries?
<br>
<br>

####  <b>Highly Dynamic Queries</b> 
<br>
##### Avoid them if your queries change frequently or are dynamically constructed based on various conditions.
<br>
####  <b>Infrequently Executed Queries</b> 
<br>
##### Not necessary for queries executed rarely, as the performance benefit may be negligible.
<br>
####  <b>Limited Resource Environments</b> 
<br>
##### If memory usage is a concern, be cautious with the number of compiled queries.


<br>
<br>
### Conclusion
<br>
<br>
##### Compiled queries in EF Core are a powerful feature for optimizing database access in specific scenarios. They are most beneficial for improving performance in scenarios with repetitive and frequent database queries. However, their use should be balanced against the potential drawbacks, such as increased memory usage and complexity, especially in applications with dynamic query patterns or limited resources.
<br>
##### That's all from me for today.
<br>

## <b > dream BIG! </b>