---
title: "Monolith to Modular Monolith to Microservices at 100k Users: A Pragmatic .NET Architecture Evolution"
subtitle: "How real .NET teams scale from a single ASP.NET Core app to a modular monolith to selective microservices - based on measurable pain, not hype."
date: "April 27 2026"
category: "Architecture"
readTime: "Read Time: 18 minutes"
meta_description: "A senior engineer's guide to evolving .NET architecture from monolith to modular monolith to microservices at 100k users. Real production patterns, code, and tradeoffs."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored - I write these deep dives in my free time and keep them free for everyone. If your company sells AI tools, dev tools, courses, or services that .NET developers would actually use, sponsoring an issue is the most direct way to reach them.</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>

## The Architecture Decision That Quietly Costs Companies Millions

Every few years a new architecture style becomes "the right way to build software."

In 2014 it was microservices. In 2019 it was service mesh. In 2022 it was serverless. In 2025 it became fashionable to admit, in public, that maybe the modular monolith was the right answer all along.

Meanwhile, in the real world, the same story keeps repeating in .NET shops:

- A team builds a perfectly fine ASP.NET Core monolith.
- It scales further than anyone expected.
- Around 30k–100k users, deployments start to hurt.
- A senior engineer reads a microservices blog post on a Sunday.
- On Monday, someone opens a Jira epic called "Decompose the monolith."
- Eighteen months later, the team has fifteen services, three on-call rotations, two incident channels, one very expensive Kubernetes bill, and *the same business problems they had before*.

This article is the playbook I wish more teams had before that Monday meeting.

We will walk through the real evolution path I have seen work for .NET systems serving up to and beyond 100,000 users:

> **monolith → modular monolith → selective microservices**

The thesis is simple and unfashionable: **architecture evolution should follow measurable pain, not hype.** I will repeat that line throughout the article, because in five years of architecture reviews, almost every failure I have seen came from violating it.

## A Short Production Story (You Have Probably Lived This One)

Let me tell you about a real-shaped story. I will call the company "Northwind Pay" - not a real client, but a composite of several .NET teams I have worked with.

**5,000 users.** Northwind Pay is a B2B billing platform built as a single ASP.NET Core 8 app. One Postgres database, one Redis, one background worker. Two engineers. Deployments take 4 minutes via GitHub Actions. Nobody complains.

**30,000 users.** The team is now eight engineers. Features ship weekly. The release pipeline has grown to 22 minutes because integration tests now hit twelve subsystems. Merge conflicts in `Startup.cs` and `IServiceCollection` registrations are a daily ritual. Two engineers quietly start refactoring shared services into "modules" without telling anyone.

**60,000 users.** A senior hire from a FAANG company joins. He says, with confidence, "this needs to be microservices." Nobody disagrees, because nobody wants to look junior. A six-month decomposition begins.

**100,000 users.** They now have eleven services, four databases, RabbitMQ, a half-finished Kubernetes setup, and a distributed tracing tool that nobody has fully configured. P99 latency has gotten *worse*. Two-thirds of incidents are now caused by network issues between services that did not exist a year ago. The CTO asks the architect, in a 1:1, "did we actually need this?"

**The pivot.** The team consolidates. They merge nine of the eleven services back into a single, well-structured modular monolith. Two services - the ones with genuinely independent scaling profiles (a PDF generator and a webhook delivery worker) - stay separate. Latency drops. Incidents drop. The team ships features again.

This is not an anti-microservices story. It is a story about *sequencing*. The team eventually arrived at microservices for the parts that needed them. They just took an expensive detour to get there.

## Why Most Teams Fail With Microservices (And It's Not the Code)

Microservices are not, primarily, a code architecture. They are an *organizational* and *operational* architecture that happens to express itself in code.

When a microservices migration fails, it almost never fails because someone wrote a bad `HttpClient` call. It fails because of one or more of these:

1. **No domain boundaries.** The team extracted services along technical lines (an "Auth service", a "Database service") instead of business domains. Every feature now requires changes in three services.
2. **No platform team.** There is no one whose full-time job is observability, CI/CD, secrets, service templates, and on-call tooling. Every team reinvents the wheel.
3. **Shared databases.** Services were extracted but the database was not. You have all the cost of microservices and none of the autonomy.
4. **Synchronous chains.** Service A calls B calls C calls D, all over HTTP, all in the request path. One slow downstream service takes down the whole product.
5. **No async backbone.** No message broker, no outbox, no idempotency keys. Every failure becomes a customer-visible failure.
6. **Premature extraction.** The boundary turned out to be wrong, but now it is encoded in a network call, a separate repo, a separate deployment, and a separate on-call rotation.

