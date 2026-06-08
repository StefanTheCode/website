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
        background: "linear-gradient(135deg,#140A2E 0%,#22184C 100%)",
        border: "1px solid rgba(255,179,27,.28)",
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
            "radial-gradient(60% 60% at 100% 0%, rgba(255,179,27,.16), transparent 60%)",
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
            color: "#FFB31B",
            margin: "0 0 8px",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Free tutorial · the full version is in the book
        </p>

        <h3
          style={{
            color: "#F3EFFA",
            fontSize: 20,
            fontWeight: 800,
            lineHeight: 1.3,
            margin: "0 0 8px",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          You&apos;re reading the free intro
          {patternName ? (
            <>
              {" "}
              to the <span style={{ color: "#FFB31B" }}>{patternName}</span> pattern
            </>
          ) : null}
          .
        </h3>

        <p
          style={{
            color: "#D4CDE6",
            fontSize: 15.5,
            lineHeight: 1.6,
            margin: "0 0 16px",
            maxWidth: 720,
          }}
        >
          This article covers the idea. The{" "}
          <strong style={{ color: "#F3EFFA" }}>
            production-grade chapter
          </strong>{" "}
          in <em>Design Patterns That Deliver</em> goes further — unit tests,
          async, thread-safety, trade-offs, DI wiring, and exactly when{" "}
          <strong style={{ color: "#F3EFFA" }}>not</strong> to use it.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {chapterUrl ? (
            <Link
              href={`${chapterUrl}?utm_source=blog_banner`}
              style={{
                background: "linear-gradient(180deg,#FFC650,#FFB31B)",
                color: "#2a1500",
                fontWeight: 700,
                padding: "11px 20px",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: 14.5,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Read the production-grade chapter →
            </Link>
          ) : (
            <Link
              href="/design-patterns-that-deliver-ebook?utm_source=blog_banner"
              style={{
                background: "linear-gradient(180deg,#FFC650,#FFB31B)",
                color: "#2a1500",
                fontWeight: 700,
                padding: "11px 20px",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: 14.5,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Go deeper in the book →
            </Link>
          )}

          <Link
            href="/design-patterns-that-deliver-ebook?utm_source=blog_banner_secondary"
            style={{
              color: "#F3EFFA",
              border: "1px solid rgba(255,255,255,.16)",
              background: "rgba(255,255,255,.04)",
              fontWeight: 700,
              padding: "11px 20px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: 14.5,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            See all 10 patterns
          </Link>
        </div>
      </div>
    </div>
  );
}
