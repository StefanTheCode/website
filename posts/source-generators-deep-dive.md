---
title: "Deep dive into Source Generators"
subtitle: "Source generators are components that run during the compilation process to inspect your code and generate additional C# source files."
date: "July 1 2025"
category: "CSharp"
meta_description: "Source generators are components that run during the compilation process to inspect your code and generate additional C# source files."
---

<!--START-->
&nbsp;  
&nbsp;  
### Introduction to Source Generators
&nbsp;  
&nbsp;  

##### Source generators, introduced in C# 9, have become a powerful tool for metaprogramming in .NET, allowing developers to generate additional source code during the compilation process.

##### With C# 12, source generators have evolved further, enabling more sophisticated scenarios and improving developer productivity by reducing boilerplate code and enhancing compile-time checks.

##### Today I will explain details about Source Generators:

##### - What are Source Generators?
##### - Enhancements in C# 12 Source Generators
##### - Creating a Source Generator in C# 12
##### - Advanced Use Cases for Source Generators
##### - FileBasedGenerator (Reading code from file)
##### - Best Practices for Using Source Generators
&nbsp;  
&nbsp;  
### What are Source Generators?
&nbsp;  
&nbsp;  

##### Source generators are components that run during the compilation process to inspect your code and generate additional C# source files.

##### These files are then compiled alongside your code, allowing you to dynamically create code based on the existing codebase.

##### Source generators can be used for a variety of purposes, such as code scaffolding, validation, and enhancing code readability and maintainability.

&nbsp;  
&nbsp;  
### Enhancements in C# 12+ Source Generators
&nbsp;  
&nbsp;   

##### **1. Incremental Generators:**
&nbsp;   

##### Incremental generators, introduced in earlier versions, have been further refined in C# 12. These generators only regenerate code when necessary, significantly improving performance.
&nbsp;   

##### Incremental generators work by caching the results of previous runs and only re-executing parts of the generator when the underlying data has changed.
&nbsp;   

##### **2. Source Dependency Analysis:**
&nbsp;   

##### C# 12 includes better dependency analysis for source generators, allowing the compiler to more accurately determine which parts of your code depend on the generated code.
&nbsp;   

##### This results in more efficient builds and fewer unnecessary recompilations.
&nbsp;   

##### **3. Enhanced Diagnostic Reporting:**
&nbsp;   

##### The diagnostic capabilities of source generators have been improved, allowing for better error and warning reporting directly in the generated code.
&nbsp;   

##### This ensures that developers receive clear feedback during the development process, making it easier to debug and maintain the generated code.
&nbsp;   

##### **4. Roslyn API Enhancements:**

##### The Roslyn API, which powers source generators, has received several updates in C# 12. These updates provide more hooks for analyzing and modifying the syntax tree, enabling more complex and sophisticated code generation scenarios.

&nbsp;   
&nbsp;   
### Creating a Source Generator in C#
&nbsp;   
&nbsp;   

##### Let’s walk through the process of creating a simple source generator in C#.
&nbsp;   

##### **Step 1: Setting Up the Project**
&nbsp;   

##### Create a new .NET Standard library project:

```csharp

dotnet new classlib -n MySourceGenerator

```
&nbsp;  

##### Next, add the necessary NuGet packages for working with source generators:
```csharp

dotnet add package Microsoft.CodeAnalysis.CSharp

```
&nbsp;  

##### **Step 2: Implementing the Source Generator**
&nbsp;  

##### To implement a source generator, you need to create a class that implements the ISourceGenerator interface. Here’s a basic example:

```csharp

using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Text;
using System.Text;

[Generator]
public class HelloWorldGenerator : ISourceGenerator
{
    public void Initialize(GeneratorInitializationContext context)
    {
        // Register any callbacks here
    }

    public void Execute(GeneratorExecutionContext context)
    {
        // Create the source code to inject
        string sourceCode = @" using System; namespace HelloWorldGenerated { public static class HelloWorld { public static void SayHello() => Console.WriteLine(""Hello from the generated code!""); } }";

        // Add the source code to the compilation
        context.AddSource("HelloWorldGenerated", SourceText.From(sourceCode, Encoding.UTF8));
    }
}

```

&nbsp;  

