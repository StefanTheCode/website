import Link from "next/link";
import { PostMetadata } from "./PostMetadata";

interface PostNavigationProps {
  currentSlug: string;
  allPosts: PostMetadata[];
}

export default function PostNavigation({ currentSlug, allPosts }: PostNavigationProps) {
  const sorted = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const currentIndex = sorted.findIndex((p) => p.slug === currentSlug);
  if (currentIndex === -1) return null;

  const newerPost = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const olderPost = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  if (!newerPost && !olderPost) return null;

  return (
    <nav className="post-navigation" aria-label="Post navigation">
      <div className="post-nav-inner">
        {olderPost ? (
          <Link href={`/posts/${olderPost.slug}`} className="post-nav-link post-nav-prev">
            <span className="post-nav-label">← Previous</span>
            <span className="post-nav-title">{olderPost.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {newerPost ? (
          <Link href={`/posts/${newerPost.slug}`} className="post-nav-link post-nav-next">
            <span className="post-nav-label">Next →</span>
            <span className="post-nav-title">{newerPost.title}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
