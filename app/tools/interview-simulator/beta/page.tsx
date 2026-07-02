import type { Metadata } from "next";
import InterviewSimulator from "@/components/InterviewSimulator";
import styles from "../../tools.module.css";

export const metadata: Metadata = {
  title: "AI Interview Simulator (Beta) — Mock .NET Interviews | TheCodeMan",
  description:
    "Practice a real .NET interview with an AI interviewer that asks follow-up questions and scores your answers. Grounded in the 250-question Pass Your Interview kit. Free during beta.",
  alternates: { canonical: "https://thecodeman.net/tools/interview-simulator/beta" },
  robots: { index: false, follow: false }, // unlisted while in beta — shared via waitlist email
  openGraph: {
    title: "AI Interview Simulator (Beta) — Mock .NET Interviews",
    description:
      "An AI interviewer that pushes back, asks follow-ups, and scores you like a real senior engineer.",
    url: "https://thecodeman.net/tools/interview-simulator/beta",
    type: "website",
  },
};

export default function InterviewSimulatorBetaPage() {
  return (
    <main className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.badge}>Beta · free for waitlist members</span>
        <h1>
          AI <span className={styles.amber}>interview simulator</span>
        </h1>
        <p>
          Pick your categories and level, then answer like it&apos;s the real thing.
          The interviewer reads what you say, asks follow-ups, and scores you at the end —
          grounded in the <a href="/pass-your-interview">250-question interview kit</a>.
        </p>
      </div>
      <InterviewSimulator />
      <p className={styles.hint} style={{ textAlign: "center", marginTop: 28 }}>
        Found a bug or have feedback? Reply to the beta email — I read everything. — Stefan
      </p>
    </main>
  );
}
