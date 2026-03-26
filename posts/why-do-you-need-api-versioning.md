---
title: "What is and why do you need API Versioning?"
subtitle: "API versioning is a technique used to manage changes in an API while maintaining backward compatibility for existing clients..."
date: "Nov 06 2023"
category: "APIs"
readTime: "Read Time: 4 minutes"
meta_description: "Delve into the complexities of API versioning in .NET with Stefan Đokić's detailed exploration. Discover various strategies like URI, Query String, Header, Media Type, and Host Name versioning, each with unique benefits and trade-offs. This comprehensive guide is essential for developers seeking to maintain API reliability while evolving their services in a .NET environment."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">Today's issue is sponsored by</p>
<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;"><a href="https://ilovedotnet.org/" style="color: #a5b4fc; text-decoration: underline;">Ilovedotnet.org</a> Master .NET with all the simple, practical examples and real-world practices using <a href="https://ilovedotnet.org" style="color: #a5b4fc; text-decoration: underline;">Ilovedotnet</a> learning path. This open-source .NET learning platform with in browser demo's is founded by Abdul Rahman, Microsoft MVP from wider .NET community. Join their <a href="https://whatsapp.com/channel/0029VaAGMV2LtOj5S5MHd23h" style="color: #a5b4fc; text-decoration: underline;">WhatsApp channel</a> for free and start learning.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## The Background
API versioning is a technique used to manage changes in an API while maintaining backward compatibility for existing clients. It allows developers to introduce new features, fix bugs, or make other modifications to the API without impacting the functionality of existing integrations.
API is software. Every piece of the software needs updates at some point. When you are creating some updates on your API, you need to ensure that the changes don’t affect your API consumers (users). To ensure that, you need to introduce [API versioning](https://blog.treblle.com/api-versioning-all-you-need-to-know/). 
## Why do you need API versioning?
You need API versioning because it ensures compatibility, empowers flexible adoption of changes, provides controlled and documented modifications, enables coexistence of multiple versions, and grants granular control over the lifecycle of your API, resulting in successful and efficient software development.
The 3 most important reasons:
• **Backward compatibility:**  It ensures that clients can continue using the older version while new clients can take advantage of the updated features.
• **API evolution:** As your API evolves over time, versioning allows you to introduce new features, deprecate outdated functionality, and make improvements without disrupting existing clients.
• **Client flexibility:** Different clients may have different requirements or may need specific features available in a particular version of the API.
## ASP .NET Web API Versioning
There are multiple approaches to API versioning in .NET (&gt; .NET 5):
• URI Versioning (Path Versioning)
• Query String Versioning
• Header Versioning
• Media Type Versioning (Accept header)
• Host Name Versioning
### URI Versioning (Path Versioning)
• The version is included directly in the URL path (e.g., **/api/v1/products** ).
• This method is the most straightforward and easy to understand.
• However, it can lead to URL duplication and requires clients to change URLs to access different versions.
```csharp

    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/products")]
    public class ProductsV1Controller : ApiController
    {
            public IHttpActionResult Get()
            {
                    // Implementation for version 1
            }
    }
    
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/products")]
    public class ProductsV2Controller : ApiController
    {
            public IHttpActionResult Get()
            {
                    // Implementation for version 2
            }
    }
```
### Query String Versioning
• The version is specified as a query parameter in the URL (e.g., **/api/products?version=1** ).
• This method allows for an easy transition to new versions.
• It may not be as clean as path versioning and can be overlooked by users.
```csharp

    public class QueryStringVersionController : ApiController
    {
            const string DefaultApiVersion = "1.0";
        
            [HttpGet]
            public IHttpActionResult Get()
            {
                    var apiVersion = HttpContext.Current.Request.QueryString["version"] ?? DefaultApiVersion;
                    if (apiVersion == "1.0")
                    {
                            // Implementation for version 1
                    }
                    else if (apiVersion == "2.0")
                    {
                            // Implementation for version 2
                    }
                    else
                    {
                            return BadRequest("Version not supported");
                    }
            }
    }
```
### Header Versioning
• The version information is sent as a custom header in the HTTP request (e.g., **X-API-Version: 1** ).
• It keeps the URL unchanged for different versions, which can be beneficial for SEO and caching.
• However, it's less discoverable and can be harder for testing as it requires setting HTTP headers.
```csharp

    public class HeaderVersionController : ApiController
    {
            private const string HeaderName = "X-API-Version";
        
            [HttpGet]
            public IHttpActionResult Get()
            {
                    var apiVersion = HttpContext.Current.Request.Headers[HeaderName];
                    if (apiVersion == "1.0")
                    {
                            // Implementation for version 1
                    }
                    else if (apiVersion == "2.0")
                    {
                            // Implementation for version 2
                    }
                    else
                    {
                            return BadRequest("API version is required");
                    }
            }
    }
```
### Media Type Versioning (Accept header)
• Version information is included in the Accept header of the HTTP request, often using a custom media type (e.g., **application/vnd.myapi.v1+json** ).
• This method follows the HTTP specification closely.
• It is more complex and can be difficult to handle for some API clients.
```csharp

    [Produces("application/json")]
    public class MediaTypeVersionController : ApiController
    {
            [HttpGet]
            public IHttpActionResult Get()
            {
                    string apiVersion = GetApiVersionFromAcceptHeader();
                    if (apiVersion == "v1")
                    {
                            // Implementation for version 1
                    }
                    else if (apiVersion == "v2")
                    {
                            // Implementation for version 2
                    }
                    else
                    {
                            return BadRequest("API version is required");
                    }
            }
        
            private string GetApiVersionFromAcceptHeader()
            {
                    var acceptHeader = Request.Headers.Accept.FirstOrDefault();
                    if (acceptHeader != null)
                    {
                            var versionParameter = acceptHeader.Parameters
                                .FirstOrDefault(p => p.Name.Equals("version", StringComparison.OrdinalIgnoreCase));
                            return versionParameter?.Value;
                    }
                    return null;
            }
    }
```
### Host Name Versioning
• Different versions of the API are hosted at different domain names (e.g., api-v1.example.com).
• This approach can be clear and intuitive for the end-users.
• It requires more infrastructure setup and can complicate SSL certificate management.
Note: Hostname versioning might be done through routing or with URL rewriting, depending on your setup. This isn't usually handled directly in the controller but rather in the IIS setup or with a [reverse proxy](https://thecodeman.net/posts/dotnet-docker-and-traefik) configuration. However, you can simulate it with routing:
```csharp

  // This would be set up in your routing configuration or Web API configuration.
  config.Routes.MapHttpRoute(
        name: "Version1",
        routeTemplate: "api-v1/{controller}/{id}",
        defaults: new { id = RouteParameter.Optional }
  );
  
  config.Routes.MapHttpRoute(
        name: "Version2",
        routeTemplate: "api-v2/{controller}/{id}",
        defaults: new { id = RouteParameter.Optional }
  );
```
## Conslusion
Each method has its trade-offs, and the choice of which to use will depend on the specific requirements and constraints of your project. It's also possible to mix and match these strategies if needed. Ultimately, the goal is to maintain a reliable contract with the consumers of your API while allowing for the continued evolution and improvement of the API services you provide.
That's all from me today.


See also: [Top 5 API Building Mistakes](https://thecodeman.net/posts/building-apis-top-5-mistakes) and [API Key Authentication](https://thecodeman.net/posts/how-to-implement-api-key-authentication).

## Wrapping Up

<!--END-->

