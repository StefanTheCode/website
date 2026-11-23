---
title: "Memory Caching in .NET"
seo_title: "IMemoryCache in C#: GetOrCreate, Expiration and Size Limits"
subtitle: ".NET memory caching is a feature used to store objects in memory for faster access. This can significantly improve the performance of applications, especially those that frequently access data from databases, web services, or other time-consuming data retrieval sources."
date: "August 10 2024"
category: ".NET"
readTime: "Read Time: 10 minutes"
meta_description: "Use IMemoryCache in C# and ASP.NET Core: GetOrCreateAsync, absolute vs sliding expiration, MemoryCacheEntryOptions and SizeLimit, with working code."
updated: "2026-11-23"
faq:
  - q: "What is IMemoryCache in C#?"
    a: >-
      IMemoryCache is the in-memory cache abstraction in .NET, from the Microsoft.Extensions.Caching.Memory package.
      It stores objects in the memory of the running process, so reads are very fast, but the data is lost on restart
      and is not shared between servers. You register it with AddMemoryCache() and inject IMemoryCache where you need it.
  - q: "What is the difference between absolute and sliding expiration in IMemoryCache?"
    a: >-
      Absolute expiration removes an entry after a fixed time, no matter how often it is read. Sliding expiration
      removes an entry only if nobody reads it for the given time, and every read resets the timer. Combine both so a
      frequently read entry still gets refreshed at a known maximum age.
  - q: "Is IMemoryCache thread-safe?"
    a: >-
      Yes, IMemoryCache is safe to read and write from multiple threads. GetOrCreate and GetOrCreateAsync are not
      atomic, though: if several requests miss the same key at the same time, the factory can run more than once.
      If that matters, use HybridCache, which has built-in stampede protection.
  - q: "Does IMemoryCache remove entries when memory is low?"
    a: >-
      No. ASP.NET Core does not trim IMemoryCache based on memory pressure. Set an expiration on every entry, and use
      SizeLimit on a dedicated MemoryCache instance when the number of keys can grow, for example when keys come from
      user input.
  - q: "Should I use IMemoryCache or IDistributedCache?"
    a: >-
      Use IMemoryCache when the app runs as a single instance, or when cached data may differ slightly between
      instances. Use IDistributedCache, for example with Redis, when several servers must see the same cached data or
      the cache must survive restarts. HybridCache combines both behind one API.
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">- Transform your API development process with Postman Flows! Experience a new way to visually create, debug, and automate complex API workflows with ease. Dive into the future of <a href="https://www.postman.com/product/flows/" style="color: #a5b4fc; text-decoration: underline;">API management and enhance your productivity here</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers.<br/><br/><a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #1a0224; background: #ffbd39; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</p>
</div>


<p style="margin: 28px 0 14px 0; text-align: center;">
<a href="https://www.youtube.com/watch?v=PpKEcbTrR4w" target="_blank" rel="noopener noreferrer" style="display: inline-block; text-decoration: none;">
<img src="https://img.youtube.com/vi/PpKEcbTrR4w/hqdefault.jpg" alt="Watch Caching in .NET on YouTube" style="display: block; width: 100%; max-width: 560px; border-radius: 14px; border: 1px solid rgba(15,23,42,0.12);" />
</a>
</p>
<p style="margin: 0 0 28px 0; text-align: center;"><a href="https://www.youtube.com/watch?v=PpKEcbTrR4w" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 18px; font-size: 15px; font-weight: 700; color: #111827; background: #facc15; border-radius: 999px; text-decoration: none;">Watch Caching in .NET on YouTube</a></p>

**Short answer:** IMemoryCache is the built-in in-memory cache in .NET (`Microsoft.Extensions.Caching.Memory`). Register it with `builder.Services.AddMemoryCache()`, inject `IMemoryCache`, and call `GetOrCreateAsync` to return a cached value or compute and store it in one step. Always set an expiration (absolute, sliding, or both), and use `SizeLimit` when the number of keys can grow, because ASP.NET Core does not shrink the cache on memory pressure. The cache lives inside one process, so for multiple servers use `IDistributedCache` or `HybridCache`.

