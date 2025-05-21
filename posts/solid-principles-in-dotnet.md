---
title: "SOLID Principles in .NET"
subtitle: "SOLID is an acronym for a set of 5 design principles that help improve the maintainability, scalability, and stability of software systems..."
readTime: "Read Time: 4 minutes"
date: "Apr 24 2023"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Gain insights into SOLID principles in .NET: Discover how to apply these core design principles for more maintainable and scalable software. Essential for .NET developers."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### Today's issue is sponsored by [Packt](https://www.packtpub.com/). I really recommend you to read 2 of their published books:
&nbsp;  
##### Blazor WebAssembly - Take your Blazor WebAssembly skills to the next level with "Blazor WebAssembly By Example" (available on Amazon [here](https://packt.link/6hFie)), featuring practical projects that will enhance your development expertise and help you create cutting-edge web applications with ease.
&nbsp;  
##### Web Development with Blazor Build powerful and scalable web applications with ease using "Web Development with Blazor," the ultimate guidebook filled with interactive exercises and practical insights. Available on Amazon at [url](https://packt.link/nmPqT).

&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp; 
##### SOLID is an acronym for a set of **5 design principles** that help improve the maintainability, scalability, and stability of software systems. These principles were introduced by **Robert C. Martin** and are widely used in object-oriented programming.
&nbsp; 
##### Here's a brief explanation of each principle:
&nbsp; 
##### **1. Single Responsibility Principle (SRP)**: A class should have only one reason to change, meaning it should have only one responsibility. This principle helps to achieve separation of concerns. (not completely true by today).
&nbsp; 

##### **2. Open/Closed Principle (OCP):** Software entities (classes, modules, functions, etc.) should be open for extension but closed for modification.
&nbsp; 

##### **3. Liskov Substitution Principle (LSP)**: Subtypes must be substitutable for their base types without affecting the correctness of the program. This principle ensures that derived classes can be used as their base class without any issues.
&nbsp; 

##### **4. Interface Segregation Principle (ISP)**: Many client-specific interfaces are better than one general-purpose interface. This principle helps to reduce the number of unimplemented or unnecessary methods in a class.
&nbsp; 

##### **5. Dependency Inversion Principle (DIP)**: High-level modules should not depend on low-level modules. Instead, both should depend on abstractions (e.g., interfaces). This principle helps to decouple software components, making the system more maintainable, flexible, and easier to test.

&nbsp; 
&nbsp;
### Single Responsibility Principle
&nbsp; 
&nbsp; 

##### People frequently misinterpret and misquote the idea that "a class or function should only have one responsibility." Although this guidance is beneficial, it does not precisely align with the Single Responsibility Principle.
&nbsp; 
##### What actually means?
&nbsp; 
##### The reason to change isn’t a technical one implied by the ‘Do One Thing’ rule, where the reason might be that a different framework is being used, or errors need to be logged in a different format. The reason to change here is that a real-world process has changed or needs to change, and the code needs to reflect that. 
&nbsp; 
##### Different departments or teams within an organization often use distinct jargon and have unique perspectives on their processes.
&nbsp; 
##### For instance, in a company that sells books, the way employees in a physical store discuss a book may differ significantly from how those in the warehouse or sales and purchasing teams discuss it.
&nbsp; 
##### It is possible to have two distinct versions of a class named Book, each designed for a particular department or process with the required properties. Both versions would include an ISBN for possible system connectivity. If modifications were made to the Book class utilized by the sales department, they would not affect the software in the warehouse since it uses its own implementation of the Book class specific to its Bounded Context.

![Single Responsibility Pattern](/images/blog/posts/solid-principles-in-dotnet/single-responsibility-pattern.jpg)
&nbsp; 
##### Check the GitHub repo for the code for free.

&nbsp; 
&nbsp;
### Open-Closed Principle
&nbsp; 
&nbsp; 

