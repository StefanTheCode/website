---
newsletterTitle: "#9 Stefan's Newsletter"
title: "Make your .NET application secure!"
subtitle: "Security headers are HTTP response headers that provide an additional layer of security to web applications. They help to protect against attacks such as cross-site scripting (XSS), clickjacking, and more."
date: "Apr 10 2023"
photoUrl: "/images/blog/newsletter21.png"
---


### The background
<br>
<br>
##### Security headers are HTTP response headers that provide an additional layer of security to web applications. They help to protect against attacks such as cross-site scripting (XSS), clickjacking, and more.
<br>
##### Implementing security headers is an important step towards securing your .NET application. However, it is important to note that security headers alone <span style='color: #ffbd39'><b>cannot provide complete protection</b></span> against attacks. Other security measures, such as input validation and access control, should also be implemented to ensure the security of your application.
<br>
##### In this 9th issue, I will show you how to implement security headers in your project. You can find the code at the end of the email.
<br>
##### Note: This issue will be the longest so far, but also the richest in information.

<br>
<br>
### Testing
<br>
<br>

##### For testing implemented headers you need 2 things:
<br>
##### 1. Public URL of the application - Best solution is using dev tunnels. Be sure you check my last newsletter issue to find out how to expose the localhost.
<br>
##### 2. Websites that scan the URL and return the result which headers are accessible. You can use 2 separated websites:
<br>
##### - [Atatus](https://www.atatus.com/tools/security-header)
##### - [Ipvoid](https://www.ipvoid.com/http-security-headers-analyzer)
<br>
##### - Note: One of the most famous sites for scanning security headers was not working properly at the moment so I avoided it. It's about: [Security Headers](https://securityheaders.com/) 
<br>
##### Current score:
![Current State of Security](/images/blog/posts/make-your-dotnet-application-secure/security-headers-report-current-state.jpg)
<br>
<br>
![Security Headers Report](/images/blog/posts/make-your-dotnet-application-secure/security-headers-report.jpg)

<br>
<br>
### How I implemented security headers?
<br>
<br>

##### In .NET applications, security headers can be implemented using the following approaches:
<br>
##### 1. Using the Middleware
##### 2. Using NuGet packages:
##### 3. Manually adding headers
<br>
##### I did it with the middleware:
<br>
![Use Security Headers Middleware](/images/blog/posts/make-your-dotnet-application-secure/use-security-headers-middleware.png)
<br>
<br>
### Security Headers list:
<br>
<br>

##### • X-Frame-Options
##### • X-Xss-Protection
##### • X-Content-Type-Options
##### • Strict-Transport-Security
##### • Referrer-Policy
##### • Content-Security-Policy
##### • Permissions-Policy
##### • Server
##### • X-Permitted-Cross-Domain-Policies

<br>
<br>
### Let's start!
<br>
<br>

#### <span style='color: #ffbd39'><b>X-Frame-Options</b></span>
<br>
##### When hackers embed your website into an iframe on their own website, they can deceive users into clicking on links or buttons that they didn't intend to.
##### However, by setting the X-Frame-Options header in your website's HTTP response, you are telling the client's web browser that it should not allow your website to be framed within an iframe.
<br>
##### This security feature prevents attackers from using iframes to manipulate your website's content and protects your users from falling victim to clickjacking attacks.

![Add X-Frame-Options Security Header](/images/blog/posts/make-your-dotnet-application-secure/add-x-frame-options.png)
<br>
##### It has three possible values:
<br>
######  <span style='color: #ffbd39'><b>1. DENY:</b></span> not allow your website to be embedded in an iframe under any circumstances.
######  <span style='color: #ffbd39'><b>2. SAMEORIGIN:</b></span> allow your website to be embedded in an iframe only if the iframe is on the same domain as your website.

######  <span style='color: #ffbd39'><b>3. ALLOW-FROM uri:</b></span>  allow your website to be embedded in an iframe only if the iframe is on the specified uri.

<br>
<br>

#### <span style='color: #ffbd39'><b>X-Xss-Protection</b></span>
<br>
##### X-XSS-Protection is a security header that helps to protect web applications against cross-site scripting (XSS) attacks. XSS attacks are a type of security vulnerability where an attacker injects malicious scripts into a web page, which can steal sensitive information, modify the appearance of the page, or perform other unauthorized actions.
<br>
![Add X-XSS-Protection Security Header](/images/blog/posts/make-your-dotnet-application-secure/add-x-xss-protection.png)
<br>
##### But...
<br>
##### • Chrome has removed their XSS Auditor
##### • Firefox has not, and will not implement X-XSS-Protection
##### • dge has retired their XSS filter
<br>
##### This means that if you do not need to support legacy browsers, it is recommended that you use Content-Security-Policy without allowing unsafe-inline scripts instead.

