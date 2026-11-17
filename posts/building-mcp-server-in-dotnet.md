---
title: "How to Build an MCP Server in C# and .NET"
seo_title: "How to Build an MCP Server in C# and .NET (Step by Step)"
subtitle: "Build an MCP server in C# with the official SDK and the dotnet new mcpserver template, connect it to Claude and GitHub Copilot, then see a real example: a performance lab an AI assistant can drive."
date: "May 14 2026"
updated: "2026-11-16"
category: "AI"
readTime: "Read Time: 14 minutes"
meta_description: "Build an MCP server in C# with the official SDK and dotnet new mcpserver: tools, DI, stdio and HTTP, Claude and Copilot setup, plus a load-testing example."
faq:
  - q: "What is an MCP server in C#?"
    a: >-
      An MCP server is a program that exposes C# methods as tools an AI client can call. You mark a method with
      [McpServerTool] and describe it with [Description]. Claude Desktop, GitHub Copilot in VS Code or your own
      agent reads the tool list and calls the tools when the model needs them.
  - q: "What is the difference between an MCP server and calling the Claude or OpenAI API?"
    a: >-
      With the API, your code drives the conversation and decides what to send to the model. With an MCP server,
      you expose tools and the model decides when to call them during a conversation you didn't script. The API is
      your code calling the model; MCP gives the model controlled access to your code.
  - q: "Which .NET version do I need for the MCP C# SDK?"
    a: >-
      The ModelContextProtocol packages target .NET 8, 9 and 10 and .NET Standard 2.0. The dotnet new mcpserver
      template ships with the .NET 11 SDK and recent .NET 10 SDKs. The code in this post uses
      ModelContextProtocol 2.4.0 on .NET 10.
  - q: "Why do my logs break a stdio MCP server?"
    a: >-
      With the stdio transport, stdout is the protocol channel. Anything printed to stdout is parsed as a JSON-RPC
      message and corrupts the stream. Send logs to stderr with LogToStandardErrorThreshold and never call
      Console.WriteLine from a stdio server.
  - q: "Should I use stdio or HTTP for an MCP server?"
    a: >-
      Use stdio for a local tool that runs on your machine next to the client. Use HTTP when you want to deploy the
      server and let a team or an application connect over the network. The tool classes are the same for both.
  - q: "Does an MCP server replace API performance tests?"
    a: >-
      No. MCP makes test tools available to an assistant. You still need reproducible workloads, a representative
      environment and human review to decide whether a change improves performance.
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored. Instead, let me point you to something I run every day: my <strong>AI for Developers</strong> community, for developers who want to use AI on real code. 50+ ready-to-run skills and agents, with a deep .NET Pack, and the room to figure it out together.</p>

<a href="https://www.skool.com/ai-for-developers/about" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #1a0224; background: #ffbd39; border-radius: 8px; text-decoration: none;">Join the community - 7 days free →</a>

<p style="margin: 16px 0 8px 0; font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.6);">Want to reach thousands of .NET developers like this?</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 7px 14px; font-size: 13px; font-weight: 600; color: #ffffff; background: transparent; border: 1px solid #6366f1; border-radius: 8px; text-decoration: none;">Sponsor TheCodeMan →</a>
</div>

**Keywords:** MCP server C#, MCP server .NET, Model Context Protocol C#, MCP C# SDK, ModelContextProtocol NuGet, dotnet new mcpserver, MCP server template, ASP.NET Core MCP server, MCP stdio, MCP HTTP transport, Claude MCP server C#, GitHub Copilot MCP server, MCP tools DI

## What Is an MCP Server in C#?

An MCP server is a program that exposes your C# methods as tools an AI assistant can call. Claude Desktop, GitHub Copilot in VS Code or your own agent connects to the server, reads the list of tools, and calls one when the model decides it needs it. You build one in .NET with the official MCP C# SDK: mark a method with `[McpServerTool]`, describe it, and register the server in `Program.cs`.

