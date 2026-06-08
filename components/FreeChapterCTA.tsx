"use client";

import AskTheBook from "@/components/AskTheBook";

export default function FreeChapterCTA({
  productUrl,
  chapterSlug,
}: {
  productUrl: string;
  chapterSlug?: string;
}) {
  return (
    <div style={{ marginTop: 48 }}>
      <div className="rd-paywall" style={{ marginBottom: 36 }}>
        <h3>You're reading the free chapter</h3>
        <p>
          Get the full book — every chapter, 20 runnable mini-projects, 100
          interview Q&amp;As, and the AI tutor on every example.
        </p>
        <a className="rd-cta" href={productUrl}>
          Get the full book →
        </a>
      </div>

      <div
        style={{
          border: "1px solid rgba(255,179,27,.25)",
          background: "linear-gradient(170deg,#22184C,#0D0722)",
          borderRadius: 18,
          padding: "clamp(22px,4vw,32px)",
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 12,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: "#FFB31B",
            margin: "0 0 6px",
          }}
        >
          AI tutor · preview
        </p>
        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#F3EFFA", margin: "0 0 6px", fontSize: 22 }}>
          Ask the AI tutor about this chapter
        </h3>
        <p style={{ color: "#9C92B8", margin: "0 0 18px", fontSize: 15 }}>
          Grounded in the book — try a couple of questions free. Full access comes with the book.
        </p>
        <AskTheBook chapter={chapterSlug} />
      </div>
    </div>
  );
}
