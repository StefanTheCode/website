import Image from 'next/image'
import config from '@/config.json'
import Subscribe from './subscribe'
import getPostMetadata from '@/components/getPostMetadata'
import { Metadata } from 'next'
import NewsletterForm from '@/components/NewsletterForm'
import FreeMotion from '@/components/free/FreeMotion'
import PostCard, { postMeta } from '@/components/PostCard'
import { AI_COMMUNITY_PATH } from '@/components/aiCommunity'

export const metadata: Metadata = {
  title: { absolute: 'TheCodeMan | .NET, C# & AI for Developers' },
  description: 'Practical C# and .NET tutorials by Microsoft MVP Stefan Djokic. Learn AI coding workflows, MCP and RAG, and explore the AI for .NET Developers community.',
  openGraph: {
    title: 'TheCodeMan | .NET, C# & AI for Developers',
    description: 'Practical .NET tutorials and AI workflows by Stefan Djokic. Explore C#, MCP, RAG and the AI for .NET Developers community.',
    url: 'https://thecodeman.net', type: 'website', images: ['/og-image.webp'],
  },
  twitter: {
    card: 'summary_large_image', title: 'TheCodeMan | .NET, C# & AI for Developers',
    description: 'Practical .NET tutorials and AI workflows by Stefan Djokic. Explore C#, MCP, RAG and the AI for .NET Developers community.',
    images: ['/og-image.webp'],
  },
};


const sortedPostMetadata = getPostMetadata().sort((a, b) => {
  const dateA = new Date(a.date) as unknown as number;
  const dateB = new Date(b.date) as unknown as number;
  return dateB - dateA;
});
const latestPosts = sortedPostMetadata.slice(0, 4);
const latest = latestPosts[0];

const firstToken = (s: string) => s.split(' ')[0];
const subscribers = firstToken(config.NewsletterSubCount);            // "25,000+"
const linkedin = firstToken(config.LinkedinFollowers);                 // "102k+"
const ebookCopies = `${Number(config.EbookCopiesNumber).toLocaleString('en-US')}+`;
const sponsors = config.PreviousSponsors.split(',').map((s) => s.trim()).filter((s) => s && !/^etc/i.test(s));

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
);
const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg>
);
const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" /></svg>
);
const Stars = () => (
  <div className="tcm-stars" role="img" aria-label="5 out of 5 stars"><Star /><Star /><Star /><Star /><Star /></div>
);

