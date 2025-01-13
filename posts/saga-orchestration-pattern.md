---
title: "Saga Orchestration Pattern"
subtitle: "SAGA is a sequential process that manages transactions between microservices by breaking each operation into multiple smaller transactions that can be independently executed and compensated."
date: "January 13 2025"
photoUrl: "/images/blog/newsletter21.png"
---

&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • Download JetBrains for [FREE NOW here](https://www.jetbrains.com/rider/?utm_campaign=rider_free&utm_content=site&utm_medium=cpc&utm_source=thecodeman_newsletter).
&nbsp;  
&nbsp;  

<!--START-->

### The Challenge
&nbsp;  
&nbsp;  
##### In today's digital age, the travel booking process is becoming increasingly complex due to the variety of services travelers require. This domain problem includes the integration of different services such as hotel reservation, airline ticket reservation and transportation organization (eg taxi) from the airport to the accommodation. All these services must be coordinated in an efficient manner to enable a smooth user experience.
&nbsp;  
##### The main challenge in this domain **is managing transactions across multiple microservices that are not directly connected**. Each microservice (hotel, plane, car/taxi) operates independently, which means that there is no simple way to ensure consistency of transactions across all services.
&nbsp;  
##### For example, if a traveler wants to cancel a trip, it is necessary to coordinate the cancellation of all reservations (hotel, plane, taxi), which can be complex and prone to errors.
&nbsp;  
&nbsp;  
### The Solution?
&nbsp;  
&nbsp;  
##### To solve this problem, the SAGA pattern is used.
&nbsp;  

##### SAGA is a sequential process that manages transactions between microservices by breaking each operation into multiple smaller transactions that can be independently executed and compensated.
&nbsp;  

##### Each of these transactions is part of a larger "saga" that ensures system-wide consistency.
&nbsp;  

##### Implementation in the context of travel booking:
&nbsp;  

##### In our case, the SAGA template could be applied as follows:
&nbsp;  

##### **1. Initial booking**: The traveler starts the travel booking process. The first transaction may be a hotel room reservation.
&nbsp;  

##### **2. Sequential transactions**: After a successful hotel reservation, the flight reservation follows, and then the organization of taxi transportation.
&nbsp;  

##### **3. Compensation transactions**: If there is a problem at any stage (eg the hotel is full), SAGA initiates compensation transactions. This means that previously made reservations (such as an airline ticket) will be canceled or modified, in order to maintain the integrity of the entire reservation. (not part of this newsletter issue)

![Saga Orchestration Diagram](/images/blog/posts/saga-orchestration-pattern/saga-orchestration.png)

&nbsp;  

##### This represents the Saga orchestration process.
&nbsp;  

##### Orchestration is a method where one service acts as the central coordinator for communication among microservices. In this setup, a single service, known as the orchestrator, manages and directs the interactions between other services.
&nbsp;  

##### This approach relies on command-driven communication, where commands specify the desired actions. The sender issues a command to trigger a specific event, and the recipient executes it without needing to know the origin of the command. 
&nbsp;  

##### Let's take a look on the implementation.
&nbsp;  
&nbsp;  
### .NET Implementation
&nbsp;  
&nbsp;  

##### I will use MassTransit Automatonymous (there are many libraries for working with sagas, even lightweight ones), which is a state machine library for building distributed systems. 
&nbsp;  

##### It provides a way to define the behavior of a system as a state machine, and it handles the coordination between services using the SAGA pattern.
&nbsp;  

#### Persistence:
&nbsp;  

##### I use EF DbContext with SQL Server in the background (any other provider can be used).


```csharp

public class BookingDbContext(DbContextOptions<BookingDbContext> options) : DbContext(options)
{
    public DbSet<Traveler> Travelers { get; set; }

    public DbSet<BookingSagaData> BookingSagaData { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BookingSagaData>().HasKey(s => s.CorrelationId);
    }
}
```
&nbsp;  
##### Where Traveler is an entity repesenting a person who are booking the trip:

```csharp

public class Traveler
{
    public Guid Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public DateTime BookedOn { get; set; }
}
```
&nbsp;  
#### Saga State Machine
&nbsp;  

##### A Saga State Machine in the context of MassTransit and .NET is used to manage the state and coordination of a long-running process that involves multiple services.
&nbsp;  

##### A Saga ensures that the process completes successfully or compensates for any failures by managing the state transitions and interactions between the various services involved.
&nbsp;  

##### Key Concepts of Saga State Machine
&nbsp;  

##### **1. State Machine**: A state machine manages the states and transitions of a saga. It defines the different states a saga can be in and the events that cause transitions between these states.
&nbsp;  

##### **2. Saga State**: The state of a saga is persisted to ensure that the saga can recover from failures and continue processing from where it left off.
&nbsp;  

##### **3. Events**: Events trigger transitions between states. They are typically messages that indicate something significant has happened in the system.
&nbsp;  

##### **4. Commands**: Commands are actions that the saga instructs other services to perform as part of the process.
&nbsp;  

#### State Machine:

```csharp

public class BookingSaga : MassTransitStateMachine<BookingSagaData>
{
    public State HotelBooking { get; set; }
    public State FlightBooking { get; set; }
    public State CarRenting { get; set; }
    public State BookingCompleting { get; set; }

    public Event<HotelBooked> HotelBooked { get; set; }
    public Event<FlightBooked> FlightBooked { get; set; }
    public Event<CarRented> CarRented { get; set; }
    public Event<BookingCompleted> BookingCompleted { get; set; }

    public BookingSaga()
    {
        InstanceState(x => x.CurrentState);

        Event(() => HotelBooked, e => e.CorrelateById(m => m.Message.TravelerId));
        Event(() => FlightBooked, e => e.CorrelateById(m => m.Message.TravelerId));
        Event(() => CarRented, e => e.CorrelateById(m => m.Message.TravelerId));

        Initially
        (
            When(HotelBooked)
            .Then(context =>
                {
                    context.Saga.TravelerId = context.Message.TravelerId;
                    context.Saga.HotelName = context.Message.HotelName;
                    context.Saga.FlightCode = context.Message.FlightCode;
                    context.Saga.CarPlateNumber = context.Message.CarPlateNumber;
                })
            .TransitionTo(FlightBooking)
            .Publish(context => new BookFlight(context.Message.TravelerId, context.Message.Email, context.Message.FlightCode, context.Message.CarPlateNumber))
        );

        During(FlightBooking,
            When(FlightBooked)
            .Then(context => context.Saga.FlightBooked = true)
            .TransitionTo(CarRenting)
            .Publish(context => new RentCar(context.Message.TravelerId, context.Message.Email, context.Message.CarPlateNumber))
        );

        During(CarRenting,
            When(CarRented)
            .Then(context =>
                {
                    context.Saga.CarRented = true;
                    context.Saga.BookingFinished = true;
                })
            .TransitionTo(BookingCompleting)
            .Publish(context => new BookingCompleted
                {
                    TravelerId = context.Message.TravelerId,
                    Email = context.Message.Email
                })
            .Finalize());
    }
}

```
&nbsp;  
#### Commands and Events:

##### **Commands** are messages that represent instructions or actions that need to be performed. They are typically sent by one service to another, directing the receiving service to perform a specific task. Commands are imperative, meaning they tell the recipient exactly what to do.

```csharp

public record BookHotel(string Email, string HotelName, string FlightCode, string CarPlateNumber);

public record BookFlight(Guid TravelerId, string Email, string FlightCode, string CarPlateNumber);

public record RentCar(Guid TravelerId, string Email, string CarPlateNumber);
```
&nbsp;  

##### **Events** are messages that represent something that has happened within the system. They are declarative, meaning they simply announce that a certain condition or state change has occurred. Events are used to signal other parts of the system that something significant has happened.

```csharp

public class HotelBooked
{
    public Guid TravelerId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string HotelName { get; set; } = string.Empty;
    public string FlightCode { get; set; } = string.Empty;
    public string CarPlateNumber { get; set; } = string.Empty;
}

public class FlightBooked
{
    public Guid TravelerId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FlightCode { get; set; } = string.Empty;
    public string CarPlateNumber { get; set; } = string.Empty;
}

public class CarRented
{
    public Guid TravelerId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string CarPlateNumber { get; set; } = string.Empty;
}

public class BookingCompleted
{
    public Guid TravelerId { get; set; }
    public string Email { get; set; } = string.Empty;
}
```
&nbsp;  

#### Commands Handlers:
&nbsp;  

##### Command Handlers are components that are responsible for handling commands. They contain the logic required to perform the action specified by the command. When a command is sent to a service, the Command Handler processes it, performs the necessary operations, and often triggers subsequent actions or events.
&nbsp;  

##### There are 4 command handlers:
&nbsp;  

##### **1. BookHotelHandler**
##### **2. BookFlightHandler**
##### **3. RentCarHandler**
##### **4. BookingCompletedHandler**
&nbsp;  

##### Here I will show you handler for hotel booking:
```csharp

public class BookHotelHandler(BookingDbContext _dbContext) : IConsumer<BookHotel>
{
    public async Task Consume(ConsumeContext<BookHotel> context)
    {
        Console.WriteLine($"Booking hotel {context.Message.HotelName} for traveler {context.Message.Email}");

        var traveler = new Traveler
        {
            Id = Guid.NewGuid(),
            Email = context.Message.Email,
            BookedOn = DateTime.Now
        };

        _dbContext.Travelers.Add(traveler);

        await _dbContext.SaveChangesAsync();

        await context.Publish(new HotelBooked
        {
            TravelerId = traveler.Id,
            HotelName = context.Message.HotelName,
            FlightCode = context.Message.FlightCode,
            CarPlateNumber = context.Message.CarPlateNumber
        });
    }
}
```
&nbsp;  

#### MassTransit and RabbitMq Configurations
&nbsp;  

##### This configuration sets up MassTransit with RabbitMQ as the transport mechanism and uses Entity Framework for saga state persistence.
&nbsp;  

##### It registers all consumers from the specified assembly, configures the saga state machine with MSSQL as the database, and sets up RabbitMQ with specific credentials.
&nbsp;  

##### Endpoint names are formatted in kebab-case for consistency, and an in-memory outbox is used to ensure message consistency and reliability.
&nbsp;  

##### The overall setup ensures a robust and consistent messaging and saga orchestration infrastructure, enabling reliable handling of complex workflows and state management in a distributed system.
```csharp

public class BookHotelHandler(BookingDbContext _dbContext) : IConsumer<BookHotel>
{
    public async Task Consume(ConsumeContext<BookHotel> context)
    {
        Console.WriteLine($"Booking hotel {context.Message.HotelName} for traveler {context.Message.Email}");

        var traveler = new Traveler
        {
            Id = Guid.NewGuid(),
            Email = context.Message.Email,
            BookedOn = DateTime.Now
        };

        _dbContext.Travelers.Add(traveler);

        await _dbContext.SaveChangesAsync();

        await context.Publish(new HotelBooked
        {
            TravelerId = traveler.Id,
            HotelName = context.Message.HotelName,
            FlightCode = context.Message.FlightCode,
            CarPlateNumber = context.Message.CarPlateNumber
        });
    }
}
```
&nbsp;  
&nbsp;  
### Triggering Saga
&nbsp;  
&nbsp;  

##### The first step in the transaction queue is to create a hotel reservation. In order to do this, it is necessary to publish the BookHotel command on the MassTransit bus, which will trigger the Handler and the Saga State machine.
```csharp

[HttpPost("bookTrip")]
public IActionResult BookTrip(BookingDetails bookingDetails)
{
    _bus.Publish(new BookHotel(bookingDetails.Email, bookingDetails.HotelName, bookingDetails.FlightCode, bookingDetails.CarPlateNumber));

    return Accepted();
}
```
&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  

##### Here, on a simple and realistic example, we have shown the application of the Saga pattern for resolving transactions with microservices.
&nbsp;  

##### The Saga State Machine (orchestrator) is implemented, which manages transactions with the help of the RabbitMq queue.
&nbsp;  

##### All state changes are remembered in the database, which enables these transactions to be executed for a long time.
&nbsp;  

##### In the case of distributed transactions with microservice architecture, some of the actions may cause an error.
&nbsp;  

##### Let's say the hotel and flight are booked, but the service that rents the car threw an error, in that case it is necessary to rollback the previous 2 actions.
&nbsp;  

##### For this problem, compensatory transactions are implemented that will cancel the booked hotel and flight.
&nbsp;  

##### That's one of the things you should look at next.
&nbsp;  

##### The complete code written in .NET 8 can be found in the [following repository](https://github.com/StefanTheCode/SagaPatternDemo/tree/main).

&nbsp;  

##### That's all from me today.

<!--END-->
