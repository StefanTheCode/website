import type { Metadata } from "next";
import Link from "next/link";
import styles from "./tools.module.css";

export const metadata: Metadata = {
  title: "Free AI Tools for C#/.NET Design Patterns — TheCodeMan",
  description:
    "Free AI tools for .NET developers: pick the right design pattern, compare two patterns, generate interview questions, and (for owners) ask the book. By Microsoft MVP Stefan Đokić.",
  alternates: { canonical: "https://thecodeman.net/tools" },
  openGraph: {
    title: "Free AI Tools for C#/.NET Design Patterns",
    description:
      "Pick a pattern, compare two, generate interview Q&A, or ask the book — AI tools grounded in real .NET tutorials.",
    url: "https://thecodeman.net/tools",
    type: "website",
  },
};

const TOOLS = [
  {
    href: "/tools/interview-simulator",
    icon: "🎙️",
    badge: "Waitlist open",
    name: "AI Interview Simulator",
    desc: "A mock .NET interview with an AI interviewer that asks follow-ups, pushes back, and scores you like a real senior engineer. Join the waitlist for early-bird pricing.",
  },
  {
    href: "/tools/editorconfig-generator",
    icon: "🧱",
    badge: "Free",
    name: "EditorConfig Generator",
    desc: "Answer a few questions and get a production-ready .editorconfig + Directory.Build.props for your .NET solution — analyzers, naming rules, and warnings-as-errors included.",
  },
  {
    href: "/tools/pattern-picker",
    icon: "🧭",
    badge: "Free",
    name: "Pattern Picker",
    desc: "Describe the problem you're stuck on and get the right C#/.NET pattern in seconds — with a tutorial for each recommendation.",
  },
  {
    href: "/tools/pattern-comparison",
    icon: "⚖️",
    badge: "Free",
    name: "Pattern Comparison",
    desc: "Strategy vs Factory? Decorator vs Proxy? Get a clear, .NET-specific verdict on which to use when — and the mix-up to avoid.",
  },
  {
    href: "/tools/interview-quiz",
    icon: "🎯",
    badge: "Free",
    name: "Interview Quiz",
    desc: "Generate realistic interview questions and answers for any pattern, at junior, mid, or senior level. Great prep before a round.",
  },
  {
    href: "/playground",
    icon: "▶️",
    badge: "Free",
    name: "C# Playground",
    desc: "Edit and run real design-pattern code in your browser — powered by .NET WebAssembly. Try Builder, Result, State, Strategy and more, live. No install, no server.",
  },
  {
    href: "/tools/ask-the-book",
    icon: "🤖",
    badge: "Book owners",
    name: "Ask the Book",
    desc: "An AI tutor that answers strictly from Design Patterns That Deliver — production-grade and cited by chapter. Unlocks with your purchase.",
  },
];

export default function ToolsHub() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: TOOLS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: `https://thecodeman.net${t.href}`,
    })),
  };

  return (
    <main className={styles.wrap}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <div className={styles.head}>
        <span className={styles.badge}>AI tools · for .NET developers</span>
        <h1>
          Free AI tools for <span className={styles.amber}>design patterns</span>
        </h1>
        <p>
          Built by Microsoft MVP Stefan Đokić and grounded in real C#/.NET tutorials.
          Pick a pattern, compare two, prep for an interview — or ask the book.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 18,
        }}
      >
        {TOOLS.map((t) => (
          <Link key={t.href} href={t.href} className={styles.card} style={{ display: "block" }}>
            <div className={styles.cardHead}>
              <p className={styles.cardName} style={{ fontSize: 19 }}>
                <span style={{ marginRight: 8 }}>{t.icon}</span>
                {t.name}
              </p>
              <span className={styles.group}>{t.badge}</span>
            </div>
            <p className={styles.why} style={{ marginBottom: 8 }}>{t.desc}</p>
            <span className={`${styles.link} ${styles.linkBook}`}>Open {t.name} →</span>
          </Link>
        ))}
      </div>

      <p className={styles.hint} style={{ textAlign: "center", marginTop: 28 }}>
        Want the production-grade depth behind these tools?{" "}
        <Link href="/design-patterns-that-deliver-ebook" className={styles.amber} style={{ textDecoration: "none" }}>
          Get Design Patterns That Deliver →
        </Link>
      </p>
    </main>
  );
}
