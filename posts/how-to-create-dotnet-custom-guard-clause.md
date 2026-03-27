---
title: "How to create .NET Custom Guard Clause"
subtitle: "Guard clauses in .NET are a programming practice used for improving the readability and reliability of code... "
date: "September 30 2024"
category: "CSharp"
readTime: "Read Time: 3 minutes"
meta_description: "Explore innovative error handling strategies for .NET developers in this insightful blog post. Learn the advantages of using the Result<T> object over traditional exceptions, and how to effectively implement custom Result and Error classes for clearer, more efficient code management. "
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Join Postman CTO, Ankit Sobti, and Head of Customer Experience and Success, Kristine Chin, at <a href="https://app.zuddl.com/p/a/event/8e8f96c1-99d5-4392-96a1-c68b8c8b9d2d" style="color: #a5b4fc; text-decoration: underline;">this webinar</a> which delivers the information you need to maximize the success of your API products, reduce friction to collaboration, and to provide a world-class experience for your developers, partners, and customers. Join <a href="https://app.zuddl.com/p/a/event/8e8f96c1-99d5-4392-96a1-c68b8c8b9d2d" style="color: #a5b4fc; text-decoration: underline;">here</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## The Background
**Guard clauses** in .NET are a programming practice used for improving the readability and reliability of code. They are simple checks at the beginning of a function or a method that validate inputs or conditions before proceeding with the rest of the code.
Guard clauses in .NET effectively address several common programming problems: they reduce complexity and increase readability by preventing deeply nested code structures; enhance code safety and reliability by validating inputs or conditions at the outset, thus averting potential runtime errors or unexpected behavior; and they clarify the code's intent by explicitly stating the preconditions needed for subsequent code to execute correctly.
This not only makes the code easier to understand but also simplifies maintenance and future modifications, as the requirements and constraints are clearly laid out at the beginning of the method or function.
How to implement it?
Let's take a look deeply!
## Without Custom Guard Clause
Under normal circumstances, this would be a common piece of code you would see in an application.
```csharp
public class Person
{
    public string Name { get; private set; }

    public Person(string name)
    {
        if (string.IsNullOrEmpty(name))
        {
            throw new ArgumentException("Name cannot be null or whitespace.", nameof(name));
        }

        Name = name;
    }
}
```

There is nothing unknown here. We check if the name is filled in and throw an exception if it is not.
Note: I am not a supporter of this practice that exceptions are thrown in situations when it is not necessary. In this case, I would use the [Result object](https://thecodeman.net/posts/better-error-handling-with-result-object) with the Failure status. Certainly, this issue is about another problem that we are solving, so we will stick to exceptions.
What's wrong here?
Nothing specific. But code readability is not something.
Just imagine, let's now insert another check for us (is it in the right format, good length, etc...). The function will have 20 lines of code just for checking.
Let's make it sexier... :)
## Custom Guard Clause
We will create a static class **Ensure**. I like to call it that, so that one can immediately conclude what it is about.
Within it, we will add the first method that the class will check.
This code will actually read in English:.
```csharp
public static class Ensure
{
    public static void NotNullOrEmpty(string? value,
        string? paramName = null)
    {
        if(string.IsNullOrEmpty(value))
        {
            throw new ArgumentException("The value can't be null", 
            paramName);
        }
    }
}
```

If this is the case, the job and responsibility of throwing the exception is taken over by the Guard Clause class.
In this way, we have a clean and legibly written method.
We can see that below:
```csharp
public Person(string name)
{
    Ensure.NotNullOrEmpty(name);

    // Logic
}
```

## Use a help of CallerArgumentExpression
Instead of constantly passing the name of the parameter for which an exception is thrown, which was passed as paranName in the NotNullOrEmpty() function, you can use the attribute **CallerArgumentExpression("value")** , where value represents the attribute for which we need a name.
What will happen?
At runtime, this value will be read and assigned to the paramName attribute.
This can be very useful in many situations, and we avoid hardcoding the parameter names and the potential error of writing the wrong parameter.
Take a look here:
```csharp
public static class Ensure
{
    public static void NotNullOrEmpty(string? value, 
        [CallerArgumentExpression("value")] string? paramName = null)
    {
        if(string.IsNullOrEmpty(value))
        {
            throw new ArgumentException("The value can't be null", 
            paramName);
        }
    }
}
```

## Check these libraries
Today I did not invent electricity like Nikola Tesla.
Many developers have already created quality libraries for the same purpose.
You can see some of them on the following links:
• [Ardalis](https://www.nuget.org/packages/Ardalis.GuardClauses/)
• [Dawn](https://www.nuget.org/packages/Dawn.Guard)
• [Throw](https://www.nuget.org/packages/Throw)[](https://www.nuget.org/packages/Throw)
Whichever you choose, you won't have any problems. And if you want more control, you can always create your own custom, as I showed.
## Wrapping up
In today's issue, I showed you how to improve readability and shift the responsibility of throwing exceptions (if necessary) to another class that should handle it.
And in this way, you will increase the readability of your method that deals with logic. By using Guard Clauses.
I showed you how to create your own Custom Guard Clause.
I explained what the CallerArgumentExpression attribute is and how to use it.
And finally, if you wouldn't do it, I gave you an example of 3 existing libraries that do it in an excellent way.
That's all from me today.

<!--END-->

