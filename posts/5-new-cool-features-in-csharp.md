---
title: "5 cool features in C# 12"
subtitle: "In November 2023, C# 12 arrived with a bang, bundled with .NET 8, bringing with it a bunch of cool new features that have made developers sit up and take notice..."
date: "Mar 18 2024"
category: "CSharp"
readTime: "Read Time: 5 minutes"
meta_description: "In November 2023, C# 12 arrived with a bang, bundled with .NET 8, bringing with it a bunch of cool new features that have made developers sit up and take notice."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Streamline your API development with <a href="https://www.postman.com/product/rest-client/" style="color: #a5b4fc; text-decoration: underline;">Postman's REST Client</a> a powerful tool for sending requests, inspecting responses, and debugging REST APIs with ease. Discover a more efficient way to build and test APIs at <a href="https://www.postman.com/product/rest-client/" style="color: #a5b4fc; text-decoration: underline;">link</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## Background

In November 2023, C# 12 arrived with a bang, bundled with .NET 8, bringing with it a bunch of cool new features that have made developers sit up and take notice.

This latest update has injected the language with a fresh dose of expressiveness, performance, and modern flair.

Today, this newsletter issue "5 New Cool Features in C# 12," will dive into the standout additions that are getting everyone excited.

I'll be breaking down each feature with real coding examples to show how they can make your coding life better and more efficient.
Let's dive in..

## Num 1: Collection Expressions

C# 12 brings a fresh take on handling collections like arrays, lists, and spans, making the syntax cleaner and more intuitive.

The introduction of collection expressions eliminates the need for the 'new' operator and specifying the type, allowing you to simply list your items within angle brackets.

Even better, the new spread operator ".." makes combining collections seamless, enhancing code readability and reducing clutter.

```csharp
//Before
var integers = new int[] { 1,2,3,4,5 };
var list = new List<int>() { 1,2,3,4,5 };
var fruits = new List<string>() {"apple", "banana", "cherry"};

//After
int[] integers = [ 1,2,3,4,5 ];
List<int> list = [ 1,2,3,4,5 ];
List<string> fruits = ["apple", "banana", "cherry"];
```

This feature boosts coding efficiency by cutting down on boilerplate and potential errors, while also making your code easier to read and maintain.

With these changes, working with collections in C# has become more straightforward, allowing for more expressive and flexible coding.

## Num 2: Primary Constructors

C# 12 introduces a streamlined approach to class and struct construction with the advent of primary constructors, significantly reducing the verbosity traditionally associated with object initialization.

This new feature **allows constructors to be declared directly within the type's declaration line**, making it applicable to classes, structs, record classes, and record structs.

It’s particularly effective for initializing fields or properties directly with constructor parameters, thereby facilitating a more straightforward dependency injection.

```csharp
public class User(string firstName, string lastName, int age, List<Role> roles)
 {
     public string FirstName => firstName;
     public string LastName => lastName;
     public int Age => age;
     public List<Role> => roles;
 }
 ```

Here's what makes primary constructors stand out:

• Conciseness:

By integrating constructors into the type declaration, C# 12 eliminates the need for separate, often repetitive, constructor definitions. This not only simplifies the code but also enhances its readability.

• Accessibility:

Having the constructor logic within the class or struct definition itself makes it easier to understand and maintain the code, as it centralizes the logic for object creation and initialization.

• Readability:

The code more clearly communicates the structure of an object and its initialization needs, making it easier for developers to grasp the essentials at a glance.

In essence, primary constructors cut down on the boilerplate code associated with setting up classes and structs, making code more concise, accessible, and readable, and thus streamlining the development process.

## Num 3: Inline Arrays

C# 12 introduces inline arrays, a feature that enhances array usage by allowing fixed-size arrays to be declared within structs.

This means arrays can now be allocated on the stack, boosting performance by reducing heap allocations and copying.

Inline arrays can be initialized directly within expressions, making code more concise and memory-efficient.
```csharp
using System.Runtime.CompilerServices;

[InlineArray(5)]
public struct FixedArray
{
    private int _element;
    // Usage
    var buffer = new FixedSizeBuffer();
    for (int i = 0; i < 5; i++) buffer[i] = i;
}
```
This leads to:

• Memory Efficiency:

Reduces overhead by avoiding unnecessary allocations.

• Conciseness:

Allows for direct array initialization in expressions, streamlining code.

• Readability:

Improves clarity by cutting out temporary variables.

While inline arrays offer notable benefits like enhanced memory efficiency, their application may not always extend to replacing traditional arrays in everyday use.

## Num 4: Alias Any Type with 'using'

C# 12 introduces an enhancement to type aliasing, expanding its capabilities beyond named types like classes or structs, which were previously the only types that could be aliased.

Now, it's possible to alias any type, including tuples, arrays, and generics.

This development simplifies code by reducing verbosity, thereby improving both readability and maintainability.
```csharp
// possible only with C# 12
using Point = (int x, int y);

Point origin = (0, 0);

Console.WriteLine(origin);
```
By broadening the scope of the using directive to encompass complex types, C# 12 makes it easier to work with intricate data structures while keeping the codebase clean and understandable.

## Num 5: Default Lambda Parameters

Prior to C# 12, incorporating default parameters into your code was restricted to traditional functions.
```csharp
public static void WelcomeUser(string username = "Guest") {
    Console.WriteLine($"Welcome, {username}!");
}

WelcomeUser(); 
```
However, the advent of C# 12 revolutionizes this by extending the capability to lambda expressions.
This new feature, known as Default Lambda Parameters, introduces the ability to specify default values for lambda parameters, thereby enhancing flexibility and streamlining execution.
```csharp
var WelcomeUser = (string username = "Guest") => Console.WriteLine($"Welcome, {username}!");

WelcomeUser();
```

Now, lambda expressions can be executed without the mandatory need to specify every parameter, marking a significant leap in coding efficiency and expression conciseness.


For the latest C# features, also check out [Exploring C# 13](https://thecodeman.net/posts/exploring-csharp-13) and [.NET 10 Extension Methods](https://thecodeman.net/posts/dotnet10-extension).

## Wrapping Up

C# 12 brings a bunch of cool new updates that make coding easier, faster, and lets you try new ways of programming.

But, not everything is ready for prime time right out of the gate.

Some features are still being tested, so you might want to use them carefully.

Before you dive into using these new tools in your serious projects, make sure you really get how they work and give them a trial run where it’s safe.

If you’re looking for more info or some step-by-step guides, check out the [official C# documentation](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-12).

Take a look on this [Clean Code Best Practices](https://thecodeman.net/posts/clean-code-best-practices).

That's all from me today.

<!--END-->
