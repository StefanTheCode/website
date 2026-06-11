import config from '@/config.json'
import EbookNewsletter from '@/components/ebookTestimonials';
import PatternPicker from '@/components/PatternPicker';
import { Metadata } from 'next';
import Image from 'next/image'
import Script from 'next/script';
// @ts-ignore -- global stylesheet side-effect import resolved by Next.js at build time
import './ebook.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: "Design Patterns that Deliver — 10 Production C#/.NET Patterns + AI Tutor",
  alternates: {
    canonical: 'https://thecodeman.net/design-patterns-that-deliver-ebook',
  },
  description: "Master 10 production C# design patterns: Builder, Decorator, Strategy, Adapter, Mediator, Result, Pipeline (Chain of Responsibility), Specification, Factory, and State. Real problems to working code with unit tests, async, trade-offs, UML diagrams, a GitHub repo, 100 interview questions, and a built-in AI tutor.",
  keywords: [
    'design patterns c#',
    'c# design patterns book',
    'builder pattern c#',
    'decorator pattern c#',
    'strategy pattern c#',
    'adapter pattern c#',
    'mediator pattern c#',
    'result pattern c#',
    'specification pattern c#',
    'factory pattern c#',
    'state pattern c#',
    'chain of responsibility c#',
    'MediatR',
    'design patterns .NET',
    'design patterns interview questions',
    'AI design pattern tutor',
  ],
  openGraph: {
    title: "Design Patterns that Deliver — 10 Production C#/.NET Patterns + AI Tutor",
    type: "website",
    url: "https://thecodeman.net/design-patterns-that-deliver-ebook",
    description: "10 production C# design patterns from real problems to working code — with unit tests, trade-offs, a GitHub repo, 100 interview questions, and a built-in AI tutor.",
    images: [
      {
        url: 'https://thecodeman.net/og-ebookimage2.png',
        width: "1000px",
        height: "700px"
      }
    ],
  },
  twitter: {
    title: "Design Patterns that Deliver — 10 Production C#/.NET Patterns + AI Tutor",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "10 production C# design patterns from real problems to working code — with unit tests, trade-offs, a GitHub repo, 100 interview questions, and a built-in AI tutor.",
    images: [
      {
        url: 'https://thecodeman.net/og-ebookimage2.png',
        width: "1000px",
        height: "700px"
      }
    ]
  }
}