This post covers the whole path. First the fastest start with the `dotnet new mcpserver` template, then a server built by hand with tools that use your own services through dependency injection, then the switch from stdio to HTTP. The second half is a real example: a performance lab where GitHub Copilot runs load tests against a .NET API through MCP tools.

The code uses ModelContextProtocol 2.4.0 on .NET 10.

## Why You Need It: The Model Can't Reach Your Code or Data

When you work through a problem with Claude, it often needs data that only your systems have. It asks what an order looks like in the database, so you run the query yourself and paste the result back. Then it needs a config value, so you copy that. Then a log line. Each time, you move something out of your environment by hand and paste it into the chat.

The model is doing the reasoning, but all the fetching is manual.

The Model Context Protocol (MCP) removes that step. It's a standard way to give a model a set of tools it can call on its own - query a database, hit an internal API, read a file - instead of you moving data back and forth. The C# SDK is maintained by Microsoft together with the MCP project.

## How an MCP Server Works

An MCP server advertises a list of **tools**. Each tool is a function with a name, a description and typed parameters. A client connects to the server, reads that list, and when the model decides it needs one, the client calls it and feeds the result back into the conversation.

The description matters more than it looks. The model doesn't see your code. It sees the tool's name and description and uses them to decide when to call it. A vague description means the model won't know when the tool applies.

