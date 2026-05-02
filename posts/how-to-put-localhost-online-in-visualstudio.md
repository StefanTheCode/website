---
title: "How to put localhost online in Visual Studio?"
subtitle: "Imagine creating a .NET API project that you call in a front-end web or mobile application..."
date: "Apr 3 2023"
category: ".NET"
readTime: "Read Time: 3 minutes"
meta_description: "The dev tunnels feature of Visual Studio 2022 enables ad-hoc connections between machines that can't directly connect. This feature helps you to debug web API endpoints with a publicly accessible endpoint."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored - I write these deep dives in my free time and keep them free for everyone. If your company sells AI tools, dev tools, courses, or services that .NET developers would actually use, sponsoring an issue is the most direct way to reach them.</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>

## The background
Imagine creating a .NET API project that you call in a front-end web or mobile application. At some point, you need the option to debug the code directly online, or quickly send the application to someone for review without deploying it to the server - so you need to expose localhost to the web.
You are probably familiar with the ngrok application, which creates a temporary URL address on a server with the help of which it is possible to access the application.
Now it is possible in Visual Studio 2022 with the built-in **Dev Tunnels** feature.
## What is Dev Tunnels?

The dev tunnels feature of Visual Studio 2022 enables ad-hoc connections between machines that can't directly connect. A URL is created that allows any device with an internet connection to communicate to an ASP.NET  project while it runs on localhost.
This feature helps you to debug web API endpoints with a publicly accessible endpoint.
Let's see how to use it.
## Enable Dev Tunnels

Prerequisite:
- Required version Visual Studio is 17.5
- You must sign into Visual Studio
- Dev Tunnels is not available for Visual Studio on Mac  
To use this feature, first you need to enable Dev Tunnel feature from: **Tools -> Options -> Environment -> Preview Features** (or just search for dev keyword). Then search for keyword dev. Check the <span style="color: #ffbd39"> **Enable dev tunnels for Web Applications** checkbox.
![Enable Dev Tunnels](/images/blog/posts/how-to-put-localhost-online-in-visualstudio/enable-dev-tunnels.png)
## Create a Tunnel

To run with the Dev tunnel, it is necessary to create a tunnel from the private network (local) to the public (Internet network).
You can do this in 2 ways:
**Way #1**: From the Debug menu, select Dev Tunnels and then Create a Tunnel.
![Create Dev Tunnel from Debug Menu](/images/blog/posts/how-to-put-localhost-online-in-visualstudio/create-dev-tunnel-from-debug-menu.jpg)
You should see a following window:
![Create Dev Tunnel from Debug Menu](/images/blog/posts/how-to-put-localhost-online-in-visualstudio/account-to-create-dev-tunnel.png)
Details:
**- Account**: Like I said, you should be logged in
**- Name**: Give a name for a tunnel
**- Type**:
- Temporary -  a new URL each time Visual Studio is started
- Permanent - the same URL each time Visual Studio is started. 
**- Access**:
- Private - accessible only to the account that created it
- Organization - The tunnel is accessible to accounts in the same organization as the one that created it. If this option is selected for a personal Microsoft account (MSA), the effect is the same as selecting Private. Organization support for GitHub accounts isn't supported. 
- Public - No authentication required. 
**Way #2**: Modify the **launchSettings.json** file under Properties folder. Add the following code under https section: 
![Launch Settings Dev Tunnel](/images/blog/posts/how-to-put-localhost-online-in-visualstudio/launchsettings-dev-tunnels.png)
## Run application with Dev Tunnel

Now you can run the application with Dev Tunnel and be able to expose a localhost to the internet.
To do that, you just need to select a created tunnel.
![Run application with Dev Tunnel](/images/blog/posts/how-to-put-localhost-online-in-visualstudio/run-application-with-dev-tunnel.jpg)
When you run the application, you should see the following window:
![Run application with Dev Tunnel](/images/blog/posts/how-to-put-localhost-online-in-visualstudio/test-dev-tunnels.png)
And when you click on **Continue** button, you will see the full application like when you run it on localhost. But this one will have a public URL.

## What next?
Try to expose Azure functions - it's also possible.
That's all from me for today.
Make a coffee and try it on your projects.

## dream BIG!

## Wrapping Up

<!--END-->
