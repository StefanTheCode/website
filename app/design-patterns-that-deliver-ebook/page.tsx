import config from '@/config.json'
import EbookNewsletter from '@/components/ebookTestimonials';
import EbookTestimonials2 from '@/components/ebook2Testimonials';
import { Metadata } from 'next';
import Image from 'next/image'
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: "Design Patterns that Deliver — Builder, Decorator, Strategy, Adapter & Mediator in C#",
  alternates: {
    canonical: 'https://thecodeman.net/design-patterns-that-deliver-ebook',
  },
  description: "Master 5 essential C# design patterns with real-world examples: Builder, Decorator, Strategy, Adapter, and Mediator. Includes advanced implementations, UML diagrams, GitHub repo, and 100 interview questions.",
  keywords: [
    'design patterns c#',
    'builder pattern c#',
    'decorator pattern c#',
    'strategy pattern c#',
    'adapter pattern c#',
    'mediator pattern c#',
    'MediatR',
    'c# design patterns examples',
    'design patterns .NET',
    'software design patterns',
    'design patterns interview questions',
    'fluent builder pattern',
    'clean architecture design patterns',
    'c# design patterns book',
    'gang of four patterns c#',
  ],
  openGraph: {
    title: "Design Patterns that Deliver — Builder, Decorator, Strategy, Adapter & Mediator in C#",
    type: "website",
    url: "https://thecodeman.net/design-patterns-that-deliver-ebook",
    description: "Master 5 essential C# design patterns with real-world examples: Builder, Decorator, Strategy, Adapter, and Mediator. Includes GitHub repo and 100 interview questions.",
    images: [
      {
        url: 'https://thecodeman.net/og-ebookimage2.png',
        width: "1000px",
        height: "700px"
      }
    ],
  },
  twitter: {
    title: "Design Patterns that Deliver — Builder, Decorator, Strategy, Adapter & Mediator in C#",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "Master 5 essential C# design patterns with real-world examples: Builder, Decorator, Strategy, Adapter, and Mediator. Includes GitHub repo and 100 interview questions.",
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
      name: 'Design Patterns that Deliver — Builder, Decorator, Strategy, Adapter & Mediator in C#',
      description:
        'Master 5 essential C# design patterns with real-world examples: Builder, Decorator, Strategy, Adapter, and Mediator. Includes GitHub repo and 100 interview questions.',
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
        'A practical ebook covering 5 essential design patterns in C# — Builder, Decorator, Strategy, Adapter, and Mediator — with real-world examples, UML diagrams, advanced implementations, a GitHub repository, and 100 interview questions.',
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
      ],
      url: 'https://thecodeman.net/design-patterns-that-deliver-ebook',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the Builder Pattern in C# and when should you use it?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Builder Pattern is a creational design pattern that separates the construction of a complex object from its representation. In C#, use it when you need to create objects with many optional parameters, avoid telescoping constructors, or build objects step by step. Common variants include Fluent Builder, Step Builder, and Director-based Builder.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the Decorator Pattern in C# and how does it work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Decorator Pattern is a structural design pattern that lets you attach new behaviors to objects by wrapping them in decorator classes. In C#, it is commonly used with dependency injection (Scrutor) to add cross-cutting concerns like logging, caching, or retry policies without modifying the original class.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the Strategy Pattern in C# and when should you use it?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Strategy Pattern is a behavioral design pattern that defines a family of algorithms, encapsulates each one, and makes them interchangeable. In C#, use it when you have multiple ways to perform an operation and want to select the algorithm at runtime, often combined with dependency injection or the Factory Pattern.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the Adapter Pattern in C# and when should you use it?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Adapter Pattern is a structural design pattern that allows incompatible interfaces to work together. In C#, use it when integrating third-party libraries or legacy code that has a different interface than what your application expects. It comes in two variants: Object Adapter (composition) and Class Adapter (inheritance).',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the Mediator Pattern in C# and how does MediatR implement it?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Mediator Pattern is a behavioral design pattern that reduces chaotic dependencies between objects by having them communicate through a mediator object. In C#, the MediatR library is the most popular implementation, providing request/response handling and pipeline behaviors for cross-cutting concerns like validation and logging in Clean Architecture.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which design patterns are most commonly asked in C# interviews?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The most commonly asked design patterns in C# interviews are Builder, Decorator, Strategy, Adapter, Mediator, Singleton, Factory, Observer, and Repository. This ebook includes a bonus mini-ebook with 100 design pattern interview questions and answers covering all of these.',
          },
        },
        {
          '@type': 'Question',
          name: 'What programming languages are covered in this design patterns ebook?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The primary examples are in C# with a complete GitHub repository of 20 mini-projects. Bonus code samples in 4 additional programming languages are also included, making it useful regardless of your tech stack.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to know all Gang of Four patterns before reading this book?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. This book focuses on the 5 most impactful and commonly used patterns from real-world experience. Each pattern is explained from scratch with real-world problems, solutions, UML diagrams, and advanced variations. It is accessible for intermediate developers and still valuable for experienced ones.',
          },
        },
      ],
    },
  ],
};

