---
title: "Server-Sent Events in .NET 10 - Real-Time Streaming in .NET"
subtitle: "Learn how to implement Server-Sent Events (SSE) in .NET 10 with a real-world Order Tracking example. Complete ASP.NET Core code, production tips, and performance considerations included."
readTime: "Read Time: 7 minutes"
date: "Feb 23 2026"
category: ".NET"
meta_description: "Learn how to implement Server-Sent Events (SSE) in .NET 10 with a real-world Order Tracking example. Complete ASP.NET Core code, production tips, and performance considerations included."
---

<!--START-->
##### This issue is **self-sponsored**.
##### By supporting my work and purchasing my products, you directly help me keep this newsletter free and continue creating high-quality, practical .NET content for the community. 
&nbsp;

##### Thank you for the support 🙌  
&nbsp;

##### P.S. I’m currently building a new course, [Pragmatic .NET Code Rules](https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website&utm_campaign=020226), focused on creating a predictable, consistent, and self-maintaining .NET codebase using .editorconfig, analyzers, Visual Studio code cleanup, and CI enforcement.
&nbsp;

##### The course is available for pre-sale until the official release, with early-bird pricing for early adopters.
##### You can find all the details [here](https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website&utm_campaign=020226).

&nbsp;  
&nbsp;  
### Introduction: Real-Time in Modern ASP.NET Core Applications  
&nbsp;  
&nbsp;
##### Real-time features are no longer a luxury in modern web applications. Users expect live updates when they place an order, monitor a background job, or track delivery progress. As .NET developers, we often reach for WebSockets or SignalR the moment someone says “real-time.”
&nbsp;
##### But here’s the architectural truth: if your system only needs server-to-client streaming, WebSockets might be unnecessary complexity.
&nbsp;
##### With .NET 10, ASP.NET Core now provides first-class support for Server-Sent Events (SSE) via `Results.ServerSentEvents`. This makes real-time streaming in ASP.NET Core simpler, cleaner, and more aligned with HTTP semantics.
&nbsp;
##### In this article, you’ll learn what Server-Sent Events are, how they work in .NET 10, and how to implement a real-world, real-time order tracking system using modern ASP.NET Core patterns.

&nbsp;  
&nbsp;  
### What Are Server-Sent Events (SSE) in .NET 10?
&nbsp;  
&nbsp;  
##### **Server-Sent Events (SSE)** are a web standard that allows a server to push updates to a browser over a single long-lived HTTP connection. The response uses the `text/event-stream` content type and continuously sends messages as events occur.
&nbsp;  
##### Unlike WebSockets, SSE is unidirectional. Data flows from the server to the client. There is no full-duplex communication channel. This constraint is actually a benefit in many systems because it reduces architectural complexity.
&nbsp;  

##### In practical terms, SSE in ASP.NET Core allows you to stream an `IAsyncEnumerable<T>` directly to a browser using native HTTP infrastructure. With .NET 10, this is now handled by `Results.ServerSentEvents`, which abstracts away manual header configuration, formatting, and flushing logic.
&nbsp;  

##### If your scenario involves streaming order updates, job progress, metrics, logs, or notifications, Server-Sent Events in .NET 10 may be the most pragmatic solution.

&nbsp;  
&nbsp;  
### Why Use Server-Sent Events Instead of WebSockets?
&nbsp;  
&nbsp;  

##### In real-world enterprise systems, complexity has a cost. WebSockets introduce connection upgrades, bidirectional state management, additional infrastructure considerations, and often external libraries like SignalR.
&nbsp;  
 
##### If your system does not require bidirectional communication, adding WebSockets may be architectural overengineering.
&nbsp;  
 
##### **Server-Sent Events operate entirely over standard HTTP**. There is no upgrade handshake. Browsers support SSE natively via the EventSource API and automatically reconnect when connections drop. 
&nbsp;  

##### This makes SSE in ASP.NET Core particularly attractive for cloud environments and reverse proxy setups.
&nbsp;  
 
##### For use cases like order tracking, background processing updates, or deployment status streaming, SSE provides a cleaner and more maintainable solution.

&nbsp;  
&nbsp;  
### Real-World Example: Real-Time Order Tracking in ASP.NET Core
&nbsp;  
&nbsp;  

##### Let’s implement a real-time order tracking system using Server-Sent Events in .NET 10.
&nbsp;  
 
##### Imagine a customer places an order. 
&nbsp;  

##### Behind the scenes, multiple asynchronous operations occur: payment validation, packaging, shipping, and delivery confirmation. 
&nbsp;  

##### Instead of polling the backend every few seconds, the frontend subscribes to a streaming endpoint and receives updates instantly.
&nbsp;  
 
##### We begin with a simple domain model representing order status changes.

