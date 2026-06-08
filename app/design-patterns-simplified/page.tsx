import config from '@/config.json'
import EbookReviews from '@/components/ebookReviews';
import { Metadata } from 'next';
import Image from 'next/image'
import Script from 'next/script';
import './ebook.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: "Design Patterns Simplified — 10 Essential C# Patterns for Beginners",
  alternates: {
    canonical: 'https://thecodeman.net/design-patterns-simplified',
  },
  description: "Master 10 essential design patterns the simple way. A short, affordable, beginner-friendly C# ebook with real-world examples and a free GitHub repository — no 500-page theory.",
  keywords: [
    'design patterns simplified',
    'design patterns for beginners',
    'c# design patterns',
    'design patterns book c#',
    'adapter pattern c#',
    'builder pattern c#',
    'singleton pattern c#',
    'strategy pattern c#',
    'observer pattern c#',
    'factory method c#',
    'gang of four patterns',
    'design patterns examples',
    'learn design patterns',
    'affordable design patterns ebook',
    '.NET design patterns',
  ],
  openGraph: {
    title: "Design Patterns Simplified — 10 Essential C# Patterns for Beginners",
    type: "website",
    url: "https://thecodeman.net/design-patterns-simplified",
    description: "Master 10 essential design patterns the simple way. A short, affordable, beginner-friendly C# ebook with real-world examples and a free GitHub repository.",
    images: [
      {
        url: 'https://thecodeman.net/og-ebookimage.webp',
        width: "1000px",
        height: "700px"
      }
    ],
  },
  twitter: {
    title: "Design Patterns Simplified — 10 Essential C# Patterns for Beginners",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "Master 10 essential design patterns the simple way. A short, affordable, beginner-friendly C# ebook with real-world examples and a free GitHub repository.",
    images: [
      {
        url: 'https://thecodeman.net/og-ebookimage.webp',
        width: "1000px",
        height: "700px"
      }
    ]
  }
}

