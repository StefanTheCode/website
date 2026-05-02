---
title: "Mediator Pattern in .NET"
subtitle: "Stop letting your services become a tangled web of dependencies. The Mediator pattern decouples components so they communicate through a central hub instead of directly referencing each other."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 8 minutes"
meta_description: "Learn the Mediator design pattern in .NET with real-world C# examples. Discover when to use the Mediator pattern, how it decouples components, and how to implement it with dependency injection in production systems."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored - I write these deep dives in my free time and keep them free for everyone. If your company sells AI tools, dev tools, courses, or services that .NET developers would actually use, sponsoring an issue is the most direct way to reach them.</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>

## When Every Service Knows About Every Other Service

You start building a checkout flow. The `OrderService` calls the `InventoryService` to reserve stock. Then it calls the `PaymentService` to charge the card. Then it notifies the `NotificationService` to send a confirmation email. Then it updates the `AnalyticsService` with the order data.

Six months later, someone adds loyalty points. Now `OrderService` also calls `LoyaltyService`. Then discount codes arrive, and `OrderService` needs `DiscountService`. Then fraud detection. Then shipping estimation.

Your `OrderService` constructor now takes 9 dependencies. Every time a new requirement shows up, you crack open the same class, inject another service, and add more orchestration logic.

Sound familiar?

This is what happens when components talk directly to each other. It works great... until it doesn't.

## The Real Problem: A Web of Direct Dependencies

Here is what a typical tightly coupled checkout looks like:

```csharp
public class OrderService
{
    private readonly IInventoryService _inventory;
    private readonly IPaymentService _payment;
    private readonly INotificationService _notification;
    private readonly IAnalyticsService _analytics;
    private readonly ILoyaltyService _loyalty;
    private readonly IFraudService _fraud;

    public OrderService(
        IInventoryService inventory,
        IPaymentService payment,
        INotificationService notification,
        IAnalyticsService analytics,
        ILoyaltyService loyalty,
        IFraudService fraud)
    {
        _inventory = inventory;
        _payment = payment;
        _notification = notification;
        _analytics = analytics;
        _loyalty = loyalty;
        _fraud = fraud;
    }

    public async Task<OrderResult> PlaceOrderAsync(OrderRequest request)
    {
        // Fraud check first
        var fraudResult = await _fraud.CheckAsync(request);
        if (fraudResult.IsSuspicious) return OrderResult.Rejected("Fraud detected");

        // Reserve inventory
        var reserved = await _inventory.ReserveAsync(request.Items);
        if (!reserved) return OrderResult.Failed("Out of stock");

        // Charge payment
        var payment = await _payment.ChargeAsync(request.PaymentDetails);
        if (!payment.Success) return OrderResult.Failed("Payment failed");

        // Side effects
        await _notification.SendOrderConfirmationAsync(request.Email);
        await _analytics.TrackOrderAsync(request);
        await _loyalty.AddPointsAsync(request.CustomerId, request.Total);

        return OrderResult.Success();
    }
}
```

Every service is wired directly into `OrderService`. Adding a new step means modifying this class. Removing a step means modifying this class. Reordering steps means modifying this class.

Testing? You need to mock 6 services just to test one method. And if `NotificationService` changes its interface, `OrderService` breaks even though sending emails has nothing to do with placing orders.

This violates the Open/Closed Principle. And it turns your service into a God class that knows way too much about the system.

## Enter the Mediator Pattern

The Mediator pattern solves this by introducing a central object that coordinates communication between components. Instead of services calling each other directly, they send messages through the mediator. No service knows about any other service.

Think of it like an air traffic control tower. Planes don't talk to each other. They talk to the tower, and the tower coordinates everything.

Let's build this from scratch.

## Building a Mediator in .NET

Start with two simple interfaces: one for requests that return a response, and one for the mediator itself.

```csharp
// Marker interface for requests
public interface IRequest<TResponse> { }

// Every request gets exactly one handler
public interface IRequestHandler<in TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    Task<TResponse> HandleAsync(TRequest request, CancellationToken ct = default);
}

// The mediator dispatches requests to handlers
public interface IMediator
{
    Task<TResponse> SendAsync<TResponse>(
        IRequest<TResponse> request,
        CancellationToken ct = default);
}
```

Now implement the mediator. It resolves the right handler from the DI container and invokes it:

```csharp
public class Mediator : IMediator
{
    private readonly IServiceProvider _provider;

    public Mediator(IServiceProvider provider)
    {
        _provider = provider;
    }

    public async Task<TResponse> SendAsync<TResponse>(
        IRequest<TResponse> request,
        CancellationToken ct = default)
    {
        // Build the handler type dynamically
        var handlerType = typeof(IRequestHandler<,>)
            .MakeGenericType(request.GetType(), typeof(TResponse));

        // Resolve from DI
        var handler = _provider.GetRequiredService(handlerType);

        // Invoke HandleAsync via reflection
        var method = handlerType.GetMethod(nameof(IRequestHandler<IRequest<TResponse>, TResponse>.HandleAsync))!;
        
        var task = (Task<TResponse>)method.Invoke(handler, new object[] { request, ct })!;

        return await task;
    }
}
```

