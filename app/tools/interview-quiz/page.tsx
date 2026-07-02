import type { Metadata } from "next";
import InterviewQuiz from "@/components/InterviewQuiz";
import styles from "../tools.module.css";

export const metadata: Metadata = {
  title: "Design Pattern Interview Quiz — Free AI Q&A Generator (C#/.NET)",
  description:
    "Generate realistic C#/.NET design-pattern interview questions and answers for any pattern, at junior, mid, or senior level. Free AI tool by Microsoft MVP Stefan Đokić.",
  alternates: { canonical: "https://thecodeman.net/tools/interview-quiz" },
  openGraph: {
    title: "Design Pattern Interview Quiz — Free AI Q&A Generator",
    description:
      "Pick a pattern and a level, get interview questions with strong answers — grounded in real .NET practice.",
    url: "https://thecodeman.net/tools/interview-quiz",
    type: "website",
  },
};

export default function InterviewQuizPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I prepare for C# design pattern interview questions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pick a pattern and a level (junior, mid, or senior) and the Interview Quiz generates realistic questions with strong, .NET-specific answers — covering when to use the pattern, how to wire it with dependency injection, and the trade-offs.",
        },
      },
      {
        "@type": "Question",
        name: "Is the Interview Quiz free?",
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
          Design pattern <span className={styles.amber}>interview quiz</span>
        </h1>
        <p>
          Pick a pattern and your level. Get realistic C#/.NET interview questions —
          with strong answers to check yourself against.
        </p>
      </div>
      <InterviewQuiz />
    </main>
  );
}
