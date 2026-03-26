---
title: "SAGA Implementation in C#"
subtitle: "The SAGA pattern is used to manage transactions across multiple services in a distributed system..."
date: "March 13 2023"
category: ".NET"
readTime: "Read Time: 4 minutes"
meta_description: "The SAGA pattern is used to manage transactions across multiple services in a distributed system..."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">Today's issue is sponsored by ** <a href="https://www.packtpub.com/" style="color: #a5b4fc; text-decoration: underline;">Packt</a>**</p>
<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">Working with React doesn't have to be complex. "React 18 Design Patterns and Best Practices" empowers you to harness React's potential, making your applications flexible, easy to manage, and high-performing. Discover and unravel the dynamic features of React 18 and Node 19. This updated fourth edition equips you with insights into the cutting-edge tools that will elevate your projects. ** <a href="https://packt.link/IxSPS" style="color: #a5b4fc; text-decoration: underline;">Book Link</a>**.</p>
<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;"><hr style='background-color: #fff'></p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## The background
The SAGA pattern is used to manage transactions across multiple services in a distributed system. It ensures that all services involved in a transaction are coordinated and that the transaction can be rolled back if any of the services fail.

In my example, I will create an Hotel microservice that will initiate the transaction, and a Flight microservice that will complete the transaction.
I will use MassTransit Automatonymous (there are many libraries for working with sagas, even lightweight ones), which is a state machine library for building distributed systems. It provides a way to define the behavior of a system as a state machine, and it handles the coordination between services using the SAGA pattern.
To implement SAGA in C# you need to follow next 5 steps.
Full Demo project is on GitHub repo.

## Step 1#: Configure [RabbitMQ](https://thecodeman.net/posts/rabbitmq-in-dotnet-from-scratch)

First, you need to install the RabbitMQ on your machine. You can do it through [Docker](https://thecodeman.net/posts/dotnet-docker-and-traefik) container with a following command:
![RabbitMQ Installation on Docker](/images/blog/posts/saga-implementation-in-csharp/install-rabbitmq-on-docker.png)

Then, you need to install the RabbitMQ client library in your solution. You can use the NuGet Package Manager to install the RabbitMQ Client package. Then, you need to configure the queues in the [appsettings](https://thecodeman.net/posts/live-loading-appsettings-configuration-file).json file (In GitHub project repo, this is already configured).

Here is an example:
![RabbitMQ Configuration in appsettings.json](/images/blog/posts/saga-implementation-in-csharp/rabbitmq-configuration-in-appsettings.png)

## Step 2#: Automatonymous State Machine

Next, you need to define the state machine using Automatonymous. You can create a class that inherits from the AutomatonymousStateMachine base class and defines the states and transitions.

Here is an example:
![Booking State Machine Saga Pattern](/images/blog/posts/saga-implementation-in-csharp/booking-state-machine-saga-pattern.png)

This state machine defines 4 states:
- HotelBookingReceived
- HotelBooked
- FlightReservationReceived
- FlightReserved
and 3 events:
- BookHotelCommand
- HotelBookedEvent
- ReserveFlightCommand
It also defines certain transitions from one state to another, as well as event calls in certain states.

## Step 3#: Create the Consumers

Next, you need to create the consumers for the events sent by the Hotel and Flight microservices. You can create a class that implements the IConsumer interface and handles the events. There is a 3 consumers.

Here is an example for ReserveFlightConsumer:
![Reserve Flight Consumer](/images/blog/posts/saga-implementation-in-csharp/reserve-flight-consumer.png)

## Step 4#: Configure MassTransit bus
In this step, you need to configure the MassTransit bus to handle the events and start the consumers. You can use the MassTransit extensions for .NET to configure the bus in the ConfigureServices method of the Startup class.
Here is the configuration in my project:
![Mass Transit Bus Configuration](/images/blog/posts/saga-implementation-in-csharp/mass-transit-bus-configuration.png)
This configuration registers the state machine and the consumers with the MassTransit bus, and sets up the RabbitMQ host and queues. You use the AddScoped method to register the OrderStateMachine as a scoped dependency, so that it can be used by the consumers.

## Step 5#: Publish events
Finally, you need to publish the events from the Hotel and Flight microservices. You can use the **IBus interface** provided by MassTransit to publish the events to the appropriate queue.
Here is an example how I'm publishing the first event on API call:
![Publishing Event Saga Pattern](/images/blog/posts/saga-implementation-in-csharp/publishing-event-saga-pattern.png)

## What next?
These are the most necessary steps to implement the SAGA pattern via MassTransit in C#.
But not the only one.
The Persistence part is not included here, where the state can be persisted directly to the database.
Also, no Rollback event was created, for the implementation of which the previous knowledge would be used.
I definitely encourage you to go to GitHub and take a look at the demo project, which after installing RabbitMQ you will be able to run and see what happens.
To activate StateMachine, it is necessary to call the only API that exists in the application (there is [swagger](https://thecodeman.net/posts/3-tips-to-elevate-swagger-ui) support).
That's all from me for today.
Make a coffee and check out source code directly on my ** [GitHub repository](https://github.com/StefanTheCode/Newsletter/tree/main/5%23%20-%20Saga%20Pattern)**.

## dream BIG!


For orchestration-based sagas, check out [Saga Orchestration Pattern](https://thecodeman.net/posts/saga-orchestration-pattern).

## Wrapping Up

<!--END-->




