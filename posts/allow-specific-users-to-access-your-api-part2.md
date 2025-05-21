---
title: "Allow specific users to access your API - Part 2"
subtitle: " IP whitelisting is a security measure used to control access to networks, servers, and services, including APIs..."
date: "Mar 11 2024"
category: "Security"
readTime: "Read Time: 4 minutes"
photoUrl: "/images/blog/newsletter21.png"
---

&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • Streamline your API development with [Postman's REST Client](https://www.postman.com/product/rest-client/) a powerful tool for sending requests, inspecting responses, and debugging REST APIs with ease. Discover a more efficient way to build and test APIs at [link](https://www.postman.com/product/rest-client/).
&nbsp;  
##### • Unlock Your Potential as a .NET Architect! Dive into "Software Architecture with C# 12 and .NET 8" and design scalable solutions [here](https://packt.link/BGi5A). Master software architecture fundamentals, explore cutting-edge technologies, and tackle real-world scenarios. Elevate your skills with this essential guide! Transform user requirements into robust architectures with Azure DevOps, layered designs, and more.

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

##### Last week I showed how to achieve this with an API Key.
&nbsp;  

##### You can read that article [here](https://thecodeman.net/posts/allow-specific-users-to-access-your-api-part1).
&nbsp;  

##### Today, I'm going to talk about IP Whitelisting.
&nbsp;  

##### Let's dive in..

&nbsp;  
&nbsp;  
### What is IP Whitelisting?
&nbsp;  
&nbsp; 

##### IP whitelisting is a security measure used to control access to networks, servers, and services, including APIs, by allowing only requests from pre-approved IP addresses.

&nbsp; 

##### This method ensures that only clients with specific IP addresses can connect to or interact with the resource.

&nbsp; 

##### It's a form of access control that acts like a doorkeeper, checking the IP address of an incoming request against a list of allowed addresses.
&nbsp; 

##### If the IP address is on the list, access is granted; if not, access is denied.
&nbsp; 

![IP Whitelisting Design](/images/blog/posts/allow-specific-users-to-access-your-api-part2/ip-whitelisting-design.png)
&nbsp;  
&nbsp;  
### How IP Whitelisting Works?
&nbsp;  
&nbsp; 

##### **1. Identification:**
&nbsp; 

##### The server or security system identifies the IP address of the incoming request.
##### This is typically done automatically by the network software.

&nbsp; 

##### **2. Verification:**
&nbsp; 

##### The system then checks this IP address against a list of approved addresses.
##### This list is predefined by the system administrator or security team and contains the IP addresses deemed safe for access.
&nbsp; 

##### **3. Access Control:**
&nbsp; 

##### If the IP address matches one on the whitelist, the request is allowed through to access the server, network, or service.
##### If there is no match, the request is blocked or denied.

&nbsp;  
&nbsp;  
### Implementation
&nbsp;  
&nbsp; 

##### To implement IP whitelisting in a .NET 6+ application, you can create custom middleware that checks the IP address of incoming requests against a predefined list of allowed IPs.
##### This approach gives you fine-grained control over access to your application based on client IP addresses.
&nbsp; 
##### Here's a step-by-step guide on how to achieve this:
&nbsp; 

##### **Step 1: Define the IP Whitelist**
&nbsp; 

##### First, you should define the list of allowed IP addresses.
&nbsp; 

##### Typically, this list would be stored in your application's configuration, such as ** appsettings.json**, to allow for easy updates without needing to recompile your application.

```csharp

{
  "AllowedIPs": [
    "192.168.1.1",
    "127.0.0.1"
    // Add more IPs as needed
  ]
}

```
&nbsp; 

##### **Step 2: Create the IP Whitelisting Middleware**
&nbsp; 
##### Next, you will create a middleware component that reads the list of allowed IPs from the configuration, checks the IP address of each incoming request, and either allows the request to proceed or blocks it.

```csharp

public class IPWhitelistMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    public IPWhitelistMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var remoteIp = context.Connection.RemoteIpAddress;
        var allowedIPs = _configuration.GetSection("AllowedIPs").Get<string[]>();

        if (!IPAddress.IsLoopback(remoteIp) && !allowedIPs.Contains(remoteIp?.ToString()))
        {
            context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
            await context.Response.WriteAsync("Access denied");
            return;
        }

        await _next(context);
    }
}
```
&nbsp; 

##### **Step 3: Register the Middleware**
&nbsp; 
##### After defining the middleware, you need to register it in the application's request pipeline. This is done in the Program.cs file, where you can also configure services and application behavior.

```csharp

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<IPWhitelistMiddleware>(); // Register the IP Whitelist middleware

app.UseAuthorization();

app.MapControllers();

app.Run();

```
&nbsp; 

##### **How it works:**
&nbsp; 
##### The IPWhitelistMiddleware class is implemented to check the IP address of incoming requests against the list of allowed IPs specified in appsettings.json.
&nbsp; 

##### The middleware extracts the remote IP address from the incoming request and checks if it is in the list of allowed IPs.
&nbsp; 

##### If the IP address is not allowed, it returns a 403 Forbidden response; otherwise, the request is passed on to the next middleware in the pipeline.
&nbsp; 

##### By registering this middleware in Program.cs, you ensure that IP whitelisting is applied to all incoming requests.

&nbsp;  
&nbsp;  
### Implementation Considerations
&nbsp;  
&nbsp; 
##### **• Dynamic IPs:**
&nbsp;  

##### Some clients may have dynamic IP addresses (which change periodically), making IP whitelisting impractical without regular updates to the whitelist.
&nbsp;  

##### **• Maintenance:**
&nbsp;  

##### The whitelist requires ongoing management to add or remove IP addresses as access needs change, which can be administratively burdensome for larger or more dynamic environments.
&nbsp;  

##### **• Security Risks:**
&nbsp;  

##### While IP whitelisting enhances security, it should not be the sole security measure.
##### For instance, it does not protect against threats from whitelisted IPs themselves.

&nbsp;  
&nbsp;  
### Pros
&nbsp;  
&nbsp; 

##### **Enhanced Security:**
&nbsp; 

##### By only allowing traffic from known, trusted IP addresses, IP whitelisting significantly reduces the attack surface for unauthorized access, making it harder for attackers to breach your systems.

&nbsp; 

##### **Storage Security:**
&nbsp; 

##### On the client side, especially in web applications, storing API keys securely is challenging since they can be exposed to users. Environment variables, server-side storage, or secure vaults should be used when possible.
&nbsp; 

##### **Simplified Access Control:**
&nbsp; 

##### IP whitelisting provides a straightforward method to control access to networks, servers, and applications. It's easy to implement and manage, especially in environments with a stable set of users and systems.

&nbsp; 

##### **Compliance:**
&nbsp; 

##### Certain regulatory standards and security frameworks require strict control over access to sensitive data and systems. IP whitelisting can help organizations comply with these requirements by ensuring that only authorized devices can access restricted resources.
&nbsp; 
##### **Reduced Spam and Attack Risk:**
&nbsp; 

##### By limiting which IP addresses can connect, you reduce the risk of spam, brute force attacks, and other common security threats.

&nbsp;  
&nbsp;  
### Cons
&nbsp;  
&nbsp; 

##### **Limited Flexibility:**
&nbsp; 

##### IP whitelisting can be impractical in dynamic environments where users need to access resources from different locations, such as remote work scenarios.
##### IP addresses can change frequently, requiring constant updates to the whitelist.

&nbsp; 

##### **Administrative Overhead:**
&nbsp; 

##### Maintaining an accurate and up-to-date list of allowed IP addresses can become time-consuming, especially for larger organizations or services with a broad user base.

&nbsp; 

##### **Does Not Guarantee Security:**
&nbsp; 

##### While IP whitelisting enhances security, it doesn't protect against all types of threats. For instance, if an attacker gains control over a whitelisted IP address, they can bypass the whitelist.
##### It should be part of a layered security approach rather than the sole defense mechanism.
&nbsp; 

##### **Incompatibility with Dynamic IP Addresses:**
&nbsp; 

##### Many internet service providers assign dynamic IP addresses that change over time. This can be problematic for users who need to access whitelisted resources but find themselves blocked due to an IP address change.

&nbsp; 
##### **Does Not Encrypt Traffic:**
&nbsp; 

##### IP whitelisting controls access based on source IP addresses but does not secure the data being transmitted. Encryption and other security measures are still necessary to protect data in transit and at rest.

&nbsp;  
&nbsp;  
### Conclusion
&nbsp;  
&nbsp; 

##### IP whitelisting is a valuable tool in the cybersecurity toolkit, particularly suited for environments with well-defined and stable access patterns. However, its effectiveness and practicality depend on the specific use case and environment.
&nbsp; 

##### Organizations should consider the dynamic nature of their user base and the potential administrative burden of maintaining the whitelist.
&nbsp; 

##### It's most effective when used in combination with other security measures, such as encryption, authentication, and monitoring, to ensure comprehensive protection against threats.
&nbsp; 

##### That's all from me today.
&nbsp; 