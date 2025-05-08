---
title: "Response Compression in ASP.NET"
subtitle: "Since there's a limited amount of network bandwidth available...
"
readTime: "Read Time: 4 minutes"
date: "Mar 24 2025"
category: "APIs"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Optimize your .NET APIs with Response Compression: A deep dive into enhancing performance, setting up compression providers, and understanding the impact on server load and security."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;
##### • Big news for .NET developers!

##### You asked, and Heroku from Salesforce delivered. Their official .NET support is here. Developers have been using community buildpacks to run .NET apps on Heroku for a while. But now, Heroku is bringing native support into the mix. 
&nbsp;
##### That means you get all the capabilities of .NET, paired with [Heroku’s streamlined platform]((https://fnf.dev/4kH4x81)). No hacks, no workarounds - just a seamless way to build and scale .NET apps on a platform you already love. [Check it out here](https://fnf.dev/4kH4x81)

<!--START-->

&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp;  
##### Since there's a limited amount of network bandwidth available, enhancing its efficiency can significantly boost the performance of your application.
&nbsp;  
##### A key method to achieve this is through **response compression**.
&nbsp;  
##### This technique focuses on **minimizing the data size sent from the server to the client**, which can substantially enhance the application's responsiveness.
&nbsp;  
##### Today, you will learn:
&nbsp;  
##### - How to configure response compression
##### - Compression Providers
##### - Custom Compression Providers
##### - Compression Levels
##### - Results?
##### - Why to use it and why not to use it.
&nbsp;  

##### Let's start...
&nbsp;  
&nbsp;  
### Configuring Response Compression
&nbsp;  
&nbsp;  
##### The configuration of Response Compression is quite simple, it boils down to registering the middleware in DI:
```csharp

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddResponseCompression();

var app = builder.Build();

app.UseResponseCompression();
```
&nbsp;  
##### By default, this only works with the HTTP protocol.
&nbsp;  
##### If you want to enable HTTPS, it is necessary to add a setting:
```csharp

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

```
&nbsp;  
##### Note:

&nbsp;  
##### Setting EnableForHttps to true is a security risk. [See Compression with HTTPS](https://learn.microsoft.com/en-us/aspnet/core/performance/response-compression?view=aspnetcore-8.0#risk) in this article for more information.

&nbsp;  
&nbsp;  
### Compression Providers
&nbsp;  
&nbsp;  
##### Compression providers compress or decompress data by applying a specific compression algorithm. 
&nbsp;  
##### By using the AddResponseCompression method, you automatically get two compression providers:
&nbsp;  
##### **1. BrotliCompressionProvider**, which utilizes the Brotli algorithm. It is a more recent compression algorithm, and typically provides superior compression ratios compared to Gzip or Deflate. The BrotliCompressionProvider allows the server to use the Brotli algorithm for compressing data, which can then be decompressed by browsers that are equipped to handle Brotli compression.
&nbsp;  
##### **2. GzipCompressionProvider**, which employs the Gzip algorithm. Gzip is widely used in web applications for data compression. The GzipCompressionProvider enables the server to compress data using the Gzip algorithm and supports decompression in browsers that are compatible with Gzip compression.
&nbsp;  
##### The system defaults to Brotli for compression if the client can handle this format. In cases where the client doesn't support Brotli but does support Gzip, then Gzip is used as the default method.

&nbsp;  
##### It's crucial to remember that adding a specific compression provider means **other providers are not included by default**.

&nbsp;  
##### For example, if you specifically add only the Gzip compression provider, the system won't automatically include any other providers.
&nbsp;  
##### Here's a scenario demonstrating the activation of response compression for HTTPS requests with both Brotli and Gzip compression providers:
```csharp

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});
```

&nbsp;  
&nbsp;  
### Custom Providers
&nbsp;  
&nbsp;  
##### You can develop tailored compression solutions using **ICompressionProvider**. This interface's EncodingName signifies the content encoding output produced by the ICompressionProvider.
&nbsp;  

##### The response compression middleware leverages this detail to select the appropriate provider, matching the encodings listed in the request's Accept-Encoding header.
&nbsp;  

