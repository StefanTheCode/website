"use client";

import React, { useMemo, useState } from "react";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

function detectLanguage(className?: string) {
  if (!className) return "";
  // markdown-to-jsx obično koristi "lang-xxx" ili "language-xxx"
  const m =
    className.match(/lang-([a-z0-9+#-]+)/i) ||
    className.match(/language-([a-z0-9+#-]+)/i);
  return m?.[1]?.toLowerCase() ?? "";
}

function normalizeLanguageLabel(lang: string) {
  if (!lang) return "";
  if (lang === "cs" || lang === "csharp") return "C#";
  if (lang === "js") return "JavaScript";
  if (lang === "ts") return "TypeScript";
  if (lang === "json") return "JSON";
  if (lang === "yaml" || lang === "yml") return "YAML";
  return lang.toUpperCase();
}

export default function CodeBlock({ className, children }: Props) {
  const [copied, setCopied] = useState(false);

  const rawText = useMemo(() => {
    // children može biti string ili array
    const text =
      typeof children === "string"
        ? children
        : Array.isArray(children)
          ? children.join("")
          : "";
    return text.replace(/\n$/, "");
  }, [children]);

  const lang = detectLanguage(className);
  const label = normalizeLanguageLabel(lang);

  async function copy() {
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback: ništa
    }
  }

  return (
    <div className="tcm-code">
      <div className="tcm-code__header">
        <div className="tcm-code__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="tcm-code__meta">
          {label ? <span className="tcm-code__lang">{label}</span> : null}
        </div>

        <button className="tcm-code__copy" onClick={copy} type="button">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="tcm-code__pre">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
