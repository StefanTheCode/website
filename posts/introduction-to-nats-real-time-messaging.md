---
title: "A Friendly Introduction to NATS: Real-Time Messaging for .NET Developers"
subtitle: "Learn how to build a high-performance event bus in .NET using NATS. This guide covers Pub/Sub, queues, request-reply, distributed messaging, reconnection strategies, and production-ready code examples."
date: "December 15 2025"
category: ".NET"
meta_description: "Learn how to build a high-performance event bus in .NET using NATS. This guide covers Pub/Sub, queues, request-reply, distributed messaging, reconnection strategies, and production-ready code examples."
---

<!--START-->
##### This issue is made possible thanks to JetBrains, who help keep this newsletter free for everyone. A huge shout-out to them for their support of our community. Let's thank them by entering the link below.
&nbsp;  
##### Struggling with slow builds, tricky bugs, or hard-to-understand performance issues?
##### [dotUltimate](https://www.jetbrains.com/dotnet/?utm_source=newsletter_the_code_man&utm_medium=cpc&utm_campaign=dul_promo) fixes all of that.
##### It’s the all-in-one toolbox for serious .NET developers.
&nbsp;  
##### [👉 Upgrade your .NET workflow.](https://www.jetbrains.com/dotnet/?utm_source=newsletter_the_code_man&utm_medium=cpc&utm_campaign=dul_promo)
&nbsp;

&nbsp;  
&nbsp;  
### Did you hear about NATS?
&nbsp;  
&nbsp;  

##### Seriously - **have you**?
&nbsp;  

##### Most .NET developers haven’t, and that’s a shame because NATS solves a completely different category of messaging problems than the tools we usually reach for.
&nbsp;  
 
##### When we think “messaging,” the same names pop up:
&nbsp;  
 
##### • RabbitMQ
##### • Azure Service Bus
##### • Kafka
##### • Redis Pub/Sub
&nbsp;  

##### They’re all great, and they all have their place...
&nbsp;  

##### But they’re not the whole story.
&nbsp;  
 
##### There’s an entire class of systems where those brokers either become too slow, too heavy, or too complex.
&nbsp;  
 
##### And that’s exactly where **NATS** appears as a surprisingly simple answer.

&nbsp;  
&nbsp;  
### So What Makes NATS Different?
&nbsp;  
&nbsp;

##### While traditional brokers focus on features like durability, transactions, partitions, advanced routing, and so on…
&nbsp;
 
##### NATS focuses on something else entirely:
&nbsp;
 
##### 👉 Tiny latency
##### 👉 Huge throughput
##### 👉 Simple operation
##### 👉 Lightweight footprint
##### 👉 Scales like crazy
##### 👉 Works beautifully with distributed edge devices
&nbsp;
 
##### If your system needs:
&nbsp;

##### • thousands of small messages per second
##### • real-time reactions
##### • low-latency communication
##### • services loosely connected with zero overhead
##### • resilient connections over shaky networks
##### • tiny agents that can run anywhere 
&nbsp;

##### …then NATS suddenly becomes very interesting.

&nbsp;  
&nbsp;  
### A Different Kind of Problem: Real-Time Smart Agriculture
&nbsp;  
&nbsp;  

##### Let me give you a scenario where NATS actually makes perfect sense.
&nbsp;  
 
##### Imagine a modern agriculture system spread across a huge field.
&nbsp;  

##### You have:
&nbsp;  

##### • soil moisture sensors
##### • small climate sensors
##### • drone stations
##### • irrigation controllers
##### • a dashboard
##### • and some lightweight AI logic that helps make decisions
&nbsp;  

##### These sensors send data every few hundred milliseconds.
&nbsp;  

##### Some devices drop offline.
##### Some reconnect.
##### Some flood the system with bursts of readings.
##### Some need instructions back immediately (“turn on irrigation now”).
&nbsp;  
 
##### It’s not a big “enterprise event bus” job.
&nbsp;  