##### This simple generator adds a HelloWorld class with a SayHello method to your project. The generated code will be compiled with the rest of your project, allowing you to call HelloWorldGenerated.HelloWorld.SayHello() from your code.
&nbsp;  

##### **Step 3: Integrating with a Project**
&nbsp;  

##### To use the source generator, reference the generator project from another project:

```csharp

dotnet add reference ../MySourceGenerator/MySourceGenerator.csproj

```
&nbsp;  

##### After referencing the generator, the generated HelloWorld class will be available for use in the consuming project.

##### **Step 4: Building and Running**

##### Build the solution and run the project. You should see the output from the generated HelloWorld.SayHello() method in the console.

```csharp

// Program.cs
using HelloWorldGenerated;

class Program
{
    static void Main(string[] args)
    {
        // Call the generated method
        HelloWorld.SayHello();
    }
}

```

&nbsp;  
&nbsp;  
### Advanced Use Cases for Source Generators
&nbsp;  
&nbsp;  

##### **1. Automatic Dependency Injection:**
&nbsp;  

##### Source generators can analyze your classes and automatically generate the necessary code to register them with a dependency injection container. 
&nbsp;  

##### This reduces boilerplate code and ensures that all dependencies are correctly registered.

```csharp

using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;
using System.Text;

[Generator]
public class DIRegistrationGenerator : ISourceGenerator
{
    public void Initialize(GeneratorInitializationContext context) { }

    public void Execute(GeneratorExecutionContext context)
    {
        var sourceCode = new StringBuilder();
        sourceCode.AppendLine("using Microsoft.Extensions.DependencyInjection;");
        sourceCode.AppendLine("namespace DIRegistrationGenerated");
        sourceCode.AppendLine("{");
        sourceCode.AppendLine(" public static class DIExtensions");
        sourceCode.AppendLine(" {");
        sourceCode.AppendLine(" public static IServiceCollection AddGeneratedServices(this IServiceCollection services)");
        sourceCode.AppendLine(" {");

        var compilation = context.Compilation;
        var interfaceType = compilation.GetTypeByMetadataName("MyNamespace.IMyService");

        foreach (var typeSymbol in compilation.GetSymbolsWithName(name => name.EndsWith("Service"), SymbolFilter.Type))
        {
            if (typeSymbol is INamedTypeSymbol namedTypeSymbol && namedTypeSymbol.Interfaces.Contains(interfaceType))
            {
                sourceCode.AppendLine($" services.AddTransient<{namedTypeSymbol.ToDisplayString()}>();");
            }
        }

        sourceCode.AppendLine(" return services;");
        sourceCode.AppendLine(" }");
        sourceCode.AppendLine(" }");
        sourceCode.AppendLine("}");

        context.AddSource("DIRegistrationExtensions", SourceText.From(sourceCode.ToString(), Encoding.UTF8));
    }
}

```

&nbsp;  

##### **2. Compile-Time Validation:**

##### Use source generators to enforce compile-time validation rules, such as ensuring certain attributes are applied to methods or classes. This can catch potential errors early in the development process.

```csharp

using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;
using System.Text;

[Generator]
public class CompileTimeValidationGenerator : ISourceGenerator
{
    public void Initialize(GeneratorInitializationContext context) { }

    public void Execute(GeneratorExecutionContext context)
    {
        var compilation = context.Compilation;
        var attributeSymbol = compilation.GetTypeByMetadataName("MyNamespace.MyCustomAttribute");

        foreach (var classSymbol in compilation.GlobalNamespace.GetNamespaceMembers().SelectMany(ns => ns.GetTypeMembers()))
        {
            if (classSymbol.GetAttributes().Any(ad => ad.AttributeClass!.Equals(attributeSymbol, SymbolEqualityComparer.Default)))
            {
                var hasParameterlessConstructor = classSymbol.Constructors.Any(c => c.Parameters.IsEmpty);

                if (!hasParameterlessConstructor)
                {
                    var diagnostic = Diagnostic.Create(
                        new DiagnosticDescriptor(
                            "GEN002",
                            "Parameterless constructor required",
                            "Class {0} marked with [MyCustomAttribute] must have a parameterless constructor.",
                            "SourceGenerator",
                            DiagnosticSeverity.Error,
                            isEnabledByDefault: true),
                        Location.None,
                        classSymbol.Name);
                    context.ReportDiagnostic(diagnostic);
                }
            }
        }
    }
}

```
&nbsp;  

