import type { Metadata } from 'next';
import Link from 'next/link';
import {
  dotnetAiGuide, AI_COMMUNITY_IMAGE, AI_COMMUNITY_PATH,
  DOTNET_AI_GUIDE_NAME, DOTNET_AI_GUIDE_URL,
} from '@/components/aiCommunity';
import styles from './page.module.css';
import BfAiStrip from '@/components/BfAiStrip';

// Free, evergreen guide for C# developers. The paid community lives at
// /ai-for-developers; this page targets ".NET / C#" AI searches and links to it.
const title = 'AI for .NET Developers: Build AI Features in C# (Free Guide)';
const description = 'Free guide to AI in C# and .NET: Microsoft.Extensions.AI, AI agents with Microsoft Agent Framework, MCP servers, RAG, vector search and Claude Code.';

export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: DOTNET_AI_GUIDE_URL },
  openGraph: { title, description, url: DOTNET_AI_GUIDE_URL, type: 'website', images: [{ url: AI_COMMUNITY_IMAGE, width: 1084, height: 576, alt: 'AI for .NET Developers - a free guide by Stefan Djokic' }] },
  twitter: { card: 'summary_large_image', title, description, images: [AI_COMMUNITY_IMAGE] },
};

// The .NET AI stack, one layer per card. Keep package names and versions accurate.
const stack: [string, string, string, string][] = [
  ['MODEL ACCESS', 'Microsoft.Extensions.AI', 'IChatClient and IEmbeddingGenerator are the common interfaces for chat and embedding models. You can switch from OpenAI to Ollama without rewriting your code, and add caching, logging and OpenTelemetry as middleware.', 'IChatClient'],
  ['AGENTS', 'Microsoft Agent Framework', 'Agents that call your tools, keep conversation state and run multi-step workflows. Version 1.0 shipped in April 2026 and replaces Semantic Kernel for new projects.', 'Microsoft.Agents.AI'],
  ['TOOLS', 'Model Context Protocol (MCP)', 'Expose your own C# methods as tools that Claude, GitHub Copilot or your own agent can call. The official MCP C# SDK builds on ASP.NET Core, and the .NET 11 SDK ships an MCP server template.', 'dotnet new mcpserver'],
  ['YOUR DATA', 'Embeddings, vector search and RAG', 'Turn text into vectors with IEmbeddingGenerator, search them with EF Core on SQL Server 2025 or with PostgreSQL pgvector, then pass the best matches to the model.', 'IEmbeddingGenerator'],
  ['UI', 'Blazor AI components', 'Components for streaming chat, tool results and approval steps. They are experimental and ship as a prerelease package during .NET 11.', 'Microsoft.AspNetCore.Components.AI'],
  ['CODING WITH AI', 'Claude Code, GitHub Copilot, .NET Skills', 'Coding agents do better on a .NET repository when they get project context, .NET skills (SKILL.md files) and a C# language server. You still review the diff and run the tests.', 'SKILL.md'],
];

const faqs: [string, string][] = [
  ['Can I build AI applications in C# without Python?', 'Yes. Microsoft.Extensions.AI gives C# a common interface for chat and embedding models, with providers for OpenAI, Azure OpenAI, Ollama and others. Microsoft Agent Framework adds agents and workflows, and the official MCP C# SDK covers MCP servers and clients. Python is not required for any of these.'],
  ['Where should a .NET developer start with AI?', 'Build one small feature with IChatClient: a model call, streaming and dependency injection. Then add tool calling, then retrieval over your own data. Agents and MCP are easier to understand after that. For AI coding tools, start with one task on a repository you know well and review the diff.'],
  ['Should I use Semantic Kernel or Microsoft Agent Framework?', 'For new projects, Microsoft Agent Framework. It reached version 1.0 in April 2026 and brings together ideas from Semantic Kernel and AutoGen. Existing Semantic Kernel projects keep working, and Microsoft provides a migration guide.'],
  ['What is the difference between MCP, RAG and an AI agent?', 'MCP is a protocol for connecting AI clients to tools and data. RAG retrieves relevant text and adds it to the model input. An agent is a model that can call tools across several steps to finish a task. You can use each one on its own.'],
  ['Do I need a vector database for RAG in .NET?', 'Not always. EF Core 10 can run vector search on SQL Server 2025 and Azure SQL, and PostgreSQL has the pgvector extension. A dedicated vector database makes sense when your data or search needs outgrow those. Test with your own data before you decide.'],
  ['Which AI coding tool is best for .NET?', 'Claude Code and GitHub Copilot both work well with C#. In practice the result depends more on the setup than on the tool: project instructions, .NET skills, a C# language server and a test suite the agent can run.'],
  ['How should I handle private code and AI-generated changes?', 'Use the AI tools your organization approves and check their data settings before sharing source code. Keep credentials out of prompts, limit tool permissions, review diffs and run your tests. Treat AI output as a draft for engineering review.'],
];