##### It’s a **high-frequency, real-time, lightweight messaging challenge**.
&nbsp;  
 
##### And this is exactly the kind of system where RabbitMQ or Kafka start to feel too heavy and too slow.

&nbsp;  
&nbsp;  
### This Is Where NATS Fits Perfectly    
&nbsp;  
&nbsp;  

##### NATS is built for situations like this:
&nbsp;  

##### • Where messages are extremely frequent
##### • Where low latency really matters
##### • Where devices or services come and go
##### • Where you need both Pub/Sub and request-reply
##### • Where you want to scale easily without complexity
##### • Where you want something simple and fast, not a big distributed monster
&nbsp;  

##### If your message volume is small and you want durability or transactions, use RabbitMQ or Service Bus.
&nbsp;  
 
##### If you want big data analytics or huge event streams, Kafka is the king.
&nbsp;  
 
##### But if you need:
&nbsp;  

##### • **speed**
##### • **simplicity**
##### • **easy fan-out**
##### • **real-time messaging**
##### • **millions of events per second**
&nbsp;  

##### …that’s NATS territory. 
 
&nbsp;  
&nbsp;  
### Let’s Build Something in .NET
&nbsp;  
&nbsp;  

##### Here’s a realistic example using NATS for that smart agriculture system.
&nbsp;  
 
##### We’ll build:
&nbsp;  

##### • sensor simulators
##### • real-time analytics
##### • irrigation controllers (queue groups)
##### • device actuators
##### • and a request–reply endpoint
&nbsp;  

#### 1. Install the client
&nbsp;  

##### First, install the official .NET client:

```csharp

dotnet add package NATS.Client.Core
```

##### What’s happening here?
&nbsp;  

##### • NATS.Client.Core is the modern, high-performance NATS client for .NET.
##### • You’ll use NatsConnection from this package to publish and subscribe to messages.
&nbsp;  
  
#### 2.  Creating a Reusable NATS Connection
&nbsp;  
 
##### You generally want **one connection per service**, reused everywhere (like HttpClient)

```csharp

public static class NatsConnectionFactory
{
  public static NatsConnection Create()
  {
    return new NatsConnection(new NatsOpts
    {
      Url = "nats://localhost:4222",
      Name = "smart-agriculture",
      Reconnect = true,
      MaxReconnect = 10,
      ReconnectWait = TimeSpan.FromSeconds(1),
    });
  }
}
```

##### **Explanation**
&nbsp;  
##### • Url - where your NATS server lives (locally, Docker, Kubernetes, cloud, etc.).
##### • Name - just a human-friendly identifier, helpful in monitoring tools.
##### • Reconnect = true - NATS will try to reconnect if the connection drops (important for sensors on a weak network).
##### • MaxReconnect + ReconnectWait - limits and spreads out reconnection attempts so your app doesn’t go crazy if the server is temporarily down.
&nbsp;  
##### In a real app, you’d typically wrap this in DI as a singleton.
&nbsp;  

#### 3. Defining the Messages (Contracts)
&nbsp;  
 
##### Let’s define simple message types for:
&nbsp;  

##### • soil moisture readings, and
##### • irrigation commands.

```csharp

public record SoilMoistureReading(
  string SensorId,
  string FieldId,
  double MoisturePercent,
  DateTime TimestampUtc);
public record IrrigationCommand(
  string FieldId,
  bool EnableIrrigation,
  double TargetMoisturePercent,
  DateTime TimestampUtc);
```

##### **Explanation**
&nbsp;  
##### • SoilMoistureReading - a single reading from one sensor.
##### • FieldId - groups sensors by field/zone.
##### • IrrigationCommand - a decision: “turn irrigation on/off for this field, targeting X% moisture”.
##### • Records are convenient because:
 
##### 1. they’re immutable,
##### 2. serialize nicely,
##### 3. and clearly express intent.
&nbsp;  

