---
title: "Outbox Pattern in .NET"
subtitle: "The Outbox Pattern is the most reliable way to publish messages from your .NET service without losing events when the message broker is down or your transaction fails. Save the message in the same database transaction as your business data, then publish it from a background worker."
date: "April 27 2026"
category: ".NET"
readTime: "Read Time: 6 minutes"
meta_description: "Learn how to implement the Outbox Pattern in .NET 10 with EF Core, PostgreSQL and a background worker. Ensure reliable, exactly-once message delivery between microservices, prevent dual-write failures, and avoid lost domain events with practical C# examples."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #ffffff;">One MCP to access the Web</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">Building AI agents? Stop fighting CAPTCHAs, JS blocks, and geo-fencing. <a href="https://brightdata.com/ai/mcp-server?utm_source=brnd&utm_medium=newsletter&utm_campaign=the-code-man" target="_blank" rel="noopener noreferrer" style="color: #a5b4fc; text-decoration: underline;">Bright Data's MCP Server</a> provides a single access layer between your agents and the web. No more proxy stitching. One request handles the rest. Build, don't fight. <a href="https://brightdata.com/ai/mcp-server?utm_source=brnd&utm_medium=newsletter&utm_campaign=the-code-man" target="_blank" rel="noopener noreferrer" style="color: #a5b4fc; text-decoration: underline;"><strong>Try it for free</strong></a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers.<br/><br/><a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</p>
</div>

## The background

You finish an order. Your service writes the row to the database. Then it publishes an `OrderPlaced` event to RabbitMQ so the warehouse, billing and email services can react.

What happens if the database commit succeeds but the broker is down? Or the broker accepts the message but your database transaction rolls back?

Welcome to the **dual-write problem** - the silent killer of "eventually consistent" systems. You either lose business data, lose events, or end up with two systems that disagree forever.

The **Outbox Pattern** is the standard, battle-tested fix. Instead of writing to the database **and** publishing to the broker, you only write to the database - including the message itself - in a single ACID transaction. A separate worker reads the saved messages and publishes them later, with retries, until the broker confirms.

In this issue I'll show you a clean, production-grade outbox in **.NET 10** with **EF Core** and **PostgreSQL**, no MassTransit, no NServiceBus - just enough code to understand exactly what's happening and own it in your codebase.

## What is the Outbox Pattern?

The Outbox Pattern stores messages that need to be published in a dedicated table (the *outbox*) inside the same database your business entities live in. The save and the message persistence happen in **one local transaction**, so they either both commit or both roll back.

A background process (the *outbox publisher*) then:

1. Polls the outbox table for unprocessed messages.
2. Publishes them to the message broker (RabbitMQ, Kafka, Azure Service Bus, etc.).
3. Marks them as processed once the broker acknowledges receipt.

The result: **at-least-once** delivery, no lost events, and full crash recovery. Combined with idempotent consumers, it gives you **effectively exactly-once** semantics.

![Outbox Pattern Flow](/images/blog/posts/outbox-pattern-in-dotnet/outbox-flow.png)

## Why not just publish directly?

Three failure modes happen all the time in production:

- **Broker down, DB up** - business data is saved, the event is lost forever. Downstream services never learn the order exists.
- **DB down, broker up** - event is published, but the order was never persisted. Downstream systems act on data that doesn't exist.
- **Process crash between writes** - same as above, randomly, in 0.01% of requests, which is exactly the percentage your monitoring will not catch.

