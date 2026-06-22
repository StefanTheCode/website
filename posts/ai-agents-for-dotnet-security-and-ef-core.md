---
title: "AI Agents for .NET: How I Audit a Whole Codebase in One Command"
subtitle: "I built a library of AI skills and agents for .NET that run on your real code - a file, a folder, a whole project, or a GitHub link. In this issue I show two of them in action on a real production .NET 10 app, then walk you through adding one to Claude from start to finish so you can run it on your own code today."
date: "Jun 22 2026"
author: "Stefan Đokić"
category: "AI Tools"
readTime: "6 minutes"
meta_description: "Learn how AI agents and skills can audit your .NET codebase - security holes, EF Core N+1 queries and more - and follow a step-by-step tutorial to add a skill to Claude and run it on your own C# project."
---

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">I found a free resource from Datadog that might be useful if you're building, deploying, or operating modern applications.

This week's recommendation: **Developer Toolkit for the AI Era**

Inside, you'll find practical guidance on cutting CI run times, eliminating flaky tests, and shipping with more confidence as AI tools change how your team writes and deploys code.</p>
<a href="https://r2trck.com/the-code-man-datadog-11?utm_medium=newsletter&utm_source=the-code-man-r&utm_campaign=dg-content-toolkit-2026AIEraDeveloper-delivery-cipipe-ww-en-701VY00000kMeE2YAK&utm_content=paid&utm_term=1-1-2026" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #1a0224; background: #ffbd39; border-radius: 8px; text-decoration: none;">Get it here →</a>
<p style="margin: 10px 10px 12px 0; font-size: 16px; line-height: 1.6; color: #fff;">Want to reach thousands of .NET developers like this?</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #1a0224; background: #ffbd39; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>

## The Problem: The Bug You Never See

Most serious bugs do not announce themselves. They sit quietly in a 300-file codebase until the day they cost you.

A missing `[Authorize]`. Sensitive values written to logs in production. An EF Core query that looks innocent but fires one round-trip per row. None of these break the build. None of these show up in a demo. They just wait.

Code review catches some of them. But review is slow, inconsistent, and the reviewer has to know exactly what to look for, every time, across every file.

So I built something to do it for me: a library of **AI skills and agents for .NET** that run on my actual code. Not a chat window I paste snippets into. I point a tool at a file, a folder, a whole project, or a GitHub link, and it reports back like a senior engineer - findings down to file and line, ranked by impact, with the fix.

This week I pointed the whole set at a **real production .NET 10 codebase** (a client project, so the name stays private). In this issue I will show you two of those tools in action, then walk you through adding one to Claude yourself so you can run it on your own code by the end of this email.

![TheCodeMan AI Toolkit - run history dashboard](/images/blog/posts/ai-agents-for-dotnet-security-and-ef-core/history-dashboard.png)

---

## Tool #1: The Security Auditor (an agent)

The first one is an **agent**. Unlike a single-purpose skill, an agent explores the whole repository on its own. I gave it one instruction:

> "Run a security audit on this API."

It mapped the attack surface (startup, endpoints, auth setup, configuration), checked it against the OWASP Top 10 plus .NET-specific risks, and came back with a ranked report. The headline findings:

- **🔴 Critical - Authorization coverage.** Only **1 of 75 endpoints** actually required authorization, and there was no fallback policy. Either a gateway was enforcing it upstream, or most of the API was effectively anonymous. It flagged it as "verify this now."
- **🔴 Critical - Sensitive data logging.** `EnableSensitiveDataLogging()` was turned on **unconditionally**, which writes query parameter values (and any PII in them) to logs in every environment, not just development.
- **🟡 Medium - CORS.** `AllowAnyOrigin()` on an authenticated API.

Here is the part that builds trust: it did not invent problems to look useful. It explicitly **passed** the parts that were already solid - the auth scheme design, the use of the Result pattern, cancellation tokens threaded everywhere. A review that only ever finds problems is a review you stop believing. This one tells you what is fine, too.

![Security auditor findings](/images/blog/posts/ai-agents-for-dotnet-security-and-ef-core/aspnetcore-security-auditor.png)


The fix for the logging issue is one line, but you have to know it is there:

```csharp
// Before - logs parameter values in every environment
services.AddDbContext<AppDbContext>(o =>
    o.UseNpgsql(connectionString)
     .EnableSensitiveDataLogging());

// After - only in Development
services.AddDbContext<AppDbContext>(o =>
{
    o.UseNpgsql(connectionString);
    if (env.IsDevelopment())
        o.EnableSensitiveDataLogging();
});
```