const Ebook = () => {
  return (
    <>
      <Script
        id="design-patterns-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section id="home-section" className="hero container">
        <div className="row d-md-flex no-gutters">
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 slider-text pt-5 float-left">
            <div className="text">
              <h1 className='display-none'>Design Patterns that Deliver</h1>
              <p className="header-text mt-4" style={{ marginBottom: 0, lineHeight: 1.1 }}>Stop <span className='text-yellow'>Guessing</span></p>
              <p className="header-text" style={{ marginTop: 0, lineHeight: 1.1 }}>Design Patterns.</p>
              <h2 className="mb-3 text-white">Start using the right one - with real C# code you can apply in your next PR.</h2>
              <p className="mb-4 text-white" style={{ fontSize: '1.15rem', opacity: 0.9 }}>5 battle-tested patterns. Real-world problems. Production-ready implementations. Plus a GitHub repo with 20 mini-projects and 100 interview Q&amp;As.</p>

              <div className="mb-4">
                <p className="text-white mb-1" style={{ fontSize: '0.95rem', opacity: 0.75 }}>By Stefan Djokic, Microsoft MVP &middot; {config.EbookCopiesNumber}+ copies sold</p>
              </div>

              <a href={CHECKOUT_URL} className="lemonsqueezy-button">
                <button className="btn btn-lg btn-primary border-radius-10px button-padding">
                  Get the Ebook + Real-World Examples - <span className='text-green'> $32.99</span>
                </button>
              </a>
            </div>
          </div>
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12 float-right">
            <Image src={'/images/ebook-thumb2.png'} priority={true} alt={'Design Patterns that Deliver - C# design patterns ebook cover'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
        <EbookTestimonials2 />
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          PROBLEM / PAIN
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="pain-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">You know the theory.</p>
              <p className="header-text"><span className='text-yellow'>But the code still looks wrong.</span></p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
              <h5 className='pt-3 text-white'>You&apos;ve read the Gang of Four. You&apos;ve watched YouTube tutorials. You can name patterns on a whiteboard.</h5>
              <h5 className='pt-3 text-white'>But when you open your IDE and face a real problem, you freeze:</h5>
              <div className='row'>
                <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 text-center'>
                  <h5 className='pt-3 text-white'>&bull; &quot;Should this be a Strategy or a Factory?&quot;</h5>
                  <h5 className='text-white'>&bull; &quot;Am I overengineering this with a Decorator?&quot;</h5>
                  <h5 className='text-white'>&bull; &quot;How does this pattern even work with DI?&quot;</h5>
                  <h5 className='text-white'>&bull; &quot;The example online is a Pizza class... how does that help me?&quot;</h5>
                  <h5 className='pt-3 text-white'>The gap between knowing a pattern and <span className='text-yellow'>using it in production</span> is massive.</h5>
                  <h5 className='text-white'>That&apos;s what this ebook closes.</h5>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
              <Image src={'/images/real-world-examples.png'} className='border-radius-20px' alt={'C# design patterns real-world implementation example'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          TRANSFORMATION / OUTCOMES
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="outcomes-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">What Changes <span className='text-yellow'>After You Read This</span></p>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(220, 53, 69, 0.08)', border: '1px solid rgba(220, 53, 69, 0.3)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className='text-danger text-center mb-4'><b>Before</b></h3>
                <h5 className='text-white'>&#10060; Copy-paste pattern examples from StackOverflow</h5>
                <h5 className='text-white'>&#10060; Can&apos;t decide which pattern fits the problem</h5>
                <h5 className='text-white'>&#10060; Overengineer simple features with wrong abstractions</h5>
                <h5 className='text-white'>&#10060; Struggle to explain patterns in interviews</h5>
                <h5 className='text-white'>&#10060; Every tutorial uses Pizza or Animal classes</h5>
                <h5 className='text-white'>&#10060; Don&apos;t know how patterns work with dependency injection</h5>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(40, 167, 69, 0.08)', border: '1px solid rgba(40, 167, 69, 0.3)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className='text-success text-center mb-4'><b>After</b></h3>
                <h5 className='text-white'>&#10004; Choose the right pattern in minutes</h5>
                <h5 className='text-white'>&#10004; Refactor messy code into clean, maintainable architecture</h5>
                <h5 className='text-white'>&#10004; Know exactly when to use - and when NOT to use - each pattern</h5>
                <h5 className='text-white'>&#10004; Speak confidently about patterns in any interview</h5>
                <h5 className='text-white'>&#10004; Have production-ready C# code you can adapt immediately</h5>
                <h5 className='text-white'>&#10004; Understand advanced variants (Fluent Builder, Scrutor Decorators, MediatR)</h5>
              </div>
            </div>
          </div>

          <div className="row text-center mt-4">
            <div className="col-xl-12 text-center">
              <a href={CHECKOUT_URL} className="lemonsqueezy-button">
                <button className='btn btn-lg btn-primary border-radius-10px button-padding'>Start Writing Better Architecture Today - <span className='text-green'> $32.99</span></button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          WHAT'S INSIDE (5 Patterns overview)
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="learn-section">
        <div className="container">
          <div className='row'>
            <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12'>
              <div className="row justify-content-center mb-5">
                <div className="col-md-12 heading-section text-center">
                  <p className="header-text">5 Patterns. <span className='text-yellow'>Real Problems. Real Code.</span></p>
                  <h5 className='text-white pt-2' style={{ opacity: 0.8 }}>Each pattern starts with a real-world problem, not a textbook definition</h5>
                </div>
              </div>

              <div className="row text-center">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center'><b>Builder Pattern</b></h2>
                  <h5 className='pt-3'>Stop creating objects with <span className='text-yellow'>10-parameter constructors</span>. Learn to build complex objects step by step - from basic Builder to Fluent Builder, Director Class, and Step Builder with validation.</h5>
                  <h5 className='pt-3 text-white'>&bull; Fluent Builder &bull; Director Class &bull; Nested Builders</h5>
                  <h5 className='text-white'>&bull; FluentValidation integration &bull; Step Builder</h5>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center'><b>Decorator Pattern</b></h2>
                  <h5 className='pt-3'>Add logging, caching, or retry logic <span className='text-yellow'>without touching the original class</span>. Learn how Scrutor makes decorators effortless with .NET dependency injection.</h5>
                  <h5 className='pt-3 text-white'>&bull; Composing Decorators &bull; Scrutor + DI</h5>
                  <h5 className='text-white'>&bull; Resilient API Service (Retry Policy) &bull; Cross-cutting concerns</h5>
                </div>
              </div>

              <hr className='background-yellow' />

              <div className="row text-center">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center'><b>Strategy Pattern</b></h2>
                  <h5 className='pt-3'>Swap algorithms at runtime <span className='text-yellow'>without if-else chains</span>. Combine Strategy with Factory, dependency injection, and configuration-based selection.</h5>
                  <h5 className='pt-3 text-white'>&bull; DI with Strategy &bull; Strategy + Factory</h5>
                  <h5 className='text-white'>&bull; Config-based selection &bull; Runtime algorithm swap</h5>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center'><b>Adapter Pattern</b></h2>
                  <h5 className='pt-3'>Integrate third-party APIs and legacy systems <span className='text-yellow'>without rewriting everything</span>. Learn both Object and Class Adapter with a real cloud providers example.</h5>
                  <h5 className='pt-3 text-white'>&bull; Object vs Class Adapter &bull; Cloud Provider integration</h5>
                  <h5 className='text-white'>&bull; Legacy system wrapping &bull; Interface compatibility</h5>
                </div>
              </div>

              <hr className='background-yellow' />

              <div className="row text-center">
                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3"></div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center'><b>Mediator Pattern</b></h2>
                  <h5 className='pt-3'>Decouple your components and <span className='text-yellow'>orchestrate communication cleanly</span>. From basic mediator to MediatR with pipeline behaviors for Clean Architecture.</h5>
                  <h5 className='pt-3 text-white'>&bull; MediatR in Clean Architecture &bull; Pipeline behaviors</h5>
                  <h5 className='text-white'>&bull; Cross-cutting concerns &bull; Event Aggregation</h5>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3"></div>
              </div>
            </div>
          </div>

          <div className="row text-center mt-3">
            <div className="col-xl-12 text-center">
              <a href={CHECKOUT_URL} className="lemonsqueezy-button">
                <button className='btn btn-lg btn-primary border-radius-10px button-padding'>Get the Ebook + Real-World Examples - <span className='text-green'> $32.99</span></button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          OFFER STACK - What You Get
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="included-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">You Don&apos;t Just Get <span className='text-yellow'>a PDF</span></p>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className='text-yellow mb-4'>&#128214; The Ebook</h3>
                <h5 className='text-white'>&#10004; 5 design patterns, explained from problem to production</h5>
                <h5 className='text-white'>&#10004; Real-world scenarios - not Pizza or Animal classes</h5>
                <h5 className='text-white'>&#10004; UML diagrams for every pattern</h5>
                <h5 className='text-white'>&#10004; Advanced variants for each pattern</h5>
                <h5 className='text-white'>&#10004; Pros, cons, and when NOT to use each one</h5>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className='text-yellow mb-4'>&#128187; GitHub Repository</h3>
                <h5 className='text-white'>&#10004; 20 mini-projects with complete C# solutions</h5>
                <h5 className='text-white'>&#10004; Clone, run, and modify immediately</h5>
                <h5 className='text-white'>&#10004; Production-ready code structure</h5>
                <h5 className='text-white'>&#10004; Every pattern variation implemented</h5>
                <h5 className='text-white'>&#10004; Bonus: code in 4 additional languages</h5>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className='text-yellow mb-4'>&#127919; Interview Prep Mini-Ebook</h3>
                <h5 className='text-white'>&#10004; 100 design pattern interview questions</h5>
                <h5 className='text-white'>&#10004; Detailed answers with code examples</h5>
                <h5 className='text-white'>&#10004; Covers all major patterns (not just these 5)</h5>
                <h5 className='text-white'>&#10004; Perfect for senior-level interviews</h5>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className='text-yellow mb-4'>&#9889; Quick Reference</h3>
                <h5 className='text-white'>&#10004; Pattern decision guide - which pattern for which problem</h5>
                <h5 className='text-white'>&#10004; Cheat sheet with key implementation steps</h5>
                <h5 className='text-white'>&#10004; When to use vs. when NOT to use summary</h5>
                <h5 className='text-white'>&#10004; DI integration patterns at a glance</h5>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mt-3 mb-4">
            <div className="col-xl-8 col-lg-10 col-md-12">
              <div style={{ background: 'linear-gradient(135deg, rgba(255,193,7,0.1), rgba(255,193,7,0.03))', border: '2px solid rgba(255,193,7,0.4)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className='text-yellow text-center mb-4'>&#127873; Bonuses Included</h3>
                <div className="row">
                  <div className="col-md-4 text-center mb-3">
                    <h5 className='text-white'>&#128218; <span className='text-yellow'>EPUB Format</span></h5>
                    <h5 className='text-white' style={{ opacity: 0.8 }}>Read on any e-reader, tablet, or phone</h5>
                  </div>
                  <div className="col-md-4 text-center mb-3">
                    <h5 className='text-white'>&#127763; <span className='text-yellow'>Dark &amp; Light Mode</span></h5>
                    <h5 className='text-white' style={{ opacity: 0.8 }}>Comfortable reading day or night</h5>
                  </div>
                  <div className="col-md-4 text-center mb-3">
                    <h5 className='text-white'>&#128196; <span className='text-yellow'>100 Interview Q&amp;As</span></h5>
                    <h5 className='text-white' style={{ opacity: 0.8 }}>With code examples for every answer</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row text-center mt-3">
            <div className="col-xl-12 text-center">
              <h5 className='text-white mb-2' style={{ opacity: 0.7 }}>Total value: ebook + repo + interview prep + cheat sheets + EPUB</h5>
              <a href={CHECKOUT_URL} className="lemonsqueezy-button">
                <button className='btn btn-lg btn-primary border-radius-10px button-padding'>Get Everything for <span className='text-green'> $32.99</span></button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          SOCIAL PROOF
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="proof-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text"><span className='text-yellow'>{config.EbookCopiesNumber}+ Developers</span> Already Use These Patterns</p>
            </div>
          </div>

          <EbookNewsletter />

          <div className="row mt-4 justify-content-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #4a90d9, #357abd)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0 }}>MJ</div>
                  <div style={{ marginLeft: '12px' }}>
                    <p className='text-yellow mb-0' style={{ fontWeight: 'bold' }}>Milan Jovanovic</p>
                    <p className='text-white mb-0' style={{ fontSize: '0.85rem', opacity: 0.7 }}>Microsoft MVP</p>
                  </div>
                </div>
                <p className='text-white' style={{ fontStyle: 'italic' }}>&quot;Design Patterns ebook is a quick and enjoyable read about the most important design patterns in C#. The examples were refreshing, and I especially liked being able to access the source code. If you&apos;re just starting or need a refresher, this book will be your design patterns companion.&quot;</p>
                <p className='text-yellow mb-0'>&#11088;&#11088;&#11088;&#11088;&#11088;</p>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #e8a838, #d4922a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0 }}>RA</div>
                  <div style={{ marginLeft: '12px' }}>
                    <p className='text-yellow mb-0' style={{ fontWeight: 'bold' }}>Raul Fernando Aillon Salinas</p>
                    <p className='text-white mb-0' style={{ fontSize: '0.85rem', opacity: 0.7 }}>Software Developer</p>
                  </div>
                </div>
                <p className='text-white' style={{ fontStyle: 'italic' }}>&quot;I love the simplicity of how every pattern is explained. The real-life examples are an incredible way to provide context and understand why we are choosing this pattern. By providing the writer&apos;s point of view of preferences we are able to evaluate the pros and cons, to decide which is better for our particular use case.&quot;</p>
                <p className='text-yellow mb-0'>&#11088;&#11088;&#11088;&#11088;&#11088;</p>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0 }}>JO</div>
                  <div style={{ marginLeft: '12px' }}>
                    <p className='text-yellow mb-0' style={{ fontWeight: 'bold' }}>Jeroen Opmeer</p>
                    <p className='text-white mb-0' style={{ fontSize: '0.85rem', opacity: 0.7 }}>C#/.NET Senior Developer</p>
                  </div>
                </div>
                <p className='text-white' style={{ fontStyle: 'italic' }}>&quot;This ebook shows that good technical information doesn&apos;t have to be burried in hundreds of pages of fluff. Exactly what a developer wants to read, core information on what a specific technology is about and how to apply it.&quot;</p>
                <p className='text-yellow mb-0'>&#11088;&#11088;&#11088;&#11088;&#11088;</p>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #00b894, #00cec9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0 }}>NK</div>
                  <div style={{ marginLeft: '12px' }}>
                    <p className='text-yellow mb-0' style={{ fontWeight: 'bold' }}>Nikola Knezevic</p>
                    <p className='text-white mb-0' style={{ fontSize: '0.85rem', opacity: 0.7 }}>Software Developer, Content Creator</p>
                  </div>
                </div>
                <p className='text-white' style={{ fontStyle: 'italic' }}>&quot;The book is packed with five important design patterns in C#. Each pattern is explained step by step, with access to a GitHub repository, making it easy for everyone to grasp the material.&quot;</p>
                <p className='text-yellow mb-0'>&#11088;&#11088;&#11088;&#11088;&#11088;</p>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #fd79a8, #e84393)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0 }}>SE</div>
                  <div style={{ marginLeft: '12px' }}>
                    <p className='text-yellow mb-0' style={{ fontWeight: 'bold' }}>Saeed Esmaeelinejad</p>
                    <p className='text-white mb-0' style={{ fontSize: '0.85rem', opacity: 0.7 }}>Senior Software Engineer</p>
                  </div>
                </div>
                <p className='text-white' style={{ fontStyle: 'italic' }}>&quot;I just read the book and it&apos;s amazing with nice visualization which helps a lot for a better understanding of how patterns work. One of the points that I like is mentioning the Pros and Cons, they help you to decide which pattern is suitable for your case.&quot;</p>
                <p className='text-yellow mb-0'>&#11088;&#11088;&#11088;&#11088;&#11088;</p>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #636e72, #2d3436)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0 }}>SM</div>
                  <div style={{ marginLeft: '12px' }}>
                    <p className='text-yellow mb-0' style={{ fontWeight: 'bold' }}>Stefan Milosevic</p>
                    <p className='text-white mb-0' style={{ fontSize: '0.85rem', opacity: 0.7 }}>Senior Software Engineer</p>
                  </div>
                </div>
                <p className='text-white' style={{ fontStyle: 'italic' }}>&quot;This book is a very fun and interesting way to get into the world of design patterns. It also has everything that you need to start applying those patterns in your application. Highly recommended.&quot;</p>
                <p className='text-yellow mb-0'>&#11088;&#11088;&#11088;&#11088;&#11088;</p>
              </div>
            </div>
          </div>

          <div className="row text-center mt-4">
            <div className="col-xl-12 text-center">
              <a href={CHECKOUT_URL} className="lemonsqueezy-button">
                <button className='btn btn-lg btn-primary border-radius-10px button-padding'>Join {config.EbookCopiesNumber}+ Developers - <span className='text-green'> $32.99</span></button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          INSTRUCTOR / TRUST
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section background-yellow" id="author-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <h2 className="text-black"><b>Written by a Developer, for Developers</b></h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6 ebook-profile-div">
                  <Image src={'/images/ebook-stefan.png'} className='mb-5 border-radius-20px ebook-profile-img' alt={'Stefan Djokic - Microsoft MVP and author of Design Patterns that Deliver'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="col-md-6 ebook-about-div">
                  <p className='text-black text-font-2rem'><b>Hi, I&apos;m Stefan</b></p>
                  <p className='text-black'><b>Microsoft MVP</b> and <b>Senior Software Engineer</b> with years of experience building production .NET systems. I teach {config.NewsletterSubCount} through my newsletter, and {config.LinkedinFollowers} follow my content on LinkedIn.</p>
                </div>
                <div className="col-md-12">
                  <p className='text-black'>I wrote this ebook because I was frustrated with pattern books that use toy examples. Every pattern in this book comes from a real problem I&apos;ve solved in production code.</p>
                </div>
              </div>
            </div>
            <div className="col-md-3"></div>
          </div>
          <div className="row">
            <div className="col-md-5"></div>
            <div className="col-md-2">
              <Image src={'/images/mvp.png'} className='mb-5 mt-5' alt={'Stefan Djokic - Microsoft MVP badge'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
            </div>
            <div className="col-md-5"></div>
          </div>
          <div className="row mt-5">
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12 text-center">
                  <p className='text-black text-font-2rem'><a className='text-black' href='https://thecodeman.net/blog'>Newsletter</a></p>
                  <p className='text-black text-font-2rem'><b>{config.NewsletterSubCount}</b></p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12 text-center">
                  <p className='text-black text-font-2rem'><a className='text-black' href='https://www.linkedin.com/in/djokic-stefan/'>LinkedIn</a></p>
                  <p className='text-black text-font-2rem'><b>{config.LinkedinFollowers}</b></p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12 text-center">
                  <p className='text-black text-font-2rem'><a className='text-black' href='https://twitter.com/TheCodeMan__'>Twitter</a></p>
                  <p className='text-black text-font-2rem'><b>{config.TwitterFollowers}</b></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          WHO IS THIS FOR / NOT FOR
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="who-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">Is This Ebook <span className='text-yellow'>Right for You?</span></p>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(40, 167, 69, 0.08)', border: '1px solid rgba(40, 167, 69, 0.3)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className='text-success text-center mb-4'><b>This is for you if...</b></h3>
                <h5 className='text-white'>&#10004; You&apos;re a .NET / C# developer (mid-level or senior)</h5>
                <h5 className='text-white'>&#10004; You know what design patterns are but struggle to apply them</h5>
                <h5 className='text-white'>&#10004; You want production-ready code, not textbook theory</h5>
                <h5 className='text-white'>&#10004; You&apos;re preparing for senior-level interviews</h5>
                <h5 className='text-white'>&#10004; You want to write cleaner, more maintainable architecture</h5>
                <h5 className='text-white'>&#10004; You&apos;re a tech lead looking for patterns your team can adopt</h5>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(220, 53, 69, 0.08)', border: '1px solid rgba(220, 53, 69, 0.3)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className='text-danger text-center mb-4'><b>This is NOT for you if...</b></h3>
                <h5 className='text-white'>&#10060; You&apos;re a complete beginner still learning C# basics</h5>
                <h5 className='text-white'>&#10060; You want a reference for all 23 GoF patterns</h5>
                <h5 className='text-white'>&#10060; You prefer abstract theory over practical implementation</h5>
                <h5 className='text-white'>&#10060; You&apos;re looking for language-agnostic content only</h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          FULL TABLE OF CONTENTS
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="toc-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">Full <span className='text-yellow'>Table of Contents</span></p>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <div className="blog-entry text-left" style={{ width: '100%' }}>
                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    &#128736; Builder Pattern
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">Real World Problem</h5>
                    <h5 className="text-white text-left">Solution + Basic Builder Implementation</h5>
                    <h5 className="text-white text-left">Definition + UML Diagram</h5>
                    <h5 className="text-white text-left">Fluent Builder Pattern</h5>
                    <h5 className="text-white text-left">Director Class</h5>
                    <h5 className="text-white text-left">Nested Builder Objects (Hierarchical)</h5>
                    <h5 className="text-white text-left">Builder Pattern + FluentValidation</h5>
                    <h5 className="text-white text-left">Step Builder Pattern</h5>
                    <h5 className="text-white text-left">Pros &amp; Cons</h5>
                    <h5 className="text-white text-left">When to &amp; When NOT to Use It</h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    &#127912; Decorator Pattern
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">Real World Problem</h5>
                    <h5 className="text-white text-left">Solution + Basic Decorator Implementation</h5>
                    <h5 className="text-white text-left">Definition + UML Diagram</h5>
                    <h5 className="text-white text-left">Composing Decorators</h5>
                    <h5 className="text-white text-left">Adding Scrutor to Decorator Pattern</h5>
                    <h5 className="text-white text-left">Real Problem - Resilient API Service (Retry Policy)</h5>
                    <h5 className="text-white text-left">Pros &amp; Cons</h5>
                    <h5 className="text-white text-left">When to &amp; When NOT to Use It</h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    &#9889; Strategy Pattern
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">Real World Problem</h5>
                    <h5 className="text-white text-left">Solution + Basic Strategy Implementation</h5>
                    <h5 className="text-white text-left">Definition + UML Diagram</h5>
                    <h5 className="text-white text-left">Dependency Injection with Strategy Pattern</h5>
                    <h5 className="text-white text-left">Combining Strategy Pattern with Factory Pattern</h5>
                    <h5 className="text-white text-left">Using Configuration Settings for Strategy Selection</h5>
                    <h5 className="text-white text-left">Pros &amp; Cons</h5>
                    <h5 className="text-white text-left">When to &amp; When NOT to Use It</h5>
                  </div>
                </details>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <div className="blog-entry text-left" style={{ width: '100%' }}>
                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    &#128268; Adapter Pattern
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">Real World Problem</h5>
                    <h5 className="text-white text-left">Solution + Basic Adapter Implementation</h5>
                    <h5 className="text-white text-left">Definition + UML Diagram</h5>
                    <h5 className="text-white text-left">Object Adapter Pattern</h5>
                    <h5 className="text-white text-left">Class Adapter Pattern</h5>
                    <h5 className="text-white text-left">Example: Cloud Providers Integration</h5>
                    <h5 className="text-white text-left">Pros &amp; Cons</h5>
                    <h5 className="text-white text-left">When to &amp; When NOT to Use It</h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    &#128640; Mediator Pattern
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">Real World Problem</h5>
                    <h5 className="text-white text-left">Solution + Basic Mediator Implementation</h5>
                    <h5 className="text-white text-left">Definition + UML Diagram</h5>
                    <h5 className="text-white text-left">Cross-Cutting Concerns</h5>
                    <h5 className="text-white text-left">MediatR Library in Clean Architecture</h5>
                    <h5 className="text-white text-left">Event Aggregation</h5>
                    <h5 className="text-white text-left">Pros &amp; Cons</h5>
                    <h5 className="text-white text-left">When to &amp; When NOT to Use It</h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    &#127919; Bonus: Interview Prep
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">100 Design Pattern Interview Questions</h5>
                    <h5 className="text-white text-left">Detailed Answers with Explanations</h5>
                    <h5 className="text-white text-left">Covers All Major GoF Patterns</h5>
                  </div>
                </details>
              </div>
            </div>
          </div>
          <div className="row text-center mt-4">
            <div className="col-xl-12 text-center">
              <a href={CHECKOUT_URL} className="lemonsqueezy-button">
                <button className='btn btn-lg btn-primary border-radius-10px button-padding'>Get the Ebook + Real-World Examples - <span className='text-green'> $32.99</span></button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          FAQ (AEO-optimized)
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="faq-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">
                Frequently Asked <span className="text-yellow">Questions</span>
              </p>
            </div>
          </div>

          <div className="row text-left">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-5">
              <div className="blog-entry text-left pt-3">
                <h3 className="text-yellow text-left pt-3">
                  What are design patterns in .NET?
                </h3>
                <h5 className="text-white text-left">
                  Design patterns are reusable solutions to common software design problems. In .NET and C#, they help you structure code that is maintainable, testable, and scalable. The most practical ones include Builder, Decorator, Strategy, Adapter, and Mediator - which are the 5 covered in this ebook with production-ready implementations.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  Which design patterns should I learn first as a C# developer?
                </h3>
                <h5 className="text-white text-left">
                  Start with the patterns you&apos;ll use most in real projects: <span className="text-yellow">Builder</span> for object creation, <span className="text-yellow">Strategy</span> for swappable algorithms, <span className="text-yellow">Decorator</span> for adding behavior without modifying classes, <span className="text-yellow">Adapter</span> for integrating third-party code, and <span className="text-yellow">Mediator</span> for decoupling components. These 5 cover 80% of real-world needs.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  Are design patterns still relevant in modern .NET?
                </h3>
                <h5 className="text-white text-left">
                  Absolutely. Modern .NET with dependency injection, middleware pipelines, and Clean Architecture relies heavily on design patterns. MediatR (Mediator), Scrutor (Decorator), Polly (Strategy), and HttpClientFactory (Builder) are all pattern implementations used daily in production .NET applications.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  How is this different from other design patterns books?
                </h3>
                <h5 className="text-white text-left">
                  Most pattern books explain theory with abstract examples (Pizza, Animal, Shape classes). This ebook starts every pattern with a <span className="text-yellow">real production problem</span>, shows the solution in C#, then explores advanced variants. You also get a GitHub repo with 20 runnable mini-projects.
                </h5>
              </div>
            </div>

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-5">
              <div className="blog-entry text-left pt-3">
                <h3 className="text-yellow text-left pt-3">
                  What knowledge level do I need?
                </h3>
                <h5 className="text-white text-left">
                  You should be comfortable with C# and basic .NET development. The ebook is designed for <span className="text-yellow">intermediate to senior developers</span> who know the language but want to level up their architecture and design skills. It&apos;s not for absolute beginners.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  Do I get code I can use in my projects?
                </h3>
                <h5 className="text-white text-left">
                  Yes. You get full access to a <span className="text-yellow">GitHub repository</span> with 20 mini-projects - one for each pattern and each advanced variant. The code is structured, documented, and ready to clone, run, and adapt for your own projects.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  How do I apply design patterns in real .NET projects?
                </h3>
                <h5 className="text-white text-left">
                  Each pattern starts with a real-world scenario you&apos;d encounter in production. The ebook shows you step-by-step how to identify the problem, choose the right pattern, implement it with proper dependency injection, and understand when NOT to use it. The GitHub repo gives you complete, runnable examples.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  Is there a refund policy?
                </h3>
                <h5 className="text-white text-left">
                  The ebook is a digital product delivered instantly. If you&apos;re not satisfied, reach out directly and we&apos;ll work it out. {config.EbookCopiesNumber}+ developers have purchased it and the feedback has been overwhelmingly positive.
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="final-cta-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 col-md-12 text-center">
              <p className="header-text mb-3">Stop Reading About Patterns.</p>
              <p className="header-text"><span className='text-yellow'>Start Using Them in Real Code.</span></p>
              <h5 className='text-white pt-3 mb-5' style={{ opacity: 0.8 }}>5 patterns. Real C# implementations. A GitHub repo you can clone today. Plus 100 interview questions to make sure you can explain what you build.</h5>

              <a href={CHECKOUT_URL} className="lemonsqueezy-button">
                <button className='btn btn-lg btn-primary border-radius-10px button-padding' style={{ fontSize: '1.2rem', padding: '18px 40px' }}>
                  Start Writing Better Architecture Today - <span className='text-green'> $32.99</span>
                </button>
              </a>
              <p className='text-white mt-3' style={{ fontSize: '0.85rem', opacity: 0.6 }}>{config.EbookCopiesNumber}+ copies sold. Instant delivery. GitHub repo included.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Ebook;
