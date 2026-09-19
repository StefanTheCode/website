import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { aiLearningPaths, AI_COMMUNITY_IMAGE, AI_COMMUNITY_JOIN_URL, AI_COMMUNITY_URL } from '@/components/aiCommunity';
import styles from './page.module.css';

const title = 'AI for .NET Developers Community | C#, MCP & AI Agents';
const description = 'Learn to use and build AI with C#. Join AI for .NET Developers for Claude workflows, .NET skills, MCP, RAG and practical lessons. Start a 7-day free trial.';

export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: AI_COMMUNITY_URL },
  openGraph: { title, description, url: AI_COMMUNITY_URL, type: 'website', images: [{ url: AI_COMMUNITY_IMAGE, width: 1084, height: 576, alt: 'AI for .NET Developers with Stefan Djokic' }] },
  twitter: { card: 'summary_large_image', title, description, images: [AI_COMMUNITY_IMAGE] },
};

const faqs = [
  ['What is AI for .NET Developers?', 'A community led by Stefan Djokic for C# developers who want to use AI in everyday engineering and build AI features into .NET apps. Membership includes the AI toolkit, classroom lessons, installation guides and production report examples.'],
  ['Where should a .NET developer start with AI?', 'Start with one task on a codebase you know: explain a method, add a focused test or review a query. Learn to provide project context and verify the output. For AI features inside your app, learn model calls and embeddings before adding retrieval or agents. The free guides and the AI roadmap give you a starting point.'],
  ['Do I need Python to build AI applications?', 'You can build AI features with C# and .NET. Microsoft.Extensions.AI provides model and embedding abstractions; MCP connects tools to assistants; retrieval and RAG bring your own data into an application. Python is not a prerequisite for these workflows.'],
  ['Which AI tools does the community cover?', 'The community covers using and building AI with Claude, Codex and GitHub Copilot, alongside RAG, MCP and agents in C#. The downloadable .NET toolkit includes Claude skills and agents; check each tool’s installation guide for its supported environment.'],
  ['What is the difference between MCP, RAG and an AI agent?', 'MCP is a protocol for connecting AI clients to tools and context. RAG retrieves relevant information to include in a model’s input. An agent can use tools across multiple steps to carry out a task. You can learn and use each independently.'],
  ['Can I try the community before subscribing?', 'There is a 7-day free trial. The currently listed membership is $19 per month or $180 per year. Check the current price and trial terms on Skool before joining. Any paid AI provider or coding assistant you use is separate from community membership.'],
  ['How should I handle private code and AI-generated changes?', 'Use your organization’s approved AI tooling and review its data settings before sharing source code. Keep credentials out of prompts, limit tool permissions, review diffs and run tests. AI findings are a starting point for engineering review, not a guarantee of correctness.'],
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'CollectionPage', '@id': `${AI_COMMUNITY_URL}#page`, url: AI_COMMUNITY_URL, name: title, description, inLanguage: 'en', image: `https://thecodeman.net${AI_COMMUNITY_IMAGE}`, about: { '@id': `${AI_COMMUNITY_URL}#community` }, mainEntity: { '@id': `${AI_COMMUNITY_URL}#guides` } },
    { '@type': 'Organization', '@id': `${AI_COMMUNITY_URL}#community`, name: 'AI for .NET Developers', url: AI_COMMUNITY_URL, sameAs: [AI_COMMUNITY_JOIN_URL], founder: { '@type': 'Person', name: 'Stefan Djokic', url: 'https://thecodeman.net/about-me' } },
    { '@type': 'ItemList', '@id': `${AI_COMMUNITY_URL}#guides`, name: 'AI tutorials for .NET developers', itemListElement: aiLearningPaths.flatMap(p => p.articles).map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.title, url: `https://thecodeman.net/posts/${a.slug}` })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thecodeman.net' }, { '@type': 'ListItem', position: 2, name: 'AI for .NET Developers', item: AI_COMMUNITY_URL }] },
  ],
};

function JoinLink({ children = 'Start your 7-day free trial' }: { children?: React.ReactNode }) {
  return <a href={AI_COMMUNITY_JOIN_URL} className={styles.primary} data-cta="ai-community-trial">{children} <span aria-hidden="true">↗</span></a>;
}

