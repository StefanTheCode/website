import { Metadata } from 'next'
import Script from 'next/script'
import Image from 'next/image'
import FreeMotion from '../../components/free/FreeMotion'

const PAGE_URL = 'https://thecodeman.net/ai-roadmap-2026'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: 'AI Roadmap for .NET Developers 2026 - Claude Code, MCP, RAG & AI Agents',
  description:
    'Free AI roadmap for .NET developers. Go from AI-curious to shipping real AI in 8 steps: Claude Code & skills, MCP servers in C#, LLMs with Microsoft.Extensions.AI, embeddings, RAG, and AI agents - with runnable .NET projects.',
  keywords: [
    'AI roadmap for .NET developers', '.NET AI roadmap 2026', 'AI for .NET developers', 'Claude Code .NET',
    'MCP server C#', 'Model Context Protocol .NET', 'RAG in .NET', 'Microsoft.Extensions.AI',
    'AI agents in .NET', 'semantic search .NET', 'embeddings .NET', 'how to use AI in .NET',
    'build AI features in .NET', 'Claude skills for .NET', 'AI coding assistant .NET', 'IChatClient .NET',
    'learn AI as a .NET developer',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'AI Roadmap for .NET Developers 2026 - Claude Code, MCP, RAG & AI Agents',
    type: 'website',
    url: PAGE_URL,
    description:
      'Free AI roadmap for .NET developers. 8 steps from AI-curious to shipping real AI: Claude Code, MCP in C#, LLMs, embeddings, RAG, and AI agents - with runnable .NET projects.',
    siteName: 'TheCodeMan.net',
  },
  twitter: {
    title: 'AI Roadmap for .NET Developers 2026 - Claude Code, MCP, RAG & AI Agents',
    card: 'summary_large_image',
    site: '@TheCodeMan__',
    creator: '@TheCodeMan__',
    description:
      'Free AI roadmap for .NET developers. 8 steps from AI-curious to shipping real AI - with runnable .NET projects.',
  },
}

const roadmapSteps = [
  { step: 'Step 1', title: 'AI Coding Assistants', weeks: 'Week 1', description: 'Claude Code, Copilot, Cursor + the CLAUDE.md context file. Get faster today.' },
  { step: 'Step 2', title: 'Skills, Agents & Workflows', weeks: 'Week 2', description: 'Reusable skills, subagents, slash commands - make the AI a .NET specialist.' },
  { step: 'Step 3', title: 'MCP in C#', weeks: 'Week 3', description: 'Model Context Protocol - connect AI to your own tools and build a server in C#.' },
  { step: 'Step 4', title: 'Your First AI Feature', weeks: 'Week 4', description: 'LLMs with Microsoft.Extensions.AI & IChatClient - streaming, structured output.' },
  { step: 'Step 5', title: 'Embeddings & Semantic Search', weeks: 'Week 5', description: 'Vectors, pgvector / Qdrant, cosine similarity - search by meaning.' },
  { step: 'Step 6', title: 'RAG', weeks: 'Week 6', description: 'Chunk, retrieve, and ground the LLM in your data. The most in-demand AI skill.' },
  { step: 'Step 7', title: 'AI Agents in .NET', weeks: 'Week 7', description: 'Tool calling, Semantic Kernel / Agent Framework - reasoning plus action.' },
  { step: 'Step 8', title: 'Production AI', weeks: 'Week 8', description: 'Evals, cost & tokens, prompt-injection guardrails, observability.' },
]

const whatsInsideItems = [
  { title: 'The Full Roadmap Guide', description: '8 progressive steps from your first AI-assisted commit to production AI features, with MUST vs OPTIONAL for every topic and two clear tracks: use AI, and build AI.' },
  { title: '4 Portfolio Projects', description: 'Semantic Search, Document Q&A (RAG), an MCP server in C#, and a focused AI agent - three of them ship as runnable projects you can build from.' },
  { title: '8-Week Learning Plan', description: 'A structured weekly plan so you always know what to build next. Two months, eight things shipped.' },
  { title: 'Runnable .NET Projects', description: 'Working Semantic Search, RAG, and MCP server solutions in modern .NET 10 - clone, run, and extend.' },
  { title: 'Free Claude Code Skills', description: 'Skills that make Claude write production-grade .NET instead of generic C# - install and use as you follow the roadmap.' },
  { title: 'What NOT to Learn', description: 'Skip the hype. Know which AI topics to ignore (fine-tuning, transformer math, framework-of-the-week) so you save months.' },
]

