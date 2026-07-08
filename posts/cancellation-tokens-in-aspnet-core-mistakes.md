---
title: "Cancellation Tokens in ASP.NET Core: The Mistakes That Quietly Break Them"
subtitle: "Learn where CancellationToken silently gets dropped in ASP.NET Core - background services, Task.Run, EF Core, and HttpClient - and how to fix a request that never actually cancels."
date: "July 8 2026"
author: "Stefan Đokić"
category: "Performance"
readTime: "8 minutes"
meta_description: "A practical guide to CancellationToken mistakes in ASP.NET Core - dropped tokens in background services, EF Core, and HttpClient - and how to fix them."
---

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A word from this week's sponsor</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">Anton Martyniuk (Microsoft MVP and Software Architect) built a free <strong>.NET Developer Interview Test</strong>.</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">Find out your real level - Junior to Senior+ - in 15 minutes across 13 areas of C#, .NET, ASP.NET Core, and system design. No credit card required. When you finish, you get a personalized report: your level, your strongest areas, and where to focus next. A solid way to benchmark yourself before diving into a new learning plan.</p>

<a href="https://antondevtips.com/dotnet-developer-level-test?utm_source=stefandokic&utm_medium=email&utm_campaign=free-developer-test&utm_content=06-07-2026" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #1a0224; background: #ffbd39; border-radius: 8px; text-decoration: none;">Take the free test →</a>

<p style="margin: 16px 0 8px 0; font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.6);">Want to reach thousands of .NET developers like this?</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 7px 14px; font-size: 13px; font-weight: 600; color: #ffbd39; background: transparent; border: 1px solid #ffbd39; border-radius: 8px; text-decoration: none;">Sponsor TheCodeMan →</a>
</div>

**Keywords:** CancellationToken .NET, ASP.NET Core cancellation, RequestAborted, BackgroundService cancellation, Task.Run CancellationToken, EF Core cancellation, HttpClient cancellation, OperationCanceledException, graceful shutdown, IHostApplicationLifetime

## The Request That Wouldn't Die

A user closes a tab mid-request. The client disconnects. On a dashboard somewhere, that request should show as cancelled within milliseconds. Instead, it keeps running for another four seconds - hits the database, calls a downstream API, writes a result nobody will ever read.

Multiply that by a few thousand abandoned requests a day and you're paying for compute that serves no one. I've debugged this exact symptom more than once, and it's never one bug. It's a `CancellationToken` that got created correctly at the top of the pipeline and then quietly stopped being passed down.

ASP.NET Core gives you cancellation almost for free. The token exists, it's wired into the request pipeline, and the framework cancels it the moment the client disconnects. The mistakes all happen after that point - in the code that forgets the token exists.

## Where the Token Actually Comes From

Every HTTP request in ASP.NET Core carries a token you can ask for directly:

```csharp
app.MapGet("/reports/{id}", async (int id, HttpContext http, ReportService service) =>
{
    // This token fires when the client disconnects, the request times out,
    // or the server starts shutting down - whichever happens first.
    CancellationToken ct = http.RequestAborted;
    var report = await service.BuildReportAsync(id, ct);
    return Results.Ok(report);
});
```

You rarely need `HttpContext.RequestAborted` explicitly - minimal API handlers and MVC actions can just take a `CancellationToken` parameter and the framework binds `RequestAborted` to it automatically:

```csharp
app.MapGet("/reports/{id}", async (int id, ReportService service, CancellationToken ct) =>
{
    var report = await service.BuildReportAsync(id, ct);
    return Results.Ok(report);
});
```

That's the whole contract: the token is handed to you, and your job is to pass it to every awaited call underneath. The mistakes below are all versions of breaking that chain.

## Mistake #1: Swallowing the Token in a Service Layer

The most common break happens one layer down, where a method signature quietly drops the parameter:

```csharp
// Before - the token stops here
public class ReportService
{
    private readonly AppDbContext _db;
    private readonly HttpClient _pricingClient;

    public async Task<Report> BuildReportAsync(int id)
    {
        var order = await _db.Orders.FindAsync(id);          // no token
        var pricing = await _pricingClient.GetAsync($"/price/{id}"); // no token
        return Map(order, pricing);
    }
}
```

