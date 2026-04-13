import { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: 'Practical .NET Roadmap for 2026 - From Zero to Job-Ready .NET Developer',
  description:
    'Free .NET developer roadmap for 2026. Go from zero to job-ready in 12 weeks with 8 progressive steps, 7 portfolio projects, production-ready C# code templates, and checklists. Covers ASP.NET Core, EF Core, Docker, Redis, and more.',
  keywords: [
    '.NET roadmap 2026',
    '.NET developer roadmap',
    'learn .NET',
    'ASP.NET Core roadmap',
    '.NET backend developer',
    'C# career path',
    '.NET learning plan',
    '.NET portfolio projects',
    'junior .NET developer',
    '.NET job ready',
    'learn C# 2026',
    'dotnet beginner guide',
    'how to become a .NET developer',
    '.NET developer career guide',
    'C# developer roadmap 2026',
    'ASP.NET Core learning path',
    'backend developer roadmap',
    '.NET tutorial for beginners',
    'free .NET roadmap',
  ],
  alternates: {
    canonical: 'https://thecodeman.net/dotnet-roadmap-2026',
  },
  openGraph: {
    title: 'Practical .NET Roadmap for 2026 - From Zero to Job-Ready .NET Developer',
    type: 'website',
    url: 'https://thecodeman.net/dotnet-roadmap-2026',
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
  {
    step: 'Step 1',
    title: 'Build Your First API',
    weeks: 'Weeks 1–2',
    description:
      'ASP.NET Core, Minimal APIs — get your first endpoints running.',
  },
  {
    step: 'Step 2',
    title: 'Add a Database',
    weeks: 'Weeks 3–4',
    description:
      'EF Core, PostgreSQL — persist data and learn migrations.',
  },
  {
    step: 'Step 3',
    title: 'Validation, Errors & Logging',
    weeks: 'Weeks 5–6',
    description:
      'FluentValidation, ProblemDetails, Serilog — build production habits early.',
  },
  {
    step: 'Step 4',
    title: 'Authentication',
    weeks: 'Weeks 7–8',
    description:
      'JWT, ASP.NET Core Identity — secure your API properly.',
  },
  {
    step: 'Step 5',
    title: 'Production Readiness',
    weeks: 'Weeks 9–10',
    description:
      'Docker, GitHub Actions — deploy like a professional.',
  },
  {
    step: 'Step 6',
    title: 'Background Jobs',
    weeks: 'Week 11',
    description:
      'BackgroundService, MassTransit — handle async work.',
  },
  {
    step: 'Step 7',
    title: 'Scale & Optimize',
    weeks: 'Weeks 11–12',
    description:
      'Redis, Output Caching, Polly — make it fast and resilient.',
  },
  {
    step: 'Step 8',
    title: 'Testing',
    weeks: 'Week 12',
    description:
      'xUnit, WebApplicationFactory — prove it works.',
  },
]

const whatsInsideItems = [
  {
    title: 'The Full Roadmap Guide',
    description:
      'A complete step-by-step guide covering 8 progressive steps from first API to production deployment, with MUST vs OPTIONAL classification for every technology.',
  },
  {
    title: '7 Portfolio Projects',
    description:
      'Real-world project ideas with extension suggestions — build a portfolio that actually impresses hiring managers.',
  },
  {
    title: '12-Week Learning Plan',
    description:
      'A structured weekly plan so you always know what to work on next. No guessing, no tutorial hopping.',
  },
  {
    title: 'Production-Ready Code Templates',
    description:
      'Copy-paste starter code: Program.cs, Minimal API CRUD, EF Core DbContext, DI registration, Dockerfile, docker-compose, CI/CD pipeline, and more.',
  },
  {
    title: 'Progress Checklists',
    description:
      'Step-by-step completion checklist, production readiness checklist, and a 12-week progress tracker to keep you on track.',
  },
  {
    title: 'What NOT to Learn',
    description:
      'Skip the noise. Know exactly which technologies to ignore so you save months of wasted effort.',
  },
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

const faqItems = [
  {
    question: 'What is the best .NET developer roadmap for 2026?',
    answer:
      'The Practical .NET Roadmap for 2026 is an 8-step, 12-week guide that takes you from building your first ASP.NET Core API to production deployment with Docker, CI/CD, caching, and testing. It covers only what matters — with MUST vs OPTIONAL classification for every technology.',
  },
  {
    question: 'How long does it take to become a job-ready .NET developer?',
    answer:
      'With focused effort following this roadmap, you can become job-ready in 12 weeks. The plan covers ASP.NET Core, EF Core, authentication, Docker, background jobs, caching, resilience, and testing — the exact skills employers look for.',
  },
  {
    question: 'What technologies should a .NET backend developer learn in 2026?',
    answer:
      'In 2026, a .NET backend developer should learn ASP.NET Core with Minimal APIs, Entity Framework Core with PostgreSQL, FluentValidation, Serilog, JWT authentication, Docker, GitHub Actions for CI/CD, Redis caching, MassTransit for background work, Polly for resilience, and xUnit for testing.',
  },
  {
    question: 'Is this .NET roadmap free?',
    answer:
      'Yes, the Practical .NET Roadmap for 2026 is completely free. It includes the full roadmap guide, 7 portfolio project ideas, production-ready code templates, progress checklists, and a 12-week learning plan.',
  },
  {
    question: 'What portfolio projects should a junior .NET developer build?',
    answer:
      'This roadmap includes 7 portfolio projects that progressively build your skills — from a basic CRUD API to a fully deployed, production-ready application with authentication, caching, background processing, and automated tests. Each project comes with extension ideas to make it stand out.',
  },
  {
    question: 'What is the difference between MUST and OPTIONAL technologies in .NET?',
    answer:
      'The roadmap classifies every technology as MUST (essential for getting hired and building production apps) or OPTIONAL (nice-to-have that can wait). This saves months by helping you focus on what actually matters: ASP.NET Core, EF Core, Docker, and testing are MUST. Things like gRPC or GraphQL are OPTIONAL.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://thecodeman.net/dotnet-roadmap-2026',
      url: 'https://thecodeman.net/dotnet-roadmap-2026',
      name: 'Practical .NET Roadmap for 2026 - From Zero to Job-Ready .NET Developer',
      description:
        'Free .NET developer roadmap for 2026. Go from zero to job-ready in 12 weeks with 8 progressive steps, 7 portfolio projects, production-ready C# code templates, and checklists.',
      isPartOf: { '@id': 'https://thecodeman.net/#website' },
      about: {
        '@type': 'Thing',
        name: '.NET Development',
      },
      author: {
        '@type': 'Person',
        name: 'Stefan Đokić',
        url: 'https://thecodeman.net',
        jobTitle: 'Microsoft MVP',
      },
    },
    {
      '@type': 'Course',
      name: 'Practical .NET Roadmap for 2026',
      description:
        'A free 12-week, 8-step roadmap to become a job-ready .NET backend developer. Includes portfolio projects, production-ready code templates, and progress checklists.',
      provider: {
        '@type': 'Person',
        name: 'Stefan Đokić',
        url: 'https://thecodeman.net',
      },
      isAccessibleForFree: true,
      educationalLevel: 'Beginner to Intermediate',
      teaches:
        'ASP.NET Core, Entity Framework Core, Docker, CI/CD, Redis, Authentication, Testing, Background Jobs',
      timeRequired: 'P12W',
      url: 'https://thecodeman.net/dotnet-roadmap-2026',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the best .NET developer roadmap for 2026?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Practical .NET Roadmap for 2026 is an 8-step, 12-week guide that takes you from building your first ASP.NET Core API to production deployment with Docker, CI/CD, caching, and testing. It covers only what matters — with MUST vs OPTIONAL classification for every technology.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does it take to become a job-ready .NET developer?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'With focused effort following this roadmap, you can become job-ready in 12 weeks. The plan covers ASP.NET Core, EF Core, authentication, Docker, background jobs, caching, resilience, and testing — the exact skills employers look for.',
          },
        },
        {
          '@type': 'Question',
          name: 'What technologies should a .NET backend developer learn in 2026?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In 2026, a .NET backend developer should learn ASP.NET Core with Minimal APIs, Entity Framework Core with PostgreSQL, FluentValidation, Serilog, JWT authentication, Docker, GitHub Actions for CI/CD, Redis caching, MassTransit for background work, Polly for resilience, and xUnit for testing.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is this .NET roadmap free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, the Practical .NET Roadmap for 2026 is completely free. It includes the full roadmap guide, 7 portfolio project ideas, production-ready code templates, progress checklists, and a 12-week learning plan.',
          },
        },
        {
          '@type': 'Question',
          name: 'What portfolio projects should a junior .NET developer build?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'This roadmap includes 7 portfolio projects that progressively build your skills — from a basic CRUD API to a fully deployed, production-ready application with authentication, caching, background processing, and automated tests. Each project comes with extension ideas to make it stand out.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between MUST and OPTIONAL technologies in .NET?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The roadmap classifies every technology as MUST (essential for getting hired and building production apps) or OPTIONAL (nice-to-have that can wait). This saves months by helping you focus on what actually matters: ASP.NET Core, EF Core, Docker, and testing are MUST. Things like gRPC or GraphQL are OPTIONAL.',
          },
        },
      ],
    },
  ],
}

