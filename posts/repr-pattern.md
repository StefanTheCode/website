---
title: "REPR Pattern - For C# developers"
subtitle: "The Request, Endpoint, Response (REPR) pattern is a modern architectural approach often used in web development to design robust, scalable, and maintainable APIs..."
date: "September 2 2024"
photoUrl: "/images/blog/newsletter21.png"
---

&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### •  Thanks to the VS Code extension by Postman, you can now test your API directly within your code editor.

Explore it [here](https://marketplace.visualstudio.com/items?itemName=Postman.postman-for-vscode).
&nbsp;  
&nbsp;  

<!--START-->
&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  

##### Controllers in .NET projects have never been the best solution for exposing the endpoints of your API.
&nbsp;  

##### Why?
&nbsp;  

##### Controllers become bloated very quickly.
&nbsp;  

##### The reason for this is that you end up with many controllers that have disparate methods that are not cohesive.
&nbsp;  

##### Today I will explain to you a great solution to this, in the form of the **REPR design pattern**.
&nbsp;  

##### We will go through:
&nbsp;  

##### [1. What is the REPR design pattern](#what-is-the-repr-design-pattern)
##### [2. Replacement of the controller with REPR pattern](#replacement-of-the-controller-with-repr-pattern)
##### [3. REPR pattern with FastEndpoints](#repr-pattern-with-fastendpoints)
##### [4. Cons](#cons-of-using-repr-pattern)
##### [5. Where to use it?](#where-to-use-it)
##### [6. Conclusion](#conclusion)
&nbsp;  

##### But did you know that there is something better that is also easier to implement?
&nbsp;  

##### Have you heard of Refit?
&nbsp;  

##### Let's see what it's all about.

&nbsp;  
&nbsp;  
### What is the REPR design pattern? 
&nbsp;  
&nbsp;  

##### The Request, Endpoint, Response (REPR) pattern is a modern architectural approach often used in web development to design robust, scalable, and maintainable APIs.
&nbsp;  

##### This pattern emphasizes **the clear separation of concerns between handling requests**, defining endpoints, and structuring responses.
&nbsp;  

##### In .NET 8, implementing the REPR pattern allows developers to create cleaner codebases, enhance API performance, and improve user experience.
&nbsp;  

##### What is the REPR Pattern in practice?
&nbsp;  

##### The REPR pattern breaks down API interaction into three distinct parts:
&nbsp;  

##### **1. Request:** The client's input data or action that initiates a process.
&nbsp;  

##### **2. Endpoint:** The server-side function or method that processes the request.
&nbsp;  

##### **3. Response:** The output or result returned to the client after processing the request.
&nbsp;  

##### By structuring APIs this way, each component is specialized and can be modified independently, making the system easier to maintain and evolve.
&nbsp;  

&nbsp;  
&nbsp;  
### Replacement of the controller with REPR pattern
&nbsp;  
&nbsp;  

##### Let's see a simple example with a User controller that has one method/endpoint to create a new user.
&nbsp;  
##### If you were to use controllers, it would look like this:

```csharp

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    // POST api/users
    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto createUserDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var createdUser = await _userService.CreateUserAsync(createUserDto);
        return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
    }
}

```

##### This controller structure is typical in many .NET applications and serves as a standard for managing RESTful API endpoints.
&nbsp;  

##### However, as I pointed out earlier, adopting patterns like REPR can further enhance the organization, scalability, and maintainability of your application.
&nbsp;  

##### Let’s explore how to implement the REPR pattern in a .NET 8 application step-by-step.
&nbsp;  

##### ** 1. Define the Request**
&nbsp;  

##### The request object represents the data sent from the client to the server. It typically contains all the necessary information for the server to process the request, such as parameters, headers, and body content.

```csharp

public class CreateUserRequest
{
    public string Username { get; set; };
    public string Email { get; set; };
    public string Password { get; set; };
}

```
&nbsp;  

##### Here, the CreateUserRequest class encapsulates the data required to create a new user.
&nbsp;  

##### **2. Create the Endpoint**
&nbsp;  

##### The endpoint is a server-side method or function that handles the incoming request. It contains the logic to process the request data, interact with services or databases, and prepare the response.

```csharp

[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
[Route("api/[controller]")]
[ApiController]
public class CreateUserController : ControllerBase
{
    [HttpPost(Name = "CreateUser")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> CreateCustomerAsync(CreateUserRequest createUserRequest)
    {
        var result = await _userService.CreateUserAsync(request);
        return result.Success ? Ok(result.Data) : BadRequest(result.ErrorMessage);
    }
}

```

##### **3. Design the Response**
&nbsp;  

##### The response object defines the structure of the data sent back to the client after the request has been processed. It provides feedback on the action, such as success or failure, along with any relevant data or error messages.

```csharp

public class ApiResponse<T>
{
    public bool Success { get; set; };
    public T Data { get; set; };
    public string ErrorMessage { get; set; };

    public static ApiResponse<T> SuccessResponse(T data) => new ApiResponse<T> { Success = true, Data = data };
    public static ApiResponse<T> ErrorResponse(string errorMessage) => new ApiResponse<T> { Success = false, ErrorMessage = errorMessage };
}

```
&nbsp;  

##### This ApiResponse<T> class is a generic response object that can handle various data types (T) and provide standardized success and error messages.
&nbsp;  

##### **4. Integrate the REPR Components**
&nbsp;  

##### Combining these components ensures a seamless flow from request to response. The endpoint processes the request, and based on the logic, it generates a response using the defined response object.

```csharp

[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
[Route("api/[controller]")]
[ApiController]
public class CreateUserController : ControllerBase
{
    [HttpPost(Name = "CreateUser")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> CreateCustomerAsync(CreateUserRequest createUserRequest)
    {
        var result = await _userService.CreateUserAsync(request);
        if (result.Success)
        {
            return Ok(ApiResponse<User>.SuccessResponse(result.Data));
        }
        else
        {
            return BadRequest(ApiResponse<string>.ErrorResponse(result.ErrorMessage));
        }
    }
}

```

&nbsp;  

##### This complete endpoint demonstrates how the REPR pattern is fully implemented:
&nbsp;  

##### - It receives a CreateUserRequest.
##### - Validates the request data.
##### - Uses a service to process the creation.
##### - Returns a standardized response using the ApiResponse class.

&nbsp;  
&nbsp;  
### REPR pattern with FastEndpoints
&nbsp;  
&nbsp;  
##### [FastEndpoints](https://fast-endpoints.com/) is a library for .NET that facilitates the use of the REPR pattern by providing a framework to define APIs in a more streamlined way compared to traditional ASP.NET Core controllers.
&nbsp;  

##### It promotes a minimalistic approach to defining endpoints and handling requests and responses.
&nbsp;  

##### It fits perfectly for the implementation of the REPR pattern, and we will see that now:

```csharp

using FastEndpoints;

public class CreateUserEndpoint : Endpoint<CreateUserRequest, CreateUserResponse>
{
    public override void Configure()
    {
        Post("/api/users/create");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CreateUserRequest req, CancellationToken ct)
    {
        // Example: Validate input data
        if (string.IsNullOrEmpty(req.Username) || string.IsNullOrEmpty(req.Email) || string.IsNullOrEmpty(req.Password))
        {
            await SendAsync(new CreateUserResponse
            {
                Success = false,
                Message = "Invalid input data. Please provide all required fields."
            });
            return;
        }

        // Example: Simulate user creation logic (e.g., save to database and hash password)
        // Here, we're simulating a successful user creation with a hardcoded user ID
        int newUserId = 123; // Replace this with actual logic to save the user and retrieve the ID

        // Example: Assume user creation was successful
        await SendAsync(new CreateUserResponse
        {
            Success = true,
            Message = "User created successfully.",
            UserId = newUserId
        });
    }
}

```
&nbsp;  
##### Explanation:
&nbsp;  

##### **Endpoint Configuration:**
&nbsp;  

##### ***- Routes("/api/users/create"):*** Defines the endpoint's route.
##### ***- AllowAnonymous():*** Allows the endpoint to be accessed without authentication, suitable for user registration or creation scenarios.
&nbsp;  

##### **Request Handling:**
&nbsp;  

##### The HandleAsync method processes the incoming CreateUserRequest.
##### It includes basic validation to ensure that all required fields are provided. If validation fails, it returns a response indicating the error.
&nbsp;  

##### **Benefits of Using FastEndpoints with the REPR Pattern**
&nbsp;  

##### **1. Reduced Boilerplate:** FastEndpoints minimizes the amount of boilerplate code compared to traditional controllers, focusing more on the core business logic.
&nbsp;  

##### **2. Clear Separation of Concerns:** By following the REPR pattern, each part of the process (request handling, endpoint logic, response generation) is distinct, making the code more maintainable and easier to understand.
&nbsp;  

##### **3. Scalability:** This modular approach makes it easier to scale your application. New endpoints can be added without affecting existing ones, and changes to business logic are isolated to specific endpoints.
&nbsp;  

##### **4. Testability:** With a clear separation of concerns, each component of the REPR pattern (Request, Endpoint, Response) can be individually tested, ensuring a more reliable and maintainable codebase.

&nbsp;  
&nbsp;  
### Cons of using REPR Pattern
&nbsp;  
&nbsp;  

##### Nothing in this world is perfect, and neither is REPR.

##### I personally encountered 2 problems, for which of course there is a solution:

##### **1. Swagger problem**

Every Endpoint, and consequently each Controller, will be displayed individually in the Swagger documentation. Thankfully, there's a way to manage this. By utilizing Tags in the SwaggerOperation attribute, we can organize them into groups. Below is a code snippet demonstrating how to do this:

```csharp

[SwaggerOperation(
    Tags = new[] { "UserEndpoints" }
)]

```

&nbsp;  

##### This will group all the endpoints with same tag together in Swagger document. 
&nbsp;  

##### 2. Developers can add aditional ActionMethod
&nbsp;  

##### Solution: Write [Architecture tests](https://thecodeman.net/posts/use-architecture-tests-in-your-projects).
&nbsp;  
&nbsp;
### Where to use it?
&nbsp;  
&nbsp;  

##### The REPR pattern is commonly applied in scenarios like **CQRS**, where distinct endpoints are designated for commands and queries, ensuring clear separation of responsibilities.
&nbsp;  
##### Another example is the **vertical slice architecture**, where the application is organized into distinct segments or slices, each tailored to specific functionality and use cases, promoting modularity and focus within the codebase.
&nbsp;  
&nbsp;  
### Conclusion
&nbsp;  
&nbsp;  

##### The Request, Endpoint, Response (REPR) pattern is a powerful approach for building APIs that emphasizes modularity, maintainability, and clarity.
&nbsp;  

##### By separating each part of the request-handling process into distinct components: request, endpoint, and response - the REPR pattern makes it easier to develop, test, and maintain complex applications.
&nbsp;  

##### It's easy to replace controllers with the REPR pattern.
&nbsp;  

##### From my experience, the advice is to use **FastEndpoints** considering the performance it offers compared to all other solutions.
&nbsp;  

##### The problems you may encounter listed above can be easily solved.
&nbsp;  

##### Use pattern in Vertical Slice Architecture but also in all other architectures, if you use CQRS for example.
&nbsp;  

##### That's all from me for today. Make a coffee and try REPR.
<!--END-->
