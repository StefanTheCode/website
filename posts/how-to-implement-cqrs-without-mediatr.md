---
title: "How to implement CQRS without MediatR"
subtitle: "CQRS (Command Query Responsibility Segregation) is a design pattern that separates the read (query) and write (command) operations of an application, leading to better maintainability, scalability, and flexibility. "
date: "September 24 2024"
category: ".NET"
readTime: "Read Time: 4 minutes"
meta_description: "CQRS (Command Query Responsibility Segregation) is a design pattern that separates the read (query) and write (command) operations of an application, leading to better maintainability, scalability, and flexibility."
---

&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • Join Postman CTO, Ankit Sobti, and Head of Customer Experience and Success, Kristine Chin, at [this webinar](https://app.zuddl.com/p/a/event/8e8f96c1-99d5-4392-96a1-c68b8c8b9d2d) which delivers the information you need to maximize the success of your API products, reduce friction to collaboration, and to provide a world-class experience for your developers, partners, and customers.
##### Join [here](https://app.zuddl.com/p/a/event/8e8f96c1-99d5-4392-96a1-c68b8c8b9d2d).
&nbsp;  
&nbsp;  


### [Watch YouTube video here](https://youtu.be/46DQDu0TJJU?si=ifbb4BrJ-Jz5tGjR)
![Watch YouTube video](/images/blog/posts/how-to-implement-cqrs-without-mediatr/youtube.png)

<!--START-->

&nbsp;  
&nbsp;  
### Introduction
&nbsp;  
&nbsp;  

##### **CQRS (Command Query Responsibility Segregation)** is a design pattern that separates the read (query) and write (command) operations of an application, leading to better maintainability, scalability, and flexibility.
&nbsp;  
##### It's particularly suitable for applications with complex business logic, high read/write ratio, or a need to scale independently.
&nbsp;  

##### How it works:
&nbsp;  

##### **• Commands:** Operations that change the state of the system. Commands usually don't return data, only the status of the operation.
&nbsp;  

##### **• Queries:** Operations that retrieve data from the system. Queries only read data and don't modify the system state.

&nbsp;  
&nbsp;  
### CQRS in Microservices and Separate Databases
&nbsp;  
&nbsp;  

##### When using CQRS in a microservices architecture, you can separate read and write operations within individual services or across multiple services, providing several benefits:
&nbsp;  

##### **• Event Sourcing:** Combine CQRS with Event Sourcing for better auditability, data versioning, and troubleshooting.
&nbsp;  

##### **• Separate Data Stores:** Maintain separate data stores for read and write sides, optimizing performance and ensuring data consistency.
&nbsp;  

##### **• Independent Scaling:** Scale the read and write sides of your microservices independently for optimal resource usage.Using separate databases for reading and writing can offer several advantages:
&nbsp;  

##### **• Optimized Performance:** Tailor each database to the specific requirements of your read and write operations.
&nbsp;  

##### **• Independent Scaling:** Scale the read and write databases independently based on your application's needs.
&nbsp;  

##### ** • Flexibility:** Choose the most suitable database technology for each side of your application.

&nbsp;  
&nbsp;  
### CQRS + MediatR?
&nbsp;  
&nbsp;  

##### This is the most common combination of implementation of the CQRS pattern seen on projects of the past few years.
&nbsp;  

##### But let's see what exactly is MediatR?
&nbsp;  

##### **MediatR** is a popular open-source ([Not anymore](https://www.jimmybogard.com/automapper-and-mediatr-going-commercial/) - But here is an alternative [Wolverine](https://thecodeman.net/posts/mediatr-alternative-wolverine)) library for .NET applications, developed by Jimmy Bogard. It helps in implementing the "mediator" design pattern, which promotes loosely coupled communication between components in a system.
&nbsp;  

##### **Mediator Pattern:** MediatR follows the mediator design pattern, where a central mediator object facilitates communication between different components without them needing to be aware of each other. This reduces the coupling between components and makes the system easier to maintain and evolve.
&nbsp;  

##### **Why do people use MediatR in combination with CQRS?**
&nbsp;  

##### In my opinion, using MediatR with CQRS encourages developers to create dedicated command and query classes and their corresponding handlers, which results in better code organization.
&nbsp;  

##### Also, MediatR provides a simple request/response model and a central mediator for handling commands, queries, and events. This makes it easier to implement the CQRS pattern in a consistent and straightforward way.
&nbsp;  

##### But **is this really necessary?**
&nbsp;  

##### Of course not.
&nbsp;  
##### I will show that in the following text.

&nbsp;  
&nbsp;  
### Clean CQRS
&nbsp;  
&nbsp;  

##### The project CQRS has a following structure:

![Clean CQRS](/images/blog/posts/how-to-implement-cqrs-without-mediatr/cqrs-without-mediatr.png)



##### To implement the CQRS pattern, without using any libraries, it is necessary to create only 4 interfaces.
&nbsp;  

##### All 4 interfaces are located in the Common folder:
&nbsp;  

##### **- IQueryHandler** - This interface is responsible for handling query operations. It has a single Handle method that takes a query object of type *TQuery* and a cancellation token, and returns a *Task<TQueryResult>* representing the result of the query operation.

```csharp

public interface IQueryHandler<in TQuery, TQueryResult>
{
    Task<TQueryResult> Handle(TQuery query, CancellationToken cancellation);
}


```
&nbsp;  

##### **- ICommandHandler** - This interface is responsible for handling command operations. 

```csharp

public interface ICommandHandler<in TCommand, TCommandResult>
{
    Task<TCommandResult> Handle(TCommand command, CancellationToken cancellation);
}

```
&nbsp;  

##### **- IQueryDispatcher** - This interface is responsible for dispatching queries to their respective query handlers. It has a generic Dispatch method that takes a query object and a cancellation token, and returns a Task<TQueryResult> representing the result of the dispatched query.

```csharp

public interface IQueryDispatcher
{
    Task<TQueryResult> Dispatch<TQuery, TQueryResult>(TQuery query, CancellationToken cancellation);
}

```
&nbsp;

##### **- ICommandDispatcher** - This interface is responsible for dispatching commands to their respective command handlers.

```csharp

public interface ICommandDispatcher
{
    Task<TCommandResult> Dispatch<TCommand, TCommandResult>(TCommand command, CancellationToken cancellation);
}

```
&nbsp;


##### In order for dispatchers to know which handlers (queries or commands) they will call, it is necessary to tell them how to select handlers.
&nbsp;

##### That is why we will make implementations of both dispatchers. Place them in the Dispatchers folder.
&nbsp;

##### **QueryDispatcher** implementation:

```csharp

public class QueryDispatcher(IServiceProvider serviceProvider) : IQueryDispatcher
{
    private readonly IServiceProvider _serviceProvider = serviceProvider;

    public Task<TQueryResult> Dispatch<TQuery, TQueryResult>(TQuery query, CancellationToken cancellation)
    {
        var handler = _serviceProvider.GetRequiredService<IQueryHandler<TQuery, TQueryResult>>();
        return handler.Handle(query, cancellation);
    }
}

```

##### **CommandDispatcher** implementation:

```csharp

public class CommandDispatcher(IServiceProvider serviceProvider) : ICommandDispatcher
{
    private readonly IServiceProvider _serviceProvider = serviceProvider;

    public Task<TCommandResult> Dispatch<TCommand, TCommandResult>(TCommand command, CancellationToken cancellation)
    {
        var handler = _serviceProvider.GetRequiredService<ICommandHandler<TCommand, TCommandResult>>();
        return handler.Handle(command, cancellation);
    }
}

```

##### The Dispatch method of the CommandDispatcher class takes two type parameters, *TCommand* and *TCommandResult*, and two arguments, command and cancellation, respectively.
&nbsp;

##### Within the Dispatch method, the appropriate *ICommandHandler<TCommand, TCommandResult>* is obtained from the _serviceProvider field using the GetRequiredService method, which returns a new instance of the service.
&nbsp;

##### Then the Handle method of the obtained handler is called with the provided command and cancellation arguments. Finally, the Task returned from the Handle method is returned from the Dispatch method.

&nbsp;  
&nbsp;  
### How to use it?
&nbsp;  
&nbsp;  

##### As you would use it with MediatR, you use it in an identical way without the library.
&nbsp;  

##### Let's say we have a **UsersController** that represents an endpoint in the API and returns a user with a given Id. Since it queries the database, we know that we will have some *Query* and *QueryHandler*.
&nbsp;  

##### The first thing that needs to be done is to inject the **QueryDispatcher** (this is how we also inject IMediatR) through DI.

```csharp

[Route("api/[controller]")]
[ApiController]
public class UsersController(IQueryDispatcher queryDispatcher, ICommandDispatcher commandDispatcher) : ControllerBase
{
    private readonly IQueryDispatcher _queryDispatcher = queryDispatcher;
    private readonly ICommandDispatcher _commandDispatcher = commandDispatcher;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var query = new GetUserByIdQuery { UserId = id };
        var user = await _queryDispatcher.Dispatch<GetUserByIdQuery, User>(query, cancellationToken);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }
}

```
&nbsp;  

##### The **_queryDispatcher.Dispatch** method sends the query to the appropriate query handler registered with the application's dependency injection container, which executes the query and returns the result.
&nbsp;  

##### In this case, the query handler retrieves the user with the specified ID from the data store and returns it as a **User** object as result.
&nbsp;  

##### A similar way to how MediatR calls the corresponding handlers.
&nbsp;  

##### In order for this to work, it is necessary to create a **Query** and its **Handler**.
&nbsp;  

##### **GetUserByIdQuery** is nothing but a simple wrapper around Id.
&nbsp;  

##### For the same Query, there is also a **QueryHandler** that will be called when the Dispatcher dispatches this Query.
&nbsp;  

##### The QueryHandler looks like this:

```csharp

public class GetUserByIdQueryHandler : IQueryHandler<GetUserByIdQuery, User>
{
    public GetUserByIdQueryHandler() { }

    public async Task<User> Handle(GetUserByIdQuery query, CancellationToken cancellationToken)
    {
        //Call Repository
        return new User();
    }
}

```
##### For every other command or query, you would create the same class structure.
&nbsp;  

##### What is missing here is validation, which can be represented as the GetUserByIdQueryValidation class and which will validate the input.

&nbsp;  
&nbsp;  
### Wrapping Up
&nbsp;  
&nbsp;  

##### That's all from me today.
&nbsp;  

##### I strongly recommend that you read/watch something about the Mediator pattern as well as about the MediatR library itself, where it is most suitable for use.
&nbsp;  

##### Using MediatR in CQRS implementation is not wrong. Considering the increasing use of 'Clean Architecture', it is a great way to make code more readable and maintainable.
&nbsp;  

##### I have certainly shown here that the purpose of MediatR is not to be used to implement CQRS, and that it is absolutely possible to implement this pattern without any libraries in a very simple way.
&nbsp;  

##### It's Monday, make a coffee and check the whole project implementation on [GitHub repository](https://github.com/StefanTheCode/CleanCQRS).
<!--END-->