##### It was introduced by Bertrand Meyer in 1988.
&nbsp; 
##### The Open/Closed Principle states that software entities (classes, modules, functions, etc.) should be open for extension but closed for modification. In other words, you should be able to add new functionality or modify the behavior of a module without altering its existing code.
&nbsp; 
##### By adhering to the Open/Closed Principle, you can create more maintainable, flexible, and scalable software. When changes are required, new code can be added through inheritance or by implementing interfaces, rather than modifying existing code, which can introduce new bugs or break existing functionality.

&nbsp; 
##### A common approach to achieve OCP in object-oriented languages like C# is to use interfaces and polymorphism. Here's a simple example:
```csharp

public interface IPersistence
{
    public void Save(string data);
}

public class DatabasePersistence : IPersistence
{
    public void Save(string data)
    {
        Console.WriteLine($"Saving data to database: {data}");
    }
}

public class FilePersistence : IPersistence
{
    public void Save(string data)
    {
        Console.WriteLine($"Saving data to a file: {data}");
    }
}


```
&nbsp; 
##### Check the GitHub repo for the code for free.

&nbsp; 
&nbsp;
### Liskov Substitusion Principle
&nbsp; 
&nbsp; 

##### It was introduced by Barbara Liskov in 1987.
&nbsp; 
##### The principle states that objects of a derived class (subclass) should be able to replace objects of the base class (superclass) without affecting the correctness of the program. In other words, derived classes should be substitutable for their base classes.
&nbsp; 
##### LSP is a stronger form of the "is-a" relationship between a derived class and its base class. It ensures that a derived class does not violate any of the contracts or expectations of the base class, such as the method signatures, return types, input parameter types, and behavior.
&nbsp; 
##### By adhering to the Liskov Substitution Principle, you can create more maintainable, flexible, and robust software systems. It reduces the risk of introducing bugs when using inheritance and polymorphism.
&nbsp; 
##### Here's an example to demonstrate the Liskov Substitution Principle in C#:
```csharp

public interface IFly
{
    void Fly();
}

public abstract class Bird
{
    public abstract void MakeSound();
}

public class Pigeon : Bird, IFly
{
    public override void MakeSound()
    {
        Console.WriteLine("Coo!");
    }

    public void Fly()
    {
        Console.WriteLine("Pigeon is flying.");
    }
}

public class Penguin : Bird
{
    public override void MakeSound()
    {
        Console.WriteLine("Quak!");
    }
}

```
&nbsp; 
##### Check the GitHub repo for the code for free.
&nbsp; 
##### The Bird class does not have a Fly method, and we've introduced an IFly interface for birds that can fly. This updated design satisfies the Liskov Substitution Principle and better represents the relationship between different bird types and their abilities.

&nbsp; 
&nbsp;
### Interface Segregation Principle
&nbsp; 
&nbsp; 

##### The Interface Segregation Principle (ISP) states that many smaller, focused interfaces are better than one large, general-purpose interface. By following this principle, you can avoid forcing a class to implement methods it doesn't need or use, which makes the code more maintainable and easier to understand.
&nbsp; 
##### Here's an example in C# to demonstrate the Interface Segregation Principle:
```csharp

public interface IWork
{
    void Work();
}

public interface IEat
{
    void Eat();
}

public interface IMaintenance
{
    void PerformMaintenance();
}

```
&nbsp; 
##### Now we can create specific worker classes that implement only the interfaces they need:
&nbsp; 
```csharp



```
&nbsp; 
##### By applying the Interface Segregation Principle, we now have more focused interfaces and classes that implement only the methods they actually need. This makes the code more maintainable, easier to understand, and less prone to errors.


&nbsp;  
&nbsp;  
### Setting up Hangfire
&nbsp;  
&nbsp;  


#### NuGet Package:
&nbsp;  
##### You need to install Hangfire package.
![Install Hangfire package](/images/blog/posts/jobs-in-dotnet-with-hangfire/install-hangfire-package.jpg)

