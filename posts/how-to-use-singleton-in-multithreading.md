---
newsletterTitle: "#51 Stefan's Newsletter"
title: "How to use Singleton in Multithreading in .NET"
subtitle: "The core idea of a Singleton is that it is a class designed to only create one instance of itself, and it typically provides an easy way to access that instance."
readTime: "Read Time: 4 minutes"
date: "Jan 22 2024"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Unlock Singleton pattern in multithreading with .NET: Expert insights on thread safety, double check locking, and Lazy<T> implementation for robust applications."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • If you have ever used **Postman** to debug and write tests for your REST APIs, guess what, those are the same concepts you need to know for [writing tests for your gRPC requests in Postman](https://blog.postman.com/testing-grpc-apis-with-postman/). For more info about gRPC, they created a great beginner article [here](https://blog.postman.com/what-is-grpc/).


&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp; 
##### In software engineering, the Singleton pattern stands out as a widely recognized pattern.
##### The core idea of a Singleton is that it is **a class designed to only create one instance of itself**, and it typically provides an easy way to access that instance.
&nbsp; 
##### Generally, Singletons are created without allowing any parameters for the instance creation. This is to prevent complications that might arise from attempting to create a second instance with different parameters.
&nbsp; 
##### If a scenario requires accessing the same instance for every request with identical parameters, the factory pattern is a more suitable choice.
&nbsp; 
##### This discussion is focused solely on cases where no parameters are needed for creating the singleton. A common characteristic of Singletons is their lazy creation, meaning the instance is not generated until it is first required.
&nbsp; 
##### Let's see how to implement it properly.

&nbsp; 
&nbsp;
### Basic - Not thread safe
&nbsp; 
&nbsp; 

##### Under normal circumstances, this would be a common piece of code you would see in an application.
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
##### This **isn't thread safe** when used with multiple threads.
&nbsp; 
##### What can happen is two threads might check if the instance is null at the same time and both find it to be true.
&nbsp; 
##### As a result, they each create an instance, which goes against the rule of having only one instance in the singleton pattern.
&nbsp; 
##### Also, it's possible that an instance is already made before this check happens, but other threads might not see this new instance right away unless certain steps are taken to make sure they do.
&nbsp; 
##### How  to make it thread safe?

&nbsp; 
&nbsp;
### Thread Safe - Using lock
&nbsp; 
&nbsp; 

##### This is the well-known approach to implement it.
&nbsp; 
##### Here's how it works:
&nbsp; 
##### - the thread locks a shared object and then checks if the instance has already been created. If it hasn't, it goes ahead and creates the instance. This process addresses the issue of memory barriers, as the lock ensures all reads happen after it's acquired and all writes happen before it's released.
&nbsp; 
##### This also makes sure **that only one thread can create the instance**, because while one thread is in the process of creating it, no other thread can enter that part of the code.
&nbsp; 
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
&nbsp; 
##### The downside is that this method can slow things down because it requires locking every time the instance is needed. 
&nbsp; 
##### Okay, is it necessary to lock it every time? 
&nbsp; 
##### Nope. Let's look deeper.

&nbsp; 
&nbsp;
### Thread Safe - Using Double Check Locking
&nbsp; 
&nbsp; 

##### First Check: When accessing the instance, the first check is to see if the instance is null. If it's not null, it returns the existing instance. **This first check avoids the locking overhead in most calls after the instance is initialized**.

&nbsp; 
##### Locking: If the instance is null, a lock is obtained.
&nbsp; 
##### Second Check: Once inside the lock, a second check on the instance is performed. This is because another thread might have initialized the instance between the first check and obtaining the lock. If the instance is still null after this second check, it is created.

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
&nbsp; 
##### So we found the best solution?
&nbsp; 
##### Not really. **This one is really tricky one, and it can cause problems if not used properly.**
&nbsp; 
##### So what is the best solution?
&nbsp; 
##### In my opinion, there is no "Best" solution. It totally depends on a case by case basis. I like and suggest using Lazy<T>.
&nbsp; 
##### Let's take a look.

&nbsp; 
&nbsp;
### Thread safe Singleton with Lazy<T>
&nbsp; 
&nbsp; 

##### Here's how you can implement a Singleton pattern using Lazy<T>:

&nbsp; 
##### **• Lazy Initialization:** The Lazy<T> class automatically handles the lazy initialization of the Singleton instance. The instance isn't created until it's actually needed.
##### **• Thread-Safety:** Lazy<T> ensures that the instance is created in a thread-safe way, so you don't need to use locks or double-check locking.
##### **• Simplicity and Maintainability:** The code is simpler and more maintainable because the complexity of thread synchronization is encapsulated within the Lazy<T> class.
&nbsp; 
##### You can implemented in this way:

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
&nbsp; 
##### The key benefits of using Lazy<T> for Singleton implementation are:
&nbsp; 
##### **• Thread Safety:** Lazy<T> handles all the complexities of thread safety, reducing the risk of errors.
##### **• Performance:** It's generally more efficient, as it doesn't require explicit locking (which can be expensive).
##### **• Simplicity:** The code is much cleaner and easier to understand, enhancing maintainability.

&nbsp; 
##### This approach is recommended in modern C# development over manually implementing double-check locking, as it leverages the capabilities of the .NET Framework for handling lazy initialization in a thread-safe manner.

&nbsp; 
&nbsp; 
### Wrapping up
&nbsp; 
&nbsp; 
##### In today's newsletter issue, we went through some of the most common implementations of the Singleton pattern.
&nbsp; 
##### We have:
&nbsp; 
##### - Basic implementation - not thread-safe
##### - Thread-Safe with lock
##### - Optimized Thread-Safe with double check locking
##### - Lazy<T>
&nbsp; 
##### There are several other ways to implement this pattern.
&nbsp; 
##### My personal choice is Lazy<T> since it is good in terms of performance and lazyness, and it is easy to read.
&nbsp; 
##### Also, this can be a good introduction for all those who are starting to learn the Singleton pattern.
&nbsp; 
##### What I would definitely avoid is the first way, because it is not thread safe and can cause serious problems in the code.

##### That's all from me today.
&nbsp;  
##### ___
&nbsp;  

##### P.S. If you want to see some more examples of this pattern or 9 more patterns I explained in my ebook "Design Patterns Simplified", you can check out it [here](https://stefandjokic.tech/design-patterns-simplified?utm_source=newsletter).

&nbsp;  
##### 800+ enigneers already read it. 
