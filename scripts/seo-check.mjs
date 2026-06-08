#!/usr/bin/env node
// SEO / indexing validator for the static export in ./out
//
// Run AFTER `npm run build` (which produces ./out via output: 'export').
//
//   node scripts/seo-check.mjs
//
// Exits with code 1 on any critical failure so it can gate Netlify builds.
//
// Checks:
//   1. robots.txt exists and contains an absolute Sitemap directive.
//   2. sitemap.xml exists, is valid-ish XML, lists every post in /posts.
//   3. Every <loc> in the sitemap uses https://thecodeman.net (no www, no http).
//   4. Every post HTML in out/posts contains:
//        - <link rel="canonical" href="...same URL..."> matching its path
//        - NO <meta name="robots" content="...noindex...">
//        - the article body (server-rendered, not just a JS bundle)
//   5. The blog listing HTML (out/blog.html) contains crawlable links to
//      every post (so newly published posts are never orphaned).

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "out");
const POSTS_DIR = path.join(ROOT, "posts");
const IMAGES_DIR = path.join(ROOT, "public", "images", "blog");
const BASE_URL = "https://thecodeman.net";

const errors = [];
const warnings = [];

const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

if (!fs.existsSync(OUT)) {
  console.error(`[seo-check] ./out not found. Run \`npm run build\` first.`);
  process.exit(1);
}

// ---------- 0. Per-post frontmatter sanity (read posts/*.md directly) ----------
// Minimal frontmatter parser — avoids adding a runtime dependency on gray-matter
// to this script. Handles the simple `---\nkey: "value"\nkey: value\n---` shape
// the repo actually uses.
const parseFrontmatter = (raw) => {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    fm[kv[1]] = v;
  }
  return fm;
};

const fmFiles = fs.existsSync(POSTS_DIR)
  ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"))
  : [];

for (const f of fmFiles) {
  const slug = f.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, f), "utf8");
  const fm = parseFrontmatter(raw);

  if (!fm.title) fail(`[frontmatter] ${slug}: missing title`);
  if (!fm.date) {
    fail(`[frontmatter] ${slug}: missing date`);
  } else if (isNaN(new Date(fm.date).getTime())) {
    fail(`[frontmatter] ${slug}: invalid date "${fm.date}"`);
  }
  if (!fm.meta_description && !fm.subtitle) {
    warn(`[frontmatter] ${slug}: no meta_description and no subtitle`);
  }
  if (fm.meta_description && fm.meta_description.length > 165) {
    warn(
      `[frontmatter] ${slug}: meta_description is ${fm.meta_description.length} chars (Google truncates ~160)`
    );
  }
  if (!fm.category) warn(`[frontmatter] ${slug}: no category`);

  // Cover image must exist or page.tsx will fall back to default OG image.
  // Still warn so we know which posts are missing branded covers.
  const imgPath = path.join(IMAGES_DIR, `${slug}.png`);
  if (!fs.existsSync(imgPath)) {
    warn(`[image] ${slug}: missing public/images/blog/${slug}.png — using default OG image fallback`);
  }
}

// ---------- 1. robots.txt ----------
const robotsPath = path.join(OUT, "robots.txt");
let robotsTxt = "";
if (!fs.existsSync(robotsPath)) {
  fail(`robots.txt not found at ${robotsPath}. The route handler may not have been exported.`);
} else {
  robotsTxt = fs.readFileSync(robotsPath, "utf8");
  if (!/^\s*Sitemap:\s*https?:\/\//im.test(robotsTxt)) {
    fail(`robots.txt is missing an absolute "Sitemap:" directive.`);
  }
  if (!robotsTxt.includes(`${BASE_URL}/sitemap.xml`)) {
    fail(`robots.txt does not reference ${BASE_URL}/sitemap.xml`);
  }
  if (/Disallow:\s*\/\s*$/m.test(robotsTxt)) {
    fail(`robots.txt contains a blanket "Disallow: /" — site is blocked from crawling.`);
  }
}

// ---------- 2. sitemap.xml ----------
const sitemapPath = path.join(OUT, "sitemap.xml");
let sitemapXml = "";
if (!fs.existsSync(sitemapPath)) {
  fail(`sitemap.xml not found at ${sitemapPath}.`);
} else {
  sitemapXml = fs.readFileSync(sitemapPath, "utf8");
  if (!sitemapXml.trimStart().startsWith("<?xml")) {
    fail(`sitemap.xml does not start with <?xml ... ?> declaration.`);
  }
  if (!sitemapXml.includes("<urlset")) {
    fail(`sitemap.xml is missing <urlset>.`);
  }
}

