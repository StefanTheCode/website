---
title: "Why You Need API Versioning in ASP.NET Core (.NET 10)"
subtitle: "Your API will need breaking changes. The question is whether you handle them gracefully - or break every client in production. Here's how I set up Minimal API versioning in every .NET 10 project."
date: "Apr 11 2026"
category: ".NET"
readTime: "Read Time: 12 minutes"
meta_description: "Learn how to implement API versioning in ASP.NET Core (.NET 10) using Minimal APIs and Asp.Versioning. Step-by-step guide covering URL segment versioning, Swagger per version, deprecation strategy, header versioning, and production-ready code examples."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">Many thanks to the sponsors who make it possible for this newsletter to be free for readers.<br/><br/><a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a></p>
</div>

## The Background

Let's be honest:

Every API will need a breaking change at some point.

You need to rename a response field. You need to restructure a payload. You need to drop a deprecated property that's been dead weight for months. A partner integration requires a different contract shape.

If you make that change in-place, **clients break**. Mobile apps crash. Frontend dashboards show blank pages. Partner integrations start returning errors at 3 AM.

I've seen this happen. Multiple times. And the fix is always the same conversation: "We should have versioned the API."

**API versioning is how you evolve your API contract without breaking existing consumers.**

In this article, I'll walk you through everything I do when I set up API versioning in a .NET 10 project - with Minimal APIs, full code examples, Swagger configuration per version, deprecation strategy, and the patterns I've settled on after using this in production.

Let's dive in.

## What Is API Versioning?

Before we write code, let me be clear about what we're actually versioning.

An API version represents a **contract**. That contract includes:
<br/>
- Endpoint paths and HTTP methods
<br/>
- Request body schemas (field names, types, required vs. optional)
<br/>
- Response body schemas
<br/>
- Query parameter names and behavior
<br/>
- Status codes and their meaning
<br/>
- Authentication and authorization rules

When any of these change in a way that existing clients can't handle, you have a **breaking change**. And a breaking change needs a new version.

API versioning gives you a way to publish the new contract (v2) while keeping the old one (v1) running - so consumers can migrate on their own schedule instead of yours.

## Why Do You Need API Versioning?

Here's the practical answer:
<br/>
- **Backward compatibility** - your mobile app from 6 months ago still works while the new version ships
<br/>
- **Safer deployments** - you deploy v2 without forcing same-day client updates
<br/>
- **Parallel development** - the frontend team keeps using v1 while the backend team builds v2
<br/>
- **Clear lifecycle** - you can mark v1 as deprecated, set a sunset date, and remove it when traffic drops to zero
<br/>
- **Partner trust** - external consumers need to know their integration won't randomly break

If your API is consumed by anyone other than a single frontend you fully control, versioning is not optional. It's a baseline requirement.

## Breaking vs. Non-Breaking Changes

This is the most important decision you'll make: **does this change need a new version?**

### Breaking changes (need a new version):
<br/>
- Removing a field from the response
<br/>
- Renaming a field
<br/>
- Changing a field's data type (e.g., `string` to `int`)
<br/>
- Changing the meaning of a field (e.g., `price` goes from cents to dollars)
<br/>
- Making a previously optional request field required
<br/>
- Changing status code behavior for existing flows
<br/>
- Removing or renaming an endpoint
<br/>
- Changing authentication requirements

### Non-breaking changes (keep the same version):
<br/>
- Adding a new optional field to the response
<br/>
- Adding a new endpoint
<br/>
- Adding a new optional query parameter
<br/>
- Improving performance without contract changes
<br/>
- Fixing a bug that doesn't change the documented behavior

**My rule of thumb:** if a client that was working yesterday would break today because of your change, it's a breaking change.

## Versioning Strategies Compared

There are several ways to version an API. Here's how they compare:

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| **URL Segment** | `/api/v1/products` | Easy to read, test, cache, and document | URL changes between versions |
| **Query String** | `/api/products?api-version=1.0` | URL mostly stable | Easy to miss, clutters query params |
| **Header** | `X-Api-Version: 1.0` | URL completely stable | Hidden, harder to test and discover |
| **Media Type** | `Accept: application/vnd.myapi.v1+json` | Follow HTTP spec closely | Complex, tooling support varies |

**My recommendation for 2026:** Use **URL segment versioning** with major versions only (`v1`, `v2`).

Why? Because:
<br/>
- It's immediately visible in logs, traces, and browser dev tools
<br/>
- Swagger/OpenAPI handles it cleanly
<br/>
- It's the easiest to test with curl, Postman, or any HTTP client
<br/>
- Caching and CDNs work naturally since the URL is different per version
<br/>
- New developers on your team can see which version they're calling instantly

