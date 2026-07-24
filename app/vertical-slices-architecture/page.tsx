import { Metadata } from 'next'
import FreeMotion from '../../components/free/FreeMotion'
import TerminalDemo, { DemoTab } from '../../components/free/TerminalDemo'

const PAGE_URL = 'https://thecodeman.net/vertical-slices-architecture'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: 'Vertical Slice Architecture - .NET 10 Project Template',
  description:
    'Download a free production-ready Vertical Slice Architecture .NET 10 project template. Minimal APIs, EF Core, PostgreSQL, DataAnnotations, Scalar - only 5 NuGet packages.',
  keywords: [
    'Vertical Slice Architecture',
    'VSA .NET',
    '.NET project template',
    'Minimal APIs',
    'Entity Framework Core',
    'Clean Architecture alternative',
    'C# project structure',
    '.NET 10',
    'PostgreSQL .NET',
    'Scalar API documentation',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Vertical Slice Architecture - .NET 10 Project Template',
    type: 'website',
    url: PAGE_URL,
    description:
      'Free production-ready Vertical Slice Architecture .NET 10 template. 10 endpoints, 2 domains, Minimal APIs, zero unnecessary abstractions - only 5 NuGet packages.',
    siteName: 'TheCodeMan.net',
  },
  twitter: {
    title: 'Vertical Slice Architecture - .NET 10 Project Template',
    card: 'summary_large_image',
    site: '@TheCodeMan__',
    creator: '@TheCodeMan__',
    description:
      'Free VSA .NET 10 template: Minimal APIs, EF Core, PostgreSQL, DataAnnotations validation, Scalar docs - zero unnecessary abstractions.',
  },
}

const templateFeatures = [
  { title: 'Self-contained feature slices', description: 'Each feature file contains its Request DTO, validation rules, handler logic, and endpoint mapping - all in one place. Add a feature? Add a file. Delete a feature? Delete a file.' },
  { title: 'Minimal APIs with route groups', description: 'No controllers, no attributes - just lambdas and route groups. Clean composition under /api/newsletters and /api/subscribers with shared OpenAPI tags.' },
  { title: 'Built-in validation with DataAnnotations', description: 'A single generic ValidationFilter<T> handles validation for the entire API. Add [Required], [StringLength], [EmailAddress] to any request record - done.' },
  { title: 'ProblemDetails error responses', description: 'Standard RFC 9457 error format. Structured Error records with {Feature}.{Reason} codes - easy to trace, easy to handle on the client.' },
  { title: 'Only 5 NuGet packages', description: 'No MediatR. No FluentValidation. No AutoMapper. No Carter. Zero unnecessary abstractions - only what .NET gives you out of the box.' },
  { title: 'EF Core 10 + PostgreSQL', description: 'Code-first with typed DbContextOptions, explicit entity configuration with HasMaxLength constraints, sealed DbContext, and auto-migrations in dev.' },
]

const techStackItems = [
  { tech: '.NET 10', purpose: 'Latest LTS framework' },
  { tech: 'Minimal APIs', purpose: 'Lightweight, high-performance endpoints' },
  { tech: 'EF Core 10', purpose: 'ORM with code-first migrations' },
  { tech: 'PostgreSQL', purpose: 'Database provider via Npgsql' },
  { tech: 'Scalar', purpose: 'Modern API documentation (replaces Swagger)' },
  { tech: 'DataAnnotations', purpose: 'Built-in request validation' },
]

const whatYouLearnItems = [
  'How to structure a .NET 10 API using Vertical Slice Architecture',
  'How to use Minimal APIs with route groups for clean endpoint composition',
  'How to implement validation without FluentValidation using DataAnnotations + endpoint filters',
  'How to organize Commands and Queries within feature slices (lightweight CQRS)',
  'How to handle errors with structured error types and proper HTTP status codes',
  'How to build a production-ready API with only 5 NuGet packages',
]

const patternsUsed = [
  { pattern: 'Vertical Slice Architecture', detail: 'Features organized by business capability, not technical concern' },
  { pattern: 'CQRS (lightweight)', detail: 'Commands and Queries separated into subfolders per feature' },
  { pattern: 'Endpoint Filters', detail: 'Cross-cutting validation via generic IEndpointFilter' },
  { pattern: 'Immutable DTOs', detail: 'All request/response types are sealed records' },
  { pattern: 'RESTful API Design', detail: 'Correct HTTP verbs, status codes (201, 200, 204, 404, 409)' },
  { pattern: 'Projection Queries', detail: '.Select() projections instead of loading full entities for reads' },
]

