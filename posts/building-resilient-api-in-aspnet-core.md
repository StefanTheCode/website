---
title: "Building Resilient APIs in ASP.NET Core"
subtitle: "Your external API calls will fail. The question is whether your application handles it gracefully - or crashes. Here's how I build resilient APIs in every .NET project."
date: "Apr 08 2026"
category: ".NET"
readTime: "Read Time: 8 minutes"
meta_description: "Learn how to build resilient APIs in ASP.NET Core (.NET 10) using Microsoft.Extensions.Resilience. Step-by-step guide covering retry, timeout, circuit breaker, hedging, fallback, and rate limiting strategies with production-ready code examples."
---

<!--START-->

## The Background

Let's be honest:

Every API you call **will fail** at some point.

The database times out. The third-party service returns a 503. The network hiccups for 200 milliseconds. A downstream microservice is deploying and temporarily unavailable.

I've seen all of these in production. Multiple times. And the difference between an app that crashes and one that recovers gracefully comes down to one thing: **resilience**.

For a long time, if you wanted resilience in .NET, you had to bring in [Polly](https://thecodeman.net/posts/retry-failed-api-calls-with-polly) and wire everything up manually. It worked, but it was a lot of setup.

**That's no longer the case.**

.NET now ships with a first-party resilience library: **Microsoft.Extensions.Resilience**. It's built on top of Polly v8, fully supported by Microsoft, and integrates directly with `HttpClientFactory`, dependency injection, logging, and [OpenTelemetry](https://thecodeman.net/posts/getting-started-with-opentelemetry).

In this article, I'll walk you through every resilience strategy I use in production - with full code examples, practical explanations, and a Minimal API setup you can copy into your .NET 10 project today.

Let's dive in.

## What Is Microsoft.Extensions.Resilience?

Before we write any code, let me explain what this library actually gives you.

**Microsoft.Extensions.Resilience** is a set of packages that let you build composable resilience pipelines. A pipeline is a chain of strategies that wrap your operation - retry, timeout, circuit breaker, and so on.

Here's what you can do with it:
<br/>
• **Retry** failed operations with exponential backoff
<br/>
• **Set timeouts** so you never hang forever
<br/>
• **Break circuits** on repeated failures to stop hammering broken services
<br/>
• **Hedge requests** by sending backup calls in parallel
<br/>
• **Fall back** to default responses when everything fails
<br/>
• **Rate limit** outgoing calls to protect downstream services

All of these are composable. You mix and match them in a single pipeline, and they execute in the order you define them.

The best part? Full integration with `HttpClientFactory`, DI, structured logging, and OpenTelemetry - out of the box.

## Project Setup

You need two NuGet packages. Run this in your .NET 10 project:

```csharp
dotnet add package Microsoft.Extensions.Http.Resilience
dotnet add package Microsoft.Extensions.Resilience
```

`Microsoft.Extensions.Http.Resilience` is for HTTP-specific resilience (wrapping `HttpClient` calls). `Microsoft.Extensions.Resilience` is for general-purpose resilience - any async operation.

That's it for setup. Let's build pipelines.

## Resilience Pipelines - How They Work

The core concept is simple: you create a **pipeline** made up of **strategies**. Each strategy handles a specific failure scenario. The strategies run in the exact order you add them - so order matters.

You start with a `ResiliencePipelineBuilder`, add your strategies, and call `Build()`:

```csharp
ResiliencePipeline pipeline = new ResiliencePipelineBuilder()
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

In this example, if the HTTP call throws a `ConflictException`, the retry strategy kicks in - up to 3 times, with exponential backoff and jitter. If the entire operation exceeds 5 seconds, the timeout kills it.

Now let me break down each strategy individually. I use all of these in my production projects.

## Retry Strategy

This is the strategy I use most often. Temporary failures are the norm in distributed systems. A retry with exponential backoff gives the failing service time to recover without hammering it with requests.

Here's how I register a retry pipeline:

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

This retries up to 3 times with exponentially increasing delays: ~300ms, ~600ms, ~1200ms.

**Why exponential backoff?** Because if the service is overloaded, sending requests every 300ms makes it worse. Backing off gradually gives it breathing room.

**Why jitter?** If 50 clients all retry at the exact same intervals, they create a "retry storm." Adding `UseJitter = true` randomizes the delays slightly so requests spread out.

## Timeout Strategy

I've seen APIs wait 30+ seconds for a response that never comes - holding threads, exhausting connection pools, degrading the entire application. A timeout prevents that.

```csharp
builder.Services.AddResiliencePipeline("timeout-pipeline", builder =>
{
    builder.AddTimeout(TimeSpan.FromSeconds(2));
});
```

If the external service doesn't respond within 2 seconds, the operation fails with a `TimeoutRejectedException`.

**Pro tip:** When you combine timeout with retry, the timeout should be the **inner** strategy (added after retry). This way, each individual attempt gets a timeout, and if it times out, the retry strategy can try again.

## Circuit Breaker Strategy

This one has saved me multiple times in production. Without a circuit breaker, your app keeps sending requests to a broken service - wasting resources and potentially cascading the failure.

The circuit breaker monitors failure rates. When too many calls fail within a time window, it "trips" and short-circuits all future calls immediately - without even hitting the network.

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

Here's what this does:
<br/>
• Monitors calls over a 30-second window
<br/>
• If at least 10 calls are made and 50% or more fail, the circuit **opens**
<br/>
• All calls fail immediately for 15 seconds (no network call)
<br/>
• After 15 seconds, it moves to **half-open** and allows one test call through
<br/>
• If that call succeeds, the circuit **closes** and traffic resumes normally

This is essential for any service that talks to external APIs.

## Hedging Strategy

Hedging is something I use less frequently, but it's incredibly powerful for latency-sensitive operations. Instead of waiting for one slow response, you can race multiple requests.

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
                0 or 1 => TimeSpan.Zero,
                _ => TimeSpan.FromSeconds(-1)
            };

            return new ValueTask<TimeSpan>(delay);
        }
    });
});
```

With this configuration:
<br/>
• Up to 4 total executions (1 primary + 3 hedged attempts)
<br/>
• The first two run in **parallel** (`TimeSpan.Zero` delay)
<br/>
• The remaining run in **fallback mode** (`TimeSpan.FromSeconds(-1)`)
<br/>
• Whichever completes first wins - the rest are cancelled

This is particularly useful when you have multiple replicas of a service and can route hedged requests to different instances.

## Fallback Strategy

A fallback is your last line of defense. Instead of showing users an error page, you return cached data, a default value, or a degraded response.

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

In a real project, I typically return cached data here instead of an empty string. The point is: the user gets *something* instead of a 500 error.

## [Rate Limiting](https://thecodeman.net/posts/how-to-implement-rate-limiter-in-csharp) Strategy

If you're calling a third-party API with rate limits (most of them have one), you want to throttle your own requests before the external service does it for you with a 429.

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

This allows up to 100 requests per minute, with the window divided into 4 segments (15 seconds each) for smoother rate distribution.

## Using ResiliencePipelineProvider in Your Endpoints

In a real project, you don't build pipelines manually every time. You register them once in DI and inject them wherever you need them.

Here's how I use it in a Minimal API endpoint:

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

You define your pipeline once with `AddResiliencePipeline("gh-fallback", ...)`, and then fetch it by key using `ResiliencePipelineProvider`. Clean, testable, and reusable across your entire application.

## My Recommended Pipeline for Production

After using these strategies across multiple projects, here's the combination I always start with for external HTTP calls:

```csharp
builder.Services.AddResiliencePipeline("production-pipeline", builder =>
{
    builder
        .AddRetry(new RetryStrategyOptions
        {
            MaxRetryAttempts = 3,
            Delay = TimeSpan.FromMilliseconds(500),
            BackoffType = DelayBackoffType.Exponential,
            UseJitter = true,
            ShouldHandle = new PredicateBuilder().Handle<HttpRequestException>()
        })
        .AddCircuitBreaker(new CircuitBreakerStrategyOptions
        {
            FailureRatio = 0.5,
            MinimumThroughput = 10,
            SamplingDuration = TimeSpan.FromSeconds(30),
            BreakDuration = TimeSpan.FromSeconds(15)
        })
        .AddTimeout(TimeSpan.FromSeconds(5));
});
```

**Retry → Circuit Breaker → Timeout.** This is my minimum standard for every external call. The retry handles transient failures, the circuit breaker protects against prolonged outages, and the timeout ensures no single call blocks forever.

## Frequently Asked Questions

### What is Microsoft.Extensions.Resilience in .NET 10?

Microsoft.Extensions.Resilience is a first-party .NET library for building resilient applications. It provides composable strategies - retry, timeout, circuit breaker, hedging, fallback, and rate limiting - that you chain together into pipelines. It integrates natively with HttpClientFactory, dependency injection, structured logging, and OpenTelemetry. It is built on top of Polly v8 and is fully supported by Microsoft as part of the .NET platform.

### What is the difference between Polly and Microsoft.Extensions.Resilience?

Polly is the open-source resilience library that Microsoft.Extensions.Resilience builds on top of. The Microsoft package adds first-class integration with the .NET hosting model: named resilience pipelines registered via dependency injection, HttpClientFactory support, configuration binding from appsettings, and built-in telemetry. If you are starting a new .NET 10 project, use `Microsoft.Extensions.Http.Resilience` for HTTP calls and `Microsoft.Extensions.Resilience` for non-HTTP operations.

### How do I add retry logic to an ASP.NET Core API?

Install the `Microsoft.Extensions.Resilience` NuGet package, then register a named pipeline with `AddResiliencePipeline` in `Program.cs`. Configure `RetryStrategyOptions` with `MaxRetryAttempts`, `Delay`, `BackoffType`, and `UseJitter`. In your endpoint, inject `ResiliencePipelineProvider` and call `ExecuteAsync` to run your operation through the pipeline. Always use exponential backoff with jitter to avoid retry storms.

### What is the circuit breaker pattern in ASP.NET Core?

The circuit breaker pattern temporarily stops calls to a failing dependency. When the failure ratio exceeds a configured threshold within a sampling window, the circuit "opens" and all subsequent calls fail immediately without hitting the downstream service. After a configured break duration, the circuit moves to "half-open" and allows a single test call through. If that call succeeds, the circuit closes and normal traffic resumes. This prevents cascading failures in distributed systems.

### Can I combine multiple resilience strategies in one pipeline?

Yes. You chain strategies using `ResiliencePipelineBuilder` and they execute in the order you add them. A common production combination is retry wrapping a circuit breaker wrapping a timeout. The outer strategy (added first) wraps the inner ones. If a timeout fires, the retry strategy can attempt the call again. If too many attempts fail, the circuit breaker trips and stops all calls.

### How does resilience work with HttpClientFactory in .NET 10?

You can apply resilience directly to named or typed `HttpClient` instances using `AddStandardResilienceHandler()` or `AddResilienceHandler()` on the `IHttpClientBuilder`. This automatically wraps all outgoing HTTP calls with your configured resilience pipeline - without changing any code in your services or endpoints. It is the recommended approach for HTTP resilience in .NET 10 applications.

### What is the hedging strategy in Microsoft.Extensions.Resilience?

The hedging strategy sends backup requests in parallel when the primary request is too slow. Instead of waiting for one response, you race multiple attempts and use whichever completes first. This reduces tail latency in latency-sensitive applications. You configure the maximum number of hedged attempts and the delay between them. Hedging is most useful when you have multiple replicas of a downstream service.

## Wrapping Up

Building resilient APIs is not optional anymore - it's a baseline expectation for any production .NET application.

With `Microsoft.Extensions.Resilience`, you don't need to build this from scratch. The library gives you production-grade strategies that plug directly into your existing DI, HttpClient, and observability setup.

My recommendation: start with **retry + circuit breaker + timeout** as your minimum standard for every external call. Add hedging and fallback when the use case demands it.

The code examples in this article work with .NET 10 out of the box. Copy them into your project, adjust the thresholds for your specific services, and ship.

That's all from me today. 

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

Want to enforce clean code automatically? My [Pragmatic .NET Code Rules](/pragmatic-dotnet-code-rules) course shows you how to set up analyzers, CI quality gates, and architecture tests - a production-ready system that keeps your codebase clean without manual reviews. Or grab the [free Starter Kit](/dotnet-code-rules-starter-kit) to try it out.

<!--END-->
---
title: "Building Resilient APIs in ASP.NET Core"
subtitle: "What if your app could handle those hiccups gracefully without crashing or stressing out your users?"
date: "May 19 2025"
category: ".NET"
readTime: "Read Time: 5 minutes"
meta_description: "Learn how to build resilient APIs in ASP.NET Core using Microsoft.Extensions.Resilience. Covers retry, timeout, circuit breaker, hedging, fallback, and rate limiting strategies with full code examples."
---

<!--START-->
Startups can’t afford to lose users over broken features. With TestSprite’s fully autonomous AI testing, you can catch issues early with less effort from your QA team—and greater accuracy. Ship faster, smarter, and with confidence. Try it now at [testsprite.com](testsprite.com).
[Join here](testsprite.com)

## Background
Hey friends! 👋

In today’s cloud-connected world, we’re constantly making HTTP calls to external APIs, microservices, or third-party integrations. But let’s face it: networks can be flaky, services can slow down, and stuff just... breaks.

What if your app could handle those hiccups **gracefully** without crashing or stressing out your users?

Great news! .NET ships with a **first-party library** for building resilient apps: Microsoft.Extensions.Resilience. 

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
You begin by creating a **ResiliencePipelineBuilder**, adding strategies to it, and then calling `Build()` to get the final pipeline.

```csharp
ResiliencePipeline pipeline = new ResiliencePipelineBuilder()
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
If 50% of calls fail (with a minimum of 10 calls) within 30 seconds, the breaker "trips" and all further calls fail fast for 15 seconds.

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

## Frequently Asked Questions

### What is Microsoft.Extensions.Resilience?

Microsoft.Extensions.Resilience is a first-party .NET library for adding resilience to your applications. It provides composable strategies like retry, timeout, circuit breaker, hedging, fallback, and rate limiting. It integrates natively with HttpClientFactory, dependency injection, logging, and OpenTelemetry. It is built on top of Polly v8 and is fully supported by Microsoft.

### What is the difference between Polly and Microsoft.Extensions.Resilience?

Polly is the open-source resilience library that Microsoft.Extensions.Resilience builds on. The Microsoft package adds first-class integration with the .NET hosting model: named pipelines via DI, `HttpClientFactory` support, configuration binding, and telemetry. If you are starting a new project, use `Microsoft.Extensions.Http.Resilience` for HTTP calls and `Microsoft.Extensions.Resilience` for non-HTTP operations.

### How do I add retry logic to an ASP.NET Core API?

Install the `Microsoft.Extensions.Resilience` package, then register a named pipeline with `AddResiliencePipeline` in `Program.cs`. Add a `RetryStrategyOptions` with your desired `MaxRetryAttempts`, `Delay`, and `BackoffType`. Inject `ResiliencePipelineProvider` into your endpoint and call `ExecuteAsync` to run your operation through the pipeline.

### What is the circuit breaker pattern in .NET?

The circuit breaker pattern temporarily stops calls to a failing dependency. When the failure ratio exceeds a threshold within a sampling window, the circuit "opens" and all subsequent calls fail immediately without hitting the downstream service. After a configured break duration, the circuit moves to "half-open" and allows a test call through. If it succeeds, the circuit closes and normal traffic resumes.

### Can I combine multiple resilience strategies in one pipeline?

Yes. You chain strategies using `ResiliencePipelineBuilder`. The strategies execute in the order you add them. A common combination is retry wrapping a timeout wrapping a circuit breaker. The outer strategy (added first) wraps the inner ones, so if a timeout fires, the retry strategy can attempt the call again.

## Wrapping Up

Microsoft's Microsoft.Extensions.Resilience stack makes it easier than ever to apply production-grade resilience across your entire .NET application.

You don’t need to reinvent the wheel with Polly yourself - use the official pipeline abstraction, build named strategies, and compose reusable policies that apply to your internal services or third-party APIs.

Use retry + timeout + circuit breaker as your minimum standard for every external call. And if you want even more flexibility, customize the heck out of it!

That's all from me today. 
 
P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

Want to enforce clean code automatically? My [Pragmatic .NET Code Rules](/pragmatic-dotnet-code-rules) course shows you how to set up analyzers, CI quality gates, and architecture tests - a production-ready system that keeps your codebase clean without manual reviews. Or grab the [free Starter Kit](/dotnet-code-rules-starter-kit) to try it out.

<!--END-->



