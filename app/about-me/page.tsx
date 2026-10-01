import Image from "next/image";
import { Metadata } from "next";
import config from "@/config.json";
import Subscribe from "../subscribe";

export const metadata: Metadata = {
  metadataBase: new URL("https://thecodeman.net"),
  title: "About Stefan Djokic - Microsoft MVP & Senior .NET Engineer",
  alternates: {
    canonical: "https://thecodeman.net/about-me",
  },
  description: "Stefan Djokic is a Microsoft MVP and senior .NET engineer who helps 25,000+ developers improve their skills through a weekly newsletter, blog, ebooks, and courses on C#, .NET architecture, and design patterns.",
  openGraph: {
    title: "About Stefan Djokic - Microsoft MVP & Senior .NET Engineer",
    type: "website",
    url: "https://thecodeman.net/about-me",
    description: "Stefan Djokic is a Microsoft MVP and senior .NET engineer who helps 25,000+ developers improve their skills through a weekly newsletter, blog, ebooks, and courses on C#, .NET architecture, and design patterns.",
  },
  twitter: {
    title: "About Stefan Djokic - Microsoft MVP & Senior .NET Engineer",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description:
      "Stefan Djokic is a Microsoft MVP and senior .NET engineer who helps 25,000+ developers improve their skills through a weekly newsletter, blog, ebooks, and courses.",
  },
};

const first = (v: string) => v.split(" ")[0];

const PLACES = [
  { href: "https://www.linkedin.com/in/djokic-stefan/", name: "LinkedIn", note: `${first(config.LinkedinFollowers)} followers · daily .NET posts` },
  { href: "https://www.youtube.com/@thecodeman_", name: "YouTube", note: "Hands-on .NET and AI videos" },
  { href: "https://twitter.com/TheCodeMan__", name: "X / Twitter", note: `${first(config.TwitterFollowers)} followers` },
  { href: "https://github.com/StefanTheCode", name: "GitHub", note: "Source code for posts and ebooks" },
  { href: "https://www.skool.com/thecodeman", name: "Skool community", note: "Free TheCodeMan community" },
  { href: "https://medium.com/@thecodeman", name: "Medium", note: "Articles archive" },
];

export default function Page() {
  return (
    <div className="tcm-home">
      <section className="tcm-container tcm-hero tcm-about">
        <div className="tcm-hero__copy">
          <span className="tcm-badge">About · Microsoft MVP</span>
          <h1>Hi, I&rsquo;m <span className="tcm-accent">Stefan</span>.</h1>
          <p className="tcm-hero__sub">I am a senior software engineer with years of industry experience. I help a large number of developers become better in their daily work through the content I share on social networks, my blog and newsletter.</p>
          <figure className="tcm-card tcm-about__quote">
            <blockquote>&ldquo;Keep it simple and focus on what matters. Don&rsquo;t let yourself be overwhelmed.&rdquo;</blockquote>
            <figcaption>Confucius</figcaption>
          </figure>
          <p className="tcm-lead">My goal is to convey knowledge in a way that is <strong className="tcm-accent">simple</strong>.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/blog" className="tcm-btn tcm-btn--primary">Read the blog</a>
            <a href="/sponsorship" className="tcm-btn tcm-btn--secondary">Work with me</a>
          </div>
        </div>
        <div className="tcm-hero__media">
          <div className="tcm-hero__photo">
            <Image src="/images/stefan-djokic.webp" alt="Stefan Djokic - Microsoft MVP and Senior .NET Engineer" width={900} height={1195} priority sizes="(max-width: 991px) 460px, 480px" />
          </div>
          <span className="tcm-float tcm-float--mvp">Microsoft MVP</span>
        </div>
      </section>

      <section className="tcm-container" aria-label="Audience">
        <div className="tcm-stats">
          <div className="tcm-stat"><div className="tcm-stat__num">{first(config.NewsletterSubCount)}</div><div className="tcm-stat__label">newsletter subscribers</div></div>
          <div className="tcm-stat"><div className="tcm-stat__num">{first(config.LinkedinFollowers)}</div><div className="tcm-stat__label">followers on LinkedIn</div></div>
          <div className="tcm-stat"><div className="tcm-stat__num">{config.OpenRate}</div><div className="tcm-stat__label">average open rate</div></div>
          <div className="tcm-stat"><div className="tcm-stat__num">{Number(config.EbookCopiesNumber).toLocaleString("en-US")}+</div><div className="tcm-stat__label">ebook copies sold</div></div>
        </div>
      </section>

      <section className="tcm-section">
        <div className="tcm-container">
          <div className="tcm-head">
            <div>
              <span className="tcm-eyebrow">Let&rsquo;s stay connected</span>
              <h2 className="tcm-h2">Follow me where you already are.</h2>
            </div>
          </div>
          <div className="tcm-places">
            {PLACES.map((p) => (
              <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className="tcm-card tcm-place">
                <span className="tcm-place__name">{p.name}</span>
                <span className="tcm-text">{p.note}</span>
                <span className="tcm-link">Open <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Subscribe />
    </div>
  );
}
