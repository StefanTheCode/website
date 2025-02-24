---
title: "Memory Caching in .NET"
subtitle: ".NET memory caching is a feature used to store objects in memory for faster access. This can significantly improve the performance of applications, especially those that frequently access data from databases, web services, or other time-consuming data retrieval sources."
date: "August 10 2024"
photoUrl: "/images/blog/newsletter21.png"
---

&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • Transform your API development process with Postman Flows! Experience a new way to visually create, debug, and automate complex API workflows with ease. Dive into the future of API management and enhance your productivity [here](https://www.postman.com/product/flows/).
&nbsp;  
&nbsp;  

<!--START-->

### What is .NET Caching?
&nbsp;  
&nbsp;  
##### .NET memory caching is a feature used to store objects in memory for faster access. This can significantly improve the performance of applications, especially those that frequently access data from databases, web services, or other time-consuming data retrieval sources.
&nbsp;  

##### **Types of Caching**
&nbsp;  

##### **- In-Memory Caching**: Data is stored in the memory of the web server. It's fast but limited to the server's memory capacity.
&nbsp;  

##### **- Distributed Caching**: Data is stored across multiple servers. This is useful in web farm scenarios where there are multiple servers.
&nbsp;  

##### **Caching Key components**
&nbsp;  

##### **- Cache Key**: A unique identifier for each cache entry.
##### **- Cache Value**: The data stored in the cache. This can be of any object type.
##### **- Expiration Policy**: Determines how long an item stays in the cache. Can be absolute (fixed duration) or sliding (reset on access).
##### **- Priority**: Determines the order in which items are removed from the cache under memory pressure.

&nbsp;  
&nbsp;  

### [4 Important types of caching - Watch YouTube video here](https://youtu.be/PpKEcbTrR4w?si=lkSRdS604rzhAJwa)
![Watch YouTube video](/images/blog/posts/memory-caching-in-dotnet/youtube.png)

&nbsp;  
&nbsp;  
### Memory Cache Implementation in .NET
&nbsp;  
&nbsp;  

##### .NET provides various ways to implement caching, but the most common are:
&nbsp;  

##### **• MemoryCache Class (System.Runtime.Caching)**: Used for in-memory caching. It's part of the .NET Framework and .NET Core.
&nbsp;  

##### **• IMemoryCache (Microsoft.Extensions.Caching.Memory)**: Introduced in .NET Core, it offers more features and better performance compared to MemoryCache.
&nbsp;  

##### In this issue I'll talk about IMemoryCache.

&nbsp;  
&nbsp;  
### IMemoryCache in .NET
&nbsp;  
&nbsp;  

##### What are the key features of this library?
&nbsp;  

##### **1. Strongly Typed**: Unlike the earlier MemoryCache, IMemoryCache is strongly typed, reducing errors and improving code readability.
&nbsp;  

##### **2. Dependency Injection Friendly**: IMemoryCache is designed to be used with dependency injection, making it easy to manage and test.
&nbsp;  

##### **3. Expiration Policies**:   
&nbsp;  

##### **- Absolute Expiration**: The cache entry will expire after a set duration.  
##### **- Sliding Expiration**: The cache entry will expire if it's not accessed within a set duration.  
##### **- Expiration Tokens**: These allow cache entries to be evicted based on external triggers, like file changes.
&nbsp;  

##### **4. Size Limitations**: You can set a size limit for the cache and define the size for each entry, helping to manage memory usage effectively.
&nbsp;  

##### **5. Eviction Callbacks**: Callbacks can be registered to execute custom logic when a cache entry is evicted.
&nbsp;  

##### **6. Thread Safety**: IMemoryCache is thread-safe, allowing concurrent access by multiple threads.
&nbsp;  

##### Nice. Now when we know the basics about IMemoryCache, let me show how to implement it.

&nbsp;  
&nbsp;  
### IMemoryCache in .NET
&nbsp;  
&nbsp;  

##### The first thing we need to do is to add nuget package, of course:

```csharp

dotnet add package Microsoft.Extensions.Caching.Memory

```
&nbsp;  

##### To successfully use the library, we need to add it through Dependency Injection in Program.cs class:

```csharp

builder.Services.AddMemoryCache();

```
&nbsp;  

##### And you can use it with practically no configuration. 
&nbsp;  
##### I will inject it directly into the controller that .NET created for me by default.

```csharp

private readonly IMemoryCache _cacheService;

public WeatherForecastController(IMemoryCache cacheService)
{
    _cacheService = cacheService;
}

```
&nbsp;  

##### And now in the GET method where we capture the weather forecast from various weather stations, we will include cached ones. We understand that the weather will not change every minute, so we can cache the weather forecast values for a while.

```csharp

[HttpGet(Name = "GetWeatherForecast")]
public List<WeatherForecast> Get()
{
    if (!_cacheService.TryGetValue("MyCacheKey", out List<WeatherForecast> weathersFromCache))
    {
        var weathers = Enumerable.Range(1, 300).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        }).ToList();

        _cacheService.Set<List<WeatherForecast>>("MyCacheKey", weathers);

        return weathers;
    }

    return weathersFromCache;
}

```
&nbsp;  

##### Explanation:
&nbsp;  

##### **• Cache Check _casheService.TryGetValue...**:
&nbsp;  

##### - It attempts to retrieve a cached value associated with the key "MyCacheKey" (Don't hardcode this).
##### - If the value is found in the cache, it is output into weathersFromCache.
##### - The method TryGetValue returns true if the key was found in the cache, and false otherwise.
&nbsp;  

##### **• Cache Miss Handling**:
&nbsp;  

##### - If the cache does not contain the key (i.e., TryGetValue returned false), the code block inside the if statement is executed.
##### - A new list of WeatherForecast objects is created by generating 300 forecasts.
##### - This newly created list is then stored in the cache with the key "MyCacheKey".
&nbsp;  

##### **• Returning the Result**:
&nbsp;  

##### If the data was retrieved from the cache, it is returned directly.If the data was not in the cache (cache miss), the newly generated list is returned.

&nbsp;  
&nbsp;  
### IMemoryCache Expiration Time
&nbsp;  
&nbsp; 

##### In the provided code snippet, there is no explicit cache expiration time set. This means the cache entry for "MyCacheKey" **will remain in the cache indefinitely**, or until it is explicitly removed or replaced, or if the cache evicts it due to memory pressure.
&nbsp;  

##### To set an explicit cache expiration time, you would need to modify the code where the cache entry is set.
&nbsp;  

##### This involves using **MemoryCacheEntryOptions** to specify the desired expiration policy.
&nbsp;  

##### There are two common ways to set expiration:
&nbsp;  

##### **• Absolute Expiration**: The cache entry will expire after a specified duration regardless of whether it is accessed or not.
&nbsp;  

##### **• Sliding Expiration**: The cache entry will expire after a specified duration if it is not accessed within that timeframe. Each access to the cache entry resets the expiration timer.
&nbsp;  

##### Let's see both in action.
&nbsp;  

##### **Setting Absolute Expiration**
&nbsp;  

##### Here's how you can modify the code to set an absolute expiration of, for example, 30 minutes:

```csharp

var cacheEntryOptions = new MemoryCacheEntryOptions
{
    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30) // Cache for 30 minutes
};

_cacheService.Set<List<WeatherForecast>>("MyCacheKey", weathers, cacheEntryOptions);

```
&nbsp;  

##### When to use?
&nbsp;  

##### 1. When data has a known and fixed expiry time.
##### 2. When it's important to refresh data at predictable intervals, regardless of how often it is accessed.
&nbsp;  

##### **Setting Sliding Expiration**
&nbsp;  

##### And here's how you can set a sliding expiration of 30 minutes:

```csharp

var cacheEntryOptions = new MemoryCacheEntryOptions
{
    SlidingExpiration = TimeSpan.FromMinutes(30) // Cache for 30 minutes
};

_cacheService.Set<List<WeatherForecast>>("MyCacheKey", weathers, cacheEntryOptions);

```
&nbsp;  
##### When to use?
&nbsp;  

##### 1. When the importance of the data is based on how recently it has been accessed.
##### 2. To automatically manage memory by removing less frequently accessed items.
&nbsp;  

##### **Combining Both**
&nbsp;  

##### You can also combine both absolute and sliding expirations for more complex caching scenarios:

```csharp

var cacheEntryOptions = new MemoryCacheEntryOptions
{
    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1), // Absolute expiration of 1 hour
    SlidingExpiration = TimeSpan.FromMinutes(30) // Sliding expiration of 30 minutes
};

_cacheService.Set<List<WeatherForecast>>("MyCacheKey", weathers, cacheEntryOptions);

```

##### In this combined scenario, the cache entry will expire if it's not accessed for 30 minutes, but it will also expire unconditionally after 1 hour from when it was added to the cache.

&nbsp;  
&nbsp;  
### IMemoryCache MemoryCacheEntryOptions
&nbsp;  
&nbsp;   

##### MemoryCacheEntryOptions is a versatile class in .NET Core's caching infrastructure that allows you to configure various aspects of how individual items are cached in memory.
&nbsp;   

##### This configuration plays a crucial role in optimizing the performance and resource management of your application.
&nbsp;   

##### Here's a more detailed look at what you can set using MemoryCacheEntryOptions besides Expiration Settings:
&nbsp;   

##### **1. Priority**
&nbsp;   

##### CacheItemPriority: Determines the priority of a cache entry. During memory pressure, entries with lower priority may be removed first to free up space. Values range from Low to NeverRemove.
&nbsp;   

##### **2. Size**
&nbsp;   

##### Specifies the size of the cache entry, which is considered when the cache size limit is set on the IMemoryCache instance. This helps in controlling the memory footprint of the cache.
&nbsp;   

##### **3. Callbacks and Tokens**
&nbsp;   

##### **• PostEvictionCallbacks**: A list of callbacks that will be executed after the cache entry is removed. This is useful for performing actions like logging or cleanup operations.
&nbsp;   

##### **• RegisterPostEvictionCallback**: A method to add a post-eviction callback directly to the cache entry options.
&nbsp;   

##### **• ExpirationTokens**: These allow the cache entry to be dependent on external triggers. For example, you can link a cache entry to a file using a FileChangeToken, and the cache entry will be evicted if the file changes.
&nbsp;   

##### **4. Change Tokens**
&nbsp;   

##### **AddExpirationToken(IChangeToken token)**: This method allows you to add a custom implementation of IChangeToken to trigger cache evictions. It's a powerful feature for creating complex cache invalidation logic based on external changes.
&nbsp;   

##### **Example usage**:

```csharp

var cacheEntryOptions = new MemoryCacheEntryOptions()
{
    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(60), // Expires in 60 minutes
    SlidingExpiration = TimeSpan.FromMinutes(15), // Reset expiration to 15 minutes if accessed
    Priority = CacheItemPriority.High, // High priority
    Size = 1024 // Size of the entry is 1024 units
};

cacheEntryOptions.RegisterPostEvictionCallback(
    (key, value, reason, state) =>
    {
        Console.WriteLine($"Cache item {key} was removed due to {reason}.");
    }
);

_memoryCache.Set("MyCacheKey", myObject, cacheEntryOptions);

```

&nbsp;  
&nbsp;  
### What next?
&nbsp;  
&nbsp;  

##### This was a junior and practical "tutorial" on how to use MemoryCache in a .NET application, which options exist, and what they are for.
&nbsp;  

##### It is certainly an excellent start for those who have not had experience with cashing.
&nbsp;  

##### IMemoryCache often does not find a real and practical role in real projects, especially if distributed caching is necessary.In those cases, I would recommend **caching with Redis**, which I will also talk about.
&nbsp;  

##### Write to me about what you would like me to write about when it comes to cashing.
&nbsp;  

##### You can see the full code for today's issue at the following [GitHub repository](https://github.com/StefanTheCode/IMemoryCacheDemo).
&nbsp;  

##### That's all from me today.

<!--END-->
