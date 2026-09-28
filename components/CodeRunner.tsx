"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CodeRunner.module.css";
import { loadRunner } from "./dotnetRunner";

/**
 * CodeRunner — an in-browser C# editor that compiles & runs the code entirely
 * client-side via the self-hosted .NET WebAssembly runtime (Roslyn scripting).
 * Also embedded in the interview simulator.
 *
 * The runtime itself is loaded via the shared loadRunner() in ./dotnetRunner so
 * a single runtime is reused across every editor on the page. The assets live in
 * /public/dotnet/ and are produced by the wasm-runner project. Until those assets
 * exist, the editor still works for editing/copying and the Run button explains
 * how to enable execution.
 */

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
