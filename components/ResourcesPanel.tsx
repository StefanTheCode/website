"use client";

import { useEffect, useState } from "react";

type Session =
  | { authenticated: false }
  | { authenticated: true; email: string; entitlements: string[] };

const GITHUB_REPO = "https://github.com/StefanTheCode/Design-Patterns-That-Deliver";

const card: React.CSSProperties = {
  background: "var(--card, #22184C)",
  border: "1px solid rgba(255,255,255,.09)",
  borderRadius: 14,
  padding: "20px 22px",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};
const h: React.CSSProperties = {
  fontFamily: "'Space Grotesk',sans-serif",
  color: "#F3EFFA",
  fontSize: 17,
  fontWeight: 700,
  margin: 0,
};
const sub: React.CSSProperties = { color: "#9C92B8", fontSize: 14, margin: 0, lineHeight: 1.5 };
const dl: React.CSSProperties = {
  fontFamily: "'JetBrains Mono',monospace",
  fontSize: 11.5,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: "#6F6690",
  margin: "8px 0 4px",
};
const row: React.CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap" };
const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "linear-gradient(180deg,#FFC650,#FFB31B)",
  color: "#2a1500",
  fontFamily: "'Space Grotesk',sans-serif",
  fontWeight: 600,
  fontSize: 13.5,
  borderRadius: 9,
  padding: "8px 14px",
  textDecoration: "none",
};
const ghost: React.CSSProperties = {
  ...btn,
  background: "transparent",
  color: "#FFB31B",
  border: "1px solid rgba(255,179,27,.4)",
};

export default function ResourcesPanel({ bookSlug }: { bookSlug: string }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    fetch("/api/auth-session", { credentials: "include" })
      .then((r) => r.json())
      .then(setSession)
      .catch(() => setSession({ authenticated: false }));
  }, []);

  if (!session?.authenticated) return null;
  const ent = new Set(session.entitlements || []);
  const owns = ent.has("deliver") || ent.has("bundle");
  if (!owns || bookSlug !== "design-patterns-that-deliver") return null;

  return (
    <section style={{ margin: "8px 0 36px", maxWidth: 920 }}>
      <p
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 12,
          letterSpacing: ".2em",
          textTransform: "uppercase",
          color: "#FFB31B",
          margin: "0 0 14px",
        }}
      >
        Your resources &amp; bonuses
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        <div style={card}>
          <h3 style={h}>GitHub repository</h3>
          <p style={sub}>
            20 runnable mini-projects — one per pattern and advanced variant — plus bonus code in 4
            more languages.
          </p>
          <div style={{ ...row, marginTop: 6 }}>
            <a style={btn} href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
              Request access on GitHub →
            </a>
          </div>
          <p style={{ ...sub, fontSize: 12.5 }}>
            Click “Request access” on the repo page; access is granted manually.
          </p>
        </div>

        <div style={card}>
          <h3 style={h}>Bonus: 100 Interview Questions</h3>
          <p style={sub}>Design-pattern interview Q&amp;A to prep for senior-level interviews.</p>
          <p style={dl}>PDF</p>
          <div style={row}>
            <a style={btn} href="/api/download?file=dptd-interview-light">Light</a>
            <a style={ghost} href="/api/download?file=dptd-interview-dark">Dark</a>
          </div>
          <p style={dl}>EPUB</p>
          <div style={row}>
            <a style={btn} href="/api/download?file=dptd-interview-epub-light">Light</a>
            <a style={ghost} href="/api/download?file=dptd-interview-epub-dark">Dark</a>
          </div>
        </div>

        <div style={card}>
          <h3 style={h}>The full ebook</h3>
          <p style={sub}>Prefer the classic ebook? Download the full book in light or dark mode.</p>
          <p style={dl}>PDF</p>
          <div style={row}>
            <a style={btn} href="/api/download?file=dptd-book-light">Light</a>
            <a style={ghost} href="/api/download?file=dptd-book-dark">Dark</a>
          </div>
          <p style={dl}>EPUB</p>
          <div style={row}>
            <a style={btn} href="/api/download?file=dptd-book-epub-light">Light</a>
            <a style={ghost} href="/api/download?file=dptd-book-epub-dark">Dark</a>
          </div>
        </div>

        <div style={card}>
          <h3 style={h}>Pattern decision helper</h3>
          <p style={sub}>Not sure which pattern fits? Describe your problem and get a recommendation.</p>
          <div style={{ ...row, marginTop: 6 }}>
            <a style={ghost} href="/tools/pattern-picker">Open Pattern Picker →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
