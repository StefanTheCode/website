---
title: "How to put localhost online in Visual Studio?"
category: ".NET"
subtitle: "Imagine creating a .NET API project that you call in a front-end web or mobile application..."
date: "Apr 3 2023"
meta_description: "The dev tunnels feature of Visual Studio 2022 enables ad-hoc connections between machines that can't directly connect. This feature helps you to debug web API endpoints with a publicly accessible endpoint."
---


### The background
&nbsp;
&nbsp;
##### Imagine creating a .NET API project that you call in a front-end web or mobile application. At some point, you need the option to debug the code directly online, or quickly send the application to someone for review without deploying it to the server - so you need to expose localhost to the web.
&nbsp;
##### You are probably familiar with the ngrok application, which creates a temporary URL address on a server with the help of which it is possible to access the application.
&nbsp;
##### Now it is possible in Visual Studio 2022 with the built-in <span style="color: #ffbd39"><b>Dev Tunnels</b></span> feature.
&nbsp;
&nbsp;
### What is Dev Tunnels?
&nbsp;
&nbsp;

##### The dev tunnels feature of Visual Studio 2022 enables ad-hoc connections between machines that can't directly connect. A URL is created that allows any device with an internet connection to communicate to an ASP.NET  project while it runs on localhost.
&nbsp;
##### This feature helps you to debug web API endpoints with a publicly accessible endpoint.
&nbsp;
##### Let's see how to use it.
&nbsp;
&nbsp;
### Enable Dev Tunnels
&nbsp;
&nbsp;

##### Prerequisite:
&nbsp;
##### • Required version Visual Studio is 17.5
##### • You must sign into Visual Studio
##### • Dev Tunnels is not available for Visual Studio on Mac  
&nbsp;
##### To use this feature, first you need to enable Dev Tunnel feature from: <span style="color: #ffbd39"><b>Tools -> Options -> Environment -> Preview Features</b></span> (or just search for dev keyword). Then search for keyword dev. Check the <span style="color: #ffbd39"> <b>Enable dev tunnels for Web Applications</b></span> checkbox.
&nbsp;
![Enable Dev Tunnels](/images/blog/posts/how-to-put-localhost-online-in-visualstudio/enable-dev-tunnels.png)
&nbsp;
&nbsp;
### Create a Tunnel
&nbsp;
&nbsp;

##### To run with the Dev tunnel, it is necessary to create a tunnel from the private network (local) to the public (Internet network).
&nbsp;
##### You can do this in 2 ways:
&nbsp;
##### <span style="color: #ffbd39"><b>Way #1</b></span>: From the Debug menu, select Dev Tunnels and then Create a Tunnel.
&nbsp;
![Create Dev Tunnel from Debug Menu](/images/blog/posts/how-to-put-localhost-online-in-visualstudio/create-dev-tunnel-from-debug-menu.jpg)
&nbsp;
##### You should see a following window:
&nbsp;
![Create Dev Tunnel from Debug Menu](/images/blog/posts/how-to-put-localhost-online-in-visualstudio/account-to-create-dev-tunnel.png)
&nbsp;
##### Details:
&nbsp;
##### <span style="color: #ffbd39"><b>• Account</b></span>: Like I said, you should be logged in
##### <span style="color: #ffbd39"><b>• Name</b></span>: Give a name for a tunnel
##### <span style="color: #ffbd39"><b>• Type</b></span>:
##### - Temporary -  a new URL each time Visual Studio is started
##### - Permanent - the same URL each time Visual Studio is started. 
##### <span style="color: #ffbd39"><b>• Access</b></span>:
##### - Private - accessible only to the account that created it
##### - Organization - The tunnel is accessible to accounts in the same organization as the one that created it. If this option is selected for a personal Microsoft account (MSA), the effect is the same as selecting Private. Organization support for GitHub accounts isn't supported. 
#####  - Public - No authentication required. 
&nbsp;
##### <span style="color: #ffbd39"><b>Way #2</b></span>: Modify the <span style="color: #ffbd39"><b>launchSettings.json</b></span> file under Properties folder. Add the following code under https section: 
&nbsp;
![Launch Settings Dev Tunnel](/images/blog/posts/how-to-put-localhost-online-in-visualstudio/launchsettings-dev-tunnels.png)
&nbsp;
&nbsp;
### Run application with Dev Tunnel
&nbsp;
&nbsp;

##### Now you can run the application with Dev Tunnel and be able to expose a localhost to the internet.
&nbsp;
##### To do that, you just need to select a created tunnel.
&nbsp;
![Run application with Dev Tunnel](/images/blog/posts/how-to-put-localhost-online-in-visualstudio/run-application-with-dev-tunnel.jpg)
&nbsp;
##### When you run the application, you should see the following window:
&nbsp;
![Run application with Dev Tunnel](/images/blog/posts/how-to-put-localhost-online-in-visualstudio/test-dev-tunnels.png)
&nbsp;
##### And when you click on <span style="color: #ffbd39"><b>Continue</b></span> button, you will see the full application like when you run it on localhost. But this one will have a public URL.

&nbsp;
&nbsp;
### What next?
&nbsp;
&nbsp;
##### Try to expose Azure functions - it's also possible.
&nbsp;
##### That's all from me for today.
&nbsp;
##### Make a coffee and try it on your projects.
&nbsp;

## <b > dream BIG! </b>