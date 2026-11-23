---
title: "MediatR Alternative - Wolverine"
seo_title: "MediatR Alternatives in C#: Wolverine and Other Free Options"
subtitle: "MediatR will soon require a commercial license for some usage. This has sparked interest in alternatives - and one name stands out: Wolverine..."
date: "Apr 08 2025"
category: ".NET"
readTime: "Read Time: 8 minutes"
meta_description: "MediatR is commercial since v13. Compare free MediatR alternatives in C# and build a CQRS minimal API with Wolverine, step by step, with full code."
updated: "2026-11-23"
faq:
  - q: "Is MediatR still free?"
    a: >-
      MediatR versions up to v12 stay under the MIT license. Starting with v13 (July 2025), MediatR is dual-licensed
      under RPL-1.5 and a commercial license. A free Community edition covers companies under $5M in annual revenue,
      non-profits, education and non-production use. Everyone else needs a paid license.
  - q: "What is the best MediatR alternative in C#?"
    a: >-
      It depends on what you need. Wolverine is the best fit if you also want messaging, retries, scheduling or an
      outbox. If you want an almost identical API, the source-generated Mediator library (MIT) is the closest drop-in
      replacement. If you only use MediatR to organize commands and queries, plain handler classes need no library at all.
  - q: "Does Wolverine need IRequest and IRequestHandler interfaces?"
    a: >-
      No. Wolverine finds handlers by convention: a public class whose name ends with Handler (or Consumer) and a
      Handle or HandleAsync method that takes the message as a parameter. Your commands and queries can be plain records.
  - q: "Can I use CQRS without MediatR?"
    a: >-
      Yes. CQRS is a pattern, not a library. You can write command and query handler classes, register them in
      dependency injection and call them directly from your endpoints, with no mediator in between.
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored - I write these deep dives in my free time and keep them free for everyone. If your company sells AI tools, dev tools, courses, or services that .NET developers would actually use, sponsoring an issue is the most direct way to reach them.</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #1a0224; background: #ffbd39; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>
**Want consistent, clean .NET code - even when AI writes half of it?** [Pragmatic .NET Code Rules](https://thecodeman.net/pragmatic-dotnet-code-rules) is my course on the conventions, analyzers and guardrails I use on real projects.

**Short answer:** The most popular MediatR alternatives in C# are **Wolverine** (MIT, a mediator plus a message bus), **[Mediator](https://github.com/martinothamar/Mediator)** by Martin Othamar (MIT, source-generated, with an API very close to MediatR) and **plain handler classes** with no library at all. MediatR itself is no longer free for everyone: since v13 (July 2025) it is dual-licensed, with a free Community edition for smaller companies. Below is a quick comparison, then a full CRUD minimal API built with Wolverine.

## MediatR Alternatives at a Glance

| Option | License | How it works | Pick it when |
|---|---|---|---|
| Wolverine | MIT | Mediator + message bus, handlers found by convention, generated handler code | You also want messaging, retries, scheduling or an outbox |
| Mediator (martinothamar) | MIT | Source generator, MediatR-like interfaces | You want the smallest migration from MediatR |
| Plain handlers (no library) | Your code | Handler classes registered in DI and called directly | You only need CQRS structure, nothing else |
| MediatR v12 and older | MIT | Same as before | You can't migrate yet and don't need new versions |
| MediatR v13+ | RPL-1.5 or commercial | Same API, license key for commercial use | Your company qualifies for the free Community edition or you pay |

Want the no-library route? I covered it in [How to implement CQRS without MediatR](https://thecodeman.net/posts/how-to-implement-cqrs-without-mediatr) and [Build Your Own MediatR: A Lightweight Handler Pipeline in ASP.NET Core](https://thecodeman.net/posts/build-your-own-mediatr-lightweight-handler-pipeline-aspnet-core).

## MediatR Went Commercial: What Changed
As .NET developers, we’ve long relied on libraries like **MediatR** to help us implement the Mediator pattern. It is mostly used to implement Command Query Responsibility Segregation (CQRS) pattern - separating reads from writes, and keeping our code clean and maintainable. ([Learn how to implement it without MediatR](https://thecodeman.net/posts/how-to-implement-cqrs-without-mediatr?utm_source=Website)).

But there’s a shift happening.

📢 **MediatR is now commercial.** Since July 2025, MediatR v13 and newer are dual-licensed under RPL-1.5 and a commercial license. A free Community edition covers companies under $5M in annual revenue, non-profits, education and non-production use, while versions up to v12 stay under the MIT license. Details are in [Jimmy Bogard's announcement](https://www.jimmybogard.com/automapper-and-mediatr-commercial-editions-launch-today/).

This has sparked interest in **alternatives** - and one name stands out: [Wolverine](https://wolverinefx.net/).

Wolverine is a high-performance .NET library for CQRS, messaging, and background processing. Instead of using reflection on every call, it generates the code that invokes your handlers (at runtime by default, or ahead of time), and it adds advanced features like retries, scheduling, sagas, and outbox support.

Wolverine is more than just a drop-in replacement for MediatR. It offers:

- Generated handler code instead of reflection on every call
- Built-in message bus for local or distributed messaging
- Scheduling, retries, and durable outbox support
- Native saga/workflow orchestration
- Seamless integration with minimal APIs
In this article, we'll build a complete User CRUD API using Wolverine to show how clean and scalable your app architecture can be. 

Let's start!

## What We’re Building
We’ll build a minimal API to:

- Create a new user
- Read a user by ID
- Update an existing user
- Delete a user

Each operation will be implemented using a command or query object and handled by Wolverine, keeping everything decoupled, testable, and clean.

## Step 1: Define the User Model

```csharp
public record User(Guid Id, string Name, string Email);
```

And to simulate persistence:

```csharp
public static class InMemoryUsers
{
    public static readonly List<User> Users = new();
}
```

## Step 2: Create Commands & Queries

Each action gets its own request model:

```csharp
public record CreateUser(string Name, string Email);
public record GetUser(Guid Id);
public record UpdateUser(Guid Id, string Name, string Email);
public record DeleteUser(Guid Id);
```

## Step 3: Implement Handlers
Wolverine automatically discovers your handler classes and routes messages based on method name and parameter types.
CreateUserHandler:

```csharp
public class CreateUserHandler
{
    public User Handle(CreateUser command)
    {
        var user = new User(Guid.NewGuid(), command.Name, command.Email);
        InMemoryUsers.Users.Add(user);
        return user;
    }
}
```

GetUserHandler:
```csharp
public class GetUserHandler
{
    public User? Handle(GetUser query)
    {
        return InMemoryUsers.Users.FirstOrDefault(u => u.Id == query.Id);
    }
}
```
UpdateUserHandler:
```csharp
public class UpdateUserHandler
{
    public User? Handle(UpdateUser command)
    {
        var user = InMemoryUsers.Users.FirstOrDefault(u => u.Id == command.Id);
        if (user is null) return null;

        var updated = user with { Name = command.Name, Email = command.Email };
        InMemoryUsers.Users.Remove(user);
        InMemoryUsers.Users.Add(updated);
        return updated;
    }
}
```
DeleteUserHandler:

```csharp
public class DeleteUserHandler
{
    public bool Handle(DeleteUser command)
    {
        var user = InMemoryUsers.Users.FirstOrDefault(u => u.Id == command.Id);
        if (user is null) return false;

        InMemoryUsers.Users.Remove(user);
        return true;
    }
}
```

## Step 4: Configure Minimal API with Wolverine

- Registers message handlers automatically
Wolverine scans your assembly for any class with Handle or HandleAsync methods that match a message type (like CreateUser, UpdateUser, etc.), and registers them.

- Adds IMessageBus to DI
This makes IMessageBus available throughout your app — including in minimal API endpoints, services, background workers, etc.

- Enables Wolverine middleware & extensions
Wolverine hooks into the app pipeline and optionally enables:
- Retry policies
-Message scheduling
-Outbox/durable messaging
-Background jobs

- Starts the internal runtime engine
Wolverine spins up an internal messaging engine to manage local + external message routing (e.g. [RabbitMQ](https://thecodeman.net/posts/rabbitmq-in-dotnet-from-scratch), Kafka) if configured.

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthorization();
builder.Host.UseWolverine(); // Enable Wolverine

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthorization();

// Create
app.MapPost("/users", async (CreateUser request, IMessageBus bus) =>
{
    var user = await bus.InvokeAsync<User>(request);
    return Results.Created($"/users/{user.Id}", user);
});

// Read
app.MapGet("/users/{id:guid}", async (Guid id, IMessageBus bus) =>
{
    var user = await bus.InvokeAsync<User?>(new GetUser(id));
    return user is null ? Results.NotFound() : Results.Ok(user);
});

// Update
app.MapPut("/users/{id:guid}", async (Guid id, UpdateUser command, IMessageBus bus) =>
{
    if (id != command.Id) return Results.BadRequest();

    var updated = await bus.InvokeAsync<User?>(command);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});

// Delete
app.MapDelete("/users/{id:guid}", async (Guid id, IMessageBus bus) =>
{
    var deleted = await bus.InvokeAsync<bool>(new DeleteUser(id));
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.Run();
```

`await bus.InvokeAsync<User>(request);`

What’s happening:
- request is a command (e.g. CreateUser)
- `InvokeAsync<TResponse>(...)` means: "Send this command to Wolverine and give me back a result of type TResponse — in this case, a User"

Behind the scenes:
1. Wolverine receives the CreateUser command.
2. It finds the appropriate handler method with this signature: ***public User Handle(CreateUser command)***
3. It invokes that method.
4. It returns the result back to you as a User.

Note: With Wolverine, you **don’t need to implement any interfaces like** `IRequest<T>` or `IRequestHandler<TRequest, TResponse>` to define your message or handler.

## Bonus: Wolverine Is More Than Just MediatR

Here’s what Wolverine gives you beyond MediatR:

- Built-in Messaging System
Supports:
- In-memory messaging (like MediatR)
- Distributed messaging with RabbitMQ, Azure Service Bus, Kafka, and more

- Background Jobs & Scheduling
You can schedule messages to run later.

- Durable Outbox Pattern
With built-in support for persistence, Wolverine can safely queue outgoing messages for reliable delivery - no need to hand-roll the outbox pattern.

- Sagas & Workflows
Easily orchestrate multi-step, long-running workflows with built-in Saga support.

## Wrapping Up

If you're building clean APIs, CQRS-based services, or microservices, **Wolverine offers a powerful alternative to MediatR**. It keeps your code lean and testable while unlocking features like:

- Distributed messaging
- Scheduling and retries
- [Saga orchestration](https://thecodeman.net/posts/saga-orchestration-pattern)
- Generated handler code for fast dispatch

Now that MediatR has moved to a commercial model, Wolverine becomes an even more compelling choice for greenfield projects and modern architecture.

🙌 Why I Still Respect MediatR’s New Direction

While this article showcases Wolverine, I want to take a moment to acknowledge and support the decision behind MediatR’s commercial licensing.
- Both maintainers - especially [Jimmy Bogard](https://www.jimmybogard.com/) — have contributed over a decade of free value to the .NET community.
- This change didn’t come hastily - it was clearly communicated and thoughtfully planned.
- Most importantly:
- ✅ Existing versions remain open source
- ✅ A free Community edition covers smaller companies, non-profits and education
- ✅ Paid licenses help ensure sustainability

Let’s be honest here: **writing and maintaining libraries like MediatR from scratch would cost your team far more than the license fees.** 

Paying for quality tools is a small price to support the people who make our daily development lives better.

So yes - explore Wolverine for its exciting feature set. 

But also respect the path MediatR is taking. We’re lucky to have both options in the .NET ecosystem.

## Related Reading

- Staying on MediatR? Learn [MediatR Pipeline Behavior](https://thecodeman.net/posts/mediatr-pipeline-behavior) for logging, validation and transactions, and [How to use MediatR Notifications](https://thecodeman.net/posts/how-to-use-mediatr-notifications).
- Dropping the library? Start with [How to implement CQRS without MediatR](https://thecodeman.net/posts/how-to-implement-cqrs-without-mediatr) or [Build Your Own MediatR](https://thecodeman.net/posts/build-your-own-mediatr-lightweight-handler-pipeline-aspnet-core).
- Organizing your endpoints? See the [REPR Pattern](https://thecodeman.net/posts/repr-pattern).

That's all from me today. 
 
P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

Want more design patterns with real-world examples? My ebook [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) covers 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with hands-on C# code you can use right away. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

<!--END-->



