---
title: "Exploring C# 13"
subtitle: "C# 13 continues the evolution of Microsoft’s flagship programming language, introducing a range of features aimed at improving code expressiveness, developer productivity, and overall performance. "
readTime: "Read Time: 3 minutes"
date: "Nov 23 2024"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "C# 13 continues the evolution of Microsoft’s flagship programming language, introducing a range of features aimed at improving code expressiveness, developer productivity, and overall performance. "
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • Boost your .NET development with dotConnect — [ADO.NET data providers for the major databases and popular cloud services](https://www.devart.com/dotconnect/?utm_source=thecodeman&utm_medium=referral&utm_campaign=bf2024). It offers reliable updates, expert developer support, and full compatibility with ORMs like EF Core, Dapper, NHibernate, LinqConnect, etc.

##### Join Devart’s [Black Friday sale](https://www.devart.com/blackfriday.html?utm_source=thecodeman&utm_medium=referral&utm_campaign=bf2024#adonet) to get 30% OFF. Join Devart’s Black Friday sale to get 30% OFF. 
&nbsp;  
##### • Tired of outdated API documentation holding your team back? Postman simplifies your life by [automatically syncing documentation with your API updates](https://community.postman.com/t/the-postman-drop-november-edition/71372?utm_source=influencer&utm_medium=Social&utm_campaign=nov24_global_growth_pmdropnl&utm_term=Stefan_Djokic) - no more static docs, no more guesswork!
##### [Read more](https://community.postman.com/t/the-postman-drop-november-edition/71372?utm_source=influencer&utm_medium=Social&utm_campaign=nov24_global_growth_pmdropnl&utm_term=Stefan_Djokic).

<!--START-->

&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp; 
##### C# 13 continues the evolution of Microsoft’s flagship programming language, introducing a range of features aimed at improving code expressiveness, developer productivity, and overall performance. 
&nbsp; 
##### This text explores five impactful features of C# 13, compares them with prior versions (C# 12), and explains why these additions are game-changers for developers.

&nbsp; 
&nbsp;
### 1. Enhanced params Collections
&nbsp; 
&nbsp; 

##### **What’s New in C# 13?**
&nbsp; 

##### Traditionally, the params keyword allowed methods to accept a variable number of arguments, but it was limited to arrays. 
##### With C# 13, params can now be applied to any collection type, such as List<T>, Span<T>, or IEnumerable<T>.
&nbsp; 

##### Example in C# 13:

```csharp

public void PrintNumbers(params List<int> numbers)
{
    foreach (var number in numbers)
    {
        Console.WriteLine(number);
    }
}

// Usage
PrintNumbers(new List<int> { 1, 2, 3 });

```
##### How It Was Done in C# 12:
```csharp

public void PrintNumbers(params int[] numbers)
{
    foreach (var number in numbers)
    {
        Console.WriteLine(number);
    }
}

// Usage
PrintNumbers(1, 2, 3); // Could only use arrays directly.

```
##### **Why It’s Useful:**
&nbsp; 
##### The flexibility of params collections allows developers to use more versatile and modern collection types, avoiding unnecessary array conversions and simplifying APIs.

&nbsp;
&nbsp;
### 2. The New System.Threading.Lock
&nbsp; 
&nbsp; 

##### **What’s New in C# 13?**
&nbsp; 

##### C# 13 introduces the **System.Threading.Lock** type, a streamlined way to synchronize access to shared resources. The new **Lock.EnterScope()** method makes the critical section easier to manage, leveraging the Dispose pattern to automatically release the lock.
&nbsp; 

##### Example in C# 13:

```csharp

Lock myLock = new Lock();
using (myLock.EnterScope())
{
    // Critical section
    Console.WriteLine("Thread-safe code here.");
}

```
##### How It Was Done in C# 12:
```csharp

private static readonly object _lock = new object();

void ThreadSafeMethod()
{
    lock (_lock)
    {
        // Critical section
        Console.WriteLine("Thread-safe code here.");
    }
}

```
##### **Why It’s Useful:**
&nbsp; 
##### The new Lock type reduces boilerplate code and minimizes the risk of forgetting to release the lock, preventing deadlocks and improving code clarity.

&nbsp;
&nbsp;
### 3. The New Escape Sequence \e
&nbsp; 
&nbsp; 

##### **What’s New in C# 13?**
&nbsp; 

##### C# 13 introduces the escape sequence \e to represent the ESCAPE character. This addition is particularly beneficial for terminal-based applications that rely on ANSI escape codes for formatting.
&nbsp; 

##### Example in C# 13:

```csharp

Console.WriteLine("\e[1mThis is bold text\e[0m");

```
##### How It Was Done in C# 12:
&nbsp; 
##### In previous versions, developers had to use hardcoded values or char codes:
```csharp

Console.WriteLine("\x1b[1mThis is bold text\x1b[0m");

```
##### **Why It’s Useful:**
&nbsp; 
##### The \e escape sequence improves readability and reduces errors when working with ANSI codes, making terminal-based development more accessible.

&nbsp;
&nbsp;
### 4. Implicit Index Access in Object Initializers
&nbsp; 
&nbsp; 

##### **What’s New in C# 13?**
&nbsp; 

##### C# 13 enhances object initializers by allowing implicit **"from the end" index operators (^)**. This feature simplifies operations on collections by enabling intuitive access to the last elements.
&nbsp; 

##### Example in C# 13:

```csharp

var numbers = new int[5] { 1, 2, 3, 4, 5 };
var initializer = new List<int> { [^1] = 10 }; // Sets the last element to 10

```
##### How It Was Done in C# 12:
```csharp

var numbers = new int[5] { 1, 2, 3, 4, 5 };
var initializer = new List<int> { 1, 2, 3, 4, 5 };
initializer[initializer.Count - 1] = 10; // Manually set the last element.

```
##### **Why It’s Useful:**
&nbsp; 
##### Implicit indexing makes code cleaner and less error-prone, reducing the likelihood of off-by-one mistakes in array and list manipulation.

&nbsp;
&nbsp;
### 5. Support for ref and unsafe in Async Methods and Iterators
&nbsp; 
&nbsp; 

##### **What’s New in C# 13?**
&nbsp; 

##### C# 13 allows ref locals and unsafe code in async methods and iterators. Previously, these features were restricted in asynchronous contexts.
&nbsp; 

##### Example in C# 13:

```csharp

public async Task ProcessDataAsync()
{
    Span<byte> buffer = stackalloc byte[1024]; // Unsafe context
    await Task.Delay(1000);
}

```
##### How It Was Done in C# 12:
&nbsp; 
##### This was not supported directly. Developers had to split logic into separate synchronous methods:
```csharp

void ProcessData()
{
    Span<byte> buffer = stackalloc byte[1024]; // Unsafe context
}

// Asynchronous wrapper
public async Task ProcessDataAsync()
{
    await Task.Run(() => ProcessData());
}

```
##### **Why It’s Useful:**
&nbsp; 
##### This feature streamlines asynchronous programming by allowing low-level memory manipulation and unsafe code directly in async methods, improving performance and reducing code fragmentation.


&nbsp; 
&nbsp; 
### Wrapping Up
&nbsp; 
&nbsp; 
##### C# 13 introduces a powerful set of features that simplify code, enhance expressiveness, and improve performance. 
&nbsp; 

##### Whether you're working with advanced threading, terminal applications, or asynchronous methods, these enhancements make C# 13 a significant step forward.
&nbsp; 

##### By comparing these new features with their counterparts in C# 12, it's clear that C# 13 reduces boilerplate code, minimizes errors, and empowers developers to write cleaner, more efficient applications. 
&nbsp; 

##### If you haven’t started exploring C# 13 yet, now is the perfect time to dive in!
&nbsp; 

##### That's all from me today. 
&nbsp; 

##### See ya on the next Monday coffee. 
<!--END-->