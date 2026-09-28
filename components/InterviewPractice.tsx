"use client";

// Free "solve it yourself" interview practice mode.
//
// The user picks a coding problem, writes C# in the browser, and presses
// "Run tests". We assemble `problem.harness + userCode`, run it in the shared
// in-browser .NET runtime, and parse the "##CASE|.." lines the harness prints
// into a pass/fail checklist. Solving all cases marks the problem done
// (persisted in localStorage). The official solution + complexity + explanation
// can be revealed at any time.

import { useEffect, useMemo, useRef, useState } from "react";
import { loadRunner } from "./dotnetRunner";
import { PROBLEMS, type Problem, type Category } from "./interviewProblems";
import runnerStyles from "./CodeRunner.module.css";

const STORAGE_KEY = "tcm_practice_solved_v1";
const CATEGORY_ORDER: Category[] = ["Arrays", "Strings", "Lists", "Trees"];

const DIFF_COLOR: Record<string, string> = {
  Easy: "#34d399",
  Medium: "#f59e0b",
  Hard: "#f87171",
};

type CaseResult = { idx: number; pass: boolean; label: string; detail: string };
type RunState = {
  phase: "idle" | "loading" | "running" | "done";
  cases: CaseResult[];
  passed: number;
  total: number;
  error: string | null;
  compileError: string | null;
  stdout: string;
};

const EMPTY_RUN: RunState = {
  phase: "idle",
  cases: [],
  passed: 0,
  total: 0,
  error: null,
  compileError: null,
  stdout: "",
};

// Parse the harness protocol lines out of the program's stdout.
function parseOutput(output: string): Omit<RunState, "phase"> {
  const cases: CaseResult[] = [];
  const other: string[] = [];
  let passed = 0;
  let total = 0;
  let error: string | null = null;

  for (const line of output.split("\n")) {
    if (line.startsWith("##CASE|")) {
      const parts = line.split("|");
      const idx = parseInt(parts[1], 10);
      const pass = parts[2] === "PASS";
      const label = parts[3] ?? "";
      const detail = parts.slice(4).join("|");
      cases.push({ idx, pass, label, detail });
    } else if (line.startsWith("##SUMMARY|")) {
      const parts = line.split("|");
      passed = parseInt(parts[1], 10) || 0;
      total = parseInt(parts[2], 10) || 0;
    } else if (line.startsWith("##ERROR|")) {
      error = line.slice("##ERROR|".length);
    } else if (line.trim() !== "") {
      other.push(line);
    }
  }

  return {
    cases,
    passed,
    total: total || cases.length,
    error,
    compileError: null,
    stdout: other.join("\n"),
  };
}

