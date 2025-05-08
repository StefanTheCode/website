---
newsletterTitle: "#71 Stefan's Newsletter"
title: "Live loading appsettings.json configuration file"
subtitle: "The IOptions pattern is part of the Microsoft.Extensions.Options namespace and provides a way to define a configuration class and bind settings from various sources such as appsettings.json files, environment variables, or command-line arguments."
category: ".NET"
date: "June 10 2024"
photoUrl: "/images/blog/newsletter21.png"
---

&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • Discover the principles and best practices of API design with Postman's comprehensive guide. Learn how to create adaptable, testable, and well-documented APIs that support your business objectives. Dive into the full process and enhance your API design capabilities at [Postman API Design](https://www.postman.com/api-platform/api-design/).
&nbsp;  

<!--START-->

### Introduction
&nbsp;  
&nbsp;  
##### The **IOptions pattern** is part of the *Microsoft.Extensions.Options* namespace and provides a way to define a configuration class and bind settings from various sources such as appsettings.json files, environment variables, or command-line arguments.
&nbsp;  

##### We already know how to use it.
&nbsp;  
##### In the appsettings.json file, I added a new value which I need in my application - **NewsletterSettings -> URL:**

```json

{
    "Logging": {
        "LogLevel": {
            "Default": "Information",
            "Microsoft.AspNetCore": "Warning"
        }
    },
    "AllowedHosts": "*",
    "NewsletterSettings": {
        "URL": "testUrl"
    }
}

```
&nbsp;  

##### Also, I created a configuration class to represent my settings. This class will contain properties for each setting you want to configure:

```csharp

public class NewsletterSettings
{
    public string Url { get; set; }
}

```
&nbsp;  
##### And lastly, I created a binding between those two, in the Program.cs class:

```csharp

builder.Services.Configure<NewsletterSettings>(
    builder.Configuration.GetSection(nameof(NewsletterSettings)));

```
&nbsp;  
##### I created a simple controller to show the using of the NewsletterSettings within IOptions pattern:

```csharp

[ApiController]
[Route("[controller]")]
public class NewsletterController : ControllerBase
{
    private readonly IOptions<NewsletterSettings> _newsletterSettings;

    public NewsletterController(IOptions<NewsletterSettings> newsletterSettings)
    {
        _newsletterSettings = newsletterSettings;
    }

    [HttpGet(Name = "GetNewsletter")]
    public string Get()
    {
        return _newsletterSettings.Value.Url;
    }
}

```
&nbsp;  
##### Perfect, but...
&nbsp;  
&nbsp;  

### What is the "problem"?
&nbsp;  
&nbsp;  

##### What if you want to change the value in the appsettings.json while the application running?
&nbsp;  

##### You can do that, **but the old value will be still active in the application**.
&nbsp;  

##### Why is this the case?
&nbsp;  

##### Because the IOptions interface is registered as a **Singleton service** at the start of the application. This means that it going to read the configuration section just once at startup and reuse it throughout the lifetime of the application.
&nbsp;  

##### If you want to see a new value, you need to restart an application.
&nbsp;  

##### How to achieve that you can change the values in the lifetime of the application?

&nbsp;  
&nbsp;  

### IOptionsSnapshot
&nbsp;  
&nbsp;  

##### While IOptions provides a read-only snapshot of the configuration settings during application startup, and IOptionsSnapshot reloads the settings on each access to pick up changes, IOptionsMonitor goes one step further by allowing you to register callbacks that are triggered whenever the configuration settings change.
&nbsp;  
##### You just need to add it through dependency injection:

```csharp

[ApiController]
[Route("[controller]")]
public class NewsletterController : ControllerBase
{
    private readonly IOptionsMonitor<NewsletterSettings> _newsletterMonitor;

    public NewsletterController(IOptionsMonitor<NewsletterSettings> newsletterMonitor)
    {
        _newsletterMonitor = newsletterMonitor;
    }

    [HttpGet(Name = "GetNewsletter")]
    public string Get()
    {
        string ioptionsMonitor = _newsletterMonitor.CurrentValue.Url;
        return ioptionsMonitor;
    }
}

```
&nbsp;  

##### But, as I said, it is possible to register a callback to react to changes in the configuration:

```csharp

public NewsletterController(IOptionsMonitor<NewsletterSettings> newsletterMonitor)
{
    _newsletterMonitor = newsletterMonitor;

    _newsletterMonitor.OnChange(settings =>
    {
        Console.WriteLine($"Settings changed: {settings.Url}");
    });
}

```
&nbsp;  
&nbsp;  
### What is the difference?
&nbsp;  
&nbsp;  

##### IOptionsSnapshot provides dynamic access to configuration settings that can change during the application's execution, while IOptionsMonitor extends this by allowing you to register callbacks that get triggered whenever the configuration settings change, enabling real-time reactions to configuration updates.
&nbsp;  

##### **Use IOptionsSnapshot when** your configuration settings may change during the application's execution and you want those changes to take effect without restarting the application. It provides dynamic access to the configuration settings.
&nbsp;  

##### **Use IOptionsMonitor when** you not only need dynamic access to configuration settings but also want to be notified whenever the configuration changes, so you can react to those changes in real-time.
&nbsp;  

##### Check the source code [here](https://github.com/StefanTheCode/IOptionsSnapshot_IOptionsMonitor_Demo).
&nbsp;  

##### That's all from me today. 

<!--END-->