I'll show you URL segment versioning first (the primary approach), and then show header versioning as an alternative later in the article.

## Project Setup

You need three NuGet packages. Run this in your .NET 10 project:

```bash
dotnet add package Asp.Versioning.Http
dotnet add package Asp.Versioning.Mvc.ApiExplorer
dotnet add package Swashbuckle.AspNetCore
```

`Asp.Versioning.Http` is the core package for Minimal API versioning. `Asp.Versioning.Mvc.ApiExplorer` enables Swagger integration. `Swashbuckle.AspNetCore` generates the OpenAPI docs and Swagger UI.

That's it for packages. Let's build the full setup.

## Minimal API Versioning - Full Implementation

I'm going to show you the complete `Program.cs` file, and then break down every section.

### Step 1: Configure API Versioning Services

```csharp
using Asp.Versioning;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = new UrlSegmentApiVersionReader();
})
.AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
```

Let me explain what each option does:
<br/>
- **`DefaultApiVersion`** - if no version is specified in the request, use v1.0
<br/>
- **`AssumeDefaultVersionWhenUnspecified`** - allows requests without an explicit version to fall through to the default
<br/>
- **`ReportApiVersions`** - adds `api-supported-versions` and `api-deprecated-versions` response headers automatically
<br/>
- **`UrlSegmentApiVersionReader`** - reads the version from the URL path segment (`/api/v1/...`)
<br/>
- **`GroupNameFormat`** - formats the version as `v1`, `v2`, etc. in API Explorer
<br/>
- **`SubstituteApiVersionInUrl`** - replaces `{version:apiVersion}` in the route template with the actual version number in Swagger

### Step 2: Create a Version Set

A version set defines which versions your API supports. You create one and share it across endpoint groups:

```csharp
var apiVersionSet = app.NewApiVersionSet()
    .HasApiVersion(new ApiVersion(1, 0))
    .HasApiVersion(new ApiVersion(2, 0))
    .ReportApiVersions()
    .Build();
```

This tells the framework: "My API has v1 and v2. Report both in response headers."

### Step 3: Define v1 Endpoints

```csharp
var productsV1 = app.MapGroup("/api/v{version:apiVersion}/products")
    .WithApiVersionSet(apiVersionSet)
    .MapToApiVersion(1, 0);

productsV1.MapGet("", async (AppDbContext db) =>
{
    var products = await db.Products
        .Select(p => new ProductResponseV1(p.Id, p.Name, p.Price))
        .ToListAsync();

    return Results.Ok(products);
})
.WithName("GetProductsV1")
.WithSummary("Get all products")
.WithDescription("Returns all products with basic details.");

productsV1.MapGet("/{id:int}", async (int id, AppDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product is null) return Results.NotFound();

    return Results.Ok(new ProductResponseV1(product.Id, product.Name, product.Price));
})
.WithName("GetProductByIdV1")
.WithSummary("Get product by ID");
```

```csharp
public record ProductResponseV1(int Id, string Name, decimal Price);
```

V1 returns a simple response: ID, name, and price.

### Step 4: Define v2 Endpoints with a Different Contract

Now let's say v2 needs to include currency, category, and availability:

```csharp
var productsV2 = app.MapGroup("/api/v{version:apiVersion}/products")
    .WithApiVersionSet(apiVersionSet)
    .MapToApiVersion(2, 0);

productsV2.MapGet("", async (AppDbContext db) =>
{
    var products = await db.Products
        .Select(p => new ProductResponseV2(
            p.Id,
            p.Name,
            p.Price,
            p.Currency,
            p.Category,
            p.IsAvailable))
        .ToListAsync();

    return Results.Ok(products);
})
.WithName("GetProductsV2")
.WithSummary("Get all products (v2)")
.WithDescription("Returns all products with extended details including currency and availability.");

productsV2.MapGet("/{id:int}", async (int id, AppDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product is null) return Results.NotFound();

    return Results.Ok(new ProductResponseV2(
        product.Id,
        product.Name,
        product.Price,
        product.Currency,
        product.Category,
        product.IsAvailable));
})
.WithName("GetProductByIdV2")
.WithSummary("Get product by ID (v2)");
```

```csharp
public record ProductResponseV2(
    int Id,
    string Name,
    decimal Price,
    string Currency,
    string Category,
    bool IsAvailable);
```

Same endpoint paths. Different response contracts. Both running at the same time. That's versioning.

### Step 5: Run the App

```csharp
app.UseSwagger();
app.UseSwaggerUI();

app.Run();
```

