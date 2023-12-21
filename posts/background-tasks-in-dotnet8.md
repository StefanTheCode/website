---
newsletterTitle: "#44 Stefan's Newsletter"
title: "Background Tasks in .NET 8"
subtitle: "A Background Task in .NET typically refers to any operation that runs in the background, separate from the main flow of your application. This can include tasks like processing data, performing I/O operations, or any other long-running processes that you don't want to run on the main thread because they might block the user interface or the main operation of your application."
readTime: "Read Time: 7 minutes"
date: "Dec 04 2023"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Explore innovative error handling strategies for .NET developers in this insightful blog post. Learn the advantages of using the Result<T> object over traditional exceptions, and how to effectively implement custom Result and Error classes for clearer, more efficient code management. A must-read for enhancing your coding practices in .NET."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;
##### • If you have ever used **Postman** to debug and write tests for your REST APIs, guess what, those are the same concepts you need to know for ** [writing tests for your gRPC requests in Postman](https://blog.postman.com/testing-grpc-apis-with-postman/) **
##### For more info about gRPC, they created a great beginner article ** [here](https://blog.postman.com/what-is-grpc/) **.
&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp;  
##### **What is Background task? What is Hosted Service?**
&nbsp;  
##### A **Background Task** in .NET typically refers to any **operation that runs in the background** , separate from the main flow of your application. This can include tasks like processing data, performing I/O operations, or any other long-running processes that you don't want to run on the main thread because they might block the user interface or the main operation of your application.
&nbsp;  
##### A **Hosted Service** in .NET, specifically in the context of ASP.NET Core, is a service that is **hosted within the application's process** . It's a way to run long-running background tasks that are tied to the lifecycle of the application.
&nbsp;  
##### In today's article, I'll explore a recently introduced aspect of the Microsoft.Extensions.Hosting library, which has been part of .NET 8 from its fourth preview, specifically focusing on how it impacts hosted services.
&nbsp;  
##### Let's dive in...
&nbsp;  
&nbsp;  
### What was wrong before .NET 8?
&nbsp;  
&nbsp;  
##### In earlier versions leading up to .NET 8, the initiation and termination of hosted services within the framework were managed in a sequential manner.
&nbsp;  
##### Specifically, each service registered as an IHostedService in the Dependency Injection (DI) container was started one after the other.
&nbsp;  
##### This process involved invoking the StartAsync method for each service and **waiting for its completion before moving on to the next one** . While this approach generally did not pose significant issues for most applications, there were scenarios where it could lead to complications.
&nbsp;  
##### For example, if a hosted service executed a lengthy process in its StartAsync method, it could inadvertently **delay the startup of subsequent services in the application** .
&nbsp;  
##### It is advisable to minimize the workload in the StartAsync method, but the potential for a slow service to hinder the overall application startup remained a concern prior to the introduction of .NET 8.
&nbsp;  
##### Let's see the example of how the background service was implemented before .NET 8:
```csharp

public class SomeService : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("Start Service");
        await Task.Delay(60000); //1 minute
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("Stop Service");
    }
}
```

##### DI registration:
```csharp

builder.Services.AddHostedService&lt;SomeService&gt;();
```

##### So what is the problem here?
&nbsp;  
##### As I mentioned above, StartAsync will be started and will have to wait for it to finish before moving on to the next service. At this point the application won't actually start yet because DI hasn't registered all the services.

![Before .NET 8 Testing](/images/blog/posts/background-tasks-in-dotnet8/before-dotnet8-testing.png)

##### I simulated a job that takes 6 seconds and as you can see, 6 seconds passed before the application started.
&nbsp;  
##### This can be a problem. But there is a solution.
&nbsp;  
&nbsp;  
### .NET 8 Fix
&nbsp;  
&nbsp;  
##### In .NET 8, you now have the option to start or stop your services at the same time, instead of one after the other. This is done by changing the settings in **HostOptions** . If you want all your services to start together, turn on the **ServicesStartConcurrently** option. And if you want them to stop at the same time, there's a setting for that too, called **ServicesStopConcurrently** .&nbsp;
&nbsp;  
##### Let' take a look on the example:
```csharp

builder.Services.Configure&lt;HostOptions&gt;(options =>
{
    options.ServicesStartConcurrently = true;
    options.ServicesStopConcurrently = true;
});

builder.Services.AddHostedService&lt;SomeService&gt;();
```

##### The result of this - other services started without any delay.
![Fix with .NET 8 version Testing](/images/blog/posts/background-tasks-in-dotnet8/dotnet8-version-testing.png)

##### **More control over hosted services**
&nbsp;  
##### .NET 8 introduced a new interface for hosted services - **IHostedLifeCycleService** . The reason for this is that we don't have much control over the services within the StartAsync() and StopAsync() methods.
&nbsp;  
##### This interface abstracts 4 more new methods:
&nbsp;  
##### **• StartingAsync**
##### **• StartedAsync**
##### **• StoppingAsync**
##### **• StoppedAsync**
```csharp

public class SomeService : IHostedLifecycleService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("Start Service");
    }

    public async Task StartedAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("Started Service");
    }

    public async Task StartingAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("Starting Service");
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("Stop Service");
    }

    public async Task StoppedAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("Stopped Service");
    }

    public async Task StoppingAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("Stopping Service");
    }
}
```

##### This allows us to have full control over hosted services, while they starting (Starting), during their startup (Start), and when they are started (Started) - same for Stop, also.
&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  
##### Before .NET 8, when an app started, its hosted services would start one after the other. Each service had to finish starting before the next one could begin.&nbsp;
##### This usually didn't cause problems, but sometimes a slow service could delay the whole app from starting.
##### In .NET 8, two new features let us start or stop services simultaneously, instead of one after another. You can turn this on by changing the settings in **HostOptions** for any services you're using.
&nbsp;  
##### In addition, now you can have a full control over Hosted Services by implementing a new interface **IHostedLifecycleService** which comes with 4 new methods for controlling the service (StartedAsync, StartingAsync, StoppedAsync, StoppingAsync).
&nbsp;  
##### Install .NET 8 SDK and test, I'm sure you will see the benefits of this.
&nbsp;  
##### That's all from me today.