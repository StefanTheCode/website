---
title: "Builder Pattern in .NET"
subtitle: "Stop passing 15 parameters to constructors. The Builder pattern lets you construct complex objects step by step with a clean, readable API."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 8 minutes"
meta_description: "Learn the Builder design pattern in .NET with real-world C# examples. Build complex objects step by step using fluent APIs, avoid telescoping constructors, and integrate cleanly with dependency injection."
---

<!--START-->

## The Constructor That Keeps Growing

You started with a simple `EmailMessage` class. Four parameters: to, subject, body, from.

Then someone needed CC. Then BCC. Then attachments. Then priority. Then reply-to. Then a flag for HTML vs plain text. Then custom headers. Then read receipts.

```csharp
var email = new EmailMessage(
    "user@example.com",      // to
    "Welcome!",              // subject
    "<h1>Hello</h1>",        // body
    "noreply@app.com",       // from
    null,                    // cc
    null,                    // bcc
    new List<Attachment>(),  // attachments
    Priority.Normal,         // priority
    null,                    // replyTo
    true,                    // isHtml
    null,                    // customHeaders
    false                    // readReceipt
);
```

Twelve parameters. Half of them are `null`. Nobody remembers which position is which without hovering over the constructor. And every time you add a new parameter, every call site breaks.

This is the telescoping constructor problem. And it gets worse as the object gets more complex.

## The Problem: Complex Object Construction

The real pain isn't just the ugly constructor. It's the combinations.

Some emails have attachments but no CC. Some need read receipts with high priority. Some are plain text with custom headers. Creating a constructor overload for every valid combination is impossible.

So developers do one of two things: they create a monster constructor with 15 optional parameters, or they use object initializers with mutable properties:

```csharp
var email = new EmailMessage
{
    To = "user@example.com",
    Subject = "Welcome!",
    Body = "<h1>Hello</h1>",
    IsHtml = true
    // Easy to forget required fields
    // Object is in an invalid state until all fields are set
};
```

This looks cleaner but introduces a new problem: the object can exist in an invalid state. What if someone forgets to set `To`? Or sets `Body` but not `Subject`? You only find out at runtime.

## Enter the Builder Pattern

The Builder pattern separates the construction of a complex object from its representation. You build the object step by step, and the builder ensures you get a valid, complete object at the end.

## Building It in .NET

Define the product and a fluent builder:

```csharp
public class EmailMessage
{
    public string To { get; }
    public string From { get; }
    public string Subject { get; }
    public string Body { get; }
    public bool IsHtml { get; }
    public List<string> Cc { get; }
    public List<string> Bcc { get; }
    public List<Attachment> Attachments { get; }
    public Priority Priority { get; }
    public string? ReplyTo { get; }
    public Dictionary<string, string> CustomHeaders { get; }

    // Only the builder can create this
    internal EmailMessage(EmailMessageBuilder builder)
    {
        To = builder.To;
        From = builder.From;
        Subject = builder.Subject;
        Body = builder.Body;
        IsHtml = builder.IsHtml;
        Cc = builder.Cc;
        Bcc = builder.Bcc;
        Attachments = builder.Attachments;
        Priority = builder.Priority;
        ReplyTo = builder.ReplyTo;
        CustomHeaders = builder.CustomHeaders;
    }
}
```

Now the builder with a fluent API:

```csharp
public class EmailMessageBuilder
{
    // Required fields
    internal string To { get; private set; } = string.Empty;
    internal string From { get; private set; } = string.Empty;
    internal string Subject { get; private set; } = string.Empty;
    internal string Body { get; private set; } = string.Empty;

    // Optional fields with defaults
    internal bool IsHtml { get; private set; } = false;
    internal List<string> Cc { get; private set; } = new();
    internal List<string> Bcc { get; private set; } = new();
    internal List<Attachment> Attachments { get; private set; } = new();
    internal Priority Priority { get; private set; } = Priority.Normal;
    internal string? ReplyTo { get; private set; }
    internal Dictionary<string, string> CustomHeaders { get; private set; } = new();

    public EmailMessageBuilder SetTo(string to)
    {
        To = to;
        return this;
    }

    public EmailMessageBuilder SetFrom(string from)
    {
        From = from;
        return this;
    }

    public EmailMessageBuilder SetSubject(string subject)
    {
        Subject = subject;
        return this;
    }

    public EmailMessageBuilder SetBody(string body, bool isHtml = false)
    {
        Body = body;
        IsHtml = isHtml;
        return this;
    }

    public EmailMessageBuilder AddCc(string cc)
    {
        Cc.Add(cc);
        return this;
    }

    public EmailMessageBuilder AddBcc(string bcc)
    {
        Bcc.Add(bcc);
        return this;
    }

    public EmailMessageBuilder AddAttachment(Attachment attachment)
    {
        Attachments.Add(attachment);
        return this;
    }

    public EmailMessageBuilder SetPriority(Priority priority)
    {
        Priority = priority;
        return this;
    }

    public EmailMessageBuilder SetReplyTo(string replyTo)
    {
        ReplyTo = replyTo;
        return this;
    }

    public EmailMessageBuilder AddHeader(string key, string value)
    {
        CustomHeaders[key] = value;
        return this;
    }

    public EmailMessage Build()
    {
        // Validate required fields before building
        if (string.IsNullOrWhiteSpace(To))
            throw new InvalidOperationException("Recipient (To) is required.");
        if (string.IsNullOrWhiteSpace(From))
            throw new InvalidOperationException("Sender (From) is required.");
        if (string.IsNullOrWhiteSpace(Subject))
            throw new InvalidOperationException("Subject is required.");

        return new EmailMessage(this);
    }
}
```

