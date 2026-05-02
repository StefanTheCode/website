---
title: "API Gateway with Ocelot"
subtitle: "An API Gateway is a component of the app-delivery infrastructure that sits between clients..."
date: "Jan 29 2024"
category: "APIs"
readTime: "Read Time: 4 minutes"
meta_description: "Master API Gateway Ocelot in .NET: Learn to streamline microservices with efficient routing, load balancing, and authentication for robust API management."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">- Streamline your API development with <a href="https://www.postman.com/product/rest-client/" style="color: #a5b4fc; text-decoration: underline;">Postman's REST Client</a> a powerful tool for sending requests, inspecting responses, and debugging REST APIs with ease. Discover a more efficient way to build and test APIs at <a href="https://www.postman.com/product/rest-client/" style="color: #a5b4fc; text-decoration: underline;">link</a>.</p>
<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">-  Elevate your Angular skills with the updated recipes in the new edition of <a href="https://packt.link/LK0bg" style="color: #a5b4fc; text-decoration: underline;">Angular Cookbook</a> written by Google Developer Expert! Discover cutting-edge solutions and tooling for seamless app development. Check the full book <a href="https://packt.link/LK0bg" style="color: #a5b4fc; text-decoration: underline;">here</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers.<br/><br/><a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</p>
</div>


