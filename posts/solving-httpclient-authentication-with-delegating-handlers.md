---
title: "Solving HttpClient Authentication with Delegating Handlers"
subtitle: "In C#/.NET, a DelegatingHandler is a special type of message handler that is part of the HTTP client pipeline used to process HTTP requests and responses."
date: "August 10 2024"
category: ".NET"
---

&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • Transform your API development process with Postman Flows! Experience a new way to visually create, debug, and automate complex API workflows with ease. Dive into the future of API management and enhance your productivity [here](https://www.postman.com/product/flows/).
&nbsp;  
&nbsp;  

<!--START-->

### What is Delegating Handler?
&nbsp;  
&nbsp;  
##### In C#/.NET, a [DelegatingHandler](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.delegatinghandler?view=net-8.0) is a special type of message handler that is part of the HTTP client pipeline used to process HTTP requests and responses.
##### It is a class that derives from *[HttpMessageHandler](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpmessagehandler?view=net-8.0)* and is used to **intercept and modify HTTP messages** as they flow in and out of an HttpClient.
&nbsp;  

##### DelegatingHandler works by wrapping around another HttpMessageHandler.
&nbsp;  

##### When you send a request using HttpClient, the request travels through a chain of handlers, each possibly modifying the request or generating a response.
&nbsp;  

##### Eventually, the request reaches the innermost handler, typically the HttpClientHandler, which sends the request over the network.
&nbsp;  

##### This feature is particularly useful for tasks like logging, authentication, and other cross-cutting concerns.
&nbsp;  

##### Today I'm going to show how to implement it with authentication.

&nbsp;  
&nbsp;  
### Configuring HttpClient in Program.cs
&nbsp;  
&nbsp;  

```csharp

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<NewsletterService>(httpClient =>
{
    httpClient.BaseAddress = new Uri("https://api.newsletter.com");
});

var app = builder.Build();

app.Run();

```

##### What did we do here?
&nbsp;  

##### We have created **Typed HttpClient** - NewsletterService.
&nbsp;  

##### And we set BaseAddress to point to our API endpoint.
&nbsp;  

##### The NewsletterService is a class that will have 2 methods:
&nbsp;  

##### - Getting a user with a specified ID
##### - Getting Open rate value for issue with passed ID

```csharp

public class NewsletterService(HttpClient client)
{
    public async Task<NewsletterUser?> GeEmailByIdAsync(string id)
    {
        var endpoint = $"users/{id}";

        return await client.GetFromJsonAsync<NewsletterUser>(endpoint);
    }

    public async Task<double> GetOpenRateAsync(string id)
    {
        var endpoint = $"issues/{id}/open-rate";

        return await client.GetFromJsonAsync<double>(endpoint);
    }
}

```
&nbsp;  
##### All set.
&nbsp;  

##### When we call any of these 2 methods, we get **401 Unauthorized**.
&nbsp;  

##### Why?
&nbsp;  

##### Because the API we're targeting requires a passed AccessToken in order to access it.
&nbsp;  

##### Okay, nothing difficult, right?
&nbsp;  

##### We will add to both methods the Authorization RequestHeader with the AccessToken.
&nbsp;  

##### No no. Today we will show a better way.
&nbsp;  

##### That's right, using a DelegatingHandler.

```csharp

public class AuthenticationDelegatingHandler : DelegatingHandler
{
    protected override Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        //Don't hardcode those values
        request.Headers.Add("Authorization", "secretAccessToken");
        request.Headers.Add("SomeOtherHeader", "someOtherValue");

        return base.SendAsync(request, cancellationToken);
    }
}

```

##### What have we achieved with this?
&nbsp;  

##### We gave the command:

##### *"Before you send the HttpClient request, enrich it with these headers that I am passing on to you".*
&nbsp;  

##### And yes, this applies to every request associated with the NewsletterService.
&nbsp;  

##### How?
&nbsp;  

##### So let's not forget to tell HttpClient to use the Handler we created.
&nbsp;  

##### We will do it in the following way:

```csharp 

builder.Services.AddTransient<AuthenticationDelegatingHandler>();

builder.Services.AddHttpClient<NewsletterService>(httpClient =>
{
    httpClient.BaseAddress = new Uri("https://api.newsletter.com");
})

```
&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  

##### Today we have shown the most efficient way to solve Authentication with HttpClient. We used TypedClient and DelegateHandler.
&nbsp;  

##### DelegatingHandler is especially powerful in scenarios where you need to apply consistent modifications or checks to requests/responses in a clean and reusable way.
&nbsp;  

##### For example, in a microservices architecture, you might use several handlers to handle concerns like logging, error handling, and retry policies before a request reaches an external service or database.
&nbsp;  

##### This design promotes separation of concerns and reusability across different parts of your application or across different applications within an organization.
&nbsp;  

##### Try to use the same approach to handle some other stuff like we did authentication today.
&nbsp;  
##### That's all from me today. 

<!--END-->