The deepest failure is almost always #6. **A wrong boundary inside a monolith costs you a refactor. A wrong boundary across services costs you a quarter.**

## What Actually Breaks First at Scale

Before we discuss solutions, let's get specific about what breaks, in what order, in a typical .NET monolith. This matters because the right architecture move depends on which pain you are actually feeling.

In my experience, the order looks like this:

1. **Database queries** (around 5k–20k users). N+1 queries, missing indexes, EF Core change tracking on hot paths.
2. **Background work bleeding into request paths** (around 20k–40k users). Sending emails, generating PDFs, calling third-party APIs synchronously inside an HTTP handler.
3. **Deployment coordination** (around 30k–60k users). Two teams cannot ship independently because every deploy touches the same binary.
4. **Cognitive load** (around 50k–80k users). New engineers cannot find where a feature lives. Code review takes days because reviewers do not own the area.
5. **Independent scaling needs** (around 80k–150k users). One subsystem (e.g., webhook delivery, search indexing, ML inference) needs 10x the resources of the rest.
6. **Blast radius** (around 100k+ users). One bad deploy or one runaway query can take down the entire product.

Notice that **the first two are not architecture problems**. They are code and design problems. If you migrate to microservices to fix problem #1, you will be deeply disappointed - and significantly poorer.

> Architecture evolution should follow measurable pain, not hype.

## The Monolith: Still the Right Default in 2026

Let's define our terms.

A **monolith** in the .NET sense is a single deployable artifact - typically one ASP.NET Core process - that contains all the application's business logic, talking to one primary database.

![Monolith Diagram](/images/blog/posts/monolith-to-modular-monolith-to-microservices-at-100k-users/monolith.png)

This boring diagram has scaled Stack Overflow, Shopify (for years), Basecamp, GitHub (for most of its history), and a long list of companies you use every day.

Why monoliths still win for most teams:

- **One deployment unit.** No service mesh. No distributed tracing setup. No Kubernetes Ingress drama.
- **Local function calls instead of network calls.** Sub-millisecond, transactional, debuggable in a single stack trace.
- **One database transaction.** ACID across modules is essentially free. No saga to model. No outbox to maintain.
- **One repo, one CI pipeline, one release process.** Engineers can context-switch with a `cd ..`, not a `git clone`.
- **Cheap.** A single beefy VM or App Service can handle astonishing load if the code is reasonable.

The honest truth is that **most .NET applications will never need anything more than a well-structured monolith**. If you are at 5k–50k users with a small team, your job is not to architect for the future. Your job is to keep the monolith healthy: fix slow queries, push slow work to background services, and keep the module boundaries clean.

## The Modular Monolith: The Underrated Middle Step

When the monolith starts to hurt - and you have ruled out "this is just a slow query" - the next step is almost never microservices. It is a **modular monolith**.

A modular monolith is still one deployable. But internally, it is structured as a set of strictly bounded modules, each with:

- its own folder
- its own internal classes (no public types leaking unnecessarily)
- its own database schema (or even its own database, if you are ambitious)
- its own public contract (a small, intentional surface)
- communication with other modules **only** through that contract or through events

![Modular Monolith Diagram](/images/blog/posts/monolith-to-modular-monolith-to-microservices-at-100k-users/modular-monolith.png)

Why this is the underrated step:

- You get **most of the boundary clarity** of microservices.
- You keep **most of the operational simplicity** of a monolith.
- If your boundaries turn out to be wrong - and they will, the first time - you fix it with a refactor, not a quarter-long migration.
- You discover, in production, *which modules actually need to be services*.

That last point is the entire reason this step exists. You cannot know in advance which boundaries are real and which are imaginary. You can only learn it by living with them.

## Internal Module Boundaries in .NET

Let's get concrete. Here is the folder structure I use as a starting point for any new .NET system that I expect to grow.

### Example 1 - Modular Monolith Folder Structure

