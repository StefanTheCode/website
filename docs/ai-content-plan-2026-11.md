# AI content plan for TheCodeMan.NET (Nov 2026 - Jan 2027)

Created: 2026-11-16

Goal: rank for "AI for .NET / C# developers" searches and send that traffic to the AI for Developers community.

Cadence: 3 AI posts per week, on the site only. The weekly newsletter stays separate. Refreshes of existing posts are extra and don't count toward the 3.

This builds on `docs/ai-for-dotnet-seo-research.md` (Sep 19, 2026). That doc had no Search Console data. This one does.

---

## 1. What the data says

**Sources**

- Google Search Console, `sc-domain:thecodeman.net`, Aug 15 - Nov 14, 2026 (3 months) and the last 28 days.
- Google autocomplete (English), pulled Nov 16, 2026.
- .NET 11 release (Nov 10, 2026) and the Microsoft .NET blog.

**Limits**

- Search Console only shows queries where the site already appears.
- Autocomplete shows how people phrase searches, not how many people search.
- No volume tool (Ahrefs, Semrush, Keyword Planner) was used.

**Whole site, 3 months**

- 4.52K clicks, 312K impressions, average position 7.5.
- Google AI features (AI Overviews / AI Mode): 45.1K impressions. The core .NET posts are the ones cited most there.

**AI pages**

| Period | Clicks | Page impressions |
|---|---|---|
| 3 months | ~610 (~13% of all) | ~23.8K (~6%) |
| Last 28 days | 223 of 1,444 (~15%) | ~9.5K of 94.5K (~10%) |

The AI share is growing.

**AI search demand reaching the site is still small**

- In 3 months, 79 of the top 1,000 queries are AI queries: 2,051 impressions and 59 clicks in total.
- For comparison, the memory caching post alone has 25.7K impressions.

**AI pages that work (3 months)**

| Page | Clicks | Impressions | Position |
|---|---|---|---|
| /ai-roadmap-2026 | 103 | 2,150 | 7.2 |
| /ai-for-dotnet-developers (now redirects to /ai-for-developers) | 84 | 3,175 | 8.1 |
| refactoring-legacy-dotnet-with-claude | 72 | 3,894 | 8.2 |
| how-to-implement-rag-in-dotnet | 70 | 2,967 | 8.5 |
| /ai-toolkit (redirects to /ai-for-developers) | 69 | 1,984 | 8.4 |
| /ai-roadmap-course | 57 | 997 | 11.7 |
| claude-for-dotnet-developers | 37 | 946 | 7.0 |
| building-mcp-server-in-dotnet | 36 | 1,998 | 8.5 |

Most of these pages are at position 7-9, at the bottom of page 1. Moving them up is the fastest win.

**How people phrase AI + .NET searches (autocomplete)**

- "c# ai" is followed by: agent, skills, agent framework, programming, library, sdk, framework.
- "c# ai agent" is followed by: framework, example, sdk, tutorial, github.
- "ai for .net developers" is followed by: course, generative ai, ai tools, best ai, agentic ai.

---

## 2. Fix first (this week)

### Fix 1: /ai-for-developers title and H1 (decision for Stefan)

- The page that ranks for "ai for .net developers" was renamed on Nov 15 and now redirects to /ai-for-developers.
- "ai for .net developers" is the best AI query on the site: 171 impressions, 13 clicks, position 5.5 in 3 months (position 5.1 in the last 28 days).
- New title: "AI for Developers Community | Claude Code, AI Agents & AI Features".
- New H1: "You code with AI every day...".
- Neither contains ".NET" or "C#".
- "AI for developers" on its own is a very broad query. This page is unlikely to rank for it soon.

**Option A: the community is still mainly for .NET/C# developers**

- Put .NET/C# back in the title and description. Example title: "AI for Developers Community for .NET and C# | Claude Code, AI Agents".
- Add one visible line under the H1 saying who it is for.

**Option B: the community is now for all developers**

- Accept that "ai for .net developers" may drop.
- Let /ai-roadmap-2026 and the blog posts carry the .NET queries.

Either way, check "ai for .net developers" in Search Console 2-4 weeks after the redirect.

### Fix 2: merge the two MCP posts

| Post | Published | Impressions (3 months) | Clicks | Position |
|---|---|---|---|---|
| building-mcp-server-in-dotnet | May | 1,998 | 36 | 8.5 |
| build-an-mcp-server-in-dotnet-for-claude | August | 119 | 0 | - |

Google chose the May post for general MCP queries.

1. Rewrite the May URL (its slug is already general) as the main "Build an MCP server in C#" tutorial:
   - Use MCP C# SDK 2.x and the `dotnet new mcpserver` template that ships with the .NET 11 SDK.
   - Keep the load-testing example as one section.
2. 301 the August URL to the May URL and update internal links.

**Target queries**

