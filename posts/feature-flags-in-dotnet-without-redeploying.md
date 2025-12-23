---
title: "Feature Flags without redeploying: what people usually get wrong in .NET"
subtitle: "If changing a feature flag requires a redeploy, you’re not really doing feature flags."
date: "December 23 2025"
category: ".NET"
meta_description: "Learn how to use Feature Flags in .NET to enable or disable features at runtime without redeploying your application. Includes a real production-ready example with Azure App Configuration, caching, and multi-instance support."
---

<!--START-->
##### This issue is made possible thanks to JetBrains, who help keep this newsletter free for everyone. A huge shout-out to them for their support of our community. Let's thank them by entering the link below.
&nbsp;  
##### Struggling with slow builds, tricky bugs, or hard-to-understand performance issues?
##### [dotUltimate](https://www.jetbrains.com/dotnet/?utm_source=newsletter_the_code_man&utm_medium=cpc&utm_campaign=dul_promo) fixes all of that.
##### It’s the all-in-one toolbox for serious .NET developers.
&nbsp;  
##### [👉 Upgrade your .NET workflow.](https://www.jetbrains.com/dotnet/?utm_source=newsletter_the_code_man&utm_medium=cpc&utm_campaign=dul_promo)
&nbsp;

&nbsp;  
&nbsp;  
### Introduction
&nbsp;  
&nbsp;  

##### **How do you enable or disable features without redeploying the app?**
&nbsp;  
 
##### If your first thought is “I’ll just flip a value in appsettings.json” - you’re not alone.
##### But that’s also where most Feature Flag implementations quietly fail.
&nbsp;  
 
##### In the last few days, I shared a short post about Feature Flags in .NET, and the comments were exciting.
&nbsp;  

##### They all circled the same confusion:
&nbsp;  

##### *Do we really avoid redeployment?*
##### *How does this work with multiple instances?*
##### *Is appsettings.json enough?*
##### *Do I still need to run a DevOps release?* 
&nbsp;  
 
##### Let’s clear this up - with real code that actually works.
&nbsp;  
&nbsp;  
### First: What “Without Redeploying” Actually Means
&nbsp;  
&nbsp;

##### Let’s be very explicit.
&nbsp;
 
##### **“Without redeploying”** means: 
&nbsp;

##### ❌ no build
##### ❌ no release pipeline
##### ❌ no app restart
##### ❌ no new container image
##### ✅ behavior changes while the app is running 
&nbsp;
 
##### If changing a feature flag requires you to click **'Deploy'**, then you haven’t decoupled deployment from release - you've just moved the toggle.
&nbsp;
  
&nbsp;  
&nbsp;  
### Why appsettings.json Is NOT Enough
&nbsp;  
&nbsp;  

##### Yes, you can define feature flags in appsettings.json.

```csharp

{
  "FeatureManagement": {
    "BetaFeature": true
  }
}
```

##### But here’s the problem:
##### 1. appsettings.json is read **at startup**
##### 2. each instance has its **own copy**
##### 3. any change requires:
##### • file change
##### • restart
##### • redeploy
&nbsp;  
##### So this works for:
##### • local development
##### • demos
##### • small experiments
&nbsp;  

##### But it **does not work** for:
&nbsp;  
##### • multiple instances
##### • Kubernetes
##### • Azure App Service
##### • real production traffic 
&nbsp;  

##### To truly avoid redeployment, **feature flags must live outside the application.**

&nbsp;  
&nbsp;  
### The Correct Architecture  
&nbsp;  
&nbsp;  

##### Feature Flags must be:
&nbsp;  
##### • centrally stored
##### • shared across instances
##### • read at runtime
##### • refreshable without a restart
##### In .NET, this is exactly what **Azure App Configuration + Feature Management** gives us.
&nbsp;  
##### Let’s build this properly.

&nbsp;  
&nbsp;  
### Step 1: Install Required Packages
&nbsp;  
&nbsp;  

##### These give us:
&nbsp; 
##### • Feature Flags API
##### • Azure App Configuration integration
##### • runtime refresh support
&nbsp; 

```csharp

dotnet add package Microsoft.FeatureManagement.AspNetCore
dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
```
&nbsp;  
&nbsp;  
### Step 2: Configure Azure App Configuration 
&nbsp;  
&nbsp;  

##### In **Azure Portal**:
##### 1. Create **Azure App Configuration**
##### 2. Go to **Feature Manager**
##### 3. Create a feature flag:
##### • Name: BetaFeature
##### • Enabled: false
&nbsp;  
##### You now have a central switch.
&nbsp;  
##### Read [the full tutorial about Feature Manager Azure App Configuration](https://thecodeman.net/posts/feature-flags-in-dotnet-with-azure-feature-management). 

&nbsp;  
&nbsp;  
### Step 3: Add Connection String
&nbsp;  
&nbsp;  

##### In appsettings.json:

```csharp

{
  "AzureAppConfig": {
    "ConnectionString": "<YOUR_CONNECTION_STRING>"
  }
}
```
##### In real projects, this belongs in Key Vault or environment variables.