const whoIsItFor = [
  '.NET developers who keep hearing about AI but don’t know where it fits in real work',
  'Backend engineers who want to build AI features into their own apps',
  'Developers who want to use AI coding tools well, not just install them',
  'Teams leveling up on applied AI without the hype',
]

const techStack = [
  { category: 'Coding faster', tech: 'Claude Code, Copilot, Cursor, CLAUDE.md' },
  { category: 'Extending your AI', tech: 'Skills, subagents, MCP (C# SDK)' },
  { category: 'Calling an LLM', tech: 'Microsoft.Extensions.AI, IChatClient' },
  { category: 'LLM providers', tech: 'Azure OpenAI, OpenAI, Ollama (local)' },
  { category: 'Semantic search', tech: 'Embeddings, pgvector, Qdrant' },
  { category: 'Grounding answers', tech: 'RAG: chunking, retrieval, top-k' },
  { category: 'Agents', tech: 'Semantic Kernel, Microsoft Agent Framework' },
  { category: 'Production', tech: 'Evals, OpenTelemetry, prompt-injection guardrails' },
]

const marqueeItems = [
  'Claude Code', 'CLAUDE.md', 'Skills & Agents', 'MCP in C#', 'Microsoft.Extensions.AI', 'IChatClient',
  'Embeddings', 'pgvector', 'RAG', 'Semantic Kernel', 'Evals', 'Guardrails',
]

const stats: { target: number; suffix?: string; label: string }[] = [
  { target: 8, label: 'Steps' },
  { target: 8, label: 'Week plan' },
  { target: 4, label: 'Portfolio projects' },
  { target: 3, label: 'Runnable solutions' },
]

const faqItems = [
  { question: 'What is the best AI roadmap for .NET developers in 2026?', answer: 'The AI Roadmap for .NET Developers is an 8-step, 8-week guide that takes you from using AI coding assistants (Claude Code, Copilot, Cursor) to building AI features into your own apps - MCP servers in C#, LLM calls with Microsoft.Extensions.AI, embeddings, RAG, and AI agents. It classifies every topic as MUST or OPTIONAL and ships with runnable .NET projects.' },
  { question: 'How do .NET developers use AI in their work?', answer: 'Two ways. First, use AI to write .NET faster: an assistant like Claude Code plus a CLAUDE.md context file, reusable skills, and agents. Second, build AI into your apps: call LLMs with Microsoft.Extensions.AI, add semantic search with embeddings, ground answers in your data with RAG, and build agents that call your C# tools via MCP.' },
  { question: 'What is MCP (Model Context Protocol) in .NET?', answer: 'MCP is a standard way for AI clients (Claude, Copilot, Cursor) to call external tools and data. In .NET you build an MCP server in C# with the official ModelContextProtocol SDK, expose your operations as tools, and any MCP-compatible AI client can use them. The roadmap includes a working C# MCP server project.' },
  { question: 'How do you build RAG in .NET?', answer: 'RAG (Retrieval-Augmented Generation) in .NET means: chunk your documents, embed them, store the vectors (pgvector or Qdrant), retrieve the most relevant chunks for a query, and feed them to an LLM so it answers from your data. The roadmap includes a runnable RAG project using Microsoft.Extensions.AI and Postgres.' },
  { question: 'Is this AI roadmap free?', answer: 'Yes, the AI Roadmap for .NET Developers is completely free. It includes the full step-by-step guide, an 8-week plan, four portfolio projects (three of them runnable), free Claude Code skills, and honest advice on what to skip.' },
  { question: 'What should a .NET developer learn about AI first?', answer: 'Start with using AI to code faster: pick one assistant (Claude Code, Copilot, or Cursor) and add a CLAUDE.md context file so it writes your conventions instead of generic C#. That is the fastest ROI. Then move into building AI features - LLM calls, embeddings, RAG, and agents.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebPage', '@id': PAGE_URL, url: PAGE_URL, name: 'AI Roadmap for .NET Developers 2026', description: 'Free AI roadmap for .NET developers. 8 steps from AI-curious to shipping real AI: Claude Code, MCP in C#, LLMs, embeddings, RAG, and AI agents.', isPartOf: { '@id': 'https://thecodeman.net/#website' }, about: { '@type': 'Thing', name: 'AI for .NET Development' }, author: { '@type': 'Person', name: 'Stefan Đokić', url: 'https://thecodeman.net', jobTitle: 'Microsoft MVP' } },
    { '@type': 'Course', name: 'AI Roadmap for .NET Developers 2026', description: 'A free 8-week, 8-step roadmap for .NET developers to use AI to build faster and build AI features into their apps. Covers Claude Code, MCP, LLMs, embeddings, RAG, and agents, with runnable .NET projects.', provider: { '@type': 'Person', name: 'Stefan Đokić', url: 'https://thecodeman.net' }, isAccessibleForFree: true, educationalLevel: 'Intermediate', teaches: 'Claude Code, MCP in C#, Microsoft.Extensions.AI, embeddings, semantic search, RAG, AI agents, production AI', timeRequired: 'P8W', url: PAGE_URL },
    { '@type': 'FAQPage', mainEntity: faqItems.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) },
  ],
}

