import { PostMetadata } from "./PostMetadata";
import PostCard from "./PostCard";

interface RelatedPostsProps {
  currentSlug: string;
  currentCategory: string;
  allPosts: PostMetadata[];
}

export default function RelatedPosts({ currentSlug, currentCategory, allPosts }: RelatedPostsProps) {
  // Same category first, then fill with the most recent posts.
  const byDate = (a: PostMetadata, b: PostMetadata) => new Date(b.date).getTime() - new Date(a.date).getTime();
  let related = allPosts
    .filter((p) => p.slug !== currentSlug && p.category?.toLowerCase() === currentCategory?.toLowerCase())
    .sort(byDate)
    .slice(0, 3);

  if (related.length < 3) {
    const remaining = allPosts
      .filter((p) => p.slug !== currentSlug && !related.find((r) => r.slug === p.slug))
      .sort(byDate)
      .slice(0, 3 - related.length);
    related = [...related, ...remaining];
  }

  if (related.length === 0) return null;

  return (
    <section className="tcm-related" aria-labelledby="related-title">
      <span className="tcm-eyebrow">Keep reading</span>
      <h2 id="related-title" className="tcm-h2 tcm-related__title">Related articles</h2>
      <div className="tcm-posts tcm-posts--3">
        {related.map((post) => <PostCard key={post.slug} post={post} />)}
      </div>
    </section>
  );
}
