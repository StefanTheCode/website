---
title: ".NET 10 Extension"
subtitle: "With .NET 10 extension feature now you can define extension blocks for any type..."
readTime: "Read Time: 3 minutes"
date: "Apr 15 2025"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "With .NET 10 extension feature now you can define extension blocks for any type."
---

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
### New "extension" keyword in .NET 10
&nbsp;  
&nbsp;  
##### With .NET 10 extension feature now you can define **extension block**s for any type. It is shaping up to be one of the most exciting updates in recent years - and one of the most underrated gems is the new extension keyword introduced in C# 14 (Preview 3). 
&nbsp;  

##### If you thought extension methods were powerful before, this takes things to a whole new level.
&nbsp;  

##### In this article, I’ll break down:
##### • What the new extension feature does
##### • Why it matters
##### • Real-world use cases you couldn’t solve cleanly before
##### • And how it changes the way we organize logic around existing types

&nbsp;  
&nbsp;  
###  Wait, what’s wrong with Extension Methods?
&nbsp;  
&nbsp;  
##### With the new syntax, you can define extension blocks for any type. 
##### These blocks allow:
&nbsp;  

##### • Extension **properties**
##### • Private **backing fields** inside the extension scope
##### • Grouped logic in a clean and local context
##### • Even **static extension blocks** for related helpers
&nbsp;  

##### Syntax:

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

&nbsp;  
&nbsp;  
### Real-World Use Case: Multi-Tenant SaaS and HttpContext
&nbsp;  
&nbsp;  

##### Let’s say you’re building a multi-tenant SaaS product. You need to:
&nbsp;  

##### • Extract the TenantId from claims
##### • Parse and validate the UserId
##### • Check if the user is a tenant admin
##### • Read custom headers
##### • Expose defaults and validation logic
&nbsp;  

##### The old way? You’d create scattered static methods.
##### The new way? One structured block with everything grouped and cached.

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

##### This approach brings:
##### • Readable, organized logic
##### • Lazy caching via private fields (_tenantId, _userId)
##### • Cohesive domain logic scoped to the right context


&nbsp;  
&nbsp;  
### Another Example: Extending External Models
&nbsp;  
&nbsp;  

##### Let’s say you’re working with a third-party DTO:

```csharp

public class OrderDto
{
    public List<OrderItemDto> Items { get; set; }
    public string Status { get; set; }
}
```
&nbsp;  
##### With new extensions, you can wrap domain logic around it without modifying the class:
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
##### Usage becomes clean and expressive:
&nbsp;  

```csharp

if (order.TotalAmount > 1000 && order.IsComplete)
{
    // Do something
}
```
&nbsp;  
&nbsp;  
### Why not just use methods from .NET 10?
&nbsp;  
&nbsp;  

![Comparing with Extension Methods](/images/blog/posts/dotnet10-extension/comparing-with-extension-methods.png)

##### This isn't just a cosmetic change - it's a paradigm shift in how we organize logic.

&nbsp;  
&nbsp;  
### My Gotchas & Notes
&nbsp;  
&nbsp;  

##### • This is currently available in **.NET 10 Preview 3** with C# 14
##### • Still being refined, so expect updates in syntax and tooling support
##### • All your existing extension methods continue to work - this is purely additive
&nbsp;  
&nbsp;  
### My Advice
&nbsp;  
&nbsp;  

##### Use this **when you’re extending a type with multiple behaviors** that feel like they belong together:
&nbsp;  

##### • DTO transformations
##### • HTTP context and claims logic
##### • Computed values on external models
##### • Domain-specific enhancements (e.g., IsActive, TotalAmount, NeedsSync, etc.)
&nbsp;  

##### It keeps your logic close, clean, and cache-friendly - and once you start using it, you won’t want to go back.

&nbsp;  
&nbsp;  
### Wrapping Up
&nbsp;  
&nbsp;  

##### The new extension keyword isn’t flashy at first glance. But it solves a real pain point for developers who care about clean architecture, rich domain modeling, and maintainable code.

##### It gives us the power we didn’t even know we were missing in C# - and it’s just the beginning of a new era of expressiveness.
&nbsp;  

##### Let me know if you'd like to see how I plan to use this in:
&nbsp;  

##### • CQRS helpers
##### • ViewModel builders
##### • ASP.NET Core service pipelines
&nbsp;  
##### Because I already note what I can refactor for some of my older projects.
&nbsp;  

##### That's all from me today. 
&nbsp;  
 
##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).