## What is an API Gateway?
An API Gateway is a component of the app-delivery infrastructure that sits between clients and services and provides centralized handling of API communication between them. It also delivers security, policy enforcement, and [monitoring](https://thecodeman.net/posts/how-to-monitor-dotnet-applications-in-production) and visibility across on-premises, multi-cloud, and hybrid environments.
API Gateway acts as a front door for managing incoming API requests. This includes requests from various clients like web, mobile, or external third-party systems.
Some of the key features of an API Gateway are:

- Request Routing:

The API Gateway is responsible for routing requests from clients to the appropriate microservice. This allows for a clean separation of concerns and decoupling of the client from the underlying microservices.

- Protocol Translation:

An API Gateway can translate between different protocols, such as HTTP and [gRPC](https://thecodeman.net/posts/unlock-the-power-of-high-performance-web-applications-with-grpc), making it easier to expose microservices over a variety of interfaces.

- Load Balancing:

The API Gateway can also distribute incoming requests evenly across multiple instances of a microservice to improve performance and resilience.

- Caching:

The API Gateway can cache frequently requested data to reduce the load on the microservices and improve response times.

- Security:

An API Gateway can provide security features, such as authentication, authorization, and encryption, to protect microservices from unauthorized access.

- Monitoring:

The API Gateway can collect and aggregate metrics and logs from the microservices and provide visibility into the health and performance of the system as a whole.
![API Gateway Diagram](/images/blog/posts/api-gateway-with-ocelot/api-gateway-diagram.png)

## What is Ocelot?

Ocelot is widely used in the .NET community as it integrates well with other .NET and ASP.NET Core features and services.
​​​It's a lightweight API Gateway, making it an attractive choice for us, .NET developers, looking to implement an API gateway without introducing a lot of additional complexity or overhead. You can see more details [here](https://github.com/ThreeMammals/Ocelot). 

## How to implement Ocelot API Gateway in .NET?

To implement Ocelot API Gateway in .NET you should create at minimum 3 API Projects: Two microservices as use-case and the ApiGateway itself.
Here's how I did it:
![API Gateway Diagram](/images/blog/posts/api-gateway-with-ocelot/project-structure.png)
There are 2 different .NET Web Api projects that represent microservices: **Products** and **Users**. These services will be called by the third **Gateway** project depending on what kind of request is needed.
Let's create controllers in each of the microservices with some default endpoints.
Products Microservice - I will create a **ProductsController** with only one endpoint that returns a list of products - in this case, it will be a hardcoded list of 3 products:
```csharp
[ApiController]
[Route("/api/[controller]")]
public class ProductsController : ControllerBase
{
    private static readonly List<string> Products =
    [
        "Apple",
        "Milk",
        "Juice"
    ];

    private readonly ILogger<ProductsController> _logger;

    public ProductsController(ILogger<ProductsController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetProducts")]
    public List<string> Get()
    {
        return Products;
    }
}
```
UserMicroservice - In a similar way, I will create the **UsersController**:

```csharp
[ApiController]
[Route("/api/[controller]")]
public class UsersController : ControllerBase
{
    private static readonly List<string> Users =
    [
        "Stefan",
        "Dajana",
        "Milan"
    ];

    private readonly ILogger<UsersController> _logger;

    public UsersController(ILogger<UsersController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetUsers")]
    public List<string> Get()
    {
        return Users;
    }
}
```
We have microservices ready, we can focus on creating the Gateway.
Before everything, we need to install an Ocelot package from NuGet Package Manager in Gateway project.
The first thing to do to set up the Ocelot API Gateway in .NET is to create an **ocelot.json configuration file**. 
```csharp
{
    "GlobalConfiguration": {},
    "Routes": [
        {}
    ]
}
```
So, what is ocelot.json file?
This file serves as the **setup instructions for the API Gateway**, consisting of two main parts: a collection of **Routes** and a **GlobalConfiguration**.
- Routes function as directives for Ocelot, guiding the handling of incoming requests.
- On the other hand, the Global configuration offers a somewhat makeshift solution, providing the ability to modify settings that are typically specific to individual Routes.
In this file, we will define the routes of our microservices.

```csharp
{
    "Routes": [
        {
            "DownstreamPathTemplate": "/api/Products",
            "DownstreamScheme": "http",
            "DownstreamHostAndPorts": [
                {
                    "Host": "localhost",
                    "Port": 5123
                }
            ],
            "UpstreamPathTemplate": "/api/Products",
            "UpstreamHttpMethod": ["Get"]
        },
        {
            "DownstreamPathTemplate": "/api/Users",
            "DownstreamScheme": "http",
            "DownstreamHostAndPorts": [
                {
                    "Host": "localhost",
                    "Port": 5233
                }
            ],
            "UpstreamPathTemplate": "/api/Users",
            "UpstreamHttpMethod": ["Get"]
        }
    ],
    "GlobalConfiguration": {
        "BaseUrl": "http://localhost:5165"
    }
}
```
Explanation: 
- First Route (Products API)
**- DownstreamPathTemplate**: /api/Products
This is the path that Ocelot will use to forward requests to the downstream service. When Ocelot receives a request that matches this path, it will route it to the specified downstream service.
**- DownstreamScheme**: http
This indicates the protocol used to communicate with the downstream service.
**- DownstreamHostAndPorts**:
Specifies that the downstream service for the Products API is hosted at localhost on port 5123.
**- UpstreamPathTemplate**: /api/Products
This is the path that clients will use to send requests to Ocelot. When a request is sent to this path, Ocelot knows to route it according to this configuration.
**- UpstreamHttpMethod**: [ "Get" ]. This indicates that this route will only handle GET requests.
**- Second Route (Users API)** = same rules.
- Global Configuration
**- BaseUrl**: http://localhost:5165.
This is the base URL where the Ocelot API Gateway is hosted. All incoming requests to Ocelot should be sent to this URL. Ocelot will then route these requests to the appropriate downstream service based on the route configuration.
What next?
Let's register Ocelot in DI and tell it to use the ocelot.json file we created.
```csharp
builder.Configuration.AddJsonFile("ocelot.json",
                          optional: false,
                          reloadOnChange: true);

builder.Services.AddOcelot(builder.Configuration);
```
## What next?
This was a fairly simple demonstration of an Ocelot API Gateway implementation with 2 microservices.
Ocelot offers many more features, such as [Rate Limiting](https://thecodeman.net/posts/how-to-implement-rate-limiter-in-csharp), Authentication, Cashing and many more.
If you liked this issue, feel free to suggest if you want Part 2 with a little more advanced stuff.
Until then, you can see the full code for today's issue at the following [GitHub repository](https://github.com/StefanTheCode/OcelotApiGatewayDemo).
That's all from me today. 
See ya on the next Monday coffee.

## Wrapping Up

<!--END-->



