#!/usr/bin/env node
/**
 * scripts/optimize-images.mjs
 *
 * Production-safe image optimization for thecodeman.net.
 *
 * What it does:
 *   - Scans public/ for raster images (.png, .jpg, .jpeg).
 *   - In dry-run (default), prints a size + savings report only.
 *   - With --write, emits an optimized .webp next to each original
 *     (NEVER deletes anything unless --delete-originals is also passed).
 *   - With --rewrite-refs, updates .md / .tsx / .jsx / .ts references from
 *     .png|.jpg|.jpeg to .webp (only for files that actually got a .webp
 *     produced in this run).
 *   - With --delete-originals (requires --write AND --rewrite-refs and a
 *     successful run), removes the original raster file after the .webp
 *     and the rewritten references are confirmed.
 *
 * Safety:
 *   - Idempotent: re-running without --write is read-only.
 *   - Skips SVG and GIF.
 *   - Skips originals smaller than --min-bytes (default 20kB) since the
 *     WebP overhead often wipes out the gain on tiny icons.
 *   - Will not upscale; only re-encodes at the original pixel dimensions.
 *   - Skips when an up-to-date .webp already exists (mtime check) unless
 *     --force is set.
 *   - Refuses to delete originals unless every reference was rewritten.
 *
 * Usage:
 *   node scripts/optimize-images.mjs                 # audit / dry run
 *   node scripts/optimize-images.mjs --write         # produce .webp siblings
 *   node scripts/optimize-images.mjs --write --rewrite-refs
 *   node scripts/optimize-images.mjs --write --rewrite-refs --delete-originals
 *
 * Requires `sharp` for any encoding work; the audit (dry run) works without it.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");

const args = new Set(process.argv.slice(2));
const flag = (name) => args.has(name);
const numFlag = (name, def) => {
  const found = [...args].find((a) => a.startsWith(`${name}=`));
  if (!found) return def;
  const n = Number(found.split("=")[1]);
  return Number.isFinite(n) ? n : def;
};

const WRITE = flag("--write");
const REWRITE_REFS = flag("--rewrite-refs");
const DELETE_ORIGINALS = flag("--delete-originals");
const FORCE = flag("--force");
const VERBOSE = flag("--verbose");
const QUALITY = numFlag("--quality", 80);
const MIN_BYTES = numFlag("--min-bytes", 20 * 1024);
// Skip files larger than this to avoid OOM on huge PNGs (some files in this
// repo are 10+ MB). Override with --max-input-mb=NN if you really need to
// re-encode them on a beefier machine.
const MAX_INPUT_MB = numFlag("--max-input-mb", 8);

if (DELETE_ORIGINALS && !(WRITE && REWRITE_REFS)) {
  console.error(
    "[optimize-images] --delete-originals requires both --write and --rewrite-refs."
  );
  process.exit(2);
}

const RASTER_EXT = new Set([".png", ".jpg", ".jpeg"]);
const SCAN_DIRS = ["public"].map((d) => path.join(ROOT, d));
const REF_DIRS = ["app", "components", "posts", "patterns"].map((d) =>
  path.join(ROOT, d)
);
const REF_EXT = new Set([".md", ".mdx", ".tsx", ".jsx", ".ts", ".js"]);

/** Recursively walk a directory, returning absolute file paths. */
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const allImages = SCAN_DIRS.flatMap((d) => walk(d)).filter((p) =>
  RASTER_EXT.has(path.extname(p).toLowerCase())
);

// Try to load sharp lazily — only required when --write is set.
let sharp = null;
async function loadSharp() {
  if (sharp) return sharp;
  try {
    ({ default: sharp } = await import("sharp"));
    // Single-threaded decode keeps memory bounded on the 5-12 MB PNGs in
    // public/images/. Without this, parallel decodes can spike to several
    // GB and freeze the editor.
    try { sharp.concurrency(1); } catch {}
    try { sharp.cache(false); } catch {}
    return sharp;
  } catch {
    return null;
  }
}

/** Format byte count for console output. */
const fmt = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const report = {
  scanned: 0,
  candidates: 0,
  skippedSmall: 0,
  skippedExisting: 0,
  converted: 0,
  failed: 0,
  bytesBefore: 0,
  bytesAfter: 0,
  produced: [], // { original, webp, before, after }
  warnings: [],
};

