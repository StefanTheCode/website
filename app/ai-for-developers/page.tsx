import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { aiLearningPaths, AI_COMMUNITY_IMAGE, AI_COMMUNITY_JOIN_URL, AI_COMMUNITY_URL } from '@/components/aiCommunity';
import styles from './page.module.css';

/* ------------------------------------------------------------------
   CONTENT FLAGS
   Sections without real material stay hidden until you fill these in.
   - VSL_EMBED_URL: About video embed URL (YouTube "embed" or Loom "embed" link).
   - testimonials: real member messages, shared with permission.
   - course `value` and RESOURCES_KIT_VALUE: only real standalone prices.
     The "Total value" bar renders only when every course has a value.
   ------------------------------------------------------------------ */
const VSL_EMBED_URL = '';
const RESOURCES_KIT_VALUE: number | null = null;

type Testimonial = { name: string; role: string; quote: string; result: string; image?: string };
const testimonials: Testimonial[] = [];

/* Black Friday. After Dec 1: set BF_ACTIVE = false (and set Skool's yearly price back to YEARLY_REGULAR). */
const BF_ACTIVE = true;
const BF_ENDS = 'Dec 1';

/* Pricing (keep in sync with Skool) */
const MONTHLY = 19;
const YEARLY_REGULAR = 149;
const YEARLY_BF = 119;
const YEARLY = BF_ACTIVE ? YEARLY_BF : YEARLY_REGULAR;
const yearlyPerMonth = (YEARLY / 12).toFixed(2);
const yearlySavings = MONTHLY * 12 - YEARLY;
const yearlySavingsPct = Math.round((yearlySavings / (MONTHLY * 12)) * 100);
const yearlyPaidMonths = Math.ceil(YEARLY / MONTHLY);
const COURSE_PRICE = 149.99; // standalone price of each video course
const MEMBER_LOGIN_URL = 'https://www.skool.com/ai-for-developers';

const title = 'AI for Developers Community | Claude Code, AI Agents & AI Features';
const description = 'Skills, agents and courses that make AI coding consistent, plus how to build AI into your apps. 49 skills, 7 agents, 2 video courses and 2 written courses. 7-day free trial.';

export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: AI_COMMUNITY_URL },
  openGraph: { title, description, url: AI_COMMUNITY_URL, type: 'website', images: [{ url: AI_COMMUNITY_IMAGE, width: 1084, height: 576, alt: 'AI for Developers with Stefan Djokic' }] },
  twitter: { card: 'summary_large_image', title, description, images: [AI_COMMUNITY_IMAGE] },
};

const pageNav = [
  ['#problem', 'The problem'],
  ['#inside', "What's inside"],
  ['#how', 'How it works'],
  ['#courses', 'Courses'],
  ['#pricing', 'Pricing'],
  ['#faq', 'FAQ'],
];

const marqueeTop = ['CLAUDE.md', 'Skills', 'Subagents', 'Hooks', 'MCP servers', 'Code review agents', 'Security audits', 'Query optimization', 'Test generation'];
const marqueeBottom = ['Architecture reviews', 'Observability', 'CI/CD', 'Legacy modernization', 'Headless Claude', 'Semantic search', 'RAG', 'Structured output', 'Prompt Playbook'];

const traps = [
  ['You re-explain your project every session', 'The agent forgets your rules by tomorrow.'],
  ['The code looks right, then fails review', 'N+1 queries, missing auth checks, swallowed exceptions.'],
  ['Tutorials in, nothing out', 'Your repo still has no CLAUDE.md, no skills, no hooks.'],
  ["You're falling behind, quietly", 'Others ship faster with AI. You are still picking a tool.'],
];

const ways = [
  ['</>', 'Make your AI agent consistent', 'CLAUDE.md, skills, hooks and subagents that follow your patterns.'],
  ['✓✗', 'Get a senior review on demand', 'A ranked report: security, architecture, slow queries, missing tests.'],
  ['AI', 'Build AI into your own product', 'Embeddings, semantic search, RAG and MCP, with runnable code.'],
];

const outcomes = [
  ['2 commands', 'Your whole toolkit in every project'],
  ['5 stacks', '.NET, Node, Python, Java and Go'],
  ['plain English', 'Nothing to memorize'],
  ['ranked report', 'Know what to fix first'],
  ['same evening', 'Apply it tonight, not someday'],
];

const steps = [
  ['Join and install', 'Open Start Here. Two commands in Claude Code.'],
  ['Run one agent on your real code', 'Ask in plain English. Fix one thing today.'],
  ['Ask, share, request', 'Stuck? Ask, I answer everything. Missing a tool? I build it.'],
];

const founderStats = [
  ['Microsoft MVP', 'recognized by Microsoft'],
  ['116K+', 'developers on LinkedIn'],
  ['21K+', 'newsletter readers'],
  ['49 + 7', 'skills and agents built'],
];