const CHECKOUT_URL = 'https://stefandjokic.lemonsqueezy.com/checkout/buy/5e943b0e-a3fd-4c3d-950e-3671762ebf85';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://thecodeman.net/design-patterns-that-deliver-ebook',
      url: 'https://thecodeman.net/design-patterns-that-deliver-ebook',
      name: 'Design Patterns that Deliver — 10 Production C#/.NET Patterns + AI Tutor',
      description:
        'Master 10 production C# design patterns from real problems to working code — Builder, Decorator, Strategy, Adapter, Mediator, Result, Pipeline, Specification, Factory, and State — with unit tests, trade-offs, a GitHub repo, 100 interview questions, and a built-in AI tutor.',
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
      name: 'Design Patterns that Deliver',
      description:
        'A practical ebook covering 10 production design patterns in C# — Builder, Decorator, Strategy, Adapter, Mediator, Result, Pipeline (Chain of Responsibility), Specification, Factory, and State — with real-world examples, unit tests, trade-off analysis, UML diagrams, advanced implementations, a GitHub repository, 100 interview questions, and a built-in AI tutor.',
      author: {
        '@type': 'Person',
        name: 'Stefan Djokic',
        url: 'https://thecodeman.net',
      },
      offers: {
        '@type': 'Offer',
        price: '32.99',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://thecodeman.net/design-patterns-that-deliver-ebook',
      },
      bookFormat: 'https://schema.org/EBook',
      inLanguage: 'en',
      genre: 'Software Engineering',
      about: [
        { '@type': 'Thing', name: 'Builder Pattern' },
        { '@type': 'Thing', name: 'Decorator Pattern' },
        { '@type': 'Thing', name: 'Strategy Pattern' },
        { '@type': 'Thing', name: 'Adapter Pattern' },
        { '@type': 'Thing', name: 'Mediator Pattern' },
        { '@type': 'Thing', name: 'Result Pattern' },
        { '@type': 'Thing', name: 'Chain of Responsibility Pattern' },
        { '@type': 'Thing', name: 'Specification Pattern' },
        { '@type': 'Thing', name: 'Factory Pattern' },
        { '@type': 'Thing', name: 'State Pattern' },
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
            'Design Patterns ebook is a quick and enjoyable read about the most important design patterns in C#. The examples were refreshing, and I especially liked being able to access the source code.',
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
            'Amazing with nice visualization which helps a lot for a better understanding of how patterns work. I like that it mentions the Pros and Cons to decide which pattern suits your case.',
        },
      ],
      url: 'https://thecodeman.net/design-patterns-that-deliver-ebook',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Which design patterns does Design Patterns that Deliver cover?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It covers 10 production patterns in modern C#: five foundational ones — Builder, Decorator, Strategy, Adapter, and Mediator — plus five that ship real systems — Result (errors as values), Pipeline / Chain of Responsibility, Specification, Factory (to keyed DI), and State. Each goes from a real problem to working code with unit tests, trade-offs, and when-not-to-use guidance.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the AI tools included with the book?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Two. The free Pattern Picker lets anyone describe a problem and get the right C#/.NET pattern with a tutorial link. Ask the Book is an AI tutor for owners that answers strictly from the book, cited by chapter — accurate, production-grade, not generic internet code.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the Result pattern in C#?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Result pattern models expected failures (validation, business rules, conflicts) as return values instead of throwing exceptions. In C# you compose steps railway-style with Bind/Map/Match — including async — and map results onto ProblemDetails at the API boundary. The book shows a hand-rolled Result plus libraries like ErrorOr and FluentResults.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the Specification pattern in C# and EF Core?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Specification pattern turns a business rule into a composable, testable object you combine with And/Or/Not. Expressed as Expression<Func<T,bool>>, it translates to EF Core SQL using parameter rebinding (an ExpressionVisitor) — not Expression.Invoke, which EF Core cannot translate. The same spec is reused for queries and in-memory validation.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are design patterns still relevant in modern .NET?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Absolutely. MediatR (Mediator), Scrutor (Decorator), Polly (Strategy/resilience), IHttpClientFactory (Factory), keyed DI, and ASP.NET middleware (Chain of Responsibility) are all pattern implementations used daily in production .NET around dependency injection, pipelines, and Clean Architecture.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which design patterns are most commonly asked in C# interviews?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Builder, Decorator, Strategy, Adapter, Mediator, Factory, State, and Chain of Responsibility come up constantly — all covered here. The book also includes a bonus mini-ebook with 100 design pattern interview questions and answers.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to know all Gang of Four patterns before reading this book?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. This book focuses on the 10 most impactful patterns from real-world .NET experience. Each is explained from scratch with a real problem, the solution, UML diagrams, advanced variations, and unit tests. It is accessible for intermediate developers and still valuable for senior ones.',
          },
        },
        {
          '@type': 'Question',
          name: 'What do I get when I buy Design Patterns that Deliver?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You get the full ebook (PDF and EPUB) covering 10 production patterns, a GitHub repository with 20 runnable C# mini-projects, a bonus mini-ebook with 100 design pattern interview questions and answers, a quick-reference pattern decision guide, access to the Ask-the-Book AI tutor, and lifetime access including future updates. Delivery is instant after checkout.',
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
        id="design-patterns-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="dp-ambience" aria-hidden="true"></div>
      <div className="dp-grain" aria-hidden="true"></div>

      {/* 1. ANNOUNCEMENT BAR */}
      <div className="dp-topbar">
        <span>📘 <b>Design Patterns that Deliver</b> · 10 patterns + 2 AI tutors</span>
        <span className="dp-tdot"></span>
        <span><b>{config.EbookCopiesNumber}+</b> copies sold · instant download</span>
      </div>

      {/* 2. STICKY NAV */}
      <nav className="dp-nav">
        <div className="dp-wrap dp-nav-row">
          <a className="dp-brand" href="#dp-top"><span className="dp-glyph">&lt;/&gt;</span> Design Patterns that Deliver</a>
          <div className="dp-nav-links">
            <a href="#dp-patterns">The Patterns</a>
            <a href="#dp-ai">AI Tutor</a>
            <a href="#dp-included">What You Get</a>
            <a href="#dp-pricing">Pricing</a>
            <a href="#dp-faq">FAQ</a>
          </div>
          <div className="dp-nav-right">
            <span className="dp-nav-price"><b>$32.99</b></span>
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
            <h1>Stop guessing design patterns. <span className="dp-amber">Start shipping the right one.</span></h1>
            <p className="dp-lead"><b>Ten</b> production-grade C# patterns — the five everyone needs (<b>Builder</b>, <b>Decorator</b>, <b>Strategy</b>, <b>Adapter</b>, <b>Mediator</b>) plus five that ship real systems (<b>Result</b>, <b>Pipeline</b>, <b>Specification</b>, <b>Factory</b>, <b>State</b>). Each from a real problem to working code — with unit tests, trade-offs, a GitHub repo, 100 interview Q&amp;As, and a built-in <b>AI tutor</b>.</p>
            <div className="dp-cta">
              <a href={CHECKOUT_URL} className="dp-btn dp-btn-primary lemonsqueezy-button">Get the Ebook - $32.99 →</a>
              <a href="/read/design-patterns-that-deliver/builder" className="dp-btn dp-btn-ghost">Read a free chapter →</a>
              <a href="/tools/pattern-picker" className="dp-btn dp-btn-ghost">Try the free AI tool →</a>
            </div>
            <p className="dp-reassure">Instant download <span className="dp-dot"></span> PDF + EPUB <span className="dp-dot"></span> GitHub repo included <span className="dp-dot"></span> AI tutor <span className="dp-dot"></span> lifetime updates</p>
            <div className="dp-hero-rating">
              <span className="dp-stars" style={{ fontSize: 18, letterSpacing: 2 }}>★★★★★</span>
              <span style={{ marginLeft: 12, fontSize: 14, color: 'var(--muted)' }}>Rated 5/5 · loved by {config.EbookCopiesNumber}+ developers</span>
            </div>
          </div>
          <div className="dp-cover dp-reveal">
            <div className="dp-glow"></div>
            <div className="dp-frame">
              <Image src="/images/ebook-thumb2.png" alt="Design Patterns that Deliver - C# design patterns ebook cover" width={0} height={0} sizes="(max-width:940px) 100vw, 50vw" style={{ width: '100%', height: 'auto', display: 'block' }} priority />
            </div>
          </div>
        </div>
      </header>

      {/* 4. CREDIBILITY STRIP */}
      <div className="dp-cred">
        <div className="dp-wrap dp-cred-row">
          <span><b>Microsoft MVP</b></span><span className="dp-sep"></span>
          <span><b>{config.EbookCopiesNumber}+</b> copies sold</span><span className="dp-sep"></span>
          <span><b>20,000+</b> newsletter readers</span><span className="dp-sep"></span>
          <span><b>102k+</b> LinkedIn</span><span className="dp-sep"></span>
          <span><b>10</b> patterns · <b>20</b> mini-projects</span><span className="dp-sep"></span>
          <span className="dp-stars">★★★★★</span>
        </div>
      </div>

      {/* 4.5 START-HERE FLOW (3 entry points) */}
      <section id="dp-start">
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">Start here</span>
            <h2 className="dp-sec-title">Three ways in — pick yours</h2>
            <p className="dp-sec-sub">Whether you&apos;re just browsing, want to read before you buy, or already own the book — there&apos;s a door for you.</p>
          </div>
          <div className="dp-flow dp-reveal">
            <div className="dp-flow-step">
              <span className="dp-flow-tag">Free</span>
              <div className="dp-flow-num">PATH 01 · JUST BROWSING</div>
              <h3>Find your pattern in seconds</h3>
              <p>Describe the problem you&apos;re stuck on. The free AI <b>Pattern Picker</b> recommends the right C#/.NET pattern with a tutorial for each.</p>
              <a className="dp-flow-link" href="/tools/pattern-picker">Try the Pattern Picker →</a>
            </div>
            <div className="dp-flow-step">
              <span className="dp-flow-tag">No signup</span>
              <div className="dp-flow-num">PATH 02 · READ FIRST</div>
              <h3>Read a full chapter, free</h3>
              <p>The entire <b>Builder</b> chapter is open in the web reader — real copyable code, diagrams, and the AI tutor on every example.</p>
              <a className="dp-flow-link" href="/read/design-patterns-that-deliver/builder">Read the Builder chapter →</a>
            </div>
            <div className="dp-flow-step">
              <span className="dp-flow-tag">For owners</span>
              <div className="dp-flow-num">PATH 03 · YOU OWN IT</div>
              <h3>Ask the book anything</h3>
              <p>Sign in with your purchase and chat with <b>Ask the Book</b> — an AI tutor that answers strictly from the book, cited by chapter.</p>
              <a className="dp-flow-link" href="/tools/ask-the-book">Open Ask the Book →</a>
            </div>
          </div>
        </div>
      </section>

      {/* 4.6 MAIN TESTIMONIAL SPOTLIGHT */}
      <section className="dp-spotlight-sec">
        <div className="dp-wrap dp-reveal">
          <div className="dp-spotlight">
            <span className="dp-mvp-pill">{MS} Recommended by a Microsoft MVP</span>
            <span className="dp-stars dp-spot-stars">★★★★★</span>
            <blockquote className="dp-spot-q">&quot;A quick and enjoyable read about the most important design patterns in C#. The examples were <span className="dp-amber">refreshing</span>, and I especially liked being able to access the source code. If you&apos;re just starting or need a refresher, <span className="dp-amber">this book will be your design patterns companion.</span>&quot;</blockquote>
            <div className="dp-spot-who">
              <div className="dp-spot-av">MJ</div>
              <div className="dp-spot-meta">
                <div className="dp-spot-nm">Milan Jovanović</div>
                <div className="dp-spot-rl">Microsoft MVP · Creator of Pragmatic Clean Architecture</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="dp-divider"></div>

      {/* 5. PROBLEM */}
      <section id="dp-problem">
        <div className="dp-wrap dp-pain-grid">
          <div className="dp-reveal">
            <span className="dp-eyebrow">The gap</span>
            <h2 className="dp-sec-title">You know the theory. But in the IDE, the code still looks wrong.</h2>
            <p style={{ color: 'var(--muted)', fontSize: 16.5, marginTop: 4 }}>You&apos;ve read the Gang of Four. You&apos;ve watched the tutorials. You can name patterns on a whiteboard. Then a real problem lands and you freeze:</p>
            <ul className="dp-pain-list">
              <li><span className="dp-x">✕</span> &quot;Should this be a Strategy or a Factory?&quot;</li>
              <li><span className="dp-x">✕</span> &quot;Should I throw here, or return a Result?&quot;</li>
              <li><span className="dp-x">✕</span> &quot;How does this pattern even work with DI?&quot;</li>
              <li><span className="dp-x">✕</span> &quot;The example online is a Pizza class... how does that help me?&quot;</li>
            </ul>
            <p className="dp-kicker">The gap between knowing a pattern and <span className="dp-amber">using it in production is massive.</span><br />That&apos;s exactly what this ebook closes.</p>
          </div>
          <div className="dp-reveal">
            <div className="dp-media-frame">
              <Image src="/images/real-world-examples.webp" alt="C# design patterns real-world implementation example" width={0} height={0} sizes="(max-width:860px) 100vw, 40vw" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      <div className="dp-divider"></div>

      {/* 6. BEFORE / AFTER */}
      <section>
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">The transformation</span>
            <h2 className="dp-sec-title">What changes after you read this</h2>
          </div>
          <div className="dp-ba dp-reveal">
            <div className="dp-ba-card dp-before">
              <h3>Before</h3>
              <ul>
                <li><span className="dp-ic">✕</span> Copy-paste pattern examples from StackOverflow</li>
                <li><span className="dp-ic">✕</span> Can&apos;t decide which pattern fits the problem</li>
                <li><span className="dp-ic">✕</span> Overengineer simple features with the wrong abstraction</li>
                <li><span className="dp-ic">✕</span> Struggle to explain patterns in interviews</li>
                <li><span className="dp-ic">✕</span> Every tutorial uses Pizza or Animal classes</li>
                <li><span className="dp-ic">✕</span> No idea how patterns work with dependency injection</li>
              </ul>
            </div>
            <div className="dp-ba-card dp-after">
              <h3>After</h3>
              <ul>
                <li><span className="dp-ic">✔</span> Choose the right pattern in minutes</li>
                <li><span className="dp-ic">✔</span> Refactor messy code into clean, maintainable architecture</li>
                <li><span className="dp-ic">✔</span> Know exactly when to use - and when NOT to use - each one</li>
                <li><span className="dp-ic">✔</span> Speak confidently about patterns in any interview</li>
                <li><span className="dp-ic">✔</span> Have production-ready C# code with unit tests you can adapt</li>
                <li><span className="dp-ic">✔</span> Master advanced variants (Fluent/Step Builder, Scrutor, MediatR, keyed DI)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="dp-divider"></div>

      {/* 7. THE 10 PATTERNS */}
      <section id="dp-patterns">
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">The system</span>
            <h2 className="dp-sec-title">10 patterns. Real problems. Real code.</h2>
            <p className="dp-sec-sub">Each pattern starts with a real-world problem you&apos;d actually hit in production - then the solution, the UML, the advanced variants, unit tests, and when NOT to use it.</p>
          </div>

          {/* Group A */}
          <p className="dp-eyebrow dp-center" style={{ marginBottom: 22 }}>The foundational five</p>
          <div className="dp-patterns dp-reveal">
            <div className="dp-pat-card">
              <div className="dp-pat-ico">🧱</div>
              <div className="dp-pat-num">PATTERN 01</div>
              <h3>Builder <span className="dp-amber">Pattern</span></h3>
              <p>Stop creating objects with <span className="dp-amber">10-parameter constructors</span>. From basic to Fluent, Director, Nested, FluentValidation, and a Step Builder the compiler enforces.</p>
              <div className="dp-tags">
                <span className="dp-tag">Fluent Builder</span><span className="dp-tag">Director Class</span><span className="dp-tag">Step Builder</span><span className="dp-tag">FluentValidation</span><span className="dp-tag">Test Data Builder</span>
              </div>
            </div>
            <div className="dp-pat-card">
              <div className="dp-pat-ico">🎨</div>
              <div className="dp-pat-num">PATTERN 02</div>
              <h3>Decorator <span className="dp-amber">Pattern</span></h3>
              <p>Add caching, logging, or retry <span className="dp-amber">without touching the original class</span>. Compose the onion in DI with Scrutor, Polly resilience, and HybridCache.</p>
              <div className="dp-tags">
                <span className="dp-tag">Scrutor + DI</span><span className="dp-tag">Polly v8</span><span className="dp-tag">HybridCache</span><span className="dp-tag">Cross-cutting concerns</span>
              </div>
            </div>
            <div className="dp-pat-card">
              <div className="dp-pat-ico">⚡</div>
              <div className="dp-pat-num">PATTERN 03</div>
              <h3>Strategy <span className="dp-amber">Pattern</span></h3>
              <p>Swap algorithms at runtime <span className="dp-amber">without if-else chains</span>. Keyed DI, a factory for dynamic choice, and configuration-based selection.</p>
              <div className="dp-tags">
                <span className="dp-tag">Keyed DI (.NET 8)</span><span className="dp-tag">Strategy + Factory</span><span className="dp-tag">Config selection</span><span className="dp-tag">Lifetimes</span>
              </div>
            </div>
            <div className="dp-pat-card">
              <div className="dp-pat-ico">🔌</div>
              <div className="dp-pat-num">PATTERN 04</div>
              <h3>Adapter <span className="dp-amber">Pattern</span></h3>
              <p>Integrate third-party APIs and legacy systems <span className="dp-amber">without rewriting everything</span>. Object vs Class adapters, error translation, a cloud-agnostic storage layer.</p>
              <div className="dp-tags">
                <span className="dp-tag">Object vs Class</span><span className="dp-tag">Cloud Providers</span><span className="dp-tag">Error translation</span><span className="dp-tag">Legacy wrapping</span>
              </div>
            </div>
            <div className="dp-pat-card dp-span2">
              <div className="dp-pat-ico">🚀</div>
              <div className="dp-pat-num">PATTERN 05</div>
              <h3>Mediator <span className="dp-amber">Pattern</span></h3>
              <p>Decouple components and <span className="dp-amber">orchestrate communication cleanly</span>. From a basic mediator to MediatR with validation, transaction, and logging pipeline behaviors — plus an honest take on licensing.</p>
              <div className="dp-tags">
                <span className="dp-tag">MediatR pipelines</span><span className="dp-tag">Transaction behavior</span><span className="dp-tag">Notifications</span><span className="dp-tag">Source-generated alt</span>
              </div>
            </div>
          </div>

          {/* Group B */}
          <p className="dp-eyebrow dp-center" style={{ margin: '48px 0 22px' }}>Five more that ship real systems</p>
          <div className="dp-patterns dp-reveal">
            <div className="dp-pat-card">
              <div className="dp-pat-ico">🛤️</div>
              <div className="dp-pat-num">PATTERN 06</div>
              <h3>Result <span className="dp-amber">Pattern</span></h3>
              <p>Model expected failures as <span className="dp-amber">values, not exceptions</span>. Railway-oriented Bind/Map/Match — including async — and clean ProblemDetails responses.</p>
              <div className="dp-tags">
                <span className="dp-tag">Railway-oriented</span><span className="dp-tag">Async Bind/Map</span><span className="dp-tag">ProblemDetails</span><span className="dp-tag">ErrorOr / FluentResults</span>
              </div>
            </div>
            <div className="dp-pat-card">
              <div className="dp-pat-ico">🔗</div>
              <div className="dp-pat-num">PATTERN 07</div>
              <h3>Pipeline <span className="dp-amber">/ Chain of Responsibility</span></h3>
              <p>The pattern <span className="dp-amber">behind ASP.NET middleware</span>. Build your own typed, async pipeline of focused handlers that each decide whether to continue.</p>
              <div className="dp-tags">
                <span className="dp-tag">ASP.NET middleware</span><span className="dp-tag">Async chain</span><span className="dp-tag">MediatR behaviors</span><span className="dp-tag">Short-circuit</span>
              </div>
            </div>
            <div className="dp-pat-card">
              <div className="dp-pat-ico">🔎</div>
              <div className="dp-pat-num">PATTERN 08</div>
              <h3>Specification <span className="dp-amber">Pattern</span></h3>
              <p>Stop drowning the repository in query methods. <span className="dp-amber">Composable rules that translate to EF Core SQL</span> — done with parameter rebinding, not the Invoke trick that throws.</p>
              <div className="dp-tags">
                <span className="dp-tag">EF Core translation</span><span className="dp-tag">And / Or / Not</span><span className="dp-tag">ExpressionVisitor</span><span className="dp-tag">Ardalis.Specification</span>
              </div>
            </div>
            <div className="dp-pat-card">
              <div className="dp-pat-ico">🏭</div>
              <div className="dp-pat-num">PATTERN 09</div>
              <h3>Factory <span className="dp-amber">Patterns</span></h3>
              <p>Stop welding code to <span className="dp-amber">concrete types with <code>new</code></span>. Factory Method, Abstract Factory, and the modern .NET way — keyed DI, factory delegates, ActivatorUtilities.</p>
              <div className="dp-tags">
                <span className="dp-tag">Keyed DI</span><span className="dp-tag">ActivatorUtilities</span><span className="dp-tag">Func&lt;T&gt;</span><span className="dp-tag">IHttpClientFactory</span>
              </div>
            </div>
            <div className="dp-pat-card dp-span2">
              <div className="dp-pat-ico">🚦</div>
              <div className="dp-pat-num">PATTERN 10</div>
              <h3>State <span className="dp-amber">Pattern</span></h3>
              <p>Kill the <span className="dp-amber">boolean soup</span> of IsPaid/IsShipped flags. Model a lifecycle so illegal transitions are impossible — guarded enums, class-per-state, optimistic concurrency, and Stateless for big workflows.</p>
              <div className="dp-tags">
                <span className="dp-tag">Guarded transitions</span><span className="dp-tag">Class-per-state</span><span className="dp-tag">Optimistic concurrency</span><span className="dp-tag">Stateless library</span>
              </div>
            </div>
          </div>

          <div className="dp-center" style={{ marginTop: 40 }}>
            <a href={CHECKOUT_URL} className="dp-btn dp-btn-primary lemonsqueezy-button">Get the Ebook - $32.99 →</a>
          </div>
        </div>
      </section>

      <div className="dp-divider"></div>

      {/* 7.5 AI TUTOR SECTION */}
      <section id="dp-ai">
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">Built-in AI</span>
            <h2 className="dp-sec-title">AI tools, not one static PDF</h2>
            <p className="dp-sec-sub">Most pattern books are static. This one ships with a suite of AI tools — three free for everyone, plus a tutor that knows the book. Try the free one right here.</p>
          </div>

          <div className="dp-ai-grid dp-reveal">
            {/* LIVE Pattern Picker */}
            <div className="dp-ai-panel dp-ai-live">
              <div className="dp-ai-head">
                <span className="dp-ai-pill">{MS} Free · live demo</span>
              </div>
              <h3>Pattern Picker</h3>
              <p className="dp-ai-sub">Describe a real problem in your C#/.NET code and get the right pattern in seconds — every result links to a full tutorial, and to the book chapter where one exists.</p>
              <PatternPicker />
            </div>

            {/* Ask the Book — static preview */}
            <div className="dp-ai-panel">
              <div className="dp-ai-head">
                <span className="dp-ai-pill dp-ai-owner">🔒 For book owners</span>
              </div>
              <h3>Ask the Book</h3>
              <p className="dp-ai-sub">An AI tutor that answers strictly from the book — production-grade, cited by chapter. Not generic internet code. Here&apos;s what a real answer looks like:</p>

              <div className="dp-ai-window">
                <div className="dp-ai-bar"><i></i><i></i><i></i><span>ask-the-book</span></div>
                <div className="dp-ai-chat">
                  <div className="dp-ai-msg dp-ai-q">Should I throw or return a Result when shipping an order that&apos;s already shipped?</div>
                  <div className="dp-ai-msg dp-ai-a">
                    Return a <code>Result</code>. &quot;Already shipped&quot; is an <em>expected</em> outcome a user can trigger, so model it as a value and map it to a <code>409 Conflict</code> — keep <code>throw</code> for true invariant violations. In the State chapter the guarded transition returns <code>Result.Failure</code> and the endpoint uses <code>Match</code> to pick the status code.
                    <span className="dp-ai-cite">📖 Cited: <b>State</b> · <b>Result</b> chapters</span>
                  </div>
                  <div className="dp-ai-msg dp-ai-q">And how do I keep two requests from shipping it twice?</div>
                  <div className="dp-ai-msg dp-ai-a">
                    Add optimistic concurrency — a <code>[Timestamp]</code> rowversion — and handle <code>DbUpdateConcurrencyException</code>. The in-memory guard stops illegal transitions; the rowversion stops <em>concurrent</em> ones.
                    <span className="dp-ai-cite">📖 Cited: <b>State</b> chapter</span>
                  </div>
                </div>
              </div>
              <a href="/tools/ask-the-book" className="dp-flow-link" style={{ marginTop: 16, display: 'inline-flex' }}>Owners: open Ask the Book →</a>
            </div>
          </div>

          <div className="dp-center" style={{ marginTop: 26 }}>
            <p className="dp-ai-foot" style={{ textAlign: 'center', marginBottom: 14 }}>
              Three free AI tools for everyone · Ask the Book unlocks when you own it.
            </p>
            <div className="dp-cta" style={{ justifyContent: 'center' }}>
              <a href="/playground" className="dp-btn dp-btn-ghost">▶️ C# Playground (soon)</a>
              <a href="/tools/pattern-comparison" className="dp-btn dp-btn-ghost">⚖️ Pattern Comparison</a>
              <a href="/tools/interview-quiz" className="dp-btn dp-btn-ghost">🎯 Interview Quiz</a>
              <a href="/tools" className="dp-btn dp-btn-ghost">All AI tools →</a>
            </div>
          </div>
        </div>
      </section>

      <div className="dp-divider"></div>

      {/* 8. EVERYTHING YOU GET */}
      <section id="dp-included">
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">The full package</span>
            <h2 className="dp-sec-title">You don&apos;t just get a PDF</h2>
            <p className="dp-sec-sub">Everything you need to understand, apply, and explain design patterns in real .NET projects.</p>
          </div>
          <div className="dp-eg-grid dp-reveal">
            <div className="dp-eg-card">
              <div className="dp-eg-ico">📘</div><h3>The Ebook</h3>
              <ul>
                <li><span className="dp-ic">✔</span> 10 patterns, problem to production</li>
                <li><span className="dp-ic">✔</span> Real scenarios + unit tests, no toy classes</li>
                <li><span className="dp-ic">✔</span> UML/Mermaid diagrams &amp; trade-offs</li>
                <li><span className="dp-ic">✔</span> Pros, cons &amp; when NOT to use</li>
              </ul>
            </div>
            <div className="dp-eg-card">
              <div className="dp-eg-ico">💻</div><h3>GitHub Repository</h3>
              <ul>
                <li><span className="dp-ic">✔</span> 20 mini-projects, complete C#</li>
                <li><span className="dp-ic">✔</span> Clone, run, and modify instantly</li>
                <li><span className="dp-ic">✔</span> Every pattern variation implemented</li>
                <li><span className="dp-ic">✔</span> Bonus: code in 4 more languages</li>
              </ul>
            </div>
            <div className="dp-eg-card">
              <div className="dp-eg-ico">🤖</div><h3>AI Tutor — Ask the Book</h3>
              <ul>
                <li><span className="dp-ic">✔</span> Answers strictly from the book</li>
                <li><span className="dp-ic">✔</span> Cited by chapter, production-grade</li>
                <li><span className="dp-ic">✔</span> Plus the free Pattern Picker</li>
                <li><span className="dp-ic">✔</span> Read online with AI on every example</li>
              </ul>
            </div>
            <div className="dp-eg-card">
              <div className="dp-eg-ico">🎯</div><h3>Interview Prep Ebook</h3>
              <ul>
                <li><span className="dp-ic">✔</span> 100 design pattern questions</li>
                <li><span className="dp-ic">✔</span> Detailed answers with code</li>
                <li><span className="dp-ic">✔</span> Covers all major GoF patterns</li>
                <li><span className="dp-ic">✔</span> Built for senior-level interviews</li>
              </ul>
            </div>
          </div>

          <div className="dp-bonus-grid dp-reveal" style={{ marginTop: 32 }}>
            <div className="dp-bonus-card">
              <div className="dp-gift">📖</div>
              <h3>EPUB + Web Reader</h3>
              <p>Read on any device, or online with copyable code and an AI tutor on every example.</p>
            </div>
            <div className="dp-bonus-card">
              <div className="dp-gift">⚡</div>
              <h3>Quick-Reference Guide</h3>
              <p>A pattern decision cheat sheet: when to use vs. when not to, DI integration at a glance.</p>
            </div>
            <div className="dp-bonus-card">
              <div className="dp-gift">📄</div>
              <h3>100 Interview Q&amp;As</h3>
              <p>With a working code example behind every single answer.</p>
            </div>
          </div>
          <p className="dp-bonus-foot dp-reveal">Ebook + repo + AI tutor + interview prep + cheat sheets + EPUB · <b>all for $32.99</b></p>
        </div>
      </section>

      <div className="dp-divider"></div>

      {/* 9. TESTIMONIALS */}
      <section id="dp-proof">
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">Proof</span>
            <h2 className="dp-sec-title">{config.EbookCopiesNumber}+ developers already use these patterns</h2>
            <p className="dp-sec-sub">Real feedback from engineers - from juniors to Microsoft MVPs - who put this ebook to work.</p>
          </div>

          <EbookNewsletter />

          <div className="dp-tg dp-reveal">
            <div className="dp-tcard">
              <span className="dp-stars">★★★★★</span>
              <p className="dp-q">&quot;Design Patterns ebook is a quick and enjoyable read about the most important design patterns in C#. The examples were refreshing, and I especially liked being able to access the source code. If you&apos;re just starting or need a refresher, this book will be your design patterns companion.&quot;</p>
              <div className="dp-who"><div className="dp-av">MJ</div><div><div className="dp-nm">Milan Jovanović</div><div className="dp-rl">Microsoft MVP</div></div></div>
            </div>
            <div className="dp-tcard">
              <span className="dp-stars">★★★★★</span>
              <p className="dp-q">&quot;I love the simplicity of how every pattern is explained. The real-life examples are an incredible way to provide context and understand why we are choosing this pattern. By providing the writer&apos;s point of view we can evaluate the pros and cons and decide which is better for our particular use case.&quot;</p>
              <div className="dp-who"><div className="dp-av">RA</div><div><div className="dp-nm">Raul Fernando Aillon Salinas</div><div className="dp-rl">Software Developer</div></div></div>
            </div>
            <div className="dp-tcard">
              <span className="dp-stars">★★★★★</span>
              <p className="dp-q">&quot;This ebook shows that good technical information doesn&apos;t have to be buried in hundreds of pages of fluff. Exactly what a developer wants to read - core information on what a specific technology is about and how to apply it.&quot;</p>
              <div className="dp-who"><div className="dp-av">JO</div><div><div className="dp-nm">Jeroen Opmeer</div><div className="dp-rl">C#/.NET Senior Developer</div></div></div>
            </div>
            <div className="dp-tcard">
              <span className="dp-stars">★★★★★</span>
              <p className="dp-q">&quot;Each pattern is explained step by step, with access to a GitHub repository, making it easy for everyone to grasp the material. A genuinely practical take on design patterns in C#.&quot;</p>
              <div className="dp-who"><div className="dp-av">NK</div><div><div className="dp-nm">Nikola Knezević</div><div className="dp-rl">Software Developer, Content Creator</div></div></div>
            </div>
            <div className="dp-tcard">
              <span className="dp-stars">★★★★★</span>
              <p className="dp-q">&quot;It&apos;s amazing, with nice visualization which helps a lot for a better understanding of how patterns work. One of the points I like is mentioning the Pros and Cons - they help you decide which pattern is suitable for your case.&quot;</p>
              <div className="dp-who"><div className="dp-av">SE</div><div><div className="dp-nm">Saeed Esmaeelinejad</div><div className="dp-rl">Senior Software Engineer</div></div></div>
            </div>
            <div className="dp-tcard">
              <span className="dp-stars">★★★★★</span>
              <p className="dp-q">&quot;This book is a very fun and interesting way to get into the world of design patterns. It also has everything you need to start applying those patterns in your application. Highly recommended.&quot;</p>
              <div className="dp-who"><div className="dp-av">SM</div><div><div className="dp-nm">Stefan Milošević</div><div className="dp-rl">Senior Software Engineer</div></div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="dp-divider"></div>

      {/* 10. ABOUT */}
      <section>
        <div className="dp-wrap dp-about">
          <div className="dp-reveal">
            <div className="dp-media-frame"><Image src="/images/ebook-stefan.webp" alt="Stefan Đokić, Microsoft MVP and author of Design Patterns that Deliver" width={0} height={0} sizes="(max-width:860px) 100vw, 360px" style={{ width: '100%', height: 'auto', display: 'block' }} /></div>
          </div>
          <div className="dp-reveal">
            <span className="dp-mvp-pill">{MS} Microsoft MVP</span>
            <h2>Written by a developer, for developers.</h2>
            <p>Hi, I&apos;m <b>Stefan Đokić</b> - Microsoft MVP and Senior Software Engineer with years of experience building production .NET systems.</p>
            <p>I wrote this ebook because I was frustrated with pattern books that use toy examples. <b>Every pattern in this book comes from a real problem I&apos;ve solved in production code</b> - not Pizza classes, not abstract shapes.</p>
            <p>I teach {config.NewsletterSubCount} through my newsletter, and {config.LinkedinFollowers} follow my content on LinkedIn.</p>
            <div className="dp-about-stats">
              <div><div className="dp-v">20,000+</div><div className="dp-l">Newsletter</div></div>
              <div><div className="dp-v">102k+</div><div className="dp-l">LinkedIn</div></div>
              <div><div className="dp-v">8,000+</div><div className="dp-l">Twitter / X</div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="dp-divider"></div>

      {/* 11. PRICING */}
      <section id="dp-pricing">
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">One simple price</span>
            <h2 className="dp-sec-title">Everything, for less than a lunch out.</h2>
          </div>
          <div className="dp-pricing dp-reveal">
            <div className="dp-price-card">
              <h3>Design Patterns that Deliver</h3>
              <p className="dp-psub">Ebook + GitHub repo + AI tutor + interview prep + cheat sheets</p>
              <div className="dp-amt"><span className="dp-now">$32.99</span></div>
              <p className="dp-save">One-time payment · lifetime access · no subscription</p>
              <ul>
                <li><span className="dp-ic">✔</span> The full ebook in PDF + EPUB</li>
                <li><span className="dp-ic">✔</span> 10 patterns (5 foundational + 5 production)</li>
                <li><span className="dp-ic">✔</span> GitHub repo: 20 runnable mini-projects</li>
                <li><span className="dp-ic">✔</span> Ask-the-Book AI tutor, cited by chapter</li>
                <li><span className="dp-ic">✔</span> 100 interview questions &amp; answers</li>
                <li><span className="dp-ic">✔</span> Quick-reference pattern decision guide</li>
                <li><span className="dp-ic">✔</span> Lifetime access + all future updates</li>
              </ul>
              <a href={CHECKOUT_URL} className="dp-btn dp-btn-primary lemonsqueezy-button">Get the Ebook - $32.99 →</a>
              <p className="dp-grt">Instant download · Secure checkout via Lemon Squeezy</p>
            </div>
            <div className="dp-why">
              <h3>Why developers buy this</h3>
              <div className="dp-why-item"><span className="dp-ic">⚡</span><div><div className="dp-t">Instant access</div><div className="dp-d">Download the ebook and clone the repo seconds after checkout.</div></div></div>
              <div className="dp-why-item"><span className="dp-ic">💻</span><div><div className="dp-t">Real, runnable code</div><div className="dp-d">20 mini-projects you can open, run, and adapt today.</div></div></div>
              <div className="dp-why-item"><span className="dp-ic">🤖</span><div><div className="dp-t">An AI tutor that knows it</div><div className="dp-d">Ask the Book answers from these exact chapters, cited.</div></div></div>
              <div className="dp-why-item"><span className="dp-ic">🔁</span><div><div className="dp-t">Lifetime updates</div><div className="dp-d">Buy once, get every future update to the book and code free.</div></div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="dp-divider"></div>

      {/* 12. FIT CHECK */}
      <section>
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">Honest fit check</span>
            <h2 className="dp-sec-title">Is this ebook right for you?</h2>
          </div>
          <div className="dp-fit dp-reveal">
            <div className="dp-fit-card dp-no">
              <h3>Probably not, if you…</h3>
              <ul>
                <li><span className="dp-ic">✕</span> Are a complete beginner still learning C# basics</li>
                <li><span className="dp-ic">✕</span> Want a reference for all 23 GoF patterns</li>
                <li><span className="dp-ic">✕</span> Prefer abstract theory over practical code</li>
                <li><span className="dp-ic">✕</span> Are looking for language-agnostic content only</li>
              </ul>
            </div>
            <div className="dp-fit-card dp-yes">
              <h3>Built for developers who…</h3>
              <ul>
                <li><span className="dp-ic">✔</span> Are .NET / C# developers (mid-level or senior)</li>
                <li><span className="dp-ic">✔</span> Know what patterns are but struggle to apply them</li>
                <li><span className="dp-ic">✔</span> Want production-ready code with tests, not textbook theory</li>
                <li><span className="dp-ic">✔</span> Are preparing for senior-level interviews</li>
                <li><span className="dp-ic">✔</span> Want cleaner, more maintainable architecture</li>
                <li><span className="dp-ic">✔</span> Lead a team and want patterns everyone can adopt</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="dp-divider"></div>

      {/* 13. FULL TABLE OF CONTENTS */}
      <section id="dp-toc">
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">The full table of contents</span>
            <h2 className="dp-sec-title">Exactly what&apos;s inside</h2>
            <p className="dp-sec-sub">Click any pattern to expand. Every chapter follows the same problem → solution → advanced variants → tests → when-not-to-use flow.</p>
          </div>
          <div className="dp-acc dp-acc-2 dp-reveal">
            <details open>
              <summary>🧱 Builder Pattern <span className="dp-meta">9 topics</span><span className="dp-tog">+</span></summary>
              <div className="dp-acc-body">
                <div className="dp-lesson">Record + required vs. a builder</div>
                <div className="dp-lesson">Classic, Fluent &amp; Director</div>
                <div className="dp-lesson">Nested builders (config lambdas)</div>
                <div className="dp-lesson">Step Builder (compiler-enforced)</div>
                <div className="dp-lesson">FluentValidation in Build()</div>
                <div className="dp-lesson">Test Data Builders + a real test</div>
                <div className="dp-lesson">Thread-safety &amp; trade-offs</div>
                <div className="dp-lesson">Pros &amp; Cons</div>
                <div className="dp-lesson">When NOT to Use It</div>
              </div>
            </details>
            <details>
              <summary>🎨 Decorator Pattern <span className="dp-meta">8 topics</span><span className="dp-tog">+</span></summary>
              <div className="dp-acc-body">
                <div className="dp-lesson">Coffee → cross-cutting concerns</div>
                <div className="dp-lesson">Caching, logging, Polly resilience</div>
                <div className="dp-lesson">Match retry to real exceptions</div>
                <div className="dp-lesson">HybridCache &amp; stampede</div>
                <div className="dp-lesson">Composing the onion with Scrutor</div>
                <div className="dp-lesson">Captive-dependency lifetime trap</div>
                <div className="dp-lesson">Testing + Pros &amp; Cons</div>
                <div className="dp-lesson">When NOT to Use It</div>
              </div>
            </details>
            <details>
              <summary>⚡ Strategy Pattern <span className="dp-meta">8 topics</span><span className="dp-tog">+</span></summary>
              <div className="dp-acc-body">
                <div className="dp-lesson">From if-else to a family of classes</div>
                <div className="dp-lesson">Strategy vs. domain polymorphism</div>
                <div className="dp-lesson">Keyed DI (.NET 8) + lifetimes</div>
                <div className="dp-lesson">A factory for dynamic choice</div>
                <div className="dp-lesson">Real case: payment gateways</div>
                <div className="dp-lesson">Strategy + Decorator</div>
                <div className="dp-lesson">Config-driven selection + test</div>
                <div className="dp-lesson">Pros, Cons &amp; when NOT to use</div>
              </div>
            </details>
            <details>
              <summary>🔌 Adapter Pattern <span className="dp-meta">8 topics</span><span className="dp-tog">+</span></summary>
              <div className="dp-acc-body">
                <div className="dp-lesson">Legacy payment gateway</div>
                <div className="dp-lesson">Object vs Class adapter</div>
                <div className="dp-lesson">Error translation</div>
                <div className="dp-lesson">Cloud-agnostic storage (S3/Azure)</div>
                <div className="dp-lesson">Stream ownership &amp; lifetimes</div>
                <div className="dp-lesson">When an adapter &quot;lies&quot;</div>
                <div className="dp-lesson">Testing + Pros &amp; Cons</div>
                <div className="dp-lesson">When NOT to Use It</div>
              </div>
            </details>
            <details>
              <summary>🚀 Mediator Pattern <span className="dp-meta">9 topics</span><span className="dp-tog">+</span></summary>
              <div className="dp-acc-body">
                <div className="dp-lesson">Chatroom → MediatR</div>
                <div className="dp-lesson">Request / response handlers</div>
                <div className="dp-lesson">Validation behavior (ValidateAsync)</div>
                <div className="dp-lesson">Transaction behavior</div>
                <div className="dp-lesson">Notifications &amp; publisher strategy</div>
                <div className="dp-lesson">Testing a behavior</div>
                <div className="dp-lesson">Licensing &amp; source-generated alts</div>
                <div className="dp-lesson">Pros &amp; Cons</div>
                <div className="dp-lesson">When NOT to Use It</div>
              </div>
            </details>
            <details>
              <summary>🛤️ Result Pattern <span className="dp-meta">9 topics</span><span className="dp-tog">+</span></summary>
              <div className="dp-acc-body">
                <div className="dp-lesson">Exceptions for the non-exceptional</div>
                <div className="dp-lesson">Minimal Result&lt;T&gt; + non-generic</div>
                <div className="dp-lesson">Railway: Bind / Map / Match</div>
                <div className="dp-lesson">Async railway (the part most skip)</div>
                <div className="dp-lesson">Aggregating validation errors</div>
                <div className="dp-lesson">Mapping to ProblemDetails</div>
                <div className="dp-lesson">Benchmark: throw vs. Result</div>
                <div className="dp-lesson">Pros &amp; Cons</div>
                <div className="dp-lesson">When NOT to Use It</div>
              </div>
            </details>
            <details>
              <summary>🔗 Chain of Responsibility &amp; Pipelines <span className="dp-meta">9 topics</span><span className="dp-tog">+</span></summary>
              <div className="dp-acc-body">
                <div className="dp-lesson">CoR vs. Pipeline</div>
                <div className="dp-lesson">ASP.NET middleware as the pattern</div>
                <div className="dp-lesson">A typed, async domain pipeline</div>
                <div className="dp-lesson">Compose once; terminal handler</div>
                <div className="dp-lesson">Short-circuiting</div>
                <div className="dp-lesson">Relationship to MediatR behaviors</div>
                <div className="dp-lesson">Testing a handler</div>
                <div className="dp-lesson">Pros &amp; Cons</div>
                <div className="dp-lesson">When NOT to Use It</div>
              </div>
            </details>
            <details>
              <summary>🔎 Specification Pattern <span className="dp-meta">9 topics</span><span className="dp-tog">+</span></summary>
              <div className="dp-acc-body">
                <div className="dp-lesson">The repository method explosion</div>
                <div className="dp-lesson">An EF-translatable specification</div>
                <div className="dp-lesson">Composing with an ExpressionVisitor</div>
                <div className="dp-lesson">Using it against EF Core</div>
                <div className="dp-lesson">Proving it&apos;s real SQL</div>
                <div className="dp-lesson">One rule, two uses (+ test)</div>
                <div className="dp-lesson">Includes / paging (Ardalis)</div>
                <div className="dp-lesson">Pros &amp; Cons</div>
                <div className="dp-lesson">When NOT to Use It</div>
              </div>
            </details>
            <details>
              <summary>🏭 Factory Patterns <span className="dp-meta">9 topics</span><span className="dp-tog">+</span></summary>
              <div className="dp-acc-body">
                <div className="dp-lesson">`new` welds you to a type</div>
                <div className="dp-lesson">IHttpClientFactory in the BCL</div>
                <div className="dp-lesson">Factory Method &amp; Abstract Factory</div>
                <div className="dp-lesson">Keyed DI + a thin factory</div>
                <div className="dp-lesson">Func&lt;T&gt; &amp; ActivatorUtilities</div>
                <div className="dp-lesson">The captive-dependency trap</div>
                <div className="dp-lesson">Testing a factory</div>
                <div className="dp-lesson">Pros &amp; Cons</div>
                <div className="dp-lesson">When NOT to Use It</div>
              </div>
            </details>
            <details>
              <summary>🚦 State Pattern <span className="dp-meta">9 topics</span><span className="dp-tog">+</span></summary>
              <div className="dp-acc-body">
                <div className="dp-lesson">Boolean soup &amp; illegal transitions</div>
                <div className="dp-lesson">Guarded transitions (one guard)</div>
                <div className="dp-lesson">Throw vs. return a Result</div>
                <div className="dp-lesson">Class-per-state (singletons)</div>
                <div className="dp-lesson">Optimistic concurrency (rowversion)</div>
                <div className="dp-lesson">Entry/exit actions &amp; Stateless</div>
                <div className="dp-lesson">Testing illegal transitions</div>
                <div className="dp-lesson">Pros &amp; Cons</div>
                <div className="dp-lesson">When NOT to Use It</div>
              </div>
            </details>
            <details>
              <summary>🎯 Bonus: Interview Prep <span className="dp-meta">3 topics</span><span className="dp-tog">+</span></summary>
              <div className="dp-acc-body">
                <div className="dp-lesson">100 Design Pattern Interview Questions</div>
                <div className="dp-lesson">Detailed Answers with Explanations</div>
                <div className="dp-lesson">Covers All Major GoF Patterns</div>
              </div>
            </details>
            <details>
              <summary>🤖 Bonus: AI Tutor &amp; Web Reader <span className="dp-meta">3 topics</span><span className="dp-tog">+</span></summary>
              <div className="dp-acc-body">
                <div className="dp-lesson">Ask the Book — answers cited by chapter</div>
                <div className="dp-lesson">Free Pattern Picker for any problem</div>
                <div className="dp-lesson">Read online with copyable code</div>
              </div>
            </details>
          </div>
        </div>
      </section>

      <div className="dp-divider"></div>

      {/* 14. FAQ */}
      <section id="dp-faq">
        <div className="dp-wrap">
          <div className="dp-sec-head dp-center dp-reveal">
            <span className="dp-eyebrow dp-center">Questions</span>
            <h2 className="dp-sec-title">Frequently asked questions</h2>
          </div>
          <div className="dp-acc dp-reveal">
            <details open><summary>Which patterns does the book cover?<span className="dp-tog">+</span></summary><div className="dp-acc-body"><p>Ten production patterns in modern C#: five foundational ones - Builder, Decorator, Strategy, Adapter, Mediator - plus five that ship real systems - Result, Pipeline (Chain of Responsibility), Specification, Factory, and State. Each goes from a real problem to working code with unit tests, trade-offs, and when-not-to-use guidance.</p></div></details>
            <details><summary>What are the AI tools, and which are free?<span className="dp-tog">+</span></summary><div className="dp-acc-body"><p>Two. The <strong>Pattern Picker</strong> is free for everyone - describe a problem and get the right C#/.NET pattern with a tutorial link. <strong>Ask the Book</strong> is an AI tutor for owners that answers strictly from the book, cited by chapter - accurate, production-grade, not generic internet code. You can try the Pattern Picker live on this page.</p></div></details>
            <details><summary>Are design patterns still relevant in modern .NET?<span className="dp-tog">+</span></summary><div className="dp-acc-body"><p>Absolutely. MediatR (Mediator), Scrutor (Decorator), Polly (resilience), IHttpClientFactory (Factory), keyed DI, and ASP.NET middleware (Chain of Responsibility) are all pattern implementations used daily in production .NET around dependency injection, pipelines, and Clean Architecture.</p></div></details>
            <details><summary>How is this different from other design patterns books?<span className="dp-tog">+</span></summary><div className="dp-acc-body"><p>Most pattern books explain theory with abstract examples (Pizza, Animal, Shape classes). This ebook starts every pattern with a real production problem, shows the solution in C# with unit tests and trade-offs, then explores advanced variants. You also get a GitHub repo with 20 runnable mini-projects and a built-in AI tutor.</p></div></details>
            <details><summary>What knowledge level do I need?<span className="dp-tog">+</span></summary><div className="dp-acc-body"><p>You should be comfortable with C# and basic .NET development. The ebook is designed for intermediate to senior developers who know the language but want to level up their architecture and design skills. It&apos;s not for absolute beginners.</p></div></details>
            <details><summary>Do I get code I can use in my own projects?<span className="dp-tog">+</span></summary><div className="dp-acc-body"><p>Yes. You get full access to a GitHub repository with 20 mini-projects - one for each pattern and each advanced variant. The code is structured, documented, and ready to clone, run, and adapt.</p></div></details>
            <details><summary>What formats does the ebook come in?<span className="dp-tog">+</span></summary><div className="dp-acc-body"><p>You get PDF and EPUB, plus a web reader so you can read online with copyable code and the AI tutor on every example. Both light and dark modes are included.</p></div></details>
            <details><summary>Is there a refund policy?<span className="dp-tog">+</span></summary><div className="dp-acc-body"><p>The ebook is a digital product delivered instantly. If you&apos;re not satisfied, reach out directly and we&apos;ll work it out. {config.EbookCopiesNumber}+ developers have purchased it and the feedback has been overwhelmingly positive.</p></div></details>
          </div>
        </div>
      </section>

      {/* 15. FINAL CTA */}
      <section className="dp-final">
        <div className="dp-wrap dp-reveal">
          <span className="dp-eyebrow dp-center">Stop reading about patterns. Start shipping them.</span>
          <h2>Real C# code you can apply in your next PR.</h2>
          <a href={CHECKOUT_URL} className="dp-btn dp-btn-primary lemonsqueezy-button">Get the Ebook - $32.99 →</a>
          <p className="dp-reassure" style={{ justifyContent: 'center', marginTop: 18 }}>Instant download · PDF + EPUB · GitHub repo · AI tutor · {config.EbookCopiesNumber}+ copies sold</p>
        </div>
      </section>

      {/* 16. STICKY BOTTOM CTA */}
      <div className="dp-stickybar" id="dp-stickybar">
        <div className="dp-wrap dp-sb-row">
          <div className="dp-sb-info">
            <span className="dp-sb-nm">Design Patterns that Deliver</span>
            <span className="dp-sb-cd">10 patterns + AI tutor · instant download</span>
          </div>
          <div className="dp-sb-right">
            <span className="dp-sb-pr">$32.99</span>
            <a href={CHECKOUT_URL} className="dp-btn dp-btn-primary lemonsqueezy-button">Get it</a>
          </div>
        </div>
      </div>

      <Script id="design-patterns-page-js" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: PAGE_JS }} />
    </div>
  )
}

export default Ebook;
