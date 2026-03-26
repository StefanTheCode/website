---
title: "RabbitMQ in .NET from Scratch"
subtitle: "RabbitMQ is a message broker. Think of it like a reliable postal service for your software. Instead of one system directly calling another (which creates tight coupling), RabbitMQ acts as the middleman."
date: "June 16 2025"
category: ".NET"
readTime: "Read Time: 4 minutes"
meta_description: "RabbitMQ is a message broker. Think of it like a reliable postal service for your software. Instead of one system directly calling another (which creates tight coupling), RabbitMQ acts as the middleman."
---

<!--START-->
Shape the future of .NET tooling by spending just 10 minutes on JetBrains’ .NET development market research. Fill out the survey and enter the prize draw!
[Start now](https://surveys.jetbrains.com/s3/dotnet-development-survey-newsletters?utm_source=newsletter_the_code_man&utm_medium=cpc&utm_campaign=rider_brand_survey)

## Background
Whether you're building microservices or just want to offload work from your main app, [RabbitMQ](https://www.rabbitmq.com/) is one of the best tools to help you get there.

RabbitMQ is a **message broker**. Think of it like a reliable postal service for your software.

Instead of one system directly calling another (which creates tight coupling), RabbitMQ acts as the **middleman**:

• One part of your app **sends** a message.
• Another part **receives** and processes it **when it's ready**.

This is called **asynchronous communication**, and it’s great for performance, reliability, and scalability.

Key Components:
• **Producer**: The one who sends the messages.
• **Consumer**: The one who receives the messages.
• **Queue**: Where the messages wait until they are processed.
• **Exchange**: The "dispatcher" that directs the messages to the appropriate queues.
• **Binding**: The rules that connect exchanges with queues. 

## Setup RabbitMQ (Local with Docker)

You can install RabbitMQ using [Docker](https://thecodeman.net/posts/dotnet-docker-and-traefik):

```csharp

docker run -d --hostname rabbitmq
    --name rabbitmq \
    -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

• Visit the dashboard at http://localhost:15672
• Default login: guest / guest

## Implementing in .NET 

Let’s build a simple project:

• The **API** sends an "email message" to RabbitMQ.
• A **[BackgroundService](https://thecodeman.net/posts/background-tasks-in-dotnet8)** listens and "processes" the message.

Through this example I'm going to explain how it works.

Firstly, you need to add RabbitMQ library to your project:

```csharp

Install-Package RabbitMQ.Client
```

Let’s define a C# class to represent an email message:

```csharp

public class EmailMessage
{
    public string To { get; set; } = default!;
    public string Subject { get; set; } = default!;
    public string Body { get; set; } = default!;
}
```

Publisher

The Publisher is the part of your app that **sends messages** to RabbitMQ.

Its Job:
• Connect to RabbitMQ
• Create (or ensure) a queue exists
• Serialize the message (e.g., to JSON)
• Send the message into the queue

Real-World Analogy:

Think of it like dropping a letter into a mailbox. You’re not handling the delivery - just making sure it gets into the system.

```csharp

public class EmailMessagePublisher
{
    private const string EmailQueue = "email-queue";

    public async Task Publish(EmailMessage email)
    {
        var factory = new ConnectionFactory() { HostName = "localhost" };
        using var connection = await factory.CreateConnectionAsync();
        using var channel = await connection.CreateChannelAsync();

        // Ensure the queue exists
        await channel.QueueDeclareAsync(queue: EmailQueue,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null);

        // Create a message
        var message = JsonSerializer.Serialize(email);
        var body = Encoding.UTF8.GetBytes(message);

        // Publish the message
        await channel.BasicPublishAsync(
            exchange: string.Empty,
            routingKey: EmailQueue,
            mandatory: true,
            basicProperties: new BasicProperties { Persistent = true },
            body: body);
    }
}
```

Parameters:

- durable: save to disk so the queue isn’t lost on broker restart
- exclusive: can be used by other connections
- autoDelete: don’t delete when the last consumer disconnects

Receiver

The **Receiver** listens to the queue and processes messages as they arrive.

Its Job:
• Connect to RabbitMQ
• Subscribe to the queue
• Wait for messages
• Deserialize and process the messages

Real-World Analogy:

Think of it like a mailroom clerk who monitors the inbox and acts whenever a new letter shows up.

```csharp

public class EmailMessageConsumer : BackgroundService
{
    private const string EmailQueue = "email-queue";

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new ConnectionFactory() { HostName = "localhost" };
        using var connection = await factory.CreateConnectionAsync(stoppingToken);
        using var channel = await connection.CreateChannelAsync(cancellationToken: stoppingToken);

        await channel.QueueDeclareAsync(queue: EmailQueue,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null,
            cancellationToken: stoppingToken);

        var consumer = new AsyncEventingBasicConsumer(channel);
        consumer.ReceivedAsync += async (sender, eventArgs) =>
        {
            var body = eventArgs.Body.ToArray();
            var json = Encoding.UTF8.GetString(body);
            var email = JsonSerializer.Deserialize<EmailMessage>(json);

            Console.WriteLine($"Sending Email To: {email?.To}, Subject: {email?.Subject}");

            // Simulate sending email...
            Task.Delay(1000).Wait();

            await ((AsyncEventingBasicConsumer)sender).Channel.BasicAckAsync(eventArgs.DeliveryTag, multiple: false);
        };

        await channel.BasicConsumeAsync(queue: EmailQueue,
            autoAck: true,
            consumer: consumer,
            cancellationToken: stoppingToken);
    }
}
```

##  RabbitMQ Exchange Types Explained

An **Exchange** in RabbitMQ is like a post office: it decides **where to send the message**. 
Each exchange type has a different strategy for routing messages.

Here are the 4 main types:

1. Direct Exchange
2. Fanout
3. Topic
4. Headers

1. Direct Exchange (One-to-One Routing)

• A message is routed to queues with the exact same routing key.
• Think of this as sending mail to a specific recipient.

Example Use Case:
You want to send emails only to a queue responsible for “welcome” emails.

.NET Setup:

```csharp

channel.ExchangeDeclare("direct-exchange", ExchangeType.Direct);
channel.QueueBind("email-welcome-queue", "direct-exchange", "welcome");
```
If you publish with routingKey = "welcome", it will go to email-welcome-queue.

2. Fanout Exchange (Broadcast to All)

• Messages go to **all queues bound to the exchange**, ignoring routing keys.
• It’s a **broadcast**—like shouting in a room and everyone hears it.

Example Use Case:
You want to send a system-wide notification to all services (email, SMS, push).

.NET Setup:

```csharp

channel.ExchangeDeclare("fanout-exchange", ExchangeType.Fanout);
channel.QueueBind("email-queue", "fanout-exchange", "");
channel.QueueBind("sms-queue", "fanout-exchange", "");
```

Any message sent to "fanout-exchange" goes to both queues.

3. Topic Exchange (Wildcard Routing)

• Uses **wildcards** in the routing key to allow flexible, pattern-based routing.

Wildcards
• * matches exactly one word
• # matches zero or more words

Example Use Case:
Route logs based on severity and system.

.NET Setup:

```csharp

channel.ExchangeDeclare("topic-exchange", ExchangeType.Topic);
channel.QueueBind("error-queue", "topic-exchange", "log.error.#");
channel.QueueBind("auth-queue", "topic-exchange", "log.*.auth");
```

"log.error.auth" goes to both queues.
"log.info.auth" goes to auth-queue.
"log.error.database" goes to error-queue.

4. Headers Exchange (Route by Metadata)

• Instead of routing keys, it uses **message headers** for routing.

Example Use Case:
Route messages with complex conditions (e.g., "x-type": "invoice" and "region": "EU")

.NET Setup:

```csharp

channel.ExchangeDeclare("headers-exchange", ExchangeType.Headers);

var args = new Dictionary<string, object>
{
    { "x-match", "all" }, // or "any"
    { "x-type", "invoice" },
    { "region", "EU" }
};

channel.QueueBind("invoice-eu-queue", "headers-exchange", string.Empty, args);
```

Only messages that include both x-type=invoice and region=EU in their headers will be routed.

When to Use Which Exchange?

**Direct** - Exact one-to-one message routing
**Fanout** - Broadcasting to multiple consumers
**Topic** - Flexible, pattern-based routing (e.g., logs)
**Headers** - Complex routing based on multiple conditions


For alternative messaging solutions, check out [Redis Pub/Sub Messaging](https://thecodeman.net/posts/messaging-in-dotnet-with-redis) and [NATS Real-Time Messaging](https://thecodeman.net/posts/introduction-to-nats-real-time-messaging).

## Wrapping Up

RabbitMQ is a powerful tool for building scalable, decoupled systems - and .NET makes it surprisingly easy to integrate with. 

Whether you're building microservices or just want to offload some long-running tasks, RabbitMQ has your back.

That's all from me today. 

 
P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->


