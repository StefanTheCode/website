---
title: "State Pattern in .NET"
subtitle: "Let objects change behavior when their state changes. The State pattern eliminates sprawling switch statements by encapsulating state-specific logic in dedicated classes."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 7 minutes"
meta_description: "Learn the State design pattern in .NET with real-world C# examples. Replace complex switch statements with clean state classes for order processing, workflow engines, and document management."
---

<!--START-->

## Your Order Status Switch Statement Has 47 Cases

Order processing seemed simple. An order is Created, then Paid, then Shipped, then Delivered. Four states. A switch statement handles it fine.

Then returns happened. And partial payments. And hold states for fraud review. And "awaiting stock" for backorders. And cancellation at every stage (with different rules for each).

Your `ProcessOrder` method now has a giant switch statement where each case checks the current status and decides what's allowed:

```csharp
public class OrderService
{
    public async Task<Result> ProcessActionAsync(Order order, string action)
    {
        switch (order.Status)
        {
            case OrderStatus.Created:
                if (action == "pay") { /* process payment */ }
                else if (action == "cancel") { /* cancel and refund */ }
                else return Result.Invalid("Cannot perform this action");
                break;
            case OrderStatus.Paid:
                if (action == "ship") { /* create shipment */ }
                else if (action == "cancel") { /* refund payment first, then cancel */ }
                else if (action == "hold") { /* fraud review */ }
                else return Result.Invalid("Cannot perform this action");
                break;
            case OrderStatus.Shipped:
                if (action == "deliver") { /* mark delivered */ }
                else if (action == "return") { /* initiate return */ }
                // Can't cancel shipped orders!
                else return Result.Invalid("Cannot perform this action");
                break;
            case OrderStatus.OnHold:
                if (action == "release") { /* back to paid */ }
                else if (action == "cancel") { /* cancel with refund */ }
                else return Result.Invalid("Cannot perform this action");
                break;
            // 8 more states...
        }
    }
}
```

Each new state adds cases everywhere. Each new action adds conditions in every state. Testing means testing every state × action combination in one massive method.

## The Problem: Behavior Depends on State

The order behaves differently depending on its status. A "cancel" action does different things in "Created" vs "Paid" vs "Shipped." But all that behavior is jammed into one method with conditionals sorting it out.

This violates the Open/Closed Principle. Adding a new state means modifying existing code, risking bugs in states that already work.

## Enter the State Pattern

The State pattern encapsulates state-specific behavior in separate classes. The object delegates behavior to its current state object. When the state changes, the behavior changes automatically. No switch statements.

## Building It in .NET

Define a state interface and concrete states:

```csharp
// State interface - what an order can do
public interface IOrderState
{
    string Name { get; }
    Task<Result> PayAsync(OrderContext context);
    Task<Result> ShipAsync(OrderContext context);
    Task<Result> DeliverAsync(OrderContext context);
    Task<Result> CancelAsync(OrderContext context);
    Task<Result> HoldAsync(OrderContext context);
}

// Shared context that states operate on
public class OrderContext
{
    public Order Order { get; }
    public IOrderState CurrentState { get; private set; }
    private readonly IServiceProvider _services;

    public OrderContext(Order order, IServiceProvider services)
    {
        Order = order;
        _services = services;
        CurrentState = ResolveState(order.Status);
    }

    public void TransitionTo(IOrderState newState)
    {
        CurrentState = newState;
        Order.Status = Enum.Parse<OrderStatus>(newState.Name);
    }

    public T GetService<T>() where T : notnull
        => _services.GetRequiredService<T>();

    private IOrderState ResolveState(OrderStatus status) => status switch
    {
        OrderStatus.Created => new CreatedState(),
        OrderStatus.Paid => new PaidState(),
        OrderStatus.Shipped => new ShippedState(),
        OrderStatus.Delivered => new DeliveredState(),
        OrderStatus.OnHold => new OnHoldState(),
        _ => throw new InvalidOperationException($"Unknown state: {status}")
    };
}
```

Implement each state with its own behavior:

```csharp
public class CreatedState : IOrderState
{
    public string Name => "Created";

    public async Task<Result> PayAsync(OrderContext context)
    {
        var payment = context.GetService<IPaymentService>();
        var result = await payment.ChargeAsync(context.Order.PaymentDetails);

        if (!result.Success)
            return Result.Failed("Payment failed");

        context.TransitionTo(new PaidState());
        return Result.Ok("Payment processed");
    }

    public Task<Result> ShipAsync(OrderContext context)
        => Task.FromResult(Result.Invalid("Cannot ship an unpaid order"));

    public Task<Result> DeliverAsync(OrderContext context)
        => Task.FromResult(Result.Invalid("Cannot deliver an unpaid order"));

    public async Task<Result> CancelAsync(OrderContext context)
    {
        // No payment to refund - just cancel
        context.TransitionTo(new CancelledState());
        return Result.Ok("Order cancelled");
    }

    public Task<Result> HoldAsync(OrderContext context)
        => Task.FromResult(Result.Invalid("Cannot hold an unpaid order"));
}

public class PaidState : IOrderState
{
    public string Name => "Paid";

    public Task<Result> PayAsync(OrderContext context)
        => Task.FromResult(Result.Invalid("Order is already paid"));

    public async Task<Result> ShipAsync(OrderContext context)
    {
        var shipping = context.GetService<IShippingService>();
        var tracking = await shipping.CreateShipmentAsync(context.Order);

        context.Order.TrackingNumber = tracking;
        context.TransitionTo(new ShippedState());
        return Result.Ok($"Shipped: {tracking}");
    }

    public Task<Result> DeliverAsync(OrderContext context)
        => Task.FromResult(Result.Invalid("Order hasn't shipped yet"));

    public async Task<Result> CancelAsync(OrderContext context)
    {
        // Must refund payment before cancelling
        var payment = context.GetService<IPaymentService>();
        await payment.RefundAsync(context.Order.PaymentId);

        context.TransitionTo(new CancelledState());
        return Result.Ok("Order cancelled and refunded");
    }

    public async Task<Result> HoldAsync(OrderContext context)
    {
        context.TransitionTo(new OnHoldState());
        return Result.Ok("Order placed on hold for review");
    }
}

public class ShippedState : IOrderState
{
    public string Name => "Shipped";

    public Task<Result> PayAsync(OrderContext context)
        => Task.FromResult(Result.Invalid("Order is already paid"));

    public Task<Result> ShipAsync(OrderContext context)
        => Task.FromResult(Result.Invalid("Order is already shipped"));

    public async Task<Result> DeliverAsync(OrderContext context)
    {
        context.Order.DeliveredAt = DateTime.UtcNow;
        context.TransitionTo(new DeliveredState());
        return Result.Ok("Order delivered");
    }

    public Task<Result> CancelAsync(OrderContext context)
        => Task.FromResult(Result.Invalid("Cannot cancel a shipped order. Initiate a return instead."));

    public Task<Result> HoldAsync(OrderContext context)
        => Task.FromResult(Result.Invalid("Cannot hold a shipped order"));
}
```

