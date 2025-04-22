---
title: "MediatR Alternative - Wolverine"
subtitle: "MediatR will soon require a commercial license for some usage. This has sparked interest in alternatives - and one name stands out: Wolverine..."
readTime: "Read Time: 6 minutes"
date: "Apr 08 2025"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Wolverine is a high-performance .NET library for CQRS, messaging, and background processing. Built with source generators, it replaces MediatR and adds advanced features like retries, scheduling, sagas, and outbox support."
---

<!--START-->
##### **🚀 Coming Soon: Enforcing Code Style**
&nbsp;
##### A brand-new course is launching soon inside [The CodeMan Community](https://www.skool.com/thecodeman)!
&nbsp;

##### Join now to lock in early access when it drops - plus get everything else already inside the group.
&nbsp;

##### Founding Member Offer:
##### • First 100 members get in for **just $4/month** - *70 spots already taken*!
##### • Or subscribe for **3 months ($12) or annually ($40)** to unlock full access when the course goes live.
&nbsp;
##### Get ahead of the game -  and make clean, consistent code your superpower.
&nbsp;
##### [Join here](https://www.skool.com/thecodeman)

&nbsp;  
&nbsp;  
### MediatR is going commercial
&nbsp;  
&nbsp;  
##### As .NET developers, we’ve long relied on libraries like **MediatR** to help us implement the Mediator pattern. It is mostly used to implement Command Query Responsibility Segregation (CQRS) pattern - separating reads from writes, and keeping our code clean and maintainable. ([Learn how to implement it without MediatR](https://thecodeman.net/posts/how-to-implement-cqrs-without-mediatr?utm_source=Website)).
&nbsp;  

##### But there’s a shift happening.
&nbsp;  

##### 📢 **MediatR will soon require a commercial license for some usage.**
&nbsp;  

##### This has sparked interest in **alternatives** - and one name stands out: [Wolverine](https://wolverinefx.net/).
&nbsp;  

##### Wolverine is a high-performance .NET library for CQRS, messaging, and background processing. Built with source generators, it replaces MediatR and adds advanced features like retries, scheduling, sagas, and outbox support.

&nbsp;  

##### Wolverine is more than just a drop-in replacement for MediatR. It offers:
&nbsp;  

##### • Faster performance via source generators
##### • Built-in message bus for local or distributed messaging
##### • Scheduling, retries, and durable outbox support
##### • Native saga/workflow orchestration
##### • Seamless integration with minimal APIs
##### In this article, we'll build a complete User CRUD API using Wolverine to show how clean and scalable your app architecture can be. 
&nbsp;  

##### Let's start!

&nbsp;  
&nbsp;  
### What We’re Building
&nbsp;  
&nbsp;  
##### We’ll build a minimal API to:
&nbsp;  

##### • Create a new user
##### • Read a user by ID
##### • Update an existing user
##### • Delete a user
&nbsp;  

##### Each operation will be implemented using a command or query object and handled by Wolverine, keeping everything decoupled, testable, and clean.

&nbsp;  
&nbsp;  
### Step 1: Define the User Model
&nbsp;  
&nbsp;  

```csharp

public record User(Guid Id, string Name, string Email);
```

##### And to simulate persistence:

```csharp

public static class InMemoryUsers
{
    public static readonly List<User> Users = new();
}
```

&nbsp;  
&nbsp;  
### Step 2: Create Commands & Queries
&nbsp;  
&nbsp;  

##### Each action gets its own request model:

```csharp

public record CreateUser(string Name, string Email);
public record GetUser(Guid Id);
public record UpdateUser(Guid Id, string Name, string Email);
public record DeleteUser(Guid Id);
```

&nbsp;  
&nbsp;  
### Step 3: Implement Handlers
&nbsp;  
&nbsp;  
##### Wolverine automatically discovers your handler classes and routes messages based on method name and parameter types.
&nbsp;  
##### CreateUserHandler:


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
&nbsp;  

##### GetUserHandler:
```csharp

public class GetUserHandler
{
    public User? Handle(GetUser query)
    {
        return InMemoryUsers.Users.FirstOrDefault(u => u.Id == query.Id);
    }
}
```
&nbsp;  
##### UpdateUserHandler:
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
&nbsp; 
##### DeleteUserHandler:

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

