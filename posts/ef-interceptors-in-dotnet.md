---
title: "EF Core Interceptors in .NET"
subtitle: "Add Auditing, Guardrails, and Observability Without Polluting Your DbContext"
date: "January 12 2026"
category: "Entity Framework"
meta_description: "Learn how to use Feature Flags in .NET to enable or disable features at runtime without redeploying your application. Includes a real production-ready example with Azure App Configuration, caching, and multi-instance support."
---

<!--START-->
##### This issue is made possible thanks to [ZZZ Projects](https://zzzprojects.com/?utm_source=stefandjokic&utm_medium=newsletter&utm_campaign=birthday), who help keep this newsletter free for everyone. A huge shout-out to them for their support of our community. Let's thank them by entering the link below.
&nbsp;  
##### EF Core too slow? Insert data 14x faster and cut saving time by 94%.
##### [👉 Boost performance with Bulk Insert](https://entityframework-extensions.net/bulk-insert?utm_source=stefandjokic&utm_medium=linkedin&utm_campaign=birthday) 
&nbsp;  
##### [Check EF Extensions here.](https://entityframework-extensions.net/bulk-insert?utm_source=stefandjokic&utm_medium=linkedin&utm_campaign=birthday)
&nbsp;

&nbsp;  
&nbsp;  
### Introduction
&nbsp;  
&nbsp;  

##### Most teams start with the same two problems:
&nbsp;  
##### 1. “We need audit fields everywhere (CreatedAt, UpdatedAt, UpdatedBy…), and we keep forgetting to set them.”
##### 2. “We need better visibility into SQL in production (correlation IDs, tenant IDs, slow query alerts).”
&nbsp;  

##### The usual outcome: your DbContext.SaveChanges override becomes a junk drawer, or every repository repeats the same cross-cutting logic.
&nbsp;  
 
##### **EF Core interceptors** exist exactly for this: they let you **intercept, modify, or suppress EF operations** at different pipeline stages - commands, connections, transactions, SaveChanges, materialization, etc.
&nbsp;  
&nbsp;  
### The domain: “SaaS Billing” with audit + compliance needs
&nbsp;  
&nbsp;

##### Imagine a billing system where: 
##### • Every row must be attributable to a user and tenant.
##### • Deletes must be soft (regulators + “oops” recovery).
##### • When a payment job spikes DB load, you want slow query logs tied to the request/job ID.
&nbsp;
##### We’ll solve this with two interceptors.
  
&nbsp;  
&nbsp;  
### 1) Auditing + soft delete with SaveChangesInterceptor
&nbsp;  
&nbsp;  

##### Step 1 - Define a tiny audit/soft-delete contract

```csharp

public interface IAuditableEntity
{
  DateTimeOffset CreatedAt { get; set; }
  string? CreatedBy { get; set; }
  DateTimeOffset UpdatedAt { get; set; }
  string? UpdatedBy { get; set; }
}

public interface ISoftDelete
{
  bool IsDeleted { get; set; }
  DateTimeOffset? DeletedAt { get; set; }
  string? DeletedBy { get; set; }
}
```

##### **Why this matters:**
##### Interceptors work best when you can apply logic by capability (interfaces), instead of hardcoding entity types.
&nbsp;  

#### Step 2 - Example entity

```csharp

public sealed class Invoice : IAuditableEntity, ISoftDelete
{
  Guid Id { get; set; }
  Guid TenantId { get; set; }
  decimal Amount { get; set; }
  string Currency { get; set; } = "EUR";
  DateTimeOffset CreatedAt { get; set; }
  string? CreatedBy { get; set; }
  DateTimeOffset UpdatedAt { get; set; }
  string? UpdatedBy { get; set; }
  bool IsDeleted { get; set; }
  DateTimeOffset? DeletedAt { get; set; }
  string? DeletedBy { get; set; }
}
```

##### **What’s “real” here:**
##### Billing data often requires immutability/auditability, and soft deletes are a very common compliance-friendly default.  
&nbsp;  
#### Step 3 - “Current user” abstraction (works for APIs + background jobs)