const FORM_SCRIPT = `<script async src="https://eomail4.com/form/75d3c36e-842b-11f1-8edb-47846d42d594.js" data-form="75d3c36e-842b-11f1-8edb-47846d42d594"></script>`

const card = { border: '1px solid var(--tk-line)', borderRadius: '16px', background: 'var(--tk-card-bg)' } as const
const yellowBtn = { display: 'inline-block', padding: '14px 34px', borderRadius: '999px', fontWeight: 800, fontSize: '1rem', textDecoration: 'none', background: '#ffbd39', color: '#2a003a' } as const

const AiRoadmap2026 = () => {
  return (
    <>
      <FreeMotion />
      <Script id="ai-roadmap-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">

        {/* ── Hero ── */}
        <div className="tk-hero-glow crk-hero-glow">
          <div className="container">
            <div className="row align-items-center justify-content-center mt-5">
              <div className="col-xs-12 col-sm-12 col-md-6 heading-section text-center text-md-left mb-5 mb-md-0">
                <span className="tk-eyebrow" data-reveal>Free AI roadmap for .NET</span>

                <h1 className="text-white mb-4" data-reveal data-delay="1">
                  Everyone&apos;s talking about AI in .NET.
                  <br />
                  <span className="text-yellow crk-shimmer">Here&apos;s the exact path to use it.</span>
                </h1>

                <h4 className="text-white mb-4" style={{ fontWeight: 400, lineHeight: 1.6 }} data-reveal data-delay="2">
                  From AI-curious to shipping real AI in 8 steps. Use AI to write .NET faster, then build AI features
                  into your own apps - with runnable projects, not theory.
                </h4>

                <div id="download-roadmap" style={{ maxWidth: '460px' }} className="mx-auto mx-md-0" data-reveal data-delay="3">
                  <div className="tk-card crk-form-card p-4 p-md-5" style={card}>
                    <h5 className="text-white mb-3">Send me the <span className="text-yellow">FREE AI Roadmap</span></h5>
                    <div dangerouslySetInnerHTML={{ __html: FORM_SCRIPT }} />
                  </div>
                </div>

                <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 mt-4" data-reveal data-delay="4">
                  {['8 steps', 'Claude Code, MCP, RAG, agents', 'Runnable .NET code'].map((b) => (
                    <span key={b} className="text-white d-inline-flex align-items-center" style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                      <span className="text-yellow" style={{ marginRight: '8px' }}>✓</span>{b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="col-xs-12 col-sm-12 col-md-6 text-center" data-reveal data-delay="2">
                <div className="tk-card p-2" style={{ ...card, display: 'inline-block' }}>
                  <Image src="/images/ai-roadmap-2026.png" alt="AI Roadmap for .NET Developers 2026 - 8 steps from AI-curious to shipping real AI: Claude Code, MCP, LLMs, embeddings, RAG, and AI agents" width={0} height={0} sizes="(max-width: 768px) 100vw, 50vw" priority style={{ width: '100%', height: 'auto', borderRadius: '12px' }} />
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

        {/* ── 8-Week Path ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>The 8-week path</span>
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

        {/* ── What you'll learn (tech stack) ── */}
        <div className="container">
          <div className="row justify-content-center pt-4">
            <div className="col-md-12 text-center mb-5">
              <span className="tk-eyebrow" data-reveal>What you&apos;ll learn</span>
              <h2 className="text-white" data-reveal data-delay="1">The tools, introduced when you need them</h2>
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
                  A practical, opinionated roadmap for .NET developers who want to actually use AI - both to build faster
                  (Claude Code, skills, MCP) and to build AI features into their apps (LLMs, embeddings, RAG, agents).
                  It comes with runnable .NET projects, free Claude Code skills, an 8-week plan, and honest advice on
                  what to learn and what to skip.
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
                <h2 className="text-white mb-3">Two months. Eight things shipped.</h2>
                <p className="text-white mb-4" style={{ opacity: 0.85 }}>Send me the FREE AI Roadmap and start today.</p>
                <div className="d-flex justify-content-center" dangerouslySetInnerHTML={{ __html: FORM_SCRIPT }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AiRoadmap2026