type CourseType = 'Video course' | 'Written course' | 'Guide' | 'Toolkit' | 'Projects' | 'Challenge';
const typeClass: Record<CourseType, string> = {
  'Video course': styles.tVideo,
  'Written course': styles.tWritten,
  Guide: styles.tGuide,
  Toolkit: styles.tToolkit,
  Projects: styles.tProjects,
  Challenge: styles.tChallenge,
};

type Course = { cover: [string, string]; name: string; type: CourseType; text: string; value?: number };
const courses: Course[] = [
  { cover: ['Start', 'Here'], name: 'Start Here', type: 'Guide', text: 'Your first hour: install, CLAUDE.md and one agent on your real code.' },
  { cover: ['AI', 'Roadmap'], name: 'AI Roadmap for Developers', type: 'Written course', text: '8 modules, from "use AI" to "build AI".' },
  { cover: ['Claude Code', 'Workflow'], name: 'Claude Code & Agent Workflow', type: 'Written course', text: 'CLAUDE.md, rules, hooks, headless mode and MCP.' },
  { cover: ['49', 'Skills'], name: 'Skills', type: 'Toolkit', text: 'Architecture, database, testing, security and more. A lesson for each.' },
  { cover: ['7', 'Agents'], name: 'Agents', type: 'Toolkit', text: 'Review your code, audit your app, modernize old code.' },
  { cover: ['Packs', 'on request'], name: 'Packs', type: 'Toolkit', text: 'Legacy Pack and CRUD vs Event Sourcing, built from member requests.' },
  { cover: ['Build', 'AI Features'], name: 'Build AI Features', type: 'Projects', text: 'Semantic search, RAG and an MCP server, with runnable C# code.' },
  { cover: ['Monthly', 'Challenges'], name: 'Build Challenges', type: 'Challenge', text: 'A new build challenge every month, plus a gallery of finished builds.' },
];
const courseValues = courses.map(c => c.value);
const totalValue = courseValues.every((v): v is number => typeof v === 'number') ? (courseValues as number[]).reduce((a, b) => a + b, 0) : null;
const countType = (t: CourseType) => courses.filter(c => c.type === t).length;
const legend: [string, string, CourseType][] = [
  [String(countType('Written course')), 'written courses', 'Written course'],
  [String(countType('Guide')), 'guide', 'Guide'],
  [String(countType('Toolkit')), 'toolkits', 'Toolkit'],
  ['+', 'AI projects', 'Projects'],
  ['+', 'monthly challenges', 'Challenge'],
];

const resourcesKit = [
  ['CLAUDE.md Generator', 'answer a few questions, get a context file for your project'],
  ['CLAUDE.md template', 'the structure I use, including the "never do this" section'],
  ['AI Prompt Playbook', 'the exact phrasings that get the best results from the toolkit'],
  ['Toolkit dashboard', 'every skill and agent, and the results of your runs, in one page'],
];
const kitTools = [['{ }', 'Generator'], ['#', 'Template'], ['>_', 'Playbook'], ['▦', 'Dashboard']];

const monthlyFeatures: React.ReactNode[] = ['The full community', '2 video courses + 2 written courses', '49 skills + 7 agents, with a lesson for each', 'Bonus: Resources kit', 'New skill every week, new agent every month', '7-day free trial'];
const yearlyFeatures: React.ReactNode[] = [
  <><strong className={styles.featHl}>Pragmatic .NET Code Rules course included free</strong> <small className={styles.featSmall}>(${COURSE_PRICE} on its own, unlocks after 30 days)</small></>,
  'Everything in Monthly',
  `$${yearlyPerMonth} a month instead of $${MONTHLY}`,
  'Your price is locked, even when it goes up',
  'No monthly decision, just build',
];

const ladder = [
  { price: '$12', label: 'Founding price', sub: 'first 100 members', state: 'closed' },
  { price: `$${MONTHLY}`, label: 'Current price', sub: 'join now and keep it', state: 'current' },
  { price: '$29', label: 'Next price', sub: 'after the next 100 members', state: 'next' },
  { price: '$39', label: 'Final price', sub: '100 members after that', state: 'next' },
];

