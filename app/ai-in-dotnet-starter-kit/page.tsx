import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import FreeMotion from '../../components/free/FreeMotion'
import TerminalDemo, { DemoTab } from '../../components/free/TerminalDemo'

const PAGE_URL = 'https://thecodeman.net/ai-in-dotnet-starter-kit'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: 'AI in .NET Starter Kit - Semantic Search, RAG, MCP Server + Free Claude Code Skill',
  description:
    'Free source code for building AI features in .NET 10. Semantic Search, RAG System, and MCP Server - plus a free Claude Code skill for .NET from the .NET AI ToolKit. All running locally with Ollama, pgvector, and ASP.NET Core.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'AI in .NET Starter Kit - Semantic Search, RAG, MCP Server + Free Claude Code Skill',
    type: 'website',
    url: PAGE_URL,
    description:
      'Free source code for building AI features in .NET 10. Semantic Search, RAG System, and MCP Server - plus a free Claude Code skill for .NET from the .NET AI ToolKit. All running locally with Ollama, pgvector, and ASP.NET Core.',
  },
  twitter: {
    title: 'AI in .NET Starter Kit - Semantic Search, RAG, MCP Server + Free Claude Code Skill',
    card: 'summary_large_image',
    site: '@TheCodeMan__',
    creator: '@TheCodeMan__',
    description:
      'Free source code for building AI features in .NET 10. Semantic Search, RAG System, and MCP Server - plus a free Claude Code skill for .NET from the .NET AI ToolKit.',
  },
}

const modules = [
  { label: 'Module 1', title: 'Semantic Search in .NET', description: 'Build a search that understands meaning, not just keywords. Uses Microsoft.Extensions.AI, Ollama for local embeddings, and pgvector on Neon Serverless Postgres to store and query vectors.', tags: ['Microsoft.Extensions.AI', 'Ollama', 'pgvector', 'Neon Serverless Db'] },
  { label: 'Module 2', title: 'RAG System in .NET', description: 'Ground your AI responses in real data. Ingest documents, embed them, retrieve the relevant chunks at query time, and feed them to an LLM - so the AI answers from your data, not from guesswork.', tags: ['Retrieval-Augmented Generation', 'Ollama LLMs', 'pgvector', 'ASP.NET Core'] },
  { label: 'Module 3', title: 'MCP Server in .NET', description: 'Expose your .NET services as tools that any AI client can call. GitHub Copilot, Claude, and Cursor connect to your server and use your data - without you rewriting anything per client.', tags: ['Model Context Protocol', 'GitHub Copilot', 'ASP.NET Core', 'Blazor Dashboard'] },
]

const marqueeItems = [
  'Semantic Search', 'RAG System', 'MCP Server', 'Microsoft.Extensions.AI', 'Ollama',
  'pgvector', 'Neon Postgres', 'ASP.NET Core', 'Blazor Dashboard', '5 Claude Code Skills',
]

const stats: { target: number; suffix?: string; label: string }[] = [
  { target: 3, label: 'Runnable projects' },
  { target: 5, label: 'Free Claude skills' },
  { target: 44, suffix: '+', label: 'Skills in the full kit' },
  { target: 100, suffix: '%', label: 'Runs locally' },
]

const demoTabs: DemoTab[] = [
  {
    id: 'search', label: 'semantic search', command: 'search "reset my password"',
    lines: [
      { text: 'Embedding query with Ollama (nomic-embed)…', tone: 'muted' },
      { text: 'pgvector cosine search over 1,240 docs', tone: 'muted' },
      { text: '1. Account recovery guide         0.91', tone: 'green' },
      { text: '2. Forgotten password steps       0.88', tone: 'green' },
      { text: 'matched by meaning, not keywords', tone: 'muted' },
    ],
  },
  {
    id: 'rag', label: 'RAG', command: 'ask "what is our refund window?"',
    lines: [
      { text: 'retrieving top-4 chunks…', tone: 'muted' },
      { text: 'grounding the LLM in your documents', tone: 'muted' },
      { text: '"Refunds are accepted within 30 days of purchase."', tone: 'plain' },
      { text: 'source: policies/refunds.md', tone: 'yellow' },
    ],
  },
  {
    id: 'mcp', label: 'MCP server', command: 'dotnet run --project McpServer',
    lines: [
      { text: 'MCP server listening (stdio)', tone: 'green' },
      { text: 'tools exposed: get_orders, create_invoice', tone: 'plain' },
      { text: 'Claude connected ✓   Copilot connected ✓', tone: 'green' },
    ],
  },
  {
    id: 'skill', label: 'Claude skill', command: 'optimize the EF query in OrdersService',
    lines: [
      { text: 'ef-core-query-optimizer skill triggered', tone: 'muted' },
      { text: '• added .AsNoTracking()', tone: 'green' },
      { text: '• projected to OrderDto (was loading full entity)', tone: 'green' },
      { text: '• fixed N+1 on .Items', tone: 'green' },
    ],
  },
]

