---
title: "Feature Flags in .NET 8 with Azure Feature Management"
subtitle: "While convenient, this approach can pose security risks if not handled properly. 
Azure Key Vault offers a secure, managed solution for secret storage, allowing us to keep sensitive data out of local files and within a secure cloud environment."
readTime: "Read Time: 4 minutes"
date: "Nov 18 2024"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Learn how to securely manage and access secrets in .NET 8 applications using Azure Key Vault. This guide covers best practices for storing sensitive data, setting up Key Vault, and integrating it with .NET for secure and scalable applications."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • Accelerate your .NET web app development with [ABP](https://abp.io/?utm_source=newsletter&utm_medium=affiliate&utm_campaign=stefandjokic_bf24)! Access framework’s robust modules, architecture templates and full-stack features - Black Friday prices start on 25th November so stay tuned!
##### [Stay tuned!](https://abp.io/?utm_source=newsletter&utm_medium=affiliate&utm_campaign=stefandjokic_bf24)
&nbsp;  
##### • Unlock [Postman's latest features](https://community.postman.com/t/the-postman-drop-october-edition/70044?utm_medium=social_sharing&utm_source=newsletter&utm_content=Stefan_Djokic) for seamless API management! Now with a centralized variable experience and secure secret storage via Postman Vault, your team can streamline workflows and safeguard sensitive data effortlessly.
##### [Learn more](https://community.postman.com/t/the-postman-drop-october-edition/70044?utm_medium=social_sharing&utm_source=newsletter&utm_content=Stefan_Djokic).

<!--START-->

&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp; 
##### In today’s dynamic software landscape, agility and controlled releases are paramount. 
&nbsp; 
##### **Feature Flags are** one of the most powerful techniques to achieve this, **enabling developers to toggle features on or off without deploying new code. **
&nbsp; 
##### Let’s dive into how .NET 8 and Azure Feature Management make feature flags seamless, efficient, and production-ready.

&nbsp; 
&nbsp;
### Why Use Azure Feature Management?
&nbsp; 
&nbsp; 

##### Azure Feature Management provides a centralized, scalable, and cloud-native approach to managing feature flags.
&nbsp; 
 
##### Here's why it stands out compared to basic configurations like appsettings.json:
&nbsp; 

##### **Problems with Basic Configuration in appsettings.json**
&nbsp; 

##### **Lack of Centralization:** Managing feature flags across environments (dev, staging, production) becomes cumbersome as each environment requires manual updates.
##### **Deployment Coupling:** Changing a flag in appsettings.json requires redeployment, which defeats the purpose of feature toggling.
##### **Limited Targeting:** No built-in support for audience targeting or percentage rollouts.
&nbsp; 

##### **Why Azure Feature Management Is Better**
&nbsp; 

##### **Centralized Configuration:** Store, update, and manage feature flags from the Azure portal or via APIs.
##### **Dynamic Updates: ** Change feature flags without redeploying the application.
##### **Targeting Options:** Use feature filters to target users by region, percentage, or custom rules.
##### **Integration with Azure Pipelines:** Seamlessly manage feature lifecycles in CI/CD workflows.
##### **Scalability:** Perfect for distributed systems and microservices.

&nbsp; 
&nbsp;
### Why Are Feature Flags Important?
&nbsp; 
&nbsp; 

##### Feature flags offer several benefits for modern software development:
&nbsp; 

##### **Controlled Rollouts:**
##### - Enable or disable features for specific user groups.
##### - Gradually roll out features to minimize risk.
&nbsp; 

##### **A/B Testing:**
##### - Experiment with variations of features to optimize user experience.
&nbsp; 

##### **Hotfixes Without Redeployment:**
##### - Instantly disable buggy features without needing a redeployment.
&nbsp; 

##### **Environment-Specific Features:**
##### - Toggle features across environments like development, staging, and production.

&nbsp; 
&nbsp;
### Step-by-Step Implementation
&nbsp; 
&nbsp; 

##### **Set Up Your Azure Feature Manager**
&nbsp; 