const faqs = [
  ['What is AI for Developers?', 'A paid community led by Stefan Djokic, Microsoft MVP, for developers who want consistent results from AI coding agents and want to build AI features (RAG, MCP, agents) the right way. Membership includes 49 skills and 7 agents for Claude Code, 2 video courses (AI for Developers and Pragmatic .NET Code Rules), 2 written courses, monthly build challenges and the AI Weekly briefing. It runs on Skool with a 7-day free trial.'],
  ['Is Pragmatic .NET Code Rules included?', `Yes, on both plans. It unlocks after your first 30 days as a member. On its own the course costs $${COURSE_PRICE}.`],
  ["I'm not a .NET developer. Is this for me?", "Yes. Every skill detects your stack first (.NET, Node/TypeScript, Python, Java/Kotlin, Go) and uses the right tools for it. Code in the courses is mostly C#, because that is where I come from, but the concepts work anywhere. A few .NET-only skills live in a separate .NET Pack."],
  ['I already use Claude Code (or Cursor, or Copilot). What is new here?', 'The tool is the engine. This is the setup around it: context files, skills, agents, hooks and review habits that make results consistent. The toolkit is built for Claude Code, and most of the workflow lessons carry over to other AI coding tools.'],
  ['The skills are on GitHub. Why pay?', 'They are open because I want you to see how they work. The membership is what turns them into results: a lesson for every skill with prompts for your stack, video and written courses, monthly build challenges and direct answers from me. And when you need a tool that does not exist yet, you ask in Tool Requests and I build it.'],
  ['How fast will I see a result?', 'The same day. Install takes about two minutes. Run one agent on your own code and you will have a ranked report to act on the same evening.'],
  ["I don't have time for another community.", 'You do not need to be active every day. Take a lesson, apply it, come back when you are stuck. AI Weekly lands every Monday, so you stay current in five minutes.'],
  ['Is it worth $19 a month?', 'If one agent run catches one security gap or one slow query before production, it has already paid for itself.'],
  ['Do I need any paid tools?', 'For the skills and agents you need Claude Code, which runs on a Claude subscription or API access. Any AI provider or coding assistant you use is billed separately from the membership.'],
  ['Can I cancel anytime?', 'Yes, from your Skool settings, with no calls and no questions. The first 7 days are free, and you are only charged if you stay.'],
  ['Was this called "AI for .NET Developers"?', 'Yes. Same community, same .NET depth, now open to developers in every stack. The Skool link stays the same, and existing members keep their price.'],
  ['What language is the community in?', 'English. All lessons and posts are in English.'],
];

const freeResources = [
  ['/claude-code-cheat-sheet', 'Claude Code Cheat Sheet', 'Commands, CLAUDE.md, hooks and MCP on one page.'],
  ['/claude-code-from-zero', 'Claude Code from Zero', 'Free mini-course: 8 lessons in your inbox, from install to plan mode.'],
  ['/ai-for-dotnet-developers', 'AI for .NET Developers guide', 'Every free AI tutorial for C# developers, grouped by topic.'],
  ['/ai-roadmap-2026', 'AI Roadmap 2026', 'A structured path from using AI to building with it.'],
  ['/ai-roadmap-course', 'AI Roadmap course preview', 'Try the first lessons for free.'],
  ['/newsletter-archive', 'The TheCodeMan newsletter', '21K+ developers read it every week.'],
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'CollectionPage', '@id': `${AI_COMMUNITY_URL}#page`, url: AI_COMMUNITY_URL, name: title, description, inLanguage: 'en', image: `https://thecodeman.net${AI_COMMUNITY_IMAGE}`, about: { '@id': `${AI_COMMUNITY_URL}#community` }, mainEntity: { '@id': `${AI_COMMUNITY_URL}#guides` } },
    { '@type': 'Organization', '@id': `${AI_COMMUNITY_URL}#community`, name: 'AI for Developers', alternateName: 'AI for .NET Developers', url: AI_COMMUNITY_URL, sameAs: [AI_COMMUNITY_JOIN_URL], founder: { '@type': 'Person', name: 'Stefan Djokic', url: 'https://thecodeman.net/about-me' } },
    { '@type': 'ItemList', '@id': `${AI_COMMUNITY_URL}#guides`, name: 'Free AI tutorials for developers', itemListElement: aiLearningPaths.flatMap(p => p.articles).map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.title, url: `https://thecodeman.net/posts/${a.slug}` })) },
    { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thecodeman.net' }, { '@type': 'ListItem', position: 2, name: 'AI for Developers', item: AI_COMMUNITY_URL }] },
  ],
};

function JoinLink({ children = 'Start your 7-day free trial', variant = 'primary', cta = 'ai-community-trial' }: { children?: React.ReactNode; variant?: 'primary' | 'ghost'; cta?: string }) {
  return <a href={AI_COMMUNITY_JOIN_URL} className={variant === 'primary' ? styles.primary : styles.ghostBtn} data-cta={cta}>{children} <span aria-hidden="true">→</span></a>;
}

function Eyebrow({ n, children }: { n?: string; children: React.ReactNode }) {
  return <p className={styles.eyebrow}>{n && <span className={styles.eyebrowNum}>{n}</span>}{children}</p>;
}

