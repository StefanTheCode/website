import fs from "fs";
import path from "path";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import getPostMetadata from "../../../components/getPostMetadata";
import "../[slug]/page.module.css";
import Subscribe from "@/app/subscribe";
import Help from "@/app/help";
import config from "@/config.json";
import { notFound } from "next/navigation";
import CodeBlock from "@/components/CodeBlock";
import CodeFrame from "@/components/CodeFrame";
import ShikiCode from "@/components/ShikiCode";
import { highlightFencedCode } from "@/components/highlightMarkdown";
import Author from "@/app/author";
import { Metadata } from "next";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButtons from "@/components/ShareButtons";
import TableOfContents from "@/components/TableOfContents";
import RelatedPosts from "@/components/RelatedPosts";
import PostNavigation from "@/components/PostNavigation";
import HeadingAnchors from "@/components/HeadingAnchors";
import Link from "next/link";
import Image from "next/image";

const postsDir = path.join(process.cwd(), "posts");

function getPostContent(slug: string) {
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    console.error(`Post file not found for slug "${slug}" at path: ${filePath}`);
    notFound();
  }

  const content = fs.readFileSync(filePath, "utf8");
  const matterResult = matter(content);

  if (!matterResult.data?.title) {
    console.error(`Missing title in frontmatter for slug: ${slug}`);
    notFound();
  }

  return matterResult;
}