<br>
<br>

#### <span style='color: #ffbd39'><b>X-Content-Type-Options</b></span>
<br>
##### Let's say you have a file upload feature on your website that allows users to upload images. An attacker could upload a JavaScript file with a misleading MIME type, such as "image/png", which would cause some web browsers to execute the JavaScript code as if it were an image. This could allow the attacker to perform unauthorized actions on your website or steal sensitive information from your users.
<br>
##### However, if you set the X-Content-Type-Options header to "nosniff" in your website's HTTP response, the browser will not attempt to sniff the content type and will instead use the declared content type. In this case, the browser would correctly identify the uploaded file as a JavaScript file and prevent it from executing as an image.

<br>
![Add X-Content-Type-Options Security Header](/images/blog/posts/make-your-dotnet-application-secure/add-x-content-type-options.png)

<br>
<br>

#### <span style='color: #ffbd39'><b>Strict-Transport-Security</b></span>
<br>
##### Strict-Transport-Security (STS) is a security header that helps to protect web applications against man-in-the-middle (MITM) attacks by enforcing the use of HTTPS for all communications between the browser and the server.
<br>
##### All pages should be served over HTTPS. To make sure that none of your content is still server over HTTP, set the Strict-Transport-Security header. The header can be set in custom middleware like in the previous examples. But ASP.NET Core already comes with middleware named HSTS (HTTP Strict Transport Security Protocol):

<br>
![Add Use Hsts Middleware](/images/blog/posts/make-your-dotnet-application-secure/add-use-hsts-middleware.png)

<br>
##### The Strict-Transport-Security header value can be customized through options:
<br>
![Add Use Hsts Middleware](/images/blog/posts/make-your-dotnet-application-secure/add-custom-hsts.png)
<br>
##### This code will produce a header with subdomains included and a max-age of 1 year:
##### <span style="color: red"> Strict-Transport-Security: max-age=31536000; includeSubDomains</span>

<br>
<br>

#### <span style='color: #ffbd39'><b>Referrer-Policy</b></span>
<br>
##### The Referrer-Policy header allows you to control how much information is included in the Referer header, giving you more control over the privacy and security of your website.
<br>
##### The possible values for the header include:
<br>
##### <span style='color: #ffbd39'><b>• "no-referrer":</b></span> The Referer header will not be sent in any circumstances.
##### <span style='color: #ffbd39'><b>• "no-referrer-when-downgrade":</b></span> The Referer header will not be sent when navigating from HTTPS to HTTP, but will be sent in all other cases.
##### <span style='color: #ffbd39'><b>• "same-origin":</b></span> The Referer header will only be sent if the destination URL has the same origin as the referring URL.
##### <span style='color: #ffbd39'><b>• "strict-origin":</b></span> The Referer header will only be sent if the destination URL has the same origin as the referring URL, and will only include the scheme, host, and port (but not the path).
##### <span style='color: #ffbd39'><b>• "strict-origin-when-cross-origin":</b></span> The Referer header will be sent when navigating from HTTPS to HTTP, but will only include the scheme, host, and port (but not the path).
##### <span style='color: #ffbd39'><b>• "unsafe-url":</b></span> The Referer header will be sent in all cases, including when navigating from HTTPS to HTTP.
<br>
![Add Referrer Policy Security Header](/images/blog/posts/make-your-dotnet-application-secure/add-referrer-policy.png)

<br>
<br>

#### <span style='color: #ffbd39'><b>Content-Security-Policy</b></span>
<br>
##### Content-Security-Policy (CSP) is a security header that helps to protect web applications against cross-site scripting (XSS) attacks and other types of code injection attacks. The header allows you to specify the sources from which various types of content can be loaded or executed, such as scripts, stylesheets, images, and media files.
<br>
##### By using CSP, you can prevent attackers from injecting malicious code into your web pages, because any code that is not explicitly allowed by the policy will be blocked by the browser. This can help to protect your users from attacks that could steal their personal information, install malware on their devices, or perform other unauthorized actions.
<br>
![Add Content Security Policy Header](/images/blog/posts/make-your-dotnet-application-secure/add-content-security-policy.png)
<br>
##### In this example, the policy allows content to be loaded only from the website itself <span style='color: #ffbd39'><b> ('self')</b></span> for most types of content <span style='color: #ffbd39'><b>(default-src)</b></span>, but allows scripts to be loaded from both the website and the external source https://cdnjs.cloudflare.com <span style='color: #ffbd39'><b>(script-src)</b></span>. This would allow the use of external JavaScript libraries like jQuery or Bootstrap, while still ensuring that any other scripts are blocked by the browser.
<br>
##### Extra explanation:
<br>
##### Here are some examples of possible values for the Content-Security-Policy header:
<br>

