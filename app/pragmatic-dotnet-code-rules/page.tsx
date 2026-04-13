import config from '@/config.json'
import EbookNewsletter from '@/components/ebookTestimonials';
import { Metadata } from 'next';
import Image from 'next/image'
import FreePreviewButton from '@/components/FreePreviewButton';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net/pragmatic-dotnet-code-rules'),
  title: "Pragmatic .NET Code Rules — EditorConfig, Roslyn Analyzers & CI Quality Gates",
  alternates: {
    canonical: 'https://thecodeman.net/pragmatic-dotnet-code-rules',
  },
  description: "Master .editorconfig, Roslyn analyzers, Visual Studio Code Cleanup, dotnet format, and CI/CD quality gates for .NET. Enforce consistent C# code style and coding standards across your team — production-ready configs included.",
  keywords: [
    'editorconfig c#',
    'editorconfig dotnet',
    'roslyn analyzers',
    'dotnet code style',
    'c# coding standards',
    'enforce code style dotnet',
    'dotnet format',
    'c# naming conventions',
    'visual studio code cleanup',
    'EnforceCodeStyleInBuild',
    'c# code quality',
    '.NET analyzers',
    'dotnet format ci pipeline',
    'code style enforcement',
    'StyleCop vs Roslyn analyzers',
  ],
  openGraph: {
    title: "Pragmatic .NET Code Rules — EditorConfig, Roslyn Analyzers & CI Quality Gates",
    type: "website",
    url: "https://thecodeman.net/pragmatic-dotnet-code-rules",
    description: "Master .editorconfig, Roslyn analyzers, Visual Studio Code Cleanup, dotnet format, and CI/CD quality gates for .NET. Enforce consistent C# code style across your team.",
    images: [
      {
        url: 'https://thecodeman.net/og-course.png',
        width: "1000px",
        height: "700px"
      }
    ],
  },
  twitter: {
    title: "Pragmatic .NET Code Rules — EditorConfig, Roslyn Analyzers & CI Quality Gates",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "Master .editorconfig, Roslyn analyzers, Visual Studio Code Cleanup, dotnet format, and CI/CD quality gates for .NET. Enforce consistent C# code style across your team.",
    images: [
      {
        url: 'https://thecodeman.net/og-course.png',
        width: "1000px",
        height: "700px"
      }
    ]
  }
}

const CHECKOUT_URL = 'https://stefandjokic.lemonsqueezy.com/checkout/buy/105be4cc-816d-4ccb-b588-858cf96e958e';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://thecodeman.net/pragmatic-dotnet-code-rules',
      url: 'https://thecodeman.net/pragmatic-dotnet-code-rules',
      name: 'Pragmatic .NET Code Rules — EditorConfig, Roslyn Analyzers & CI Quality Gates',
      description:
        'Master .editorconfig, Roslyn analyzers, Visual Studio Code Cleanup, dotnet format, and CI/CD quality gates for .NET. Enforce consistent C# code style across your team.',
      isPartOf: { '@id': 'https://thecodeman.net/#website' },
      about: {
        '@type': 'Thing',
        name: '.NET Code Quality and Style Enforcement',
      },
      author: {
        '@type': 'Person',
        name: 'Stefan Djokic',
        url: 'https://thecodeman.net',
        jobTitle: 'Microsoft MVP',
      },
    },
    {
      '@type': 'Course',
      name: 'Pragmatic .NET Code Rules',
      description:
        'A comprehensive course on enforcing consistent C# code style using .editorconfig, Roslyn analyzers, Visual Studio Code Cleanup Profiles, dotnet format, and CI/CD quality gates. 12 modules, 60+ video lessons with production-ready configs.',
      provider: {
        '@type': 'Person',
        name: 'Stefan Djokic',
        url: 'https://thecodeman.net',
      },
      offers: {
        '@type': 'Offer',
        price: '74.89',
        priceCurrency: 'USD',
        availability: 'https://schema.org/PreOrder',
        url: 'https://thecodeman.net/pragmatic-dotnet-code-rules',
      },
      coursePrerequisites: 'Basic C# and .NET development experience',
      educationalLevel: 'Intermediate',
      teaches: [
        '.editorconfig configuration for .NET and C# projects',
        'Roslyn analyzer configuration and severity levels',
        'Visual Studio Code Cleanup Profiles',
        'dotnet format in CI/CD pipelines',
        'EnforceCodeStyleInBuild and warnings-as-errors',
        'Architecture tests with NetArchTest',
        'Structured logging with Serilog and OpenTelemetry',
        'AI-assisted dependency updates and PR review',
      ],
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        courseWorkload: 'Self-paced',
      },
      url: 'https://thecodeman.net/pragmatic-dotnet-code-rules',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What platform is the Pragmatic .NET Code Rules course hosted on?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The course is hosted on Skool, a modern platform that combines video lessons, community, and discussions in one place.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I enforce C# code style rules in CI/CD?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can enforce C# code style in CI/CD by running dotnet format --verify-no-changes in your pipeline, setting EnforceCodeStyleInBuild to true in your .csproj, and configuring Roslyn analyzer severity levels as errors in your .editorconfig file. This course covers the complete setup step by step.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is .editorconfig and why does my .NET project need one?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '.editorconfig is a configuration file that defines coding styles, formatting rules, and naming conventions for your project. In .NET, it controls C# code style preferences that are enforced by Roslyn analyzers during development and build. Every .NET team needs one to ensure consistent code across all developers and IDEs.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between Roslyn analyzers and StyleCop?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Roslyn analyzers are built into the .NET SDK and provide both code quality (CA) and code style (IDE) rules. StyleCop.Analyzers is a third-party NuGet package that focuses specifically on code style and documentation rules. They can be used together for comprehensive coverage. This course covers how to configure both.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use this course with .NET 6, 7, 8, or 9?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The techniques work with any modern .NET version. EditorConfig, Roslyn analyzers, and dotnet format are part of the .NET SDK and are not tied to a specific version.',
          },
        },
        {
          '@type': 'Question',
          name: 'What knowledge level do I need for this .NET code rules course?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You should be comfortable with C# and basic .NET projects. The content is practical and accessible for beginner+ and intermediate developers, and still very useful for seniors and team leads who want a system they can roll out across their team.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I set up .editorconfig for a .NET project?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You create a .editorconfig file at the root of your solution and configure formatting rules, naming conventions, and code style preferences. The file uses a hierarchical system where rules cascade from parent to child directories. This course provides a production-ready .editorconfig template you can copy and customize.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is EnforceCodeStyleInBuild in .NET?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'EnforceCodeStyleInBuild is a MSBuild property you set in your .csproj file that makes the compiler evaluate code style rules (IDE diagnostics) during build, not just in the IDE. Combined with TreatWarningsAsErrors, it ensures no code style violations pass through CI.',
          },
        },
        {
          '@type': 'Question',
          name: 'Will the course price increase after presale?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The presale price is 50% off the planned launch price of $149. When the course officially launches, the price goes up permanently to $149.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I get lifetime access to the course?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Your purchase includes lifetime access to all lessons and any future updates or improvements to the course.',
          },
        },
      ],
    },
  ],
};

