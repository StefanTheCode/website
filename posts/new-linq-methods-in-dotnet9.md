---
title: ".NET 9 - New LINQ Methods"
subtitle: ".NET 9 introduces exciting enhancements to LINQ (Language Integrated Query), adding new methods - Index, CountBy, and AggregateBy..."
category: ".NET"
date: "Dec 16 2024"
readTime: "Read Time: 3 minutes"
photoUrl: "/images/blog/newsletter21.png"
meta_description: ".NET 9 introduces exciting enhancements to LINQ (Language Integrated Query), adding new methods - Index, CountBy, and AggregateBy. "
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;   
##### • Tired of outdated API documentation holding your team back? Postman simplifies your life by [automatically syncing documentation with your API updates](https://community.postman.com/t/the-postman-drop-november-edition/71372?utm_source=influencer&utm_medium=Social&utm_campaign=nov24_global_growth_pmdropnl&utm_term=Stefan_Djokic) - no more static docs, no more guesswork!
##### [Read more](https://community.postman.com/t/the-postman-drop-november-edition/71372?utm_source=influencer&utm_medium=Social&utm_campaign=nov24_global_growth_pmdropnl&utm_term=Stefan_Djokic).

<!--START-->

&nbsp; &nbsp; 
### The background
&nbsp; &nbsp; 
##### .NET 9 introduces exciting enhancements to LINQ (Language Integrated Query), adding new methods - **Index**, **CountBy**, and **AggregateBy**. 
&nbsp;
##### These methods streamline data manipulation and improve performance in scenarios involving counting, aggregation, and accessing indices. 
&nbsp;
##### Let’s dive into these additions, understand their practical applications, and see them in action.

&nbsp; 
&nbsp; 
### 1. CountBy: Simplified Grouped Counting
&nbsp; 
&nbsp; 

##### The **CountBy** method simplifies counting occurrences of elements based on a key. Unlike GroupBy, it directly produces a dictionary-like result of counts by key, reducing code complexity and intermediate allocations.
&nbsp; 

##### **Example**: Let’s count the occurrences of first names in a list of people.

```csharp

var people = new List<Person>
{
    new Person("Steve", "Jobs"),
    new Person("Steve", "Carell"),
    new Person("Elon", "Musk")
};

var countByFirstName = people.CountBy(p => p.FirstName);

foreach (var entry in countByFirstName)
{
    Console.WriteLine($"There are {entry.Value} people with the name {entry.Key}");
}

// Output:
// There are 2 people with the name Steve
// There are 1 people with the name Elon

```

##### **Why It’s Useful:**
&nbsp; 
##### 1. Eliminates the need for GroupBy followed by Select.
##### 2. Reduces code verbosity and increases clarity.

&nbsp; 
&nbsp; 
### 2. AggregateBy: Key-Based Aggregations Made Easy
&nbsp; 
&nbsp; 


##### **AggregateBy** allows you to aggregate values by a key, all in a single operation. It combines the functionality of GroupBy and Aggregate into a single, optimized step.
&nbsp; 

##### **Example**: Aggregate salaries by job title to compute the total salary for each role.
```csharp

var employees = new List<Employee>
{
    new Employee("Alice", "Developer", 70000),
    new Employee("Bob", "Developer", 80000),
    new Employee("Charlie", "Manager", 90000),
    new Employee("Dave", "Manager", 95000)
};

var salaryByRole = employees.AggregateBy(
    emp => emp.Role,
    seed: 0,
    (totalSalary, emp) => totalSalary + emp.Salary
);

foreach (var entry in salaryByRole)
{
    Console.WriteLine($"Total salary for {entry.Key}: {entry.Value}");
}

// Output:
// Total salary for Developer: 150000
// Total salary for Manager: 185000

```
##### **Why It’s Useful:**
&nbsp; 
##### 1. Reduces intermediate groupings and simplifies aggregation logic.
##### 2. Offers performance benefits in scenarios with large datasets.

&nbsp; 
&nbsp; 
### 3. Index: Access Elements with Indices
&nbsp; 
&nbsp; 

##### The **Index** method returns elements along with their indices, making it easier to iterate through collections when you need both the element and its position.
&nbsp; 
##### **Example**: Iterate over a list of people, displaying their index and name.
```csharp

var people = new List<Person>
{
    new Person("Steve", "Jobs"),
    new Person("Steve", "Carell"),
    new Person("Elon", "Musk")
};

foreach ((var index, var person) in people.Index())
{
    Console.WriteLine($"Entry {index}: {person.FirstName} {person.LastName}");
}

// Output:
// Entry 0: Steve Jobs
// Entry 1: Steve Carell
// Entry 2: Elon Musk

```
##### **Why It’s Useful:**
&nbsp; 
##### 1. Provides a more intuitive alternative to Select((element, index) => ...).
##### 2. Increases readability for index-dependent operations.

&nbsp; 
&nbsp; 
### Benefits of the New LINQ Methods in .NET 9
&nbsp; 
&nbsp; 

##### **1. Improved Readability**: These methods reduce boilerplate code, making your queries more concise and expressive.
&nbsp; 

##### **2. Enhanced Performance**: Optimized implementations eliminate intermediate collections, improving efficiency in large datasets.
&nbsp; 

##### 3. Developer Productivity**: These additions reduce cognitive load, making common operations simpler and faster to implement.

&nbsp;
&nbsp;
### Wrapping Up
&nbsp;
&nbsp;

##### .NET 9’s LINQ enhancements empower developers with tools that simplify data processing and improve performance. 
&nbsp;

##### Whether you’re counting occurrences, aggregating values, or working with indices, these new methods make your code cleaner and more efficient. 
&nbsp;

##### Start exploring Index, CountBy, and AggregateBy in your projects today!
&nbsp;

##### Stay tuned for more insights into .NET 9 and beyond. If you’ve used these methods in a unique way, share your experiences with the community!
&nbsp;

##### Check [LINQ Performance Tips and Tricks](https://thecodeman.net/posts/linq-performance-otpimization-tips-and-tricks?utm_source=article).
&nbsp;

##### That's all from me for today.
&nbsp;

<!--END-->

## <b > dream BIG! </b>