const card = { border: '1px solid var(--tk-line)', borderRadius: '16px', background: 'var(--tk-card-bg)' } as const
const yellowBtn = { display: 'inline-block', padding: '14px 34px', borderRadius: '999px', fontWeight: 800, fontSize: '1rem', textDecoration: 'none', background: '#ffbd39', color: '#2a003a' } as const

const FORM = `<script async src="https://eomail4.com/form/64f8b448-fe65-11ef-9a18-ad167120d785.js" data-form="64f8b448-fe65-11ef-9a18-ad167120d785"></script>`

const AiStarterKit = () => {
  return (
    <>
      <FreeMotion />
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">

        {/* ── Hero ── */}
        <div className="tk-hero-glow crk-hero-glow">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xs-12 col-sm-12 col-md-11 col-lg-9 heading-section text-center mt-5">
                <span className="tk-eyebrow" data-reveal>Free AI-in-.NET source code</span>

                <div className="d-flex justify-content-center mb-4" data-reveal data-delay="1">
                  <div className="d-inline-flex align-items-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '8px 16px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#46d39a', display: 'inline-block', marginRight: '10px' }} />
                    <span className="text-white" style={{ fontSize: '0.92rem' }}>3 real projects + <strong>5 free Claude Code skills</strong></span>
                  </div>
                </div>

                <h1 className="text-white mb-4" data-reveal data-delay="1">
                  Stop guessing how AI works in .NET.
                  <br />
                  <span className="text-yellow crk-shimmer">Download the code and run it yourself.</span>
                </h1>

                <h4 className="text-white mb-4" style={{ fontWeight: 400, lineHeight: 1.6 }} data-reveal data-delay="2">
                  Three complete, working projects - Semantic Search, RAG System, and MCP Server - built with .NET 10
                  and running entirely on your machine. Plus <span className="text-yellow">5 free Claude Code skills</span> that
                  make Claude write production-grade .NET for you.
                </h4>

                <div className="row justify-content-center" id="download-kit" data-reveal data-delay="3">
                  <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
                    <div className="tk-card crk-form-card p-4 p-md-5" style={card}>
                      <h5 className="text-white mb-3">Get the <span className="text-yellow">free source code</span></h5>
                      <div dangerouslySetInnerHTML={{ __html: FORM }} />
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4" data-reveal data-delay="4">
                  {['.NET 10', 'Runs locally', 'Open source'].map((b) => (
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

        {/* ── Interactive terminal demo ── */}
        <div className="container mt-5">
          <div className="row justify-content-center text-center">
            <div className="col-md-11 col-lg-9 mb-4" data-reveal>
              <span className="tk-eyebrow">See it work</span>
              <h2 className="text-white">Real AI, running on .NET</h2>
              <p className="text-white" style={{ opacity: 0.85 }}>Click a capability to watch it run locally.</p>
            </div>
          </div>
          <div className="row justify-content-center" data-reveal>
            <div className="col-xs-12 col-sm-12 col-md-11 col-lg-9">
              <TerminalDemo title="bash · ai-in-dotnet" tabs={demoTabs} />
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

        {/* ── NEW: free Claude Code skills + install terminal ── */}
        <div className="container">
          <div className="row justify-content-center pt-4">
            <div className="col-xs-12 col-sm-12 col-md-11 col-lg-9" data-reveal>
              <div className="tk-card p-4 p-md-5" style={{ ...card, background: 'rgba(70, 211, 154, 0.06)', borderColor: 'rgba(70, 211, 154, 0.3)' }}>
                <div style={{ display: 'inline-block', background: '#46d39a', color: '#0d2818', borderRadius: '999px', padding: '5px 14px', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '14px' }}>
                  NEW UPDATE
                </div>
                <h3 className="text-white mb-3">Now included: <span className="text-yellow">5 free Claude Code skills</span> for .NET</h3>
                <p className="text-white mb-4" style={{ lineHeight: 1.6, opacity: 0.9 }}>
                  Five Claude Code skills that make Claude write production .NET instead of generic C#: an{' '}
                  <strong>EF Core query optimizer</strong> (N+1, projections, <code>AsNoTracking</code>), a{' '}
                  <strong>Minimal API scaffolder</strong>, an <strong>integration-test writer</strong> (Testcontainers, no
                  in-memory fakes), a <strong>Result-pattern refactor</strong>, and a <strong>modern .NET code reviewer</strong>.
                </p>

                {/* terminal mockup */}
                <div style={{ ...card, overflow: 'hidden' }}>
                  <div className="d-flex align-items-center" style={{ gap: '8px', padding: '12px 16px', borderBottom: '1px solid var(--tk-line)' }}>
                    <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff6b81', display: 'inline-block' }} />
                    <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ffbd39', display: 'inline-block' }} />
                    <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#46d39a', display: 'inline-block' }} />
                    <span className="text-white" style={{ marginLeft: '10px', opacity: 0.6, fontSize: '0.8rem', fontFamily: "'JetBrains Mono', monospace" }}>install in Claude Code</span>
                  </div>
                  <pre style={{ margin: 0, padding: '18px', color: '#f8f8f2', fontSize: '0.85rem', overflowX: 'auto', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.7 }}>
{`/plugin marketplace add StefanTheCode/dotnet-claude-starter
/plugin install dotnet-claude-starter@thecodeman-claude-starter`}
                  </pre>
                </div>

                <p className="text-white mt-3 mb-0" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Free and open-source. The full set - 44+ skills, 7 agents &amp; CLAUDE.md templates - lives inside the{' '}
                  <Link href="/ai-toolkit" className="text-yellow">.NET AI ToolKit community</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── What's inside (modules) ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>What&apos;s inside</span>
              <h2 className="text-white" data-reveal data-delay="1">Three self-contained modules</h2>
              <p className="text-white" style={{ opacity: 0.85 }} data-reveal data-delay="2">Each one is a real, runnable project with a companion article.</p>
            </div>
            {modules.map((mod, index) => (
              <div className="col-xs-12 col-sm-12 col-lg-4 mb-4" key={index} data-reveal data-delay={String(index + 1)}>
                <div className={`tk-card crk-accent-card ${['crk-a-yellow', 'crk-a-teal', 'crk-a-purple'][index % 3]} p-4 h-100`} style={{ ...card, textAlign: 'left' }}>
                  <div className="crk-pill">{mod.label}</div>
                  <h5 className="text-white mb-3">{mod.title}</h5>
                  <p className="text-white mb-4" style={{ fontSize: '0.95rem', opacity: 0.85 }}>{mod.description}</p>
                  <div className="d-flex flex-wrap gap-2">
                    {mod.tags.map((tag) => (
                      <span key={tag} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.76rem', color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── Cover + bottom CTA ── */}
        <div className="container">
          <div className="row align-items-center pt-4 pb-5">
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-5 text-center mb-4" data-reveal>
              <div className="tk-card p-3" style={{ ...card, display: 'inline-block' }}>
                <Image src="/images/rag-system-cover.png" priority alt="AI in .NET Starter Kit cover" width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-7" data-reveal data-delay="1">
              <div className="tk-card crk-form-card p-4 p-md-5" style={card}>
                <h4 className="text-white mb-3">Get the <span className="text-yellow">free source code</span></h4>
                <p className="text-white mb-4" style={{ opacity: 0.85 }}>
                  Enter your email and I&apos;ll send you the full source code for all three modules - Semantic Search,
                  RAG System, and MCP Server - ready to clone and run.
                </p>
                <div dangerouslySetInnerHTML={{ __html: FORM }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AiStarterKit
