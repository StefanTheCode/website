---
title: "Chain Responsibility Pattern"
subtitle: "The Chain of Responsibility pattern is a behavioral design pattern that allows you to build a chain of objects to handle a request or perform a task."
date: "Nov 25 2024"
readTime: "Read Time: 3 minutes"
photoUrl: "/images/blog/newsletter21.png"
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

<br>
<br>
### The background
<br>
<br>
##### The Chain of Responsibility pattern is a behavioral design pattern that allows you to build a chain of objects to handle a request or perform a task.
<br>
##### Each object in the chain has the ability to either handle the request or pass it on to the next object in the chain. This pattern promotes loose coupling and flexibility in handling requests.
<br>
##### Let's explore how to implement the Chain of Responsibility pattern in .NET 6 using a practical example.

<br>
<br>
### Example Scenario
<br>
<br>

##### Let's consider a scenario where we have a series of discount rules for an e-commerce application. Depending on the customer's profile, we want to apply different discount percentages to their orders.
<br>
##### The discount rules are as follows:
<br>
##### • If the customer is a VIP, apply a 20% discount.
##### • If the customer is a regular customer, apply a 10% discount.
##### • If the customer is a new customer, apply a 5% discount.
##### • If none of the above rules match, apply no discount.
<br>
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

<br>
<br>
### Chain of Responsibility
<br>
<br>
##### While the If statements approach works, it can become unwieldy when the number of rules grows.
<br>
##### The Chain of Responsibility pattern provides a more flexible and maintainable solution.
<br>
##### Let's refactor the code to use this pattern.
<br>
#####  <b> Step #1</b>: Create an <b>abstract handler class, DiscountHandler</b>, that defines a common interface for all discount handlers:

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

<br>
##### <b>Step #2</b>: Implement <b>concrete discount handlers</b> by deriving from DiscountHandler. Each handler will handle a specific rule and decide whether to apply a discount or pass the request to the next handler.
<br>
##### <b>VIPDiscountHandler:</b>

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

<br>
##### <b>RegularDiscountHandler:</b>

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

<br>
##### <b>NewCustomerDiscountHandler:</b>

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

<br>
##### <b>NoDiscountHandler:</b>

```csharp

public class NoDiscountHandler : DiscountHandler
{
    public override decimal CalculateDiscount(Customer customer, decimal orderTotal)
    {
        return orderTotal; // no discount
    }
}

```

<br>
##### <b>Step #3:</b> With the concrete handlers in place, we can create the chain by linking them together:

```csharp

var vipHandler = new VIPDiscountHandler();

vipHandler.SetNextHandler(new RegularDiscountHandler())
          .SetNextHandler(new NewCustomerDiscountHandler())
          .SetNextHandler(new NoDiscountHandler());

```

<br>
##### Finally, we can invoke the chain by calling the <b>CalculateDiscount method</b> on the first handler in the chain:

```csharp

decimal discountAmount = vipHandler.CalculateDiscount(customer, orderTotal);
```

<br>
<br>
### Pros and Cons? 
<br>
<br>

##### What are the benefits from this?
<br>
##### <b>1. Flexibility</b>
<br>
##### The Chain of Responsibility pattern allows you to dynamically modify or extend the chain without affecting other parts of the code. You can add or remove handlers as needed.

<br>
##### <b>2. Loose coupling</b>
<br>
##### The pattern promotes loose coupling between the sender of a request and its receivers. Each handler only needs to know about its immediate successor, minimizing dependencies.

<br>
##### <b>3. Single Responsibility Principle</b>
<br>
##### You can decouple classes that invoke operations from classes that perform operations.
<br>
<br>
####  <b>Okay,what about Drawbacks?</b>

<br>
##### <b>1. Request may go unhandled</b>
<br>
##### If none of the handlers in the chain can handle the request, it may go unhandled, leading to unexpected behavior. It's important to have a default handler or a way to handle such scenarios.

<br>
##### <b>2. Potential performance impact</b>
<br>
##### If the chain becomes very long, it may result in performance overhead due to the traversal of multiple handlers.
<br>

##### Remember, it's essential to strike a balance between the number of handlers and performance considerations when applying this pattern to real-world scenarios.

<br>
##### That's all from me for today.
<br>

<!--END-->

## <b > dream BIG! </b>