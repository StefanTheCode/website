"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Renders unlocked HTML and wires up the copy buttons emitted by markdown.mjs. */
function UnlockedChapter({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    function handleClick(e: MouseEvent) {
      const btn = (e.target as Element).closest<HTMLElement>("[data-copy-code]");
      if (!btn) return;
      const encoded = btn.dataset.copyCode ?? "";
      const code = decodeURIComponent(
        Array.from(atob(encoded), (c) =>
          "%" + c.charCodeAt(0).toString(16).padStart(2, "0")
        ).join("")
      );
      navigator.clipboard.writeText(code).then(() => {
        const prev = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => {
          btn.textContent = prev;
        }, 1200);
      });
    }

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, []);

  return (
    <div ref={ref} className="rd-body" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

type Props = {
  bookSlug: string;
  chapterSlug: string;
  productUrl: string;
  summary?: string;
};

type State =
  | { kind: "loading" }
  | { kind: "unlocked"; html: string }
  | { kind: "locked"; reason: "anon" | "notowned" };

const inputStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 360,
  background: "rgba(13,7,34,.55)",
  color: "#F3EFFA",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 11,
  padding: "12px 16px",
  fontSize: 15,
  fontFamily: "inherit",
  marginBottom: 10,
};

export default function PaidChapter({ bookSlug, chapterSlug, productUrl, summary }: Props) {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/content-chapter?book=${encodeURIComponent(bookSlug)}&chapter=${encodeURIComponent(chapterSlug)}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setState({ kind: "unlocked", html: data.html });
      } else if (res.status === 403) {
        setState({ kind: "locked", reason: "notowned" });
      } else {
        setState({ kind: "locked", reason: "anon" });
      }
    } catch {
      setState({ kind: "locked", reason: "anon" });
    }
  }, [bookSlug, chapterSlug]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErr("Please enter a valid email.");
    if (key.trim().length < 3) return setErr("Enter your order number or license key.");
    setBusy(true);
    try {
      const res = await fetch("/api/auth-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, key }),
      });
      const data = await res.json();
      if (res.ok) {
        setState({ kind: "loading" });
        await fetchContent();
      } else {
        setErr(data.error || "Sign-in failed.");
      }
    } catch {
      setErr("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (state.kind === "loading") {
    return (
      <div className="rd-paywall">
        <p style={{ margin: 0 }}>Checking your access…</p>
      </div>
    );
  }

  if (state.kind === "unlocked") {
    return <UnlockedChapter html={state.html} />;
  }

  return (
    <div className="rd-paywall">
      <div className="rd-lockicon">🔒</div>
      {state.reason === "notowned" ? (
        <>
          <h3>This book isn't in your account</h3>
          <p>
            You're signed in, but this chapter is part of a book your account doesn't include.
            Get the book to unlock every chapter, the runnable projects, and the AI tutor.
          </p>
          <a className="rd-cta" href={productUrl}>
            Get the full book →
          </a>
        </>
      ) : (
        <>
          <h3>This chapter is part of the full book</h3>
          <p>
            {summary ||
              "Unlock every chapter, the 20 runnable mini-projects, the 100 interview Q&A, and the AI tutor."}
          </p>
          <p style={{ color: "#9C92B8", fontSize: 14, margin: "0 0 14px" }}>
            Open the personal access link from your purchase email, or sign in here:
          </p>

          <form
            onSubmit={signIn}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "0 auto 16px" }}
          >
            <input
              style={inputStyle}
              type="email"
              placeholder="Email you bought with"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
            <input
              style={inputStyle}
              type="text"
              placeholder="Order number or license key"
              value={key}
              onChange={(ev) => setKey(ev.target.value)}
            />
            <button className="rd-cta" type="submit" disabled={busy} style={{ border: 0, cursor: "pointer" }}>
              {busy ? "Checking…" : "Unlock this chapter"}
            </button>
          </form>
          {err && <p style={{ color: "#E2607A", margin: "4px 0 14px" }}>{err}</p>}

          <a className="rd-cta-ghost" href={productUrl}>
            Don't have it yet? Get the book →
          </a>
        </>
      )}
    </div>
  );
}