const sitemapLocs = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(
  (m) => m[1].trim()
);

for (const loc of sitemapLocs) {
  if (!loc.startsWith(BASE_URL)) {
    fail(`sitemap.xml contains non-canonical URL: ${loc}`);
  }
}

// All posts on disk must appear in the sitemap.
const postFiles = fs.existsSync(POSTS_DIR)
  ? fs
      .readdirSync(POSTS_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""))
  : [];

const missingFromSitemap = postFiles.filter(
  (slug) => !sitemapLocs.includes(`${BASE_URL}/posts/${slug}`)
);
if (missingFromSitemap.length) {
  fail(
    `sitemap.xml is missing ${missingFromSitemap.length} post(s):\n  - ` +
      missingFromSitemap.join("\n  - ")
  );
}

// ---------- 3. Per-post HTML checks ----------
const postsOutDir = path.join(OUT, "posts");
let checkedPosts = 0;
if (fs.existsSync(postsOutDir)) {
  for (const slug of postFiles) {
    // With trailingSlash: false, Next exports out/posts/<slug>.html
    const htmlPath = path.join(postsOutDir, `${slug}.html`);
    if (!fs.existsSync(htmlPath)) {
      fail(`Built HTML missing for post: ${slug} (expected ${htmlPath})`);
      continue;
    }
    checkedPosts++;
    const html = fs.readFileSync(htmlPath, "utf8");
    const expectedUrl = `${BASE_URL}/posts/${slug}`;

    // Canonical
    const canonMatch = html.match(
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
    );
    if (!canonMatch) {
      fail(`[${slug}] missing <link rel="canonical">`);
    } else if (canonMatch[1] !== expectedUrl) {
      fail(`[${slug}] canonical mismatch: got ${canonMatch[1]}, expected ${expectedUrl}`);
    }

    // No noindex
    if (/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) {
      fail(`[${slug}] page has <meta name="robots" content="...noindex">`);
    }

    // Article body should be present in initial HTML (SSR/SSG, not client-only).
    // Heuristic: the first <h1> / <h2> heading from the markdown should be in the HTML.
    // We just verify the page has a meaningful amount of body text rather than only a
    // loading spinner / Suspense fallback.
    const bodyText = html
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (bodyText.length < 1500) {
      warn(`[${slug}] rendered HTML body is very short (${bodyText.length} chars). Article may not be server-rendered.`);
    }

    // BlogPosting JSON-LD
    if (!/"@type"\s*:\s*"BlogPosting"/.test(html) && !/"@type"\s*:\s*"Article"/.test(html)) {
      warn(`[${slug}] no BlogPosting/Article JSON-LD found.`);
    }
  }
} else {
  fail(`out/posts directory not found.`);
}

// ---------- 4. Blog listing must link to every post ----------
const blogHtmlCandidates = [
  path.join(OUT, "blog.html"),
  path.join(OUT, "blog", "index.html"),
];
const blogHtmlPath = blogHtmlCandidates.find((p) => fs.existsSync(p));
if (!blogHtmlPath) {
  fail(`Blog listing HTML not found (looked for ${blogHtmlCandidates.join(", ")}).`);
} else {
  const blogHtml = fs.readFileSync(blogHtmlPath, "utf8");
  const orphaned = postFiles.filter(
    (slug) => !blogHtml.includes(`/posts/${slug}`)
  );
  if (orphaned.length) {
    fail(
      `Blog listing HTML does not contain links to ${orphaned.length} post(s) ` +
        `(orphan risk for crawlers that don't execute JS):\n  - ` +
        orphaned.slice(0, 10).join("\n  - ") +
        (orphaned.length > 10 ? `\n  ... and ${orphaned.length - 10} more` : "")
    );
  }
}

// ---------- Report ----------
console.log(`[seo-check] posts on disk: ${postFiles.length}`);
console.log(`[seo-check] sitemap URLs: ${sitemapLocs.length}`);
console.log(`[seo-check] post HTML files checked: ${checkedPosts}`);

if (warnings.length) {
  console.log(`\n[seo-check] WARNINGS (${warnings.length}):`);
  for (const w of warnings) console.log(`  - ${w}`);
}

if (errors.length) {
  console.error(`\n[seo-check] ERRORS (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`\n[seo-check] OK`);
