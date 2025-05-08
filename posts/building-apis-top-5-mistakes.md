---
title: "Top 5 Mistakes Developers Make When Building APIs (and How to Avoid Them)"
subtitle: "Let’s be honest: Building APIs sounds easy… until you have to maintain them."
readTime: "Read Time: 4 minutes"
date: "Apr 29 2025"
photoUrl: "/images/blog/newsletter21.png"
category: "APIs"
meta_description: "The 5 most common mistakes developers make when building APIs - and how you can avoid falling into these traps"
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
### Background
&nbsp;  
&nbsp;  
##### Let’s be honest:
&nbsp;  

##### **Building APIs sounds easy… until you have to maintain them.**
&nbsp;  

##### I've seen beautifully-coded APIs crash and burn simply because of tiny decisions made early on - things you don't even notice until your API is under real-world pressure.
&nbsp;  

##### Let’s break down **the 5 most common mistakes developers make** when building APIs - and how you can avoid falling into these traps, with real .NET 9 examples along the way.

&nbsp;  
&nbsp;  
### 1. Poor or Missing Input Validation
&nbsp;  
&nbsp;  
##### **The Mistake:**
&nbsp;  

##### Trusting that clients will always send valid data.
&nbsp;  

##### **Reality:**
&nbsp;  

##### If you don’t validate input properly, your API becomes vulnerable to bugs, crashes, and even security risks.
&nbsp;  

##### **Bad Example (Before - Trusting Input):**

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

&nbsp;  

##### *Note: Don't put logic and database call directly in controllers/endpoints.*
&nbsp;  

##### **Problem:**
&nbsp;  

##### • No checks for null/empty fields.
##### • No format validation (like for Email).
##### • No business rules applied (like min/max lengths).
&nbsp;  

##### **Better Example (After - Defensive API Design):**

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
&nbsp;  

##### Or even better? Use FluentValidation or a custom ValidatorService to avoid cluttering your endpoints!
&nbsp;  

##### **Why It’s Important:**
&nbsp;  

##### • Protects your database integrity.
##### • Makes client-side debugging easier ("BadRequest" vs "500 error").
##### • Saves your backend from mysterious errors later.

&nbsp;  
&nbsp;  
### 2. Not Versioning Your APIs
&nbsp;  
&nbsp;  

##### **The Mistake:**
&nbsp;  

##### Releasing APIs with no version control because "we’ll fix it later."
&nbsp;  

##### **Reality:**
&nbsp;  

##### *You will need* to change APIs.
##### And when you do, you’ll regret not planning for versions.
&nbsp;  

##### **Bad Example (Before - No Versioning):**

```csharp

app.MapGet("/products", () =>
{
    // returns products
});

```
&nbsp;  

##### **Problem:**
&nbsp;  

##### When your response structure changes, older clients break immediately.
&nbsp;  

##### **Better Example (After - Versioned API):**

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
&nbsp;  

##### Or using .RequireHost() for different subdomains if you want real-world production scaling.
&nbsp;  

##### Why It’s Important:
&nbsp;  

##### • You can deploy improvements without breaking existing apps.
##### • Gives your team breathing room to phase out old clients cleanly.

&nbsp;  
&nbsp;  
### 3. Confusing or Incorrect Status Codes
&nbsp;  
&nbsp;  

##### **The Mistake:**
&nbsp;  

##### Returning 200 OK for *everything* — even when things fail.
&nbsp;  

##### **Reality:**
&nbsp;  

##### HTTP status codes exist for a reason: communication.
&nbsp;  

##### **Bad Example (Before - Everything is OK):**

```csharp

return Results.Ok("User not found.");
```
&nbsp;  
##### **Problem:**
&nbsp;  

##### Client sees 200. But the user doesn’t exist. Confusing! Now they have to parse the message string. Bad practice.
&nbsp;  

##### **Better Example (After - Correct Status Codes):**
```csharp

var user = await dbContext.Users.FindAsync(id);
if (user is null)
    return Results.NotFound($"User with id {id} not found.");

return Results.Ok(user);
```
&nbsp;  

##### Use:
&nbsp;  

##### • 400 BadRequest → Bad input
##### • 401 Unauthorized → Not logged in
##### • 403 Forbidden → No access
##### • 404 Not Found → No such resource
##### • 500 Internal Server Error → Something broke on server
&nbsp;  

