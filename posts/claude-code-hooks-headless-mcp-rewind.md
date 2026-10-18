---
title: "4 Claude Code Features .NET Developers Should Actually Use"
seo_title: "Claude Code for .NET: Hooks, Headless Mode, MCP Servers and /rewind"
subtitle: "Hooks, headless agents, external MCP servers and /rewind - the four Claude Code features I showed at Game of Codes, with the real scripts from the demo .NET project."
date: "October 18 2026"
category: "AI"
readTime: "Read Time: 9 minutes"
meta_description: "Use Claude Code hooks, headless mode, external MCP servers and /rewind on a real .NET project - with the PowerShell hooks, CI review script and configs."
---

Most people use Claude Code as a chat window next to their code: ask, read the diff, accept. That works, but it leaves the agent unsupervised in the places where it matters - it decides when it's done, it never runs outside your terminal, it only knows what's in the repo, and when it goes in the wrong direction you clean up by hand. Claude Code has a feature for each of those four problems.

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored. Everything in this post - hooks, headless reviews, MCP servers, agent workflows - is what we go through in detail in my <strong>AI for .NET Developers</strong> community: step-by-step lessons, the full source code, and 50+ ready-to-run Claude skills and agents for .NET, with new ones added based on what members ask for.</p>

<a href="https://www.skool.com/ai-for-dotnet-developers/about" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #1a0224; background: #ffbd39; border-radius: 8px; text-decoration: none;">Join the community - 7 days free →</a>

<p style="margin: 16px 0 8px 0; font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.6);">Want to reach thousands of .NET developers like this?</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 7px 14px; font-size: 13px; font-weight: 600; color: #ffffff; background: transparent; border: 1px solid #6366f1; border-radius: 8px; text-decoration: none;">Sponsor TheCodeMan →</a>
</div>

**Keywords:** Claude Code hooks, Claude Code headless mode, claude -p, Claude Code MCP server, .mcp.json, Claude Code /rewind, checkpoints, Claude Code for .NET, AI code review in CI

## The Demo Project

Everything below runs on one small .NET 10 solution I built for my Game of Codes talk, `FlightDemo`. It has no database - the API serves in-memory sample flights - so it's quick to set up:

```text
src/FlightReliability.Domain   ReliabilityCalc (the logic the agent works on)
src/FlightReliability.Api      Minimal API, /flights/reliability endpoint
tests/FlightReliability.Tests  xUnit tests
.claude/                       hooks (PowerShell)
demos/headless|rewind          scripts and prompts
```

The hooks are written in PowerShell because I'm on Windows, but the same idea works with bash scripts on Linux or macOS.

## 1. Hooks: Rules the Agent Can't Talk Its Way Around

You can write "always run the tests before you finish" in `CLAUDE.md`, and most of the time the agent will follow it. Most of the time isn't good enough for rules you actually depend on. Instructions are suggestions to the model; hooks are code that runs on specific events in the agent's lifecycle, every time.

Hooks live in `.claude/settings.json`. This is the relevant part from the demo project:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "powershell -NoProfile -ExecutionPolicy Bypass -File \"${CLAUDE_PROJECT_DIR}/.claude/hooks/protect-tests.ps1\"" }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "powershell -NoProfile -ExecutionPolicy Bypass -File \"${CLAUDE_PROJECT_DIR}/.claude/hooks/format-cs.ps1\"", "statusMessage": "Formatting C#..." }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "powershell -NoProfile -ExecutionPolicy Bypass -File \"${CLAUDE_PROJECT_DIR}/.claude/hooks/gate-tests.ps1\"", "timeout": 300, "statusMessage": "Running tests..." }
        ]
      }
    ]
  }
}
```

Three events, three jobs:

- **`PreToolUse`** runs before a tool call and can block it.
- **`PostToolUse`** runs after a tool call finishes.
- **`Stop`** runs when the agent thinks it's done and is about to hand control back to you.

The `matcher` filters by tool name, so `Edit|Write` means "only when the agent changes a file". Each hook gets the event details as JSON on stdin - including the tool name and `tool_input.file_path`. You can check what's loaded at any time with the `/hooks` command.

### PostToolUse: format every C# file the agent touches

The simplest useful hook. After every edit, run `dotnet format` on that one file:

```powershell
$raw = [Console]::In.ReadToEnd()
try { $fp = ($raw | ConvertFrom-Json).tool_input.file_path } catch { $fp = $null }

