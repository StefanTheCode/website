---
title: "Architecture Tests in .NET: Test What the Compiler Can't See"
seo_title: "Architecture Tests in .NET: What the Compiler Misses"
subtitle: "Project references and internal already protect your layers. These are the architecture tests that catch the rest, with NetArchTest on .NET 10 and real failure outputs."
date: "Nov 16 2026"
category: "Architecture"
readTime: "Read Time: 13 minutes"
meta_description: "Architecture tests in .NET for what the compiler misses: framework leaks, layer bypass, feature cycles and conventions, with NetArchTest on .NET 10."
faq:
  - q: "What are architecture tests in .NET?"
    a: >-
      Architecture tests are unit tests that load your compiled assemblies and check their structure: which
      layer depends on which namespace, whether classes are sealed or internal, and where types live. With
      NetArchTest they are plain xUnit tests, so dotnet test and CI run them like any other test.
  - q: "Do I need architecture tests if my layers are already separate projects?"
    a: >-
      Separate projects already stop the wrong reference direction, because MSBuild rejects circular project
      references. You still need tests for what the compiler can't see: framework types leaking into the Domain,
      endpoints that skip the Application layer, features calling each other inside one project, and conventions
      like sealed or internal.
  - q: "Why does my NetArchTest rule pass when the code breaks it?"
    a: >-
      The most common cause is a wrong namespace string. HaveDependencyOn takes a string, and a misspelled,
      shortened or lowercase namespace makes the rule pass against code that breaks it. The second cause is a
      dependency that only exists in the .csproj: NetArchTest reads the compiled IL, so an unused project
      reference is invisible to it. Break every new rule once on purpose and watch it fail.
  - q: "Is NetArchTest still maintained?"
    a: >-
      The last NetArchTest.Rules release is 1.3.2 from May 2021. It still runs on .NET 10, and every test in this
      post ran on it. If you want an actively maintained library, ArchUnitNET (TngTech.ArchUnitNET.xUnit) had a
      release in October 2026, and NetArchTest.eNhancedEdition is a fork with a similar API.
  - q: "How do I stop Minimal API endpoints from using repositories directly?"
    a: >-
      Write a NetArchTest rule on the Api assembly: Types.InAssembly(apiAssembly).ShouldNot().HaveDependencyOn
      with your repositories namespace. NetArchTest reads the compiled code, so it also finds repositories injected
      into endpoint lambdas in Program.cs and reports them under the Program type. The fix is an Application handler
      per use case that returns a response record instead of a Domain entity.
  - q: "How do architecture tests help when an AI agent writes code?"
    a: >-
      An agent doesn't remember your architecture between sessions, but the tests do. Put the rules in the agent's
      instructions file, make dotnet test part of the definition of done, and write failure messages that say what
      to do instead. Also tell the agent explicitly never to edit, skip or delete an architecture test to make it pass.
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue is one part of my <strong>Pragmatic .NET Code Rules</strong> course. The course sets up a .NET solution that enforces its own rules: EditorConfig, analyzers with warnings as errors, <code>Directory.Build.props</code>, architecture tests, and a CI pipeline that blocks a pull request when any of them fail. 12 modules and 60+ lessons, hosted on Skool. It's in presale right now and refundable until release.</p>

<a href="https://thecodeman.net/pragmatic-dotnet-code-rules" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #1a0224; background: #ffbd39; border-radius: 8px; text-decoration: none;">See the full curriculum →</a>

<p style="margin: 16px 0 8px 0; font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.6);">Want to reach thousands of .NET developers like this?</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 7px 14px; font-size: 13px; font-weight: 600; color: #ffffff; background: transparent; border: 1px solid #6366f1; border-radius: 8px; text-decoration: none;">Sponsor TheCodeMan →</a>
</div>

**Keywords:** architecture tests in .NET, NetArchTest, NetArchTest.Rules, architecture tests C#, clean architecture tests, layer dependency tests, domain purity, layer bypass, feature isolation, convention tests, xUnit architecture tests, ArchUnitNET, project references, MSB4006, ReferenceTrimmer, architecture tests AI agents, CLAUDE.md, NetArchTest examples, NetArchTest vs ArchUnitNET, Minimal API architecture tests

