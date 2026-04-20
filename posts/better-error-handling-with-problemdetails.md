---
title: "Better Error Handling in .NET using ProblemDetails"
subtitle: "Let's be honest - error handling is usually the last thing we think about when building APIs. But it should be one of the first."
date: "April 21 2026"
category: ".NET"
readTime: "Read Time: 4 minutes"
meta_description: "ProblemDetails is a standard way of returning error responses in APIs, defined in RFC 9457. Updated for .NET 10."
---

<!--START-->

## Background
Let's be honest - error handling is usually the last thing we think about when building APIs. But it should be one of the first.

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
Now that's helpful and clean. And that's exactly what ProblemDetails gives us.

##  What is ProblemDetails?

It's a **standard way** of returning error responses in APIs, defined in [RFC 9457](https://datatracker.ietf.org/doc/html/rfc9457) (which superseded the original RFC 7807). Instead of random text or inconsistent JSON, you return structured errors like this:

```json
{
    "title": "Product not found",
    "status": 404,
    "detail": "No product with ID 42.",
    "instance": "/products/42"
}
```
ASP.NET has built-in support for this - and it works great with Minimal APIs too.

## Let's Build It with Minimal API

We'll create a simple Web API where you can:
- Get a product by ID
- Return errors using ProblemDetails
- Handle exceptions globally using `IExceptionHandler`

All using Minimal API style in .NET 10.

### 1: Define the Product Logic

Let's fake a product lookup that throws an error if the ID is invalid or not found.

```csharp
public record Product(int Id, string Name);
```

### 2: Register ProblemDetails Services

First, register the built-in ProblemDetails services. This enables automatic ProblemDetails responses across exception handling, status code pages, and more:

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddProblemDetails();
```

### 3: Add Global Error Handling with IExceptionHandler

Since .NET 8, the recommended approach is to use `IExceptionHandler` instead of custom middleware. It integrates directly with the built-in exception handler middleware and gives you full control over the response.

In .NET 10, there's a **breaking change**: when `TryHandleAsync` returns `true`, the middleware **no longer emits diagnostics** (logs, metrics, EventSource events) by default. This means your handler is responsible for its own logging.

```csharp
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Unhandled exception occurred");

        var problemDetails = new ProblemDetails
        {
            Title = "An unexpected error occurred.",
            Status = StatusCodes.Status500InternalServerError,
            Detail = "Please contact support.",
            Instance = httpContext.Request.Path
        };

        httpContext.Response.StatusCode = problemDetails.Status.Value;

        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }
}
```

Register the handler:

```csharp
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
```

**Note on .NET 10 diagnostics behavior:** If you need the middleware to still emit diagnostics for handled exceptions (the .NET 8/9 behavior), you can configure `SuppressDiagnosticsCallback`:

```csharp
app.UseExceptionHandler(new ExceptionHandlerOptions
{
    SuppressDiagnosticsCallback = context => false // always emit diagnostics
});
```

### 4: Wire Everything Up in Program.cs
This is where Minimal API really shines - everything in one file:

```csharp
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

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
        return Results.Problem(
            title: "Product not found",
            detail: $"No product found with ID {id}.",
            statusCode: StatusCodes.Status404NotFound,
            instance: http.Request.Path
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

## .NET 10: StatusCodeSelector

Since .NET 9, you can use `StatusCodeSelector` to map specific exception types to different HTTP status codes automatically:

```csharp
app.UseExceptionHandler(new ExceptionHandlerOptions
{
    StatusCodeSelector = ex => ex switch
    {
        ArgumentOutOfRangeException => StatusCodes.Status400BadRequest,
        TimeoutException => StatusCodes.Status503ServiceUnavailable,
        _ => StatusCodes.Status500InternalServerError
    }
});
```

This works together with `AddProblemDetails()` to produce correctly-typed ProblemDetails responses without any extra code.

## Optional: Add Custom Fields

You can extend ProblemDetails with your own data:

```csharp
public class CustomProblemDetails : ProblemDetails
{
    public string ErrorCode { get; set; } = default!;
}
```
Then return it with Results.Problem(...) and pass additional metadata.

## Optional: Customize All ProblemDetails Globally

You can customize every ProblemDetails response in one place:

```csharp
builder.Services.AddProblemDetails(options =>
{
    options.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier;
    };
});
```

## Benefits of This Approach

- Clean error responses
- Easy to understand for frontend devs
- Standards-based (RFC 9457)
- Built into .NET - no third-party packages needed
- `IExceptionHandler` allows chaining multiple handlers


Also check out the [Result Object Pattern](https://thecodeman.net/posts/better-error-handling-with-result-object) for a complementary error handling approach.

## Wrapping Up

Never return ex.ToString() to the user - it may leak sensitive info.

- ✅ Log full exception
- ❌ Show minimal, generic details in the API response

With just a few lines of code, you now have a Minimal API that returns beautiful, structured error responses following the RFC 9457 standard.

That's all from me today. 

 
P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

Want to enforce clean code automatically? My [Pragmatic .NET Code Rules](/pragmatic-dotnet-code-rules) course shows you how to set up analyzers, CI quality gates, and architecture tests - a production-ready system that keeps your codebase clean without manual reviews. Or grab the [free Starter Kit](/dotnet-code-rules-starter-kit) to try it out.

<!--END-->
