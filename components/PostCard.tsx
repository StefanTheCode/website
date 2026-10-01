import Image from 'next/image'
import { PostMetadata } from './PostMetadata'

/** "Sep 28 2026" -> "Sep 28, 2026" (falls back to the raw value). */
export function formatPostDate(date?: string): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** "Read Time: 10 minutes" -> "10 min read". */
export function formatReadTime(readTime?: string): string {
  if (!readTime) return ''
  const m = readTime.match(/(\d+)/)
  return m ? `${m[1]} min read` : readTime
}

export function postMeta(post: Pick<PostMetadata, 'date' | 'readTime'>): string {
  return [formatPostDate(post.date), formatReadTime(post.readTime)].filter(Boolean).join(' · ')
}

export default function PostCard({ post, priority = false, headingLevel = 3 }: { post: PostMetadata; priority?: boolean; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <a href={`/posts/${post.slug}`} className="tcm-card tcm-post">
      <div className="tcm-post__img">
        <Image src={post.photo} alt="" width={640} height={480} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 300px" priority={priority} />
      </div>
      <div className="tcm-post__body">
        {post.category ? <span className="tcm-chip tcm-chip--purple">{post.category}</span> : null}
        <Heading className="tcm-post__title">{post.title}</Heading>
        <span className="tcm-meta">{postMeta(post)}</span>
      </div>
    </a>
  )
}
