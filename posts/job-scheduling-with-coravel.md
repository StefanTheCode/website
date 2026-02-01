---
title: "Job Scheduling with Coravel"
subtitle: "Learn how to leverage Coravel, a lightweight open-source .NET library, to add intuitive background job scheduling, queuing, event broadcasting, caching, and mailing to your applications."
readTime: "Read Time: 4 minutes"
date: "Feb 02 2026"
category: ".NET"
meta_description: "Discover how to use Coravel to add simple, powerful background job scheduling and more to your .NET apps without extra infrastructure."
---

<!--START-->
##### This issue is **self-sponsored**.
##### By supporting my work and purchasing my products, you directly help me keep this newsletter free and continue creating high-quality, practical .NET content for the community. 
&nbsp;

##### Thank you for the support 🙌  
&nbsp;

##### P.S. I’m currently building a new course, [Pragmatic .NET Code Rules](https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website&utm_campaign=020226), focused on creating a predictable, consistent, and self-maintaining .NET codebase using .editorconfig, analyzers, Visual Studio code cleanup, and CI enforcement.
&nbsp;

##### The course is available for pre-sale until the official release, with early-bird pricing for early adopters.
##### You can find all the details [here]((https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website&utm_campaign=020226)).

&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  
##### Coravel is a lightweight open-source library that adds background job scheduling, queuing, caching, mailing, and event broadcasting to your .NET apps - all without requiring a separate infrastructure.
&nbsp;  

##### If you've ever wanted to schedule background jobs, queue tasks, send emails, or cache data in your .NET applications without the complexity of setting up external services like Hangfire, Redis, or Quartz.NET - **Coravel** is your answer.
&nbsp;  

##### Inspired by Laravel (PHP), Coravel brings elegant syntax and powerful background features to .NET with **zero configuration**. 
##### It's the perfect tool for developers who want simplicity without sacrificing power.

&nbsp;  
&nbsp;  
### Key Benefits:
&nbsp;  
&nbsp;  
##### • No database or message broker required
##### • Perfect for small to medium apps
##### • Fully integrates with ASP.NET Core dependency injection
##### • Clean and readable syntax
&nbsp;  
##### Let's see what you can do with Coravel.
&nbsp;  

&nbsp;  
&nbsp;  
### Task Scheduling
&nbsp;  
&nbsp;  

##### You can run jobs like cleaning logs, syncing files, or sending emails on a schedule with Coravel's scheduler.
&nbsp;  
##### Create job:

```csharp

public class SendDailyReportsEmailJob : IInvocable
{
    public Task Invoke()
    {
        Console.WriteLine("Sending daily report email...");
        return Task.CompletedTask;
    }
}
```
&nbsp;  

##### Register it:
```csharp

builder.Services.AddScheduler();
builder.Services.AddTransient<SendDailyReportsEmailJob>();
```
&nbsp;  
##### Schedule it:

```csharp

app.Services.UseScheduler(scheduler =>
{
    scheduler
        .Schedule<SendDailyReportsEmailJob>()
        .DailyAtHour(6); // Every day at 6 AM
});
```
&nbsp;  

##### You can also use:
&nbsp;  
##### • .Hourly()
##### • .EveryMinute()
##### • .Weekly()
##### • .Cron("*/5 * * * *") for advanced control

&nbsp;  
&nbsp;  
### Queued Background Jobs
&nbsp;  
&nbsp;  

##### You can avoid blocking the main thread for tasks like sending emails or processing files.
&nbsp;  
##### Create an Invocable Job:
```csharp

public class ProcessWebhook : IInvocable
{
    public Task Invoke()
    {
        Console.WriteLine("Webhook processed in background.");
        return Task.CompletedTask;
    }
}
```
&nbsp;  
##### Queue it:
```csharp

var dispatcher = app.Services.GetService<IDispatcher>();
await dispatcher.EnqueueAsync<ProcessWebhook>();
```
&nbsp;  

##### In-memory only: jobs are lost if the app restarts. Ideal for non-critical tasks.
&nbsp;  
&nbsp;  
### Event Broadcasting
&nbsp;  
&nbsp;  

