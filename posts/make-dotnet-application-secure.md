---
newsletterTitle: "#9 Stefan's Newsletter"
title: "Make your .NET application secure"
subtitle: "Security headers are HTTP response headers that provide an additional layer of security to web applications. They help to protect against attacks such as cross-site scripting (XSS), clickjacking, and more."
readTime: "Read Time: 8 minutes"
date: "Apr 10 2023"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Enhance .NET application security: Learn to implement crucial security headers, protect against XSS, clickjacking, and more for robust web app defense."
---

&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp;  
##### Security headers are HTTP response headers that provide an additional layer of security to web applications. They help to protect against attacks such as cross-site scripting (XSS), clickjacking, and more.
&nbsp;  
##### Implementing security headers is an important step towards securing your .NET application. However, it is important to note that security headers alone **cannot provide complete protection** against attacks. Other security measures, such as input validation and access control, should also be implemented to ensure the security of your application.
&nbsp;  
##### In this 9th issue, I will show you how to implement security headers in your project. You can find the code at the end of the email.
&nbsp;  
##### Note: This issue will be the longest so far, but also the richest in information.

&nbsp;  
&nbsp;  
### Testing
&nbsp;  
&nbsp;  
##### For testing implemented headers you need 2 things:
&nbsp;  
##### 1. Public URL of the application - Best solution is using dev tunnels. Be sure you check my last newsletter issue to find out how to expose the localhost.
&nbsp;  
##### 2. Websites that scan the URL and return the result which headers are accessible. You can use 2 separated websites:
&nbsp;  
##### - [Atatus Tool](https://www.atatus.com/tools/security-header)
##### - [IP Void Tool](https://www.ipvoid.com/http-security-headers-analyzer/)
&nbsp;  
##### Note: One of the most famous sites for scanning security headers was not working properly at the moment so I avoided it. It's about: [Security Headers](https://securityheaders.com/).
&nbsp;  

##### Current score:
![Security Headers Test](/images/blog/posts/make-dotnet-application-secure/security-headers-test.jpg)

&nbsp;  
&nbsp;  
### How I implemented security headers?
&nbsp;  
&nbsp;  
##### In .NET applications, security headers can be implemented using the following approaches:
&nbsp;  
##### 1. Using the Middleware
##### 2. Using NuGet packages:
##### 3. Manually adding headers
&nbsp;  
##### I did it with the middleware:

```csharp

app.UseSecurityHeadersMiddleware(new SecurityHeadersBuilder().AddDefaultSecurePolicy());
```
&nbsp;  
&nbsp;  
### Security Headers list:
&nbsp;  
&nbsp;  

##### • X-Frame-Options
##### • X-Xss-Protection
##### • X-Content-Type-Options
##### • Strict-Transport-Security
##### • Referrer-Policy
##### • Content-Security-Policy
##### • Permissions-Policy
##### • Server
##### • X-Permitted-Cross-Domain-Policies

&nbsp;  
&nbsp;  
### Let's start!
&nbsp;  
&nbsp;  

#### X-Frame-Options
&nbsp;  
##### When hackers embed your website into an iframe on their own website, they can deceive users into clicking on links or buttons that they didn't intend to.
##### However, by setting the X-Frame-Options header in your website's HTTP response, you are telling the client's web browser that it should not allow your website to be framed within an iframe.
&nbsp;  
##### This security feature prevents attackers from using iframes to manipulate your website's content and protects your users from falling victim to clickjacking attacks.
```csharp

context.Response.Headers.Add("X-Frame-Options", "SAMEORIGIN");

```
&nbsp;  
##### It has three possible values:
&nbsp;  
##### **1. DENY:** not allow your website to be embedded in an iframe under any circumstances.
##### **2. SAMEORIGIN:** allow your website to be embedded in an iframe only if the iframe is on the same domain as your website.
##### **3. ALLOW-FROM uri:** allow your website to be embedded in an iframe only if the iframe is on the specified uri.
&nbsp;  

#### X-Xss-Protection
&nbsp;  
##### X-XSS-Protection is a security header that helps to protect web applications against cross-site scripting (XSS) attacks. XSS attacks are a type of security vulnerability where an attacker injects malicious scripts into a web page, which can steal sensitive information, modify the appearance of the page, or perform other unauthorized actions.
```csharp

context.Response.Headers.Add("X-Xss-Protection", "1; mode=block");

```
&nbsp;  
##### But...
&nbsp;  
##### • Chrome has removed their XSS Auditor
##### • Firefox has not, and will not implement X-XSS-Protection
##### • Edge has retired their XSS filter
&nbsp;  
##### This means that if you do not need to support legacy browsers, it is recommended that you use [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) without allowing **unsafe-inline** scripts instead.

