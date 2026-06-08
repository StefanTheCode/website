"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/app/tools/tools.module.css";

type Source = { chapter: string; url: string };
type Msg = { role: "user" | "assistant"; content: string; sources?: Source[] };

/**
 * Reusable "Ask the Book" chat widget.
 * Pass `chapter` to bias retrieval toward the chapter the user is reading.
 * Runs in teaser mode until Phase 3 auth lifts the cap for book owners.
 */
export default function AskTheBook({ chapter }: { chapter?: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [error, setError] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const question = input.trim();
    if (question.length < 3) return;

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask-the-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, chapter, history }),
      });
      const data = await res.json();
      if (res.status === 429 && data.paywall) {
        setPaywall(true);
      } else if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.answer, sources: data.sources || [] },
        ]);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.chat}>
      <div className={styles.thread} ref={threadRef}>
        {messages.length === 0 && (
          <div className={`${styles.msg} ${styles.msgAi}`}>
            Ask me anything about the book — e.g. “When should I use a Step Builder
            instead of a Fluent Builder?” I answer only from the book's content and
            cite the chapter.
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${styles.msg} ${m.role === "user" ? styles.msgUser : styles.msgAi}`}
          >
            {m.content}
            {m.sources && m.sources.length > 0 && (
              <div className={styles.sources}>
                Sources:{" "}
                {m.sources.map((s, j) => (
                  <span key={j}>
                    <a href={s.url}>{s.chapter}</a>
                    {j < m.sources!.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div className={`${styles.msg} ${styles.msgAi}`}>Thinking…</div>}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {paywall ? (
        <div className={styles.paywallBox}>
          You've reached the free preview limit for the AI tutor.
          <br />
          <a href="/design-patterns-that-deliver-ebook">Unlock the full AI tutor with the book →</a>
        </div>
      ) : (
        <form className={styles.composer} onSubmit={send}>
          <input
            className={styles.input}
            placeholder="Ask about a pattern, a variant, or your own code…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={1500}
          />
          <button className={styles.btn} type="submit" disabled={loading}>
            Ask
          </button>
        </form>
      )}
    </div>
  );
}
