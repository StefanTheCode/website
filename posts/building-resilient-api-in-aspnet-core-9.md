---
title: "Building a Resilient API in ASP.NET Core 9"
subtitle: "What if your app could handle those hiccups gracefully without crashing or stressing out your users?"
readTime: "Read Time: 5 minutes"
date: "May 19 2025"
category: ".NET"
meta_description: "Microsoft.Extensions.Resilience is a set of libraries that help you: Retry failed operations, Set timeouts, Break circuits on repeated failures, Control request rates, Send backup (hedged) requests"
---

<!--START-->
##### Startups can’t afford to lose users over broken features. With TestSprite’s fully autonomous AI testing, you can catch issues early with less effort from your QA team—and greater accuracy. Ship faster, smarter, and with confidence. Try it now at [testsprite.com](testsprite.com).
&nbsp;
##### [Join here](testsprite.com)

&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  
##### Hey friends! 👋
&nbsp;  

##### In today’s cloud-connected world, we’re constantly making HTTP calls to external APIs, microservices, or third-party integrations. But let’s face it: networks can be flaky, services can slow down, and stuff just... breaks.
&nbsp;  

##### What if your app could handle those hiccups **gracefully** without crashing or stressing out your users?
&nbsp;  

##### Great news! .NET 8 and 9 introduced a **first-party library** for building resilient apps: Microsoft.Extensions.Resilience. 
&nbsp;  

##### Think of it like Polly, but built into .NET, fully supported by Microsoft, and super easy to plug into your existing setup.
&nbsp;  

##### Let’s break it all down in a **friendly, real-world way** - with full code, strategy-by-strategy explanations, and Minimal API examples.

&nbsp;  
&nbsp;  
### What is Microsoft.Extensions.Resilience?
&nbsp;  
&nbsp;  
##### It's a set of libraries that help you:
&nbsp;  
##### • Retry failed operations
##### • Set timeouts
##### • Break circuits on repeated failures
##### • Control request rates
##### • Send backup (hedged) requests
&nbsp;  
##### All of these are called **resilience strategies**, and you can mix and match them using a composable pipeline.
&nbsp;  
##### You get full integration with HttpClientFactory, DI, logging, and even OpenTelemetry.

&nbsp;  
&nbsp;  
### Project Setup
&nbsp;  
&nbsp;  

##### Add required packages:

```csharp

dotnet add package Microsoft.Extensions.Http.Resilience
dotnet add package Microsoft.Extensions.Resilience
```

&nbsp;  
&nbsp;  
### Resilience Pipelines
&nbsp;  
&nbsp;  

##### To apply resilience, you need to build a pipeline made up of different resilience strategies. These strategies run in the exact order you define them -so the order really matters.
&nbsp;  
##### You begin by creating a **ResiliencePipelineBuilder**, which 

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
&nbsp;  

##### Now let’s break down each strategy...

&nbsp;  
&nbsp;  
### Retry Strategy
&nbsp;  

##### <center> *"Try again if it fails... but not forever."* </center>
&nbsp;  
##### A retry strategy lets you retry an operation that failed due to transient issues (like a timeout or HTTP 500).
&nbsp;  

##### Why?
##### • Temporary failures are common in distributed systems.
##### • Retry gives the system time to recover.
&nbsp;  
##### Example:
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
&nbsp;  
##### This retries 3 times, with exponentially increasing delay: 300ms, 600ms, 1200ms...

&nbsp;  
&nbsp;  
### Timeout Strategy
&nbsp;  

##### <center> *"Don’t hang forever. Bail out if it’s too slow."* </center>
&nbsp;  
##### The timeout strategy sets a max duration for how long an operation can run. If it’s too slow - it’s out.
&nbsp;  

##### Why?
##### • You don’t want threads hanging forever.
##### • It’s better to fail fast and free resources.
&nbsp;  
##### Example:
```csharp

builder.Services.AddResiliencePipeline("timeout-pipeline", builder =>
{
    builder.AddTimeout(TimeSpan.FromSeconds(2));
});
```
&nbsp;  
##### If your external service doesn’t respond in 2 seconds, it fails and triggers the next strategy (like retry)...

&nbsp;  
&nbsp;  
### Circuit Breaker Strategy
&nbsp;  

##### <center> *"If something keeps failing, stop trying for a while."* </center>
&nbsp;  
##### The circuit breaker temporarily blocks calls to a failing system, preventing overload and giving it time to recover.
&nbsp;  

##### Why?
##### • Avoid hammering a broken service.
##### • Let things cool off.
&nbsp;  
##### Example:
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
&nbsp;  
##### If 2 out of 4 calls fail within 10 seconds, the breaker "trips" and all further calls fail fast for 20 seconds.


&nbsp;  
&nbsp;  
### Hedging Strategy
&nbsp;  

##### <center> *"If you're not getting a reply, ask someone else too - just in case."* </center>
&nbsp;  
##### The hedging strategy sends secondary requests after a delay if the primary one is too slow or might fail. It’s like having a plan B running in parallel.
&nbsp;  

##### Why?
##### • Reduce latency spikes.
##### • Improve success rate by racing multiple attempts.
&nbsp;  
##### Example:
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
&nbsp;  
##### With this configuration, the hedging strategy:
##### - Initiates a maximum of 4 executions. This includes initial action and an additional 3 attempts.
##### - Allows the first two executions to proceed in parallel, while the third and fourth executions follow the fallback mode.

&nbsp;  
&nbsp;  
### Fallback Strategy
&nbsp;  

##### <center> *"If something keeps failing, have a backup plan."* </center>
&nbsp;  
##### The fallback strategy provides an alternative response when a primary operation fails, helping your app stay functional even when things go wrong.
&nbsp;  

##### Why?
##### • Avoid crashing the user experience.
##### • Stay graceful under pressure.
&nbsp;  
##### Example:
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

&nbsp;  
&nbsp;  
### Rate Limiting Strategy
&nbsp;  

##### <center> *"Too many requests? Slow down before you burn out."* </center>
&nbsp;  
##### The rate limiter strategy controls how many calls your system can make within a time window - protecting resources and avoiding service throttling.
&nbsp;  

##### Why?
##### • Prevent overwhelming dependencies.
##### • Ensure fair usage and system stability.
&nbsp;  
##### Example:
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

&nbsp;  
&nbsp;  
###  Using ResiliencePipelineProvider to Apply Resilience Automatically
&nbsp;  
&nbsp;  

##### When you're working with resilience in .NET and using **Dependency Injection**, you don’t need to manually build your pipeline every time. 
&nbsp;  

##### Instead, you can ask the ResiliencePipelineProvider to fetch a configured pipeline by its key.
&nbsp;  

##### Here's how it works:
&nbsp;  
##### • You define your pipeline (e.g., with a fallback or retry strategy)  and register it using a key like "gh-fallback".
##### • Then, inside your route or handler, you request that pipeline using GetPipeline<T>(), where T is the expected result type.
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

&nbsp;  
&nbsp;  
### Wrapping Up
&nbsp;  
&nbsp;  

##### Microsoft’s new Microsoft.Extensions.Resilience stack makes it easier than ever to apply production-grade resilience across your entire .NET application.
&nbsp;  

##### You don’t need to reinvent the wheel with Polly yourself - use the official pipeline abstraction, build named strategies, and compose reusable policies that apply to your internal services or third-party APIs.
&nbsp;  

##### Use retry + timeout + circuit breaker as your minimum standard for every external call. And if you want even more flexibility, customize the heck out of it!
&nbsp;  

##### That's all from me today. 
&nbsp;  
 
##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->