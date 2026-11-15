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

/* Pricing (keep in sync with Skool) */
const MONTHLY = 19;
const YEARLY = 149;
const yearlyPerMonth = (YEARLY / 12).toFixed(2);
const yearlySavings = MONTHLY * 12 - YEARLY;
const yearlySavingsPct = Math.round((yearlySavings / (MONTHLY * 12)) * 100);
const MEMBER_LOGIN_URL = 'https://www.skool.com/ai-for-dotnet-developers';

const title = 'AI for Developers Community | Claude Code, AI Agents & AI Features';
const description = 'Skills, agents and lessons that make AI coding consistent, plus how to build AI into your apps. 49 skills, 7 agents, 8 courses. 7-day free trial.';

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
  ['You re-explain your project every session', 'Same context, same rules, same "don\'t touch that folder". The agent forgets it all by tomorrow.'],
  ['The code looks right, then fails review', 'It compiles. It passes the happy path. Then someone finds the N+1 query, the missing auth check and the swallowed exception.'],
  ['Tutorials in, nothing out', 'You watched the videos and saved the threads. Your repo still has no CLAUDE.md, no skills and no hooks.'],
  ["You're falling behind, quietly", 'The developers around you ship faster with AI. You are still deciding which tool to trust. Alone. Without context.'],
];

const ways = [
  ['Make your AI agent consistent', 'CLAUDE.md, rules, skills, hooks and subagents done right. Your agent follows your patterns instead of inventing new ones every session.'],
  ['Get a senior review on demand', 'Point an agent at your repo and get a ranked report: security gaps, architecture drift, slow queries, missing tests. With the fix next to each finding.'],
  ['Build AI into your own product', 'Embeddings, semantic search, RAG and MCP servers with runnable source code, not slides. Examples in C#, concepts for any stack.'],
];

const outcomes = [
  ['2 commands', 'Your whole toolkit, in every project', '49 skills and 7 agents install once and work in .NET, Node/TypeScript, Python, Java/Kotlin and Go.'],
  ['plain English', 'Nothing to memorize', 'Describe what you want: "This query is slow, optimize it." Claude picks the right skill by itself.'],
  ['ranked report', 'Know what to fix first', 'Agents give you a scored, ranked report. Not a wall of warnings.'],
  ['same evening', 'Apply it tonight, not someday', 'Every lesson is problem, solution, step by step, then your exercise. No 15-minute intros.'],
  ['career', 'Skills that pay off', "AI won't replace good developers. Developers who know how to work with AI will replace those who don't."],
];

const steps = [
  ['Join and install', 'Start your free trial and open Start Here. Two commands in Claude Code, and every skill and agent is in every project.'],
  ['Run one agent on your real code', 'Ask in plain English. Get a ranked report in minutes. Fix one thing today.'],
  ['Ask, share, request', 'Stuck? Post in Questions & Help, I answer everything. Missing a tool? Post it in Tool Requests. That is how new packs get built.'],
];

const founderStats = [
  ['Microsoft MVP', 'recognized by Microsoft'],
  ['116K+', 'developers on LinkedIn'],
  ['21K+', 'newsletter readers'],
  ['49 + 7', 'skills and agents built'],
];

const quickGrid = [
  ['A lesson for every skill', 'when to use it, prompts for your stack'],
  ['Agents that audit your app', 'security, database, architecture, observability'],
  ['Runnable AI projects', 'MCP server, semantic search, RAG'],
  ['Community support', 'ask anytime, I answer everything'],
];

