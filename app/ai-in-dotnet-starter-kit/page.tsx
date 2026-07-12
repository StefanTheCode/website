import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: 'AI in .NET Starter Kit - Semantic Search, RAG, MCP Server + Free Claude Code Skill',
  description:
    'Free source code for building AI features in .NET 10. Semantic Search, RAG System, and MCP Server - plus a free Claude Code skill for .NET from the .NET AI ToolKit. All running locally with Ollama, pgvector, and ASP.NET Core.',
  openGraph: {
    title: 'AI in .NET Starter Kit - Semantic Search, RAG, MCP Server + Free Claude Code Skill',
    type: 'website',
    url: 'https://thecodeman.net/ai-in-dotnet-starter-kit',
    description:
      'Free source code for building AI features in .NET 10. Semantic Search, RAG System, and MCP Server - plus a free Claude Code skill for .NET from the .NET AI ToolKit. All running locally with Ollama, pgvector, and ASP.NET Core.',
  },
  twitter: {
    title: 'AI in .NET Starter Kit - Semantic Search, RAG, MCP Server + Free Claude Code Skill',
    card: 'summary_large_image',
    site: '@TheCodeMan__',
    creator: '@TheCodeMan__',
    description:
      'Free source code for building AI features in .NET 10. Semantic Search, RAG System, and MCP Server - plus a free Claude Code skill for .NET from the .NET AI ToolKit. All running locally with Ollama, pgvector, and ASP.NET Core.',
  },
};

const modules = [
  {
    label: 'Module 1',
    title: 'Semantic Search in .NET',
    description:
      'Build a search that understands meaning, not just keywords. Uses Microsoft.Extensions.AI, Ollama for local embeddings, and pgvector on Neon Serverless Postgres to store and query vectors.',
    tags: ['Microsoft.Extensions.AI', 'Ollama', 'pgvector', 'Neon Serverless Db'],
  },
  {
    label: 'Module 2',
    title: 'RAG System in .NET',
    description:
      'Ground your AI responses in real data. Ingest documents, embed them, retrieve the relevant chunks at query time, and feed them to an LLM - so the AI answers from your data, not from guesswork.',
    tags: ['Retrieval-Augmented Generation', 'Ollama LLMs', 'pgvector', 'ASP.NET Core'],
  },
  {
    label: 'Module 3',
    title: 'MCP Server in .NET',
    description:
      'Expose your .NET services as tools that any AI client can call. GitHub Copilot, Claude, and Cursor connect to your server and use your data - without you rewriting anything per client.',
    tags: ['Model Context Protocol', 'GitHub Copilot', 'ASP.NET Core', 'Blazor Dashboard'],
  },
];