Now constructing an email is readable and safe:

```csharp
var email = new EmailMessageBuilder()
    .SetTo("user@example.com")
    .SetFrom("noreply@app.com")
    .SetSubject("Your order has shipped")
    .SetBody("<h1>Order #1234 is on the way</h1>", isHtml: true)
    .SetPriority(Priority.High)
    .AddAttachment(invoicePdf)
    .AddHeader("X-Campaign-Id", "spring-sale-2026")
    .Build();
```

Each step is self-documenting. The `Build()` method validates everything before creating the object. You can't end up with an email missing a recipient.

## Why This Is Better

**No invalid objects.** Validation happens in `Build()`. The object either exists in a valid state or throws during construction.

**Self-documenting code.** `SetPriority(Priority.High)` is infinitely more readable than a positional parameter buried in position 8.

**Optional fields are truly optional.** You only call the methods you need. No passing `null` for fields you don't care about.

**Immutable products.** The `EmailMessage` uses `get`-only properties. Once built, it can't be modified.

## Advanced Usage: Director Pattern for Presets

When you find yourself building the same configurations repeatedly, extract a Director:

```csharp
public class EmailDirector
{
    public EmailMessageBuilder WelcomeEmail(string to)
    {
        return new EmailMessageBuilder()
            .SetTo(to)
            .SetFrom("noreply@app.com")
            .SetSubject("Welcome to our platform!")
            .SetBody(WelcomeTemplate.Render(), isHtml: true)
            .SetPriority(Priority.Normal)
            .AddHeader("X-Email-Type", "welcome");
    }

    public EmailMessageBuilder OrderConfirmation(string to, Order order)
    {
        return new EmailMessageBuilder()
            .SetTo(to)
            .SetFrom("orders@app.com")
            .SetSubject($"Order #{order.Id} confirmed")
            .SetBody(OrderTemplate.Render(order), isHtml: true)
            .SetPriority(Priority.High)
            .AddAttachment(InvoiceGenerator.Create(order));
    }
}
```

Callers can still customize after the director sets up the base:

```csharp
var email = director
    .OrderConfirmation("customer@example.com", order)
    .AddCc("manager@company.com")  // customize further
    .Build();
```

## Advanced Usage: Building Configuration Objects

The Builder pattern works great for complex configuration in DI setups:

```csharp
public class RetryPolicyBuilder
{
    private int _maxRetries = 3;
    private TimeSpan _delay = TimeSpan.FromSeconds(1);
    private Func<Exception, bool> _shouldRetry = _ => true;
    private Action<Exception, int>? _onRetry;

    public RetryPolicyBuilder MaxRetries(int retries)
    {
        _maxRetries = retries;
        return this;
    }

    public RetryPolicyBuilder WithDelay(TimeSpan delay)
    {
        _delay = delay;
        return this;
    }

    public RetryPolicyBuilder RetryWhen(Func<Exception, bool> predicate)
    {
        _shouldRetry = predicate;
        return this;
    }

    public RetryPolicyBuilder OnRetry(Action<Exception, int> callback)
    {
        _onRetry = callback;
        return this;
    }

    public RetryPolicy Build() => new(_maxRetries, _delay, _shouldRetry, _onRetry);
}

// Usage in startup
builder.Services.AddSingleton(
    new RetryPolicyBuilder()
        .MaxRetries(5)
        .WithDelay(TimeSpan.FromSeconds(2))
        .RetryWhen(ex => ex is HttpRequestException)
        .OnRetry((ex, attempt) => Log.Warning("Retry {Attempt}: {Error}", attempt, ex.Message))
        .Build());
```

## When NOT to Use It

**Simple objects with few fields.** If your constructor has 3-4 parameters and no optional ones, a builder adds ceremony for no benefit.

**When the object never changes.** If the construction is simple and stable, a constructor or static factory method is simpler.

**When immutability isn't needed.** If the object is a plain DTO that gets modified after creation anyway, a builder's validation guarantees lose their value.

## Key Takeaways

- The Builder pattern eliminates telescoping constructors and invalid object states
- Fluent APIs make construction code self-documenting
- `Build()` is your validation gate - the object is either valid or doesn't exist
- Directors encapsulate common construction recipes
- Don't use it for simple objects with few fields - it's overhead without value

## FAQ

### What is the Builder pattern in simple terms?

The Builder pattern constructs complex objects step by step. Instead of calling a constructor with many parameters, you call descriptive methods to set each part, then call `Build()` to create the final, validated object.

### When should I use the Builder pattern?

Use it when objects have many optional parameters, when the construction process requires validation, or when you need to create different representations of the same type. It's especially useful for configuration objects and message builders.

### Is the Builder pattern overkill?

For objects with 3-4 simple fields and no optional parameters, yes. The Builder adds value when constructors get complex, when objects need to be immutable, or when you have many valid configurations.

### What are alternatives to the Builder pattern?

For simple cases, constructor overloads or static factory methods work fine. C# records with `with` expressions offer a lightweight alternative for immutable objects. Object initializers work when validation at construction time isn't critical.

## Wrapping Up

The Builder pattern solves a very human problem: constructors that nobody can read. When your objects get complex, the fluent API makes construction code that reads like documentation.

Start using it when your constructors hit 5+ parameters or when you find yourself passing `null` for optional fields. Your future self will thank you when reading the code six months later.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->