```csharp
public enum OrderStatus
{
    Created,
    PaymentConfirmed,
    Packed,
    Shipped,
    OutForDelivery,
    Delivered
}

public sealed record OrderStatusUpdate(
    Guid OrderId,
    OrderStatus Status,
    DateTime Timestamp);
```

&nbsp;  
##### Using a record ensures immutability and clean serialization. In a real production system, these updates might originate from a background service, a message broker, or domain events inside your modular monolith.

&nbsp;  
&nbsp;  
### Building a Streaming Infrastructure with Channels
&nbsp;  
&nbsp;  

##### To support real-time streaming in .NET 10, we need a mechanism that decouples event producers from subscribers. 
&nbsp;  

##### `System.Threading.Channels` is ideal for this scenario.
&nbsp;  
 
##### Channels provide high-performance asynchronous pipelines that integrate seamlessly with `IAsyncEnumerable<T>`, which is exactly what Results.ServerSentEvents expects.
&nbsp;  
 
##### Here’s a simple streaming service:

```csharp
public sealed class OrderStreamService
{
    private readonly ConcurrentDictionary<Guid, Channel<OrderStatusUpdate>> _streams = new();

    public ChannelReader<OrderStatusUpdate> Subscribe(Guid orderId)
    {
        var channel = Channel.CreateUnbounded<OrderStatusUpdate>();
        _streams[orderId] = channel;
        return channel.Reader;
    }

    public async Task PublishAsync(OrderStatusUpdate update)
    {
        if (_streams.TryGetValue(update.OrderId, out var channel))
        {
            await channel.Writer.WriteAsync(update);
        }
    }

    public void Unsubscribe(Guid orderId)
    {
        if (_streams.TryRemove(orderId, out var channel))
        {
            channel.Writer.TryComplete();
        }
    }
}
```

&nbsp;  

##### This service allows any part of the system to publish order updates without knowing who is listening. The SSE endpoint simply subscribes and streams events as they arrive.
&nbsp;  
##### This pattern fits naturally into Clean Architecture, Vertical Slice Architecture, or a Modular Monolith.

&nbsp;  
&nbsp;  
### Implementing Server-Sent Events in .NET 10 Using Results.ServerSentEvents
&nbsp;  
&nbsp;  

##### Now we implement the streaming endpoint using the modern .NET 10 approach.

```csharp
app.MapGet("/orders/{orderId:guid}/stream", (
    Guid orderId,
    OrderStreamService streamService,
    CancellationToken cancellationToken) =>
{
    var reader = streamService.Subscribe(orderId);

    return Results.ServerSentEvents(
        reader.ReadAllAsync(cancellationToken),
        eventType: "order-update");
});
```
&nbsp;  
##### This is the key difference in .NET 10.
&nbsp;  
##### `Results.ServerSentEvents` automatically: 
##### • Sets the `Content-Type` to text/event-stream
##### • Serializes each item to JSON
##### • Formats SSE messages correctly
##### • Flushes responses properly
##### • Handles cancellation tokens
##### • Manages the HTTP streaming lifecycle
&nbsp;  
##### In earlier versions of ASP.NET Core, developers had to manually write headers, format strings with data: prefixes, and call `FlushAsync`. 
&nbsp;  

##### In .NET 10, this is now built into the framework.
&nbsp;  
 
##### This makes real-time streaming in ASP.NET Core significantly cleaner and less error-prone.

&nbsp;  
&nbsp;  
### Simulating Backend Order Processing
&nbsp;  
&nbsp;  

##### To demonstrate real-time updates, we can simulate asynchronous order processing.
```csharp

app.MapPost("/orders/{orderId:guid}/simulate", async (
    Guid orderId,
    OrderStreamService streamService) =>
{
    var statuses = Enum.GetValues<OrderStatus>();

    foreach (var status in statuses)
    {
        await Task.Delay(2000);

        await streamService.PublishAsync(new OrderStatusUpdate(
            orderId,
            status,
            DateTime.UtcNow));
    }

    return Results.Ok("Order simulation completed.");
});
```
&nbsp;  

##### Each status update is published to the channel. The SSE endpoint streams updates immediately to connected clients. There is no polling and no additional messaging infrastructure required.

&nbsp;  
&nbsp;  
### Testing Server-Sent Events in .NET 10 Using Postman
&nbsp;  
&nbsp;  

##### When building real-time streaming features with **Server-Sent Events (SSE) in .NET 10**, testing becomes slightly different compared to traditional REST endpoints.
&nbsp;  
 
##### Unlike a typical GET request that returns a JSON response and closes the connection, an SSE endpoint:
##### • Keeps the HTTP connection open
##### • Streams data continuously
##### • Sends events over time
##### • Does not complete immediately
&nbsp;  
##### This means we must test it differently, and **Postman supports this perfectly**, as long as you configure it correctly.
&nbsp;  
 