## What Should Architecture Tests in .NET Check?

Architecture tests in .NET are unit tests that load your compiled assemblies and check their structure: which layer depends on which namespace, whether a class is sealed or internal, and where a type lives. The useful ones check what the compiler can't. If your layers are separate projects, MSBuild already stops the Domain from referencing Infrastructure, and `internal` already hides implementations. What's left are framework types leaking into the Domain, endpoints that skip the Application layer, features that call each other inside one project, and conventions that drift one keyword at a time.

In February I wrote an [introduction to architecture tests with NetArchTest](https://thecodeman.net/posts/architecture-tests-dotnet-clean-architecture). Its two examples were "Domain must not depend on Infrastructure" and "Application must not depend on the API". In a typical layout, where Infrastructure references the Domain and the API references the Application project, MSBuild already rejects both of those references, because each one would create a cycle. Since then I built Module 08 of my [Pragmatic .NET Code Rules](https://thecodeman.net/pragmatic-dotnet-code-rules) course around architecture tests, and most of the work went into the rules MSBuild can't enforce.

The sample is the Newsletter API from the course: four projects, .NET 10, [NetArchTest.Rules](https://github.com/BenMorris/NetArchTest) 1.3.2 and xUnit 2.9.3. Every test and every failure output below comes from runs on .NET SDK 10.0.404.

## The Sample Solution

The solution has four projects and one architecture test project:

![Architecture tests in .NET sample: project references between Newsletter.Api, Application, Infrastructure and Domain, with the architecture test project referencing only the Api](/images/blog/posts/architecture-tests-dotnet-what-the-compiler-cant-see/project-references.webp)

- **Domain** - the `Subscriber` and `Article` entities, the repository interfaces, and a small `EmailNormalizer` service.
- **Application** - two features, `Subscribers` and `Articles`. Each use case is a command or query plus a handler, in its own folder, for example `Application/Subscribers/CreateSubscriber/`.
- **Infrastructure** - in-memory repository implementations.
- **Api** - Minimal API endpoints in `Program.cs`.

The repository also has `TreatWarningsAsErrors`, analyzers, Central Package Management and ReferenceTrimmer set up in `Directory.Build.props` and `Directory.Packages.props`. I covered that setup in [Mastering Directory.Build.props](https://thecodeman.net/posts/mastering-directory-build-props-in-dotnet). Some of those settings show up in the outputs later.

## What the Compiler Already Protects

Before writing any architecture test, it's worth checking which rules already hold for free.

The first one is the direction between projects. Infrastructure references Domain. If someone adds a reference from Domain to Infrastructure, the CLI accepts it:

```bash
dotnet add Newsletter.Domain reference Newsletter.Infrastructure/Newsletter.Infrastructure.csproj
```

```text
Reference `..\Newsletter.Infrastructure\Newsletter.Infrastructure.csproj` added to the project.
```

The build doesn't:

```text
error MSB4006: There is a circular dependency in the target dependency graph involving target "_GenerateRestoreProjectPathWalk".
```

MSBuild refuses circular references between projects, so the Domain can never depend on Infrastructure while Infrastructure depends on the Domain. With separate projects, the direction between layers is enforced without writing any test.

The second one is visibility. The repository implementations are `internal`:

```csharp
internal sealed class InMemorySubscriberRepository : ISubscriberRepository
```

The Api project can't see this class. An endpoint that tries to create it directly doesn't compile, so consumers have to go through `ISubscriberRepository`.

That leaves four kinds of rules the compiler can't express:

1. **Framework leaks.** The Domain can use anything that ships with .NET. Nothing stops a `System.Text.Json` attribute from appearing on an entity.
2. **Layer bypass.** The Api is allowed to see the Domain, so it can take a repository interface and skip the Application layer completely.
3. **Boundaries inside one project.** Two features in the Application project can call each other. MSBuild only sees projects, so a cycle between features is never reported.
4. **Conventions.** "Entities are sealed" or "implementations stay internal" each depend on one keyword that nobody has to keep.

This is how I decide where a rule goes:

![Where an architecture rule belongs: project references for reference direction, internal plus a convention test for visibility, an architecture test for framework leaks, layer bypass, feature boundaries and conventions](/images/blog/posts/architecture-tests-dotnet-what-the-compiler-cant-see/where-architecture-rules-belong.webp)

## Setting Up a NetArchTest Project With xUnit

`dotnet new xunit` doesn't know about [Central Package Management](https://learn.microsoft.com/en-us/nuget/consume-packages/central-package-management), so in this repository the new project fails to restore with [NU1008](https://learn.microsoft.com/en-us/nuget/reference/errors-and-warnings/nu1008):

```text
error NU1008: The following PackageReference items cannot define a value for Version: coverlet.collector, Microsoft.NET.Test.Sdk, xunit, xunit.runner.visualstudio. Projects using Central Package Management must define a Version value on a PackageVersion item.
```

After removing the versions and the `coverlet.collector` reference, which this repository doesn't use, the project file is short. The target framework, nullable settings and package versions come from the shared props files:

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <IsPackable>false</IsPackable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Test.Sdk" />
    <PackageReference Include="NetArchTest.Rules" />
    <PackageReference Include="xunit" />
    <PackageReference Include="xunit.runner.visualstudio" />
  </ItemGroup>

  <ItemGroup>
    <Using Include="Xunit" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\Newsletter.Api\Newsletter.Api.csproj" />
  </ItemGroup>

</Project>
```

The test project references only the Api. The Api references Application and Infrastructure, and both reference the Domain, so this one reference makes all four assemblies available to the tests. The test project sits outside the architecture and looks in.

NetArchTest doesn't read source files. It loads the compiled assemblies and reads their metadata, including the code inside method bodies. That means it also sees dependencies inside lambdas and top-level statements, which matters later in this post.

The first helper gives every layer one name:

```csharp
using System.Reflection;

namespace Newsletter.ArchitectureTests;

internal static class Layers
{
    public static readonly Assembly Domain = typeof(Newsletter.Domain.Entities.Subscriber).Assembly;
    public static readonly Assembly Application = typeof(Newsletter.Application.Exceptions.NewsletterException).Assembly;
    public static readonly Assembly Infrastructure = typeof(Newsletter.Infrastructure.DependencyInjection).Assembly;
    public static readonly Assembly Api = typeof(Newsletter.Api.Contracts.CreateSubscriberRequest).Assembly;

    public static Assembly ByName(string name) => name switch
    {
        nameof(Domain) => Domain,
        nameof(Application) => Application,
        nameof(Infrastructure) => Infrastructure,
        nameof(Api) => Api,
        _ => throw new ArgumentOutOfRangeException(nameof(name), name, "Unknown layer."),
    };
}
```

Each assembly is found through one type that lives in it. If that type is renamed, there is one place to fix.

## NetArchTest Failure Messages That Explain the Rule

Most NetArchTest examples end with `Assert.True(result.IsSuccessful)`. This is what that prints when the rule fails:

```text
Assert.True() Failure
Expected: True
Actual:   False
```

It doesn't say which rule failed, which class broke it, or why the rule exists. The second helper fixes that:

```csharp
using NetArchTest.Rules;

namespace Newsletter.ArchitectureTests;

internal static class TestResultExtensions
{
    public static void ShouldPass(this TestResult result, string rule)
    {
        if (result.IsSuccessful)
        {
            return;
        }

        IEnumerable<string> violations = result.FailingTypeNames ?? [];

        Assert.Fail($"{rule}\nViolating types:\n  - {string.Join("\n  - ", violations)}");
    }
}
```

Every test passes the rule as a sentence that includes the reason. When the test fails, it prints that sentence and the names of the types that broke it. The failure reads like a code review comment, and that becomes important again in the section about AI agents.

## Layer Dependency Rules as One xUnit Theory

The classic layer rules fit in one `[Theory]`:

```csharp
using NetArchTest.Rules;

namespace Newsletter.ArchitectureTests;

public sealed class LayerDependencyTests
{
    public static TheoryData<string, string> ForbiddenDependencies => new()
    {
        { "Domain", "Newsletter.Application" },
        { "Domain", "Newsletter.Infrastructure" },
        { "Domain", "Newsletter.Api" },
        { "Application", "Newsletter.Infrastructure" },
        { "Application", "Newsletter.Api" },
        { "Infrastructure", "Newsletter.Api" },
    };

    [Theory]
    [MemberData(nameof(ForbiddenDependencies))]
    public void Layer_Should_Not_Depend_On_Outer_Layer(string layer, string forbiddenNamespace)
    {
        TestResult result = Types
            .InAssembly(Layers.ByName(layer))
            .ShouldNot()
            .HaveDependencyOn(forbiddenNamespace)
            .GetResult();

        result.ShouldPass($"{layer} must not depend on {forbiddenNamespace}. Dependencies point inward, toward the Domain.");
    }

    /* Domain_Should_Not_Depend_On_Frameworks - next section */
}
```

The table is the whole layering rule in six rows.

Five of these six rows can't fail in this solution today. Each of those references would create a cycle, and MSBuild rejects it before any test runs. The exception is Application → Infrastructure. Infrastructure references only the Domain, so a reference from Application to Infrastructure builds fine. When I added that reference and called `AddInfrastructure` from a handler, the build passed and this row failed:

```text
Application must not depend on Newsletter.Infrastructure. Dependencies point inward, toward the Domain.
Violating types:
  - Newsletter.Application.Subscribers.CreateSubscriber.CreateSubscriberCommandHandler
```

I keep the other five because the project structure can change. If someone merges Application into the Domain project, or adds a `Shared` project that everyone references, the compiler stops protecting those rules and these rows keep doing it. They run in milliseconds, so the insurance is cheap.

## Domain Purity: The [JsonIgnore] Shortcut

The second test in the same class is the one that catches real problems today:

```csharp
[Fact]
public void Domain_Should_Not_Depend_On_Frameworks()
{
    TestResult result = Types
        .InAssembly(Layers.Domain)
        .ShouldNot()
        .HaveDependencyOnAny(
            "System.Text.Json",
            "Microsoft.AspNetCore",
            "Microsoft.EntityFrameworkCore",
            "Microsoft.Extensions.DependencyInjection")
        .GetResult();

    result.ShouldPass(
        "Domain must stay framework-free. Move serialization, persistence and DI concerns to Api or Infrastructure.");
}
```

Here is a realistic request: `GET /api/subscribers` returns subscribers as JSON, and the product owner doesn't want `isActive` in the response. The fastest fix is one attribute on the entity:

```csharp
using System.Text.Json.Serialization;

using Newsletter.Domain.Services;

namespace Newsletter.Domain.Entities;

public sealed class Subscriber
{
    /* ... */

    [JsonIgnore]
    public bool IsActive { get; private set; }

    /* ... */
}
```

`System.Text.Json` ships with .NET, so there is no project reference to block it. The build passes with 0 warnings and 0 errors, and the API would return exactly what the product owner asked for. The architecture test fails:

```text
Domain must stay framework-free. Move serialization, persistence and DI concerns to Api or Infrastructure.
Violating types:
  - Newsletter.Domain.Entities.Subscriber
```

Nothing else in this setup can catch that change. The request itself is valid, though. The real problem is that the endpoint returns a Domain entity, and the next test finds exactly that.

## Layer Bypass: The Test That Failed on My Own Code

The Api is allowed to reference the Domain, because it needs the types. It shouldn't use the repositories directly. Endpoints should call an Application handler:

```csharp
using NetArchTest.Rules;

namespace Newsletter.ArchitectureTests;

public sealed class LayerBypassTests
{
    [Fact]
    public void Api_Should_Not_Use_Repositories_Directly()
    {
        TestResult result = Types
            .InAssembly(Layers.Api)
            .ShouldNot()
            .HaveDependencyOn("Newsletter.Domain.Repositories")
            .GetResult();

        result.ShouldPass("Endpoints must go through an Application handler, never straight to a repository.");
    }
}
```

I added this test without changing any other code, and it failed on the first run:

```text
Endpoints must go through an Application handler, never straight to a repository.
Violating types:
  - Program
```

It was right. Three endpoints in `Program.cs` took a repository straight into the handler lambda:

```csharp
app.MapGet("/api/subscribers", async (ISubscriberRepository repository, CancellationToken cancellationToken) =>
{
    List<Subscriber> subscribers = await repository.GetAllActiveAsync(cancellationToken);
    return Results.Ok(subscribers);
});

app.MapPost("/api/articles", async (CreateArticleRequest request, IArticleRepository repository, CancellationToken cancellationToken) =>
{
    Article article = Article.Create(request.Title, request.Content);
    await repository.AddAsync(article, cancellationToken);
    return Results.Created($"/api/articles/{article.Id}", new { id = article.Id });
});

app.MapGet("/api/articles", async (IArticleRepository repository, CancellationToken cancellationToken) =>
{
    List<Article> articles = await repository.GetAllPublishedAsync(cancellationToken);
    return Results.Ok(articles);
});
```

This code had been in the repository since the start of the previous module, and I had gone through it in a cleanup lesson without noticing. Half of the API skipped the Application layer, so there was no use case and no place for rules. The `GET` endpoints also returned Domain entities as JSON, which is why the `[JsonIgnore]` shortcut looked reasonable in the first place.

The violating type is reported as `Program` because the endpoints are lambdas in top-level statements, and the compiler generates them inside the `Program` class. NetArchTest reads the compiled code, so it doesn't matter how the source file is laid out.

The fix is a handler per use case and a response record:

```csharp
public sealed record SubscriberResponse(Guid Id, string Email, string FirstName);
```

```csharp
public sealed class GetActiveSubscribersQueryHandler
{
    private readonly ISubscriberRepository _subscriberRepository;

    public GetActiveSubscribersQueryHandler(ISubscriberRepository subscriberRepository)
    {
        _subscriberRepository = subscriberRepository;
    }

    public async Task<IReadOnlyList<SubscriberResponse>> HandleAsync(CancellationToken cancellationToken = default)
    {
        List<Subscriber> subscribers = await _subscriberRepository.GetAllActiveAsync(cancellationToken);

        return subscribers
            .Select(s => new SubscriberResponse(s.Id, s.Email, s.FirstName))
            .ToList();
    }
}
```

```csharp
app.MapGet("/api/subscribers", async (GetActiveSubscribersQueryHandler handler, CancellationToken cancellationToken) =>
    Results.Ok(await handler.HandleAsync(cancellationToken)));
```

`SubscriberResponse` has no `IsActive`, so the product request is solved without the Domain knowing anything about JSON. After the same change for the two article endpoints, the Api has no `using Newsletter.Domain.Repositories` left, and the test passes.

## Feature Isolation Inside One Project

MSBuild blocks cycles between projects, but inside the Application project `CreateSubscriber` can call into `PublishArticle`, and `PublishArticle` can later call back into `Subscribers`. That is how an organized codebase slowly turns into one big ball. If two features need the same thing, it belongs in the Domain, or they are one feature.

```csharp
using NetArchTest.Rules;

namespace Newsletter.ArchitectureTests;

public sealed class FeatureIsolationTests
{
    public static TheoryData<string, string> FeaturePairs => new()
    {
        { "Newsletter.Application.Subscribers", "Newsletter.Application.Articles" },
        { "Newsletter.Application.Articles", "Newsletter.Application.Subscribers" },
    };

    [Theory]
    [MemberData(nameof(FeaturePairs))]
    public void Feature_Should_Not_Depend_On_Another_Feature(string feature, string otherFeature)
    {
        TestResult result = Types
            .InAssembly(Layers.Application)
            .That()
            .ResideInNamespace(feature)
            .ShouldNot()
            .HaveDependencyOn(otherFeature)
            .GetResult();

        result.ShouldPass($"{feature} must not depend on {otherFeature}. Share through the Domain, not across features.");
    }
}
```

To check it, I added one line to `CreateSubscriberCommandHandler.HandleAsync`:

```csharp
_ = new PublishArticleCommand(subscriber.Id);
```

```text
Newsletter.Application.Subscribers must not depend on Newsletter.Application.Articles. Share through the Domain, not across features.
Violating types:
  - Newsletter.Application.Subscribers.CreateSubscriber.CreateSubscriberCommandHandler
```

If the features grow into modules of a [modular monolith](https://thecodeman.net/posts/monolith-to-modular-monolith-to-microservices-at-100k-users) one day, this is the same test with module namespaces instead of feature namespaces.

## Conventions: Sealed, Interfaces, Feature Folders, Internal

The last group reads like sentences:

```csharp
using NetArchTest.Rules;

namespace Newsletter.ArchitectureTests;

public sealed class ConventionTests
{
    [Fact]
    public void Domain_Entities_Should_Be_Sealed()
    {
        TestResult result = Types
            .InAssembly(Layers.Domain)
            .That()
            .ResideInNamespace("Newsletter.Domain.Entities")
            .And()
            .AreClasses()
            .Should()
            .BeSealed()
            .GetResult();

        result.ShouldPass("Domain entities are not extension points - mark them sealed.");
    }

    [Fact]
    public void Repositories_In_Domain_Should_Be_Interfaces()
    {
        TestResult result = Types
            .InAssembly(Layers.Domain)
            .That()
            .HaveNameEndingWith("Repository")
            .Should()
            .BeInterfaces()
            .GetResult();

        result.ShouldPass("The Domain declares repository contracts (interfaces). Implementations belong in Infrastructure.");
    }

    [Fact]
    public void Handlers_Should_Be_Sealed_And_Live_In_A_Feature_Folder()
    {
        TestResult result = Types
            .InAssembly(Layers.Application)
            .That()
            .HaveNameEndingWith("Handler")
            .Should()
            .BeSealed()
            .And()
            .ResideInNamespaceMatching(@"^Newsletter\.Application\.\w+\.\w+$")
            .GetResult();

        result.ShouldPass("Handlers are sealed and live in Application/<Feature>/<UseCase>/.");
    }

    [Fact]
    public void Infrastructure_Implementations_Should_Not_Be_Public()
    {
        TestResult result = Types
            .InAssembly(Layers.Infrastructure)
            .That()
            .ResideInNamespace("Newsletter.Infrastructure.Repositories")
            .Should()
            .NotBePublic()
            .GetResult();

        result.ShouldPass("Repository implementations stay internal - consumers depend on the Domain interface only.");
    }
}
```

The handler test uses a regular expression on the namespace, so a handler dropped into a generic `Handlers` folder fails, because its namespace has only one segment after `Application`.

The last test protects the free rule from the beginning of this post. `internal` only hides the repositories as long as nobody changes it. Changing `InMemoryArticleRepository` from `internal` to `public` builds with 0 warnings and 0 errors, and it's a one-word change a reviewer can easily miss. The test doesn't miss it:

```text
Repository implementations stay internal - consumers depend on the Domain interface only.
Violating types:
  - Newsletter.Infrastructure.Repositories.InMemoryArticleRepository
```

With the handlers in place, the suite has 14 architecture tests: six layer rows, Domain purity, layer bypass, two feature pairs and four conventions. My run took 124 ms.

> This post covers part of Module 08 (Architecture Tests) of my [Pragmatic .NET Code Rules](https://thecodeman.net/pragmatic-dotnet-code-rules) course. In the full module I build these tests step by step, from the empty test project to the 14 green tests, and the next module moves them into a CI pipeline that blocks a pull request when a rule fails.

## NetArchTest Gotchas: When a Green Test Proves Nothing

### A wrong namespace string passes silently

`HaveDependencyOn` takes a string. I took the version of `Program.cs` that still had the repository endpoints, which the bypass test reports as a violation, and changed only the namespace in the rule. All three variants passed:

- `"Newsletter.Domain.Repository"` (missing `ies`)
- `"Newsletter.Domain.Repo"` (shortened)
- `"newsletter.domain.repositories"` (lowercase)

Each of these rules is green against code that breaks it, and nothing warns you. That is why I break every new rule once on purpose and watch it fail before I trust it.

### NetArchTest reads IL, not the .csproj

I added a project reference from Application to Infrastructure without using any Infrastructure type. With ReferenceTrimmer turned off for that build, all 14 architecture tests passed, including `Application must not depend on Newsletter.Infrastructure`. NetArchTest sees a dependency only when compiled code uses a type. A reference in the `.csproj` alone isn't in the IL.

In this repository the reference never gets that far, because [ReferenceTrimmer](https://www.nuget.org/packages/ReferenceTrimmer) reports it and warnings are errors:

```text
error RT0002: ProjectReference ../Newsletter.Infrastructure/Newsletter.Infrastructure.csproj can be removed
```

If you want a rule about the `.csproj` itself, read the file. This test isn't in the course repository. I wrote it for this post, based on a check from another project of mine where the Domain `.csproj` must have no references at all. It reads each `.csproj` with `XDocument` and lists the allowed project references per project:

```csharp
using System.Xml.Linq;

namespace Newsletter.ArchitectureTests;

public sealed class ProjectReferenceTests
{
    public static TheoryData<string, string[]> AllowedReferences => new()
    {
        { "Newsletter.Domain", [] },
        { "Newsletter.Application", ["Newsletter.Domain"] },
        { "Newsletter.Infrastructure", ["Newsletter.Domain"] },
    };

    [Theory]
    [MemberData(nameof(AllowedReferences))]
    public void Project_Should_Only_Reference_Allowed_Projects(string project, string[] allowed)
    {
        string csproj = Path.Combine(RepoRoot.Path, project, $"{project}.csproj");

        List<string> unexpected = XDocument.Load(csproj)
            .Descendants("ProjectReference")
            .Select(r => Path.GetFileNameWithoutExtension(((string?)r.Attribute("Include") ?? string.Empty).Replace('\\', '/')))
            .Where(name => !allowed.Contains(name))
            .ToList();

        Assert.True(
            unexpected.Count == 0,
            $"{project} may only reference [{string.Join(", ", allowed)}]. Remove: {string.Join(", ", unexpected)}");
    }
}
```

```csharp
namespace Newsletter.ArchitectureTests;

internal static class RepoRoot
{
    public static string Path { get; } = Find();

    private static string Find()
    {
        DirectoryInfo? dir = new(AppContext.BaseDirectory);

        while (dir is not null && !File.Exists(System.IO.Path.Combine(dir.FullName, "Newsletter.slnx")))
        {
            dir = dir.Parent;
        }

        return dir?.FullName ?? throw new InvalidOperationException("Newsletter.slnx not found above the test output folder.");
    }
}
```

The `Replace('\\', '/')` matters on Linux and macOS. The `Include` paths use backslashes, and only Windows treats a backslash as a path separator. With the same unused reference, the NetArchTest rules stayed green and this test failed:

```text
Newsletter.Application may only reference [Newsletter.Domain]. Remove: Newsletter.Infrastructure
```

With this test added, the suite has 17 architecture tests instead of 14.

### The rules run against the last build

NetArchTest inspects the compiled assemblies, so the project has to build first. `dotnet test` builds before it runs, but `dotnet test --no-build` runs against whatever is in `bin/`. If a test result doesn't match the code you're looking at, rebuild before you investigate.

## Architecture Tests as Guardrails for AI Agents

When you ask an AI agent for a new endpoint, the shortest path is the shortcut the bypass test found in my code: inject the repository, return the entity, done. The agent doesn't remember between sessions that endpoints in this repository go through handlers, but the architecture tests check that rule on every `dotnet test` run.

In the course repository the rules are in `CLAUDE.md`, the file [Claude Code](https://thecodeman.net/posts/claude-for-dotnet-developers) reads at the start of a session:

```markdown
## Architecture

- Layers: Domain <- Application <- Infrastructure, Api. Dependencies point inward.
- Endpoints call an Application handler. Never inject a repository into an endpoint.
- Use cases live in Application/<Feature>/<UseCase>/ as <UseCase>Command|Query + Handler (sealed).
- Never return Domain entities from the API - map to a <Name>Response record.
- Repository implementations in Infrastructure stay internal sealed.

## Definition of done

- `dotnet build` passes with zero warnings.
- `dotnet test` passes, including Newsletter.ArchitectureTests.
- `dotnet format --verify-no-changes` passes.
- Never edit, skip or delete an architecture test to make it pass. If a rule seems wrong, stop and ask.
```

Two things in this file matter more than the rest.

The first is that `dotnet test` is part of the definition of done, so the agent runs the architecture tests itself. When a rule fails, the agent gets the same output you do. "Expected: True, Actual: False" gives it nothing to work with, so it has to guess. "Endpoints must go through an Application handler, never straight to a repository" plus the name of the violating type tells it what to change. That is the second reason to write failure messages as sentences.

The second is the last line. An agent that can't make a test pass can also change the test instead, so the instructions have to forbid that explicitly.

The instructions file guides the agent before it writes code, and the tests check the result after. You want both, because an agent doesn't always follow the instructions.

## NetArchTest vs ArchUnitNET: Which Library to Use

NetArchTest.Rules 1.3.2 is from May 2021, and there hasn't been a release since. It runs fine on .NET 10, every test in this post used it, and its fluent API reads almost like the rule it checks. If you prefer an actively maintained library, [ArchUnitNET](https://github.com/TNG/ArchUnitNET) (`TngTech.ArchUnitNET.xUnit`) had its 0.13.5 release in October 2026, and [NetArchTest.eNhancedEdition](https://github.com/NeVeSpl/NetArchTest.eNhancedEdition) is a fork with a similar API whose latest release is 1.4.5 from June 2025.

For a few rules you don't need a library at all. Reflection over referenced assemblies and `XDocument` over `.csproj` files cover a lot, as the project reference test above shows.

The ideas in this post are the same with any of them: let the compiler guard what it can, test what it can't, write failure messages as sentences, and see every rule fail once.

## FAQ

### What are architecture tests in .NET?

Architecture tests are unit tests that load your compiled assemblies and check their structure: which layer depends on which namespace, whether classes are sealed or internal, and where types live. With NetArchTest they are plain xUnit tests, so `dotnet test` and CI run them like any other test.

### Do I need architecture tests if my layers are already separate projects?

Separate projects already stop the wrong reference direction, because MSBuild rejects circular project references. You still need tests for what the compiler can't see: framework types leaking into the Domain, endpoints that skip the Application layer, features calling each other inside one project, and conventions like sealed or internal.

### Why does my NetArchTest rule pass when the code breaks it?

The most common cause is a wrong namespace string. `HaveDependencyOn` takes a string, and a misspelled, shortened or lowercase namespace makes the rule pass against code that breaks it. The second cause is a dependency that only exists in the `.csproj`: NetArchTest reads the compiled IL, so an unused project reference is invisible to it. Break every new rule once on purpose and watch it fail.

### Is NetArchTest still maintained?

The last NetArchTest.Rules release is 1.3.2 from May 2021. It still runs on .NET 10, and every test in this post ran on it. If you want an actively maintained library, ArchUnitNET (`TngTech.ArchUnitNET.xUnit`) had a release in October 2026, and NetArchTest.eNhancedEdition is a fork with a similar API.

### How do I stop Minimal API endpoints from using repositories directly?

Write a NetArchTest rule on the Api assembly: `Types.InAssembly(apiAssembly).ShouldNot().HaveDependencyOn(...)` with your repositories namespace. NetArchTest reads the compiled code, so it also finds repositories injected into endpoint lambdas in `Program.cs` and reports them under the `Program` type. The fix is an Application handler per use case that returns a response record instead of a Domain entity.

### How do architecture tests help when an AI agent writes code?

An agent doesn't remember your architecture between sessions, but the tests do. Put the rules in the agent's instructions file, make `dotnet test` part of the definition of done, and write failure messages that say what to do instead. Also tell the agent explicitly never to edit, skip or delete an architecture test to make it pass.

## Wrapping Up

Architecture tests in .NET are most useful for the rules the compiler can't enforce. Project references already block cycles between layers, and `internal` already hides implementations. The tests worth writing cover framework leaks into the Domain, endpoints that bypass the Application layer, features that depend on each other inside one project, and conventions like `sealed` and `internal`. In the sample, the bypass test found three endpoints in my own code on its first run.

Write each failure message as the rule plus the reason, break every new rule once to see it fail, and remember that NetArchTest only sees what ends up in the IL. For the basics of NetArchTest, start with my [first post on architecture tests](https://thecodeman.net/posts/architecture-tests-dotnet-clean-architecture). To run these tests on every pull request, see [Bullet-Proof .NET CI on GitHub](https://thecodeman.net/posts/bullet-Proof-dotnet-ci-on-github).

This post is based on Module 08 of [Pragmatic .NET Code Rules](https://thecodeman.net/pragmatic-dotnet-code-rules). The course goes through the full setup step by step: EditorConfig, analyzers, `Directory.Build.props`, project cleanup, these architecture tests, and the CI pipeline that makes all of it required before a merge.

That's all from me today.

<!--END-->
