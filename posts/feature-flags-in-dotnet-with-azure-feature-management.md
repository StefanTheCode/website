---
title: "Feature Flags in .NET 8 with Azure Feature Management"
subtitle: "Feature Flags are one of the most powerful techniques to achieve this, enabling developers to toggle features on or off without deploying new code."
date: "Nov 18 2024"
category: "Azure"
readTime: "Read Time: 4 minutes"
meta_description: "Learn how to deal with Feature Flags in .NET using Azure Feature Management."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Accelerate your .NET web app development with <a href="https://abp.io/?utm_source=newsletter&utm_medium=affiliate&utm_campaign=stefandjokic_bf24" style="color: #a5b4fc; text-decoration: underline;">ABP.IO</a>! Access framework’s pre-built modules, startup templates and full-stack features - Black Friday prices start on 25th November so stay tuned! <a href="https://abp.io/?utm_source=newsletter&utm_medium=affiliate&utm_campaign=stefandjokic_bf24" style="color: #a5b4fc; text-decoration: underline;">Stay tuned!</a></p>
<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Unlock <a href="https://community.postman.com/t/the-postman-drop-october-edition/70044?utm_medium=social_sharing&utm_source=newsletter&utm_content=Stefan_Djokic" style="color: #a5b4fc; text-decoration: underline;">Postman's latest features</a> for seamless API management! Now with a centralized variable experience and secure secret storage via Postman Vault, your team can streamline workflows and safeguard sensitive data effortlessly. <a href="https://community.postman.com/t/the-postman-drop-october-edition/70044?utm_medium=social_sharing&utm_source=newsletter&utm_content=Stefan_Djokic" style="color: #a5b4fc; text-decoration: underline;">Learn more</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## The Background
In today’s dynamic software landscape, agility and controlled releases are paramount. 
[Feature Flags](https://thecodeman.net/posts/feature-flags-in-dotnet-without-redeploying) are** one of the most powerful techniques to achieve this, **enabling developers to toggle features on or off without deploying new code.
Let’s dive into how .NET 8 and Azure Feature Management make feature flags seamless, efficient, and production-ready.

## Why Use Azure Feature Management?

Azure Feature Management provides a centralized, scalable, and cloud-native approach to managing feature flags.
 
Here's why it stands out compared to basic configurations like [appsettings](https://thecodeman.net/posts/live-loading-appsettings-configuration-file).json:

Problems with Basic Configuration in appsettings.json

**Lack of Centralization:** Managing feature flags across environments (dev, staging, production) becomes cumbersome as each environment requires manual updates.
**Deployment Coupling:** Changing a flag in appsettings.json requires redeployment, which defeats the purpose of feature toggling.
**Limited Targeting:** No built-in support for audience targeting or percentage rollouts.

Why Azure Feature Management Is Better

**Centralized Configuration:** Store, update, and manage feature flags from the Azure portal or via APIs.
**Dynamic Updates: ** Change feature flags without redeploying the application.
**Targeting Options:** Use feature filters to target users by region, percentage, or custom rules.
**Integration with Azure Pipelines:** Seamlessly manage feature lifecycles in [CI/CD](https://thecodeman.net/posts/bullet-Proof-dotnet-ci-on-github) workflows.
**Scalability:** Perfect for distributed systems and microservices.

## Why Are Feature Flags Important?

Feature flags offer several benefits for modern software development:

Controlled Rollouts:
- Enable or disable features for specific user groups.
- Gradually roll out features to minimize risk.

A/B Testing:
- Experiment with variations of features to optimize user experience.

Hotfixes Without Redeployment:
- Instantly disable buggy features without needing a redeployment.

Environment-Specific Features:
- Toggle features across environments like development, staging, and production.

## Step-by-Step Implementation

Set Up Your Azure Feature Manager

1. Create an Azure App Configuration Resource:
- Go to the Azure portal and search for "App Configuration."
- Create a new resource and name it.

![Azure Portal App Configuration](/images/blog/posts/feature-flags-in-dotnet-with-azure-feature-management/azure-portal-app-configuration.png)

2. Enable Azure Feature Management:
- In the resource settings, enable Feature Manager.
- Add your desired feature flags, e.g., FeatureX.
![Azure Portal Feature Management](/images/blog/posts/feature-flags-in-dotnet-with-azure-feature-management/azure-portal-feature-management.png)

Configure .NET 8 Application
1. Install Required NuGet Packages
Run the following commands to add Azure App Configuration and feature management dependencies:

```csharp
dotnet add package Microsoft.FeatureManagement.AspNetCore
dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
```

2. Modify Program.cs

Add Azure App Configuration to your application configuration:

```csharp
using Microsoft.FeatureManagement;

var builder = WebApplication.CreateBuilder(args);

// Add Azure App Configuration
builder.Configuration.AddAzureAppConfiguration(options =>
    options.Connect("<Your Connection String>")
           .UseFeatureFlags());

// Add Feature Management services
builder.Services.AddFeatureManagement();

var app = builder.Build();

// Use Feature Management middleware
app.UseAzureAppConfiguration();
app.MapGet("/", async context =>
{
    var featureManager = context.RequestServices.GetRequiredService<IFeatureManager>();

    if (await featureManager.IsEnabledAsync("FeatureX"))
    {
        await context.Response.WriteAsync("FeatureX is enabled!");
    }
    else
    {
        await context.Response.WriteAsync("FeatureX is disabled.");
    }
});

app.Run();
```

3. Run and Test
- Start your application and test the feature toggling:
- Toggle FeatureX on/off from the Azure portal.
- Observe changes in real-time without redeployment.

## Sample Use Case: Dark Mode Toggle

Let’s implement a Dark Mode toggle:

- Add a new feature flag DarkMode in Azure Feature Manager.
- Use IFeatureManager in your Razor page to check the feature:

```csharp
@inject IFeatureManager FeatureManager

@if (await FeatureManager.IsEnabledAsync("DarkMode"))
{
    <link href="dark-theme.css" rel="stylesheet" />
}
else
{
    <link href="light-theme.css" rel="stylesheet" />
}
```
- Toggle DarkMode from Azure and verify the styling updates dynamically.
## Best Practices - Refactored code
Define a service to encapsulate the feature management logic. This allows you to reuse it across multiple parts of your application.

```csharp
using System.Threading.Tasks;

public interface IFeatureToggleService
{
    Task<bool> IsFeatureEnabledAsync(string featureName);
}
```
Implementation:

```csharp
using Microsoft.FeatureManagement;

public class FeatureToggleService : IFeatureToggleService
{
    private readonly IFeatureManager _featureManager;

    public FeatureToggleService(IFeatureManager featureManager)
    {
        _featureManager = featureManager;
    }

    public async Task<bool> IsFeatureEnabledAsync(string featureName)
    {
        return await _featureManager.IsEnabledAsync(featureName);
    }
}
```
Modify the Program.cs to register the service with the dependency injection container.

```csharp
builder.Services.AddSingleton<IFeatureToggleService, FeatureToggleService>();
```

## Simple use case - Using in service

```csharp
public class MyBusinessService
{
    private readonly IFeatureToggleService _featureToggleService;

    public MyBusinessService(IFeatureToggleService featureToggleService)
    {
        _featureToggleService = featureToggleService;
    }

    public async Task<string> GetFeatureDependentMessageAsync()
    {
        //Note: Move magic string "FeatureX" in some constant.
        if (await _featureToggleService.IsFeatureEnabledAsync("FeatureX"))
        {
            return "FeatureX is enabled! Business logic for enabled feature.";
        }
        else
        {
            return "FeatureX is disabled. Business logic for disabled feature.";
        }
    }
}
```

## Benefits of This Approach

Separation of Concerns:
- The feature toggle logic is encapsulated in a dedicated service (FeatureToggleService).
- Business logic resides in MyBusinessService.

Reusability:
- IFeatureToggleService can be reused across different parts of the application.

Testability:
- The feature toggle logic and business logic can be unit-tested independently by mocking IFeatureToggleService.

Readability:
- The code is cleaner and more modular.

## Unit Testing Example

```csharp
using Moq;
using Xunit;

public class FeatureToggleServiceTests
{
    [Fact]
    public async Task IsFeatureEnabledAsync_Returns_True_When_Feature_Is_Enabled()
    {
        // Arrange
        var featureManagerMock = new Mock<IFeatureManager>();
        featureManagerMock.Setup(fm => fm.IsEnabledAsync("FeatureX")).ReturnsAsync(true);

        var service = new FeatureToggleService(featureManagerMock.Object);

        // Act
        var result = await service.IsFeatureEnabledAsync("FeatureX");

        // Assert
        Assert.True(result);
    }
}
```

## Wrapping Up
Azure Feature Management is a game-changer for implementing feature flags in .NET applications. 

It addresses the limitations of basic configurations like appsettings.json and provides a robust, scalable solution. With dynamic updates, advanced targeting, and seamless Azure integration, you can confidently manage feature rollouts, A/B testing, and hotfixes.

### Key Takeaways:

1. Feature flags improve agility and reduce deployment risks.
2. Azure Feature Management simplifies managing feature flags in real-time.
3. With .NET 8, implementing feature flags is easier and more powerful than ever.

That's all from me today. 

See ya on the next Monday coffee. 
<!--END-->



