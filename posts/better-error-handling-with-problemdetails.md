---
title: "Better Error Handling in .NET using ProblemDetails"
subtitle: "Let’s be honest - error handling is usually the last thing we think about when building APIs. But it should be one of the first."
date: "June 23 2025"
category: ".NET"
readTime: "Read Time: 3 minutes"
meta_description: "ProblemDetails is a standard way of returning error responses in APIs, defined in RFC 7807."
---

<!--START-->
JetBrains is bringing the power of ReSharper to Visual Studio Code! Here’s your chance to influence its future – [join the public preview](https://jb.gg/rs-vsc-thecodeman-newsletter) to get early access, test powerful new tools, and share your feedback directly with the development team. 
[Join now](https://jb.gg/rs-vsc-thecodeman-newsletter)

## Background
Let’s be honest - error handling is usually the last thing we think about when building APIs. But it should be one of the first.

Imagine this:
Your frontend calls an API, and gets this in return:

"Object reference not set to an instance of an object."

Not helpful.

Now imagine getting this instead:
```json
{
    "title": "Something went wrong",
    "status": 500,
    "detail": "Please contact support.",
    "instance": "/products/0"
}
```
Now that’s helpful and clean. And that’s exactly what ProblemDetails gives us.

##  What is ProblemDetails?

It’s a **standard way** of returning error responses in APIs, defined in [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807). Instead of random text or inconsistent JSON, you return structured errors like this:

```json
{
    "title": "Product not found",
    "status": 404,
    "detail": "No product with ID 42.",
    "instance": "/products/42"
}
```
ASP.NET has built-in support for this - and it works great with Minimal APIs too.

## Let’s Build It with Minimal API

We’ll create a simple Web API where you can:
- Get a product by ID
- Return errors using ProblemDetails
- Handle exceptions globally

All using Minimal API style.

### 1: Define the Product Logic

Let’s fake a product lookup that throws an error if the ID is invalid or not found.

```csharp
public record Product(int Id, string Name);
```

### 2: Add Global Error Handling Middleware
We’ll catch all unhandled exceptions and return a structured ProblemDetails response.

```csharp
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred");

            var problem = new ProblemDetails
            {
                Title = "An unexpected error occurred.",
                Status = StatusCodes.Status500InternalServerError,
                Detail = "Please contact support.",
                Instance = context.Request.Path
            };

            context.Response.ContentType = "application/problem+json";
            context.Response.StatusCode = problem.Status.Value;

            var json = JsonSerializer.Serialize(problem);
            await context.Response.WriteAsync(json);
        }
    }
}
```

### 4: Wire Everything Up in Program.cs
This is where Minimal API really shines - everything in one file:

```csharp
using Microsoft.AspNetCore.Mvc;
using ProblemDetailsMinimalApi;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Use custom error handling middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

// In-memory data for testing
var products = new List<Product>
{
    new Product(1, "Laptop"),
    new Product(2, "Phone"),
    new Product(3, "Keyboard")
};

// GET /products/{id}
app.MapGet("/products/{id:int}", (int id, HttpContext http) =>
{
    if (id <= 0)
        throw new ArgumentOutOfRangeException(nameof(id), "Product ID must be greater than zero.");

    var product = products.FirstOrDefault(p => p.Id == id);

    if (product is null)
    {
        var notFoundProblem = new ProblemDetails
        {
            Title = "Product not found",
            Status = StatusCodes.Status404NotFound,
            Detail = $"No product found with ID {id}.",
            Instance = http.Request.Path
        };

        return Results.Problem(
            title: notFoundProblem.Title,
            detail: notFoundProblem.Detail,
            statusCode: notFoundProblem.Status,
            instance: notFoundProblem.Instance
        );
    }

    return Results.Ok(product);
});

app.Run();
```

Then try:
- ✅ GET /products/1 - returns product
- ❌ GET /products/0 - throws exception → returns 500 ProblemDetails
- ❌ GET /products/999 - returns 404 ProblemDetails

## Optional: Add Custom Fields

You can extend ProblemDetails with your own data:

```csharp
public class CustomProblemDetails : ProblemDetails
{
    public string ErrorCode { get; set; } = default!;
}
```
Then return it with Results.Problem(...) and pass additional metadata.

## Benefits of This Approach

- Clean error responses
- Easy to understand for frontend devs
- Standards-based (RFC 7807)
- Built into .NET 


Also check out the [Result Object Pattern](https://thecodeman.net/posts/better-error-handling-with-result-object) for a complementary error handling approach.

## Wrapping Up

Never return ex.ToString() to the user - it may leak sensitive info.

- ✅Log full exception
- ❌Show minimal, generic details in the API response

With just a few lines of code, you now have a Minimal API that returns beautif

That's all from me today. 

 
P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

Want to enforce clean code automatically? My [Pragmatic .NET Code Rules](/pragmatic-dotnet-code-rules) course shows you how to set up analyzers, CI quality gates, and architecture tests - a production-ready system that keeps your codebase clean without manual reviews. Or grab the [free Starter Kit](/dotnet-code-rules-starter-kit) to try it out.

<!--END-->
