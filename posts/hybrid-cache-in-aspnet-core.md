---
title: "HybridCache in ASP.NET Core - .NET 9"
subtitle: "Caching is a mechanism to store frequently used data in a temporary storage layer so that future requests for the same data can be served faster, reducing the need for repetitive data fetching or computation."
date: "Dec 08 2024"
readTime: "Read Time: 6 minutes"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "The Chain of Responsibility pattern is a behavioral design pattern that allows you to build a chain of objects to handle a request or perform a task."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;   
##### • Tired of outdated API documentation holding your team back? Postman simplifies your life by [automatically syncing documentation with your API updates](https://community.postman.com/t/the-postman-drop-november-edition/71372?utm_source=influencer&utm_medium=Social&utm_campaign=nov24_global_growth_pmdropnl&utm_term=Stefan_Djokic) - no more static docs, no more guesswork!
##### [Read more](https://community.postman.com/t/the-postman-drop-november-edition/71372?utm_source=influencer&utm_medium=Social&utm_campaign=nov24_global_growth_pmdropnl&utm_term=Stefan_Djokic).

<!--START-->

&nbsp; &nbsp; 
### The background
&nbsp; &nbsp; 
##### **Caching** is a mechanism to store frequently used data in a temporary storage layer so that future requests for the same data can be served faster, reducing the need for repetitive data fetching or computation. 
&nbsp; 
##### ASP.NET Core provides multiple types of caching solutions that can be tailored to your application's needs.
&nbsp; 

##### Two most used are:

##### - [InMemory Cache](https://thecodeman.net/posts/memory-caching-in-dotnet?utm_source=article)
##### - Distributed Cache
&nbsp; 

##### **In-memory caching stores** data directly in the server's memory, making it fast and easy to implement using ASP.NET Core's IMemoryCache. It's ideal for single-server applications or scenarios where cached data doesn't need to persist across restarts. While highly performant, it's unsuitable for distributed environments as the data is not shared between servers.
&nbsp; 

##### **Distributed caching** stores data in a centralized external service like Redis or SQL Server, making it accessible across multiple servers. ASP.NET Core supports this via IDistributedCache, ensuring data consistency and persistence even in load-balanced environments. Though slightly slower due to network calls, it's ideal for scalable, cloud-based applications.
&nbsp; 

##### .NET 9 introduces **HybridCache**, a caching mechanism that combines the speed of in-memory caching with the scalability of distributed caching. This dual-layer approach enhances application performance and scalability by leveraging both local and distributed storage.
&nbsp; 

##### Let's see why is this interesting feature and how to implement it. 

&nbsp; 
&nbsp; 
### What is HybridCache?
&nbsp; 
&nbsp; 

![HybridCache](/images/blog/posts/hybrid-cache-in-aspnet-core/hybridcache.png)
&nbsp; 

##### [The HybridCache API](https://source.dot.net/#Microsoft.Extensions.Caching.Hybrid/Runtime/HybridCache.cs,8c0fe94693d1ac8d) bridges some gaps in the *IDistributedCache* and *IMemoryCache* APIs. 
&nbsp; 

##### HybridCache is an abstract class with a default implementation that handles most aspects of saving to cache and retrieving from cache.
&nbsp; 

##### In addition, the HybridCache also includes some important features relevant to the caching process. 
##### Those are:
&nbsp; 

##### **Two-Level Caching (L1/L2):**
##### Utilizes a fast in-memory cache (L1) for quick data retrieval and a distributed cache (L2) for data consistency across multiple application instances.
&nbsp; 

##### **Stampede Protection: **
##### Prevents multiple concurrent requests from overwhelming the cache by ensuring that only one request fetches the data while others wait, reducing unnecessary load.
&nbsp; 

##### **Tag-Based Invalidation: **
##### Enables grouping of cache entries with tags, facilitating efficient invalidation of related cache items simultaneously.
&nbsp; 

##### **Configurable Serialization: **
##### Allows customization of data serialization methods, supporting various formats like JSON, Protobuf, or XML, to suit specific application needs.
&nbsp; 

##### Let's see how to implement it.

&nbsp; 
&nbsp; 
### How to implement HybridCache in .NET 9?
&nbsp; 
&nbsp; 


##### To integrate HybridCache into an ASP.NET Core application:
&nbsp; 
##### **1. Install the NuGet Package:**

```csharp

dotnet add package Microsoft.Extensions.Caching.Hybrid --version "9.0.0-preview.7.24406.2"

```
&nbsp; 
##### **2. Register the Service:**

```csharp

builder.Services.AddHybridCache(options =>
{
    options.MaximumPayloadBytes = 1024 * 1024; // 1 MB
    options.MaximumKeyLength = 512;
    options.DefaultEntryOptions = new HybridCacheEntryOptions
    {
        Expiration = TimeSpan.FromMinutes(30),
        LocalCacheExpiration = TimeSpan.FromMinutes(30)
    };
});

```
&nbsp; 
##### The following properties of **HybridCacheOptions** let you configure limits that apply to all cache entries:
&nbsp; 