#### 4. Simulating a Sensor (Publisher)
&nbsp;  
##### Now, let’s simulate a sensor sending readings every 500ms.

```csharp

public sealed class SoilSensorSimulator
{
  private NatsConnection _connection;
  private readonly string _sensorId;
  private readonly string _fieldId;
  private readonly Random _random = new();
  
  public SoilSensorSimulator(NatsConnection connection, string sensorId, string fieldId)
  {
    _connection = connection;
    _sensorId = sensorId;
    _fieldId = fieldId;
  }

  public async Task RunAsync(CancellationToken ct)
  {
    while (!ct.IsCancellationRequested)
    {
      var reading = new SoilMoistureReading(
      SensorId: _sensorId,
      FieldId: _fieldId,
      MoisturePercent: 15 + _random.NextDouble() * 20, // 15–35%
      TimestampUtc: DateTime.UtcNow);
      var subject = $"sensors.soil.moisture.{_fieldId}";
      await _connection.PublishAsync(subject, reading, cancellationToken: ct);
      Console.WriteLine($"[Sensor {_sensorId}] {reading.MoisturePercent:F1}% in field {reading.FieldId}");
      await Task.Delay(500, ct);
    }
  }
}
```

##### **Explanation**
##### • subject is like a topic. Here we use a structured pattern: sensors.soil.moisture.{fieldId}. This makes it easy to subscribe to:
##### 1. all soil sensors,
##### 2. or a specific field,
##### 3. or even a subset using wildcards.
&nbsp;  
 
##### • We send a new reading every 500ms to simulate a real sensor.
##### • In a real system:

##### 1. this code might run on a device,
##### 2. or you’d have multiple instances for multiple sensors.
&nbsp;  
  
#### 5. Real-Time Analytics (Subscriber with Wildcard)
&nbsp;  
 
##### Now let’s build a consumer that listens to all soil moisture sensors and logs them.

```csharp

using Microsoft.Extensions.Hosting;
using NATS.Client.Core;
public sealed class SoilAnalyticsWorker : BackgroundService
{
  private NatsConnection _connection;
  public SoilAnalyticsWorker(NatsConnection connection)
  {
    _connection = connection;
  }
  
  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    // Subscribe to all soil moisture readings from all fields
    await foreach (var msg in _connection.SubscribeAsync<SoilMoistureReading>(
    subject: "sensors.soil.moisture.*",
    cancellationToken: stoppingToken))
    {
      var reading = msg.Data;
      Console.WriteLine(
      $"[Analytics] Field={reading.FieldId}, Sensor={reading.SensorId}, Moisture={reading.MoisturePercent:F1}%");
      // Here you could:
      // - update an in-memory average
      // - push to a time-series DB
      // - feed a dashboard, etc.
    }
  }
}
```

##### **Explanation**
##### • BackgroundService integrates nicely with ASP.NET Core / generic host.
##### • SubscribeAsync<SoilMoistureReading> tells NATS to:
 
##### 1. subscribe to this subject,
##### 2. and deserialize payloads into SoilMoistureReading.

##### • sensors.soil.moisture.* uses a wildcard to listen to all fields.
##### • We process messages in a simple await foreach loop. When the app stops, the loop ends via the stoppingToken.
&nbsp;  

#### 6. Irrigation Controller with Queue Groups (Load Balancing)
&nbsp;  
 
##### What if we have multiple instances of an irrigation controller service?
&nbsp;  

##### We want **only one instance** to handle each reading and decide on irrigation, not all of them.
&nbsp;  
 
##### That’s exactly what NATS **queue groups** do.

