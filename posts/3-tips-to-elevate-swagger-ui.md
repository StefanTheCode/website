---
title: "3 Tips to Elevate your Swagger UI"
subtitle: "Swashbuckle is an open-source project that integrates Swagger with .NET applications. It provides seamless support for generating Swagger documents and exposing them via a web interface in ASP.NET Core applications."
date: "August 10 2024"
category: "APIs"
readTime: "Read Time: 4 minutes"
meta_description: "Swashbuckle is an open-source project that integrates Swagger with .NET applications. It provides seamless support for generating Swagger documents and expos..."
photoUrl: "/images/blog/newsletter21.png"
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Transform your API development process with Postman Flows! Experience a new way to visually create, debug, and automate complex API workflows with ease. Dive into the future of API management and enhance your productivity <a href="https://www.postman.com/product/flows/" style="color: #a5b4fc; text-decoration: underline;">here</a>.</p>
<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Create a production-ready Blazor application from start to finish with the latest edition of Web Development with Blazor by Jimmy Engstrom. You can learn more <a href="https://amzn.to/3KNEATs" style="color: #a5b4fc; text-decoration: underline;">here</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>
We know [Swagger](https://swagger.io/) is a set of tools for developing, documenting, and consuming RESTful APIs. It helps developers design, build, document, and consume APIs more efficient. 

[Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.AspNetCore) is an open-source project that integrates Swagger with .NET applications. It provides seamless support for generating Swagger documents and exposing them via a web interface in ASP.NET Core applications.

By default, when an API project is created, code is generated in Program.cs that will create the Swagger support, along with the Swagger UI.

```csharp

builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

```

This UI is quite "clean" and it is possible to enrich it with many things. 
![Swagger UI Demo](/images/blog/posts/3-tips-to-elevate-swagger-ui/swagger-ui-demo.png)

I will show you 1 tip of what can be done with Swagger UI.

## IDocumentFilter interface

The IDocumentFilter interface in Swashbuckle is a powerful feature that allows you to manipulate and customize the entire Swagger/OpenAPI document before it is rendered or served to clients.

This interface provides a hook into the Swagger generation process, giving you the ability to modify, add, or remove any part of the document, such as paths, operations, schemas, and more.

Implementation

To use IDocumentFilter, you need to create a class that implements this interface and its **Apply method**.

The Apply method provides access to the OpenApiDocument object, which represents the entire Swagger document, and the DocumentFilterContext object, which provides additional context and information. 

For example, let's create a case where you need to remove an obsolete (deprecated) endpoint from Swagger UI and not delete it from the code.

Firstly, if we tag some endpoint as obsolete, this will not hide it from Swagger UI. It will be just crossed and grayed out.
![Swagger UI Obsolete Endpoint](/images/blog/posts/3-tips-to-elevate-swagger-ui/obsolete-endpoint.png)

To be able to delete it, I will create RemoveObsoleteOperationsFilter implementation of IDocumentFilter abstraction.

```csharp

public class RemoveObsoleteOperationsFilter : IDocumentFilter {
    public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context) {
        var obsoletePaths = swaggerDoc.Paths
            .Where(path => path.Value.Operations
                .Any(op => op.Value.Deprecated))
            .Select(path => path.Key)
            .ToList();

        foreach (var obsoletePath in obsoletePaths)
            swaggerDoc.Paths.Remove(obsoletePath);
        }
}

```
I need to add a support for this DocumentFilter. It's really to add it, just update the .AddSwaggerGen() method call in Program.cs:

```csharp

builder.Services.AddSwaggerGen(c =>
{
    c.DocumentFilter<RemoveObsoleteOperationsFilter>();
});

```
And now, the endpoint is removed from the Swagger UI.

## 2 more examples of implementation IDocumentFiler abstraction

Adding Global Metadata to All Operations

Adding global metadata to all operations using an IDocumentFilter allows you to enforce consistent metadata across your entire API.

This can be particularly useful for ensuring that every operation has a baseline description, common tags for categorization, or other shared metadata.

By implementing and registering a custom document filter, you can automate these modifications, making your API documentation more uniform and easier to manage.

```csharp

public class AddGlobalMetadataDocumentFilter : IDocumentFilter
{
    public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
    {
        foreach (var pathItem in swaggerDoc.Paths.Values)
        {
            foreach (var operation in pathItem.Operations.Values)
            {
                // Add a common description to all operations
                operation.Description = operation.Description ?? "This is a common description for all operations.";
                
                // Add a common tag to all operations
                operation.Tags = operation.Tags ?? new List<OpenApiTag>();
                operation.Tags.Add(new OpenApiTag { Name = "CommonTag" });
            }
        }
    }
}

```
Result:
![Swagger UI Global Metadata](/images/blog/posts/3-tips-to-elevate-swagger-ui/global-metadata.png)

Adding a Custom Header to All Responses

Adding a custom header to all responses using an IDocumentFilter allows you to ensure that every API response includes specific metadata.

By implementing and registering a custom document filter, you can automate the inclusion of this header across all API endpoints, making your API documentation more comprehensive and consistent.

This approach is particularly useful for enforcing standard headers for purposes such as [rate limiting](https://thecodeman.net/posts/how-to-implement-rate-limiter-in-csharp), request tracking, or any other cross-cutting concerns.

```csharp

public class AddCustomHeaderToResponsesDocumentFilter : IDocumentFilter
{
    public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
    {
        foreach (var pathItem in swaggerDoc.Paths.Values)
        {
            foreach (var operation in pathItem.Operations.Values)
            {
                foreach (var response in operation.Responses.Values)
                response.Headers ??= new Dictionary<string, OpenApiHeader>();
                
                response.Headers.Add("X-Custom-Header", new OpenApiHeader
                {
                    Description = "This is a custom header added to all responses.",
                    Schema = new OpenApiSchema
                    {
                        Type = "string"
                    }
                });
            }
            }
        }
    }
}

```

Result:
![Swagger UI Custom Header](/images/blog/posts/3-tips-to-elevate-swagger-ui/custom-header.png)

In Program.cs you need to add those 2 DocumentFilters: a strategy object to perform the travel time calculation, allowing the strategy to be set dynamically.

## Wrapping up

Swagger UI itself is "clean" at the beginning of the implementation.

We often need some advanced things, such as not showing deprecated endpoints, adding metadata, adding headers, changing responses, and similar.

Fortunately, it is possible to enrich Swagger UI to such levels that it is possible to change the complete design.

The Swashbuckle Library helps us with all of this.

Using the IDocumentationFILter abstraction, we created 3 implementations:

1. RemoveObsoleteOperationsFilter
2. AddGlobalMetadataDocumentFilter
3. AddCustomHeaderToResponsesDocumentFilter

For a deeper understanding and different implementations check out [here](https://github.com/domaindrivendev/Swashbuckle.AspNetCore). 

You can download this source code from [here](https://github.com/StefanTheCode/SwaggerDocumentFilters).

That's all from me today.
<!--END-->