&nbsp;  
##### The last version is 1.7.34.
&nbsp;  
##### Hangfire.SqlServer and Hangfire.Core are installed by default.
&nbsp;  

#### Setup Storage:
&nbsp;  
##### Hangfire has the ability to use a SQL Server database by default for storing job definitions and statuses. Additionally, you have the option to choose other alternatives. For our example project, I have decided to use MSSQL local storage for simplicity.
&nbsp;  
##### It is essential to have a database definition, regardless of whether you use a local or remote database. Hangfire is capable of creating the necessary tables for job storage, but it cannot create a database. Therefore, you must provide a database.
&nbsp;  
##### Once you have set up our local database, you must update the appsettings.json file:
```json

"ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=Hangfire;Trusted_Connection=True"
}

```
&nbsp;  

#### Program.cs setup:
&nbsp;  
##### You need to add Hangfire to Services collection.
&nbsp;  
##### You need to provide the connection string that you specified inside the appsettings.json file.
```csharp

builder.Services.AddHangfire(x =>
{
    x.UseSqlServerStorage(builder.Configuration
                          .GetConnectionString("DefaultConnection"));
})

```
&nbsp;  
##### You also add the Hangfire server with the AddHangfireServer() method.
```csharp

builder.Services.AddHangfireServer();

```
&nbsp;  
##### Lastly, you can add Hangfire Dashboard for easily monitoring servers and jobs.By calling the UseHangfireDashboard() method you are adding it to popeline.
```csharp

app.UseHangfireDashboard();
```
&nbsp;  
##### DI registration:
```csharp

builder.Services.AddHostedService&lt;SomeService&gt;();
```
&nbsp;  
&nbsp;  
### Running the application
&nbsp;  
&nbsp;  

#### Persistence:
&nbsp;  
##### Hangfire will automatically check your storage for the necessary tables, and if they don’t exist, it will create them for you:
![Hangfire Database](/images/blog/posts/jobs-in-dotnet-with-hangfire/hangfire-database.jpg)
&nbsp;  
#### Hangfire Dashboard:
&nbsp;  
##### This is a web-based UI that allows you to monitor the state of your background jobs. You can use the dashboard to view the status of jobs, retry failed jobs, and cancel running jobs if necessary. To check the dashboard you need to land on **/hangfire** page.
![Hangfire Database](/images/blog/posts/jobs-in-dotnet-with-hangfire/hangfire-page.png)


&nbsp;  
&nbsp;  
### Background jobs
&nbsp;  
&nbsp;  
##### There are several types of background jobs that you can perform using Hangfire:
&nbsp;  

##### **- Fire-and-forget**:
##### These are jobs that are executed once and then forgotten. They are used for tasks that need to be performed in the background, but the result doesn't need to be returned to the application immediately.
&nbsp;  
##### **- Delayed jobs**:

##### These are jobs that are scheduled to run at a specific time in the future. You can use them to schedule tasks that need to be performed at a specific time, such as sending a reminder email to a user.
&nbsp;  

##### **- Recurring jobs**:

##### These are jobs that are scheduled to run repeatedly at a specified interval. You can use them to automate tasks that need to be performed on a regular basis, such as generating reports or performing database cleanup.
&nbsp;  

##### **- Continuations**:

##### These are jobs that are executed after a previous job has completed. You can use them to create a sequence of jobs that need to be performed in a specific order.
&nbsp;  

##### **- Batch jobs**:

##### These are jobs that are grouped together and executed as a single unit. You can use them to perform a set of related tasks that need to be executed together.

##### Let' take a look on the example:
```csharp

public interface IJobsService
{
    void FireAndForgetJob();
    void DelayedJob();
    void ReccuringJob();
    void Continuation();
    void BatchJob();
}
```
&nbsp;  
&nbsp;  
### Executing jobs
&nbsp;  
&nbsp;  

