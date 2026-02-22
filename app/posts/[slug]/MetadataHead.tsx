import Head from "next/head";
import matter from "gray-matter";
import fs from "fs";
import path from "path";

type Props = {
  slug: string;
  folder: "posts" | "patterns";
};

export default function MetadataHead({ slug, folder }: Props) {
  const filePath = path.join(process.cwd(), `${folder}/${slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContent);

  const title = data.title || "TheCodeMan Blog";
  const description = data.meta_description || "Practical .NET knowledge.";
  const image = `https://thecodeman.net/images/blog/${slug}.png`;
  const url = `https://thecodeman.net/${folder}/${slug}`;

  const canonicalUrl = `https://thecodeman.net/${folder}/${slug}`;
  const published = data.date ? new Date(data.date).toISOString() : undefined;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: [image],
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
      "@id": canonicalUrl
    },
    datePublished: published,
    dateModified: published
  };

  // Handle FAQ structured data if present
  const faq = Array.isArray(data.faq) ? data.faq : [];
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


  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonicalUrl} />
      {data.date && <meta property="article:published_time" content={data.date} />}
      <meta property="article:author" content="Stefan Djokic" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@TheCodeMan__" />
      <meta name="twitter:creator" content="@TheCodeMan__" />
      
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
    </Head>

  );
}
