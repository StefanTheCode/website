---
title: "MediatR Pipeline Behavior"
subtitle: "MediatR is a popular library in .NET used for implementing the Mediator pattern. It helps in reducing coupling between components..."
date: "Jan 1 2024"
category: ".NET"
readTime: "Read Time: 3 minutes"
meta_description: "Explore the concept of MediatR Pipeline Behavior in .NET in this insightful blog post. Learn how to implement cross-cutting concerns like logging and validation in your MediatR requests. Understand the creation of pipeline behaviors, their registration, and practical applications. This guide is perfect for .NET developers looking to enhance application monitoring and debugging while adhering to best coding practices."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">- If you have ever used **Postman** to debug and write tests for your REST APIs, guess what, those are the same concepts you need to know for ** <a href="https://blog.postman.com/testing-grpc-apis-with-postman/" style="color: #a5b4fc; text-decoration: underline;">writing tests for your gRPC requests in Postman</a> ** For more info about gRPC, they created a great beginner article ** <a href="https://blog.postman.com/what-is-grpc/" style="color: #a5b4fc; text-decoration: underline;">here</a> **.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers.<br/><br/><a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</p>
</div>


## [Watch YouTube video here](https://youtu.be/km4W27ggQzY?si=hRtPd4ZrXP79Q6uF)
![Watch YouTube video](/images/blog/posts/mediatr-pipeline-behavior/youtube.png)

## The Background
MediatR is a popular library in .NET used for implementing the Mediator pattern. It helps in reducing coupling between components and makes it easier to manage code by sending requests to the appropriate handlers.
**A Pipeline Behavior in MediatR** is a concept that allows developers to implement cross-cutting concerns (like logging, validation, etc.) for MediatR requests.
How to implement it?
Let's take a look deeply!
## Define a Pipeline Behavior Interface
This interface represents a pipeline behavior that will be applied to every request and its corresponding response.
MediatR provides an interface called **IPipelineBehavior<TRequest, TResponse>** that you can implement.
```csharp
public interface IPipelineBehavior<TRequest, TResponse>
{
    Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next);
}
```

## Implement the Pipeline Behavior
You create a class that implements the **IPipelineBehavior<TRequest, TResponse> interface** .
This class will contain the logic that you want to apply to requests.
For example, a simple logging behavior:
```csharp
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
    {
        // Pre-processing
        _logger.LogInformation($"Handling {typeof(TRequest).Name}");

        var response = await next();

        // Post-processing
        _logger.LogInformation($"Handled {typeof(TResponse).Name}");

        return response;
    }
}
```

The LoggingBehavior<TRequest, TResponse> in a MediatR pipeline will automatically log information both before and after each request is processed.
When a request is made, it logs the type of request being handled, then passes control to the next handler in the pipeline.
After the request is handled, it logs the type of response generated, providing an audit trail of the requests and responses within the application.
## Register the Pipeline Behavior
In the startup configuration of your application, register your pipeline behavior so that MediatR knows to apply it to requests.
```csharp
services.AddTransient(typeof(IPipelineBehavior<, ), typeof(LoggingBehavior<, )));
```

With this setup, every time a MediatR request is made, it will go through this LoggingBehavior (or any other behavior you define) before reaching the actual request handler.
This allows you to add additional processing like logging, validation, or even exception handling in a clean, reusable way.
## How and when is it used?
Let's say we have a basic MediatR request defined:
```csharp
public class MyRequest : IRequest<MyResponse>
{
    // Request properties
}

public class MyRequestHandler : IRequestHandler<MyRequest, MyResponse>
{
    public async Task<MyResponse> Handle(MyRequest request, CancellationToken cancellationToken)
    {
        // Handle the request
        return new MyResponse();
    }
}
```

When you call **_mediator.Send(new MyRequest())** , MediatR will process this request through the pipeline behavior (e.g., LoggingBehavior) before it reaches MyRequestHandler.
This allows you to add common logic, like logging, validation, or error handling, in a centralized way without cluttering the business logic in the handlers.
## Wrapping up
The LoggingBehavior<TRequest, TResponse> in MediatR for .NET enhances application [monitoring](https://thecodeman.net/posts/how-to-monitor-dotnet-applications-in-production) and debugging by consistently logging all request and response types.
This approach promotes cleaner code through separation of concerns, adheres to best practices like the Single Responsibility Principle, and offers ease of integration and reusability across the application.

If you want to implement CQRS with or without MediatR, check out [How to implement CQRS without MediatR](https://thecodeman.net/posts/how-to-implement-cqrs-without-mediatr). For a fully custom pipeline without any external dependencies, see [Build Your Own MediatR: A Lightweight Handler Pipeline](https://thecodeman.net/posts/build-your-own-mediatr-lightweight-handler-pipeline-aspnet-core).

## Frequently Asked Questions

### What is MediatR Pipeline Behavior?

MediatR Pipeline Behavior is a feature that lets you add cross-cutting concerns (logging, validation, caching, error handling) to your request pipeline without modifying individual handlers. You implement `IPipelineBehavior<TRequest, TResponse>` and register it in DI. Every request that passes through MediatR will execute your behavior before and after the handler.

### How do I register a Pipeline Behavior in .NET?

Register your pipeline behavior as an open generic in your DI container: `services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>))`. MediatR will automatically discover and execute it for every request/response pair. You can register multiple behaviors — they execute in the order they are registered.

### Can I have multiple Pipeline Behaviors?

Yes. You can chain multiple behaviors like logging, validation, and caching. Each behavior calls `next()` to pass execution to the next behavior or the final handler. The execution order matches the registration order in your DI container.

That's all from me today - first day of the year.
See ya on the next Monday coffee.
P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).


---

Want more design patterns with real-world examples? My ebook [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) covers 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with hands-on C# code you can use right away. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

<!--END-->

