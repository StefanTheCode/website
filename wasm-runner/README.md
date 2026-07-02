# wasm-runner — in-browser C# for the playground

This small .NET project compiles to **WebAssembly** and powers the website's
**`/playground`** page and the inline **Run** buttons in the web reader. It
exposes a single `[JSExport] Run(code)` that compiles and executes arbitrary
**self-contained** C# using **Roslyn scripting** — entirely in the visitor's
browser, with no server.

The website (a static Next.js export) loads `/dotnet/_framework/dotnet.js`, calls
`dotnet.create()`, and invokes `Playground.Runner.Run(code)`. Until you build
this project, the editor still works for editing/copying and the Run button
shows a friendly "runtime not built yet" note.

## Prerequisites

- **.NET 8 SDK** (`dotnet --version` → 8.x)
- The **wasm-tools** workload (the build script installs it for you)

## Build (one command)

**Windows (PowerShell) — this is you:**

```powershell
cd wasm-runner
.\build-wasm.ps1
```

**macOS / Linux:**

```bash
cd wasm-runner
./build-wasm.sh
```

Either script installs the `wasm-tools` workload, runs `dotnet publish -c Release`
for `browser-wasm`, and copies the published **AppBundle** (`dotnet.js` +
`_framework/`) into **`../public/dotnet/`**. Commit that folder — once it's
deployed, the playground "▶ Run" button works for everyone.

> The rest of the site builds and deploys fine **without** this step: the
> front-end hides the `/dotnet/dotnet.js` import from the bundler, so before the
> runtime exists the editor still edits/copies and the Run button shows a small
> "runtime couldn't load" note. Running the build above is what flips it live.

## How the pieces fit

| Piece | Where |
|------|-------|
| Runner project (this folder) | `wasm-runner/` — **not** compiled by Next.js |
| Built runtime assets | `public/dotnet/` (`dotnet.js`, `_framework/…`) — served at `/dotnet/…` |
| Editor + loader (front-end) | `components/CodeRunner.tsx` → dynamic-imports `/dotnet/_framework/dotnet.js` |
| Playground page | `app/playground/page.tsx` + `components/CodePlayground.tsx` |

## Notes & gotchas

- **Only self-contained C# runs.** Roslyn scripting compiles against the BCL
  reference assemblies bundled by `Basic.Reference.Assemblies.Net80`. Code that
  needs EF Core, ASP.NET, MediatR, HttpClient, a database, or a server **won't
  run** — there's no infrastructure in the sandbox. That's by design; those
  patterns are taught in full in the book.
- **Interpreter, not AOT.** `RunAOTCompilation` is off and trimming is disabled
  on purpose — Roslyn needs to emit and run IL, which the Mono interpreter does.
  This makes the bundle larger (a few MB, cached after first load) but is what
  makes "run any code" possible.
- **`Expression<>.Compile()` works** (it falls back to interpretation on WASM),
  so the Specification example runs in-memory. EF Core *translation* is a
  separate thing and still won't run here.
- If a package symbol differs in your environment (e.g. the
  `Basic.Reference.Assemblies.Net80.References.All` accessor), adjust the
  `WithReferences(...)` call in `Program.cs` to match the package version you
  install.
- First load downloads the runtime; it's cached by the browser afterward. If you
  want to keep the main site lean, the `/dotnet/` assets are only fetched when a
  visitor actually opens the playground or clicks Run.
