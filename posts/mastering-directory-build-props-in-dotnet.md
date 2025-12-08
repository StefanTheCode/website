---
title: "Mastering Directory.Build.props in .NET"
subtitle: "Mastering Directory.Build.props in .NET: Why You Need It and How to Build It Right"
date: "December 08 2025"
category: ".NET"
meta_description: "Learn how to use Directory.Build.props in .NET to centralize build configuration, clean up your .csproj files, standardize analyzers and code style, and version all projects from a single place—with real-world examples and ready-to-use XML."
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

##### Every .NET developer eventually hits the same wall:
&nbsp;  

##### • 20+ projects in a solution
##### • 20+ copies of the same TargetFramework, Nullable, and LangVersion
##### • 20+ places to flip TreatWarningsAsErrors
##### • 20+ csproj files full of repeated PackageReference and build settings
&nbsp;  

##### You tweak one setting…and then spend the next 15 minutes hunting it down across the solution.
&nbsp;  
 
##### In .NET 9 (and any modern SDK-style project), there’s a better way: **Directory.Build.props**.
&nbsp;  
 
##### With a single file, you can:
&nbsp;  

##### • Define **global build rules** for all projects in a folder tree
##### • Keep each .csproj small and focused
##### • Standardize code style, analyzers, and warnings
##### • Control versioning and metadata for all assemblies from one place
&nbsp;  

##### In this article, we’ll walk through:
&nbsp;  

##### 1. What Directory.Build.props actually is, and how MSBuild discovers it
##### 2. A realistic multi-project solution scenario
##### 3. A step-by-step implementation for .NET 9
##### 4. Advanced patterns: scoped props, versioning, analyzers, and opt-out tricks
##### 5. Gotchas and best practices 
 
&nbsp;  
&nbsp;  
### What is Directory.Build.props? 
&nbsp;  
&nbsp;

##### Directory.Build.props is an **MSBuild file** that MSBuild automatically imports **before** your project file. Any properties and items you define there will be applied to **all projects** in that directory and its subdirectories.
&nbsp;
  
##### The import process works like this:
&nbsp;
 
##### 1. When MSBuild loads a project (e.g. Api.csproj), it first imports Microsoft.Common.props.
##### 2. Microsoft.Common.props then **walks up the directory tree** from the project’s folder, looking for the first Directory.Build.props.
##### 3. When it finds one, it imports it.
##### 4. Anything defined in Directory.Build.props is now available in the project file.
&nbsp;

##### That means:
&nbsp;

##### • Put Directory.Build.props at the **solution root** → every project below will inherit it.
##### • Put another Directory.Build.props in tests/ → test projects can have **extra** settings on top of the root ones.
##### • If you put a **dummy Directory.Build.props** next to an individual project, MSBuild will stop there and won’t keep searching upwards - effectively shielding that project from the upper-level props.
&nbsp;

##### This works the same in .NET 9 as in previous modern SDK versions—the big difference is that .NET 9 projects typically lean even more on analyzers, nullable, and modern build features, which makes centralization even more valuable.

&nbsp;  
&nbsp;  
### A Real-World Scenario: Cleaning Up a .NET 9 Microservices Solution  
&nbsp;  
&nbsp;  

##### Imagine you’re working on a real solution that looks like this:

```csharp

src/
    Api/
        Api.csproj
    Worker/
        Worker.csproj
    Web/
        Web.csproj
tests/
    Api.Tests/
        Api.Tests.csproj
    Worker.Tests/
        Worker.Tests.csproj
    Shared.Testing/
        Shared.Testing.csproj
Directory.Build.props
tests/Directory.Build.props
```

##### Typical problems:
##### • Every project repeats:

```csharp

<TargetFramework>net9.0</TargetFramework>
<Nullable>enable</Nullable>
<ImplicitUsings>enable</ImplicitUsings>
```
 
##### • Every project copies:

```csharp

<TreatWarningsAsErrors>true</TreatWarningsAsErrors>
<AnalysisLevel>latest</AnalysisLevel>
```

##### • All projects share the same company metadata & repository URL.
##### • Test projects repeatedly reference xunit, FluentAssertions, and coverlet.collector.
&nbsp;  
##### If you change TargetFramework from net8.0 to net9.0 or decide to tighten analyzers, you have to change every .csproj manually.
&nbsp;  
##### Let’s fix that with Directory.Build.props.

&nbsp;  
&nbsp;  
### Step 1: Create a Solution-Level Directory.Build.props     
&nbsp;  
&nbsp;  

##### At the solution root, create a file named Directory.Build.props:

```csharp

<Project>
  <!-- Shared configuration for all .NET 9 projects in the repo -->
  <PropertyGroup>

    <!-- Targeting -->
    <TargetFramework>net9.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <LangVersion>latest</LangVersion>

    <!-- Code quality -->
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
    <AnalysisLevel>latest</AnalysisLevel>

    <!-- Assembly metadata -->
    <Company>TheCodeMan</Company>
    <Authors>Stefan Djokic</Authors>
    <RepositoryUrl>https://github.com/thecodeman/your-repo</RepositoryUrl>
    <RepositoryType>git</RepositoryType>

    <!-- Output layout -->
    <AppendTargetFrameworkToOutputPath>false</AppendTargetFrameworkToOutputPath>
    <AppendRuntimeIdentifierToOutputPath>false</AppendRuntimeIdentifierToOutputPath>
    <BaseOutputPath>artifacts\bin\</BaseOutputPath>
    <BaseIntermediateOutputPath>artifacts\obj\</BaseIntermediateOutputPath>

  </PropertyGroup>

  <!-- Packages shared by most projects -->
  <ItemGroup>
    <PackageReference Include="Microsoft.Extensions.Logging.Abstractions" Version="9.0.0" />
    <PackageReference Include="Microsoft.Extensions.Options.ConfigurationExtensions" Version="9.0.0" />
  </ItemGroup>

</Project>
```
#### What this does
&nbsp;  
##### • **Every project now targets net9.0**, uses nullable reference types, implicit usings, and the latest language features.
##### • Code quality is enforced everywhere via TreatWarningsAsErrors and AnalysisLevel.
##### • All binaries end up under artifacts\bin\ and artifacts\obj\ instead of being spread across bin/Debug folders.
##### • Common PackageReferences are no longer duplicated in each project.
&nbsp;
##### Your individual .csproj files can now be tiny:

```csharp

<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <AssemblyName>MyCompany.Api</AssemblyName>
  </PropertyGroup>
</Project>
```
##### Cleaner, easier to review, and harder to misconfigure.
&nbsp;  
##### ***Note:*** For **package management** itself (centralizing versions), you’ll often pair this with Directory.Packages.props in modern .NET. Directory.Build.props is primarily for **build configuration**, not for central package versioning - though it can hold PackageReferences if you need defaults.
&nbsp;  
 
&nbsp;  
&nbsp;  
### Step 2: Add a Test-Specific Directory.Build.props
&nbsp;  
&nbsp;  

##### Now let’s treat tests differently: they often need extra packages and slightly relaxed rules.
&nbsp; 
##### Create tests/Directory.Build.props: 

```csharp

<Project>
  <!-- This file is imported AFTER the root Directory.Build.props for test projects -->

  <PropertyGroup>

    <!-- Optional: tests may not treat all warnings as errors -->
    <TreatWarningsAsErrors>false</TreatWarningsAsErrors>

    <!-- Mark these assemblies as test assemblies -->
    <IsTestProject>true</IsTestProject>

  </PropertyGroup>

  <ItemGroup>

    <!-- Shared test libraries -->
    <PackageReference 
        Include="xunit" 
        Version="2.9.0" />

    <PackageReference 
        Include="xunit.runner.visualstudio" 
        Version="2.8.2" />

    <PackageReference 
        Include="FluentAssertions" 
        Version="6.12.0" />

    <PackageReference 
        Include="coverlet.collector" 
        Version="6.0.0">
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>

  </ItemGroup>

</Project>
```

##### Now:
&nbsp;  
##### • Any project under tests/ automatically gets test packages.
##### • You can slightly relax test projects (e.g., no warnings-as-errors) without affecting production code.
##### • New test projects become trivial to create - almost no build configuration is needed inside the .csproj

&nbsp;  
&nbsp;  
### Step 3: Centralized Versioning with Directory.Build.props 
&nbsp;  
&nbsp;  

##### Another powerful use case is **central assembly versioning**. Instead of repeating version info in each project, you can define it once and push CI metadata through MSBuild properties. 
&nbsp;  
##### Extend the root Directory.Build.props:   

```csharp

<Project>
  <PropertyGroup>

    <!-- Base semantic version for the whole solution -->
    <VersionPrefix>1.4.0</VersionPrefix>

    <!-- Optional manually-set suffix for prereleases -->
    <VersionSuffix>beta</VersionSuffix> 
    <!-- e.g. "", "beta", "rc1" -->

    <!-- Assembly versions -->
    <AssemblyVersion>1.4.0.0</AssemblyVersion>

    <!-- FileVersion may include build number from CI -->
    <FileVersion>1.4.0.$(BuildNumber)</FileVersion>

    <!-- InformationalVersion is what you see in "Product version" and NuGet -->
    <InformationalVersion>$(VersionPrefix)-$(VersionSuffix)+build.$(BuildNumber)</InformationalVersion>

  </PropertyGroup>
</Project>
```

##### In CI (GitHub Actions / Azure DevOps / GitLab), you pass BuildNumber:  

```csharp

dotnet build MySolution.sln /p:BuildNumber=123
```
##### Result:
##### • All projects share consistent versioning.
##### • Changing VersionPrefix once upgrades the whole solution.
##### • You can differentiate between internal Release builds and Deploy builds by controlling the properties passed from CI.

