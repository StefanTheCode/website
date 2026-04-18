---
title: "Observer Pattern in .NET"
subtitle: "Notify multiple components when something changes without coupling them together. The Observer pattern builds event-driven systems where publishers don't know their subscribers."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 7 minutes"
meta_description: "Learn the Observer design pattern in .NET with real-world C# examples. Build event-driven systems using C# events, IObservable, and custom implementations for domain events and real-time notifications."
---

<!--START-->

## Every Time the Price Changes, Three More Things Need to Happen

You're building an e-commerce platform. When a product price changes, three things need to happen: update the search index, invalidate the cache, and notify customers who wishlisted it.

So you put all three calls in the `UpdatePrice` method:

```csharp
public class ProductService
{
    private readonly ISearchService _search;
    private readonly ICacheService _cache;
    private readonly INotificationService _notifications;

    public async Task UpdatePriceAsync(int productId, decimal newPrice)
    {
        var product = await _repo.GetByIdAsync(productId);
        product.Price = newPrice;
        await _repo.SaveAsync(product);

        // All downstream effects hardcoded here
        await _search.UpdateIndexAsync(product);
        await _cache.InvalidateAsync($"product:{productId}");
        await _notifications.NotifyWishlistUsersAsync(productId, newPrice);
    }
}
```

Next month, analytics wants price change tracking. Then compliance needs an audit log. Then the pricing team wants to trigger automatic competitor checks. Your `UpdatePriceAsync` method grows with every new subscriber.

`ProductService` knows about search, cache, notifications, analytics, compliance, and competitive intelligence. It shouldn't know about any of them.

## The Problem: Publisher Knows Its Subscribers

The `ProductService` is tightly coupled to every component that cares about price changes. Adding a new reaction means modifying the service. Removing one means modifying the service. And each new dependency makes testing harder.

The publisher shouldn't care who's listening. It should announce "price changed" and move on.

## Enter the Observer Pattern

The Observer pattern defines a one-to-many relationship between objects. When the subject (publisher) changes state, all registered observers (subscribers) get notified automatically. The publisher doesn't know who the observers are.

## Building It in .NET

You can use C# events — the language has the Observer pattern built in:

```csharp
// Event args carrying the change data
public class PriceChangedEventArgs : EventArgs
{
    public int ProductId { get; init; }
    public decimal OldPrice { get; init; }
    public decimal NewPrice { get; init; }
    public DateTime ChangedAt { get; init; }
}

// Publisher - raises events, doesn't know who listens
public class ProductService
{
    private readonly IProductRepository _repo;

    public event EventHandler<PriceChangedEventArgs>? PriceChanged;

    public ProductService(IProductRepository repo) => _repo = repo;

    public async Task UpdatePriceAsync(int productId, decimal newPrice)
    {
        var product = await _repo.GetByIdAsync(productId);
        var oldPrice = product.Price;

        product.Price = newPrice;
        await _repo.SaveAsync(product);

        // Notify all observers - publisher doesn't know who they are
        PriceChanged?.Invoke(this, new PriceChangedEventArgs
        {
            ProductId = productId,
            OldPrice = oldPrice,
            NewPrice = newPrice,
            ChangedAt = DateTime.UtcNow
        });
    }
}
```

Subscribers register independently:

```csharp
// Each observer handles one concern
public class SearchIndexUpdater
{
    private readonly ISearchService _search;

    public SearchIndexUpdater(ISearchService search, ProductService products)
    {
        _search = search;
        products.PriceChanged += OnPriceChanged;
    }

    private async void OnPriceChanged(object? sender, PriceChangedEventArgs e)
    {
        await _search.UpdatePriceAsync(e.ProductId, e.NewPrice);
    }
}

public class CacheInvalidator
{
    private readonly ICacheService _cache;

    public CacheInvalidator(ICacheService cache, ProductService products)
    {
        _cache = cache;
        products.PriceChanged += OnPriceChanged;
    }

    private async void OnPriceChanged(object? sender, PriceChangedEventArgs e)
    {
        await _cache.InvalidateAsync($"product:{e.ProductId}");
    }
}

public class WishlistNotifier
{
    private readonly INotificationService _notifications;

    public WishlistNotifier(INotificationService notifications, ProductService products)
    {
        _notifications = notifications;
        products.PriceChanged += OnPriceChanged;
    }

    private async void OnPriceChanged(object? sender, PriceChangedEventArgs e)
    {
        if (e.NewPrice < e.OldPrice) // Only notify on price drops
        {
            await _notifications.NotifyWishlistUsersAsync(e.ProductId, e.NewPrice);
        }
    }
}
```

Adding analytics? Create a new observer. Wire it in DI. `ProductService` never changes.

## Why This Is Better

**Zero coupling.** The publisher raises an event and moves on. It doesn't import, inject, or know about any observer.

**Open for extension.** Adding a new reaction is adding a new class. No existing code is modified.

**Each observer is independent.** Cache invalidation doesn't affect search indexing. A failing observer doesn't block others (with proper error handling).

## Advanced Usage: Domain Events With MediatR Notifications