&nbsp;  
&nbsp;  
### Step 4: Configure Minimal API with Wolverine
&nbsp;  
&nbsp;  

##### **• Registers message handlers automatically**
##### Wolverine scans your assembly for any class with Handle or HandleAsync methods that match a message type (like CreateUser, UpdateUser, etc.), and registers them.
&nbsp;  

##### **• Adds IMessageBus to DI**
##### This makes IMessageBus available throughout your app — including in minimal API endpoints, services, background workers, etc.
&nbsp;  

##### **• Enables Wolverine middleware & extensions**
##### Wolverine hooks into the app pipeline and optionally enables:
##### - Retry policies
##### -Message scheduling
##### -Outbox/durable messaging
##### -Background jobs
&nbsp;  

##### **• Starts the internal runtime engine**
##### Wolverine spins up an internal messaging engine to manage local + external message routing (e.g. RabbitMQ, Kafka) if configured.

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
&nbsp;  

##### ***await bus.InvokeAsync<User>(request);***
&nbsp;  

##### What’s happening:
##### • request is a command (e.g. CreateUser)
##### • InvokeAsync<TResponse>(...) means: "Send this command to Wolverine and give me back a result of type TResponse — in this case, a User"
&nbsp;  

##### Behind the scenes:
##### 1. Wolverine receives the CreateUser command.
##### 2. It finds the appropriate handler method with this signature: ***public User Handle(CreateUser command)***
##### 3. It invokes that method.
##### 4. It returns the result back to you as a User.
&nbsp;  

##### Note: With Wolverine, you **don’t need to implement any interfaces like** IRequest<T> or IRequestHandler<TRequest, TResponse> to define your message or handler.

&nbsp;  
&nbsp;  
### Bonus: Wolverine Is More Than Just MediatR
&nbsp;  
&nbsp;  

##### Here’s what Wolverine gives you beyond MediatR:
&nbsp;  

##### **- Built-in Messaging System**
##### Supports:
##### • In-memory messaging (like MediatR)
##### • Distributed messaging with RabbitMQ, Azure Service Bus, Kafka, and more
&nbsp;  

##### **- Background Jobs & Scheduling**
##### You can schedule messages to run later.
&nbsp;  

##### **- Durable Outbox Pattern**
##### With built-in support for persistence, Wolverine can safely queue outgoing messages for reliable delivery - no need to hand-roll the outbox pattern.
&nbsp;  

##### **- Sagas & Workflows**
##### Easily orchestrate multi-step, long-running workflows with built-in Saga support.

&nbsp;  
&nbsp;  
### Wrapping Up
&nbsp;  
&nbsp;  

##### If you're building clean APIs, CQRS-based services, or microservices, **Wolverine offers a powerful alternative to MediatR**. It keeps your code lean and testable while unlocking features like:
&nbsp;  

##### • Distributed messaging
##### • Scheduling and retries
##### • Saga orchestration
##### • Source-generated performance
&nbsp;  

##### Now that MediatR is transitioning to a commercial model, Wolverine becomes an even more compelling choice for greenfield projects and modern architecture.
&nbsp;  

##### 🙌 Why I Still Respect MediatR’s New Direction
&nbsp;  

##### While this article showcases Wolverine, I want to take a moment to acknowledge and support the decision behind MediatR’s upcoming commercial licensing.
##### • Both maintainers - especially [Jimmy Bogard](https://www.jimmybogard.com/) — have contributed over a decade of free value to the .NET community.
##### • This change didn’t come hastily - it was clearly communicated and thoughtfully planned.
##### • Most importantly:
##### ✅ Existing versions remain open source
##### ✅ Security patches will still be delivered
##### ✅ Paid licenses help ensure sustainability
&nbsp;  

##### Let’s be honest here: **writing and maintaining libraries like MediatR from scratch would cost your team far more than the license fees.** 
&nbsp;  

##### Paying for quality tools is a small price to support the people who make our daily development lives better.
&nbsp;  

##### So yes - explore Wolverine for its exciting feature set. 

&nbsp;  
##### But also respect the path MediatR is taking. We’re lucky to have both options in the .NET ecosystem.
&nbsp;  

##### That's all from me today. 
&nbsp;  
 
##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->