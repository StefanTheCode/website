import { Metadata } from 'next';
import getPostMetadata from '@/components/getPostMetadata';
import AiCommunityPromo from '@/components/AiCommunityPromo';
import { aiLearningPaths } from '@/components/aiCommunity';
import BlogClient from './blogClient';
import Subscribe from '../subscribe';
import { Suspense } from 'react';
import Link from 'next/link';

const title = 'C# & .NET Blog: AI, MCP, RAG and Software Architecture';
const description = 'Practical C# and .NET tutorials by Stefan Djokic: Claude Code, MCP servers, RAG, AI agents, ASP.NET Core and software architecture with real code examples.';
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: 'https://thecodeman.net/blog' },
  openGraph: { title, description, type: 'website', url: 'https://thecodeman.net/blog', images: ['/og-image.webp'] },
  twitter: { title, description, card: 'summary_large_image', images: ['/og-image.webp'] },
};

export default function BlogPage() {
  const posts = getPostMetadata();
  const sortedPosts = [...posts].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return <>
    <section className="tcm-container tcm-blog-intro">
      <span className="tcm-eyebrow">The blog</span>
      <h1 className="tcm-blog-intro__title">C#, .NET and AI: practical developer guides</h1>
      <p className="tcm-lead">Learn with real code examples from Microsoft MVP Stefan Djokic. Explore AI workflows, ASP.NET Core, architecture, performance and testing.</p>
    </section>
    <section className="tcm-container tcm-blog-paths">
      <AiCommunityPromo />
      <nav aria-label="AI and .NET learning paths" className="tcm-paths">
        {aiLearningPaths.map(path => <div key={path.id} className="tcm-card">
          <span className="tcm-eyebrow">{path.label}</span>
          <h2 className="tcm-h3">{path.title}</h2>
          <ul className="tcm-linklist">{path.articles.map(article => <li key={article.slug}><Link href={`/posts/${article.slug}`}>{article.title} <span>→</span></Link></li>)}</ul>
        </div>)}
      </nav>
    </section>
    <Suspense fallback={<p className="tcm-container">Loading article filters. Browse all articles below.</p>}>
      <BlogClient allPosts={posts} />
    </Suspense>
    <section className="tcm-container tcm-blog-all">
      <details>
        <summary>Browse all {sortedPosts.length} articles by date</summary>
        <nav aria-label="All blog posts"><ul>{sortedPosts.map(p => <li key={p.slug}><Link href={`/posts/${p.slug}`}>{p.title}</Link></li>)}</ul></nav>
      </details>
    </section>
    <Subscribe />
  </>;
}
