import type { Metadata } from "next";
import Link from "next/link";
import InterviewPractice from "@/components/InterviewPractice";
import styles from "../tools/tools.module.css";

export const metadata: Metadata = {
  title: "Practice .NET Interview Questions — Solve C# Problems in Your Browser | TheCodeMan",
  description:
    "Free, interactive .NET interview practice: solve real C# coding problems (Arrays, Strings, Lists, Trees) in your browser, run them against hidden test cases, and reveal the optimal solution with full complexity analysis. By Microsoft MVP Stefan Đokić.",
  alternates: { canonical: "https://thecodeman.net/interview-practice" },
  openGraph: {
    title: "Practice .NET Interview Questions — Solve C# Problems in Your Browser",
    description:
      "Solve real C# interview problems in your browser, check them against hidden tests, and reveal the optimal solution with complexity analysis. Free.",
    url: "https://thecodeman.net/interview-practice",
    type: "website",
  },
};

export default function InterviewPracticePage() {
  return (
    <div className={styles.wrap} style={{ maxWidth: 1120 }}>
      <div className={styles.head}>
        <span className={styles.badge}>Runs in your browser · .NET WebAssembly</span>
        <h1>
          Practice <span className={styles.amber}>.NET interview</span> problems
        </h1>
        <p>
          Don&apos;t just read the answers — solve them. Pick a problem, write real
          C#, and run it against hidden test cases right here. When you&apos;re stuck
          (or done), reveal the optimal solution with full complexity analysis.
        </p>
      </div>

      <InterviewPractice />

      <p className={styles.hint} style={{ textAlign: "center", marginTop: 28 }}>
        Want the full set of 250 questions with written answers?{" "}
        <Link href="/pass-your-interview" className={styles.amber} style={{ textDecoration: "none" }}>
          Get the free interview kit →
        </Link>
      </p>
    </div>
  );
}