const CodeRules = () => {
  return (
    <>
      <Script
        id="code-rules-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══════════════════════════════════════════════════
          HERO - What is this, who is it for, why now
      ═══════════════════════════════════════════════════ */}
      <section id="home-section" className="hero container">
        <div className="row d-md-flex no-gutters">
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 slider-text pt-5 float-left">
            <div className="text">
              <h1 className='display-none'>Pragmatic .NET Code Rules</h1>
              <p className="header-text mt-4" style={{ marginBottom: 0, lineHeight: 1.1 }}>Pragmatic</p>
              <p className="header-text" style={{ marginTop: 0, lineHeight: 1.1 }}><span className='text-yellow'>.NET Code Rules</span></p>
              <h2 className="mb-3 text-white">The system that makes your .NET codebase enforce itself - so your team never argues about code style again.</h2>
              <p className="mb-4 text-white" style={{ fontSize: '1.15rem', opacity: 0.9 }}>Get the exact <code>.editorconfig</code>, analyzers, CI quality gates, and automation setup I use in production. Copy, apply, ship.</p>

              <div className="mb-4">
                <p className="text-white mb-1" style={{ fontSize: '0.95rem', opacity: 0.75 }}>By Stefan Djokic, Microsoft MVP</p>
              </div>

              <a href={CHECKOUT_URL} className="lemonsqueezy-button">
                <button className="btn btn-lg btn-primary border-radius-10px button-padding">
                  Get Your .NET Codebase Under Control - <span className='text-green'> $74.89</span> <span style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: '0.85em' }}>$149</span>
                </button>
              </a>
              <p className='mb-1 mt-2 text-white' style={{ fontSize: '0.9rem' }}>Presale price - increases at launch. Refundable until release.</p>
            </div>
          </div>
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12 float-right">
            <Image src={'/images/course.png'} priority={true} alt={'Pragmatic .NET Code Rules course cover'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
        <EbookNewsletter />
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          PROBLEM / PAIN
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="pain-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">Messy code doesn&apos;t just look bad</p>
              <p className="header-text"><span className='text-yellow'>It silently kills your team&apos;s velocity</span></p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
              <h3 className='text-yellow text-center'><b>Same team. Same IDE. Same language.</b></h3>
              <h5 className='pt-3'>And yet… every file looks different.</h5>
              <h5 className='pt-3'>You know the <span className='text-yellow'>pain:</span></h5>
              <div className='row'>
                <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 text-center'>
                  <h5>• &quot;Please format this.&quot; - every PR review</h5>
                  <h5>• Endless nitpicking instead of real code review</h5>
                  <h5>• Styling conflicts instead of merge conflicts</h5>
                  <h5>• Warnings in one project, silence in another</h5>
                  <h5>• No one knows which style rules are &quot;correct&quot; anymore</h5>
                  <h5 className='pt-3'>This drains mental energy.</h5>
                  <h5>It slows down every PR.</h5>
                  <h5>It creates friction between teammates.</h5>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
              <Image src={'/images/course2.png'} alt={'Code inconsistency illustration'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
            </div>
          </div>
          <div className="row text-center">
            <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center'>
              <h4 className='text-white'>You don&apos;t need more discipline.</h4>
              <h3 className='text-yellow'>You need a system that enforces itself.</h3>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          OUTCOMES / TRANSFORMATION
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="outcomes-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">What Changes <span className='text-yellow'>After You Apply This</span></p>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(220, 53, 69, 0.08)', border: '1px solid rgba(220, 53, 69, 0.3)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className='text-danger text-center mb-4'><b>Before</b></h3>
                <h5 className='text-white'>❌ PRs full of &quot;fix formatting&quot; comments</h5>
                <h5 className='text-white'>❌ Every developer uses different style rules</h5>
                <h5 className='text-white'>❌ CI passes dirty code all the time</h5>
                <h5 className='text-white'>❌ New team members take weeks to understand conventions</h5>
                <h5 className='text-white'>❌ Time wasted on manual cleanup after every merge</h5>
                <h5 className='text-white'>❌ &quot;Tabs vs spaces&quot; debates in Slack</h5>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(40, 167, 69, 0.08)', border: '1px solid rgba(40, 167, 69, 0.3)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className='text-success text-center mb-4'><b>After</b></h3>
                <h5 className='text-white'>✔ PRs focus on logic, architecture, and real issues</h5>
                <h5 className='text-white'>✔ Every file follows the same rules - automatically</h5>
                <h5 className='text-white'>✔ CI rejects unformatted code before a human sees it</h5>
                <h5 className='text-white'>✔ New devs are productive on day one - the IDE guides them</h5>
                <h5 className='text-white'>✔ Cleanup happens on save - zero manual effort</h5>
                <h5 className='text-white'>✔ The codebase looks like one person wrote it</h5>
              </div>
            </div>
          </div>

          <div className="row text-center mt-4">
            <div className="col-xl-12 text-center">
              <a href={CHECKOUT_URL} className="lemonsqueezy-button">
                <button className='btn btn-lg btn-primary border-radius-10px button-padding'>Get Your .NET Codebase Under Control - <span className='text-green'> $74.89</span></button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          WHAT YOU WILL LEARN (Modules overview)
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="learn-section">
        <div className="container">
          <div className='row'>
            <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12'>
              <div className="row justify-content-center mb-5">
                <div className="col-md-12 heading-section text-center">
                  <p className="header-text">What <span className='text-yellow'>You Will Learn</span></p>
                  <h5 className='text-white pt-2' style={{ opacity: 0.8 }}>Production-tested techniques across 12 modules and 60+ lessons</h5>
                </div>
              </div>

              <div className="row text-center">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center'><b>The Code Consistency Mindset</b></h2>
                  <h5 className='pt-5'>Understand why <span className='text-yellow'>clean, unified code isn&apos;t just &quot;nice to have&quot;</span> - it&apos;s a force multiplier for productivity, team velocity, and long-term maintainability.</h5>
                  <h5 className='pt-3'>• See how inconsistent code silently kills delivery speed</h5>
                  <h5>• Learn the mindset top engineering teams use to stay aligned</h5>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
                  <Image src={'/images/mindset.png'} alt={'Code consistency mindset'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                </div>
              </div>

              <hr className='background-yellow' />

              <div className="row text-center">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
                  <Image src={'/images/editorconfig.png'} className='border-radius-20px' alt={'.editorconfig deep dive'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center pb-5'><b>.editorconfig Deep Dive</b></h2>
                  <h5 className='text-center'>Master the most underrated tool in the .NET ecosystem and make every IDE follow the same rules - automatically.</h5>
                  <h5 className='text-center pt-3'>• Build rock-solid formatting, naming, and analyzer rules</h5>
                  <h5 className='text-center'>• Structure .editorconfig for both small projects and massive solutions</h5>
                </div>
              </div>

              <hr className='background-yellow' />

              <div className="row text-center">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center'><b>Visual Studio Cleanup Automation</b></h2>
                  <h5 className='pt-5'>Turn Visual Studio into a self-cleaning machine that formats code before you even think about it.</h5>
                  <h5 className='text-center pt-3'>• Create Cleanup Profiles that instantly fix styling issues</h5>
                  <h5 className='text-center'>• Remove 90% of manual cleanup from your workflow</h5>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
                  <Image src={'/images/cleanup.png'} className='border-radius-20px' alt={'Visual Studio cleanup automation'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                </div>
              </div>

              <hr className='background-yellow' />

              <div className="row text-center">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
                  <Image src={'/images/errors.png'} className='border-radius-20px' alt={'Analyzers and warnings as errors'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center pb-5'><b>Analyzers &amp; Warnings-As-Errors</b></h2>
                  <h5 className='text-center'>Catch quality issues at the source instead of wasting reviewer time on low-value comments.</h5>
                  <h5 className='text-center pt-3'>• Configure analyzers that actually matter</h5>
                  <h5 className='text-center'>• Enforce rules without overwhelming developers with noise</h5>
                </div>
              </div>

              <hr className='background-yellow' />

              <div className="row text-center">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center'><b>dotnet format + CI Enforcement</b></h2>
                  <h5 className='pt-5'>Build a CI pipeline that refuses messy code and guarantees consistency across your entire organization.</h5>
                  <h5 className='text-center pt-3'>• Add dotnet format to your local and CI workflows</h5>
                  <h5 className='text-center'>• Fail PRs automatically when formatting rules are violated</h5>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
                  <Image src={'/images/ci.png'} className='border-radius-20px' alt={'CI/CD enforcement'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                </div>
              </div>

              <hr className='background-yellow' />

              <div className="row text-center">
                <div className='col-xl-1 col-lg-1 col-md-1 col-sm-1'></div>
                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 mb-5 text-center vertical-center">
                  <Image src={'/images/slack.png'} className='border-radius-20px text-center' alt={'Team-wide adoption strategies'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center pb-5'><b>Team-Wide Adoption Strategies</b></h2>
                  <h5 className='text-center'>Roll out code rules across your team smoothly, confidently, and without the usual resistance.</h5>
                  <h5 className='text-center pt-3'>• Introduce new rules gradually and strategically</h5>
                  <h5 className='text-center'>• Build a culture where clean, consistent code is the default</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="row text-center mt-3">
            <div className="col-xl-12 text-center">
              <a href={CHECKOUT_URL} className="lemonsqueezy-button">
                <button className='btn btn-lg btn-primary border-radius-10px button-padding'>Get Your .NET Codebase Under Control - <span className='text-green'> $74.89</span></button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          WHAT'S INCLUDED
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="included-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">Everything You Get <span className='text-yellow'>With the Course</span></p>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className='text-yellow mb-4'>📹 The Course</h3>
                <h5 className='text-white'>✔ 12 modules, 60+ video lessons</h5>
                <h5 className='text-white'>✔ Step-by-step, practical, production-focused</h5>
                <h5 className='text-white'>✔ Lifetime access + all future updates</h5>
                <h5 className='text-white'>✔ Hosted on Skool - watch anywhere</h5>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className='text-yellow mb-4'>📦 Ready-to-Use Files</h3>
                <h5 className='text-white'>✔ My production-ready <code>.editorconfig</code></h5>
                <h5 className='text-white'>✔ <code>Directory.Build.props</code> with best practices</h5>
                <h5 className='text-white'>✔ CI pipeline configs (GitHub Actions)</h5>
                <h5 className='text-white'>✔ Copy-paste into any .NET project</h5>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className='text-yellow mb-4'>👥 Community Access</h3>
                <h5 className='text-white'>✔ Private Skool community (free, included)</h5>
                <h5 className='text-white'>✔ Q&amp;A with the instructor</h5>
                <h5 className='text-white'>✔ Share setups, get feedback</h5>
                <h5 className='text-white'>✔ Connect with other .NET developers</h5>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className='text-yellow mb-4'>📋 Clean Commit Checklist (PDF)</h3>
                <h5 className='text-white'>✔ Step-by-step checklist for quality PRs</h5>
                <h5 className='text-white'>✔ Printable - pin it next to your monitor</h5>
                <h5 className='text-white'>✔ Share with your team for instant alignment</h5>
                <h5 className='text-white'>✔ Use it as your team&apos;s PR quality gate</h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          BONUSES
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="bonuses-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">Presale <span className='text-yellow'>Bonuses</span></p>
              <h5 className='text-white pt-2' style={{ opacity: 0.8 }}>Included free when you join during the presale - removed after launch.</h5>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 mb-4">
              <div style={{ background: 'linear-gradient(135deg, rgba(249,184,1,0.08), rgba(249,184,1,0.02))', border: '1px solid rgba(249,184,1,0.3)', borderRadius: '12px', padding: '2rem', height: '100%' }}>
                <h4 className='text-yellow mb-3'>🎁 Starter Kit</h4>
                <h5 className='text-white'>A pre-configured .NET solution with <code>.editorconfig</code>, <code>Directory.Build.props</code>, analyzer setup, and CI pipeline - ready to clone and use.</h5>
                <p className='text-yellow mt-3' style={{ fontSize: '0.9rem' }}>Value: $49</p>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 mb-4">
              <div style={{ background: 'linear-gradient(135deg, rgba(249,184,1,0.08), rgba(249,184,1,0.02))', border: '1px solid rgba(249,184,1,0.3)', borderRadius: '12px', padding: '2rem', height: '100%' }}>
                <h4 className='text-yellow mb-3'>🎁 CI Quality Gate Template</h4>
                <h5 className='text-white'>A GitHub Actions workflow that runs <code>dotnet format</code>, analyzers, and architecture tests - fails the PR if anything is off.</h5>
                <p className='text-yellow mt-3' style={{ fontSize: '0.9rem' }}>Value: $29</p>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 mb-4">
              <div style={{ background: 'linear-gradient(135deg, rgba(249,184,1,0.08), rgba(249,184,1,0.02))', border: '1px solid rgba(249,184,1,0.3)', borderRadius: '12px', padding: '2rem', height: '100%' }}>
                <h4 className='text-yellow mb-3'>🎁 Bonus Video: Automating PR Cleanup</h4>
                <h5 className='text-white'>A dedicated walkthrough on setting up AI-assisted dependency updates and automated PR review with Dependabot + GitHub Actions.</h5>
                <p className='text-yellow mt-3' style={{ fontSize: '0.9rem' }}>Value: $29</p>
              </div>
            </div>
          </div>

          <div className="row text-center mt-4">
            <div className="col-xl-12 text-center">
              <a href={CHECKOUT_URL} className="lemonsqueezy-button">
                <button className='btn btn-lg btn-primary border-radius-10px button-padding'>Join the Presale &amp; Get All Bonuses - <span className='text-green'> $74.89</span></button>
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
              <p className="header-text">What Developers <span className='text-yellow'>Are Saying</span></p>
            </div>
          </div>

          {/* Senja testimonial widget */}
          <EbookNewsletter />

          <div className="row mt-4 justify-content-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #4a90d9, #357abd)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0 }}>AM</div>
                  <div style={{ marginLeft: '12px' }}>
                    <p className='text-yellow mb-0' style={{ fontWeight: 'bold' }}>Anton Martyniuk</p>
                    <p className='text-white mb-0' style={{ fontSize: '0.85rem', opacity: 0.7 }}>Microsoft MVP | .NET Software Architect</p>
                  </div>
                </div>
                <p className='text-white' style={{ fontStyle: 'italic' }}>&quot;I have been working with static weather analysis for many years. .editorconfig, props files and static code analysis packages are my daily tools. Stefan explains, really in depth, how these things work and how you can set them up from scratch.</p>
                <p className='text-white' style={{ fontStyle: 'italic' }}>This is the most in-depth course on .NET quality that I have ever seen. I can highly recommend this course for .NET developers, as it will increase your code quality, cut your code review time, and reduce the number of bugs.</p>
                <p className='text-white' style={{ fontStyle: 'italic' }}>A trick for adding a pre-commit hook in Git is something I learnt myself from this course.&quot;</p>
                <p className='text-yellow mb-0'>⭐⭐⭐⭐⭐</p>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #e8a838, #d4922a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0 }}>KK</div>
                  <div style={{ marginLeft: '12px' }}>
                    <p className='text-yellow mb-0' style={{ fontWeight: 'bold' }}>Kanaiya Katarmal</p>
                    <p className='text-white mb-0' style={{ fontSize: '0.85rem', opacity: 0.7 }}>.NET Developer</p>
                  </div>
                </div>
                <p className='text-white' style={{ fontStyle: 'italic' }}>&quot;I really enjoyed the chapters on EditorConfig and automating code cleanup. From my experience, code style inconsistencies often become a problem in team projects, but this course provides a clear and practical way to solve that.</p>
                <p className='text-white' style={{ fontStyle: 'italic' }}>The step-by-step explanation of creating and configuring the .editorconfig file made the concept easy to understand. I also found the sections on Visual Studio cleanup profiles and Git pre-commit hooks especially useful because they show how to automate formatting and maintain standards without relying on manual checks.&quot;</p>
                <p className='text-yellow mb-0'>⭐⭐⭐⭐⭐</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHY TRUST ME / INSTRUCTOR
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section background-yellow" id="instructor-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <h2 className="text-black"><b>This Isn&apos;t Theory - It&apos;s How I Ship Production Code</b></h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-2"></div>
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-12 text-center">
                  <Image src={'/images/ebook-stefan.png'} className='border-radius-20px course-profile-img' alt={'Stefan Djokic - Microsoft MVP'} width={0} height={0} sizes="20vw" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="col-md-12 text-center">
                  <p className='text-black text-font-2rem'><b>Hi, I&apos;m Stefan Đokić</b></p>
                  <p className='text-black text-font-2rem'>Microsoft MVP · Senior Software Engineer · Creator of TheCodeMan.net</p>
                  <h5 className='text-black pt-3'>For more than 10 years, I&apos;ve been building large-scale .NET solutions where consistency, clarity, and automation aren&apos;t optional - they&apos;re the only way teams ship fast and reliably.</h5>
                  <h5 className='text-black pt-3'>Everything in this course comes from real production experience - not theory, not academic examples, not &quot;ideal world&quot; scenarios. These are the exact files and configs I use every day.</h5>
                </div>
                <div className="col-md-12 pt-3 text-center">
                  <Image src={'/images/mvp.png'} className='course-profile-img' alt={'Microsoft MVP badge'} width={0} height={0} sizes="20vw" style={{ width: '100%', height: 'auto' }} />
                </div>
              </div>
            </div>
            <div className="col-md-2"></div>
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
          PRICING / OFFER
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="pricing-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">Presale <span className='text-yellow'>Pricing</span></p>
              <h5 className='text-white pt-2' style={{ opacity: 0.8 }}>Lock in the lowest price - it increases at launch and never comes back.</h5>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8 col-md-10 col-sm-12">
              <div style={{ background: 'linear-gradient(135deg, rgba(249,184,1,0.06), rgba(249,184,1,0.02))', border: '2px solid rgba(249,184,1,0.4)', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center' }}>
                <h3 className='text-yellow mb-2'>Pragmatic .NET Code Rules</h3>
                <p className='text-white mb-4' style={{ opacity: 0.7 }}>Complete Course + Bonuses + Community</p>

                <div className='mb-3'>
                  <span style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '1.5rem' }} className='text-white'>$149</span>
                  <span className='text-green' style={{ fontSize: '3rem', fontWeight: 'bold', marginLeft: '1rem' }}>$74.89</span>
                </div>
                <p className='text-yellow mb-4' style={{ fontSize: '0.95rem' }}>Presale - 50% off launch price</p>

                <div className='text-left mb-4' style={{ maxWidth: '380px', margin: '0 auto' }}>
                  <h5 className='text-white'>✔ 12 modules, 60+ video lessons</h5>
                  <h5 className='text-white'>✔ Production-ready config files</h5>
                  <h5 className='text-white'>✔ CI quality gate template</h5>
                  <h5 className='text-white'>✔ Starter kit (.NET solution)</h5>
                  <h5 className='text-white'>✔ Clean Commit Checklist (PDF)</h5>
                  <h5 className='text-white'>✔ Bonus: AI-assisted PR review video</h5>
                  <h5 className='text-white'>✔ Community access (free, lifetime)</h5>
                  <h5 className='text-white'>✔ Lifetime access + all future updates</h5>
                </div>

                <a href={CHECKOUT_URL} className="lemonsqueezy-button">
                  <button className='btn btn-lg btn-primary border-radius-10px button-padding' style={{ width: '100%', maxWidth: '420px' }}>
                    Get Your .NET Codebase Under Control
                  </button>
                </a>
                <p className='text-white mt-3' style={{ fontSize: '0.85rem', opacity: 0.6 }}>Refundable until course release. Secure checkout via Lemon Squeezy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          IS THIS FOR YOU?
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="audience-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">Is This Course <span className='text-yellow'>Right for You?</span></p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5">
              <div className="blog-entry text-center pt-3">
                <h2 className='text-danger'>Not for developers who:</h2>
                <h3 className='text-danger pt-3'>✕ <span className='text-white'> Prefer manual cleanup</span></h3>
                <h3 className='text-danger'>✕ <span className='text-white'> Believe &quot;style doesn&apos;t matter&quot;</span></h3>
                <h3 className='text-danger'>✕ <span className='text-white'> Don&apos;t want automation in their workflow</span></h3>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5">
              <div className="blog-entry text-center pt-3">
                <h2 className='text-success'>Built for developers who:</h2>
                <h3 className='text-success pt-3'>✔ <span className='text-white'>Work in .NET teams of any size</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'>Want predictable, standardized code</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'>Are tired of PRs full of style corrections</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'>Want CI/CD to enforce consistency</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'>Care about maintainability and professionalism</span></h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          URGENCY - Why buy now
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="urgency-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 col-md-12 text-center">
              <p className="header-text mb-4">Why <span className='text-yellow'>Join the Presale?</span></p>

              <div className='text-left' style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h5 className='text-white mb-3'>⏰ <b className='text-yellow'>Lowest price ever.</b> The presale price is 50% off the planned launch price. Once the course goes live, the price goes up - permanently.</h5>
                <h5 className='text-white mb-3'>🎁 <b className='text-yellow'>Exclusive bonuses.</b> The Starter Kit, CI Quality Gate Template, and bonus video are presale-only extras. They won&apos;t be part of the standard package.</h5>
                <h5 className='text-white mb-3'>🔓 <b className='text-yellow'>Early access.</b> Presale buyers get access to modules as they drop - before the official launch. Start applying the setup now, not later.</h5>
                <h5 className='text-white mb-3'>🔄 <b className='text-yellow'>Zero risk.</b> Refundable up until the course officially releases. If it&apos;s not for you, just reach out.</h5>
              </div>

              <div className="mt-5">
                <a href={CHECKOUT_URL} className="lemonsqueezy-button">
                  <button className='btn btn-lg btn-primary border-radius-10px button-padding'>Join the Presale - <span className='text-green'> $74.89</span></button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          FULL CURRICULUM
      ═══════════════════════════════════════════════════ */}
      <section className="ftco-section" id="curriculum-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">The Full <span className='text-yellow'>Curriculum</span></p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5">
              <div className="blog-entry text-left pt-3">

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    🧱 00. Course Introduction
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">00.01 – Welcome <FreePreviewButton videoId="vlJhmURwVSM" /></h5>
                    <h5 className="text-white text-left">00.02 – What You Will Learn <FreePreviewButton videoId="o9rwJhYA-P4" /></h5>
                    <h5 className="text-white text-left">00.03 – Who This Course Is For <FreePreviewButton videoId="poQCgDSWfdw" /></h5>
                    <h5 className="text-white text-left">00.04 – Tools &amp; Requirements <FreePreviewButton videoId="PMqs_dSs0LU" /></h5>
                    <h5 className="text-white text-left">00.05 – How to follow the course <FreePreviewButton videoId="2fUxoUnMpI0" /></h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    🗂️ 01. The Foundation: EditorConfig
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">01.00 – Module Intro <FreePreviewButton videoId="vBLHCsSoHP0" /></h5>
                    <h5 className="text-white text-left">01.01 – Why Code Style Consistency Matters <FreePreviewButton videoId="L8BtAQO1t4I" /></h5>
                    <h5 className="text-white text-left">01.02 – Creating the CleanStart Solution Structure</h5>
                    <h5 className="text-white text-left">01.03 – What EditorConfig Is &amp; How It Works</h5>
                    <h5 className="text-white text-left">01.04 – Adding the <code>.editorconfig</code> File</h5>
                    <h5 className="text-white text-left">01.05 – Running Code Cleanup to Apply Rules</h5>
                    <h5 className="text-white text-left">01.06 – EditorConfig Tips, Tricks &amp; Best Practices</h5>
                    <h5 className="text-white text-left">01.07 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    🧹 02. Automating Code Cleanup
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">02.00 – Module Intro <FreePreviewButton videoId="CzkPS4jzgsY" /></h5>
                    <h5 className="text-white text-left">02.01 – Visual Studio Code Cleanup Profiles</h5>
                    <h5 className="text-white text-left">02.02 – Running Cleanup Automatically on Save</h5>
                    <h5 className="text-white text-left">02.03 – One-Click Full Solution Cleanup</h5>
                    <h5 className="text-white text-left">02.04 – Git Pre-Commit Hooks for Formatting</h5>
                    <h5 className="text-white text-left">02.05 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    🚨 03. Diagnostics &amp; Treating Warnings as Errors
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">03.01 – Understanding Diagnostic Severities</h5>
                    <h5 className="text-white text-left">03.02 – Organizing Rules: Suggestion, Warning, Error</h5>
                    <h5 className="text-white text-left">03.03 – Enforcing Warnings as Errors in .NET Projects</h5>
                    <h5 className="text-white text-left">03.04 – How This Prevents Future Bugs</h5>
                    <h5 className="text-white text-left">03.05 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    🔍 04. Static Analysis in .NET
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">04.01 – Introduction to .NET Analyzers</h5>
                    <h5 className="text-white text-left">04.02 – Adding StyleCop to the Project</h5>
                    <h5 className="text-white text-left">04.03 – Adding SonarAnalyzer for Deeper Analysis</h5>
                    <h5 className="text-white text-left">04.04 – Configuring Analyzer Rules in EditorConfig</h5>
                    <h5 className="text-white text-left">04.05 – Identifying Real-World Issues with Static Analysis</h5>
                    <h5 className="text-white text-left">04.06 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    🏗️ 05. Centralized Settings with Directory.Build.props
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">05.01 – Why Centralized Build Settings Matter</h5>
                    <h5 className="text-white text-left">05.02 – Creating Directory.Build.props</h5>
                    <h5 className="text-white text-left">05.03 – Adding Global Usings, LangVersion &amp; Nullable Settings</h5>
                    <h5 className="text-white text-left">05.04 – Unifying All Projects with Shared Rules</h5>
                    <h5 className="text-white text-left">05.05 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    ⚙️ 06. Visual Studio Productivity &amp; Clean Code Features
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">06.01 – Essential VS Formatting Features</h5>
                    <h5 className="text-white text-left">06.02 – File Header Templates</h5>
                    <h5 className="text-white text-left">06.03 – Custom Snippets for Faster Development</h5>
                    <h5 className="text-white text-left">06.04 – Format on Save, Run Cleanup on Build</h5>
                    <h5 className="text-white text-left">06.05 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    🧹 07. Project Cleanup &amp; Consistency Maintenance
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">07.01 – Standard Project Folder Structure</h5>
                    <h5 className="text-white text-left">07.02 – Enabling nullable &amp; analyzing warnings</h5>
                    <h5 className="text-white text-left">07.03 – Removing unused files, refs &amp; dependencies</h5>
                    <h5 className="text-white text-left">07.04 – Normalizing namespaces &amp; usings</h5>
                    <h5 className="text-white text-left">07.05 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    🧱 08. Architecture Tests (Enforcing Boundaries)
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">08.01 – Why Architecture Tests Matter</h5>
                    <h5 className="text-white text-left">08.02 – Adding NetArchTest</h5>
                    <h5 className="text-white text-left">08.03 – Testing Domain → Application → Infrastructure Relationships</h5>
                    <h5 className="text-white text-left">08.04 – Preventing Cycles &amp; Wrong References</h5>
                    <h5 className="text-white text-left">08.05 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    🔄 09. Integrating Code Quality into CI/CD
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">09.01 – dotnet format in CI</h5>
                    <h5 className="text-white text-left">09.02 – Running Analyzers in CI</h5>
                    <h5 className="text-white text-left">09.03 – Enforcing Warnings as Errors in the Pipeline</h5>
                    <h5 className="text-white text-left">09.04 – Preventing &quot;Dirty Code&quot; from Entering the Main Branch</h5>
                    <h5 className="text-white text-left">09.05 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    🧭 10. Logging &amp; Observability
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">10.01 – Adding Serilog to the Project</h5>
                    <h5 className="text-white text-left">10.02 – Structured Logging Best Practices</h5>
                    <h5 className="text-white text-left">10.03 – Adding OpenTelemetry (OTEL) Basics</h5>
                    <h5 className="text-white text-left">10.04 – Tracing Requests in an API</h5>
                    <h5 className="text-white text-left">10.05 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    🎁 11. Bonus: Create Your Own Clean .NET Project Template
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">11.01 – Turning the CleanStart Solution Into a Template</h5>
                    <h5 className="text-white text-left">11.02 – Exporting as a Visual Studio Template</h5>
                    <h5 className="text-white text-left">11.03 – Exporting as a dotnet new Template</h5>
                    <h5 className="text-white text-left">11.04 – Sharing the Template with Your Team</h5>
                    <h5 className="text-white text-left">11.05 – Course Wrap-Up</h5>
                  </div>
                </details>

                <details className="curriculum-details" open>
                  <summary className="text-yellow">
                    🤖 12. AI-Assisted Dependency &amp; PR Review
                  </summary>
                  <div className="pt-3">
                    <h5 className="text-white text-left">12.01 – Why Use AI for Dependency Updates</h5>
                    <h5 className="text-white text-left">12.02 – Setting Up Dependabot for NuGet in .NET</h5>
                    <h5 className="text-white text-left">12.03 – Creating a GitHub Action for AI PR Review</h5>
                    <h5 className="text-white text-left">12.04 – Designing Effective Prompts for Safe Updates</h5>
                    <h5 className="text-white text-left">12.05 – Optional: Labels, Changelog &amp; Notifications</h5>
                    <h5 className="text-white text-left">12.06 – Chapter Recap</h5>
                  </div>
                </details>
              </div>
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 text-center">
              <a href={CHECKOUT_URL} className="lemonsqueezy-button">
                <button className='btn btn-lg btn-primary border-radius-10px button-padding'>Get Your .NET Codebase Under Control - <span className='text-green'> $74.89</span></button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      {/* ═══════════════════════════════════════════════════
          FAQ
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
                  ❓01. What platform is the course hosted on?
                </h3>
                <h5 className="text-white text-left">
                  💡 The course is hosted on <span className="text-yellow">Skool</span>, a modern platform that combines
                  video lessons, community, and discussions in one place.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  ❓02. Is there a community included?
                </h3>
                <h5 className="text-white text-left">
                  💡 Yes. You get access to a private <span className="text-yellow">Skool community</span> where we discuss
                  code rules, share setups, and ask questions. Community access is{' '}
                  <span className="text-yellow">completely free</span> and included with the course.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  ❓03. Who is this course for?
                </h3>
                <h5 className="text-white text-left">
                  💡 .NET developers who want clean, consistent, automated code. It&apos;s great for individual developers,
                  teams maintaining long-lived projects, and tech leads running code quality initiatives.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  ❓04. What knowledge level do I need?
                </h3>
                <h5 className="text-white text-left">
                  💡 You should be comfortable with C# and basic .NET projects. The content is practical and accessible for
                  <span className="text-yellow"> beginner+</span> and <span className="text-yellow">intermediate</span>{' '}
                  developers, and still very useful for seniors and team leads who want a system they can roll out.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  ❓05. Can I use this with .NET 6/7/8/9?
                </h3>
                <h5 className="text-white text-left">
                  💡 Yes. The techniques work with <span className="text-yellow">any modern .NET version</span>. EditorConfig, analyzers, and dotnet format
                  are part of the .NET SDK - they&apos;re not tied to a specific version.
                </h5>
              </div>
            </div>

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-5">
              <div className="blog-entry text-left pt-3">
                <h3 className="text-yellow text-left pt-3">
                  ❓06. When does the course release?
                </h3>
                <h5 className="text-white text-left">
                  💡 Presale buyers get <span className="text-yellow">early access to modules as they drop</span>.
                  The full course is scheduled for official release soon.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  ❓07. Do I get lifetime access?
                </h3>
                <h5 className="text-white text-left">
                  💡 Yes. Your purchase includes <span className="text-yellow">lifetime access</span> to all lessons and any
                  future updates or improvements to the course.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  ❓08. Will the price increase later?
                </h3>
                <h5 className="text-white text-left">
                  💡 Yes. The presale is at <span className="text-yellow">50% off the planned launch price</span>.
                  When the course officially launches, the price goes up permanently.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  ❓09. Is there a refund policy?
                </h3>
                <h5 className="text-white text-left">
                  💡 Pre-orders are <span className="text-yellow">refundable up until the official course release</span>.
                  If you feel it&apos;s not for you, just reach out before launch.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  ❓10. What if I already have an .editorconfig?
                </h3>
                <h5 className="text-white text-left">
                  💡 Even better. The course shows you how to <span className="text-yellow">audit, improve, and enforce</span> your existing setup.
                  Most teams have a basic config - this course turns it into a complete automated system.
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
              <p className="header-text mb-3">Stop Arguing About Code Style.</p>
              <p className="header-text"><span className='text-yellow'>Start Enforcing It Automatically.</span></p>
              <h5 className='text-white pt-3 mb-5' style={{ opacity: 0.8 }}>Get the exact setup, configs, and CI pipeline that keeps your .NET codebase clean - without relying on humans.</h5>

              <a href={CHECKOUT_URL} className="lemonsqueezy-button">
                <button className='btn btn-lg btn-primary border-radius-10px button-padding' style={{ fontSize: '1.2rem', padding: '18px 40px' }}>
                  Get Your .NET Codebase Under Control - <span className='text-green'> $74.89</span>
                </button>
              </a>
              <p className='text-white mt-3' style={{ fontSize: '0.85rem', opacity: 0.6 }}>Presale price - 50% off launch. Refundable until release. Lifetime access.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default CodeRules;
