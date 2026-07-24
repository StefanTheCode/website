import { Metadata } from 'next'
import Script from 'next/script'
import FreeMotion from '../../components/free/FreeMotion'

const PAGE_URL = 'https://thecodeman.net/dotnet-roadmap-2026'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: 'Practical .NET Roadmap for 2026 - From Zero to Job-Ready .NET Developer',
  description:
    'Free .NET developer roadmap for 2026. Go from zero to job-ready in 12 weeks with 8 progressive steps, 7 portfolio projects, production-ready C# code templates, and checklists. Covers ASP.NET Core, EF Core, Docker, Redis, and more.',
  keywords: [
    '.NET roadmap 2026', '.NET developer roadmap', 'learn .NET', 'ASP.NET Core roadmap', '.NET backend developer',
    'C# career path', '.NET learning plan', '.NET portfolio projects', 'junior .NET developer', '.NET job ready',
    'learn C# 2026', 'dotnet beginner guide', 'how to become a .NET developer', '.NET developer career guide',
    'C# developer roadmap 2026', 'ASP.NET Core learning path', 'backend developer roadmap',
    '.NET tutorial for beginners', 'free .NET roadmap',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Practical .NET Roadmap for 2026 - From Zero to Job-Ready .NET Developer',
    type: 'website',
    url: PAGE_URL,
    description:
      'Free .NET developer roadmap for 2026. Go from zero to job-ready in 12 weeks with 8 progressive steps, 7 portfolio projects, production-ready C# code templates, and checklists.',
    siteName: 'TheCodeMan.net',
  },
  twitter: {
    title: 'Practical .NET Roadmap for 2026 - From Zero to Job-Ready .NET Developer',
    card: 'summary_large_image',
    site: '@TheCodeMan__',
    creator: '@TheCodeMan__',
    description:
      'Free .NET developer roadmap for 2026. Go from zero to job-ready in 12 weeks with 8 progressive steps, 7 portfolio projects, production-ready C# code templates, and checklists.',
  },
}

const roadmapSteps = [
  { step: 'Step 1', title: 'Build Your First API', weeks: 'Weeks 1–2', description: 'ASP.NET Core, Minimal APIs — get your first endpoints running.' },
  { step: 'Step 2', title: 'Add a Database', weeks: 'Weeks 3–4', description: 'EF Core, PostgreSQL — persist data and learn migrations.' },
  { step: 'Step 3', title: 'Validation, Errors & Logging', weeks: 'Weeks 5–6', description: 'FluentValidation, ProblemDetails, Serilog — build production habits early.' },
  { step: 'Step 4', title: 'Authentication', weeks: 'Weeks 7–8', description: 'JWT, ASP.NET Core Identity — secure your API properly.' },
  { step: 'Step 5', title: 'Production Readiness', weeks: 'Weeks 9–10', description: 'Docker, GitHub Actions — deploy like a professional.' },
  { step: 'Step 6', title: 'Background Jobs', weeks: 'Week 11', description: 'BackgroundService, MassTransit — handle async work.' },
  { step: 'Step 7', title: 'Scale & Optimize', weeks: 'Weeks 11–12', description: 'Redis, Output Caching, Polly — make it fast and resilient.' },
  { step: 'Step 8', title: 'Testing', weeks: 'Week 12', description: 'xUnit, WebApplicationFactory — prove it works.' },
]

const whatsInsideItems = [
  { title: 'The Full Roadmap Guide', description: 'A complete step-by-step guide covering 8 progressive steps from first API to production deployment, with MUST vs OPTIONAL classification for every technology.' },
  { title: '7 Portfolio Projects', description: 'Real-world project ideas with extension suggestions — build a portfolio that actually impresses hiring managers.' },
  { title: '12-Week Learning Plan', description: 'A structured weekly plan so you always know what to work on next. No guessing, no tutorial hopping.' },
  { title: 'Production-Ready Code Templates', description: 'Copy-paste starter code: Program.cs, Minimal API CRUD, EF Core DbContext, DI registration, Dockerfile, docker-compose, CI/CD pipeline, and more.' },
  { title: 'Progress Checklists', description: 'Step-by-step completion checklist, production readiness checklist, and a 12-week progress tracker to keep you on track.' },
  { title: 'What NOT to Learn', description: 'Skip the noise. Know exactly which technologies to ignore so you save months of wasted effort.' },
]

