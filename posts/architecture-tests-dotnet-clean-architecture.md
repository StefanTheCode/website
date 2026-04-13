---
title: "Architecture Tests in .NET: Enforce Clean Architecture with NetArchTest"
subtitle: "Learn how to enforce Clean Architecture in .NET using architecture tests. Step-by-step guide with NetArchTest examples to prevent architectural violations in C# projects..."
date: "February 17 2026"
category: ".NET"
readTime: "Read Time: 3 minutes"
meta_description: "Learn how to enforce Clean Architecture in .NET using architecture tests. Step-by-step guide with NetArchTest examples to prevent architectural violations in C# projects."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">Today's issue is sponsored by <a href="https://www.packtpub.com/" style="color: #a5b4fc; text-decoration: underline;">Packt</a>. Working with React doesn't have to be complex. **"React 18 Design Patterns and Best Practices"** empowers you to harness React's potential, making your applications flexible, easy to manage, and high-performing. Discover and unravel the dynamic features of React 18 and Node 19. This updated fourth edition equips you with insights into the cutting-edge tools that will elevate your projects. <a href="https://packt.link/IxSPS" style="color: #a5b4fc; text-decoration: underline;">Book Link</a></p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## Introduction: Why Architecture Breaks in .NET Projects
Most teams don’t break their architecture in one dramatic moment.

They break it one small reference at a time.

A developer adds a quick dependency.
A service references Infrastructure directly.
A Controller talks to DbContext.
A helper leaks into the wrong layer.

And suddenly, your **"Clean Architecture"** is just a folder structure.

If you are working in:

- ASP.NET Core APIs
- Microservices
- Modular Monoliths
- Enterprise .NET applications

You need a way to automatically enforce architecture rules.

That’s where Architecture Tests in .NET come in.

## What Are Architecture Tests in .NET?

**Architecture tests** in .NET are automated tests that validate architectural rules such as layer boundaries and assembly dependencies.
Architecture tests are automated tests that validate:

- Layer dependencies
- Namespace boundaries
- Naming conventions
- Assembly references
- Clean Architecture rules

Instead of relying on code reviews to catch architectural violations, you let tests fail when someone breaks your design.

In the .NET ecosystem, one of the most powerful tools for this is:

- 👉 NetArchTest

## Why You Should Use Architecture Tests?

Let’s talk real-world scenario.

Imagine this structure:

- MyApp.Domain
- MyApp.Application
- MyApp.Infrastructure
- MyApp.API

Clean Architecture rule:

*Domain must not depend on Infrastructure.*

But nothing stops a developer from accidentally adding:

```csharp
using MyApp.Infrastructure;
```

Now your Domain layer depends on Infrastructure.

Architecture broken.

Without architecture tests, you may not even notice this for weeks.

With architecture tests?

The build fails immediately.

## Installing NetArchTest in Your .NET Project

Add the NuGet package to your test project:

```
dotnet add package NetArchTest.Rules
```

Or via Visual Studio Package Manager.

Now we can start writing automated architecture validation tests.

### Example: Prevent Domain from Depending on Infrastructure

Let’s enforce this rule:

*The Domain layer must not reference Infrastructure.*

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

### Explanation of the Code
Let’s break this down:

- `Types.InAssembly(...)` - Loads all types from the Domain assembly.
- `.ShouldNot().HaveDependencyOn(...)` - Defines the architectural rule.
- `.GetResult()` - Executes the rule validation.
- `Assert.True(result.IsSuccessful)` - Fails the test if any violation is found.

Now your architecture is enforced automatically.

### Example: Enforce Clean Architecture Layer Rules

Here’s a more advanced rule:

*Application layer must not depend on API layer.*

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

This ensures:

- No accidental circular dependencies
- No UI leakage into core logic
- Proper separation of concerns

## Advanced Architecture Testing: Naming Conventions
You can even enforce naming rules.
Example:
*All services must end with "Service".*
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
This helps keep your project consistent and predictable.
### Real-World Example: Enterprise .NET Project
In large enterprise systems:
- 10+ projects
- Multiple teams
- Microservices
- Shared libraries

Architecture drift happens constantly.

When I worked on enterprise systems, we had situations where:
- Infrastructure leaked into Domain
- DTOs were referenced in Core
- Controllers called EF Core directly

After introducing architecture tests:

- Violations were caught immediately
- Code reviews became easier
- Refactoring was safer
- New developers onboarded faster

Architecture tests became part of CI.

That’s when architecture stopped being documentation and became enforcement.

## [CI/CD](https://thecodeman.net/posts/bullet-Proof-dotnet-ci-on-github) Integration: Automate Architecture Enforcement

The real power comes when you run architecture tests in:

- GitHub Actions
- Azure DevOps
- GitLab CI
- Any .NET CI pipeline

If someone breaks architecture:

- ❌ The pipeline fails.

Now architecture is not optional.

It’s enforced.

## Common Mistakes When Using Architecture Tests

1. Only testing one rule
2. Not running tests in CI
3. Hardcoding namespace strings incorrectly
4. Forgetting to test new assemblies
5. Treating architecture tests as “nice to have”
Architecture tests should be part of your default template.

## When Should You Use Architecture Tests?

Use them if you:

- Follow Clean Architecture
- Use Onion Architecture
- Build Modular Monoliths
- Maintain Microservices
- Work in large teams
- Want to prevent architectural erosion
If your project has more than 2 layers, you should consider them mandatory.

## Wrapping Up: Architecture Is a Discipline - Not a Folder Structure
Clean Architecture in .NET is not about having four projects named Domain, Application, Infrastructure, and API.

It’s about enforced boundaries.

Architecture tests transform architectural discipline from a human process into an automated guarantee. Instead of hoping developers remember rules, your CI pipeline enforces them. Instead of relying on code reviews to catch structural violations, your tests fail immediately.

That’s the difference between documentation and enforcement.

In real-world enterprise .NET systems - especially modular monoliths and microservices — architectural erosion doesn’t happen dramatically. It happens slowly. One dependency at a time. One “quick fix” at a time.

Architecture tests stop that.

They give you:

- Automated architecture validation
- Safer refactoring
- Long-term maintainability
- Stronger CI enforcement
- Predictable, scalable codebases

If you're serious about building production-grade .NET systems, architecture rules must be executable - not optional.
In short

Architecture tests in .NET allow teams to automatically enforce Clean Architecture rules, prevent dependency violations, and integrate architectural validation into CI pipelines.

### Want to Go Deeper?

Architecture tests are just one part of a larger discipline: **automated code quality enforcement in .NET**.

In my [course Pragmatic .NET Code Rules](https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website=&utm_campaign=architecturetests), I go deeper into:

- Enforcing Clean Architecture rules
- CI/CD code quality automation
- .editorconfig strategies
- Analyzer configuration
- Warnings-as-errors setup
- Building self-cleaning .NET solutions
- Preventing architectural drift in real production systems

The goal isn’t just [clean code](https://thecodeman.net/posts/clean-code-best-practices).

The goal is a predictable, enforceable, self-protecting codebase.

If you want your .NET projects to scale without turning into technical debt machines, this is exactly what the course is built for.

You can learn more here: 👉 [Pragmatic .NET Code Rules](https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website=&utm_campaign=architecturetests)
That's all from me today.

<!--END-->