&nbsp;  
&nbsp;  
### Step 4: Configure Program.cs
&nbsp;  
&nbsp;

##### This is the part most examples skip or oversimplify.

```csharp

using Microsoft.FeatureManagement;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;

var builder = WebApplication.CreateBuilder(args);

// 1. Connect to Azure App Configuration
builder.Host.ConfigureAppConfiguration(config =>
{
    var settings = config.Build();
    config.AddAzureAppConfiguration(options =>
    {
        options
            .Connect(settings["AzureAppConfig:ConnectionString"])
            // Register feature flags
            .UseFeatureFlags(featureOptions =>
            {
                featureOptions.CacheExpirationInterval =
                    TimeSpan.FromSeconds(10);
            })
            // Register refresh with a sentinel key
            .ConfigureRefresh(refresh =>
            {
                refresh
                    .Register("FeatureFlags:Sentinel", true)
                    .SetCacheExpiration(
                        TimeSpan.FromSeconds(10));
            });
    });
});

// 2. Add Feature Management
builder.Services.AddFeatureManagement();

// 3. Add Azure App Config refresh middleware
builder.Services.AddAzureAppConfiguration();

var app = builder.Build();

// Enable refresh middleware
app.UseAzureAppConfiguration();

app.MapGet("/", () =>
    "Feature Flags Demo is running");

// Feature-gated endpoint
app.MapGet("/beta", async (IFeatureManager featureManager) =>
{
    if (await featureManager.IsEnabledAsync("BetaFeature"))
    {
        return Results.Ok("Beta feature is ENABLED");
    }

    return Results.Ok("Beta feature is DISABLED");
});

app.Run();
```

&nbsp;  
&nbsp;  
### Step 5: (Optional but Recommended) Sentinel Key
&nbsp;  
&nbsp;  

##### In Azure App Configuration:
&nbsp;  
 
##### Create a **key-value** pair:
##### • Key: FeatureFlags:Sentinel
##### • Value: any string (e.g. timestamp)
&nbsp;  

##### Whenever you update this value:
##### • **all feature flags refresh**
##### • no restart
##### • no redeploy

&nbsp;  
&nbsp;  
### Step 6: See It in Action 
&nbsp;  
&nbsp;

##### Run the app and call **GET /beta**  → ❌ disabled
##### Enable **BetaFeature** in the Azure Portal
##### Wait ~10 seconds
##### Call **/beta** again → 🚀 enabled

##### **No redeploy. No restart. No pipeline.**

&nbsp;  
&nbsp;  
### Important Production Gotcha: Caching 
&nbsp;  
&nbsp;

##### Azure App Configuration **does cache values**.
&nbsp;

##### If you don’t configure refresh:
##### • changes may take minutes
##### • developers think “it doesn’t work”
&nbsp;

##### That’s why:
##### • CacheExpirationInterval
##### • sentinel keys
##### • refresh middleware 
&nbsp;

##### **matter a lot**.
&nbsp;
 
##### This is where most “Feature Flags don’t work” stories come from.

&nbsp;  
&nbsp;  
### What About Multiple Instances? 
&nbsp;  
&nbsp;  

##### This setup works perfectly with:
##### • multiple app instances
##### • load balancers
##### • Kubernetes
##### • App Service scaling
&nbsp;  
##### Because:
##### • flags are centralized
##### • decision logic is deterministic
##### • instances are stateless 
&nbsp;  
##### The feature decision **does not depend on the instance**.

&nbsp;  
&nbsp;  
### 3rd-Party Feature Flag Providers
&nbsp;  
&nbsp; 


##### Azure App Configuration is great if you’re already on Azure.
&nbsp; 
 
##### Other solid options:
##### • **LaunchDarkly** - enterprise-grade
##### • **Unleash** - open-source & self-hosted
##### • **Flagsmith** - SaaS or self-hosted 
&nbsp; 

##### The provider matters less than the **runtime architecture**.

&nbsp;  
&nbsp;  
### When Feature Flags Become a Problem 
&nbsp;  
&nbsp;


##### Feature Flags are powerful - but dangerous if abused:
##### • flags that live for years
##### • nested if statements everywhere
##### • “temporary” flags that never die
&nbsp;
##### Best practice:
##### • flags should have an owner
##### • flags should have a removal date
##### • flags should not replace versioning

&nbsp;  
&nbsp;  
### Conclusion 
&nbsp;  
&nbsp;  

##### Feature Flags are not about hiding code paths.
&nbsp;
 
##### hey are about decoupling deployment from release.
&nbsp;
 
##### If flipping a flag requires a redeploy, you didn’t gain flexibility - you added complexity.
&nbsp;
  
##### If you want a deeper dive, I’ve already written a full article on Feature Flags in .NET with [Azure Feature Management here](https://thecodeman.net/posts/feature-flags-in-dotnet-with-azure-feature-management). 
&nbsp;
 
##### More real-world .NET architecture topics coming soon 🚀
&nbsp;
##### That's all from me for today. 
<!--END-->