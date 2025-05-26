---
title: "Building API with Carter Library in .NET"
subtitle: "Let’s be honest: writing APIs with controllers in .NET can feel... heavy. Sure, Minimal APIs were a breath of fresh air when they landed. But once your app grows? "
readTime: "Read Time: 4 minutes"
date: "May 26 2025"
category: ".NET"
meta_description: "Carter is basically Minimal APIs on steroids. It lets you organize routes by feature using small modular classes. "
---

<!--START-->
##### 🚀 Coming Soon: Enforcing Code Style
&nbsp;
 
##### A brand-new course is launching soon inside [The CodeMan Community](https://www.skool.com/thecodeman)!
&nbsp;
 
##### Join now to lock in early access when it drops - plus get everything else already inside the group.
&nbsp;
 
##### Founding Member Offer:
##### • First 100 members get in for just $4/month - 80 spots already taken!
##### • Or subscribe for 3 months ($12) or annually ($40) to unlock full access when the course goes live.
&nbsp;
 
##### Get ahead of the game - and make clean, consistent code your superpower.
&nbsp;
##### [Join here](https://www.skool.com/thecodeman)

&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  
##### Let’s be honest: writing APIs with controllers in .NET can feel... heavy.
&nbsp;  

##### Sure, Minimal APIs were a breath of fresh air when they landed. But once your app grows? 
&nbsp;  

##### Your Program.cs turns into a giant spaghetti of MapGet, MapPost, and “where the heck is that route?” chaos.
&nbsp;  

##### That’s where [Carter](https://github.com/CarterCommunity/Carter) steps in.
&nbsp;  

##### Carter gives you a super clean, modular way to write Minimal APIs - while keeping everything fast, testable, and organized.
&nbsp;  

##### Let me walk you through how to build a complete Carter-based API with proper validation, services, and even a touch of Swagger.

&nbsp;  
&nbsp;  
### What is Carter?
&nbsp;  
&nbsp;  
##### Carter is basically **Minimal APIs on steroids**.
&nbsp;  
##### It lets you organize routes by feature using small modular classes. Instead of one giant Program.cs, each feature lives in its own file - and Carter wires it all up for you.
&nbsp;  
##### What you get:
##### • Minimal APIs with clean structure
##### • Built-in support for FluentValidation
##### • Native dependency injection
##### • Works perfectly with Swagger and unit tests

&nbsp;  
&nbsp;  
### Project Structure
&nbsp;  
&nbsp;  

##### Here’s the setup we’ll use:
![Project Structure](/images/blog/posts/building-api-with-carter-library-in-dotnet/project-structure.png)
&nbsp;  
##### Each feature gets its own module, model, validator, and service. It’s simple and scales well.

&nbsp;  
&nbsp;  
### Setting Things Up
&nbsp;  
&nbsp;  

##### **1. Install the NuGet packages:**

```csharp

dotnet add package Carter
dotnet add package FluentValidation
dotnet add package FluentValidation.DependencyInjectionExtensions
```
&nbsp;  
##### **2. Configure Carter in Program.cs**

```csharp

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCarter();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateUserValidator>();

var app = builder.Build();

app.MapCarter();

app.Run();
```

&nbsp;  
&nbsp;  
### Data/Model
&nbsp;  
&nbsp;  

##### Create the User Model and the DTO for incoming data

```csharp

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public record CreateUserRequest(string Name, string Email);
```
&nbsp;  
##### Add Validation with FluentValidation

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

&nbsp;  
&nbsp;  
### Set Up a Simple User Service
&nbsp;  
&nbsp;  

##### This keeps your logic out of the route definitions.
&nbsp;  
##### Interface:

```csharp

public interface IUserService
{
    IEnumerable<User> GetAllUsers();
    User? GetUserById(int id);
    User CreateUser(CreateUserRequest request);
}
```
&nbsp;  
##### Implementation:

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

&nbsp;  
&nbsp;  
### Create the Carter Module
&nbsp;  
&nbsp;  

##### Here’s where the routing magic happens.

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
&nbsp;  
##### In Carter, instead of writing all your route handlers in Program.cs, you define them inside **classes that implement ICarterModule**. 

##### These classes represent a group of related routes - typically per feature (like “Users”).

##### The Carter framework will **automatically discover and register** all modules at startup (when you call app.MapCarter() in Program.cs).

&nbsp;  
&nbsp;  
### MapGroup
&nbsp;  
&nbsp;  

##### MapGroup("/users") creates a **route group** — a way to group multiple endpoints under a common URL prefix (in this case /users).
&nbsp;  
##### This makes your code:
##### • **Cleaner** — You don’t repeat the /users prefix for every route.
##### • **Organized** — Groups related endpoints logically.
##### • **More powerful** — You can apply filters (auth, validation, etc.) to the whole group later.

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

&nbsp;  
&nbsp;  
### Advanced Endpoint Configuration
&nbsp;  
&nbsp;  
##### Once you've set up your Carter-based API and it's working like a charm, you might wonder: 
&nbsp;  

##### *"How do I make my routes more discoverable in Swagger? How do I group them? How can I prefix everything under /api without repeating myself?"*
&nbsp;  

##### Carter has you covered with its advanced configuration capabilities - especially when using the CarterModule base class.

```csharp

public UserModule()
    : base("/api") // All endpoints will be prefixed with /api
{
    WithTags("Users");        // Swagger/OpenAPI tag for this module
    IncludeInOpenApi();         // Automatically include all endpoints in Swagger
}
```

&nbsp;  
&nbsp;  
### Wrapping Up
&nbsp;  
&nbsp;  

##### As you've seen, Carter doesn't just make routing modular - it also makes it smartly configurable.
&nbsp;  

##### By inheriting from CarterModule, you can add route prefixes, tag your endpoints for better Swagger organization, and automatically include everything in your API docs without extra clutter. 
&nbsp;  

##### It's a simple upgrade that brings a ton of polish to your API.
##### Whether you're building a small internal tool or a large public-facing API, these small touches go a long way in keeping your code clean, your docs clear, and your life easier.
&nbsp;  

##### So the next time you’re setting up a new Carter module, remember:
##### • Use base("/api") to avoid repeating yourself
##### • Group routes with WithTags()
##### • Let Swagger handle the docs with IncludeInOpenApi()
&nbsp;  

##### It's minimal effort for maximum structure. 
&nbsp;  

##### [Download code here](https://github.com/StefanTheCode/CarterApiDemo) (give it a start :) ).
&nbsp;  

##### That's all from me today. 

&nbsp;  
 
##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->