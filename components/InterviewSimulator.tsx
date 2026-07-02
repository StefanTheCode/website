"use client";
// Interview simulator with an embedded C# coding playground on coding tasks.

import { useEffect, useRef, useState } from "react";
import styles from "@/app/tools/tools.module.css";
import CodeRunner from "./CodeRunner";

// Starter code shown in the editor for every coding task.
const CODE_SCAFFOLD = `using System;
using System.Collections.Generic;
using System.Linq;

// Write your solution here, then press ▶ Run to test it.
`;

type Msg = { role: "user" | "assistant"; content: string };
type PerQuestion = { id: string; score: number; comment: string; question: string; category: string };
type Report = {
  overallScore: number;
  verdict: string;
  perQuestion: PerQuestion[];
  strengths: string[];
  gaps: string[];
  studyPlan: string;
  kitUrl?: string;
};

const CATEGORY_OPTIONS = [
  { id: "general", label: "Complete .NET" },
  { id: "arrays", label: "Arrays" },
  { id: "lists", label: "Lists" },
  { id: "trees", label: "Trees" },
  { id: "graphs", label: "Graphs" },
  { id: "stacks", label: "Stacks" },
  { id: "queues", label: "Queues" },
  { id: "heaps", label: "Heaps" },
  { id: "hashing", label: "Hashing" },
  { id: "strings", label: "Strings" },
  { id: "linked-lists", label: "Linked Lists" },
  { id: "recursion", label: "Recursion" },
  { id: "dp", label: "Dynamic Programming" },
];

// Minimal markdown: **bold**, *italic*, newlines. No external deps.
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("*") && p.endsWith("*")) return <em key={i}>{p.slice(1, -1)}</em>;
    return <span key={i}>{p}</span>;
  });
}
function TextLines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <p key={i} style={{ margin: line.trim() ? "0 0 8px" : "0 0 4px" }}>
          {renderInline(line)}
        </p>
      ))}
    </>
  );
}
// Renders text with ```fenced``` code blocks shown in a monospace <pre>.
function MessageBody({ content }: { content: string }) {
  const segments: { type: "text" | "code"; text: string }[] = [];
  const re = /```(?:[a-zA-Z#+]+)?\n?([\s\S]*?)```/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    if (m.index > last) segments.push({ type: "text", text: content.slice(last, m.index) });
    segments.push({ type: "code", text: m[1].replace(/\n+$/, "") });
    last = m.index + m[0].length;
  }
  if (last < content.length) segments.push({ type: "text", text: content.slice(last) });

  return (
    <>
      {segments.map((s, i) =>
        s.type === "code" ? (
          <pre
            key={i}
            style={{
              margin: "4px 0 8px",
              padding: "12px 14px",
              borderRadius: 10,
              background: "rgba(13,7,34,0.55)",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 13,
              lineHeight: 1.5,
              overflowX: "auto",
              whiteSpace: "pre",
            }}
          >
            {s.text}
          </pre>
        ) : (
          <TextLines key={i} text={s.text} />
        )
      )}
    </>
  );
}

