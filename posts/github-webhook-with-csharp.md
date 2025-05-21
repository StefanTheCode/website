---
title: "GitHub Webhook with C#"
subtitle: "A Webhook is a mechanism that allows a web application to send real-time notifications or data to another web application..."
category: "APIs"
date: "March 06 2023"
---

### Background
&nbsp;
&nbsp;
##### A <b>Webhook</b> is a mechanism that allows a web application to send real-time notifications or data to another web application.
&nbsp;

##### It is essentially a way for two different applications to communicate with each other in "real time" rather than relying on periodic polling or manual data transfer.

##### An example of a simple implementation of a C# Webhook receiver for Github will be shown below.
&nbsp;

##### **In this edition of the newsletter, there will be no mention of the implementation of the webhook mechanism (sender & receiver) due to the volume of the problem, which is not adequate for the newsletter.
&nbsp;
&nbsp;
### C# Webhook receiver
&nbsp;
&nbsp;

##### A webhook receiver for an event that happened on Github or any other service can be represented in the simplest way as an <b>HttpPost API endpoint</b> in a C# controller.

&nbsp;

##### <b> • Create an action in C# Controller</b>
##### You need to create C # API Controller with GitHubWebhookController name. This is a controller to serve for all Events that happen within Github repository.
&nbsp;
##### After that, you need to add an endpoint Pushed for the "push" event on github, which will practically serve as a callback event. 
&nbsp;

![GitHub Webhook Api Endpoint](/images/blog/posts/github-webhook-with-csharp/github-webhook-api-endpoint.png)
&nbsp;
##### This method must be HttpPost. 
##### Since I currently don't know what the GitHub payload looks like, ie. object/JSON that GitHub sends during a specific event, I will state that the object that the method receives as a parameter is type dynamic.
&nbsp;
##### <b> ​• Run the application</b>
&nbsp;
##### When you start the API project, through Swagger you can see Endpoint there is and that everything is fine for now.
&nbsp;
![Swagger GitHub Webhook Api Endpoint](/images/blog/posts/github-webhook-with-csharp/swagger-github-webhook-endpoint.png)
&nbsp;
&nbsp;

### Create Webhook instance on GitHub
&nbsp;
&nbsp;

##### Within the GitHub repository for which you want to receive events, you need to generate a Webhook instance. In the repository settings, you should select the Webhooks link from the left menu. And click on the Add webhook button. You should see the following form: 
&nbsp;
![GitHub Platform Adding Webhook](/images/blog/posts/github-webhook-with-csharp/github-platform-adding-webhook.png)
&nbsp;
##### The most important field to fill in is of course the <b>PayloadUrl</b>.
&nbsp;
##### <b>This field represents the endpoint of our application that Github will call the moment a push event occurs on the selected repository.<b>
&nbsp;
##### <b>Content type:</b> You can choose application/json
##### <b>Secret:</b> You can generate via some online generator. This secret is used to verify that the payload was actually sent by Github and not by a malicious third party pretending to be Github. For demo purposes I will leave it blank, but <b> do not do this on production</b>.
&nbsp;
##### Okay, now, what will happen if you put the localhost link (http://localhost:7030/api/GithubWebhook/push) like a Payload URL? 
&nbsp;
##### Nothing. 
##### GitHub doesn't know that your localhost exists somewhere on your computer. It is necessary that the application is deployed somewhere, say Azure.
##### But for testing and debugging, ngrok can help you. 
&nbsp;
##### <b>What is ngrok?</b>
&nbsp;
##### Ngrok is a software tool that creates a secure tunnel between a local machine and the public internet, allowing developers to expose a web server running on their local machine to the internet.
&nbsp;
##### <b>Ngrok setup</b>
&nbsp;
##### • Download from: [Ngrok]( https://ngrok.com/)
##### • Install it and run it
##### • Execute the following command: <b>ngrok http port</b>
&nbsp;
##### *Port should be your port which you can see when you start the application
##### *You should <b>disable https protocol</b> for the application by replacing https urls with http in <b>launchSettings.json</b>.
&nbsp;
##### Now you will see in CMD the url that is online and to which the localhost url is mapped. 
##### If you visit the url from the <b>'forwarding'</b> part, you will see exactly the same result as for localhost. Of course, the advantage of this is that the debugger is active.
![Ngrok Console Running](/images/blog/posts/github-webhook-with-csharp/ngrok-console-running.png)
&nbsp;
##### The next thing is to put that ngrok url together with the API endpoint in the Payload Url field: https://9739-178-220-34-243.eu.ngrok.io/api/GitHubWebhook/pushed

&nbsp;
&nbsp;
### #1 Testing
&nbsp;
##### 1. Run the application
##### 2. Put a breakpoint in the Pushed method
##### 3. Go to the repository and make some changes
![GitHub Commit Changes](/images/blog/posts/github-webhook-with-csharp/github-commit-changes.png)
##### 3. Wait for a couple of seconds, and call should hit the debugger
##### 4. You can see parameter payload is full of data
![Webhook Endpoint Payload](/images/blog/posts/github-webhook-with-csharp/webhook-endpoint-payload.png)
&nbsp;
&nbsp;

### What next?
&nbsp;
&nbsp;
##### On this very simple example, I have shown how a webhook receiver for Github can be implemented.
&nbsp;
##### In this way, any service that supports WebHooks works. With the fact that there is a difference from service to service in the payload that is sent, so based on what you need, you will create a class with properties instead of receiving a dynamic type of payload.
&nbsp;
##### Also, this can be implemented with Azure Functions, so be sure you do a research on that topic.
&nbsp;
##### For GitHub payload for each webhook you can find at: [Github Webhook Documentation](https://docs.github.com/en/webhooks/webhook-events-and-payloads)

&nbsp;
##### That's all from me for today.
&nbsp;
##### Make a coffee and check out source code directly on my <b> [GitHub repository](https://github.com/StefanTheCode/Newsletter/tree/main/4%23%20-%20Webhooks)</b>.

&nbsp;

## <b > dream BIG! </b>