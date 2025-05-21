---
title: "Getting Started with PLINQ"
subtitle: "PLINQ queries are similar to regular LINQ queries, but they're designed to run faster by using all the processors on your computer..."
readTime: "Read Time: 3 minutes"
date: "Dec 25 2023"
category: ".NET"
meta_description: "Delve into the world of Parallel LINQ (PLINQ) in Stefan Đokić's latest newsletter, exploring its power to process data faster by using multiple threads. Understand the basics of PLINQ, how it differs from regular LINQ, and its application in .NET programming. Learn about key features like the degree of parallelism, the ForAll operator, handling exceptions, and performance considerations. Ideal for developers seeking to enhance data processing efficiency in their .NET applications."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;
##### • If you have ever used **Postman** to debug and write tests for your REST APIs, guess what, those are the same concepts you need to know for ** [writing tests for your gRPC requests in Postman](https://blog.postman.com/testing-grpc-apis-with-postman/) **
##### For more info about gRPC, they created a great beginner article ** [here](https://blog.postman.com/what-is-grpc/) **.
&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp;  
##### Imagine you have a list of numbers and you want to find out which ones are even. Normally, you would loop through each number, check if it's even, and perhaps store it in a new list. This is fine for a small list, but if the list has millions of numbers, it can take a long time.
&nbsp;  
##### With PLINQ, you can do this much faster. It allows you to run these checks in parallel, using multiple threads. Each thread can process a part of the list simultaneously.
&nbsp;  
##### Wait, what is the PLINQ now?
&nbsp;  
##### Simply: **Parallel LINQ (PLINQ) is a parallel implementation of the LINQ pattern**.
&nbsp;  
##### PLINQ implements the full set of LINQ standard query operators as extension methods for the System.Linq namespace and has additional operators for parallel operations.&nbsp;
&nbsp;  
##### PLINQ combines the simplicity and readability of LINQ syntax with the power of parallel programming.&nbsp;
&nbsp;  
##### Let's take a look deeply!
&nbsp;  
&nbsp;  
### Simple implementation&nbsp;
&nbsp;  
&nbsp;  
##### This example shows a simple way to use Parallel LINQ (PLINQ) for queries where the order of the results doesn't matter:
```csharp

// Create a large array of numbers
int[] numbers = Enumerable.Range(1, 1000000).ToArray();

// Use PLINQ to find even numbers
var evenNumbers = numbers.AsParallel()
    .Where(n =&gt; n % 2 == 0)
    .ToArray();

// Do something with the even numbers
Console.WriteLine($"Found {evenNumbers.Length} even numbers.");
```
##### The real action starts with **numbers.AsParallel()** . Here's what's happening:
&nbsp;  
##### AsParallel() is a method that enables parallel processing of the array. When you apply AsParallel() to a sequence, it informs the PLINQ engine that you want to use parallelism for subsequent query operations.
&nbsp;  
##### Under the hood, PLINQ will partition the source array into multiple segments. These segments are processed in parallel across multiple threads. The exact number of segments and threads depends on various factors like the size of the array and the number of available processors on your system.
&nbsp;  
&nbsp;  
### What are PLINQ queries?&nbsp;
&nbsp;  
&nbsp;  
##### PLINQ queries are similar to regular LINQ queries, but they're designed to run faster by using all the processors on your computer. They work with any in-memory data and start executing only when needed, just like regular LINQ.
&nbsp;  
##### The **key difference** is that PLINQ splits the data into parts and processes each part simultaneously on different threads across multiple processors. This often makes the queries run much quicker.
&nbsp;  
##### Adding .AsParallel() to a PLINQ query can significantly speed up some types of queries compared to older methods.
&nbsp;  
##### However, not all queries work faster with PLINQ, and some may even slow down. It's important to understand how parallel processing affects different queries, especially in terms of data order.&nbsp;
&nbsp;  
&nbsp;  
### Degree of Parallelism
&nbsp;  
&nbsp;  
##### PLINQ usually u **ses all the processors** on your computer to run queries.
&nbsp;  
##### However, you can set it to use only a certain number of processors with the **WithDegreeOfParallelism method** . This is handy when you want other programs on your computer to have enough processing power too.
&nbsp;  
##### For example, you can limit a PLINQ query to use just two processors.
&nbsp;  
##### Also, if your PLINQ query does a lot of work that's not just about computing (like reading and writing files), it might actually work better if you let it use more processors than your computer has. This can speed things up even more.&nbsp;
&nbsp;  
##### For instance, the code below restricts the query to just two processors.
```csharp

var longNames = names.AsParallel()
    .WithDegreeOfParallelism(2)
    .Where(name =&gt; name.Length &gt; 5)
    .ToList();
```