&nbsp;  

#### X-Content-Type-Options
&nbsp;  
##### Let's say you have a file upload feature on your website that allows users to upload images. An attacker could upload a JavaScript file with a misleading MIME type, such as "image/png", which would cause some web browsers to execute the JavaScript code as if it were an image. This could allow the attacker to perform unauthorized actions on your website or steal sensitive information from your users.
&nbsp;  
##### However, if you set the X-Content-Type-Options header to "nosniff" in your website's HTTP response, the browser will not attempt to sniff the content type and will instead use the declared content type. In this case, the browser would correctly identify the uploaded file as a JavaScript file and prevent it from executing as an image.

```csharp

context.Response.Headers.Add("X-Content-Type-Options", "nosniff");

```

&nbsp;  

#### Strict-Transport-Security
&nbsp;  
##### Strict-Transport-Security (STS) is a security header that helps to protect web applications against man-in-the-middle (MITM) attacks by enforcing the use of HTTPS for all communications between the browser and the server.

&nbsp;  
##### All pages should be served over HTTPS. To make sure that none of your content is still server over HTTP, set the Strict-Transport-Security header. The header can be set in custom middleware like in the previous examples. But ASP.NET Core already comes with middleware named HSTS (HTTP Strict Transport Security Protocol):

```csharp

if(!app.Environment.IsDevelopment())
{
    app.UseHsts();
}
```
&nbsp;  
##### The Strict-Transport-Security header value can be customized through options:
```csharp

builder.Service.AddHsts(options =>
{
    options.IncludeSubDomains = true;
    options.MaxAge = TimeSpan.FromDays(365);
})
```
##### This code will produce a header with subdomains included and a max-age of 1 year:
&nbsp;  
##### **Strict-Transport-Security: max-age=31536000; includeSubDomains**
&nbsp;  

#### Referrer-Policy
&nbsp;  
##### The Referrer-Policy header allows you to control how much information is included in the Referer header, giving you more control over the privacy and security of your website.
&nbsp;  
##### The possible values for the header include:
&nbsp;  
##### • **"no-referrer"**: The Referer header will not be sent in any circumstances.
##### •  **"no-referrer-when-downgrade"**: The Referer header will not be sent when navigating from HTTPS to HTTP, but will be sent in all other cases.
##### • **"same-origin"**: The Referer header will only be sent if the destination URL has the same origin as the referring URL.
##### • **"strict-origin"**: The Referer header will only be sent if the destination URL has the same origin as the referring URL, and will only include the scheme, host, and port (but not the path).
##### • **"strict-origin-when-cross-origin"**: The Referer header will be sent when navigating from HTTPS to HTTP, but will only include the scheme, host, and port (but not the path).
##### • **"unsafe-url"**: The Referer header will be sent in all cases, including when navigating from HTTPS to HTTP.

```csharp

context.Response.Headers.Add("Referrer-Policy", "no-referrer");

```
&nbsp;  

#### Content-Security-Policy
&nbsp;  
##### Content-Security-Policy (CSP) is a security header that helps to protect web applications against cross-site scripting (XSS) attacks and other types of code injection attacks. The header allows you to specify the sources from which various types of content can be loaded or executed, such as scripts, stylesheets, images, and media files.
&nbsp;  
##### By using CSP, you can prevent attackers from injecting malicious code into your web pages, because any code that is not explicitly allowed by the policy will be blocked by the browser. This can help to protect your users from attacks that could steal their personal information, install malware on their devices, or perform other unauthorized actions.
```csharp

context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com");

```
##### In this example, the policy allows content to be loaded only from the website itself (**'self'**) for most types of content (**default-src**), but allows scripts to be loaded from both the website and the external source https://cdnjs.cloudflare.com (**script-src**). This would allow the use of external JavaScript libraries like jQuery or Bootstrap, while still ensuring that any other scripts are blocked by the browser.
&nbsp;  
##### Extra explanation:
&nbsp;  
##### Here are some examples of possible values for the Content-Security-Policy header:
##### - **default-src 'self'**: Allows content to be loaded only from the same origin as the page itself.
##### - **default-src 'self' https://example.com**: Allows content to be loaded from the same origin as the page itself, as well as from the https://example.com domain.
##### - **default-src 'none'**: Disallows all content from being loaded.
##### - **default-src 'self' script-src 'unsafe-inline'**: Allows scripts to be loaded only from the same origin as the page itself, but also allows inline scripts.
##### - **default-src 'self'; img-src 'self' data**: Allows images to be loaded only from the same origin as the page itself, as well as from data URLs.
&nbsp;  
##### Other possible directives and their meanings include:
&nbsp;  

