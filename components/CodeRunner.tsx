"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CodeRunner.module.css";

/**
// CodeRunner: in-browser C# editor (also embedded in the interview simulator).
/**
 * CodeRunner — an in-browser C# editor that compiles & runs the code entirely
 * client-side via the self-hosted .NET WebAssembly runtime (Roslyn scripting).
 *
 * The runtime assets live in /public/dotnet/ and are produced by the wasm-runner
 * project (see wasm-runner/README.md). Until those assets exist, the editor still
 * works for editing/copying and the Run button explains how to enable execution.
 */

type RunResult = { ok: boolean; output: string };

// One shared runtime across every CodeRunner instance on the page.
let runtimePromise: Promise<(code: string) => Promise<RunResult>> | null = null;

async function loadRunner(): Promise<(code: string) => Promise<RunResult>> {
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
    const { getAssemblyExports, getConfig } = await dotnet.create();
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

export default function CodeRunner({
  initialCode,
  autoFocus = false,
  onCodeChange,
}: {
  initialCode: string;
  autoFocus?: boolean;
  onCodeChange?: (code: string) => void;
}) {
  const [code, setCode] = useState(initialCode.trimEnd());

  // Let a parent (e.g. the interview simulator) capture the current code.
  // Fires on mount with the initial code and on every edit.
  useEffect(() => {
    onCodeChange?.(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);
  const [output, setOutput] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [phase, setPhase] = useState<"idle" | "loading" | "running" | "done">("idle");
  const [unavailable, setUnavailable] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const lineNumbers = useMemo(() => {
    const n = code.split("\n").length;
    return Array.from({ length: Math.max(n, 1) }, (_, i) => i + 1).join("\n");
  }, [code]);
  const rows = Math.max(code.split("\n").length, 10);

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Tab inserts 4 spaces instead of leaving the editor.
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const next = code.slice(0, start) + "    " + code.slice(end);
      setCode(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      });
    }
    // Ctrl/Cmd+Enter runs.
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      run();
    }
  }

  async function run() {
    setIsError(false);
    setOutput("");
    setPhase("loading");
    try {
      const runner = await loadRunner();
      setPhase("running");
      const res = await runner(code);
      setOutput(res.output || (res.ok ? "(no output)" : "(failed with no message)"));
      setIsError(!res.ok);
      setPhase("done");
    } catch {
      // Runtime assets not present (or failed to load) → keep editor usable.
      setUnavailable(true);
      setPhase("idle");
    }
  }

  function reset() {
    setCode(initialCode.trimEnd());
    setOutput("");
    setIsError(false);
    setPhase("idle");
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* ignore */
    }
  }

  const running = phase === "loading" || phase === "running";

  return (
    <div className={styles.shell}>
      <div className={styles.toolbar}>
        <span className={styles.dots}><i /><i /><i /></span>
        <span className={styles.lang}>C# · runs in your browser</span>
        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={copy}>Copy</button>
          <button type="button" className={styles.btn} onClick={reset}>Reset</button>
          <button type="button" className={`${styles.btn} ${styles.btnRun}`} onClick={run} disabled={running}>
            {phase === "loading" ? "Loading .NET…" : phase === "running" ? "Running…" : "▶ Run"}
          </button>
        </div>
      </div>

      <div className={styles.editorWrap}>
        <div className={styles.gutter} aria-hidden="true">{lineNumbers}</div>
        <textarea
          ref={taRef}
          className={styles.textarea}
          value={code}
          rows={rows}
          spellCheck={false}
          autoFocus={autoFocus}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="C# code editor"
        />
      </div>

      {(phase !== "idle" || output) && (
        <div className={styles.output}>
          <div className={styles.outHead}>
            {running && <span className={styles.spinner} />}
            {running ? "Working…" : isError ? "Error" : "Output"}
          </div>
          <pre className={`${styles.outBody} ${isError ? styles.err : ""}`}>
            {output || <span className={styles.outEmpty}>Press Run (or ⌘/Ctrl+Enter).</span>}
          </pre>
        </div>
      )}

      {unavailable && (
        <div className={styles.banner}>
          <span>🚧</span>
          <span>
            <strong>The .NET runtime couldn&apos;t load in this browser.</strong> You can
            still edit and copy the code above — try again, or open it in the{" "}
            <a href="/playground" style={{ color: "inherit", textDecoration: "underline" }}>
              full playground
            </a>
            .
          </span>
        </div>
      )}
    </div>
  );
}