const allArticles = dotnetAiGuide.flatMap(p => p.articles);

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'CollectionPage', '@id': `${DOTNET_AI_GUIDE_URL}#page`, url: DOTNET_AI_GUIDE_URL, name: title, description, inLanguage: 'en', image: `https://thecodeman.net${AI_COMMUNITY_IMAGE}`, author: { '@type': 'Person', name: 'Stefan Djokic', url: 'https://thecodeman.net/about-me' }, mainEntity: { '@id': `${DOTNET_AI_GUIDE_URL}#guides` } },
    { '@type': 'ItemList', '@id': `${DOTNET_AI_GUIDE_URL}#guides`, name: 'AI tutorials for .NET developers', itemListElement: allArticles.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.title, url: `https://thecodeman.net/posts/${a.slug}` })) },
    { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thecodeman.net' }, { '@type': 'ListItem', position: 2, name: DOTNET_AI_GUIDE_NAME, item: DOTNET_AI_GUIDE_URL }] },
  ],
};

export default function AiForDotnetDevelopersPage() {
  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className={styles.wrap}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>{DOTNET_AI_GUIDE_NAME}</span></nav>

        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Free guide for C# developers</p>
            <h1>AI for <span>.NET Developers</span></h1>
            <p className={styles.lead}>How to build AI features in C# and use AI coding tools on a .NET codebase.</p>
            <p>This page groups every AI tutorial on TheCodeMan by topic. Start with a model call through Microsoft.Extensions.AI, then add agents, MCP tools and search over your own data. The last section covers Claude Code and GitHub Copilot on .NET projects.</p>
            <div className={styles.actions}>
              <Link href="/posts/getting-started-with-ai-in-csharp" className={styles.primary} data-cta="dotnet-guide-start">Start with your first AI feature <span aria-hidden="true">→</span></Link>
              <a href="#stack" className={styles.secondary}>See the .NET AI stack ↓</a>
            </div>
            <p className={styles.note}>Updated November 2026 for .NET 11.</p>
          </div>
          <nav className={styles.toc} aria-label="On this page">
            <p className={styles.eyebrow}>On this page</p>
            <ol>
              <li><span>00</span><a href="#stack">The .NET AI stack</a></li>
              {dotnetAiGuide.map((p, i) => <li key={p.id}><span>{String(i + 1).padStart(2, '0')}</span><a href={`#${p.id}`}>{p.title}</a></li>)}
              <li><span>FAQ</span><a href="#faq">Questions .NET developers ask about AI</a></li>
            </ol>
          </nav>
        </section>

        <BfAiStrip />

        <section className={styles.section} id="stack">
          <p className={styles.eyebrow}>The .NET AI stack</p>
          <h2>Six layers, and which one you need first.</h2>
          <p className={styles.intro}>Most AI work in .NET uses the same few building blocks. You rarely need all of them at once. A chat feature needs only the first one.</p>
          <div className={styles.grid}>
            {stack.map(([label, h, p, chip]) => <article key={label} className={styles.card}><p className={styles.eyebrow}>{label}</p><h3>{h}</h3><p>{p}</p><code className={styles.chip}>{chip}</code></article>)}
          </div>
        </section>

        <div className={styles.section}>
          {dotnetAiGuide.map(p => (
            <section key={p.id} id={p.id} className={styles.path}>
              <div><p className={styles.eyebrow}>{p.label}</p><h2>{p.title}</h2><p>{p.description}</p></div>
              <ul className={styles.guides}>{p.articles.map(a => <li key={a.slug}><Link href={`/posts/${a.slug}`}>{a.title} <span aria-hidden="true">→</span></Link></li>)}</ul>
            </section>
          ))}
          <div className={styles.roadmap}>
            <div><h3>Want a structured plan?</h3><p>Follow the AI roadmap for .NET developers, or try the free course preview.</p></div>
            <div className={styles.actions}><Link href="/ai-roadmap-2026" className={styles.secondary}>Get the AI roadmap</Link><Link href="/ai-roadmap-course" className={styles.textLink}>Try the course preview →</Link></div>
          </div>
        </div>

        <section className={styles.section} id="community">
          <div className={styles.membership}>
            <div>
              <p className={styles.eyebrow}>Go further</p>
              <h2>Skills, agents and lessons in the AI for Developers community.</h2>
              <p>The tutorials on this page are free. The community adds the toolkit I use on real projects, step-by-step lessons and a place to ask questions while you build.</p>
              <ul><li>Claude Code skills and agents, including a .NET pack</li><li>Lessons on AI coding workflows and AI features</li><li>Discussions with other developers using the same tools</li></ul>
            </div>
            <div className={styles.price}>
              <span>7-day free trial</span>
              <p>See what is inside before you pay.</p>
              <Link href={AI_COMMUNITY_PATH} className={styles.primary} data-cta="dotnet-guide-community">See the community <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.faq}`} id="faq">
          <p className={styles.eyebrow}>FAQ</p>
          <h2>Questions .NET developers ask about AI</h2>
          {faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </section>
      </div>
    </div>
  );
}