##### **MaximumPayloadBytes** - Maximum size of a cache entry. Default value is 1 MB. Attempts to store values over this size are logged, and the value isn't stored in cache.
&nbsp; 

##### **MaximumKeyLength** - Maximum length of a cache key. Default value is 1024 characters. Attempts to store values over this size are logged, and the value isn't stored in cache.
&nbsp; 

##### **3. Configure Distributed Cache (Optional):** To utilize a distributed cache like Redis:

```csharp

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "connectionString";
});

```
##### This is optional considering that HybridCache can function only as InMemory Cache.
&nbsp; 
##### And now you are able to use it.


&nbsp; 
&nbsp; 
### How to use HybridCache?
&nbsp; 
&nbsp; 

##### Scenario: Product API with Caching
&nbsp; 

##### We have an API that provides product information. Frequently accessed data will be cached for improved performance:
&nbsp; 

##### **1. L1 (In-memory):** To serve fast reads from local cache.
##### **2. L2 (Redis):** To ensure data consistency across distributed instances.

```csharp

public class ProductService(HybridCache cache)
{
    public async Task<List<Product>> GetProductsByCategoryAsync(string category, CancellationToken cancellationToken = default)
    {
        string cacheKey = $"products:category:{category}";

        // Use HybridCache to fetch data from either L1 or L2
        return await cache.GetOrCreateAsync(
            cacheKey,
            async token => await FetchProductsFromDatabaseAsync(category, token),
            new HybridCacheEntryOptions
            {
                Expiration = TimeSpan.FromMinutes(30), // Shared expiration for L1 and L2
                LocalCacheExpiration = TimeSpan.FromMinutes(5) // L1 expiration
            }, null,
            cancellationToken
        );
    }
}

```
&nbsp; 

#### How It Works
&nbsp; 

##### **1. Cache Lookup: **
##### - The method first checks if the cacheKey exists in HybridCache.
##### - If found, the cached data is returned (from L1 if available; otherwise, from L2).
&nbsp; 

##### **2. Cache Miss:**
##### - If the data is not present in both L1 and L2 caches, the delegate (*FetchProductsFromDatabaseAsync*) is invoked to fetch data from the database.
&nbsp; 

##### **3. Caching the Data:**
##### - Once the data is retrieved, it is stored in both L1 and L2 caches with the specified expiration policies.
&nbsp; 

##### **4. Response:**
##### - The method returns the list of products, either from the cache or after fetching from the database.
&nbsp; 

##### Note: null value stands for Tags (continue to read).
&nbsp; 

#### How to remove data from cache?
&nbsp; 

##### To remove items from the **HybridCache**, you can use the ***RemoveAsync*** method, which removes the specified key from both L1 (memory) and L2 (distributed) caches. 
&nbsp; 

##### Here's how you can do it:

```csharp

public async Task RemoveProductsByCategoryFromCacheAsync(string category, CancellationToken cancellationToken = default)
{
    string cacheKey = $"products:category:{category}";

    // Remove the cache entry from both L1 and L2
    await cache.RemoveAsync(cacheKey, cancellationToken);
}

```
##### **Effect:** The entry is removed from both L1 and L2 caches. If the key doesn't exist, the operation has no effect.

&nbsp; 
&nbsp; 
### Future: Tag-Based Invalidation with HybridCache
&nbsp; 
&nbsp; 

#### Adding Entries with Tags
&nbsp; 
##### When storing entries in the cache, you can assign tags to group them logically. 
##### For example, you can assign the same tag **("category:electronics")** to all product entries in the "Electronics" category.

```csharp

public async Task AddProductsToCacheAsync(List<Product> products, string category, CancellationToken cancellationToken = default)
{
    string cacheKey = $"products:category:{category}";

    await _cache.SetAsync(
        cacheKey,
        products,
        new HybridCacheEntryOptions
        {
            Expiration = TimeSpan.FromMinutes(30), // Set expiration
            LocalCacheExpiration = TimeSpan.FromMinutes(5), // L1 expiration
            Tags = new List<string> { $"category:{category}" } // Add tag
        },
        cancellationToken
    );
}

```

#### Removing Entries by Tag
&nbsp; 

##### To remove all cache entries associated with a specific tag (e.g., "category:electronics").
&nbsp; 

##### Here, categoryTag could be "category:electronics". This will remove all cache entries tagged with "category:electronics".

```csharp

public async Task InvalidateCacheByTagAsync(string categoryTag, CancellationToken cancellationToken = default)
{
    // Use the tag to remove all associated cache entries
    await _cache.RemoveByTagAsync(categoryTag, cancellationToken);
}

```
##### **Limitations**
&nbsp; 

