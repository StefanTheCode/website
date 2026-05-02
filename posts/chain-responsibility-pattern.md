---
title: "Chain of Responsibility Pattern in .NET"
subtitle: "The Chain of Responsibility pattern is a behavioral design pattern that allows you to build a chain of objects to handle a request or perform a task."
date: "Nov 25 2024"
category: "Design Patterns"
readTime: "Read Time: 7 minutes"
meta_description: "Learn the Chain of Responsibility design pattern in .NET with a practical C# example. Build flexible, maintainable request pipelines using linked handlers instead of nested if-else chains."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">- <a href="https://www.jetbrains.com/rider/?utm_campaign=rider_free&utm_content=site&utm_medium=cpc&utm_source=thecodeman_newsletter" style="color: #a5b4fc; text-decoration: underline;">JetBrains Rider</a> is **now FREE for non-commercial development**, making it more accessible for hobbyists, students, content creators, and open source contributors.</p>
<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;"><a href="https://www.jetbrains.com/rider/?utm_campaign=rider_free&utm_content=site&utm_medium=cpc&utm_source=thecodeman_newsletter" style="color: #a5b4fc; text-decoration: underline;">Download and start today!</a></p>
<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">- Tired of outdated API documentation holding your team back? Postman simplifies your life by <a href="https://community.postman.com/t/the-postman-drop-november-edition/71372?utm_source=influencer&utm_medium=Social&utm_campaign=nov24_global_growth_pmdropnl&utm_term=Stefan_Djokic" style="color: #a5b4fc; text-decoration: underline;">automatically syncing documentation with your API updates</a> - no more static docs, no more guesswork! <a href="https://community.postman.com/t/the-postman-drop-november-edition/71372?utm_source=influencer&utm_medium=Social&utm_campaign=nov24_global_growth_pmdropnl&utm_term=Stefan_Djokic" style="color: #a5b4fc; text-decoration: underline;">Read more</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers.<br/><br/><a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</p>
</div>


## The background
The Chain of Responsibility pattern is a behavioral design pattern that allows you to build a chain of objects to handle a request or perform a task.
Each object in the chain has the ability to either handle the request or pass it on to the next object in the chain. This pattern promotes loose coupling and flexibility in handling requests.
Let's explore how to implement the Chain of Responsibility pattern in .NET using a practical example.

## Example Scenario

Let's consider a scenario where we have a series of discount rules for an e-commerce application. Depending on the customer's profile, we want to apply different discount percentages to their orders.
The discount rules are as follows:
- If the customer is a VIP, apply a 20% discount.
- If the customer is a regular customer, apply a 10% discount.
- If the customer is a new customer, apply a 5% discount.
- If none of the above rules match, apply no discount.
Initially, we can handle this logic using a series of If statements:

```csharp
public decimal CalculateDiscount(Customer customer, decimal orderTotal)
{
    if (customer.IsVIP)
    {
        return orderTotal * 0.8m; // 20% discount
    }
    else if (customer.IsRegular)
    {
        return orderTotal * 0.9m; // 10% discount
    }
    else if (customer.IsNew)
    {
        return orderTotal * 0.95m; // 5% discount
    }
    else
    {
        return orderTotal; // no discount
    }
}
```

## Chain of Responsibility
While the If statements approach works, it can become unwieldy when the number of rules grows.
The Chain of Responsibility pattern provides a more flexible and maintainable solution.
Let's refactor the code to use this pattern.
** Step #1**: Create an **abstract handler class, DiscountHandler**, that defines a common interface for all discount handlers:

```csharp
public abstract class DiscountHandler
{
    protected DiscountHandler _nextHandler;

    public DiscountHandler SetNextHandler(DiscountHandler nextHandler)
    {
        _nextHandler = nextHandler;
        return nextHandler;
    }

    public abstract decimal CalculateDiscount(Customer customer, decimal orderTotal);
}
```

**Step #2**: Implement **concrete discount handlers** by deriving from DiscountHandler. Each handler will handle a specific rule and decide whether to apply a discount or pass the request to the next handler.
VIPDiscountHandler:

```csharp
public class VIPDiscountHandler : DiscountHandler
{
    public override decimal CalculateDiscount(Customer customer, decimal orderTotal)
    {
        if (customer.IsVIP)
        {
            return orderTotal * 0.8m; // 20% discount
        }

        return _nextHandler?.CalculateDiscount(customer, orderTotal) ?? orderTotal;
    }
}
```

