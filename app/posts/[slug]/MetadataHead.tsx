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

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="article:published_time" content={data.date} />
      <meta property="article:author" content="Stefan Djokic" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@TheCodeMan__" />
      <meta name="twitter:creator" content="@TheCodeMan__" />
    </Head>
  );
}