if ($fp -and $fp.ToString().EndsWith(".cs")) {
    Push-Location $env:CLAUDE_PROJECT_DIR
    try {
        $rel = (Resolve-Path -Relative -LiteralPath $fp)
        dotnet format --include $rel *> $null
    } finally { Pop-Location }
}
exit 0
```

(The full version in the repo also finds the nearest `.csproj` so `dotnet format` doesn't have to guess the project.) The agent no longer needs to care about formatting, and you no longer review whitespace changes.

### Stop: "done" means the tests pass

This is the hook that changes how the agent behaves. When the agent tries to finish, the hook runs the test suite. If anything fails, it exits with code `2`:

```powershell
$proj = Join-Path $env:CLAUDE_PROJECT_DIR "tests/FlightReliability.Tests"
$out = dotnet test "$proj" --nologo 2>&1 | Out-String

if ($LASTEXITCODE -ne 0) {
    [Console]::Error.WriteLine("Tests are failing. Fix the CODE before finishing:")
    [Console]::Error.WriteLine((($out -split "`n" | Select-Object -Last 25) -join "`n"))
    exit 2
}
exit 0
```

Exit code `2` on a `Stop` hook blocks the agent from stopping, and what you write to stderr is fed back to it as the reason. So the agent gets the last 25 lines of the test output and keeps working.

### PreToolUse: the agent can't "fix" a test by editing it

The obvious way for an agent to get past a failing test is to change the test. This hook denies any edit to a test file:

```powershell
$raw = [Console]::In.ReadToEnd()
try { $fp = ($raw | ConvertFrom-Json).tool_input.file_path } catch { $fp = $null }

if ($fp -and ($fp -match '[\\/][Tt]ests[\\/]' -or $fp -match 'Tests\.cs$')) {
    $payload = @{ hookSpecificOutput = @{
        hookEventName = "PreToolUse"
        permissionDecision = "deny"
        permissionDecisionReason = "Editing tests is blocked by repo policy. Tests change through a human and a PR, not the agent."
    } }
    Write-Output ($payload | ConvertTo-Json -Compress -Depth 5)
}
exit 0
```

Instead of an exit code, this one prints JSON with `permissionDecision: "deny"`. The tool call is cancelled and the reason goes back to the agent.

### How the three work together

In the demo, the test project already has these tests for a `DelayRisk` method:

```csharp
[Fact] public void Risk_high()    => Assert.Equal("high",    ReliabilityCalc.DelayRisk(75));
[Fact] public void Risk_medium()  => Assert.Equal("medium",  ReliabilityCalc.DelayRisk(40));
[Fact] public void Risk_low()     => Assert.Equal("low",     ReliabilityCalc.DelayRisk(10));

[Fact] public void Risk_unknown_when_negative() => Assert.Equal("unknown", ReliabilityCalc.DelayRisk(-5));
```

Then I give the agent an incomplete spec on purpose: "if avgDelayMinutes >= 60 return 'high', if >= 30 return 'medium', otherwise 'low'". It writes three branches and says it's done. The Stop hook runs the tests, `Risk_unknown_when_negative` fails, and the agent is sent back. If it tries to edit the test file, `protect-tests` blocks it. The only way left to finish is to fix the code:

```csharp
public static string DelayRisk(int avgDelayMinutes) => avgDelayMinutes switch
{
    < 0 => "unknown",
    >= 60 => "high",
    >= 30 => "medium",
    _ => "low"
};
```

The point isn't this particular rule. It's that "done" is now defined by your test suite, not by the agent's opinion of its own work.

## 2. Headless Agents: Claude Code Without a Chat Window

`claude -p "<prompt>"` runs Claude Code non-interactively: it takes the prompt, does the work, prints the result and exits. That makes it a normal command-line tool you can call from scripts, git hooks and CI pipelines.

The demo uses it as a code reviewer that can fail a build. The script reviews the staged diff for leaked secrets and serious bugs:

```powershell
$diff = git diff --cached | Out-String
if ([string]::IsNullOrWhiteSpace($diff)) { Write-Host "No staged changes."; exit 0 }

