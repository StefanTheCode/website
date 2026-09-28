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
  const raw = typeof code === "string" ? code : String(code ?? "");
  const cleaned = raw
    .replace(/\r\n/g, "\n")
    .replace(/(?:\n[\t \u00A0\u200B\u200C\u200D\uFEFF]*)+$/, "");

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

  // --- REMOVE TRAILING EMPTY LINES ---
  while (tokens.length > 0) {
    const lastLine = tokens[tokens.length - 1];
    const isEmptyLine = !lastLine.some((t) => t.content.trim().length > 0);
    if (isEmptyLine) {
      tokens.pop();
    } else {
      break;
    }
  }

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
                {line.some((t) => t.content.length > 0) ? (
                  line.map((t, j) => (
                    <span key={j} style={{ color: accessibleColor(t.color) }}>
                      {t.content}
                    </span>
                  ))
                ) : (
                  "\u00A0"
                )}
              </span>
            ))}
          </code>
        </div>
      </pre>
    </CodeFrame>
  );
}

// dark-plus colors that fall below WCAG AA (4.5:1) on the #212529 code background,
// mapped to slightly lighter variants of the same hue.
const LOW_CONTRAST: Record<string, string> = {
  "#F44747": "#FF7B7B",
  "#D16969": "#E08585",
  "#808080": "#9A9A9A",
  "#646695": "#8A8CC0",
};
function accessibleColor(color?: string) {
  if (!color) return color;
  return LOW_CONTRAST[color.toUpperCase()] ?? color;
}
