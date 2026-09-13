---
title: "When Retries Make the Outage Worse: Resilience Done Right in .NET"
subtitle: "A naive retry turns one slow dependency into a self-inflicted outage. Here's how retries, timeouts, backoff, and circuit breakers actually fit together in .NET."
date: "Sep 13 2026"
category: "APIs"
readTime: "Read Time: 8 minutes"
meta_description: "Naive retries can turn a slow dependency into a self-inflicted outage in .NET. How retries, timeouts, backoff and circuit breakers fit together with Polly."
faq:
  - q: "Should I retry POST requests in .NET?"
    a: >-
      Only if the operation is idempotent, or you make it idempotent with an idempotency key the server
      deduplicates on. A blind retry on a non-idempotent POST can charge a card twice or create two
      orders. GET, PUT, and DELETE are usually safe to retry; POST is the one to think about.
  - q: "How many retries is too many?"
    a: >-
      For a synchronous request a caller is waiting on, 2-3 attempts total is usually the ceiling.
      Beyond that you're just adding load and latency - if it failed twice quickly, the fourth try
      rarely helps. Long, patient retry counts belong in background jobs, not in the request path.
  - q: "Do I still need retries if I have a circuit breaker?"
    a: >-
      Yes - they solve different problems. A retry handles a single transient blip (one dropped packet,
      one brief timeout). A circuit breaker handles a dependency that's actually down, by stopping the
      calls entirely for a while. You want both, and the order they're arranged in matters.
  - q: "What's the difference between a per-attempt timeout and a total timeout?"
    a: >-
      A per-attempt timeout caps a single try, so one slow call can't hang forever before the retry
      fires. A total (request) timeout caps the whole operation including all retries and their waits,
      so the caller always gets an answer within a known bound. Use both - the per-attempt one bounds
      each try, the total one bounds the sum.
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A word from this week's sponsors</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">Datadog put together an <strong>AI Security Best Practices Guide</strong> - practical guidance for anyone building, deploying, or operating AI-powered applications. It covers how to secure the infrastructure behind AI apps, protect the software and data they rely on, and reduce risk across the entry points users interact with. If you're moving AI into production, security belongs in the architecture from day one.</p>

<a href="https://r2trck.com/the-code-man-datadog-11?utm_medium=newsletter&utm_source=the-code-man-r&utm_campaign=dg-content-toolkit-2026AIEraDeveloper-delivery-cipipe-ww-en-701VY00000kMeE2YAK&utm_content=paid&utm_term=1-1-2026" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #1a0224; background: #ffbd39; border-radius: 8px; text-decoration: none;">Read the guide →</a>

<p style="margin: 20px 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">The <strong>ElevenLabs</strong> is free to start - you can create an account and turn text into natural, human-sounding speech in minutes, no card required. The free tier gives you realistic AI voices in dozens of languages through a simple API you can call straight from your .NET code, so you can add narration, voiceover, or a voice feature to a project without paying for anything upfront. If you've been meaning to try AI voice, this is the no-risk way to do it.</p>

<a href="https://r2trck.com/thecodeman-elevenlabs-c-4?utm_medium=newsletter&utm_source=the-code-man-performance&utm_campaign=ai-voice-lp&utm_content=paid&utm_term=8-25-2026" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #1a0224; background: #ffbd39; border-radius: 8px; text-decoration: none;">Start free with ElevenLabs →</a>

<p style="margin: 16px 0 8px 0; font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.6);">Want to reach thousands of .NET developers like this?</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 7px 14px; font-size: 13px; font-weight: 600; color: #ffffff; background: transparent; border: 1px solid #6366f1; border-radius: 8px; text-decoration: none;">Sponsor TheCodeMan →</a>
</div>

**Keywords:** retries in .NET, retry storm, Polly resilience .NET, exponential backoff jitter, circuit breaker .NET, thundering herd, Microsoft.Extensions.Http.Resilience, retry budget, per-attempt timeout, idempotent retry, transient fault handling

## The Problem: The Retry That Helps in Testing and Hurts in Production

A downstream call fails once in a while. A dropped connection, a brief blip, a request that times out for no reason you can find. So you wrap it in a retry:

```csharp
app.MapGet("/checkout", async (PaymentClient client) =>
{
    for (int attempt = 0; attempt < 3; attempt++)
    {
        try
        {
            return Results.Ok(await client.ChargeAsync());
        }
        catch (HttpRequestException)
        {
            // try again
        }
    }

    return Results.StatusCode(502);
});
```

