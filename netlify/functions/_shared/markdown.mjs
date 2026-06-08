// Minimal, safe Markdown -> HTML for serving GATED chapter content from the
// content-chapter function. Uses shiki for fenced code, emits mermaid blocks as
// data-divs for the <Mermaid /> client, and a small converter for the rest.

import { createHighlighter } from "shiki";

const highlighterPromise = createHighlighter({
  themes: ["dark-plus"],
  langs: ["csharp", "json", "yaml", "sql", "bash", "powershell", "javascript", "typescript", "html", "css", "text"],
});

function normalizeLang(lang) {
  if (lang === "cs" || lang === "csharp") return "csharp";
  if (lang === "js") return "javascript";
  if (lang === "ts") return "typescript";
  if (lang === "yml") return "yaml";
  return lang || "text";
}

function langLabel(lang) {
  if (lang === "cs" || lang === "csharp") return "C#";
  if (lang === "js") return "JS";
  if (lang === "ts") return "TS";
  if (lang === "bash" || lang === "sh") return "Bash";
  if (lang === "json") return "JSON";
  if (lang === "yaml" || lang === "yml") return "YAML";
  if (lang === "sql") return "SQL";
  if (lang === "html") return "HTML";
  if (lang === "css") return "CSS";
  return lang ? lang.toUpperCase() : "";
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s) {
  return s
    .replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, h) => `<a href="${h}">${t}</a>`);
}

export async function renderMarkdown(md) {
  // 1) Pull out fenced code blocks first. Use a token that survives trimming
  //    and sits on its own line (blank lines around it).
  const blocks = [];
  let work = md.replace(/```([a-zA-Z0-9+#-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    blocks.push({ lang: (lang || "text").toLowerCase(), code });
    return `\n\n@@BLOCK${blocks.length - 1}@@\n\n`;
  });

  const lines = work.split("\n");
  let html = "";
  let listType = null;
  let para = [];

  const flushPara = () => {
    if (para.length) {
      html += `<p>${inline(esc(para.join(" ")))}</p>`;
      para = [];
    }
  };
  const closeList = () => {
    if (listType) {
      html += `</${listType}>`;
      listType = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();

    const blockMatch = line.match(/^@@BLOCK(\d+)@@$/);
    if (blockMatch) {
      flushPara();
      closeList();
      const b = blocks[Number(blockMatch[1])];
      if (b.lang === "mermaid") {
        const b64 = Buffer.from(b.code.trim(), "utf8").toString("base64");
        html += `<div class="mermaid" data-mermaid="${b64}"></div>`;
      } else {
        let codeHtml;
        try {
          const normalizedLang = normalizeLang(b.lang);
          const highlighter = await highlighterPromise;
          const safeLang = highlighter.getLoadedLanguages().includes(normalizedLang) ? normalizedLang : "text";
          const cleaned = b.code.replace(/\n+$/, "");
          const result = highlighter.codeToTokens(cleaned, { lang: safeLang, theme: "dark-plus" });
          let tokens = result.tokens;

          // remove trailing empty lines
          while (tokens.length > 0) {
            const last = tokens[tokens.length - 1];
            if (!last.some(t => t.content.trim().length > 0)) tokens.pop();
            else break;
          }

          const gutterHtml = tokens.map((_, i) =>
            `<span class="tcm-code__ln">${i + 1}</span>`
          ).join("");

          const linesHtml = tokens.map(line =>
            `<span class="tcm-code__line">${
              line.some(t => t.content.length > 0)
                ? line.map(t => `<span style="color:${t.color}">${esc(t.content)}</span>`).join("")
                : "\u00A0"
            }</span>`
          ).join("");

          codeHtml =
            `<pre class="tcm-code__pre">` +
              `<div class="tcm-code__row">` +
                `<div class="tcm-code__gutter" aria-hidden="true">${gutterHtml}</div>` +
                `<code class="tcm-code__code">${linesHtml}</code>` +
              `</div>` +
            `</pre>`;
        } catch {
          codeHtml = `<pre class="tcm-code__pre"><code>${esc(b.code)}</code></pre>`;
        }
        const label = langLabel(b.lang);
        const encoded = Buffer.from(b.code, "utf8").toString("base64");
        html += `<div class="tcm-code">` +
          `<div class="tcm-code__header">` +
            `<div class="tcm-code__dots" aria-hidden="true"><span></span><span></span><span></span></div>` +
            `<div class="tcm-code__meta">${label ? `<span class="tcm-code__lang">${label}</span>` : ""}</div>` +
            `<button class="tcm-code__copy" type="button" data-copy-code="${encoded}">Copy</button>` +
          `</div>` +
          codeHtml +
          `</div>`;
      }
      continue;
    }

    if (!line) {
      flushPara();
      closeList();
      continue;
    }

    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)/))) {
      flushPara();
      closeList();
      const level = m[1].length;
      const rawText = m[2];
      if (level === 2) {
        // Add an id so sidebar section links (#anchor) work for paid chapters too.
        const id = rawText
          .replace(/[`*]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        html += `<h2 id="${id}">${inline(esc(rawText))}</h2>`;
      } else {
        html += `<h${level}>${inline(esc(rawText))}</h${level}>`;
      }
    } else if ((m = line.match(/^>\s?(.*)/))) {
      flushPara();
      closeList();
      html += `<blockquote><p>${inline(esc(m[1]))}</p></blockquote>`;
    } else if ((m = line.match(/^[-*]\s+(.*)/))) {
      flushPara();
      if (listType !== "ul") {
        closeList();
        listType = "ul";
        html += "<ul>";
      }
      html += `<li>${inline(esc(m[1]))}</li>`;
    } else if ((m = line.match(/^\d+\.\s+(.*)/))) {
      flushPara();
      if (listType !== "ol") {
        closeList();
        listType = "ol";
        html += "<ol>";
      }
      html += `<li>${inline(esc(m[1]))}</li>`;
    } else {
      para.push(line);
    }
  }
  flushPara();
  closeList();
  return html;
}