const whoIsItFor = [
  'Beginners who want a clear path into .NET backend development',
  'Self-taught developers tired of random tutorials that lead nowhere',
  'Career switchers who need to get job-ready fast',
  'Junior developers who want to fill gaps and level up',
]

const techStack = [
  { category: 'Building APIs', tech: 'ASP.NET Core, Minimal APIs' },
  { category: 'Adding Data', tech: 'EF Core, PostgreSQL' },
  { category: 'Validating Input', tech: 'FluentValidation' },
  { category: 'Handling Errors', tech: 'ProblemDetails' },
  { category: 'Logging', tech: 'Serilog' },
  { category: 'Authentication', tech: 'JWT, ASP.NET Core Identity' },
  { category: 'Deploying', tech: 'Docker, GitHub Actions' },
  { category: 'Caching', tech: 'Redis, Output Caching' },
  { category: 'Background Work', tech: 'BackgroundService, MassTransit' },
  { category: 'Testing', tech: 'xUnit, WebApplicationFactory' },
  { category: 'Resilience', tech: 'Polly' },
]

const marqueeItems = [
  'ASP.NET Core', 'Minimal APIs', 'EF Core', 'PostgreSQL', 'FluentValidation', 'Serilog', 'JWT',
  'Docker', 'GitHub Actions', 'Redis', 'MassTransit', 'Polly', 'xUnit',
]

const stats: { target: number; suffix?: string; label: string }[] = [
  { target: 8, label: 'Progressive steps' },
  { target: 12, label: 'Week plan' },
  { target: 7, label: 'Portfolio projects' },
  { target: 11, label: 'Technologies' },
]

const faqItems = [
  { question: 'What is the best .NET developer roadmap for 2026?', answer: 'The Practical .NET Roadmap for 2026 is an 8-step, 12-week guide that takes you from building your first ASP.NET Core API to production deployment with Docker, CI/CD, caching, and testing. It covers only what matters — with MUST vs OPTIONAL classification for every technology.' },
  { question: 'How long does it take to become a job-ready .NET developer?', answer: 'With focused effort following this roadmap, you can become job-ready in 12 weeks. The plan covers ASP.NET Core, EF Core, authentication, Docker, background jobs, caching, resilience, and testing — the exact skills employers look for.' },
  { question: 'What technologies should a .NET backend developer learn in 2026?', answer: 'In 2026, a .NET backend developer should learn ASP.NET Core with Minimal APIs, Entity Framework Core with PostgreSQL, FluentValidation, Serilog, JWT authentication, Docker, GitHub Actions for CI/CD, Redis caching, MassTransit for background work, Polly for resilience, and xUnit for testing.' },
  { question: 'Is this .NET roadmap free?', answer: 'Yes, the Practical .NET Roadmap for 2026 is completely free. It includes the full roadmap guide, 7 portfolio project ideas, production-ready code templates, progress checklists, and a 12-week learning plan.' },
  { question: 'What portfolio projects should a junior .NET developer build?', answer: 'This roadmap includes 7 portfolio projects that progressively build your skills — from a basic CRUD API to a fully deployed, production-ready application with authentication, caching, background processing, and automated tests. Each project comes with extension ideas to make it stand out.' },
  { question: 'What is the difference between MUST and OPTIONAL technologies in .NET?', answer: 'The roadmap classifies every technology as MUST (essential for getting hired and building production apps) or OPTIONAL (nice-to-have that can wait). This saves months by helping you focus on what actually matters: ASP.NET Core, EF Core, Docker, and testing are MUST. Things like gRPC or GraphQL are OPTIONAL.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebPage', '@id': PAGE_URL, url: PAGE_URL, name: 'Practical .NET Roadmap for 2026 - From Zero to Job-Ready .NET Developer', description: 'Free .NET developer roadmap for 2026. Go from zero to job-ready in 12 weeks with 8 progressive steps, 7 portfolio projects, production-ready C# code templates, and checklists.', isPartOf: { '@id': 'https://thecodeman.net/#website' }, about: { '@type': 'Thing', name: '.NET Development' }, author: { '@type': 'Person', name: 'Stefan Đokić', url: 'https://thecodeman.net', jobTitle: 'Microsoft MVP' } },
    { '@type': 'Course', name: 'Practical .NET Roadmap for 2026', description: 'A free 12-week, 8-step roadmap to become a job-ready .NET backend developer. Includes portfolio projects, production-ready code templates, and progress checklists.', provider: { '@type': 'Person', name: 'Stefan Đokić', url: 'https://thecodeman.net' }, isAccessibleForFree: true, educationalLevel: 'Beginner to Intermediate', teaches: 'ASP.NET Core, Entity Framework Core, Docker, CI/CD, Redis, Authentication, Testing, Background Jobs', timeRequired: 'P12W', url: PAGE_URL },
    { '@type': 'FAQPage', mainEntity: faqItems.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) },
  ],
}