You cannot wrap a database transaction and a broker publish in a single distributed transaction without falling into [2PC](https://en.wikipedia.org/wiki/Two-phase_commit_protocol) and its scalability problems. The outbox sidesteps the whole issue by reducing the problem to **one** transactional write.

## Step 1 - Define the OutboxMessage entity

```csharp
public class OutboxMessage
{
    public Guid Id { get; set; }
    public string Type { get; set; } = default!;     // e.g. "OrderPlaced"
    public string Content { get; set; } = default!;  // serialized payload (JSON)
    public DateTime OccurredOnUtc { get; set; }
    public DateTime? ProcessedOnUtc { get; set; }
    public string? Error { get; set; }
    public int RetryCount { get; set; }
}
```

Map it in your `DbContext`:

```csharp
public class AppDbContext : DbContext
{
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OutboxMessage> OutboxMessages => Set<OutboxMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OutboxMessage>(b =>
        {
            b.ToTable("outbox_messages");
            b.HasKey(x => x.Id);
            b.Property(x => x.Content).HasColumnType("jsonb");
            b.HasIndex(x => x.ProcessedOnUtc);
        });
    }
}
```

The index on `ProcessedOnUtc` is critical - the publisher will scan for `NULL` rows hundreds of times per minute.

## Step 2 - Save the business data and the message together

The whole point of the pattern is **one transaction**. The simplest way to enforce that is an [EF Core SaveChanges interceptor](https://thecodeman.net/posts/ef-interceptors-in-dotnet) that converts domain events into outbox rows just before commit.

```csharp
public class OutboxInterceptor : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken ct = default)
    {
        var ctx = eventData.Context;
        if (ctx is null) return base.SavingChangesAsync(eventData, result, ct);

        var entries = ctx.ChangeTracker
            .Entries<IHasDomainEvents>()
            .Where(e => e.Entity.DomainEvents.Count != 0)
            .ToList();

        var messages = entries.SelectMany(e =>
        {
            var events = e.Entity.DomainEvents.ToArray();
            e.Entity.ClearDomainEvents();
            return events.Select(domainEvent => new OutboxMessage
            {
                Id = Guid.NewGuid(),
                OccurredOnUtc = DateTime.UtcNow,
                Type = domainEvent.GetType().FullName!,
                Content = JsonSerializer.Serialize(domainEvent, domainEvent.GetType())
            });
        });

        ctx.Set<OutboxMessage>().AddRange(messages);
        return base.SavingChangesAsync(eventData, result, ct);
    }
}
```

Register it:

```csharp
builder.Services.AddDbContext<AppDbContext>((sp, options) =>
    options
        .UseNpgsql(builder.Configuration.GetConnectionString("Default"))
        .AddInterceptors(new OutboxInterceptor()));
```

Now your application code is delightfully boring:

```csharp
public async Task<Guid> PlaceOrderAsync(PlaceOrderCommand cmd, CancellationToken ct)
{
    var order = Order.Create(cmd.CustomerId, cmd.Items);
    _db.Orders.Add(order);

    // Saves the order AND the OrderPlaced outbox message in ONE transaction.
    await _db.SaveChangesAsync(ct);

    return order.Id;
}
```

No publish call. No `try/catch` around the broker. If `SaveChangesAsync` throws, the order **and** the event are gone together. If it succeeds, both are durable.

## Step 3 - The Outbox Publisher (BackgroundService)

This is the worker that drains the outbox into the broker. Use a [hosted background service](https://thecodeman.net/posts/background-tasks-in-dotnet8) and keep it small.

```csharp
public class OutboxPublisher(
    IServiceScopeFactory scopeFactory,
    IPublishEndpoint bus,                 // or IBus, IConnection, whatever
    ILogger<OutboxPublisher> logger)
    : BackgroundService
{
    private static readonly TimeSpan Delay = TimeSpan.FromSeconds(2);
    private const int BatchSize = 50;

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            try
            {
                await ProcessBatchAsync(ct);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Outbox publisher loop failed");
            }

            await Task.Delay(Delay, ct);
        }
    }

    private async Task ProcessBatchAsync(CancellationToken ct)
    {
        using var scope = scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // FOR UPDATE SKIP LOCKED prevents two replicas from picking the same row.
        var messages = await db.OutboxMessages
            .FromSqlRaw("""
                SELECT * FROM outbox_messages
                WHERE processed_on_utc IS NULL
                ORDER BY occurred_on_utc
                LIMIT {0}
                FOR UPDATE SKIP LOCKED
                """, BatchSize)
            .ToListAsync(ct);

        if (messages.Count == 0) return;

        foreach (var message in messages)
        {
            try
            {
                var type = Type.GetType(message.Type)!;
                var payload = JsonSerializer.Deserialize(message.Content, type)!;

                await bus.Publish(payload, ct);

                message.ProcessedOnUtc = DateTime.UtcNow;
                message.Error = null;
            }
            catch (Exception ex)
            {
                message.RetryCount++;
                message.Error = ex.ToString();
                logger.LogWarning(ex, "Failed to publish outbox message {Id}", message.Id);
            }
        }

        await db.SaveChangesAsync(ct);
    }
}
```

Two non-obvious details earn their keep here:

- **`FOR UPDATE SKIP LOCKED`** - PostgreSQL row-level locking lets you scale the publisher horizontally. Two replicas will simply pick disjoint rows. SQL Server has `READPAST` for the same effect.
- **Per-message try/catch** - one poison message must not block the whole batch.

Register it:

```csharp
builder.Services.AddHostedService<OutboxPublisher>();
```

## Step 4 - Make the consumers idempotent

The outbox guarantees **at-least-once** delivery. The publisher can crash *after* the broker accepts a message but *before* the row is marked as processed. On restart, the same message is sent again.

So every consumer must be safe to run twice with the same input. The cheapest way is a `processed_messages` table on the consumer side:

```csharp
public async Task Handle(OrderPlaced evt, CancellationToken ct)
{
    if (await _db.ProcessedMessages.AnyAsync(p => p.Id == evt.MessageId, ct))
        return; // already handled

    await DoTheWorkAsync(evt, ct);

    _db.ProcessedMessages.Add(new ProcessedMessage { Id = evt.MessageId });
    await _db.SaveChangesAsync(ct);
}
```

Combined with the outbox on the producer side, this gives you effectively exactly-once processing across the whole system - the holy grail of distributed messaging without a single distributed transaction.

## Common pitfalls

A few things I see go wrong in real codebases:

- **No index on `ProcessedOnUtc`** - the table grows, the publisher slows down, latency spikes. Always index it.
- **Polling too aggressively** - every 100ms feels fast in dev and burns CPU in production. 1-3 seconds is plenty for most workloads.
- **No archival strategy** - processed rows pile up. Move them to a `outbox_archive` table or hard-delete after N days.
- **Coupling the outbox table to the broker schema** - keep the message format generic (type + JSON), not RabbitMQ-specific, so you can swap brokers later.
- **Forgetting transactions on the publisher side** - if you mark the row processed in a separate transaction from the publish, you'll re-publish on every restart. The `SaveChangesAsync` at the end of the batch covers you.

## When NOT to use the Outbox Pattern

It's not free. You add a table, an indexed scan loop, and a few seconds of latency between a write and the published event. Skip it when:

- You don't actually need durability - e.g. ephemeral notifications.
- Your broker **is** your database (Kafka with transactional outbox into Kafka itself, or [event sourcing](https://thecodeman.net/posts/saga-orchestration-pattern)).
- You can use a CDC tool like Debezium that streams from the WAL directly - the outbox table is still the source, but you skip the polling worker.

For 90% of [microservice](https://thecodeman.net/posts/saga-implementation-in-csharp) and modular monolith systems with a relational database and a message broker, the outbox is the right default.

## Wrapping up

The Outbox Pattern is one of those rare techniques that costs almost nothing and removes an entire category of production incidents. It turns the dual-write problem into a single-write problem, and a single-write problem is just a `SaveChangesAsync`.

If you're publishing domain events from any .NET service that has a relational database, you should not be using `bus.Publish()` directly inside your command handlers. You should be writing an `OutboxMessage` and letting a worker do the rest.

Start with the EF Core interceptor, add the background publisher, make consumers idempotent. Three small pieces, one big improvement in reliability.

For related patterns, see [SAGA Implementation in C#](https://thecodeman.net/posts/saga-implementation-in-csharp), [Saga Orchestration Pattern](https://thecodeman.net/posts/saga-orchestration-pattern), and [EF Core Interceptors in .NET](https://thecodeman.net/posts/ef-interceptors-in-dotnet).

## Frequently Asked Questions

### What is the Outbox Pattern in .NET?

The Outbox Pattern is a messaging reliability pattern where outgoing messages are stored in a database table (the *outbox*) inside the same transaction that saves your business data. A separate background worker reads that table and publishes the messages to a message broker like RabbitMQ, Kafka, or Azure Service Bus. This guarantees that a message is never lost, never published without its corresponding state change, and can always be retried after a crash.

### What problem does the Outbox Pattern solve?

It solves the **dual-write problem**: you cannot atomically write to a database and publish to a broker without distributed transactions. Without an outbox, a network blip between the two writes can either lose the event or commit a phantom event. The outbox reduces both writes to one local ACID transaction, eliminating the failure window entirely.

### Outbox Pattern vs MassTransit transactional outbox - which one should I use?

If you already use MassTransit or NServiceBus, use their built-in transactional outbox - it's well-tested and integrated with their saga and retry pipelines. Roll your own (like the example above) when you want zero framework dependencies, full control over the schema, or you're already using a lightweight publishing setup with EF Core and a single broker.

### Does the Outbox Pattern give exactly-once delivery?

Strictly, no - the broker layer always allows at-least-once. But combined with **idempotent consumers** (a `processed_messages` table or a unique constraint on the side effect), you get *effectively* exactly-once processing across the system, without distributed transactions. That's as good as it gets in distributed systems.

### How often should the outbox publisher poll?

Between 1 and 5 seconds is the sweet spot for most workloads. Faster polling reduces latency but increases DB load. If you need sub-second latency, use change data capture (e.g. Debezium) or PostgreSQL `LISTEN/NOTIFY` to trigger the publisher on insert instead of polling.

That's all from me for today.

<!--END-->

## dream BIG!