##### <span style='color: #ffbd39'><b>default-src 'self':</b></span> Allows content to be loaded only from the same origin as the page itself.
##### <span style='color: #ffbd39'><b>• default-src 'self' https://example.com:</b></span> Allows content to be loaded from the same origin as the page itself, as well as from the https://example.com domain.
##### <span style='color: #ffbd39'><b>• default-src 'none':</b></span> Disallows all content from being loaded.
##### <span style='color: #ffbd39'><b>• default-src 'self' script-src 'unsafe-inline':</b></span> Allows scripts to be loaded only from the same origin as the page itself, but also allows inline scripts.
##### <span style='color: #ffbd39'><b>• default-src 'self'; img-src 'self' data:</b></span> Allows images to be loaded only from the same origin as the page itself, as well as from data URLs.
<br>

##### Other possible directives and their meanings include:
<br>
##### - script-src: Defines the policy for scripts
##### - img-src: Defines the policy for images
##### - style-src: Defines the policy for styles
##### - connect-src: Defines the policy for network connections
##### - font-src: Defines the policy for fonts
##### - object-src: Defines the policy for objects and plugins
##### - media-src: Defines the policy for video and audio




######  <span style='color: #ffbd39'><b>1. DENY:</b></span> not allow your website to be embedded in an iframe under any circumstances.
######  <span style='color: #ffbd39'><b>2. SAMEORIGIN:</b></span> allow your website to be embedded in an iframe only if the iframe is on the same domain as your website.

######  <span style='color: #ffbd39'><b>3. ALLOW-FROM uri:</b></span>  allow your website to be embedded in an iframe only if the iframe is on the specified uri.

<br>
##### <span style='color: #ffbd39'><b>• Account</b></span>: Like I said, you should be logged in
##### <span style='color: #ffbd39'><b>• Name</b></span>: Give a name for a tunnel
##### <span style='color: #ffbd39'><b>• Type</b></span>:
##### - Temporary -  a new URL each time Visual Studio is started
##### - Permanent - the same URL each time Visual Studio is started. 
##### <span style='color: #ffbd39'><b>• Access</b></span>:
##### - Private - accessible only to the account that created it
##### - Organization - The tunnel is accessible to accounts in the same organization as the one that created it. If this option is selected for a personal Microsoft account (MSA), the effect is the same as selecting Private. Organization support for GitHub accounts isn't supported. 
#####  - Public - No authentication required. 
<br>
##### <span style='color: #ffbd39'><b>Way #2</b></span>: Modify the <span style='color: #ffbd39'><b>launchSettings.json</b></span> file under Properties folder. Add the following code under https section: 
<br>
![Launch Settings Dev Tunnel](/images/blog/posts/how-to-put-localhost-online-in-visualstudio/launchsettings-dev-tunnels.png)
<br>
<br>
### Run application with Dev Tunnel
<br>
<br>

##### Now you can run the application with Dev Tunnel and be able to expose a localhost to the internet.
<br>
##### To do that, you just need to select a created tunnel.
<br>
![Run application with Dev Tunnel](/images/blog/posts/how-to-put-localhost-online-in-visualstudio/run-application-with-dev-tunnel.jpg)
<br>
##### When you run the application, you should see the following window:
<br>
![Run application with Dev Tunnel](/images/blog/posts/how-to-put-localhost-online-in-visualstudio/test-dev-tunnels.png)
<br>
##### And when you click on <span style='color: #ffbd39'><b>Continue</b></span> button, you will see the full application like when you run it on localhost. But this one will have a public URL.

<br>
<br>
### What next?
<br>
<br>
##### Try to expose Azure functions - it's also possible.
<br>
##### That's all from me for today.
<br>
##### Make a coffee and try it on your projects.
<br>

## <b > dream BIG! </b>