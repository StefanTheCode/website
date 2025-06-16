---
title: "RabbitMQ in .NET from Scratch"
subtitle: "RabbitMQ is a message broker. Think of it like a reliable postal service for your software. Instead of one system directly calling another (which creates tight coupling), RabbitMQ acts as the middleman."
readTime: "Read Time: 4 minutes"
date: "June 16 2025"
category: ".NET"
meta_description: "RabbitMQ is a message broker. Think of it like a reliable postal service for your software. Instead of one system directly calling another (which creates tight coupling), RabbitMQ acts as the middleman."
---

<!--START-->
##### Shape the future of .NET tooling by spending just 10 minutes on JetBrains’ .NET development market research. Fill out the survey and enter the prize draw!
&nbsp;
##### [Start now](https://surveys.jetbrains.com/s3/dotnet-development-survey-newsletters?utm_source=newsletter_the_code_man&utm_medium=cpc&utm_campaign=rider_brand_survey)
&nbsp;

&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  
##### Whether you're building microservices or just want to offload work from your main app, [RabbitMQ](https://www.rabbitmq.com/) is one of the best tools to help you get there.
&nbsp;  

##### RabbitMQ is a **message broker**. Think of it like a reliable postal service for your software.
&nbsp;  

##### Instead of one system directly calling another (which creates tight coupling), RabbitMQ acts as the **middleman**:
&nbsp;  

##### • One part of your app **sends** a message.
##### • Another part **receives** and processes it **when it's ready**.
&nbsp;  

##### This is called **asynchronous communication**, and it’s great for performance, reliability, and scalability.
&nbsp;  

##### **Key Components:**
##### • **Producer**: The one who sends the messages.
##### • **Consumer**: The one who receives the messages.
##### • **Queue**: Where the messages wait until they are processed.
##### • **Exchange**: The "dispatcher" that directs the messages to the appropriate queues.
##### • **Binding**: The rules that connect exchanges with queues. 

&nbsp;  
&nbsp;  
### Setup RabbitMQ (Local with Docker)
&nbsp;  
&nbsp; 

##### You can install RabbitMQ using Docker:

```csharp

docker run -d --hostname rabbitmq
    --name rabbitmq \
    -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```
&nbsp; 

##### • Visit the dashboard at http://localhost:15672
##### • Default login: guest / guest

&nbsp;  
&nbsp;  
### Implementing in .NET 
&nbsp;  
&nbsp;  

##### Let’s build a simple project:
&nbsp;  

##### • The **API** sends an "email message" to RabbitMQ.
##### • A **BackgroundService** listens and "processes" the message.
&nbsp;  

##### Through this example I'm going to explain how it works.
&nbsp;  

##### Firstly, you need to add RabbitMQ library to your project:

```csharp

Install-Package RabbitMQ.Client
```
&nbsp;  

##### Let’s define a C# class to represent an email message:

```csharp

public class EmailMessage
{
    public string To { get; set; } = default!;
    public string Subject { get; set; } = default!;
    public string Body { get; set; } = default!;
}
```
&nbsp;  

##### **Publisher**
&nbsp;  

##### The Publisher is the part of your app that **sends messages** to RabbitMQ.
&nbsp;  

##### Its Job:
##### • Connect to RabbitMQ
##### • Create (or ensure) a queue exists
##### • Serialize the message (e.g., to JSON)
##### • Send the message into the queue
&nbsp;  

##### Real-World Analogy:
&nbsp;  

##### Think of it like dropping a letter into a mailbox. You’re not handling the delivery - just making sure it gets into the system.

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
&nbsp;  

##### Parameters:
&nbsp;  

##### - durable: save to disk so the queue isn’t lost on broker restart
##### - exclusive: can be used by other connections
##### - autoDelete: don’t delete when the last consumer disconnects
&nbsp;  

##### **Receiver**
&nbsp;  

##### The **Receiver** listens to the queue and processes messages as they arrive.
&nbsp;  

##### Its Job:
##### • Connect to RabbitMQ
##### • Subscribe to the queue
##### • Wait for messages
##### • Deserialize and process the messages
&nbsp;  

