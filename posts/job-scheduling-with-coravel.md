---
title: "Job Scheduling with Coravel"
subtitle: "Coravel is a zero-configuration, developer-friendly .NET library..."
readTime: "Read Time: 4 minutes"
date: "Apr 23 2025"
category: ".NET"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Coravel is a zero-configuration, developer-friendly .NET library."
---

<!--START-->
##### 🎉 **Random 50% OFF – Today Only!**
&nbsp;

##### Over 700 developers already upgraded their .NET skills with **[Design Patterns that Deliver](https://thecodeman.net/design-patterns-that-deliver-ebook)**. 
&nbsp;

##### Now it's your turn.
&nbsp;

##### 🧠 **What you get:**
&nbsp;

##### 📘 **Ebook 1:** 5 essential design patterns (Builder, Decorator, Strategy, Adapter, Mediator) across 120 pages
##### 📗 **Ebook 2:** 100+ design pattern interview Q&As
##### 💡 Advanced techniques, real-world case studies, and a full GitHub repo with 20+ C# mini-projects
&nbsp;

##### This blog is free — and so is the discount for you.
&nbsp;

##### Use code **RANDOM** at checkout.
&nbsp;

##### Join now to lock in early access when it drops - plus get everything else already inside the group.
&nbsp;

##### [Get it now](https://thecodeman.net/design-patterns-that-deliver-ebook)

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