type Course = { cover: [string, string]; name: string; type: string; text: string; value?: number };
const courses: Course[] = [
  { cover: ['Start', 'Here'], name: 'Start Here', type: 'Course', text: 'Your first hour: install, CLAUDE.md, one agent on your real code. Plus the AI Coding Agent Starter Kit to set up any repo in 15 minutes.' },
  { cover: ['AI', 'Roadmap'], name: 'AI Roadmap for Developers', type: 'Course', text: '8 modules from "use AI" to "build AI". Written lessons today, video lessons landing over the next weeks.' },
  { cover: ['Claude Code', 'Workflow'], name: 'Claude Code & Agent Workflow', type: 'Course', text: 'CLAUDE.md, rules, hooks (6 recipes), /rewind, headless mode and MCP.' },
  { cover: ['49', 'Skills'], name: 'Skills', type: 'Toolkit', text: '49 skills across architecture, database, testing, performance, security, observability and DevOps, plus a .NET Pack. A lesson for each one.' },
  { cover: ['7', 'Agents'], name: 'Agents', type: 'Toolkit', text: '7 agents that review your code, audit your app, and help you upgrade and modernize.' },
  { cover: ['Packs', 'on request'], name: 'Packs', type: 'Pack', text: 'Legacy Pack (3 skills, an agent and a sample project with 19 planted bugs) and CRUD vs Event Sourcing.' },
  { cover: ['Build', 'AI Features'], name: 'Build AI Features', type: 'Projects', text: 'Semantic search, RAG and an MCP server, with runnable C# source code.' },
  { cover: ['Monthly', 'Challenges'], name: 'Build Challenges', type: 'Challenge', text: 'A new challenge every month (12 projects in the first one) and a gallery of finished builds.' },
];
const courseValues = courses.map(c => c.value);
const totalValue = courseValues.every((v): v is number => typeof v === 'number') ? (courseValues as number[]).reduce((a, b) => a + b, 0) : null;

const resourcesKit = [
  ['CLAUDE.md Generator', 'answer a few questions, get a context file for your project'],
  ['CLAUDE.md template', 'the structure I use, including the "never do this" section'],
  ['AI Prompt Playbook', 'the exact phrasings that get the best results from the toolkit'],
  ['Toolkit dashboard', 'every skill and agent, and the results of your runs, in one page'],
];

const monthlyFeatures = ['The full community', 'All 8 courses', '49 skills + 7 agents, with a lesson for each', 'Bonus: Resources kit', 'New skill every week, new agent every month', '7-day free trial'];
const yearlyFeatures = ['Everything in Monthly', `$${yearlyPerMonth} a month instead of $${MONTHLY}`, 'Your price is locked, even when it goes up', 'Every course that ships this year', 'No monthly decision, just build'];

const ladder = [
  { price: '$12', label: 'Founding price', sub: 'first 100 members', state: 'closed' },
  { price: `$${MONTHLY}`, label: 'Current price', sub: 'join now and keep it', state: 'current' },
  { price: '$29', label: 'Next price', sub: 'after the next 100 members', state: 'next' },
  { price: '$39', label: 'Final price', sub: '100 members after that', state: 'next' },
];

