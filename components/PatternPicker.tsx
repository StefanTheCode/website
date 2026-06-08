"use client";

import { useState } from "react";
import styles from "@/app/tools/tools.module.css";

type Rec = {
  id: string;
  name: string;
  group?: string;
  why: string;
  blogUrl: string | null;
  bookUrl: string | null;
};
type Related = { id: string; name: string; blogUrl: string | null; bookUrl: string | null };

export default function PatternPicker() {
  const [problem, setProblem] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recs, setRecs] = useState<Rec[]>([]);
  const [related, setRelated] = useState<Related[]>([]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setRecs([]);
    setRelated([]);
    if (problem.trim().length < 8) {
      setError("Please describe your problem (at least a sentence).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/pattern-picker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, email: email || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setRecs(data.recommendations || []);
        setRelated(data.related || []);
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
        <textarea
          className={styles.textarea}
          placeholder="Describe your problem… e.g. 'I have a big switch statement picking shipping cost calculators per country and it keeps growing.'"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          maxLength={2000}
        />
        <div className={styles.row}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email (optional — for more daily picks)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? "Thinking…" : "Find my pattern →"}
          </button>
        </div>
        <span className={styles.hint}>
          Free. Grounded in TheCodeMan's .NET pattern catalog — every result links to a full tutorial.
        </span>
      </form>

      {error && <div className={styles.error} style={{ marginTop: 20 }}>{error}</div>}

      {recs.length > 0 && (
        <div className={styles.results}>
          {recs.map((r, i) => (
            <div key={r.id} className={`${styles.card} ${i === 0 ? styles.top : ""}`}>
              <div className={styles.cardHead}>
                <p className={styles.cardName}>
                  {i === 0 ? "✅ " : ""}
                  {r.name}
                </p>
                {r.group && <span className={styles.group}>{r.group}</span>}
              </div>
              <p className={styles.why}>{r.why}</p>
              <div className={styles.links}>
                {r.blogUrl && (
                  <a className={`${styles.link} ${styles.linkBlog}`} href={r.blogUrl}>
                    Read the tutorial →
                  </a>
                )}
                {r.bookUrl && (
                  <a className={`${styles.link} ${styles.linkBook}`} href={r.bookUrl}>
                    Deep dive in the book →
                  </a>
                )}
              </div>
            </div>
          ))}

          {related.length > 0 && (
            <div>
              <p className={styles.relTitle}>Also worth considering:</p>
              <div className={styles.relList}>
                {related.map((r) => (
                  <a key={r.id} className={styles.rel} href={r.blogUrl || r.bookUrl || "#"}>
                    {r.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