#### Fire and Forget jobs
&nbsp;  
##### We need to inject IBackgroundJobClient in order do call the job with Enqueue. 
&nbsp;  
##### Enqueueing a job means that you are adding it to a queue of jobs that are waiting to be processed. When a job is enqueued, it is not executed immediately but instead is stored in a persistent storage (usually a database) until a worker process is available to process it.
&nbsp;  
##### In order to test, you can create an endpoint:
```csharp

[HttpGet("FireAndForgetJob")]
public ActionResult CreateFireAndForgetJob()
{
    _jobClient.Enqueue(() => _jobsService.FireAndForgetJob());

    return Ok();
}

``` 
&nbsp;  

#### Delayed jobs
&nbsp;  
##### The Schedule method in the IBackgroundJobClient interface of the Hangfire library is used to schedule a job to run at a specific time in the future.
&nbsp;  
##### When you schedule a job using the Schedule method, you are specifying a delay or a specific date and time for the job to run. The job is added to a persistent storage (usually a database) and is executed automatically when the specified time is reached.
&nbsp;  
##### Let's create another endpoint:
```csharp

[HttpGet("DelayedJob")]
public ActionResult CreateDelayedJob()
{
    _jobClient.Schedule(() => _jobsService.DelayedJob(),
                            TimeSpan.FromSeconds(60));

    return Ok();
}

``` 
&nbsp;  

#### Continuation jobs
&nbsp;  
##### In other words, when you create a continuation job, you're saying **"once this other job is done, then run this one."** This can be useful for creating complex workflows where certain jobs need to run in a specific order, or where one job needs to finish before another can begin.
&nbsp;  
##### To create a continuation job in Hangfire, you first need to create the parent job using one of the library's scheduling methods, such as Enqueue or Schedule. Then, you can use the Continuations API to create the dependent job that will run after the parent job is finished.
&nbsp;  
##### Let's create another endpoint:
```csharp

[HttpGet("ContinuationJob")]
public ActionResult CreateContinuationJob()
{
    var parentJobId = _jobClient.Enqueue(() => _jobsService.FireAndForgetJob());

    _jobClient.ContinueJobWith(parentJobId, () => _jobsService.Continuation());

    return Ok();
}

``` 
&nbsp;  

#### Reccuring jobs
&nbsp;  
##### To schedule this job you will need a different Hangfire interface. You need to inject **IRecurringJobManager**. 
&nbsp;  
##### A recurring job is a task that needs to be performed repeatedly on a schedule. For example, sending a weekly email newsletter, or performing a daily database backup.
&nbsp;  
##### Using Hangfire's AddOrUpdate method, you can define the schedule for a recurring job using a cron expression, which is a string that specifies the frequency and timing of the job.
&nbsp;  
##### Here's how the AddOrUpdate method works: you first need to specify a unique identifier for the job, which will be used to identify it later. Then, you provide a lambda expression that defines the method to be executed as the job. Finally, you specify the cron expression that defines the job's schedule.
&nbsp;  
##### Let's create another endpoint:
```csharp

[HttpGet("ReccuringJob")]
public ActionResult CreateReccuringJob()
{
    _recurringJobManager.AddOrUpdate("jobId", () =>
                                     _jobsService.ReccuringJob(), Cron.Daily);

    return Ok();
}

``` 
&nbsp;  

#### Batch jobs (pro only)
&nbsp;  
##### Batches allow you to create a bunch of background jobs atomically. This means that if there was an exception during the creation of background jobs, none of them will be processed.
```csharp

var batchId = BatchJob.StartNew(x =>
{
    x.Enqueue(() => Console.WriteLine("Job 1"));
    x.Enqueue(() => Console.WriteLine("Job 2"));
})
``` 
&nbsp;  

##### That's all from me today.
&nbsp;  
##### Make a coffee and check the whole project on [GitHub repository](https://github.com/StefanTheCode/Newsletter/tree/main/10%23%20-%20Hangfire).
