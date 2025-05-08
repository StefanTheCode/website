---
newsletterTitle: "#10 Stefan's Newsletter"
title: "Jobs in .NET with Hangfire"
subtitle: "Hangfire is an open-source library for .NET that provides a simple way to perform background processing in your application..."
readTime: "Read Time: 6 minutes"
date: "Apr 17 2023"
category: ".NET"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Efficiently manage background jobs in .NET with Hangfire: A complete guide to setting up, executing, and monitoring various job types, including fire-and-forget and recurring tasks."
---

&nbsp;  
&nbsp;  
### What is Hangfire and how it's working?
&nbsp;  
&nbsp;  
##### There are 3 main components of Hangfire architecture:
&nbsp; 
##### **1. Client**
##### This is the code in your application that enqueues background jobs and schedules them to run at a specific time or on a recurring basis. The client API provides a simple way to create and manage background jobs from within your code.
&nbsp; 

##### **2. Server**
##### This is a background process that runs continuously and is responsible for executing scheduled and queued jobs. It listens to the job storage and picks up new jobs as they become available.
&nbsp; 

##### **3. Storage**
##### Hangfire provides a database to store all the information related to background jobs, including their definitions, execution status, and more. Hangfire creates a couple of designated tables in the database to manage this information.
&nbsp; 

##### By default, it uses SQL Server, but any other supported option is also easy to configure.
&nbsp; 

##### Here is the Hangfire workflow.
![Hangfire flow](/images/blog/posts/jobs-in-dotnet-with-hangfire/hangfire-flow.png)

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