async function optimizeOne(absPath) {
  report.scanned++;
  const stat = fs.statSync(absPath);
  if (stat.size < MIN_BYTES) {
    report.skippedSmall++;
    return;
  }
  if (stat.size > MAX_INPUT_MB * 1024 * 1024) {
    report.warnings.push(
      `[skip-large] ${path.relative(ROOT, absPath)} is ${fmt(stat.size)} (> ${MAX_INPUT_MB} MB) — re-export at lower resolution or run with --max-input-mb=NN`
    );
    return;
  }
  report.candidates++;

  const webpPath = absPath.replace(/\.(png|jpe?g)$/i, ".webp");
  const exists = fs.existsSync(webpPath);
  if (exists && !FORCE) {
    const wstat = fs.statSync(webpPath);
    if (wstat.mtimeMs >= stat.mtimeMs) {
      report.skippedExisting++;
      // Still count for byte savings reporting.
      report.bytesBefore += stat.size;
      report.bytesAfter += wstat.size;
      // Record as eligible for ref-rewrite / delete-originals on later runs
      // so the workflow is idempotent: first run encodes, second run rewrites,
      // third run deletes.
      report.produced.push({
        original: absPath,
        webp: webpPath,
        before: stat.size,
        after: wstat.size,
        preExisting: true,
      });
      return;
    }
  }

  if (!WRITE) {
    // Dry-run: estimate using just the input size — we cannot know the WebP
    // size without encoding. Surface the original size; the savings figure
    // is only shown for files we actually encoded.
    report.bytesBefore += stat.size;
    return;
  }

  const lib = await loadSharp();
  if (!lib) {
    report.failed++;
    report.warnings.push(
      `[skip] ${path.relative(ROOT, absPath)} — sharp is not installed. Run: npm i -D sharp`
    );
    return;
  }

  try {
    const img = lib(absPath, { failOn: "none" });
    const meta = await img.metadata();
    const hasAlpha = meta.hasAlpha === true;
    await img
      .webp({
        quality: QUALITY,
        alphaQuality: hasAlpha ? Math.max(QUALITY, 90) : undefined,
        effort: 5,
      })
      .toFile(webpPath);
    const after = fs.statSync(webpPath).size;
    report.converted++;
    report.bytesBefore += stat.size;
    report.bytesAfter += after;
    report.produced.push({
      original: absPath,
      webp: webpPath,
      before: stat.size,
      after,
    });
  } catch (e) {
    report.failed++;
    report.warnings.push(
      `[fail] ${path.relative(ROOT, absPath)} — ${e.message}`
    );
  }
}

/** Update markdown/JSX references to point at .webp for files we produced. */
function rewriteReferences(producedMap) {
  if (!REWRITE_REFS || producedMap.size === 0) return { filesChanged: 0, refsChanged: 0 };

  let filesChanged = 0;
  let refsChanged = 0;

  const files = REF_DIRS.flatMap((d) => walk(d)).filter((p) =>
    REF_EXT.has(path.extname(p).toLowerCase())
  );

  for (const file of files) {
    let src = fs.readFileSync(file, "utf8");
    let changed = false;
    for (const [publicRel] of producedMap) {
      // publicRel looks like "/images/blog/foo.png" — match exactly (no query
      // or hash on this static site).
      const png = publicRel;
      const webp = publicRel.replace(/\.(png|jpe?g)$/i, ".webp");
      if (src.includes(png)) {
        const re = new RegExp(
          png.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "g"
        );
        const next = src.replace(re, webp);
        if (next !== src) {
          const count = (src.match(re) || []).length;
          refsChanged += count;
          src = next;
          changed = true;
        }
      }
    }
    if (changed) {
      fs.writeFileSync(file, src);
      filesChanged++;
    }
  }

  return { filesChanged, refsChanged };
}

/** Confirm a public-path appears nowhere in the codebase before deleting it. */
function isReferencedAnywhere(publicRel) {
  const files = REF_DIRS.flatMap((d) => walk(d)).filter((p) =>
    REF_EXT.has(path.extname(p).toLowerCase())
  );
  for (const f of files) {
    const txt = fs.readFileSync(f, "utf8");
    if (txt.includes(publicRel)) return f;
  }
  return null;
}

