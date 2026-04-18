---
title: "Decorator Pattern in .NET"
subtitle: "Add behavior to objects dynamically without modifying them. The Decorator pattern wraps objects with new functionality while keeping the original interface intact."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 7 minutes"
meta_description: "Learn the Decorator design pattern in .NET with real-world C# examples. Add logging, caching, retry logic, and validation to services without modifying existing code using clean composition."
---

<!--START-->

## You Need Logging. But Not Everywhere. And Not All the Time.

Your `OrderService` works perfectly. It processes orders, charges payments, updates inventory. Clean code, well-tested.

Then the team lead says: "We need logging for every order." Easy, you add logging.

Then: "We need caching for order lookups." You add caching.

Then: "We need retry logic for payment failures." You add retry.

Now your clean `OrderService` is 300 lines with logging, caching, and retry logic tangled into the business logic. The method that was 15 lines is now 60. And half of those lines have nothing to do with orders.

What if you could add these behaviors without touching the original service at all?

## The Problem: Cross-Cutting Concerns Polluting Business Logic

Here is what the polluted code looks like:

```csharp
public class OrderService : IOrderService
{
    private readonly IOrderRepository _repo;
    private readonly ILogger<OrderService> _logger;
    private readonly IMemoryCache _cache;

    public async Task<Order?> GetByIdAsync(int id)
    {
        // Caching logic mixed in
        if (_cache.TryGetValue($"order:{id}", out Order? cached))
        {
            _logger.LogInformation("Cache hit for order {Id}", id);
            return cached;
        }

        _logger.LogInformation("Fetching order {Id} from database", id);

        // Retry logic mixed in
        Order? order = null;
        for (int attempt = 1; attempt <= 3; attempt++)
        {
            try
            {
                order = await _repo.GetByIdAsync(id);
                break;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Attempt {Attempt} failed for order {Id}", attempt, id);
                if (attempt == 3) throw;
                await Task.Delay(TimeSpan.FromSeconds(attempt));
            }
        }

        // More caching logic
        if (order != null)
            _cache.Set($"order:{id}", order, TimeSpan.FromMinutes(5));

        return order;
    }
}
```

The actual business logic — fetching an order — is one line. Everything else is infrastructure concerns. Testing the order logic means dealing with cache and retry. Changing the retry strategy means modifying a class that should only care about orders.

## Enter the Decorator Pattern

The Decorator pattern wraps an object with additional behavior while keeping the same interface. Each decorator adds one concern. You stack them like layers.

The key insight: the decorator implements the same interface as the object it wraps. Clients don't know they're talking to a decorator.

## Building It in .NET

Start with a clean service that only does its job:

```csharp
public interface IOrderService
{
    Task<Order?> GetByIdAsync(int id);
    Task<OrderResult> PlaceOrderAsync(PlaceOrderCommand command);
}

// The real service - pure business logic
public class OrderService : IOrderService
{
    private readonly IOrderRepository _repo;

    public OrderService(IOrderRepository repo) => _repo = repo;

    public async Task<Order?> GetByIdAsync(int id)
        => await _repo.GetByIdAsync(id);

    public async Task<OrderResult> PlaceOrderAsync(PlaceOrderCommand command)
    {
        var order = Order.Create(command);
        await _repo.SaveAsync(order);
        return OrderResult.Success(order.Id);
    }
}
```

Now add behavior through decorators:

```csharp
// Logging decorator
public class LoggingOrderService : IOrderService
{
    private readonly IOrderService _inner;
    private readonly ILogger<LoggingOrderService> _logger;

    public LoggingOrderService(IOrderService inner, ILogger<LoggingOrderService> logger)
    {
        _inner = inner;
        _logger = logger;
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        _logger.LogInformation("Getting order {OrderId}", id);
        var result = await _inner.GetByIdAsync(id);
        _logger.LogInformation("Order {OrderId} {Status}", id, result != null ? "found" : "not found");
        return result;
    }

    public async Task<OrderResult> PlaceOrderAsync(PlaceOrderCommand command)
    {
        _logger.LogInformation("Placing order for customer {CustomerId}", command.CustomerId);
        var result = await _inner.PlaceOrderAsync(command);
        _logger.LogInformation("Order placed: {OrderId}", result.OrderId);
        return result;
    }
}

// Caching decorator
public class CachingOrderService : IOrderService
{
    private readonly IOrderService _inner;
    private readonly IMemoryCache _cache;

    public CachingOrderService(IOrderService inner, IMemoryCache cache)
    {
        _inner = inner;
        _cache = cache;
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await _cache.GetOrCreateAsync($"order:{id}", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
            return await _inner.GetByIdAsync(id);
        });
    }

    public async Task<OrderResult> PlaceOrderAsync(PlaceOrderCommand command)
    {
        // Don't cache writes, just pass through
        return await _inner.PlaceOrderAsync(command);
    }
}

// Retry decorator
public class RetryOrderService : IOrderService
{
    private readonly IOrderService _inner;
    private readonly int _maxRetries;

    public RetryOrderService(IOrderService inner, int maxRetries = 3)
    {
        _inner = inner;
        _maxRetries = maxRetries;
    }

    public async Task<Order?> GetByIdAsync(int id)
        => await ExecuteWithRetryAsync(() => _inner.GetByIdAsync(id));

    public async Task<OrderResult> PlaceOrderAsync(PlaceOrderCommand command)
        => await ExecuteWithRetryAsync(() => _inner.PlaceOrderAsync(command));

    private async Task<T> ExecuteWithRetryAsync<T>(Func<Task<T>> action)
    {
        for (int attempt = 1; ; attempt++)
        {
            try { return await action(); }
            catch when (attempt < _maxRetries)
            {
                await Task.Delay(TimeSpan.FromSeconds(attempt));
            }
        }
    }
}
```

