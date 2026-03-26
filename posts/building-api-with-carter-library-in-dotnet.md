---
title: "Building API with Carter Library in .NET"
subtitle: "Let’s be honest: writing APIs with controllers in .NET can feel... heavy. Sure, Minimal APIs were a breath of fresh air when they landed. But once your app grows? "
date: "May 26 2025"
category: "APIs"
readTime: "Read Time: 4 minutes"
meta_description: "Carter is basically Minimal APIs on steroids. It lets you organize routes by feature using small modular classes. "
---

<!--START-->
🚀 Coming Soon: Enforcing Code Style
 
A brand-new course is launching soon inside [The CodeMan Community](https://www.skool.com/thecodeman)!
 
Join now to lock in early access when it drops - plus get everything else already inside the group.
 
Founding Member Offer:
• First 100 members get in for just $4/month - 80 spots already taken!
• Or subscribe for 3 months ($12) or annually ($40) to unlock full access when the course goes live.
 
Get ahead of the game - and make clean, consistent code your superpower.
[Join here](https://www.skool.com/thecodeman)

## Background
Let’s be honest: writing APIs with controllers in .NET can feel... heavy.

Sure, Minimal APIs were a breath of fresh air when they landed. But once your app grows? 

Your Program.cs turns into a giant spaghetti of MapGet, MapPost, and “where the heck is that route?” chaos.

That’s where [Carter](https://github.com/CarterCommunity/Carter) steps in.

Carter gives you a super clean, modular way to write Minimal APIs - while keeping everything fast, testable, and organized.

Let me walk you through how to build a complete Carter-based API with proper validation, services, and even a touch of [Swagger](https://thecodeman.net/posts/3-tips-to-elevate-swagger-ui).

## What is Carter?
Carter is basically **Minimal APIs on steroids**.
It lets you organize routes by feature using small modular classes. Instead of one giant Program.cs, each feature lives in its own file - and Carter wires it all up for you.
What you get:
• Minimal APIs with clean structure
• Built-in support for FluentValidation
• Native dependency injection
• Works perfectly with Swagger and unit tests

## Project Structure

Here’s the setup we’ll use:
![Project Structure](/images/blog/posts/building-api-with-carter-library-in-dotnet/project-structure.png)
Each feature gets its own module, model, validator, and service. It’s simple and scales well.

## Setting Things Up

1. Install the NuGet packages:

```csharp

dotnet add package Carter
dotnet add package FluentValidation
dotnet add package FluentValidation.DependencyInjectionExtensions
```
2. Configure Carter in Program.cs

```csharp

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCarter();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateUserValidator>();

var app = builder.Build();

app.MapCarter();

app.Run();
```

## Data/Model

Create the User Model and the DTO for incoming data

```csharp

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public record CreateUserRequest(string Name, string Email);
```
Add Validation with FluentValidation

```csharp

// Validators/CreateUserValidator.cs
using FluentValidation;

public class CreateUserValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required");
        RuleFor(x => x.Email).EmailAddress().WithMessage("Invalid email format");
    }
}
```

## Set Up a Simple User Service

This keeps your logic out of the route definitions.
Interface:

```csharp

public interface IUserService
{
    IEnumerable<User> GetAllUsers();
    User? GetUserById(int id);
    User CreateUser(CreateUserRequest request);
}
```
Implementation:

```csharp

public class UserService : IUserService
{
    private readonly List<User> _users =
    [
        new User { Id = 1, Name = "Alice", Email = "alice@example.com" },
        new User { Id = 2, Name = "Bob", Email = "bob@example.com" }
    ];

    public List<User> GetAllUsers()
    {
        return _users;
    }

    public User? GetUserById(int id)
    {
        return _users.FirstOrDefault(u => u.Id == id);
    }

    public User CreateUser(CreateUserRequest request)
    {
        var user = new User
        {
            Id = _users.Max(u => u.Id) + 1,
            Name = request.Name,
            Email = request.Email
        };

        _users.Add(user);

        return user;
    }
}
```

## Create the Carter Module

Here’s where the routing magic happens.

```csharp

public class UserModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/users", (IUserService userService) =>
        {
            var users = userService.GetAllUsers();
            return Results.Ok(users);
        });

        app.MapGet("/users/{id:int}", (int id, IUserService userService) =>
        {
            var user = userService.GetUserById(id);
            return user is null ? Results.NotFound("User not found") : Results.Ok(user);
        });

        app.MapPost("/users", async (
            HttpRequest req,
            IUserService userService,
            IValidator<CreateUserRequest> validator) =>
        {
            var userRequest = await req.ReadFromJsonAsync<CreateUserRequest>();
            if (userRequest is null)
                return Results.BadRequest("Invalid request payload");

            ValidationResult validationResult = await validator.ValidateAsync(userRequest);
            if (!validationResult.IsValid)
                return Results.BadRequest(validationResult.Errors);

            var newUser = userService.CreateUser(userRequest);
            return Results.Created($"/users/{newUser.Id}", newUser);
        });
    }
}
```
In Carter, instead of writing all your route handlers in Program.cs, you define them inside **classes that implement ICarterModule**. 

These classes represent a group of related routes - typically per feature (like “Users”).

The Carter framework will **automatically discover and register** all modules at startup (when you call app.MapCarter() in Program.cs).

## MapGroup

MapGroup("/users") creates a **route group** — a way to group multiple endpoints under a common URL prefix (in this case /users).
This makes your code:
• **Cleaner** — You don’t repeat the /users prefix for every route.
• **Organized** — Groups related endpoints logically.
• **More powerful** — You can apply filters (auth, validation, etc.) to the whole group later.

```csharp

var group = app.MapGroup("/users");

group.MapGet("/", (IUserService service) =>
    Results.Ok(service.GetAllUsers()));

group.MapGet("/{id:int}", (int id, IUserService service) =>
{
    var user = service.GetUserById(id);
    return user is null ? Results.NotFound() : Results.Ok(user);
});
```

## Advanced Endpoint Configuration
Once you've set up your Carter-based API and it's working like a charm, you might wonder: 

*"How do I make my routes more discoverable in Swagger? How do I group them? How can I prefix everything under /api without repeating myself?"*

Carter has you covered with its advanced configuration capabilities - especially when using the CarterModule base class.

```csharp

public UserModule()
    : base("/api") // All endpoints will be prefixed with /api
{
    WithTags("Users");        // Swagger/OpenAPI tag for this module
    IncludeInOpenApi();         // Automatically include all endpoints in Swagger
}
```


Also check out [Building Clean Minimal APIs with Carter](https://thecodeman.net/posts/building-clean-minimal-api-with-carter).

## Wrapping Up

As you've seen, Carter doesn't just make routing modular - it also makes it smartly configurable.

By inheriting from CarterModule, you can add route prefixes, tag your endpoints for better Swagger organization, and automatically include everything in your API docs without extra clutter. 

It's a simple upgrade that brings a ton of polish to your API.
Whether you're building a small internal tool or a large public-facing API, these small touches go a long way in keeping your code clean, your docs clear, and your life easier.

So the next time you’re setting up a new Carter module, remember:
• Use base("/api") to avoid repeating yourself
• Group routes with WithTags()
• Let Swagger handle the docs with IncludeInOpenApi()

It's minimal effort for maximum structure. 

[Download code here](https://github.com/StefanTheCode/CarterApiDemo) (give it a start :) ).

That's all from me today. 

 
P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->

