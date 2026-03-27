---
title: "Top 5 Mistakes Developers Make When Building APIs (and How to Avoid Them)"
subtitle: "Let’s be honest: Building APIs sounds easy… until you have to maintain them."
date: "Apr 29 2025"
category: "APIs"
readTime: "Read Time: 4 minutes"
meta_description: "The 5 most common mistakes developers make when building APIs - and how you can avoid falling into these traps"
---

<!--START-->
🚀 Coming Soon: Enforcing Code Style
A brand-new course is launching soon inside [The CodeMan Community](https://www.skool.com/thecodeman)!

Join now to lock in early access when it drops - plus get everything else already inside the group.

Founding Member Offer:
• First 100 members get in for **just $4/month** - *70 spots already taken*!
• Or subscribe for **3 months ($12) or annually ($40)** to unlock full access when the course goes live.
Get ahead of the game -  and make clean, consistent code your superpower.
[Join here](https://www.skool.com/thecodeman)

## Background
Let’s be honest:

Building APIs sounds easy… until you have to maintain them.

I've seen beautifully-coded APIs crash and burn simply because of tiny decisions made early on - things you don't even notice until your API is under real-world pressure.

Let’s break down **the 5 most common mistakes developers make** when building APIs - and how you can avoid falling into these traps, with real .NET 9 examples along the way.

## 1. Poor or Missing Input Validation
The Mistake:

Trusting that clients will always send valid data.

Reality:

If you don’t validate input properly, your API becomes vulnerable to bugs, crashes, and even security risks.

Bad Example (Before - Trusting Input):

```csharp
app.MapPost("/users", async (UserDto user) =>
{
    // Assuming user.Name and user.Email are always provided...
    var newUser = new User { Name = user.Name, Email = user.Email };
    await dbContext.Users.AddAsync(newUser);
    await dbContext.SaveChangesAsync();
    return Results.Ok();
});
```

*Note: Don't put logic and database call directly in controllers/endpoints.*

Problem:

• No checks for null/empty fields.
• No format validation (like for Email).
• No business rules applied (like min/max lengths).

Better Example (After - Defensive API Design):

```csharp
app.MapPost("/users", async (UserDto user) =>
{
    if (string.IsNullOrWhiteSpace(user.Name) || string.IsNullOrWhiteSpace(user.Email))
        return Results.BadRequest("Name and Email are required.");

    if (!user.Email.Contains("@"))
        return Results.BadRequest("Invalid email format.");

    var newUser = new User { Name = user.Name.Trim(), Email = user.Email.Trim() };
    await dbContext.Users.AddAsync(newUser);
    await dbContext.SaveChangesAsync();
    return Results.Ok(newUser);
});
```

Or even better? Use FluentValidation or a custom ValidatorService to avoid cluttering your endpoints!

Why It’s Important:

• Protects your database integrity.
• Makes client-side debugging easier ("BadRequest" vs "500 error").
• Saves your backend from mysterious errors later.

## 2. Not Versioning Your APIs

The Mistake:

Releasing APIs with no version control because "we’ll fix it later."

Reality:

*You will need* to change APIs.
And when you do, you’ll regret not planning for versions.

Bad Example (Before - No Versioning):

```csharp
app.MapGet("/products", () =>
{
    // returns products
});
```

Problem:

When your response structure changes, older clients break immediately.

Better Example (After - Versioned API):

```csharp
app.MapGroup("/api/v1")
    .MapGet("/products", () =>
    {
        // returns products v1
    });

app.MapGroup("/api/v2")
    .MapGet("/products", () =>
    {
        // returns products v2 with improvements
    });
```

Or using .RequireHost() for different subdomains if you want real-world production scaling.

Why It’s Important:

• You can deploy improvements without breaking existing apps.
• Gives your team breathing room to phase out old clients cleanly.

## 3. Confusing or Incorrect Status Codes

The Mistake:

Returning 200 OK for *everything* — even when things fail.

Reality:

HTTP status codes exist for a reason: communication.

Bad Example (Before - Everything is OK):

```csharp
return Results.Ok("User not found.");
```
Problem:

Client sees 200. But the user doesn’t exist. Confusing! Now they have to parse the message string. Bad practice.

Better Example (After - Correct Status Codes):
```csharp
var user = await dbContext.Users.FindAsync(id);
if (user is null)
    return Results.NotFound($"User with id {id} not found.");

return Results.Ok(user);
```

Use:

• 400 BadRequest → Bad input
• 401 Unauthorized → Not logged in
• 403 Forbidden → No access
• 404 Not Found → No such resource
• 500 Internal Server Error → Something broke on server

Why It’s Important:

• Clients can react programmatically (retry, redirect, show error, etc).
• Your API behaves like a good citizen on the internet.
## 4. Overcomplicating the Response Models

The Mistake:

Returning entire database entities or gigantic nested models.

Reality:

Clients usually need a small slice of data, not your entire database schema.

Bad Example (Before - Entity Dumping):

```csharp
app.MapGet("/orders", async (DbContext db) =>
{
    var orders = await db.Orders.ToListAsync();
    return Results.Ok(orders);
});
```
Problem:
• Leaks internal database structure.
• Might expose sensitive fields accidentally.
• Causes huge payloads = slow APIs.

Better Example (After - DTO Mapping):

```csharp
app.MapGet("/orders", async (DbContext db) =>
{
    var orders = await db.Orders
        .Select(order => new
        {
            order.Id,
            order.CustomerName,
            order.TotalAmount,
            order.OrderDate
        })
        .ToListAsync();

    return Results.Ok(orders);
});
```
Why It’s Important:

• You control exactly what data leaves your server.
• Smaller, faster responses = happier users and better SEO.
• Less security risk if your model changes later.

## 5. No Centralized Error Handling

The Mistake:

Scattering try-catch blocks randomly, or worse, letting unhandled exceptions bubble up.

Reality:

You need **one single plac**e to handle unexpected errors cleanly.

Bad Example (Before - Scattered Try-Catch):

```csharp
try
{
    var user = await dbContext.Users.FindAsync(id);
    return Results.Ok(user);
}
catch (Exception ex)
{
    return Results.Problem(ex.Message);
}
```

Problem:
• Code duplication.
• Inconsistent error responses.
• Hard to log properly.

Better Example (After - Global Exception Handling Middleware):

```csharp
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new
        {
            Error = "Something went wrong. Please try again later."
        });
    });
});
```

Or even better?
Use **[ProblemDetails](https://thecodeman.net/posts/better-error-handling-with-problemdetails) (application/problem+json)** in .NET 9 automatically via Problem() responses.

Why It’s Important:
• Cleaner code.
• Standard error messages for all clients.
• Easier to plug in logging (Serilog, [OpenTelemetry](https://thecodeman.net/posts/getting-started-with-opentelemetry), etc).

But here's the thing:

I’m not advising you to use exceptions as your primary way of handling errors.

Instead, if you’re building new APIs today, **[strongly consider the Result pattern](https://thecodeman.net/posts/better-error-handling-with-result-object)** (like Result<T>, OneOf, etc.).

That way you explicitly return success/failure results without relying on exceptions at all.

Exceptions should be for exceptional, truly unexpected cases - not regular validation errors.

That said, if your project (or your team) already uses exceptions, the next best thing is **centralizing** how you handle them.

If you’re curious, here’s a super simple Result-style error handling:

```csharp
public record Result<T>(bool IsSuccess, T? Value, string? ErrorMessage);

app.MapGet("/users/{id}", async (Guid id, DbContext db) =>
{
    var user = await db.Users.FindAsync(id);

    if (user is null)
        return Results.NotFound(new Result<User>(false, null, "User not found"));

    return Results.Ok(new Result<User>(true, user, null));
});
```

## Bonus

If you're serious about building clean, real-world RESTful APIs in .NET - the way we discussed throughout this post - I highly recommend checking out the new **Pragmatic RESTful APIs in .NET course** by **Milan Jovanovic**.

This isn't a sponsored recommendation - it's genuinely the best material I've seen on the topic.

You’ll even get a discount through my affiliate link. 
Highly worth it if you want to take your API skills to the next level!

**[Check it out here](https://www.courses.milanjovanovic.tech/a/aff_9044l6t3/external?affcode=1486372_ocagegla)**.


For building better APIs, check out [API Versioning](https://thecodeman.net/posts/why-do-you-need-api-versioning), [Rate Limiting](https://thecodeman.net/posts/how-to-implement-rate-limiter-in-csharp), and [API Key Authentication](https://thecodeman.net/posts/how-to-implement-api-key-authentication).

## Wrapping Up

APIs aren't just about "sending data back and forth."
**APIs are contracts**.
**APIs are promises**.

When you build APIs defensively - with good validation, versioning, error handling, and thoughtful responses - you're making a promise to your clients (and your future self) that your system will be **reliable** and **predictable**.

Even small improvements in your API hygiene now can save you dozens (or hundreds) of hours later.

That's all from me today. 
 
P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->


