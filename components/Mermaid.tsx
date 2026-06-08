"use client";

import { useEffect } from "react";

// Renders any <div class="mermaid" data-mermaid="<base64 source>"></div> nodes
// in the reader. Loads Mermaid from CDN (no npm dependency). A MutationObserver
// also catches paid-chapter content injected after first render.

let mermaidPromise: Promise<any> | null = null;

function loadMermaid(): Promise<any> {
  if (!mermaidPromise) {
    mermaidPromise = import(
      /* webpackIgnore: true */ "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs"
    ).then((m: any) => {
      const mermaid = m.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        fontFamily: "Manrope, system-ui, sans-serif",
      });
      return mermaid;
    });
  }
  return mermaidPromise;
}

function decode(b64: string): string {
  try {
    return decodeURIComponent(escape(atob(b64)));
  } catch {
    try {
      return atob(b64);
    } catch {
      return "";
    }
  }
}

export default function Mermaid() {
  useEffect(() => {
    let cancelled = false;
    let idSeq = 0;

    async function renderAll() {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("div.mermaid[data-mermaid]:not([data-rendered])")
      );
      if (nodes.length === 0) return;
      const mermaid = await loadMermaid();
      if (cancelled) return;

      for (const el of nodes) {
        const src = decode(el.getAttribute("data-mermaid") || "");
        if (!src) continue;
        el.setAttribute("data-rendered", "1");
        try {
          const { svg } = await mermaid.render(`tcm-mmd-${Date.now()}-${idSeq++}`, src);
          if (!cancelled) el.innerHTML = svg;
        } catch {
          el.innerHTML = `<pre>${src.replace(/</g, "&lt;")}</pre>`;
        }
      }
    }

    renderAll();

    const observer = new MutationObserver(() => renderAll());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return null;
}
