---
title: "Keyed Services in .NET: Dependency Injection When One Interface Has Many Implementations"
subtitle: "Stop writing factory switch statements. Learn how keyed services in .NET 8 let you register multiple implementations of one interface and resolve the right one by key - in constructors, minimal APIs, and at runtime."
date: "Jun 27 2026"
author: "Stefan Đokić"
category: "Architecture"
readTime: "7 minutes"
meta_description: "A practical guide to keyed services in .NET dependency injection. Register many implementations of one interface and resolve the right one by key with AddKeyedScoped and FromKeyedServices."
photoUrl: "/images/blog/keyed-services-in-dotnet-dependency-injection.webp"
---

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A word from this week's sponsor</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">I found a resource from Datadog that might be useful if you're building, deploying, or operating AI-powered applications.</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This week's recommendation: <strong>AI Security Best Practices Guide</strong></p>

<p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">Inside, you'll find practical guidance on how to secure the infrastructure behind AI applications, protect the software and data they rely on, and reduce risk across the entry points users interact with. As more teams bring AI into production, security needs to be part of the architecture from day one.</p>

<a href="https://r2trck.com/the-code-man-datadog-8?utm_medium=newsletter&utm_source=the-code-man-r&utm_campaign=dg-content-ebook-AISecurityBestPractices-security-app-ww-en-701VY00000V709WYAR&utm_content=paid&utm_term=1-1-2026" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #1a0224; background: #ffbd39; border-radius: 8px; text-decoration: none;">Get it here for free →</a>

<p style="margin: 16px 0 8px 0; font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.6);">Want to reach thousands of .NET developers like this?</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 7px 14px; font-size: 13px; font-weight: 600; color: #ffbd39; background: transparent; border: 1px solid #ffbd39; border-radius: 8px; text-decoration: none;">Sponsor TheCodeMan →</a>
</div>

**Keywords:** keyed services .NET, dependency injection, AddKeyedScoped, FromKeyedServices, .NET 8 DI, resolve by key, strategy pattern, IServiceProvider, GetRequiredKeyedService, factory pattern

## The Switch Statement You Keep Rewriting

You have one interface and three implementations. `INotificationSender` with an email sender, an SMS sender, and a push sender. The user picks how they want to be notified, and somewhere in your code you have to turn that choice into the right object.

So you write a factory. And the factory has a `switch`:

```csharp
public class NotificationFactory
{
    private readonly IServiceProvider _provider;

    public NotificationFactory(IServiceProvider provider) => _provider = provider;

    public INotificationSender Create(string channel) => channel switch
    {
        "email" => _provider.GetRequiredService<EmailSender>(),
        "sms"   => _provider.GetRequiredService<SmsSender>(),
        "push"  => _provider.GetRequiredService<PushSender>(),
        _ => throw new ArgumentException($"Unknown channel: {channel}")
    };
}
```

This works. I've shipped it. But it has a smell: every time you add a channel, you touch two places - the registration and the switch. The container already knows how to build all three; you're just writing a second, hand-maintained lookup table on top of it. And you have to register the concrete types (`EmailSender`, not `INotificationSender`), which leaks implementation details everywhere.

Since .NET 8, you don't need the factory at all. The DI container can hold many implementations of one interface, each tagged with a key, and hand you the right one. It's called **keyed services**, and it deletes a whole category of boilerplate.

## What Keyed Services Actually Are

A normal registration is keyed by type: ask for `INotificationSender`, get the one implementation registered for it. Register two and the last one wins - the first is silently shadowed.

A keyed registration adds a second dimension: type **plus** a key. You register `INotificationSender` three times, each under a different key, and they coexist. When you resolve, you ask for the type *and* the key.

![Keyed Registry](/images/blog/posts/keyed-services-in-dotnet-dependency-injection/keyed-registry.webp)

The key can be any object - a string, an enum, anything with sensible equality. Strings read fine, but an enum gives you compile-time safety, so I reach for an enum when the set of keys is fixed.

