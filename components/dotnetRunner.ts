// Shared in-browser .NET runtime loader.
//
// Loads the self-hosted .NET WebAssembly runtime (Roslyn scripting) once and
// returns a `run(code)` function that compiles & executes arbitrary C# entirely
// client-side. Both the free C# Playground (CodeRunner) and the Interview
// Practice feature use this so the ~10MB runtime is fetched only once per page.
//
// The runtime assets live in /public/dotnet/_framework/ and are produced by the
// wasm-runner project (see wasm-runner/README.md). Until those assets exist,
// loadRunner() rejects and callers keep their editors usable in read-only mode.

export type RunResult = { ok: boolean; output: string };

// One shared runtime across every consumer on the page.
let runtimePromise: Promise<(code: string) => Promise<RunResult>> | null = null;

export function loadRunner(): Promise<(code: string) => Promise<RunResult>> {
  if (runtimePromise) return runtimePromise;

  runtimePromise = (async () => {
    // Load the .NET WASM runtime at runtime ONLY. We hide the import from the
    // bundler entirely (new Function) so neither webpack nor Turbopack tries to
    // resolve /dotnet/dotnet.js at build time — it only exists after the
    // wasm-runner build (see wasm-runner/README.md).
    const dynamicImport = new Function("u", "return import(u)") as (u: string) => Promise<any>;
    // .NET 8 AppBundle ships dotnet.js inside _framework/. It resolves its own
    // siblings (dotnet.runtime.js, dotnet.native.wasm, blazor.boot.json) relative
    // to itself, so pointing here loads the whole runtime from /dotnet/_framework/.
    const mod: any = await dynamicImport("/dotnet/_framework/dotnet.js");
    const dotnet = mod.dotnet;
    // Skip Subresource-Integrity verification of the boot resources — git
    // end-of-line normalization can rewrite the text-based runtime files on
    // deploy so the byte hashes no longer match, which makes the runtime refuse
    // to load in production while still working locally. The files are served
    // from our own origin, so integrity adds nothing here.
    const { getAssemblyExports, getConfig } = await dotnet
      .withConfig({ disableIntegrityCheck: true })
      .create();
    const config = getConfig();
    const exports = await getAssemblyExports(config.mainAssemblyName);

    return async (code: string): Promise<RunResult> => {
      const raw: string = await exports.Playground.Runner.Run(code);
      try {
        return JSON.parse(raw) as RunResult;
      } catch {
        return { ok: true, output: raw };
      }
    };
  })();

  return runtimePromise;
}