const AiStarterKit = () => {
  return (
    <>
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">

        {/* ── Hero ── */}
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8 heading-section text-center mt-5">
              <h1 className="text-white mb-4">
                Stop guessing how AI works in .NET.
                <br />
                <span className="text-yellow">Download the source code and run it yourself.</span>
              </h1>

              <h4 className="text-white mb-4" style={{ fontWeight: 400, lineHeight: 1.6 }}>
                Three complete, working projects - Semantic Search, RAG System, and MCP Server -
                built with .NET 10 and running entirely on your machine. Plus{' '}
                <span className="text-yellow">5 free Claude Code skills</span> that make Claude write
                production-grade .NET for you.
              </h4>

              <div className="d-flex flex-wrap justify-content-center gap-3 mb-3">
                {['✅ .NET 10', '✅ Semantic Search', '✅ RAG System', '✅ MCP Server', '✅ Ollama LLMs', '✅ pgvector', '✅ 5 Claude Code Skills'].map((item) => (
                  <span key={item} className="text-white">{item}</span>
                ))}
              </div>

              <p className="text-white mb-5" style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                Want the full arsenal - 44+ skills, 7 specialist agents &amp; CLAUDE.md templates?
                That lives inside the <span className="text-yellow">.NET AI ToolKit community</span>.
              </p>

              <div className="row justify-content-center">
                <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
                  <div
                    className="p-4"
                    style={{
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <h4 className="text-white mb-3">
                      Get the <span className="text-yellow">free source code</span>
                    </h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `<script async src="https://eomail4.com/form/64f8b448-fe65-11ef-9a18-ad167120d785.js" data-form="64f8b448-fe65-11ef-9a18-ad167120d785"></script>`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="background-yellow" />

        {/* ── NEW UPDATE: free Claude Code skill ── */}
        <div className="container">
          <div className="row justify-content-center pt-5">
            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
              <div
                className="p-4"
                style={{
                  border: '1px solid rgba(80, 250, 123, 0.35)',
                  borderRadius: '16px',
                  background: 'rgba(80, 250, 123, 0.06)',
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    background: '#50fa7b',
                    color: '#0d2818',
                    borderRadius: '999px',
                    padding: '5px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    marginBottom: '14px',
                  }}
                >
                  🆕 NEW UPDATE
                </div>
                <h3 className="text-white mb-3">
                  Now included: <span className="text-yellow">5 free Claude Code skills</span> for .NET
                </h3>
                <p className="text-white mb-4" style={{ lineHeight: 1.6 }}>
                  Five Claude Code skills that make Claude write production .NET instead of generic C#:
                  an <strong>EF Core query optimizer</strong> (N+1, projections, <code>AsNoTracking</code>),
                  a <strong>Minimal API scaffolder</strong>, an <strong>integration-test writer</strong>
                  (Testcontainers, no in-memory fakes), a <strong>Result-pattern refactor</strong>, and a
                  <strong> modern .NET code reviewer</strong>.
                </p>
                <p className="text-white mb-3">
                  Free and open-source &mdash; installed in Claude Code with one command:
                </p>
                <pre
                  style={{
                    background: '#16122e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '16px',
                    color: '#f8f8f2',
                    fontSize: '0.85rem',
                    overflowX: 'auto',
                    marginBottom: '0',
                  }}
                >
{`/plugin marketplace add StefanTheCode/dotnet-claude-skills
/plugin install dotnet-claude-skills@thecodeman-free-skills`}
                </pre>
                <p className="text-white mt-3 mb-0" style={{ fontSize: '0.9rem', opacity: 0.85 }}>
                  Grab the free source code below to get started. The full set &mdash; 44+ skills, 7 agents
                  &amp; CLAUDE.md templates &mdash; lives inside the <span className="text-yellow">.NET AI ToolKit community</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── What's Inside ── */}
        <div className="container">
          <div className="row text-center pt-5">
            <div className="col-md-12 mb-5">
              <h2 className="text-white">What&apos;s Inside</h2>
              <p className="text-white">Three self-contained modules. Each one is a real, runnable project with a companion article.</p>
            </div>

            {modules.map((mod, index) => (
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4 mb-4" key={index}>
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
                      background: 'rgba(99, 102, 241, 0.14)',
                      border: '1px solid rgba(99, 102, 241, 0.35)',
                      color: '#c7d2fe',
                      borderRadius: '999px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      marginBottom: '12px',
                    }}
                  >
                    {mod.label}
                  </div>
                  <h5 className="text-white mb-3">{mod.title}</h5>
                  <p className="text-white mb-4" style={{ fontSize: '0.95rem' }}>{mod.description}</p>
                  <div className="d-flex flex-wrap gap-2">
                    {mod.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          padding: '3px 10px',
                          fontSize: '0.78rem',
                          color: 'rgba(255,255,255,0.7)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Cover image + bottom CTA ── */}
        <div className="container">
          <div className="row align-items-center pt-5 pb-5">
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-5 text-center mb-4">
              <Image
                src="/images/rag-system-cover.png"
                priority={true}
                alt="AI in .NET Starter Kit cover"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
              />
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-7">
              <div
                className="p-4"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <h4 className="text-white mb-3">
                  Get the <span className="text-yellow">free source code</span>
                </h4>
                <p className="text-white mb-4">
                  Enter your email and I&apos;ll send you the full source code for all three modules - Semantic Search, RAG System, and MCP Server - ready to clone and run.
                </p>
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<script async src="https://eomail4.com/form/64f8b448-fe65-11ef-9a18-ad167120d785.js" data-form="64f8b448-fe65-11ef-9a18-ad167120d785"></script>`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
};

export default AiStarterKit;