```
src/
  NorthwindPay.Api/                  // Composition root, hosts modules
    Program.cs
    appsettings.json
  Modules/
    Orders/
      NorthwindPay.Orders/           // Internal implementation
        Domain/
        Application/
        Infrastructure/
        OrdersModule.cs              // Registration extension
      NorthwindPay.Orders.Contracts/ // Public contracts + integration events
    Billing/
      NorthwindPay.Billing/
      NorthwindPay.Billing.Contracts/
    Identity/
      NorthwindPay.Identity/
      NorthwindPay.Identity.Contracts/
    Notifications/
      NorthwindPay.Notifications/
      NorthwindPay.Notifications.Contracts/
  BuildingBlocks/
    NorthwindPay.SharedKernel/       // Result types, Guard clauses, base types
    NorthwindPay.EventBus/           // In-process bus + outbox abstractions
```

Two rules I enforce ruthlessly:

1. **The host project (`NorthwindPay.Api`) is the only place that references all modules.** No module references another module's implementation project.
2. **Modules talk to each other only through `*.Contracts` projects.** That means interfaces, DTOs, and integration events - never EF Core entities, never internal services.

This is not folder cosplay. It is a *compile-time enforcement* of boundaries. If a developer in the Orders module tries to call a Billing service directly, it does not compile. That is the strongest architecture rule you can have, because it cannot be argued with in a code review.

### Example 2 - Module Registration

Each module exposes one extension method, and `Program.cs` becomes a list of those:

```csharp
// NorthwindPay.Orders/OrdersModule.cs
namespace NorthwindPay.Orders;

public static class OrdersModule
{
    public static IServiceCollection AddOrdersModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<OrdersDbContext>(opt =>
            opt.UseNpgsql(
                configuration.GetConnectionString("Orders"),
                npg => npg.MigrationsHistoryTable("__EFMigrationsHistory", "orders")));

        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IOrderRepository, OrderRepository>();

        // Register MediatR handlers from THIS assembly only
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssemblyContaining<OrdersModule>());

        return services;
    }

    public static IEndpointRouteBuilder MapOrdersEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/orders").WithTags("Orders");

        group.MapPost("/", CreateOrderEndpoint.Handle);
        group.MapGet("/{id:guid}", GetOrderEndpoint.Handle);

        return app;
    }
}
```

And `Program.cs`:

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddIdentityModule(builder.Configuration)
    .AddOrdersModule(builder.Configuration)
    .AddBillingModule(builder.Configuration)
    .AddNotificationsModule(builder.Configuration);

builder.Services.AddEventBus(builder.Configuration);

var app = builder.Build();

app.MapIdentityEndpoints();
app.MapOrdersEndpoints();
app.MapBillingEndpoints();
app.MapNotificationsEndpoints();

app.Run();
```

This is the most important file in the system. If it grows beyond ~30 lines, something is wrong with your modules.

### Example 3 - Internal Contracts Between Modules

When Orders needs something from Billing, it does **not** call `BillingService` directly. It depends on a contract:

```csharp
// NorthwindPay.Billing.Contracts/IBillingApi.cs
namespace NorthwindPay.Billing.Contracts;

public interface IBillingApi
{
    Task<InvoiceSummary> CreateInvoiceAsync(
        CreateInvoiceCommand command,
        CancellationToken ct);

    Task<InvoiceSummary?> GetInvoiceAsync(
        Guid invoiceId,
        CancellationToken ct);
}

public sealed record CreateInvoiceCommand(
    Guid OrderId,
    Guid CustomerId,
    decimal Amount,
    string Currency);

public sealed record InvoiceSummary(
    Guid InvoiceId,
    Guid OrderId,
    string Status,
    DateTimeOffset IssuedAt);
```

The Billing module implements `IBillingApi` internally. Orders only sees the contract. The day Billing becomes a service, you replace the in-process implementation with an HTTP/gRPC client that implements the same interface. **Zero changes in Orders.**

This is the single most important pattern in this article. Internalize it.

## Async Communication Between Modules

Direct calls between modules are fine for *queries* (give me invoice X) but a trap for *workflows* (an order was placed; now do five things). For workflows, use events.

### Example 4 - Integration Events

```csharp
// NorthwindPay.Orders.Contracts/Events/OrderPlaced.cs
namespace NorthwindPay.Orders.Contracts.Events;