For a more structured approach, combine Observer with the [Mediator pattern](https://thecodeman.net/posts/mediator-pattern-in-dotnet):

```csharp
public record PriceChangedEvent(
    int ProductId,
    decimal OldPrice,
    decimal NewPrice) : INotification;

public class ProductService
{
    private readonly IProductRepository _repo;
    private readonly IMediator _mediator;

    public async Task UpdatePriceAsync(int productId, decimal newPrice)
    {
        var product = await _repo.GetByIdAsync(productId);
        var oldPrice = product.Price;

        product.Price = newPrice;
        await _repo.SaveAsync(product);

        // Publish domain event - handlers discovered via DI
        await _mediator.Publish(new PriceChangedEvent(productId, oldPrice, newPrice));
    }
}

// Handlers registered automatically through DI scanning
public class UpdateSearchIndex : INotificationHandler<PriceChangedEvent>
{
    public Task Handle(PriceChangedEvent notification, CancellationToken ct)
        => _search.UpdatePriceAsync(notification.ProductId, notification.NewPrice);
}

public class AuditPriceChange : INotificationHandler<PriceChangedEvent>
{
    public Task Handle(PriceChangedEvent notification, CancellationToken ct)
        => _audit.LogAsync($"Price changed: {notification.OldPrice} -> {notification.NewPrice}");
}
```

No manual event wiring. DI discovers handlers automatically.

## Advanced Usage: IObservable for Streaming Data

For continuous data streams, use .NET's reactive `IObservable<T>`:

```csharp
public class StockPriceMonitor : IObservable<StockPrice>
{
    private readonly List<IObserver<StockPrice>> _observers = new();

    public IDisposable Subscribe(IObserver<StockPrice> observer)
    {
        _observers.Add(observer);
        return new Unsubscriber(_observers, observer);
    }

    public void PublishPrice(StockPrice price)
    {
        foreach (var observer in _observers)
            observer.OnNext(price);
    }

    private class Unsubscriber : IDisposable
    {
        private readonly List<IObserver<StockPrice>> _observers;
        private readonly IObserver<StockPrice> _observer;

        public Unsubscriber(List<IObserver<StockPrice>> observers,
            IObserver<StockPrice> observer)
        {
            _observers = observers;
            _observer = observer;
        }

        public void Dispose() => _observers.Remove(_observer);
    }
}

// Alert observer
public class PriceAlertObserver : IObserver<StockPrice>
{
    private readonly decimal _threshold;

    public PriceAlertObserver(decimal threshold) => _threshold = threshold;

    public void OnNext(StockPrice value)
    {
        if (value.Price > _threshold)
            Console.WriteLine($"ALERT: {value.Symbol} hit ${value.Price}");
    }

    public void OnError(Exception error) => Console.WriteLine($"Error: {error.Message}");
    public void OnCompleted() => Console.WriteLine("Market closed.");
}
```

## When NOT to Use It

**When there's only one subscriber.** If updating the price always triggers exactly one action, direct method call is clearer than the Observer machinery.

**When order matters.** Observers execute in an unpredictable order. If "update cache" must happen before "send notification," use explicit sequencing instead.

**When you need guaranteed delivery.** C# events are fire-and-forget. If an observer throws, subsequent observers may not execute. For reliable event delivery, use a message broker.

**When memory leaks are a risk.** Event handlers hold references. If observers don't unsubscribe, the publisher keeps them alive. This is a common source of memory leaks in long-lived applications.

## Key Takeaways

- Observer decouples the publisher from all subscribers using a one-to-many notification model
- C# `event` keyword is the simplest Observer implementation
- Domain events with MediatR notifications give you DI-friendly Observer with auto-discovery
- `IObservable<T>` works for continuous data streams
- Watch for memory leaks from event subscriptions and unhandled exceptions in observers
- Don't use it when you have exactly one subscriber or need guaranteed ordering

## FAQ

### What is the Observer pattern in simple terms?

The Observer pattern lets an object notify other objects when its state changes, without knowing who those objects are. Think of it like a newsletter: the publisher sends updates, subscribers receive them, and the publisher doesn't maintain a mailing list.

### When should I use the Observer pattern?

When a change in one object should trigger reactions in multiple other objects, and you don't want the source to know about them all. Common in UI frameworks, event-driven architectures, and domain events.

### Is the Observer pattern overkill?

For a single subscriber doing one thing, yes. Direct method calls are simpler. Observer becomes valuable when you have 3+ independent reactions to the same event or when the set of reactions changes over time.

### What are alternatives to the Observer pattern?

Message brokers (RabbitMQ, Azure Service Bus) for distributed systems. The [Mediator pattern](https://thecodeman.net/posts/mediator-pattern-in-dotnet) for in-process event dispatching. Polling/polling-based approaches when push notifications aren't feasible.

## Wrapping Up

The Observer pattern is the backbone of event-driven programming. C# gives you three flavors: `event` keyword for simple cases, `IObservable<T>` for streams, and MediatR notifications for DI-friendly domain events.

Pick the one that matches your complexity. Don't over-engineer simple notifications with a full event bus. And always remember to unsubscribe.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->