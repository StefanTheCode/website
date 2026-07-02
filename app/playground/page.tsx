import type { Metadata } from "next";
import Link from "next/link";
import CodePlayground from "@/components/CodePlayground";
import styles from "../tools/tools.module.css";

export const metadata: Metadata = {
  title: "C# Playground — Run Design Pattern Code in Your Browser (.NET WASM)",
  description:
    "An in-browser C# playground powered by .NET WebAssembly. Edit and run real design-pattern examples — Builder, Result, State, Strategy, Specification — entirely client-side. By Microsoft MVP Stefan Đokić.",
  alternates: { canonical: "https://thecodeman.net/playground" },
  openGraph: {
    title: "C# Playground — Run Design Pattern Code in Your Browser",
    description:
      "Edit and run real C#/.NET design-pattern examples in your browser, powered by .NET WebAssembly.",
    url: "https://thecodeman.net/playground",
    type: "website",
  },
};

export default function PlaygroundPage() {
  return (
    <main className={styles.wrap} style={{ maxWidth: 1040 }}>
      <div className={styles.head}>
        <span className={styles.badge}>Runs in your browser · .NET WebAssembly</span>
        <h1>
          C# <span className={styles.amber}>playground</span>
        </h1>
        <p>
          Edit real design-pattern code right here — pick an example or write your
          own, then hit <strong>Run</strong>. It compiles and executes entirely in
          your browser: no install, no server, nothing to set up.
        </p>
      </div>

      <CodePlayground />

      <p className={styles.hint} style={{ textAlign: "center", marginTop: 24 }}>
        These run because they&apos;re self-contained C#. Patterns that need a
        database, HTTP, or DI (EF Core, ASP.NET, MediatR) are covered in full in{" "}
        <Link href="/design-patterns-that-deliver-ebook" className={styles.amber} style={{ textDecoration: "none" }}>
          Design Patterns That Deliver →
        </Link>
      </p>
    </main>
  );
}
