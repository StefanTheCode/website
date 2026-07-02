"use client";

import { useState } from "react";
import styles from "@/app/tools/tools.module.css";
import catalog from "@/components/data/patternCatalog.json";

type Pattern = { id: string; name: string; group: string; book: string | null; blog: string | null };
type Side = { id: string; name: string; group: string; blogUrl: string | null; bookUrl: string | null };
type Comparison = { tldr: string; whenA: string; whenB: string; difference: string; confusion: string };

const PATTERNS = (catalog as { patterns: Pattern[] }).patterns;
const GROUPS = ["Creational", "Structural", "Behavioral", "Modern .NET"];

function PatternSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <select className={styles.input} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
      {GROUPS.map((g) => (
        <optgroup key={g} label={g}>
          {PATTERNS.filter((p) => p.group === g).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.book ? " ★" : ""}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

function LinkRow({ side }: { side: Side }) {
  if (!side.bookUrl && !side.blogUrl) return null;
  return (
    <div className={styles.links} style={{ marginTop: 10 }}>
      {side.bookUrl && (
        <a className={`${styles.link} ${styles.linkBlog}`} href={side.bookUrl}>
          {side.name} chapter →
        </a>
      )}
      {!side.bookUrl && side.blogUrl && (
        <a className={`${styles.link} ${styles.linkBook}`} href={side.blogUrl}>
          {side.name} tutorial →
        </a>
      )}
    </div>
  );
}

export default function PatternComparison() {
  const [a, setA] = useState("strategy");
  const [b, setB] = useState("factory-method");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ a: Side; b: Side; comparison: Comparison } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    if (a === b) {
      setError("Pick two different patterns to compare.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/pattern-comparison", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ a, b, email: email || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className={styles.field} onSubmit={submit}>
        <div className={styles.row}>
          <PatternSelect value={a} onChange={setA} label="First pattern" />
          <span style={{ color: "var(--muted)", fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>vs</span>
          <PatternSelect value={b} onChange={setB} label="Second pattern" />
        </div>
        <div className={styles.row}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email (optional — for more daily comparisons)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? "Comparing…" : "Compare →"}
          </button>
        </div>
        <span className={styles.hint}>
          Free. Get a clear, .NET-specific verdict on which to use when — ★ patterns have a full book chapter.
        </span>
      </form>

      {error && <div className={styles.error} style={{ marginTop: 20 }}>{error}</div>}

      {result && (
        <div className={styles.results}>
          <div className={`${styles.card} ${styles.top}`}>
            <p className={styles.cardName}>
              {result.a.name} <span style={{ color: "var(--muted)" }}>vs</span> {result.b.name}
            </p>
            <p className={styles.why} style={{ marginBottom: 0 }}>{result.comparison.tldr}</p>
          </div>

          <div className={styles.card}>
            <p className={styles.cardName} style={{ fontSize: 18 }}>✅ Pick {result.a.name} when…</p>
            <p className={styles.why}>{result.comparison.whenA}</p>
            <LinkRow side={result.a} />
          </div>

          <div className={styles.card}>
            <p className={styles.cardName} style={{ fontSize: 18 }}>✅ Pick {result.b.name} when…</p>
            <p className={styles.why}>{result.comparison.whenB}</p>
            <LinkRow side={result.b} />
          </div>

          <div className={styles.card}>
            <p className={styles.cardName} style={{ fontSize: 18 }}>The core difference</p>
            <p className={styles.why}>{result.comparison.difference}</p>
          </div>

          {result.comparison.confusion && (
            <div className={styles.card}>
              <p className={styles.cardName} style={{ fontSize: 18 }}>⚠️ The common mix-up</p>
              <p className={styles.why} style={{ marginBottom: 0 }}>{result.comparison.confusion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
