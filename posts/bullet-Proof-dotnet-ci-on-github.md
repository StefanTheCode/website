---
title: "Bullet-Proof .NET CI on GitHub"
subtitle: "Bullet-Proof .NET CI on GitHub – Enforce Build Rules, dotnet format, and Roslyn Analyzers"
date: "November 10 2025"
category: ".NET"
meta_description: "Learn how to make your .NET CI fail fast when code style or analyzer rules are broken. Step-by-step example repo with dotnet format, Roslyn analyzers, and GitHub Actions."
---

<!--START-->
&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  

##### Imagine this:
&nbsp;  
 
##### You’re reviewing a pull request and realize 40 files were changed… just because someone’s Visual Studio auto-formatter is configured differently.
##### Or maybe you merge a branch and suddenly dozens of warnings pop up in the build.
##### Or someone pushed code with tabs instead of spaces, different brace styles, or ignored analyzer hints.
&nbsp;  

##### Sound familiar?
&nbsp;  
 
##### We can fix all of that **by making our CI pipeline the single source of truth** for style and quality.
&nbsp;  

##### Our CI should *not only build and test code*, but also ensure:
&nbsp;  
 
##### ✅ Every line follows the same style rules
##### ✅ Code passes all Roslyn analyzer checks
##### ✅ No formatting differences sneak in
##### ✅ Developers see consistent results locally and in CI
&nbsp;  
 
##### That’s exactly what we’ll build here - a simple GitHub repo that *fails a pull request* if any of those rules are broken.

&nbsp;  
&nbsp;  
### Step 1 - Setting up the playground  
&nbsp;  
&nbsp;  

##### Let’s start from scratch:

```csharp

mkdir dotnet-ci-hardening-demo
cd dotnet-ci-hardening-demo
git init
dotnet new sln -n Acme
dotnet new classlib -n Acme.Calculator
dotnet sln Acme.sln add Acme.Calculator/Acme.Calculator.csproj
```

##### This gives us a clean repo with one small class library.
&nbsp;  
##### Now we’ll add build rules that enforce analyzer and formatting policies everywhere - locally and in CI.   

&nbsp;  
&nbsp;  
### Step 2 - Locking down build rules with Directory.Build.props
&nbsp;  
&nbsp;  

##### This file lives at the root of your repo. It automatically applies to every project underneath it.
&nbsp;  
##### Think of it as your global .editorconfig for MSBuild.
&nbsp;  
##### **Directory.Build.props:**

```csharp

<!-- Directory.Build.props -->
<Project>
  <PropertyGroup>
    <!-- Enable analyzers and modern analysis level -->
    <EnableNETAnalyzers>true</EnableNETAnalyzers>
    <AnalysisLevel>latest</AnalysisLevel>

    <!-- Make style warnings fail the build -->
    <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>

    <!-- For deterministic builds -->
    <ContinuousIntegrationBuild>true</ContinuousIntegrationBuild>
    <Deterministic>true</Deterministic>
    <DebugType>portable</DebugType>
  </PropertyGroup>

  <!-- Ignore a few less important warnings -->
  <PropertyGroup>
    <WarningsNotAsErrors>$(WarningsNotAsErrors);CS1591</WarningsNotAsErrors>
  </PropertyGroup>

  <!-- Add more analyzers -->
  <ItemGroup>
    <PackageReference Include="StyleCop.Analyzers" Version="1.2.0-beta.556" PrivateAssets="All" />
    <PackageReference Include="Roslynator.Analyzers" Version="4.12.4" PrivateAssets="All" />
  </ItemGroup>
</Project>
```
##### What’s happening here?  
&nbsp;  

##### • **EnableNETAnalyzers** - turns on Microsoft’s built-in analyzer set (performance, naming, etc.) 
##### • **AnalysisLevel=latest** - uses the latest rules for your .NET SDK version
##### • **EnforceCodeStyleInBuild** - actually respects your .editorconfig during the build
##### • **TreatWarningsAsErrors** - no more “I’ll fix that later” excuses
##### •** Extra analyzer packages** - StyleCop and Roslynator add hundreds of best-practice rules
&nbsp;  
##### From this point, every build will fail if a warning is raised.
##### Let’s make sure those warnings are defined clearly next.

&nbsp;  
&nbsp;  
### Step 3 - Defining your style rules (.editorconfig)  
&nbsp;  
&nbsp;  

##### **Before:** branch explosion
&nbsp;  

##### Your .editorconfig is the contract for code style.
&nbsp;  

##### Every developer (and the CI) will follow it exactly.
 
##### **.editorconfig:**