&nbsp;  
### The ForAll Operator
&nbsp;  
&nbsp;  
##### In regular LINQ queries, the actual execution happens when you start going through the results with something like a foreach loop or by using methods such as ToList, ToArray, or ToDictionary. This is called **deferred execution** .
&nbsp;  
##### PLINQ, which is the parallel version, also does this. You can use foreach to run the PLINQ query and look at the results. But remember, foreach itself doesn't work in parallel. It needs to bring together the results from all the parallel tasks into one single thread where the loop is running.
&nbsp;  
##### If you need to keep your results in a specific order or if you're handling them one by one, like printing each one using Console.WriteLine, foreach is a good choice in PLINQ.
&nbsp;  
##### But if you don't care about the order of results and can process them in parallel, use the **ForAll method** . This method is faster because it skips the step of merging everything into one thread at the end.
&nbsp;  
##### For example, if you're adding items to a collection in a PLINQ query, **System.Collections.Concurrent.ConcurrentBag<T&gt;** is a good choice because it's designed for multiple threads to add items at the same time without removing any. This makes it well-suited for parallel processing scenarios.&nbsp;
```csharp

// Example data source: an array of file paths
string[] filePaths = { /* file paths go here */ };

// PLINQ query to process files in parallel
var query = from path in filePaths.AsParallel()
    .Where(name =&gt; IsValidFile(path))
    .Select(path);

// A ConcurrentBag to store the results
var concurrentBag = new ConcurrentBag<string&gt;();

// Process the results in parallel and add them to the ConcurrentBag
query.ForAll(path =&gt; concurrentBag.Add(ProcessFile(path)));

// Do something with the concurrentBag if needed
```

&nbsp;  
### Cancellation tokens
&nbsp;  
&nbsp;  
##### PLINQ can be stopped or "canceled" while it's running. This is different from regular LINQ queries that can't be stopped once they start.
&nbsp;  
##### To make a PLINQ query that can be canceled, you use a special command called **WithCancellation**. This command needs something called a CancellationToken. If this token's IsCancellationRequested property is changed to true, PLINQ will realize this, stop its work across all threads, and report an error known as an **OperationCanceledException**.
&nbsp;  
##### However, keep in mind that even after you tell PLINQ to stop, it might still finish working on some parts of the task before it completely stops.
&nbsp;  
##### Read more directly on [Microsoft documentation](https://learn.microsoft.com/en-us/dotnet/standard/parallel-programming/how-to-cancel-a-plinq-query).
&nbsp;  
&nbsp;  
### What about Exceptions?
&nbsp;  
&nbsp;  
##### When running a PLINQ query, it's possible for several errors to happen at the same time on different threads. Also, the part of your code that deals with these errors might not be on the same thread where the errors happened.
&nbsp;  
##### To manage this, **PLINQ puts all these errors into one big error package called AggregateException** . This package is then sent back to the main thread you are working on.
&nbsp;  
##### When handling errors on this main thread, you only need one try-catch block to catch this AggregateException. Inside this block, you can check each error in the package and handle those you know how to fix.
&nbsp;  
##### Sometimes, though, you might get errors that aren't packed in this AggregateException. An example is **ThreadAbortExceptions** , which aren't included.
&nbsp;  
##### If errors are not caught and they reach the main thread (the one that started the query), the query might still be working on some tasks even after the errors happened.
&nbsp;  
##### For more details on dealing with these errors in PLINQ, you can look up [How to handle exceptions in a PLINQ query](https://learn.microsoft.com/en-us/dotnet/standard/parallel-programming/how-to-handle-exceptions-in-a-plinq-query).
&nbsp;  
&nbsp;  
### And how to mesaure PLINQ Perfomance?
&nbsp;  
&nbsp;  
##### Often, running a query in parallel using PLINQ can be helpful, but sometimes it's not worth it. If the query is simple or if there isn't much data, setting up PLINQ can take more time than it saves. This means a regular LINQ query, which goes in order, might actually be faster.
&nbsp;  
##### In Visual Studio Team Server, there's a tool called the **Parallel Performance Analyzer** . You can use this tool to see how different queries perform, find out where things are slowing down, and check if your query is running in parallel (all at once) or sequentially (one step at a time)
&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  
##### In summary, PLINQ is a potent tool for accelerating CPU-intensive queries, but its use should be carefully considered. It's essential to assess whether your query will actually benefit from parallelization, as simpler tasks or smaller datasets might perform better with traditional sequential LINQ.
&nbsp;  
##### A deep understanding of PLINQ's APIs and judicious application based on performance analysis, possibly with tools like the Parallel Performance Analyzer, is key to reaping its full benefits.
&nbsp;  
##### Remember, effective use of PLINQ lies in strategic implementation rather than blanket application.
&nbsp;  
##### That's all from me today.
&nbsp;  
##### See ya on the next Monday coffee. 