##### Real-World Analogy:
&nbsp;  

##### Think of it like a mailroom clerk who monitors the inbox and acts whenever a new letter shows up.

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

&nbsp;  
&nbsp;  
###  RabbitMQ Exchange Types Explained
&nbsp;  
&nbsp;  

##### An **Exchange** in RabbitMQ is like a post office: it decides **where to send the message**. 
##### Each exchange type has a different strategy for routing messages.
&nbsp;  

##### Here are the 4 main types:
&nbsp;  

##### 1. Direct Exchange
##### 2. Fanout
##### 3. Topic
##### 4. Headers
&nbsp;  

##### **1. Direct Exchange (One-to-One Routing)**
&nbsp;  

##### • A message is routed to queues with the exact same routing key.
##### • Think of this as sending mail to a specific recipient.
&nbsp;  

##### Example Use Case:
##### You want to send emails only to a queue responsible for “welcome” emails.

&nbsp;  
##### .NET Setup:

```csharp

channel.ExchangeDeclare("direct-exchange", ExchangeType.Direct);
channel.QueueBind("email-welcome-queue", "direct-exchange", "welcome");
```
&nbsp;
##### If you publish with routingKey = "welcome", it will go to email-welcome-queue.
&nbsp;

##### **2. Fanout Exchange (Broadcast to All)**
&nbsp;  

##### • Messages go to **all queues bound to the exchange**, ignoring routing keys.
##### • It’s a **broadcast**—like shouting in a room and everyone hears it.
&nbsp;  

##### Example Use Case:
##### You want to send a system-wide notification to all services (email, SMS, push).

&nbsp;  
##### .NET Setup:

```csharp

channel.ExchangeDeclare("fanout-exchange", ExchangeType.Fanout);
channel.QueueBind("email-queue", "fanout-exchange", "");
channel.QueueBind("sms-queue", "fanout-exchange", "");
```
&nbsp;  

##### Any message sent to "fanout-exchange" goes to both queues.
&nbsp;

##### **3. Topic Exchange (Wildcard Routing)**
&nbsp;  

##### • Uses **wildcards** in the routing key to allow flexible, pattern-based routing.
&nbsp; 

##### Wildcards
&nbsp;  
##### • * matches exactly one word
##### • # matches zero or more words

##### Example Use Case:
##### Route logs based on severity and system.

&nbsp;  
##### .NET Setup:

```csharp

channel.ExchangeDeclare("topic-exchange", ExchangeType.Topic);
channel.QueueBind("error-queue", "topic-exchange", "log.error.#");
channel.QueueBind("auth-queue", "topic-exchange", "log.*.auth");
```
&nbsp;  

##### "log.error.auth" goes to both queues.
##### "log.info.auth" goes to auth-queue.
##### "log.error.database" goes to error-queue.
&nbsp;

##### **4. Headers Exchange (Route by Metadata)**
&nbsp;  

##### • Instead of routing keys, it uses **message headers** for routing.
&nbsp; 

##### Example Use Case:
##### Route messages with complex conditions (e.g., "x-type": "invoice" and "region": "EU")

&nbsp;  
##### .NET Setup:

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
&nbsp;  

##### Only messages that include both x-type=invoice and region=EU in their headers will be routed.
&nbsp;  

##### When to Use Which Exchange?
&nbsp;  

##### **Direct** - Exact one-to-one message routing
##### **Fanout** - Broadcasting to multiple consumers
##### **Topic** - Flexible, pattern-based routing (e.g., logs)
##### **Headers** - Complex routing based on multiple conditions

&nbsp;  
&nbsp;  
### Wrapping Up
&nbsp;  
&nbsp;  

##### RabbitMQ is a powerful tool for building scalable, decoupled systems - and .NET makes it surprisingly easy to integrate with. 
&nbsp;  

##### Whether you're building microservices or just want to offload some long-running tasks, RabbitMQ has your back.
&nbsp;  

##### That's all from me today. 

&nbsp;  
 
##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->