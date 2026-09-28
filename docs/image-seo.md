# Image SEO playbook

Everything in this repo should respect the rules below. They're enforced by
`npm run check:image-seo` and the build-time script
`npm run optimize:images`.

## 1. File names

- All content image filenames are **lowercase kebab-case**:
  `dotnet-api-versioning-sunset-header.webp`, not `IMG_9283.jpg` or
  `Sunset Header.PNG`.
- Blog hero images live at `public/images/blog/<slug>.(png|webp)` and **must
  match the post slug exactly** — `getPostMetadata.ts` derives the cover
  URL from the slug.
- Per-post body images live at `public/images/blog/posts/<slug>/<name>.png`.
- Never commit names like `screenshot.png`, `image1.png`, `untitled.png`,
  `a.png`, `copy of …`. The linter will flag them.
- **Renaming an existing image changes its public URL.** Only do it if you
  also (a) update every reference in `app/`, `components/`, `posts/`,
  `patterns/`, and (b) add a redirect in `netlify.toml` for the old URL.

## 2. Alt text

- Every `<img>`, `<Image>`, and markdown `![alt](src)` must have alt text
  that describes what is visible. Keep it natural — Google penalises
  keyword stuffing.
- Bad: `alt="seo"`, `alt="screenshot"`, `alt="image"`, `alt="img1"`.
- Good: `alt="ASP.NET Core API response with Sunset and Deprecation headers"`.
- Decorative images (icons used purely visually next to text) use
  `alt=""` so screen readers skip them. Use `<BlogImage decorative />`.
- Don't reuse the same alt for unrelated images in the same article.

## 3. Format & compression

- Convert raster originals to **WebP** with quality 75–85 (default 80).
- Keep transparency where present — the optimizer raises alpha quality
  automatically.
- Leave SVG and GIF alone.
- Don't upscale. The optimizer encodes at the original pixel dimensions.
- Keep the `.png` original alongside the `.webp` until every reference is
  updated. The optimizer enforces this.

## 4. Components

For any new image in JSX, prefer:

```tsx
import BlogImage from "@/components/BlogImage";

<BlogImage
  src="/images/blog/posts/my-slug/header.webp"
  alt="ASP.NET Core API response with Sunset and Deprecation headers"
  width={1280}
  height={720}
  caption="Sunset and Deprecation headers in the response."
/>
```

Rules:
- `width` and `height` are **required** to prevent CLS.
- Set `priority` only on the single above-the-fold hero image of a page.
- Omit `priority` everywhere else so images stay lazy-loaded.
- For purely visual decoration, pass `decorative` and `alt=""`.

## 5. Scripts

```bash
# Audit only — no files touched.
npm run optimize:images

# Produce .webp siblings next to every raster (originals preserved).
npm run optimize:images -- --write

# Same, and update markdown/JSX references from .png → .webp.
npm run optimize:images -- --write --rewrite-refs

# Same, and finally delete the original raster when every reference is
# confirmed updated. Refuses to delete if any reference still resolves
# to the original.
npm run optimize:images -- --write --rewrite-refs --delete-originals

# Lint image SEO. Use --strict in CI to fail on warnings.
npm run check:image-seo
npm run check:image-seo -- --strict
```

The optimizer needs `sharp`:

```bash
npm i -D sharp
```

It runs in dry-run mode without sharp so you can still produce a report.

## 6. Workflow when adding a new blog post

1. Save the hero image as `public/images/blog/<slug>.png` (1200×630 ideal).
2. Save body images in `public/images/blog/posts/<slug>/<name>.png` with
   descriptive kebab-case names.
3. Reference them in the markdown with descriptive alt text.
4. Run `npm run check:image-seo`.
5. Run `npm run optimize:images -- --write` before publishing.
