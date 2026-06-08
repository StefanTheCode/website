import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ebooksDir = path.join(process.cwd(), "ebooks");

export type ChapterMeta = {
  file: string;
  slug: string;
  title: string;
  order: number;
  access: "free" | "paid";
  estReadMin?: number;
};

export type BookMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  author?: string;
  version?: string;
  cover?: string;
  productUrl?: string;
  description?: string;
  chapters: ChapterMeta[];
};

export type ChapterContent = {
  data: Record<string, any>;
  content: string;
  access: "free" | "paid";
};

/** All books that have a book.json manifest. */
export function getAllBooks(): BookMeta[] {
  if (!fs.existsSync(ebooksDir)) return [];

  return fs
    .readdirSync(ebooksDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const manifestPath = path.join(ebooksDir, d.name, "book.json");
      if (!fs.existsSync(manifestPath)) return null;
      const book = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as BookMeta;
      book.chapters = (book.chapters || []).sort((a, b) => a.order - b.order);
      return book;
    })
    .filter((b): b is BookMeta => b !== null);
}

export function getBook(bookSlug: string): BookMeta | null {
  return getAllBooks().find((b) => b.slug === bookSlug) ?? null;
}

export function getChapterMeta(
  bookSlug: string,
  chapterSlug: string
): { book: BookMeta; chapter: ChapterMeta; index: number } | null {
  const book = getBook(bookSlug);
  if (!book) return null;
  const index = book.chapters.findIndex((c) => c.slug === chapterSlug);
  if (index === -1) return null;
  return { book, chapter: book.chapters[index], index };
}

/**
 * Returns only the ## headings from a chapter's markdown file.
 * Safe to call for paid chapters — returns titles but never body prose.
 */
export function getChapterHeadings(
  bookSlug: string,
  chapterSlug: string
): { id: string; text: string }[] {
  const found = getChapterMeta(bookSlug, chapterSlug);
  if (!found) return [];
  const { book, chapter } = found;
  const filePath = path.join(ebooksDir, book.slug, chapter.file);
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => {
      const text = l.replace(/^## /, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return { id, text };
    });
}
/**
 * Returns the chapter content ONLY for free chapters.
 * Paid chapters intentionally return null content so their body is never
 * emitted into the static bundle — true gating happens later via a
 * Netlify Function that checks the user's Lemon Squeezy entitlement.
 */
export function getChapterContent(
  bookSlug: string,
  chapterSlug: string
): ChapterContent | null {
  const found = getChapterMeta(bookSlug, chapterSlug);
  if (!found) return null;

  const { book, chapter } = found;
  const filePath = path.join(ebooksDir, book.slug, chapter.file);
  if (!fs.existsSync(filePath)) return null;

  const parsed = matter(fs.readFileSync(filePath, "utf8"));
  const access = (parsed.data.access as "free" | "paid") || chapter.access;

  // Gate: do not expose paid body in the static build.
  if (access !== "free") {
    return { data: parsed.data, content: "", access };
  }

  return { data: parsed.data, content: parsed.content, access };
}
