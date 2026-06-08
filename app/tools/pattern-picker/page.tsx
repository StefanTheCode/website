import type { Metadata } from "next";
import PatternPicker from "@/components/PatternPicker";
import styles from "../tools.module.css";

export const metadata: Metadata = {
  title: "Which Design Pattern Should I Use? — Free AI Pattern Picker (C#/.NET)",
  description:
    "Describe your problem and get the right C#/.NET design pattern in seconds. Free AI tool by Microsoft MVP Stefan Đokić, grounded in real .NET tutorials.",
  alternates: { canonical: "https://thecodeman.net/tools/pattern-picker" },
  openGraph: {
    title: "Which Design Pattern Should I Use? — Free AI Pattern Picker",
    description:
      "Describe your problem, get the right C#/.NET design pattern — with a tutorial link for each.",
    url: "https://thecodeman.net/tools/pattern-picker",
    type: "website",
  },
};

export default function PatternPickerPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I know which design pattern to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Describe the problem you're facing in plain language. The Pattern Picker matches it against the catalog of C#/.NET design patterns and recommends the best fit, with a link to a full tutorial and, where available, an in-depth book chapter.",
        },
      },
      {
        "@type": "Question",
        name: "Is the Pattern Picker free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. It's a free tool. Add your email for a higher daily limit.",
        },
      },
    ],
  };

  return (
    <main className={styles.wrap}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <div className={styles.head}>
        <span className={styles.badge}>Free AI tool</span>
        <h1>
          Which design pattern{" "}
          <span className={styles.amber}>should you use?</span>
        </h1>
        <p>
          Describe the problem you're facing in your C#/.NET code. Get the right
          pattern in seconds — with a tutorial for each recommendation.
        </p>
      </div>
      <PatternPicker />
    </main>
  );
}