- c# mcp server
- .net mcp server: 34 impressions, position 9.7
- asp net core mcp server: position 14.7
- From autocomplete: example, sdk, tutorial, template, http, github

### Side note, not AI: two architecture tests posts

- `architecture-tests-dotnet-clean-architecture`: Feb 2026, 3.7K impressions, position 7.7.
- `architecture-tests-dotnet-what-the-compiler-cant-see`: published today.

Both now target "architecture tests .net". Link them to each other and make the titles clearly different. Otherwise Google will pick one, and the other will end up like the August MCP post.

---

## 3. Refresh list (extra, not part of the 3 per week)

| # | Page | Data (3 months) | Change | Target queries |
|---|---|---|---|---|
| R1 | MCP merge (Fix 2) | see above | see above | c# mcp server, .net mcp server |
| R2 | how-to-implement-rag-in-dotnet | 70 clicks, 2,967 impr, pos 8.5. "rag c#" sits at pos 39.8 | Pinned, runnable repo on current Microsoft.Extensions.AI + Ollama. Put "C#" in the title. Add source attribution and failure cases | rag c#, c# rag ollama, c# rag example, rag .net |
| R3 | how-to-use-chatgpt-in-csharp-application (2023) | 12 clicks, 1,105 impr. "c# vs openai api" + "openai api vs c#" = 119 impr, all in the last 28 days. "chatgpt c#" at pos 4.3 | Rewrite in place as "OpenAI API in C#": official OpenAI .NET SDK, Responses API, streaming, structured output. Keep the URL | c# openai api, c# openai sdk, c# openai responses api, chatgpt c# |
| R4 | your-dotnet-api-doesnt-need-a-vector-database-anymore | 0 clicks, 77 impr, pos 9.8 | The title doesn't contain what people search. Retitle around "EF Core vector search with SQL Server". Add a section on .NET 11 EF Core vector indexes (experimental) | ef core vector search, ef core 10 vector search, ef core sql server vector search |
| R5 | semantic-search-ai-in-dotnet (Feb 2025) | 9 clicks, 636 impr, pos 12.0 | Update packages to current Microsoft.Extensions.AI. Add an embeddings section: generating them, local vs OpenAI | c# embeddings, c# generate embeddings, c# local embeddings |
| R6 | ai-agents-for-dotnet-security-and-ef-core | 1 click, 227 impr, pos 13.0 | Retitle with the words people use for AI code review in C#/.NET. GSC: "ai agent security audit" 36 impr (pos 11.7), "ai code auditing" 25, "c# code review skill" 11 | ai code review c#, ai code audit, c# code review skill |
| R7 | claude-for-dotnet-developers | 37 clicks, 946 impr, pos 7.0. "claude code .net" at pos 14.8 | Update for current Claude Code. Add a "CLAUDE.md template for .NET" section. Link to E1 and E2 | claude code .net, claude code c#, dotnet claude md, claude code for .net developers |

**Order**

| Week | Refreshes |
|---|---|
| Week 1 | Fix 1, R1 |
| Week 2 | R2, R3 |
| Week 3 | R4, R5 |
| Week 4 | R6, R7 |

---

## 4. New posts: keyword map (21 posts)

Rule: one post = one main query. Before writing a post that isn't on this list, check this table so two posts don't go after the same query.

### A. AI agents in C# (the biggest gap)

| # | Working title | Main query | Supporting queries | Why (evidence) | Link to |
|---|---|---|---|---|---|
| A1 | Build an AI Agent in C# with Microsoft Agent Framework | c# ai agent | microsoft agent framework c# tutorial / example, .net ai agent, dotnet ai agent | GSC ".net ai agent(s)" 43 impr at pos 12-15 with no post behind it. "agent" is the first autocomplete after "c# ai". Agent Framework 1.0 GA since Apr 3, 2026 | B1, A3, C4 |
| A2 | Migrate from Semantic Kernel to Microsoft Agent Framework | semantic kernel vs microsoft agent framework | migrate semantic kernel to agent framework | Appears in both the "semantic kernel" and "microsoft agent framework" autocomplete lists. Agent Framework replaces Semantic Kernel for new work | A1 |
| A3 | Microsoft Agent Framework Workflows in C# | microsoft agent framework workflows | workflow c#, multi-agent c#, human in the loop | Autocomplete "microsoft agent framework workflows" and "...workflow c#" | A1, durable-execution post, workflow engine post |
| A4 | Test AI Features in .NET with Microsoft.Extensions.AI.Evaluation | microsoft.extensions.ai.evaluation | evaluate llm output c# | Autocomplete under "microsoft.extensions.ai". Backlog #5 in the Sep research doc | B1, R2 |

### B. Foundations (Microsoft.Extensions.AI)