## What is .NET Caching?
.NET memory caching is a feature used to store objects in memory for faster access. This can significantly improve the performance of applications, especially those that frequently access data from databases, web services, or other time-consuming data retrieval sources.

Types of Caching

**- In-Memory Caching**: Data is stored in the memory of the web server. It's fast but limited to the server's memory capacity.

**- Distributed Caching**: Data is stored across multiple servers. This is useful in web farm scenarios where there are multiple servers.

Caching Key components

**- Cache Key**: A unique identifier for each cache entry.
**- Cache Value**: The data stored in the cache. This can be of any object type.
**- Expiration Policy**: Determines how long an item stays in the cache. Can be absolute (fixed duration) or sliding (reset on access).
**- Priority**: Determines the order in which items are removed from the cache under memory pressure.

## Memory Cache Implementation in .NET

.NET provides various ways to implement caching, but the most common are:

**- MemoryCache Class (System.Runtime.Caching)**: Used for in-memory caching. It's part of the .NET Framework and .NET Core.

**- IMemoryCache (Microsoft.Extensions.Caching.Memory)**: Introduced in .NET Core, it offers more features and better performance compared to MemoryCache.

In this issue I'll talk about IMemoryCache.

## IMemoryCache Features

What are the key features of this library?

**1. Generic API**: Extension methods like `Get<T>`, `Set<T>`, `TryGetValue<T>` and `GetOrCreate<T>` give you typed access to cached values, which reduces casting errors and keeps the code readable.

**2. Dependency Injection Friendly**: IMemoryCache is designed to be used with dependency injection, making it easy to manage and test.

**3. Expiration Policies**:   

**- Absolute Expiration**: The cache entry will expire after a set duration.  
**- Sliding Expiration**: The cache entry will expire if it's not accessed within a set duration.  
**- Expiration Tokens**: These allow cache entries to be evicted based on external triggers, like file changes.

**4. Size Limitations**: You can set a size limit for the cache and define the size for each entry, helping to manage memory usage effectively.

**5. Eviction Callbacks**: Callbacks can be registered to execute custom logic when a cache entry is evicted.

**6. Thread Safety**: IMemoryCache is thread-safe, allowing concurrent access by multiple threads.

Nice. Now when we know the basics about IMemoryCache, let me show how to implement it.

## How to Use IMemoryCache in ASP.NET Core

In an ASP.NET Core app, `Microsoft.Extensions.Caching.Memory` is already part of the shared framework, so you can skip the package. In other project types (console app, class library), add it from NuGet:

```bash
dotnet add package Microsoft.Extensions.Caching.Memory
```

To successfully use the library, we need to add it through Dependency Injection in Program.cs class:

```csharp
builder.Services.AddMemoryCache();
```

And you can use it with practically no configuration. 
I will inject it directly into the controller that .NET created for me by default.

```csharp
private readonly IMemoryCache _cacheService;

public WeatherForecastController(IMemoryCache cacheService)
{
    _cacheService = cacheService;
}
```

And now in the GET method where we capture the weather forecast from various weather stations, we will include cached ones. We understand that the weather will not change every minute, so we can cache the weather forecast values for a while.

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

Explanation:

**- Cache Check _cacheService.TryGetValue...**:

- It attempts to retrieve a cached value associated with the key "MyCacheKey" (Don't hardcode this).
- If the value is found in the cache, it is output into weathersFromCache.
- The method TryGetValue returns true if the key was found in the cache, and false otherwise.

**- Cache Miss Handling**:

- If the cache does not contain the key (i.e., TryGetValue returned false), the code block inside the if statement is executed.
- A new list of WeatherForecast objects is created by generating 300 forecasts.
- This newly created list is then stored in the cache with the key "MyCacheKey".

**- Returning the Result**:

If the data was retrieved from the cache, it is returned directly.If the data was not in the cache (cache miss), the newly generated list is returned.

## IMemoryCache Expiration Time

In the provided code snippet, there is no explicit cache expiration time set. This means the cache entry for "MyCacheKey" **will remain in the cache indefinitely**, until it is explicitly removed or replaced. ASP.NET Core does not trim IMemoryCache when memory is low, so an entry without expiration can live for the whole lifetime of the app.

To set an explicit cache expiration time, you would need to modify the code where the cache entry is set.

This involves using **MemoryCacheEntryOptions** to specify the desired expiration policy.

There are two common ways to set expiration:

**- Absolute Expiration**: The cache entry will expire after a specified duration regardless of whether it is accessed or not.

**- Sliding Expiration**: The cache entry will expire after a specified duration if it is not accessed within that timeframe. Each access to the cache entry resets the expiration timer.

Let's see both in action.

Setting Absolute Expiration

Here's how you can modify the code to set an absolute expiration of, for example, 30 minutes:

```csharp
var cacheEntryOptions = new MemoryCacheEntryOptions
{
    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30) // Cache for 30 minutes
};

_cacheService.Set<List<WeatherForecast>>("MyCacheKey", weathers, cacheEntryOptions);
```

When to use?

1. When data has a known and fixed expiry time.
2. When it's important to refresh data at predictable intervals, regardless of how often it is accessed.

Setting Sliding Expiration

And here's how you can set a sliding expiration of 30 minutes:

```csharp
var cacheEntryOptions = new MemoryCacheEntryOptions
{
    SlidingExpiration = TimeSpan.FromMinutes(30) // Cache for 30 minutes
};

_cacheService.Set<List<WeatherForecast>>("MyCacheKey", weathers, cacheEntryOptions);
```
When to use?

1. When the importance of the data is based on how recently it has been accessed.
2. To automatically manage memory by removing less frequently accessed items.

Combining Both

You can also combine both absolute and sliding expirations for more complex caching scenarios:

```csharp
var cacheEntryOptions = new MemoryCacheEntryOptions
{
    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1), // Absolute expiration of 1 hour
    SlidingExpiration = TimeSpan.FromMinutes(30) // Sliding expiration of 30 minutes
};

_cacheService.Set<List<WeatherForecast>>("MyCacheKey", weathers, cacheEntryOptions);
```

In this combined scenario, the cache entry will expire if it's not accessed for 30 minutes, but it will also expire unconditionally after 1 hour from when it was added to the cache.

## IMemoryCache MemoryCacheEntryOptions

MemoryCacheEntryOptions is a versatile class in .NET Core's caching infrastructure that allows you to configure various aspects of how individual items are cached in memory.

This configuration plays a crucial role in optimizing the performance and resource management of your application.

Here's a more detailed look at what you can set using MemoryCacheEntryOptions besides Expiration Settings:

1. Priority

CacheItemPriority: Determines the priority of a cache entry. When the cache is compacted (for example after it reaches its SizeLimit), entries with lower priority are removed first. Values range from Low to NeverRemove.

2. Size

Specifies the size of the cache entry, which is considered when the cache size limit is set on the IMemoryCache instance. This helps in controlling the memory footprint of the cache.

3. Callbacks and Tokens

**- PostEvictionCallbacks**: A list of callbacks that will be executed after the cache entry is removed. This is useful for performing actions like logging or cleanup operations.

**- RegisterPostEvictionCallback**: A method to add a post-eviction callback directly to the cache entry options.

**- ExpirationTokens**: These allow the cache entry to be dependent on external triggers. For example, you can link a cache entry to a file using a FileChangeToken, and the cache entry will be evicted if the file changes.

4. Change Tokens

**AddExpirationToken(IChangeToken token)**: This method allows you to add a custom implementation of IChangeToken to trigger cache evictions. It's a powerful feature for creating complex cache invalidation logic based on external changes.

**Example usage**:

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

One catch with `Size`: it is ignored unless the cache has a `SizeLimit`. And once you set a `SizeLimit`, **every** entry must set a size, otherwise `Set` throws an `InvalidOperationException`. More on that below.

## GetOrCreateAsync: The Cleaner Way to Use IMemoryCache

The `TryGetValue` + `Set` combo from above works, but most of the time you want one call that says "give me the cached value, or create it". That's `GetOrCreateAsync`:

```csharp
app.MapGet("/products/{id:int}", async (int id, IMemoryCache cache, ProductRepository repository) =>
{
    var product = await cache.GetOrCreateAsync($"product:{id}", async entry =>
    {
        entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);
        entry.SlidingExpiration = TimeSpan.FromMinutes(2);

        return await repository.GetByIdAsync(id);
    });

    return product is null ? Results.NotFound() : Results.Ok(product);
});
```

The factory runs only on a cache miss, and you configure expiration on the `entry` right where the value is created.

When the data changes, remove the entry so the next read loads fresh data:

```csharp
await repository.UpdateAsync(product);
cache.Remove($"product:{product.Id}");
```

Two things to know:

- **GetOrCreateAsync is not atomic.** If 50 requests miss the same key at the same moment, the factory can run 50 times. For cheap queries that's fine. For expensive ones, look at [HybridCache in ASP.NET Core](https://thecodeman.net/posts/hybrid-cache-in-aspnet-core), which has stampede protection built in.
- **The cache stores object references.** If you change an object you got from the cache, you change the cached copy for every other request too. Cache immutable objects (records work great) or DTOs you never modify.

## Limit the Cache Size with SizeLimit

Here's the thing a lot of people miss: **ASP.NET Core does not limit IMemoryCache based on memory pressure.** If your keys come from user input (search terms, IDs, filters) and you have no limit, the cache can grow until the process runs out of memory.

`SizeLimit` has no unit. You decide what "1" means - one entry, one KB, the length of a string. The simplest option is "1 unit = 1 entry":

```csharp
public sealed class ProductCache
{
    public MemoryCache Cache { get; } = new(new MemoryCacheOptions
    {
        SizeLimit = 1_000 // max 1,000 entries, because every entry has Size = 1
    });
}

builder.Services.AddSingleton<ProductCache>();
```

```csharp
productCache.Cache.Set($"product:{id}", product, new MemoryCacheEntryOptions
{
    Size = 1,
    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
});
```

When the total size would go over the limit, the new entry is not cached and the cache starts compacting in the background, removing expired, low-priority and least recently used entries first.

Notice that this is a **dedicated** `MemoryCache` instance, not the shared one from `AddMemoryCache()`. Microsoft recommends this because other libraries can use the shared cache too, and if you put a `SizeLimit` on it, their entries without a `Size` will throw. See the [official IMemoryCache docs](https://learn.microsoft.com/aspnet/core/performance/caching/memory) for details.

## IMemoryCache vs IDistributedCache vs HybridCache

| | IMemoryCache | IDistributedCache | HybridCache |
|---|---|---|---|
| Where data lives | Memory of the current process | External store (Redis, SQL Server...) | In-memory (L1) + optional distributed store (L2) |
| Shared across servers | No | Yes | Yes, through L2 |
| Survives app restart | No | Yes | Yes, through L2 |
| Serialization | None, stores object references | You serialize to `byte[]` | Handled for you |
| Stampede protection | No | No | Yes |
| Good fit | Single instance, small hot data | Multi-server apps | One API for both levels |

If you run several instances behind a load balancer, every instance has its own IMemoryCache, so two requests can see different data for the same key. That's when you move to Redis or HybridCache. I covered both in [HybridCache in ASP.NET Core](https://thecodeman.net/posts/hybrid-cache-in-aspnet-core) and [Dual-Key Redis Caching](https://thecodeman.net/posts/dual-key-redis-caching-in-dotnet).

## When NOT to Use IMemoryCache

- Your app runs on multiple instances and users must always see the same data.
- The cached data must survive a restart or a deployment.
- Keys come from user input and you don't want to manage a `SizeLimit`.
- You would cache mutable objects (for example tracked EF Core entities) and change them later.

## What next?

This was a junior and practical "tutorial" on how to use MemoryCache in a .NET application, which options exist, and what they are for.

It is certainly an excellent start for those who have not had experience with caching.

IMemoryCache often does not find a real and practical role in real projects, especially if distributed caching is necessary. In those cases, I would recommend **caching with Redis** or **HybridCache**.

Write to me about what you would like me to write about when it comes to caching.

You can see the full code for today's issue at the following [GitHub repository](https://github.com/StefanTheCode/IMemoryCacheDemo).

That's all from me today.


For a more advanced caching strategy, check out [HybridCache in ASP.NET Core](https://thecodeman.net/posts/hybrid-cache-in-aspnet-core) and [Dual-Key Redis Caching](https://thecodeman.net/posts/dual-key-redis-caching-in-dotnet).


<!--END-->