const CHECKOUT_URL = 'https://stefandjokic.lemonsqueezy.com/checkout/buy/d71f1003-7b56-4b96-8136-1d769f53eb79';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://thecodeman.net/design-patterns-simplified',
      url: 'https://thecodeman.net/design-patterns-simplified',
      name: 'Design Patterns Simplified — 10 Essential C# Patterns for Beginners',
      description:
        'A short, affordable, beginner-friendly C# ebook that explains 10 essential design patterns with real-world examples and a free GitHub repository.',
      isPartOf: { '@id': 'https://thecodeman.net/#website' },
      about: {
        '@type': 'Thing',
        name: 'C# Design Patterns',
      },
      author: {
        '@type': 'Person',
        name: 'Stefan Djokic',
        url: 'https://thecodeman.net',
        jobTitle: 'Microsoft MVP',
      },
    },
    {
      '@type': 'Book',
      name: 'Design Patterns Simplified',
      description:
        'A concise, beginner-level ebook covering 10 essential design patterns in C# — Adapter, Bridge, Builder, Command, Composite, Decorator, Factory Method, Observer, Singleton, and Strategy — with real-world examples and a free GitHub repository.',
      author: {
        '@type': 'Person',
        name: 'Stefan Djokic',
        url: 'https://thecodeman.net',
      },
      offers: {
        '@type': 'Offer',
        price: '9.95',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://thecodeman.net/design-patterns-simplified',
      },
      bookFormat: 'https://schema.org/EBook',
      inLanguage: 'en',
      genre: 'Software Engineering',
      about: [
        { '@type': 'Thing', name: 'Adapter Pattern' },
        { '@type': 'Thing', name: 'Bridge Pattern' },
        { '@type': 'Thing', name: 'Builder Pattern' },
        { '@type': 'Thing', name: 'Command Pattern' },
        { '@type': 'Thing', name: 'Composite Pattern' },
        { '@type': 'Thing', name: 'Decorator Pattern' },
        { '@type': 'Thing', name: 'Factory Method Pattern' },
        { '@type': 'Thing', name: 'Observer Pattern' },
        { '@type': 'Thing', name: 'Singleton Pattern' },
        { '@type': 'Thing', name: 'Strategy Pattern' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        bestRating: '5',
        ratingCount: '6',
        reviewCount: '6',
      },
      review: [
        {
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          author: { '@type': 'Person', name: 'Milan Jovanovic' },
          reviewBody:
            'A quick and enjoyable read about the most important design patterns in C#. The examples were refreshing, and I especially liked being able to access the source code.',
        },
        {
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          author: { '@type': 'Person', name: 'Raul Fernando Aillon Salinas' },
          reviewBody:
            'I love the simplicity of how every pattern is explained. The real-life examples are an incredible way to provide context and understand why we are choosing this pattern.',
        },
        {
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          author: { '@type': 'Person', name: 'Jeroen Opmeer' },
          reviewBody:
            'This ebook shows that good technical information does not have to be buried in hundreds of pages of fluff. Exactly what a developer wants to read.',
        },
        {
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          author: { '@type': 'Person', name: 'Saeed Esmaeelinejad' },
          reviewBody:
            'Amazing visualizations that help a lot for a better understanding of how patterns work. I like that it mentions the pros and cons to decide which pattern suits your case.',
        },
      ],
      url: 'https://thecodeman.net/design-patterns-simplified',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is Design Patterns Simplified good for beginners?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Design Patterns Simplified is written specifically at a beginner level. Each of the 10 patterns is explained from scratch with a plain-language description and a real-world C# example, so you do not need prior experience with design patterns to follow along.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which design patterns are covered in the ebook?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The ebook covers 10 practical patterns hand-picked from real projects: Adapter, Bridge, Builder, Command, Composite, Decorator, Factory Method, Observer, Singleton, and Strategy.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long is the ebook?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It is a short, focused 30-page guide. There is no padding or unnecessary theory — only what you need to understand and apply each pattern, plus real-world examples and code.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I get the source code?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Along with the code inside the book, you get a free GitHub repository containing implementations of all 10 patterns in the C# programming language.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does it cost and how is it delivered?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Design Patterns Simplified costs $9.95. After checkout you get instant access to download the ebook and the free GitHub repository.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between Simplified and Design Patterns that Deliver?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Design Patterns Simplified is the beginner-friendly entry point: 10 patterns explained briefly and affordably. Design Patterns that Deliver goes deeper into 5 patterns with advanced implementations, UML diagrams, 20 mini-projects, and 100 interview questions.',
          },
        },
      ],
    },
  ],
};

const HIDE_GLOBAL_CHROME = `
body{padding-top:0 !important}
.promo-bar{display:none !important}
nav#ftco-navbar.header-nav{display:none !important}
`;

const PAGE_JS = `
(function(){
  document.documentElement.classList.add('dp-js');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('dp-in');io.unobserve(e.target);}});},{threshold:.12});
    document.querySelectorAll('.dp-reveal').forEach(function(el){io.observe(el);});
    var sticky=document.getElementById('dp-stickybar');
    var hero=document.getElementById('dp-hero');
    if(sticky&&hero){var so=new IntersectionObserver(function(es){es.forEach(function(e){sticky.classList.toggle('dp-show', !e.isIntersecting);});},{threshold:0}); so.observe(hero);}
  } else {
    document.querySelectorAll('.dp-reveal').forEach(function(el){el.classList.add('dp-in');});
  }
})();
`;

const MS = (
  <span className="dp-ms"><i></i><i></i><i></i><i></i></span>
);

