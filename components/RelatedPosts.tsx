import Link from "next/link";
import Image from "next/image";
import { PostMetadata } from "./PostMetadata";

interface RelatedPostsProps {
  currentSlug: string;
  currentCategory: string;
  allPosts: PostMetadata[];
}

export default function RelatedPosts({ currentSlug, currentCategory, allPosts }: RelatedPostsProps) {
  // Filter same category first, then fill with recent posts
  const sameCategoryPosts = allPosts
    .filter(
      (p) =>
        p.slug !== currentSlug &&
        p.category?.toLowerCase() === currentCategory?.toLowerCase()
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // If not enough same-category posts, fill with recent
  let related = sameCategoryPosts;
  if (related.length < 3) {
    const remaining = allPosts
      .filter(
        (p) =>
          p.slug !== currentSlug &&
          !related.find((r) => r.slug === p.slug)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3 - related.length);
    related = [...related, ...remaining];
  }

  if (related.length === 0) return null;

  return (
    <section className="related-posts">
      <h3 className="related-posts-title">Related Articles</h3>
      <div className="related-posts-grid">
        {related.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`} className="related-post-card">
            <Image
              src={`/images/blog/${post.slug}.png`}
              alt={post.title}
              width={400}
              height={200}
              className="related-post-img"
            />
            <div className="related-post-info">
              <span className="related-post-category">{post.category}</span>
              <h4 className="related-post-title">{post.title}</h4>
              <span className="related-post-date">{post.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