![How an MCP tool call works in C#: the MCP client lists tools, calls get_order on your MCP server, which queries your database and returns the result](/images/blog/posts/building-mcp-server-in-dotnet/mcp-request-flow.webp)

There are two transports you'll use in practice. **stdio** runs the server as a local child process and talks over standard input and output, which suits a tool that runs on your own machine. **HTTP** runs it as a web service you can host and share with a team. The tool classes are the same for both.

## The Fastest Start: dotnet new mcpserver

Current .NET SDKs include an MCP server project template: it ships with the .NET 11 SDK and with recent .NET 10 SDKs (it's in 10.0.404). It creates a working server with one sample tool:

```bash
dotnet new mcpserver -n TheCodeMan.Mcp
```

The template has two options worth knowing. `--transport` picks `local` (a console app with stdio, the default) or `remote` (an ASP.NET Core app with HTTP). On the .NET 11 SDK, `--framework` picks `net11.0` (the default) or `net10.0`, so you can stay on the LTS release:

```bash
dotnet new mcpserver -n TheCodeMan.Mcp.Http --transport remote --framework net10.0
```

The local version generates a `Program.cs`, a `Tools/RandomNumberTools.cs` file with one sample tool, a README, and a `.mcp/server.json` file. The project is set up to be packed as a .NET tool with `PackageType` set to `McpServer`, so you can publish it to NuGet and let others run it. The generated `Program.cs` looks like this:

```csharp
var builder = Host.CreateApplicationBuilder(args);

// Configure all logs to go to stderr (stdout is used for the MCP protocol messages).
builder.Logging.AddConsole(o => o.LogToStandardErrorThreshold = LogLevel.Trace);

// Add the MCP services: the transport to use (stdio) and the tools to register.
builder.Services
    .AddMcpServer()
    .WithStdioServerTransport()
    .WithTools<RandomNumberTools>();

await builder.Build().RunAsync();
```

If `dotnet new mcpserver` isn't found on an older SDK, install the template from NuGet with `dotnet new install Microsoft.McpServer.ProjectTemplates`. The rest of this post builds the server by hand, so you can see what each line does.

## Build the Server by Hand

Start with a plain console app and add two packages:

```bash
dotnet new console -n TheCodeMan.Mcp
cd TheCodeMan.Mcp
dotnet add package ModelContextProtocol
dotnet add package Microsoft.Extensions.Hosting
```

The SDK ships in three packages. `ModelContextProtocol` is the one for a stdio server: it brings hosting, dependency injection and attribute-based tool discovery. `ModelContextProtocol.Core` is the leaner package if you only need the client or the low-level server APIs, and `ModelContextProtocol.AspNetCore` is for HTTP, which we'll get to.

Here's the full `Program.cs`:

```csharp
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

var builder = Host.CreateApplicationBuilder(args);

// stdio is the transport, so stdout is reserved for protocol messages.
// Send every log to stderr or you'll corrupt the JSON-RPC stream.
builder.Logging.AddConsole(options =>
{
    options.LogToStandardErrorThreshold = LogLevel.Trace;
});

builder.Services
    .AddMcpServer()
    .WithStdioServerTransport()
    .WithToolsFromAssembly();

await builder.Build().RunAsync();
```

The comment about stderr is the thing that trips people up the first time. With stdio, the client and server exchange JSON-RPC over stdout. If any part of your app writes to stdout - a stray `Console.WriteLine` - it corrupts the protocol and the client just waits. Route logs to stderr and don't print to stdout yourself.

`WithToolsFromAssembly()` scans the assembly for classes marked with `[McpServerToolType]`, so you don't register each one by hand. The template uses `WithTools<T>()` instead, which registers one class explicitly. Both work. Next, give the server a tool to find.

## Your First MCP Tool

A tool is a method. Mark the class with `[McpServerToolType]`, mark the method with `[McpServerTool]`, and describe both the tool and its parameters:

```csharp
using System.ComponentModel;
using ModelContextProtocol.Server;

[McpServerToolType]
public static class EchoTool
{
    [McpServerTool, Description("Echoes the message back to the client.")]
    public static string Echo(string message) => $"Hello from C#: {message}";
}
```

The `Description` attributes are the interface the model reasons over, not documentation for humans. "Echoes the message back" is what tells the model when the tool is useful. Write each description as the text the model reads before it decides whether to call the tool.

The SDK turns method names into snake_case tool names, so `Echo` is advertised as `echo` and a method called `GetOrder` becomes `get_order`. Set `[McpServerTool(Name = "...")]` if you want a different name.

## Connect the Tools to Your Real Code

Echo is a hello-world. The point is to expose *your* system - a database, an internal service, a cache. That's where dependency injection comes in, and the C# SDK uses the DI container you already know.

Say you have a service that reads orders. Register it like any other dependency:

```csharp
builder.Services.AddSingleton<OrderService>();

builder.Services
    .AddMcpServer()
    .WithStdioServerTransport()
    .WithToolsFromAssembly();
```

A tool method can take that service as a parameter, and the SDK injects it from the container the same way a Minimal API endpoint receives its dependencies. The other parameters are values the model fills in:

```csharp
using System.ComponentModel;
using System.Text.Json;
using ModelContextProtocol.Server;

[McpServerToolType]
public static class OrderTools
{
    [McpServerTool, Description("Gets a single order by its numeric id.")]
    public static async Task<string> GetOrder(
        OrderService orders,
        [Description("The numeric id of the order to fetch")] int id)
    {
        var order = await orders.GetByIdAsync(id);
        return order is null
            ? $"No order found with id {id}."
            : JsonSerializer.Serialize(order);
    }

    [McpServerTool, Description("Lists recent orders for a customer by email.")]
    public static async Task<string> GetOrdersForCustomer(
        OrderService orders,
        [Description("The customer's email address")] string email)
    {
        var results = await orders.GetRecentByEmailAsync(email);
        return JsonSerializer.Serialize(results);
    }
}
```

Note the split: `OrderService` comes from DI, while `id` and `email` come from the model. Only the model-supplied parameters appear in the tool's input schema. Returning JSON is a reasonable default - it's structured enough for the model to parse and turn into a table or a summary. Behind `OrderService` there's nothing special: EF Core, Dapper or an HTTP call to another service.

A few habits that help once real callers use these tools:

- **Return a clear message on the empty case**, like the "No order found" string above. The model handles an explicit "nothing matched" better than an empty payload it has to guess about.
- **Keep parameter lists small and name them for what they are.** `email` is better than `param1`, because the model maps the user's intent onto the parameter names.
- **Don't expose more than the task needs.** A tool that reads any order is convenient. One that reads any order *and* refunds it is risky. Scope tools to what you'd let an assistant do without supervision.

## Connect Claude Desktop and GitHub Copilot

For Claude Desktop, register the server in `claude_desktop_config.json` (Settings → Developer → Edit Config):

```json
{
  "mcpServers": {
    "thecodeman-orders": {
      "command": "dotnet",
      "args": [
        "run",
        "--project",
        "C:\\code\\TheCodeMan.Mcp\\TheCodeMan.Mcp.csproj"
      ]
    }
  }
}
```

For GitHub Copilot in VS Code, add a `.vscode/mcp.json` file to the workspace:

```json
{
  "servers": {
    "thecodeman-orders": {
      "type": "stdio",
      "command": "dotnet",
      "args": ["run", "--project", "TheCodeMan.Mcp/TheCodeMan.Mcp.csproj"]
    }
  }
}
```

You don't run the project yourself. The client starts it as a child process over stdio, reads the tool list and shows the tools as available. Ask something that needs one, such as "what's on order 42?", and the client asks for permission to call `get_order`, runs it and answers from the result. In Copilot, use Agent mode so it can call tools.

## Switch the MCP Server to HTTP

stdio works for a tool that runs on your machine. When you want a server a team - or a deployed app - can reach, switch to HTTP. That's a different package and a slightly different `Program.cs`, but the tool classes don't change:

```bash
dotnet new web -n TheCodeMan.Mcp.Http
dotnet add package ModelContextProtocol.AspNetCore
```

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<OrderService>();

builder.Services
    .AddMcpServer()
    .WithHttpTransport(options =>
    {
        // Stateless is fine when you don't need server-to-client
        // callbacks like sampling or elicitation.
        options.Stateless = true;
    })
    .WithToolsFromAssembly();

var app = builder.Build();
app.MapMcp("/mcp");
app.Run("http://localhost:3001");
```

Same `[McpServerTool]` methods, same DI. Version 2.0 of the SDK implemented the 2026-07-28 revision of the MCP specification, which reworked how MCP runs over HTTP. The `remote` template sets `Stateless = true` explicitly, and so does the code above.

Clients connect to the URL instead of starting a process. In `.vscode/mcp.json` that's `"type": "http"` with `"url": "http://localhost:3001/mcp"`.

One security note: for local HTTP servers, keep `AllowedHosts` limited to loopback values rather than `"*"`, and only enable CORS if you need browser access. An MCP endpoint that reaches into your data shouldn't be reachable by a stray web page through DNS rebinding. For a server other people use, add authentication; the SDK documentation covers the OAuth setup.

## A Real Example: A Performance Lab GitHub Copilot Can Drive

The orders example is small so the mechanics are clear. Here is a larger one I built for my own .NET work: an MCP server that lets GitHub Copilot run load tests against an API, compare endpoints and point out common performance problems. I describe the test in a chat message, Copilot calls the tools, and the server returns real measurements.

A session looks like this:

> **Me:** Compare `http://localhost:5100/slow-thread-sleep` with `http://localhost:5100/slow-task-delay` - 15 seconds, 20 concurrent users.

> **Copilot:**
> ```
> BASELINE  → /slow-thread-sleep    CANDIDATE → /slow-task-delay
>
> Throughput:  35.1 RPS              →  39.9 RPS   (✅ +13.5%)
> Average:     554ms                 →  501ms       (✅ -9.6%)
> P95:        1000ms                 →  503ms       (✅ -49.7%)
> P99:        1002ms                 →  507ms       (✅ -49.3%)
>
> VERDICT: ✅ Candidate is faster
> ```

That is two load tests against a running server and a comparison with percentage deltas, from one message.

![GitHub Copilot chat showing the compare_endpoints output with throughput and latency numbers](/images/blog/posts/building-mcp-server-in-dotnet/compare-endpoints.webp)

The p95 and p99 numbers show the difference. `Thread.Sleep` holds a ThreadPool thread for 500ms. Under 20 concurrent users, threads run out and requests queue up, so tail latency grows. `Task.Delay` releases the thread while it waits: the same delay, but different behavior under load.

I also built a Blazor dashboard to visualize the results and comparisons. It's a plain REST client that reads from the same data store as the MCP server.

![Blazor dashboard showing performance results](/images/blog/posts/building-mcp-server-in-dotnet/blazor.webp)

### Project Structure

Four projects, each with one job:

```text
PerformanceLab.Api        → port 5100  - sample API with intentional anti-patterns
PerformanceLab.McpServer  → port 5200  - MCP server + load test engine
PerformanceLab.Dashboard  → port 5300  - Blazor dashboard for visualizing results
PerformanceLab.Shared                  - shared models
```

![VS Code showing the four-project solution structure](/images/blog/posts/building-mcp-server-in-dotnet/project-structure.png)

The dashboard and the MCP server share the same `IResultStore`, but are otherwise decoupled. The AI talks to `/mcp`. The dashboard reads from `/api/results`.

### The API: Endpoints With Known Problems

`PerformanceLab.Api` is a minimal ASP.NET Core API where each endpoint demonstrates a performance anti-pattern, so the tools have something measurable to find.

```csharp
// ❌ Blocks a ThreadPool thread for the entire wait duration
app.MapGet("/slow-thread-sleep", (int ms = 500) =>
{
    Thread.Sleep(ms);
    return Results.Ok(new { message = "done", blockedMs = ms });
});

// ✅ Releases the thread back to the pool while waiting
app.MapGet("/slow-task-delay", async (int ms = 500) =>
{
    await Task.Delay(ms);
    return Results.Ok(new { message = "done", waitedMs = ms });
});
```

From the caller's side these look identical. Under load with 20 concurrent users they behave very differently: once the ThreadPool runs out of threads, new requests queue up behind the blocked ones.

```csharp
// ❌ Five queries one after another - ~250ms total
app.MapGet("/database-simulation", async () =>
{
    var results = new List<string>();
    for (int i = 1; i <= 5; i++)
    {
        await Task.Delay(50); // simulate a DB query
        results.Add($"Record {i}");
    }
    return Results.Ok(results);
});

// ✅ All five queries at the same time - ~50ms total
app.MapGet("/optimized-version", async () =>
{
    var tasks = Enumerable.Range(1, 5).Select(async i =>
    {
        await Task.Delay(50);
        return $"Record {i}";
    });
    var results = await Task.WhenAll(tasks);
    return Results.Ok(results);
});
```

The queries don't depend on each other's results, so there's no reason to wait for each one. There are also `/memory-heavy` (allocates large arrays to trigger GC pressure) and `/cpu-heavy` (SHA256 in a tight loop) endpoints, each with a different signature the analyzer can detect.

### The MCP Server and Its Tools

The MCP server is an ASP.NET Core app with the same setup as the HTTP example above, plus the services the tools need and a CORS policy for the dashboard:

```csharp
builder.Services.AddSingleton<IResultStore, InMemoryResultStore>();
builder.Services.AddScoped<LoadTestRunner>();
builder.Services.AddScoped<ResultAnalyzer>();

builder.Services
    .AddMcpServer()
    .WithHttpTransport()
    .WithToolsFromAssembly();

builder.Services.AddCors(opts =>
    opts.AddPolicy("dashboard", policy =>
        policy.WithOrigins("http://localhost:5300")
              .AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors("dashboard");

app.MapMcp("/mcp");                        // ← AI clients connect here
app.MapGet("/api/results", (IResultStore store) =>
    Results.Ok(store.GetAll()));           // ← Dashboard reads here
```

The tools live in a non-static class this time, so the services come in through the primary constructor instead of method parameters:

```csharp
[McpServerToolType]
public sealed class PerformanceTools(
    LoadTestRunner runner,
    ResultAnalyzer analyzer,
    IResultStore   store)
{
    [McpServerTool(Name = "run_load_test")]
    [Description(
        "Run a load test against an API endpoint. Fires concurrent HTTP requests for the " +
        "specified duration and returns throughput, latency percentiles, and error rate. " +
        "Returns a result ID that can be passed to analyze_results or generate_report.")]
    public async Task<string> RunLoadTest(
        [Description("Full URL of the endpoint to test. Example: http://localhost:5100/fast")]
        string url,

        [Description("How many seconds the test should run. Default: 10")]
        int durationSeconds = 10,

        [Description("Number of virtual concurrent users (parallel HTTP connections). Default: 10")]
        int concurrentUsers = 10,

        CancellationToken cancellationToken = default)
    {
        var request = new LoadTestRequest
        {
            Url             = url,
            DurationSeconds = durationSeconds,
            ConcurrentUsers = concurrentUsers,
        };

        var result   = await runner.RunAsync(request, cancellationToken);
        var analysis = analyzer.Analyze(result);
        store.Add(result, analysis);

        return FormatLoadTestResult(result, analysis);
    }
```

The description says what the tool returns and what to do with the result ID, so the model knows it can chain `run_load_test` into `analyze_results`. Default values show up in the tool schema, so the model can leave them out. The `CancellationToken` isn't part of the schema; the SDK passes it in.

The server exposes 10 tools: `run_load_test`, `compare_endpoints`, `analyze_results`, `detect_slow_responses`, `detect_threadpool_starvation`, `detect_memory_pressure`, `list_results`, `compare_before_after`, `suggest_optimizations` and `generate_report`.

### The Load Test Runner

No k6 and no JMeter, only .NET:

```csharp
public async Task<LoadTestResult> RunAsync(LoadTestRequest request, CancellationToken ct)
{
    var records = new ConcurrentBag<RequestRecord>();
    var endAt   = DateTime.UtcNow.AddSeconds(request.DurationSeconds);

    using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(ct);
    linkedCts.CancelAfter(TimeSpan.FromSeconds(request.DurationSeconds + 15));

    var workerTasks = Enumerable
        .Range(0, request.ConcurrentUsers)
        .Select(_ => RunWorkerAsync(request, records, endAt, linkedCts.Token))
        .ToArray();

    await Task.WhenAll(workerTasks);

    return BuildResult(request, [.. records]);
}
```

`Task.WhenAll` starts one worker per virtual user. Each worker sends requests in a loop until the time window closes, and `ConcurrentBag<RequestRecord>` collects every result without locking. The `HttpClient` used by the workers needs a higher connection limit, or the test measures the client instead of the server:

```csharp
builder.Services.AddHttpClient("loadtest", client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
}).ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
{
    AllowAutoRedirect       = false,
    MaxConnectionsPerServer = 1000,
});
```

### The Rule-Based Analyzer

The analyzer is plain C# - no model involved. It applies a few rules and returns a severity with recommendations:

```csharp
public AnalysisResult Analyze(LoadTestResult result)
{
    var issues          = new List<string>();
    var recommendations = new List<string>();

    // ThreadPool starvation: p99 is 10× higher than p50
    if (result.P50Ms > 0 && result.P99Ms / result.P50Ms > 10)
    {
        var ratio = result.P99Ms / result.P50Ms;
        issues.Add(
            $"High latency variance - p99 is {ratio:F0}× higher than p50. " +
            "Classic ThreadPool starvation signature.");
        recommendations.Add(
            "Search for Thread.Sleep(), .Result, .Wait(), GetAwaiter().GetResult(). " +
            "Replace them all with async/await.");
    }

    // GC pause: one request was far slower than p99
    if (result.MaxMs > result.P99Ms * 3)
    {
        issues.Add(
            $"Max ({result.MaxMs:F0}ms) is 3× higher than p99 ({result.P99Ms:F0}ms). " +
            "Suggests occasional GC pauses.");
    }

    // Low throughput with many users = severe blocking
    if (result.RequestsPerSecond < 5 && result.ConcurrentUsers >= 10)
    {
        issues.Add(
            $"Very low throughput: {result.RequestsPerSecond:F1} RPS with " +
            $"{result.ConcurrentUsers} concurrent users. Suggests severe blocking.");
    }

    return new AnalysisResult
    {
        Severity        = DetermineSeverity(issues),
        Issues          = issues,
        Recommendations = recommendations,
    };
}
```

The model adds the context the rules don't have: the URL, any code you've shown it, and results from earlier runs in the same conversation.

### Reading the Numbers: p50, p95, p99

Sort 1,000 requests by response time:

- **p50 (median):** the 500th. Half your users are faster, half are slower.
- **p95:** the 950th. 1 in 20 users is slower than this.
- **p99:** the 990th. 1% of users get this or worse.

Here is a comparison from two endpoints in the lab:

```text
/fast  (healthy) - 10 users, 5 seconds
  RPS:     2,395.6
  Average:     4ms
  P95:         8ms
  P99:        12ms

/slow-thread-sleep (starved) - 20 users, 15 seconds
  RPS:        35.1
  Average:   554ms
  P95:      1000ms
  P99:      1002ms
```

For `/slow-thread-sleep`, the starvation shows up mostly as the throughput drop (2,395 RPS → 35 RPS), not as a high p99/p50 ratio, because every request waits for a thread for about the same time.

![Load test output showing RPS and latency for the fast vs slow-thread-sleep endpoints](/images/blog/posts/building-mcp-server-in-dotnet/p-results.png)

### The Dashboard and the Copilot Setup

The dashboard polls `/api/results` and renders the data with Chart.js. The Compare page puts two results side by side with percentage deltas. Nothing in the dashboard knows about MCP.

![Dashboard compare page showing Thread.Sleep vs Task.Delay with throughput and latency delta columns](/images/blog/posts/building-mcp-server-in-dotnet/compare-dashboard.webp)

To connect Copilot, add the HTTP server to `.vscode/mcp.json`:

```json
{
  "servers": {
    "performance-lab": {
      "type": "http",
      "url": "http://localhost:5200/mcp"
    }
  }
}
```

Start the three services, open Copilot in Agent mode and ask things like:

```text
Run a load test against http://localhost:5100/fast for 5 seconds with 10 users
```

```text
Compare http://localhost:5100/slow-thread-sleep with http://localhost:5100/slow-task-delay
using 15 seconds and 20 concurrent users
```

```text
Generate a full performance report for the last two runs
```

The full project - all four services, the 10 MCP tools, the Blazor dashboard and the tests - is part of the [AI in .NET Starter Kit](https://thecodeman.net/ai-in-dotnet-starter-kit). It was first written against a preview of the SDK; the tool code shown here also builds on ModelContextProtocol 2.4.0.

## What Else You Can Expose as MCP Tools

A tool is a C# method, so it can be anything you already have code for:

- A read-only query against a replica that answers "how many signups yesterday" without you writing the SQL by hand.
- A call to an internal service the model would otherwise have no way to reach.
- A tool that runs `EXPLAIN` on a slow query, reads a feature-flag state or queries your CI pipeline.

The general pattern is the same as in the performance lab: build tools around services you already have. Your tools return real data, and the model reasons over it.

## Wrapping Up

An MCP server in C# is small: a console or web app, one SDK package, and methods marked with `[McpServerTool]` and a description. `dotnet new mcpserver` gives you a working project in one command. The descriptions are the part to spend time on, because they're what the model reads to decide when to call each tool. Once the server is running, Claude or Copilot can pull the data it needs instead of asking you to copy and paste it.

Start with one question you keep answering by hand, wrap the query you already have in a tool, and connect it over stdio. Moving to HTTP later only changes `Program.cs`.

This post is part of the free [AI for .NET Developers](https://thecodeman.net/ai-for-dotnet-developers) guide. Related posts:

- [Build an AI agent in C# with Microsoft Agent Framework](https://thecodeman.net/posts/ai-agent-in-csharp-microsoft-agent-framework) - an agent that calls tools from your own code.
- [Generate .NET architecture diagrams on Miro with MCP](https://thecodeman.net/posts/ai-architecture-diagrams-miro-mcp) - an MCP server from the client side.
- [4 Claude Code features for .NET](https://thecodeman.net/posts/claude-code-hooks-headless-mcp-rewind) - including MCP servers in Claude Code.

For the official reference and samples, see the [MCP C# SDK repository](https://github.com/modelcontextprotocol/csharp-sdk).

That's all from me today.

<!--END-->
