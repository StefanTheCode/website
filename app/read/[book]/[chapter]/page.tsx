import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Markdown from "markdown-to-jsx";
import {
  getAllBooks,
  getBook,
  getChapterMeta,
  getChapterContent,
  getChapterHeadings,
} from "@/components/getEbookData";
import ShikiCode from "@/components/ShikiCode";
import ReadingProgress from "@/components/ReadingProgress";
import Mermaid from "@/components/Mermaid";
import { mermaidToDivs } from "@/components/mermaidPrep";
import PaidChapter from "@/components/PaidChapter";
import FreeChapterCTA from "@/components/FreeChapterCTA";
import ReaderAuth from "@/components/ReaderAuth";
import CourseSidebar from "@/components/CourseSidebar";
import AskAIDrawer from "@/components/AskAIDrawer";
import "../../reader.css";

function extractHeadings(markdown: string) {
  return markdown
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

export function generateStaticParams() {
  const params: { book: string; chapter: string }[] = [];
  for (const book of getAllBooks()) {
    for (const c of book.chapters) {
      params.push({ book: book.slug, chapter: c.slug });
    }
  }
  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<{ book: string; chapter: string }> }
): Promise<Metadata> {
  const { book: bookSlug, chapter: chapterSlug } = await params;
  const found = getChapterMeta(bookSlug, chapterSlug);
  if (!found) return {};
  const { book, chapter } = found;
  const isFree = chapter.access === "free";
  return {
    title: `${chapter.title} — ${book.title}`,
    description: book.subtitle,
    alternates: {
      canonical: `https://thecodeman.net/read/${book.slug}/${chapter.slug}`,
    },
    robots: isFree ? undefined : { index: false, follow: true },
  };
}

export default async function ChapterPage(
  { params }: { params: Promise<{ book: string; chapter: string }> }
) {
  const { book: bookSlug, chapter: chapterSlug } = await params;

  const book = getBook(bookSlug);
  const found = getChapterMeta(bookSlug, chapterSlug);
  if (!book || !found) notFound();

  const { chapter, index } = found;
  const prev = index > 0 ? book.chapters[index - 1] : null;
  const next = index < book.chapters.length - 1 ? book.chapters[index + 1] : null;

  const chapterData = getChapterContent(bookSlug, chapterSlug);
  const isFree = chapterData?.access === "free" && !!chapterData.content;
  const prepared = isFree ? mermaidToDivs(chapterData!.content) : "";
  const summary = (chapterData?.data?.summary as string) || book.subtitle || "";
  // For free chapters extract headings from the already-loaded content.
  // For paid chapters use the dedicated headings-only function (content is
  // intentionally withheld from the static bundle).
  const sections = isFree
    ? extractHeadings(chapterData!.content)
    : getChapterHeadings(bookSlug, chapterSlug);

  return (
    <>
      <ReadingProgress />
      <Mermaid />
      <div className="rd-page">
        <div className="rd-ambience" aria-hidden="true" />

        <header className="rd-top">
          <div className="rd-wrap rd-top-row">
            <Link href="/" className="rd-brand">
              <span className="rd-glyph">&lt;/&gt;</span> TheCodeMan
            </Link>
            <nav className="rd-top-links">
              <Link href="/read">Library</Link>
              <Link href={`/read/${book.slug}`}>{book.title}</Link>
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

        <div className="rd-course-layout">
          <CourseSidebar
            bookSlug={book.slug}
            chapters={book.chapters}
            currentSlug={chapterSlug}
            bookTitle={book.title}
            productUrl={book.productUrl || "/design-patterns-that-deliver-ebook"}
            sections={sections}
          />

          <main className="rd-course-main">
            <div className="rd-wrap rd-section">
              <article className="rd-reader">
                <div className="rd-chap-head">
                  <span className="rd-eyebrow">
                    Chapter {chapter.order} of {book.chapters.length}
                  </span>
                  <h1>{chapter.title}</h1>
                  {summary && <p className="rd-chap-sum">{summary}</p>}
                  <p className="rd-chap-meta">
                    {chapter.estReadMin ? `${chapter.estReadMin} min read` : ""}
                    {chapter.access === "free" ? " · Free chapter" : " · Paid chapter"}
                  </p>
                </div>

                {isFree ? (
                  <div className="rd-body">
                    <Markdown
                      options={{
                        overrides: {
                          pre: {
                            component: (props: any) => {
                              const child = Array.isArray(props.children)
                                ? props.children[0]
                                : props.children;
                              const className = child?.props?.className ?? "";
                              const code = child?.props?.children ?? "";
                              return <ShikiCode className={className} code={code} />;
                            },
                          },
                          h2: {
                            component: ({ children, ...props }: any) => {
                              const text = typeof children === "string"
                                ? children
                                : Array.isArray(children)
                                ? children.map((c: any) => (typeof c === "string" ? c : "")).join("")
                                : "";
                              const id = text
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "");
                              return <h2 id={id} {...props}>{children}</h2>;
                            },
                          },
                        },
                      }}
                    >
                      {prepared}
                    </Markdown>
                  </div>
                ) : (
                  <PaidChapter
                    bookSlug={book.slug}
                    chapterSlug={chapter.slug}
                    productUrl={book.productUrl || "/design-patterns-that-deliver-ebook"}
                    summary={summary}
                  />
                )}

                {isFree && (
                  <FreeChapterCTA
                    productUrl={book.productUrl || "/design-patterns-that-deliver-ebook"}
                    chapterSlug={chapter.slug}
                  />
                )}

                <nav className="rd-pager">
                  {prev ? (
                    <Link
                      href={`/read/${book.slug}/${prev.slug}`}
                      className="rd-pagebtn"
                    >
                      <span className="rd-dir">← Previous</span>
                      <span className="rd-pt">{prev.title}</span>
                    </Link>
                  ) : (
                    <span />
                  )}
                  {next ? (
                    <Link
                      href={`/read/${book.slug}/${next.slug}`}
                      className="rd-pagebtn next"
                    >
                      <span className="rd-dir">Next →</span>
                      <span className="rd-pt">{next.title}</span>
                    </Link>
                  ) : (
                    <span />
                  )}
                </nav>
              </article>
            </div>
          </main>
        </div>
        <AskAIDrawer chapter={chapter.slug} />
      </div>
    </>
  );
}
