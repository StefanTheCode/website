---
title: "Pre-Optimized EF Query Techniques 5 Steps to Success"
subtitle: "How to optimize the EF Core queries? Write them properly the first time. We often hear about optimizing a piece of code, or a query, and it mostly refers to refactoring code that wasn't written well from the beginning."
readTime: "Read Time: 4 minutes"
date: "Dec 04 2023"
category: "Entity Framework"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Dive into advanced Entity Framework Core query optimization techniques with Stefan Đokić's informative blog post. Discover five essential steps for efficient EF Core queries, including avoiding common pitfalls like N+1 queries and Cartesian explosions, and leveraging performance-enhancing methods like AsNoTracking and AsSplitQuery. Perfect for .NET developers aiming to elevate their database interaction skills."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • If you have ever used **Postman** to debug and write tests for your REST APIs, guess what, those are the same concepts you need to know for ** [writing tests for your gRPC requests in Postman](https://blog.postman.com/testing-grpc-apis-with-postman/) **. For more info about gRPC, they created a great beginner article ** [here](https://blog.postman.com/what-is-grpc/)**.
&nbsp;   
##### **• Struggling with slow EF Core performance?**
##### Unlock up to 14x faster operations and cut execution time by 94% with [high-performance library for EF Core](https://entityframework-extensions.net/).  Seamlessly enhance your app with Bulk Insert, Update, Delete, and Merge—fully integrated into your existing EF Core workflows.
##### Trusted by 5,000+ developers since 2014. Ready to boost your performance? **[Explore the solution](https://entityframework-extensions.net/)**
&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp;  
##### **How to optimize the EF Core queries?**
&nbsp;  
##### Write them properly the first time.&nbsp;
##### We often hear about optimizing a piece of code, or a query, and it mostly refers to **"refactoring code that wasn't written well from the beginning"**.
&nbsp;  
##### For example. someone put a database call in a foreach loop. Then he saw after a while that it was a performance problem for him, so he "optimized" the code.
&nbsp;  
##### He did not optimize anything, he changed the code to be as it should have been from the beginning.
&nbsp;  
##### Regarding Entity Framework Core, there are many rules, today I will present you 5 basic ones that should be followed when writing queries.
&nbsp;  
##### Let's dive in...
&nbsp;  
&nbsp;  
### 1# Get fields you need only&nbsp;
&nbsp;  
&nbsp;  
##### It is about optimizing data retrieval by selecting only the specific fields required for a particular operation, rather than fetching entire entity objects. This approach can significantly improve the performance of your application.
&nbsp;  
##### Let's see the example:
```csharp

var employeeList = context.Employees
        .Select(e => new EmployeeDto
        {
            Name = e.Name,
            Email = e.Email
        })
        .ToList();
```

##### In the database, it is very likely that there are more than 2 fields. But we on the presentation layer don't need anything more than Name and Email, so why would we extract all the data? There is no need.
&nbsp;  
##### **Why?**
&nbsp;  
##### **1. Reduced Data Transfer:**
##### Fetching only the required fields reduces the amount of data transferred from the database to the application, which can be crucial for performance, especially in networked or distributed environments.
&nbsp;  
##### **2. Lower Memory Usage:** 
##### Loading fewer fields means using less memory in your application, which is particularly important for large datasets or when dealing with resource-constrained environments.
&nbsp;  
##### **3. Improved Query Performance:** 
##### Queries can execute faster because the database engine has less data to retrieve and transmit.
&nbsp;  
##### **4. Decreased Entity Tracking Overhead:** 
##### In EF Core, when entities are tracked, there is overhead associated with change tracking. By retrieving only needed fields, you reduce this overhead, especially when tracking changes is not necessary (e.g., in read-only scenarios).
&nbsp;  
&nbsp;  
### 2# Avoid N+1 Queries
&nbsp;  
&nbsp;  
##### It is a common performance issue in database operations, particularly with Object-Relational Mapping (ORM) tools like Entity Framework Core (EF Core).
&nbsp;  
##### It occurs when your application makes one query to retrieve a set of objects, and then additional queries for each object to retrieve related data. This can lead to a significant performance bottleneck, especially when dealing with a large number of objects.
&nbsp;  
##### Let' take a look on the example:
```csharp

// Retrieve all blogs - 1 query
var blogs = context.Blogs.ToList();

foreach (var blog in blogs)
{
    // For each blog, this will trigger an additional query     // to fetch its posts - N queries
    var posts = blog.Posts;

    foreach (var post in posts)
    {
        Console.WriteLine(post.Title);
    }
}
```

