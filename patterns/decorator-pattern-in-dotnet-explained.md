---
title: "Decorator Pattern in .NET Explained: Add Caching, Logging, and More with Ease"
subtitle: "The Decorator Pattern in .NET is ideal when you want to add responsibilities to objects dynamically. It allows you to extend functionality without modifying the existing code structure, adhering to the Open/Closed Principle. "
readTime: "Read Time: 6 minutes"
date: "Oct 29 2024"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Learn how to use the Decorator Pattern in .NET to enhance your applications with caching, logging, and other functionalities without modifying core code. Discover real-world examples, benefits, and best practices to boost code flexibility and maintainability."
---

<!--START-->

&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp; 
##### **The Decorator Pattern** is a structural design pattern that allows you to dynamically add behavior or responsibilities to an object without altering its structure or modifying the original code. 
##### This pattern is particularly useful for extending functionalities in a flexible and reusable way, adhering to the Open/Closed Principle (open for extension but closed for modification).
##### Here’s a practical example using a Web API for logging and caching.


&nbsp; 
&nbsp;
### Scenario
&nbsp; 
&nbsp; 

##### Suppose you have a service in a Web API that retrieves product details from a database. You want to add caching and logging features to this service without altering its core functionality.
&nbsp; 

#### Step 1: Define the Interface
&nbsp; 
##### First, create an interface that the service and decorators will implement.

```csharp

public interface IProductService
{
    Product GetProductById(int id);
}

```
&nbsp; 

#### Step 2: Implement the Core Service
&nbsp; 
##### Now, implement the core product retrieval logic without caching or logging.

```csharp

public class ProductService : IProductService
{
    public Product GetProductById(int id)
    {
        // Simulating data retrieval, e.g., from a database
        return new Product { Id = id, Name = "Product Name" };
    }
}

```
&nbsp; 

#### Step 3: Create the Decorators
&nbsp; 
##### Create two decorators: one for caching and one for logging. Each will add functionality around the *GetProductById* method.
&nbsp; 

##### **Caching Decorator**
```csharp

public class CachedProductService : IProductService
{
    private readonly IProductService _innerService;
    private readonly IMemoryCache _cache;

    public CachedProductService(IProductService innerService, IMemoryCache cache)
    {
        _innerService = innerService;
        _cache = cache;
    }

    public Product GetProductById(int id)
    {
        if (!_cache.TryGetValue(id, out Product product))
        {
            product = _innerService.GetProductById(id);
            _cache.Set(id, product);
        }
        return product;
    }
}

```
&nbsp; 
##### **Logging Decorator**
```csharp

public class LoggingProductService : IProductService
{
    private readonly IProductService _innerService;
    private readonly ILogger<LoggingProductService> _logger;

    public LoggingProductService(IProductService innerService, ILogger<LoggingProductService> logger)
    {
        _innerService = innerService;
        _logger = logger;
    }

    public Product GetProductById(int id)
    {
        _logger.LogInformation($"Fetching product with ID: {id}");
        var product = _innerService.GetProductById(id);
        _logger.LogInformation($"Fetched product: {product.Name}");
        return product;
    }
}

```
&nbsp;
#### Step 4: Compose the Decorators
&nbsp;
##### In the Startup.cs or Program.cs of the Web API, set up dependency injection to use both decorators.

```csharp

public void ConfigureServices(IServiceCollection services)
{
    services.AddMemoryCache();
    services.AddLogging();

    // Register the core service
    services.AddTransient<IProductService, ProductService>();

    // Apply decorators
    services.AddTransient<IProductService>(provider =>
    {
        var productService = provider.GetRequiredService<ProductService>();
        var memoryCache = provider.GetRequiredService<IMemoryCache>();
        var logger = provider.GetRequiredService<ILogger<LoggingProductService>>();

        // First, wrap with caching
        var cachedProductService = new CachedProductService(productService, memoryCache);

        // Then, wrap with logging
        return new LoggingProductService(cachedProductService, logger);
    });
}

```
&nbsp; 
&nbsp;
### How It Works
&nbsp; 
&nbsp; 