const stats: { target: number; suffix?: string; label: string }[] = [
  { target: 17, label: 'Source files' },
  { target: 10, label: 'Endpoints' },
  { target: 2, label: 'Feature domains' },
  { target: 5, label: 'NuGet packages' },
]

type TreeLine = { text: string; comment?: string; accent?: boolean }
const fileTree: TreeLine[] = [
  { text: 'src/', accent: true },
  { text: '├─ Features/' },
  { text: '│  ├─ Newsletters/' },
  { text: '│  │  ├─ CreateNewsletter.cs', comment: 'request + handler + endpoint' },
  { text: '│  │  ├─ PublishNewsletter.cs' },
  { text: '│  │  └─ GetNewsletters.cs', comment: 'projection query' },
  { text: '│  └─ Subscribers/' },
  { text: '│     ├─ AddSubscriber.cs' },
  { text: '│     └─ GetSubscribers.cs' },
  { text: '├─ Common/' },
  { text: '│  ├─ ValidationFilter.cs', comment: 'generic IEndpointFilter' },
  { text: '│  └─ Error.cs', comment: 'ProblemDetails' },
  { text: '├─ Infrastructure/AppDbContext.cs', comment: 'EF Core 10 + PostgreSQL' },
  { text: '└─ Program.cs', comment: 'route groups + Scalar' },
]

const demoTabs: DemoTab[] = [
  {
    id: 'run', label: 'run the API', command: 'dotnet run',
    lines: [
      { text: 'Building VerticalSlice.Api…', tone: 'muted' },
      { text: 'Now listening on http://localhost:5080', tone: 'green' },
      { text: 'Scalar UI  →  /scalar/v1', tone: 'plain' },
      { text: '10 endpoints mapped across 2 features', tone: 'green' },
    ],
  },
  {
    id: 'feature', label: 'add a feature', command: 'new  Features/Newsletters/SnoozeNewsletter.cs',
    lines: [
      { text: '  ✓ Request record + DataAnnotations', tone: 'green' },
      { text: '  ✓ Handler returning Result<T>', tone: 'green' },
      { text: '  ✓ Endpoint → POST /api/newsletters/{id}/snooze', tone: 'green' },
      { text: 'one file. one feature. done.', tone: 'muted' },
    ],
  },
  {
    id: 'call', label: 'call endpoint', command: 'curl -X POST /api/newsletters',
    lines: [
      { text: '→ 201 Created', tone: 'green' },
      { text: 'Location: /api/newsletters/8f2c…', tone: 'plain' },
      { text: 'RFC 9457 ProblemDetails on every error', tone: 'muted' },
    ],
  },
  {
    id: 'validate', label: 'validation', command: 'curl -X POST /api/subscribers -d "{}"',
    lines: [
      { text: 'ValidationFilter<T> kicks in', tone: 'muted' },
      { text: '✖ 400 Bad Request', tone: 'red' },
      { text: 'Email: "The Email field is required."', tone: 'red' },
    ],
  },
]

const card = { border: '1px solid var(--tk-line)', borderRadius: '16px', background: 'var(--tk-card-bg)' } as const
const yellowBtn = { display: 'inline-block', padding: '14px 34px', borderRadius: '999px', fontWeight: 800, fontSize: '1rem', textDecoration: 'none', background: '#ffbd39', color: '#2a003a' } as const