##### **3. Custom Serialization:**

##### Generate custom serialization logic for your classes based on attributes or interfaces. This can optimize serialization performance by generating code tailored specifically to your class structure.

```csharp

using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;
using System.Text;

[Generator]
public class CustomSerializationGenerator : ISourceGenerator
{
    public void Initialize(GeneratorInitializationContext context) { }

    public void Execute(GeneratorExecutionContext context)
    {
        var compilation = context.Compilation;
        var serializableAttribute = compilation.GetTypeByMetadataName("System.SerializableAttribute");

        foreach (var classSymbol in compilation.GlobalNamespace.GetNamespaceMembers().SelectMany(ns => ns.GetTypeMembers()))
        {
            if (classSymbol.GetAttributes().Any(ad => ad.AttributeClass!.Equals(serializableAttribute, SymbolEqualityComparer.Default)))
            {
                var sb = new StringBuilder();
                sb.AppendLine($"namespace {classSymbol.ContainingNamespace}.Generated");
                sb.AppendLine("{");
                sb.AppendLine($" public static class {classSymbol.Name}Serializer");
                sb.AppendLine(" {");

                sb.AppendLine($" public static string Serialize({classSymbol.Name} obj)");
                sb.AppendLine(" {");
                sb.AppendLine(" // Custom serialization logic");
                sb.AppendLine(" return string.Empty;");
                sb.AppendLine(" }");

                sb.AppendLine(" }");
                sb.AppendLine("}");

                context.AddSource($"{classSymbol.Name}Serializer", SourceText.From(sb.ToString(), Encoding.UTF8));
            }
        }
    }
}

```
&nbsp;  

##### **4. API Client Generation:**
&nbsp;  

##### Source generators can automatically generate API client code based on OpenAPI/Swagger specifications. This ensures that your client code is always in sync with the API definition and reduces the need for manual code updates.

```csharp

using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Text;
using System.Text;

[Generator]
public class ApiClientGenerator : ISourceGenerator
{
    public void Initialize(GeneratorInitializationContext context) { }

    public void Execute(GeneratorExecutionContext context)
    {
        // Pretend this string is loaded from a Swagger specification
        var apiSpec = @" GET /api/values -> string[] POST /api/values -> void";

        var sb = new StringBuilder();
        sb.AppendLine("using System.Net.Http;");
        sb.AppendLine("using System.Threading.Tasks;");
        sb.AppendLine("namespace ApiClientGenerated");
        sb.AppendLine("{");
        sb.AppendLine(" public class ValuesApiClient");
        sb.AppendLine(" {");

        sb.AppendLine(" private readonly HttpClient _httpClient;");
        sb.AppendLine(" public ValuesApiClient(HttpClient httpClient)");
        sb.AppendLine(" {");
        sb.AppendLine(" _httpClient = httpClient;");
        sb.AppendLine(" }");

        sb.AppendLine(" public async Task);
        sb.AppendLine(" {");
        sb.AppendLine(" var response = await _httpClient.GetAsync(\"/api/values\");");
        sb.AppendLine(" response.EnsureSuccessStatusCode();");
        sb.AppendLine(" return await response.Content.ReadAsAsync);
        sb.AppendLine(" }");

        sb.AppendLine(" public async Task PostValuesAsync(string[] values)");
        sb.AppendLine(" {");
        sb.AppendLine(" var response = await _httpClient.PostAsJsonAsync(\"/api/values\", values);");
        sb.AppendLine(" response.EnsureSuccessStatusCode();");
        sb.AppendLine(" }");

        sb.AppendLine(" }");
        sb.AppendLine("}");

        context.AddSource("ValuesApiClient", SourceText.From(sb.ToString(), Encoding.UTF8));
    }
}

```
&nbsp;  
&nbsp;  
### **FileBasedGenerator (Reading code from file)**
&nbsp;  
&nbsp;  

##### If you have C# code in a file and you want to use that code within a source generator to generate additional code or modify existing code, you can read the file's contents and use it as part of your source generation process.
&nbsp;  
##### Here's a step-by-step guide:
&nbsp;  