function Terminal() {
  return (
    <div className={styles.terminal} aria-label="Example output of an AI agent security audit">
      <div className={styles.termBar}><span /><span /><span /><em>claude</em><b>example output</b></div>
      <div className={styles.termBody}>
        <p className={styles.tPrompt}><span>&gt;</span> Audit the security of this API</p>
        <p className={styles.tRun}><span>●</span> api-security-auditor <em>agent · running</em></p>
        <p className={styles.tOk}><span>✓</span> 14 endpoints scanned</p>
        <p className={styles.tBad}><span>✗</span> 2 endpoints missing authorization</p>
        <p className={styles.tBad}><span>✗</span> Sensitive data in logs <em>OrderService.cs:88</em></p>
        <p className={styles.tOk}><span>✓</span> Secrets: clean</p>
        <p className={styles.tDone}><span>→</span> Ranked report ready · 3 fixes suggested<i className={styles.cursor} aria-hidden="true" /></p>
      </div>
      <div className={styles.termChips}><span>any stack</span><span>Claude Code</span></div>
    </div>
  );
}

function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  return (
    <div className={styles.marquee}>
      <div className={`${styles.marqueeTrack} ${reverse ? styles.marqueeReverse : ''}`}>
        {items.map(t => <span key={t}>{t}</span>)}
        {items.map(t => <span key={`${t}-dup`} aria-hidden="true">{t}</span>)}
      </div>
    </div>
  );
}

/* Black Friday price tag at the top of the page */
function DealCard() {
  return (
    <div className={styles.deal}>
      <div className={styles.dealPrice}>
        <span className={styles.bfPill}>Black Friday · until {BF_ENDS}</span>
        <p className={styles.dealLabel}>Yearly membership</p>
        <p className={styles.dealNums}><s>${YEARLY_REGULAR}</s><strong>${YEARLY_BF}</strong><span>/year</span></p>
        <p className={styles.dealVs}>vs ${MONTHLY * 12}/year paying monthly · your price stays locked while you&apos;re a member</p>
      </div>
      <div className={styles.dealInside}>
        <p className={styles.dealLabel}>Includes 2 new video courses</p>
        <a href="#new-ai-course" className={styles.dealCourse}><span>NEW</span><strong>AI for Developers</strong><em>${COURSE_PRICE} value</em></a>
        <a href="#new-code-rules" className={styles.dealCourse}><span>NEW</span><strong>Pragmatic .NET Code Rules</strong><em>${COURSE_PRICE} value</em></a>
        <JoinLink cta="ai-community-bf-hero">Get yearly for ${YEARLY_BF}</JoinLink>
        <p className={styles.dealFine}>Code Rules unlocks after your first 30 days. Prefer monthly? ${MONTHLY}/month with a 7-day free trial.</p>
      </div>
    </div>
  );
}

/* Visual for Code Rules: an AI-written PR that the build refuses */
function SlopPr() {
  return (
    <div className={styles.pr} aria-label="Example: a pull request written by an AI agent fails the build on 3 code rules">
      <div className={styles.prHead}><span className={styles.prState}>Open</span><strong>feat: add discounts to orders</strong><em>#142 · opened by claude-code</em></div>
      <div className={styles.prBody}>
        <p className={styles.prCmd}><span>$</span> dotnet build</p>
        <p className={styles.prErr}><span>✗</span><b>RS0030</b><em>Banned API: DateTime.Now</em><code>OrderService.cs:41</code></p>
        <p className={styles.prErr}><span>✗</span><b>CA2016</b><em>Forward the CancellationToken</em><code>DiscountRepo.cs:18</code></p>
        <p className={styles.prErr}><span>✗</span><b>CA1848</b><em>Use LoggerMessage delegates</em><code>Discounts.cs:27</code></p>
      </div>
      <div className={styles.prFoot}><span>Merge blocked · 3 rule violations</span><b>AI slop stopped by the build</b></div>
    </div>
  );
}

/* Visual for the AI for Developers course: the two parts and the project */
function CourseOutline() {
  return (
    <div className={styles.outline} aria-label="AI for Developers course: Part 1 Use AI, 18 lessons. Part 2 Build AI, 6 lessons. One real project.">
      <div className={styles.olHead}><em>ai-for-developers</em><b>24 lessons · ~7 hours</b></div>
      <div className={styles.olPart}>
        <div className={styles.olRow}><span className={styles.olTag}>Part 1</span><strong>Use AI</strong><em>18 lessons</em></div>
        <div className={styles.olBar}><i style={{ width: '75%' }} /></div>
        <p>Context files, clear prompts, tests the agent can&apos;t cheat, PR reviews in CI</p>
      </div>
      <div className={styles.olPart}>
        <div className={styles.olRow}><span className={styles.olTag}>Part 2</span><strong>Build AI</strong><em>6 lessons</em></div>
        <div className={styles.olBar}><i className={styles.olBuild} style={{ width: '25%' }} /></div>
        <p>Semantic search, RAG that cites its sources, an agent that asks first, your own MCP server</p>
      </div>
      <div className={styles.olProject}><span>1 real project</span><b>.NET API</b><b>Next.js</b><b>Postgres</b></div>
    </div>
  );
}

