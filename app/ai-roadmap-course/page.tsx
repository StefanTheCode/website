import { Metadata } from 'next'
import Script from 'next/script'
import { codeToHtml } from 'shiki'
import FreeMotion from '../../components/free/FreeMotion'
import CodeFrame from '../../components/CodeFrame'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: 'AI Roadmap Course for .NET Developers - Use AI to Build .NET Faster',
  description:
    'Free written course for .NET developers: make Claude Code write YOUR .NET with CLAUDE.md, then turn it into a specialist with skills and agents. Real code, cheat sheets, glossary - no theory.',
  keywords: [
    'AI course for .NET developers',
    'Claude Code .NET',
    'CLAUDE.md',
    'Claude skills .NET',
    'AI agents .NET',
    'use AI to build .NET',
    'AI coding assistant .NET',
    '.NET AI course',
    'Claude Code course',
    'AI for C# developers',
  ],
  alternates: { canonical: 'https://thecodeman.net/ai-roadmap-course' },
  openGraph: {
    title: 'AI Roadmap Course for .NET Developers - Use AI to Build .NET Faster',
    type: 'article',
    url: 'https://thecodeman.net/ai-roadmap-course',
    description:
      'Free written course: make Claude Code write YOUR .NET with CLAUDE.md, then turn it into a specialist with skills and agents. Real code, no theory.',
    siteName: 'TheCodeMan.net',
    images: ['/og-course.webp'],
  },
  twitter: {
    title: 'AI Roadmap Course for .NET Developers - Use AI to Build .NET Faster',
    card: 'summary_large_image',
    site: '@TheCodeMan__',
    creator: '@TheCodeMan__',
    description:
      'Free written course: make Claude Code write YOUR .NET, then turn it into a specialist with skills and agents.',
    images: ['/og-course.webp'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Course',
      name: 'AI Roadmap Course for .NET Developers - Track A',
      description:
        'A free written course teaching .NET developers to use AI effectively: Claude Code + CLAUDE.md, and building a .NET specialist with skills and agents.',
      url: 'https://thecodeman.net/ai-roadmap-course',
      inLanguage: 'en',
      isAccessibleForFree: true,
      provider: { '@type': 'Organization', name: 'TheCodeMan', url: 'https://thecodeman.net' },
      author: { '@type': 'Person', name: 'Stefan Đokić', url: 'https://thecodeman.net' },
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT2H' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thecodeman.net' },
        { '@type': 'ListItem', position: 2, name: 'AI Roadmap Course', item: 'https://thecodeman.net/ai-roadmap-course' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Does this only work with Claude Code?', acceptedAnswer: { '@type': 'Answer', text: 'The lessons use Claude Code, but the ideas map across tools: CLAUDE.md maps to Cursor rules and Copilot instructions, and skills/agents/MCP are increasingly supported everywhere.' } },
        { '@type': 'Question', name: 'Do I need to know AI/ML math for this?', acceptedAnswer: { '@type': 'Answer', text: 'No. This is applied engineering, not data science. You will not derive a transformer - you will ship features.' } },
        { '@type': 'Question', name: 'My skill is not triggering - what is wrong?', acceptedAnswer: { '@type': 'Answer', text: 'Almost always the description. Make it specific about when to fire, add synonyms, and reopen the session.' } },
      ],
    },
  ],
}

