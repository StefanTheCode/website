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

  return (
    <Suspense fallback={<div>Loading blog...</div>}>
      <BlogClient allPosts={postMetadata} />
    </Suspense>
  );
};

export default BlogPage;