---

## Tool #2: The EF Core Query Optimizer (a skill)

The second one is a **skill** - focused, single-purpose. I pointed it at the data layer:

> "Optimize the EF Core queries in this project."

It ran a fixed checklist (N+1, tracking, projections, cartesian explosion, pagination, bulk operations) and found a query that loads more than it needs and filters in memory:

```csharp
// Before
var application = await _db.Applications
    .Include(app => app.ConfigurationFiles)   // loads ALL config files
    .Where(app => app.Id == applicationId)
    .SingleOrDefaultAsync(ct);

var results = application.ConfigurationFiles
    .Where(config => config.IsActive)          // filtered in memory, after loading everything
    .Select(_mapper.ToDto)
    .ToList();
```

Two problems the skill called out:

1. `Include` pulls every related row from the database, then the `IsActive` filter throws most of them away in memory.
2. The query tracks the whole entity graph even though nothing is being saved.

The rewrite pushes the filter into SQL, projects only what is needed, and drops change tracking:

```csharp
// After
var results = await _db.Applications
    .Where(app => app.Id == applicationId)
    .SelectMany(app => app.ConfigurationFiles)
    .Where(config => config.IsActive)          // now runs as a SQL WHERE
    .Select(config => _mapper.ToDtoExpression(config))
    .AsNoTracking()
    .ToListAsync(ct);
```

Same result set, a fraction of the data transferred, no tracking overhead. The skill also reminded me to confirm it with `ToQueryString()` - measure, do not guess.

One agent, one skill. One finds risk across the whole repo, the other rewrites a specific hot path. That is the idea: each tool does one thing at a senior level, and you point it at your real code.

---

## Tutorial: Add a Skill to Claude (start to finish)

Here is the part you can do right now. I will use the EF Core optimizer as the example, but every skill and agent installs the same way.

A skill is just a folder with a `SKILL.md` file inside (instructions plus the trigger description). An agent is a single `.md` file. Claude loads them automatically.

### If you use Claude Code

**1. Create a skills folder** in your project (or globally so it is available everywhere):

```bash
# project-level: available in this repo
mkdir -p .claude/skills

# or user-level: available in every project
mkdir -p ~/.claude/skills
```

**2. Copy the skill folder in.** Each skill is a folder like `ef-core-query-optimizer/` containing `SKILL.md`:

```bash
cp -r ef-core-query-optimizer .claude/skills/
```

**3. For an agent**, copy the `.md` into the agents folder instead:

```bash
mkdir -p .claude/agents
cp aspnetcore-security-auditor.md .claude/agents/
```

**4. Start a fresh session and just ask.** Skills trigger automatically when your request matches; an agent runs when you ask for what it does:

```text
Optimize the EF Core queries in src/Orders for performance.

Run a security audit on this repo.
```

That is it. No build step, no dependencies. Claude reads the `SKILL.md`, applies the checklist, and works on the files you pointed it at.

### If you use the Claude desktop app (Cowork)

Even simpler. Each tool also ships as a `.skill` bundle (a zipped folder). Open **Settings → Capabilities**, add the skill, and it is installed. Then ask the same prompts as above.

> **Tip:** point a tool at exactly what you want - a single file, a folder like `src/Orders/`, a whole `.sln`, or even a GitHub URL. It finds the relevant files itself, so you never paste code into the chat.

![Security auditor findings](/images/blog/posts/ai-agents-for-dotnet-security-and-ef-core/claude-running-agent.png)

---

## Try It Yourself

I packaged the two tools from this issue so you can run them today. Download them, drop them into Claude using the steps above, and point them at your own code:

**[Download the two tools from this issue →](https://www.skool.com/thecodeman-ai-toolkit-9723)**

And these two are just the start. There are **50+ AI tools for .NET** in the same style - architecture, EF Core, performance, observability, testing, security and DevOps - with new ones added every week.

You can try all of them inside **TheCodeMan AI Toolkit** on a **7-day free trial**:

- Install and run any of the 50+ skills and agents on your own projects
- Get the local dashboard that catalogs everything and your run history
- Download what you want during the trial, no strings

If you just want to grab a few tools and go, the trial is enough. And if you want to stick around and keep getting new tools and learn how to use AI properly as a .NET developer, even better - that is what the community is for.

**[Start your 7-day free trial →](https://www.skool.com/thecodeman-ai-toolkit-9723)**

That's all from me today.

<!--END-->
