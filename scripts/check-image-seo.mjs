#!/usr/bin/env node
/**
 * scripts/check-image-seo.mjs
 *
 * Image-SEO linter for thecodeman.net.
 *
 *   node scripts/check-image-seo.mjs            # warn-only (exit 0 on warnings)
 *   node scripts/check-image-seo.mjs --strict   # exit 1 if any warning fires
 *
 * Checks performed:
 *   1. Filenames: flag generic names (IMG_*, screenshot*, image*, untitled*,
 *      photo*, picture*, foo*, asset*, "1.png", etc.) and uppercase /
 *      non-kebab-case names under public/images/.
 *   2. File size: warn when a single image exceeds --max-kb (default 500 kB).
 *   3. Format: warn when a >150 kB PNG/JPG has no .webp sibling.
 *   4. Markdown alt text: parse ![alt](src) in posts/**.md and flag:
 *        - empty alt
 *        - generic alt ("image", "screenshot", "photo", "seo", "img", ...)
 *        - duplicate alt strings reused for different images in the same file
 *   5. JSX alt text: parse <img ... alt="..."> and <Image ... alt="..."> in
 *      app/** and components/** and apply the same generic-alt check.
 *      Also flag missing width/height on <img>.
 *   6. Cover images: every posts/<slug>.md must have
 *      public/images/blog/<slug>.{png,jpg,jpeg,webp}.
 *
 * Output is grouped by file path and line number where possible. Designed to
 * be run locally and in CI (`npm run check:image-seo -- --strict`).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const STRICT = process.argv.includes("--strict");
const MAX_KB = (() => {
  const f = process.argv.find((a) => a.startsWith("--max-kb="));
  return f ? Number(f.split("=")[1]) : 500;
})();

const GENERIC_ALT = new Set([
  "",
  "image",
  "img",
  "images",
  "screenshot",
  "screen shot",
  "photo",
  "picture",
  "pic",
  "seo",
  "alt",
  "graphic",
  "figure",
  "illustration",
  "logo",
  "icon",
  "thumbnail",
  "thumb",
  "untitled",
]);

const GENERIC_FILENAME_PATTERNS = [
  /^img[_-]?\d+/i,
  /^image[_-]?\d*\.(png|jpe?g|webp|svg|gif|avif)$/i,
  /^screenshot[_-]?\d*/i,
  /^screen[_-]?shot[_-]?\d*/i,
  /^untitled/i,
  /^photo[_-]?\d*\.(png|jpe?g|webp|svg|gif|avif)$/i,
  /^picture[_-]?\d*\.(png|jpe?g|webp|svg|gif|avif)$/i,
  /^asset[_-]?\d*\.(png|jpe?g|webp|svg|gif|avif)$/i,
  /^(foo|bar|baz)\.(png|jpe?g|webp|svg|gif|avif)$/i,
  /^\d+\.(png|jpe?g|webp|svg|gif|avif)$/i,
  // Only flag "new" / "new1.png" — not "new-customer-discount-handler.png"
  /^new\d*\.(png|jpe?g|webp|svg|gif|avif)$/i,
  /^copy[_ -]of/i,
  /^[a-z]\.(png|jpe?g|webp|svg)$/i, // single-letter filenames like "a.png"
];

const findings = []; // { level: 'error'|'warn', file, line?, msg }
const warn = (file, msg, line) =>
  findings.push({ level: "warn", file, msg, line });
const err = (file, msg, line) =>
  findings.push({ level: "error", file, msg, line });

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const rel = (p) => path.relative(ROOT, p).replace(/\\/g, "/");

// ---- 1, 2, 3: filename / size / format on public/ ---------------------
const publicDir = path.join(ROOT, "public");
const allPublic = walk(publicDir);
const rasterByDir = new Map(); // dir -> Set of basenames (no ext)

