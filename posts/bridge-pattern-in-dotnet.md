---
title: "Bridge Pattern in .NET"
subtitle: "Separate what something does from how it does it. The Bridge pattern lets you vary abstraction and implementation independently without a class explosion."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 7 minutes"
meta_description: "Learn the Bridge design pattern in .NET with real-world C# examples. Decouple abstraction from implementation to avoid class explosion and build flexible, testable systems."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored - I write these deep dives in my free time and keep them free for everyone. If your company sells AI tools, dev tools, courses, or services that .NET developers would actually use, sponsoring an issue is the most direct way to reach them.</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>

## The Class Explosion Nobody Saw Coming

You're building a notification system. You have two types of notifications: `UrgentNotification` and `RegularNotification`. Each can be sent via Email or SMS.

So you create: `UrgentEmailNotification`, `UrgentSmsNotification`, `RegularEmailNotification`, `RegularSmsNotification`.

Four classes. Manageable.

Then push notifications arrive. Six classes. Then Slack. Eight classes. Then you add a third notification type: `ScheduledNotification`. Now you have twelve classes.

Every new dimension (notification type × delivery channel) multiplies the total. Two hierarchies locked together in an inheritance tree that nobody wants to touch.

I've seen this in production. Nobody notices the explosion until it's 20+ classes deep.

## The Problem: Two Dimensions Stuck in One Hierarchy

The inheritance approach forces you to combine two independent concerns into one class tree:

```csharp
// Base
public abstract class Notification
{
    public abstract void Send(string message, string recipient);
}

// Level 1: notification type
public abstract class UrgentNotification : Notification { }
public abstract class RegularNotification : Notification { }

// Level 2: delivery channel × notification type
public class UrgentEmailNotification : UrgentNotification
{
    public override void Send(string message, string recipient)
    {
        // Format as urgent + send via SMTP
        var formatted = $"[URGENT] {message}";
        SmtpClient.Send(formatted, recipient);
    }
}

public class UrgentSmsNotification : UrgentNotification
{
    public override void Send(string message, string recipient)
    {
        // Format as urgent + send via Twilio
        var formatted = $"URGENT: {message}";
        TwilioClient.Send(formatted, recipient);
    }
}

// Same duplication for Regular...
// Then again for Scheduled...
// Then again for every new channel...
```

The formatting logic (urgent, regular) is duplicated across every channel. The delivery logic (email, SMS) is duplicated across every notification type. Adding one channel or one type touches multiple files.

## Enter the Bridge Pattern

The Bridge pattern splits these two dimensions into separate hierarchies: the abstraction (what) and the implementation (how). They connect through composition, not inheritance.

## Building It in .NET

Separate the delivery mechanism from the notification logic:

```csharp
// Implementation hierarchy: HOW to deliver
public interface IMessageSender
{
    Task SendAsync(string recipient, string formattedMessage);
}

public class EmailSender : IMessageSender
{
    private readonly ISmtpClient _smtp;

    public EmailSender(ISmtpClient smtp) => _smtp = smtp;

    public async Task SendAsync(string recipient, string formattedMessage)
    {
        await _smtp.SendAsync(new MailMessage
        {
            To = { recipient },
            Body = formattedMessage,
            IsBodyHtml = true
        });
    }
}

public class SmsSender : IMessageSender
{
    private readonly ITwilioClient _twilio;

    public SmsSender(ITwilioClient twilio) => _twilio = twilio;

    public async Task SendAsync(string recipient, string formattedMessage)
    {
        // SMS has a 160 char limit
        var truncated = formattedMessage.Length > 160
            ? formattedMessage[..157] + "..."
            : formattedMessage;

        await _twilio.SendSmsAsync(recipient, truncated);
    }
}

public class SlackSender : IMessageSender
{
    private readonly ISlackClient _slack;

    public SlackSender(ISlackClient slack) => _slack = slack;

    public async Task SendAsync(string recipient, string formattedMessage)
    {
        await _slack.PostMessageAsync(recipient, formattedMessage);
    }
}
```

Now the abstraction hierarchy — the notification types. They hold a reference to the sender (the bridge):

```csharp
// Abstraction hierarchy: WHAT to send
public abstract class Notification
{
    protected readonly IMessageSender _sender;

    protected Notification(IMessageSender sender) => _sender = sender;

    public abstract Task SendAsync(string recipient, string message);
}

public class UrgentNotification : Notification
{
    public UrgentNotification(IMessageSender sender) : base(sender) { }

    public override async Task SendAsync(string recipient, string message)
    {
        // Urgent formatting - regardless of delivery channel
        var formatted = $"🚨 URGENT: {message} — Immediate action required.";
        await _sender.SendAsync(recipient, formatted);
    }
}

public class RegularNotification : Notification
{
    public RegularNotification(IMessageSender sender) : base(sender) { }

    public override async Task SendAsync(string recipient, string message)
    {
        await _sender.SendAsync(recipient, message);
    }
}

public class ScheduledNotification : Notification
{
    private readonly DateTime _scheduledTime;

    public ScheduledNotification(IMessageSender sender, DateTime scheduledTime)
        : base(sender)
    {
        _scheduledTime = scheduledTime;
    }

    public override async Task SendAsync(string recipient, string message)
    {
        var formatted = $"[Scheduled for {_scheduledTime:g}] {message}";
        await _sender.SendAsync(recipient, formatted);
    }
}
```

