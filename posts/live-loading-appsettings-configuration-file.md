---
title: "Live loading appsettings.json configuration file"
subtitle: "The IOptions pattern is part of the Microsoft.Extensions.Options namespace and provides a way to define a configuration class and bind settings from various sources such as appsettings.json files, environment variables, or command-line arguments."
date: "June 10 2024"
category: ".NET"
readTime: "Read Time: 3 minutes"
meta_description: "The IOptions pattern is part of the Microsoft.Extensions.Options namespace and provides a way to define a configuration class and bind settings from various ..."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">- Discover the principles and best practices of API design with Postman's comprehensive guide. Learn how to create adaptable, testable, and well-documented APIs that support your business objectives. Dive into the full process and enhance your API design capabilities at <a href="https://www.postman.com/api-platform/api-design/" style="color: #a5b4fc; text-decoration: underline;">Postman API Design</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## Introduction
The **IOptions pattern** is part of the *Microsoft.Extensions.Options* namespace and provides a way to define a configuration class and bind settings from various sources such as appsettings.json files, environment variables, or command-line arguments.

We already know how to use it.
In the appsettings.json file, I added a new value which I need in my application - **NewsletterSettings -> URL:**

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

Also, I created a configuration class to represent my settings. This class will contain properties for each setting you want to configure:

```csharp
public class NewsletterSettings
{
    public string Url { get; set; }
}
```
And lastly, I created a binding between those two, in the Program.cs class:

```csharp
builder.Services.Configure<NewsletterSettings>(
    builder.Configuration.GetSection(nameof(NewsletterSettings)));
```
I created a simple controller to show the using of the NewsletterSettings within IOptions pattern:

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
Perfect, but...

## What is the "problem"?

What if you want to change the value in the appsettings.json while the application running?

You can do that, **but the old value will be still active in the application**.

Why is this the case?

Because the IOptions interface is registered as a **Singleton service** at the start of the application. This means that it going to read the configuration section just once at startup and reuse it throughout the lifetime of the application.

If you want to see a new value, you need to restart an application.

How to achieve that you can change the values in the lifetime of the application?

## IOptionsSnapshot

While IOptions provides a read-only snapshot of the configuration settings during application startup, and IOptionsSnapshot reloads the settings on each access to pick up changes, IOptionsMonitor goes one step further by allowing you to register callbacks that are triggered whenever the configuration settings change.
You just need to add it through dependency injection:

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

But, as I said, it is possible to register a callback to react to changes in the configuration:

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
## What is the difference?

IOptionsSnapshot provides dynamic access to configuration settings that can change during the application's execution, while IOptionsMonitor extends this by allowing you to register callbacks that get triggered whenever the configuration settings change, enabling real-time reactions to configuration updates.

**Use IOptionsSnapshot when** your configuration settings may change during the application's execution and you want those changes to take effect without restarting the application. It provides dynamic access to the configuration settings.

**Use IOptionsMonitor when** you not only need dynamic access to configuration settings but also want to be notified whenever the configuration changes, so you can react to those changes in real-time.

Check the source code [here](https://github.com/StefanTheCode/IOptionsSnapshot_IOptionsMonitor_Demo).

That's all from me today.

## Wrapping Up

<!--END-->