```csharp

public interface ICurrentActor
{
    string? UserId { get; }
    Guid? TenantId { get; }
    string CorrelationId { get; }
}

public sealed class CurrentActor : ICurrentActor
{
    public CurrentActor(IHttpContextAccessor accessor)
    {
        var http = accessor.HttpContext;

        UserId = http?.User?.Identity?.Name;
        TenantId = Guid.TryParse(http?.Request.Headers["X-Tenant-Id"], out var tid) ? tid : null;

        CorrelationId =
            http?.TraceIdentifier
            ?? Activity.Current?.Id
            ?? Guid.NewGuid().ToString("N");
    }

    public string? UserId { get; }
    public Guid? TenantId { get; }
    public string CorrelationId { get; }
}
```
##### **Why this matters:**
##### Interceptors are cross-cutting. You need one place to define “who is doing the action” and “what request/job is this”.
&nbsp;  
#### Step 4 - The interceptor itself

```csharp

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

public sealed class AuditAndSoftDeleteInterceptor : SaveChangesInterceptor
{
    private readonly ICurrentActor _actor;

    public AuditAndSoftDeleteInterceptor(ICurrentActor actor)
        => _actor = actor;

    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        ApplyRules(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        ApplyRules(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void ApplyRules(DbContext? context)
    {
        if (context is null) return;

        var now = DateTimeOffset.UtcNow;
        var user = _actor.UserId ?? "system";

        foreach (var entry in context.ChangeTracker.Entries())
        {
            if (entry.Entity is IAuditableEntity auditable)
            {
                if (entry.State == EntityState.Added)
                {
                    auditable.CreatedAt = now;
                    auditable.CreatedBy = user;
                }

                if (entry.State is EntityState.Added or EntityState.Modified)
                {
                    auditable.UpdatedAt = now;
                    auditable.UpdatedBy = user;
                }
            }

            if (entry.Entity is ISoftDelete softDelete && entry.State == EntityState.Deleted)
            {
                // Convert hard delete into soft delete
                entry.State = EntityState.Modified;

                softDelete.IsDeleted = true;
                softDelete.DeletedAt = now;
                softDelete.DeletedBy = user;

                // Also counts as an update
                if (entry.Entity is IAuditableEntity a)
                {
                    a.UpdatedAt = now;
                    a.UpdatedBy = user;
                }
            }
        }
    }
}
```

##### **What this gives you: **
##### • Nobody can “forget” audit fields anymore.
##### • Nobody can accidentally hard-delete rows (unless they bypass EF, which you can also detect via DB perms).
##### • Your DbContext stays clean.

&nbsp;  
&nbsp;  
### 2) SQL observability with DbCommandInterceptor (tagging + slow query logging)
&nbsp;  
&nbsp;  

##### This is one of my favorite “production maturity” uses of interceptors: 
##### • Attach a correlation ID and tenant ID to SQL as a comment.
##### • Log slow queries with that same metadata. 
&nbsp;  
#### Step 1 - The interceptor

```csharp

using System.Data.Common;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;

public sealed class ObservabilityCommandInterceptor : DbCommandInterceptor
{
    private readonly ICurrentActor _actor;
    private readonly ILogger<ObservabilityCommandInterceptor> _logger;

    // Tune for your system
    private static readonly TimeSpan SlowQueryThreshold = TimeSpan.FromMilliseconds(250);

    public ObservabilityCommandInterceptor(
        ICurrentActor actor,
        ILogger<ObservabilityCommandInterceptor> logger)
    {
        _actor = actor;
        _logger = logger;
    }

    public override InterceptionResult<DbDataReader> ReaderExecuting(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<DbDataReader> result)
    {
        Tag(command);
        eventData.Context?.Items.TryAdd(eventData.CommandId, Stopwatch.StartNew());
        return base.ReaderExecuting(command, eventData, result);
    }

    public override void ReaderExecuted(
        DbCommand command,
        CommandExecutedEventData eventData,
        DbDataReader result)
    {
        LogIfSlow(eventData, command);
        base.ReaderExecuted(command, eventData, result);
    }

    public override InterceptionResult<int> NonQueryExecuting(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<int> result)
    {
        Tag(command);
        eventData.Context?.Items.TryAdd(eventData.CommandId, Stopwatch.StartNew());
        return base.NonQueryExecuting(command, eventData, result);
    }

    public override void NonQueryExecuted(
        DbCommand command,
        CommandExecutedEventData eventData,
        int result)
    {
        LogIfSlow(eventData, command);
        base.NonQueryExecuted(command, eventData, result);
    }

    public override InterceptionResult<object> ScalarExecuting(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<object> result)
    {
        Tag(command);
        eventData.Context?.Items.TryAdd(eventData.CommandId, Stopwatch.StartNew());
        return base.ScalarExecuting(command, eventData, result);
    }

    public override void ScalarExecuted(
        DbCommand command,
        CommandExecutedEventData eventData,
        object result)
    {
        LogIfSlow(eventData, command);
        base.ScalarExecuted(command, eventData, result);
    }

    private void Tag(DbCommand command)
    {
        var tenant = _actor.TenantId?.ToString() ?? "none";
        var corr = _actor.CorrelationId;

        // SQL comments are ignored by most engines but show up in logs/traces
        // Keep it short to avoid huge command texts
        command.CommandText = $"/* tenant:{tenant} corr:{corr} */\n{command.CommandText}";
    }

    private void LogIfSlow(CommandExecutedEventData eventData, DbCommand command)
    {
        if (eventData.Context is null) return;

        if (eventData.Context.Items.TryGetValue(eventData.CommandId, out var swObj) &&
            swObj is Stopwatch sw)
        {
            sw.Stop();

            if (sw.Elapsed >= SlowQueryThreshold)
            {
                _logger.LogWarning(
                    "Slow SQL ({ElapsedMs} ms) tenant:{TenantId} corr:{CorrelationId}\n{CommandText}",
                    sw.Elapsed.TotalMilliseconds,
                    _actor.TenantId,
                    _actor.CorrelationId,
                    command.CommandText);
            }

            eventData.Context.Items.Remove(eventData.CommandId);
        }
    }
}
```