(async () => {
  console.log(
    `[optimize-images] ${WRITE ? "WRITE" : "DRY-RUN"} mode, quality=${QUALITY}, min-bytes=${MIN_BYTES}`
  );
  console.log(`[optimize-images] scanning ${allImages.length} raster files...`);

  for (const img of allImages) {
    await optimizeOne(img);
  }

  // Build a map of producedRel -> { original, webp } for ref rewriting.
  const publicDir = path.join(ROOT, "public");
  const producedMap = new Map();
  for (const p of report.produced) {
    if (p.original.startsWith(publicDir)) {
      const rel = "/" + path.relative(publicDir, p.original).replace(/\\/g, "/");
      producedMap.set(rel, p);
    }
  }

  let refSummary = { filesChanged: 0, refsChanged: 0 };
  if (WRITE && REWRITE_REFS) {
    refSummary = rewriteReferences(producedMap);
  }

  let deleted = 0;
  let deletionSkipped = 0;
  if (WRITE && REWRITE_REFS && DELETE_ORIGINALS) {
    for (const [rel, p] of producedMap) {
      const stillReferenced = isReferencedAnywhere(rel);
      if (stillReferenced) {
        deletionSkipped++;
        report.warnings.push(
          `[keep-original] ${rel} is still referenced in ${path.relative(
            ROOT,
            stillReferenced
          )}`
        );
        continue;
      }
      try {
        fs.unlinkSync(p.original);
        deleted++;
      } catch (e) {
        report.warnings.push(`[delete-fail] ${rel} — ${e.message}`);
      }
    }
  }

  // ---- Print report -----------------------------------------------------
  const saved = Math.max(0, report.bytesBefore - report.bytesAfter);
  const pct =
    report.bytesBefore > 0
      ? ((saved / report.bytesBefore) * 100).toFixed(1)
      : "0.0";

  const summary = [];
  const push = (line) => summary.push(line);
  push("===== Image optimization report =====");
  push(`Mode:                        ${WRITE ? "WRITE" : "DRY-RUN"}`);
  push(`Scanned raster files:        ${report.scanned}`);
  push(`Eligible candidates:         ${report.candidates}`);
  push(`Skipped (< ${fmt(MIN_BYTES)}):       ${report.skippedSmall}`);
  push(`Skipped (.webp up to date):  ${report.skippedExisting}`);
  push(`Converted to .webp:          ${report.converted}`);
  push(`Failed:                      ${report.failed}`);
  push(`Bytes before:                ${fmt(report.bytesBefore)}`);
  push(`Bytes after:                 ${fmt(report.bytesAfter)}`);
  push(`Estimated saved:             ${fmt(saved)} (${pct}%)`);
  if (WRITE && REWRITE_REFS) {
    push(`References rewritten:        ${refSummary.refsChanged} in ${refSummary.filesChanged} files`);
  }
  if (DELETE_ORIGINALS) {
    push(`Originals deleted:           ${deleted}`);
    push(`Originals kept (still ref'd):${deletionSkipped}`);
  }

  // Full warnings list -> file; only count to stdout to avoid flooding the
  // VS Code terminal on a project with hundreds of images.
  const reportsDir = path.join(ROOT, "reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, "optimize-images.txt");
  fs.writeFileSync(
    reportPath,
    `# Image optimization report — generated ${new Date().toISOString()}\n` +
      summary.join("\n") +
      `\n\nWarnings (${report.warnings.length}):\n` +
      report.warnings.map((w) => "  " + w).join("\n") +
      "\n"
  );

  for (const line of summary) console.log(line);
  console.log(`Warnings:                    ${report.warnings.length} (see reports/optimize-images.txt)`);

  if (VERBOSE && report.warnings.length) {
    console.log("");
    console.log("Warnings:");
    for (const w of report.warnings) console.log("  " + w);
  }

  if (!WRITE) {
    console.log("");
    console.log(
      "[optimize-images] Dry run only. Re-run with --write to produce .webp files."
    );
  }
})();
