---
title: "How to send email in 5min with FluentEmail?"
subtitle: "FluentEmail is a popular open-source library for sending emails from .NET applications..."
readTime: "Read Time: 3 minutes"
date: "Mar 17 2025"
category: ".NET"
meta_description: "Effortlessly integrate email functionality in .NET: Learn about FluentEmail's quick setup, versatile email sender options, and template rendering. Ideal for .NET developers."
---
&nbsp;  
&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;   
##### • I'm preapring **Enforcing Code Style course** in my **[TheCodeMan Community](https://www.skool.com/thecodeman)**. For 3 consecutive subscriptions ($12) or annual ($40) you get this course, plus everything else in the group.🚀 **[Join now](https://www.skool.com/thecodeman)** and grab my first ebook for free.
&nbsp;  
##### • The best **[Pragmatic RESTful APIs in .NET course](https://www.courses.milanjovanovic.tech/a/aff_9044l6t3/external?affcode=1486372_ocagegla)** is finally live! It's created by Milan Jovanovic. This is not a paid ad - it's just my recommendation. I didn't watch the better material than this. You have a discount through my affiliate link. [Check it out now](https://www.courses.milanjovanovic.tech/a/aff_9044l6t3/external?affcode=1486372_ocagegla).
&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  
##### New user registered on your app?
##### The verification code should be sent to his email.
&nbsp;  
##### User forgot password?
##### You should send him a password reset link to his email.
&nbsp;  
##### And a thousand more such examples. Production applications today cannot live without some kind of email sending. That's why we need something easily and quickly configurable for sending emails.
&nbsp;  
##### Introducing **FluentEmail**.
&nbsp;  
##### FluentEmail is a popular open-source library for sending emails from .NET applications. It provides an fluent interface (fluent syntax). That means we can easily create an email message, add recipients, set the subject, etc. by chaining methods.
&nbsp;  
##### Let's dive in.
&nbsp;  
&nbsp;  
### Quick Configuration
&nbsp;  
&nbsp;  
##### The first thing that is necessary is to add a new package from the NuGet package manager.
```csharp

dotnet add package FluentEmail.Core
dotnet add package FluentEmail.Smtp
```
&nbsp;  
##### Now you can use the library.
&nbsp;  
##### How?
&nbsp;  
&nbsp;  
### Basic Usage
&nbsp;  
&nbsp;  
##### To construct and send an email you just keep building up the fluent methods on the **IEmail class** (comes from FluentEmail). When you are ready to send, call **SendAsync** ().
```csharp

var email = await Email
    .From("stefan@gmail.com")
    .To("milan@gmail.com", "Milan")
    .Subject("Hi Milan!")
    .Body("Works!")
    .SendAsync();
```
&nbsp;  
##### There are the most common methods available on the email object:
&nbsp;  
##### • **.To** (string emailAddress) - add recipients
##### • **.SetFrom** (string emailAddress) - change the sender address.
##### • **.CC/BCC** (string emailAddress) - add CC or BCC
##### • **.Subject** (string subject) - set the subject
##### • **.Body** (string body) - set the message body (without templating)
##### • **.Attach** (Attachment attachment) - add attachments
##### • **.UsingTemplate** (string template, T model, bool isHtml = true) - set a template, keep reading for more templating information
##### • **.SendAsync** () - send the email using the configured sender
&nbsp;  
&nbsp;  
### Better way?
### Dependency Injection
&nbsp;  
&nbsp;  
##### The best way to use FluentEmail is to configure your sender and template choices with dependency injection.
&nbsp;  
##### Let's configure it in **Program.cs class**:
```csharp

builder.Services.
       .AddFluentEmail("from@gmail.com")
       .AddRazorRenderer()
       .AddSmtpSender("localhost", 25);
```
&nbsp;  
##### What I did here?
&nbsp;  
##### • **.AddFluentEmail** () - sets up FluentEmail with a default SendFrom address.
##### • **AddSmtpSender** () - configures the SmtpSender provider (ISender interface).
##### • **AddRazorRenderer** () - sets the RazorRenderer provider - templating support (ITemplateRenderer interface).
&nbsp;  
##### Using dependency injection will make a couple of interfaces available to your code. See the example below for sending email with the configured services:
```csharp

public class EmailService : IEmailService
{
    private readonly IFluentEmail _fluentEmail;

    public EmailService(IFluentEmail fluentEmail)
    {
        _fluentEmail = fluentEmail;
    }

    public async Task Send()
    {
        await _fluentEmail
                .To("test@gmail.com")
                .Subject("Test email")
                .Body("Test body")
                .SendAsync();
    }
}

```
&nbsp;  
&nbsp;  
### Razor Email Templates
&nbsp;  
&nbsp;  
##### We want the emails we send to have the same template and style. Especially if we send a newsletter, like this one for example :D
&nbsp;  
##### One of the most popular options for template rendering is using the **Razor template renderer** . To use this renderer, it is necessary to add the **FluentEmail.Razor** package from NuGet.
```csharp

dotnet add package FluentEmail.Razor
```
&nbsp;  
##### The RazorRenderer supports **any valid Razor code** .
&nbsp;  
##### Let's see the example:
```csharp

//configure the Razor Renderer
builder.Services
       .AddFluentEmail("from@gmail.com")
       //pass in a type in the assemble with embedded tempaltes
       .AddRazorRenderer(typeof(Program))

//In your template code include a layout file
//the template could be sourced from file/embedded if that is configured
var template = @"
    @{Layout = ""./Shared/_Layout.cshtml""; }

    Hi @Model.Name here is a list @foreach(var i in Model.Numbers) { @i }";

var model = new { Name = "Stefan", Numbers = new [] { 1, 2, 3} };

var email = new Email()
      .To("test@gmail.com")
      .Subject("Razor template example")
      .UsingTemplate(template, model);
```
&nbsp;  
##### **Some other templates?**
&nbsp;  
##### There is a support for **Liquid Templates** , also. The Liquid Templates are a more restricted templating language created by Shopify. They are more lightweight than Razor templates as well as safer and simpler for end users to create. Properties on the model are made available as Liquid properties in the template.
&nbsp;  
&nbsp;  
### Email Senders
&nbsp;  
&nbsp;  
##### FluentEmail allows you to plug in popular email sending providers (or build your own by implementing **ISender** ).
&nbsp;  
##### To use a sender include the provider and configure it as part of dependency injection.&nbsp;
&nbsp;  
##### The following senders are available as core libraries:
&nbsp;  
##### - SMTP Sender
##### - Mailgun Sender
##### - SendGrid Sender
##### - MimeKit Sender
&nbsp;  
##### Let's see how it's easy to configure it with **SendGrid** for example.
&nbsp;  
##### First, you need to add another package from the NuGet:
```csharp

dotnet add package FluentEmail.SendGrid
```
&nbsp;  
##### And lastly, you just need to configure it in Program.cs:
```csharp

builder.Services
       .AddFluentEmail("from@gmail.com")
       .AddSendGridSender("apikey");
```
&nbsp;  
##### And that's it. You have integrated it.
&nbsp;  
##### This is so perfect!
&nbsp;  
&nbsp;  
### What next?
&nbsp;  
&nbsp;  
##### I showed you how with the help of the FluentEmail library it is possible to send an email in 5 minutes. It can be easily integrated with various Email Senders, as well as being able to include various renders.
&nbsp;  
##### You can go to the project's [GitHub repository](https://github.com/lukencode/FluentEmail?ref=lukelowrey.com) and get acquainted with the details.
&nbsp;

##### That's all from me today.
&nbsp;
 
##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

<!--END-->

## <b > dream BIG! </b>