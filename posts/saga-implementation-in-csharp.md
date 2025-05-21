---
title: "SAGA Implementation in C#"
subtitle: "The SAGA pattern is used to manage transactions across multiple services in a distributed system..."
date: "March 13 2023"
category: ".NET"
photoUrl: "/images/blog/newsletter21.png"
---

&nbsp;
#### <b>Many thanks to the sponsors who make it possible for this newsletter to be free for readers.</b>
&nbsp;
&nbsp;
#### Today's issue is sponsored by <b> [Packt](https://www.packtpub.com/)</b> 
&nbsp;
&nbsp;
#### Working with React doesn't have to be complex. "React 18 Design Patterns and Best Practices" empowers you to harness React's potential, making your applications flexible, easy to manage, and high-performing. Discover and unravel the dynamic features of React 18 and Node 19. This updated fourth edition equips you with insights into the cutting-edge tools that will elevate your projects. <b> [Book Link](https://packt.link/IxSPS)</b>.
&nbsp;
<hr style='background-color: #fff'>
&nbsp;

### The background
&nbsp;
&nbsp;
##### The SAGA pattern is used to manage transactions across multiple services in a distributed system. It ensures that all services involved in a transaction are coordinated and that the transaction can be rolled back if any of the services fail.
&nbsp;

##### In my example, I will create an Hotel microservice that will initiate the transaction, and a Flight microservice that will complete the transaction.
&nbsp;
##### I will use MassTransit Automatonymous (there are many libraries for working with sagas, even lightweight ones), which is a state machine library for building distributed systems. It provides a way to define the behavior of a system as a state machine, and it handles the coordination between services using the SAGA pattern.
&nbsp;
##### To implement SAGA in C# you need to follow next 5 steps.
##### Full Demo project is on GitHub repo.
&nbsp;
&nbsp;

### Step 1#: Configure RabbitMQ
&nbsp;
&nbsp;

##### First, you need to install the RabbitMQ on your machine. You can do it through Docker container with a following command:
![RabbitMQ Installation on Docker](/images/blog/posts/saga-implementation-in-csharp/install-rabbitmq-on-docker.png)

##### Then, you need to install the RabbitMQ client library in your solution. You can use the NuGet Package Manager to install the RabbitMQ Client package. Then, you need to configure the queues in the appsettings.json file (In GitHub project repo, this is already configured).
&nbsp;

##### Here is an example:
![RabbitMQ Configuration in appsettings.json](/images/blog/posts/saga-implementation-in-csharp/rabbitmq-configuration-in-appsettings.png)

&nbsp;
&nbsp;

### Step 2#: Automatonymous State Machine
&nbsp;
&nbsp;

##### Next, you need to define the state machine using Automatonymous. You can create a class that inherits from the AutomatonymousStateMachine base class and defines the states and transitions.
&nbsp;

##### Here is an example:
![Booking State Machine Saga Pattern](/images/blog/posts/saga-implementation-in-csharp/booking-state-machine-saga-pattern.png)


##### This state machine defines 4 states:
&nbsp;
##### - HotelBookingReceived
##### - HotelBooked
##### - FlightReservationReceived
##### - FlightReserved
&nbsp;
##### and 3 events:
&nbsp;
##### - BookHotelCommand
##### - HotelBookedEvent
##### - ReserveFlightCommand
&nbsp;
##### It also defines certain transitions from one state to another, as well as event calls in certain states.

&nbsp;
&nbsp;
### Step 3#: Create the Consumers
&nbsp;
&nbsp;

##### Next, you need to create the consumers for the events sent by the Hotel and Flight microservices. You can create a class that implements the IConsumer interface and handles the events. There is a 3 consumers.
&nbsp;

##### Here is an example for ReserveFlightConsumer:
![Reserve Flight Consumer](/images/blog/posts/saga-implementation-in-csharp/reserve-flight-consumer.png)

&nbsp;
&nbsp;
### Step 4#: Configure MassTransit bus
&nbsp;
&nbsp;
##### In this step, you need to configure the MassTransit bus to handle the events and start the consumers. You can use the MassTransit extensions for .NET to configure the bus in the ConfigureServices method of the Startup class.
&nbsp;
##### Here is the configuration in my project:
![Mass Transit Bus Configuration](/images/blog/posts/saga-implementation-in-csharp/mass-transit-bus-configuration.png)
##### This configuration registers the state machine and the consumers with the MassTransit bus, and sets up the RabbitMQ host and queues. You use the AddScoped method to register the OrderStateMachine as a scoped dependency, so that it can be used by the consumers.

&nbsp;
&nbsp;
### Step 5#: Publish events
&nbsp;
&nbsp;
##### Finally, you need to publish the events from the Hotel and Flight microservices. You can use the <b>IBus interface</b> provided by MassTransit to publish the events to the appropriate queue.
&nbsp;
##### Here is an example how I'm publishing the first event on API call:
![Publishing Event Saga Pattern](/images/blog/posts/saga-implementation-in-csharp/publishing-event-saga-pattern.png)

&nbsp;
&nbsp;
### What next?
&nbsp;
&nbsp;
##### These are the most necessary steps to implement the SAGA pattern via MassTransit in C#.
&nbsp;
##### But not the only one.
&nbsp;
##### The Persistence part is not included here, where the state can be persisted directly to the database.
##### Also, no Rollback event was created, for the implementation of which the previous knowledge would be used.
&nbsp;
##### I definitely encourage you to go to GitHub and take a look at the demo project, which after installing RabbitMQ you will be able to run and see what happens.
&nbsp;
##### To activate StateMachine, it is necessary to call the only API that exists in the application (there is swagger support).
&nbsp;
##### That's all from me for today.
&nbsp;
##### Make a coffee and check out source code directly on my <b> [GitHub repository](https://github.com/StefanTheCode/Newsletter/tree/main/5%23%20-%20Saga%20Pattern)</b>.
&nbsp;

## <b > dream BIG! </b>