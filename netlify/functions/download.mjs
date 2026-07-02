// Gated downloads (owners only): book + Interview Prep, PDF and EPUB.
// GET /api/download?file=<key>  -> streams the file if the session owns the book.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { json, preflight } from "./_shared/http.mjs";
import { getSession } from "./_shared/session.mjs";
import { canRead } from "./_shared/lemonsqueezy.mjs";

const BASE = "protected/design-patterns-that-deliver";
const BOOK = "design-patterns-that-deliver";
const PDF = "application/pdf";
const EPUB = "application/epub+zip";

const FILES = {
  "dptd-book-light":          { rel: `${BASE}/book-light.pdf`,       name: "Design Patterns That Deliver - Light.pdf",  type: PDF,  book: BOOK },
  "dptd-book-dark":           { rel: `${BASE}/book-dark.pdf`,        name: "Design Patterns That Deliver - Dark.pdf",   type: PDF,  book: BOOK },
  "dptd-book-epub-light":     { rel: `${BASE}/book-light.epub`,      name: "Design Patterns That Deliver - Light.epub", type: EPUB, book: BOOK },
  "dptd-book-epub-dark":      { rel: `${BASE}/book-dark.epub`,       name: "Design Patterns That Deliver - Dark.epub",  type: EPUB, book: BOOK },
  "dptd-interview-light":     { rel: `${BASE}/interview-light.pdf`,  name: "100 Interview Questions - Light.pdf",        type: PDF,  book: BOOK },
  "dptd-interview-dark":      { rel: `${BASE}/interview-dark.pdf`,   name: "100 Interview Questions - Dark.pdf",         type: PDF,  book: BOOK },
  "dptd-interview-epub-light":{ rel: `${BASE}/interview-light.epub`, name: "100 Interview Questions - Light.epub",       type: EPUB, book: BOOK },
  "dptd-interview-epub-dark": { rel: `${BASE}/interview-dark.epub`,  name: "100 Interview Questions - Dark.epub",        type: EPUB, book: BOOK },
};

export default async (req) => {
  if (req.method === "OPTIONS") return preflight(req);

  const key = new URL(req.url).searchParams.get("file") || "";
  const f = FILES[key];
  if (!f) return json(req, 404, { error: "Unknown file." });

  const s = await getSession(req);
  if (!s || s.purpose !== "session") return json(req, 401, { error: "Please sign in to download." });
  if (!canRead(s.ent, f.book)) return json(req, 403, { error: "Your account doesn't include this download." });

  let buf;
  try {
    buf = await readFile(path.join(process.cwd(), f.rel));
  } catch {
    return json(req, 404, { error: "File unavailable." });
  }

  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": f.type,
      "Content-Disposition": `attachment; filename="${f.name}"`,
      "Cache-Control": "private, no-store",
    },
  });
};