##### Let' see how to fix this:
```csharp

// Retrieve all blogs and their posts in a single query using eager loading
var blogs = context.Blogs.Include(b => b.Posts).ToList();

foreach (var blog in blogs)
{
    foreach (var post in blog.Posts)
    {
        Console.WriteLine(post.Title);
    }
}
```

##### **Eager Loading with Include:**
&nbsp;  
##### The Include(b => b.Posts) method tells EF Core to load the Posts related to each Blog as part of the initial query. This way, when you access, **the data is already loaded, and no additional queries are needed**.
&nbsp;  
##### **Single Query Execution:**
##### The context.Blogs.Include(b => b.Posts).ToList() line executes a single query that retrieves all the Blogs along with their associated Posts. This effectively eliminates the N+1 queries issue.
&nbsp;  
##### **Iterating Over Results:** 
##### The nested foreach loops then iterate over the blogs and their posts. Since the posts are already loaded into memory, no additional queries are executed during iteration.
&nbsp;  
##### **Why?**
&nbsp;  
##### **1. Improved Performance:**
##### By reducing the number of queries, you significantly decrease the load on the database and the network overhead.
&nbsp;  
##### **2. Simplified Code Logic:**
##### The code is more straightforward and easier to maintain as it explicitly states the intention to load related data.
&nbsp;  
&nbsp;  
### 3# Using .AsNoTracking()
&nbsp;  
&nbsp;  
##### Using AsNoTracking in Entity Framework Core is a performance optimization technique particularly useful in scenarios where you are **only reading data from the database and do not intend to update or delete it**. This approach can significantly enhance the performance of your queries, especially in large-scale or read-heavy applications.
&nbsp;  
##### Let's see the example:
```csharp

var products = context.Products.AsNoTracking().ToList();
// Use products for read-only purposes
```

##### Suppose you have a Product entity and you want to display a list of products on a web page.
&nbsp;  
##### In this example, the products list is retrieved without the overhead of change tracking.
&nbsp;  
##### **Why?**
&nbsp;  
##### **1. Performance Improvement:** 
##### Particularly noticeable in large-scale applications or when dealing with large datasets. Queries execute faster, and less memory is consumed.
&nbsp;  
##### **2. Reduced Overhead:** 
##### Since EF Core does not need to track changes or maintain state information for these entities, there's a reduction in overhead.
&nbsp;  
##### **Considerations**
&nbsp;  
##### **- Not Suitable for CUD Operations:**
##### AsNoTracking should not be used when you plan to update, delete, or otherwise modify the entities. In such cases, EF Core's change tracking is necessary to persist these changes back to the database.
&nbsp;  
##### **- Best Used for Stateless Operations:**
##### Ideal for scenarios like API requests where each request is independent, and you don't need to track the entity's state across multiple operations.
&nbsp;  
&nbsp;  
### 4# Avoiding Cartesian Explosion
&nbsp;  
&nbsp;  
##### A cartesian explosion refers to a situation where a query unintentionally produces a disproportionately large number of records due to the way joins are handled, significantly impacting the performance and efficiency of the query.
&nbsp;  
##### Suppose we want to list all books along with their authors, but we mistakenly create a query that leads to a cartesian explosion:
```csharp

// Incorrect query leading to cartesian explosion
var query = from a in context.Authors
            from b in context.Books
            select new { a.Name, b.Title };

var results = query.ToList(); // This will produce a cartesian product
```

