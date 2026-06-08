// RAG retrieval over the prebuilt embeddings index (public/ai/embeddings.json).
// The index is generated at build time by scripts/build-embeddings.mjs.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { embed, cosineSimilarity } from "./embeddings.mjs";

let INDEX = null;

async function loadIndex() {
  if (INDEX) return INDEX;
  // Bundled with the function output; resolve relative to cwd at runtime.
  const candidates = [
    path.join(process.cwd(), "public", "ai", "embeddings.json"),
    path.join(process.cwd(), "ai", "embeddings.json"),
  ];
  for (const p of candidates) {
    try {
      INDEX = JSON.parse(await readFile(p, "utf8"));
      return INDEX;
    } catch {
      /* try next */
    }
  }
  throw new Error("embeddings.json not found — run `npm run build:embeddings`");
}

/**
 * Retrieve the top-k most relevant chunks for a query.
 * @returns {Promise<Array<{text:string, book:string, chapter:string, heading:string, url:string, score:number}>>}
 */
export async function retrieve(query, k = 6) {
  const index = await loadIndex();
  const [qvec] = await embed(query);

  return index.chunks
    .map((c) => ({ ...c, score: cosineSimilarity(qvec, c.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ embedding, ...rest }) => rest); // drop the vector from the result
}

/** Format retrieved chunks into a grounded context block with citations. */
export function buildContext(chunks) {
  return chunks
    .map(
      (c, i) =>
        `[#${i + 1}] (${c.chapter || c.book}${c.heading ? " › " + c.heading : ""})\n${c.text}`
    )
    .join("\n\n---\n\n");
}
