---
title: "Building a Resilient API in ASP.NET Core 9"
subtitle: "What if your app could handle those hiccups gracefully without crashing or stressing out your users?"
date: "May 19 2025"
category: ".NET"
readTime: "Read Time: 5 minutes"
meta_description: "Microsoft.Extensions.Resilience is a set of libraries that help you: Retry failed operations, Set timeouts, Break circuits on repeated failures, Control request rates, Send backup (hedged) requests"
---

<!--START-->
Startups can’t afford to lose users over broken features. With TestSprite’s fully autonomous AI testing, you can catch issues early with less effort from your QA team—and greater accuracy. Ship faster, smarter, and with confidence. Try it now at [testsprite.com](testsprite.com).
[Join here](testsprite.com)

## Background
Hey friends! 👋

In today’s cloud-connected world, we’re constantly making HTTP calls to external APIs, microservices, or third-party integrations. But let’s face it: networks can be flaky, services can slow down, and stuff just... breaks.

What if your app could handle those hiccups **gracefully** without crashing or stressing out your users?

Great news! .NET 8 and 9 introduced a **first-party library** for building resilient apps: Microsoft.Extensions.Resilience. 

Think of it like [Polly](https://thecodeman.net/posts/retry-failed-api-calls-with-polly), but built into .NET, fully supported by Microsoft, and super easy to plug into your existing setup.

Let’s break it all down in a **friendly, real-world way** - with full code, strategy-by-strategy explanations, and Minimal API examples.

## What is Microsoft.Extensions.Resilience?
It's a set of libraries that help you:
• Retry failed operations
• Set timeouts
• Break circuits on repeated failures
• Control request rates
• Send backup (hedged) requests
All of these are called **resilience strategies**, and you can mix and match them using a composable pipeline.
You get full integration with HttpClientFactory, DI, logging, and even [OpenTelemetry](https://thecodeman.net/posts/getting-started-with-opentelemetry).

## Project Setup

Add required packages:

```csharp
dotnet add package Microsoft.Extensions.Http.Resilience
dotnet add package Microsoft.Extensions.Resilience
```

## Resilience Pipelines

To apply resilience, you need to build a pipeline made up of different resilience strategies. These strategies run in the exact order you define them -so the order really matters.
You begin by creating a **ResiliencePipelineBuilder**, which 

```csharp
ResiliencePipeline pipeline = new()
    .AddRetry(new RetryStrategyOptions
    {
        ShouldHandle = new PredicateBuilder().Handle<ConflictException>(),
        Delay = TimeSpan.FromSeconds(2),
        MaxRetryAttempts = 3,
        BackoffType = DelayBackoffType.Exponential,
        UseJitter = true
    })
    .AddTimeout(new TimeoutStrategyOptions
    {
        Timeout = TimeSpan.FromSeconds(5)
    })
    .Build();

await pipeline.ExecuteAsync(
    async ct => await httpClient.GetAsync("/api/weather", ct),
    cancellationToken);
```

Now let’s break down each strategy...

## Retry Strategy

<center> *"Try again if it fails... but not forever."* </center>
A retry strategy lets you retry an operation that failed due to transient issues (like a timeout or HTTP 500).

Why?
• Temporary failures are common in distributed systems.
• Retry gives the system time to recover.
Example:
```csharp
builder.Services.AddResiliencePipeline("retry-pipeline", builder =>
{
    builder.AddRetry(new RetryStrategyOptions
    {
        MaxRetryAttempts = 3,
        Delay = TimeSpan.FromMilliseconds(300),
        BackoffType = DelayBackoffType.Exponential,
        ShouldHandle = new PredicateBuilder().Handle<HttpRequestException>()
    });
});
```
This retries 3 times, with exponentially increasing delay: 300ms, 600ms, 1200ms...

## Timeout Strategy

<center> *"Don’t hang forever. Bail out if it’s too slow."* </center>
The timeout strategy sets a max duration for how long an operation can run. If it’s too slow - it’s out.

Why?
• You don’t want threads hanging forever.
• It’s better to fail fast and free resources.
Example:
```csharp
builder.Services.AddResiliencePipeline("timeout-pipeline", builder =>
{
    builder.AddTimeout(TimeSpan.FromSeconds(2));
});
```
If your external service doesn’t respond in 2 seconds, it fails and triggers the next strategy (like retry)...

## Circuit Breaker Strategy

<center> *"If something keeps failing, stop trying for a while."* </center>
The circuit breaker temporarily blocks calls to a failing system, preventing overload and giving it time to recover.

Why?
• Avoid hammering a broken service.
• Let things cool off.
Example:
```csharp
builder.Services.AddResiliencePipeline("cb-pipeline", builder =>
{
    builder.AddCircuitBreaker(new CircuitBreakerStrategyOptions
    {
        FailureRatio = 0.5,
        MinimumThroughput = 10,
        SamplingDuration = TimeSpan.FromSeconds(30),
        BreakDuration = TimeSpan.FromSeconds(15)
    });
});
```
If 2 out of 4 calls fail within 10 seconds, the breaker "trips" and all further calls fail fast for 20 seconds.

## Hedging Strategy

<center> *"If you're not getting a reply, ask someone else too - just in case."* </center>
The hedging strategy sends secondary requests after a delay if the primary one is too slow or might fail. It’s like having a plan B running in parallel.

Why?
• Reduce latency spikes.
• Improve success rate by racing multiple attempts.
Example:
```csharp
builder.Services.AddResiliencePipeline<string, string>("gh-hedging", builder =>
{
    builder.AddHedging(new HedgingStrategyOptions<string>
    {
        MaxHedgedAttempts = 3,
        DelayGenerator = args =>
        {
            var delay = args.AttemptNumber switch
            {
                0 or 1 => TimeSpan.Zero, // Parallel mode
                _ => TimeSpan.FromSeconds(-1) // Fallback mode
            };

            return new ValueTask<TimeSpan>(delay);
        }
    });
});
```
With this configuration, the hedging strategy:
- Initiates a maximum of 4 executions. This includes initial action and an additional 3 attempts.
- Allows the first two executions to proceed in parallel, while the third and fourth executions follow the fallback mode.

## Fallback Strategy

<center> *"If something keeps failing, have a backup plan."* </center>
The fallback strategy provides an alternative response when a primary operation fails, helping your app stay functional even when things go wrong.

Why?
• Avoid crashing the user experience.
• Stay graceful under pressure.
Example:
```csharp
builder.Services.AddResiliencePipeline<string, string?>("gh-fallback", builder =>
{
    builder.AddFallback(new FallbackStrategyOptions<string?>
    {
        FallbackAction = _ =>
            Outcome.FromResultAsValueTask<string?>(string.Empty)
    });
});
```

## [Rate Limiting](https://thecodeman.net/posts/how-to-implement-rate-limiter-in-csharp) Strategy

<center> *"Too many requests? Slow down before you burn out."* </center>
The rate limiter strategy controls how many calls your system can make within a time window - protecting resources and avoiding service throttling.

Why?
• Prevent overwhelming dependencies.
• Ensure fair usage and system stability.
Example:
```csharp
builder.Services.AddResiliencePipeline("ratelimiter-pipeline", builder =>
{
    builder.AddRateLimiter(new SlidingWindowRateLimiter(
        new SlidingWindowRateLimiterOptions
        {
            PermitLimit = 100,
            SegmentsPerWindow = 4,
            Window = TimeSpan.FromMinutes(1)
        }
    ));
});
```

##  Using ResiliencePipelineProvider to Apply Resilience Automatically

When you're working with resilience in .NET and using **Dependency Injection**, you don’t need to manually build your pipeline every time. 

Instead, you can ask the ResiliencePipelineProvider to fetch a configured pipeline by its key.

Here's how it works:
• You define your pipeline (e.g., with a fallback or retry strategy)  and register it using a key like "gh-fallback".
• Then, inside your route or handler, you request that pipeline using GetPipeline<T>(), where T is the expected result type.
```csharp
app.MapGet("/subscribers", async (
    HttpClient httpClient,
    ResiliencePipelineProvider<string> pipelineProvider,
    CancellationToken cancellationToken) =>
{
    var pipeline = pipelineProvider.GetPipeline<Subscriber?>("gh-fallback");

    return await pipeline.ExecuteAsync(
        async token =>
            await httpClient.GetFromJsonAsync<Subscriber>("api/subscribers", token),
        cancellationToken);
});
```

## Wrapping Up

Microsoft’s new Microsoft.Extensions.Resilience stack makes it easier than ever to apply production-grade resilience across your entire .NET application.

You don’t need to reinvent the wheel with Polly yourself - use the official pipeline abstraction, build named strategies, and compose reusable policies that apply to your internal services or third-party APIs.

Use retry + timeout + circuit breaker as your minimum standard for every external call. And if you want even more flexibility, customize the heck out of it!

That's all from me today. 
 
P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

Want to enforce clean code automatically? My [Pragmatic .NET Code Rules](/pragmatic-dotnet-code-rules) course shows you how to set up analyzers, CI quality gates, and architecture tests - a production-ready system that keeps your codebase clean without manual reviews. Or grab the [free Starter Kit](/dotnet-code-rules-starter-kit) to try it out.

<!--END-->