##### **Why this is powerful:**
##### • When production slows down, you’ll see which request/job caused the expensive SQL.
##### • Your DBA/observability stack can correlate SQL traces back to app traces.
&nbsp;
##### **Also important:** Microsoft explicitly positions interceptors as more than logging—they can modify operations. 

&nbsp;  
&nbsp;  
### 3) Wire it up in .NET 9 (DI + AddInterceptors)
&nbsp;  
&nbsp;  

```csharp

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentActor, CurrentActor>();

// Interceptors: usually safe as singleton if they are stateless.
// Ours depends on scoped ICurrentActor, so we register them as scoped.
builder.Services.AddScoped<AuditAndSoftDeleteInterceptor>();
builder.Services.AddScoped<ObservabilityCommandInterceptor>();

builder.Services.AddDbContext<BillingDbContext>((sp, options) =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("db"));

    // Add interceptors from DI
    options.AddInterceptors(
        sp.GetRequiredService<AuditAndSoftDeleteInterceptor>(),
        sp.GetRequiredService<ObservabilityCommandInterceptor>());
});

var app = builder.Build();
app.MapGet("/", () => "OK");
app.Run();
```

##### **Key detail about execution order:**
&nbsp;  
##### EF Core can run interceptors coming from DI (“injected”) and those added directly to the context (“application interceptors”). Injected ones run first (in resolution order), then application interceptors run in the order they were added.

&nbsp;  
&nbsp;  
### Practical tips (the stuff that bites in real projects)
&nbsp;  
&nbsp;  

##### **Keep interceptors fast**. If your interceptor does heavy work, you just moved latency into the hot path.

##### **Be careful with service lifetimes**. If you register an interceptor as a singleton but it depends on scoped services, you’ll have a bad day.
 
##### **Don’t call EF from inside a command interceptor** (you can create recursion or deadlocks).
 
##### **Prefer interceptors for cross-cutting concerns**, and keep domain rules in the domain.

&nbsp;  
&nbsp;  
### Wrapping up 
&nbsp;  
&nbsp;  

##### Interceptors are one of those EF Core features that quietly upgrade your codebase maturity:
##### • Your DbContext stays focused on modeling and mapping. 
##### • Auditing/soft-delete becomes consistent and automatic.
##### • SQL observability stops being “best effort” and becomes built-in. 
##### If you want to go even further, the next “adult” use case is an **Outbox pattern** using SaveChangesInterceptor (capture domain events, persist them, publish reliably) - Milan has a [great article](https://www.milanjovanovic.tech/blog/how-to-use-ef-core-interceptors#store-outbox-messages-with-ef-interceptors) about it.

##### That's all for today.
&nbsp;
##### P.S. I’m currently building a new course, [Pragmatic .NET Code Rules](https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website&utm_campaign=120126), focused on creating a predictable, consistent, and self-maintaining .NET codebase using .editorconfig, analyzers, Visual Studio code cleanup, and CI enforcement.
&nbsp;
##### The course is available in presale until the official release, with early-bird pricing for early adopters.
##### You can find all the details [here](https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website&utm_campaign=120126).
<!--END-->