##### Coravel's event system enables decoupled communication between services in the same app.
&nbsp;  
##### Define an Event:
```csharp

public record OrderPlacedEvent(int OrderId);
```
&nbsp;  
##### Create a Listener:
```csharp

public class SendThankYouEmail : IListener<OrderPlacedEvent>
{
    public Task HandleAsync(OrderPlacedEvent e)
    {
        Console.WriteLine($"Thank you email sent for order {e.OrderId}.");
        return Task.CompletedTask;
    }
}
```
&nbsp;  

##### Use it:
```csharp

await eventDispatcher.BroadcastAsync(new OrderPlacedEvent(123));
```

&nbsp;  
&nbsp;  
### Mailing with Razor Templates
&nbsp;  
&nbsp;  

##### Send beautiful, templated emails using Razor views.
&nbsp;  
##### Define a Mailable:
```csharp

public class WelcomeMailable : Mailable<User>
{
    public override void Build()
    {
        To(Model.Email)
            .Subject("Welcome to our platform!")
            .View("Emails.Welcome", Model);
    }
}
```
&nbsp;  
##### Send it:
```csharp

await mailer.SendAsync(new WelcomeMailable(user));
```
&nbsp;  

##### Supports view rendering from Razor Class Libraries or .cshtml files.

&nbsp;  
&nbsp;  
### Mailing with Razor Templates
&nbsp;  
&nbsp;  

##### Send beautiful, templated emails using Razor views.
&nbsp;  
##### Define a Mailable:
```csharp

public class WelcomeMailable : Mailable<User>
{
    public override void Build()
    {
        To(Model.Email)
            .Subject("Welcome to our platform!")
            .View("Emails.Welcome", Model);
    }
}
```
&nbsp;  
##### Send it:
```csharp

await mailer.SendAsync(new WelcomeMailable(user));
```
&nbsp;  

##### Supports view rendering from Razor Class Libraries or .cshtml files.

&nbsp;  
&nbsp;  
### Simple Caching
&nbsp;  
&nbsp;  

##### Built-in memory caching to store frequently used data.
&nbsp;  
##### Store and Retrieve from Cache:
```csharp

var data = cache.GetOrAdd("top-products", () =>
{
    return FetchTopProducts();
}, TimeSpan.FromMinutes(15));
```
&nbsp;  
##### No extra configuration or Redis needed.

&nbsp;  
&nbsp;  
### Real-World Example: Report Generator
&nbsp;  
&nbsp;  

##### Imagine an internal admin dashboard for a SaaS platform. You want to:
&nbsp;  

##### • Send a daily email with usage reports to the admin
##### • Cache report data for 30 minutes
##### • Queue email sending in background
##### • Use events when reports are generated
&nbsp;  

##### With Coravel:
##### Store and Retrieve from Cache:
```csharp

public class GenerateAndSendReportJob : IInvocable
{
    private readonly ICache _cache;
    private readonly IMailer _mailer;

    public GenerateAndSendReportJob(ICache cache, IMailer mailer)
    {
        _cache = cache;
        _mailer = mailer;
    }

    public async Task Invoke()
    {
        var report = _cache.GetOrAdd("daily-report", () => GenerateReport(), TimeSpan.FromMinutes(30));
        await _mailer.SendAsync(new ReportMailable(report));
    }
}
```
&nbsp;  
##### Schedule it:

```csharp

scheduler.Schedule<GenerateAndSendReportJob>()
    .DailyAtHour(8);
```


&nbsp;  
&nbsp;  
### Wrapping Up
&nbsp;  
&nbsp;  

##### Coravel proves that powerful background tasking in .NET doesn't need to be complex. 
&nbsp;  

##### It lets you focus on business logic instead of infrastructure, giving you everything you need to build responsive and maintainable apps - fast.
&nbsp;  

##### Whether you're building an admin dashboard, a SaaS backend, or a microservice with lightweight needs, Coravel is a sharp and elegant tool to keep in your arsenal.
&nbsp;  

##### You can add it through NuGet.
##### Here is the [Coravel repo](https://github.com/jamesmh/coravel).
&nbsp;  

##### That's all from me today. 
&nbsp;  
 
##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->