public sealed record OrderPlaced(
    Guid OrderId,
    Guid CustomerId,
    decimal Amount,
    string Currency,
    DateTimeOffset OccurredAt) : IIntegrationEvent;
```

```csharp
// NorthwindPay.Notifications/Handlers/OrderPlacedHandler.cs
internal sealed class OrderPlacedHandler : IIntegrationEventHandler<OrderPlaced>
{
    private readonly IEmailSender _email;
    private readonly ICustomerLookup _customers;

    public OrderPlacedHandler(IEmailSender email, ICustomerLookup customers)
    {
        _email = email;
        _customers = customers;
    }

    public async Task HandleAsync(OrderPlaced @event, CancellationToken ct)
    {
        var customer = await _customers.GetAsync(@event.CustomerId, ct);
        await _email.SendAsync(
            to: customer.Email,
            subject: "We received your order",
            body: $"Order {@event.OrderId} for {@event.Amount} {@event.Currency} confirmed.",
            ct);
    }
}
```

The Orders module knows nothing about Notifications. It publishes `OrderPlaced` and moves on. If Notifications is slow, broken, or temporarily disabled, Orders does not care.

![Sequence Diagram](/images/blog/posts/monolith-to-modular-monolith-to-microservices-at-100k-users/sequence-diagram.png)

## Example 5 - The Outbox Pattern (Done Properly)

The naive version of "publish an event after saving" is wrong. Consider:

```csharp
await _db.SaveChangesAsync(ct);
await _bus.PublishAsync(new OrderPlaced(...)); // process crashes here
```

The order is saved. The event is lost. Forever. This is one of the most common silent data-corruption bugs in distributed .NET systems.

The fix is the **outbox pattern**: persist the event in the same database transaction as the state change, then have a background process publish it.

```csharp
// In Orders module
public sealed class CreateOrderHandler : IRequestHandler<CreateOrderCommand, Result<Guid>>
{
    private readonly OrdersDbContext _db;

    public async Task<Result<Guid>> Handle(
        CreateOrderCommand cmd, CancellationToken ct)
    {
        var order = Order.Place(cmd.CustomerId, cmd.Items);

        _db.Orders.Add(order);

        _db.OutboxMessages.Add(new OutboxMessage
        {
            Id = Guid.NewGuid(),
            OccurredOnUtc = DateTime.UtcNow,
            Type = nameof(OrderPlaced),
            Content = JsonSerializer.Serialize(new OrderPlaced(
                order.Id, order.CustomerId, order.Total, order.Currency, DateTimeOffset.UtcNow))
        });

        await _db.SaveChangesAsync(ct); // atomic: order + outbox row

        return order.Id;
    }
}
```

And the background publisher:

```csharp
public sealed class OutboxPublisher : BackgroundService
{
    private readonly IServiceScopeFactory _scopes;
    private readonly IEventBus _bus;
    private readonly ILogger<OutboxPublisher> _logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopes.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<OrdersDbContext>();

                var batch = await db.OutboxMessages
                    .Where(m => m.ProcessedOnUtc == null)
                    .OrderBy(m => m.OccurredOnUtc)
                    .Take(100)
                    .ToListAsync(stoppingToken);

                foreach (var message in batch)
                {
                    var @event = Deserialize(message);
                    await _bus.PublishAsync(@event, stoppingToken);
                    message.ProcessedOnUtc = DateTime.UtcNow;
                }

                await db.SaveChangesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Outbox publishing failed");
            }

            await Task.Delay(TimeSpan.FromSeconds(1), stoppingToken);
        }
    }
}
```

![Outbox Pattern](/images/blog/posts/monolith-to-modular-monolith-to-microservices-at-100k-users/outbox-pattern.png)

A few production lessons I have learned the hard way:

- **Idempotency keys on the consumer side are non-negotiable.** The outbox guarantees *at-least-once*, not *exactly-once*. A consumer must tolerate seeing the same event twice.
- **Index `(ProcessedOnUtc, OccurredOnUtc)`** or you will be paged at 3 AM when the table grows to 50 million rows.
- **Archive processed rows.** Move them to a cold table after 7-30 days.
- **Watch for poison messages.** Add an `Attempts` column and a dead-letter table. One malformed event should not block all others.

## Read/Write Separation Inside the Monolith

Long before you need microservices, you usually need to separate reads from writes. The classic .NET pattern:

- **Writes** go through MediatR command handlers, hit the aggregate, and produce events.
- **Reads** bypass the aggregate entirely and project from a denormalized read model (a separate set of tables, a Redis cache, or a search index).

```csharp
// Write side
public sealed record PlaceOrderCommand(Guid CustomerId, IReadOnlyList<OrderLine> Lines)
    : IRequest<Result<Guid>>;

