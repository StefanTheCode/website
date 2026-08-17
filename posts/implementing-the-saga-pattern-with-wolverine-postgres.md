---
title: "Implementing the Saga Pattern With Wolverine (+Postgres)"
subtitle: "How to build a stateful, long-running workflow in .NET using Wolverine's saga support with PostgreSQL persistence through Marten."
date: "Aug 17 2026"
category: ".NET"
readTime: "Read Time: 8 minutes"
meta_description: "Implement the saga pattern in .NET with Wolverine and PostgreSQL. Learn Wolverine's saga model, message correlation, timeouts, and Marten-backed persistence."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored. Instead, let me point you to something I run every single day: my <strong>AI for .NET Developers Community</strong> - for .NET developers who want to actually use AI on real code. 50+ ready-to-run skills and agents for .NET (the legacy and upgrade agents in this post included), a new one added every week, and the room to figure it all out together.</p>

<a href="https://www.skool.com/thecodeman-ai-toolkit-9723/about" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #1a0224; background: #ffbd39; border-radius: 8px; text-decoration: none;">Join the community - 7 days free →</a>

<p style="margin: 16px 0 8px 0; font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.6);">Want to reach thousands of .NET developers like this?</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 7px 14px; font-size: 13px; font-weight: 600; color: #ffffff; background: transparent; border: 1px solid #6366f1; border-radius: 8px; text-decoration: none;">Sponsor TheCodeMan →</a>
</div>

**Keywords:** saga pattern, Wolverine, Wolverine saga, .NET, PostgreSQL, Marten, distributed transactions, message correlation, long-running workflow, saga persistence

## The problem

A lot of business processes are not a single database write. An order gets placed, then a payment arrives, then the warehouse confirms it shipped. Those steps happen at different times, often come from different services, and any of them can fail or never arrive at all. You still need to track where a given order is in that process and react when it either finishes or stalls.

The steps also have no shared database transaction. You can't wrap "charge the card" and "reserve stock" and "send the invoice" in one `SaveChanges`, because they run in different services and at different moments. So you need something that remembers the state of each order between messages and knows what to do when the next message shows up.

