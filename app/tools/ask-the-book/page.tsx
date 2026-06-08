import type { Metadata } from "next";
import AskTheBook from "@/components/AskTheBook";
import styles from "../tools.module.css";

export const metadata: Metadata = {
  title: "Ask the Book — AI Tutor for Design Patterns That Deliver",
  description:
    "Chat with an AI tutor that only knows production C#/.NET design patterns — grounded in the book and cited by chapter.",
  alternates: { canonical: "https://thecodeman.net/tools/ask-the-book" },
  robots: { index: false, follow: true },
};

export default function AskTheBookPage() {
  return (
    <main className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.badge}>AI tutor · book owners</span>
        <h1>
          Ask the <span className={styles.amber}>Book</span>
        </h1>
        <p>
          The only C#/.NET design-patterns tutor that answers strictly from the
          book — accurate, production-grade, and cited by chapter. Not generic
          internet code.
        </p>
      </div>
      <AskTheBook />
    </main>
  );
}