export default function Home() {
  return (
    <div className="tcm-home">
      <FreeMotion />

      {/* HERO */}
      <section className="tcm-container tcm-hero" id="home-section">
        <div className="tcm-hero__copy">
          <span className="tcm-badge">Weekly .NET newsletter · Microsoft MVP</span>
          <h1>Become a better <span className="tcm-accent">.NET engineer</span>, one tip a week.</h1>
          <p className="tcm-hero__sub">Practical C#, architecture and AI skills for your next .NET project - in a 5-minute read every Monday.</p>
          <NewsletterForm variant="inline" buttonText={`Join ${subscribers} engineers`} />
          <ul className="tcm-checks">
            <li><Check />One practical tip every Monday</li>
            <li><Check />Real code, real architecture</li>
            <li><Check />Free, unsubscribe anytime</li>
          </ul>
          <div className="tcm-proof">
            <div className="tcm-proof__faces" aria-hidden="true">
              <Image src="/images/testimonials/testimonial3.jpg" alt="" width={36} height={36} />
              <Image src="/images/testimonials/testimonial2.jpg" alt="" width={36} height={36} />
              <span>25k</span>
            </div>
            <p>Read by engineers, architects and fellow <strong>Microsoft MVPs</strong></p>
          </div>
          <div className="senja-embed" data-id="ea80a7ca-913b-44b0-be8f-ff917bc894e0" data-lazyload="false" style={{ minHeight: 40 }}></div>
          <div dangerouslySetInnerHTML={{ __html: '<script type="text/lazy" data-src="https://static.senja.io/dist/platform.js"></script>' }} />
        </div>

        <div className="tcm-hero__media">
          <div className="tcm-hero__photo">
            <Image src="/images/stefan-djokic.webp" alt="Stefan Đokić, Microsoft MVP, at the Microsoft campus" width={900} height={1195} priority sizes="(max-width: 991px) 460px, 480px" />
          </div>
          {latest ? (
            <a className="tcm-float tcm-float--issue" href={`/posts/${latest.slug}`}>
              <span className="tcm-eyebrow">Latest issue</span>
              <span className="tcm-float__title">{latest.title}</span>
              <span className="tcm-float__meta">{postMeta(latest)}</span>
            </a>
          ) : null}
          <span className="tcm-float tcm-float--mvp">Microsoft MVP</span>
        </div>
      </section>

      {/* STATS + SPONSORS */}
      <section className="tcm-container" aria-label="Audience">
        <div className="tcm-stats">
          <div className="tcm-stat"><div className="tcm-stat__num">{subscribers}</div><div className="tcm-stat__label">newsletter subscribers</div></div>
          <div className="tcm-stat"><div className="tcm-stat__num">{config.OpenRate}</div><div className="tcm-stat__label">average open rate</div></div>
          <div className="tcm-stat"><div className="tcm-stat__num">{linkedin}</div><div className="tcm-stat__label">followers on LinkedIn</div></div>
          <div className="tcm-stat"><div className="tcm-stat__num">{ebookCopies}</div><div className="tcm-stat__label">ebook copies sold</div></div>
        </div>
        <div className="tcm-sponsors">
          <span className="tcm-eyebrow">Sponsored by</span>
          {sponsors.map((s) => <span key={s}>{s}</span>)}
        </div>
      </section>

      {/* HOW I CAN HELP - BENTO */}
      <section className="tcm-section" id="blog-section">
        <div className="tcm-container">
          <div className="tcm-head" data-reveal>
            <div>
              <span className="tcm-eyebrow">How I can help</span>
              <h2 className="tcm-h2">Everything you need to grow as a .NET engineer.</h2>
            </div>
            <p className="tcm-lead" style={{ maxWidth: 360 }}>Courses, ebooks and a community built from 10+ years of shipping .NET in production.</p>
          </div>

          <div className="tcm-bento">
            <a href={AI_COMMUNITY_PATH} className="tcm-card tcm-card--featured tcm-bento__community" data-cta="ai-community-home" data-reveal>
              <Image src="/images/ai-for-dotnet-developers.webp" alt="AI for .NET Developers community" width={1084} height={576} sizes="(max-width: 1100px) 100vw, 700px" />
              <div className="tcm-card__body">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="tcm-chip tcm-chip--accent">Community</span>
                  <span className="tcm-chip tcm-chip--outline">7-day free trial</span>
                </div>
                <h3 className="tcm-h3">AI for .NET Developers</h3>
                <p>Use AI on your codebase and build AI into your apps. 50+ Claude skills and agents, practical lessons, and direct access to me.</p>
                <span className="tcm-link">Join the community <Arrow /></span>
              </div>
            </a>

            <a href="/pragmatic-dotnet-code-rules" className="tcm-card tcm-bento__product" data-reveal data-delay="1">
              <div className="tcm-card__body">
                <span className="tcm-eyebrow">Course · Presale -50%</span>
                <h3 className="tcm-h3">Pragmatic .NET Code Rules</h3>
                <p className="tcm-text">Make your codebase enforce itself: .editorconfig, analyzers, CI quality gates.</p>
                <span className="tcm-price">$74.89 <s>$149</s></span>
              </div>
              <Image src="/images/course-hero.webp" alt="Pragmatic .NET Code Rules course" width={1152} height={928} sizes="140px" />
            </a>

            <a href="/design-patterns-that-deliver-ebook" className="tcm-card tcm-bento__product" data-reveal data-delay="2">
              <div className="tcm-card__body">
                <span className="tcm-eyebrow">Ebook · {ebookCopies} copies</span>
                <h3 className="tcm-h3">Design Patterns That Deliver</h3>
                <p className="tcm-text">10 production-grade C# patterns, 20 mini-projects, 100 interview Q&amp;As and an AI tutor.</p>
                <span className="tcm-price">$32.99</span>
              </div>
              <Image src="/images/ebook2.webp" alt="Design Patterns That Deliver ebook" width={1500} height={1383} sizes="140px" />
            </a>

            <div className="tcm-card tcm-bento__small" data-reveal>
              <span className="tcm-icon tcm-icon--good">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 12v9H4v-9" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>
              </span>
              <h3 className="tcm-h3">Free resources</h3>
              <ul className="tcm-linklist">
                <li><a href="/dotnet-roadmap-2026">.NET Roadmap 2026 <span>→</span></a></li>
                <li><a href="/ai-roadmap-2026">AI Roadmap for .NET 2026 <span>→</span></a></li>
                <li><a href="/dotnet-code-rules-starter-kit">Code Rules Starter Kit <span>→</span></a></li>
                <li><a href="/pass-your-interview">Pass Your .NET Interview <span>→</span></a></li>
              </ul>
            </div>

            <div className="tcm-card tcm-bento__small" data-reveal data-delay="1">
              <span className="tcm-icon tcm-icon--purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m8 9-4 3 4 3" /><path d="m16 9 4 3-4 3" /><path d="m13.5 5-3 14" /></svg>
              </span>
              <h3 className="tcm-h3">Free AI tools</h3>
              <ul className="tcm-linklist">
                <li><a href="/tools/pattern-picker">Pattern Picker <span>→</span></a></li>
                <li><a href="/tools/pattern-comparison">Pattern Comparison <span>→</span></a></li>
                <li><a href="/tools/interview-quiz">Interview Quiz <span>→</span></a></li>
                <li><a href="/playground">C# Playground <span>→</span></a></li>
              </ul>
            </div>

            <a href="/sponsorship" className="tcm-card tcm-bento__small" data-reveal data-delay="2">
              <span className="tcm-icon tcm-icon--accent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
              </span>
              <h3 className="tcm-h3">Sponsor the newsletter</h3>
              <p className="tcm-text">Put your product in front of {subscribers} .NET engineers, architects and CTOs.</p>
              <span className="tcm-link">See sponsorship options <Arrow /></span>
            </a>
          </div>
        </div>
      </section>

      {/* LATEST ARTICLES */}
      <section className="tcm-section">
        <div className="tcm-container">
          <div className="tcm-head" data-reveal>
            <div>
              <span className="tcm-eyebrow">From the blog</span>
              <h2 className="tcm-h2">Latest articles</h2>
            </div>
            <a href="/blog" className="tcm-btn tcm-btn--secondary">View all articles <Arrow /></a>
          </div>
          <div className="tcm-posts">
            {latestPosts.map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="tcm-section">
        <div className="tcm-container">
          <div className="tcm-head tcm-head--center" data-reveal>
            <div>
              <span className="tcm-eyebrow">What engineers say</span>
              <h2 className="tcm-h2">Trusted by fellow Microsoft MVPs</h2>
            </div>
          </div>
          <div className="tcm-quotes">
            <figure className="tcm-card tcm-quote" data-reveal>
              <Stars />
              <blockquote>&ldquo;A quick and enjoyable read about the most important design patterns in C#. The examples were refreshing, and I especially liked being able to access the source code.&rdquo;</blockquote>
              <figcaption>
                <Image src="/images/testimonials/testimonial3.jpg" alt="" width={48} height={48} />
                <span><b>Milan Jovanović</b><span>Microsoft MVP · Creator of Pragmatic Clean Architecture</span></span>
              </figcaption>
            </figure>
            <figure className="tcm-card tcm-quote" data-reveal data-delay="1">
              <Stars />
              <blockquote>&ldquo;This is the most in-depth course on .NET quality that I have ever seen. I highly recommend it - it will increase your code quality, cut review time, and reduce bugs.&rdquo;</blockquote>
              <figcaption>
                <Image src="/images/testimonials/testimonial2.jpg" alt="" width={48} height={48} />
                <span><b>Anton Martyniuk</b><span>Microsoft MVP · .NET Software Architect</span></span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <Subscribe />
    </div>
  )
}