export default function AiCommunityPage() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className={styles.wrap}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>AI for .NET Developers</span></nav>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>The community for C# developers building with AI</p>
            <h1>AI for <span>.NET Developers</span></h1>
            <p className={styles.lead}>Use AI in your daily work.<br />Build AI into your .NET apps.</p>
            <p>Move from experimenting with prompts to reviewing real C# code, connecting tools with MCP and understanding RAG. Learn alongside other .NET developers, with practical lessons and tools from Stefan Djokic.</p>
            <div className={styles.actions}><JoinLink /><a href="#learn" className={styles.secondary}>Explore the free guides ↓</a></div>
            <p className={styles.note}>7-day free trial · Membership from $19/month · Hosted on Skool</p>
          </div>
          <div className={styles.heroVisual}>
            <Image src={AI_COMMUNITY_IMAGE} alt="Stefan Djokic — learn to use AI and build AI features as a .NET developer" width={1084} height={576} priority sizes="(max-width: 1000px) 100vw, 50vw" />
            <div className={styles.visualCaption}><span>YOUR STACK. YOUR CODE.</span><span>C# / .NET / AI</span></div>
          </div>
        </section>
        <div className={styles.facts} aria-label="Included in the community"><div><strong>50+</strong><span>.NET AI skills</span></div><div><strong>10+</strong><span>AI agents</span></div><div><strong>Weekly</strong><span>new skills</span></div><div><strong>Microsoft MVP</strong><span>created by Stefan Djokic</span></div></div>
        <section className={styles.section} id="inside">
          <p className={styles.eyebrow}>Inside the community</p><h2>A place to turn AI experiments into engineering skills.</h2>
          <div className={styles.grid}>
            <article className={styles.card}><span className={styles.number}>01</span><h3>Learn with a .NET focus</h3><p>Classroom lessons, installation guides and production report examples. Bring your questions about applying AI to C#, ASP.NET Core and existing applications.</p></article>
            <article className={styles.card}><span className={styles.number}>02</span><h3>Put the toolkit to work</h3><p>Use skills and agents for architecture reviews, EF Core queries, security, tests, performance and DevOps. A local dashboard brings the toolkit and run history together.</p></article>
            <article className={styles.card}><span className={styles.number}>03</span><h3>Keep building your workflow</h3><p>Try new skills each week and new agents each month. Learn how to read the findings, verify changes and decide what belongs in your application.</p></article>
          </div>
        </section>
        <section className={`${styles.section} ${styles.proof}`}>
          <div><p className={styles.eyebrow}>See a real workflow</p><h2>From a repository to a review you can act on.</h2><p>In a production .NET codebase review, the toolkit flagged authorization gaps, sensitive logging, N+1 queries and missing tracing. Read the walkthrough to see the findings and the C# changes.</p><Link href="/posts/ai-agents-for-dotnet-security-and-ef-core" className={styles.textLink}>Read the .NET security and EF Core audit →</Link></div>
          <div className={styles.review}><p className={styles.eyebrow}>Example review targets</p><ul><li><span>SECURITY</span> Endpoint authorization and sensitive logs</li><li><span>EF CORE</span> N+1 queries and unnecessary materialization</li><li><span>RELIABILITY</span> Tracing, cancellation and async patterns</li></ul><p className={styles.note}>Review the findings. Verify the fix. Run your tests.</p></div>
        </section>
        <section className={styles.section} id="learn">
          <p className={styles.eyebrow}>Free AI + .NET learning paths</p><h2>What do you want to build next?</h2><p className={styles.intro}>Start with the problem you have today. These public tutorials are free to read; community membership adds the toolkit and classroom.</p>
          <div className={styles.grid}>{aiLearningPaths.map(p => <article key={p.id} className={styles.card}><p className={styles.eyebrow}>{p.label}</p><h3>{p.title}</h3><p>{p.description}</p><ul className={styles.guides}>{p.articles.map(a => <li key={a.slug}><Link href={`/posts/${a.slug}`}>{a.title} <span aria-hidden="true">→</span></Link></li>)}</ul></article>)}</div>
          <div className={styles.roadmap}><div><h3>New to AI in .NET?</h3><p>Follow a structured learning plan or work through the free course preview.</p></div><div className={styles.actions}><Link href="/ai-roadmap-2026" className={styles.secondary}>Get the free AI roadmap</Link><Link href="/ai-roadmap-course" className={styles.textLink}>Try the course preview →</Link></div></div>
        </section>
        <section className={styles.section} id="join">
          <div className={styles.membership}><div><p className={styles.eyebrow}>Your next step</p><h2>Bring a .NET project.<br />Start learning with us.</h2><p>For C# developers who want practical AI workflows, a reusable toolkit and a community working with the same stack.</p><ul><li>Full toolkit: .NET skills, agents and local dashboard</li><li>Classroom lessons and setup guides</li><li>Community discussions and production examples</li></ul></div><div className={styles.price}><span>7-day free trial</span><p><strong>$19</strong> / month</p><p>or $180 / year</p><JoinLink /><small>Current price and trial terms are shown on Skool. AI tool subscriptions are separate.</small></div></div>
        </section>
        <section className={`${styles.section} ${styles.faq}`} id="faq"><p className={styles.eyebrow}>Before you start</p><h2>AI for .NET developers, explained.</h2>{faqs.map(([q,a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
      </div>
    </main>
  );
}
