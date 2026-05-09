import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  // Explicitly allow Googlebot and all other crawlers. Sitemap reference must be
  // an absolute URL for Google to honor it.
  const content = [
    "User-agent: Googlebot",
    "Allow: /",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    "Sitemap: https://thecodeman.net/sitemap.xml",
    "",
  ].join("\n");

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
