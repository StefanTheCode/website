import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BASE_URL = "https://thecodeman.net";

export const dynamic = "force-static";

type PostEntry = {
  slug: string;
  date: string | null;
  mtime: Date;
};

// Read posts from disk and return slug + frontmatter date + file mtime fallback.
const getPostsFromFolder = (folderName: string): PostEntry[] => {
  const folder = path.join(process.cwd(), folderName);
  const files = fs.readdirSync(folder);
  const markdownFiles = files.filter((file) => file.endsWith(".md"));

  return markdownFiles.map((fileName) => {
    const fullPath = path.join(folder, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    const stat = fs.statSync(fullPath);
    return {
      slug: fileName.replace(".md", ""),
      date: matterResult.data.date || null,
      mtime: stat.mtime,
    };
  });
};

// Safely produce an ISO date. Returns build-time date if input is missing/invalid.
const toIsoDate = (input: string | Date | null | undefined, fallback: Date): string => {
  if (!input) return fallback.toISOString();
  const d = new Date(input);
  if (isNaN(d.getTime())) return fallback.toISOString();
  return d.toISOString();
};

export async function GET() {
  // Static routes: homepage MUST be without trailing slash to match the canonical
  // declared in app/layout.tsx (https://thecodeman.net). Mismatched trailing slash
  // can cause Google to treat the sitemap URL as a separate (non-canonical) URL.
  const staticRoutes = [
    "",
    "blog",
    "about-me",
    "sponsorship",
    "media-kit",
    "pass-your-interview",
    "design-patterns-simplified",
    "design-patterns-that-deliver-ebook",
    "builder-pattern-free-stuff",
    "ai-in-dotnet-starter-kit",
    "vertical-slices-architecture",
    "pragmatic-dotnet-code-rules",
    "dotnet-code-rules-starter-kit",
    "newsletter-archive",
    "black-friday",
    "dotnet-roadmap-2026",
  ];

  const buildTime = new Date();
  const posts = getPostsFromFolder("posts");

  const staticUrls = staticRoutes.map((route) => ({
    url: route === "" ? BASE_URL : `${BASE_URL}/${route}`,
    lastmod: buildTime.toISOString(),
  }));

  const postUrls = posts.map((p) => ({
    url: `${BASE_URL}/posts/${p.slug}`,
    // Prefer frontmatter date; fall back to file mtime so newly-added posts always have a fresh lastmod.
    lastmod: toIsoDate(p.date, p.mtime),
  }));

  const allUrls = [...staticUrls, ...postUrls];

  // No leading whitespace before <?xml ?>; some validators are strict about this.
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    allUrls
      .map(
        (u) =>
          `  <url>\n    <loc>${u.url}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Make Netlify/CDN keep this fresh-ish. Build is the source of truth.
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