When you call `GET /api/v1/products`, you get the v1 response. When you call `GET /api/v2/products`, you get the v2 response. The response headers include:

```
api-supported-versions: 1.0, 2.0
```

Clean, predictable, and production-ready.

## Organizing Versioned Endpoints at Scale

In a real project, you don't want 200 lines of endpoint mappings in `Program.cs`. I always extract versioned endpoints into extension methods.

Here's the pattern I use:

```csharp
public static class ProductEndpoints
{
    public static void MapProductEndpointsV1(
        this IEndpointRouteBuilder app,
        ApiVersionSet apiVersionSet)
    {
        var group = app.MapGroup("/api/v{version:apiVersion}/products")
            .WithApiVersionSet(apiVersionSet)
            .MapToApiVersion(1, 0)
            .WithTags("Products");

        group.MapGet("", GetAllV1).WithName("GetProductsV1");
        group.MapGet("/{id:int}", GetByIdV1).WithName("GetProductByIdV1");
        group.MapPost("", CreateV1).WithName("CreateProductV1");
    }

    public static void MapProductEndpointsV2(
        this IEndpointRouteBuilder app,
        ApiVersionSet apiVersionSet)
    {
        var group = app.MapGroup("/api/v{version:apiVersion}/products")
            .WithApiVersionSet(apiVersionSet)
            .MapToApiVersion(2, 0)
            .WithTags("Products");

        group.MapGet("", GetAllV2).WithName("GetProductsV2");
        group.MapGet("/{id:int}", GetByIdV2).WithName("GetProductByIdV2");
        group.MapPost("", CreateV2).WithName("CreateProductV2");
    }

    // Handler methods...
    private static async Task<IResult> GetAllV1(AppDbContext db) { /* ... */ }
    private static async Task<IResult> GetAllV2(AppDbContext db) { /* ... */ }
    private static async Task<IResult> GetByIdV1(int id, AppDbContext db) { /* ... */ }
    private static async Task<IResult> GetByIdV2(int id, AppDbContext db) { /* ... */ }
    private static async Task<IResult> CreateV1(CreateProductRequest request, AppDbContext db) { /* ... */ }
    private static async Task<IResult> CreateV2(CreateProductRequestV2 request, AppDbContext db) { /* ... */ }
}
```

Then in `Program.cs`:

```csharp
app.MapProductEndpointsV1(apiVersionSet);
app.MapProductEndpointsV2(apiVersionSet);

app.Run();
```

Two lines. Clean `Program.cs`. Each version's endpoints live in their own method. Easy to find, easy to test, easy to delete when you sunset a version.

## Deprecating a Version

When you're ready to phase out v1, mark it as deprecated in the version set:

```csharp
var apiVersionSet = app.NewApiVersionSet()
    .HasDeprecatedApiVersion(new ApiVersion(1, 0))
    .HasApiVersion(new ApiVersion(2, 0))
    .ReportApiVersions()
    .Build();
```

Notice: `HasApiVersion` becomes `HasDeprecatedApiVersion` for v1.

Now every v1 response includes this header:

```
api-deprecated-versions: 1.0
api-supported-versions: 2.0
```

Clients that inspect response headers (and good API consumers do) will see the deprecation signal automatically.

### Adding a Sunset Header

For even clearer communication, add a sunset date header using middleware:

```csharp
app.Use(async (context, next) =>
{
    await next();

    var apiVersion = context.GetRequestedApiVersion();
    if (apiVersion?.MajorVersion == 1)
    {
        context.Response.Headers["Sunset"] = "Sat, 01 Nov 2026 00:00:00 GMT";
        context.Response.Headers["Deprecation"] = "true";
        context.Response.Headers["Link"] = 
            "</api/v2/products>; rel=\"successor-version\"";
    }
});
```

This tells every v1 consumer: "This version dies on November 1, 2026. Here's the link to the replacement." Explicit, machine-readable, and hard to miss.

## Swagger per Version

Having one massive Swagger page with all versions mixed together is confusing. You want **separate Swagger documents** for each version.

Here's how I configure it:

```csharp
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Products API",
        Version = "v1",
        Description = "Legacy product endpoints. Deprecated - migrate to v2."
    });

    options.SwaggerDoc("v2", new OpenApiInfo
    {
        Title = "Products API",
        Version = "v2",
        Description = "Current product endpoints with extended product details."
    });
});
```

And in the middleware:

```csharp
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Products API v1 (Deprecated)");
    options.SwaggerEndpoint("/swagger/v2/swagger.json", "Products API v2");
});
```

Now developers landing on your Swagger UI see a clear dropdown: v1 (deprecated) and v2 (current). They know exactly which version to use.

