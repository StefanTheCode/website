---
title: "6 ways to eleveate your 'clean' code"
subtitle: "I'm not sure if I know any programmer, engineer, architect, or even HR who doesn't know who Uncle Bob is and what the Clean Code book is...."
date: "August 22 2024"
photoUrl: "/images/blog/newsletter21.png"
---

&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • Complete 2024 State of the #API survey by Postman for a chance to win prizes including a Apple Vision Pro, a Sony PlayStation 5, gift certificates for Postman swag and more!
##### Complete it [here](https://www.surveymonkey.com/r/2024-state-of-api-survey).
&nbsp;  
&nbsp;  

<!--START-->

&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  


##### I'm not sure if I know any programmer, engineer, architect, or even HR who doesn't know who Uncle Bob is and what the Clean Code book is.
&nbsp;  

##### If by some miracle you are one of them, it's a concept that refers to writing code that is easy to read and maintain.
&nbsp;  

##### Today I'm going to show you 6 things you should or shouldn't be doing in your code that you can change in your code right away.
&nbsp;  

##### You may know some of these, but it's okay to remember some things because we all make mistakes even after many years of experience.
&nbsp;  

&nbsp;  
&nbsp;  
### 1#: Avoid Nested (Pyramids)
### What are Source Generators?
&nbsp;  
&nbsp;  

##### When we talk about pyramids or ladders in code, we're referring to **multiple layers of if/else statements** that can quickly become confusing and difficult to read.
&nbsp;  

##### This can happen when we have a complex set of conditions that we need to check in order to execute a particular block of code.
&nbsp;  

##### The problem with pyramids is that they make it hard to follow the logic of the code. It's easy to get lost in the maze of nested statements and lose sight of what's really happening.
&nbsp;  

##### This can make it difficult to debug and maintain the code in the future.

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
&nbsp;  

##### So, what's the solution?
&nbsp;  

##### One approach is to use guard clauses, which are essentially early return statements that check for a condition and exit the method or function if it's not met.

```csharp

public int DoThis(int x, bool y)
{
    if (x <= 0) return 3;

    if (!y) return 1;

    if (x == 10) return 0;

    return 2;
}

```

&nbsp;  
&nbsp;  
### 2#: Avoid magic (numbers, strings)
&nbsp;  
&nbsp;  

##### The problem here are hard-coded values that are used throughout the codebase without any clear explanation of what they mean.
&nbsp;  

##### For example, imagine a scenario where the number "100" is used multiple times throughout the codebase without any indication of what it represents. This can make the code difficult to understand and maintain over time.
&nbsp;  

##### Here is an example:

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
&nbsp;  

##### Solution?
&nbsp;  
##### The key is to use constants or enums to represent these values instead of hard-coding them. This makes it clear what the values represent, and also allows you to change them in a single place if needed, rather than having to update every instance throughout the codebase.

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

&nbsp;  
&nbsp;  
### 3#: Avoid Return null collection
&nbsp;  
&nbsp;  

##### Why you should not do this:
&nbsp;  

##### • Possible NullReferenceException
##### • We always need to check for null   
##### • Slow Performance (checking for null, throwing/catching an exception, etc.)

```csharp

//Edge case: Only if you need explicitly to return null
public IEnumerable<string> DontDoThis()
{
    return null;
}

```

&nbsp;  
##### Instead, just return an empty collection.

```csharp

public IEnumerable<string> DoThis()
{
    return Enumerable.Empty<string>();
}

```

&nbsp;  
&nbsp;  
### 4#: Avoid Too Many Method Parameters
&nbsp;  
&nbsp;  

##### Let's say we have a class that's working with Addresses. We are calling a method AddAddress to persistence details. The address can have StreetName, StreetNumber, PostalCode, Country, City, and Region properties. If all of these parameters are passed into the method separately, it can become difficult to read and understand the code.
&nbsp;  

##### Example:

```csharp

//Don't do this
public void AddAddress(string streetName, string streetNumber, string postalCode, string country, string city, string region)
{
    //Do something
}

```
&nbsp;  

##### To avoid too many method parameters, you can use a few different techniques. One approach is to group related parameters into a single object or struct.

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

&nbsp;  
&nbsp;  
### 5#: Be Strongly Typed
&nbsp;  
&nbsp;  

##### Don't be "Stringly" typed.
&nbsp;  

