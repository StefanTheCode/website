---
title: "The ServiceCollection Extension Pattern"
subtitle: "The IServiceCollection interface represents a contract for a collection of service descriptors, providing an abstraction to add, remove, and retrieve services..."
date: "Apr 08 2024"
category: ".NET"
readTime: "Read Time: 3 minutes"
meta_description: "The IServiceCollection interface represents a contract for a collection of service descriptors, providing an abstraction to add, remove, and retrieve services."
photoUrl: "/images/blog/newsletter21.png"
---

&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • Streamline your API development with [Postman's REST Client](https://www.postman.com/product/rest-client/) a powerful tool for sending requests, inspecting responses, and debugging REST APIs with ease. Discover a more efficient way to build and test APIs at [link](https://www.postman.com/product/rest-client/).
&nbsp;  
##### • Backend design like you've never seen it before - a guide to building SOLID ASP.NET Core web apps that stand the test of time. Featuring more Minimal APIs, more testing, a new e-commerce project, and the modular monolith! Explore the contents in depth [here](https://amzn.to/3THdL7u).
&nbsp;  

<!--START-->

### Background
&nbsp;  
&nbsp;  

##### In the .NET environment, Dependency Injection (DI) is a fundamental technique that helps us to create flexible, testable, and loosely coupled code.
&nbsp;  

##### It's an instance of the Inversion of Control (IoC) principle, where the control of creating objects is handled by a container or a framework, rather than by the classes themselves.
&nbsp;  

##### The **IServiceCollection interface** represents a contract for a collection of service descriptors, providing an abstraction to add, remove, and retrieve services.
&nbsp;  

##### This interface becomes very important in the Program.cs class.
&nbsp;  

##### Here, we inject all of the necessary services that our application requires.

&nbsp;  
&nbsp;  
### The ServiceCollection Extension Pattern
&nbsp;  
&nbsp;  
##### In larger applications, Program.cs can become bloated and messy.
&nbsp;  
##### To avoid this, we can utilize a pattern called the **ServiceCollection Extension Pattern**.
&nbsp;  
##### This pattern lets us encapsulate the service registration logic into separate static classes, providing a more organized and readable structure. 
&nbsp;  
##### The pattern involves creating extension methods on the **IServiceCollection interface**.
&nbsp;  
##### The benefit of this approach is the ability to organize related services into logical groups, making it easier to manage the services we're adding.
&nbsp;  
##### Let's see an example:

```csharp

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddCustomServices(
        this IServiceCollection services)
    {
        services.AddScoped<IMyService, MyService>();
        services.AddSingleton<IOtherService, OtherService>();

        // ... other services

        return services;
    }
}

```

##### And then in your Program.cs file, you can leverage these extensions like this:

```csharp

builder.Services.AddCustomServices();

```
&nbsp;  
&nbsp;  
### The Real-world Example
&nbsp;  
&nbsp;  

##### We can further categorize our services using this pattern, for example, by creating different extension methods for different types or layers of services.
&nbsp;  

##### Let's consider an application that uses Entity Framework Core for data access, Identity for authentication and authorization, and also needs to configure CORS (Cross-Origin Resource Sharing).
&nbsp;  

##### Here's how you might apply the ServiceCollection Extension Pattern in such a scenario.
&nbsp;  

##### Database:

```csharp

public static IServiceCollection AddDatabase(
    this IServiceCollection services,
    string connectionString)
{
    services.AddDbContext<MyDbContext>(options => options.UseSqlServer(connectionString));

    return services;
}

```

##### Identity:

```csharp

public static IServiceCollection AddIdentityServices(
    this IServiceCollection services)
{
    services.AddIdentity<ApplicationUser, IdentityRole>()
        .AddEntityFrameworkStores<MyDbContext>()
        .AddDefaultTokenProviders();

    return services;
}

```

##### JWT Authentication:

```csharp

public static IServiceCollection AddJwtAuthentication(
    this IServiceCollection services, IConfiguration configuration)
{
    var jwtSettings = configuration.GetSection("JwtSettings");
    var key = Encoding.ASCII.GetBytes(jwtSettings.GetValue<string>("Secret"));

    services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

    return services;
}

```

##### Cors Policy:

```csharp

public static IServiceCollection AddCorsPolicy(
    this IServiceCollection services,
    string policyName,
    string[] allowedOrigins)
{
    services.AddCors(options =>
    {
        options.AddPolicy(policyName,
            builder => builder.WithOrigins(allowedOrigins)
                     .AllowAnyMethod()
                     .AllowAnyHeader()
                     .AllowCredentials());
    });

    return services;
}

```

##### And then in your Program.cs file, you can leverage these extensions like this:

```csharp

builder.Services.AddDatabase(Configuration.GetConnectionString("DefaultConnection"));
builder.Services.AddIdentityServices();
builder.Services.AddJwtAuthentication(Configuration);
builder.Services.AddCorsPolicy("MyPolicy", new[] { "http://example.com" });

// ... other configurations

```

&nbsp;  
&nbsp;  
### Why should we consider using it?
&nbsp;  
&nbsp;  

#### 1. Organization and Readability
&nbsp;  

##### In a large application with a myriad of services, the Program.cs can quickly become bloated and messy.
##### This makes it difficult for a developer to comprehend what's going on at a glance.
##### By utilizing the ServiceCollection Extension Pattern, we can neatly encapsulate the service registration into logical groups of related services.
&nbsp;  
##### This improves the readability of your code and makes it easier to understand, which is especially valuable in team environments.
&nbsp;  

#### 2. Encapsulation
&nbsp;  

##### The ServiceCollection Extension Pattern follows the principle of Encapsulation, a core tenet of object-oriented programming.
&nbsp;  

##### Encapsulation enables us to hide the complexity of service registrations behind a set of methods.
##### This shields other parts of your application from the intricacies of these operations, and provides a clean and simple interface to register services.
&nbsp;  

#### 3. Maintainability
&nbsp;  

##### Applications are bound to evolve over time.
&nbsp;  

##### The services you start with may not be the ones you end with. With the ServiceCollection Extension Pattern, it's easier to modify, add, or remove service registrations.
&nbsp;  

##### Since you have logically separated your service registrations, you can find and alter the specific group you need without hunting through a potentially large Program.cs.
&nbsp;  

#### 4. Reusability
&nbsp;  

##### If you have common sets of services used across multiple projects, you can reuse your extension methods in different applications. This cuts down on duplicated code, saving you time and reducing the potential for errors.
&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp; 

##### The ServiceCollection Extension Pattern is a valuable tool in keeping your Program.cs tidy and maintainable, particularly for larger applications.
&nbsp; 
##### By encapsulating the service registration logic into separate methods, we can improve the organization and readability of our service registration code.
&nbsp; 

##### That's all from me today.

<!--END-->