##### - script-src: Defines the policy for scripts
##### - img-src: Defines the policy for images
##### - style-src: Defines the policy for styles
##### - connect-src: Defines the policy for network connections
##### - font-src: Defines the policy for fonts
##### - object-src: Defines the policy for objects and plugins
##### - media-src: Defines the policy for video and audio

&nbsp;  

#### Permissions-Policy
&nbsp;  
##### Permissions-Policy is a security header that allows web developers to control and limit the permissions of various browser features and APIs. This header provides a way to specify which features are allowed to be used on a web page and which are not, allowing developers to improve the security of their web applications.
&nbsp;  
##### The Permissions-Policy header allows you to control access to a variety of browser features and APIs, including:
&nbsp;  
##### • Geolocation
##### • Camera and microphone access
##### • Fullscreen mode
##### • Payment processing APIs
##### • Clipboard access
##### • Navigation APIs
##### • Sensors
&nbsp;  
##### By using the Permissions-Policy header, you can limit access to these features and APIs to only those that are necessary for your web application to function properly. This can help to prevent attackers from using these features to gain unauthorized access to user data or perform other malicious actions.
```csharp

context.Response.Headers.Add("Permissions-Policy", "accelerator=(), camera=(), 
                              geolocation=(), gyroscope=(), magnetometer=(), microphone=(), 
                              payment=(), usb=()");

```
&nbsp;  
##### In this case, the permissions listed are "accelerometer", "camera", "geolocation", "gyroscope", "magnetometer", "microphone", "payment", and "usb". The values for each permission are empty, indicated by the parentheses after each permission name. This means that access to these features is completely disabled for the web application.


&nbsp;  

#### Server
&nbsp;  
##### The Server header in .NET is an HTTP response header that provides information about the web server software being used to serve the request. By default, the header includes the name and version of the server software, such as "Microsoft-IIS/10.0"
&nbsp;  
##### While the Server header can be useful for debugging and troubleshooting purposes, it can also provide information that may be useful to attackers attempting to exploit vulnerabilities in the server software. As a result, many security experts recommend removing or obscuring the Server header as part of a web application's security configuration.
```csharp

context.Response.Headers.Remove("Server");

```
&nbsp;  
##### Also be sure to remove following headers:
&nbsp;  
##### - X-Powered-By
##### - X-AspNet-Version
##### - X-AspNetMvc-Version
##### - X-Forwarded-Host

&nbsp;  

#### Expect-CT
&nbsp;  
##### Expect-CT is an HTTP response header that is used to enforce Certificate Transparency (CT) for HTTPS connections. Certificate Transparency is a mechanism designed to provide greater transparency and accountability for the issuance and use of SSL/TLS certificates, which are used to secure HTTPS connections.
&nbsp;  
##### By enabling Expect-CT in your web application, you can help to protect against attacks such as certificate misissuance or SSL/TLS interception.

```csharp

context.Response.Headers.Add("Expect-CT", "max-age=2592000");

```

&nbsp;  
&nbsp;  
### Result
&nbsp;  
&nbsp; 
![Security Headers Result](/images/blog/posts/make-dotnet-application-secure/security-headers-result.jpg)


&nbsp;  
&nbsp;  
### What's next?
&nbsp;  
&nbsp;  
##### Security headers will not make your application completely secure, but they are certainly a starting point from which to start and which must be solved at the developer level.
&nbsp;  
##### In the future, in agreement with colleagues, other security flaws can be resolved.
&nbsp;  
##### That's all from me today. 
&nbsp;  
##### Make a coffee and check the whole project on [GitHub repository](https://github.com/StefanTheCode/Newsletter/tree/main/9%23%20-%20Security%20Headers/SecurityHeaders).