```csharp

public sealed class IrrigationControllerWorker : BackgroundService
{
  private NatsConnection _connection;
  private const string QueueGroupName = "irrigation-controllers";
  
  public IrrigationControllerWorker(NatsConnection connection)
  {
    _connection = connection;
  }
  
  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    await foreach (var msg in
    _connection.SubscribeAsync<SoilMoistureReading>(
      subject: "sensors.soil.moisture.*",
      queueGroup: QueueGroupName,
      cancellationToken: stoppingToken))
    {
      var reading = msg.Data;
      Console.WriteLine(
      $"[Controller] Field={reading.FieldId}, Moisture={reading.MoisturePercent:F1}%");
      
      if (reading.MoisturePercent < 20)
      {
        var command = new IrrigationCommand(
          FieldId: reading.FieldId,
          EnableIrrigation: true,
          TargetMoisturePercent: 25,
          TimestampUtc: DateTime.UtcNow);

        await _connection.PublishAsync(
          "irrigation.commands",
          command,
          stoppingToken);
          Console.WriteLine(
          $"[Controller] Issued irrigation command for field {reading.FieldId}");
      }
    }
  }
}
```

##### **Explanation**
&nbsp;  

##### • queueGroup: "irrigation-controllers" makes this subscription part of a queue group.
##### • If you run 3 instances of this worker:
 
##### 1. NATS will load-balance messages across them.
##### 2. Each message goes to exactly one instance in the group.
&nbsp;  
 
##### • This is perfect for scaling “decision” services horizontally.
&nbsp;  
#### 7. Irrigation Device (Command Subscriber)
&nbsp;  
##### Now we simulate a device that receives irrigation commands and acts on them.

```csharp

public sealed class IrrigationDeviceWorker : BackgroundService
{
  private NatsConnection _connection;
  private readonly string _deviceId;
  
  public IrrigationDeviceWorker(NatsConnection connection, string deviceId)
  {
    _connection = connection;
    _deviceId = deviceId;
  }
  
  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    await foreach (var msg in _connection.SubscribeAsync<IrrigationCommand>(
      subject: "irrigation.commands",
      cancellationToken: stoppingToken))
    {
      var command = msg.Data;
      Console.WriteLine(
      $"[Device {_deviceId}] Apply irrigation → Field={command.FieldId}, Enable={command.EnableIrrigation}, Target={command.TargetMoisturePercent}%");
      // Here you'd talk to actual hardware:
      // - open valve
      // - configure timer
      // - log to local storage, etc.
    }
  }
}
```

##### **Explanation**
&nbsp;  

##### • This worker subscribes to a simple subject: irrigation.commands.
##### • Commands are broadcast - multiple devices can listen if needed.
##### • In reality, you might:
 
##### 1. use per-device subjects,
##### 2. or add addressing fields inside the command. 
 
##### • The core idea: the controller and device are loosely coupled via NATS.
&nbsp;  

#### 8. Request–Reply: Ask for a Field’s Status
 
##### Sometimes you don’t want just a stream - you want to ask the system something:
 
##### “What’s the current moisture in Field-42?”

##### NATS supports this pattern natively with **request–reply**.
 
##### **8.1. Define request/response models and cache**

```csharp

public record FieldStatusRequest(string FieldId);

public record FieldStatusResponse(
    string FieldId,
    double AverageMoisturePercent,
    DateTime LastUpdatedUtc);

    public interface IFieldStatusCache
    {
      (double AverageMoisture, DateTime LastUpdatedUtc) GetStatusForField(string fieldId);
    }
```
##### **Explanation**
##### • FieldStatusRequest - what the caller sends (just a FieldId).
##### • FieldStatusResponse - what the responder returns.
##### • IFieldStatusCache - simple abstraction; your analytics worker could update this cache as readings arrive.
##### **8.2. The responder (service answering status requests)**

```csharp

public sealed class FieldStatusResponder : BackgroundService
{
  private NatsConnection _connection;
  private IFieldStatusCache _cache;
  public FieldStatusResponder(NatsConnection connection, IFieldStatusCache cache)
  {
    _connection = connection;
    _cache = cache;
  }
  
  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    await foreach (var msg in
      _connection.SubscribeAsync<FieldStatusRequest>(
      subject: "fields.status.get",
      cancellationToken: stoppingToken))
    {
      var (average, lastUpdated) = _cache.GetStatusForField(msg.Data.FieldId);
      
      var response = new FieldStatusResponse(
        FieldId: msg.Data.FieldId,
        AverageMoisturePercent: average,
        LastUpdatedUtc: lastUpdated);

      await msg.ReplyAsync(response, stoppingToken);
    }
  }
}
```

