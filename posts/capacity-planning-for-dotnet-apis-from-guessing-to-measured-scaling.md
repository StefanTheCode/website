---
title: "Capacity Planning for .NET APIs: From Guessing to Measured Scaling"
subtitle: "Learn how to capacity plan ASP.NET Core APIs with concrete metrics, load tests, and scaling thresholds before production incidents happen."
date: "June 15 2026"
category: "Architecture"
readTime: "Read Time: 10 minutes"
meta_description: "A practical guide to capacity planning for .NET APIs. Measure concurrent users, RPS, p95 latency, and headroom to choose the right scaling strategy."
photoUrl: "/images/blog/capacity-planning-for-dotnet-apis-from-guessing-to-measured-scaling.webp"
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A word from this week's sponsor</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">I found a free resource from Datadog that might be useful if you're building, deploying, or operating modern applications.</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This week's recommendation: <strong>Developer Toolkit for the AI Era</strong></p>

<p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">Inside, you'll find practical guidance on cutting CI run times, eliminating flaky tests, and shipping with more confidence as AI tools change how your team writes and deploys code.</p>

<a href="https://r2trck.com/the-code-man-datadog-11?utm_medium=newsletter&utm_source=the-code-man-r&utm_campaign=dg-content-toolkit-2026AIEraDeveloper-delivery-cipipe-ww-en-701VY00000kMeE2YAK&utm_content=paid&utm_term=1-1-2026" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Get it here for free →</a>

<p style="margin: 16px 0 8px 0; font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.6);">Want to reach thousands of .NET developers like this?</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 7px 14px; font-size: 13px; font-weight: 600; color: #ffffff; background: transparent; border: 1px solid #6366f1; border-radius: 8px; text-decoration: none;">Sponsor TheCodeMan →</a>
</div>

**Keywords:** .NET capacity planning, ASP.NET Core performance, load testing, k6, p95 latency, RPS, connection pool, thread pool starvation, scaling thresholds, SLO

## The Question Nobody Can Answer in the Meeting

Picture the release call. Someone from product asks, "Can the API handle Black Friday?" and the room goes quiet. Then a senior engineer says something like "should be fine, we're on bigger instances now" and everyone moves on. That sentence is a guess wearing a confident voice, and three weeks later it turns into a 2 a.m. incident.

Capacity planning is what you do so that question has a real answer. Not a feeling, not a vibe about instance sizes - a number you measured, with the conditions it was measured under written next to it.

I'll walk through how I actually do this for ASP.NET Core APIs: the metrics that tell the truth, a baseline process you can repeat, the thresholds I reach for, and a small lab project you can run on your own machine to see degradation happen in real time. Everything here is backed by code in the `samples/production-scaling-lab` folder, so you're not taking my word for any of it.

## Why CPU and RAM Lie to You

Plenty of capacity plans are just two graphs: CPU and memory. The server has headroom on both, so the conclusion is "we're fine." Then traffic spikes and the API falls over while CPU sits at 40%.

The reason is that the things that actually break first rarely show up as CPU pressure:

- **Connection pool exhaustion** - your app runs out of SQL connections long before the database runs out of CPU, and requests queue waiting for a free one.
- **Thread pool starvation** - a few blocking calls under load, the thread pool can't grow fast enough, and latency explodes even though no single resource looks maxed out.
- **Lock contention** - a hot lock turns parallel work into a single-file line.
- **Queue lag** - background processing falls behind, so the write "succeeds" but the user can't see the result for 30 seconds.
- **p95 latency collapse** - the average still looks great while one request in twenty times out.

So the question capacity planning answers isn't "do we have spare CPU." It's narrower and more useful:

> How much traffic can this API take before the user experience starts to degrade?

Everything else is in service of answering that.

## Measure These, Not Just Averages

The single biggest mistake I see is tracking average latency and calling it a day. Averages hide the people who are actually suffering. If your average is 80ms but your p99 is 4 seconds, a real slice of your users is having a miserable time and your dashboard is lying to your face about it.

Here's what I track when planning capacity, roughly in order of how often they catch the real problem:

- **p95 and p99 latency** - the tail is where pain lives. p95 is your day-to-day SLO; p99 tells you how bad the bad moments get.
- **Requests per second (RPS)** - per endpoint class, not one global number. A read endpoint and a write endpoint have nothing in common.
- **Concurrent users / in-flight requests** - how many requests are alive at once, which is what actually pressures pools and threads.
- **Timeout rate and error rate** - the difference between "slow" and "broken."
- **DB connection pool usage** - the most common silent ceiling in .NET APIs.
- **Queue depth and processing lag** - for anything asynchronous, how far behind the workers are.

If you only add one thing to your current dashboards, make it p95 per endpoint. It changes the conversation immediately.

