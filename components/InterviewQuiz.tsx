"use client";

import { useState } from "react";
import styles from "@/app/tools/tools.module.css";
import catalog from "@/components/data/patternCatalog.json";

type QA = { q: string; a: string };
type Pattern = { id: string; name: string; group: string; book: string | null; blog: string | null };

const PATTERNS = (catalog as { patterns: Pattern[] }).patterns;
// Book chapters first, then the rest of the catalog — grouped for the <optgroup>.
const GROUPS = ["Creational", "Structural", "Behavioral", "Modern .NET"];

export default function InterviewQuiz() {
  const [patternId, setPatternId] = useState("strategy");
  const [difficulty, setDifficulty] = useState("mid");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<QA[]>([]);
  const [pattern, setPattern] = useState<{ name: string; blogUrl: string | null; bookUrl: string | null } | null>(null);
  const [open, setOpen] = useState<Record<number, boolean>>({});

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setQuestions([]);
    setPattern(null);
    setOpen({});
    setLoading(true);
    try {
      const res = await fetch("/api/interview-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patternId, difficulty, email: email || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setQuestions(data.questions || []);
        setPattern(data.pattern || null);
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
          <select
            className={styles.input}
            value={patternId}
            onChange={(e) => setPatternId(e.target.value)}
            aria-label="Pattern"
          >
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
          <select
            className={styles.input}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            aria-label="Difficulty"
          >
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
          </select>
        </div>
        <div className={styles.row}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email (optional — for more daily quizzes)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? "Generating…" : "Generate questions →"}
          </button>
        </div>
        <span className={styles.hint}>
          Free. Questions are generated for the pattern &amp; level you pick — ★ patterns have a full book chapter.
        </span>
      </form>

      {error && <div className={styles.error} style={{ marginTop: 20 }}>{error}</div>}

      {questions.length > 0 && (
        <div className={styles.results}>
          {questions.map((qa, i) => (
            <div key={i} className={styles.card}>
              <p className={styles.cardName} style={{ fontSize: 17 }}>
                Q{i + 1}. {qa.q}
              </p>
              {open[i] ? (
                <p className={styles.why}>{qa.a}</p>
              ) : (
                <button
                  type="button"
                  className={`${styles.link} ${styles.linkBook}`}
                  style={{ marginTop: 12, cursor: "pointer" }}
                  onClick={() => setOpen((o) => ({ ...o, [i]: true }))}
                >
                  Show answer ↓
                </button>
              )}
            </div>
          ))}

          {pattern && (pattern.bookUrl || pattern.blogUrl) && (
            <div className={`${styles.card} ${styles.top}`}>
              <p className={styles.cardName} style={{ fontSize: 18 }}>
                Go deeper on {pattern.name}
              </p>
              <div className={styles.links} style={{ marginTop: 12 }}>
                {pattern.bookUrl && (
                  <a className={`${styles.link} ${styles.linkBlog}`} href={pattern.bookUrl}>
                    Read the chapter →
                  </a>
                )}
                {pattern.blogUrl && (
                  <a className={`${styles.link} ${styles.linkBook}`} href={pattern.blogUrl}>
                    Free tutorial →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
