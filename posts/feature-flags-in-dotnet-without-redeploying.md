---
title: "Feature Flags without redeploying: what people usually get wrong in .NET"
subtitle: "If changing a feature flag requires a redeploy, you’re not really doing feature flags."
date: "December 23 2025"
category: ".NET"
readTime: "Read Time: 4 minutes"
meta_description: "Learn how to use Feature Flags in .NET to enable or disable features at runtime without redeploying your application. Includes a real production-ready example with Azure App Configuration, caching, and multi-instance support."
---

<!--START-->
This issue is made possible thanks to JetBrains, who help keep this newsletter free for everyone. A huge shout-out to them for their support of our community. Let's thank them by entering the link below.
Struggling with slow builds, tricky bugs, or hard-to-understand performance issues?
[dotUltimate](https://www.jetbrains.com/dotnet/?utm_source=newsletter_the_code_man&utm_medium=cpc&utm_campaign=dul_promo) fixes all of that.
It’s the all-in-one toolbox for serious .NET developers.
[👉 Upgrade your .NET workflow.](https://www.jetbrains.com/dotnet/?utm_source=newsletter_the_code_man&utm_medium=cpc&utm_campaign=dul_promo)

## Introduction

How do you enable or disable features without redeploying the app?
 
If your first thought is “I’ll just flip a value in [appsettings](https://thecodeman.net/posts/live-loading-appsettings-configuration-file).json” - you’re not alone.
But that’s also where most Feature Flag implementations quietly fail.
 
In the last few days, I shared a short post about Feature Flags in .NET, and the comments were exciting.

They all circled the same confusion:

*Do we really avoid redeployment?*
*How does this work with multiple instances?*
*Is appsettings.json enough?*
*Do I still need to run a DevOps release?* 
 
Let’s clear this up - with real code that actually works.
## First: What “Without Redeploying” Actually Means

Let’s be very explicit.
 
**“Without redeploying”** means: 

❌ no build
❌ no release pipeline
❌ no app restart
❌ no new container image
✅ behavior changes while the app is running 
 
If changing a feature flag requires you to click **'Deploy'**, then you haven’t decoupled deployment from release - you've just moved the toggle.
  
## Why appsettings.json Is NOT Enough

Yes, you can define feature flags in appsettings.json.

```csharp

{
  "FeatureManagement": {
    "BetaFeature": true
  }
}
```

But here’s the problem:
1. appsettings.json is read **at startup**
2. each instance has its **own copy**
3. any change requires:
• file change
• restart
• redeploy
So this works for:
• local development
• demos
• small experiments

But it **does not work** for:
• multiple instances
• Kubernetes
• Azure App Service
• real production traffic 

To truly avoid redeployment, **feature flags must live outside the application.**

## The Correct Architecture  

Feature Flags must be:
• centrally stored
• shared across instances
• read at runtime
• refreshable without a restart
In .NET, this is exactly what **Azure App Configuration + Feature Management** gives us.
Let’s build this properly.

## Step 1: Install Required Packages

These give us:
• Feature Flags API
• Azure App Configuration integration
• runtime refresh support

```csharp

dotnet add package Microsoft.FeatureManagement.AspNetCore
dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
```
## Step 2: Configure Azure App Configuration 

In **Azure Portal**:
1. Create **Azure App Configuration**
2. Go to **Feature Manager**
3. Create a feature flag:
• Name: BetaFeature
• Enabled: false
You now have a central switch.
Read [the full tutorial about Feature Manager Azure App Configuration](https://thecodeman.net/posts/feature-flags-in-dotnet-with-azure-feature-management). 

## Step 3: Add Connection String

In appsettings.json:

```csharp

{
  "AzureAppConfig": {
    "ConnectionString": "<YOUR_CONNECTION_STRING>"
  }
}
```
In real projects, this belongs in Key Vault or environment variables.

## Step 4: Configure Program.cs

This is the part most examples skip or oversimplify.

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

## Step 5: (Optional but Recommended) Sentinel Key

In Azure App Configuration:
 
Create a **key-value** pair:
• Key: FeatureFlags:Sentinel
• Value: any string (e.g. timestamp)

Whenever you update this value:
• **all feature flags refresh**
• no restart
• no redeploy

## Step 6: See It in Action 

Run the app and call **GET /beta**  → ❌ disabled
Enable **BetaFeature** in the Azure Portal
Wait ~10 seconds
Call **/beta** again → 🚀 enabled

No redeploy. No restart. No pipeline.

## Important Production Gotcha: Caching 

Azure App Configuration **does cache values**.

If you don’t configure refresh:
• changes may take minutes
• developers think “it doesn’t work”

That’s why:
• CacheExpirationInterval
• sentinel keys
• refresh middleware 

**matter a lot**.
 
This is where most “Feature Flags don’t work” stories come from.

## What About Multiple Instances? 

This setup works perfectly with:
• multiple app instances
• load balancers
• Kubernetes
• App Service scaling
Because:
• flags are centralized
• decision logic is deterministic
• instances are stateless 
The feature decision **does not depend on the instance**.

## 3rd-Party Feature Flag Providers

Azure App Configuration is great if you’re already on Azure.
 
Other solid options:
• **LaunchDarkly** - enterprise-grade
• **Unleash** - open-source & self-hosted
• **Flagsmith** - SaaS or self-hosted 

The provider matters less than the **runtime architecture**.

## When Feature Flags Become a Problem 

Feature Flags are powerful - but dangerous if abused:
• flags that live for years
• nested if statements everywhere
• “temporary” flags that never die
Best practice:
• flags should have an owner
• flags should have a removal date
• flags should not replace versioning

## Wrapping Up 

Feature Flags are not about hiding code paths.
 
hey are about decoupling deployment from release.
 
If flipping a flag requires a redeploy, you didn’t gain flexibility - you added complexity.
  
If you want a deeper dive, I’ve already written a full article on Feature Flags in .NET with [Azure Feature Management here](https://thecodeman.net/posts/feature-flags-in-dotnet-with-azure-feature-management). 
 
More real-world .NET architecture topics coming soon 🚀
That's all from me for today. 
<!--END-->