```csharp

root = true

[*.cs]
charset = utf-8
indent_style = space
indent_size = 4
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

# Usings and ordering
dotnet_sort_system_directives_first = true:warning
dotnet_separate_import_directive_groups = true:warning

# Qualification rules
dotnet_style_qualification_for_field = false:warning
dotnet_style_qualification_for_property = false:warning
dotnet_style_qualification_for_method = false:warning

# Analyzer examples
dotnet_diagnostic.IDE0005.severity = warning   # Remove unused usings
dotnet_diagnostic.SA1200.severity = warning    # Using placement
dotnet_diagnostic.RCS1213.severity = warning   # Remove unused members

# Optional: relax doc comment warnings
dotnet_diagnostic.CS1591.severity = none

# Disable StyleCop file header & XML comment rules
dotnet_diagnostic.SA1633.severity = none   # File must have a header
dotnet_diagnostic.SA1636.severity = none   # Header text must match
dotnet_diagnostic.SA1638.severity = none   # File header must include filename
dotnet_diagnostic.SA0001.severity = none   # Disable XML comment analysis warning
dotnet_diagnostic.CS1591.severity = none   # Ignore "missing XML comment" warnings
dotnet_diagnostic.IDE0005.severity = none
```

##### **Why this matters**
&nbsp;  
 
##### When EnforceCodeStyleInBuild=true, these rules become part of your build.
&nbsp;  

##### You can fine-tune severity levels (suggestion, warning, error), and CI will honor them.

&nbsp;  
&nbsp;  
### Step 4 - Push this to the main branch
&nbsp;  
&nbsp;  

##### When you push to the main branch on GitHub, next to the name of the commit, the pipeline icon will be displayed, from which we will find out whether the pipeline passed or failed.
&nbsp;  

##### Check [the main branch here](https://github.com/StefanTheCode/Dotnet-CI).

![Main Branch](/images/blog/posts/bullet-Proof-dotnet-ci-on-github/main-branch.png)
&nbsp;  

##### If we go into details, we will see all the processes that happened in that pipeline, where we can see more details for each one.

![Pipeline Details](/images/blog/posts/bullet-Proof-dotnet-ci-on-github/pipeline-details.png)

&nbsp;  
&nbsp;  
### Step 5 - Add intentionally bad code(to prove it works)  
&nbsp;  
&nbsp;  

##### Let’s create a class that violates multiple rules.
&nbsp;  
##### **Acme.Calculator/Calculator.cs**

```csharp

// Client picks columns: "CustomerID,Name,Country"
using System; // unused
using System.Threading.Tasks; // unused

namespace Acme.Calculator
{
    public class Calculator
    {
        public int Add(int a,int b){  return a + b; } // bad spacing + analyzer warnings
    }
}
```
##### If you run:

```csharp

dotnet build -c Release /warnaserror
```
##### You’ll probably get warnings turned into errors. 

![Build errors](/images/blog/posts/bullet-Proof-dotnet-ci-on-github/build-errors.png)
&nbsp;  

##### And if you run:

```csharp

dotnet format --verify-no-changes
```
##### You’ll get: **Formatting differences were found. Run 'dotnet format' to fix them.**
&nbsp;  

##### Perfect - that’s exactly what we want!
&nbsp;  

##### Now let’s make CI do the same check automatically.

&nbsp;  
&nbsp;  
###  Step 5 - GitHub Actions: Automate your standards  
&nbsp;  
&nbsp;  

##### Here’s the real magic.
&nbsp;  

##### This workflow will fail your PR if analyzers or formatting are off.
&nbsp;  
 
##### **.github/workflows/ci.yml:**
```csharp

name: CI
on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  build-test-format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 9.0.x

      - name: Cache NuGet
        uses: actions/cache@v4
        with:
          path: ~/.nuget/packages
          key: nuget-${ { runner.os } }-${ { hashFiles('**/*.csproj') } }
          restore-keys: nuget-${ { runner.os } }-

      - name: Restore
        run: dotnet restore

      - name: Build (warnings as errors)
        run: dotnet build --no-restore -c Release /warnaserror

      - name: Format (verify)
        run: dotnet format --no-restore --verify-no-changes
```

##### Explanation 
&nbsp;  
##### • **dotnet build /warnaserror** - fails if any analyzer or code-style warning occurs
##### • **dotnet format --verify-no-changes** - fails if code isn’t properly formatted
##### • **actions/cache** - speeds up builds by caching your NuGet packages
##### • **actions/setup-dotnet** - installs the SDK version you specify 
&nbsp;  
##### Now every pull request runs these checks automatically.  

&nbsp;  
&nbsp;  
### Step 6 - Open a PR and watch it fail  
&nbsp;  
&nbsp;  