Register them in DI, stacking from inside out:

```csharp
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<IOrderService>(sp =>
{
    // Inner -> Retry -> Cache -> Logging (outermost)
    var service = sp.GetRequiredService<OrderService>();
    var retry = new RetryOrderService(service);
    var cache = new CachingOrderService(retry, sp.GetRequiredService<IMemoryCache>());
    var logging = new LoggingOrderService(cache, sp.GetRequiredService<ILogger<LoggingOrderService>>());
    return logging;
});
```

The call chain: Logging → Cache → Retry → OrderService. Each layer adds one behavior. Remove a layer? The rest still works.

## Why This Is Better

**Single Responsibility.** `OrderService` does orders. Logging does logging. Caching does caching. Each class has one reason to change.

**Open/Closed.** Adding authorization? Create an `AuthorizingOrderService` decorator. No existing class changes.

**Composable.** Want logging without caching? Don't wrap with the cache decorator. Want caching without retry? Skip the retry layer. Mix and match freely.

## Advanced Usage: Generic Decorator With Scrutor

The Scrutor library makes decorator registration simple:

```csharp
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.Decorate<IOrderService, CachingOrderService>();
builder.Services.Decorate<IOrderService, LoggingOrderService>();
```

Three lines. Last decorator registered is the outermost layer.

## Advanced Usage: Conditional Decorators

Add behavior based on feature flags or environment:

```csharp
builder.Services.AddScoped<IOrderService>(sp =>
{
    IOrderService service = sp.GetRequiredService<OrderService>();

    // Always retry
    service = new RetryOrderService(service);

    // Cache only in production
    if (env.IsProduction())
        service = new CachingOrderService(service, sp.GetRequiredService<IMemoryCache>());

    // Always log
    service = new LoggingOrderService(service, sp.GetRequiredService<ILogger<LoggingOrderService>>());

    return service;
});
```

## When NOT to Use It

**When you have one behavior to add.** If all you need is logging on one service, adding a decorator class feels like ceremony. A few log lines in the service is simpler.

**When the interface is large.** If your interface has 20 methods, every decorator must implement all 20 — even if it only cares about one. This creates a lot of pass-through code.

**When order matters but isn't obvious.** Stacking decorators means the registration order determines execution order. If the team doesn't understand this, debugging becomes confusing.

## Key Takeaways

- Decorators wrap objects with additional behavior while preserving the original interface
- Each decorator adds exactly one concern: logging, caching, retry, auth, etc.
- Decorators are stackable and composable — add or remove layers without affecting others
- Keep interfaces small (2-5 methods) to avoid excessive pass-through boilerplate
- Use Scrutor for clean DI registration in ASP.NET Core

## FAQ

### What is the Decorator pattern in simple terms?

The Decorator pattern wraps an object with additional functionality without modifying the original class. The wrapper implements the same interface, so clients don't know they're talking to a decorated version. Think of it as adding layers around a core object.

### When should I use the Decorator pattern?

When you need to add cross-cutting concerns (logging, caching, retry, authorization) to existing services without modifying them. It's also useful when different environments need different behavior combinations.

### Is the Decorator pattern overkill?

For adding one simple behavior to one service, yes. It shines when you have multiple concerns, multiple services, or need to compose behaviors differently across environments.

### What are alternatives to the Decorator pattern?

ASP.NET Core middleware works for HTTP-specific concerns. [MediatR pipeline behaviors](https://thecodeman.net/posts/mediatr-pipeline-behavior) handle cross-cutting concerns for request handlers. AOP frameworks like PostSharp use attributes. For simple cases, just add the behavior directly to the class.

## Wrapping Up

The Decorator pattern is the cleanest way to layer behavior onto existing code. No base class modification. No `if` flags. No inheritance chains. Just composition.

When you catch yourself adding logging, caching, or retry directly into a service for the third time, that's your signal. Extract it into a decorator and compose.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->