## The Baseline Loop

Capacity planning isn't a document you write once. It's a loop you run, and it always looks the same:

![Capacity Planning Loop](/images/blog/posts/capacity-planning-for-dotnet-apis-from-guessing-to-measured-scaling/capacity-planning.webp)


The order matters more than it looks.

**Define the SLO first.** "p95 under 300ms, error rate under 1%" is a target you can test against. "Fast" is not. Pin the number before you run anything, or you'll move the goalposts to wherever the results land.

**Run a steady-state test** at a load you believe reflects normal traffic. This is your reference point.

**Run a spike test** that ramps hard and fast. Steady-state tells you the cruising altitude; the spike tells you what happens when marketing sends an email at noon.

**Find the *first* bottleneck and fix only that.** When the system buckles, something gives way first. Fix that one thing, then re-test - because the fix usually just moves the ceiling to the next bottleneck, and you want to see it move.

**Add headroom, then publish.** Once you're inside SLO, give yourself 30-50% margin over expected peak and write down the number. A capacity limit nobody can find is the same as no capacity limit.

## The Lab: Watching It Break on Purpose

Theory is cheap. The `production-scaling-lab` project is a small ASP.NET Core 8 API built specifically so you can watch these failure modes happen. It has an I/O-bound endpoint to simulate connection pressure, an order-writing endpoint with deliberate load shedding, and background workers draining an outbox. Run it locally:

```bash
dotnet run --project src/ProductionScalingLab.Api/ProductionScalingLab.Api.csproj
# API base URL: http://localhost:5080
```

### Simulating connection pressure

The read path is an endpoint that just waits, standing in for a downstream call or a slow query - the kind of I/O-bound work that quietly eats threads and connections under load:

```csharp
app.MapGet("/api/io-bound", async (int delayMs, CancellationToken ct) =>
{
    var boundedDelay = Math.Clamp(delayMs, 5, 5000);
    await Task.Delay(boundedDelay, ct);
    return Results.Ok(new { delayMs = boundedDelay, at = DateTime.UtcNow });
});
```

The k6 script ramps virtual users from 200 to 1000 and asserts a p95 target. This is your baseline test - it tells you where latency starts to bend:

```javascript
// k6/connections.js
export const options = {
  stages: [
    { duration: '30s', target: 200 },
    { duration: '1m', target: 1000 },
    { duration: '30s', target: 0 }
  ],
  thresholds: {
    http_req_duration: ['p(95)<400'],
    http_req_failed: ['rate<0.01']
  }
};

export default function () {
  const response = http.get('http://localhost:5080/api/io-bound?delayMs=30');
  check(response, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

Run it and watch p95:

```bash
k6 run k6/connections.js
```

For the first stretch the line stays flat. Somewhere as concurrency climbs, it bends upward and the `p(95)<400` threshold goes red. That bend is your real capacity number for this endpoint - not the point where it errors out, but the point where it stops being fast.

### Protecting the write path with backpressure

Writes are different. You usually can't just let unlimited writes pile into the database and hope. The lab puts a gate in front of the order endpoint so that past a concurrency limit, it returns `429` instead of falling over:

```csharp
app.MapPost("/api/orders", async (
    CreateOrderRequest request,
    AppDbContext db,
    WriteGate writeGate,
    CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(request.CustomerEmail) || request.Amount <= 0)
        return Results.BadRequest("CustomerEmail and positive Amount are required.");

    if (!await writeGate.TryEnterAsync(ct))
        return Results.StatusCode(StatusCodes.Status429TooManyRequests);

    try
    {
        var order = new Order { /* ... */ };
        var outbox = new OutboxMessage { /* ... */ };

        await using var tx = await db.Database.BeginTransactionAsync(ct);
        db.Orders.Add(order);
        db.OutboxMessages.Add(outbox);
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);

        return Results.Accepted($"/api/orders/{order.Id}", new { orderId = order.Id });
    }
    finally
    {
        writeGate.Exit();
    }
});
```

The gate itself is just a `SemaphoreSlim` with a short wait. If it can't get a slot in 250ms, the request is shed rather than queued forever:

```csharp
public sealed class WriteGate
{
    private readonly SemaphoreSlim _semaphore;
    private int _inflight;

    public WriteGate(IConfiguration configuration)
    {
        var max = configuration.GetValue<int?>("LoadShedding:MaxConcurrentWrites") ?? 64;
        _semaphore = new SemaphoreSlim(max, max);
    }

    public int CurrentInflight => _inflight;

    public async Task<bool> TryEnterAsync(CancellationToken ct)
    {
        var acquired = await _semaphore.WaitAsync(TimeSpan.FromMilliseconds(250), ct);
        if (acquired) Interlocked.Increment(ref _inflight);
        return acquired;
    }