const Ebook = () => {
  return (
    <div className="dp-page">
      <style dangerouslySetInnerHTML={{ __html: HIDE_GLOBAL_CHROME }} />
      <Script
        id="design-patterns-simplified-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="dp-ambience" aria-hidden="true"></div>
      <div className="dp-grain" aria-hidden="true"></div>

      {/* 1. ANNOUNCEMENT BAR */}
      <div className="dp-topbar">
        <span>📗 <b>Design Patterns Simplified</b> · 10 patterns, beginner-friendly</span>
        <span className="dp-tdot"></span>
        <span><b>{config.EbookCopiesNumber}+</b> developers learning the simple way · just $9.95</span>
      </div>

      {/* 2. STICKY NAV */}
      <nav className="dp-nav">
        <div className="dp-wrap dp-nav-row">
          <a className="dp-brand" href="#dp-top"><span className="dp-glyph">&lt;/&gt;</span> Design Patterns Simplified</a>
          <div className="dp-nav-links">
            <a href="#dp-problem">Why Simplified</a>
            <a href="#dp-patterns">The Patterns</a>
            <a href="#dp-included">What You Get</a>
            <a href="#dp-pricing">Pricing</a>
            <a href="#dp-faq">FAQ</a>
          </div>
          <div className="dp-nav-right">
            <span className="dp-nav-price"><b>$9.95</b></span>
            <a href={CHECKOUT_URL} className="dp-btn dp-btn-primary lemonsqueezy-button">Get the Ebook</a>
          </div>
        </div>
      </nav>

      <div id="dp-top"></div>

      {/* 3. HERO */}
      <header className="dp-hero" id="dp-hero">
        <div className="dp-wrap dp-hero-grid">
          <div className="dp-reveal">
            <span className="dp-chip">{MS} By Stefan Đokić · Microsoft MVP</span>
            <h1>Design patterns, finally <span className="dp-amber">simple enough to actually use.</span></h1>
            <p className="dp-lead">Who still wants to read a 500+ page book that costs over $100? Instead, get <b>10 essential design patterns</b> distilled into a short, beginner-friendly C# guide — each explained with a real-world example you can apply today.</p>
            <div className="dp-cta">
              <a href={CHECKOUT_URL} className="dp-btn dp-btn-primary lemonsqueezy-button">Download for $9.95 →</a>
              <a href="#dp-patterns" className="dp-btn dp-btn-ghost">See what&apos;s inside</a>
            </div>
            <p className="dp-reassure">Instant download <span className="dp-dot"></span> 30-page guide <span className="dp-dot"></span> free GitHub repo <span className="dp-dot"></span> beginner level</p>
            <div className="dp-hero-rating">
              <span className="dp-stars" style={{ fontSize: 18, letterSpacing: 2 }}>★★★★★</span>
              <span style={{ marginLeft: 12, fontSize: 14, color: 'var(--muted)' }}>Rated 5/5 · loved by {config.EbookCopiesNumber}+ developers</span>
            </div>
          </div>
          <div className="dp-cover dp-reveal">
            <div className="dp-glow" aria-hidden="true"></div>
            <div className="dp-frame">
              <Image src={'/images/ebook.webp'} priority alt={'Design Patterns Simplified ebook cover'} width={620} height={760} sizes="(max-width: 940px) 100vw, 50vw" style={{ width: '100%', height: 'auto' }} />
            </div>
          </div>
        </div>
      </header>

      {/* 4. CREDIBILITY STRIP */}
      <div className="dp-cred">
        <div className="dp-wrap dp-cred-row">
          <span><b>{config.EbookCopiesNumber}+</b> copies sold</span>
          <span className="dp-sep"></span>
          <span className="dp-stars">★★★★★</span> <span>rated 5/5</span>
          <span className="dp-sep"></span>
          <span><b>{config.LinkedinFollowers}</b> on LinkedIn</span>
          <span className="dp-sep"></span>
          <span><b>{config.NewsletterSubCount}</b></span>
          <span className="dp-sep"></span>
          <span>Written by a <b>Microsoft MVP</b></span>
        </div>
      </div>

      {/* 4.5 SPOTLIGHT TESTIMONIAL */}
      <section className="dp-spotlight-sec">
        <div className="dp-wrap">
          <div className="dp-spotlight dp-reveal">
            <span className="dp-spot-stars">★★★★★</span>
            <p className="dp-spot-q">&ldquo;A quick and enjoyable read about the most important design patterns in C#. The examples were refreshing, and I especially liked being able to <span className="dp-amber">access the source code.</span>&rdquo;</p>
            <span className="dp-spot-who">
              <span className="dp-spot-av">MJ</span>
              <span className="dp-spot-meta">
                <span className="dp-spot-nm">Milan Jovanović</span>
                <span className="dp-spot-rl">Microsoft MVP · Pragmatic Clean Architecture</span>
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* 5. THE PROBLEM */}
      <section id="dp-problem">
        <div className="dp-wrap dp-pain-grid">
          <div className="dp-reveal">
            <span className="dp-eyebrow">Why Simplified</span>
            <h2 className="dp-sec-title">Most design pattern books make a simple idea feel impossible.</h2>
            <ul className="dp-pain-list">
              <li><span className="dp-x">✕</span> Hundreds of pages of academic theory before a single line of useful code.</li>
              <li><span className="dp-x">✕</span> UML-heavy explanations that never connect to a real problem.</li>
              <li><span className="dp-x">✕</span> $100+ price tags for knowledge you only need 20% of.</li>
              <li><span className="dp-x">✕</span> You finish a chapter and still cannot tell when to use the pattern.</li>
            </ul>
            <p className="dp-kicker">This book does the opposite: <span className="dp-amber">short, practical, and affordable.</span></p>
          </div>
          <div className="dp-media-frame dp-reveal">
            <Image src={'/images/real-world-example.webp'} alt={'Design Patterns Simplified — real-world example'} width={720} height={520} sizes="(max-width: 860px) 100vw, 40vw" style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      </section>

      {/* 6. BEFORE / AFTER */}
      <section>
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">The shift</span>
            <h2 className="dp-sec-title">From overwhelmed to confident</h2>
          </div>
          <div className="dp-ba dp-reveal">
            <div className="dp-ba-card dp-before">
              <h3>Before</h3>
              <ul>
                <li><span className="dp-ic">✕</span> Copy-pasting patterns from Stack Overflow without understanding them.</li>
                <li><span className="dp-ic">✕</span> Picking the wrong pattern and over-engineering simple code.</li>
                <li><span className="dp-ic">✕</span> Freezing on design questions in interviews.</li>
                <li><span className="dp-ic">✕</span> Abandoning thick books after the first few chapters.</li>
              </ul>
            </div>
            <div className="dp-ba-card dp-after">
              <h3>After</h3>
              <ul>
                <li><span className="dp-ic">✓</span> Recognizing which pattern fits the problem in front of you.</li>
                <li><span className="dp-ic">✓</span> Writing cleaner, more maintainable C# with intent.</li>
                <li><span className="dp-ic">✓</span> Explaining each pattern clearly in interviews.</li>
                <li><span className="dp-ic">✓</span> Actually finishing the book — in a single sitting.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. THE 10 PATTERNS */}
      <section id="dp-patterns">
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">Inside the book</span>
            <h2 className="dp-sec-title">10 practical patterns, explained simply</h2>
            <p className="dp-sec-sub">Hand-picked from real projects — the patterns that actually earn their place in production C# code.</p>
          </div>
          <div className="dp-patterns">
            <article className="dp-pat-card dp-reveal">
              <div className="dp-pat-ico">🔌</div>
              <div className="dp-pat-num">PATTERN 01 · Structural</div>
              <h3><span className="dp-amber">Adapter</span></h3>
              <p>Make incompatible interfaces work together so you can plug in third-party or legacy code without rewriting it.</p>
              <div className="dp-tags"><span className="dp-tag">integration</span><span className="dp-tag">legacy code</span></div>
            </article>
            <article className="dp-pat-card dp-reveal">
              <div className="dp-pat-ico">🌉</div>
              <div className="dp-pat-num">PATTERN 02 · Structural</div>
              <h3><span className="dp-amber">Bridge</span></h3>
              <p>Split abstraction from implementation so the two can grow independently instead of exploding into class combinations.</p>
              <div className="dp-tags"><span className="dp-tag">decoupling</span><span className="dp-tag">scalability</span></div>
            </article>
            <article className="dp-pat-card dp-reveal">
              <div className="dp-pat-ico">🧱</div>
              <div className="dp-pat-num">PATTERN 03 · Creational</div>
              <h3><span className="dp-amber">Builder</span></h3>
              <p>Construct complex objects step by step and kill telescoping constructors with a clean, fluent API.</p>
              <div className="dp-tags"><span className="dp-tag">object creation</span><span className="dp-tag">fluent api</span></div>
            </article>
            <article className="dp-pat-card dp-reveal">
              <div className="dp-pat-ico">🎮</div>
              <div className="dp-pat-num">PATTERN 04 · Behavioral</div>
              <h3><span className="dp-amber">Command</span></h3>
              <p>Wrap a request as an object so you can queue, log, and undo operations with ease.</p>
              <div className="dp-tags"><span className="dp-tag">undo/redo</span><span className="dp-tag">queueing</span></div>
            </article>
            <article className="dp-pat-card dp-reveal">
              <div className="dp-pat-ico">🌲</div>
              <div className="dp-pat-num">PATTERN 05 · Structural</div>
              <h3><span className="dp-amber">Composite</span></h3>
              <p>Treat individual objects and groups of objects the same way — perfect for trees and nested structures.</p>
              <div className="dp-tags"><span className="dp-tag">tree structures</span><span className="dp-tag">hierarchies</span></div>
            </article>
            <article className="dp-pat-card dp-reveal">
              <div className="dp-pat-ico">🎁</div>
              <div className="dp-pat-num">PATTERN 06 · Structural</div>
              <h3><span className="dp-amber">Decorator</span></h3>
              <p>Add behavior to objects by wrapping them — logging, caching, or validation without touching the original class.</p>
              <div className="dp-tags"><span className="dp-tag">cross-cutting</span><span className="dp-tag">extensibility</span></div>
            </article>
            <article className="dp-pat-card dp-reveal">
              <div className="dp-pat-ico">🏭</div>
              <div className="dp-pat-num">PATTERN 07 · Creational</div>
              <h3><span className="dp-amber">Factory Method</span></h3>
              <p>Delegate object creation to subclasses so your code depends on abstractions, not concrete types.</p>
              <div className="dp-tags"><span className="dp-tag">object creation</span><span className="dp-tag">abstraction</span></div>
            </article>
            <article className="dp-pat-card dp-reveal">
              <div className="dp-pat-ico">📡</div>
              <div className="dp-pat-num">PATTERN 08 · Behavioral</div>
              <h3><span className="dp-amber">Observer</span></h3>
              <p>Notify many objects automatically when state changes — the backbone of events and reactive code.</p>
              <div className="dp-tags"><span className="dp-tag">events</span><span className="dp-tag">reactive</span></div>
            </article>
            <article className="dp-pat-card dp-reveal">
              <div className="dp-pat-ico">🔒</div>
              <div className="dp-pat-num">PATTERN 09 · Creational</div>
              <h3><span className="dp-amber">Singleton</span></h3>
              <p>Guarantee a single instance with global access — done right, thread-safe, and without the usual pitfalls.</p>
              <div className="dp-tags"><span className="dp-tag">single instance</span><span className="dp-tag">thread-safe</span></div>
            </article>
            <article className="dp-pat-card dp-reveal">
              <div className="dp-pat-ico">♟️</div>
              <div className="dp-pat-num">PATTERN 10 · Behavioral</div>
              <h3><span className="dp-amber">Strategy</span></h3>
              <p>Swap algorithms at runtime by encapsulating each one — clean, testable, and free of giant switch statements.</p>
              <div className="dp-tags"><span className="dp-tag">swappable logic</span><span className="dp-tag">testability</span></div>
            </article>
          </div>
        </div>
      </section>

      <div className="dp-divider"></div>

      {/* 8. EVERYTHING YOU GET */}
      <section id="dp-included">
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">What you get</span>
            <h2 className="dp-sec-title">Everything in one affordable package</h2>
          </div>
          <div className="dp-eg-grid dp-reveal">
            <div className="dp-eg-card">
              <div className="dp-eg-ico">📗</div>
              <h3>The Ebook</h3>
              <ul>
                <li><span className="dp-ic">✓</span> Short 30-page guide</li>
                <li><span className="dp-ic">✓</span> 10 essential patterns</li>
                <li><span className="dp-ic">✓</span> Plain-language explanations</li>
                <li><span className="dp-ic">✓</span> Beginner level</li>
              </ul>
            </div>
            <div className="dp-eg-card">
              <div className="dp-eg-ico">🌍</div>
              <h3>Real-World Examples</h3>
              <ul>
                <li><span className="dp-ic">✓</span> Practical, hands-on use cases</li>
                <li><span className="dp-ic">✓</span> When (and when not) to use each</li>
                <li><span className="dp-ic">✓</span> Apply patterns to real projects</li>
                <li><span className="dp-ic">✓</span> Solve real challenges</li>
              </ul>
            </div>
            <div className="dp-eg-card">
              <div className="dp-eg-ico">💻</div>
              <h3>Free GitHub Repo</h3>
              <ul>
                <li><span className="dp-ic">✓</span> All 10 patterns in C#</li>
                <li><span className="dp-ic">✓</span> Runnable code samples</li>
                <li><span className="dp-ic">✓</span> Clean, readable implementations</li>
                <li><span className="dp-ic">✓</span> Learn by doing</li>
              </ul>
            </div>
            <div className="dp-eg-card">
              <div className="dp-eg-ico">📱</div>
              <h3>Read Anywhere</h3>
              <ul>
                <li><span className="dp-ic">✓</span> Works on every device</li>
                <li><span className="dp-ic">✓</span> Instant download</li>
                <li><span className="dp-ic">✓</span> Lifetime access</li>
                <li><span className="dp-ic">✓</span> No subscription</li>
              </ul>
            </div>
          </div>
          <div className="dp-bonus-grid dp-reveal" style={{ marginTop: 32 }}>
            <div className="dp-bonus-card">
              <div className="dp-gift">⚡</div>
              <h3>Short &amp; Focused</h3>
              <p>No 500-page slog. Only what you need to understand and use each pattern.</p>
            </div>
            <div className="dp-bonus-card">
              <div className="dp-gift">💸</div>
              <h3>Genuinely Affordable</h3>
              <p>Real knowledge without the $100+ price tag — accessible to every developer.</p>
            </div>
            <div className="dp-bonus-card">
              <div className="dp-gift">🧩</div>
              <h3>Easy to Apply</h3>
              <p>Every pattern is tied to a real-world example so you can use it immediately.</p>
            </div>
          </div>
          <p className="dp-bonus-foot dp-reveal" style={{ marginTop: 24 }}>Ebook + real-world examples + GitHub repo · <b>all for $9.95</b></p>
        </div>
      </section>

      <div className="dp-divider"></div>

      {/* 9. TESTIMONIALS */}
      <section id="dp-proof">
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">Proof</span>
            <h2 className="dp-sec-title">In their own words</h2>
            <p className="dp-sec-sub">Developers around the world learning design patterns the simple way.</p>
          </div>
          <div className="dp-reveal">
            <EbookReviews />
          </div>
          <div className="dp-tg dp-reveal">
            <div className="dp-tcard">
              <span className="dp-stars">★★★★★</span>
              <p className="dp-q">I love the simplicity of how every pattern is explained. The real-life examples are an incredible way to provide context and understand why we are choosing this pattern.</p>
              <div className="dp-who">
                <span className="dp-av">RA</span>
                <span><span className="dp-nm">Raul F. Aillon Salinas</span><br /><span className="dp-rl">Software Engineer</span></span>
              </div>
            </div>
            <div className="dp-tcard">
              <span className="dp-stars">★★★★★</span>
              <p className="dp-q">This ebook shows that good technical information does not have to be buried in hundreds of pages of fluff. Exactly what a developer wants to read.</p>
              <div className="dp-who">
                <span className="dp-av">JO</span>
                <span><span className="dp-nm">Jeroen Opmeer</span><br /><span className="dp-rl">.NET Developer</span></span>
              </div>
            </div>
            <div className="dp-tcard">
              <span className="dp-stars">★★★★★</span>
              <p className="dp-q">Amazing visualizations that help a lot for a better understanding of how patterns work. I like that it mentions the pros and cons to decide which pattern suits your case.</p>
              <div className="dp-who">
                <span className="dp-av">SE</span>
                <span><span className="dp-nm">Saeed Esmaeelinejad</span><br /><span className="dp-rl">Software Developer</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. ABOUT */}
      <section>
        <div className="dp-wrap dp-about">
          <div className="dp-media-frame dp-reveal">
            <Image src={'/images/ebook-stefan.webp'} alt={'Stefan Đokić — author of Design Patterns Simplified'} width={420} height={520} sizes="(max-width: 860px) 100vw, 30vw" style={{ width: '100%', height: 'auto' }} />
          </div>
          <div className="dp-reveal">
            <span className="dp-mvp-pill">{MS} Microsoft MVP</span>
            <h2>Hi friend, I&apos;m Stefan</h2>
            <p>I&apos;m a senior software engineer with years of industry experience. I help thousands of developers get better at their daily work through the content I share on social media, my blog, and my newsletter.</p>
            <p>My goal with this book is simple: convey real knowledge in the simplest way possible. <b>Keep it simple and focus on what matters — don&apos;t let yourself be overwhelmed.</b></p>
            <div className="dp-about-stats">
              <div><div className="dp-v">{config.NewsletterSubCount.split(' ')[0]}</div><div className="dp-l">Newsletter subscribers</div></div>
              <div><div className="dp-v">{config.LinkedinFollowers.split(' ')[0]}</div><div className="dp-l">LinkedIn followers</div></div>
              <div><div className="dp-v">{config.EbookCopiesNumber}+</div><div className="dp-l">Copies sold</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. PRICING */}
      <section id="dp-pricing">
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">Pricing</span>
            <h2 className="dp-sec-title">One-time price. Lifetime access.</h2>
          </div>
          <div className="dp-pricing dp-reveal">
            <div className="dp-price-card">
              <div className="dp-ribbon">BEST VALUE</div>
              <h3>Design Patterns Simplified</h3>
              <p className="dp-psub">Everything you need to learn patterns the simple way.</p>
              <div className="dp-amt">
                <span className="dp-now">$9.95</span>
              </div>
              <p className="dp-save">Less than a coffee &amp; a snack — for skills you keep forever.</p>
              <ul>
                <li><span className="dp-ic">✓</span> Short 30-page ebook</li>
                <li><span className="dp-ic">✓</span> 10 essential design patterns</li>
                <li><span className="dp-ic">✓</span> Real-world C# examples</li>
                <li><span className="dp-ic">✓</span> Free GitHub repository</li>
                <li><span className="dp-ic">✓</span> Instant download · lifetime access</li>
              </ul>
              <a href={CHECKOUT_URL} className="dp-btn dp-btn-primary lemonsqueezy-button">Download for $9.95 →</a>
              <p className="dp-grt">Secure checkout via Lemon Squeezy · instant delivery</p>
            </div>
            <div className="dp-why">
              <h3>Why developers buy this</h3>
              <div className="dp-why-item">
                <span className="dp-ic">⚡</span>
                <div><div className="dp-t">Read it in one sitting</div><div className="dp-d">Short and focused — no wading through hundreds of pages.</div></div>
              </div>
              <div className="dp-why-item">
                <span className="dp-ic">🌍</span>
                <div><div className="dp-t">Examples that click</div><div className="dp-d">Every pattern is tied to a real-world problem and solution.</div></div>
              </div>
              <div className="dp-why-item">
                <span className="dp-ic">💻</span>
                <div><div className="dp-t">Code you can run</div><div className="dp-d">A free GitHub repo with all 10 patterns in C#.</div></div>
              </div>
              <div className="dp-why-item">
                <span className="dp-ic">💸</span>
                <div><div className="dp-t">Affordable for everyone</div><div className="dp-d">Real knowledge without the $100+ textbook price tag.</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FIT CHECK */}
      <section>
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">Is it for you?</span>
            <h2 className="dp-sec-title">Made for developers who value clarity</h2>
          </div>
          <div className="dp-fit dp-reveal">
            <div className="dp-fit-card dp-yes">
              <h3>This is for you if…</h3>
              <ul>
                <li><span className="dp-ic">✓</span> You&apos;re new to design patterns and want a gentle start.</li>
                <li><span className="dp-ic">✓</span> You learn best from real-world examples, not theory.</li>
                <li><span className="dp-ic">✓</span> You want a quick reference you&apos;ll actually finish.</li>
                <li><span className="dp-ic">✓</span> You write C# and want cleaner, more maintainable code.</li>
              </ul>
            </div>
            <div className="dp-fit-card dp-no">
              <h3>This is not for you if…</h3>
              <ul>
                <li><span className="dp-ic">✕</span> You want exhaustive academic coverage of all 23 GoF patterns.</li>
                <li><span className="dp-ic">✕</span> You prefer dense UML theory over practical code.</li>
                <li><span className="dp-ic">✕</span> You&apos;re already an expert who needs deep advanced variants.</li>
                <li><span className="dp-ic">✕</span> You won&apos;t open a single line of example code.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FAQ */}
      <section id="dp-faq">
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">FAQ</span>
            <h2 className="dp-sec-title">Questions, answered</h2>
          </div>
          <div className="dp-acc dp-reveal">
            <details>
              <summary>Is this good for beginners? <span className="dp-tog">+</span></summary>
              <div className="dp-acc-body"><p>Yes. It&apos;s written at a beginner level. Every pattern is explained from scratch in plain language with a real-world C# example, so no prior experience with design patterns is required.</p></div>
            </details>
            <details>
              <summary>Which patterns are covered? <span className="dp-tog">+</span></summary>
              <div className="dp-acc-body"><p>10 practical patterns: Adapter, Bridge, Builder, Command, Composite, Decorator, Factory Method, Observer, Singleton, and Strategy — hand-picked from real projects.</p></div>
            </details>
            <details>
              <summary>How long is the ebook? <span className="dp-tog">+</span></summary>
              <div className="dp-acc-body"><p>A short, focused 30-page guide. No padding — only what you need to understand and apply each pattern, plus real-world examples and code.</p></div>
            </details>
            <details>
              <summary>Do I get the source code? <span className="dp-tog">+</span></summary>
              <div className="dp-acc-body"><p>Yes. Along with the code inside the book, you get a free GitHub repository containing implementations of all 10 patterns in C#.</p></div>
            </details>
            <details>
              <summary>How much is it and how is it delivered? <span className="dp-tog">+</span></summary>
              <div className="dp-acc-body"><p>It&apos;s $9.95. After checkout you get instant access to download the ebook and the free GitHub repository. Payment is handled securely via Lemon Squeezy.</p></div>
            </details>
            <details>
              <summary>How is this different from &ldquo;Design Patterns that Deliver&rdquo;? <span className="dp-tog">+</span></summary>
              <div className="dp-acc-body"><p>Simplified is the beginner-friendly entry point: 10 patterns explained briefly and affordably. <a href="/design-patterns-that-deliver-ebook" className="dp-amber">Design Patterns that Deliver</a> goes deeper into 5 patterns with advanced implementations, UML diagrams, 20 mini-projects, and 100 interview questions.</p></div>
            </details>
          </div>
        </div>
      </section>

      {/* 14. FINAL CTA */}
      <section className="dp-final">
        <div className="dp-wrap">
          <div className="dp-reveal">
            <span className="dp-eyebrow dp-center">Keep it simple</span>
            <h2>Master design patterns the <span className="dp-amber">simple way</span> — for $9.95.</h2>
            <div className="dp-cta" style={{ justifyContent: 'center' }}>
              <a href={CHECKOUT_URL} className="dp-btn dp-btn-primary lemonsqueezy-button">Download for $9.95 →</a>
            </div>
            <p className="dp-reassure" style={{ justifyContent: 'center', marginTop: 16 }}>Instant download <span className="dp-dot"></span> 30-page guide <span className="dp-dot"></span> free GitHub repo <span className="dp-dot"></span> lifetime access</p>
          </div>
        </div>
      </section>

      {/* 15. STICKY BOTTOM BAR */}
      <div className="dp-stickybar" id="dp-stickybar">
        <div className="dp-wrap dp-sb-row">
          <div className="dp-sb-info">
            <span className="dp-sb-nm">Design Patterns Simplified</span>
            <span className="dp-sb-cd">10 patterns · beginner-friendly · instant download</span>
          </div>
          <div className="dp-sb-right">
            <span className="dp-sb-pr">$9.95</span>
            <a href={CHECKOUT_URL} className="dp-btn dp-btn-primary lemonsqueezy-button">Get the Ebook →</a>
          </div>
        </div>
      </div>

      <Script id="design-patterns-simplified-page-js" dangerouslySetInnerHTML={{ __html: PAGE_JS }} />
    </div>
  )
}

export default Ebook;