$prompt = @"
You are a strict code reviewer. Review this DIFF for leaked secrets or credentials
(API keys, tokens, passwords, connection strings) and for serious bugs.
You may explain briefly. But you MUST end your reply with a final line that is EXACTLY one
of these two tokens and nothing else on that line:
VERDICT_BLOCK
VERDICT_PASS
Use VERDICT_BLOCK if you find ANY hardcoded secret/credential or a serious bug; otherwise VERDICT_PASS.
Diff:
$diff
"@

$out = (claude -p $prompt | Out-String).Trim()
Write-Host "Review: $out"

if ($out -match 'VERDICT_BLOCK') { Write-Host "Blocker found - failing the build."; exit 1 }
if ($out -match 'VERDICT_PASS')  { Write-Host "No blockers."; exit 0 }
Write-Host "No clear verdict - blocking to be safe."; exit 1
```

Two details matter here:

- **A fixed verdict token.** Free-form review text is hard to act on in a script. Asking for one of two exact tokens on the last line gives you something you can match reliably and turn into an exit code. If you need more structure, `claude -p` also supports `--output-format json`.
- **Fail closed.** If the model's reply doesn't contain either token, the script blocks. A reviewer that silently passes when it gets confused is worse than no reviewer.

Once the script exists, wiring it in is a few lines. Locally, as a git `pre-push` hook:

```sh
#!/bin/sh
# Install: copy to .git/hooks/pre-push
powershell -NoProfile -ExecutionPolicy Bypass -File "$(git rev-parse --show-toplevel)/demos/headless/review-push.ps1"
```

And in CI, as an Azure DevOps step that gates the build:

```yaml
trigger: [ main ]
pool: { vmImage: windows-latest }
steps:
  - checkout: self
    fetchDepth: 0
  - powershell: npm install -g @anthropic-ai/claude-code
    displayName: Install Claude CLI
  - powershell: ./demos/headless/review-diff.ps1
    displayName: AI diff review (gates the build)
    env:
      ANTHROPIC_API_KEY: $(ANTHROPIC_API_KEY)   # secret pipeline variable
```

In CI there's no logged-in user, so authentication goes through the `ANTHROPIC_API_KEY` environment variable, stored as a secret pipeline variable. (`review-push.ps1` is the same script, it just diffs the outgoing commits instead of the staged changes.)

This doesn't replace human review. It's a cheap first pass that catches the obvious things - a connection string in `appsettings.json`, an API key in a test - before a person spends time on the PR.

## 3. External MCP Servers: Give the Agent Tools It Doesn't Have

Out of the box, Claude Code can read files, edit them and run shell commands. MCP (Model Context Protocol) servers add more tools: query a database, read your issue tracker, or - in my case - run load tests against a .NET API.

For the talk I used my Performance Lab, a C# MCP server I wrote about in [Build a C# MCP Server for .NET API Performance Testing](https://thecodeman.net/posts/building-mcp-server-in-dotnet). It runs on `http://localhost:5200/mcp` and exposes tools like `run_load_test` and `compare_endpoints`.

To make a server available to everyone working on the repo, add it to `.mcp.json` in the project root:

```json
{
  "mcpServers": {
    "performance-lab": {
      "type": "http",
      "url": "http://localhost:5200/mcp"
    }
  }
}
```

Or let the CLI write that file for you:

```bash
claude mcp add --transport http performance-lab http://localhost:5200/mcp --scope project
```

