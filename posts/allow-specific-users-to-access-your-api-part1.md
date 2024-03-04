---
newsletterTitle: "#57 Stefan's Newsletter"
title: "Allow specific users to access your API - Part 1"
subtitle: "Just as a bouncer checks your pass before letting you into a club, an API uses an API key to decide who gets access to its data and services."
date: "Mar 04 2024"
photoUrl: "/images/blog/newsletter21.png"
---

&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • Streamline your API development with [Postman's REST Client](https://www.postman.com/product/rest-client/) a powerful tool for sending requests, inspecting responses, and debugging REST APIs with ease. Discover a more efficient way to build and test APIs at [link](https://www.postman.com/product/rest-client/).
&nbsp;  
##### • Get instant insights about your API quality from VS Code with [Treblle's latest extension](https://apiinsights.io/?utm_source=newsletter&utm_medium=stefan-email&utm_campaign=vs_code) for VS Code. API Insights will score your API on Design, Performance, and Security. Get it [here](https://apiinsights.io/?utm_source=newsletter&utm_medium=stefan-email&utm_campaign=vs_code).

&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  

##### Let's say you have a request to "internalize" some of your API - ie. that only within your organization you have access to your API.
&nbsp;  

##### The best solution for this is to solve it at the Infrastructure level, outside of the code.
##### But sometimes things are expected to be solved at the code level.
##### In those cases, we have several ways to potentially solve this problem.
&nbsp;  

##### In today's installment, we'll see how to achieve this with an API Key.
&nbsp;  

##### Let's dive in..

&nbsp;  
&nbsp;  
### What is an API Key?
&nbsp;  
&nbsp; 

##### Think of an API key a bit like a VIP pass to an exclusive club.
&nbsp; 

##### Just as a bouncer checks your pass before letting you into a club, an API uses an API key to decide who gets access to its data and services.
&nbsp; 

##### It's a straightforward yet effective tool in the software world, serving both as an ID card that says "I'm allowed to be here" and a secret handshake that proves you're in the know.
&nbsp; 

##### This dual role of identification and authentication makes API keys an essential part of the toolkit for controlling who gets to interact with an API.
&nbsp; 

##### It's akin to having a key to a locked door — without the key, you're not getting in.
&nbsp; 

##### But with it, you unlock a world of possibilities, from fetching weather data to processing payments online.

![Api Key Design](/images/blog/posts/allow-specific-users-to-access-your-api-part1/api-key-design.png)
&nbsp;  
&nbsp;  
### Role and Purpose
&nbsp;  
&nbsp; 

##### **1. Identification and Access Control:**
&nbsp; 

##### The primary role of an API key is to identify the calling program or user, effectively saying, ** "I am who I say I am."**
##### It allows the API provider to track and control how the API is being used, ensuring that only authorized consumers can access the services. And this is the main thing we're talking about today.
&nbsp; 

##### **2. Rate Limiting and Quotas:**
&nbsp; 

##### API keys help in implementing rate limiting and quotas. By identifying each consumer through a unique key, the API provider can enforce limits on the number of requests a consumer can make within a certain timeframe, thus preventing abuse and overuse of the API.

&nbsp; 

##### **3. Analytics and Monitoring:**
&nbsp; 

##### Through the use of API keys, providers can monitor usage patterns, understand how their APIs are being utilized, and make informed decisions on optimization, scaling, and feature development.

&nbsp;  
&nbsp;  
### Implementation
&nbsp;  
&nbsp; 

##### **Generating an API Key: **
&nbsp; 

##### An API key is typically a long, random string that is difficult to guess. Secure generation is crucial to ensure that keys cannot be easily predicted or brute-forced. 
&nbsp; 

##### There are several ways to implement the use of API Key, here I will explain using MIddleware. And how you can implement it with the ApiKey Authorization Filter, you can read [here](https://stefandjokic.tech/posts/how-to-implement-api-key-authentication).

&nbsp; 

##### **Step 1: Create the API Key Middleware:**
&nbsp; 
##### First, we define a middleware component that intercepts incoming HTTP requests to check for a valid API key.

```csharp

public class ApiKeyMiddleware
{
    private const string API_KEY_HEADER_NAME = "X-Api-Key";
    private readonly RequestDelegate _next;
    private readonly string _validApiKey;

    public ApiKeyMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _validApiKey = configuration.GetValue<string>("ApiKey");
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Headers.TryGetValue(API_KEY_HEADER_NAME, out var receivedApiKey) || receivedApiKey != _validApiKey)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Invalid or missing API Key.");
            return;
        }

        await _next(context);
    }
}
```
&nbsp; 

##### **Step 2: Register the Middleware:**

```csharp

app.UseMiddleware<ApiKeyMiddleware>();

```
&nbsp; 

##### **Step 3: Configure the API Key:**
&nbsp; 
##### The valid API key should be stored securely and retrieved from the application's configuration. This could be in an appsettings.json file, environment variable, or a secure secret storage.

```json

{
    "ApiKey": "your-secret-api-key"
}
```
&nbsp; 
##### Ensure this key is kept secret and is only known to the API provider and authorized consumers.

&nbsp;  
&nbsp;  
### Testing
&nbsp;  
&nbsp; 
##### Testing an API that uses API key authentication from a front end can involve several steps, depending on the complexity of your front end application and the tools or frameworks it's built with.
&nbsp; 
##### Below is a basic example using JavaScript with fetch to make a request to the API.
&nbsp; 
##### This example assumes you have a front-end application that needs to communicate with a back-end API protected by an API key.

```javascript

const apiKey = 'your-api-key-here'; // This should be securely stored and retrieved
const apiUrl = 'https://yourapi.com/data';

fetch(apiUrl, {
    method: 'GET', // or 'POST', 'PUT', 'DELETE', etc., depending on the action
    headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey // Ensure this matches the header name expected by your API middleware
    }
})
.then(response => {
    if (response.ok) {
        return response.json(); // Or `response.text()` if expecting a text response
    }
    throw new Error('Network response was not ok.');
})
.then(data => {
    console.log(data); // Process your data here
})
.catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
});
```

&nbsp; 
##### **Securely Store and Manage the API Key**
&nbsp; 
##### In a real-world application, hardcoding the API key in your JavaScript code is not secure, as it can be easily viewed by anyone who inspects the source code of your webpage.
&nbsp; 
##### Consider securely storing the API key and serving it to your front-end application in a manner that keeps it hidden from the client-side.
&nbsp; 
##### This could involve:
&nbsp; 
##### - Storing the API key on the server-side and providing it to the front-end through a secure, authenticated endpoint.
##### - Using environment variables in a Node.js-based front-end build process to inject the API key into your application at build time, ensuring it doesn't end up in version control or exposed directly in client-side code.

&nbsp;  
&nbsp;  
### Security Considerations
&nbsp;  
&nbsp; 

##### **Transport Security:**
&nbsp; 

##### API keys should always be transmitted over secure channels. HTTPS is mandatory to prevent the key from being intercepted in transit.
&nbsp; 

##### **Storage Security:**
&nbsp; 

##### On the client side, especially in web applications, storing API keys securely is challenging since they can be exposed to users. Environment variables, server-side storage, or secure vaults should be used when possible.
&nbsp; 

##### **Leakage and Revocation:**
&nbsp; 

##### If an API key is leaked or compromised, it should be immediately revoked and replaced to prevent unauthorized access. Implementing key rotation and expiration policies can mitigate the risks associated with key compromise.
&nbsp; 

##### **Complementary Security Measures:**
&nbsp; 

##### While API keys provide a level of security, they are not foolproof. They do not offer fine-grained access control or identity management.
##### For more sensitive applications, API keys are often used in conjunction with other authentication mechanisms, such as OAuth tokens, which provide more robust security features including scopes and consent.

&nbsp;  
&nbsp;  
### Conclusion
&nbsp;  
&nbsp; 

##### To wrap it up, think of API keys as the essential gatekeepers of the digital realm. They strike a neat balance between being easy to use and providing a layer of security.
&nbsp; 

##### Yet, just like a single lock might not be enough to secure a treasure chest, API keys shine brightest when they're part of a larger security setup.
&nbsp; 

##### Depending on what your API does and who uses it, pairing API keys with additional safeguards can really fortify your digital fortress, ensuring that your data remains both accessible to the right people and safe from prying eyes.
&nbsp; 

##### That's all from me today.
&nbsp; 

##### Next week we will go through some other approaches.
&nbsp; 
