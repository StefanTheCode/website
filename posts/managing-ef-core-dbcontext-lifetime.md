---
title: "Managing EF Core DbContext Lifetime (Without Shooting Yourself in the Foot)"
subtitle: "Learn when to use AddDbContext (scoped), AddDbContextFactory, and AddDbContextPool in EF Core."
date: "September 16 2025"
category: "Entity Framework"
readTime: "Read Time: 4 minutes"
meta_description: "Learn when to use AddDbContext (scoped), AddDbContextFactory, and AddDbContextPool in EF Core. See production-ready patterns for web requests, background jobs, and singletons—plus thread-safety gotchas and code you can paste into your .NET app."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored - I write these deep dives in my free time and keep them free for everyone. If your company sells AI tools, dev tools, courses, or services that .NET developers would actually use, sponsoring an issue is the most direct way to reach them.</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>
This issue is made possible thanks to **[ZZZ Projects](https://zzzprojects.com/?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday)**, who help keep this newsletter free for everyone. A huge shout-out to them for their support of our community.
Thousands of developers fixed [EF Core performance](https://thecodeman.net/posts/4-entity-framework-tips-to-improve-performances) - with just one method.  
[👉 Discover this extension](https://entityframework-extensions.net/bulk-insert?utm_source=stefandjokic&utm_medium=x&utm_campaign=birthday)

## Background

DbContext is the heart of EF Core - but it’s easy to misuse. The big rules:

- A DbContext represents a unit of work and should be short-lived. 
- It is not thread-safe; never share one instance across concurrent operations.
- In ASP.NET Core, the default and usually correct choice is a scoped DbContext per request. For work outside the request scope (background services, singletons, UI apps), use a factory to create fresh contexts on demand.

This post shows how to wire it correctly, when to choose each registration, and the traps to avoid.

## The three registrations you should know

### 1. AddDbContext (Scoped - default, per request)

```csharp
// Program.cs
builder.Services.AddDbContext<AppDbContext>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
```
**When to use:** MVC/Minimal API controllers, Razor Pages, [SignalR](https://thecodeman.net/posts/real-time-dotnet-applications-with-signalr) hubs - anything that lives inside a web request.

**Why:** You get one context per request automatically; EF Core handles connection usage efficiently.

### 2. AddDbContextFactory<TContext> (Transient factory for on-demand contexts)

```csharp
builder.Services.AddDbContextFactory<AppDbContext>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
```

How to use it:
```csharp
public sealed class ReportService(IDbContextFactory<AppDbContext> factory)
{
    public async Task<IReadOnlyList<OrderDto>> GetAsync(CancellationToken ct)
    {
        await using var db = await factory.CreateDbContextAsync(ct);
        return await db.Orders
            .Where(o => o.Status == OrderStatus.Completed)
            .Select(o => new OrderDto(o.Id, o.Total))
            .ToListAsync(ct);
    }
}
```

When to use:

- Background/hosted services (IHostedService, BackgroundService)
- Any singleton service that needs a DbContext
- Desktop/Blazor apps where you want a fresh context per operation

**Why:** Factories create clean, short-lived contexts without relying on ambient scopes.

### 3. AddDbContextPool<TContext> (Scoped with pooling)

```csharp
builder.Services.AddDbContextPool<AppDbContext>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
```

**When to use:** High-throughput APIs when the context configuration is stable and stateless.

**Why:** Reuses DbContext instances from a pool for lower allocation overhead. 
**Caveat:** don’t stash per-request state in your context; pooled instances are reset and reused. 

## Real-world patterns (copy/paste friendly)

### Controller / Minimal API (Scoped is perfect)

```csharp
app.MapGet("/orders/{id:int}", async (int id, AppDbContext db, CancellationToken ct) =>
{
    var order = await db.Orders.FindAsync([id], ct);
    return order is null ? Results.NotFound() : Results.Ok(order);
});
```

**Why it works:** DI gives you a scoped context bound to the request; one unit-of-work, no leaks.
### [BackgroundService](https://thecodeman.net/posts/background-tasks-in-dotnet8) with IServiceScopeFactory (or use the factory directly)

```csharp
public sealed class CleanupService(IServiceScopeFactory scopes, ILogger<CleanupService> log) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = scopes.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // One short-lived unit of work
            var cutoff = DateTime.UtcNow.AddDays(-30);
            db.RemoveRange(db.AuditLogs.Where(x => x.CreatedAt < cutoff));
            await db.SaveChangesAsync(stoppingToken);

            await Task.Delay(TimeSpan.FromHours(6), stoppingToken);
        }
    }
}
```

Alternative (my go-to):

```csharp
public sealed class CleanupService(IDbContextFactory<AppDbContext> factory, ILogger<CleanupService> log) 
: BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            await using var db = await factory.CreateDbContextAsync(ct);
            // same cleanup logic …
            await Task.Delay(TimeSpan.FromHours(6), ct);
        }
    }
}
```
**Why:** Hosted services don’t have a request scope; you must create one (or use a factory).
### Singleton service that needs the database

```csharp
public sealed class PricingCache(IDbContextFactory<AppDbContext> factory, IMemoryCache cache)
{
    public async Task<decimal> GetPriceAsync(int productId, CancellationToken ct)
    {
        if (cache.TryGetValue(productId, out decimal price)) return price;

        await using var db = await factory.CreateDbContextAsync(ct);
        price = await db.Products
                        .Where(p => p.Id == productId)
                        .Select(p => p.Price)
                        .FirstAsync(ct);

        cache.Set(productId, price, TimeSpan.FromMinutes(10));
        return price;
    }
}
```

**Why:** Singletons must not capture scoped DbContext; creating a fresh one per call avoids threading and lifetime bugs. 
### High-throughput APIs (pooling)

```csharp
builder.Services.AddDbContextPool<AppDbContext>(o =>
{
    o.UseNpgsql(builder.Configuration.GetConnectionString("Default"));
    // Keep options stateless; avoid per-request mutable state
});
```
**Tip:** Pooling helps allocation/throughput. It doesn’t make DbContext thread-safe. Still one context per request.

## Five common pitfalls (and fixes)

- Sharing one DbContext across threads

**Symptom:** “A second operation started on this context before a previous operation was completed.”
**Fix:** One context per unit of work; never run parallel queries on the same context. Use separate contexts.
- Injecting DbContext into singletons

**Fix:** Inject IDbContextFactory<T> or IServiceScopeFactory and create contexts on demand.

- Keeping contexts alive too long

**Fix:** Keep them short-lived; long-lived contexts bloat change trackers and retain connections.

- Using pooling with per-request state

**Fix:** Don’t put user-specific state on the context (e.g., CurrentUserId field). Pooled contexts are reused.

- Trying to “speed up” by running multiple queries concurrently on one context

**Fix:** Either serialize the work or create multiple contexts. DbContext is not thread-safe.
## Performance notes

**- Pooling** reduces allocations under heavy load; measure with your workload.
**- Thread-safety checks:** EF Core can detect some multi-thread misuse; you can disable checks to squeeze perf, but only if you’re absolutely sure no concurrency occurs on the same context. I rarely recommend turning them off. 


For more EF Core best practices, see [EF Core Interceptors](https://thecodeman.net/posts/ef-interceptors-in-dotnet) and [4 EF Core Performance Tips](https://thecodeman.net/posts/4-entity-framework-tips-to-improve-performances).

## Wrapping Up

Managing DbContext lifetime correctly is the difference between a **stable, high-performance EF Core** app and one that randomly throws concurrency errors or quietly leaks memory. The rule of thumb is simple:

**- Default:** AddDbContext (scoped) - one context per request.
**- Background/singleton:** AddDbContextFactory - create short-lived contexts on demand.
**- High throughput:** AddDbContextPool - recycle contexts, but only if your configuration is stateless.

Think of DbContext as a **notepad for a single unit of work**: you grab a fresh sheet, write your changes, and toss it away when you’re done. 
Don’t pass it around the whole office, and don’t try to write on it with two pens at once.

By keeping contexts short-lived, isolated, and created in the right way for your workload, you’ll avoid the classic EF Core pitfalls - while keeping your app fast, predictable, and easy to maintain.

That's all from me for today. 
<!--END-->



