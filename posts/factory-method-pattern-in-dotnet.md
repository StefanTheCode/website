---
title: "Factory Method Pattern in .NET"
subtitle: "Let subclasses decide which objects to create. The Factory Method pattern gives you a clean extension point without modifying existing code."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 7 minutes"
meta_description: "Learn the Factory Method design pattern in .NET with real-world C# examples. Create objects through an interface, extend without modifying, and integrate cleanly with ASP.NET Core dependency injection."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored - I write these deep dives in my free time and keep them free for everyone. If your company sells AI tools, dev tools, courses, or services that .NET developers would actually use, sponsoring an issue is the most direct way to reach them.</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>

## The Switch Statement That Never Stops Growing

You're building a notification system. Users can receive notifications via email, SMS, or push notification. Simple enough:

```csharp
public class NotificationService
{
    public async Task SendAsync(string userId, string message, string channel)
    {
        switch (channel)
        {
            case "email":
                var smtp = new SmtpClient("smtp.company.com");
                await smtp.SendMailAsync(new MailMessage("noreply@app.com", userId, "Alert", message));
                break;
            case "sms":
                var twilio = new TwilioClient("account-sid", "auth-token");
                await twilio.SendSmsAsync(userId, message);
                break;
            case "push":
                var firebase = new FirebaseClient("server-key");
                await firebase.SendPushAsync(userId, message);
                break;
            default:
                throw new NotSupportedException($"Channel {channel} not supported");
        }
    }
}
```

Next quarter, someone adds Slack. Then Microsoft Teams. Then WhatsApp. Each time, you open `NotificationService`, add a case, add a dependency, and pray you don't break the other channels.

Every new channel requires modifying existing, working code. That's the opposite of extensible.

## The Problem: Creation Logic Mixed With Business Logic

The core issue is that `NotificationService` is doing two things: deciding which notifier to create AND sending the notification. These are separate concerns.

Testing is painful too. You can't test the email path without also having Twilio and Firebase dependencies available. Mocking means mocking the entire service. And each new channel makes the test setup worse.

## Enter the Factory Method Pattern

The Factory Method pattern defines an interface for creating an object, but lets subclasses or implementations decide which class to instantiate. The creation logic is separated from the usage logic.

## Building It in .NET

Define a common interface and a factory method:

```csharp
// Common interface for all notifiers
public interface INotifier
{
    Task SendAsync(string recipient, string message);
}

// Concrete notifiers
public class EmailNotifier : INotifier
{
    private readonly SmtpSettings _settings;

    public EmailNotifier(SmtpSettings settings) => _settings = settings;

    public async Task SendAsync(string recipient, string message)
    {
        using var client = new SmtpClient(_settings.Host, _settings.Port);
        var mail = new MailMessage(_settings.From, recipient, "Notification", message);
        await client.SendMailAsync(mail);
    }
}

public class SmsNotifier : INotifier
{
    private readonly ITwilioClient _client;

    public SmsNotifier(ITwilioClient client) => _client = client;

    public async Task SendAsync(string recipient, string message)
    {
        await _client.SendSmsAsync(recipient, message);
    }
}

public class PushNotifier : INotifier
{
    private readonly IFirebaseClient _client;

    public PushNotifier(IFirebaseClient client) => _client = client;

    public async Task SendAsync(string recipient, string message)
    {
        await _client.SendPushAsync(recipient, message);
    }
}
```

Now the factory method that creates the right notifier:

```csharp
public interface INotifierFactory
{
    INotifier Create(string channel);
}

public class NotifierFactory : INotifierFactory
{
    private readonly IServiceProvider _provider;

    public NotifierFactory(IServiceProvider provider)
    {
        _provider = provider;
    }

    public INotifier Create(string channel)
    {
        return channel.ToLower() switch
        {
            "email" => _provider.GetRequiredService<EmailNotifier>(),
            "sms" => _provider.GetRequiredService<SmsNotifier>(),
            "push" => _provider.GetRequiredService<PushNotifier>(),
            _ => throw new NotSupportedException($"Channel '{channel}' is not supported")
        };
    }
}
```

The service becomes clean:

```csharp
public class NotificationService
{
    private readonly INotifierFactory _factory;

    public NotificationService(INotifierFactory factory)
    {
        _factory = factory;
    }

    public async Task SendAsync(string userId, string message, string channel)
    {
        // Creation is delegated to the factory
        var notifier = _factory.Create(channel);
        await notifier.SendAsync(userId, message);
    }
}
```

`NotificationService` no longer knows about SMTP, Twilio, or Firebase. It asks the factory for a notifier and uses it. Adding Slack means adding `SlackNotifier` and updating the factory. The service never changes.

## Why This Is Better