for (const p of allPublic) {
  const ext = path.extname(p).toLowerCase();
  if (![".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif"].includes(ext))
    continue;
  const base = path.basename(p, ext);
  const dir = path.dirname(p);
  if (!rasterByDir.has(dir)) rasterByDir.set(dir, new Set());
  rasterByDir.get(dir).add(base + ext);

  // 1a. Generic filename
  for (const re of GENERIC_FILENAME_PATTERNS) {
    if (re.test(base + ext)) {
      warn(rel(p), `generic / non-descriptive filename — consider renaming to something content-specific`);
      break;
    }
  }
  // 1b. Non-kebab-case (only for content images, skip third-party / unused folders)
  if (
    /[A-Z]/.test(base) ||
    /[ _]/.test(base) ||
    /\.\./.test(base)
  ) {
    // skip third-party assets (fonts/icons/sponsors/js) and the unused
    // images-pool/ scratch folder.
    if (!/\/(fonts|icons|sponsors|js|images-pool)\//.test(rel(p))) {
      warn(
        rel(p),
        `filename is not lowercase-kebab-case — consider renaming (URL changes require a redirect)`
      );
    }
  }

  // 2. File size
  if ([".png", ".jpg", ".jpeg", ".webp", ".avif"].includes(ext)) {
    const kb = fs.statSync(p).size / 1024;
    if (kb > MAX_KB) {
      warn(rel(p), `image is ${kb.toFixed(0)} kB (> ${MAX_KB} kB) — compress or convert to WebP`);
    }
  }
}

// 3. PNG/JPG >150kB without a .webp sibling
for (const p of allPublic) {
  const ext = path.extname(p).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;
  const kb = fs.statSync(p).size / 1024;
  if (kb < 150) continue;
  const webp = p.replace(/\.(png|jpe?g)$/i, ".webp");
  if (!fs.existsSync(webp)) {
    warn(
      rel(p),
      `${kb.toFixed(0)} kB raster has no .webp sibling — run npm run optimize:images -- --write`
    );
  }
}

// ---- 4. Markdown alt text --------------------------------------------
const postDirs = ["posts", "patterns"].map((d) => path.join(ROOT, d));
const mdFiles = postDirs
  .flatMap((d) => walk(d))
  .filter((p) => /\.(md|mdx)$/i.test(p));

// Strip fenced code blocks so we don't lint code samples.
function stripFences(src) {
  return src.replace(/```[\s\S]*?```/g, (m) =>
    m.replace(/[^\n]/g, " ")
  );
}

const MD_IMG = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

for (const f of mdFiles) {
  const raw = fs.readFileSync(f, "utf8");
  const src = stripFences(raw);
  const lines = src.split("\n");
  const altsSeen = new Map(); // alt -> first src

  lines.forEach((line, i) => {
    let m;
    MD_IMG.lastIndex = 0;
    while ((m = MD_IMG.exec(line))) {
      const alt = m[1].trim();
      const url = m[2];
      const lineNo = i + 1;
      if (alt === "") {
        warn(rel(f), `empty alt text for image ${url}`, lineNo);
      } else if (GENERIC_ALT.has(alt.toLowerCase())) {
        warn(rel(f), `generic alt text "${alt}" for ${url}`, lineNo);
      } else if (alt.length < 4) {
        warn(rel(f), `very short alt text "${alt}" for ${url}`, lineNo);
      } else {
        const prev = altsSeen.get(alt);
        if (prev && prev !== url) {
          warn(
            rel(f),
            `duplicate alt text "${alt}" reused for different images (also used for ${prev})`,
            lineNo
          );
        }
        altsSeen.set(alt, url);
      }
    }
  });
}

// ---- 5. JSX alt text + missing dimensions -----------------------------
const codeDirs = ["app", "components"].map((d) => path.join(ROOT, d));
const codeFiles = codeDirs
  .flatMap((d) => walk(d))
  .filter((p) => /\.(tsx|jsx|ts|js)$/i.test(p));

const TAG_RE = /<(img|Image)\b([^>]*?)\/?>/gi;
const ATTR_RE = (name) =>
  new RegExp(`\\b${name}=\\s*(?:\\"([^\\"]*)\\"|\\{([^}]*)\\})`, "i");

