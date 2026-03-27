---
title: "Build Your Own MediatR: A Lightweight Handler Pipeline in ASP.NET Core"
subtitle: "Build a zero-dependency request pipeline with composable middleware, validation, and a fluent builder API - without MediatR."
date: "March 27 2026"
category: ".NET"
readTime: "Read Time: 8 minutes"
meta_description: "Learn how to implement a lightweight MediatR alternative in ASP.NET Core using HandlerPipeline<TRequest, TResponse>, ValidatorMiddleware, and fluent middleware registration with UseMiddleware<T>().Run(handler).Build()."
---

<!--START-->

## Background

If you have built APIs in .NET, you have probably asked this question at least once:

Do we really need MediatR for this?

MediatR is great. It gives us a clean request/response model, pipeline behaviors, and a nice way to centralize cross-cutting concerns.

But sometimes you want:

• Full control over the pipeline internals  
• Zero external dependencies  
• Very explicit behavior wiring  
• A tiny abstraction you can debug in 5 minutes

In this post, we will build a minimal pipeline that feels familiar to MediatR users, but is fully custom.

You will implement:

• `HandlerPipeline<TRequest, TResponse>`  
• `ValidatorMiddleware<TRequest, TResponse>`  
• Fluent registration with `UseMiddleware<T>().Run(handler).Build()`

By the end, you will have composable middleware and clean handlers, without bringing in MediatR.

## The Goal

We want to execute requests like this:

```csharp
var response = await pipeline
    .UseMiddleware<ValidatorMiddleware<CreateOrderCommand, Guid>>()
    .UseMiddleware<LoggingMiddleware<CreateOrderCommand, Guid>>()
    .Run((request, ct) => handler.Handle(request, ct))
    .Build()
    .Invoke(command, cancellationToken);
```

This should create a chain where each middleware can run logic before/after the next step.

## Step 1: Define the Core Contracts

Start with tiny interfaces.

```csharp
public delegate Task<TResponse> RequestHandlerDelegate<TResponse>();
public interface IHandlerMiddleware<TRequest, TResponse>
{
    Task<TResponse> Handle(
        TRequest request,
        CancellationToken cancellationToken,
        RequestHandlerDelegate<TResponse> next);
}
public interface IHandlerPipeline<TRequest, TResponse>
{
    IHandlerPipeline<TRequest, TResponse> UseMiddleware<TMiddleware>()
        where TMiddleware : IHandlerMiddleware<TRequest, TResponse>;
    IHandlerPipeline<TRequest, TResponse> Run(
        Func<TRequest, CancellationToken, Task<TResponse>> handler);
    Func<TRequest, CancellationToken, Task<TResponse>> Build();
}
```

That is enough to express the entire flow.

## Step 2: Implement `HandlerPipeline<TRequest, TResponse>`

The pipeline stores middleware types, captures the final handler, and composes everything in reverse order.

```csharp
public sealed class HandlerPipeline<TRequest, TResponse> : IHandlerPipeline<TRequest, TResponse>
{
    private readonly IServiceProvider _serviceProvider;
    private readonly List<Type> _middlewares = new();
    private Func<TRequest, CancellationToken, Task<TResponse>>? _handler;
    public HandlerPipeline(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }
    public IHandlerPipeline<TRequest, TResponse> UseMiddleware<TMiddleware>()
        where TMiddleware : IHandlerMiddleware<TRequest, TResponse>
    {
        _middlewares.Add(typeof(TMiddleware));
        return this;
    }
    public IHandlerPipeline<TRequest, TResponse> Run(
        Func<TRequest, CancellationToken, Task<TResponse>> handler)
    {
        _handler = handler;
        return this;
    }
    public Func<TRequest, CancellationToken, Task<TResponse>> Build()
    {
        if (_handler is null)
        {
            throw new InvalidOperationException("Handler was not configured. Call Run(...) before Build().");
        }
        return async (request, cancellationToken) =>
        {
            RequestHandlerDelegate<TResponse> next = () => _handler(request, cancellationToken);
            for (int i = _middlewares.Count - 1; i >= 0; i--)
            {
                var middlewareType = _middlewares[i];
                var middleware =
                    (IHandlerMiddleware<TRequest, TResponse>)_serviceProvider.GetRequiredService(middlewareType);
                var currentNext = next;
                next = () => middleware.Handle(request, cancellationToken, currentNext);
            }
            return await next();
        };
    }
}
```

Why reverse order?

Because middleware composition is like nested wrappers:

`M1(M2(M3(Handler)))`

The last registered middleware should be closest to the handler.

## Step 3: Add a Validator Middleware

Now we bring in a cross-cutting concern: validation.

First, define a minimal validator contract:

```csharp
public interface IRequestValidator<in TRequest>
{
    Task<IReadOnlyCollection<string>> ValidateAsync(TRequest request, CancellationToken cancellationToken);
}
```

Then implement middleware that runs all validators for the current request type.

```csharp
public sealed class ValidatorMiddleware<TRequest, TResponse>
    : IHandlerMiddleware<TRequest, TResponse>
{
    private readonly IEnumerable<IRequestValidator<TRequest>> _validators;
    public ValidatorMiddleware(IEnumerable<IRequestValidator<TRequest>> validators)
    {
        _validators = validators;
    }
    public async Task<TResponse> Handle(
        TRequest request,
        CancellationToken cancellationToken,
        RequestHandlerDelegate<TResponse> next)
    {
        if (_validators.Any())
        {
            var failures = new List<string>();
            foreach (var validator in _validators)
            {
                var errors = await validator.ValidateAsync(request, cancellationToken);
                failures.AddRange(errors);
            }
            if (failures.Count > 0)
            {
                throw new ValidationException(failures);
            }
        }
        return await next();
    }
}
public sealed class ValidationException : Exception
{
    public ValidationException(IReadOnlyCollection<string> errors)
        : base("Request validation failed.")
    {
        Errors = errors;
    }
    public IReadOnlyCollection<string> Errors { get; }
}
```

