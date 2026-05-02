---
title: ".NET 9 - New LINQ Methods"
subtitle: ".NET 9 introduces exciting enhancements to LINQ (Language Integrated Query), adding new methods - Index, CountBy, and AggregateBy... "
date: "Dec 16 2024"
category: ".NET"
readTime: "Read Time: 3 minutes"
meta_description: ".NET 9 introduces exciting enhancements to LINQ (Language Integrated Query), adding new methods - Index, CountBy, and AggregateBy. "
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">- Tired of outdated API documentation holding your team back? Postman simplifies your life by <a href="https://community.postman.com/t/the-postman-drop-november-edition/71372?utm_source=influencer&utm_medium=Social&utm_campaign=nov24_global_growth_pmdropnl&utm_term=Stefan_Djokic" style="color: #a5b4fc; text-decoration: underline;">automatically syncing documentation with your API updates</a> - no more static docs, no more guesswork! <a href="https://community.postman.com/t/the-postman-drop-november-edition/71372?utm_source=influencer&utm_medium=Social&utm_campaign=nov24_global_growth_pmdropnl&utm_term=Stefan_Djokic" style="color: #a5b4fc; text-decoration: underline;">Read more</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers.<br/><br/><a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</p>
</div>


## The background
  
.NET 9 introduces exciting enhancements to LINQ (Language Integrated Query), adding new methods - **Index**, **CountBy**, and **AggregateBy**. 
These methods streamline data manipulation and improve performance in scenarios involving counting, aggregation, and accessing indices. 
Let’s dive into these additions, understand their practical applications, and see them in action.

## 1. CountBy: Simplified Grouped Counting

The **CountBy** method simplifies counting occurrences of elements based on a key. Unlike GroupBy, it directly produces a dictionary-like result of counts by key, reducing code complexity and intermediate allocations.

**Example**: Let’s count the occurrences of first names in a list of people.

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

Why It’s Useful:
1. Eliminates the need for GroupBy followed by Select.
2. Reduces code verbosity and increases clarity.

## 2. AggregateBy: Key-Based Aggregations Made Easy

**AggregateBy** allows you to aggregate values by a key, all in a single operation. It combines the functionality of GroupBy and Aggregate into a single, optimized step.

**Example**: Aggregate salaries by job title to compute the total salary for each role.
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
Why It’s Useful:
1. Reduces intermediate groupings and simplifies aggregation logic.
2. Offers performance benefits in scenarios with large datasets.

## 3. Index: Access Elements with Indices

The **Index** method returns elements along with their indices, making it easier to iterate through collections when you need both the element and its position.
**Example**: Iterate over a list of people, displaying their index and name.
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
Why It’s Useful:
1. Provides a more intuitive alternative to Select((element, index) => ...).
2. Increases readability for index-dependent operations.

## Benefits of the New LINQ Methods in .NET 9

**1. Improved Readability**: These methods reduce boilerplate code, making your queries more concise and expressive.

**2. Enhanced Performance**: Optimized implementations eliminate intermediate collections, improving efficiency in large datasets.

3. Developer Productivity**: These additions reduce cognitive load, making common operations simpler and faster to implement.

## Wrapping Up

.NET 9’s LINQ enhancements empower developers with tools that simplify data processing and improve performance. 

Whether you’re counting occurrences, aggregating values, or working with indices, these new methods make your code cleaner and more efficient. 

Start exploring Index, CountBy, and AggregateBy in your projects today!

Stay tuned for more insights into .NET 9 and beyond. If you’ve used these methods in a unique way, share your experiences with the community!

Check [LINQ Performance Tips and Tricks](https://thecodeman.net/posts/linq-performance-otpimization-tips-and-tricks?utm_source=article).

That's all from me for today.

<!--END-->

## dream BIG!