Without `--scope project`, the server is added only for you, locally, and isn't shared through the repo. Note that VS Code uses a `"servers"` key in its own `mcp.json`; Claude Code expects `"mcpServers"`, so you can't just copy the VS Code file over.

Inside Claude Code, `/mcp` shows which servers are connected and what tools they expose. From there you ask in plain language - "compare /slow-thread-sleep with /slow-task-delay, 15 seconds, 20 users" - and the agent decides which tool to call and with what parameters. The tool descriptions you write in C# (`[Description(...)]`) are what the agent reads to make that decision, so they're worth writing carefully.

I recorded the full setup and a live session: [watch the MCP video on YouTube](https://youtu.be/RPz8f857KWA).

Treat MCP servers like any other dependency. A server can read and act on whatever you give it access to, so only connect ones you trust.

## 4. /rewind: Undo the Agent's Last Few Steps

Sometimes the agent goes in a direction you didn't want. In the demo I use this prompt, which reliably sprawls:

> "Change how we calculate reliability to use a rolling 30-day window. Make it production-grade: add a caching layer over the `/flights/reliability` endpoint, a generic cache abstraction, a decorator, and wire it all through DI. Update the tests too."

After three or four steps there are new files, an edited `Program.cs` and changed tests. The usual cleanup is `git stash` or `git reset`, and then explaining the context to the agent again, because the conversation still contains the whole wrong path.

Claude Code creates a checkpoint for every prompt you send. Run `/rewind` (or press `Esc` twice) and you get a list of those points. For each one you can restore:

- **code and conversation** - files and chat both go back to that point,
- **conversation only** - keep the code, drop the discussion,
- **code only** - keep the discussion, undo the file changes.

Picking "code and conversation" before the sprawling prompt puts everything back as it was, and you can ask again with a narrower prompt.

The limit is important: checkpoints only track changes made through Claude's file editing tools. They don't undo what a bash command did - a deleted file, a migration that ran against a database, a pushed commit - and they don't track changes made outside the session. It's an undo for local edits, not a replacement for git.

I show this live in a short video: [watch the /rewind video on YouTube](https://youtu.be/UDBYkR0b7Y4).

## How They Fit Together

Each feature covers a different gap:

- **Hooks** decide what "done" means and enforce rules the agent can't skip.
- **Headless mode** runs the agent where you aren't - git hooks and CI.
- **MCP servers** give it tools beyond the file system and the shell.
- **/rewind** gives you a cheap way back when it goes wrong.

None of them need a big setup. The hooks in this post are three short PowerShell files, and the headless reviewer is one script.

## FAQ

### Do Claude Code hooks work on Windows?

Yes. A hook is just a command, so it can be PowerShell, bash, or a compiled .NET tool. The demo project uses PowerShell scripts called through `powershell -NoProfile -ExecutionPolicy Bypass -File`.

### What's the difference between a hook and an instruction in CLAUDE.md?

An instruction in `CLAUDE.md` is context the model will usually follow. A hook is code Claude Code runs on an event, regardless of what the model decides. Use `CLAUDE.md` for conventions and hooks for rules that must always hold.

### Can I use `claude -p` in GitHub Actions instead of Azure DevOps?

Yes. The pipeline step is just "install the CLI, set `ANTHROPIC_API_KEY`, run the script", so it works in any CI system that can run a shell command.

### Does /rewind replace git?

No. It only restores changes made through Claude's file editing tools within the session. Commit before larger tasks and use `/rewind` for quick undo inside the session.

## Wrapping Up

Hooks, headless mode, external MCP servers and `/rewind` are the four Claude Code features I use most on real .NET projects. Hooks turn your test suite into the definition of done, `claude -p` puts the agent into git hooks and CI, MCP servers connect it to your own tools, and `/rewind` lets you back out of a bad direction without starting over.

If you want to go through these step by step - with the full FlightDemo source, the hook scripts and the Performance Lab MCP server - that's what we do in my [AI for .NET Developers community](https://www.skool.com/ai-for-dotnet-developers/about).

That's all from me today.

<!--END-->
