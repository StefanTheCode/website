---
title: "Job Scheduling with Coravel"
subtitle: "Learn how to leverage Coravel, a lightweight open-source .NET library, to add intuitive background job scheduling, queuing, event broadcasting, caching, and mailing to your applications."
date: "Feb 02 2026"
category: ".NET"
readTime: "Read Time: 4 minutes"
meta_description: "Discover how to use Coravel to add simple, powerful background job scheduling and more to your .NET apps without extra infrastructure."
---

<!--START-->
This issue is **self-sponsored**.
By supporting my work and purchasing my products, you directly help me keep this newsletter free and continue creating high-quality, practical .NET content for the community. 

Thank you for the support 🙌  

P.S. I’m currently building a new course, [Pragmatic .NET Code Rules](https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website&utm_campaign=020226), focused on creating a predictable, consistent, and self-maintaining .NET codebase using .editorconfig, analyzers, Visual Studio code cleanup, and CI enforcement.

The course is available for pre-sale until the official release, with early-bird pricing for early adopters.
You can find all the details [here](https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website&utm_campaign=020226).

## Background
Coravel is a lightweight open-source library that adds background job scheduling, queuing, caching, mailing, and event broadcasting to your .NET apps - all without requiring a separate infrastructure.

If you've ever wanted to schedule background jobs, queue tasks, send emails, or cache data in your .NET applications without the complexity of setting up external services like [Hangfire](https://thecodeman.net/posts/jobs-in-dotnet-with-hangfire), Redis, or Quartz.NET - **Coravel** is your answer.

Inspired by Laravel (PHP), Coravel brings elegant syntax and powerful background features to .NET with **zero configuration**. 
It's the perfect tool for developers who want simplicity without sacrificing power.

## Key Benefits:
• No database or message broker required
• Perfect for small to medium apps
• Fully integrates with ASP.NET Core dependency injection
• Clean and readable syntax
Let's see what you can do with Coravel.

## Task Scheduling

You can run jobs like cleaning logs, syncing files, or [sending emails](https://thecodeman.net/posts/how-to-send-email-in-5min-with-fluentemail) on a schedule with Coravel's scheduler.
Create job:

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

Register it:
```csharp

builder.Services.AddScheduler();
builder.Services.AddTransient<SendDailyReportsEmailJob>();
```
Schedule it:

```csharp

app.Services.UseScheduler(scheduler =>
{
    scheduler
        .Schedule<SendDailyReportsEmailJob>()
        .DailyAtHour(6); // Every day at 6 AM
});
```

You can also use:
• .Hourly()
• .EveryMinute()
• .Weekly()
• .Cron("*/5 * * * *") for advanced control

## Queued Background Jobs

You can avoid blocking the main thread for tasks like sending emails or processing files.
Create an Invocable Job:
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
Queue it:
```csharp

var dispatcher = app.Services.GetService<IDispatcher>();
await dispatcher.EnqueueAsync<ProcessWebhook>();
```

In-memory only: jobs are lost if the app restarts. Ideal for non-critical tasks.
## Event Broadcasting

Coravel's event system enables decoupled communication between services in the same app.
Define an Event:
```csharp

public record OrderPlacedEvent(int OrderId);
```
Create a Listener:
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

Use it:
```csharp

await eventDispatcher.BroadcastAsync(new OrderPlacedEvent(123));
```

## Mailing with Razor Templates

Send beautiful, templated emails using Razor views.
Define a Mailable:
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
Send it:
```csharp

await mailer.SendAsync(new WelcomeMailable(user));
```

Supports view rendering from Razor Class Libraries or .cshtml files.

## Mailing with Razor Templates

Send beautiful, templated emails using Razor views.
Define a Mailable:
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
Send it:
```csharp

await mailer.SendAsync(new WelcomeMailable(user));
```

Supports view rendering from Razor Class Libraries or .cshtml files.

## Simple Caching

Built-in memory caching to store frequently used data.
Store and Retrieve from Cache:
```csharp

var data = cache.GetOrAdd("top-products", () =>
{
    return FetchTopProducts();
}, TimeSpan.FromMinutes(15));
```
No extra configuration or Redis needed.

## Real-World Example: Report Generator

Imagine an internal admin dashboard for a SaaS platform. You want to:

• Send a daily email with usage reports to the admin
• Cache report data for 30 minutes
• Queue email sending in background
• Use events when reports are generated

With Coravel:
Store and Retrieve from Cache:
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
Schedule it:

```csharp

scheduler.Schedule<GenerateAndSendReportJob>()
    .DailyAtHour(8);
```


For heavier workloads, see [Background Jobs with Hangfire](https://thecodeman.net/posts/jobs-in-dotnet-with-hangfire). For built-in solutions, check [Background Tasks in .NET 8](https://thecodeman.net/posts/background-tasks-in-dotnet8).

## Wrapping Up

Coravel proves that powerful background tasking in .NET doesn't need to be complex. 

It lets you focus on business logic instead of infrastructure, giving you everything you need to build responsive and maintainable apps - fast.

Whether you're building an admin dashboard, a SaaS backend, or a microservice with lightweight needs, Coravel is a sharp and elegant tool to keep in your arsenal.

You can add it through NuGet.
Here is the [Coravel repo](https://github.com/jamesmh/coravel).

That's all from me today. 
 
P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->


