// Serves a PAID chapter's HTML — only to a logged-in customer who owns the book.
// Paid chapter bodies are bundled with the function (included_files) and are
// never present in the static site, so this is real server-side gating.
//
// GET /api/content-chapter?book=<slug>&chapter=<slug>
// -> { html } | 401 (not logged in) | 403 (logged in, doesn't own it)

import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { json, preflight } from "./_shared/http.mjs";
import { getSession } from "./_shared/session.mjs";
import { canRead } from "./_shared/lemonsqueezy.mjs";
import { renderMarkdown } from "./_shared/markdown.mjs";

async function loadManifest(bookSlug) {
  const candidates = [
    path.join(process.cwd(), "ebooks", bookSlug, "book.json"),
    path.join(process.cwd(), bookSlug, "book.json"),
  ];
  for (const p of candidates) {
    try {
      return { dir: path.dirname(p), book: JSON.parse(await readFile(p, "utf8")) };
    } catch {
      /* next */
    }
  }
  return null;
}

export default async (req) => {
  if (req.method === "OPTIONS") return preflight(req);

  const url = new URL(req.url);
  const bookSlug = url.searchParams.get("book") || "";
  const chapterSlug = url.searchParams.get("chapter") || "";
  if (!bookSlug || !chapterSlug) {
    return json(req, 400, { error: "Missing book or chapter." });
  }

  const manifest = await loadManifest(bookSlug);
  if (!manifest) return json(req, 404, { error: "Book not found." });

  const chapter = (manifest.book.chapters || []).find((c) => c.slug === chapterSlug);
  if (!chapter) return json(req, 404, { error: "Chapter not found." });

  // Free chapters are already in the static site; don't serve them here.
  if (chapter.access === "free") {
    return json(req, 400, { error: "This chapter is free — read it directly." });
  }

  const session = await getSession(req);
  if (!session || session.purpose !== "session") {
    return json(req, 401, { error: "Please sign in with the email you bought the book with." });
  }
  if (!canRead(session.ent, bookSlug)) {
    return json(req, 403, { error: "Your account doesn't include this book.", paywall: true });
  }

  let raw;
  try {
    raw = await readFile(path.join(manifest.dir, chapter.file), "utf8");
  } catch {
    return json(req, 404, { error: "Chapter content unavailable." });
  }

  const { content } = matter(raw);
  const html = await renderMarkdown(content);
  return json(req, 200, { html, title: chapter.title });
};