export async function generateStaticParams() {
  const posts = getPostMetadata();

  console.log("generateStaticParams slugs:", posts.map(p => p.slug));

  return posts
    .filter((p) => !!p.slug)
    .map((post) => ({
      slug: post.slug,
    }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return {};
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContent);

  const title = data.title || "TheCodeMan Blog";
  const description = data.meta_description || data.subtitle || "Practical .NET knowledge by Stefan Djokic.";
  const image = `https://thecodeman.net/images/blog/${slug}.png`;
  const url = `https://thecodeman.net/posts/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: image }],
      publishedTime: data.date ? new Date(data.date).toISOString() : undefined,
      authors: ["Stefan Djokic"],
      tags: data.category ? [data.category] : undefined,
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      site: "@TheCodeMan__",
      creator: "@TheCodeMan__",
      images: [image],
    },
  };
}

export default async function PostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    console.error("Missing slug in route params:", params);
    notFound();
  }

  const post = getPostContent(slug);
  const highlightedContent = await highlightFencedCode(post.content);

  const meta = {
    title: post.data.title,
    description: post.data.meta_description || "",
    image: `https://thecodeman.net/images/blog/${slug}.png`,
    url: `https://thecodeman.net/posts/${slug}`,
    date: post.data.date,
  };

  const published = post.data.date ? new Date(post.data.date).toISOString() : undefined;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    image: [meta.image],
    author: {
      "@type": "Person",
      "@id": "https://thecodeman.net/#/schema/person/stefan-djokic",
      name: "Stefan Djokic",
      url: "https://thecodeman.net"
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://thecodeman.net/#/schema/org",
      name: "TheCodeMan.net",
      url: "https://thecodeman.net",
      logo: {
        "@type": "ImageObject",
        url: "https://thecodeman.net/og-image.png"
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": meta.url
    },
    datePublished: published,
    dateModified: published
  };

  const faq = Array.isArray(post.data.faq) ? post.data.faq : [];
  const faqLd = faq.length
    ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item: any) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    }
    : null;

  const allPosts = getPostMetadata();

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <section className="img ftco-section">
        <div className="container">
          <div className="row justify-content-center pb-5 pt-10">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 heading-section border-right">

              {/* Breadcrumb */}
              <nav className="breadcrumb-nav">
                <Link href="/">Home</Link>
                <span className="breadcrumb-sep">/</span>
                <Link href="/blog">Blog</Link>
                {post.data.category && (
                  <>
                    <span className="breadcrumb-sep">/</span>
                    <Link href={`/blog?category=${encodeURIComponent(post.data.category)}`}>{post.data.category}</Link>
                  </>
                )}
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">{meta.title}</span>
              </nav>

              <div className="row justify-content-center pb-5">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 heading-section text-center">
                  <h1 className="blog-header2">{meta.title}</h1>
                  <div className="post-meta-bar">
                    <span>{meta.date}</span>
                    {post.data.readTime && (
                      <>
                        <span className="meta-sep" />
                        <span> - {post.data.readTime}</span>
                      </>
                    )}
                    {post.data.category && (
                      <>
                        <span className="meta-sep" />
                        <Link href={`/blog?category=${encodeURIComponent(post.data.category)}`}> - {post.data.category}</Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Table of Contents */}
              <TableOfContents />

              {post.content ? (
                <Markdown
                  options={{
                    overrides: {
                      pre: {
                        component: (props: any) => {
                          const child = Array.isArray(props.children) ? props.children[0] : props.children;

                          const className = child?.props?.className ?? "";
                          const code = child?.props?.children ?? "";

                          return <ShikiCode className={className} code={code} />;
                        },
                      },
                    },
                  }}
                >
                  {post.content}
                </Markdown>
              ) : (
                <p>Post content missing.</p>
              )}

              {/* Heading Anchor Links */}
              <HeadingAnchors />

              {/* Share Buttons */}
              <ShareButtons url={meta.url} title={meta.title} image={meta.image} />

              <Author />

              {/* Previous / Next Navigation */}
              <PostNavigation currentSlug={slug} allPosts={allPosts} />

              {/* Related Posts */}
              <RelatedPosts
                currentSlug={slug}
                currentCategory={post.data.category || ""}
                allPosts={allPosts}
              />

              <Help />
              <Subscribe />
            </div>

            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-xs-12">
              <div className="row justify-content-center pb-5 fixed-position">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <h4>
                    Subscribe to <br />
                    TheCodeMan.net
                  </h4>
                  <p className="text-slate-400 mt-2">
                    Subscribe to the TheCodeMan.net and be among the{" "}
                    <span className="text-yellow">{config.NewsletterSubCount}</span> gaining
                    practical tips and resources to enhance your .NET expertise.
                  </p>
                  <div className="row">
                    <div
                      className="col-md-12 padding-left0 padding-right0"
                      dangerouslySetInnerHTML={{
                        __html: `<script async src="https://eomail4.com/form/03cc8224-cde8-11ef-b5d5-4bdfe653a4b5.js" data-form="03cc8224-cde8-11ef-b5d5-4bdfe653a4b5"></script>`,
                      }}
                    />
                  </div>

                  {/* Product Cards */}
                  <div className="sidebar-products mt-4">
                    <h5 className="text-yellow mb-3">Resources</h5>

                    <Link href="/pragmatic-dotnet-code-rules?utm_source=sidebar" className="sidebar-product-card">
                      <Image src="/images/course.png" alt="Pragmatic .NET Code Rules Course" width={300} height={160} className="sidebar-product-img" />
                      <span className="sidebar-product-title">Pragmatic .NET Code Rules</span>
                      <span className="sidebar-product-label">Course</span>
                    </Link>

                    <Link href="/design-patterns-that-deliver-ebook?utm_source=sidebar" className="sidebar-product-card">
                      <Image src="/images/ebook.png" alt="Design Patterns that Deliver Ebook" width={300} height={160} className="sidebar-product-img" />
                      <span className="sidebar-product-title">Design Patterns that Deliver</span>
                      <span className="sidebar-product-label">Ebook</span>
                    </Link>

                    <Link href="/design-patterns-simplified?utm_source=sidebar" className="sidebar-product-card">
                      <Image src="/images/ebook2.png" alt="Design Patterns Simplified Ebook" width={300} height={160} className="sidebar-product-img" />
                      <span className="sidebar-product-title">Design Patterns Simplified</span>
                      <span className="sidebar-product-label">Ebook — $9.95</span>
                    </Link>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
