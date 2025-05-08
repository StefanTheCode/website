---
title: "3 Tips to Elevate your Swagger UI"
subtitle: "Swashbuckle is an open-source project that integrates Swagger with .NET applications. It provides seamless support for generating Swagger documents and exposing them via a web interface in ASP.NET Core applications."
date: "August 10 2024"
category: "APIs"
photoUrl: "/images/blog/newsletter21.png"
---

&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • Transform your API development process with Postman Flows! Experience a new way to visually create, debug, and automate complex API workflows with ease. Dive into the future of API management and enhance your productivity [here](https://www.postman.com/product/flows/).
&nbsp;  
##### • Create a production-ready Blazor application from start to finish with the latest edition of Web Development with Blazor by Jimmy Engstrom. You can learn more [here](https://amzn.to/3KNEATs).
&nbsp;  
&nbsp;  

<!--START-->

##### We know [Swagger](https://swagger.io/) is a set of tools for developing, documenting, and consuming RESTful APIs. It helps developers design, build, document, and consume APIs more efficient. 
&nbsp;  

##### [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.AspNetCore) is an open-source project that integrates Swagger with .NET applications. It provides seamless support for generating Swagger documents and exposing them via a web interface in ASP.NET Core applications.
&nbsp;  

##### By default, when an API project is created, code is generated in Program.cs that will create the Swagger support, along with the Swagger UI.

```csharp

builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

```
&nbsp;  

##### This UI is quite "clean" and it is possible to enrich it with many things. 
![Swagger UI Demo](/images/blog/posts/3-tips-to-elevate-swagger-ui/swagger-ui-demo.png)
&nbsp;  

##### I will show you 1 tip of what can be done with Swagger UI.

&nbsp;  
&nbsp;  
### IDocumentFilter interface
&nbsp;  
&nbsp;  

##### The IDocumentFilter interface in Swashbuckle is a powerful feature that allows you to manipulate and customize the entire Swagger/OpenAPI document before it is rendered or served to clients.
&nbsp;  

##### This interface provides a hook into the Swagger generation process, giving you the ability to modify, add, or remove any part of the document, such as paths, operations, schemas, and more.
&nbsp;  

##### **Implementation**
&nbsp;  

##### To use IDocumentFilter, you need to create a class that implements this interface and its **Apply method**.
&nbsp;  

##### The Apply method provides access to the OpenApiDocument object, which represents the entire Swagger document, and the DocumentFilterContext object, which provides additional context and information. 
&nbsp;  

##### For example, let's create a case where you need to remove an obsolete (deprecated) endpoint from Swagger UI and not delete it from the code.
&nbsp;  

##### Firstly, if we tag some endpoint as obsolete, this will not hide it from Swagger UI. It will be just crossed and grayed out.
![Swagger UI Obsolete Endpoint](/images/blog/posts/3-tips-to-elevate-swagger-ui/obsolete-endpoint.png)

&nbsp;  
##### To be able to delete it, I will create RemoveObsoleteOperationsFilter implementation of IDocumentFilter abstraction.

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
&nbsp;  
##### I need to add a support for this DocumentFilter. It's really to add it, just update the .AddSwaggerGen() method call in Program.cs:

```csharp

builder.Services.AddSwaggerGen(c =>
{
    c.DocumentFilter<RemoveObsoleteOperationsFilter>();
});

```
&nbsp;  
##### And now, the endpoint is removed from the Swagger UI.


&nbsp;  
&nbsp;  
### 2 more examples of implementation IDocumentFiler abstraction
&nbsp;  
&nbsp;  

##### **Adding Global Metadata to All Operations**
&nbsp;  

##### Adding global metadata to all operations using an IDocumentFilter allows you to enforce consistent metadata across your entire API.
&nbsp;  

##### This can be particularly useful for ensuring that every operation has a baseline description, common tags for categorization, or other shared metadata.
&nbsp;  

##### By implementing and registering a custom document filter, you can automate these modifications, making your API documentation more uniform and easier to manage.

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
&nbsp;  
##### Result:
![Swagger UI Global Metadata](/images/blog/posts/3-tips-to-elevate-swagger-ui/global-metadata.png)

&nbsp;  

##### **Adding a Custom Header to All Responses**
&nbsp;  

##### Adding a custom header to all responses using an IDocumentFilter allows you to ensure that every API response includes specific metadata.
&nbsp;  

##### By implementing and registering a custom document filter, you can automate the inclusion of this header across all API endpoints, making your API documentation more comprehensive and consistent.
&nbsp;  

##### This approach is particularly useful for enforcing standard headers for purposes such as rate limiting, request tracking, or any other cross-cutting concerns.


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

&nbsp;  
##### Result:
![Swagger UI Custom Header](/images/blog/posts/3-tips-to-elevate-swagger-ui/custom-header.png)
&nbsp;  

##### In Program.cs you need to add those 2 DocumentFilters: a strategy object to perform the travel time calculation, allowing the strategy to be set dynamically.

&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  

##### Swagger UI itself is "clean" at the beginning of the implementation.
&nbsp;  

##### We often need some advanced things, such as not showing deprecated endpoints, adding metadata, adding headers, changing responses, and similar.
&nbsp;  

##### Fortunately, it is possible to enrich Swagger UI to such levels that it is possible to change the complete design.
&nbsp;  

##### The Swashbuckle Library helps us with all of this.
&nbsp;  

##### Using the IDocumentationFILter abstraction, we created 3 implementations:
&nbsp;  

##### 1. RemoveObsoleteOperationsFilter
##### 2. AddGlobalMetadataDocumentFilter
##### 3. AddCustomHeaderToResponsesDocumentFilter
&nbsp;  

##### For a deeper understanding and different implementations check out [here](https://github.com/domaindrivendev/Swashbuckle.AspNetCore). 
&nbsp;  

##### You can download this source code from [here](https://github.com/StefanTheCode/SwaggerDocumentFilters).
&nbsp;  

##### That's all from me today.
<!--END-->
