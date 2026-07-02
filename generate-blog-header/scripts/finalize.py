#!/usr/bin/env python3
"""
finalize.py — Step 3 helper for the generate-blog-header skill.

Downloads the image Higgsfield produced, normalizes it to the blog-header format
(2000x1500, 4:3, .webp) and saves it as public/images/blog/<slug>.webp.

Higgsfield returns a result image URL (from the generate_image result / show_generations
result). Pass that URL here. The image is the user's own generated asset, so downloading
it is part of the intended workflow.

Usage:
  python finalize.py --url "<higgsfield_result_url>" --slug builder-pattern-in-dotnet --repo /path/to/website
  python finalize.py --in /tmp/raw.png --slug builder-pattern-in-dotnet --repo /path/to/website
"""
import argparse
import os
import sys
import urllib.request

from PIL import Image

TARGET_W, TARGET_H = 2000, 1500  # 4:3, matches existing headers


def fetch(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
        f.write(r.read())


def normalize(src_path, out_path):
    im = Image.open(src_path).convert("RGB")
    w, h = im.size
    target_ratio = TARGET_W / TARGET_H
    ratio = w / h
    # center-crop to 4:3 then resize
    if ratio > target_ratio:
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        im = im.crop((left, 0, left + new_w, h))
    elif ratio < target_ratio:
        new_h = int(w / target_ratio)
        top = (h - new_h) // 2
        im = im.crop((0, top, w, top + new_h))
    im = im.resize((TARGET_W, TARGET_H), Image.LANCZOS)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    im.save(out_path, "WEBP", quality=88, method=6)
    return out_path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", help="Higgsfield result image URL")
    ap.add_argument("--in", dest="infile", help="Local input image instead of URL")
    ap.add_argument("--slug", required=True, help="Output filename = <slug>.webp")
    ap.add_argument("--repo", default=os.environ.get("WEBSITE_REPO", ""), help="Website repo root")
    args = ap.parse_args()

    if not args.repo:
        print("ERROR: provide --repo or set WEBSITE_REPO", file=sys.stderr)
        sys.exit(2)

    tmp = args.infile
    if args.url:
        tmp = f"/tmp/{args.slug}_raw"
        fetch(args.url, tmp)
    if not tmp or not os.path.isfile(tmp):
        print("ERROR: no input (pass --url or --in)", file=sys.stderr)
        sys.exit(2)

    out_path = os.path.join(args.repo, "public", "images", "blog", f"{args.slug}.webp")
    normalize(tmp, out_path)
    print(f"Saved: {out_path}")


if __name__ == "__main__":
    main()