const DotNetRoadmap2026 = () => {
  return (
    <>
      <Script
        id="roadmap-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 heading-section text-center">
              <h1 className="text-white mb-4">
                Stop jumping between random tutorials.
                <br />
                <span className="text-yellow">
                  Follow a clear path to becoming a .NET developer.
                </span>
              </h1>

              <h3 className="text-white mb-4">
                The only guide you need to go from zero to job-ready .NET developer
                in 12 weeks. No fluff. No random technology lists. Just a clear path
                that mirrors how real developers build real applications.
              </h3>

              <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mb-4">
                <div className="text-white">✅ 8 progressive steps - </div>
                <div className="text-white">✅ 7 portfolio projects - </div>
                <div className="text-white">✅ 12-week plan - </div>
                <div className="text-white">✅ Production-ready templates</div>
              </div>

              <div className="row justify-content-center" id="download-roadmap">
                <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
                  <div className="text-center p-4">
                    <h4 className="text-white">
                      Send me the <span className="text-yellow">FREE .NET Roadmap</span> now
                    </h4>
                    {/* TODO: Replace PLACEHOLDER-FORM-ID with actual eomail form ID */}
                    <div
                      id="eomail-form-hero"
                      dangerouslySetInnerHTML={{
                        __html: `<script async src="https://eomail4.com/form/782231c8-3778-11f1-b51d-5b8e82dfd76d.js" data-form="782231c8-3778-11f1-b51d-5b8e82dfd76d"></script>`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="background-yellow" />

        {/* The 12-Week Path */}
        <div className="container">
          <div className="row text-center pt-5">
            <div className="col-md-12 mb-5">
              <h2 className="text-white">The 12-Week Path</h2>
              <p className="text-white">
                Each step builds on the previous one. Don&apos;t skip ahead.
              </p>
            </div>

            {roadmapSteps.map((item, index) => (
              <div
                className="col-xs-12 col-sm-12 col-md-6 col-lg-3 mb-4"
                key={index}
              >
                <div
                  className="p-4 h-100"
                  style={{
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      background: 'rgba(34, 197, 94, 0.14)',
                      border: '1px solid rgba(34, 197, 94, 0.35)',
                      color: '#bbf7d0',
                      borderRadius: '999px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      marginBottom: '12px',
                    }}
                  >
                    {item.step} · {item.weeks}
                  </div>
                  <h5 className="text-white mb-2">
                    {item.title}
                  </h5>
                  <p className="text-white mb-0" style={{ fontSize: '0.9rem' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What's Inside */}
        <div className="container">
          <div className="row text-center pt-5">
            <div className="col-md-12 mb-5">
              <h2 className="text-white">What&apos;s Inside</h2>
              <p className="text-white">
                Not vague advice. A complete roadmap with real code, real projects,
                and a real plan.
              </p>
            </div>

            {whatsInsideItems.map((item, index) => (
              <div
                className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mb-4"
                key={index}
              >
                <div
                  className="p-4 h-100"
                  style={{
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    textAlign: 'left',
                  }}
                >
                  <h5 className="text-white mb-3">
                    <span className="text-yellow">✓</span> {item.title}
                  </h5>
                  <p className="text-white mb-0">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="container">
          <div className="row pt-5 pb-3">
            <div className="col-md-12 text-center mb-4">
              <h2 className="text-white">Tech Stack</h2>
              <p className="text-white">
                Technologies introduced when you need them, not as a random shopping list.
              </p>
            </div>

            <div className="col-md-8 offset-md-2">
              <div
                className="p-4"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                {techStack.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center py-2"
                    style={{
                      borderBottom:
                        index < techStack.length - 1
                          ? '1px solid rgba(255,255,255,0.08)'
                          : 'none',
                    }}
                  >
                    <span className="text-white" style={{ fontWeight: 600 }}>
                      {item.category}
                    </span>
                    <span className="text-yellow">{item.tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Who Is It For + What Is This */}
        <div className="container">
          <div className="row pt-5 pb-5">
            <div className="col-md-6 mb-4">
              <div
                className="p-4 h-100"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  textAlign: 'left',
                }}
              >
                <h3 className="text-white mb-3">Who is this for?</h3>
                {whoIsItFor.map((item, index) => (
                  <p key={index} className="text-white mb-2">
                    ✅ {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div
                className="p-4 h-100"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  textAlign: 'left',
                }}
              >
                <h3 className="text-white mb-3">What is this exactly?</h3>
                <p className="text-white mb-0">
                  A practical, opinionated roadmap that covers everything you need
                  to become a job-ready .NET backend developer — with production-ready
                  code templates, portfolio project guides, progress checklists, and
                  honest advice on what to learn (and what to skip). Built by developers
                  who&apos;ve been through the journey.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-6 mx-auto">
              <div className="text-center p-4">
                <h4 className="text-white">
                  Send me the <span className="text-yellow">FREE .NET Roadmap</span> now
                </h4>
                <div
                  className="d-flex justify-content-center"
                  dangerouslySetInnerHTML={{
                    __html: `<script async src="https://eomail4.com/form/782231c8-3778-11f1-b51d-5b8e82dfd76d.js" data-form="782231c8-3778-11f1-b51d-5b8e82dfd76d"></script>`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section — AEO optimized */}
        <div className="container">
          <div className="row pt-5 pb-5">
            <div className="col-md-12 text-center mb-4">
              <h2 className="text-white">Frequently Asked Questions</h2>
            </div>

            <div className="col-md-10 offset-md-1">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="mb-4 p-4"
                  style={{
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    textAlign: 'left',
                  }}
                >
                  <h3 className="text-yellow mb-3" style={{ fontSize: '1.15rem' }}>
                    {item.question}
                  </h3>
                  <p className="text-white mb-0">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-6 mx-auto">
              <div className="text-center p-4">
                <h4 className="text-white">
                  Send me the <span className="text-yellow">FREE .NET Roadmap</span> now
                </h4>
                <div
                  className="d-flex justify-content-center"
                  dangerouslySetInnerHTML={{
                    __html: `<script async src="https://eomail4.com/form/782231c8-3778-11f1-b51d-5b8e82dfd76d.js" data-form="782231c8-3778-11f1-b51d-5b8e82dfd76d"></script>`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DotNetRoadmap2026
