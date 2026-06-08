// Convert ```mermaid fenced blocks into data-divs the <Mermaid /> client
// component can render. Keeps mermaid source out of the shiki/markdown
// pipeline (which would mangle it). Source is base64-encoded into an attribute.

export function mermaidToDivs(markdown: string): string {
  return markdown.replace(
    /```mermaid\s*\n([\s\S]*?)```/g,
    (_match, code: string) => {
      const b64 = Buffer.from(code.trim(), "utf8").toString("base64");
      return `<div class="mermaid" data-mermaid="${b64}"></div>`;
    }
  );
}
