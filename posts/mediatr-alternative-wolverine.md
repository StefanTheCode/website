---
title: "MediatR Alternative - Wolverine"
subtitle: "MediatR will soon require a commercial license for some usage. This has sparked interest in alternatives - and one name stands out: Wolverine..."
date: "Apr 08 2025"
category: ".NET"
readTime: "Read Time: 6 minutes"
meta_description: "Wolverine is a high-performance .NET library for CQRS, messaging, and background processing. Built with source generators, it replaces MediatR and adds advanced features like retries, scheduling, sagas, and outbox support."
---

<!--START-->
🚀 Coming Soon: Enforcing Code Style
A brand-new course is launching soon inside [The CodeMan Community](https://www.skool.com/thecodeman)!

Join now to lock in early access when it drops - plus get everything else already inside the group.

Founding Member Offer:
- First 100 members get in for **just $4/month** - *70 spots already taken*!
- Or subscribe for **3 months ($12) or annually ($40)** to unlock full access when the course goes live.
Get ahead of the game -  and make clean, consistent code your superpower.
[Join here](https://www.skool.com/thecodeman)

## MediatR is going commercial
As .NET developers, we’ve long relied on libraries like **MediatR** to help us implement the Mediator pattern. It is mostly used to implement Command Query Responsibility Segregation (CQRS) pattern - separating reads from writes, and keeping our code clean and maintainable. ([Learn how to implement it without MediatR](https://thecodeman.net/posts/how-to-implement-cqrs-without-mediatr?utm_source=Website)).

But there’s a shift happening.

📢 **MediatR will soon require a commercial license for some usage.**

This has sparked interest in **alternatives** - and one name stands out: [Wolverine](https://wolverinefx.net/).

Wolverine is a high-performance .NET library for CQRS, messaging, and background processing. Built with [source generators](https://thecodeman.net/posts/source-generators-deep-dive), it replaces MediatR and adds advanced features like retries, scheduling, sagas, and outbox support.

Wolverine is more than just a drop-in replacement for MediatR. It offers:

- Faster performance via source generators
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

*await bus.InvokeAsync<User>(request);*

What’s happening:
- request is a command (e.g. CreateUser)
- InvokeAsync<TResponse>(...) means: "Send this command to Wolverine and give me back a result of type TResponse — in this case, a User"

Behind the scenes:
1. Wolverine receives the CreateUser command.
2. It finds the appropriate handler method with this signature: ***public User Handle(CreateUser command)***
3. It invokes that method.
4. It returns the result back to you as a User.

Note: With Wolverine, you **don’t need to implement any interfaces like** IRequest<T> or IRequestHandler<TRequest, TResponse> to define your message or handler.

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
- Source-generated performance

Now that MediatR is transitioning to a commercial model, Wolverine becomes an even more compelling choice for greenfield projects and modern architecture.

🙌 Why I Still Respect MediatR’s New Direction

While this article showcases Wolverine, I want to take a moment to acknowledge and support the decision behind MediatR’s upcoming commercial licensing.
- Both maintainers - especially [Jimmy Bogard](https://www.jimmybogard.com/) — have contributed over a decade of free value to the .NET community.
- This change didn’t come hastily - it was clearly communicated and thoughtfully planned.
- Most importantly:
- ✅ Existing versions remain open source
- ✅ Security patches will still be delivered
- ✅ Paid licenses help ensure sustainability

Let’s be honest here: **writing and maintaining libraries like MediatR from scratch would cost your team far more than the license fees.** 

Paying for quality tools is a small price to support the people who make our daily development lives better.

So yes - explore Wolverine for its exciting feature set. 

But also respect the path MediatR is taking. We’re lucky to have both options in the .NET ecosystem.

That's all from me today. 
 
P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

Want more design patterns with real-world examples? My ebook [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) covers 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with hands-on C# code you can use right away. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

<!--END-->