## Refactoring the Checkout with the Mediator

Now define a command for placing an order:

```csharp
public record PlaceOrderCommand(
    string CustomerId,
    List<OrderItem> Items,
    PaymentDetails PaymentDetails,
    string Email) : IRequest<OrderResult>;
```

And a dedicated handler that owns the checkout logic:

```csharp
public class PlaceOrderHandler : IRequestHandler<PlaceOrderCommand, OrderResult>
{
    private readonly IInventoryService _inventory;
    private readonly IPaymentService _payment;

    public PlaceOrderHandler(
        IInventoryService inventory,
        IPaymentService payment)
    {
        // Only inject what this handler actually needs
        _inventory = inventory;
        _payment = payment;
    }

    public async Task<OrderResult> HandleAsync(
        PlaceOrderCommand command,
        CancellationToken ct = default)
    {
        var reserved = await _inventory.ReserveAsync(command.Items);
        if (!reserved) return OrderResult.Failed("Out of stock");

        var payment = await _payment.ChargeAsync(command.PaymentDetails);
        if (!payment.Success) return OrderResult.Failed("Payment failed");

        return OrderResult.Success();
    }
}
```

Now your API controller becomes dead simple:

```csharp
[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> PlaceOrder(
        PlaceOrderRequest request,
        CancellationToken ct)
    {
        var command = new PlaceOrderCommand(
            request.CustomerId,
            request.Items,
            request.PaymentDetails,
            request.Email);

        var result = await _mediator.SendAsync(command, ct);

        return result.IsSuccess
            ? Ok(result)
            : BadRequest(result.Error);
    }
}
```

The controller doesn't know about inventory, payments, notifications, or anything else. It sends a command and gets a result. That's it.

## Why This Is Better

**Each handler owns exactly one responsibility.** `PlaceOrderHandler` handles placing orders. `SendConfirmationHandler` handles confirmations. No class does two things.

**Adding features doesn't touch existing code.** Need fraud detection? Create a `FraudCheckHandler` or add a pipeline behavior. The existing handler stays untouched.

**Testing becomes trivial.** You test each handler in isolation with only its real dependencies. No mocking 6 services to test one flow.

**The controller stays thin.** It maps HTTP to a command and delegates. That's the right level of responsibility for a controller.

## Advanced Usage: Pipeline Behaviors

This is where the Mediator pattern gets really powerful. You can wrap handlers with cross-cutting concerns like logging, validation, and caching - without touching the handler code.

Define a pipeline behavior interface:

```csharp
public interface IPipelineBehavior<in TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    Task<TResponse> HandleAsync(
        TRequest request,
        CancellationToken ct,
        Func<Task<TResponse>> next);
}
```

Now build a validation behavior that runs before the handler:

```csharp
public class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> HandleAsync(
        TRequest request,
        CancellationToken ct,
        Func<Task<TResponse>> next)
    {
        // Run all validators before reaching the handler
        var failures = _validators
            .Select(v => v.Validate(request))
            .Where(r => !r.IsValid)
            .SelectMany(r => r.Errors)
            .ToList();

        if (failures.Count > 0)
            throw new ValidationException(failures);

        // Only call the handler if validation passes
        return await next();
    }
}
```

And a logging behavior that wraps every request with timing:

```csharp
public class LoggingBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> HandleAsync(
        TRequest request,
        CancellationToken ct,
        Func<Task<TResponse>> next)
    {
        var requestName = typeof(TRequest).Name;
        _logger.LogInformation("Handling {Request}", requestName);

        var sw = Stopwatch.StartNew();
        var response = await next();
        sw.Stop();

        _logger.LogInformation(
            "Handled {Request} in {ElapsedMs}ms",
            requestName,
            sw.ElapsedMilliseconds);

        return response;
    }
}
```

Register everything in DI:

```csharp
builder.Services.AddScoped<IMediator, Mediator>();

// Register handlers
builder.Services.AddScoped<
    IRequestHandler<PlaceOrderCommand, OrderResult>,
    PlaceOrderHandler>();

// Register pipeline behaviors (order matters)
builder.Services.AddScoped(
    typeof(IPipelineBehavior<,>),
    typeof(LoggingBehavior<,>));
builder.Services.AddScoped(
    typeof(IPipelineBehavior<,>),
    typeof(ValidationBehavior<,>));
```

Now every request automatically gets logged and validated. No decorators on controllers. No attribute hacks. Just clean composition.

## Advanced Usage: Notifications (One-to-Many)

Sometimes you need one event to trigger multiple handlers. Order placed? Send an email, update analytics, add loyalty points - all independently.

