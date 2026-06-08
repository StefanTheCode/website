import Image, { type ImageProps } from "next/image";

/**
 * BlogImage
 * ---------
 * Reusable image wrapper for blog posts and content pages. Enforces the
 * minimum set of attributes we want on every content image so we never ship
 * a layout-shifting / alt-less image again.
 *
 * Required:
 *   - src    absolute /images/... path or full URL
 *   - alt    descriptive alt text (use "" only for truly decorative images
 *            and pair with `decorative`)
 *   - width  intrinsic image width in pixels
 *   - height intrinsic image height in pixels
 *
 * Optional:
 *   - caption   visible <figcaption>; if omitted, no caption is rendered
 *   - priority  set true ONLY for above-the-fold hero images
 *   - sizes     responsive `sizes` attribute; defaults to a sensible value
 *               for typical article-width images
 *   - decorative when true, alt MUST be "" and the figure is aria-hidden
 *
 * The component renders inside a <figure> only when a caption is provided,
 * so it composes cleanly with existing markdown-rendered post bodies.
 */
export type BlogImageProps = Omit<ImageProps, "alt" | "src" | "width" | "height"> & {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  decorative?: boolean;
};

export default function BlogImage({
  src,
  alt,
  width,
  height,
  caption,
  decorative = false,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 720px",
  loading,
  ...rest
}: BlogImageProps) {
  if (decorative && alt !== "") {
    // Loud failure in dev; React will surface this in the console.
    // We don't throw in prod to avoid taking the page down for a content bug.
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        `<BlogImage decorative> must have alt="" — got "${alt}" for ${src}`
      );
    }
  }

  const img = (
    <Image
      src={src}
      alt={decorative ? "" : alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      loading={loading ?? (priority ? undefined : "lazy")}
      aria-hidden={decorative || undefined}
      {...rest}
    />
  );

  if (!caption) return img;

  return (
    <figure className="blog-image">
      {img}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