/* ---------- shared styles (match the site's card look) ---------- */
const card = { border: '1px solid var(--tk-line)', borderRadius: '16px', background: 'var(--tk-card-bg)' }
const th = { textAlign: 'left' as const, padding: '10px 14px', color: '#a49dcb', fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }
const td = { textAlign: 'left' as const, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', verticalAlign: 'top' as const, color: '#e9e7f6', fontSize: '14px' }
const tableWrap = { ...card, overflow: 'hidden', margin: '16px 0' }
const table = { width: '100%', borderCollapse: 'collapse' as const }
const muted = { color: '#cfc9f2' }

function callout(accent: string, bg: string) {
  return { border: `1px solid ${accent}`, borderRadius: '14px', background: bg, padding: '18px 20px', margin: '18px 0' }
}
const tip = { box: callout('rgba(80,250,123,.35)', 'rgba(80,250,123,.07)'), color: '#50fa7b' }
const never = { box: callout('rgba(255,122,144,.35)', 'rgba(255,122,144,.07)'), color: '#ff7a90' }
const warn = { box: callout('rgba(249,184,1,.4)', 'rgba(249,184,1,.07)'), color: '#f9b801' }
const good = { box: callout('rgba(124,92,255,.4)', 'rgba(124,92,255,.08)'), color: '#c7b8ff' }

/* ---------- data ---------- */
const parts = [
  { label: '1 · Claude Code + CLAUDE.md', href: '#part1', state: 'on' },
  { label: '2 · Skills & Agents', href: '#part2', state: 'on' },
  { label: '3 · MCP in C#', href: '#part3', state: 'on' },
  { label: '4 · Your first AI feature', href: '#part4', state: 'on' },
  { label: '5 · Workflow', href: '#part5', state: 'on' },
  { label: '🔧 Projects', href: '#projects', state: 'link' },
  { label: '⚡ Cheat sheet', href: '#reference', state: 'link' },
  { label: 'Glossary', href: '#glossary', state: 'link' },
  { label: 'FAQ', href: '#faq', state: 'link' },
]

const claudeMdLives = [
  ['~/.claude/CLAUDE.md', 'You, every project', 'Your personal defaults (e.g. "always explain your plan first")'],
  ['CLAUDE.md (repo root)', 'The whole team', 'Stack, architecture, conventions - commit it so everyone shares it'],
  ['CLAUDE.local.md', 'Just you, this repo', 'Personal notes for this project - add it to .gitignore'],
]

const promptCheat = [
  ['"Make this better"', '"Optimize this for readability and remove the N+1 - don\'t change behavior"'],
  ['"Add auth"', '"Add JWT bearer auth with policy-based authorization; secrets in config"'],
  ['"Fix the bug"', '"Here\'s the exception + stack trace. Find the root cause and give the minimal fix - no try/catch that hides it"'],
  ['"Write tests"', '"Write integration tests with WebApplicationFactory + Testcontainers: happy path, validation, not-found"'],
  ['"Refactor this"', '"Refactor to the Result pattern; leave anything already idiomatic alone"'],
]

const badDefaults = [
  ['DateTime.Now', 'TimeProvider', 'Testable, deterministic time'],
  ['Repository over EF Core', 'DbContext directly', 'DbContext is already a UoW + repository'],
  ['AutoMapper', 'Explicit mapping / projection', 'No hidden reflection; project in EF queries'],
  ['Exceptions for not-found', 'Result pattern + ProblemDetails', 'Expected outcomes aren\'t exceptional'],
  ['new HttpClient()', 'IHttpClientFactory', 'Avoids socket exhaustion'],
  ['Manual cache serialize', 'HybridCache', 'L1+L2, tag invalidation, stampede protection'],
  ['Results.Ok(...)', 'TypedResults', 'Typed, testable, better OpenAPI'],
  ['UseInMemoryDatabase in tests', 'Testcontainers', 'Real engine catches real bugs'],
]

const skillsLive = [
  ['~/.claude/skills/ · ~/.claude/agents/', 'Every project (personal)'],
  ['.claude/skills/ · .claude/agents/ (in the repo)', 'Just this project - commit to share with the team'],
  ['A plugin marketplace (like the ToolKit)', 'Every project, and you get updates with one command'],
]

const refWhere = [
  ['CLAUDE.md (repo root)', 'Project context - commit it'],
  ['~/.claude/CLAUDE.md', 'Your personal defaults, every project'],
  ['.claude/skills/<name>/SKILL.md', 'A skill'],
  ['.claude/agents/<name>.md', 'An agent'],
  ['.claude/commands/<name>.md', 'A slash command'],
  ['.mcp.json (repo root)', 'MCP servers (tools) the AI can call - Part 3'],
]

const hooks = [
  ['Post-edit on *.cs', 'Runs dotnet format - every file stays clean automatically'],
  ['Pre-commit', 'Blocks DateTime.Now, async void, new HttpClient() in staged files'],
  ['Pre-bash guard', 'Blocks destructive git ops (force push, reset --hard)'],
]

/* ---------- Part 3 data ---------- */
const mcpWhen = [
  ['Write code your way', 'CLAUDE.md + skills (Parts 1-2)'],
  ['Review the whole repo and report back', 'An agent (Part 2)'],
  ['Do something in your systems - query a DB, call your API, check a ticket', 'An MCP tool (this lesson)'],
]
const mcpTransports = [
  ['stdio', 'Local dev - the client launches your server', 'The client starts your process and talks over stdin/stdout'],
  ['Streamable HTTP', 'A shared or remote server many clients use', 'You host it (ASP.NET Core) and clients connect over HTTP'],
]

/* ---------- Part 4 data ---------- */
const providerSwap = [
  ['OpenAI', 'new ChatClient("gpt-4o-mini", key).AsIChatClient()', 'Default - cheap and capable'],
  ['Azure OpenAI', 'new AzureOpenAIClient(...).GetChatClient(deployment).AsIChatClient()', 'Your Azure tenant / enterprise'],
  ['Ollama (local)', 'new OllamaApiClient(uri, "llama3.1")', 'Free local dev - no data leaves your machine'],
]
const chatPipeline = [
  ['.UseFunctionInvocation()', 'The model can call your C# functions (tools)'],
  ['.UseOpenTelemetry()', 'Traces + token metrics in your observability stack'],
  ['.UseDistributedCache()', 'Identical prompts served from cache - saves tokens'],
  ['.UseLogging()', 'Every prompt and response logged'],
]

/* ---------- Part 5 data ---------- */
const workflowStages = [
  ['Context', 'CLAUDE.md', 'Part 1'],
  ['Scaffold', 'A skill', 'Part 2'],
  ['Touch real systems', 'An MCP tool', 'Part 3'],
  ['Verify', 'Hooks + dotnet test', 'Part 2'],
  ['Review', 'An agent', 'Part 2'],
  ['Orchestrate', 'A slash command', 'This lesson'],
  ['Approve & ship', 'You', 'Always'],
]

/* ---------- Runnable projects ---------- */
const projects = [
  {
    name: 'Claude Code skills + agent',
    step: 'Parts 1-2',
    desc: 'A CLAUDE.md template, ready-made skills, and an agent that make Claude write idiomatic .NET instead of generic C#.',
    href: 'https://github.com/StefanTheCode/AI-in-.NET/tree/main/Claude',
  },
  {
    name: 'MCP Server - API Performance Analysis',
    step: 'Part 3',
    desc: 'A real MCP server in C#: ask Copilot or Claude to load-test your API, catch ThreadPool starvation and GC pressure, and suggest fixes - with a Blazor dashboard and a sample API full of intentionally broken endpoints.',
    href: 'https://github.com/StefanTheCode/AI-in-.NET/tree/main/MCP%20Server%20-%20API%20Performance%20Analysis',
  },
  {
    name: 'Semantic Search AI Example',
    step: 'Track B · Step 5',
    desc: 'Search by meaning, not keywords: local embeddings with Ollama + Microsoft.Extensions.AI, stored and queried in Postgres.',
    href: 'https://github.com/StefanTheCode/AI-in-.NET/tree/main/Semantic%20Search%20AI%20Example',
  },
  {
    name: 'RAG Basics',
    step: 'Track B · Step 6',
    desc: 'A minimal RAG pipeline: embed your text, store vectors in Postgres (pgvector), retrieve the top matches, and ground an Ollama LLM in your data so it answers from what you gave it - or says "I don\'t know".',
    href: 'https://github.com/StefanTheCode/AI-in-.NET/tree/main/RAG%20Basics',
  },
]

const glossary = [
  ['CLAUDE.md', 'A context file at your repo root the AI reads at the start of every session - your stack, conventions, and what to never do.'],
  ['Skill', 'A reusable, auto-triggered capability (one SKILL.md) that does one focused thing well.'],
  ['Agent', 'A specialist that explores your codebase on its own and returns a report. You invoke it by asking for what it does.'],
  ['Slash command', 'A saved workflow you trigger with /name - it orchestrates skills and agents.'],
  ['Hook', 'A shell command that runs automatically around tool use (e.g. format on every edit).'],
  ['MCP', 'Model Context Protocol - a standard that lets AI clients call external tools/data. You can build an MCP server in C#.'],
  ['LLM', 'Large Language Model - the model behind Claude/GPT that generates text.'],
  ['Embedding', 'A vector representation of text, so you can search by meaning.'],
  ['RAG', 'Retrieval-Augmented Generation - retrieve your relevant data, then let the LLM answer from it (covered in Track B).'],
  ['IChatClient', 'The Microsoft.Extensions.AI abstraction for calling any LLM provider from .NET.'],
  ['MCP server', 'A small C# app that exposes your operations as tools any AI client can call - built with the ModelContextProtocol SDK.'],
  ['Tool calling', 'When the LLM decides to call one of your functions (or MCP tools), then uses the result in its answer.'],
  ['Structured output', 'Asking the LLM for a typed result (GetResponseAsync<T>) instead of free text, so you get a parsed object back.'],
  ['Plan mode', 'A Claude Code mode where it proposes a full plan and waits for your approval before touching any file.'],
]

const faq = [
  ['Does this only work with Claude Code?', 'The lessons use Claude Code, but the ideas map across tools: CLAUDE.md maps to Cursor rules / Copilot instructions, and skills/agents/MCP are increasingly supported everywhere.'],
  ['Is the AI going to replace me?', 'No. It replaces the developer who refuses to use it. You stay the engineer - you review everything, and you\'re still responsible for what ships.'],
  ['Do I need to know AI/ML math for this?', 'No. This is applied engineering, not data science. You won\'t derive a transformer. You\'ll ship features.'],
  ['How many skills should I install?', 'Install a set, but reach for the 5 that match your daily work. A library of 44 you never open helps no one.'],
  ['My skill isn\'t triggering - what\'s wrong?', 'Almost always the description. Make it specific about when to fire, add synonyms, and reopen the session.'],
  ['Is it safe to let the AI edit my repo?', 'Use plan mode for risky changes, keep your work in git, and review diffs. Add a pre-commit hook to block bad patterns. You approve; it executes.'],
]

/* ---------- code samples ---------- */
const claudeMdSample = `# Project: Orders API

## Stack
- .NET 10 / C# 14 · ASP.NET Core Minimal APIs
- EF Core 10 + PostgreSQL · FluentValidation · xUnit + Testcontainers

## Architecture
- Vertical Slice: everything for one feature in Features/[Feature]/.

## Conventions
- Result pattern, not exceptions for control flow.
- Inject TimeProvider - never DateTime.Now.
- TypedResults; DTOs are records; never expose EF entities.
- CancellationToken on every async method.

## Never suggest
- AutoMapper - write explicit mappings.
- Repository/UnitOfWork over EF Core - DbContext already is one.
- Exceptions for expected outcomes (not-found, validation).
- In-memory database in tests - use Testcontainers.`

const withoutClaudeMd = `public class OrdersController : ControllerBase
{
  private readonly IOrderRepository _repo;
  [HttpPost] public async Task<IActionResult>
  Create(CreateOrderDto dto){
    var o = new Order{ CreatedAt = DateTime.Now };
    await _repo.AddAsync(o);
    return Ok(o); // leaks the entity
  }
}`

const withClaudeMd = `public sealed class CreateOrderEndpoint : IEndpointGroup
{
  public void Map(IEndpointRouteBuilder app) =>
    app.MapPost("/api/orders", Handle)
       .Produces<OrderResponse>(201)
       .ProducesValidationProblem();

  static async Task<Results<Created<OrderResponse>,
    ValidationProblem>> Handle(CreateOrderRequest req,
    IOrderService svc, TimeProvider time,
    CancellationToken ct) => ...
}`

const installSkills = `/plugin marketplace add StefanTheCode/dotnet-ai-toolkit
/plugin install dotnet-ai-toolkit@thecodeman-ai-toolkit`

const talkNormally = `> This EF query is slow, optimize it
> Scaffold a products endpoint
> Write integration tests for the checkout flow
> Review this PR for .NET antipatterns`

const skillSample = `---
name: ef-core-query-optimizer
description: Optimize EF Core queries. Use whenever the user shares
  EF Core / LINQ code or mentions N+1, AsNoTracking, projections...
---

# EF Core Query Optimizer
Run this checklist in order:
1. Projection - .Select() to a DTO if only some columns are needed
2. Tracking - .AsNoTracking() for read-only queries
3. N+1 - detect lazy loading in loops
4. Async + CancellationToken on every query
Output: the rewritten query + one line per change. Leave optimal code alone.`

const ownSkill = `---
name: my-endpoint
description: Scaffold a new Minimal API endpoint in our style. Use when
  the user wants to add an endpoint, a route, or a new feature slice.
---

# New Endpoint
Create a full vertical slice in Features/[Feature]/:
- Request/Response records (never expose EF entities)
- FluentValidation validator + endpoint filter
- Handler returning Result<T>
- IEndpointGroup with TypedResults + OpenAPI metadata
- CancellationToken threaded through
- One integration test (WebApplicationFactory + Testcontainers)`

const useAgent = `> Audit the security of this API
> Review this PR like a senior .NET engineer
> Find the architecture problems in this solution`

const agentSample = `---
name: aspnetcore-security-auditor
description: Audits an ASP.NET Core codebase against the OWASP Top 10 and
  .NET-specific risks. Use for a security review or "is my API secure".
tools: Read, Glob, Grep, Bash
model: inherit
---

# ASP.NET Core Security Auditor
Walk the endpoints. Check authorization, injection, secrets in source,
CORS, mass assignment, vulnerable dependencies.
Output a ranked report (Critical / Should-fix / Nit) with a fix for each.`

const commandSample = `# .claude/commands/scaffold.md
Scaffold a complete vertical-slice feature: endpoint, validation,
Result handling, OpenAPI metadata, CancellationToken, and one
integration test. Match the existing features. Then run the tests.`

const installRef = `# Claude Code
npm install -g @anthropic-ai/claude-code

# The .NET AI ToolKit (skills + agents)
/plugin marketplace add StefanTheCode/dotnet-ai-toolkit
/plugin install dotnet-ai-toolkit@thecodeman-ai-toolkit
/plugin marketplace update thecodeman-ai-toolkit   # get new skills

# Build an MCP server in C# (Part 3)
dotnet add package ModelContextProtocol --prerelease

# Call an LLM from .NET (Part 4)
dotnet add package Microsoft.Extensions.AI
dotnet add package Microsoft.Extensions.AI.OpenAI`

const promptsRef = `> Give me a short plan first, then wait for my OK
> This EF query is slow, optimize it
> Refactor this to the Result pattern; leave idiomatic code alone
> Write integration tests with WebApplicationFactory + Testcontainers
> Review this PR like a senior .NET engineer
> Audit the security of this API
> Don't invent problems - leave correct code alone`

/* ---------- Part 3 code ---------- */
const mcpInstall = `dotnet new console -n OrdersMcp
cd OrdersMcp
dotnet add package ModelContextProtocol --prerelease
dotnet add package Microsoft.Extensions.Hosting`

const mcpProgram = `using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;

var builder = Host.CreateApplicationBuilder(args);

builder.Services
  .AddMcpServer()               // register the server
  .WithStdioServerTransport()   // the client launches it, talks over stdio
  .WithToolsFromAssembly();     // auto-discover [McpServerTool] methods

// your own services are available to tools via DI
builder.Services.AddSingleton<IOrderService, OrderService>();

await builder.Build().RunAsync();`

const mcpTool = `using System.ComponentModel;
using ModelContextProtocol.Server;

[McpServerToolType]
public sealed class OrderTools
{
  // The model reads this Description to decide WHEN to call the tool.
  [McpServerTool, Description("Get the current status of an order by its id.")]
  public static async Task<string> GetOrderStatus(
    IOrderService orders,                                  // injected from DI
    [Description("The order id, e.g. 1024")] int orderId,
    CancellationToken ct)
  {
    var order = await orders.FindAsync(orderId, ct);
    return order is null
      ? $"No order {orderId} found."
      : $"Order {orderId}: {order.Status}, total {order.Total:C}.";
  }
}`

const mcpRegister = `# Claude Code: register the server (run from any project)
claude mcp add orders -- dotnet run --project ./OrdersMcp

# then just ask - Claude calls the tool itself
> what's the status of order 1024?`

const mcpJson = `{
  "mcpServers": {
    "orders": {
      "command": "dotnet",
      "args": ["run", "--project", "./OrdersMcp"]
    }
  }
}`

/* ---------- Part 4 code ---------- */
const featureInstall = `dotnet add package Microsoft.Extensions.AI
dotnet add package Microsoft.Extensions.AI.OpenAI`

const featureRegister = `using Microsoft.Extensions.AI;
using OpenAI.Chat;

// One registration. The rest of your app depends on IChatClient, not OpenAI.
builder.Services.AddChatClient(
  new ChatClient("gpt-4o-mini", builder.Configuration["OpenAI:Key"])
    .AsIChatClient());`

const featureCall = `public sealed class SummaryService(IChatClient chat)
{
  public async Task<string> SummarizeAsync(string text, CancellationToken ct)
  {
    var response = await chat.GetResponseAsync(
      $"Summarize this in exactly two sentences:\\n\\n{text}",
      cancellationToken: ct);

    return response.Text;
  }
}`

const featureStream = `// Stream tokens as they arrive - perfect for chat UIs.
await foreach (var update in
  chat.GetStreamingResponseAsync(prompt, cancellationToken: ct))
{
  Console.Write(update.Text);
}`

const featureStructured = `public record SupportTicket(string Title, string Priority, string[] Tags);

// Ask for a typed result - the library builds the schema and parses the JSON.
var response = await chat.GetResponseAsync<SupportTicket>(
  $"Turn this email into a support ticket:\\n\\n{email}",
  cancellationToken: ct);

SupportTicket ticket = response.Result;   // strongly typed, ready to save`

const featurePipeline = `builder.Services
  .AddChatClient(new ChatClient("gpt-4o-mini", key).AsIChatClient())
  .UseFunctionInvocation()   // let the model call your C# tools
  .UseOpenTelemetry()        // traces + token metrics
  .UseLogging();             // every call logged`

/* ---------- Part 5 code ---------- */
const workflowCommand = `# .claude/commands/ship.md
Ship a feature end to end. Do NOT commit - I do that.

1. Give me a short plan and wait for my OK.
2. Scaffold the vertical slice with the my-endpoint skill.
3. Write integration tests (WebApplicationFactory + Testcontainers).
4. Run \`dotnet build && dotnet test\`. Fix failures, repeat until green.
5. Run the aspnetcore-security-auditor agent on the new code.
6. Summarize the diff + the agent's top findings, then stop.`

const workflowRun = `> /ship a create-invoice endpoint

# Claude plans -> scaffolds (skill) -> tests -> reviews (agent)
# -> hands you the diff. You read it and commit.`

/* ---------- Part 3 code (real project) ---------- */
const mcpHttpProgram = `var builder = WebApplication.CreateBuilder(args);

builder.Services
  .AddMcpServer()
  .WithHttpTransport()          // remote server - clients connect over HTTP
  .WithToolsFromAssembly();

var app = builder.Build();
app.MapMcp("/mcp");             // the MCP endpoint Copilot/Claude connect to
app.Run();`

const mcpHttpJson = `// .vscode/mcp.json  (GitHub Copilot)
{
  "servers": {
    "performance-lab": {
      "type": "http",
      "url": "http://localhost:5200/mcp"
    }
  }
}`

const mcpRealTool = `[McpServerToolType]
public sealed class PerformanceTools(
  LoadTestRunner runner,
  ResultAnalyzer analyzer,
  IResultStore   store,
  ILogger<PerformanceTools> logger)          // all injected from DI
{
  [McpServerTool(Name = "run_load_test")]
  [Description(
    "Run a load test against an API endpoint. Fires concurrent HTTP " +
    "requests and returns throughput, latency percentiles, and error " +
    "rate. Returns a result ID for analyze_results or generate_report.")]
  public async Task<string> RunLoadTest(
    [Description("Full URL, e.g. http://localhost:5100/fast")] string url,
    [Description("Seconds to run. Default: 10")] int durationSeconds = 10,
    [Description("Concurrent virtual users. Default: 10")] int concurrentUsers = 10,
    CancellationToken ct = default)
  {
    var result   = await runner.RunAsync(
      new LoadTestRequest { Url = url, DurationSeconds = durationSeconds,
                            ConcurrentUsers = concurrentUsers }, ct);
    var analysis = analyzer.Analyze(result);   // ThreadPool starvation? GC pressure?
    store.Add(result, analysis);
    return FormatLoadTestResult(result, analysis);   // a tight, model-readable summary
  }
}`

/* ---------- Part 4 code (extra) ---------- */
const chatHistory = `List<ChatMessage> chat =
[
  new(ChatRole.System, "You are a terse .NET assistant. Answer in one paragraph."),
  new(ChatRole.User,   userQuestion),
];

var response = await chat_client.GetResponseAsync(chat, cancellationToken: ct);
chat.AddMessages(response);   // keep the reply so the next turn has context`

const toolCalling = `// Expose a plain C# method as a tool the model can call.
[Description("Get the current stock count for a product SKU.")]
static int GetStock(string sku) => Inventory.CountFor(sku);

var options = new ChatOptions
{
  Tools = [AIFunctionFactory.Create(GetStock)]
};

// With .UseFunctionInvocation() on the pipeline, the library runs the
// call for you and feeds the result back to the model - automatically.
var response = await chat.GetResponseAsync(
  "How many units of SKU-42 are left?", options, cancellationToken: ct);`

/* ---------- Part 5 code (extra) ---------- */
const triageCommand = `# .claude/commands/triage.md
Triage a slow endpoint end to end:
1. Run the performance-lab MCP tool (run_load_test) on the endpoint.
2. From the numbers, name the likely cause - ThreadPool starvation? GC? N+1?
3. Propose the minimal .NET fix and show the diff. Do NOT apply yet.
4. On my OK, apply it and re-run the test to prove it's faster.`

/* ---------- small render helpers ---------- */
const langLabel: Record<string, string> = { csharp: 'C#', bash: 'bash', markdown: 'md', text: 'text' }

async function Code({ children, lang = 'csharp' }: { children: string; lang?: string }) {
  let html: string
  try {
    html = await codeToHtml(children, { lang, theme: 'vitesse-dark' })
  } catch {
    html = await codeToHtml(children, { lang: 'text', theme: 'vitesse-dark' })
  }
  return (
    <CodeFrame code={children} language={langLabel[lang] ?? lang}>
      <div className="tcm-shiki" dangerouslySetInnerHTML={{ __html: html }} />
    </CodeFrame>
  )
}

function DataTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div style={tableWrap}>
      <table style={table}>
        <thead>
          <tr>{head.map((h, i) => <th key={i} style={th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j} style={td}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const sectionCard = { ...card, padding: '30px 28px', textAlign: 'left' as const, marginBottom: '28px' }
const kicker = { display: 'inline-block', background: 'rgba(255,189,57,0.14)', border: '1px solid rgba(255,189,57,0.4)', color: '#ffbd39', borderRadius: '999px', padding: '5px 14px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '14px' }

export default function AiRoadmapCoursePage() {
  return (
    <>
      <Script
        id="ai-roadmap-course-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FreeMotion />

      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
        <div className="container">
          {/* Hero */}
          <div className="row justify-content-center tk-hero-glow crk-hero-glow">
            <div className="col-md-10 text-center heading-section mb-4 mt-5">
              <div style={kicker} data-reveal>AI ROADMAP COURSE · TRACK A</div>
              <h1 className="text-white mb-3" data-reveal data-delay="1">
                Use AI to build <span className="text-yellow crk-shimmer">.NET</span> faster
              </h1>
              <h3 className="text-white mb-4" data-reveal data-delay="2" style={{ fontWeight: 400, ...muted, maxWidth: '760px', margin: '0 auto' }}>
                The fastest wins in the whole roadmap: make Claude Code write <em>your</em> .NET, then turn it into a
                specialist with skills and agents. Real code, no theory.
              </h3>

              {/* part pills */}
              <div className="d-flex flex-wrap justify-content-center" style={{ gap: '8px', marginTop: '10px' }}>
                {parts.map((p, i) => {
                  const base = { fontSize: '13px', fontWeight: 700, borderRadius: '999px', padding: '7px 14px', border: '1px solid rgba(255,255,255,0.12)', display: 'inline-block' }
                  if (p.state === 'on') return <a key={i} href={p.href} style={{ ...base, color: '#2a003a', background: '#ffbd39', borderColor: '#ffbd39', textDecoration: 'none' }}>{p.label}</a>
                  if (p.state === 'lock') return <a key={i} href="https://www.skool.com/thecodeman-ai-toolkit-9723" target="_blank" rel="noopener noreferrer" title="Unlock in the community" style={{ ...base, color: '#a49dcb', background: 'rgba(255,255,255,0.03)', opacity: 0.6, textDecoration: 'none' }}>{p.label}</a>
                  return <a key={i} href={p.href} style={{ ...base, color: '#cfc9f2', background: 'rgba(255,255,255,0.03)', textDecoration: 'none' }}>{p.label}</a>
                })}
              </div>
            </div>
          </div>

          <hr className="background-yellow" />

          {/* ---------------- PART 1 ---------------- */}
          <div className="row justify-content-center">
            <div className="col-md-10" id="part1">
              <div className="tk-card crk-accent-card" style={sectionCard}>
                <div style={kicker}>PART 1 · LESSON 1 OF 5</div>
                <h2 className="text-white">Make Claude Code write <span className="text-yellow">your</span> .NET</h2>
                <p className="text-white">
                  By the end of this lesson you&apos;ll have an AI assistant that writes .NET the way <em>you</em> write it -
                  matching your stack, architecture, and conventions on the first try. Most developers get this wrong.
                </p>

                <h4 className="text-white mt-4">The problem</h4>
                <p className="text-white">
                  You ask Claude Code for one endpoint. You get back a repository interface, an AutoMapper profile,{' '}
                  <code>DateTime.Now</code>, and a folder structure from someone else&apos;s project. The code isn&apos;t
                  <em> wrong</em> - it&apos;s just not <strong>your</strong> code.
                </p>
                <p style={muted}>
                  The key insight: it&apos;s not that the AI doesn&apos;t know .NET. It starts every session knowing nothing
                  about <strong>your repo</strong>, so it fills the gap with the most common .NET code it has seen. The fix
                  isn&apos;t a better prompt every time - it&apos;s giving the AI <strong>context, once</strong>.
                </p>

                <h4 className="text-white mt-4">Step 1 - Install Claude Code</h4>
                <Code lang="bash">{`# install, then run inside any project folder
npm install -g @anthropic-ai/claude-code
claude`}</Code>
                <p style={muted}>
                  This lesson uses Claude Code, but the <code>CLAUDE.md</code> idea maps to Cursor&apos;s rules and
                  Copilot&apos;s instructions too. Open it inside a <strong>real</strong> solution - you learn this on code you care about.
                </p>

                <h4 className="text-white mt-4">Step 2 - The one file that changes everything: <span className="text-yellow">CLAUDE.md</span></h4>
                <p className="text-white">
                  <code>CLAUDE.md</code> is a markdown file at your repo root. Claude Code loads it <strong>automatically at the
                  start of every session</strong>, before your first prompt. Think of it as the briefing you&apos;d give a new
                  senior dev joining your team. It answers four questions:
                </p>
                <ol className="text-white">
                  <li><strong>What&apos;s the stack?</strong> (exact versions)</li>
                  <li><strong>How is the project structured?</strong> (architecture + folders)</li>
                  <li><strong>What are the conventions?</strong> (the patterns you use)</li>
                  <li><strong>What should it never do?</strong> (the patterns you don&apos;t use)</li>
                </ol>
                <Code lang="markdown">{claudeMdSample}</Code>

                <div style={tip.box}>
                  <div style={{ fontWeight: 800, color: tip.color, marginBottom: '6px' }}>💡 Don&apos;t write it by hand</div>
                  <span className="text-white">
                    Use the free <strong>CLAUDE.md Generator</strong> - pick your stack and it builds this file for you.
                    But understand <em>why</em> each line is there first.
                  </span>
                </div>

                <div style={never.box}>
                  <div style={{ fontWeight: 800, color: never.color, marginBottom: '6px' }}>⛔ The &quot;Never suggest&quot; section is the secret</div>
                  <span className="text-white">
                    &quot;Never wrap EF Core in a repository.&quot; &quot;Never use AutoMapper.&quot; These <strong>block the wrong
                    default before Claude walks down that path</strong> - far cheaper than reviewing and reverting it afterward.
                    This one section saves more review time than anything else in the course.
                  </span>
                </div>

                <h4 className="text-white mt-4">Step 3 - Prompt for real work</h4>
                <ul className="text-white">
                  <li><strong>Describe the outcome, not the steps.</strong> Not &quot;make a controller + service + repository&quot; - but &quot;add a create-product endpoint, return a Result, follow the existing features.&quot;</li>
                  <li><strong>Ask for a plan before edits</strong> on anything non-trivial: &quot;give me a short plan and wait for my OK.&quot; Catches wrong assumptions before they become wrong code.</li>
                  <li><strong>Tell it to leave good code alone:</strong> &quot;Don&apos;t invent problems.&quot;</li>
                </ul>

                <h4 className="text-white mt-4">Worked example</h4>
                <div className="row">
                  <div className="col-md-6">
                    <div style={{ fontWeight: 800, fontSize: '13px', color: never.color, marginBottom: '6px' }}>✗ Without CLAUDE.md</div>
                    <Code>{withoutClaudeMd}</Code>
                  </div>
                  <div className="col-md-6">
                    <div style={{ fontWeight: 800, fontSize: '13px', color: tip.color, marginBottom: '6px' }}>✓ With CLAUDE.md</div>
                    <Code>{withClaudeMd}</Code>
                  </div>
                </div>
                <p style={muted}>Same prompt. Different universe. That&apos;s the CLAUDE.md at work.</p>

                <h4 className="text-white mt-4">Where CLAUDE.md lives (and its friends)</h4>
                <p style={muted}>They stack - so you can set global preferences once and override per project:</p>
                <DataTable head={['File', 'Scope', 'Use it for']} rows={claudeMdLives} />

                <h4 className="text-white mt-4">Use Plan Mode for anything risky</h4>
                <p className="text-white">
                  Claude Code has a <strong>plan mode</strong>: it proposes a full plan and waits for your approval before
                  touching a single file. Use it for migrations, refactors, or anything that spans several files. It&apos;s the
                  difference between &quot;AI did something to my repo&quot; and &quot;AI did exactly what I approved.&quot;
                </p>

                <h4 className="text-white mt-4">Prompting cheat sheet</h4>
                <DataTable head={['Instead of…', 'Say…']} rows={promptCheat} />
                <p style={muted}>The pattern: <strong>state the outcome, name the constraints, and say what to avoid.</strong></p>

                <h4 className="text-white mt-4">The bad defaults → what they should become</h4>
                <p style={muted}>These are the patterns your <code>CLAUDE.md</code> should steer toward - and the raw material for a sharp &quot;Never suggest&quot; section.</p>
                <DataTable head={["AI's common default", 'What you want instead', 'Why']} rows={badDefaults} />

                <div style={warn.box}>
                  <div style={{ fontWeight: 800, color: warn.color, marginBottom: '6px' }}>⚠️ Common mistakes</div>
                  <ul className="text-white" style={{ margin: 0 }}>
                    <li>No CLAUDE.md at all → generic output → you blame the AI. The #1 mistake.</li>
                    <li>A CLAUDE.md that&apos;s docs for humans, not instructions for the AI. Keep it concise and imperative.</li>
                    <li>Accepting code you don&apos;t understand - you&apos;re still responsible.</li>
                    <li>Skipping the &quot;Never suggest&quot; section - the highest-value part.</li>
                  </ul>
                </div>

                <div style={good.box}>
                  <div style={{ fontWeight: 800, color: good.color, marginBottom: '6px' }}>✅ Your exercise</div>
                  <ol className="text-white" style={{ margin: 0 }}>
                    <li>Add a <code>CLAUDE.md</code> to a real project.</li>
                    <li>Fill in &quot;Never suggest&quot; with the 3 patterns you&apos;re tired of correcting.</li>
                    <li>Do one backlog task fully with Claude Code - plan first, then edits.</li>
                    <li>Post what changed in the community feed.</li>
                  </ol>
                </div>

                <div style={{ ...card, background: 'rgba(255,255,255,0.05)', padding: '18px 20px', marginTop: '20px' }}>
                  <div style={{ fontWeight: 800, color: '#f9b801', marginBottom: '6px' }}>Recap</div>
                  <span className="text-white">
                    Claude starts every session blind to your repo - <code>CLAUDE.md</code> fixes that. Cover stack, architecture,
                    conventions, and (most importantly) <strong>what to never suggest</strong>. Prompt for outcomes, ask for a plan, leave good code alone.
                  </span>
                </div>
                <p className="text-white mt-3"><span className="text-yellow"><b>Next →</b></span> Part 2: make the assistant a specialist with skills and agents.</p>
              </div>
            </div>
          </div>

          {/* ---------------- PART 2 ---------------- */}
          <div className="row justify-content-center">
            <div className="col-md-10" id="part2">
              <div className="tk-card crk-accent-card" style={sectionCard}>
                <div style={kicker}>PART 2 · LESSON 2 OF 5</div>
                <h2 className="text-white">Turn the assistant into a <span className="text-yellow">.NET specialist</span></h2>
                <p className="text-white">
                  In Part 1 you gave Claude context. Now, instead of re-explaining a task every time, you give it{' '}
                  <strong>reusable capabilities</strong> it loads automatically. That&apos;s what skills and agents are.
                </p>

                <h4 className="text-white mt-4">Skill vs. agent - the 20-second version</h4>
                <ul className="text-white">
                  <li><strong>A skill</strong> is a focused capability Claude loads <strong>automatically</strong> when your request matches (&quot;optimize this EF query&quot;, &quot;scaffold an endpoint&quot;). You don&apos;t call it - you describe what you want.</li>
                  <li><strong>An agent</strong> explores your codebase on its own and produces a <strong>report</strong> (&quot;audit the security of this API&quot;). You invoke it by asking for what it does.</li>
                </ul>
                <div style={tip.box}>
                  <div style={{ fontWeight: 800, color: tip.color, marginBottom: '6px' }}>💡 Rule of thumb</div>
                  <span className="text-white"><strong>Skill</strong> = &quot;do this specific thing.&quot; <strong>Agent</strong> = &quot;look at my repo and tell me what&apos;s wrong.&quot;</span>
                </div>

                <h4 className="text-white mt-4">Step 1 - Install a set of skills</h4>
                <Code lang="bash">{installSkills}</Code>
                <p className="text-white">Then just talk to Claude Code normally and the matching skill kicks in - no command to remember:</p>
                <Code lang="bash">{talkNormally}</Code>
                <p style={muted}>Each skill carries a fixed checklist, so output is consistent instead of depending on how you phrased the prompt. <strong>Start with the 5 you&apos;ll use daily</strong> - don&apos;t memorize 44.</p>

                <h4 className="text-white mt-4">Where skills &amp; agents live</h4>
                <DataTable head={['Location', 'Available in']} rows={skillsLive} />
                <p style={muted}>Reopen the session after adding a skill so it loads. Update marketplace skills anytime with <code>/plugin marketplace update thecodeman-ai-toolkit</code>.</p>

                <h4 className="text-white mt-4">Step 2 - How a skill works (so you can write one)</h4>
                <p className="text-white">A skill is a folder with a <code>SKILL.md</code>: YAML frontmatter (the trigger) + instructions (what to do).</p>
                <Code lang="markdown">{skillSample}</Code>
                <ul className="text-white">
                  <li><strong>The <code>description</code> is the trigger.</strong> Make it specific and slightly pushy about <em>when</em> to fire. Vague description → skill never triggers.</li>
                  <li><strong>The body is a checklist, not an essay.</strong> Concrete steps + BAD/GOOD examples + a fixed output format = consistent results.</li>
                </ul>

                <h5 className="text-white mt-4">Anatomy of a description that actually triggers</h5>
                <DataTable
                  head={['Weak (rarely fires)', 'Strong (fires reliably)']}
                  rows={[[
                    '"Helps with EF Core."',
                    '"Use whenever the user shares EF Core / LINQ code, a DbContext, or a slow query, or mentions N+1, AsNoTracking, projections, cartesian explosion. Always use this for EF performance instead of answering from memory."',
                  ]]}
                />
                <p style={muted}>Name the <strong>triggers</strong> (the words and situations), list <strong>synonyms</strong>, and be a little <strong>pushy</strong> (&quot;Always use this for…&quot;). A <code>references/</code> folder can hold extra material that loads only when the skill is active - keeping your main context light.</p>

                <h4 className="text-white mt-4">Step 3 - Write your own skill</h4>
                <p className="text-white">Pick one task you repeat weekly. Create <code>.claude/skills/my-endpoint/SKILL.md</code>:</p>
                <Code lang="markdown">{ownSkill}</Code>
                <p style={muted}>Reopen the session, type &quot;add a create-customer endpoint&quot; - your skill fires. You just encoded your team&apos;s standard once, forever.</p>

                <h4 className="text-white mt-4">Step 4 - Use an agent</h4>
                <p className="text-white">When you want a review of the <em>whole</em> codebase, ask for what the agent does:</p>
                <Code lang="bash">{useAgent}</Code>
                <p style={muted}>The agent explores your code on its own and returns a <strong>ranked report</strong> - Critical / Should-fix / Nit - with a fix for each. The fastest second pair of eyes you&apos;ll ever have.</p>
                <p className="text-white">An agent is a single <code>.md</code> file with frontmatter that defines its role, the tools it may use, and (optionally) the model:</p>
                <Code lang="markdown">{agentSample}</Code>

                <h4 className="text-white mt-4">Level up - slash commands &amp; hooks</h4>
                <p className="text-white"><strong>Slash commands</strong> wrap a whole workflow behind one command. Instead of describing the steps, you type <code>/scaffold</code> and it runs the right skills and agents in order. A command is just a markdown file in <code>.claude/commands/</code>:</p>
                <Code lang="markdown">{commandSample}</Code>
                <p style={muted}>Handy commands to build: <code>/scaffold</code>, <code>/verify</code>, <code>/code-review</code>, <code>/security-scan</code>.</p>
                <p className="text-white"><strong>Hooks</strong> run automatically <em>around</em> tool use - shell commands wired to events:</p>
                <DataTable head={['Hook', 'What it does']} rows={hooks} />
                <p style={muted}>Hooks turn your conventions from &quot;things you hope the AI follows&quot; into &quot;things the tooling enforces.&quot;</p>

                <div style={warn.box}>
                  <div style={{ fontWeight: 800, color: warn.color, marginBottom: '6px' }}>🔧 Troubleshooting: &quot;my skill won&apos;t trigger&quot;</div>
                  <ul className="text-white" style={{ margin: 0 }}>
                    <li><strong>Fix the <code>description</code> first</strong> - 90% of the time that&apos;s it.</li>
                    <li><strong>Reopen the session</strong> after adding a skill - it loads at start.</li>
                    <li><strong>Name it explicitly</strong> in your prompt (&quot;optimize this EF Core query&quot;).</li>
                    <li><strong>Check the folder</strong> - a skill is <code>skills/&lt;name&gt;/SKILL.md</code>, not a loose <code>.md</code>.</li>
                  </ul>
                </div>

                <div style={good.box}>
                  <div style={{ fontWeight: 800, color: good.color, marginBottom: '6px' }}>✅ Your exercise</div>
                  <ol className="text-white" style={{ margin: 0 }}>
                    <li>Install the ToolKit skills and use <strong>5</strong> on a real repo.</li>
                    <li>Write <strong>one</strong> custom skill for a task you repeat weekly.</li>
                    <li>Run <strong>one agent</strong> (security or code review) and act on its top finding.</li>
                    <li>Share your custom skill (or what the agent caught) in the feed.</li>
                  </ol>
                </div>

                <div style={{ ...card, background: 'rgba(255,255,255,0.05)', padding: '18px 20px', marginTop: '20px' }}>
                  <div style={{ fontWeight: 800, color: '#f9b801', marginBottom: '6px' }}>Recap</div>
                  <span className="text-white">
                    <strong>Skills</strong> = reusable, auto-triggered capabilities (the <code>description</code> is the trigger,
                    the body is a checklist). <strong>Agents</strong> = specialists that review your whole codebase. Together they turn a general assistant into <em>your</em> .NET specialist.
                  </span>
                </div>
                <p className="text-white mt-3"><span className="text-yellow"><b>Next →</b></span> Part 3: MCP - give the AI real <em>tools</em> in C#, so it can do things in your systems, not just write code.</p>
              </div>
            </div>
          </div>

          {/* ---------------- PART 3 ---------------- */}
          <div className="row justify-content-center">
            <div className="col-md-10" id="part3">
              <div className="tk-card crk-accent-card" style={sectionCard}>
                <div style={kicker}>PART 3 · LESSON 3 OF 5</div>
                <h2 className="text-white">Give the AI real tools: <span className="text-yellow">MCP in C#</span></h2>
                <p className="text-white">
                  So far the AI only <em>writes</em> code. In this lesson you give it <strong>tools</strong> - the
                  ability to actually do things in your systems: query a database, call your API, check a ticket. You
                  build the tool once, in C#, and any AI client can call it.
                </p>

                <h4 className="text-white mt-4">What MCP is (in one paragraph)</h4>
                <p className="text-white">
                  <strong>MCP - the Model Context Protocol</strong> - is a standard way for AI clients (Claude Code,
                  Copilot, Cursor) to call external tools. You write an <strong>MCP server</strong>: a small program
                  that exposes some operations as tools. The client tells the model which tools exist, the model picks
                  one when it needs it, your C# runs, and the result flows back into the conversation. Skills tell the
                  AI <em>how</em> to write code; MCP tools let it <em>do</em> something.
                </p>

                <div style={good.box}>
                  <div style={{ fontWeight: 800, color: good.color, marginBottom: '6px' }}>🧭 Skill vs. agent vs. MCP tool</div>
                  <span className="text-white">
                    <strong>Skill</strong> = &quot;write this the way we do.&quot; <strong>Agent</strong> = &quot;review
                    my repo and report back.&quot; <strong>MCP tool</strong> = &quot;go touch a real system and bring
                    back real data.&quot; The first two shape text; MCP takes action.
                  </span>
                </div>

                <h4 className="text-white mt-4">How a tool call actually flows</h4>
                <ol className="text-white">
                  <li>Your server tells the client which tools exist - name, description, parameters.</li>
                  <li>You ask a question; the model decides a tool would help and picks one.</li>
                  <li>The client calls your C# method with the arguments the model filled in.</li>
                  <li>Your code runs - a real query, a real API call - and returns a result.</li>
                  <li>The model reads that result and answers, grounded in what your tool returned.</li>
                </ol>
                <p style={muted}>You never wire the call up by hand - the model decides, the client routes, your C# runs. Your whole job is to write good tools and describe them well.</p>

                <h4 className="text-white mt-4">When you actually want a tool</h4>
                <DataTable head={['You want the AI to…', 'Reach for']} rows={mcpWhen} />

                <h4 className="text-white mt-4">Step 1 - Create the server</h4>
                <Code lang="bash">{mcpInstall}</Code>
                <p style={muted}>
                  The C# SDK is <code>ModelContextProtocol</code>. It still ships under <code>--prerelease</code> - drop
                  the flag once your version is stable.
                </p>
                <Code>{mcpProgram}</Code>
                <p style={muted}>
                  Three lines do the work: <code>AddMcpServer</code> registers it, <code>WithStdioServerTransport</code>{' '}
                  lets the client launch it, and <code>WithToolsFromAssembly</code> auto-discovers your tools.
                </p>

                <h4 className="text-white mt-4">Step 2 - Write a tool</h4>
                <p className="text-white">
                  A tool is just a method with two attributes. The <code>[Description]</code> is what the model reads to
                  decide <em>when</em> to call it - treat it like a skill&apos;s trigger. Services are injected from DI,
                  so your tool can use the same <code>IOrderService</code> your app already has.
                </p>
                <Code>{mcpTool}</Code>

                <h4 className="text-white mt-4">Step 3 - Connect it to Claude Code</h4>
                <Code lang="bash">{mcpRegister}</Code>
                <p style={muted}>Prefer config in the repo? Drop a <code>.mcp.json</code> so the whole team gets the same tools:</p>
                <Code lang="markdown">{mcpJson}</Code>

                <h4 className="text-white mt-4">stdio vs. HTTP - which transport?</h4>
                <DataTable head={['Transport', 'Use it when', 'How it runs']} rows={mcpTransports} />
                <p style={muted}>Start with <strong>stdio</strong>. Move to HTTP once a server needs to be shared, hosted, or consumed by more than a command-line client.</p>

                <h4 className="text-white mt-4">See it in a real project: <span className="text-yellow">Performance Lab</span></h4>
                <p className="text-white">
                  Here&apos;s a full MCP server I built so you can read real code, not just snippets.{' '}
                  <strong>Performance Lab</strong> lets you ask Copilot or Claude - in plain English - to load-test a
                  .NET API, spot <strong>ThreadPool starvation</strong>, <strong>GC pressure</strong>, or a high error
                  rate, and suggest the fix. It ships with a sample API full of intentionally broken endpoints and a
                  Blazor dashboard to visualise the runs.
                </p>
                <p style={muted}>
                  Because a Blazor dashboard <em>and</em> AI clients both talk to it, the server uses the{' '}
                  <strong>HTTP transport</strong> - the exact case the table above calls out:
                </p>
                <Code>{mcpHttpProgram}</Code>
                <Code lang="markdown">{mcpHttpJson}</Code>
                <p className="text-white">
                  The tools are a class with a primary constructor - your services (<code>LoadTestRunner</code>,{' '}
                  <code>ResultAnalyzer</code>, a store, a logger) are injected straight in, exactly like anywhere else
                  in ASP.NET Core:
                </p>
                <Code>{mcpRealTool}</Code>
                <div style={good.box}>
                  <div style={{ fontWeight: 800, color: good.color, marginBottom: '6px' }}>📦 Clone it and run it</div>
                  <span className="text-white">
                    Full solution - API, MCP server, dashboard, tests -{' '}
                    <a className="text-yellow" href="https://github.com/StefanTheCode/AI-in-.NET/tree/main/MCP%20Server%20-%20API%20Performance%20Analysis" target="_blank" rel="noopener noreferrer">MCP Server - API Performance Analysis</a>.
                    Run the three projects, connect Copilot, and ask it to compare <code>/slow</code> vs <code>/fast</code>.
                    You&apos;ll watch the AI diagnose your API from real numbers.
                  </span>
                </div>

                <div style={never.box}>
                  <div style={{ fontWeight: 800, color: never.color, marginBottom: '6px' }}>⛔ A tool runs with your permissions</div>
                  <span className="text-white">
                    An MCP tool executes real code against real systems. <strong>Validate every input</strong>, scope
                    credentials to the minimum, and never expose a destructive operation (delete, refund, deploy)
                    without a confirmation step. The model will call what you give it.
                  </span>
                </div>

                <div style={warn.box}>
                  <div style={{ fontWeight: 800, color: warn.color, marginBottom: '6px' }}>⚠️ Common mistakes</div>
                  <ul className="text-white" style={{ margin: 0 }}>
                    <li>A vague <code>[Description]</code> → the model never calls the tool (same rule as skills).</li>
                    <li>Returning a giant blob - return a tight, readable result the model can use.</li>
                    <li>Logging to stdout on a stdio server - it corrupts the protocol. Log to <em>stderr</em>.</li>
                    <li>Read/write tools with no guardrails. Start read-only.</li>
                  </ul>
                </div>

                <div style={good.box}>
                  <div style={{ fontWeight: 800, color: good.color, marginBottom: '6px' }}>✅ Your exercise</div>
                  <ol className="text-white" style={{ margin: 0 }}>
                    <li>Build a one-tool MCP server over stdio (start read-only - a lookup).</li>
                    <li>Register it with <code>claude mcp add</code> and call it from a prompt.</li>
                    <li>Inject a real service so it returns real data from your app.</li>
                    <li>Share what tool you exposed in the community feed.</li>
                  </ol>
                </div>

                <div style={{ ...card, background: 'rgba(255,255,255,0.05)', padding: '18px 20px', marginTop: '20px' }}>
                  <div style={{ fontWeight: 800, color: '#f9b801', marginBottom: '6px' }}>Recap</div>
                  <span className="text-white">
                    MCP turns the AI from a code writer into something that can <strong>act</strong> in your systems.
                    Expose an operation as a tool with <code>[McpServerTool]</code> + a sharp <code>[Description]</code>,
                    run it over stdio, and register it with one command. Keep tools scoped and safe - they run for real.
                  </span>
                </div>
                <p className="text-white mt-3"><span className="text-yellow"><b>Next →</b></span> Part 4: stop using other people&apos;s AI - build your own AI feature in C#.</p>
              </div>
            </div>
          </div>

          {/* ---------------- PART 4 ---------------- */}
          <div className="row justify-content-center">
            <div className="col-md-10" id="part4">
              <div className="tk-card crk-accent-card" style={sectionCard}>
                <div style={kicker}>PART 4 · LESSON 4 OF 5</div>
                <h2 className="text-white">Build your <span className="text-yellow">first AI feature</span></h2>
                <p className="text-white">
                  Parts 1-3 were about using AI to build .NET. Now you flip sides: you put AI <em>inside</em> your app.
                  The good news - it&apos;s just another service you inject. One interface, <code>IChatClient</code>, and
                  any provider behind it.
                </p>

                <h4 className="text-white mt-4">The one abstraction: <span className="text-yellow">IChatClient</span></h4>
                <p className="text-white">
                  <code>Microsoft.Extensions.AI</code> gives .NET a single interface for talking to any LLM -{' '}
                  <code>IChatClient</code>. You register one provider at startup; the rest of your code depends on the
                  interface, not on OpenAI or Azure. Swap providers by changing one line.
                </p>
                <Code lang="bash">{featureInstall}</Code>
                <Code>{featureRegister}</Code>
                <p style={muted}>
                  The model id lives on the <code>ChatClient</code>; <code>.AsIChatClient()</code> adapts it to the
                  standard interface. (The exact adapter name tracks the package version.)
                </p>

                <h4 className="text-white mt-4">Step 1 - Call the model</h4>
                <p className="text-white">Inject <code>IChatClient</code> like any other service and ask:</p>
                <Code>{featureCall}</Code>

                <h4 className="text-white mt-4">Step 2 - Stream the response</h4>
                <p className="text-white">For anything user-facing, stream tokens as they come instead of waiting for the whole answer:</p>
                <Code>{featureStream}</Code>

                <h4 className="text-white mt-4">Step 3 - Get <span className="text-yellow">structured output</span> (the real unlock)</h4>
                <p className="text-white">
                  Free text is hard to use in code. Ask for a <strong>typed result</strong> and the library builds the
                  JSON schema, tells the model, and parses the response into your record:
                </p>
                <Code>{featureStructured}</Code>
                <p style={muted}>This is what turns an LLM from a chatbot into a <strong>feature</strong>: classify a ticket, extract fields from an email, tag content - all as real C# objects.</p>

                <h4 className="text-white mt-4">Give it a role - and memory</h4>
                <p className="text-white">
                  A single prompt is stateless. Pass a <strong>list of messages</strong> instead - a{' '}
                  <code>System</code> message sets the role and rules, and you keep appending turns so the model
                  remembers the conversation:
                </p>
                <Code>{chatHistory}</Code>
                <p style={muted}>The <code>System</code> message is where you put guardrails - tone, format, &quot;only answer from the context I give you.&quot; It&apos;s the CLAUDE.md of your feature.</p>

                <h4 className="text-white mt-4">Let the model call your code (tools)</h4>
                <p className="text-white">
                  Same idea as MCP from Part 3 - but <em>in-process</em>. Hand the model a C# method and it decides when
                  to call it, so your feature can pull real data mid-answer instead of guessing:
                </p>
                <Code>{toolCalling}</Code>
                <p style={muted}>MCP tools do this <strong>across</strong> processes for any client; <code>AIFunctionFactory</code> does it <strong>inside</strong> one app. This is the seed of an AI agent (Step 7 in the roadmap).</p>

                <h4 className="text-white mt-4">Swap providers without touching your code</h4>
                <DataTable head={['Provider', 'Register with', 'Good for']} rows={providerSwap} />
                <p style={muted}>Develop locally against Ollama (free, private), ship on OpenAI or Azure. Your feature code never changes.</p>

                <h4 className="text-white mt-4">Production niceties, almost for free</h4>
                <p className="text-white"><code>IChatClient</code> is a pipeline - wrap it with middleware the same way you&apos;d wrap an HTTP client:</p>
                <Code>{featurePipeline}</Code>
                <DataTable head={['Add to the pipeline', 'What you get']} rows={chatPipeline} />

                <div style={warn.box}>
                  <div style={{ fontWeight: 800, color: warn.color, marginBottom: '6px' }}>⚠️ Tokens are money - and latency</div>
                  <ul className="text-white" style={{ margin: 0 }}>
                    <li>Use the <strong>smallest model that works</strong> (like <code>gpt-4o-mini</code>) - upgrade only when quality demands it.</li>
                    <li>Cache identical prompts with <code>.UseDistributedCache()</code>.</li>
                    <li>Keep prompts tight and cap the output length - you pay for both directions.</li>
                    <li>Never put a secret key in source - use configuration / user-secrets.</li>
                  </ul>
                </div>

                <div style={never.box}>
                  <div style={{ fontWeight: 800, color: never.color, marginBottom: '6px' }}>⛔ The model can be wrong - and confident</div>
                  <span className="text-white">
                    Treat every response as <strong>untrusted input</strong>. Validate structured output before you save
                    it, never run model text as code or SQL, and don&apos;t surface raw answers where correctness is
                    critical without a check. You&apos;re still the engineer.
                  </span>
                </div>

                <div style={good.box}>
                  <div style={{ fontWeight: 800, color: good.color, marginBottom: '6px' }}>✅ Your exercise</div>
                  <ol className="text-white" style={{ margin: 0 }}>
                    <li>Register an <code>IChatClient</code> and call it from one endpoint.</li>
                    <li>Return a <strong>typed</strong> result with <code>GetResponseAsync&lt;T&gt;</code>.</li>
                    <li>Point it at Ollama locally, then at OpenAI - same code.</li>
                    <li>Add <code>.UseLogging()</code> and look at what a call actually costs.</li>
                  </ol>
                </div>

                <div style={{ ...card, background: 'rgba(255,255,255,0.05)', padding: '18px 20px', marginTop: '20px' }}>
                  <div style={{ fontWeight: 800, color: '#f9b801', marginBottom: '6px' }}>Recap</div>
                  <span className="text-white">
                    An AI feature in .NET is one interface: <code>IChatClient</code>. Register a provider once, call{' '}
                    <code>GetResponseAsync</code>, stream for UIs, and use <strong>structured output</strong> to get
                    typed objects instead of text. Mind tokens, and treat every answer as untrusted.
                  </span>
                </div>
                <p className="text-white mt-3"><span className="text-yellow"><b>Next →</b></span> Part 5: chain everything into one repeatable workflow.</p>
              </div>
            </div>
          </div>

          {/* ---------------- PART 5 ---------------- */}
          <div className="row justify-content-center">
            <div className="col-md-10" id="part5">
              <div className="tk-card crk-accent-card" style={sectionCard}>
                <div style={kicker}>PART 5 · LESSON 5 OF 5</div>
                <h2 className="text-white">Tie it together: one repeatable <span className="text-yellow">workflow</span></h2>
                <p className="text-white">
                  You now have four pieces - context, skills &amp; agents, MCP tools, and AI features. The last skill is{' '}
                  <strong>orchestration</strong>: wiring them into one repeatable loop so shipping a feature is a single
                  command, not ten manual steps.
                </p>

                <h4 className="text-white mt-4">The loop every task should follow</h4>
                <p className="text-white">Plan → Build → Verify → Review → <strong>you</strong> ship. Each stage is powered by something you already built:</p>
                <DataTable head={['Stage', 'What runs it', 'From']} rows={workflowStages} />

                <h4 className="text-white mt-4">Step 1 - Wrap the loop in a slash command</h4>
                <p className="text-white">
                  A slash command turns the whole sequence into one word. It calls your skills, runs your tests, and
                  invokes your agent - in order, every time:
                </p>
                <Code lang="markdown">{workflowCommand}</Code>
                <Code lang="bash">{workflowRun}</Code>
                <p style={muted}>Same steps, same quality bar - 9am or a Friday deploy. That&apos;s the point of a workflow: consistency you don&apos;t have to remember.</p>

                <h4 className="text-white mt-4">Step 2 - Keep the gates in place</h4>
                <ul className="text-white">
                  <li><strong>Plan mode</strong> for anything risky - it proposes, you approve, then it touches files.</li>
                  <li><strong>Hooks</strong> enforce your rules automatically (format on save, block bad patterns pre-commit).</li>
                  <li><strong>An agent</strong> is the second pair of eyes before you commit.</li>
                  <li><strong>You</strong> read the diff and press commit. The AI never ships on its own.</li>
                </ul>
                <div style={tip.box}>
                  <div style={{ fontWeight: 800, color: tip.color, marginBottom: '6px' }}>💡 The mindset</div>
                  <span className="text-white">
                    The AI <strong>executes</strong>; you <strong>decide</strong>. A good workflow moves the boring
                    steps to the machine and keeps every real decision - and the commit - with you.
                  </span>
                </div>

                <h4 className="text-white mt-4">Step 3 - Let it reach further with MCP</h4>
                <p className="text-white">
                  Because your tools from Part 3 are in the loop, the workflow isn&apos;t limited to writing code. Wire
                  the <strong>Performance Lab</strong> MCP server into a <code>/triage</code> command and the AI can
                  measure a slow endpoint, name the cause from real numbers, propose the fix, and prove it - one pass,
                  grounded in your systems:
                </p>
                <Code lang="markdown">{triageCommand}</Code>
                <p style={muted}>That&apos;s the payoff of the whole track: context (Part 1) + a skill&apos;s checklist (Part 2) + a real tool (Part 3) + a model call (Part 4), orchestrated into one command - and you still approve every change.</p>

                <div style={warn.box}>
                  <div style={{ fontWeight: 800, color: warn.color, marginBottom: '6px' }}>⚠️ Don&apos;t automate away your judgment</div>
                  <ul className="text-white" style={{ margin: 0 }}>
                    <li>No auto-commit, no auto-deploy from a command. Always end with a human gate.</li>
                    <li>Keep commands small and composable - <code>/scaffold</code>, <code>/verify</code>, <code>/ship</code> - not one mega-command.</li>
                    <li>If you can&apos;t explain what a step did, don&apos;t ship it.</li>
                  </ul>
                </div>

                <div style={good.box}>
                  <div style={{ fontWeight: 800, color: good.color, marginBottom: '6px' }}>✅ Your exercise</div>
                  <ol className="text-white" style={{ margin: 0 }}>
                    <li>Write a <code>/ship</code> command that scaffolds, tests, and reviews - then stops for you.</li>
                    <li>Add one hook (format on save, or a pre-commit guard).</li>
                    <li>Run a full feature through the loop without leaving Claude Code.</li>
                    <li>Share your command file in the community feed.</li>
                  </ol>
                </div>

                <div style={{ ...card, background: 'rgba(255,255,255,0.05)', padding: '18px 20px', marginTop: '20px' }}>
                  <div style={{ fontWeight: 800, color: '#f9b801', marginBottom: '6px' }}>Recap</div>
                  <span className="text-white">
                    A workflow chains your context, skills, agents, MCP tools, and tests into one repeatable loop behind
                    a slash command - with plan mode, hooks, and <strong>you</strong> as the gates. That&apos;s the whole
                    of Track A: the AI does the work, you stay the engineer.
                  </span>
                </div>
                <p className="text-white mt-3">
                  <span className="text-yellow"><b>That&apos;s Track A. Next →</b></span> Track B: build AI <em>into</em>{' '}
                  your apps at depth - embeddings &amp; semantic search, RAG, and agents. Grab a{' '}
                  <a className="text-yellow" href="#projects">runnable project</a> to start from, or see the full{' '}
                  <a className="text-yellow" href="/ai-roadmap-2026">AI Roadmap for .NET</a>.
                </p>
              </div>
            </div>
          </div>

          {/* ---------------- PROJECTS ---------------- */}
          <div className="row justify-content-center">
            <div className="col-md-10" id="projects">
              <div className="tk-card crk-accent-card" style={sectionCard}>
                <div style={kicker}>PROJECTS · BUILD THESE NEXT</div>
                <h2 className="text-white">Runnable <span className="text-yellow">.NET projects</span> that match the roadmap</h2>
                <p style={muted}>Each is a self-contained solution with its own README - clone it, set your own keys, run it. All on .NET 10. Read the code alongside the lessons above.</p>
                <div className="row">
                  {projects.map((p, i) => (
                    <div className="col-md-6" key={i} style={{ marginTop: '16px' }}>
                      <a href={p.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                        <div style={{ ...card, background: 'rgba(255,255,255,0.03)', padding: '18px 20px', height: '100%' }}>
                          <div style={{ ...kicker, marginBottom: '10px' }}>{p.step}</div>
                          <h5 className="text-white" style={{ marginBottom: '6px' }}>{p.name} <span className="text-yellow">↗</span></h5>
                          <p style={{ ...muted, margin: 0, fontSize: '14px' }}>{p.desc}</p>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
                <p style={{ ...muted, marginTop: '18px', fontSize: '14px' }}>
                  All four live in one repo:{' '}
                  <a className="text-yellow" href="https://github.com/StefanTheCode/AI-in-.NET" target="_blank" rel="noopener noreferrer">github.com/StefanTheCode/AI-in-.NET</a>
                </p>
              </div>
            </div>
          </div>

          {/* ---------------- QUICK REFERENCE ---------------- */}
          <div className="row justify-content-center">
            <div className="col-md-10" id="reference">
              <div className="tk-card crk-accent-card" style={sectionCard}>
                <div style={kicker}>QUICK REFERENCE</div>
                <h2 className="text-white">The one-screen cheat sheet</h2>
                <h4 className="text-white mt-4">Install</h4>
                <Code lang="bash">{installRef}</Code>
                <h4 className="text-white mt-4">Where things live</h4>
                <DataTable head={['Path', 'What']} rows={refWhere} />
                <h4 className="text-white mt-4">Prompts that pull their weight</h4>
                <Code lang="bash">{promptsRef}</Code>
              </div>
            </div>
          </div>

          {/* ---------------- GLOSSARY ---------------- */}
          <div className="row justify-content-center">
            <div className="col-md-10" id="glossary">
              <div className="tk-card crk-accent-card" style={sectionCard}>
                <div style={kicker}>GLOSSARY</div>
                <h2 className="text-white">The words, in plain English</h2>
                <DataTable head={['Term', 'What it means']} rows={glossary} />
              </div>
            </div>
          </div>

          {/* ---------------- FAQ ---------------- */}
          <div className="row justify-content-center">
            <div className="col-md-10" id="faq">
              <div className="tk-card crk-accent-card" style={sectionCard}>
                <div style={kicker}>FAQ</div>
                <h2 className="text-white mb-4">Frequently asked</h2>
                {faq.map((f, i) => (
                  <div key={i} className="mb-3 p-4 tk-card crk-accent-card" style={card}>
                    <h5 className="text-yellow mb-2" style={{ fontSize: '1.05rem' }}>{f[0]}</h5>
                    <p className="text-white mb-0">{f[1]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---------------- CTA ---------------- */}
          <div className="row justify-content-center pb-5" data-reveal>
            <div className="col-md-10">
              <div className="tk-card crk-form-card" style={{ ...card, background: 'rgba(255,189,57,0.06)', borderColor: 'rgba(255,189,57,0.3)', padding: '40px 28px', textAlign: 'center' }}>
                <h3 className="text-white mb-2">This is Track A. Track B is where it gets rare.</h3>
                <p style={{ ...muted, maxWidth: '580px', margin: '0 auto 20px' }}>
                  The full course - Claude Code, skills, MCP in C#, then building real AI features (LLMs, RAG, agents) into your
                  .NET apps - is inside the community, with new video clips as I record them.
                </p>
                <a className="btn btn-primary py-3 px-4" href="https://www.skool.com/thecodeman-ai-toolkit-9723" target="_blank" rel="noopener noreferrer">
                  Join the community →
                </a>{' '}
                <a className="btn btn-outline-white py-3 px-4" href="https://thecodeman.net" target="_blank" rel="noopener noreferrer">
                  Free newsletter (20k+)
                </a>
                <p style={{ ...muted, marginTop: '18px', fontSize: '14px' }}>
                  Built by <a className="text-yellow" href="https://thecodeman.net" target="_blank" rel="noopener noreferrer">Stefan Đokić - TheCodeMan</a> · Microsoft MVP
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