Nothing here throws. Nothing looks wrong in a code review unless you're specifically checking for it. But the request is now uncancellable from this point on - the client can vanish and the database query and the HTTP call both run to completion anyway.

```csharp
// After - the token rides along through every await
public class ReportService
{
    private readonly AppDbContext _db;
    private readonly HttpClient _pricingClient;

    public async Task<Report> BuildReportAsync(int id, CancellationToken ct)
    {
        var order = await _db.Orders.FindAsync(new object[] { id }, ct);
        var pricing = await _pricingClient.GetAsync($"/price/{id}", ct);
        return Map(order, pricing);
    }
}
```

The rule I use: if a method awaits anything, it takes a `CancellationToken`, full stop. An analyzer like `CA2016` (part of the built-in .NET analyzers) will flag most of these for you - turn it on as a warning, not just a suggestion.

## Mistake #2: `Task.Run` With No Token, or the Wrong One

`Task.Run` has two overloads, and it's easy to call the one that leaves your work uncancellable:

```csharp
// Before - the token is never given to the work itself
public async Task<byte[]> GenerateExportAsync(int reportId, CancellationToken ct)
{
    return await Task.Run(() => BuildExportBytes(reportId));
}
```

Passing `ct` to `Task.Run` only stops the task from *starting* if it's already cancelled - it does nothing once the delegate is running, because `BuildExportBytes` has no way to observe cancellation from the inside.

```csharp
// After - the token goes into the work, not just into Task.Run
public async Task<byte[]> GenerateExportAsync(int reportId, CancellationToken ct)
{
    return await Task.Run(() => BuildExportBytes(reportId, ct), ct);
}

private byte[] BuildExportBytes(int reportId, CancellationToken ct)
{
    for (int page = 0; page < TotalPages(reportId); page++)
    {
        ct.ThrowIfCancellationRequested(); // checked between chunks of CPU-bound work
        RenderPage(reportId, page);
    }
    return Serialize(reportId);
}
```

For CPU-bound loops, call `ct.ThrowIfCancellationRequested()` between iterations, not just once at the top. A loop that checks the token once and then grinds for ten seconds isn't meaningfully cancellable.

## Mistake #3: Swallowing `OperationCanceledException`

Cancellation in .NET works by throwing. When a token fires, the next awaited operation throws an `OperationCanceledException` (or its subclass `TaskCanceledException`). A broad `catch` block that logs every exception as an error will happily catch this too - and now your logs are full of "failures" that are actually just users closing tabs:

```csharp
// Before - every cancelled request looks like a crash in your logs
try
{
    await service.BuildReportAsync(id, ct);
}
catch (Exception ex)
{
    _logger.LogError(ex, "Report generation failed");
    throw;
}
```

```csharp
// After - cancellation is expected, not exceptional
try
{
    await service.BuildReportAsync(id, ct);
}
catch (OperationCanceledException) when (ct.IsCancellationRequested)
{
    _logger.LogDebug("Report generation cancelled by client for id {Id}", id);
    throw; // still propagate - let ASP.NET Core turn this into the right response
}
catch (Exception ex)
{
    _logger.LogError(ex, "Report generation failed");
    throw;
}
```

ASP.NET Core already knows how to handle an unhandled `OperationCanceledException` tied to `RequestAborted` - it ends the request without writing a 500. Your job is just to not disguise it as one first.

## Mistake #4: Assuming a Background Service Gets the Request's Token

This one trips people up because it looks like the opposite problem. A `BackgroundService` has its own `CancellationToken` - `stoppingToken` - and it has nothing to do with any HTTP request. It only fires when the *host* is shutting down.

```csharp
public class OutboxProcessor : BackgroundService
{
    private readonly IServiceProvider _services;

    public OutboxProcessor(IServiceProvider services) => _services = services;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // stoppingToken here means "the app is shutting down",
            // not "this particular batch was cancelled by someone"
            await ProcessPendingMessagesAsync(db, stoppingToken);
            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        }
    }
}
```

If you fire off background work from inside a request handler and pass `RequestAborted` into it, you've built a bug: the background work dies the instant the HTTP response is sent, because that's when `RequestAborted` fires too on some hosting setups, or at best when the client disconnects. Background work that should outlive the request needs its own token - typically `IHostApplicationLifetime.ApplicationStopping`, not the request's token:

```csharp
app.MapPost("/reports/{id}/export", async (
    int id,
    ReportService service,
    IHostApplicationLifetime lifetime) =>
{
    // Intentionally NOT using RequestAborted - this should
    // keep running even after the response is sent.
    _ = service.GenerateExportAsync(id, lifetime.ApplicationStopping);
    return Results.Accepted();
});
```

The distinction to hold onto: `RequestAborted` means "this request's caller is gone." `ApplicationStopping` means "the process is shutting down." Using one where you mean the other either kills work too early or leaks work that should have died with the request.

## Mistake #5: Linking Tokens Without Realizing You Need To

Sometimes one operation needs to respect *two* cancellation sources at once - the request's token and a timeout you're adding on top. Forgetting to combine them means one of the two silently does nothing:

```csharp
public async Task<Pricing> GetPricingWithTimeoutAsync(int id, CancellationToken requestCt)
{
    using var timeoutCts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
    using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(requestCt, timeoutCts.Token);

    // linkedCts.Token fires on whichever happens first:
    // the client disconnecting, or the 3-second timeout
    var response = await _pricingClient.GetAsync($"/price/{id}", linkedCts.Token);
    return await response.Content.ReadFromJsonAsync<Pricing>(linkedCts.Token);
}
```

Without the link, a hardcoded timeout token used alone ignores client disconnects, and the request's token used alone ignores your timeout. `CreateLinkedTokenSource` is the fix any time cancellation needs to come from more than one place.

## A Threshold Worth Setting

Not every method needs a `CancellationToken` parameter - a pure synchronous calculation doesn't await anything, so there's nothing to cancel. The line I actually use:

- **Anything that awaits I/O** (database, HTTP, file, queue) - takes a token, passes it down, no exceptions.
- **CPU-bound loops longer than a few milliseconds** - check `ThrowIfCancellationRequested()` periodically inside the loop, not just at entry.
- **Fire-and-forget work started from a request** - never use `RequestAborted`. Use `ApplicationStopping`, or better, hand it to a proper background queue instead of `_ = SomeAsync(...)`.
- **Logging cancellation** - `LogDebug` or lower, never `LogError`. It's not a failure.

## FAQ

### What's the difference between `CancellationToken.None` and not passing a token at all?

They end up the same in practice - `CancellationToken.None` is what you get when a method doesn't accept a token, or when you explicitly pass it. Either way, the operation can't be cancelled. Passing `CancellationToken.None` on purpose should be rare and deliberate, like in a background service running outside any request context that genuinely needs to finish no matter what.

### Should `HttpContext.RequestAborted` be used directly, or should I take a `CancellationToken` parameter?

Take the parameter. ASP.NET Core model binding fills a `CancellationToken` parameter in a minimal API handler or controller action with `RequestAborted` automatically, and it reads cleaner than reaching into `HttpContext`. Reserve the explicit `HttpContext.RequestAborted` access for code that doesn't have direct access to the parameter, like a filter or middleware.

### Why does my `BackgroundService` stop mid-batch when I redeploy?

Because `stoppingToken` fires on `ApplicationStopping`, and the default host shutdown timeout is short. If a batch needs to finish cleanly, either shorten your batch size so one unit of work fits inside the shutdown window, or increase `HostOptions.ShutdownTimeout` - but don't rely on an unbounded shutdown timeout, since the host (or your orchestrator) will eventually force-kill the process regardless.

### Does catching `OperationCanceledException` and not rethrowing break anything?

It depends on where. Inside a request handler, swallowing it without rethrowing means ASP.NET Core never gets the signal that the request was cancelled, so it may still try to write a response to a connection that's already gone - which throws its own exception further up. Rethrow it and let the framework handle the response lifecycle; only catch it locally to add a debug log or clean up a resource.

## Wrapping Up

`CancellationToken` in ASP.NET Core isn't a feature you opt into - it's already there, threaded through the request pipeline the moment a request arrives. Every mistake in this post is really the same mistake in different clothes: a method that awaits something without taking the token that was handed to it.

Thread it through every service method that awaits I/O. Check it inside long CPU-bound loops. Keep `RequestAborted` and `ApplicationStopping` separate in your head - one dies with the request, one dies with the process. Get those two things right and cancellation stops being a feature you forgot to use and starts being the reason your API doesn't burn compute on work nobody's waiting for anymore.

That's all from me today.

<!--END-->