RegularDiscountHandler:

```csharp
public class RegularDiscountHandler : DiscountHandler
{
    public override decimal CalculateDiscount(Customer customer, decimal orderTotal)
    {
        if (customer.IsRegular)
        {
            return orderTotal * 0.9m; // 10% discount
        }

        return _nextHandler?.CalculateDiscount(customer, orderTotal) ?? orderTotal;
    }
}
```

NewCustomerDiscountHandler:

```csharp
public class NewCustomerDiscountHandler : DiscountHandler
{
    public override decimal CalculateDiscount(Customer customer, decimal orderTotal)
    {
        if (customer.IsNew)
        {
            return orderTotal * 0.95m; // 5% discount
        }

        return _nextHandler?.CalculateDiscount(customer, orderTotal) ?? orderTotal;
    }
}
```

NoDiscountHandler:

```csharp
public class NoDiscountHandler : DiscountHandler
{
    public override decimal CalculateDiscount(Customer customer, decimal orderTotal)
    {
        return orderTotal; // no discount
    }
}
```

**Step #3:** With the concrete handlers in place, we can create the chain by linking them together:

```csharp
var vipHandler = new VIPDiscountHandler();

vipHandler.SetNextHandler(new RegularDiscountHandler())
          .SetNextHandler(new NewCustomerDiscountHandler())
          .SetNextHandler(new NoDiscountHandler());
```

Finally, we can invoke the chain by calling the **CalculateDiscount method** on the first handler in the chain:

```csharp
decimal discountAmount = vipHandler.CalculateDiscount(customer, orderTotal);
```

## Pros and Cons? 

What are the benefits from this?

**1. Flexibility**

The Chain of Responsibility pattern allows you to dynamically modify or extend the chain without affecting other parts of the code. You can add or remove handlers as needed.

**2. Loose coupling**

The pattern promotes loose coupling between the sender of a request and its receivers. Each handler only needs to know about its immediate successor, minimizing dependencies.

**3. Single Responsibility Principle**

You can decouple classes that invoke operations from classes that perform operations. Each handler does one thing and does it well.

**4. Open/Closed Principle**

You can introduce new handlers without changing existing ones. The chain grows without modifying the code that uses it.

### What about Drawbacks?

**1. Request may go unhandled**

If none of the handlers in the chain can handle the request, it may go unhandled, leading to unexpected behavior. Always include a default handler at the end of the chain (like `NoDiscountHandler` above).

**2. Potential performance impact**

If the chain becomes very long, it may result in performance overhead due to the traversal of multiple handlers. In practice, this is rarely a problem unless you have dozens of handlers.

**3. Debugging complexity**

When something goes wrong, tracing which handler processed (or skipped) a request can be harder than reading a simple if-else block. Good logging inside each handler solves this.

## When to Use the Chain of Responsibility Pattern

This pattern shines when:

- **You have multiple objects that can handle a request**, and the handler is not known in advance. The chain figures it out at runtime.
- **The set of handlers changes dynamically.** You need to add, remove, or reorder processing steps without touching existing code.
- **You want to avoid a fat class** with dozens of if-else branches that all live in one method.
- **Request processing must happen in a specific order.** Each handler validates or transforms the request before passing it along.

Real-world examples in .NET:

- **ASP.NET Core Middleware** - every middleware component in the pipeline is a handler. It either processes the request or calls `next()`. This is the Chain of Responsibility pattern in action.
- **Validation pipelines** - validate input through a series of rules (e.g., check format, check business rules, check permissions) where each rule is a handler.
- **Logging and enrichment** - pass a log entry through handlers that enrich it with context, redact sensitive data, or route it to different sinks.
- **Approval workflows** - a purchase request goes through manager, director, and VP approval handlers based on the amount.

## A More Realistic Example: Request Validation Pipeline

The discount example is great for learning, but let me show you something closer to production code.

Imagine you have an API endpoint that creates orders. Before processing, you need to validate the request through multiple steps:

```csharp
public abstract class OrderValidationHandler
{
    protected OrderValidationHandler _next;

    public OrderValidationHandler SetNext(OrderValidationHandler next)
    {
        _next = next;
        return next;
    }

    public abstract Result Validate(CreateOrderRequest request);

    protected Result CallNext(CreateOrderRequest request)
    {
        return _next?.Validate(request) ?? Result.Success();
    }
}
```

Each handler checks one thing:

```csharp
public class StockAvailabilityHandler : OrderValidationHandler
{
    private readonly IInventoryService _inventory;

    public StockAvailabilityHandler(IInventoryService inventory)
    {
        _inventory = inventory;
    }

    public override Result Validate(CreateOrderRequest request)
    {
        foreach (var item in request.Items)
        {
            if (!_inventory.IsInStock(item.ProductId, item.Quantity))
            {
                return Result.Failure($"Product {item.ProductId} is out of stock.");
            }
        }

        return CallNext(request);
    }
}

public class PaymentValidationHandler : OrderValidationHandler
{
    public override Result Validate(CreateOrderRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PaymentMethodId))
        {
            return Result.Failure("Payment method is required.");
        }

        return CallNext(request);
    }
}

public class FraudCheckHandler : OrderValidationHandler
{
    private readonly IFraudService _fraudService;

    public FraudCheckHandler(IFraudService fraudService)
    {
        _fraudService = fraudService;
    }

    public override Result Validate(CreateOrderRequest request)
    {
        if (_fraudService.IsSuspicious(request))
        {
            return Result.Failure("Order flagged for review.");
        }

        return CallNext(request);
    }
}
```

Wire it up:

```csharp
var stockHandler = new StockAvailabilityHandler(inventoryService);

stockHandler
    .SetNext(new PaymentValidationHandler())
    .SetNext(new FraudCheckHandler(fraudService));

Result result = stockHandler.Validate(orderRequest);
```

Each handler has a single responsibility. Adding a new validation step (like address verification) means creating one new class and linking it into the chain. Zero changes to existing handlers.

Compare this to a single method with 5 nested if statements and multiple service dependencies. The chain is easier to test, easier to extend, and easier to read.

## Frequently Asked Questions

### What is the Chain of Responsibility pattern?

The Chain of Responsibility is a behavioral design pattern where a request is passed along a chain of handlers. Each handler decides whether to process the request or forward it to the next handler. This decouples the sender from the receiver and allows multiple objects to handle the request without the sender knowing which one will.

### How is Chain of Responsibility used in ASP.NET Core?

ASP.NET Core middleware is a direct implementation of this pattern. Each middleware component in the HTTP pipeline receives a request, optionally processes it, and calls `next()` to pass it to the next middleware. Authentication, CORS, routing, and exception handling all work this way.

### When should I use Chain of Responsibility instead of if-else?

Use Chain of Responsibility when you have more than 3-4 conditions that are likely to grow over time, when each condition has complex logic that deserves its own class, or when you need to add, remove, or reorder rules without modifying existing code. For simple, stable conditions, if-else is perfectly fine.

### Can I use Chain of Responsibility with dependency injection in .NET?

Yes. Register each handler in the DI container and resolve them in your composition root. You can also use a factory that builds the chain based on configuration. This lets handlers have their own dependencies (like services or repositories) injected through the constructor.

### What is the difference between Chain of Responsibility and Strategy pattern?

The Strategy pattern selects one algorithm from a set and executes it. The Chain of Responsibility passes a request through multiple handlers sequentially, where each handler can process, modify, or skip the request. Strategy is "pick one", Chain of Responsibility is "try each in order".

For more design patterns, check out the [Strategy Pattern in .NET](https://thecodeman.net/posts/strategy-design-pattern-will-help-you-refactor-code) and the [Adapter Pattern in .NET](https://thecodeman.net/posts/simplifying-integration-with-adapter-pattern).

## Wrapping Up

The Chain of Responsibility pattern turns tangled if-else logic into a clean, extensible pipeline of handlers.

Each handler does one thing. You can add, remove, or reorder steps without touching existing code. And if you have ever used ASP.NET Core middleware, you have already been using this pattern.

Start simple: identify a method with multiple branching conditions, extract each branch into a handler, and link them into a chain. The code becomes easier to test, easier to maintain, and easier to explain.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

Want more design patterns with real-world examples? My ebook [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) covers 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with hands-on C# code you can use right away. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

<!--END-->