## Header Versioning Alternative

Some teams prefer header versioning because the URL stays stable across versions. Here's how you switch to it:

```csharp
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = new HeaderApiVersionReader("X-Api-Version");
});
```

With this setup, the URL for both versions is `/api/products`. The client specifies the version via a request header:

```
GET /api/products
X-Api-Version: 2.0
```

**When to use this instead of URL versioning:**
<br/>
- You have a CDN or reverse proxy that can't handle URL-based routing
<br/>
- Your API contract with partners specifies header-based versioning
<br/>
- You want to keep URLs cacheable across versions (same URL, different content)

**When to avoid it:**
<br/>
- Your consumers include browser-based apps (headers are harder to set)
<br/>
- Your team frequently tests via browser URL bar or curl (less convenient)
<br/>
- You want maximum discoverability in documentation

For most projects, I still recommend URL segment versioning. But header versioning is a solid choice when URL stability matters more than discoverability.

## Combining Multiple Version Readers

You can also support both URL and header versioning simultaneously:

```csharp
options.ApiVersionReader = ApiVersionReader.Combine(
    new UrlSegmentApiVersionReader(),
    new HeaderApiVersionReader("X-Api-Version")
);
```

This way, clients can use whichever method they prefer. The URL segment takes precedence if both are provided.

## Testing Versioned Endpoints

Testing versioned APIs in integration tests is straightforward. You call the version-specific URL and assert the response contract:

```csharp
public class ProductsApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ProductsApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetProducts_V1_ReturnsBasicFields()
    {
        var response = await _client.GetAsync("/api/v1/products");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var products = await response.Content
            .ReadFromJsonAsync<List<ProductResponseV1>>();

        products.Should().NotBeEmpty();
        products![0].Id.Should().BeGreaterThan(0);
        products[0].Name.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task GetProducts_V2_ReturnsExtendedFields()
    {
        var response = await _client.GetAsync("/api/v2/products");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var products = await response.Content
            .ReadFromJsonAsync<List<ProductResponseV2>>();

        products.Should().NotBeEmpty();
        products![0].Currency.Should().NotBeNullOrEmpty();
        products[0].Category.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task V1_Response_Headers_Show_Deprecation()
    {
        var response = await _client.GetAsync("/api/v1/products");

        response.Headers.Should().ContainKey("api-deprecated-versions");
    }
}
```

Key testing strategies:
<br/>
- Test each version independently with its own response contract
<br/>
- Assert deprecation headers are present for deprecated versions
<br/>
- Test that unsupported versions return 400-level errors
<br/>
- Test default version behavior when no version is specified

## Migration Playbook: v1 to v2

After running versioned APIs across multiple projects, here's the migration flow I follow every time:

**Phase 1: Build and Ship v2**
1. Build v2 endpoints with the new contract.
2. Deploy both v1 and v2 side by side.
3. Update Swagger docs to show both versions.
4. Write migration documentation explaining what changed and why.

**Phase 2: Announce Deprecation**
5. Mark v1 as deprecated in the version set (`HasDeprecatedApiVersion`).
6. Add sunset header with a concrete date (at least 3-6 months out).
7. Notify consumers via email, changelog, or API portal.
8. Add deprecation notice in Swagger UI description.

**Phase 3: Monitor and Support**
9. Log v1 usage per client/API key.
10. Contact high-traffic v1 consumers directly.
11. Offer migration support if needed.
12. Freeze v1 - security patches only, no new features.

**Phase 4: Retire v1**
13. When v1 traffic drops to near zero (or the sunset date arrives), remove v1 endpoints.
14. Return `410 Gone` for any remaining v1 requests for a transition period.
15. Clean up v1 response models, handlers, and tests.

**The most common mistake I see:** teams build v2, announce deprecation, and then never actually remove v1. Years later they're maintaining 4 versions with no retirement plan. Set a date. Stick to it.

## Common Mistakes to Avoid

After working with versioned APIs on multiple projects, these are the patterns that consistently cause problems:
<br/>
- **Versioning too late** - waiting until you have 20 clients on an unversioned API means a painful migration for everyone
<br/>
- **Breaking changes without a new version** - renaming a field in v1 and hoping nobody notices is a guaranteed production incident
<br/>
- **Creating a version for every change** - adding an optional field doesn't need v3. Save versions for actual breaking changes.
<br/>
- **No sunset policy** - if you never retire old versions, you're maintaining multiple codepaths forever
<br/>
- **No usage tracking** - you can't sunset v1 if you don't know who's still calling it
<br/>
- **Inconsistent versioning across resources** - if `/products` is on v2 but `/orders` is on v1, consumers get confused fast. Version your entire API together.
<br/>
- **Not documenting differences** - a changelog between v1 and v2 is essential. Consumers need to know exactly what changed.

