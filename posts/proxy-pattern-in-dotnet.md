---
title: "Proxy Pattern in .NET"
subtitle: "Control access to objects without clients knowing. The Proxy pattern wraps real objects with access control, lazy loading, caching, or logging — transparently."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 7 minutes"
meta_description: "Learn the Proxy design pattern in .NET with real-world C# examples. Implement virtual proxies for lazy loading, protection proxies for authorization, and caching proxies for performance optimization."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored - I write these deep dives in my free time and keep them free for everyone. If your company sells AI tools, dev tools, courses, or services that .NET developers would actually use, sponsoring an issue is the most direct way to reach them.</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>

## Your API Calls an External Service 10,000 Times a Day. For the Same Data.

You integrated a currency exchange rate API. Every time someone views a product price, you call the external API to get the latest rate. Clean. Accurate. Real-time.

Then traffic grows. 10,000 product views per hour. Each one fires an HTTP call to the exchange API. The external API rate-limits you. Your response times triple. Your monthly API bill quadruples.

The exchange rates change once a day. You're making 240,000 redundant calls.

You could add caching directly to the service. But then your `ExchangeRateService` handles both business logic and caching. And you'd need the same caching logic in every external service you call.

## The Problem: Cross-Cutting Concerns Embedded in Service Code

```csharp
public class ExchangeRateService : IExchangeRateService
{
    private readonly HttpClient _client;
    private readonly IMemoryCache _cache; // Caching logic leaking in

    public async Task<decimal> GetRateAsync(string from, string to)
    {
        var key = $"rate:{from}:{to}";

        // Service now manages its own cache
        if (_cache.TryGetValue(key, out decimal cached))
            return cached;

        var response = await _client.GetAsync($"/rates/{from}/{to}");
        var rate = await response.Content.ReadFromJsonAsync<decimal>();

        _cache.Set(key, rate, TimeSpan.FromHours(1));
        return rate;
    }
}
```

Now every external service needs the same caching boilerplate. And if you want to add rate limiting, you repeat that too. And logging. The service grows with concerns it shouldn't own.

## Enter the Proxy Pattern

The Proxy pattern provides a surrogate object that controls access to the real object. The proxy implements the same interface, so clients can't tell the difference. But between the client and the real object, the proxy can add caching, access control, lazy loading, or logging.

## Building It in .NET

Keep the real service clean. Add a caching proxy:

```csharp
// Clean service - only business logic
public class ExchangeRateService : IExchangeRateService
{
    private readonly HttpClient _client;

    public ExchangeRateService(HttpClient client) => _client = client;

    public async Task<decimal> GetRateAsync(string from, string to)
    {
        var response = await _client.GetAsync($"/rates/{from}/{to}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<decimal>();
    }
}

// Caching proxy - same interface, added behavior
public class CachingExchangeRateProxy : IExchangeRateService
{
    private readonly IExchangeRateService _realService;
    private readonly IMemoryCache _cache;

    public CachingExchangeRateProxy(
        IExchangeRateService realService,
        IMemoryCache cache)
    {
        _realService = realService;
        _cache = cache;
    }

    public async Task<decimal> GetRateAsync(string from, string to)
    {
        var key = $"exchange-rate:{from}:{to}";

        return await _cache.GetOrCreateAsync(key, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
            // Only call the real service on cache miss
            return await _realService.GetRateAsync(from, to);
        });
    }
}
```

Register with DI:

```csharp
builder.Services.AddHttpClient<ExchangeRateService>();
builder.Services.AddScoped<IExchangeRateService>(sp =>
{
    var real = sp.GetRequiredService<ExchangeRateService>();
    var cache = sp.GetRequiredService<IMemoryCache>();
    return new CachingExchangeRateProxy(real, cache);
});
```

Clients inject `IExchangeRateService` and get the proxy. They never know caching is happening.

## Why This Is Better

**Service stays clean.** `ExchangeRateService` only handles API calls. No caching, no logging, no access control mixed in.

**Transparent to clients.** Any consumer of `IExchangeRateService` works identically whether it gets the real service or the proxy.

**Stackable.** Wrap the caching proxy with a logging proxy. Wrap that with a rate-limiting proxy. Each layer adds one concern.

## Advanced Usage: Protection Proxy for Authorization

Control access to sensitive operations:

```csharp
public class AuthorizingOrderService : IOrderService
{
    private readonly IOrderService _inner;
    private readonly ICurrentUser _currentUser;

    public AuthorizingOrderService(IOrderService inner, ICurrentUser currentUser)
    {
        _inner = inner;
        _currentUser = currentUser;
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        // Read access - any authenticated user
        if (!_currentUser.IsAuthenticated)
            throw new UnauthorizedAccessException("Authentication required");

        var order = await _inner.GetByIdAsync(id);

        // Ensure users can only see their own orders
        if (order != null && order.CustomerId != _currentUser.Id
            && !_currentUser.IsInRole("Admin"))
            throw new ForbiddenException("Access denied");

        return order;
    }

    public async Task<OrderResult> DeleteOrderAsync(int id)
    {
        // Delete - admin only
        if (!_currentUser.IsInRole("Admin"))
            throw new ForbiddenException("Only admins can delete orders");

        return await _inner.DeleteOrderAsync(id);
    }
}
```

Authorization logic lives in the proxy. The real `OrderService` doesn't know about permissions.

## Advanced Usage: Virtual Proxy for Lazy Loading

Defer expensive initialization until first use:

```csharp
public class LazyReportGenerator : IReportGenerator
{
    private readonly Lazy<IReportGenerator> _realGenerator;

    public LazyReportGenerator(IServiceProvider provider)
    {
        // Heavy dependencies loaded only when needed
        _realGenerator = new Lazy<IReportGenerator>(() =>
        {
            // This triggers loading ML models, compiling templates, etc.
            return provider.GetRequiredService<HeavyReportGenerator>();
        });
    }

    public async Task<Report> GenerateAsync(ReportRequest request)
    {
        // First call triggers initialization
        return await _realGenerator.Value.GenerateAsync(request);
    }
}

// Register the lazy proxy
builder.Services.AddScoped<HeavyReportGenerator>();
builder.Services.AddScoped<IReportGenerator, LazyReportGenerator>();
```

The ML models and templates only load when someone actually generates a report. Not on every request to the application.

## Advanced Usage: Rate-Limiting Proxy

Protect external APIs from overuse:

```csharp
public class RateLimitingProxy<T> where T : class
{
    private readonly T _inner;
    private readonly SemaphoreSlim _semaphore;
    private readonly int _maxConcurrent;

    public RateLimitingProxy(T inner, int maxConcurrent = 5)
    {
        _inner = inner;
        _maxConcurrent = maxConcurrent;
        _semaphore = new SemaphoreSlim(maxConcurrent);
    }
}

public class RateLimitedExchangeService : IExchangeRateService
{
    private readonly IExchangeRateService _inner;
    private static readonly SemaphoreSlim _semaphore = new(5);

    public RateLimitedExchangeService(IExchangeRateService inner)
        => _inner = inner;

    public async Task<decimal> GetRateAsync(string from, string to)
    {
        await _semaphore.WaitAsync();
        try
        {
            return await _inner.GetRateAsync(from, to);
        }
        finally
        {
            _semaphore.Release();
        }
    }
}
```

## When NOT to Use It

**When there's nothing to control.** If you just need a service with no caching, auth, or lazy loading, a proxy is unnecessary indirection.

**When the Decorator pattern fits better.** Proxy and [Decorator](https://thecodeman.net/posts/decorator-pattern-in-dotnet) look similar. Use Proxy when the focus is controlling access. Use Decorator when the focus is adding behavior.

**When transparency causes confusion.** If the team can't figure out which implementation is actually running, the "transparent" nature of the proxy becomes a debugging problem.

## Key Takeaways

- Proxy controls access to an object through the same interface — clients don't know the proxy exists
- Caching proxy reduces redundant external API calls dramatically
- Protection proxy centralizes authorization logic away from business code
- Virtual proxy defers expensive initialization until first use
- Proxies are stackable: caching → rate limiting → logging → real service
- Don't add a proxy when there's nothing to control

## FAQ

### What is the Proxy pattern in simple terms?

The Proxy pattern puts an intermediary between the client and a real object. The intermediary has the same interface, so the client doesn't know it's there. It can add caching, access control, lazy loading, or logging transparently.

### When should I use the Proxy pattern?

When you need to add a cross-cutting concern (caching, auth, rate limiting) to a service without modifying it. Also when you need lazy initialization of expensive objects or remote service abstraction.

### Is the Proxy pattern overkill?

For a service with no access control, caching, or lazy loading needs, yes. It adds a layer of indirection that only pays off when you have a concrete concern to address.

### What is the difference between Proxy and Decorator?

Both wrap an object with the same interface. The Proxy controls access (caching, auth, lazy loading). The [Decorator](https://thecodeman.net/posts/decorator-pattern-in-dotnet) adds behavior (logging, metrics, retry). The intent differs even though the structure is similar.

## Wrapping Up

The Proxy pattern is everywhere in .NET. `HttpClientHandler` is a proxy. EF Core's lazy-loading navigation properties are virtual proxies. ASP.NET Core's authorization middleware is a protection proxy.

When you need to intercept, control, or optimize access to an object without the client knowing, the Proxy pattern is your tool.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->