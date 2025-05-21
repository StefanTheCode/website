---
title: "Chain Responsibility Pattern"
subtitle: "The Chain of Responsibility pattern is a behavioral design pattern that allows you to build a chain of objects to handle a request or perform a task."
date: "Nov 25 2024"
category: "Design Patterns"
readTime: "Read Time: 3 minutes"
meta_description: "The Chain of Responsibility pattern is a behavioral design pattern that allows you to build a chain of objects to handle a request or perform a task."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • [JetBrains Rider](https://www.jetbrains.com/rider/?utm_campaign=rider_free&utm_content=site&utm_medium=cpc&utm_source=thecodeman_newsletter) is **now FREE for non-commercial development**, making it more accessible for hobbyists, students, content creators, and open source contributors.

##### [Download and start today!](https://www.jetbrains.com/rider/?utm_campaign=rider_free&utm_content=site&utm_medium=cpc&utm_source=thecodeman_newsletter)
&nbsp;  
##### • Tired of outdated API documentation holding your team back? Postman simplifies your life by [automatically syncing documentation with your API updates](https://community.postman.com/t/the-postman-drop-november-edition/71372?utm_source=influencer&utm_medium=Social&utm_campaign=nov24_global_growth_pmdropnl&utm_term=Stefan_Djokic) - no more static docs, no more guesswork!
##### [Read more](https://community.postman.com/t/the-postman-drop-november-edition/71372?utm_source=influencer&utm_medium=Social&utm_campaign=nov24_global_growth_pmdropnl&utm_term=Stefan_Djokic).

<!--START-->

&nbsp;
&nbsp;
### The background
&nbsp;
&nbsp;
##### The Chain of Responsibility pattern is a behavioral design pattern that allows you to build a chain of objects to handle a request or perform a task.
&nbsp;
##### Each object in the chain has the ability to either handle the request or pass it on to the next object in the chain. This pattern promotes loose coupling and flexibility in handling requests.
&nbsp;
##### Let's explore how to implement the Chain of Responsibility pattern in .NET 6 using a practical example.

&nbsp;
&nbsp;
### Example Scenario
&nbsp;
&nbsp;

##### Let's consider a scenario where we have a series of discount rules for an e-commerce application. Depending on the customer's profile, we want to apply different discount percentages to their orders.
&nbsp;
##### The discount rules are as follows:
&nbsp;
##### • If the customer is a VIP, apply a 20% discount.
##### • If the customer is a regular customer, apply a 10% discount.
##### • If the customer is a new customer, apply a 5% discount.
##### • If none of the above rules match, apply no discount.
&nbsp;
##### Initially, we can handle this logic using a series of If statements:

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

&nbsp;
&nbsp;
### Chain of Responsibility
&nbsp;
&nbsp;
##### While the If statements approach works, it can become unwieldy when the number of rules grows.
&nbsp;
##### The Chain of Responsibility pattern provides a more flexible and maintainable solution.
&nbsp;
##### Let's refactor the code to use this pattern.
&nbsp;
#####  ** Step #1**: Create an **abstract handler class, DiscountHandler**, that defines a common interface for all discount handlers:

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

&nbsp;
##### **Step #2**: Implement **concrete discount handlers** by deriving from DiscountHandler. Each handler will handle a specific rule and decide whether to apply a discount or pass the request to the next handler.
&nbsp;
##### **VIPDiscountHandler:**

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

&nbsp;
##### **RegularDiscountHandler:**

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

&nbsp;
##### **NewCustomerDiscountHandler:**

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

&nbsp;
##### **NoDiscountHandler:**

```csharp

public class NoDiscountHandler : DiscountHandler
{
    public override decimal CalculateDiscount(Customer customer, decimal orderTotal)
    {
        return orderTotal; // no discount
    }
}

```

&nbsp;
##### **Step #3:** With the concrete handlers in place, we can create the chain by linking them together:

```csharp

var vipHandler = new VIPDiscountHandler();

vipHandler.SetNextHandler(new RegularDiscountHandler())
          .SetNextHandler(new NewCustomerDiscountHandler())
          .SetNextHandler(new NoDiscountHandler());

```

&nbsp;
##### Finally, we can invoke the chain by calling the **CalculateDiscount method** on the first handler in the chain:

```csharp

decimal discountAmount = vipHandler.CalculateDiscount(customer, orderTotal);
```

&nbsp;
&nbsp;
### Pros and Cons? 
&nbsp;
&nbsp;

##### What are the benefits from this?
&nbsp;
##### **1. Flexibility**
&nbsp;
##### The Chain of Responsibility pattern allows you to dynamically modify or extend the chain without affecting other parts of the code. You can add or remove handlers as needed.

&nbsp;
##### **2. Loose coupling**
&nbsp;
##### The pattern promotes loose coupling between the sender of a request and its receivers. Each handler only needs to know about its immediate successor, minimizing dependencies.

&nbsp;
##### **3. Single Responsibility Principle**
&nbsp;
##### You can decouple classes that invoke operations from classes that perform operations.
&nbsp;
&nbsp;
####  **Okay,what about Drawbacks?**

&nbsp;
##### **1. Request may go unhandled**
&nbsp;
##### If none of the handlers in the chain can handle the request, it may go unhandled, leading to unexpected behavior. It's important to have a default handler or a way to handle such scenarios.

&nbsp;
##### **2. Potential performance impact**
&nbsp;
##### If the chain becomes very long, it may result in performance overhead due to the traversal of multiple handlers.
&nbsp;

##### Remember, it's essential to strike a balance between the number of handlers and performance considerations when applying this pattern to real-world scenarios.

&nbsp;
##### That's all from me for today.
&nbsp;

<!--END-->

## ** dream BIG! **