## Frequently Asked Questions

### What is API versioning in ASP.NET Core?

API versioning in ASP.NET Core is a built-in capability provided by the `Asp.Versioning` packages that lets you serve multiple versions of your API simultaneously. Each version has its own contract (request/response shapes, behavior, validation rules), and clients specify which version they want through URL segments, headers, or query strings. The framework routes each request to the correct version's handler automatically. This lets you evolve your API without breaking existing consumers.

### How do I implement API versioning with Minimal APIs in .NET 10?

Install `Asp.Versioning.Http`, configure versioning services with `AddApiVersioning()` in `Program.cs`, create a version set with `app.NewApiVersionSet()`, and map endpoint groups with `.WithApiVersionSet()` and `.MapToApiVersion()`. Each version gets its own `MapGroup` with the same route template but different version mappings. The version is read from the URL segment `/api/v{version:apiVersion}/resource`. Full code examples are shown earlier in this article.

### Should I use URL versioning or header versioning?

For most teams, **URL segment versioning** is the better choice. It's visible in browser dev tools, logs, and traces. It's easy to test with curl or Postman. It works naturally with Swagger/OpenAPI. Header versioning is a valid alternative when URL stability is critical - for example, when a CDN or API gateway requires stable URLs, or when the API contract with external partners specifies header-based versioning. You can also combine both readers so clients can use either approach.

### Do internal APIs need versioning?

Yes, if they're consumed by multiple teams or services that deploy independently. Internal clients break the same way external clients do. The only scenario where you can skip versioning is when you control all consumers and can deploy them atomically with the API. In microservices architectures, that's rarely the case.

### When should I create a new API version?

Create a new version only for **breaking changes**: removing or renaming fields, changing field types or meanings, making optional fields required, changing status code behavior, or removing endpoints. Do not create a new version for additive, non-breaking changes like adding optional response fields, adding new endpoints, or improving performance. Over-versioning creates unnecessary maintenance burden.

### How do I deprecate an old API version in .NET 10?

Replace `HasApiVersion(new ApiVersion(1, 0))` with `HasDeprecatedApiVersion(new ApiVersion(1, 0))` in your version set. This automatically adds `api-deprecated-versions: 1.0` to every v1 response header. For stronger signaling, add a `Sunset` header with a concrete retirement date using middleware. Update your Swagger doc description to include a deprecation notice. Track v1 usage, notify consumers, and remove v1 endpoints on the published sunset date.

### Can I version only specific endpoints instead of the whole API?

Yes. You can create multiple version sets - one per resource group if needed. However, I recommend versioning your entire API together. Mixed versioning (where `/products` is on v2 but `/orders` is still on v1) creates confusion. Consumers expect a single version number for the whole API surface.

### What is the difference between Asp.Versioning.Http and Asp.Versioning.Mvc?

`Asp.Versioning.Http` is designed for **Minimal APIs** - it works with `MapGet`, `MapPost`, `MapGroup`, and version sets. `Asp.Versioning.Mvc` is designed for **controller-based APIs** - it works with `[ApiVersion]` and `[MapToApiVersion]` attributes on controller classes and actions. If you're using Minimal APIs (which is the default approach in .NET 10), use `Asp.Versioning.Http`. If you're using controllers, use `Asp.Versioning.Mvc`. You can use both in the same project if needed.

## Wrapping Up

API versioning is one of those things you can ignore - exactly once.

After the first production incident where a "small response change" breaks a mobile app, a partner dashboard, or an internal service, every team wishes they had set this up from day one.

The good news: with `Asp.Versioning.Http` and Minimal APIs in .NET 10, the setup is straightforward. You get URL-based versioning, automatic deprecation headers, Swagger docs per version, and a clean extension method pattern to keep your `Program.cs` readable.

My recommendation: **set up versioning on day one**, even if you only have v1. The infrastructure cost is minimal. The cost of adding it later - when you already have clients depending on an unversioned API - is enormous.

Start with URL segment versioning. Use major versions only. Deprecate with headers and dates. Sunset aggressively.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

Want to build APIs the right way from day one? Check out [Top 5 API Building Mistakes](https://thecodeman.net/posts/building-apis-top-5-mistakes), [API Key Authentication](https://thecodeman.net/posts/how-to-implement-api-key-authentication), and my guide on [Building Resilient APIs in ASP.NET Core](https://thecodeman.net/posts/building-resilient-api-in-aspnet-core) for the complete production API toolkit.

<!--END-->