**Open for extension, closed for modification.** Adding a new notification channel means creating one new class and updating the factory. `NotificationService` stays untouched.

**Each notifier is testable independently.** You test `EmailNotifier` with an SMTP mock. You test `SmsNotifier` with a Twilio mock. No cross-contamination.

**Dependencies are isolated.** `EmailNotifier` only knows about SMTP. `PushNotifier` only knows about Firebase. No more God class with every SDK injected.

## Advanced Usage: Convention-Based Registration

For teams with many implementations, register notifiers by convention so the factory discovers them automatically:

```csharp
// Marker attribute for auto-discovery
[AttributeUsage(AttributeTargets.Class)]
public class NotificationChannelAttribute : Attribute
{
    public string Channel { get; }
    public NotificationChannelAttribute(string channel) => Channel = channel;
}

[NotificationChannel("slack")]
public class SlackNotifier : INotifier
{
    public Task SendAsync(string recipient, string message) => /* ... */;
}

// Convention-based factory using reflection
public class ConventionNotifierFactory : INotifierFactory
{
    private readonly Dictionary<string, Type> _notifiers;
    private readonly IServiceProvider _provider;

    public ConventionNotifierFactory(IServiceProvider provider)
    {
        _provider = provider;

        // Discover all notifiers at startup
        _notifiers = typeof(INotifier).Assembly
            .GetTypes()
            .Where(t => t.GetCustomAttribute<NotificationChannelAttribute>() != null)
            .ToDictionary(
                t => t.GetCustomAttribute<NotificationChannelAttribute>()!.Channel,
                t => t);
    }

    public INotifier Create(string channel)
    {
        if (!_notifiers.TryGetValue(channel.ToLower(), out var type))
            throw new NotSupportedException($"Channel '{channel}' not registered");

        return (INotifier)_provider.GetRequiredService(type);
    }
}
```

Now adding a channel is truly a single class. No factory changes needed.

## Advanced Usage: Factory With Configuration

Sometimes the factory needs to create objects based on runtime configuration:

```csharp
public class PaymentProcessorFactory
{
    private readonly IServiceProvider _provider;
    private readonly IConfiguration _config;

    public PaymentProcessorFactory(IServiceProvider provider, IConfiguration config)
    {
        _provider = provider;
        _config = config;
    }

    public IPaymentProcessor Create(string region)
    {
        // Different payment processors per region
        var processorType = _config[$"Payments:{region}:Processor"];

        return processorType switch
        {
            "Stripe" => _provider.GetRequiredService<StripeProcessor>(),
            "Adyen" => _provider.GetRequiredService<AdyenProcessor>(),
            "PayU" => _provider.GetRequiredService<PayUProcessor>(),
            _ => _provider.GetRequiredService<StripeProcessor>() // default
        };
    }
}
```

The right payment processor is selected based on the customer's region, all controlled through `appsettings.json`. No code changes when you expand to a new market.

## When NOT to Use It

**When there's only one implementation.** If you only send emails and never plan to support other channels, a factory adds unnecessary abstraction.

**When the creation logic is trivial.** If creating the object is just `new MyClass()` with no conditions, skip the factory.

**When you're using DI already.** Sometimes the DI container itself is your factory. If you inject `INotifier` and only ever have one implementation, the container resolves it directly. No manual factory needed.

## Key Takeaways

- Factory Method separates object creation from object usage
- Adding new types means creating new classes, not modifying existing code
- Each implementation can be tested in isolation with its own dependencies
- Convention-based registration scales well for teams with many implementations
- Don't create a factory when DI already gives you what you need

## FAQ

### What is the Factory Method pattern in simple terms?

The Factory Method pattern provides a way to create objects without specifying the exact class. You define an interface for creation and let implementations decide which concrete class to instantiate. The calling code works with the interface, unaware of the concrete type.

### When should I use the Factory Method pattern?

Use it when the exact type of object to create depends on runtime data (like configuration, user input, or business rules), when you want to isolate creation logic, or when you anticipate adding new types frequently.

### Is the Factory Method pattern overkill?

If you have one implementation that never changes, yes. The pattern adds value when you have multiple implementations or expect new ones. A good litmus test: if your creation logic has a `switch` or `if-else`, a factory might help.

### What's the difference between Factory Method and Abstract Factory?

Factory Method creates a single product. [Abstract Factory](https://thecodeman.net/posts/abstract-factory-pattern-in-dotnet) creates a family of related products that must work together. Use Factory Method for one product, Abstract Factory for a coordinated set.

## Wrapping Up

The Factory Method pattern is one of the most practical patterns you'll use in production .NET code. It shows up naturally in notification systems, payment processing, document generation, and anywhere else where the type of object depends on runtime conditions.

Keep it simple: extract creation logic when the `switch` starts growing. Don't abstract for the sake of abstraction.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->