// Read side
public sealed class OrderListQuery : IRequest<IReadOnlyList<OrderListItemDto>>
{
    public Guid CustomerId { get; init; }
}

internal sealed class OrderListQueryHandler
    : IRequestHandler<OrderListQuery, IReadOnlyList<OrderListItemDto>>
{
    private readonly NpgsqlDataSource _ds;

    public async Task<IReadOnlyList<OrderListItemDto>> Handle(
        OrderListQuery q, CancellationToken ct)
    {
        await using var conn = await _ds.OpenConnectionAsync(ct);
        var rows = await conn.QueryAsync<OrderListItemDto>(
            "select id, total, status, placed_at from orders.order_list_view where customer_id = @cid",
            new { cid = q.CustomerId });
        return rows.ToList();
    }
}
```

Reads use Dapper or raw SQL against a view or a projection table. Writes use EF Core. This single change typically wipes out 60-80% of your "the API is slow" tickets, with zero microservices anywhere.

## When (and How) to Extract a Service

Now we get to the part everyone wants to skip to. Extraction is the easy part if you have done the modular monolith well. It is a nightmare if you have not.

A module is a candidate for extraction when **at least two** of the following are true:

1. It has a clearly different scaling profile (e.g., webhook delivery needs 10x the workers of the rest of the app).
2. It has a clearly different reliability requirement (e.g., a payment service needs 99.99% availability while the admin UI is fine at 99.5%).
3. It is owned by a different team that needs an independent release cadence.
4. Its data ownership is fully internal - no other module reads its tables directly.
5. It has been stable for at least 6 months - few new fields, few breaking contract changes.

If only one of these is true, you are extracting too early.

![Modular to Monolith](/images/blog/posts/monolith-to-modular-monolith-to-microservices-at-100k-users/modular-to-monolith.png)

The extraction itself, when the module is well-bounded, looks like this:

1. The Contracts project becomes a NuGet package.
2. The implementation moves to a new repo and a new ASP.NET Core host.
3. Cross-module calls switch from in-process `IBillingApi` to an HTTP client that implements `IBillingApi`.
4. Integration events move from in-process bus to RabbitMQ / Azure Service Bus / Kafka.
5. The database schema (already isolated) becomes a separate database.

If step 5 is hard, you did not actually have a modular monolith. You had a monolith with folders.

## Operational Complexity: The Hidden Cost

The day you extract your first service, your operational surface area roughly *doubles*. Here is what shows up on the bill:

- **Service templates.** A new service must come with logging, tracing, health checks, metrics, auth, and config baked in. Build a template, or every new service will reinvent all of it.
- **Distributed tracing.** OpenTelemetry, an OTLP collector, and a backend (Jaeger, Tempo, Application Insights). Without this, debugging cross-service issues is medieval.
- **Centralized logging.** Structured logs with a correlation ID propagated across services. Seq, Loki, or Application Insights all work; pick one.
- **Health and readiness endpoints.** Kubernetes will kill your service if you do not implement these properly.
- **Service discovery and config.** Even with Kubernetes, you need a strategy for connection strings, secrets, and feature flags across many services.
- **Deployment orchestration.** Versioned APIs, backwards-compatible contracts, expand/contract migrations. If service A v2 cannot talk to service B v1, you cannot do rolling deploys.
- **On-call.** Who gets paged at 2 AM when the webhook service is failing? Service ownership must be explicit.

![Operational Complexity](/images/blog/posts/monolith-to-modular-monolith-to-microservices-at-100k-users/operational-complexity.png)

The honest framing: **you do not get to do microservices part-time.** You either invest in a platform team or you suffer.

## Data Ownership: The Test Most Teams Fail

The single biggest predictor of microservices success is whether each service truly owns its data.

![Data Ownership](/images/blog/posts/monolith-to-modular-monolith-to-microservices-at-100k-users/data-ownership.png)


If two services share a database, they are one service wearing a costume. Any schema change requires coordination. Any performance issue is shared. Any outage is shared. You have all the cost of microservices and none of the benefits.

In a modular monolith, you simulate data ownership with **schemas** (`orders.*`, `billing.*`, `identity.*`) and a strict rule: **a module never queries another module's tables.** Cross-module reads go through `*.Contracts` interfaces, which translate to either an in-process call today or an HTTP/gRPC call tomorrow.

If you cannot enforce that rule today inside one database, you will not magically enforce it across services tomorrow.

## Observability: The Non-Negotiable Prerequisite

Before you extract a single service, your monolith should already have:

- **Structured logging** with `Serilog` or `Microsoft.Extensions.Logging` writing JSON.
- **OpenTelemetry traces** with the ASP.NET Core, EF Core, and HttpClient instrumentations enabled.
- **Metrics** for request rate, error rate, P50/P95/P99 latency, and a few business counters (orders placed, invoices issued).
- **Correlation IDs** propagated through every layer, including background workers reading the outbox.

Why before? Because the day you split the monolith, you lose the ability to step through a single stack trace. If you do not already have observability muscle, you will be debugging production by reading logs in three different systems and crying.

```csharp
// Program.cs - minimum viable observability
builder.Services.AddOpenTelemetry()
    .WithTracing(t => t
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddSource("NorthwindPay.*")
        .AddOtlpExporter())
    .WithMetrics(m => m
        .AddAspNetCoreInstrumentation()
        .AddRuntimeInstrumentation()
        .AddMeter("NorthwindPay.*")
        .AddOtlpExporter());
