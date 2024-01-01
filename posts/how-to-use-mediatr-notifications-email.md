---
newsletterTitle: "#31 Stefan's Newsletter"
title: "How to use MediatR Notifications email"
subtitle: "MediatR is a popular open-source library for implementing the Mediator pattern in .NET applications. It provides a simple and elegant way to handle communication between different parts of an application by encapsulating the logic of sending and handling messages."
readTime: "Read Time: 5 minutes"
date: "Sep 11 2023"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Discover the intricacies of MediatR Notifications in .NET in Stefan Đokić's comprehensive guide. Learn to implement a robust notification system in ASP.NET Core using MediatR, perfect for scenarios like alerting emergency services. The newsletter covers creating notification types, building notification handlers, and the publishing process, complete with code examples and practical tips. Ideal for developers seeking to enhance application responsiveness and inter-component communication in .NET environments."
---

&nbsp;  
&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### Today's issue is sponsored by [Packt](https://www.packtpub.com/)
&nbsp;  
##### Create, deploy, and scale production-grade microservices-based applications effortlessly. Dive into the world of Spring Boot 3, Java 17, and Spring Cloud 2022 with this [updated guide](https://packt.link/LdTMQ).
##### Explore Spring's AOT module, observability, distributed tracing, and Helm 3 for Kubernetes packaging.
##### Begin with Docker Compose, advance to Kubernetes with Istio, and delve into resilience, reactivity, and API documentation with OpenAPI.
##### Discover Netflix Eureka, Spring Cloud Gateway, Prometheus, Grafana, and the EFK stack for monitoring.
&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  
##### **MediatR** is a popular open-source library for implementing the Mediator pattern in .NET applications. It provides a simple and elegant way to handle communication between different parts of an application by encapsulating the logic of sending and handling messages.
&nbsp;  
##### It is often used in **CQRS (Command Query Responsibility Segregation) architectures** but is not limited to such applications. Essentially, you create simple C# classes for your commands and queries, and then create handler classes that handle those commands and queries. You can then use MediatR to dispatch these requests to their respective handlers.
&nbsp;  
##### MediatR also brings implementations of other patterns.
##### With MediatR, it is possible to implement a notification system.
&nbsp;  
##### Let's see how to implement MediatR Notifications feature in ASP.NET Core using C#.
&nbsp;  
&nbsp;  
### Example
&nbsp;  
&nbsp;  
##### Let's say that you have a system for alarming certain services, such as the police station, firefighters and emergency services, in case of an alarm or an accident.
&nbsp;  
##### You need to implement the **publish-subscriber connection** , so that every time an accident happens, all parties are notified and can react.
&nbsp;  
##### In that case, you will send an object that contains all the necessary information about the accident, for example, the location.
&nbsp;  
##### Let's create that class:
```csharp

public class AccidentNotificaiton : INotification
{
    public AccisdentNotification(string location)
    {
        Location = location;
    }

    public string Location { get; }
}
```
&nbsp;  
##### **AccidentNotification** implements the **INotification** interface that comes from the MediatR namespace and thus allows you to create a notification that will move through the system.
&nbsp;  
&nbsp;  
### Notification Handlers
&nbsp;  
&nbsp;  
##### **Who will receive that notification?**
&nbsp;  
##### Well, all those who register receive it - more precisely, every service that will be interested in that notification. They represent **subscribers** .
&nbsp;  
##### Here's how you can implement a subscriber, more precisely a notification handler:
```csharp

public class PoliceSubscriber : INotificationHandler<AccidentNotification>
{
    public async Task Handle(AccidentNotification notification,
                             CancellationToken cancellationToken)
    {
        Console.WriteLine();
        Console.WriteLine($"The police service received a notificaiton about the accident");
        Console.WriteLine($"Police were dispatched to the location: {notification.Location}");
    }
}
```
##### **INotificationHandler** is an interface also from the MediatR namespace that accepts the notification type, in this case, I want the police station to accept accident notifications.
&nbsp;  
##### Only one **Handle method** is implemented, with notification and cancellation token parameters. This is identical to the IRequest implementation method (the one we use in CQRS).
&nbsp;  
##### In the end, the subscriber performs his part of the work, in this case, I print on the console what happens next.
&nbsp;  
##### In this way, you can add as many handlers as you need. Who else needs to know that an accident has happened?
&nbsp;  
&nbsp;  
### Publish Notification
&nbsp;  
&nbsp;  
##### When such an accident occurs, it is necessary to inform all parties. More precisely, it is necessary for the publisher to send a notification to all subscribers.
&nbsp;  
##### How can you do that?
&nbsp;  
##### Well, very simple.
```csharp

[HttpPost("notify-accident")]
public async Task<IActionResult> NotifyAboutAccident(AccidentNotification notification)
{
    await _mediator.Publish(notification);

    return Ok();
}
```
##### As with IRequest when we call .Send() over MediatR, here I call the **Publish** method with the passed notification.
&nbsp;  
##### MediatR will look at all handlers that handle that type of notification and send them a notification.
&nbsp;  
&nbsp;  
### Services Configuration
&nbsp;  
&nbsp;  
##### You just need to register MediatR using the following call:
```csharp

builder.Services
       .AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
```
&nbsp;  
&nbsp;  
### Result:
&nbsp;  
&nbsp;  
![Result](/images/blog/posts/how-to-use-mediatr-notifications-email/result.png)
##### And that's it.
&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  
##### In today's Newsletter issue, I showed you how to implement MediatR Notification in ASP.NET Core.
&nbsp;  
##### On the example, I showed you that it is necessary to implement the type of notification that we want to exchange, the handlers that receive and handle the notification (subscribers), and how to publish the notification (publisher).
&nbsp;  
##### You can check Sending MediatR Notifications in Parallel.
&nbsp;  
##### You can go to the project's [GitHub repository](https://github.com/StefanTheCode/MediatRNotifications) and get acquainted with the details.
&nbsp;  
##### That's all from me today.