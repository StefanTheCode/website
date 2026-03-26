---
title: "Solving HttpClient Authentication with Delegating Handlers"
subtitle: "In C#/.NET, a DelegatingHandler is a special type of message handler that is part of the HTTP client pipeline used to process HTTP requests and responses."
date: "August 10 2024"
category: ".NET"
readTime: "Read Time: 3 minutes"
meta_description: "In C#/.NET, a DelegatingHandler is a special type of message handler that is part of the HTTP client pipeline used to process HTTP requests and responses."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Transform your API development process with Postman Flows! Experience a new way to visually create, debug, and automate complex API workflows with ease. Dive into the future of API management and enhance your productivity <a href="https://www.postman.com/product/flows/" style="color: #a5b4fc; text-decoration: underline;">here</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## What is Delegating Handler?
In C#/.NET, a [DelegatingHandler](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.delegatinghandler?view=net-8.0) is a special type of message handler that is part of the HTTP client pipeline used to process HTTP requests and responses.
It is a class that derives from *[HttpMessageHandler](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpmessagehandler?view=net-8.0)* and is used to **intercept and modify HTTP messages** as they flow in and out of an HttpClient.

DelegatingHandler works by wrapping around another HttpMessageHandler.

When you send a request using HttpClient, the request travels through a chain of handlers, each possibly modifying the request or generating a response.

Eventually, the request reaches the innermost handler, typically the HttpClientHandler, which sends the request over the network.

This feature is particularly useful for tasks like logging, authentication, and other cross-cutting concerns.

Today I'm going to show how to implement it with authentication.

## Configuring HttpClient in Program.cs

```csharp

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<NewsletterService>(httpClient =>
{
    httpClient.BaseAddress = new Uri("https://api.newsletter.com");
});

var app = builder.Build();

app.Run();

```

What did we do here?

We have created **Typed HttpClient** - NewsletterService.

And we set BaseAddress to point to our API endpoint.

The NewsletterService is a class that will have 2 methods:

- Getting a user with a specified ID
- Getting Open rate value for issue with passed ID

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
All set.

When we call any of these 2 methods, we get **401 Unauthorized**.

Why?

Because the API we're targeting requires a passed AccessToken in order to access it.

Okay, nothing difficult, right?

We will add to both methods the Authorization RequestHeader with the AccessToken.

No no. Today we will show a better way.

That's right, using a DelegatingHandler.

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

What have we achieved with this?

We gave the command:

*"Before you send the HttpClient request, enrich it with these headers that I am passing on to you".*

And yes, this applies to every request associated with the NewsletterService.

How?

So let's not forget to tell HttpClient to use the Handler we created.

We will do it in the following way:

```csharp 

builder.Services.AddTransient<AuthenticationDelegatingHandler>();

builder.Services.AddHttpClient<NewsletterService>(httpClient =>
{
    httpClient.BaseAddress = new Uri("https://api.newsletter.com");
})

```
## Wrapping up

Today we have shown the most efficient way to solve Authentication with HttpClient. We used TypedClient and DelegateHandler.

DelegatingHandler is especially powerful in scenarios where you need to apply consistent modifications or checks to requests/responses in a clean and reusable way.

For example, in a microservices architecture, you might use several handlers to handle concerns like logging, error handling, and retry policies before a request reaches an external service or database.

This design promotes separation of concerns and reusability across different parts of your application or across different applications within an organization.

Try to use the same approach to handle some other stuff like we did authentication today.
That's all from me today. 

<!--END-->