That is what the saga pattern is for. A saga is a piece of persisted state plus the handlers that move it forward as related messages arrive. In this post I'll implement one with [Wolverine](https://wolverinefx.net/) and store its state in PostgreSQL through Marten. If you've seen my earlier [saga orchestration post](https://thecodeman.net/posts/saga-orchestration-pattern), that used MassTransit's state machine; Wolverine takes a lighter, more code-first approach, so it's worth seeing both.

## Why the naive approach falls short

The version most teams reach for first is a status column. You add an `Orders` table with a `Status` field, and each incoming message loads the row, checks the status, updates it, and saves.

It holds up for a while, then the edge cases start. You end up writing the correlation logic by hand in every handler: find the right order, check whether it's in the expected state, guard against a message that arrived out of order or twice. Two messages for the same order can land at the same time and overwrite each other. And there's no natural place for "if this order isn't paid within 15 minutes, cancel it" - a status column doesn't wake itself up, so you bolt on a background job that scans the table looking for stale rows.

None of that is impossible to build. It's just that you're rebuilding the same plumbing every time: correlate a message to a stateful instance, load it, apply the change, persist it, and schedule time-based follow-ups. A saga framework gives you that plumbing.

## What a saga looks like in Wolverine

Wolverine models a saga as a class that inherits from `Wolverine.Saga`. The class holds the state, and its methods handle the messages that belong to it. There's no separate state-machine DSL - the state is properties, and the transitions are ordinary C# methods.

Three conventions do most of the work:

- **Identity.** The saga has an `Id` property (a `string` or `Guid`). Wolverine correlates an incoming message to a saga instance by looking for a member on the message that matches - either a property named `Id`, or one named after the saga type plus `Id` (so `OrderId` for an `Order` saga), or one marked with `[SagaIdentity]`.
- **Starting.** A static or instance method named `Start` (or `StartOrHandle`) creates a new saga instance from the first message.
- **Continuing.** Instance methods named `Handle` advance an existing instance. When all the work is done, you call `MarkCompleted()` to delete the state.

Handler methods can also return messages, and Wolverine sends them for you - this is how a saga triggers the next step or schedules a timeout.

## Setting up Wolverine with PostgreSQL

Wolverine persists saga state through a backing store. For Postgres, the natural fit is [Marten](https://martendb.io/), which stores documents in PostgreSQL and integrates with Wolverine directly. Saga instances are saved as Marten documents, and the same integration gives you Wolverine's durable inbox/outbox in the same database.

Install the packages:

```bash
dotnet add package WolverineFx.Marten
```

`WolverineFx.Marten` pulls in Wolverine and Marten together. Then wire it up:

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddMarten(opts =>
    {
        opts.Connection(builder.Configuration.GetConnectionString("postgres")!);
    })
    .IntegrateWithWolverine();

builder.Host.UseWolverine();

var app = builder.Build();
```

`AddMarten` configures the Postgres connection. `IntegrateWithWolverine()` tells Wolverine to use Marten for saga persistence and for its durable message storage - it will create the tables it needs in Postgres on startup. `UseWolverine()` starts the messaging runtime and discovers your handlers and sagas by convention.

## The example: an order fulfillment saga

Let's model a small order process. An order is placed, then two things need to happen in any order: the payment is received and the order is shipped. Once both have happened, we send the invoice and finish. If the payment never arrives in time, we cancel.

First, the messages. These are plain records:

```csharp
public record OrderPlaced(string OrderId);
public record PaymentReceived(string OrderId);
public record OrderShipped(string OrderId);

public record SendInvoice(string OrderId);
public record CancelOrder(string OrderId);
```

Notice every message carries `OrderId`. That's the correlation member Wolverine uses to route each message to the right saga instance.

Now the saga itself:

```csharp
public class Order : Saga
{
    public string? Id { get; set; }

    public bool Paid { get; set; }
    public bool Shipped { get; set; }

    // Starts the saga when an OrderPlaced message arrives.
    // Returns a timeout message that Wolverine schedules for us.
    public static (Order, OrderPaymentTimeout) Start(OrderPlaced placed)
    {
        var order = new Order { Id = placed.OrderId };
        return (order, new OrderPaymentTimeout(placed.OrderId));
    }

    public object[] Handle(PaymentReceived received)
    {
        Paid = true;
        return MaybeComplete();
    }

    public object[] Handle(OrderShipped shipped)
    {
        Shipped = true;
        return MaybeComplete();
    }

    private object[] MaybeComplete()
    {
        if (Paid && Shipped)
        {
            MarkCompleted();
            return [new SendInvoice(Id!)];
        }

        return [];
    }
}
```

`Start` builds the saga and returns a second value, `OrderPaymentTimeout`. Any message a saga method returns is cascaded - Wolverine sends it - so returning a timeout message here schedules it. Each `Handle` method flips a flag and calls `MaybeComplete`, which finishes the saga and cascades `SendInvoice` only when both flags are set. Until then it returns an empty array and the saga stays alive, waiting for the other message.

For the timeout, Wolverine has a `TimeoutMessage` base type. A message that inherits from it is scheduled with the delay you pass to the base constructor:

```csharp
public record OrderPaymentTimeout(string OrderId)
    : TimeoutMessage(15.Minutes());
```

And the saga handles it. If the order is already paid by the time the timeout fires, we ignore it; otherwise we cancel:

```csharp
public object[] Handle(OrderPaymentTimeout timeout)
{
    if (Paid)
    {
        return [];
    }

    MarkCompleted();
    return [new CancelOrder(Id!)];
}
```

`SendInvoice` and `CancelOrder` are handled by ordinary Wolverine handlers outside the saga - the saga's job is coordination, not doing the invoicing work itself.

## Starting the saga from an endpoint

To kick things off, publish the first message. `OrderPlaced` has a `Start` handler, so Wolverine creates a new `Order` saga for it:

```csharp
app.MapPost("/orders", async (string orderId, IMessageBus bus) =>
{
    await bus.PublishAsync(new OrderPlaced(orderId));
    return Results.Accepted($"/orders/{orderId}");
});
```

The other two messages come from wherever those steps actually happen - a payment webhook, a shipping service - and each one just needs to carry the same `OrderId`:

```csharp
app.MapPost("/orders/{orderId}/paid", async (string orderId, IMessageBus bus) =>
{
    await bus.PublishAsync(new PaymentReceived(orderId));
    return Results.Ok();
});

app.MapPost("/orders/{orderId}/shipped", async (string orderId, IMessageBus bus) =>
{
    await bus.PublishAsync(new OrderShipped(orderId));
    return Results.Ok();
});
```

Wolverine loads the matching `Order` from Postgres, runs the right `Handle` method, and saves the updated state - all in one transaction with the incoming message thanks to the Marten integration.

## The flow

Here's the happy path, where both the payment and the shipment come in before the timeout:

![Order saga message flow](/images/blog/posts/implementing-the-saga-pattern-with-wolverine-postgres/order-saga-message-flow.webp)

And the state the saga moves through:

![Order saga states](/images/blog/posts/implementing-the-saga-pattern-with-wolverine-postgres/order-saga-states.webp)

The two middle states (`Paid` and `Shipped`) exist because the two messages can arrive in either order. The saga doesn't care which comes first - it just records what it has and checks whether it has everything.

## How the state lives in Postgres

With the Marten integration, each saga instance is a document in a Postgres table named after the type - `mt_doc_order` for the `Order` saga. The document holds the serialized state (the `Id`, `Paid`, and `Shipped` values), and Marten reads and writes it by the `Id`. When `MarkCompleted()` runs, the document is deleted.

Because Wolverine's durable messaging uses the same database, the message that triggered a transition and the saga state change are committed together. If the process crashes after handling a message but before the state is saved, the message isn't acknowledged and is retried - you don't end up with a saga that half-advanced. This is the same durability you'd get from hand-rolling the [outbox pattern](https://thecodeman.net/posts/outbox-pattern-in-dotnet), except Wolverine provides it.

## A few practical notes

Keep the correlation member consistent. Every message a saga handles has to carry the identity, and the name has to match one of Wolverine's conventions (`Id`, `<SagaType>Id`, or `[SagaIdentity]`). A message without a matching member can't be routed to an instance.

Expect duplicate and out-of-order messages. Sagas make this easier because the state is right there, but your `Handle` methods should still be safe to run more than once. Setting `Paid = true` twice is harmless; incrementing a counter twice is not.

Keep the saga about coordination. The saga decides what happens next and when; the actual work - charging a card, generating an invoice - belongs in normal handlers that the saga triggers with cascaded messages. That keeps the saga small and easy to reason about.

Marten isn't the only option. Wolverine also supports EF Core for saga persistence if that's already in your stack. Marten is the most direct path when your database is Postgres and you don't want to hand-write a store.

## FAQ

### What is the saga pattern?

It's a way to manage a business process that spans multiple steps and often multiple services, where there's no single database transaction to rely on. Each step is its own transaction, and the saga holds the state that ties them together and coordinates what happens next, including undoing earlier steps when something fails.

### How does Wolverine correlate a message to the right saga instance?

By matching a member on the message to the saga's identity. Wolverine looks for a property named `Id`, or one named after the saga type plus `Id` (like `OrderId` for an `Order` saga), or one marked with `[SagaIdentity]`. That value is used to load the correct instance from the store.

### Do I need Marten to use Wolverine sagas?

No. Marten is the natural choice for PostgreSQL and is what this post uses, but Wolverine also supports EF Core for saga persistence. You pick the backing store; the saga code stays the same.

### How do saga timeouts work?

Wolverine has a `TimeoutMessage` base type. A message that inherits from it is scheduled with the delay passed to its constructor, and when a saga returns one as a cascaded message, Wolverine schedules it and later routes it back to the same instance. Your saga handles it and decides what to do - typically cancel if the process hasn't completed.

## Wrapping Up

The saga pattern solves a specific problem: coordinating a multi-step process whose steps arrive over time and can't share one transaction. Wolverine's take is code-first - a class that inherits from `Saga`, an `Id` for correlation, `Start` and `Handle` methods for the transitions, and `MarkCompleted` when it's done. Backed by Marten and PostgreSQL, the state is persisted per instance and the transitions run in the same transaction as the messages that drive them.

If you're already using Wolverine as a [MediatR alternative](https://thecodeman.net/posts/mediatr-alternative-wolverine), sagas are the same programming model extended with persisted state, so there's little new to learn beyond the conventions above.

If you made it this far, you're serious about production-grade .NET systems. Use code **DEEP20** for a discount on [Design Patterns that Deliver](/design-patterns-that-deliver-ebook).

That's all from me today.

<!--END-->