/* Visual for the Resources kit */
function KitVisual() {
  return (
    <div className={styles.kit} aria-hidden="true">
      <div className={styles.kitWin}>
        <div className={styles.termBar}><span /><span /><span /><em>CLAUDE.md</em><b>template</b></div>
        <pre className={styles.kitCode}><b># Project context</b>{'\n'}<i>## Stack</i>{'\n'}.NET 10 · EF Core · PostgreSQL{'\n'}<i>## Conventions</i>{'\n'}One handler per file{'\n'}<i>## Never do this</i>{'\n'}<u>✗ async void</u>{'\n'}<u>✗ .Result or .Wait()</u>{'\n'}<u>✗ edit /Migrations by hand</u></pre>
      </div>
      <div className={styles.kitTools}>{kitTools.map(([g, n]) => <div key={n}><span>{g}</span><strong>{n}</strong></div>)}</div>
    </div>
  );
}

export default function AiForDevelopersPage() {
  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className={styles.wrap}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>AI for Developers</span></nav>
        <nav className={styles.pageNav} aria-label="On this page">{pageNav.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav>

        {/* 1. HERO */}
        <section className={styles.hero}>
          <p className={styles.pill}><span className={styles.dot} aria-hidden="true" />Live community · Claude Code, agents &amp; AI features</p>
          <h1>You code with AI every day. <span>So why is it great on Monday and nonsense on Tuesday?</span></h1>
          <p className={styles.lead}><strong>AI for Developers</strong> shows you how to stop prompting and start building a setup: skills, agents and workflows that know your codebase and give you senior-level results every time. Then how to build AI into your own apps.</p>
          {BF_ACTIVE ? <DealCard /> : <div className={styles.actions}><JoinLink /><a href="#inside" className={styles.secondary}>See what&apos;s inside ↓</a></div>}
          <p className={styles.note}>{BF_ACTIVE ? <>Cancel anytime · <a href="#courses" className={styles.textLink}>See everything inside</a></> : <>${MONTHLY}/month after the trial · cancel anytime</>} · Already a member? <a href={MEMBER_LOGIN_URL} className={styles.textLink}>Log in</a></p>
        </section>

        <div className={`${styles.stage} ${VSL_EMBED_URL ? styles.stageWithVideo : ''}`}>
          {VSL_EMBED_URL && (
            <div className={styles.vsl}>
              <p className={styles.vslLabel}>Watch this before you join · 3 min</p>
              <div className={styles.vslFrame}><iframe src={VSL_EMBED_URL} title="AI for Developers: what you get inside" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen /></div>
            </div>
          )}
          <Terminal />
        </div>

        <p className={styles.trust}>By Stefan Djokic · Microsoft MVP · 116K+ developers on LinkedIn · 21K+ newsletter readers</p>
      </div>

      {/* 2. MARQUEE */}
      <div className={styles.marquees} aria-label="Topics covered in the community">
        <Marquee items={marqueeTop} />
        <Marquee items={marqueeBottom} reverse />
      </div>

      <div className={styles.wrap}>
        {/* 3. THE AI TRAP */}
        <section className={styles.section} id="problem">
          <Eyebrow n="01">The AI trap</Eyebrow>
          <h2>Sound familiar?</h2>
          <div className={styles.grid4}>
            {traps.map(([h, p]) => <article key={h} className={`${styles.card} ${styles.trapCard}`}><span className={styles.trapIcon} aria-hidden="true">✗</span><h3>{h}</h3><p>{p}</p></article>)}
          </div>
          <div className={styles.pullQuote}>
            <p className={styles.pullBig}>The problem isn&apos;t the model.</p>
            <p>It&apos;s the setup around it. Without one, you just collect tabs.</p>
          </div>
        </section>

        {/* 4. THE SOLUTION */}
        <section className={`${styles.section} ${styles.split}`} id="solution">
          <div>
            <Eyebrow n="02">The solution</Eyebrow>
            <h2>My job is to test it on real code. <span className={styles.hl}>Yours is to use it.</span></h2>
            <p>I run AI agents on production code every day. What survives ends up here: a skill you install in two commands, or a lesson you finish in one evening.</p>
            <div className={styles.chips}><span>No hype</span><span>No 3-hour videos</span><span>No toy examples</span></div>
          </div>
          <article className={`${styles.card} ${styles.whatCard}`}>
            <h3>What is this?</h3>
            <p>A community for developers who use AI coding agents on real code and want senior-level results, and for backend developers who want to build AI features (RAG, MCP, agents) the right way.</p>
            <div className={styles.statBadge}><strong>49 skills + 7 agents</strong><span>install once, work in every project</span></div>
          </article>
        </section>

        {/* 5. THREE WAYS */}
        <section className={styles.section} id="ways">
          <Eyebrow n="03">3 ways</Eyebrow>
          <h2>How <span className={styles.hl}>AI for Developers</span> actually helps you.</h2>
          <div className={styles.grid3}>
            {ways.map(([icon, h, p]) => <article key={h} className={styles.card}><span className={styles.wayIcon} aria-hidden="true">{icon}</span><h3>{h}</h3><p>{p}</p></article>)}
          </div>
        </section>

        {/* 6. WHAT YOU GET */}
        <section className={styles.section} id="inside">
          <Eyebrow n="04">What you get</Eyebrow>
          <h2>Zero time filtering. <span className={styles.hl}>Only what works on real code.</span></h2>
          <div className={styles.statTiles}>
            {outcomes.map(([v, l]) => <div key={v} className={styles.statTile}><strong>{v}</strong><span>{l}</span></div>)}
          </div>
        </section>

        {/* 7. HOW IT WORKS */}
        <section className={styles.section} id="how">
          <Eyebrow n="05">How it works</Eyebrow>
          <h2>Three steps to <span className={styles.hl}>your first result.</span></h2>
          <ol className={styles.steps}>
            {steps.map(([h, p], i) => (
              <li key={h} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <h3>{h}</h3>
                <p>{p}</p>
                {i === 0 && <pre className={styles.miniTerm} aria-label="Install commands, shortened"><code>/plugin marketplace add …{'\n'}/plugin install ai-dev-toolkit@…</code></pre>}
              </li>
            ))}
          </ol>
        </section>

        {/* 8. FOUNDER */}
        <section className={`${styles.section} ${styles.founder}`} id="founder">
          <div className={styles.founderPhoto}>
            <Image src="/images/stefan-djokic.webp" alt="Stefan Djokic, Microsoft MVP and founder of AI for Developers" width={900} height={1195} sizes="(max-width: 700px) 100vw, 380px" />
            <p><span>Founder</span>Stefan Djokic</p>
          </div>
          <div>
            <Eyebrow n="06">Your guide</Eyebrow>
            <h2>Most AI demos look great on video. <span className={styles.hl}>On a real codebase, they fall apart.</span></h2>
            <p>I&apos;ve spent years building backend systems, and today I run AI agents on that code every day. AI for Developers is where I share only what I use, test and keep using. When a member needs a tool, I build it.</p>
            <p className={styles.note}>The Legacy Pack started as one member&apos;s post about migrating an ERP on .NET Framework.</p>
            <div className={styles.stats}>{founderStats.map(([v, l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}</div>
          </div>
        </section>

        {/* 9. COURSES */}
        <section className={styles.section} id="courses">
          <div className={styles.sectionHead}>
            <div><Eyebrow n="07">Courses</Eyebrow><h2>2 new video courses. <span className={styles.hl}>Plus everything already inside.</span></h2></div>
            <p>One membership. Every course, guide and toolkit, plus everything that ships while you&apos;re a member.</p>
          </div>

          <article className={styles.newCourse} id="new-code-rules">
            <SlopPr />
            <div>
              <div className={styles.newTop}><span className={styles.newBadge}>New</span><span className={`${styles.type} ${styles.tVideo}`}>Video course</span><span className={styles.metaChip}>13 modules</span><span className={styles.metaChip}>AI edition</span></div>
              <h3 className={styles.newTitle}>Pragmatic .NET Code Rules</h3>
              <p className={styles.kicker}>AI writes code fast. Your build decides if it ships.</p>
              <ul className={styles.points}>
                <li><i aria-hidden="true">01</i><div><b>Rules the build enforces</b><span>EditorConfig, analyzers, warnings as errors, banned APIs</span></div></li>
                <li><i aria-hidden="true">02</i><div><b>AI guardrails</b><span>for Claude Code and Copilot, plus quality gates in CI</span></div></li>
                <li><i aria-hidden="true">03</i><div><b>No more AI slop PRs</b><span>bad code fails the build, not your code review</span></div></li>
              </ul>
              <div className={styles.valueRow}><s>${COURSE_PRICE}</s><span className={styles.inc}>✓ included in the membership</span></div>
              <p className={styles.fine}>10 of 13 modules are live, the last 3 land by Dec 10. Unlocks after your first 30 days.</p>
            </div>
          </article>

          <article className={`${styles.newCourse} ${styles.newCourseRev}`} id="new-ai-course">
            <CourseOutline />
            <div>
              <div className={styles.newTop}><span className={styles.newBadge}>New</span><span className={`${styles.type} ${styles.tVideo}`}>Video course</span><span className={styles.metaChip}>24 lessons</span><span className={styles.metaChip}>1 real project</span></div>
              <h3 className={styles.newTitle}>AI for Developers</h3>
              <p className={styles.kicker}>Use AI on a real codebase. Then build AI into a real app.</p>
              <ul className={styles.points}>
                <li><i aria-hidden="true">01</i><div><b>Use AI</b><span>a workflow that catches the agent when it cheats</span></div></li>
                <li><i aria-hidden="true">02</i><div><b>Build AI</b><span>search, RAG, an agent and an MCP server in the app</span></div></li>
                <li><i aria-hidden="true">03</i><div><b>Start and finished branch</b><span>for every lesson, so you can compare with mine</span></div></li>
              </ul>
              <div className={styles.valueRow}><s>${COURSE_PRICE}</s><span className={styles.inc}>✓ included in the membership</span></div>
              <p className={styles.fine}>The first lessons go live on Nov 27, the full course by Dec 15.</p>
            </div>
          </article>

          <div className={styles.alreadyHead}>
            <h3>Already inside</h3>
            <div className={styles.legend}>{legend.map(([n, l, t]) => <span key={l} className={`${styles.type} ${typeClass[t]}`}><b>{n}</b> {l}</span>)}</div>
          </div>
          <div className={styles.courseGrid}>
            {courses.map((c, i) => (
              <article key={c.name} className={styles.course}>
                <div className={styles.cover} aria-hidden="true"><span className={styles.coverNum}>{String(i + 1).padStart(2, '0')}</span><strong>{c.cover[0]}</strong><em>{c.cover[1]}</em></div>
                <div className={styles.courseBody}>
                  <span className={`${styles.type} ${typeClass[c.type]}`}>{c.type}</span>
                  <h3>{c.name}</h3>
                  <p>{c.text}</p>
                  <div className={styles.included}>{c.value ? <s>${c.value}</s> : null}<span>included</span></div>
                </div>
              </article>
            ))}
          </div>
          {totalValue !== null && (
            <div className={styles.totalBar}>
              <p>Total value <s>${totalValue}</s></p>
              <p>Your price: from <strong>${yearlyPerMonth}/month</strong></p>
              <a href="#pricing" className={styles.primary}>Unlock everything <span aria-hidden="true">→</span></a>
            </div>
          )}
        </section>

        {/* 10. BONUS */}
        <section className={`${styles.section} ${styles.bonus}`} id="bonus">
          <KitVisual />
          <div>
            <Eyebrow>Bonus</Eyebrow>
            <h2>Included free: <span className={styles.hl}>the Resources kit.</span></h2>
            <p>The tools I use to set up every new project, ready the moment you join.</p>
            <ul className={styles.checkList}>{resourcesKit.map(([h, p]) => <li key={h}><strong>{h}:</strong> {p}</li>)}</ul>
            <p className={styles.bonusPrice}>{RESOURCES_KIT_VALUE ? <><s>${RESOURCES_KIT_VALUE}</s> <strong>$0 today</strong> · </> : null}Included in every plan</p>
            <JoinLink cta="ai-community-bonus">Start trial + get the kit</JoinLink>
          </div>
        </section>

        {/* 11. MEMBER MESSAGES (hidden until real messages exist) */}
        {testimonials.length > 0 && (
          <section className={styles.section} id="proof">
            <Eyebrow>From members</Eyebrow>
            <h2>These aren&apos;t reviews from a sales page. <span className={styles.hl}>They&apos;re messages from members.</span></h2>
            <p className={styles.intro}>Screenshots from the community and my inbox, exactly as they arrived.</p>
            <div className={styles.grid3}>
              {testimonials.map(t => (
                <article key={t.name} className={styles.card}>
                  {t.image && <Image src={t.image} alt={`Message from ${t.name}`} width={720} height={540} className={styles.shot} />}
                  <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
                  <p className={styles.note}>{t.result}</p>
                  <p className={styles.who}><strong>{t.name}</strong><span>{t.role}</span></p>
                </article>
              ))}
              <article className={`${styles.card} ${styles.nextShot}`}>
                <h3>Your build could be the next screenshot.</h3>
                <p>Join, run your first agent, and tell me what it found. I share member messages as they arrive (with permission).</p>
                <JoinLink cta="ai-community-proof">Start your free trial</JoinLink>
              </article>
            </div>
          </section>
        )}

        {/* 12. PRICING */}
        <section className={styles.section} id="pricing">
          <span id="join" className={styles.anchor} aria-hidden="true" />
          <Eyebrow n="08">Pricing</Eyebrow>
          <h2>Pick how you pay. <span className={styles.hl}>You get everything either way.</span></h2>
          <p className={styles.intro}>Same access on both plans: the community, every course, every skill and agent, and everything new that ships.</p>
          <div className={styles.plans}>
            <article className={styles.plan}>
              <h3>Monthly</h3>
              <p className={styles.planSub}>no commitment, cancel anytime</p>
              <p className={styles.planPrice}><strong>${MONTHLY}</strong><span>/month</span></p>
              <p className={styles.planBill}>billed monthly</p>
              <ul className={styles.checkList}>{monthlyFeatures.map((f, i) => <li key={i}>{f}</li>)}</ul>
              <JoinLink variant="ghost" cta="ai-community-monthly">Start monthly</JoinLink>
              <p className={styles.planFoot}>cancel anytime, no questions</p>
            </article>
            <article className={`${styles.plan} ${styles.planBest}`}>
              <span className={styles.bestBadge}>{BF_ACTIVE ? `Black Friday · until ${BF_ENDS}` : 'Best value'}</span>
              <h3>Yearly</h3>
              <p className={styles.planSub}>pay for {yearlyPaidMonths} months, get 12</p>
              <p className={styles.planPrice}>{BF_ACTIVE && <s className={styles.planWas}>${YEARLY_REGULAR}</s>}<strong>${YEARLY}</strong><span>/year</span></p>
              <p className={styles.planBill}>${yearlyPerMonth} a month · <b>Save ${yearlySavings} · {yearlySavingsPct}%</b></p>
              <ul className={styles.checkList}>{yearlyFeatures.map((f, i) => <li key={i}>{f}</li>)}</ul>
              <JoinLink cta="ai-community-yearly">{BF_ACTIVE ? `Get yearly for $${YEARLY}` : `Go yearly and save $${yearlySavings}`}</JoinLink>
              <p className={styles.planFoot}>{BF_ACTIVE ? `$${YEARLY_REGULAR}/year from Dec 2` : 'best value for the year ahead'}</p>
            </article>
          </div>
          <div className={styles.ladder}>
            <div className={styles.ladderHead}><h3>The price grows with the community.</h3><p>Join earlier, pay less. Your price never changes while you stay.</p></div>
            <div className={styles.ladderSteps}>
              {ladder.map(l => (
                <div key={l.label} className={`${styles.rung} ${l.state === 'current' ? styles.rungCurrent : ''} ${l.state === 'closed' ? styles.rungClosed : ''}`}>
                  {l.state === 'current' && <span className={styles.here}>You are here</span>}
                  {l.state === 'closed' && <span className={styles.closed}>Closed</span>}
                  <strong>{l.price}</strong>
                  <span>{l.label}</span>
                  <small>{l.sub}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 13. FAQ */}
        <section className={`${styles.section} ${styles.faq}`} id="faq">
          <Eyebrow n="09">FAQ</Eyebrow>
          <h2>Questions people <span className={styles.hl}>ask before joining.</span></h2>
          {faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </section>

        {/* 14. FREE START (#learn is linked from posts) */}
        <section className={styles.section} id="learn">
          <Eyebrow>Free AI learning paths</Eyebrow>
          <h2>Not ready yet? <span className={styles.hl}>Start free.</span></h2>
          <p className={styles.intro}>Start with the problem you have today. These tutorials and guides are free; the membership adds the toolkit, the courses and the challenges.</p>
          <div className={styles.grid3}>{aiLearningPaths.map(p => <article key={p.id} className={styles.card}><p className={styles.pathLabel}>{p.label}</p><h3>{p.title}</h3><p>{p.description}</p><ul className={styles.guides}>{p.articles.map(a => <li key={a.slug}><Link href={`/posts/${a.slug}`}>{a.title} <span aria-hidden="true">→</span></Link></li>)}</ul></article>)}</div>
          <div className={styles.freeRow}>{freeResources.map(([href, h, p]) => <Link key={href} href={href} className={styles.freeCard}><strong>{h}</strong><span>{p}</span></Link>)}</div>
        </section>

        {/* 15. FINAL CTA */}
        <section className={`${styles.section} ${styles.final}`}>
          <h2>Stop collecting AI tabs. <span className={styles.hl}>Start shipping with AI.</span></h2>
          <p>Everything I&apos;ve tested on real code, in one place. Install in two minutes and run your first agent tonight.</p>
          {BF_ACTIVE ? <JoinLink cta="ai-community-final">Get yearly for ${YEARLY}</JoinLink> : <JoinLink cta="ai-community-final" />}
          <p className={styles.note}>{BF_ACTIVE ? <>Black Friday: ${YEARLY}/year until {BF_ENDS}, then ${YEARLY_REGULAR} · or ${MONTHLY}/month with a 7-day free trial</> : <>${MONTHLY}/month after the trial · cancel anytime</>}</p>
        </section>
      </div>

      <div className={styles.stickyCta}><span>{BF_ACTIVE ? `Black Friday · $${YEARLY}/year` : `7-day free trial · $${MONTHLY}/mo`}</span><a href={AI_COMMUNITY_JOIN_URL} data-cta="ai-community-sticky">{BF_ACTIVE ? 'Get yearly' : 'Start free trial'}</a></div>
    </div>
  );
}
