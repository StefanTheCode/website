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
  { label: '3 · MCP in C# 🔒', state: 'lock' },
  { label: '4 · Your first AI feature 🔒', state: 'lock' },
  { label: '5 · Workflow 🔒', state: 'lock' },
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
]

const hooks = [
  ['Post-edit on *.cs', 'Runs dotnet format - every file stays clean automatically'],
  ['Pre-commit', 'Blocks DateTime.Now, async void, new HttpClient() in staged files'],
  ['Pre-bash guard', 'Blocks destructive git ops (force push, reset --hard)'],
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
/plugin marketplace update thecodeman-ai-toolkit   # get new skills`

const promptsRef = `> Give me a short plan first, then wait for my OK
> This EF query is slow, optimize it
> Refactor this to the Result pattern; leave idiomatic code alone
> Write integration tests with WebApplicationFactory + Testcontainers
> Review this PR like a senior .NET engineer
> Audit the security of this API
> Don't invent problems - leave correct code alone`

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
