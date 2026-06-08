import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBooks, getBook } from "@/components/getEbookData";
import ReaderAuth from "@/components/ReaderAuth";
import "../reader.css";

export function generateStaticParams() {
  return getAllBooks().map((b) => ({ book: b.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ book: string }> }
): Promise<Metadata> {
  const { book: bookSlug } = await params;
  const book = getBook(bookSlug);
  if (!book) return {};
  return {
    title: `${book.title} — Read Online`,
    description: book.description || book.subtitle,
    alternates: { canonical: `https://thecodeman.net/read/${book.slug}` },
  };
}

export default async function BookHome(
  { params }: { params: Promise<{ book: string }> }
) {
  const { book: bookSlug } = await params;
  const book = getBook(bookSlug);
  if (!book) notFound();

  return (
    <div className="rd-page">
      <div className="rd-ambience" aria-hidden="true" />

      <header className="rd-top">
        <div className="rd-wrap rd-top-row">
          <Link href="/" className="rd-brand">
            <span className="rd-glyph">&lt;/&gt;</span> TheCodeMan
          </Link>
          <nav className="rd-top-links">
            <Link href="/read">Library</Link>
            <Link href={book.productUrl || "/design-patterns-that-deliver-ebook"}>
              Get the book
            </Link>
          </nav>
          <ReaderAuth />
          <Link
            href={book.productUrl || "/design-patterns-that-deliver-ebook"}
            className="rd-cta"
          >
            Get the ebook →
          </Link>
        </div>
      </header>

      <main className="rd-wrap rd-section">
        <div className="rd-crumbs">
          <Link href="/read">Library</Link> <span>/</span> {book.title}
        </div>

        <div className="rd-bookhead">
          <span className="rd-eyebrow">Web reader</span>
          <h1>{book.title}</h1>
          {book.subtitle && <p className="rd-sub">{book.subtitle}</p>}
          <p className="rd-meta">
            {book.chapters.length} chapters
            {book.version ? ` · v${book.version}` : ""}
            {book.author ? ` · ${book.author}` : ""}
          </p>
        </div>

        <ol className="rd-toc">
          {book.chapters.map((c) => {
            const isFree = c.access === "free";
            return (
              <li key={c.slug}>
                <Link
                  href={`/read/${book.slug}/${c.slug}`}
                  className={`rd-toc-item${isFree ? "" : " locked"}`}
                >
                  <span className="rd-toc-left">
                    <span className="rd-toc-num">
                      {String(c.order).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="rd-toc-title">{c.title}</span>
                      {c.estReadMin ? (
                        <span className="rd-toc-read">{c.estReadMin} min read</span>
                      ) : null}
                    </span>
                  </span>
                  <span className={isFree ? "rd-badge-free" : "rd-badge-lock"}>
                    {isFree ? "Free" : "Locked"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
