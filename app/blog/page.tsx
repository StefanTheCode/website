import { Metadata } from "next";
import getPostMetadata from "@/components/getPostMetadata";
import BlogClient from "./blogClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: ".NET Blog - C# Tutorials, Architecture & Best Practices",
  alternates: {
    canonical: 'https://thecodeman.net/blog',
  },
  description: "Practical .NET tutorials, C# tips, architecture patterns, and software engineering best practices by Microsoft MVP Stefan Djokic. New articles every week.",
  openGraph: {
    title: ".NET Blog - C# Tutorials, Architecture & Best Practices",
    type: "website",
    url: "https://thecodeman.net/blog",
    description: "Practical .NET tutorials, C# tips, architecture patterns, and software engineering best practices by Microsoft MVP Stefan Djokic. New articles every week."
  },
  twitter: {
    title: ".NET Blog - C# Tutorials, Architecture & Best Practices",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "Practical .NET tutorials, C# tips, architecture patterns, and software engineering best practices by Microsoft MVP Stefan Djokic."
  }
};

const BlogPage = () => {
  const postMetadata = getPostMetadata();

  // Sort newest first so crawlers see fresh posts at the top of the indexable list.
  const sortedPosts = [...postMetadata].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      {/*
        SEO-only server-rendered post index.
        BlogClient is a client component that depends on useSearchParams(),
        which forces Next.js (under output: 'export') to render only the
        Suspense fallback in the static HTML. Without this list, the static
        /blog HTML contains zero links to posts, so Googlebot has no
        crawlable internal link to newly-published articles until the JS
        runtime executes. This <nav> ships every post URL in the initial
        HTML. It is positioned off-screen so it does not affect the visual
        design, but it is fully crawlable (NOT display:none, NOT hidden).
      */}
      <nav
        aria-label="All blog posts"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        <h2>All articles</h2>
        <ul>
          {sortedPosts.map((p) => (
            <li key={p.slug}>
              <a href={`/posts/${p.slug}`}>{p.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      <Suspense fallback={<div>Loading blog...</div>}>
        <BlogClient allPosts={postMetadata} />
      </Suspense>
    </>
  );
};

export default BlogPage;