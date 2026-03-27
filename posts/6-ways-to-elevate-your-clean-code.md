---
title: "6 ways to eleveate your 'clean' code"
subtitle: "I'm not sure if I know any programmer, engineer, architect, or even HR who doesn't know who Uncle Bob is and what the Clean Code book is...."
date: "August 22 2024"
category: "CSharp"
readTime: "Read Time: 6 minutes"
meta_description: "Im not sure if I know any programmer, engineer, architect, or even HR who doesnt know who Uncle Bob is and what the Clean Code book is...."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Complete 2024 State of the #API survey by Postman for a chance to win prizes including a Apple Vision Pro, a Sony PlayStation 5, gift certificates for Postman swag and more! Complete it <a href="https://www.surveymonkey.com/r/2024-state-of-api-survey" style="color: #a5b4fc; text-decoration: underline;">here</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## Background

I'm not sure if I know any programmer, engineer, architect, or even HR who doesn't know who Uncle Bob is and what the [Clean Code](https://thecodeman.net/posts/clean-code-best-practices) book is.

If by some miracle you are one of them, it's a concept that refers to writing code that is easy to read and maintain.

Today I'm going to show you 6 things you should or shouldn't be doing in your code that you can change in your code right away.

You may know some of these, but it's okay to remember some things because we all make mistakes even after many years of experience.

## 1#: Avoid Nested (Pyramids)
## What are [Source Generators](https://thecodeman.net/posts/source-generators-deep-dive)?

When we talk about pyramids or ladders in code, we're referring to **multiple layers of if/else statements** that can quickly become confusing and difficult to read.

This can happen when we have a complex set of conditions that we need to check in order to execute a particular block of code.

The problem with pyramids is that they make it hard to follow the logic of the code. It's easy to get lost in the maze of nested statements and lose sight of what's really happening.

This can make it difficult to debug and maintain the code in the future.

```csharp
public int DontDoThis(int x, bool y)
{
    if (x > 0)
    {
        if (y)
        {
            if (x == 10)
            {
                return 0;
            }
            return 2;
        }
        return 1;
    }
    return 3;
}
```

So, what's the solution?

One approach is to use [guard clauses](https://thecodeman.net/posts/how-to-create-dotnet-custom-guard-clause), which are essentially early return statements that check for a condition and exit the method or function if it's not met.

```csharp
public int DoThis(int x, bool y)
{
    if (x <= 0) return 3;

    if (!y) return 1;

    if (x == 10) return 0;

    return 2;
}
```

## 2#: Avoid magic (numbers, strings)

The problem here are hard-coded values that are used throughout the codebase without any clear explanation of what they mean.

For example, imagine a scenario where the number "100" is used multiple times throughout the codebase without any indication of what it represents. This can make the code difficult to understand and maintain over time.

Here is an example:

```csharp
public void DontDoThis(int numberOfUsers)
{
    //100 is called a "Magic number"
    if (numberOfUsers < 100)
    {
        //Do something
    }
}
```

Solution?
The key is to use constants or enums to represent these values instead of hard-coding them. This makes it clear what the values represent, and also allows you to change them in a single place if needed, rather than having to update every instance throughout the codebase.

```csharp
//It doesn't have to be all capital letters
public const int MAXIMUM_NUMBER_OF_USERS = 100;

public void DoThis(int numberOfUsers)
{
    if (numberOfUsers < MAXIMUM_NUMBER_OF_USERS)
    {
        //Do something
    }
}
```

## 3#: Avoid Return null collection

Why you should not do this:

• Possible NullReferenceException
• We always need to check for null   
• Slow Performance (checking for null, throwing/catching an exception, etc.)

```csharp
//Edge case: Only if you need explicitly to return null
public IEnumerable<string> DontDoThis()
{
    return null;
}
```

Instead, just return an empty collection.

```csharp
public IEnumerable<string> DoThis()
{
    return Enumerable.Empty<string>();
}
```

## 4#: Avoid Too Many Method Parameters

Let's say we have a class that's working with Addresses. We are calling a method AddAddress to persistence details. The address can have StreetName, StreetNumber, PostalCode, Country, City, and Region properties. If all of these parameters are passed into the method separately, it can become difficult to read and understand the code.

Example:

```csharp
//Don't do this
public void AddAddress(string streetName, string streetNumber, string postalCode, string country, string city, string region)
{
    //Do something
}
```

To avoid too many method parameters, you can use a few different techniques. One approach is to group related parameters into a single object or struct.

```csharp
//Do this
public void AddAddress(Address address)
{
    //Do something
}

public class Address
{
    public string StreetName { get; set; } = string.Empty;
    public string StreetNumber { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
}
```

## 5#: Be Strongly Typed

Don't be "Stringly" typed.

Similar to "Avoid Magic" but on a higher level. Imagine you have an employee class/object with 10+ types in a company (manager, hr, CEO, etc.).

Whenever you check the type through "magic strings", it can be disastrous on multiple levels.
Don't do this ever:

```csharp
public void DontDoThis(string employeeType)
{
    if (employeeType == "administrator")
    {
        //Do something
    }
}
```

Just create an enum that will represent the type:

```csharp
public void DoThis(Employee employee)
{
    if (employee.Type == Type.Administrator)
    {
        //Do something
    }
}

public class Employee
{
    public string Name { get; set; } = String.Empty;
    public Type Type { get; set; };
}

public enum Type
{
    Manager = 1,
    Administrator = 2
}
```

## 6#: Your method should do one thing only

When you're writing code, it can be tempting to include multiple functions within a single method to make it more efficient. However, this can actually make your code more difficult to read, and maintain over time."Bad" example:

```csharp
public void DontDoThis()
{
    List<User> users = new List<User>()
    {
        new User { FirstName = "Stefan", LastName = "Djokic" },
        new User { FirstName = "Milan", LastName = "Jovanovic" },
        new User { FirstName = "Jelena", LastName = "Petrovic" }
    };

    foreach(var user in users)
    {
        Console.WriteLine($"User: {user.FirstName} - {user.LastName}");
    }
}
```

Way to resolve?

**Single Responsibility Principle (SRP)**. By following the SRP, you can create more modular and organized code that is easier to work with.

Just separate concerns:

```csharp
public void DoThis()
{
    List<User> users = SetupUsers();

    PrintUsers(users);
}

private List<User> SetupUsers()
{
    var users = new List<User>{
        new User { FirstName = "Stefan", LastName = "Djokic" },
        new User { FirstName = "Elon", LastName = "Musk" },
        new User { FirstName = "Steve", LastName = "Jobs" }
    };

    return users;
}

private void PrintUsers(List<User> users)
{
    foreach(var user in users)
    {
        Console.WriteLine($"User: {user.FirstName} - {user.LastName}");
    }
}
```

## Bonus: Summary of Clean Code book rules

General rules:

• Follow standard conventions
• Keep it simple stupid. Simpler is always better. Reduce complexity as much as possible.
• Boy scout rule. Leave the campground cleaner than you found it. 
• Always find root cause. Always look for the root cause of a problem.

Design rules:
• Keep configurable data at high levels.
• Prefer polymorphism to if/else or switch/case.
• Separate multi-threading code.
• Prevent over-configurability.
• Use dependency injection.
• Follow Law of Demeter. A class should know only its direct dependencies.
Understandability tips:
• Be consistent. If you do something a certain way, do all similar things in the same way.
• Use explanatory variables.
• Encapsulate boundary conditions. Boundary conditions are hard to keep track of. Put the processing for them in one place.
• Prefer dedicated value objects to primitive type.
• Avoid logical dependency. Don't write methods which works correctly depending on something else in the same class.
• Avoid negative conditionals.
Names rules:
• Choose descriptive and unambiguous names.
• Make meaningful distinction.
• Use pronounceable names.
• Use searchable names.
• Replace magic numbers with named constants.
• Avoid encodings.
• Don't append prefixes or type information.
Comments rules:
• Always try to explain yourself in code.
• Don't be redundant.
• Don't add obvious noise.
• Don't use closing brace comments.
• Don't comment out code.
• Just remove.
• Use as explanation of intent.
• Use as clarification of code.
• Use as warning of consequences.
Source code structure:
• Separate concepts vertically.
• Related code should appear vertically dense.
• Declare variables close to their usage.
• Dependent functions should be close.
• Similar functions should be close.
• Place functions in the downward direction.
• Keep lines short.
• Don't use horizontal alignment.
• Use white space to associate related things and disassociate weakly related.
• Don't break indentation.
Objects and data structures:
• Hide internal structure.
• Prefer data structures.
• Avoid hybrids structures (half object and half data).
• Should be small.
• Do one thing.
• Small number of instance variables.
• Base class should know nothing about their derivatives.
• Better to have many functions than to pass some code into a function to select a behavior.
• Prefer non-static methods to static methods.
Tests:
• One assert per test.
• Readable.
• Fast.
• Independent.
• Repeatable.
Code smells:
• Rigidity. The software is difficult to change. A small change causes a cascade of subsequent changes.
• Fragility. The software breaks in many places due to a single change.
• Immobility. You cannot reuse parts of the code in other projects because of involved risks and high effort.
• Needless Complexity.
• Needless Repetition.
• Opacity. The code is hard to understand.
That's all from me for today. Make a coffee and clean up your code.


For more on this topic, see [Clean Code Best Practices](https://thecodeman.net/posts/clean-code-best-practices) and [SOLID Principles in .NET](https://thecodeman.net/posts/solid-principles-in-dotnet).

## Wrapping Up

<!--END-->