##### In the example application, requests featuring the **Accept-Encoding: mycustomcompression** header receive responses labeled with a Content-Encoding: mycustomcompression header.
&nbsp;  
##### For such custom compression implementations to function effectively, the client should be capable of decompressing this unique encoding.
```csharp

builder.Services.AddResponseCompression(options =>
{
    options.Providers.Add<MyCompressionProvider>();
});

```
&nbsp;  
##### MyCompressionProvider implementation:
```csharp

public class MyCompressionProvider : ICompressionProvider
{
    public string EncodingName => "mufljuzcompression";
    public bool SupportsFlush => true;

    public Stream CreateStream(Stream outputStream)
    {
        // Replace with a custom compression stream wrapper.
        return outputStream;
    }
}
```
&nbsp;  
&nbsp;  
### Compression Levels
&nbsp;  
&nbsp;  
##### Compression levels refer to the settings that determine the balance between the amount of compression applied to data and the computational resources (like time and processing power) required to perform the compression.
&nbsp;  
##### These levels are particularly relevant in data storage and transmission, where they influence file size and transfer speed.

&nbsp;  
##### You can setup a 4 possible values:

&nbsp;  
##### • **Optimal** - balance response size and compression speed
##### • **Fastest** - sacrifices optimal compression for improved speed (Default value)
##### • **NoCompression** - there is no compression at all
##### • **SmallestSize** - sacrifices compression speed to improve compression - to create a smaller response.
&nbsp;  
##### Example of setting the compression level:

```csharp

builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
{
    options.Level = CompressionLevel.Fastest;
})

```
&nbsp;  
&nbsp;  
### What we got?
&nbsp;  
&nbsp;  
##### I tested on the default API project in .NET with the WeatherForecast minimal API on .NET 8.

&nbsp;  
##### Without compression, on 10,000 records the response size is about **~700kB**.
&nbsp;  
##### With **BrotliCompressinProvider** and **CompressionLevel.SmallestSize** setting response size is **~45kB**.
&nbsp;  
##### Test the rest yourself :)

&nbsp;  
&nbsp;  
### Why should you consider using it? And why not?
&nbsp;  
&nbsp;  


##### Response compression is a valuable technique in web development, offering significant benefits such as improved performance and efficient bandwidth usage.
&nbsp;  

##### By reducing the size of data transmitted between the server and the client, it enables faster loading times for web pages and applications, enhancing the overall user experience.
&nbsp;  

##### This efficiency in data transfer is particularly advantageous in environments with limited or costly network resources.
&nbsp;  

##### Additionally, faster loading times can lead to better search engine rankings, potentially increasing visibility and traffic.
##### Furthermore, response compression can result in cost savings, especially where bandwidth usage is a critical factor.
&nbsp;  
##### **Why not?**
&nbsp;  
##### However, there are considerations that might deter its use.
&nbsp;  

##### Compression processes consume CPU resources, which could increase server load, particularly on high-traffic sites.
&nbsp;  

##### This might introduce latency issues, especially in real-time applications where every millisecond counts.
&nbsp;  

##### It’s also important to note that response compression is not universally effective for all content types; already compressed files like JPEG images and video files see little benefit and may even slightly increase in size.
&nbsp;  

##### Implementing and maintaining response compression can add complexity to application development, and there could be compatibility issues with older browsers or specific client configurations, making it less ideal in certain scenarios.
&nbsp;  
&nbsp;  
### What next?
&nbsp;  
&nbsp;  
##### Response compression is a cool trick for boosting your API's speed and cutting down on network expenses.
&nbsp;  

##### You should totally go for server-based compression if your server can handle it. If not, don't sweat it – .NET's got your back with its response compression middleware for application-based compression.
&nbsp;  

##### But what's the price tag on this?
&nbsp;  

##### Well, it's gonna make your CPU work harder and could open up some security gaps when using HTTPS.
&nbsp;  

##### However, you can totally find ways to work around these issues.
&nbsp;  

##### From what I've seen, sticking to the default settings for the compression provider and level usually works out pretty great.
&nbsp;  

##### That's all from me today. 

<!--END-->
