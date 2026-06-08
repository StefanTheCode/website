#!/usr/bin/env node
/**
 * Build the RAG index for "Ask the Book" and the other grounded AI tools.
 *
 * Reads every chapter under /ebooks, splits each into heading-aware chunks,
 * embeds them, and writes public/ai/embeddings.json.
 *
 * Run:  npm run build:embeddings
 * Needs: OPENAI_API_KEY (default) or VOYAGE_API_KEY with EMBEDDINGS_PROVIDER=voyage
 *
 * Run this whenever book content changes (and as a prebuild step before deploy).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { embed } from "../netlify/functions/_shared/embeddings.mjs";

const ROOT = process.cwd();
const EBOOKS_DIR = path.join(ROOT, "ebooks");
const OUT_DIR = path.join(ROOT, "public", "ai");
const OUT_FILE = path.join(OUT_DIR, "embeddings.json");

const MAX_CHARS = 1600; // ~400 tokens per chunk
const BATCH = 64;

/** Split markdown into chunks, keeping the nearest "## heading" as context. */
function chunkMarkdown(md) {
  const lines = md.split("\n");
  const chunks = [];
  let heading = "";
  let buf = [];

  const flush = () => {
    const text = buf.join("\n").trim();
    if (text) chunks.push({ heading, text });
    buf = [];
  };

  for (const line of lines) {
    const h = line.match(/^#{2,3}\s+(.*)/);
    if (h) {
      flush();
      heading = h[1].trim();
    }
    buf.push(line);
    if (buf.join("\n").length >= MAX_CHARS) flush();
  }
  flush();
  return chunks;
}

function gatherChunks() {
  const out = [];
  if (!fs.existsSync(EBOOKS_DIR)) return out;

  for (const bookDir of fs.readdirSync(EBOOKS_DIR)) {
    const manifestPath = path.join(EBOOKS_DIR, bookDir, "book.json");
    if (!fs.existsSync(manifestPath)) continue;
    const book = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    for (const ch of book.chapters || []) {
      const file = path.join(EBOOKS_DIR, bookDir, ch.file);
      if (!fs.existsSync(file)) continue;
      const { content, data } = matter(fs.readFileSync(file, "utf8"));

      for (const c of chunkMarkdown(content)) {
        out.push({
          text: c.text,
          heading: c.heading,
          book: book.title,
          bookSlug: book.slug,
          chapter: data.title || ch.title,
          chapterSlug: ch.slug,
          access: data.access || ch.access || "paid",
          url: `/read/${book.slug}/${ch.slug}`,
        });
      }
    }
  }
  return out;
}

async function main() {
  const provider = (process.env.EMBEDDINGS_PROVIDER || "openai").toLowerCase();
  const hasKey =
    provider === "voyage"
      ? Boolean(process.env.VOYAGE_API_KEY)
      : Boolean(process.env.OPENAI_API_KEY);

  if (!hasKey) {
    if (fs.existsSync(OUT_FILE)) {
      console.warn(
        `No embeddings API key set — skipping embeddings build and using existing ${OUT_FILE}.`
      );
      return;
    }
    console.warn(
      "No embeddings API key set and no existing embeddings.json found — skipping embeddings build."
    );
    return;
  }

  const chunks = gatherChunks();
  if (chunks.length === 0) {
    console.error("No ebook chunks found under /ebooks — nothing to embed.");
    process.exit(1);
  }
  console.log(`Embedding ${chunks.length} chunks…`);

  const withVectors = [];
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const vectors = await embed(batch.map((c) => c.text));
    batch.forEach((c, j) => withVectors.push({ ...c, embedding: vectors[j] }));
    console.log(`  ${Math.min(i + BATCH, chunks.length)}/${chunks.length}`);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify(
      {
        builtAt: new Date().toISOString(),
        provider: process.env.EMBEDDINGS_PROVIDER || "openai",
        dimensions: withVectors[0]?.embedding?.length || 0,
        count: withVectors.length,
        chunks: withVectors,
      },
      null,
      0
    )
  );
  console.log(`Wrote ${OUT_FILE} (${withVectors.length} chunks).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
