---
title: "How to use MediatR Notifications"
subtitle: "MediatR is a popular open-source library for implementing the Mediator pattern in .NET applications..."
readTime: "Read Time: 3 minutes"
date: "Feb 10 2025"
category: ".NET"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Discover the intricacies of MediatR Notifications in .NET in Stefan Đokić's comprehensive guide. Learn to implement a robust notification system in ASP.NET Core using MediatR, perfect for scenarios like alerting emergency services. "
---

&nbsp;  
&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • Level up your projects with FREE Clean Architecture template created by Milan Jovanovic, trusted by over 10,000 developers. Packed with features like CQRS, JWT authentication, Domain Events, and Docker support, it’s everything you need to start strong. [Download Now](https://www.milanjovanovic.tech/templates/clean-architecture?utm_source=stefan&utm_medium=website)

<!--START-->

&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  
##### MediatR is a popular open-source library for implementing the Mediator pattern in .NET applications. It provides a simple and elegant way to handle communication between different parts of an application by encapsulating the logic of sending and handling messages.
&nbsp;  
 
##### It is often used in [CQRS (Command Query Responsibility Segregation)](https://thecodeman.net/posts/how-to-implement-cqrs-without-mediatr?utm_source=website) architectures but is not limited to such applications. Essentially, you create simple C# classes for your commands and queries, and then create handler classes that handle those commands and queries. You can then use MediatR to dispatch these requests to their respective handlers.
&nbsp;  
 
##### MediatR also brings implementations of other patterns.
##### With MediatR, it is possible to implement a notification system.
&nbsp;  
 
##### Let's see how to implement MediatR Notifications feature in ASP.NET Core using C#.

&nbsp;  
&nbsp;  
### Scenario
&nbsp;  
&nbsp;  
##### A practical real-world scenario for using MediatR notifications in .NET 9 is a User Registration System, where multiple services need to react to a new user registration event without tightly coupling them.
&nbsp;  

##### You are building a user management system where:
&nbsp;  

##### When a new user registers, the system needs to:
##### 1. Send a welcome email.
##### 2. Log the new registration for auditing.
##### 3. Notify an analytics service.
&nbsp;  
&nbsp;  
### Step-by-Step Implementation in .NET 9
&nbsp;  
&nbsp;  
##### **1. Define the Notification Event**
&nbsp;  
##### When a user registers, we trigger an event using INotification:
```csharp

using MediatR;

public class UserRegisteredNotification : INotification
{
    public string UserId { get; }
    public string Email { get; }

    public UserRegisteredNotification(string userId, string email)
    {
        UserId = userId;
        Email = email;
    }
}
```
##### **2. Create Handlers for Different Actions**
&nbsp;  
##### Each service subscribes to this event independently.
&nbsp;  
##### ***Handler 1: Sending Welcome Email***
```csharp

public class SendWelcomeEmailHandler : INotificationHandler<UserRegisteredNotification>
{
    private readonly ILogger<SendWelcomeEmailHandler> _logger;

    public SendWelcomeEmailHandler(ILogger<SendWelcomeEmailHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(UserRegisteredNotification notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"Sending welcome email to {notification.Email}");
        // Simulate sending email logic
        return Task.CompletedTask;
    }
}
```
&nbsp;  
##### ***Handler 2: Logging the Event***
```csharp

public class LogUserRegistrationHandler : INotificationHandler<UserRegisteredNotification>
{
    private readonly ILogger<LogUserRegistrationHandler> _logger;

    public LogUserRegistrationHandler(ILogger<LogUserRegistrationHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(UserRegisteredNotification notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"User registered: {notification.UserId}, Email: {notification.Email}");
        return Task.CompletedTask;
    }
}
```
&nbsp;  
##### ***Handler 3: Notify Analytics Service***
```csharp

public class AnalyticsServiceHandler : INotificationHandler<UserRegisteredNotification>
{
    private readonly ILogger<AnalyticsServiceHandler> _logger;

    public AnalyticsServiceHandler(ILogger<AnalyticsServiceHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(UserRegisteredNotification notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"Analytics: Tracking new user registration for {notification.UserId}");
        return Task.CompletedTask;
    }
}
```
&nbsp;  
##### **3. Program.cs - Publish the Notification + Configure MediatR**
&nbsp;  
##### When a user registers, we publish the notification:

```csharp

var builder = WebApplication.CreateBuilder(args);

// Register MediatR
builder.Services.AddMediatR(Assembly.GetExecutingAssembly());

var app = builder.Build();

// Minimal API Endpoint for User Registration
app.MapPost("/register", async (UserRegistrationRequest request, IMediator mediator) =>
{
    var userId = Guid.NewGuid().ToString();

    // Simulating user registration (e.g., saving to database)
    await mediator.Publish(new UserRegisteredNotification(userId, request.Email));

    return Results.Ok(new { Message = "User registered successfully!", UserId = userId });
});

app.Run();

// DTO for user registration
public record UserRegistrationRequest(string Email);
```
&nbsp;  
##### Excellent! 
&nbsp;  
##### We have implemented Notification System with MediatR.

&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  
##### **Why is MediatR useful here?**
&nbsp;  

##### ✅ **Decoupled Components** → Email, Logging, and Analytics Services are independent.
##### ✅ **Scalability** → New handlers (e.g., SMS notifications) can be added easily.
##### ✅ **Testability** → Each handler can be tested in isolation.
&nbsp;  

##### This approach ensures that each service only cares about its job without affecting others. By using MediatR notifications, you build a flexible, scalable, and maintainable architecture for handling events in .NET applications.

##### That's all from me today. 

##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

<!--END-->