##### **Preview Feature:** As of now, the implementation of tag-based invalidation in **HybridCache** is still in progress, and it may not work fully in preview versions of .NET 9.

##### **Fallback:** If tag-based invalidation is not available in your setup, you'll need to manually track and remove entries by key.

&nbsp; 
&nbsp; 
### Comparison with .NET 8
&nbsp; 
&nbsp; 

##### To create caching including InMemory caching and Distributed caching from the example above, you would need to write the following code in .NET 8:

```csharp

public async Task<List<Product>> GetProductsByCategoryAsync(string category)
{
    string cacheKey = $"products:category:{category}";

    // L1 Cache Check
    if (_memoryCache.TryGetValue(cacheKey, out List<Product> products))
    {
        return products;
    }

    // L2 Cache Check
    var cachedData = await _redisCache.GetStringAsync(cacheKey);
    if (!string.IsNullOrEmpty(cachedData))
    {
        products = JsonSerializer.Deserialize<List<Product>>(cachedData);
        // Populate L1 Cache
        _memoryCache.Set(cacheKey, products, TimeSpan.FromMinutes(5));
        return products;
    }

    // If not found in caches, fetch from database
    products = await FetchProductsFromDatabaseAsync(category);

    // Cache in both L1 and L2
    _memoryCache.Set(cacheKey, products, TimeSpan.FromMinutes(5));
    await _redisCache.SetStringAsync(
        cacheKey,
        JsonSerializer.Serialize(products),
        new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30) }
    );

    return products;
}

```


##### **Conclusion**
&nbsp; 

##### In the **.NET 9 Hybrid Cache** version:
&nbsp; 

##### 1. The code is simpler and easier to maintain.
##### 2. Serialization is abstracted away.
##### 3. L1 and L2 synchronization is automatic, reducing complexity.
##### 4. Expiration policies are centralized and applied uniformly across layers.
&nbsp; 

##### **Advantages**
&nbsp; 

##### **1. Performance Optimization:**
##### - Frequently accessed data is served quickly from the L1 cache.
##### - Data consistency across distributed instances is ensured via the L2 cache.
&nbsp; 

##### **2. Automatic Synchronization:**
##### - HybridCache handles the synchronization between L1 and L2 caches, reducing developer overhead.
&nbsp; 

##### **3. Centralized Expiration Management:**
##### - You can control cache lifetimes at both L1 and L2 levels with a single configuration.
&nbsp; 

##### **4. Graceful Degradation:**
##### If the L1 cache expires, the L2 cache ensures the data is still available without querying the database.
&nbsp; 

##### This makes **.NET 9 Hybrid Cache** ideal for caching heavy, serialized data like lists of products in distributed API applications.

&nbsp; 
&nbsp; 
### Performance comparison
&nbsp; 
&nbsp; 

##### Given that this feature is still in prerelease mode, and not complete, it probably doesn't make much sense to compare performance, but I did it purely out of curiosity.
&nbsp; 
##### .NET 8 - Cache is not populated
![.NET 8 Populated cache](/images/blog/posts/hybrid-cache-in-aspnet-core/dotnet8-not-populated.png)
&nbsp; 
##### .NET 8 - Returning values from the cache
![.NET 8 Values from cache](/images/blog/posts/hybrid-cache-in-aspnet-core/dotnet8-cache.png)
&nbsp; 
##### .NET 9 - Cache is not populated
![HybridCache](/images/blog/posts/hybrid-cache-in-aspnet-core/dotnet9-not-populated.png)
&nbsp; 
##### .NET 9 - Returning values from the cache
![HybridCache](/images/blog/posts/hybrid-cache-in-aspnet-core/dotnet9-cached.png)

##### The difference I can notice here is that when adding values ​​(1000 products) to the cache for the first time, it is faster with .NET 8 by some 100ms.
&nbsp; 

##### But extracting the value from the cache is more performant with .NET 9.
&nbsp; 

##### Certainly, we will see soon how this will progress.

&nbsp;
&nbsp;
### Wrapping Up
&nbsp;
&nbsp;

##### The **.NET 9 Hybrid Cache** is a significant leap forward in simplifying and optimizing caching strategies for modern .NET applications. 
&nbsp;

##### By seamlessly combining the speed of in-memory caching (L1) with the scalability and consistency of distributed caching (L2), Hybrid Cache provides developers with a powerful and flexible tool to enhance application performance while maintaining data consistency across distributed systems.
&nbsp;

##### Although currently in preview, features like **tag-based invalidation** will further streamline cache management. As the ecosystem evolves, Hybrid Cache is poised to become the default caching solution for performance-focused, scalable .NET applications.
&nbsp;

##### That's all from me for today.

<!--END-->

&nbsp;
## <b > dream BIG! </b>