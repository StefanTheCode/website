import { NextResponse } from "next/server";
import fs from "fs";
import matter from "gray-matter";

const BASE_URL = "https://thecodeman.net";

// Generic utility to get all slugs from a folder
const getSlugsFromFolder = (folder: string) => {
  const files = fs.readdirSync(folder);
  const markdownFiles = files.filter((file) => file.endsWith(".md"));

  return markdownFiles.map((fileName) => {
    const fileContents = fs.readFileSync(`${folder}/${fileName}`, "utf8");
    const matterResult = matter(fileContents);
    return {
      slug: fileName.replace(".md", ""),
      date: matterResult.data.date || null,
      folder,
    };
  });
};

export async function GET() {
  const staticRoutes = ["", "pass-your-interview", "sponsorship", "design-patterns", "blog", "design-patterns-simplified", "design-patterns-that-deliver-ebook", "builder-pattern-free-stuff", "rag-system-dotnet"]; // add any static routes here

  const posts = getSlugsFromFolder("posts");

  const dynamicRoutes = [
    ...posts.map((p) => ({
      url: `${BASE_URL}/posts/${p.slug}`,
      lastmod: p.date,
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
    .map(
      (route) => `
  <url>
    <loc>${BASE_URL}/${route}</loc>
  </url>`
    )
    .join("")}
  ${dynamicRoutes
    .map(
      (route) => `
  <url>
    <loc>${route.url}</loc>
    ${route.lastmod ? `<lastmod>${new Date(route.lastmod).toISOString()}</lastmod>` : ""}
  </url>`
    )
    .join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