```

If your monolith does not have this, your next ticket should not be "extract Billing service." It should be "wire up OpenTelemetry."

## A Realistic Migration Roadmap

Here is the roadmap I would give Northwind Pay - or any team in a similar position - in priority order. None of these are "do microservices."

**Phase 0 - Stabilize the monolith (weeks 1-4)**

1. Add OpenTelemetry traces and metrics.
2. Identify the top 10 slowest endpoints and fix the queries.
3. Move all email/PDF/webhook work to `BackgroundService` workers.
4. Add health and readiness endpoints.

**Phase 1 - Internal modularization (weeks 4-12)**

1. Carve the codebase into module folders (Orders, Billing, Identity, Notifications).
2. Create `*.Contracts` projects.
3. Move EF Core entities to per-module schemas.
4. Forbid cross-module type references via architecture tests (NetArchTest or ArchUnitNET).
5. Introduce an in-process event bus.

**Phase 2 - Async backbone (weeks 8-16)**

1. Implement the outbox pattern in each module that publishes events.
2. Add idempotency keys on consumers.
3. Add a dead-letter table.
4. Add metrics for outbox lag.

**Phase 3 - Read/write separation (weeks 12-20)**

1. Identify the hottest read endpoints.
2. Build dedicated projections or materialized views.
3. Move those reads off the EF Core write model.

**Phase 4 - Selective extraction (months 6+)**

1. Pick **one** module that passes the extraction criteria.
2. Extract it. Run it in production for 30 days.
3. Measure: did operational pain go down? If yes, consider the next candidate. If no, *roll back*.

The willingness to roll back is what separates engineering teams from cargo-cult teams.

## Anti-Patterns I See Every Quarter

After enough architecture reviews, the same mistakes show up. Here are the worst.

**The Distributed Monolith.** Multiple services, one shared database, synchronous HTTP calls in every request path. All the cost of microservices, none of the benefits. This is the most common failure mode.

**The Auth Service Trap.** Extracting authentication first because "every service needs it" - and then every request in the system has an extra network hop on the critical path. Auth should be a library plus an identity provider (Keycloak, Auth0, Entra), not a synchronous service in your hot path.

**The Microservice Per Entity.** "Order service", "Customer service", "Product service" - each owning one table. You did not extract domains; you extracted tables. Every business workflow now spans three services.

**The Event-Driven Soup.** No documented contracts, no schema registry, no idempotency. Events fire, things happen, nobody knows in what order, and debugging requires reading three months of logs.

**The "We'll Add Tracing Later" Service.** Extracting services without observability. You will not add tracing later. You will add it during the postmortem.

**The Premature Kafka.** A team of six engineers running Kafka, ZooKeeper (or KRaft), Schema Registry, and Kafka Connect to move a thousand messages a day. RabbitMQ or Azure Service Bus would have been a 10-line config.

**The God Module.** A "Core" or "Common" module that 80% of other modules depend on. Congratulations, you reinvented the monolith inside the monolith.

> Architecture evolution should follow measurable pain, not hype.

## Deployment: What Actually Changes

A useful mental model is to compare deployment shape before and after.

![Deployment](/images/blog/posts/monolith-to-modular-monolith-to-microservices-at-100k-users/deployment.png)

In a modular monolith, deployments are still simple: one artifact, one rollout. Module boundaries help the *codebase*, not the deployment. That is fine - that is exactly what most teams need.

In microservices, every deploy is a coordination problem. You need contract tests, expand/contract schema migrations, and the discipline to never break a downstream consumer. This is real work. Budget for it.

## FAQ

### What is a modular monolith in .NET?

A modular monolith in .NET is a single ASP.NET Core deployable structured internally as independent modules, each with its own folder, internal types, dedicated database schema, and a small public contracts project. Modules communicate only through contracts and integration events, never through direct dependencies on each other's implementation code.

### When should I move from monolith to microservices?

Move from monolith to microservices only when you have measurable, recurring pain that cannot be solved within a single deployable: independent scaling needs, independent release cadences across teams, different reliability requirements, or fully isolated data ownership for a specific module. If you cannot point to such pain, stay with a modular monolith.

### Is the modular monolith a stepping stone or a destination?

For most .NET systems, it is the destination. Only modules that prove they need independent scaling, deployment, or ownership should be extracted. Many successful products run as modular monoliths indefinitely.

### What's the biggest microservices migration mistake?

Extracting services before domain boundaries are stable and before operational capabilities (observability, CI/CD per service, on-call rotations, async messaging) exist. The result is a distributed monolith - the worst of both worlds.

### Do I need Kubernetes for microservices?

No, but you need *some* orchestration. App Service, Azure Container Apps, AWS ECS, or Fly.io can run microservices without Kubernetes. Choose the simplest platform that gives you health checks, rolling deploys, and autoscaling.

### How do modules communicate in a modular monolith?

Synchronous queries go through interfaces in `*.Contracts` projects, implemented in-process today and replaceable with HTTP/gRPC clients later. Workflows go through integration events published via an in-process bus, persisted with the outbox pattern.

### What is the role of MediatR in a modular monolith?

MediatR (or any in-process mediator) is useful *inside* a module, for command/query separation. It is a poor fit for *between* modules - that is what contract interfaces and integration events are for.

### How do I enforce module boundaries in code?

Use project references plus architecture tests. Tools like `NetArchTest.Rules` or `ArchUnitNET` let you assert in unit tests that "module X does not reference module Y's implementation namespace." If a developer breaks the rule, the build fails.

### Can a modular monolith handle 100k users?

Easily. A well-tuned ASP.NET Core monolith on modern hardware can handle hundreds of thousands of users. The bottleneck is almost always the database, not the application tier.

### When does the outbox pattern become necessary?

The moment you publish an event after persisting state - whether to an in-process bus, RabbitMQ, or Kafka. Without an outbox, you will eventually lose events when a process crashes between save and publish. It is one of the cheapest insurance policies in distributed systems.

## Wrapping Up

The single most expensive architecture mistake I see is teams skipping the modular monolith.

They go from a tangled monolith straight to microservices, learn that they did not actually understand their domain, and spend a year paying for that lesson in pager duty. The teams that do well take the boring path:

1. Stabilize the monolith. Fix queries. Move slow work off the request path. Wire up observability.
2. Modularize internally. Boundaries, contracts, schemas, events, outbox.
3. Extract services *only* where the pain is measurable and the boundary is proven.

That sequencing is not glamorous. It will not get you on a conference stage. But it will get you to 100k users with a team that still ships features and sleeps through the night.

> Architecture evolution should follow measurable pain, not hype.

If there is one sentence I want you to take from this article, that is the one.

---

If you want to keep going deeper on the patterns that make this evolution work in real .NET systems - outbox, CQRS, modular boundaries, integration events, and the trade-offs behind each - I cover them with production-grade examples in [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Use code **DEEP20** for 20% off.

And if you found this useful, the easiest way to get the next deep dive is to [join the newsletter](/) - one practical .NET architecture article per week, no fluff, no reposted Twitter threads.

Until next time - keep the boundaries clean and the deployments boring.

<!--END-->
