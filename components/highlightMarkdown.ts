import { codeToHtml } from "shiki";

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function highlightFencedCode(markdown: string) {
  // ```lang\ncode\n```
  const regex = /```([a-zA-Z0-9+#-]+)?\s*\n([\s\S]*?)```/g;

  let out = "";
  let lastIndex = 0;

  while (true) {
    const match = regex.exec(markdown);
    if (!match) break;

    const full = match[0];
    const lang = (match[1] || "text").toLowerCase();
    const code = match[2] ?? "";

    const index = match.index ?? 0;

    out += markdown.slice(lastIndex, index);

    try {
      const html = await codeToHtml(code, {
        lang: lang as any,
        theme: "vitesse-dark",
      });

      // ubaci kao raw HTML wrapper
      out += `\n<div class="tcm-shiki">${html}</div>\n`;
    } catch {
      out += `\n<pre><code class="lang-${lang}">${escapeHtml(code)}</code></pre>\n`;
    }

    lastIndex = index + full.length;
  }

  out += markdown.slice(lastIndex);
  return out;
}