    public void Exit()
    {
        Interlocked.Decrement(ref _inflight);
        _semaphore.Release();
    }
}
```

This is the part that trips people up the first time: a `429` under extreme load is a *good* outcome. It means the system chose to protect the requests it can serve instead of accepting everything and serving none of it. Capacity planning is partly about deciding, ahead of time, where that line sits.

The write-spike test pushes a ramping arrival rate up to 800 requests/sec to find that line:

```javascript
// k6/write-spike.js
export const options = {
  scenarios: {
    write_spike: {
      executor: 'ramping-arrival-rate',
      startRate: 50,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 800,
      stages: [
        { target: 100, duration: '30s' },
        { target: 500, duration: '1m' },
        { target: 800, duration: '30s' },
        { target: 0,   duration: '20s' }
      ]
    }
  },
  thresholds: {
    http_req_duration: ['p(95)<700'],
    http_req_failed: ['rate<0.02']
  }
};
```

### Reading the result

While the spike runs, hit the metrics endpoint and watch three numbers:

```bash
curl http://localhost:5080/api/metrics
# { totalOrders, pendingOutbox, readModelCount, processedInbox, currentInflight }
```

- **p95 latency** - is the accepted path staying fast?
- **429 rate** - the load shedding kicking in, exactly as designed.
- **pendingOutbox** - if this number keeps climbing and never drains, your background workers can't keep up with the write rate, and that's a capacity limit too - just on the async side.

The goal here is never zero errors. The goal is **predictable degradation** - knowing precisely what the API does when you push past its limit, so the failure is boring instead of catastrophic.

## Thresholds I Actually Use

These are starting points, not laws. Your numbers depend on your hardware, your queries, and your SLO. But when I have nothing else to go on, this is roughly where I aim my effort:

- **Under ~100 RPS** - don't reach for infrastructure yet. Fix N+1 queries and allocations first. Most APIs at this level are slow because of code, not capacity.
- **~100-1000 RPS** - this is where caching earns its keep and connection pool tuning matters. Get the pool size right and put a cache in front of the hot reads.
- **1000+ RPS on writes** - stop writing synchronously to the database on the request path. Move to queue-based load leveling: accept fast, process behind a worker (which is exactly what the outbox in the lab demonstrates).
- **High burst + strict latency SLO** - add explicit rate limiting and backpressure. ASP.NET Core's built-in rate limiter or a gate like the one above. Decide your shed point on purpose rather than discovering it in production.

The pattern across all four: as load grows, the work moves off the request path. Reads get cached, writes get queued, and the synchronous critical section gets as small as you can make it.

## A Capacity Checklist Worth Keeping

Before I'd call an API "capacity planned," I want all of these to be true:

- Every endpoint class has a written SLO (p95 target + error budget).
- The load test scripts live in source control next to the code, so they run on every meaningful change.
- There's a known, documented max safe RPS per endpoint class.
- A runbook exists for scaling up *and* down - scaling down is where the surprises hide.
- Alerts fire on p95, timeout rate, and queue lag - not just CPU and memory.

If even one of those is missing, you're back to guessing on the next release call.

## FAQ

### What is capacity planning for a .NET API?

It's the process of measuring how much load your ASP.NET Core API can handle while staying inside its SLO targets - then writing that number down with the conditions attached, so scaling decisions are based on evidence instead of intuition.

### Which metric matters most?

p95 latency, almost always. It's the one that reflects what a real user feels. Pair it with timeout rate and error rate so you can tell "slow" apart from "broken."

### How often should I re-run capacity tests?

On every meaningful architecture or database change, and at minimum once per release cycle. The fastest way to lose a capacity number is to ship three months of features on top of it and assume it still holds.

### Is returning 429 under load a bug?

No - when it's deliberate, it's the system protecting the requests it can serve. The bug is accepting unlimited load and degrading *everyone* instead of shedding the excess.

## Wrapping Up

Capacity planning isn't a spreadsheet you fill in once and forget. It's a loop: define the SLO, measure against it, find the first thing that breaks, fix that one thing, and measure again. Do that a few times and "can it handle Black Friday?" stops being a scary question and becomes a number you can defend.

Clone the lab, run the two k6 scripts, and watch your own p95 bend. Once you've seen exactly where your API degrades and what it does when it gets there, you've stopped guessing and started measuring - which is the whole point.

You can check out the full source code here: [ProductionScalingLab-Demo on GitHub](https://github.com/StefanTheCode/ProductionScallingLab-Demo).

---

If you made it this far, you're serious about production-grade .NET systems. Use code **DEEP20** for a discount on [Design Patterns that Deliver](/design-patterns-that-deliver-ebook).

<!--END-->