##### **1. Caching:** When *GetProductById* is called, the caching decorator checks if the product is in the cache. If not, it retrieves the data from the underlying ProductService and stores it in the cache.
&nbsp; 
##### **2. Logging:** The logging decorator wraps the cached service and logs each access, adding minimal overhead and keeping logging logic separate from core functionality.
&nbsp; 
##### This setup makes it easy to extend functionality (e.g., add security checks) without modifying existing classes, making the Decorator Pattern a powerful tool in .NET applications for flexible and scalable services.

&nbsp; 
&nbsp;
### Usage Example
&nbsp; 
&nbsp; 

##### Suppose you have a controller in a Web API that needs to retrieve product details. Here’s how you can use the *IProductService* interface in a controller.
&nbsp; 
##### **Product Controller**

```csharp

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet("{id}")]
    public IActionResult GetProduct(int id)
    {
        var product = _productService.GetProductById(id);
        if (product == null)
        {
            return NotFound();
        }
        return Ok(product);
    }
}

```
&nbsp; 
##### **Running the Example**
&nbsp; 

##### When you run this code and make a request to api/product/{id}, the following sequence happens:
&nbsp; 

##### **1. Logging:** The LoggingProductService decorator logs the request to fetch a product by ID.
##### **2. Caching:** The CachedProductService decorator checks if the product is already in memory. If it isn’t, it calls the inner ProductService to retrieve the data and stores it in the cache.
##### **3. Response:** The product data is returned to the client. On subsequent requests with the same product ID, the cache decorator returns the cached data without hitting the underlying service, which improves performance.

&nbsp; 
&nbsp;
### Adding More Decorators (Example)
&nbsp; 
&nbsp; 

##### Suppose you want to add a Rate Limiting Decorator to prevent abuse by limiting the number of requests a user can make to GetProductById within a specific timeframe.
&nbsp; 
##### **Rate Limiting Decorator**


```csharp

public class RateLimitedProductService : IProductService
{
    private readonly IProductService _innerService;
    private readonly Dictionary<int, int> _requestCounts = new();

    public RateLimitedProductService(IProductService innerService)
    {
        _innerService = innerService;
    }

    public Product GetProductById(int id)
    {
        if (_requestCounts.ContainsKey(id) && _requestCounts[id] >= 5) // Allow 5 requests per product ID
        {
            throw new InvalidOperationException("Rate limit exceeded for this product.");
        }

        _requestCounts[id] = _requestCounts.GetValueOrDefault(id, 0) + 1;
        return _innerService.GetProductById(id);
    }
}

```

&nbsp; 
##### In Program.cs, you can compose this new decorator as follows:

```csharp

services.AddTransient<IProductService>(provider =>
{
    var productService = provider.GetRequiredService<ProductService>();
    var memoryCache = provider.GetRequiredService<IMemoryCache>();
    var logger = provider.GetRequiredService<ILogger<LoggingProductService>>();

    // Layer the decorators
    var cachedService = new CachedProductService(productService, memoryCache);
    var loggedService = new LoggingProductService(cachedService, logger);
    return new RateLimitedProductService(loggedService);
});

```

##### Now, requests to GetProductById will also go through rate limiting, providing additional control over service usage.

&nbsp; 
&nbsp; 
### Cons
&nbsp; 
&nbsp; 

##### **Increased Complexity and Boilerplate Code**
&nbsp; 
##### **Multiple Classes:** Each new functionality (e.g., caching, logging) requires creating a new decorator class, which can lead to an explosion of classes if there are many responsibilities or if multiple services require similar decorations.
##### **Boilerplate:** Implementing the same methods repeatedly across decorators can introduce boilerplate code, especially if there are many methods in the interface.

&nbsp; 
&nbsp; 
### Wrapping up
&nbsp; 
&nbsp; 
##### The Decorator Pattern in .NET offers a scalable, flexible approach to dynamically add behaviors to classes without changing existing code. It’s ideal for scenarios where you need a combination of cross-cutting concerns (e.g., caching, logging, security, validation, rate limiting) in your services. This layered design can make your codebase more modular, testable, and maintainable, allowing you to adapt to new requirements with minimal changes.
&nbsp;  
##### That's all from me today.
&nbsp;  

##### P.S. If you want to see some more examples of this pattern or 9 more patterns I explained in my ebook **"Design Patterns Simplified"**, you can check out it [here](https://thecodeman.net/design-patterns-simplified?utm_source=design_patterns_page).

&nbsp;  
##### 1200+ enigneers already read it. 

<!--END-->