---
newsletterTitle: "#48 Stefan's Newsletter"
title: "MediatR Pipeline Behavior"
subtitle: "MediatR is a popular library in .NET used for implementing the Mediator pattern. It helps in reducing coupling between components..."
readTime: "Read Time: 3 minutes"
date: "Jan 1 2024"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Explore the concept of MediatR Pipeline Behavior in .NET in this insightful blog post. Learn how to implement cross-cutting concerns like logging and validation in your MediatR requests. Understand the creation of pipeline behaviors, their registration, and practical applications. This guide is perfect for .NET developers looking to enhance application monitoring and debugging while adhering to best coding practices."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;
##### • If you have ever used **Postman** to debug and write tests for your REST APIs, guess what, those are the same concepts you need to know for ** [writing tests for your gRPC requests in Postman](https://blog.postman.com/testing-grpc-apis-with-postman/) **
##### For more info about gRPC, they created a great beginner article ** [here](https://blog.postman.com/what-is-grpc/) **.
&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp;  
##### MediatR is a popular library in .NET used for implementing the Mediator pattern. It helps in reducing coupling between components and makes it easier to manage code by sending requests to the appropriate handlers.
&nbsp;  
##### **A Pipeline Behavior in MediatR** is a concept that allows developers to implement cross-cutting concerns (like logging, validation, etc.) for MediatR requests.
&nbsp;  
##### How to implement it?
&nbsp;  
##### Let's take a look deeply!
&nbsp;  
&nbsp;  
### Define a Pipeline Behavior Interface&nbsp;
&nbsp;  
&nbsp;  
##### This interface represents a pipeline behavior that will be applied to every request and its corresponding response.
&nbsp;  
##### MediatR provides an interface called **IPipelineBehavior<TRequest, TResponse>** that you can implement.
```csharp

public interface IPipelineBehavior<TRequest, TResponse>
{
    Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next);
}
```

&nbsp;  
### Implement the Pipeline Behavior&nbsp;
&nbsp;  
&nbsp;  
##### You create a class that implements the **IPipelineBehavior<TRequest, TResponse> interface** .
&nbsp;  
##### This class will contain the logic that you want to apply to requests.&nbsp;
&nbsp;  
##### For example, a simple logging behavior:
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

##### The LoggingBehavior<TRequest, TResponse> in a MediatR pipeline will automatically log information both before and after each request is processed.
&nbsp;  
##### When a request is made, it logs the type of request being handled, then passes control to the next handler in the pipeline.
&nbsp;  
##### After the request is handled, it logs the type of response generated, providing an audit trail of the requests and responses within the application.
&nbsp;  
&nbsp;  
### Register the Pipeline Behavior&nbsp;
&nbsp;  
&nbsp;  
##### In the startup configuration of your application, register your pipeline behavior so that MediatR knows to apply it to requests.
```csharp

services.AddTransient(typeof(IPipelineBehavior<, ), typeof(LoggingBehavior<, )));
```

##### With this setup, every time a MediatR request is made, it will go through this LoggingBehavior (or any other behavior you define) before reaching the actual request handler.
&nbsp;  
##### This allows you to add additional processing like logging, validation, or even exception handling in a clean, reusable way.
&nbsp;  
&nbsp;  
### How and when is it used?
&nbsp;  
&nbsp;  
##### Let's say we have a basic MediatR request defined:
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

##### When you call **_mediator.Send(new MyRequest())** , MediatR will process this request through the pipeline behavior (e.g., LoggingBehavior) before it reaches MyRequestHandler.
&nbsp;  
##### This allows you to add common logic, like logging, validation, or error handling, in a centralized way without cluttering the business logic in the handlers.
&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  
##### The LoggingBehavior<TRequest, TResponse> in MediatR for .NET enhances application monitoring and debugging by consistently logging all request and response types.
&nbsp;  
##### This approach promotes cleaner code through separation of concerns, adheres to best practices like the Single Responsibility Principle, and offers ease of integration and reusability across the application.
&nbsp;  
##### That's all from me today - first day of the year.
&nbsp;  
##### See ya on the next Monday coffee.
&nbsp;
##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).