This gives us behavior very close to MediatR pipeline validation, but fully under our control.

## Step 4: Add Another Middleware (Logging)

To prove composability, add a logging middleware.

```csharp
public sealed class LoggingMiddleware<TRequest, TResponse>
    : IHandlerMiddleware<TRequest, TResponse>
{
    private readonly ILogger<LoggingMiddleware<TRequest, TResponse>> _logger;
    public LoggingMiddleware(ILogger<LoggingMiddleware<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }
    public async Task<TResponse> Handle(
        TRequest request,
        CancellationToken cancellationToken,
        RequestHandlerDelegate<TResponse> next)
    {
        _logger.LogInformation("Handling {RequestType}", typeof(TRequest).Name);
        var response = await next();
        _logger.LogInformation("Handled {ResponseType}", typeof(TResponse).Name);
        return response;
    }
}
```

Now any request can share logging, validation, performance timers, retry logic, etc.

## Step 5: Wire It Up in DI

Create extension methods so registration is one line in `Program.cs`.

```csharp
public static class DependencyInjectionExtensions
{
    public static IServiceCollection AddHandlerPipeline(this IServiceCollection services)
    {
        services.AddScoped(typeof(IHandlerPipeline<,>), typeof(HandlerPipeline<,>));
        services.AddScoped(typeof(ValidatorMiddleware<,>));
        services.AddScoped(typeof(LoggingMiddleware<,>));
        return services;
    }
}
```

In `Program.cs`:

```csharp
builder.Services.AddHandlerPipeline();
```

Simple and explicit.

## Step 6: Use It in a Real Handler Flow

Let us say we have a command + handler:

```csharp
public sealed record CreateOrderCommand(Guid CustomerId, decimal Amount);
public sealed class CreateOrderHandler
{
    public Task<Guid> Handle(CreateOrderCommand command, CancellationToken cancellationToken)
    {
        // Persist and return order id
        return Task.FromResult(Guid.NewGuid());
    }
}
```

A validator:

```csharp
public sealed class CreateOrderValidator : IRequestValidator<CreateOrderCommand>
{
    public Task<IReadOnlyCollection<string>> ValidateAsync(
        CreateOrderCommand request,
        CancellationToken cancellationToken)
    {
        var errors = new List<string>();
        if (request.CustomerId == Guid.Empty)
        {
            errors.Add("CustomerId is required.");
        }
        if (request.Amount <= 0)
        {
            errors.Add("Amount must be greater than 0.");
        }
        return Task.FromResult((IReadOnlyCollection<string>)errors);
    }
}
```

And call the pipeline:

```csharp
public sealed class OrderApplicationService
{
    private readonly IHandlerPipeline<CreateOrderCommand, Guid> _pipeline;
    private readonly CreateOrderHandler _handler;
    public OrderApplicationService(
        IHandlerPipeline<CreateOrderCommand, Guid> pipeline,
        CreateOrderHandler handler)
    {
        _pipeline = pipeline;
        _handler = handler;
    }
    public Task<Guid> Execute(CreateOrderCommand command, CancellationToken cancellationToken)
    {
        return _pipeline
            .UseMiddleware<ValidatorMiddleware<CreateOrderCommand, Guid>>()
            .UseMiddleware<LoggingMiddleware<CreateOrderCommand, Guid>>()
            .Run((request, ct) => _handler.Handle(request, ct))
            .Build()
            .Invoke(command, cancellationToken);
    }
}
```

That is the full pattern:

`UseMiddleware<T>() -> Run(handler) -> Build()`

## Why Teams Care About This

When teams debate MediatR, they usually debate trade-offs:

• One more dependency vs. writing your own abstraction  
• Convention-driven behavior vs. explicit wiring  
• Library features vs. custom control

This lightweight pipeline gives you:

• MediatR-like composition  
• Strongly typed middleware chains  
• Easy debugging (you own every line)  
• Zero framework lock-in

And if later you decide to move to MediatR, your handlers and middleware concepts stay almost identical.

## When Not to Build Your Own

Be practical.

If you need advanced ecosystem integrations, mature community behaviors, notifications, or broad team familiarity out of the box, MediatR can still be the better default.

Custom pipelines shine when:

• You want minimal dependencies  
• Your use cases are straightforward  
• You value explicit, inspectable internals

## Wrapping Up

You do not need MediatR to get a clean request pipeline in ASP.NET Core.

With a small `HandlerPipeline<TRequest, TResponse>` and a couple of middleware classes like `ValidatorMiddleware`, you can keep your architecture composable, testable, and easy to reason about.

Most importantly, your team can make this decision intentionally instead of by habit.

If your app needs only a focused request pipeline, this approach is often enough.

For related topics, check out [How to implement CQRS without MediatR](https://thecodeman.net/posts/how-to-implement-cqrs-without-mediatr) and [MediatR Pipeline Behavior](https://thecodeman.net/posts/mediatr-pipeline-behavior).

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

<!--END-->