const faqs = [
  ['What is AI for Developers?', 'A paid community led by Stefan Djokic, Microsoft MVP, for developers who want consistent results from AI coding agents and want to build AI features (RAG, MCP, agents) the right way. Membership includes 49 skills and 7 agents for Claude Code, 8 courses, monthly build challenges and the AI Weekly briefing. It runs on Skool with a 7-day free trial.'],
  ["I'm not a .NET developer. Is this for me?", "Yes. Every skill detects your stack first (.NET, Node/TypeScript, Python, Java/Kotlin, Go) and uses the right tools for it. Code in the courses is mostly C#, because that is where I come from, but the concepts work anywhere. A few .NET-only skills live in a separate .NET Pack."],
  ['I already use Claude Code (or Cursor, or Copilot). What is new here?', 'The tool is the engine. This is the setup around it: context files, skills, agents, hooks and review habits that make results consistent. The toolkit is built for Claude Code, and most of the workflow lessons carry over to other AI coding tools.'],
  ['The skills are on GitHub. Why pay?', 'They are open because I want you to see how they work. The membership is what turns them into results: a lesson for every skill with prompts for your stack, 8 courses, monthly build challenges and direct answers from me. And when you need a tool that does not exist yet, you ask in Tool Requests and I build it.'],
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
          <div className={styles.actions}><JoinLink /><a href="#inside" className={styles.secondary}>See what&apos;s inside ↓</a></div>
          <p className={styles.note}>${MONTHLY}/month after the trial · cancel anytime · Already a member? <a href={MEMBER_LOGIN_URL} className={styles.textLink}>Log in</a></p>
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
          <div className={styles.grid2}>
            {traps.map(([h, p]) => <article key={h} className={`${styles.card} ${styles.trapCard}`}><span className={styles.trapIcon} aria-hidden="true">✗</span><h3>{h}</h3><p>{p}</p></article>)}
          </div>
          <div className={styles.pullQuote}>
            <p className={styles.pullBig}>The problem isn&apos;t the model.</p>
            <p>It&apos;s that nobody showed you the setup around it. Every week there&apos;s a new tool, a new model and a new &quot;this changes everything&quot;. Without a system, you just collect tabs.</p>
          </div>
        </section>

        {/* 4. THE SOLUTION */}
        <section className={`${styles.section} ${styles.split}`} id="solution">
          <div>
            <Eyebrow n="02">The solution</Eyebrow>
            <h2>My job is to test it on real code. <span className={styles.hl}>Yours is to use it.</span></h2>
            <p>I&apos;m a backend developer and Microsoft MVP, and I run AI agents on real production code every day. Everything that survives that ends up here: as a skill you install in two commands, or a lesson you can follow in one evening.</p>
            <div className={styles.chips}><span>No hype</span><span>No 3-hour videos</span><span>No toy examples</span></div>
          </div>
          <article className={`${styles.card} ${styles.whatCard}`}>
            <h3>What is this?</h3>
            <p>A community for developers who use AI coding agents on real code and want consistent, senior-level results. And for backend developers who want to build AI features (RAG, MCP, agents) the right way.</p>
            <p>Only what I&apos;ve tested, use, and keep using. Things you can apply the same day.</p>
            <div className={styles.statBadge}><strong>49 skills + 7 agents</strong><span>install once, work in every project</span></div>
          </article>
        </section>

        {/* 5. THREE WAYS */}
        <section className={styles.section} id="ways">
          <Eyebrow n="03">3 ways</Eyebrow>
          <h2>How <span className={styles.hl}>AI for Developers</span> actually helps you.</h2>
          <div className={styles.grid3}>
            {ways.map(([h, p], i) => <article key={h} className={styles.card}><span className={styles.number}>{String(i + 1).padStart(2, '0')}</span><h3>{h}</h3><p>{p}</p></article>)}
          </div>
        </section>

        {/* 6. WHAT YOU GET */}
        <section className={styles.section} id="inside">
          <Eyebrow n="04">What you get</Eyebrow>
          <h2>Zero time filtering. <span className={styles.hl}>Only what works on real code.</span></h2>
          <p className={styles.intro}>You stop following 50 sources. You get what already passed the test on a real codebase.</p>
          <div className={styles.grid3}>
            {outcomes.map(([tag, h, p]) => <article key={h} className={styles.card}><span className={styles.tag}>{tag}</span><h3>{h}</h3><p>{p}</p></article>)}
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
            <p>I&apos;ve spent years building backend systems, and today I run AI agents on that code every day. I&apos;ve seen what breaks: agents that ignore your architecture, &quot;fixes&quot; that pass the tests and fail in production, setups that work for exactly one week.</p>
            <p>So I built AI for Developers. It&apos;s where I share only what I actually use, test and keep using. When something stops working, I say so. When a member needs a tool, I build it.</p>
            <p className={styles.note}>The Legacy Pack started as one member&apos;s post about migrating an ERP on .NET Framework.</p>
            <div className={styles.stats}>{founderStats.map(([v, l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}</div>
          </div>
        </section>

        <div className={styles.quickGrid}>
          {quickGrid.map(([h, p]) => <div key={h}><strong>{h}</strong><span>{p}</span></div>)}
        </div>

        {/* 9. COURSES / VALUE STACK */}
        <section className={styles.section} id="courses">
          <div className={styles.sectionHead}>
            <div><Eyebrow n="07">Courses</Eyebrow><h2>8 courses. <span className={styles.hl}>All included in one membership.</span></h2></div>
            <p>Everything is inside from day one, plus every new skill, agent and course that ships while you&apos;re a member.</p>
          </div>
          <div className={styles.courseGrid}>
            {courses.map((c, i) => (
              <article key={c.name} className={styles.course}>
                <div className={styles.cover} aria-hidden="true"><span className={styles.coverNum}>{String(i + 1).padStart(2, '0')}</span><strong>{c.cover[0]}</strong><em>{c.cover[1]}</em></div>
                <div className={styles.courseBody}>
                  <span className={styles.type}>{c.type}</span>
                  <h3>{c.name}</h3>
                  <p>{c.text}</p>
                  <div className={styles.included}>{c.value ? <s>${c.value}</s> : null}<span>included</span></div>
                </div>
              </article>
            ))}
          </div>
          <p className={styles.resourcesLine}><strong>+ Resources:</strong> CLAUDE.md generator, CLAUDE.md template, AI Prompt Playbook and the Toolkit dashboard.</p>
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
          <div className={styles.giftBox} aria-hidden="true"><span>Bonus</span><strong>Resources kit</strong><em>4 tools · included</em></div>
          <div>
            <Eyebrow>Bonus</Eyebrow>
            <h2>Included free: <span className={styles.hl}>the Resources kit.</span></h2>
            <p>The tools I use to set up every new project, ready the moment you join. No extra cost.</p>
            <ul className={styles.checkList}>{resourcesKit.map(([h, p]) => <li key={h}><strong>{h}:</strong> {p}</li>)}</ul>
            <p className={styles.bonusPrice}>{RESOURCES_KIT_VALUE ? <><s>${RESOURCES_KIT_VALUE}</s> <strong>$0 today</strong> · </> : null}Included in your ${MONTHLY}/month</p>
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
          <p className={styles.intro}>Same access on both plans: the community, all 8 courses, every skill and agent, and everything new that ships.</p>
          <div className={styles.plans}>
            <article className={styles.plan}>
              <h3>Monthly</h3>
              <p className={styles.planSub}>no commitment, cancel anytime</p>
              <p className={styles.planPrice}><strong>${MONTHLY}</strong><span>/month</span></p>
              <p className={styles.planBill}>billed monthly</p>
              <ul className={styles.checkList}>{monthlyFeatures.map(f => <li key={f}>{f}</li>)}</ul>
              <JoinLink variant="ghost" cta="ai-community-monthly">Start monthly</JoinLink>
              <p className={styles.planFoot}>cancel anytime, no questions</p>
            </article>
            <article className={`${styles.plan} ${styles.planBest}`}>
              <span className={styles.bestBadge}>Best value</span>
              <h3>Yearly</h3>
              <p className={styles.planSub}>pay for 8 months, get 12</p>
              <p className={styles.planPrice}><strong>${yearlyPerMonth}</strong><span>/month</span></p>
              <p className={styles.planBill}>${YEARLY} billed once a year · <b>Save ${yearlySavings} · {yearlySavingsPct}%</b></p>
              <ul className={styles.checkList}>{yearlyFeatures.map(f => <li key={f}>{f}</li>)}</ul>
              <JoinLink cta="ai-community-yearly">Go yearly and save ${yearlySavings}</JoinLink>
              <p className={styles.planFoot}>best value for the year ahead</p>
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
          <JoinLink cta="ai-community-final" />
          <p className={styles.note}>${MONTHLY}/month after the trial · cancel anytime</p>
        </section>
      </div>

      <div className={styles.stickyCta}><span>7-day free trial · ${MONTHLY}/mo</span><a href={AI_COMMUNITY_JOIN_URL} data-cta="ai-community-sticky">Start free trial</a></div>
    </div>
  );
}
