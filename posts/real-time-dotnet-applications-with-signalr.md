---
title: "Real-Time applications with SignalR"
subtitle: "SignalR is like that cool tech wizard in the .NET, making real-time communication feel like a piece of cake..."
readTime: "Read Time: 6 minutes"
date: "Aug 21 2023"
category: ".NET"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Learn to create real-time applications with SignalR in .NET: A step-by-step guide to setting up SignalR, configuring client-side interactions, and handling real-time messaging."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;
##### Today's issue is sponsored by [Milan Jovanovic](https://www.milanjovanovic.tech/pragmatic-clean-architecture).
&nbsp;
##### • [Pragmatic Clean Architecture](https://www.milanjovanovic.tech/pragmatic-clean-architecture?utm_source=stefan): Learn how to confidently ship well-architected production-ready apps using Clean Architecture. Milan used exact principles to build large-scale systems in the past 6 years. [Join 700+ students here](https://www.milanjovanovic.tech/pragmatic-clean-architecture?utm_source=stefan).
&nbsp;  
##### Use this promo code to get a 20% discount: PCAMW20
&nbsp;  
##### The first 20 people will get this discount, hurry up.
&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp;  
##### Ever been frustrated by having to constantly refresh a webpage to get the latest updates?
&nbsp;  
##### Or maybe you've wished your app could instantly show users new messages or notifications without them lifting a finger?
&nbsp;  
##### Yeah, we've all been there. That’s where **SignalR comes to the rescue!**
&nbsp;  
##### SignalR is like that cool tech wizard in the .NET, making real-time communication feel like a piece of cake. From chat apps, quick notifications, to live dashboard updates – SignalR is the secret sauce.
&nbsp;  
##### And the best part? It's all in C#, so it feels right at home for us .NET folks.
&nbsp;  
##### We need 4-5 steps to fully introduce SignalR in our code, so let's dive in.

&nbsp;  
&nbsp;  
### SignalR Configuration
&nbsp;  
&nbsp;  
##### In order to use SignalR, first you need to install it as a library from NuGet.
&nbsp;  
##### You need to install the following package:
```csharp

Install-Package Microsoft.AspNetCore.SignalR.Client
```
&nbsp;  
##### The first thing to configure is the SignalR Hub. The hub is the high-level pipeline able to call the client code, sending messages containing the name and parameters of the requested method.
&nbsp;  
##### You need to create a class which will inherit the **base "Hub" class** from SignalR package:
```csharp

public class NotificationsHub : Hub
{
    public async Task SendNotification(string message)
    {
        await Clients.All.SendAsync("ReceiveNotificaiton", message);
    }
}

```
&nbsp;  
##### And as the last part, like everything else, it is necessary to register SignalR through Dependency Injection in the Program.cs class.
&nbsp;  
##### It's quite straightforward - add the SignalR service and map the Hub used:

```csharp

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

var app = builder.Build();

app.MapHub<NotificationsHub>("notifications-hub");

app.Run();
```

&nbsp;  
&nbsp;  
### Configure Client side
&nbsp;  
&nbsp;  
##### On the client side you can use anything, in this case, I use javascript for easier display and understanding of what is actually happening.
&nbsp;  
##### First I will create the most common HTML components:
&nbsp;  
##### 1. Input field for the message I am sending
##### 2. The send button
##### 3. List of sent/received messages

```html

<input type="text" id="messageBox" placeholder="Your message" />
<button id="sendButton">Send</button>

<ul id="messageList"></ul>
```
&nbsp;  
##### I will also upload the .js script for Signalr so that I can use it on the client:
```html

<script src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/6.0.1/signalr.js"></script>

```
&nbsp;  
##### When the page is loaded, the first thing that needs to happen is to **establish a connection to the SignalR Hub**.
&nbsp;  
##### For that I will use the **signalR.HubConnectionBuilder()** call with the Hub URL we created on the .NET side.
&nbsp;  
##### **Note**: *"notification-hub" must match on both sides - in javascript and in .NET configuration (Program.cs)*.
```javascript

<script>
    $(function() {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("/notifications-hub")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        async function start() {
            try {
                await connection.start();
                console.log("SignalR Connected.");
                await connection.invoke("SendNotification", "Initial Notification");
            } catch (err) {
                console.log(err);
                setTimeout(start, 5000);
            }
        };

        connection.onclose(async () => {
            await start();
        });

        start();
    });
</script>

```
&nbsp;  
##### After that, when the connection exists, I will start the connection. I will put everything in the try/catch block if there are any errors. Now we have a complete connection connected.

&nbsp;  
&nbsp;  
### Send/Receive messages
&nbsp;  
&nbsp;  
##### **Let's send message to Hub:**
&nbsp;  
##### I want to enter a message in the input and by clicking the "Send" button, a message is sent to NotificationHub on the .NET page, which I will immediately receive as a notification, shown in the list of received notifications.
![Testing SignalR](/images/blog/posts/real-time-dotnet-applications-with-signalr/testing-signalr-web-application.png)
&nbsp;  
##### To achieve this, on the click event of the button, I grab the message from the input and call **connection.invoke("SendNotification", message)**, where:
&nbsp;  
##### - the first parameter is the name of the method in NotificationHub,
##### - the message is the parameter, actually, the message I'm sending.
```javascript

  $("#sendButton").on('click', function() {
            var message = $("#messageBox").val();
            connection.invoke("SendNotification", message);
        });

```
&nbsp;  
##### **Let's send message from Hub to Client in real-time:**
&nbsp;  
##### One client sent a message to the Hub, we process that message in the Hub and in Real-Time we send a notification about the message we received to all connected clients.
![Notifications Hub Debugging](/images/blog/posts/real-time-dotnet-applications-with-signalr/notifications-hub-debugging.png)
&nbsp;  
##### **"ReceiveNotification"** is an event on the client side that will accept the notification and process the data we send (it will put them in a list).
```javascript

  connection.on("ReceiveNotification", (message) => {
            const li = document.createElement("li");
            li.textContent = `${message}`;
            document.getElementById("messageList").appendChild(li);
        });
```
&nbsp;  
##### With this, we have achieved complete communication in real time between the Hub and clients connecting to the Hub.
&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  
##### So in short, when we need **communication** (sending notifications, chat applications, real-time dashboard) **in real time, SignalR** proved to be a great choice.
&nbsp;  
##### It is necessary to do the following things in order to establish the connection:
&nbsp;  
##### - Configure SignalR on the .NET side - Hub
##### - Configure on the client side - connect to the Hub
##### - Implement methods/events/handles for sending and receiving messages
&nbsp;  
##### I didn't mention:
&nbsp;  
##### In the example, I showed sending messages to all connected users, so the message also reached me.
##### Here it is possible to configure and send messages to certain users or to one user, for example:
&nbsp;  
##### **Clients.User(userId).ReceiveNotification(content);**
&nbsp;  
##### In addition to accessing the client list, SignalR Hub also supports access to:
&nbsp;  
##### - Groups - adding and removing connections from groups
##### - Context - accessing information about the hub caller connection
&nbsp;  
##### I encourage you to look at the complete source code that I leave here and write to me if you have any questions.
&nbsp;  
##### Here is the source code on [GitHub](https://github.com/StefanTheCode/SignalRDemo).
&nbsp;  
##### That's all from me today. 