for (const f of codeFiles) {
  const src = fs.readFileSync(f, "utf8");
  const lines = src.split("\n");
  TAG_RE.lastIndex = 0;
  let m;
  while ((m = TAG_RE.exec(src))) {
    const tag = m[1];
    const attrs = m[2];
    const upToHere = src.slice(0, m.index);
    const lineNo = upToHere.split("\n").length;

    const altM = attrs.match(ATTR_RE("alt"));
    if (!altM) {
      warn(rel(f), `<${tag}> is missing alt attribute`, lineNo);
    } else {
      // Group 1: string literal value (alt="..."). Group 2: JSX expression
      // value (alt={someVar}). We can only statically validate string
      // literals; for expressions we accept the alt and skip checks unless
      // the expression is itself an empty-string literal.
      const literal = altM[1];
      const expr = altM[2];
      let alt = null;
      if (literal !== undefined) {
        alt = literal.trim();
      } else if (expr !== undefined) {
        const t = expr.trim();
        // Detect alt={""} / alt={''} / alt={``} — truly empty.
        if (/^(['"`])\s*\1$/.test(t)) alt = "";
        // otherwise: dynamic expression — skip static checks.
      }
      if (alt !== null) {
        if (alt === "") {
          if (tag === "Image") {
            warn(rel(f), `<Image> has empty alt — decorative images should use <img alt=""> instead`, lineNo);
          }
        } else if (GENERIC_ALT.has(alt.toLowerCase())) {
          warn(rel(f), `generic alt text "${alt}" on <${tag}>`, lineNo);
        } else if (alt.length < 4) {
          warn(rel(f), `very short alt text "${alt}" on <${tag}>`, lineNo);
        }
      }
    }

    if (tag === "img") {
      const w = attrs.match(ATTR_RE("width"));
      const h = attrs.match(ATTR_RE("height"));
      // skip plainly external img tags (YouTube thumbnails etc.) only if they
      // already supply explicit sizing via CSS — we still want width/height to
      // avoid CLS.
      if (!w || !h) {
        warn(rel(f), `<img> is missing explicit width/height (causes CLS)`, lineNo);
      }
    }
  }
}

// ---- 6. Cover image existence ----------------------------------------
const postsDir = path.join(ROOT, "posts");
if (fs.existsSync(postsDir)) {
  const slugs = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
  for (const slug of slugs) {
    const candidates = [".png", ".jpg", ".jpeg", ".webp"].map((e) =>
      path.join(ROOT, "public", "images", "blog", slug + e)
    );
    if (!candidates.some((p) => fs.existsSync(p))) {
      warn(`posts/${slug}.md`, `no cover image at public/images/blog/${slug}.(png|jpg|webp) — page will use default OG image`);
    }
  }
}

// ---- Output -----------------------------------------------------------
// To avoid flooding VS Code's integrated terminal (which freezes on Windows
// after a few hundred lines), the FULL report is written to a file and only
// a compact summary is printed to stdout. Pass --verbose to mirror everything
// to stdout.
const VERBOSE = process.argv.includes("--verbose");

findings.sort((a, b) =>
  (a.file + (a.line || 0)).localeCompare(b.file + (b.line || 0))
);

const byFile = new Map();
for (const f of findings) {
  if (!byFile.has(f.file)) byFile.set(f.file, []);
  byFile.get(f.file).push(f);
}

let warnCount = 0;
let errCount = 0;
const reportLines = [];

for (const [file, list] of byFile) {
  reportLines.push(`\n${file}`);
  for (const f of list) {
    const tag = f.level === "error" ? "ERROR" : "warn ";
    const loc = f.line ? `:${f.line}` : "";
    reportLines.push(`  ${tag} ${file}${loc} — ${f.msg}`);
    if (f.level === "error") errCount++;
    else warnCount++;
  }
}

// Write the full report to reports/image-seo.txt
const reportsDir = path.join(ROOT, "reports");
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
const reportPath = path.join(reportsDir, "image-seo.txt");
fs.writeFileSync(
  reportPath,
  `# Image SEO report — generated ${new Date().toISOString()}\n` +
    reportLines.join("\n") +
    `\n\n${errCount} errors, ${warnCount} warnings.\n`
);

// ---- Compact summary to stdout ---------------------------------------
const catCounts = new Map();
for (const f of findings) {
  // bucket by the leading phrase of the message
  const key = f.msg.split(/[ —]/).slice(0, 4).join(" ");
  catCounts.set(key, (catCounts.get(key) || 0) + 1);
}
const topCats = [...catCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

console.log(`[check:image-seo] ${errCount} errors, ${warnCount} warnings.`);
console.log(`[check:image-seo] full report -> ${path.relative(ROOT, reportPath).replace(/\\/g, "/")}`);
if (topCats.length) {
  console.log("[check:image-seo] top issue categories:");
  for (const [cat, n] of topCats) console.log(`   ${String(n).padStart(4)}  ${cat}`);
}

if (VERBOSE) {
  for (const line of reportLines) console.log(line);
}

if (errCount > 0 || (STRICT && warnCount > 0)) {
  process.exit(1);
}
