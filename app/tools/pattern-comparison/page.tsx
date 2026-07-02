import type { Metadata } from "next";
import PatternComparison from "@/components/PatternComparison";
import styles from "../tools.module.css";

export const metadata: Metadata = {
  title: "Compare Design Patterns — Free AI Tool (Strategy vs Factory & more, C#/.NET)",
  description:
    "Strategy vs Factory? Decorator vs Proxy? Compare any two C#/.NET design patterns and get a clear, practical verdict on which to use when. Free AI tool by Microsoft MVP Stefan Đokić.",
  alternates: { canonical: "https://thecodeman.net/tools/pattern-comparison" },
  openGraph: {
    title: "Compare Design Patterns — Free AI Tool (C#/.NET)",
    description:
      "Pick two patterns and get a clear, .NET-specific verdict on which to use when — plus the common mix-up to avoid.",
    url: "https://thecodeman.net/tools/pattern-comparison",
    type: "website",
  },
};

export default function PatternComparisonPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the difference between the Strategy and Factory patterns?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Strategy is about swapping interchangeable algorithms at runtime; Factory is about creating objects without binding to a concrete type. They often work together — a factory picks which strategy to instantiate. Compare any two patterns with this tool for a clear, .NET-specific verdict.",
        },
      },
      {
        "@type": "Question",
        name: "Is the Pattern Comparison tool free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. It's a free tool. Add your email for a higher daily limit.",
        },
      },
    ],
  };

  return (
    <main className={styles.wrap}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className={styles.head}>
        <span className={styles.badge}>Free AI tool</span>
        <h1>
          Compare two <span className={styles.amber}>design patterns</span>
        </h1>
        <p>
          Strategy vs Factory? Decorator vs Proxy? Pick two and get a clear,
          .NET-specific verdict on which to use when — and the mix-up to avoid.
        </p>
      </div>
      <PatternComparison />
    </main>
  );
}