In testing this looks great. You kill the payment service, the retry kicks in, the request recovers. Ship it.

Then one day the payment service isn't down - it's slow. Every call that used to take 50ms now takes eight seconds. And this retry loop, the one that saved you in testing, is now making three slow calls where there used to be one. Multiply that by every user hitting checkout at the same time, and you've tripled the load on a service that was already struggling. The thing you added to survive a failure is now causing one.

That's the part that's easy to miss. Retries don't add load evenly - they add it exactly when the dependency is least able to take it. A healthy service barely notices retries because there's almost nothing to retry. A struggling service gets hit with a wave of them right when it needs fewer calls, not more. The retry turns a slow dependency into a down one.

This post is about getting retries right in .NET: when they help, when they make things worse, and how retries, backoff, timeouts, and circuit breakers fit together so you're adding resilience instead of amplifying an outage.

## Why the Naive Retry Backfires

Three things go wrong with the loop above, and they compound.

**It multiplies load under stress.** One user request becomes three calls to the dependency. When the dependency is slow or erroring, every caller is retrying at once, so a service running at its limit suddenly gets 2-3x the traffic. This is the classic *retry storm* - the retries themselves become the load that keeps the service down.

**It retries things it shouldn't.** The loop catches `HttpRequestException` and tries again - including cases where retrying can't possibly help. A `400 Bad Request` will be bad the second time too. A `409 Conflict` means the state already changed. Retrying a `POST` that already succeeded but whose response got lost can charge the card twice. A retry is only safe on a *transient* failure and an *idempotent* operation, and the naive loop checks for neither.

**It has no gap between attempts.** The retries fire back to back, as fast as the loop runs. So instead of giving the dependency a moment to recover, you hit it three times in a few milliseconds. And because every caller retries on the same rhythm, the attempts line up into synchronized waves - everyone hammers, everyone backs off, everyone hammers again together.

Now stack that across layers. Real systems retry at more than one level: the browser or client SDK retries, the API gateway retries, your service retries its downstream call. If each layer retries three times, one user request can become up to 27 calls at the bottom of the stack.

![How one retried request multiplies into a flood of calls across layers](/images/blog/posts/when-retries-make-the-outage-worse/retry-amplification.webp)

Each layer thinks it's being helpful. Together they turn a single slow request into a flood. The fix isn't to remove retries - it's to make each retry deliberate: retry only what's worth retrying, space the attempts out, cap the total time, and stop entirely when the dependency is clearly down.

## Retrying the Right Way in .NET

You don't have to build this by hand. On .NET 10, the resilience story is [Polly v8](https://www.pollydocs.org/), wired into `HttpClient` through `Microsoft.Extensions.Http.Resilience` (the package has been there since .NET 8). Add the package:

```bash
dotnet add package Microsoft.Extensions.Http.Resilience
```

Then attach a resilience handler to a typed client:

```csharp
builder.Services.AddHttpClient<PaymentClient>()
    .AddResilienceHandler("payment", pipeline =>
    {
        pipeline.AddRetry(new HttpRetryStrategyOptions
        {
            MaxRetryAttempts = 3,
            BackoffType = DelayBackoffType.Exponential,
            UseJitter = true,
            Delay = TimeSpan.FromMilliseconds(500)
        });
    });
```

Three of those settings are doing the work the hand-rolled loop skipped.

`BackoffType = DelayBackoffType.Exponential` spaces the attempts out and widens the gap each time - roughly 0.5s, then 1s, then 2s - so a dependency that needs a moment actually gets one, instead of three hits in a row.

`UseJitter = true` adds a random offset to each delay. Without it, every caller that failed at the same instant retries at the same instant, and you get synchronized waves - the herd hammers in lockstep. Jitter smears those retries across time so the load is spread out instead of spiking. If you take one thing from this post, take this: **exponential backoff without jitter is only half a fix.**

`HttpRetryStrategyOptions` also defaults its `ShouldHandle` to the transient HTTP failures - `5xx` responses, `408 Request Timeout`, and network-level `HttpRequestException` - and leaves `4xx` like `400` and `409` alone. That's the "retry only transient failures" rule you'd otherwise have to write yourself.

What it does **not** know is whether your operation is safe to retry. That's on you.

## The Rule the Framework Can't Enforce: Idempotency

A retry replays a request. If replaying it can change the world twice, retrying is dangerous no matter how good your backoff is.

