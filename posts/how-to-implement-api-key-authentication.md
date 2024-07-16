---
title: "How to implement API Key Authentication"
subtitle: "Explore Stefan Đokić's insightful blog post on API Key Authentication in ASP.NET Core..."
readTime: "Read Time: 5 minutes"
date: "July 04 2024"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Explore Stefan Đokić's insightful blog post on API Key Authentication in ASP.NET Core. This post offers a thorough walkthrough on securing APIs, managing access, and monitoring usage through API keys. Learn to set up an API key attribute, build an authorization filter, and create a validator class. Ideal for developers focused on enhancing API security and management in their .NET projects."
---

&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### •  Unlock Seamless API Testing with Postman! Ensure your APIs are reliable and performant with Postman's comprehensive testing platform. Automate your tests, monitor results, and catch issues early to deliver a flawless digital experience. [Get started now](https://www.postman.com/api-platform/api-testing/)!
&nbsp;  
&nbsp;  

<!--START-->
&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  
##### So, what is Api Key Authentication in ASP.NET Core?
&nbsp;  
##### Let's consider a real-world example.
&nbsp;  
##### Imagine you've developed a weather dashboard that fetches data from your own weather API.
##### This dashboard displays real-time weather data, forecasts, and other information.
&nbsp;  
##### However, you want to:
&nbsp;  
##### - **Limit Access**: You don't want just anyone to be able to access your API and start pulling data from it.
##### - **Track Usage**: You want to know which clients are using your API, how often, and for what purposes.Implement
##### - **Prevent Abuse**: Without some sort of authentication, someone could spam your API with requests, consuming resources and potentially costing you money.
##### - **Commercialization**: If your API provides valuable data, you may want to monetize it. Having an API key for each client allows you to implement different pricing tiers easily.
&nbsp;  
##### This way, you can ensure that only authorized clients are accessing your data, track who is accessing it, and potentially even how much they are accessing. So, by implementing API key authentication like in the example, you can secure your API to ensure that it is used only in ways that you have explicitly allowed.
&nbsp;  
##### Really nice, right?
&nbsp;  
##### Let's see how to implement Api Key Authentication in ASP.NET Core using C#.
&nbsp;  
&nbsp;  
### Step #1: Create Api Key Attribute
&nbsp;  
&nbsp;  
##### Why you need this?
&nbsp;  
##### The **ApiKeyAttribute** class derives from **ServiceFilterAttribute** and is used **to decorate the controllers or actions** where you want this specific authorization to take place.
&nbsp;  
##### For example, you want to decorate this endpoint:
```csharp

[ApiKey]
[HttpGet(Name = "GetAllUsers")]
public List<string> GetAll()
{
    return new List<string> { "Stefan" };
}
```
&nbsp;  
##### In order to achieve this, you need to do following:
```csharp

public class ApiKeyAttribute : ServiceFilterAttribute
{
    public ApiKeyAttribute() : base(typeof(ApiKeyAuthorizationFilter))
}
```
&nbsp;  
##### The constructor calls the base constructor with typeof( **ApiKeyAuthorizationFilter** ), which means that it attaches the ApiKeyAuthorizationFilter to the actions decorated with this attribute.
&nbsp;  
##### In the ApiKeyAttribute class, the line : **base(typeof(ApiKeyAuthorizationFilter))** signifies that this attribute is essentially a wrapper around the ApiKeyAuthorizationFilter.
&nbsp;  
##### When you decorate a controller or action method with **[ApiKey]** , it will trigger the ApiKeyAuthorizationFilter's **OnAuthorization method** for that specific controller or action.
&nbsp;  
##### So, we need ApiKeyAuthorizationFilter with OnAuthorization method - let's create that in the next step.
&nbsp;  
&nbsp;  
### Step #2: Implement ApiKey Authorization Filter
&nbsp;  
&nbsp;  
##### The ApiKeyAuthorizationFilter class implements **IAuthorizationFilter** , which means it contains logic to execute when a request requires authorization. This filter checks if an API key is present and if it's valid.
```csharp

public class ApiKeyAuthorizationFilter : IAuthorizationFilter
{
    private const string ApiKeyHeaderName = "x-api-key";
    private readonly IApiKeyValidator _apiKeyValidator;

    public ApiKeyAuthorizationFilter(IApiKeyValidatior apiKeyValidator)
    {
        _apiKeyValidator = apiKeyValidator;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        string apiKey = context.HttpContext.Request.Headers[ApiKeyHeaderName];

        if(!_apiKeyValidator.IsValid(apiKey))
        {
            context.Result = new UnauthorizedResult();
        }
    }
}
```
&nbsp;  
##### OnAuthorization Method:
&nbsp;  
##### - This method is called when the request is being authorized. It extracts the API key from the request header:
```csharp

var apiKey = context.HttpContext.Request.Headers[ApiKeyHeaderName];

```
&nbsp;  
##### Then it uses the _apiKeyValidator.IsValid(apiKey) method to check if the API key is valid.
&nbsp;  
##### If the API key is not valid, context.Result = new UnauthorizedResult(); sets the response to unauthorized, effectively rejecting the request.
&nbsp;  
##### Great. But you don't have _apiKeyValidator right?
&nbsp;  
##### No problem. Let's implement it.
&nbsp;  
&nbsp;  
### Step #3: Implement ApiKeyValidator
&nbsp;  
&nbsp;  
##### Your ApiKeyAuthorizationFilter class relies on an instance of a class that implements IApiKeyValidator to validate API keys. The **IsValid** method of this instance will be called to check if an API key is valid or not. Currently, since IsValid returns false, all requests would be considered unauthorized.
```csharp

public class ApiKeyValidator : IApiKeyValidator
{
    public bool IsValid(string apiKey)
    {
        //Change logic for validation api key
        return false;
    }
}

public interface IApiKeyValidator
{
    bool IsValid(string apiKey);
}
```
##### Of course, none of this would work without Dependency Injection, so let's register the necessary services.
```csharp

builder.Services.AddSingleton<ApiKeyAuthorizationFilter>();
builder.Services.AddSingleton<IApiKeyValidator, ApiKeyValidator>();
```
&nbsp;  
&nbsp;  
### Api Endpoint Testing
&nbsp;  
&nbsp;  
##### Since I hardcoded that the validation always returns false for the validity of the Api Key, every request will be rejected, more precisely 401 will be returned because it is not authenticated, because the ApiKeyHeader is not present in the Request.
![Api Endpoint Testing](/images/blog/posts/how-to-implement-api-key-authentication/api-endpoint-testing.png)
&nbsp;  
##### And that's it. You have implemented Api Key Authentication.
&nbsp;  
&nbsp;  
### Bonus: Use Middleware
&nbsp;  
&nbsp;  
##### You can achieve absolutely the same effect by using Middleware.
&nbsp;  
##### Here's how you can do it:
```csharp

public class ApiKeyMiddleware
{
    private readonly RequestDelegate _next;
    private const string ApiKeyHeaderName = "x-api-key";

    public ApiKeyMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if(!context.Request.Headers.TryGetValue(ApiKeyHeaderName, out var extractedApiKey))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Api Key was not provided.");
            return;
        }

        if(extractedApiKey != "API_KEY")
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Unauthorized.");
            return;
        }

        await _next(context);
    }
}
```
&nbsp;  
##### And that's it.
&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  
##### In today's Newsletter issue, I showed you how to implement Api Key Authentication in ASP.NET Core in a small number of steps and in a short time.
&nbsp;  
##### It is necessary to implement 3 things:
&nbsp;  
##### **1. ApiKeyAttribute** - Allows you to decorate controllers and endpoints with [ApiKey].
&nbsp;  
##### **2.  ApiKeyAuthoizationFilter** - Executes the OnAuthorization method on every request. This is where you actually put the complete logic of your authentication.
&nbsp;  
##### **3. ApiKeyValidator** - Only the encapsulated logic of how you will validate the api key that you receive in the request.
&nbsp;  
##### You can go to the project's [GitHub repository](https://github.com/StefanTheCode/ApiKeyAuthenticationDemo) and get acquainted with the details.
&nbsp;  
##### That's all from me today.