---
title: "Architecture Tests in .NET: Enforce Clean Architecture with NetArchTest"
subtitle: "Learn how to enforce Clean Architecture in .NET using architecture tests. Step-by-step guide with NetArchTest examples to prevent architectural violations in C# projects..."
readTime: "Read Time: 3 minutes"
category: ".NET"
date: "February 17 2026"
meta_description: "Learn how to enforce Clean Architecture in .NET using architecture tests. Step-by-step guide with NetArchTest examples to prevent architectural violations in C# projects."
faq:
  - q: "What are architecture tests in .NET?"
    a: "Architecture tests are automated tests that validate layer boundaries and dependencies."
  - q: "Should architecture tests run in CI?"
    a: "Yes, run them in CI to fail builds on architectural violations."
---

&nbsp;  
&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### Today's issue is sponsored by [Packt](https://www.packtpub.com/).
##### Working with React doesn't have to be complex. **"React 18 Design Patterns and Best Practices"** empowers you to harness React's potential, making your applications flexible, easy to manage, and high-performing. Discover and unravel the dynamic features of React 18 and Node 19. This updated fourth edition equips you with insights into the cutting-edge tools that will elevate your projects. [Book Link](https://packt.link/IxSPS)
&nbsp;  
&nbsp;  
### Introduction: Why Architecture Breaks in .NET Projects
&nbsp;  
&nbsp;  
##### Most teams don’t break their architecture in one dramatic moment.
&nbsp;  

##### They break it one small reference at a time.
&nbsp;  

##### A developer adds a quick dependency.
##### A service references Infrastructure directly.
##### A Controller talks to DbContext.
##### A helper leaks into the wrong layer.
&nbsp;  

##### And suddenly, your **"Clean Architecture"** is just a folder structure.
&nbsp;  

##### If you are working in:

##### • ASP.NET Core APIs
##### • Microservices
##### • Modular Monoliths
##### • Enterprise .NET applications
&nbsp;  

##### You need a way to automatically enforce architecture rules.
&nbsp;  

##### That’s where Architecture Tests in .NET come in.

&nbsp;  
&nbsp;  
### What Are Architecture Tests in .NET?
&nbsp;  
&nbsp;

##### **Architecture tests** in .NET are automated tests that validate architectural rules such as layer boundaries and assembly dependencies.
&nbsp;
##### Architecture tests are automated tests that validate:

##### • Layer dependencies
##### • Namespace boundaries
##### • Naming conventions
##### • Assembly references
##### • Clean Architecture rules
&nbsp;  

##### Instead of relying on code reviews to catch architectural violations, you let tests fail when someone breaks your design.
&nbsp;  

##### In the .NET ecosystem, one of the most powerful tools for this is:
&nbsp;  

##### 👉 NetArchTest

&nbsp;  
&nbsp;  
### Why You Should Use Architecture Tests?
&nbsp;  
&nbsp;

##### Let’s talk real-world scenario.
&nbsp;

##### Imagine this structure:
&nbsp;

##### • MyApp.Domain
##### • MyApp.Application
##### • MyApp.Infrastructure
##### • MyApp.API
&nbsp;

##### Clean Architecture rule:
&nbsp;

##### ***Domain must not depend on Infrastructure.***
&nbsp;

##### But nothing stops a developer from accidentally adding:

```csharp
using MyApp.Infrastructure;
```

##### Now your Domain layer depends on Infrastructure.
&nbsp;  

##### Architecture broken.
&nbsp;  

##### Without architecture tests, you may not even notice this for weeks.
&nbsp;  

##### With architecture tests?
&nbsp;  

##### The build fails immediately.

&nbsp;  
&nbsp;  
### Installing NetArchTest in Your .NET Project
&nbsp;  
&nbsp;

##### Add the NuGet package to your test project:

```
dotnet add package NetArchTest.Rules
```
&nbsp;  

##### Or via Visual Studio Package Manager.
&nbsp;  

##### Now we can start writing automated architecture validation tests.
&nbsp;  

#### Example: Prevent Domain from Depending on Infrastructure
&nbsp;  

##### Let’s enforce this rule:
&nbsp;  

##### ***The Domain layer must not reference Infrastructure.***

```csharp
using NetArchTest.Rules;
using Xunit;

public class ArchitectureTests
{
    [Fact]
    public void Domain_Should_Not_Depend_On_Infrastructure()
    {
        var result = Types
            .InAssembly(typeof(DomainMarker).Assembly)
            .ShouldNot()
            .HaveDependencyOn("MyApp.Infrastructure")
            .GetResult();

        Assert.True(result.IsSuccessful);
    }
}
```

#### Explanation of the Code
&nbsp;  
##### Let’s break this down:

##### • `Types.InAssembly(...)` - Loads all types from the Domain assembly.
##### • `.ShouldNot().HaveDependencyOn(...)` - Defines the architectural rule.
##### • `.GetResult()` - Executes the rule validation.
##### • `Assert.True(result.IsSuccessful)` - Fails the test if any violation is found.
&nbsp;  

##### Now your architecture is enforced automatically.
&nbsp;  

#### Example: Enforce Clean Architecture Layer Rules
&nbsp;  

##### Here’s a more advanced rule:
&nbsp;  

##### ***Application layer must not depend on API layer.***

```csharp
[Fact]
public void Application_Should_Not_Depend_On_API()
{
    var result = Types
        .InAssembly(typeof(ApplicationMarker).Assembly)
        .ShouldNot()
        .HaveDependencyOn("MyApp.API")
        .GetResult();

    Assert.True(result.IsSuccessful);
}
```