| # | Working title | Main query | Supporting queries | Why (evidence) | Link to |
|---|---|---|---|---|---|
| B1 | Getting Started with AI in C#: Microsoft.Extensions.AI and IChatClient | c# ai | c# ai sdk, c# ai library, microsoft.extensions.ai, ichatclient c#, .net ai development | GSC "c# ai" 48 impr pos 9.5, ".net ai development" 46 pos 9.2, "ai feature development .net application" 76 pos 13.5. No beginner post exists. Backlog #1 in the Sep doc | everything in this map, the community page |
| B2 | IChatClient Middleware: Caching, Logging and OpenTelemetry for LLM Calls | ichatclient middleware | chat client middleware, ichatclient implementations | Autocomplete "ichatclient" list | B1, hybrid cache post, rate limiting post |
| B3 | Structured Output in C#: Get Typed Objects from an LLM | c# openai structured output | json schema llm c# | Autocomplete "c# openai" list | B1, R3 |
| B4 | Tool Calling in C# with IChatClient | c# openai function calling | c# ai function calling, ai tools c# | "c# function calling" autocomplete goes to "c# openai function calling" | B1, A1 |
| B5 | Run LLMs Locally in C# with Ollama | c# ollama | c# ollama client, ollamasharp, c# llm local, microsoft agent framework c# ollama | Autocomplete "c# ollama", "c# llm", "microsoft agent framework c#" lists | B1, R2 |
| B6 | C# AI Libraries in 2026: What Each One Is For | c# ai library | c# ai framework, c# llm library, .net ai framework | Autocomplete "c# ai", ".net ai", "c# llm" lists. Publish last so it can link to everything | all |

### C. MCP in C#

| # | Working title | Main query | Supporting queries | Why (evidence) | Link to |
|---|---|---|---|---|---|
| C1 | (= R1, the merged MCP tutorial) | | | | |
| C2 | MCP Server Authentication in ASP.NET Core | c# mcp server authentication | .net mcp server authentication, mcp server c# oauth | In all three MCP autocomplete lists. Backlog #3 in the Sep doc | R1 |
| C3 | MCP C# SDK 2.0: Stateless HTTP and What Changed from 1.x | mcp c# sdk 2.0 | c# mcp server http, streamable http c# | SDK 2.0 released Jul 28, 2026, stateless HTTP by default. Autocomplete "c# mcp server http / streamable http" | R1, C2 |
| C4 | Use MCP Tools from a C# Agent | mcp client c# | c# ollama mcp, claude code c# mcp | Autocomplete "c# ollama mcp". MCP support is GA in Agent Framework 1.0 | A1, R1 |

### D. Retrieval

| # | Working title | Main query | Supporting queries | Why (evidence) | Link to |
|---|---|---|---|---|---|
| D1 | Vector Search with EF Core and PostgreSQL (pgvector) | ef core vector search postgres | pgvector ef core, c# vector search | First autocomplete after "ef core vector search". The Postgres posts (RLS, jsonb) already do well | R4, R2, postgres RLS, jsonb post |

### E. AI coding for .NET developers (the strongest niche)

| # | Working title | Main query | Supporting queries | Why (evidence) | Link to |
|---|---|---|---|---|---|
| E1 | .NET Skills for Coding Agents: Microsoft's dotnet/skills and Writing Your Own | dotnet skills | c# ai skills, .net ai skills, claude code c# skills, claude .net skills | GSC "c# ai skills" 50 impr pos 7.7, ".net ai skills" 46 pos 9.0, "claude .net skills" 21 pos 8.2, ".net claude kit" 62 pos 6.1. dotnet/skills launched Mar 2026 and was featured in the .NET 11 launch | ship-agent-skills-in-nuget-packages, R7, community toolkit |
| E2 | C# Code Intelligence in Claude Code: csharp-lsp Setup | claude code c# lsp | claude dotnet lsp, csharp-ls claude code | First autocomplete after "claude code c#". Official csharp-lsp plugin uses csharp-ls. Windows issues are reported, so test it on your own machine | R7, E1 |
| E3 | Claude Code vs GitHub Copilot vs Codex on the Same .NET Task | best ai tools for .net developers | ai tools for .net developers, best ai for c# developers | GSC 86 impr at pos 7.6. Backlog #4 in the Sep doc. Needs a real experiment: one public repo, the same task, tool and model versions, date, diffs, test results and cost. No invented winners | R7, E1 |
| E4 | Upgrade .NET Framework Apps with the GitHub Copilot Upgrade Agent | github copilot .net upgrade | .net upgrade canvas, upgrade assistant | First autocomplete after "github copilot .net". .NET 11 adds the Upgrade canvas. Ties to the Legacy pack and the WinForms posts | refactoring-legacy-dotnet-with-claude, from-winforms-to-web |

### F. AI UI in .NET 11