##### Similar to "Avoid Magic" but on a higher level. Imagine you have an employee class/object with 10+ types in a company (manager, hr, CEO, etc.).
&nbsp;  

##### Whenever you check the type through "magic strings", it can be disastrous on multiple levels.
&nbsp;  
##### Don't do this ever:

```csharp

public void DontDoThis(string employeeType)
{
    if (employeeType == "administrator")
    {
        //Do something
    }
}

```
&nbsp;  

##### Just create an enum that will represent the type:

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

&nbsp;  
&nbsp;  
### 6#: Your method should do one thing only
&nbsp;  
&nbsp;  

##### When you're writing code, it can be tempting to include multiple functions within a single method to make it more efficient. However, this can actually make your code more difficult to read, and maintain over time."Bad" example:

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
&nbsp;  

##### Way to resolve?
&nbsp;  

##### **Single Responsibility Principle (SRP)**. By following the SRP, you can create more modular and organized code that is easier to work with.
&nbsp;  

##### Just separate concerns:

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

&nbsp;  
&nbsp;  
### Bonus: Summary of Clean Code book rules
&nbsp;  
&nbsp;  

##### **General rules:**
&nbsp;  

##### • Follow standard conventions
##### • Keep it simple stupid. Simpler is always better. Reduce complexity as much as possible.
##### • Boy scout rule. Leave the campground cleaner than you found it. 
##### • Always find root cause. Always look for the root cause of a problem.
&nbsp;  

##### **Design rules:**
&nbsp;
##### • Keep configurable data at high levels.
##### • Prefer polymorphism to if/else or switch/case.
##### • Separate multi-threading code.
##### • Prevent over-configurability.
##### • Use dependency injection.
##### • Follow Law of Demeter. A class should know only its direct dependencies.
&nbsp;
##### **Understandability tips:**
&nbsp;
##### • Be consistent. If you do something a certain way, do all similar things in the same way.
##### • Use explanatory variables.
##### • Encapsulate boundary conditions. Boundary conditions are hard to keep track of. Put the processing for them in one place.
##### • Prefer dedicated value objects to primitive type.
##### • Avoid logical dependency. Don't write methods which works correctly depending on something else in the same class.
##### • Avoid negative conditionals.
&nbsp;
##### **Names rules:**
&nbsp;
##### • Choose descriptive and unambiguous names.
##### • Make meaningful distinction.
##### • Use pronounceable names.
##### • Use searchable names.
##### • Replace magic numbers with named constants.
##### • Avoid encodings.
##### • Don't append prefixes or type information.
&nbsp;
##### **Comments rules:**
&nbsp;
##### • Always try to explain yourself in code.
##### • Don't be redundant.
##### • Don't add obvious noise.
##### • Don't use closing brace comments.
##### • Don't comment out code.
##### • Just remove.
##### • Use as explanation of intent.
##### • Use as clarification of code.
##### • Use as warning of consequences.
&nbsp;
##### **Source code structure:**
&nbsp;
##### • Separate concepts vertically.
##### • Related code should appear vertically dense.
##### • Declare variables close to their usage.
##### • Dependent functions should be close.
##### • Similar functions should be close.
##### • Place functions in the downward direction.
##### • Keep lines short.
##### • Don't use horizontal alignment.
##### • Use white space to associate related things and disassociate weakly related.
##### • Don't break indentation.
&nbsp;
##### **Objects and data structures:**
&nbsp;
##### • Hide internal structure.
##### • Prefer data structures.
##### • Avoid hybrids structures (half object and half data).
##### • Should be small.
##### • Do one thing.
##### • Small number of instance variables.
##### • Base class should know nothing about their derivatives.
##### • Better to have many functions than to pass some code into a function to select a behavior.
##### • Prefer non-static methods to static methods.
&nbsp;
##### **Tests:**
&nbsp;
##### • One assert per test.
##### • Readable.
##### • Fast.
##### • Independent.
##### • Repeatable.
&nbsp;
##### **Code smells:**
&nbsp;
##### • Rigidity. The software is difficult to change. A small change causes a cascade of subsequent changes.
##### • Fragility. The software breaks in many places due to a single change.
##### • Immobility. You cannot reuse parts of the code in other projects because of involved risks and high effort.
##### • Needless Complexity.
##### • Needless Repetition.
##### • Opacity. The code is hard to understand.
&nbsp;
##### That's all from me for today. Make a coffee and clean up your code.  
<!--END-->
