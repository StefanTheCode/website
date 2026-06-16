import type { Metadata } from "next";
import EditorConfigGenerator from "@/components/EditorConfigGenerator";
import styles from "../tools.module.css";

export const metadata: Metadata = {
  title: "Free .editorconfig Generator for C#/.NET - TheCodeMan",
  description:
    "Generate a production-ready .editorconfig and Directory.Build.props for your .NET solution in seconds. Free tool by Microsoft MVP Stefan Đokić - Roslyn analyzers, StyleCop, naming rules, warnings-as-errors.",
  alternates: { canonical: "https://thecodeman.net/tools/editorconfig-generator" },
  keywords: [
    "editorconfig c#",
    "editorconfig dotnet",
    "editorconfig generator",
    "Directory.Build.props",
    "roslyn analyzers",
    "stylecop editorconfig",
    "c# code style",
    "EnforceCodeStyleInBuild",
    "treatwarningsaserrors",
  ],
  openGraph: {
    title: "Free .editorconfig Generator for C#/.NET",
    description:
      "Answer a few questions, get a production-ready .editorconfig + Directory.Build.props - analyzers, naming rules, and warnings-as-errors included.",
    url: "https://thecodeman.net/tools/editorconfig-generator",
    type: "website",
  },
};

export default function EditorConfigGeneratorPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I create an .editorconfig for a .NET project?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Choose your target framework, strictness, and which analyzers you use. The generator produces a complete .editorconfig plus a Directory.Build.props with valid Roslyn/StyleCop rule IDs you can drop into the root of your solution.",
        },
      },
      {
        "@type": "Question",
        name: "What is Directory.Build.props used for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Directory.Build.props centralizes build settings - LangVersion, Nullable, ImplicitUsings, analyzer packages, EnforceCodeStyleInBuild, and TreatWarningsAsErrors - so every project in the solution inherits the same rules automatically.",
        },
      },
      {
        "@type": "Question",
        name: "Is the .editorconfig generator free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. It's free. Add your email for a higher daily limit. The full ruleset, cleanup automation, and CI quality gates are covered in the Pragmatic .NET Code Rules course.",
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
          Generate a production-ready <span className={styles.amber}>.editorconfig</span>
        </h1>
        <p>
          Answer a few questions and get a complete <code>.editorconfig</code> + <code>Directory.Build.props</code>{" "}
          for your .NET solution - analyzers, naming rules, and warnings-as-errors included. Copy, drop in, ship.
        </p>
      </div>
      <EditorConfigGenerator />
    </main>
  );
}