```csharp
public interface INotification { }

public interface INotificationHandler<in TNotification>
    where TNotification : INotification
{
    Task HandleAsync(TNotification notification, CancellationToken ct);
}

// Publish to all registered handlers
public async Task PublishAsync<TNotification>(
    TNotification notification,
    CancellationToken ct) where TNotification : INotification
{
    var handlerType = typeof(INotificationHandler<>)
        .MakeGenericType(typeof(TNotification));

    var handlers = _provider.GetServices(handlerType);

    foreach (var handler in handlers)
    {
        var method = handlerType.GetMethod(nameof(INotificationHandler<TNotification>.HandleAsync))!;
        var task = (Task)method.Invoke(handler, new object[] { notification, ct })!;
        await task;
    }
}
```

Now each side effect is its own handler. Adding loyalty points? New handler. Removing analytics? Delete a handler. The `PlaceOrderHandler` never changes.

```csharp
public record OrderPlacedNotification(
    string OrderId,
    string CustomerId,
    decimal Total,
    string Email) : INotification;

// Each handler is independent
public class SendConfirmationHandler : INotificationHandler<OrderPlacedNotification>
{
    private readonly INotificationService _notifications;

    public SendConfirmationHandler(INotificationService notifications)
        => _notifications = notifications;

    public Task HandleAsync(OrderPlacedNotification n, CancellationToken ct)
        => _notifications.SendOrderConfirmationAsync(n.Email);
}

public class AddLoyaltyPointsHandler : INotificationHandler<OrderPlacedNotification>
{
    private readonly ILoyaltyService _loyalty;

    public AddLoyaltyPointsHandler(ILoyaltyService loyalty)
        => _loyalty = loyalty;

    public Task HandleAsync(OrderPlacedNotification n, CancellationToken ct)
        => _loyalty.AddPointsAsync(n.CustomerId, n.Total);
}
```

## When NOT to Use the Mediator Pattern

The Mediator pattern is not always the right call. Here is when to skip it:

**Simple CRUD apps.** If your API just maps HTTP to database calls, a mediator adds indirection for no benefit. A service class is perfectly fine.

**When you have 3 handlers total.** The overhead of the mediator infrastructure isn't worth it until you have enough handlers to justify the abstraction.

**When debugging matters more than decoupling.** The mediator hides the call chain. Instead of `OrderService -> PaymentService`, you get `Controller -> Mediator -> ???`. For some teams, that indirection makes debugging harder.

**When it becomes religion.** I've seen teams wrap every single method call in a mediator command. Getting a user by ID does not need to go through a mediator. Use it for operations with real complexity or cross-cutting concerns.

## Key Takeaways

- The Mediator pattern decouples components by routing communication through a central hub
- Each handler owns one responsibility and can be tested in isolation
- Pipeline behaviors let you add logging, validation, caching, and retry logic without modifying handlers
- Notifications enable one-to-many communication for side effects
- Don't use it for simple CRUD or when you only have a handful of operations
- The pattern shines in systems with complex workflows, multiple cross-cutting concerns, and teams that need clear boundaries between features

## FAQ

### What is the Mediator pattern in simple terms?

The Mediator pattern is a design pattern where objects communicate through a central mediator instead of directly referencing each other. In .NET, this typically means sending command or query objects to a mediator, which routes them to the correct handler. This reduces coupling between components.

### When should I use the Mediator pattern?

Use it when your services have many dependencies on each other, when you need cross-cutting behaviors like logging or validation across multiple operations, or when you want clear separation between your API layer and business logic. It works well in CQRS architectures and systems with complex workflows.

### Is the Mediator pattern overkill?

For simple CRUD applications or small projects with a few services, yes. The indirection adds complexity without enough benefit. It becomes valuable when you have 10+ handlers, need pipeline behaviors, or multiple teams working on the same codebase.

### What are alternatives to the Mediator pattern?

Direct service injection works fine for simple cases. The [Chain of Responsibility pattern](https://thecodeman.net/posts/chain-responsibility-pattern) is great for sequential processing pipelines. For event-driven communication, consider domain events or a message bus. You can also [implement CQRS without MediatR](https://thecodeman.net/posts/how-to-implement-cqrs-without-mediatr) using simple interfaces.

## Wrapping Up

The Mediator pattern is one of those patterns that solves a very specific problem: too many components knowing about too many other components. When you feel the pain of a constructor with 8 dependencies or a service class that changes every sprint, that's your signal.

Start with the simple mediator. Add pipeline behaviors when cross-cutting concerns show up. Use notifications when side effects keep piling into your handlers. And stop when the abstraction starts costing more than it saves.

If you're dealing with problems like this in production and want to go deeper, I cover the Mediator pattern along with 4 other essential patterns (Builder, Decorator, Strategy, Adapter) in my ebook [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Each one comes with production C# code you can use right away.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->