export default function InterviewSimulator() {
  const [phase, setPhase] = useState<"setup" | "interview" | "finished" | "report">("setup");
  const [categories, setCategories] = useState<string[]>(["general"]);
  const [level, setLevel] = useState("mid");
  const [count, setCount] = useState(6);
  const [email, setEmail] = useState("");

  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [followUps, setFollowUps] = useState(0);
  const [total, setTotal] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [currentCoding, setCurrentCoding] = useState(false);
  const [codeAnswer, setCodeAnswer] = useState(CODE_SCAFFOLD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  async function api(payload: Record<string, unknown>) {
    const res = await fetch("/api/interview-simulator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, email: email || undefined }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
    return data;
  }

  function toggleCategory(id: string) {
    setCategories((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  }

  async function start(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api({ action: "start", categories, level, count });
      setQuestionIds(data.questionIds);
      setQIndex(data.qIndex);
      setTotal(data.total);
      setFollowUps(0);
      setCurrentCoding(!!data.coding);
      setCodeAnswer(CODE_SCAFFOLD);
      setMessages([{ role: "assistant", content: data.message }]);
      setPhase("interview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const explanation = input.trim();
    const code = codeAnswer.trim();
    const codeIsStub = code === "" || code === CODE_SCAFFOLD.trim();

    // For coding tasks, combine the written explanation with the candidate's code
    // so the interviewer/grader sees both. Otherwise it's just the typed answer.
    let answer: string;
    if (currentCoding) {
      if (!explanation && codeIsStub) return; // nothing meaningful submitted
      const parts: string[] = [];
      if (explanation) parts.push(explanation);
      if (!codeIsStub) parts.push("```csharp\n" + code + "\n```");
      answer = parts.join("\n\n");
    } else {
      answer = explanation;
      if (!answer) return;
    }

    setError("");
    const newMessages: Msg[] = [...messages, { role: "user", content: answer }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const data = await api({
        action: "answer",
        questionIds,
        qIndex,
        followUps,
        transcript: newMessages,
        answer,
        level,
      });
      setQIndex(data.qIndex);
      setFollowUps(data.followUps);
      setCurrentCoding(!!data.coding);
      if (!data.coding) setCodeAnswer(CODE_SCAFFOLD);
      setMessages((m) => [...m, { role: "assistant", content: data.message }]);
      if (data.done) setPhase("finished");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function getReport() {
    setError("");
    setLoading(true);
    try {
      const data = await api({ action: "report", questionIds, transcript: messages, level });
      setReport(data.report);
      setPhase("report");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setPhase("setup");
    setMessages([]);
    setReport(null);
    setQuestionIds([]);
    setQIndex(0);
    setFollowUps(0);
    setCurrentCoding(false);
    setCodeAnswer(CODE_SCAFFOLD);
    setError("");
  }

  // ── Setup ──
  if (phase === "setup") {
    return (
      <form className={styles.field} onSubmit={start}>
        <div className={styles.row} style={{ flexWrap: "wrap", gap: 10 }}>
          {CATEGORY_OPTIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCategory(c.id)}
              className={styles.input}
              style={{
                cursor: "pointer",
                flex: "1 1 180px",
                borderColor: categories.includes(c.id) ? "#f59e0b" : undefined,
                background: categories.includes(c.id) ? "rgba(245,158,11,0.12)" : undefined,
                fontWeight: categories.includes(c.id) ? 700 : 400,
              }}
            >
              {categories.includes(c.id) ? "✓ " : ""}
              {c.label}
            </button>
          ))}
        </div>
        <div className={styles.row}>
          <select className={styles.input} value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Level">
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
          </select>
          <select
            className={styles.input}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
            aria-label="Number of questions"
          >
            <option value={4}>Quick — 4 questions</option>
            <option value={6}>Standard — 6 questions</option>
            <option value={10}>Full round — 10 questions</option>
          </select>
        </div>
        <div className={styles.row}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email (optional — higher beta limits)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className={styles.btn} type="submit" disabled={loading || categories.length === 0}>
            {loading ? "Preparing interview…" : "Start the interview →"}
          </button>
        </div>
        <span className={styles.hint}>
          Free during beta — 5 interviews per day. The interviewer asks follow-ups based on what you actually say.
        </span>
        {error && <div className={styles.error} style={{ marginTop: 16 }}>{error}</div>}
      </form>
    );
  }

  // ── Report ──
  if (phase === "report" && report) {
    return (
      <div className={styles.results}>
        <div className={`${styles.card} ${styles.top}`}>
          <p className={styles.cardName} style={{ fontSize: 22 }}>
            Overall: {report.overallScore}/10
          </p>
          <p className={styles.why}>{report.verdict}</p>
        </div>

        {report.perQuestion.map((p) => (
          <div key={p.id} className={styles.card}>
            <div className={styles.cardHead}>
              <p className={styles.cardName} style={{ fontSize: 16 }}>{p.question}</p>
              <span className={styles.group}>{p.score}/10</span>
            </div>
            <p className={styles.why}>{p.comment}</p>
          </div>
        ))}

        <div className={styles.card}>
          <p className={styles.cardName} style={{ fontSize: 17 }}>💪 Strengths</p>
          {report.strengths.map((s, i) => (
            <p key={i} className={styles.why} style={{ marginBottom: 4 }}>• {s}</p>
          ))}
          <p className={styles.cardName} style={{ fontSize: 17, marginTop: 16 }}>📚 Gaps to close</p>
          {report.gaps.map((g, i) => (
            <p key={i} className={styles.why} style={{ marginBottom: 4 }}>• {g}</p>
          ))}
        </div>

        <div className={styles.card}>
          <p className={styles.cardName} style={{ fontSize: 17 }}>🎯 What to study next</p>
          <p className={styles.why}>{report.studyPlan}</p>
          <div className={styles.links} style={{ marginTop: 12 }}>
            <a className={`${styles.link} ${styles.linkBook}`} href={report.kitUrl || "/pass-your-interview"}>
              Review the 250 questions →
            </a>
          </div>
        </div>

        <button className={styles.btn} type="button" onClick={restart} style={{ marginTop: 8 }}>
          Start another interview →
        </button>
      </div>
    );
  }

  // ── Interview / finished ──
  return (
    <div>
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          background: "rgba(255,255,255,0.03)",
          padding: 16,
          maxHeight: 520,
          overflowY: "auto",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius: 12,
                background: m.role === "user" ? "rgba(245,158,11,0.14)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${m.role === "user" ? "rgba(245,158,11,0.35)" : "rgba(255,255,255,0.10)"}`,
                fontSize: 15,
                lineHeight: 1.55,
              }}
            >
              <MessageBody content={m.content} />
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ opacity: 0.7, fontSize: 14, padding: "4px 2px" }}>Interviewer is thinking…</div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && <div className={styles.error} style={{ marginTop: 12 }}>{error}</div>}

      {phase === "interview" ? (
        <form onSubmit={send} style={{ marginTop: 12 }}>
          {currentCoding && (
            <div style={{ marginBottom: 10 }}>
              <span className={styles.hint} style={{ display: "block", marginBottom: 6 }}>
                💻 Coding task — write &amp; run your C# below, then add a short explanation.
              </span>
              <CodeRunner
                key={`code-${qIndex}`}
                initialCode={CODE_SCAFFOLD}
                onCodeChange={setCodeAnswer}
              />
            </div>
          )}
          <div className={styles.row}>
            <textarea
              className={styles.input}
              rows={3}
              placeholder={
                currentCoding
                  ? "Explain your approach: algorithm, data structures, and time/space complexity… (or 'skip')"
                  : "Type your answer… (or 'skip')"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(e);
              }}
              style={{ resize: "vertical", flex: 1 }}
            />
          </div>
          <div className={styles.row} style={{ marginTop: 8, alignItems: "center" }}>
            <button
              className={styles.btn}
              type="submit"
              disabled={
                loading ||
                (currentCoding
                  ? !input.trim() &&
                    (codeAnswer.trim() === "" || codeAnswer.trim() === CODE_SCAFFOLD.trim())
                  : !input.trim())
              }
            >
              {loading ? "Sending…" : currentCoding ? "Submit solution →" : "Send answer →"}
            </button>
            <span className={styles.hint}>
              Question {Math.min(qIndex + 1, total)} of {total} · Ctrl+Enter to send
            </span>
          </div>
        </form>
      ) : (
        <div className={styles.row} style={{ marginTop: 12 }}>
          <button className={styles.btn} type="button" onClick={getReport} disabled={loading}>
            {loading ? "Scoring your interview…" : "Get my report →"}
          </button>
        </div>
      )}
    </div>
  );
}
