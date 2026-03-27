---
title: "Chain Responsibility Pattern"
subtitle: "The Chain of Responsibility pattern is a behavioral design pattern that allows you to build a chain of objects to handle a request or perform a task."
date: "Nov 25 2024"
category: "Design Patterns"
readTime: "Read Time: 3 minutes"
meta_description: "The Chain of Responsibility pattern is a behavioral design pattern that allows you to build a chain of objects to handle a request or perform a task."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• <a href="https://www.jetbrains.com/rider/?utm_campaign=rider_free&utm_content=site&utm_medium=cpc&utm_source=thecodeman_newsletter" style="color: #a5b4fc; text-decoration: underline;">JetBrains Rider</a> is **now FREE for non-commercial development**, making it more accessible for hobbyists, students, content creators, and open source contributors.</p>
<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;"><a href="https://www.jetbrains.com/rider/?utm_campaign=rider_free&utm_content=site&utm_medium=cpc&utm_source=thecodeman_newsletter" style="color: #a5b4fc; text-decoration: underline;">Download and start today!</a></p>
<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Tired of outdated API documentation holding your team back? Postman simplifies your life by <a href="https://community.postman.com/t/the-postman-drop-november-edition/71372?utm_source=influencer&utm_medium=Social&utm_campaign=nov24_global_growth_pmdropnl&utm_term=Stefan_Djokic" style="color: #a5b4fc; text-decoration: underline;">automatically syncing documentation with your API updates</a> - no more static docs, no more guesswork! <a href="https://community.postman.com/t/the-postman-drop-november-edition/71372?utm_source=influencer&utm_medium=Social&utm_campaign=nov24_global_growth_pmdropnl&utm_term=Stefan_Djokic" style="color: #a5b4fc; text-decoration: underline;">Read more</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## The background
The Chain of Responsibility pattern is a behavioral design pattern that allows you to build a chain of objects to handle a request or perform a task.
Each object in the chain has the ability to either handle the request or pass it on to the next object in the chain. This pattern promotes loose coupling and flexibility in handling requests.
Let's explore how to implement the Chain of Responsibility pattern in .NET 6 using a practical example.

## Example Scenario

Let's consider a scenario where we have a series of discount rules for an e-commerce application. Depending on the customer's profile, we want to apply different discount percentages to their orders.
The discount rules are as follows:
• If the customer is a VIP, apply a 20% discount.
• If the customer is a regular customer, apply a 10% discount.
• If the customer is a new customer, apply a 5% discount.
• If none of the above rules match, apply no discount.
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

    public void SetNextHandler(DiscountHandler nextHandler)
    {
        _nextHandler = nextHandler;
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
1. Flexibility
The Chain of Responsibility pattern allows you to dynamically modify or extend the chain without affecting other parts of the code. You can add or remove handlers as needed.

2. Loose coupling
The pattern promotes loose coupling between the sender of a request and its receivers. Each handler only needs to know about its immediate successor, minimizing dependencies.

3. Single Responsibility Principle
You can decouple classes that invoke operations from classes that perform operations.
### Okay,what about Drawbacks?

1. Request may go unhandled
If none of the handlers in the chain can handle the request, it may go unhandled, leading to unexpected behavior. It's important to have a default handler or a way to handle such scenarios.

2. Potential performance impact
If the chain becomes very long, it may result in performance overhead due to the traversal of multiple handlers.

Remember, it's essential to strike a balance between the number of handlers and performance considerations when applying this pattern to real-world scenarios.

That's all from me for today.


For more design patterns, check out the [Strategy Pattern in .NET](https://thecodeman.net/posts/strategy-design-pattern-will-help-you-refactor-code) and the [Adapter Pattern in .NET](https://thecodeman.net/posts/simplifying-integration-with-adapter-pattern).

## Wrapping Up

<!--END-->

## dream BIG!
