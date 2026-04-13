---
title: "Allow specific users to access your API - Part 2"
subtitle: " IP whitelisting is a security measure used to control access to networks, servers, and services, including APIs..."
date: "Mar 11 2024"
category: "Security"
readTime: "Read Time: 4 minutes"
meta_description: "IP whitelisting is a security measure used to control access to networks, servers, and services, including APIs..."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">- Streamline your API development with <a href="https://www.postman.com/product/rest-client/" style="color: #a5b4fc; text-decoration: underline;">Postman's REST Client</a> a powerful tool for sending requests, inspecting responses, and debugging REST APIs with ease. Discover a more efficient way to build and test APIs at <a href="https://www.postman.com/product/rest-client/" style="color: #a5b4fc; text-decoration: underline;">link</a>.</p>
<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">-  Unlock Your Potential as a .NET Architect! Dive into "Software Architecture with C# 12 and .NET 8" and design scalable solutions <a href="https://packt.link/BGi5A" style="color: #a5b4fc; text-decoration: underline;">here</a>. Master software architecture fundamentals, explore cutting-edge technologies, and tackle real-world scenarios. Elevate your skills with this essential guide! Transform user requirements into robust architectures with Azure DevOps, layered designs, and more.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## Background

Let's say you have a request to "internalize" some of your API - ie. that only within your organization you have access to your API.

The best solution for this is to solve it at the Infrastructure level, outside of the code.
But sometimes things are expected to be solved at the code level.
In those cases, we have several ways to potentially solve this problem.

Last week I showed how to achieve this with an [API Key](https://thecodeman.net/posts/how-to-implement-api-key-authentication).

You can read that article [here](https://thecodeman.net/posts/allow-specific-users-to-access-your-api-part1).

Today, I'm going to talk about IP Whitelisting.

Let's dive in..

## What is IP Whitelisting?

IP whitelisting is a security measure used to control access to networks, servers, and services, including APIs, by allowing only requests from pre-approved IP addresses.

This method ensures that only clients with specific IP addresses can connect to or interact with the resource.

It's a form of access control that acts like a doorkeeper, checking the IP address of an incoming request against a list of allowed addresses.

If the IP address is on the list, access is granted; if not, access is denied.

![IP Whitelisting Design](/images/blog/posts/allow-specific-users-to-access-your-api-part2/ip-whitelisting-design.png)
## How IP Whitelisting Works?

1. Identification:

The server or security system identifies the IP address of the incoming request.
This is typically done automatically by the network software.

2. Verification:

The system then checks this IP address against a list of approved addresses.
This list is predefined by the system administrator or security team and contains the IP addresses deemed safe for access.

3. Access Control:

If the IP address matches one on the whitelist, the request is allowed through to access the server, network, or service.
If there is no match, the request is blocked or denied.

## Implementation

To implement IP whitelisting in a .NET 6+ application, you can create [custom middleware](https://thecodeman.net/posts/how-do-i-create-middleware) that checks the IP address of incoming requests against a predefined list of allowed IPs.
This approach gives you fine-grained control over access to your application based on client IP addresses.
Here's a step-by-step guide on how to achieve this:

Step 1: Define the IP Whitelist

First, you should define the list of allowed IP addresses.

Typically, this list would be stored in your application's configuration, such as ** [appsettings](https://thecodeman.net/posts/live-loading-appsettings-configuration-file).json**, to allow for easy updates without needing to recompile your application.

```csharp
{
  "AllowedIPs": [
    "192.168.1.1",
    "127.0.0.1"
    // Add more IPs as needed
  ]
}
```

Step 2: Create the IP Whitelisting Middleware
Next, you will create a middleware component that reads the list of allowed IPs from the configuration, checks the IP address of each incoming request, and either allows the request to proceed or blocks it.

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

Step 3: Register the Middleware
After defining the middleware, you need to register it in the application's request pipeline. This is done in the Program.cs file, where you can also configure services and application behavior.

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

How it works:
The IPWhitelistMiddleware class is implemented to check the IP address of incoming requests against the list of allowed IPs specified in appsettings.json.

The middleware extracts the remote IP address from the incoming request and checks if it is in the list of allowed IPs.

If the IP address is not allowed, it returns a 403 Forbidden response; otherwise, the request is passed on to the next middleware in the pipeline.

By registering this middleware in Program.cs, you ensure that IP whitelisting is applied to all incoming requests.

## Implementation Considerations
- Dynamic IPs:

Some clients may have dynamic IP addresses (which change periodically), making IP whitelisting impractical without regular updates to the whitelist.

- Maintenance:

The whitelist requires ongoing management to add or remove IP addresses as access needs change, which can be administratively burdensome for larger or more dynamic environments.

- Security Risks:

While IP whitelisting enhances security, it should not be the sole security measure.
For instance, it does not protect against threats from whitelisted IPs themselves.

## Pros

Enhanced Security:

By only allowing traffic from known, trusted IP addresses, IP whitelisting significantly reduces the attack surface for unauthorized access, making it harder for attackers to breach your systems.

Storage Security:

On the client side, especially in web applications, storing API keys securely is challenging since they can be exposed to users. Environment variables, server-side storage, or secure vaults should be used when possible.

Simplified Access Control:

IP whitelisting provides a straightforward method to control access to networks, servers, and applications. It's easy to implement and manage, especially in environments with a stable set of users and systems.

Compliance:

Certain regulatory standards and security frameworks require strict control over access to sensitive data and systems. IP whitelisting can help organizations comply with these requirements by ensuring that only authorized devices can access restricted resources.
Reduced Spam and Attack Risk:

By limiting which IP addresses can connect, you reduce the risk of spam, brute force attacks, and other common security threats.

## Cons

Limited Flexibility:

IP whitelisting can be impractical in dynamic environments where users need to access resources from different locations, such as remote work scenarios.
IP addresses can change frequently, requiring constant updates to the whitelist.

Administrative Overhead:

Maintaining an accurate and up-to-date list of allowed IP addresses can become time-consuming, especially for larger organizations or services with a broad user base.

Does Not Guarantee Security:

While IP whitelisting enhances security, it doesn't protect against all types of threats. For instance, if an attacker gains control over a whitelisted IP address, they can bypass the whitelist.
It should be part of a layered security approach rather than the sole defense mechanism.

Incompatibility with Dynamic IP Addresses:

Many internet service providers assign dynamic IP addresses that change over time. This can be problematic for users who need to access whitelisted resources but find themselves blocked due to an IP address change.

Does Not Encrypt Traffic:

IP whitelisting controls access based on source IP addresses but does not secure the data being transmitted. Encryption and other security measures are still necessary to protect data in transit and at rest.

## Wrapping Up

IP whitelisting is a valuable tool in the cybersecurity toolkit, particularly suited for environments with well-defined and stable access patterns. However, its effectiveness and practicality depend on the specific use case and environment.

Organizations should consider the dynamic nature of their user base and the potential administrative burden of maintaining the whitelist.

It's most effective when used in combination with other security measures, such as encryption, authentication, and [monitoring](https://thecodeman.net/posts/how-to-monitor-dotnet-applications-in-production), to ensure comprehensive protection against threats.

That's all from me today.

<!--END-->




