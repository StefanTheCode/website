import { NextResponse } from "next/server";
import fs from "fs";
import matter from "gray-matter";

const BASE_URL = "https://thecodeman.net";

export async function GET() {
  const folder = "posts/";
  const files = fs.readdirSync(folder);
  const markdownFiles = files.filter((file) => file.endsWith(".md"));

  const posts = markdownFiles
    .map((fileName) => {
      const fileContents = fs.readFileSync(`${folder}/${fileName}`, "utf8");
      const { data } = matter(fileContents);
      return {
        title: data.title || fileName.replace(".md", ""),
        slug: fileName.replace(".md", ""),
        date: data.date ? new Date(data.date) : new Date(),
        subtitle: data.subtitle || "",
        category: data.category || "",
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const latestDate = posts.length > 0 ? posts[0].date.toUTCString() : new Date().toUTCString();

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const rssItems = posts
    .slice(0, 50)
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/posts/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/posts/${post.slug}</guid>
      <description>${escapeXml(post.subtitle)}</description>
      <pubDate>${post.date.toUTCString()}</pubDate>
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ""}
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TheCodeMan.NET - .NET Blog</title>
    <link>${BASE_URL}</link>
    <description>Practical .NET tutorials, C# tips, architecture patterns, and software engineering best practices by Microsoft MVP Stefan Djokic.</description>
    <language>en-us</language>
    <lastBuildDate>${latestDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/og-image.png</url>
      <title>TheCodeMan.NET</title>
      <link>${BASE_URL}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