Usage becomes flexible composition:

```csharp
// Urgent via Email
var urgentEmail = new UrgentNotification(new EmailSender(smtpClient));
await urgentEmail.SendAsync("user@example.com", "Server CPU at 98%");

// Urgent via Slack
var urgentSlack = new UrgentNotification(new SlackSender(slackClient));
await urgentSlack.SendAsync("#ops-alerts", "Server CPU at 98%");

// Scheduled via SMS
var scheduled = new ScheduledNotification(new SmsSender(twilioClient), tomorrow);
await scheduled.SendAsync("+1234567890", "Your subscription renews tomorrow");
```

Three notification types × three channels = nine combinations from six classes. Not nine. Six.

## Why This Is Better

**Linear growth instead of exponential.** Adding a new channel is one class. Adding a new notification type is one class. They compose freely.

**Each side evolves independently.** Change how emails are sent without touching notification formatting. Change formatting without touching delivery.

**Testing is scoped.** Test `UrgentNotification` with a mock `IMessageSender`. Test `EmailSender` with a mock SMTP client. Each test covers one concern.

## Advanced Usage: Runtime Channel Selection With DI

Register senders with keys and resolve at runtime:

```csharp
builder.Services.AddKeyedScoped<IMessageSender, EmailSender>("email");
builder.Services.AddKeyedScoped<IMessageSender, SmsSender>("sms");
builder.Services.AddKeyedScoped<IMessageSender, SlackSender>("slack");

// Factory that bridges notification type to channel at runtime
public class NotificationFactory
{
    private readonly IServiceProvider _provider;

    public NotificationFactory(IServiceProvider provider) => _provider = provider;

    public Notification Create(string type, string channel)
    {
        var sender = _provider.GetRequiredKeyedService<IMessageSender>(channel);

        return type switch
        {
            "urgent" => new UrgentNotification(sender),
            "regular" => new RegularNotification(sender),
            _ => new RegularNotification(sender)
        };
    }
}
```

## Advanced Usage: Bridging Report Generators

Another common case — separating report content from output format:

```csharp
public interface IReportFormatter
{
    byte[] Format(ReportData data);
    string ContentType { get; }
}

public class PdfFormatter : IReportFormatter
{
    public string ContentType => "application/pdf";
    public byte[] Format(ReportData data) => /* PDF generation */;
}

public class ExcelFormatter : IReportFormatter
{
    public string ContentType => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    public byte[] Format(ReportData data) => /* Excel generation */;
}

public abstract class Report
{
    protected readonly IReportFormatter _formatter;
    protected Report(IReportFormatter formatter) => _formatter = formatter;
    public abstract byte[] Generate();
}

public class SalesReport : Report
{
    private readonly ISalesRepository _sales;

    public SalesReport(IReportFormatter formatter, ISalesRepository sales)
        : base(formatter) => _sales = sales;

    public override byte[] Generate()
    {
        var data = _sales.GetMonthlySummary();
        return _formatter.Format(data);
    }
}

// Sales report as PDF or Excel - same report logic, different output
var pdf = new SalesReport(new PdfFormatter(), salesRepo);
var excel = new SalesReport(new ExcelFormatter(), salesRepo);
```

## When NOT to Use It

**When you have one dimension.** If notification type is the only thing that varies (and delivery is always email), the bridge is unnecessary overhead.

**When combinations are fixed.** If you'll only ever have `UrgentEmail` and `RegularEmail` and nothing more, inheritance is simpler.

**When the two sides are tightly coupled.** If the implementation details bleed heavily into the abstraction, forcing them apart creates awkward interfaces.

## Key Takeaways

- Bridge separates "what" from "how" using composition instead of inheritance
- It prevents class explosion when two independent dimensions combine
- Adding a new type on either side is one new class, not N new classes
- Common in notification systems, report generators, and rendering engines
- Skip it when you only have one dimension or few fixed combinations

## FAQ

### What is the Bridge pattern in simple terms?

The Bridge pattern splits a large class hierarchy into two separate hierarchies — abstraction and implementation — that can evolve independently. They connect through composition (one holds a reference to the other) instead of inheritance.

### When should I use the Bridge pattern?

When you see two independent dimensions creating a multiplication of classes. If adding one new feature requires creating classes for every existing variant, the Bridge pattern will save you.

### Is the Bridge pattern overkill?

For small systems with 2-3 total classes and no expected growth, yes. It adds indirection that only pays off when the combinatorial explosion would hit.

### What are alternatives to the Bridge pattern?

The [Strategy pattern](https://thecodeman.net/posts/strategy-design-pattern-will-help-you-refactor-code) is similar but focuses on swapping algorithms rather than bridging two hierarchies. Simple inheritance works when only one dimension varies. Composition with interfaces can achieve similar results without the formal pattern.

## Wrapping Up

The Bridge pattern is underrated. Most developers encounter the class explosion problem and reach for complex inheritance trees or messy `if-else` chains. The Bridge says: stop combining things that don't belong together. Let each side grow on its own.

Next time you see a class name with two concepts jammed together — `UrgentEmailNotification`, `PdfSalesReport`, `MobileAdminDashboard` — that's your signal.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->