##### **1. Set Up the Project**
&nbsp;  

##### Let's assume you have a C# file named MyClass.cs with the following content:

```csharp

// MyClass.cs
namespace MyNamespace
{
    public class MyClass
    {
        public void MyMethod()
        {
            // Original method implementation
        }
    }
}

```
&nbsp;  

##### **2. Create the Source Generator**
&nbsp;  

##### In your source generator project, you can read the content of this file and generate additional code based on it.

```csharp

using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Text;
using System.Text;

[Generator]
public class FileBasedGenerator : ISourceGenerator
{
    public void Initialize(GeneratorInitializationContext context) { }

    public void Execute(GeneratorExecutionContext context)
    {
        // Read the content of MyClass.cs
        var sourceFile = context.AdditionalFiles.FirstOrDefault(file => file.Path.EndsWith("MyClass.cs"));

        if (sourceFile != null)
        {
            var fileContent = sourceFile.GetText(context.CancellationToken)?.ToString();

            // Generate additional code based on the content of MyClass.cs
            if (fileContent != null)
            {
                var generatedCode = $@" namespace MyNamespace.Generated {{ public static class MyClassExtensions {{ public static void PrintInfo(this MyClass instance) {{ Console.WriteLine(""MyMethod was called in MyClass""); }} }} }}";

                // Add the generated code to the compilation
                context.AddSource("MyClassExtensions", SourceText.From(generatedCode, Encoding.UTF8));
            }
        }
    }
}
}

```
&nbsp;  

##### **3. Set Up the Consuming Project**
&nbsp;  

##### In the project that consumes this generator, ensure that MyClass.cs is included in the project and add the generator project as a reference.

```xml

<!-- ConsumingProject.csproj -->
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <OutputType>Exe</OutputType>
        <TargetFramework>net6.0</TargetFramework>
    </PropertyGroup>

    <ItemGroup>
        <Compile Include="MyClass.cs" />
        <AdditionalFiles Include="MyClass.cs" />
    </ItemGroup>

    <ItemGroup>
        <ProjectReference Include="..\MySourceGenerator\MySourceGenerator.csproj" />
    </ItemGroup>
</Project>

```
&nbsp;  

##### **4. Use the Generated Code**
&nbsp;  

##### Now, in your consuming project:

```csharp

// Program.cs
using MyNamespace;
using MyNamespace.Generated;

class Program
{
    static void Main(string[] args)
    {
        var myClass = new MyClass();
        myClass.MyMethod();

        // Use the generated extension method
        myClass.PrintInfo();
    }
}

```

&nbsp;  
&nbsp; 
### Best Practices for Using Source Generators
&nbsp;  
&nbsp;  

##### When using source generators in your projects, keep the following best practices in mind:
&nbsp;  

##### **1. Performance Considerations:**
&nbsp;  

##### While source generators can save time during development, they can also introduce additional compile-time overhead. Use incremental generators to minimize this impact, and avoid generating unnecessary code.
&nbsp;  

##### **2. Maintainability:**
&nbsp;  

##### Generated code should be clear and maintainable. Ensure that the generated code follows the same coding standards as the rest of your project. Consider providing documentation or comments in the generated code to aid future maintenance.
&nbsp;  

##### **3. Debugging and Diagnostics:**
&nbsp;  

##### Use the enhanced diagnostic capabilities in C# 12 to provide clear error and warning messages in your source generators. This will help other developers understand and fix issues that arise from the generated code.
&nbsp;  

##### **4. Source Control:**
&nbsp;  

##### Be cautious about checking generated code into source control. In most cases, it’s better to regenerate the code during the build process rather than storing it in the repository.
&nbsp;  

##### **5. Versioning:**
&nbsp;  

##### When updating source generators, ensure that the generated code remains compatible with previous versions. Consider providing migration paths if the generated code changes significantly.

&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  

##### .NET 8 bring exciting enhancements to source generators, making them even more powerful and versatile.
&nbsp;  

##### By leveraging these new features, developers can create more efficient, maintainable, and performant applications.
&nbsp;  

##### Whether you're automating repetitive tasks, enforcing code standards, or optimizing your application’s performance, source generators in C# 12 offer a wealth of possibilities to explore.
&nbsp;  

##### That's all from me today. 
<!--END-->
