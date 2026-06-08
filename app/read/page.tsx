import Link from "next/link";
import type { Metadata } from "next";
import { getAllBooks } from "@/components/getEbookData";
import ReaderAuth from "@/components/ReaderAuth";
import "./reader.css";

export const metadata: Metadata = {
  title: "Read Online — TheCodeMan Ebooks",
  description:
    "Read Stefan Đokić's design-patterns ebooks online: searchable, with real copyable code and an AI tutor on every example.",
  alternates: { canonical: "https://thecodeman.net/read" },
};

export default function ReadLibrary() {
  const books = getAllBooks();

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
            <Link href="/design-patterns-that-deliver-ebook">Get the book</Link>
          </nav>
          <ReaderAuth />
          <Link href="/design-patterns-that-deliver-ebook" className="rd-cta">
            Get the ebook →
          </Link>
        </div>
      </header>

      <main className="rd-wrap rd-section">
        <div className="rd-hero">
          <span className="rd-eyebrow">Web reader</span>
          <h1>
            Read <span className="rd-amber">online</span>
          </h1>
          <p className="rd-lead">
            Your ebooks, on the web — searchable, with real copyable code and an
            AI tutor on every example. Sign in with your purchase to unlock
            every chapter.
          </p>
        </div>

        <div className="rd-books">
          {books.map((book) => {
            const freeCount = book.chapters.filter((c) => c.access === "free").length;
            return (
              <Link key={book.slug} href={`/read/${book.slug}`} className="rd-book-card">
                <span className="rd-book-badge">
                  {book.chapters.length} chapters{freeCount ? ` · ${freeCount} free` : ""}
                </span>
                <h2>{book.title}</h2>
                <p>{book.subtitle || book.description}</p>
                <span className="rd-book-go">Start reading →</span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