const VerticalSlicesArchitecture = () => {
  return (
    <>
      <FreeMotion />
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">

        {/* ── Hero ── */}
        <div className="tk-hero-glow crk-hero-glow">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xs-12 col-sm-12 col-md-11 col-lg-10 heading-section text-center mt-5">
                <span className="tk-eyebrow" data-reveal>Free .NET 10 template</span>

                <div className="d-flex justify-content-center mb-4" data-reveal data-delay="1">
                  <div className="d-inline-flex align-items-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '8px 16px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#46d39a', display: 'inline-block', marginRight: '10px' }} />
                    <span className="text-white" style={{ fontSize: '0.92rem' }}><strong>FREE</strong> production-ready project template</span>
                  </div>
                </div>

                <h1 className="text-white mb-4" data-reveal data-delay="1">
                  Vertical Slice Architecture in .NET 10.
                  <br />
                  <span className="text-yellow crk-shimmer">Zero unnecessary abstractions.</span>
                </h1>

                <h4 className="text-white mb-4" style={{ fontWeight: 400, lineHeight: 1.6 }} data-reveal data-delay="2">
                  A VSA API template with 10 endpoints, 2 feature domains, and only 5 NuGet packages.
                  No MediatR. No FluentValidation. No AutoMapper. Just clean .NET.
                </h4>

                <div className="row justify-content-center" id="download-kit" data-reveal data-delay="3">
                  <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
                    <div className="tk-card crk-form-card p-4 p-md-5" style={card}>
                      <h5 className="text-white mb-3">Send me the <span className="text-yellow">FREE template</span> now</h5>
                      <div dangerouslySetInnerHTML={{ __html: `<script async src="https://eomail4.com/form/138810fc-2805-11f1-987b-399d28f1f05e.js" data-form="138810fc-2805-11f1-987b-399d28f1f05e"></script>` }} />
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4" data-reveal data-delay="4">
                  {['17 source files', '10 endpoints', '5 NuGet packages'].map((b) => (
                    <span key={b} className="text-white d-inline-flex align-items-center" style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                      <span className="text-yellow" style={{ marginRight: '8px' }}>✓</span>{b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Interactive terminal demo ── */}
        <div className="container mt-5">
          <div className="row justify-content-center text-center">
            <div className="col-md-11 col-lg-9 mb-4" data-reveal>
              <span className="tk-eyebrow">See it work</span>
              <h2 className="text-white">One file per feature, running</h2>
              <p className="text-white" style={{ opacity: 0.85 }}>Click a command to watch the template in action.</p>
            </div>
          </div>
          <div className="row justify-content-center" data-reveal>
            <div className="col-xs-12 col-sm-12 col-md-11 col-lg-9">
              <TerminalDemo title="bash · vertical-slice-api" tabs={demoTabs} />
            </div>
          </div>
        </div>

        {/* ── File tree mockup ── */}
        <div className="container mt-5" data-reveal>
          <div className="row justify-content-center">
            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
              <div className="crk-tree" style={{ ...card, overflow: 'hidden' }}>
                <div className="d-flex align-items-center" style={{ gap: '8px', padding: '14px 18px', borderBottom: '1px solid var(--tk-line)' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff6b81', display: 'inline-block' }} />
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd39', display: 'inline-block' }} />
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#46d39a', display: 'inline-block' }} />
                  <span className="text-white" style={{ marginLeft: '10px', opacity: 0.6, fontSize: '0.82rem', fontFamily: "'JetBrains Mono', monospace" }}>
                    <span className="crk-type" data-text="project structure" />
                    <span className="crk-caret" />
                  </span>
                </div>
                <div style={{ padding: '20px 22px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', lineHeight: 1.9, overflowX: 'auto' }}>
                  {fileTree.map((line, i) => (
                    <div key={i} className="crk-tree-line" style={{ whiteSpace: 'pre' }}>
                      <span style={{ color: line.accent ? '#ffbd39' : 'rgba(255,255,255,0.9)', fontWeight: line.accent ? 700 : 400 }}>{line.text}</span>
                      {line.comment && <span style={{ color: 'rgba(255,255,255,0.4)' }}>{`  # ${line.comment}`}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="container mt-5" data-reveal>
          <div className="row justify-content-center text-center">
            {stats.map((s, i) => (
              <div className="col-6 col-md-3 mb-4" key={s.label} data-reveal data-delay={String((i % 4) + 1)}>
                <div className="tk-card p-4 h-100" style={card}>
                  <div className="text-yellow crk-count" style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }} data-target={s.target} data-suffix={s.suffix ?? ''} data-comma="0">
                    0{s.suffix ?? ''}
                  </div>
                  <div className="text-white mt-2" style={{ opacity: 0.75, fontSize: '0.9rem' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── What's inside ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>What&apos;s inside the template</span>
              <h2 className="text-white" data-reveal data-delay="1">A real project, not a toy example</h2>
              <p className="text-white" style={{ opacity: 0.85 }} data-reveal data-delay="2">
                Two complete feature domains, 10 fully functional endpoints, and zero bloat.
              </p>
            </div>
            {templateFeatures.map((item, index) => (
              <div className="col-xs-12 col-sm-12 col-md-6 mb-4" key={index} data-reveal data-delay={String((index % 2) + 1)}>
                <div className={`tk-card crk-accent-card ${['crk-a-yellow', 'crk-a-teal', 'crk-a-purple', 'crk-a-coral'][index % 4]} p-4 h-100`} style={{ ...card, textAlign: 'left' }}>
                  <h5 className="text-white mb-3"><span className="crk-check">✓</span> {item.title}</h5>
                  <p className="text-white mb-0" style={{ opacity: 0.85 }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── Tech stack ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>The stack</span>
              <h2 className="text-white" data-reveal data-delay="1">Modern .NET, nothing exotic</h2>
            </div>
            {techStackItems.map((t, i) => (
              <div className="col-6 col-md-4 mb-4" key={t.tech} data-reveal data-delay={String((i % 3) + 1)}>
                <div className="tk-card p-4 h-100" style={{ ...card, textAlign: 'left' }}>
                  <div className="text-yellow" style={{ fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem' }}>{t.tech}</div>
                  <p className="text-white mb-0 mt-2" style={{ opacity: 0.8, fontSize: '0.9rem' }}>{t.purpose}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── What you'll learn ── */}
        <div className="container">
          <div className="row justify-content-center pt-4">
            <div className="col-md-12 text-center mb-5">
              <span className="tk-eyebrow" data-reveal>What you&apos;ll learn</span>
              <h2 className="text-white" data-reveal data-delay="1">Skills you keep after the download</h2>
            </div>
            <div className="col-md-10 col-lg-9" data-reveal>
              <div className="tk-card p-4 p-md-5" style={{ ...card, textAlign: 'left' }}>
                {whatYouLearnItems.map((item, index) => (
                  <p key={index} className="text-white mb-3" style={{ opacity: 0.9 }}>
                    <span style={{ color: '#46d39a', marginRight: '10px' }}>✓</span>{item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── Patterns used ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>Patterns inside</span>
              <h2 className="text-white" data-reveal data-delay="1">Battle-tested patterns, applied</h2>
            </div>
            {patternsUsed.map((p, i) => (
              <div className="col-xs-12 col-sm-12 col-md-6 mb-4" key={p.pattern} data-reveal data-delay={String((i % 2) + 1)}>
                <div className={`tk-card crk-accent-card ${['crk-a-teal', 'crk-a-purple', 'crk-a-coral', 'crk-a-yellow'][i % 4]} p-4 h-100`} style={{ ...card, textAlign: 'left' }}>
                  <h5 className="crk-check mb-2" style={{ fontSize: '1.05rem' }}>{p.pattern}</h5>
                  <p className="text-white mb-0" style={{ opacity: 0.85 }}>{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── Context cards ── */}
        <div className="container">
          <div className="row pt-4">
            <div className="col-md-6 mb-4" data-reveal>
              <div className="tk-card p-4 p-md-5 h-100" style={{ ...card, textAlign: 'left' }}>
                <h3 className="text-white mb-3" style={{ fontSize: '1.3rem' }}>What is this exactly?</h3>
                <p className="text-white mb-0" style={{ opacity: 0.85 }}>
                  A production-ready starter Vertical Slice Architecture API template built with .NET 10 and Minimal APIs.
                  Two complete feature domains - Newsletters (full CRUD + Publish) and Subscribers (full CRUD) - with
                  10 fully functional endpoints, structured error handling, and modern API docs via Scalar.
                </p>
              </div>
            </div>
            <div className="col-md-6 mb-4" data-reveal data-delay="1">
              <div className="tk-card p-4 p-md-5 h-100" style={{ ...card, textAlign: 'left' }}>
                <h3 className="text-white mb-3" style={{ fontSize: '1.3rem' }}>Who is it for?</h3>
                <p className="text-white mb-0" style={{ opacity: 0.85 }}>
                  .NET developers who want to move beyond traditional N-layer / Clean Architecture. Backend engineers
                  looking for a lightweight, maintainable API structure. Teams that want each feature independently
                  buildable - and anyone tired of jumping between 5+ files to understand one feature.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Final CTA ── */}
        <div className="container pt-4 pb-5">
          <div className="row justify-content-center" data-reveal>
            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-9">
              <div className="tk-card p-5 text-center" style={{ ...card, background: 'rgba(255,189,57,0.06)', borderColor: 'rgba(255,189,57,0.3)' }}>
                <h2 className="text-white mb-3">One file per feature. Ship faster.</h2>
                <p className="text-white mb-4" style={{ opacity: 0.85 }}>The full .NET 10 VSA template, free, in your inbox.</p>
                <a href="#download-kit" className="tk-btn" style={yellowBtn}>Send me the template</a>
                <p className="text-white mt-3 mb-0" style={{ opacity: 0.6, fontSize: '0.85rem' }}>No credit card · unsubscribe anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default VerticalSlicesArchitecture