##### Push your branch with the bad code:
```csharp

git checkout -b feature/failing-pr
git add .
git commit -m "add intentionally bad formatting"
git push -u origin feature/failing-pr
```
##### Open a pull request on GitHub. You’ll see red ❌ status checks.
&nbsp;  
##### GitHub will annotate your PR inline with messages like:
```csharp

IDE0005: Using directive is unnecessary.
SA1200: Using directives must be placed outside the namespace.
```
##### This is CI doing code review for you.
##### No more *“Please fix spacing”* comments from teammates.

![Failing PR](/images/blog/posts/bullet-Proof-dotnet-ci-on-github/failing-pr.png)
&nbsp;  

##### And if you check the details:
![Failing PR](/images/blog/posts/bullet-Proof-dotnet-ci-on-github/failing-pr-details.png)

&nbsp;  
&nbsp;  
### Step 7 - Fix and make it green  
&nbsp;  
&nbsp;  

##### Now fix the class:
&nbsp;  
##### **Calculator.cs:**
```csharp

namespace Acme.Calculator
{
    public static class Calculator
    {
        public static int Add(int a, int b)
        {
            return a + b;
        }
    }
}
```
##### Commit and push again:
```csharp

git add .
git commit -m "fix: clean code formatting and remove unused usings"
git push
```
##### Re-run CI → everything turns green ✅
&nbsp;  
##### That’s your happy path: style, analyzers, and format all clean. 

![Passed pipeline](/images/blog/posts/bullet-Proof-dotnet-ci-on-github/passed-pipeline.png)

&nbsp;  
&nbsp;  
### Bonus: Add a simple test (optional but realistic) 
&nbsp;  
&nbsp;

##### A quick test project helps validate the whole pipeline:

```csharp

dotnet new xunit -n Acme.Calculator.Tests
dotnet sln add Acme.Calculator.Tests/Acme.Calculator.Tests.csproj
dotnet add Acme.Calculator.Tests reference Acme.Calculator
```

##### **Acme.Calculator.Tests/CalculatorTests.cs: **
```csharp

namespace Acme.Calculator.Tests
{
    /// <summary>
    /// Calculator Tests.
    /// </summary>
    public class CalculatorTests
    {
        /// <summary>
        /// Add tests.
        /// </summary>
        [Fact]
        public void Add_ReturnsSum()
        {
            int result = Calculator.Add(2, 3);
            Assert.Equal(5, result);
        }
    }
}
```
##### Add a new step to CI before formatting:

```csharp

   - name: Test
     run: dotnet test --no-build -c Release
```

##### After pushing to the branch, you will see new pipeline job "Test":

![Pipeline test](/images/blog/posts/bullet-Proof-dotnet-ci-on-github/pipeline-test.png)

&nbsp;  
&nbsp;  
### Bonus 2: Protect your main branch
&nbsp;  
&nbsp;  

##### Go to your GitHub repo settings → Branches → Branch protection rules.
&nbsp;  

##### Add a rule for main:
&nbsp;  
 
##### ✅ Require status checks to pass before merging
##### ✅ Select the workflow named CI
&nbsp;  
##### This ensures that no code can be merged unless it’s clean, tested, and formatted.

&nbsp;  
&nbsp;  
### Conclusion 
&nbsp;  
&nbsp;  

##### You’ve just built a **bullet-proof CI pipeline** for your .NET projects - one that doesn’t just build and test code, but **actively enforces quality**.
&nbsp;  

##### By the end of this walkthrough, you’ll have seen how to:
&nbsp;  
 
##### • ✅ Use Directory.Build.props to centralize analyzer and build rules
##### • ✅ Define a consistent style with .editorconfig
##### • ✅ Automate checks with dotnet format --verify-no-changes
##### • ✅ Catch real issues early using Roslyn and StyleCop analyzers
##### • ✅ Keep GitHub Actions as your single source of truth for code quality
&nbsp;  

##### Most importantly, you’ve learned how to **tune these rules to your team’s needs** - turning off noisy documentation analyzers and keeping only what truly matters: readable, maintainable, and consistent code.
&nbsp;  
 
##### Every pull request now gets a free, automated code review.
&nbsp;  

##### No more style debates, no more “forgot to run formatter,” inconsistent builds between developers.
&nbsp;  

##### Your CI does the hard work - and your team ships cleaner code with confidence.
&nbsp;  
 
##### So the next time you push a branch, remember:
&nbsp;  
 
##### ✅ If it builds clean and formats perfectly on CI, it’s ready for main.
&nbsp;  

##### Check the [source code here](https://github.com/StefanTheCode/Dotnet-CI).
&nbsp;  

##### That's all from me for today. 
<!--END-->
