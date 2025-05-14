import { Metadata } from "next";
import getPostMetadata from "@/components/getPostMetadata";
import BlogClient from "./blogClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net/blog'),
  title: "Blog",
  description: "Explore TheCodeMan.NET blog for expert articles on .NET development, C# tutorials, and software engineering trends. Stay ahead in the tech world with in-depth insights.",
  openGraph: {
    title: "Blog",
    type: "website",
    url: "https://thecodeman.net/blog",
    description: "Explore TheCodeMan.NET blog for expert articles on .NET development, C# tutorials, and software engineering trends. Stay ahead in the tech world with in-depth insights."
  },
  twitter: {
    title: "Blog",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "Explore TheCodeMan.NET blog for expert articles on .NET development, C# tutorials, and software engineering trends. Stay ahead in the tech world with in-depth insights."
  }
};

const BlogPage = () => {
  const postMetadata = getPostMetadata();

  return (
    <Suspense fallback={<div>Loading blog...</div>}>
      <BlogClient allPosts={postMetadata} />
    </Suspense>
  );
};

export default BlogPage;