| # | Working title | Main query | Supporting queries | Why (evidence) | Link to |
|---|---|---|---|---|---|
| F1 | Blazor AI Components in .NET 11: Streaming Chat with IChatClient | blazor ai components | blazor ai chat, blazor ai chat component | First autocomplete after "blazor ai". `Microsoft.AspNetCore.Components.AI` is experimental in .NET 11 | B1 |
| F2 | Connect a C# Agent to Blazor with AG-UI | ag-ui .net | blazor ai agent | AG-UI hosting integration is prerelease in .NET 11. Autocomplete "blazor ai agent" | F1, A1 |

### G. Top of the funnel

| # | Working title | Main query | Supporting queries | Why (evidence) | Link to |
|---|---|---|---|---|---|
| G1 | Is C# Good for AI? Where .NET Fits Next to Python in 2026 | is c# good for ai | generative ai for .net developers, agentic ai for .net developers | Autocomplete under "ai for c# developers" and "c# ai skills" | community page, B1, A1, B6 |

---

## 5. Calendar (3 posts per week)

The newsletter stays on Monday. Pick the days. Tuesday, Thursday and Friday is one option.

| Week | Post 1 | Post 2 | Post 3 | Refreshes |
|---|---|---|---|---|
| 1 (Nov 16-22) | B1 Getting started with AI in C# | A1 AI agent with Agent Framework | E1 .NET Skills | Fix 1, R1 |
| 2 (Nov 23-29, Black Friday Nov 27) | F1 Blazor AI components | B5 Ollama in C# | A2 Semantic Kernel to Agent Framework | R2, R3 |
| 3 (Nov 30-Dec 6) | A3 Agent Framework workflows | C2 MCP server authentication | D1 EF Core + pgvector | R4, R5 |
| 4 (Dec 7-13) | B4 Tool calling | B3 Structured output | E4 Copilot upgrade agent | R6, R7 |
| 5 (Dec 14-20) | E3 Claude Code vs Copilot vs Codex | C4 MCP tools from a C# agent | B2 IChatClient middleware | |
| 6 (Dec 21-27, holidays: publish early in the week) | A4 AI evaluations | E2 Claude Code C# LSP | G1 Is C# good for AI | |
| 7 (Dec 28-Jan 3) | C3 MCP C# SDK 2.0 | F2 AG-UI + Blazor | B6 C# AI libraries in 2026 | |
| 8 (Jan 4-10) | Buffer for news or catch-up | | | |

Search Console review: the week of Jan 11, 2027.

Start E3 early. The experiment takes longer than a normal post.

---

## 6. Rules for every post in this plan

- **Main query:** one per post. Put it in the title and the first paragraph, worded the way people search. Have both "C#" and ".NET" somewhere in the title or meta description, because people search with both.
- **Runnable code:**
  - Pin package versions.
  - Write the date it was tested.
  - Link the repo.
  - Check the current version on NuGet on the day you write, because AI packages change fast.
- **Nothing invented:** no made-up numbers, incidents or benchmarks. E3 is the only comparison post, and only with the real experiment.
- **Links:**
  - The community page.
  - 2-3 related posts from this map.
  - The community CTA.
- **FAQ block:** every post gets one. The site already has 45.1K impressions in Google's AI features, and FAQ-style answers are what those features quote.
- **After publishing:** run `/index-on-google`.

---

## 7. Measurement

**Baseline (28 days ending Nov 14, 2026)**

| Metric | Value |
|---|---|
| Whole site | 1.44K clicks, 78.7K impressions |
| AI pages | 223 clicks, ~9.5K page impressions |
| AI queries in the top 1,000 | 105 queries, 897 impressions, 23 clicks |
| "ai for .net developers" | position 5.1 |

**Week of Jan 11, 2027**

1. Pull the same 28-day numbers.
2. For each new post, check:
   - Is it indexed?
   - Which queries is it getting impressions for?
   - What position is it at?
3. If two posts get impressions for the same query, fix that before writing more.
4. Then decide whether to change the 3-per-week cadence.

---

## Sources

- [Announcing .NET 11 (Nov 10, 2026)](https://devblogs.microsoft.com/dotnet/?p=61205)
- [Announcing v2.0 of the official MCP C# SDK (Jul 28, 2026)](https://devblogs.microsoft.com/dotnet/announcing-v20-of-the-official-mcp-csharp-sdk/)
- [Microsoft Agent Framework 1.0 GA (Apr 3, 2026)](https://techcommunity.microsoft.com/blog/azuredevcommunityblog/the-future-of-agentic-ai-inside-microsoft-agent-framework-1-0/4510698)
- [Extend your coding agent with .NET Skills (Mar 9, 2026)](https://devblogs.microsoft.com/dotnet/extend-your-coding-agent-with-dotnet-skills)
- [Claude Code code intelligence (LSP plugins)](https://code.claude.com/docs/en/plugins/code-intelligence.md)
