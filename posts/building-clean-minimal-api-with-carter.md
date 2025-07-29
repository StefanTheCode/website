---
title: "Building Clean & Minimal .NET APIs with Carter"
subtitle: "Carter gives you a clean, modular, and testable way to define your API endpoints - all while still using minimal APIs under the hood."
readTime: "Read Time: 4 minutes"
date: "July 29 2025"
category: "APIs"
meta_description: "Carter gives you a clean, modular, and testable way to define your API endpoints - all while still using minimal APIs under the hood."
---

<!--START-->
##### Replace the slow compile-debug cycle with [Uno Platform's live UI editing](https://platform.uno/?utm_source=stefan&utm_medium=newsletter&utm_campaign=uno-ad). Uno Platform introduces Hot Design, a groundbreaking runtime visual designer that lets you pause your running .NET app, visually edit the UI, and resume instantly from any OS (Windows, macOS, Linux) using your favorite IDE like Visual Studio, VS Code, or Rider. 
##### Give your cross-platform .NET apps the productive workflow they deserve with an open-source, single-codebase solution that goes far beyond basic Hot Reload.
&nbsp;
##### [Try it now](https://platform.uno/?utm_source=stefan&utm_medium=newsletter&utm_campaign=uno-ad)
&nbsp;

&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  
##### In modern .NET development, there's been a trend toward minimal APIs - getting rid of controller bloat and focusing on just what matters. But as your app grows, even minimal APIs can become messy and hard to organize.
&nbsp;  

##### That’s where [Carter](https://github.com/CarterCommunity/Carter) comes in.
&nbsp;  

##### Carter gives you a clean, modular, and testable way to define your API endpoints - all while still using minimal APIs under the hood. It’s lightweight, composable, and plays nicely with your existing .NET stack.
&nbsp;  

##### In this article, we’ll walk through:
##### • Why Carter is useful
##### • How to set it up in a .NET 8+ project
##### • Real-world example with validation and mapping
##### • Pros & cons of using Carter
##### • Final thoughts
&nbsp;  
&nbsp;  
###  Why Carter?
&nbsp;  
&nbsp; 

##### Minimal APIs are great for small projects - but as your project grows:
&nbsp; 

##### • Routes scatter across multiple files.
##### • Dependency injection logic is repeated.
##### • Validation and mapping logic clutters route definitions.
##### • Testing individual endpoints becomes tricky.
&nbsp; 

##### Carter helps you modularize your endpoints into clean, testable components -  without falling back to full MVC-style controllers.
&nbsp;  

&nbsp;  
&nbsp;  
###  Setting Up Carter in .NET
&nbsp;  
&nbsp;  

##### Start by installing the NuGet package:
```csharp

dotnet add package Carter
```

&nbsp;  
&nbsp;  
### Creating a Real-World Carter API
&nbsp;  
&nbsp;  

##### Let’s create a simple Products API where you can:
##### • Create a product
##### • Get a list of products
##### • Use FluentValidation for validation
##### • Use Custom Mapper for DTO -> Entity mapping

&nbsp;  
&nbsp;  
### Project Structure
&nbsp;  
&nbsp;  

```csharp

MyApi/
├── Program.cs
├── Endpoints/
│   └── ProductModule.cs
├── Models/
│   ├── Product.cs
│   └── ProductDto.cs
├── Validators/
│   └── CreateProductDtoValidator.cs
```

#### Product.cs

```csharp

namespace MyApi.Models;

public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public decimal Price { get; set; }
}
```

#### ProductDto.cs

```csharp

namespace MyApi.Models;

public record CreateProductDto(string Name, decimal Price);
```
#### CreateProductDtoValidator.cs

```csharp

using FluentValidation;
using MyApi.Models;

namespace MyApi.Validators;

public class CreateProductDtoValidator : AbstractValidator<CreateProductDto>
{
    public CreateProductDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Price).GreaterThan(0);
    }
}
```

#### ProductModule.cs
&nbsp;  
##### In Carter, instead of defining routes directly in Program.cs or using controllers, you create **"modules"** that group related endpoints. These modules implement the ICarterModule interface.
##### This makes your API **modular, clean, and easy to maintain**.
&nbsp;  

##### Every Carter module implements ICarterModule, which requires a single method: AddRoutes.
&nbsp;  

##### You inject services (like validators) directly into handlers.
##### You keep everything related to “Product” inside one file/module.
##### It all compiles down to regular minimal API endpoints under the hood - just better organized!