`GET` is safe - reading twice is the same as reading once. `PUT` and `DELETE` are usually safe by design. `POST` is the one to watch, because "create an order" or "charge a card" run twice makes two orders or two charges.

The fix is to make the operation idempotent so a replay is harmless. The common pattern is an idempotency key: the caller sends a unique key, and the server records it and refuses to do the work twice for the same key.

```csharp
app.MapPost("/charge", async (ChargeRequest req, IdempotencyStore store, IPaymentGateway paymentGateway) =>
{
    // Same key seen before? Return the original result, don't charge again.
    if (await store.TryGetResultAsync(req.IdempotencyKey) is { } existing)
        return Results.Ok(existing);

    var result = await paymentGateway.ChargeAsync(req);
    await store.SaveResultAsync(req.IdempotencyKey, result);

    return Results.Ok(result);
});
```

Now a retried charge with the same key returns the first result instead of charging again. The retry became safe. Without something like this, keep retries off your non-idempotent writes - a duplicate charge is a much worse outage than a failed one.

## Timeouts Are Half of a Good Retry

A retry only helps if the failing attempt fails *quickly*. If the dependency is slow rather than broken, each attempt hangs for the full slow duration before the retry even starts - so a 3-attempt retry against an 8-second call means the caller waits 24 seconds plus backoff to finally get an error. You've made the experience worse, not better.

So retries need timeouts around them. There are two, and you want both.

A **per-attempt timeout** caps a single try. If one attempt hangs, it's cut off fast and the retry fires against a fresh attempt instead of waiting on a dead one.

A **total timeout** caps the whole operation - all attempts and all the backoff waits between them - so the caller always gets an answer within a known bound, no matter how the retries play out.

`Microsoft.Extensions.Http.Resilience` ships a preconfigured pipeline that combines all of this, so you don't have to assemble it piece by piece:

```csharp
builder.Services.AddHttpClient<PaymentClient>()
    .AddStandardResilienceHandler(options =>
    {
        options.TotalRequestTimeout.Timeout = TimeSpan.FromSeconds(10);
        options.AttemptTimeout.Timeout = TimeSpan.FromSeconds(2);

        options.Retry.MaxRetryAttempts = 3;
        options.Retry.UseJitter = true;
    });
```

