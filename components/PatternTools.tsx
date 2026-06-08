import Link from "next/link";

export default function PatternTools() {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: "24px 26px",
        margin: "32px 0",
        background: "linear-gradient(135deg,#f8fafc,#eef2ff)",
      }}
    >
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: ".4px",
          textTransform: "uppercase",
          color: "#6366f1",
          margin: "0 0 8px",
        }}
      >
        Free tools
      </p>
      <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px", color: "#0f172a" }}>
        Not sure which pattern fits your problem?
      </h3>
      <p style={{ color: "#475569", fontSize: 15.5, lineHeight: 1.6, margin: "0 0 16px" }}>
        Describe your problem and the free AI <strong>Pattern Picker</strong> recommends the
        right C#/.NET pattern — or go deep with <strong>Design Patterns That Deliver</strong>.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link
          href="/tools/pattern-picker"
          style={{ background: "#6366f1", color: "#fff", fontWeight: 700, padding: "10px 18px", borderRadius: 10, textDecoration: "none", fontSize: 14.5 }}
        >
          Try the Pattern Picker →
        </Link>
        <Link
          href="/design-patterns-that-deliver-ebook"
          style={{ background: "#fff", color: "#6366f1", border: "1px solid #c7d2fe", fontWeight: 700, padding: "10px 18px", borderRadius: 10, textDecoration: "none", fontSize: 14.5 }}
        >
          Get the book
        </Link>
      </div>
    </div>
  );
}
