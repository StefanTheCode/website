---
title: ".NET 10 Extension"
subtitle: "With .NET 10 extension feature now you can define extension blocks for any type..."
date: "Apr 15 2025"
category: "CSharp"
readTime: "Read Time: 3 minutes"
meta_description: "With .NET 10 extension feature now you can define extension blocks for any type."
---

<!--START-->
This issue is **self-sponsored**.
By supporting my work and purchasing my products, you directly help me keep this newsletter free and continue creating high-quality, practical .NET content for the community. 

Thank you for the support 🙌  

P.S. I’m currently building a new course, [Pragmatic .NET Code Rules](https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website&utm_campaign=020226), focused on creating a predictable, consistent, and self-maintaining .NET codebase using .editorconfig, analyzers, Visual Studio code cleanup, and CI enforcement.

The course is available for pre-sale until the official release, with early-bird pricing for early adopters.
You can find all the details [here]((https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website&utm_campaign=020226)).

## New "extension" keyword in .NET 10
With .NET 10 extension feature now you can define **extension block**s for any type. It is shaping up to be one of the most exciting updates in recent years - and one of the most underrated gems is the new extension keyword introduced in C# 14 (Preview 3). 

If you thought extension methods were powerful before, this takes things to a whole new level.

In this article, I’ll break down:
• What the new extension feature does
• Why it matters
• Real-world use cases you couldn’t solve cleanly before
• And how it changes the way we organize logic around existing types

##  Wait, what’s wrong with Extension Methods?
With the new syntax, you can define extension blocks for any type. 
These blocks allow:

• Extension **properties**
• Private **backing fields** inside the extension scope
• Grouped logic in a clean and local context
• Even **static extension blocks** for related helpers

Syntax:

```csharp
public static class MyExtensions
{
    extension(TargetType instance)
    {
        public ReturnType PropertyOrMethod => ...;
    }

    extension static
    {
        public static ReturnType StaticHelper() => ...;
    }
}
```

## Real-World Use Case: Multi-Tenant SaaS and HttpContext

Let’s say you’re building a multi-tenant SaaS product. You need to:

• Extract the TenantId from claims
• Parse and validate the UserId
• Check if the user is a tenant admin
• Read custom headers
• Expose defaults and validation logic

The old way? You’d create scattered static methods.
The new way? One structured block with everything grouped and cached.

```csharp
public static class MultiTenantHttpContextExtensions
{
    extension(HttpContext ctx)
    {
        private string? _tenantId;
        private Guid? _userId;

        public string TenantId =>
            _tenantId ??=
                ctx.User.Claims.FirstOrDefault(c => c.Type == "tenant_id")?.Value
                ?? throw new UnauthorizedAccessException("Tenant ID missing");

        public Guid UserId =>
            _userId ??=
                Guid.TryParse(
                    ctx.User.Claims.FirstOrDefault(c => c.Type == "user_id")?.Value, out var id)
                ? id
                : throw new UnauthorizedAccessException("User ID invalid");

        public bool IsTenantAdmin =>
            ctx.User.IsInRole("Admin") || ctx.Request.Headers["X-Tenant-Admin"] == "true";

        public string? GetHeader(string name) =>
            ctx.Request.Headers.TryGetValue(name, out var value)
                ? value.ToString()
                : null;
    }

    extension static
    {
        public static string DefaultTenantId => "public";

        public static bool IsValidTenantId(string? id) =>
            !string.IsNullOrWhiteSpace(id) && id.All(char.IsLetterOrDigit);
    }
}
```

This approach brings:
• Readable, organized logic
• Lazy caching via private fields (_tenantId, _userId)
• Cohesive domain logic scoped to the right context

## Another Example: Extending External Models

Let’s say you’re working with a third-party DTO:

```csharp
public class OrderDto
{
    public List<OrderItemDto> Items { get; set; }
    public string Status { get; set; }
}
```
With new extensions, you can wrap domain logic around it without modifying the class:
```csharp
public static class OrderExtensions
{
    extension(OrderDto order)
    {
        public decimal TotalAmount =>
            order.Items.Sum(i => i.Quantity * i.PricePerUnit);

        public bool IsComplete =>
            order.Status == "Completed";

        public int TotalItems =>
            order.Items.Sum(i => i.Quantity);
    }
}
```
Usage becomes clean and expressive:

```csharp
if (order.TotalAmount > 1000 && order.IsComplete)
{
    // Do something
}
```
## Why not just use methods from .NET 10?

![Comparing with Extension Methods](/images/blog/posts/dotnet10-extension/comparing-with-extension-methods.png)

This isn't just a cosmetic change - it's a paradigm shift in how we organize logic.

## My Gotchas & Notes

• This is currently available in **.NET 10 Preview 3** with C# 14
• Still being refined, so expect updates in syntax and tooling support
• All your existing extension methods continue to work - this is purely additive
## My Advice

Use this **when you’re extending a type with multiple behaviors** that feel like they belong together:

• DTO transformations
• HTTP context and claims logic
• Computed values on external models
• Domain-specific enhancements (e.g., IsActive, TotalAmount, NeedsSync, etc.)

It keeps your logic close, clean, and cache-friendly - and once you start using it, you won’t want to go back.

## Wrapping Up

The new extension keyword isn’t flashy at first glance. But it solves a real pain point for developers who care about [clean architecture](https://thecodeman.net/posts/architecture-tests-dotnet-clean-architecture), rich domain modeling, and maintainable code.

It gives us the power we didn’t even know we were missing in C# - and it’s just the beginning of a new era of expressiveness.

Let me know if you'd like to see how I plan to use this in:

• [CQRS](https://thecodeman.net/posts/how-to-implement-cqrs-without-mediatr) helpers
• ViewModel builders
• ASP.NET Core service pipelines
Because I already note what I can refactor for some of my older projects.

That's all from me today. 
 
P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->


