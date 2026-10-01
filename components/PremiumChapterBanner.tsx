import Link from "next/link";
import catalog from "@/components/data/patternCatalog.json";

/**
 * PremiumChapterBanner
 * Shown at the TOP of free "Design Patterns" blog posts. It tells the reader
 * up-front that the post is a free tutorial, and points to the production-grade
 * chapter in "Design Patterns That Deliver". When the post maps to a book
 * chapter (via patternCatalog.json `blog` → `book`), it deep-links straight to
 * that chapter in the web reader; otherwise it links to the book landing page.
 *
 * This component renders on standard (Bootstrap/global) blog pages — NOT under
 * the .dp-page scope — so all styling is self-contained inline styles.
 */
export default function PremiumChapterBanner({ slug }: { slug: string }) {
  const match = (catalog as any).patterns.find(
    (p: any) => p.blog === slug && p.book
  );

  const chapterUrl: string | null = match
    ? `/read/design-patterns-that-deliver/${match.book}`
    : null;

  const patternName: string | null = match ? match.name : null;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        padding: "22px 24px",
        margin: "8px 0 34px",
        background: "linear-gradient(135deg,var(--tcm-bg) 0%,var(--tcm-card) 100%)",
        border: "1px solid rgba(var(--tcm-amber-rgb), .28)",
        boxShadow: "0 14px 40px rgba(13,7,34,.28)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(60% 60% at 100% 0%, rgba(var(--tcm-amber-rgb), .16), transparent 60%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "var(--tcm-amber)",
            margin: "0 0 8px",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Free tutorial · the full version is in the book
        </p>

        <h2
          style={{
            color: "var(--tcm-h)",
            fontSize: 20,
            fontWeight: 800,
            lineHeight: 1.3,
            margin: "0 0 8px",
            fontFamily: "'Space Grotesk', 'Space Grotesk Fallback', sans-serif",
          }}
        >
          You&apos;re reading the free intro
          {patternName ? (
            <>
              {" "}
              to the <span style={{ color: "var(--tcm-amber)" }}>{patternName}</span> pattern
            </>
          ) : null}
          .
        </h2>

        <p
          style={{
            color: "var(--tcm-body)",
            fontSize: 15.5,
            lineHeight: 1.6,
            margin: "0 0 16px",
            maxWidth: 720,
          }}
        >
          This article covers the idea. The{" "}
          <strong style={{ color: "var(--tcm-h)" }}>
            production-grade chapter
          </strong>{" "}
          in <em>Design Patterns That Deliver</em> goes further — unit tests,
          async, thread-safety, trade-offs, DI wiring, and exactly when{" "}
          <strong style={{ color: "var(--tcm-h)" }}>not</strong> to use it.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {chapterUrl ? (
            <Link
              href={`${chapterUrl}?utm_source=blog_banner`}
              style={{
                background: "linear-gradient(180deg,var(--tcm-amber-hi),var(--tcm-amber))",
                color: "var(--tcm-amber-ink)",
                fontWeight: 700,
                padding: "11px 20px",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: 14.5,
                fontFamily: "'Space Grotesk', 'Space Grotesk Fallback', sans-serif",
              }}
            >
              Read the production-grade chapter →
            </Link>
          ) : (
            <Link
              href="/design-patterns-that-deliver-ebook?utm_source=blog_banner"
              style={{
                background: "linear-gradient(180deg,var(--tcm-amber-hi),var(--tcm-amber))",
                color: "var(--tcm-amber-ink)",
                fontWeight: 700,
                padding: "11px 20px",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: 14.5,
                fontFamily: "'Space Grotesk', 'Space Grotesk Fallback', sans-serif",
              }}
            >
              Go deeper in the book →
            </Link>
          )}

          <Link
            href="/design-patterns-that-deliver-ebook?utm_source=blog_banner_secondary"
            style={{
              color: "var(--tcm-h)",
              border: "1px solid rgba(255,255,255,.16)",
              background: "rgba(255,255,255,.04)",
              fontWeight: 700,
              padding: "11px 20px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: 14.5,
              fontFamily: "'Space Grotesk', 'Space Grotesk Fallback', sans-serif",
            }}
          >
            See all 10 patterns
          </Link>
        </div>
      </div>
    </div>
  );
}