##### Why It’s Important:
&nbsp;  

##### • Clients can react programmatically (retry, redirect, show error, etc).
##### • Your API behaves like a good citizen on the internet.
&nbsp;  
&nbsp;  
### 4. Overcomplicating the Response Models
&nbsp;  
&nbsp;  

##### **The Mistake:**
&nbsp;  

##### Returning entire database entities or gigantic nested models.
&nbsp;  

##### **Reality:**
&nbsp;  

##### Clients usually need a small slice of data, not your entire database schema.
&nbsp;  

##### **Bad Example (Before - Entity Dumping):**

```csharp

app.MapGet("/orders", async (DbContext db) =>
{
    var orders = await db.Orders.ToListAsync();
    return Results.Ok(orders);
});
```
&nbsp; 
##### Problem:
&nbsp;  
##### • Leaks internal database structure.
##### • Might expose sensitive fields accidentally.
##### • Causes huge payloads = slow APIs.
&nbsp; 

##### **Better Example (After - DTO Mapping):**

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
&nbsp;  
##### **Why It’s Important:**
&nbsp;  

##### • You control exactly what data leaves your server.
##### • Smaller, faster responses = happier users and better SEO.
##### • Less security risk if your model changes later.

&nbsp;  
&nbsp;  
### 5. No Centralized Error Handling
&nbsp;  
&nbsp;  

##### **The Mistake:**
&nbsp;  

##### Scattering try-catch blocks randomly, or worse, letting unhandled exceptions bubble up.
&nbsp;  

##### **Reality:**
&nbsp;  

##### You need **one single plac**e to handle unexpected errors cleanly.
&nbsp;  

##### **Bad Example (Before - Scattered Try-Catch):**

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
&nbsp;  

##### **Problem:**
&nbsp;  
##### • Code duplication.
##### • Inconsistent error responses.
##### • Hard to log properly.
&nbsp;  

##### **Better Example (After - Global Exception Handling Middleware):**

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
&nbsp;  

##### Or even better?
##### Use **ProblemDetails (application/problem+json)** in .NET 9 automatically via Problem() responses.
&nbsp;  

##### **Why It’s Important:**
&nbsp;  
##### • Cleaner code.
##### • Standard error messages for all clients.
##### • Easier to plug in logging (Serilog, OpenTelemetry, etc).
&nbsp;  

##### But here's the thing:
&nbsp;  

##### I’m not advising you to use exceptions as your primary way of handling errors.
&nbsp;  

##### Instead, if you’re building new APIs today, **[strongly consider the Result pattern](https://thecodeman.net/posts/better-error-handling-with-result-object)** (like Result<T>, OneOf, etc.).
&nbsp;  

##### That way you explicitly return success/failure results without relying on exceptions at all.
&nbsp;  

##### **Exceptions should be for exceptional, truly unexpected cases - not regular validation errors.**
&nbsp;  

##### That said, if your project (or your team) already uses exceptions, the next best thing is **centralizing** how you handle them.
&nbsp;  

##### If you’re curious, here’s a super simple Result-style error handling:

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

&nbsp;  
&nbsp;  
### Bonus
&nbsp;  
&nbsp;  

##### If you're serious about building clean, real-world RESTful APIs in .NET - the way we discussed throughout this post - I highly recommend checking out the new **Pragmatic RESTful APIs in .NET course** by **Milan Jovanovic**.
&nbsp;  

##### This isn't a sponsored recommendation - it's genuinely the best material I've seen on the topic.
&nbsp;  

##### You’ll even get a discount through my affiliate link. 
##### Highly worth it if you want to take your API skills to the next level!
&nbsp;  

##### **[Check it out here](https://www.courses.milanjovanovic.tech/a/aff_9044l6t3/external?affcode=1486372_ocagegla)**.

&nbsp;  
&nbsp;  
### Wrapping Up
&nbsp;  
&nbsp;  

##### APIs aren't just about "sending data back and forth."
##### **APIs are contracts**.
##### **APIs are promises**.

##### When you build APIs defensively - with good validation, versioning, error handling, and thoughtful responses - you're making a promise to your clients (and your future self) that your system will be **reliable** and **predictable**.

##### Even small improvements in your API hygiene now can save you dozens (or hundreds) of hours later.
&nbsp;  

##### That's all from me today. 
&nbsp;  
 
##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->