##### In this query, we're incorrectly combining every author with every book, regardless of whether the book was written by that author.&nbsp;
&nbsp;  
##### The corrected version involves properly joining the Authors and Books tables based on the AuthorId:
```csharp

// Correct query using a proper join
var query = from a in context.Authors
            join b in context.Books on a.AuthorId equals b.AuthorId
            select new { a.Name, b.Title };

var results = query.ToList(); // This produces the correct result
```

##### In this corrected query, each book is matched with its corresponding author using a proper join condition. This eliminates the cartesian explosion, resulting in a more efficient query and accurate results.
&nbsp;  
##### **The Impact**
&nbsp;  
##### **1. Performance Degradation:**
##### The query becomes slower due to the large volume of data being processed.
&nbsp;  
##### **2. Resource Intensive:** 
##### Such queries consume more memory and CPU resources, which can affect the overall performance of the database server.
&nbsp;  
##### **3.Inaccurate Results:**
##### The results are often bloated with duplicate or irrelevant data, making them practically useless.
&nbsp;  
&nbsp;  
### 5# Use AsSplitQuery()
&nbsp;  
&nbsp;  
##### In Entity Framework Core 5.0 and later, the AsSplitQuery() method is used to split queries that retrieve multiple related entities into separate SQL queries. This can sometimes improve performance, especially when dealing with complex queries or large datasets.
&nbsp;  
##### Using AsSplitQuery() is particularly useful in scenarios where a **single query could result in an inefficient execution plan or a cartesian explosion**.
&nbsp;  
##### By default, EF Core tries to retrieve all related data in a single SQL query using joins. While this is efficient for small datasets, it can become a bottleneck for large datasets or complex queries.
&nbsp;  
##### Consider an example where you have Author and Book entities, and you want to retrieve authors with their books.
&nbsp;  
##### A typical query without using AsSplitQuery():
```csharp

var authors = context.Authors
                .Include(a => a.Books)
                .ToList();
```

##### This query retrieves all authors and their books in a single SQL query.
&nbsp;  
##### Using AsSplitQuery() to optimize the above query:
```csharp

var authors = context.Authors
                .Include(a => a.Books)
                .AsSplitQuery()
                .ToList();
```
&nbsp;

##### **Explanation**
&nbsp;
##### **- Without AsSplitQuery():** 
##### EF Core generates a single SQL query with joins, which could be less efficient if the Books collection is large.
&nbsp;  
##### **- With AsSplitQuery():** 
##### EF Core generates separate SQL queries: one for authors and one for books. This can be more efficient in cases of large datasets or complex relationships.
&nbsp;  
##### **Benefits**
&nbsp;  
##### **1. Performance:** 
##### Can improve performance and execution plan efficiency for queries involving large related collections.
&nbsp;  
##### **2. Reduced Memory Overhead:** 
##### Helps to avoid cartesian explosions that consume large amounts of memory.
&nbsp;  
##### **3. Flexibility:** 
##### Offers an alternative to the default join-based query approach, allowing for optimization based on specific query and data characteristics.
&nbsp;  
##### **Considerations**
&nbsp;  
##### **1. More Database Round-Trips:** 
##### While AsSplitQuery() can improve efficiency, it results in more database round-trips. This should be considered, especially in environments where database latency is a concern.
&nbsp;  
##### **2. Use Case Specific:** 
##### Its benefits are more pronounced in certain scenarios, particularly with large datasets. It may not always be the best choice for every query.
&nbsp;  
&nbsp;  
### Conslusion
&nbsp;  
&nbsp;  
##### Don't wait until you run into a problem with your query due to carelessness and poorly written code. From the very beginning, do your best to meet the basics, and considering how far the Entity Framework Core has progressed, it is very likely that this will be enough for you.
&nbsp;  
##### In addition to these, there are many other practices that should be followed.
&nbsp;  
##### That's all from me today.