```csharp

using Carter;
using FluentValidation;
using Mapster;
using Microsoft.AspNetCore.Http.HttpResults;
using MyApi.Models;

namespace MyApi.Endpoints;

public class ProductModule : ICarterModule
{
    private static readonly List<Product> _products = [];

    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/products", () => _products);

        app.MapPost("/products", async (
            CreateProductDto dto,
            IValidator<CreateProductDto> validator) =>
        {
            var validationResult = await validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .ToDictionary(e => e.PropertyName, e => e.ErrorMessage);
                return Results.BadRequest(errors);
            }

            var product = dto.ToProduct<Product>();
            product.Id = Guid.NewGuid();
            _products.Add(product);

            return Results.Created($"/products/{product.Id}", product);
        });
    }
}
```

&nbsp;  
&nbsp;  
### Program.cs
&nbsp;  
&nbsp;  

##### That’s it! You now have a clean API with validation and mapping - and all routes are organized into modules.

```csharp

using Carter;
using FluentValidation;
using MyApi.Models;
using MyApi.Validators;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCarter();
builder.Services.AddScoped<IValidator<CreateProductDto>, CreateProductDtoValidator>();

var app = builder.Build();

app.MapCarter(); // This maps all Carter modules automatically

app.Run();
```

&nbsp;  
&nbsp;  
### Why Developers Love Carter
&nbsp;  
&nbsp;  

##### **• Keeps things clean and organized**
##### Instead of cluttering your Program.cs with dozens of routes, Carter lets you group related endpoints in neat modules. It just feels better.
&nbsp;  

##### **• Grows well with your project**
##### What starts as a small API can get messy fast. Carter gives your project structure, even as it grows.
&nbsp;  

##### **• You can inject anything you need**
##### Need a service? A validator? A logger? Just inject it directly into your route - no extra setup, no controller boilerplate.
&nbsp;  

##### **• Works great with modern patterns**
##### If you're into vertical slice architecture, CQRS, or minimal APIs - Carter plays really well with those styles.
&nbsp;  

##### **• Cleaner startup**
##### Your Program.cs stays short and sweet. Just call app.MapCarter() and all your modules are wired up.
&nbsp;  

##### **• Fast and lightweight**
##### There’s no controller or attribute overhead. It’s just minimal APIs - but more organized.
&nbsp;  

##### **• Easy to test**
##### Because modules are simple classes, they’re super easy to write tests for - no magic or reflection behind the scenes.
&nbsp;  

##### **• Flexible and plug-and-play**
##### Use whatever tools you like - FluentValidation, Mapster, MediatR, Dapper, EF Core… Carter doesn’t get in your way.

&nbsp;  
&nbsp;  
### Things to Keep in Mind
&nbsp;  
&nbsp;  

##### **• Smaller community, less documentation**
##### Carter is awesome, but it’s not as mainstream as .NET MVC. You might not find answers on Stack Overflow as quickly.
&nbsp;  

##### **• You define routes manually**
##### There’s no [HttpGet], [Route], or attribute-based routing here - just regular method calls like MapGet. Some people miss the attributes.
&nbsp;  

##### **• No fancy model binding attributes**
##### You won’t see [FromBody] or [FromQuery]. Binding works like in minimal APIs - clean, but different if you're used to MVC.
&nbsp;  

##### **• You have to decide how to structure things**
##### Carter gives you flexibility, but with that comes responsibility. You’ll need to create your own structure for modules, validators, etc.
&nbsp;  

##### **• No built-in filters or attributes**
##### If you're used to using [Authorize], [ValidateModel], or action filters, you’ll have to wire up that behavior yourself.

&nbsp;  
&nbsp;  
### Wrapping Up
&nbsp;  
&nbsp;  

##### Carter is one of those libraries that makes you think, “Why didn’t I use this earlier?” It takes the flexibility of minimal APIs and adds just the right amount of structure - without dragging you back into the world of bloated controllers and attributes.
&nbsp;  

##### If you're building APIs that are starting to grow beyond a few routes, or you just want a cleaner way to organize your features, Carter is 100% worth trying out. 
&nbsp;  

##### It’s simple, lightweight, and fits beautifully into modern .NET projects.
&nbsp;  

##### Sure, it’s not as mainstream as MVC, and you’ll need to define some structure on your own -nbut that freedom is part of what makes it so powerful.
&nbsp;  

##### So the next time you find yourself deep in a messy Program.cs file wondering where to put that new endpoint... maybe give Carter a shot. 
&nbsp;  

##### You might just fall in love with how clean your code starts to feel.
&nbsp;  

##### That's all from me today. 

&nbsp;  
 
##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->