This one line, `AddStandardResilienceHandler`, gives you a rate limiter, a total timeout, a retry with backoff and jitter, a circuit breaker, and a per-attempt timeout - already ordered correctly. For most HTTP clients it's the right default, and you tune the numbers instead of building the pipeline. (If request-level timeouts on your *own* endpoints are the missing piece, that's a different mechanism - I covered it in [request timeouts in ASP.NET Core](https://thecodeman.net/posts/request-timeouts-in-aspnet-core).)

## The Circuit Breaker: Stop Hitting a Service That's Down

Retries assume the failure is temporary. But when a dependency is genuinely down - not blipping, down - retrying every request is the worst thing you can do. You spend effort, hold resources, and pile load onto something that can't answer, and you make every caller wait through their full retry sequence just to fail anyway.

A circuit breaker fixes that. It watches the failure rate, and when too many calls fail in a window, it *opens*: for a cooldown period it fails fast without even trying the call. After the cooldown it lets a trial request through, and if that succeeds it closes again.

```csharp
builder.Services.AddHttpClient<PaymentClient>()
    .AddResilienceHandler("payment", pipeline =>
    {
        pipeline.AddRetry(new HttpRetryStrategyOptions
        {
            MaxRetryAttempts = 3,
            BackoffType = DelayBackoffType.Exponential,
            UseJitter = true
        });

        pipeline.AddCircuitBreaker(new HttpCircuitBreakerStrategyOptions
        {
            FailureRatio = 0.5,                          // open at 50% failures
            SamplingDuration = TimeSpan.FromSeconds(30), // measured over 30s
            MinimumThroughput = 10,                      // ignore low-traffic noise
            BreakDuration = TimeSpan.FromSeconds(15)     // stay open 15s, then test
        });
    });
```

While the breaker is open, calls throw `BrokenCircuitException` immediately instead of hitting the network. That's the point: a service that's down gets a break from your traffic, and your callers fail in milliseconds instead of hanging. That fast failure is your cue to have a fallback ready - a cached value, a write queued to replay later, or a degraded response - so the user gets something better than a raw error. The retry handles the one-off blip; the breaker handles the sustained outage. You need both because they cover different failures.

## Order Matters: How the Strategies Stack

Retry, circuit breaker, and the two timeouts have to be arranged in the right order, or they fight each other. The standard handler already gets this right, and it's worth understanding why the order is what it is:

![The resilience pipeline order: a total timeout wraps the retry, which wraps the circuit breaker and the per-attempt timeout around the call](/images/blog/posts/when-retries-make-the-outage-worse/resilience-pipeline-order-matters.webp)

Read it from the outside in. The **total timeout** wraps everything, so the whole operation - every retry and every backoff wait - is bounded. Inside it, the **retry** re-runs what's below it. Inside the retry, the **circuit breaker** sees each individual attempt, so it can count failures and open when too many pile up - and once it's open, the retry's next attempt hits the open breaker and fails fast instead of hammering the network. Innermost, the **per-attempt timeout** bounds each single call.

The important consequences of this order: the circuit breaker sits *inside* the retry, so it counts attempts and can short-circuit the retry loop when the dependency is down. And the per-attempt timeout is *innermost*, so each try is bounded on its own while the total timeout still caps the sum. Get the nesting backwards - retry outside the total timeout, say - and you lose the guarantee that the caller gets an answer in bounded time. This is exactly why reaching for `AddStandardResilienceHandler` beats assembling the pieces yourself: the ordering is a solved problem.

## A Few Thresholds Worth Starting From

Numbers depend on your system, but these are sane defaults to tune from, not copy blindly:

- **Attempts:** 2-3 total for a synchronous request. More belongs in a background job, not the request path.
- **Retry budget:** across all callers, cap retries as a fraction of live traffic (10% is a common ceiling) so a broad outage can't turn every request into three - a per-call attempt limit doesn't bound the total load, a budget does.
- **Backoff:** exponential, base 200-500ms, **always with jitter**.
- **Per-attempt timeout:** a small multiple of the dependency's normal latency - not so tight you cut off healthy-but-slow calls, not so loose it never fires.
- **Total timeout:** shorter than the timeout the *caller above you* is willing to wait, so you fail before they give up on you.
- **Circuit breaker:** open around a 50% failure ratio over a short window, with a minimum throughput so a couple of failures on a quiet endpoint don't trip it.

The through-line: retries should be few, spaced out, jittered, bounded by timeouts, and switched off entirely by a breaker when the dependency is clearly down. That's the difference between resilience and amplification.

## FAQ

### Should I retry POST requests in .NET?

Only if the operation is idempotent, or you make it idempotent with an idempotency key the server deduplicates on. A blind retry on a non-idempotent `POST` can charge a card twice or create two orders. `GET`, `PUT`, and `DELETE` are usually safe; `POST` is the one to think about.

### How many retries is too many?

For a synchronous request a caller is waiting on, 2-3 attempts total is usually the ceiling. Beyond that you're mostly adding load and latency - if it failed twice quickly, the fourth try rarely helps. Long, patient retry counts belong in background jobs, not the request path.

### Do I still need retries if I have a circuit breaker?

Yes - they solve different problems. A retry handles a single transient blip. A circuit breaker handles a dependency that's actually down, by stopping the calls entirely for a while. You want both, arranged with the breaker inside the retry so it can short-circuit the loop.

### What's the difference between a per-attempt timeout and a total timeout?

A per-attempt timeout caps a single try, so one slow call can't hang before the retry fires. A total timeout caps the whole operation including all retries and their waits, so the caller always gets an answer within a known bound. Use both.

## Wrapping Up

Retries are the first resilience tool everyone reaches for, and the easiest one to get wrong. The naive loop works in a demo because the dependency is either fine or fully down. Production has a third state - slow, struggling, half-up - and that's exactly where a blind retry stops being a safety net and starts being the load that finishes the service off.

The fix isn't fewer features, it's deliberate ones. Retry only transient failures on idempotent operations. Space attempts with exponential backoff and jitter so callers don't move in lockstep. Bound each attempt and the whole operation with timeouts. And put a circuit breaker in front so a dependency that's down gets a break from your traffic instead of a beating. In .NET, `AddStandardResilienceHandler` gives you all of it, correctly ordered, in one line - so the honest amount of work here is picking good numbers, not writing the machinery.

Take one client in your app that calls something you don't control, and check what it does when that thing gets *slow* - not down, slow. If the answer is "retries three times and waits," you've found your next fifteen minutes of work.

<!--END-->