##### **Explanation**
&nbsp;  
##### • We subscribe to fields.status.get.
##### • For each incoming request:
 
##### 1. we look up the field in the cache,
##### 2. create a response,
##### 3. and send it back using msg.ReplyAsync.
 
##### • NATS handles the internal reply subject and correlation.
&nbsp;  

##### **8.3. The client (e.g., your ASP.NET Core endpoint)**

```csharp

public sealed class FieldStatusClient
{
  private NatsConnection _connection;

  public FieldStatusClient(NatsConnection connection)
  {
   _connection = connection;
  }

  public async Task<FieldStatusResponse?> GetStatusAsync(string fieldId, CancellationToken ct = default)
  {
    var request = new FieldStatusRequest(fieldId);
    var msg = await _connection.RequestAsync<FieldStatusRequest, FieldStatusResponse>(
      subject: "fields.status.get",
      data: request,
      cancellationToken: ct);

    return msg.Data;
  }
}
```

##### **Explanation**
&nbsp;  
##### • RequestAsync<TRequest, TResponse> sends a request and waits for the reply.
##### • Under the hood:
 
##### 1. NATS creates a unique reply subject,
##### 2. the responder replies to it,
##### 3. the client gets the response mapped to FieldStatusResponse
 
##### • This pattern is very handy for internal RPC between services without needing gRPC/HTTP.
&nbsp;  
##### You could easily expose this in ASP.NET Core:

```csharp

app.MapGet("/fields/{fieldId}/status", async (string fieldId, FieldStatusClient client, CancellationToken ct) =>
{
  var status = await client.GetStatusAsync(fieldId, ct);
  return status is null ? Results.NotFound() : Results.Ok(status);
});
```

&nbsp;  
&nbsp;  
### When NATS Makes Sense (And When It Doesn’t)
&nbsp;  
&nbsp;

##### You don’t have to replace RabbitMQ or Kafka everywhere.
##### Use the right tool for the right job.
&nbsp;
 
##### **NATS is a good fit when:**
&nbsp;

##### • You have lots of small, frequent messages
##### • Latency and responsiveness really matter
##### • You’re dealing with IoT, sensors, or edge devices
##### • You want simple, fast, real-time messaging
##### • You prefer minimal operational overhead
##### • You like the idea of Pub/Sub, queue groups, and request-reply in one system
&nbsp;

##### **NATS is not ideal when:**
&nbsp;

##### • You need heavy analytics over huge event streams → Kafka is better
##### • You rely on advanced broker features (transactions, sessions, dead-lettering, etc.) → RabbitMQ / Azure Service Bus
##### • You want exactly-once semantics (in practice: Kafka territory)
&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  

##### Most developers never think about NATS simply because it doesn’t dominate headlines the way Kafka or RabbitMQ do.
&nbsp;

##### But once you see what kinds of problems it solves, it becomes one of those tools you’re genuinely happy to have discovered.
&nbsp;
 
##### NATS doesn’t try to be everything.
##### It doesn’t come with a huge learning curve.
##### It doesn’t require a cluster of heavyweight brokers.
&nbsp;
 
##### It just gives you:
&nbsp;

##### • a ridiculously fast messaging system,
##### • a tiny operational footprint,
##### • extremely simple APIs,
##### • and the flexibility to build real-time systems without complexity.
&nbsp;

##### If your next project involves devices, sensors, real-time updates, automation, or anything where speed and simplicity matter more than heavy enterprise features, give NATS a try.
&nbsp;
 
##### It might surprise you how far you can go with something this small and this fast.
&nbsp;
##### That's all from me for today. 
<!--END-->