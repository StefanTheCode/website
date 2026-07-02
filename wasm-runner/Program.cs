using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Loader;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;

// Entry point: nothing to do. The JS side keeps the runtime alive and calls
// Playground.Runner.Run(code) via the assembly exports (dotnet.create()).
return;

namespace Playground
{
    public static partial class Runner
    {
        // Reference assemblies (image-based, no file location needed) give the
        // user's code a BCL to compile against inside the browser sandbox.
        private static readonly MetadataReference[] References =
            Basic.Reference.Assemblies.Net80.References.All.ToArray();

        // Parse as a real program (top-level statements + type declarations),
        // NOT as a script — the scripting layer tries to reference the host
        // assembly by Assembly.Location, which is empty on WASM and throws
        // "Can't create a metadata reference to an assembly without location."
        private static readonly CSharpParseOptions ParseOptions =
            new(LanguageVersion.Latest, kind: SourceCodeKind.Regular);

        private static readonly CSharpCompilationOptions CompilationOptions =
            new CSharpCompilationOptions(OutputKind.ConsoleApplication)
                .WithOptimizationLevel(OptimizationLevel.Debug)
                .WithPlatform(Platform.AnyCpu)
                .WithConcurrentBuild(false)                 // single-threaded WASM
                .WithNullableContextOptions(NullableContextOptions.Disable);

        // Common usings so self-contained snippets can skip the boilerplate.
        // Provided as global usings; a duplicate `using` in the user's code is
        // just a warning (we only fail on errors), so both styles work.
        private const string GlobalUsings =
            "global using System;\n" +
            "global using System.Collections.Generic;\n" +
            "global using System.Linq;\n" +
            "global using System.Text;\n" +
            "global using System.Threading.Tasks;\n" +
            "global using System.Linq.Expressions;\n";

        /// <summary>
        /// Compiles and runs a self-contained C# program, capturing Console
        /// output. Returns JSON: { "ok": bool, "output": string }.
        /// </summary>
        [JSExport]
        public static string Run(string code)
        {
            var captured = new StringBuilder();
            var original = Console.Out;
            Console.SetOut(new StringWriter(captured));

            try
            {
                var trees = new[]
                {
                    CSharpSyntaxTree.ParseText(GlobalUsings, ParseOptions),
                    CSharpSyntaxTree.ParseText(code, ParseOptions),
                };

                var compilation = CSharpCompilation.Create(
                    assemblyName: "UserScript_" + Guid.NewGuid().ToString("N"),
                    syntaxTrees: trees,
                    references: References,
                    options: CompilationOptions);

                using var peStream = new MemoryStream();
                var emit = compilation.Emit(peStream);

                if (!emit.Success)
                {
                    var errors = emit.Diagnostics
                        .Where(d => d.Severity == DiagnosticSeverity.Error)
                        .Select(FormatDiagnostic);
                    return Serialize(false, Combine(captured.ToString(), string.Join("\n", errors)));
                }

                peStream.Seek(0, SeekOrigin.Begin);
                var assembly = AssemblyLoadContext.Default.LoadFromStream(peStream);

                var entry = assembly.EntryPoint;
                if (entry is null)
                    return Serialize(false, Combine(captured.ToString(),
                        "No entry point. Add top-level statements or a static Main method."));

                var args = entry.GetParameters().Length == 1
                    ? new object?[] { Array.Empty<string>() }
                    : null;

                var result = entry.Invoke(null, args);
                if (result is Task task)
                    task.GetAwaiter().GetResult();

                return Serialize(true, captured.ToString());
            }
            catch (TargetInvocationException ex) when (ex.InnerException is not null)
            {
                var inner = ex.InnerException!;
                return Serialize(false, Combine(captured.ToString(), $"{inner.GetType().Name}: {inner.Message}"));
            }
            catch (Exception ex)
            {
                return Serialize(false, Combine(captured.ToString(), $"{ex.GetType().Name}: {ex.Message}"));
            }
            finally
            {
                Console.SetOut(original);
            }
        }

        private static string FormatDiagnostic(Diagnostic d)
        {
            var line = d.Location.GetLineSpan().StartLinePosition.Line + 1;
            return $"({line}): {d.Id}: {d.GetMessage()}";
        }

        private static string Combine(string output, string error) =>
            string.IsNullOrEmpty(output) ? error : output + "\n" + error;

        private static string Serialize(bool ok, string output) =>
            JsonSerializer.Serialize(new RunResult(ok, output));

        private record RunResult(bool ok, string output);
    }
}
