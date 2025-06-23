---
title: "Better Error Handling in .NET using ProblemDetails"
subtitle: "Let’s be honest - error handling is usually the last thing we think about when building APIs. But it should be one of the first."
readTime: "Read Time: 3 minutes"
date: "June 23 2025"
category: ".NET"
meta_description: "ProblemDetails is a standard way of returning error responses in APIs, defined in RFC 7807."
---

<!--START-->
##### JetBrains is bringing the power of ReSharper to Visual Studio Code! Here’s your chance to influence its future – [join the public preview](https://jb.gg/rs-vsc-thecodeman-newsletter) to get early access, test powerful new tools, and share your feedback directly with the development team. 
&nbsp;
##### [Join now](https://jb.gg/rs-vsc-thecodeman-newsletter)
&nbsp;

&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  
##### Let’s be honest - error handling is usually the last thing we think about when building APIs. But it should be one of the first.
&nbsp;  

##### Imagine this:
##### Your frontend calls an API, and gets this in return:
&nbsp;  

##### "Object reference not set to an instance of an object."
&nbsp;  

##### Not helpful.
&nbsp;  

##### Now imagine getting this instead:
```json

{
    "title": "Something went wrong",
    "status": 500,
    "detail": "Please contact support.",
    "instance": "/products/0"
}
```
##### Now that’s helpful and clean. And that’s exactly what ProblemDetails gives us.


&nbsp;  
&nbsp;  
###  What is ProblemDetails?
&nbsp;  
&nbsp; 

##### It’s a **standard way** of returning error responses in APIs, defined in [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807). Instead of random text or inconsistent JSON, you return structured errors like this:


```json

{
    "title": "Product not found",
    "status": 404,
    "detail": "No product with ID 42.",
    "instance": "/products/42"
}
```
##### ASP.NET has built-in support for this - and it works great with Minimal APIs too.

&nbsp;  
&nbsp;  
### Let’s Build It with Minimal API
&nbsp;  
&nbsp;  

##### We’ll create a simple Web API where you can:
##### • Get a product by ID
##### • Return errors using ProblemDetails
##### • Handle exceptions globally
&nbsp;  

##### All using Minimal API style.
&nbsp;  

#### 1: Define the Product Logic
&nbsp;  

##### Let’s fake a product lookup that throws an error if the ID is invalid or not found.

```csharp

public record Product(int Id, string Name);
```
&nbsp;  

#### 2: Add Global Error Handling Middleware
&nbsp;  
##### We’ll catch all unhandled exceptions and return a structured ProblemDetails response.

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

#### 4: Wire Everything Up in Program.cs
&nbsp;  
##### This is where Minimal API really shines - everything in one file:

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

##### Then try:
##### • ✅ GET /products/1 - returns product
##### • ❌ GET /products/0 - throws exception → returns 500 ProblemDetails
##### • ❌ GET /products/999 - returns 404 ProblemDetails

&nbsp;  
&nbsp;  
### Optional: Add Custom Fields
&nbsp;  
&nbsp;  

##### You can extend ProblemDetails with your own data:

```csharp

public class CustomProblemDetails : ProblemDetails
{
    public string ErrorCode { get; set; } = default!;
}
```
##### Then return it with Results.Problem(...) and pass additional metadata.

&nbsp;  
&nbsp;  
### Benefits of This Approach
&nbsp;  
&nbsp;  

##### • Clean error responses
##### • Easy to understand for frontend devs
##### • Standards-based (RFC 7807)
##### • Built into .NET 
&nbsp;  

&nbsp;  
&nbsp;  
### Wrapping Up
&nbsp;  
&nbsp;  

##### Never return ex.ToString() to the user - it may leak sensitive info.
&nbsp;  

##### ✅Log full exception
##### ❌Show minimal, generic details in the API response
&nbsp;  

##### With just a few lines of code, you now have a Minimal API that returns beautif
&nbsp;  

##### That's all from me today. 

&nbsp;  
 
##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->