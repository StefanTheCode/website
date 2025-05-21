---
title: "Using CORS in your applications"
subtitle: "Cross-Origin Resource Sharing (CORS) is a security feature implemented by web browsers that controls how web pages in one domain can request resources, like APIs, from another domain..."
date: "Oct 9 2023"
readTime: "Read Time: 3 minutes"
category: ".NET"
meta_description: "Enhance your .NET applications with Stefan Đokić's expert guide to Cross-Origin Resource Sharing (CORS) implementation. Learn essential CORS concepts, set up and adjust CORS policies, handle pre-flight requests, and tighten security for robust API development. Essential reading for .NET developers aiming to build secure, cross-origin enabled web applications."
---

&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp;  
##### Imagine we are visiting a foreign country. We want to send a package to someone in another country. However, the customs officers at the border won't allow us to send the package unless we have the proper documentation and the destination country has agreed to accept it.
&nbsp;  
##### • A web page served from one domain (e.g., example.com) is like a person in one country.
&nbsp;  
##### • A server at a different domain (e.g., another-example.com) is like a person in another country.
&nbsp;  
##### • Like how customs officers at the border check for proper documentation and ensure that the destination country will accept the package, CORS checks for the appropriate headers in HTTP requests and responses to ensure that the web page is allowed to make requests to the other domain.
&nbsp;  
##### • If the server at another-example.com wants to allow requests from example.com, it can set the ** Access-Control-Allow-Origin header in its responses** to example.com. The browser will then allow the web page from the example.com to make requests to another example.com, just like how the customs officers at the border will allow the package to be sent if the documentation is in order and the destination country has agreed to accept it.
&nbsp;  
##### **Cross-Origin Resource Sharing (CORS)** is a security feature implemented by web browsers that controls how web pages in one domain can request resources, like APIs, from another domain.
&nbsp;  
##### By default, web pages are not allowed to make requests to a different domain than the one that served the web page. This is a security measure to prevent a malicious website from making unwanted requests to a legitimate one.
&nbsp;  
##### In the context of .NET, if you're building an API using ASP.NET Core, you might want to enable CORS to allow web pages from certain domains to access your API.
&nbsp;  
##### Let's see how to do that...
&nbsp;  
&nbsp;  
### Setting up CORS in .NET
&nbsp;  
&nbsp;  
##### **1. Install the necessary package** - because we are displaying the raw identifiers to the user, especially sequential ones.
```csharp

  dotnet add package Microsoft.AspNetCore.Cors
```
&nbsp;  
##### **2. Configure Services in Program.cs** - Add CORS services to the DI container and set up a CORS policy.
```csharp

  builder.Services.AddCors(opt =>
  {
      opt.AddPolicy("CorsPolicy", policy =>
      {
          policy.AllowAnyMethod()
         .AllowAnyHeader()
         .WithOrigins("https://localhost:7235");
      }
});
```
&nbsp;  
##### **3. Apply the CORS policy in the middleware pipeline:** - Add CORS services to the DI container and set up a CORS policy.
```csharp

  app.UseCors("CorsPolicy");
```
&nbsp;  
&nbsp;  
### Adjusting the CORS Policy
&nbsp;  
&nbsp;  
##### The policy we created is rather strict. You can adjust it as per your requirements. Some of the things you can configure are:
&nbsp;  
##### **• Allowing multiple specific origins:**
```csharp

  policy.WithOrigins("https://myapp.com", "https://anotherapp.com");

```
&nbsp;  
##### **• Allowing all origins:**
```csharp

 policy.AllowAnyOrigin();

```
&nbsp;  
##### **• Allowing specific headers:**
```csharp

 policy.WithHeaders("header1", "header2");

```
&nbsp;  
##### **• Allowing specific HTTP methods:**
```csharp

 policy.WithMethods("GET", "POST");

```
##### Note: Be cautious with allowing all origins **(AllowAnyOrigin)** as it can expose your API to potential security threats from malicious websites. Always ensure that you understand the security implications of the CORS settings you choose.
&nbsp;  
&nbsp;  
### Pre-Flight Requests
&nbsp;  
&nbsp;  
##### When you make a request (e.g., a POST request) that could potentially have side effects, browsers will first send a "pre-flight" request using the OPTIONS method to check if the actual request is allowed. This is done to make sure that the server accepts the request and knows about the origin making it.
&nbsp;  
##### For instance, if your client sends a request with a custom header or uses an HTTP method other than GET or HEAD, a pre-flight request is triggered.
&nbsp;  
##### In our previous .NET Core CORS setup, pre-flight requests are automatically handled by the middleware because we used .AllowAnyHeader() and .AllowAnyMethod().
&nbsp;  
&nbsp;  
### Tightening Security
&nbsp;  
&nbsp;  
##### While it might be tempting to use .AllowAnyOrigin() and .AllowAnyMethod() for simplicity, it's more secure to only enable what's needed:
&nbsp;  
##### • **Specify allowed methods:** If your API endpoint only needs to handle GET and POST, then only allow those:
```csharp

 policy.WithOrigins("https://myapp.com")
       .WithMethods("GET", "POST");

```
&nbsp;  
##### • **Specify allowed headers** : If your application requires specific headers, specify them:
```csharp

 policy.WithOrigins("https://myapp.com")
       .WithHeaders("X-Custom-Header", "Authorization");

```
##### Note: If you use .AllowCredentials(), you can't use .AllowAnyOrigin() due to security concerns. You need to explicitly specify the origins.
&nbsp;  
&nbsp;  
### Exposing Headers
&nbsp;  
&nbsp;  
##### There might be situations where you want your client-side application to have access to certain headers in the CORS response. You can specify which headers should be exposed:
```csharp

 policy.WithOrigins("https://myapp.com")
       .WithExposedHeaders("X-My-Custom-Header");

```
&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  
##### Understanding and managing CORS in .NET Core is crucial when building APIs that are accessed from different origins. By configuring the CORS middleware correctly and securely, you ensure both functionality and security for your web applications. Remember to always review your CORS configuration to minimize potential security risks.
&nbsp;  
##### That's all from me today.