&nbsp;  
&nbsp;  
### Step 4: Enforcing Code Style and Analyzers Centrally
&nbsp;  
&nbsp;  

##### You’re already using .editorconfig (I know you are 😄). But analyzers and build-level enforcement still live in MSBuild.
&nbsp;
##### Directory.Build.props is a perfect place to wire that up:

```csharp

<Project>
  <PropertyGroup>

    <!-- Enforce analyzers globally -->
    <AnalysisLevel>latest</AnalysisLevel>
    <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>

    <!-- Treat all analyzer diagnostics as errors (unless overridden) -->
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>

  </PropertyGroup>

  <ItemGroup>

    <!-- Example analyzer packages -->
    <PackageReference 
        Include="Roslynator.Analyzers" 
        Version="4.12.0" 
        PrivateAssets="all" />

    <PackageReference 
        Include="SerilogAnalyzer" 
        Version="0.15.0" 
        PrivateAssets="all" />

  </ItemGroup>

</Project>
```
##### Now:
&nbsp;
##### • Every project uses the same **analyzer level** and code-style enforcement.
##### • You don’t have to remember to add analyzer packages in each .csproj.
##### • Build breaks if someone violates rules, regardless of their IDE settings - perfect for CI and team consistency.
&nbsp;
##### If a particular project truly needs to relax something, you can still override locally:

```csharp

<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>

    <!-- opt-out from global warnings-as-errors for this project -->
    <TreatWarningsAsErrors>false</TreatWarningsAsErrors>

  </PropertyGroup>
</Project>
```

&nbsp;  
&nbsp;  
### Step 5: Layering and Scoping: Multiple Directory.Build.props Files 
&nbsp;  
&nbsp;

##### You’re not limited to just one props file. MSBuild lets you create a **hierarchy** of Directory.Build.props files, and it will pick the first one it finds while walking up directories from the project location. 
&nbsp;  
##### Common patterns:
&nbsp;  
##### • **Solution root**: core settings for all projects
##### • src/Directory.Build.props: production-only settings and packages
##### • tests/Directory.Build.props: test-only packages and relaxed rules
##### • tools/Directory.Build.props: for small CLI tools that don’t need analyzers or warnings-as-errors
&nbsp;  
##### Example structure:
```csharp

Directory.Build.props         // global defaults
src/Directory.Build.props     // overrides for production code
tests/Directory.Build.props   // overrides for test code
tools/Directory.Build.props   // overrides for tiny internal utilities
```
##### A src/Directory.Build.props might look like:

```csharp

<Project>
  <PropertyGroup>

    <!-- Only for production code -->
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
    <GenerateDocumentationFile>true</GenerateDocumentationFile>

    <NoWarn>CS1591</NoWarn> 
    <!-- but don't require XML docs everywhere -->

  </PropertyGroup>
</Project>
```
##### And if you really need a project not to inherit any root-level props, you can create a dummy local Directory.Build.props in that project folder:

```csharp

<Project>
  <!-- intentionally empty to stop inheritance from parent props -->
</Project>
```

##### This works because MSBuild stops at the first Directory.Build.props it finds when walking upwards from the project’s directory.

&nbsp;  
&nbsp;  
### Directory.Build.props vs Directory.Build.targets
&nbsp;  
&nbsp;  

##### Another file you’ll see mentioned in the docs is Directory.Build.targets. The short version:
&nbsp;  
##### • **Directory.Build.props** - for properties and items, imported early in the build. Great for configuration and metadata.
##### • **Directory.Build.targets** - for targets and custom build actions, imported late in the build. Great for custom build steps (e.g., running a tool after build, generating artifacts, etc.). 
&nbsp;  
##### For this article, we’re focusing on props, but it’s good to keep Directory.Build.targets in mind when you want to centralize “do this after build” logic.

&nbsp;  
&nbsp;  
### Conclusion 
&nbsp;  
&nbsp;  

##### Directory.Build.props is one of those features that quietly solves a lot of pain:
&nbsp;
##### • It keeps your .csproj files short, readable, and focused
##### • It lets you enforce consistent rules across your .NET 9 solution
##### • It centralizes versioning and metadata
##### • It gives you a clean way to differentiate between src/, tests/, and other areas 
&nbsp;

##### Once you adopt it, adding a new project becomes almost trivial - no more copying settings from some “template” project or forgetting to turn on nullable or analyzers.
&nbsp;
 
##### If you’re already battling with a big solution today:
&nbsp;
 
##### 1. Add a Directory.Build.props at the root.
##### 2. Move TargetFramework, Nullable, ImplicitUsings, and analyzer settings into it.
##### 3. Add a tests/Directory.Build.props for common test packages.
##### 4. Clean up your .csproj files until they’re boring again.
&nbsp;
##### Your future self (and your teammates) will thank you.
&nbsp;
##### That's all from me for today. 
<!--END-->