import React from "react";
import { createHighlighter } from "shiki";
import CodeFrame from "@/components/CodeFrame";

type Props = {
  className?: string;
  code: string;
};

function detectLang(className?: string) {
  if (!className) return "text";
  const m =
    className.match(/lang-([a-z0-9+#-]+)/i) ||
    className.match(/language-([a-z0-9+#-]+)/i);
  return (m?.[1] ?? "text").toLowerCase();
}

function normalizeLangForShiki(lang: string) {
  if (lang === "cs" || lang === "csharp") return "csharp";
  if (lang === "js") return "javascript";
  if (lang === "ts") return "typescript";
  if (lang === "yml") return "yaml";
  return lang;
}

function label(lang: string) {
  if (lang === "csharp" || lang === "cs") return "C#";
  return lang ? lang.toUpperCase() : "";
}

const highlighterPromise = createHighlighter({
  themes: ["dark-plus"],
  langs: [
    "csharp",
    "json",
    "yaml",
    "sql",
    "bash",
    "powershell",
    "javascript",
    "typescript",
    "html",
    "css",
    "text",
  ],
});

export default async function ShikiCode({ className, code }: Props) {
  // --- NORMALIZE INPUT ---
  const raw = typeof code === "string" ? code : String(code ?? "");
  const normalized = raw.replace(/\r\n/g, "\n");

  // --- TRIM TRAILING "EMPTY" LINES (unicode-safe) ---
  const lines = normalized.split("\n");

  const isEmptyLine = (s: string) => {
  const cleaned = s
    .replace(/\u00A0/g, " ")   // NBSP
    .replace(/\u200B/g, "")    // zero-width space
    .replace(/\u200C/g, "")
    .replace(/\u200D/g, "")
    .replace(/\uFEFF/g, "")
    .trim();

  return cleaned.length === 0;
};

  while (lines.length > 0 && isEmptyLine(lines[lines.length - 1])) {
    lines.pop();
  }

  const cleaned = lines.join("\n");

  // --- LANGUAGE ---
  const langRaw = detectLang(className);
  const lang = normalizeLangForShiki(langRaw);

  const highlighter = await highlighterPromise;

  const safeLang = highlighter
    .getLoadedLanguages()
    .includes(lang as any)
    ? lang
    : "text";

  // --- SHIKI TOKENS ---
  const result = highlighter.codeToTokens(cleaned, {
    lang: safeLang as any,
    theme: "dark-plus",
  });

  const tokens = result.tokens;

  // --- RENDER ---
  return (
    <CodeFrame language={label(safeLang)} code={cleaned}>
      <pre className="tcm-code__pre">
        <div className="tcm-code__row">
          <div className="tcm-code__gutter" aria-hidden="true">
            {tokens.map((_, i) => (
              <span key={i} className="tcm-code__ln">
                {i + 1}
              </span>
            ))}
          </div>

          <code className="tcm-code__code">
            {tokens.map((line, i) => (
              <span className="tcm-code__line" key={i}>
                {line.map((t, j) => (
                  <span key={j} style={{ color: t.color }}>
                    {t.content}
                  </span>
                ))}
                {"\n"}
              </span>
            ))}
          </code>
        </div>
      </pre>
    </CodeFrame>
  );
}