## Registering Them

The familiar methods all have keyed siblings: `AddKeyedSingleton`, `AddKeyedScoped`, `AddKeyedTransient`. You pass the key as the first argument:

```csharp
builder.Services.AddKeyedScoped<INotificationSender, EmailSender>("email");
builder.Services.AddKeyedScoped<INotificationSender, SmsSender>("sms");
builder.Services.AddKeyedScoped<INotificationSender, PushSender>("push");
```

That's the whole registration. No factory, no switch, no registering concrete types. Each implementation is a proper `INotificationSender` the container can build, with its own dependencies injected normally:

```csharp
public class SmsSender : INotificationSender
{
    private readonly ITwilioClient _twilio;
    private readonly ILogger<SmsSender> _logger;

    // Constructor injection works exactly as usual -
    // keyed registration doesn't change how THIS class gets its dependencies.
    public SmsSender(ITwilioClient twilio, ILogger<SmsSender> logger)
    {
        _twilio = twilio;
        _logger = logger;
    }

    public Task SendAsync(string to, string message, CancellationToken ct) =>
        _twilio.SendSmsAsync(to, message, ct);
}
```

## Resolving by a Known Key

When the key is fixed at the call site - this service always sends email - inject it directly with `[FromKeyedServices]`:

```csharp
public class WelcomeEmailService
{
    private readonly INotificationSender _sender;

    public WelcomeEmailService(
        [FromKeyedServices("email")] INotificationSender sender)
    {
        _sender = sender;
    }

    public Task SendWelcome(string address, CancellationToken ct) =>
        _sender.SendAsync(address, "Welcome aboard!", ct);
}
```

The same attribute works in a minimal API handler, which is where it reads cleanest:

```csharp
app.MapPost("/welcome", (
    [FromKeyedServices("email")] INotificationSender sender,
    WelcomeRequest request,
    CancellationToken ct) =>
{
    return sender.SendAsync(request.Email, "Welcome aboard!", ct);
});
```

No factory in sight. The attribute *is* the lookup.

## Resolving by a Runtime Key

The more interesting case is when you don't know the key until a request comes in - the user chose "sms" in their settings. You can't use an attribute for that; you need to resolve dynamically. Inject `IServiceProvider` and call `GetRequiredKeyedService`:

```csharp
public class NotificationDispatcher
{
    private readonly IServiceProvider _provider;

    public NotificationDispatcher(IServiceProvider provider) => _provider = provider;

    public Task Dispatch(string channel, string to, string message, CancellationToken ct)
    {
        // channel comes from user preferences at runtime: "email" | "sms" | "push"
        var sender = _provider.GetRequiredKeyedService<INotificationSender>(channel);
        return sender.SendAsync(to, message, ct);
    }
}
```

This is the honest replacement for the factory switch. The container is the lookup table now, and adding a fourth channel means adding one registration line - nothing else changes. Use `GetKeyedService` (nullable) instead of `GetRequiredKeyedService` if an unknown key should return `null` rather than throw.

One caveat worth saying out loud: injecting `IServiceProvider` and resolving from it is the service locator pattern, which people rightly warn about. The difference here is scope. You're not reaching into the container for arbitrary types all over the codebase - you're doing one keyed lookup, in one place, for one interface, where the key genuinely isn't known until runtime. That's the legitimate use. If the key is known at compile time, use the attribute instead.

## Getting All Implementations at Once

Sometimes you want every implementation, not one - fan a message out to every channel the user enabled. Mark the registrations with `KeyedService.AnyKey` and inject the keyed enumerable:

```csharp
// Registration: a non-keyed "match any key" registration
builder.Services.AddKeyedScoped<INotificationSender, EmailSender>("email");
builder.Services.AddKeyedScoped<INotificationSender, SmsSender>("sms");
builder.Services.AddKeyedScoped<INotificationSender, PushSender>("push");

public class BroadcastService
{
    private readonly IEnumerable<INotificationSender> _all;

    // Resolves every keyed INotificationSender registration
    public BroadcastService(
        [FromKeyedServices(KeyedService.AnyKey)] IEnumerable<INotificationSender> all)
    {
        _all = all;
    }

    public Task BroadcastAll(string to, string message, CancellationToken ct) =>
        Task.WhenAll(_all.Select(s => s.SendAsync(to, message, ct)));
}
```

## Where Keyed Services Earn Their Keep

Not every "many implementations" problem wants keyed DI. Here's where I actually reach for it:

- **Multiple providers behind one interface** - payment gateways, notification channels, storage backends, feature-specific pricing rules. The classic strategy-pattern shape, but without the hand-written factory.
- **Per-tenant or per-environment variants** - a `IReportGenerator` keyed by tenant tier, or a `ICacheStore` keyed `"local"` vs `"distributed"`.
- **Decorators and pipelines** - register a raw service under one key and a decorated version under another, then choose which to inject.

And where I *don't*: if you only ever have one implementation, keyed services add ceremony for nothing. If your selection logic is complex - more than picking by a key, like weighting or fallbacks - a real strategy class with that logic inside is clearer than overloading the key. Keyed DI replaces the *lookup*, not your *business rules*.

## A Few Sharp Edges

- **You can't inject a keyed service without the attribute.** A plain `INotificationSender` parameter won't resolve a keyed registration - it'll fail unless there's also a non-keyed registration. Keyed and non-keyed live in separate namespaces inside the container.
- **The container won't enumerate keys for you.** There's no built-in "give me all the keys" API. If you need to validate an incoming channel string against the registered set, keep your own list of valid keys (an enum is perfect for this) rather than hoping the container will tell you.
- **`GetRequiredKeyedService` throws on an unknown key.** Validate user-supplied keys before you resolve, or use the nullable `GetKeyedService` and handle `null` deliberately. Don't let a bad query-string value turn into a 500.
- **Lifetimes work exactly as normal.** Keyed scoped is still one instance per scope; keyed singleton is still one for the app. The key doesn't change lifetime semantics.

## FAQ

### What are keyed services in .NET?

Keyed services are a dependency injection feature added in .NET 8 that let you register multiple implementations of the same interface, each tagged with a key, and resolve a specific one by passing that key. They replace the hand-written factory you'd otherwise build to map a value to an implementation.

### How do I resolve a keyed service when the key is only known at runtime?

Inject `IServiceProvider` and call `GetRequiredKeyedService<T>(key)` (or the nullable `GetKeyedService<T>(key)`). The `[FromKeyedServices]` attribute only works when the key is fixed at compile time, so a runtime key - like a value from user settings - needs the dynamic resolve.

### Are keyed services just the strategy pattern?

They're the plumbing the strategy pattern needs, not a replacement for it. Keyed services handle the lookup - "give me the implementation tagged 'sms'." If your selection involves real logic (fallbacks, weighting, conditions), that still belongs in a strategy class. Keyed DI just removes the boilerplate factory.

### Can I inject a keyed service into a normal constructor parameter?

Only if you mark the parameter with `[FromKeyedServices("key")]`. A plain parameter of the interface type will not match a keyed registration - it resolves against non-keyed registrations only. The two sets are kept separate inside the container.

## Wrapping Up

Keyed services are a small feature that quietly removes a pattern most .NET codebases carry: the factory with a `switch` that you have to edit every time you add an implementation. Register each implementation under a key, inject by attribute when the key is fixed, resolve from the provider when it's chosen at runtime, and let the container be the lookup table it already is.

The rule of thumb I use: if you're writing a factory whose only job is to map a value to a registered type, keyed services do that for you. If the factory contains real decision logic, keep it - but it can still resolve its options through keys instead of concrete types.

That's all from me today.


<!--END-->
