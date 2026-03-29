---
title: "3 things you should know about Strings"
subtitle: "We often don't see the mistakes we're making, or we don't see ways to potentially optimize the code. And there are many of them...."
date: "Apr 01 2024"
category: "CSharp"
readTime: "Read Time: 3 minutes"
meta_description: "Optimize .NET string manipulation: Discover tips on StringBuilder for concatenation, StringComparison for performance, and Span<T> for memory efficiency."
photoUrl: "/images/blog/newsletter21.png"
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Streamline your API development with <a href="https://www.postman.com/product/rest-client/" style="color: #a5b4fc; text-decoration: underline;">Postman's REST Client</a> a powerful tool for sending requests, inspecting responses, and debugging REST APIs with ease. Discover a more efficient way to build and test APIs at <a href="https://www.postman.com/product/rest-client/" style="color: #a5b4fc; text-decoration: underline;">link</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## Introduction

We work with strings every day in our applications.

We often don't see the mistakes we're making, or we don't see ways to potentially optimize the code. And there are many of them.

Today I'm going to show you 3 things you should know about working with strings as a .NET Developer.

Those are:

1. Use **StringBuilder** for concatenation
2. Use **StringComparison** for performance
3. Leverage **Span<T>** for memory efficiency

Let's dive in...

## 1. Use StringBuilder for concatenation

In .NET, strings are immutable. This means once a string object is created, it cannot be modified.

If you need to change a string by appending another string to it, .NET doesn't actually append the new string to the existing string.

Instead, it creates a new string object that contains the combination of the two strings and then discards the old string.

This behavior is efficient and safe for small or a few manipulations but becomes a performance and memory issue when done repeatedly, such as in a loop.

How StringBuilder can help here?

**StringBuilder** is a dynamic object that allows you to expand the number of characters in the string it contains without creating a new object for every concatenation.

Under the hood, StringBuilder maintains an array of characters.

When you append a string to a StringBuilder instance, it simply copies the added characters to the end of the internal array.

If the array runs out of space, StringBuilder automatically allocates a new, larger array and copies the characters into it.

This happens far less frequently than string immutability would force, making StringBuilder much more efficient for concatenation operations, particularly in loops.
Let's see an example:

```csharp
// Using string concatenation
string result = "";
for (int i = 0; i < 1000; i++)
{
    result += "a"; // Creates a new string object in each iteration
}

// Using StringBuilder
var builder = new StringBuilder();
for (int i = 0; i < 1000; i++)
{
    builder.Append("a"); // Appends to the existing character array
}
string result = builder.ToString(); // Converts to string once at the end
```

And if we check the performances:
![String Builder BenchmarkDotNet](/images/blog/posts/3-things-you-should-know-about-strings/string-builder-[benchmarkdotnet](https://thecodeman.net/posts/benchmarking-in-dotnet-step-by-step).png)

StringBuilder is essential for optimizing memory usage and improving performance in applications that perform extensive string manipulation.

## 2. Use StringComparison for performance

.NET provides several ways to compare strings, including simple equality checks (==), string.Equals, string.Compare, and methods like string.StartsWith or string.Contains.

Each of these methods can optionally take a **StringComparison** enumeration as a parameter, which specifies **how the comparison should be conducted**.

The StringComparison options include:

**Ordinal comparisons (Ordinal, OrdinalIgnoreCase):** These comparisons are based on the binary values of the characters in the strings and are the fastest type of comparison. They are culture-insensitive, making them ideal for comparing strings for internal processing, file paths, machine-readable strings (like XML tags), and when performance is crucial.

**Culture-sensitive comparisons (CurrentCulture, CurrentCultureIgnoreCase, InvariantCulture, InvariantCultureIgnoreCase):** These comparisons consider the cultural context of the strings, which is essential when comparing strings that are displayed to the user or when the comparison results depend on specific cultural rules (like sorting in a user interface).

Ordinal comparisons are faster than culture-sensitive comparisons because they directly compare the numeric Unicode value of each character in the strings.

There's no need to apply cultural rules, which can vary widely and involve complex logic like handling special characters, accent marks, or case conversions based on specific cultures.

Let's see a practical example:

```csharp
string string1 = "hello world";
string string2 = "Hello World";

bool areEqual = string.Equals(string1, string2, StringComparison.OrdinalIgnoreCase);
// areEqual is true because the comparison is case-insensitive.
 ```
## 3. Leverage Span<T> for memory efficiency

Span<T> is a stack-allocated type that can point to continuous memory regions representing slices of arrays, strings, or unmanaged memory.

It provides the ability to work with a slice of data without allocating new memory for that slice.

This is particularly useful for strings because, as previously mentioned, strings are immutable in .NET. 

### Key Advantages of Span<T>

### Reduced Allocations:

Since Span<T> can reference a portion of an array or string, it eliminates the need for creating new substrings or array segments when you only need to work with part of the data.
This can significantly reduce the number of allocations, thereby reducing the Garbage Collector (GC) pressure and improving application performance.

### Memory Efficiency:

Span<T> enables more efficient memory usage by allowing operations on slices of data without duplicating the underlying data structures. This is particularly beneficial in performance-critical applications, such as parsers or processing pipelines, where it's common to only need to read or manipulate small portions of a larger data set at any one time.

### Versatility:

Span<T> can be used with any type of contiguous memory, not just arrays or strings. This includes unmanaged memory, which opens up possibilities for high-performance scenarios that were previously more cumbersome or inefficient in .NET.

Let's compare it with a basic Substring mehod: 

This opens the JSON configuration where you can define your [Rate Limiting](https://thecodeman.net/posts/how-to-implement-rate-limiter-in-csharp) Policy in detail.
```csharp
public class SpanVsSubstring
{
    private const string testString = "This is a longer test string for demonstration.";

    [Benchmark]
    public string UseSubstring()
    {
        return testString.Substring(10, 5); // Extracts "longer"
    }

    [Benchmark]
    public ReadOnlySpan<char> UseSpan()
    {
        ReadOnlySpan<char> span = testString.AsSpan(10, 5);
        return span; // "longer"
    }
}
```
And benchmark results: 

![Span String BenchmarkDotNet](/images/blog/posts/3-things-you-should-know-about-strings/span-string-benchmarkdotnet.png)

## Wrapping Up

Incorporating these techniques into your .NET applications can significantly improve string handling performance, both in terms of speed and memory efficiency.

Always test these approaches in the context of your specific application to measure their impact.

### What next?

Check what are 5 new cool features in C# 12 here: [Link](https://thecodeman.net/posts/5-new-cool-features-in-csharp)

That's all from me today.


---

Preparing for a .NET interview? My free [Pass Your .NET Interview](/pass-your-interview) kit has 250 questions with answers, clean C# code, and full complexity analysis - updated to .NET 10.

<!--END-->