##### **1. Create an Azure App Configuration Resource:**
&nbsp; 
##### - Go to the Azure portal and search for "App Configuration."
##### - Create a new resource and name it.

![Azure Portal App Configuration](/images/blog/posts/feature-flags-in-dotnet-with-azure-feature-management/azure-portal-app-configuration.png)

&nbsp; 
##### **2. Enable Azure Feature Management:**
&nbsp; 
##### - In the resource settings, enable Feature Manager.
##### - Add your desired feature flags, e.g., FeatureX.
![Azure Portal Feature Management](/images/blog/posts/feature-flags-in-dotnet-with-azure-feature-management/azure-portal-feature-management.png)

&nbsp; 
##### **Configure .NET 8 Application**
&nbsp; 
##### **1. Install Required NuGet Packages**
&nbsp; 
##### Run the following commands to add Azure App Configuration and feature management dependencies:

```csharp

dotnet add package Microsoft.FeatureManagement.AspNetCore
dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore


```

&nbsp; 

##### **2. Modify Program.cs**
&nbsp; 

##### Add Azure App Configuration to your application configuration:

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


&nbsp; 
##### **3. Run and Test**
&nbsp; 
##### - Start your application and test the feature toggling:
##### - Toggle FeatureX on/off from the Azure portal.
##### - Observe changes in real-time without redeployment.

&nbsp; 
&nbsp;
### Sample Use Case: Dark Mode Toggle
&nbsp; 
&nbsp; 

##### **Let’s implement a Dark Mode toggle:**
&nbsp; 

##### - Add a new feature flag DarkMode in Azure Feature Manager.
##### - Use IFeatureManager in your Razor page to check the feature:

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
&nbsp; 
##### - Toggle DarkMode from Azure and verify the styling updates dynamically.
&nbsp; 
&nbsp; 
### Best Practices - Refactored code
&nbsp; 
&nbsp; 
##### Define a service to encapsulate the feature management logic. This allows you to reuse it across multiple parts of your application.

```csharp

using System.Threading.Tasks;

public interface IFeatureToggleService
{
    Task<bool> IsFeatureEnabledAsync(string featureName);
}

```
&nbsp; 
##### Implementation:


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
&nbsp; 
##### Modify the Program.cs to register the service with the dependency injection container.

```csharp

builder.Services.AddSingleton<IFeatureToggleService, FeatureToggleService>();

```

&nbsp; 
&nbsp; 
### Simple use case - Using in service
&nbsp; 
&nbsp; 

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

&nbsp; 
&nbsp; 
### Benefits of This Approach
&nbsp; 
&nbsp; 

##### **Separation of Concerns:**
##### - The feature toggle logic is encapsulated in a dedicated service (FeatureToggleService).
##### - Business logic resides in MyBusinessService.
&nbsp; 

##### **Reusability:**
##### - IFeatureToggleService can be reused across different parts of the application.
&nbsp; 

##### **Testability:**
##### - The feature toggle logic and business logic can be unit-tested independently by mocking IFeatureToggleService.
&nbsp; 

##### **Readability:**
##### - The code is cleaner and more modular.

&nbsp; 
&nbsp; 
### Unit Testing Example
&nbsp; 
&nbsp; 

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

&nbsp; 
&nbsp; 
### Wrapping Up
&nbsp; 
&nbsp; 
##### Azure Feature Management is a game-changer for implementing feature flags in .NET applications. 
&nbsp; 

##### It addresses the limitations of basic configurations like appsettings.json and provides a robust, scalable solution. With dynamic updates, advanced targeting, and seamless Azure integration, you can confidently manage feature rollouts, A/B testing, and hotfixes.
&nbsp; 

#### Key Takeaways:
&nbsp; 

##### 1. Feature flags improve agility and reduce deployment risks.
##### 2. Azure Feature Management simplifies managing feature flags in real-time.
##### 3. With .NET 8, implementing feature flags is easier and more powerful than ever.
&nbsp; 

##### That's all from me today. 
&nbsp; 

##### See ya on the next Monday coffee. 
<!--END-->