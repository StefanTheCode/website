---
title: "Using Singleton in Multithreading in .NET"
subtitle: "The core idea of a Singleton is that it is a class designed to only create one instance of itself, and it typically provides an easy way to access that instance."
date: "Oct 08 2024"
category: ".NET"
readTime: "Read Time: 4 minutes"
meta_description: "Unlock Singleton pattern in multithreading with .NET: Expert insights on thread safety, double check locking, and Lazy<T> implementation for robust applications."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Join Postman CTO, Ankit Sobti, and Head of Customer Experience and Success, Kristine Chin, at <a href="https://app.zuddl.com/p/a/event/8e8f96c1-99d5-4392-96a1-c68b8c8b9d2d" style="color: #a5b4fc; text-decoration: underline;">this webinar</a> which delivers the information you need to maximize the success of your API products, reduce friction to collaboration, and to provide a world-class experience for your developers, partners, and customers. Join <a href="https://app.zuddl.com/p/a/event/8e8f96c1-99d5-4392-96a1-c68b8c8b9d2d" style="color: #a5b4fc; text-decoration: underline;">here</a>.</p>
<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Learn effective testing strategies, explore powerful new features, and automate your API workflows effortlessly. Avoid common pitfalls and elevate your API development with <a href="https://bit.ly/4eJtsEb" style="color: #a5b4fc; text-decoration: underline;">API Testing and Development with Postman by Dave Westerveld</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## The Background
In software engineering, the Singleton pattern stands out as a widely recognized pattern.
The core idea of a Singleton is that it is **a class designed to only create one instance of itself**, and it typically provides an easy way to access that instance.
Generally, Singletons are created without allowing any parameters for the instance creation. This is to prevent complications that might arise from attempting to create a second instance with different parameters.
If a scenario requires accessing the same instance for every request with identical parameters, the factory pattern is a more suitable choice.
This discussion is focused solely on cases where no parameters are needed for creating the singleton. A common characteristic of Singletons is their lazy creation, meaning the instance is not generated until it is first required.
Let's see how to implement it properly.

## Basic - Not thread safe

Under normal circumstances, this would be a common piece of code you would see in an application.
```csharp
public sealed class Singleton
{
    private static Singleton instance = null;

    private Singleton()
    {
    }

    public static Singleton Instance
    {
        get
        {
            if (instance == null)
            {
                instance = new Singleton();
            }
            return instance;
        }
    }
}
```
This **isn't thread safe** when used with multiple threads.
What can happen is two threads might check if the instance is null at the same time and both find it to be true.
As a result, they each create an instance, which goes against the rule of having only one instance in the singleton pattern.
Also, it's possible that an instance is already made before this check happens, but other threads might not see this new instance right away unless certain steps are taken to make sure they do.
How  to make it thread safe?

## Thread Safe - Using lock

This is the well-known approach to implement it.
Here's how it works:
- the thread locks a shared object and then checks if the instance has already been created. If it hasn't, it goes ahead and creates the instance. This process addresses the issue of memory barriers, as the lock ensures all reads happen after it's acquired and all writes happen before it's released.
This also makes sure **that only one thread can create the instance**, because while one thread is in the process of creating it, no other thread can enter that part of the code.
By the time a second thread gets there, the first one will have already created the instance, so the check will fail.

```csharp
public sealed class Singleton
{
    private static Singleton instance = null;
    private static readonly object padlock = new object();

    Singleton()
    {
    }

    public static Singleton Instance
    {
        get
        {
            lock (padlock)
            {
                if (instance == null)
                {
                    instance = new Singleton();
                }
                return instance;
            }
        }
    }
}
```
The downside is that this method can slow things down because it requires locking every time the instance is needed. 
Okay, is it necessary to lock it every time? 
Nope. Let's look deeper.

## Thread Safe - Using Double Check Locking

First Check: When accessing the instance, the first check is to see if the instance is null. If it's not null, it returns the existing instance. **This first check avoids the locking overhead in most calls after the instance is initialized**.

Locking: If the instance is null, a lock is obtained.
Second Check: Once inside the lock, a second check on the instance is performed. This is because another thread might have initialized the instance between the first check and obtaining the lock. If the instance is still null after this second check, it is created.

```csharp
public sealed class Singleton
{
    private static Singleton instance = null;
    private static readonly object padlock = new object();

    Singleton()
    {
    }

    public static Singleton Instance
    {
        get
        {
            if (instance == null)
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new Singleton();
                    }
                }
            }
            return instance;
        }
    }
}
```
So we found the best solution?
Not really. **This one is really tricky one, and it can cause problems if not used properly.**
So what is the best solution?
In my opinion, there is no "Best" solution. It totally depends on a case by case basis. I like and suggest using Lazy<T>.
Let's take a look.

## Thread safe Singleton with Lazy<T>

Here's how you can implement a Singleton pattern using Lazy<T>:

**• Lazy Initialization:** The Lazy<T> class automatically handles the lazy initialization of the Singleton instance. The instance isn't created until it's actually needed.
**• Thread-Safety:** Lazy<T> ensures that the instance is created in a thread-safe way, so you don't need to use locks or double-check locking.
**• Simplicity and Maintainability:** The code is simpler and more maintainable because the complexity of thread synchronization is encapsulated within the Lazy<T> class.
You can implemented in this way:

```csharp
public class Singleton
{
    private static readonly Lazy<Singleton> instance = new Lazy<Singleton>(() => new Singleton());

    private Singleton()
    {         
    }
    
    public static Singleton Instance => instance.Value;
}
```
The key benefits of using Lazy<T> for Singleton implementation are:
**• Thread Safety:** Lazy<T> handles all the complexities of thread safety, reducing the risk of errors.
**• Performance:** It's generally more efficient, as it doesn't require explicit locking (which can be expensive).
**• Simplicity:** The code is much cleaner and easier to understand, enhancing maintainability.

This approach is recommended in modern C# development over manually implementing double-check locking, as it leverages the capabilities of the .NET Framework for handling lazy initialization in a thread-safe manner.

## Wrapping up
In today's newsletter issue, we went through some of the most common implementations of the Singleton pattern.
We have:
- Basic implementation - not thread-safe
- Thread-Safe with lock
- Optimized Thread-Safe with double check locking
- Lazy<T>
There are several other ways to implement this pattern.
My personal choice is Lazy<T> since it is good in terms of performance and lazyness, and it is easy to read.
Also, this can be a good introduction for all those who are starting to learn the Singleton pattern.
What I would definitely avoid is the first way, because it is not thread safe and can cause serious problems in the code.

That's all from me today.
___

P.S. If you want to see some more examples of this pattern or 9 more patterns I explained in my ebook "Design Patterns Simplified", you can check out it [here](https://thecodeman.net/design-patterns-simplified?utm_source=newsletter).

800+ enigneers already read it. 

<!--END-->