##### In this chapter, we’ll test both:
##### • The POST endpoint that simulates order processing
##### • The GET SSE endpoint that streams real-time updates
&nbsp;  

#### Testing the POST Simulation Endpoint in Postman
&nbsp;  

##### First, we need to trigger the backend processing.
&nbsp;  
 
##### This endpoint simulates order status transitions and publishes events into our streaming pipeline.
&nbsp;  

##### **Step 1 - Create a New Request in Postman**
##### • Method: POST
##### • URL: `https://localhost:7060/orders/{orderId}/simulate`
##### • Replace {orderId} with a real GUID.

&nbsp;  
##### You don’t need a request body for this example.
&nbsp;  
##### **Step 2 - Send the Request**
&nbsp;  
##### Click **Send**.
&nbsp;  
 
##### You should receive: *"Order simulation completed."*

![Postman post](/images/blog/posts/server-sent-event-in-dotnet/postman-post.png)

&nbsp;  

##### But here’s what actually happens in the background:
##### • The endpoint starts publishing events
##### • Every 2 seconds a new OrderStatusUpdate is emitted
##### • These events will be streamed through the SSE endpoint
&nbsp;  
##### At this moment, no client is connected yet, so nothing is visible.
&nbsp;  
 
##### Now we test the real-time part.
&nbsp;  

#### Testing the GET SSE Endpoint in Postman
&nbsp;  
 
##### Testing Server-Sent Events in Postman is slightly different from normal APIs.
&nbsp;  
 
##### Because the connection remains open, you must:
##### • Use GET
##### • Do not expect the request to complete
##### • Observe streaming output in real time
&nbsp;  

##### **Step 1 - Create a New GET Request**
##### • Method: GET
##### • URL: `https://localhost:7060/orders/{orderId}/stream`
&nbsp;  

##### **Step 2 - Send the Request**
 
##### Click Send.
&nbsp;  
 
##### Postman will not complete the request immediately.
&nbsp;  
 
##### Instead, you will start seeing streaming data like:
![Postman event](/images/blog/posts/server-sent-event-in-dotnet/postman-event.gif)
&nbsp;  

##### The request stays open while events are being pushed.

&nbsp;  
&nbsp;  
### Production Considerations for Server-Sent Events in ASP.NET Core
&nbsp;  
&nbsp;  

##### When implementing Server-Sent Events in production, you must consider infrastructure behavior. 
&nbsp;  

##### Reverse proxies such as Nginx, Traefik, or Azure Application Gateway may close idle connections if not configured properly. Ensuring appropriate timeout settings is critical.
&nbsp;  
 
##### In multi-instance deployments, each application instance must receive the same events. 
&nbsp;  

##### In that scenario, a distributed event bus such as Redis pub/sub or a message broker should broadcast updates to all nodes.
&nbsp;  
 
##### Monitoring concurrent open connections is also important. Each SSE client maintains a persistent HTTP connection. 
&nbsp;  

##### While lightweight compared to WebSockets, these connections still consume resources and must be monitored in high-traffic environments.
&nbsp;  

&nbsp;  
&nbsp;  
### When Server-Sent Events Are Not the Right Choice
&nbsp;  
&nbsp;  

##### Server-Sent Events are not suitable when bidirectional communication is required. Real-time chat systems, multiplayer gaming, collaborative editing tools, or IoT command systems require two-way communication and are better served by WebSockets or SignalR.
&nbsp;  
##### SSE excels when the server is the sole source of truth, pushing updates to clients.

&nbsp;  
&nbsp;  
### Wrapping Up: Server-Sent Events in .NET 10 as a Pragmatic Engineering Choice
&nbsp;  
&nbsp;  

##### With the introduction of `Results.ServerSentEvents`, **Server-Sent Events in .NET 10** have become a first-class feature in ASP.NET Core.
&nbsp;  
 
##### They offer a clean, HTTP-native solution for real-time streaming without the complexity of WebSockets. For systems that require live updates, order tracking, job progress streaming, or monitoring dashboards, SSE provides a pragmatic and production-ready approach.
&nbsp;  
 
##### Before adding WebSocket infrastructure for your next project, ask yourself whether you truly need bidirectional communication. 
&nbsp;  

##### If not, Server-Sent Events in ASP.NET Core may be the most elegant and maintainable solution.
&nbsp;  
 
##### Real-time does not have to mean complex.
&nbsp;  
 
##### Sometimes, the simplest protocol is the most powerful one.
&nbsp;  

##### That's all from me today. 
&nbsp;  

##### Would you like to record a YouTube video doing this?
&nbsp;  

##### Find the source code on [the GitHub repo](https://github.com/thecodeman/server-sent-events-demo).
&nbsp;  

##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->