export default function InterviewPractice() {
  const [activeId, setActiveId] = useState(PROBLEMS[0].id);
  const [code, setCode] = useState(PROBLEMS[0].starterCode);
  const [run, setRun] = useState<RunState>(EMPTY_RUN);
  const [showSolution, setShowSolution] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const taRef = useRef<HTMLTextAreaElement>(null);

  const problem = useMemo<Problem>(
    () => PROBLEMS.find((p) => p.id === activeId) ?? PROBLEMS[0],
    [activeId]
  );

  // Load solved set from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSolved(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
  }, []);

  function persistSolved(next: Set<string>) {
    setSolved(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      /* ignore */
    }
  }

  function selectProblem(id: string) {
    const p = PROBLEMS.find((x) => x.id === id);
    if (!p) return;
    setActiveId(id);
    setCode(p.starterCode);
    setRun(EMPTY_RUN);
    setShowSolution(false);
  }

  const lineNumbers = useMemo(() => {
    const n = code.split("\n").length;
    return Array.from({ length: Math.max(n, 1) }, (_, i) => i + 1).join("\n");
  }, [code]);
  const rows = Math.max(code.split("\n").length, 12);

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
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
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      runTests();
    }
  }

  async function runTests() {
    setShowSolution(false);
    setRun({ ...EMPTY_RUN, phase: "loading" });
    try {
      const runner = await loadRunner();
      setRun((r) => ({ ...r, phase: "running" }));
      const program = problem.harness + "\n" + code;
      const res = await runner(program);

      if (!res.ok) {
        // Compilation or runtime failure before any case ran.
        setRun({ ...EMPTY_RUN, phase: "done", compileError: res.output || "Your code did not compile." });
        return;
      }

      const parsed = parseOutput(res.output);
      setRun({ ...parsed, phase: "done" });

      if (parsed.total > 0 && parsed.passed === parsed.total && !parsed.error) {
        if (!solved.has(problem.id)) {
          const next = new Set(solved);
          next.add(problem.id);
          persistSolved(next);
        }
      }
    } catch {
      setUnavailable(true);
      setRun(EMPTY_RUN);
    }
  }

  const running = run.phase === "loading" || run.phase === "running";
  const allPass = run.phase === "done" && run.total > 0 && run.passed === run.total && !run.error && !run.compileError;
  const solvedCount = solved.size;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 260px) minmax(0, 1fr)", gap: 20, alignItems: "start" }} className="tcm-practice-grid">
      {/* ── Sidebar: problem list ── */}
      <aside
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 16,
          background: "rgba(255,255,255,0.03)",
          padding: 14,
          position: "sticky",
          top: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#9C92B8" }}>
            Problems
          </span>
          <span style={{ fontSize: 13, color: "#34d399", fontWeight: 700 }}>
            {solvedCount}/{PROBLEMS.length} solved
          </span>
        </div>

        {CATEGORY_ORDER.map((cat) => {
          const inCat = PROBLEMS.filter((p) => p.category === cat);
          if (inCat.length === 0) return null;
          return (
            <div key={cat} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#C9C2DE", margin: "6px 2px 6px" }}>{cat}</div>
              {inCat.map((p) => {
                const isActive = p.id === activeId;
                const isSolved = solved.has(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectProblem(p.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      padding: "8px 10px",
                      marginBottom: 4,
                      borderRadius: 10,
                      border: `1px solid ${isActive ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.08)"}`,
                      background: isActive ? "rgba(245,158,11,0.12)" : "transparent",
                      color: "#F3EFFA",
                      fontSize: 13.5,
                      lineHeight: 1.3,
                    }}
                  >
                    <span aria-hidden style={{ color: isSolved ? "#34d399" : "rgba(255,255,255,0.25)", fontSize: 14 }}>
                      {isSolved ? "✓" : "○"}
                    </span>
                    <span style={{ flex: 1 }}>{p.title}</span>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: DIFF_COLOR[p.difficulty] }} title={p.difficulty} />
                  </button>
                );
              })}
            </div>
          );
        })}
      </aside>

      {/* ── Workspace ── */}
      <section style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>{problem.title}</h2>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: DIFF_COLOR[problem.difficulty],
              border: `1px solid ${DIFF_COLOR[problem.difficulty]}`,
              borderRadius: 999,
              padding: "2px 10px",
            }}
          >
            {problem.difficulty}
          </span>
          <span style={{ fontSize: 12, color: "#9C92B8" }}>{problem.category}</span>
        </div>

        <p style={{ color: "#C9C2DE", fontSize: 15, lineHeight: 1.6, margin: "0 0 14px" }}>{problem.prompt}</p>

        {/* Editor */}
        <div className={runnerStyles.shell}>
          <div className={runnerStyles.toolbar}>
            <span className={runnerStyles.dots}><i /><i /><i /></span>
            <span className={runnerStyles.lang}>C# · runs in your browser</span>
            <div className={runnerStyles.actions}>
              <button type="button" className={runnerStyles.btn} onClick={() => setCode(problem.starterCode)}>
                Reset
              </button>
              <button
                type="button"
                className={`${runnerStyles.btn} ${runnerStyles.btnRun}`}
                onClick={runTests}
                disabled={running}
              >
                {run.phase === "loading" ? "Loading .NET…" : run.phase === "running" ? "Running…" : "▶ Run tests"}
              </button>
            </div>
          </div>

          <div className={runnerStyles.editorWrap}>
            <div className={runnerStyles.gutter} aria-hidden="true">{lineNumbers}</div>
            <textarea
              ref={taRef}
              className={runnerStyles.textarea}
              value={code}
              rows={rows}
              spellCheck={false}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="C# code editor"
            />
          </div>
        </div>

        <p style={{ fontSize: 12.5, color: "#9C92B8", margin: "8px 2px 0" }}>
          Implement the method, then press <strong>Run tests</strong> (or ⌘/Ctrl+Enter). Your code is checked against hidden test cases.
        </p>

        {/* Results */}
        {run.phase === "done" && (
          <div
            style={{
              marginTop: 16,
              border: `1px solid ${allPass ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.12)"}`,
              borderRadius: 14,
              background: allPass ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.03)",
              padding: 16,
            }}
          >
            {run.compileError ? (
              <>
                <div style={{ fontWeight: 700, color: "#f87171", marginBottom: 8 }}>Compilation error</div>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "#f3d3d3" }}>
                  {run.compileError}
                </pre>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: allPass ? "#34d399" : "#f59e0b" }}>
                    {run.passed}/{run.total} tests passed
                  </span>
                  {allPass && <span style={{ fontSize: 14, color: "#34d399" }}>🎉 Solved — nice work!</span>}
                </div>

                {run.cases.map((c) => (
                  <div key={c.idx} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0", fontSize: 13.5 }}>
                    <span aria-hidden style={{ color: c.pass ? "#34d399" : "#f87171", fontWeight: 700 }}>
                      {c.pass ? "✓" : "✗"}
                    </span>
                    <span style={{ color: "#E7E2F3" }}>{c.label}</span>
                    {!c.pass && c.detail && (
                      <span style={{ color: "#9C92B8", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>— {c.detail}</span>
                    )}
                  </div>
                ))}

                {run.error && (
                  <div style={{ marginTop: 8, color: "#f87171", fontSize: 13 }}>
                    Runtime error while testing: {run.error}
                  </div>
                )}
                {run.stdout && (
                  <details style={{ marginTop: 10 }}>
                    <summary style={{ cursor: "pointer", color: "#9C92B8", fontSize: 12.5 }}>Your Console output</summary>
                    <pre style={{ margin: "6px 0 0", whiteSpace: "pre-wrap", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "#C9C2DE" }}>
                      {run.stdout}
                    </pre>
                  </details>
                )}
              </>
            )}
          </div>
        )}

        {unavailable && (
          <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", fontSize: 14, color: "#C9C2DE" }}>
            🚧 <strong>The .NET runtime couldn&apos;t load in this browser.</strong> Try again, or open the{" "}
            <a href="/playground" style={{ color: "#f59e0b" }}>full playground</a>.
          </div>
        )}

        {/* Reveal solution */}
        <div style={{ marginTop: 18 }}>
          <button
            type="button"
            onClick={() => setShowSolution((s) => !s)}
            style={{
              cursor: "pointer",
              background: "transparent",
              color: "#f59e0b",
              border: "1px solid rgba(245,158,11,0.5)",
              borderRadius: 10,
              padding: "9px 16px",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {showSolution ? "Hide solution" : "Reveal solution & explanation"}
          </button>

          {showSolution && (
            <div style={{ marginTop: 14, border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14, background: "rgba(13,7,34,0.35)", padding: 16 }}>
              <div style={{ fontSize: 12.5, color: "#34d399", fontWeight: 700, marginBottom: 8 }}>{problem.complexity}</div>
              <pre
                style={{
                  margin: "0 0 14px",
                  padding: "14px 16px",
                  borderRadius: 10,
                  background: "rgba(13,7,34,0.6)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 13,
                  lineHeight: 1.55,
                  overflowX: "auto",
                  whiteSpace: "pre",
                }}
              >
                {problem.solution}
              </pre>
              <p style={{ margin: 0, color: "#C9C2DE", fontSize: 14.5, lineHeight: 1.65 }}>{problem.explanation}</p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 760px) {
          .tcm-practice-grid { grid-template-columns: 1fr !important; }
          .tcm-practice-grid > aside { position: static !important; }
        }
      `}</style>
    </div>
  );
}