##### This ensures:

##### • No accidental circular dependencies
##### • No UI leakage into core logic
##### • Proper separation of concerns

&nbsp;  
&nbsp;  
### Advanced Architecture Testing: Naming Conventions
&nbsp;  
&nbsp;  
##### You can even enforce naming rules.
&nbsp;  
##### Example:
&nbsp;  
##### ***All services must end with "Service".***
```csharp

[Fact]
public void Services_Should_End_With_Service()
{
    var result = Types
        .InAssembly(typeof(ApplicationMarker).Assembly)
        .That()
        .AreClasses()
        .And()
        .HaveNameEndingWith("Service")
        .Should()
        .BePublic()
        .GetResult();

    Assert.True(result.IsSuccessful);
}
```
&nbsp;  
##### This helps keep your project consistent and predictable.
&nbsp;  
#### Real-World Example: Enterprise .NET Project
&nbsp;  
##### In large enterprise systems:
##### • 10+ projects
##### • Multiple teams
##### • Microservices
##### • Shared libraries
&nbsp;  

##### Architecture drift happens constantly.
&nbsp;  

##### When I worked on enterprise systems, we had situations where:
##### • Infrastructure leaked into Domain
##### • DTOs were referenced in Core
##### • Controllers called EF Core directly
&nbsp;  

##### After introducing architecture tests:

##### • Violations were caught immediately
##### • Code reviews became easier
##### • Refactoring was safer
##### • New developers onboarded faster
&nbsp;  

##### Architecture tests became part of CI.
&nbsp;  

##### That’s when architecture stopped being documentation and became enforcement.

&nbsp;  
&nbsp;  
### CI/CD Integration: Automate Architecture Enforcement
&nbsp;  
&nbsp;  

##### The real power comes when you run architecture tests in:

##### • GitHub Actions
##### • Azure DevOps
##### • GitLab CI
##### • Any .NET CI pipeline
&nbsp;  

##### If someone breaks architecture:
&nbsp;  

##### ❌ The pipeline fails.
&nbsp;  

##### Now architecture is not optional.
&nbsp;  

##### It’s enforced.

&nbsp;  
&nbsp;  
### Common Mistakes When Using Architecture Tests
&nbsp;  
&nbsp; 

##### 1. Only testing one rule
##### 2. Not running tests in CI
##### 3. Hardcoding namespace strings incorrectly
##### 4. Forgetting to test new assemblies
##### 5. Treating architecture tests as “nice to have”
&nbsp; 
##### Architecture tests should be part of your default template.

&nbsp;  
&nbsp;  
### When Should You Use Architecture Tests?
&nbsp;  
&nbsp; 

##### Use them if you:

##### • Follow Clean Architecture
##### • Use Onion Architecture
##### • Build Modular Monoliths
##### • Maintain Microservices
##### • Work in large teams
##### • Want to prevent architectural erosion
&nbsp;  
##### If your project has more than 2 layers, you should consider them mandatory.

&nbsp;  
&nbsp;  
### Wrapping Up: Architecture Is a Discipline - Not a Folder Structure
&nbsp;  
&nbsp;  
##### Clean Architecture in .NET is not about having four projects named Domain, Application, Infrastructure, and API.
&nbsp;  

##### It’s about enforced boundaries.
&nbsp;  

##### Architecture tests transform architectural discipline from a human process into an automated guarantee. Instead of hoping developers remember rules, your CI pipeline enforces them. Instead of relying on code reviews to catch structural violations, your tests fail immediately.
&nbsp;  

##### That’s the difference between documentation and enforcement.
&nbsp;  

##### In real-world enterprise .NET systems - especially modular monoliths and microservices — architectural erosion doesn’t happen dramatically. It happens slowly. One dependency at a time. One “quick fix” at a time.
&nbsp;  

##### Architecture tests stop that.
&nbsp;  

##### They give you:

##### • Automated architecture validation
##### • Safer refactoring
##### • Long-term maintainability
##### • Stronger CI enforcement
##### • Predictable, scalable codebases
&nbsp;  

##### If you're serious about building production-grade .NET systems, architecture rules must be executable - not optional.
&nbsp;  
##### **In short**
&nbsp;  

##### Architecture tests in .NET allow teams to automatically enforce Clean Architecture rules, prevent dependency violations, and integrate architectural validation into CI pipelines.

#### Want to Go Deeper?
&nbsp;  

##### Architecture tests are just one part of a larger discipline: **automated code quality enforcement in .NET**.
&nbsp;  

##### In my [course Pragmatic .NET Code Rules](https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website=&utm_campaign=architecturetests), I go deeper into:

##### • Enforcing Clean Architecture rules
##### • CI/CD code quality automation
##### • .editorconfig strategies
##### • Analyzer configuration
##### • Warnings-as-errors setup
##### • Building self-cleaning .NET solutions
##### • Preventing architectural drift in real production systems
&nbsp;  

##### The goal isn’t just clean code.
&nbsp;  

##### The goal is a predictable, enforceable, self-protecting codebase.
&nbsp;  

##### If you want your .NET projects to scale without turning into technical debt machines, this is exactly what the course is built for.
&nbsp;  

##### You can learn more here: 👉 [Pragmatic .NET Code Rules](https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website=&utm_campaign=architecturetests)
&nbsp;  
##### That's all from me today.