The service becomes clean:

```csharp
public class OrderService
{
    private readonly IServiceProvider _services;

    public async Task<Result> ProcessActionAsync(Order order, string action)
    {
        var context = new OrderContext(order, _services);

        return action switch
        {
            "pay" => await context.CurrentState.PayAsync(context),
            "ship" => await context.CurrentState.ShipAsync(context),
            "deliver" => await context.CurrentState.DeliverAsync(context),
            "cancel" => await context.CurrentState.CancelAsync(context),
            "hold" => await context.CurrentState.HoldAsync(context),
            _ => Result.Invalid($"Unknown action: {action}")
        };
    }
}
```

No massive switch on status. Each state knows its own rules.

## Why This Is Better

**Each state is a single class.** All behavior for "Paid" is in `PaidState`. Easy to find, easy to test, easy to modify.

**Adding a new state doesn't touch existing states.** Create `BackorderedState` with its own rules. Existing states are untouched.

**Invalid transitions are explicit.** A shipped order can't be cancelled — that's defined clearly in `ShippedState.CancelAsync`, not buried in a switch case.

## Advanced Usage: State Machine With Guard Conditions

```csharp
public class DocumentState
{
    public static readonly DocumentState Draft = new("Draft");
    public static readonly DocumentState Review = new("Review");
    public static readonly DocumentState Approved = new("Approved");
    public static readonly DocumentState Published = new("Published");

    public string Name { get; }
    private DocumentState(string name) => Name = name;
}

public class DocumentStateMachine
{
    private static readonly Dictionary<(DocumentState From, string Action), 
        (DocumentState To, Func<Document, bool> Guard)> _transitions = new()
    {
        [(DocumentState.Draft, "submit")] = (DocumentState.Review, 
            doc => !string.IsNullOrEmpty(doc.Content)),
        [(DocumentState.Review, "approve")] = (DocumentState.Approved, 
            doc => doc.ReviewerCount >= 2),
        [(DocumentState.Review, "reject")] = (DocumentState.Draft, 
            _ => true),
        [(DocumentState.Approved, "publish")] = (DocumentState.Published, 
            doc => doc.ScheduledDate <= DateTime.UtcNow),
    };

    public Result TryTransition(Document doc, string action)
    {
        var key = (doc.State, action);

        if (!_transitions.TryGetValue(key, out var transition))
            return Result.Invalid($"Cannot {action} from {doc.State.Name}");

        if (!transition.Guard(doc))
            return Result.Invalid($"Guard condition not met for {action}");

        doc.State = transition.To;
        return Result.Ok($"Transitioned to {transition.To.Name}");
    }
}
```

## When NOT to Use It

**When you have 2-3 states with simple logic.** A small switch or if-else is perfectly readable for simple state machines.

**When states don't have different behavior.** If every state does the same thing (just updating a field), the State pattern creates classes with no real logic.

**When transitions are complex and data-driven.** If your state machine comes from a database with configurable transitions, consider a table-driven approach or a state machine library like Stateless.

## Key Takeaways

- State pattern replaces large switch statements with dedicated state classes
- Each state encapsulates its own behavior and valid transitions
- Invalid transitions are explicit and self-documenting
- Adding a new state is adding a new class, not modifying existing ones
- For very simple state machines (2-3 states), a switch is fine

## FAQ

### What is the State pattern in simple terms?

The State pattern lets an object change its behavior when its internal state changes. Instead of checking the current state with switch statements, the object delegates to a state object that knows what to do for that specific state.

### When should I use the State pattern?

When an object's behavior changes dramatically based on its state, and you have 4+ states with different rules per state. Order processing, document workflows, and approval pipelines are classic examples.

### Is the State pattern overkill?

For 2-3 states with minimal logic differences, yes. A switch statement is clearer. The pattern pays off when states multiply and each has complex, independent behavior.

### What are alternatives to the State pattern?

Switch/if-else for simple cases. State machine libraries (Stateless for .NET) for configurable transitions. Table-driven approaches for data-driven state machines. The [Strategy pattern](https://thecodeman.net/posts/strategy-design-pattern-will-help-you-refactor-code) when you want to swap behavior without tracking transitions.

## Wrapping Up

The State pattern turns spaghetti switch statements into organized, testable classes. Every state is a class. Every transition is explicit. Every invalid operation returns a clear message.

If your switch statement on `status` or `state` keeps growing, that's your signal. Extract each case into a state class and let the pattern handle the rest.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->