const FORM_SCRIPT = `<script async src="https://eomail4.com/form/782231c8-3778-11f1-b51d-5b8e82dfd76d.js" data-form="782231c8-3778-11f1-b51d-5b8e82dfd76d"></script>`

const card = { border: '1px solid var(--tk-line)', borderRadius: '16px', background: 'var(--tk-card-bg)' } as const

const DotNetRoadmap2026 = () => {
  return (
    <>
      <FreeMotion />
      <Script id="roadmap-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">

        {/* ── Hero ── */}
        <div className="tk-hero-glow crk-hero-glow">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xs-12 col-sm-12 col-md-11 col-lg-10 heading-section text-center mt-5">
                <span className="tk-eyebrow" data-reveal>Free .NET roadmap for 2026</span>

                <div className="d-flex justify-content-center mb-4" data-reveal data-delay="1">
                  <div className="d-inline-flex align-items-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '8px 16px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#46d39a', display: 'inline-block', marginRight: '10px' }} />
                    <span className="text-white" style={{ fontSize: '0.92rem' }}>Zero to job-ready in <strong>12 weeks</strong></span>
                  </div>
                </div>

                <h1 className="text-white mb-4" data-reveal data-delay="1">
                  Stop jumping between random tutorials.
                  <br />
                  <span className="text-yellow crk-shimmer">Follow one clear path to .NET developer.</span>
                </h1>

                <h4 className="text-white mb-4" style={{ fontWeight: 400, lineHeight: 1.6 }} data-reveal data-delay="2">
                  The only guide you need to go from zero to job-ready .NET developer in 12 weeks. No fluff.
                  No random technology lists. Just a clear path that mirrors how real developers build real applications.
                </h4>

                <div className="row justify-content-center" id="download-roadmap" data-reveal data-delay="3">
                  <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
                    <div className="tk-card crk-form-card p-4 p-md-5" style={card}>
                      <h5 className="text-white mb-3">Send me the <span className="text-yellow">FREE .NET Roadmap</span></h5>
                      <div dangerouslySetInnerHTML={{ __html: FORM_SCRIPT }} />
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4" data-reveal data-delay="4">
                  {['8 progressive steps', '7 portfolio projects', 'Production-ready templates'].map((b) => (
                    <span key={b} className="text-white d-inline-flex align-items-center" style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                      <span className="text-yellow" style={{ marginRight: '8px' }}>✓</span>{b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Marquee ── */}
        <div className="container-fluid px-0 mt-5" data-reveal>
          <div className="tk-marquee">
            <div className="tk-marquee-track">
              {[...marqueeItems, ...marqueeItems].map((name, i) => (
                <span className="tk-chip" key={`${name}-${i}`}>{name}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="container mt-5" data-reveal>
          <div className="row justify-content-center text-center">
            {stats.map((s, i) => (
              <div className="col-6 col-md-3 mb-4" key={s.label} data-reveal data-delay={String((i % 4) + 1)}>
                <div className="tk-card p-4 h-100" style={card}>
                  <div className="text-yellow crk-count" style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }} data-target={s.target} data-suffix={s.suffix ?? ''} data-comma="0">0{s.suffix ?? ''}</div>
                  <div className="text-white mt-2" style={{ opacity: 0.75, fontSize: '0.9rem' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── 12-Week Path ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>The 12-week path</span>
              <h2 className="text-white" data-reveal data-delay="1">Each step builds on the last</h2>
              <p className="text-white" style={{ opacity: 0.85 }} data-reveal data-delay="2">Don&apos;t skip ahead - the order is the point.</p>
            </div>
            {roadmapSteps.map((item, index) => (
              <div className="col-xs-12 col-sm-6 col-lg-3 mb-4" key={index} data-reveal data-delay={String((index % 4) + 1)}>
                <div className={`tk-card crk-accent-card ${['crk-a-yellow', 'crk-a-teal', 'crk-a-purple', 'crk-a-coral'][index % 4]} p-4 h-100`} style={{ ...card, textAlign: 'left' }}>
                  <div className="crk-pill">{item.step} · {item.weeks}</div>
                  <h5 className="text-white mb-2">{item.title}</h5>
                  <p className="text-white mb-0" style={{ fontSize: '0.9rem', opacity: 0.85 }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── What's Inside ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>What&apos;s inside</span>
              <h2 className="text-white" data-reveal data-delay="1">Real code, real projects, a real plan</h2>
            </div>
            {whatsInsideItems.map((item, index) => (
              <div className="col-xs-12 col-sm-12 col-md-6 mb-4" key={index} data-reveal data-delay={String((index % 2) + 1)}>
                <div className={`tk-card crk-accent-card ${['crk-a-teal', 'crk-a-purple', 'crk-a-coral', 'crk-a-yellow'][index % 4]} p-4 h-100`} style={{ ...card, textAlign: 'left' }}>
                  <h5 className="text-white mb-3"><span className="crk-check">✓</span> {item.title}</h5>
                  <p className="text-white mb-0" style={{ opacity: 0.85 }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── Tech Stack ── */}
        <div className="container">
          <div className="row justify-content-center pt-4">
            <div className="col-md-12 text-center mb-5">
              <span className="tk-eyebrow" data-reveal>Tech stack</span>
              <h2 className="text-white" data-reveal data-delay="1">Introduced when you need it</h2>
            </div>
            <div className="col-md-10 col-lg-9" data-reveal>
              <div className="tk-card p-4 p-md-5" style={card}>
                {techStack.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center py-3 flex-wrap" style={{ borderBottom: index < techStack.length - 1 ? '1px solid var(--tk-line)' : 'none', gap: '8px' }}>
                    <span className="text-white" style={{ fontWeight: 600 }}>{item.category}</span>
                    <span className="text-yellow" style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.86rem' }}>{item.tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── Who / What ── */}
        <div className="container">
          <div className="row pt-4">
            <div className="col-md-6 mb-4" data-reveal>
              <div className="tk-card p-4 p-md-5 h-100" style={{ ...card, textAlign: 'left' }}>
                <h3 className="text-white mb-3" style={{ fontSize: '1.3rem' }}>Who is this for?</h3>
                {whoIsItFor.map((item, index) => (
                  <p key={index} className="text-white mb-2" style={{ opacity: 0.88 }}><span style={{ color: '#46d39a', marginRight: '10px' }}>✓</span>{item}</p>
                ))}
              </div>
            </div>
            <div className="col-md-6 mb-4" data-reveal data-delay="1">
              <div className="tk-card p-4 p-md-5 h-100" style={{ ...card, textAlign: 'left' }}>
                <h3 className="text-white mb-3" style={{ fontSize: '1.3rem' }}>What is this exactly?</h3>
                <p className="text-white mb-0" style={{ opacity: 0.85 }}>
                  A practical, opinionated roadmap that covers everything you need to become a job-ready .NET backend
                  developer — with production-ready code templates, portfolio project guides, progress checklists, and
                  honest advice on what to learn (and what to skip). Built by developers who&apos;ve been through the journey.
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── FAQ ── */}
        <div className="container">
          <div className="row pt-4">
            <div className="col-md-12 text-center mb-5">
              <span className="tk-eyebrow" data-reveal>FAQ</span>
              <h2 className="text-white" data-reveal data-delay="1">Frequently asked questions</h2>
            </div>
            <div className="col-md-10 offset-md-1">
              {faqItems.map((item, index) => (
                <div key={index} className="tk-card crk-accent-card mb-4 p-4 p-md-5" style={{ ...card, textAlign: 'left' }} data-reveal data-delay={String((index % 3) + 1)}>
                  <h3 className="text-yellow mb-3" style={{ fontSize: '1.12rem' }}>{item.question}</h3>
                  <p className="text-white mb-0" style={{ opacity: 0.85 }}>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Final CTA ── */}
        <div className="container pt-2 pb-5">
          <div className="row justify-content-center" data-reveal>
            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
              <div className="tk-card crk-form-card p-5 text-center" style={{ ...card, background: 'rgba(255,189,57,0.06)', borderColor: 'rgba(255,189,57,0.3)' }}>
                <h2 className="text-white mb-3">Twelve weeks to job-ready.</h2>
                <p className="text-white mb-4" style={{ opacity: 0.85 }}>Send me the FREE .NET Roadmap and start today.</p>
                <div className="d-flex justify-content-center" dangerouslySetInnerHTML={{ __html: FORM_SCRIPT }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DotNetRoadmap2026
