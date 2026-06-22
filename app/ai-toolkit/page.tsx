import { Metadata } from 'next';
import ScrollReveal from './ScrollReveal';

const PAGE_URL = 'https://thecodeman.net/ai-toolkit';

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: 'AI for .NET Developers - Skills, Agents & MCP for C# | TheCodeMan',
  description:
    '50+ AI tools for .NET developers that run on your real C# codebase - a file, folder, project, or GitHub link. AI code review, EF Core, security, observability and DevOps. Built on Claude, MCP-ready. Start a 7-day free trial.',
  keywords: [
    'AI for .NET developers', 'AI tools for .NET', '.NET AI agents', 'AI agents for developers',
    'AI code review C#', 'AI code review .NET', 'Claude skills .NET', 'MCP server .NET',
    'Model Context Protocol .NET', 'AI for C# developers', '.NET AI toolkit', 'AI pair programming .NET',
    'AI .NET code audit', 'Entity Framework Core AI', 'AI .NET security audit', 'AI dev tools 2026',
    'ASP.NET Core AI', 'AI agents C#', 'autonomous coding agents .NET', 'AI software engineering .NET',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'AI for .NET Developers - Skills, Agents & MCP for C#',
    type: 'website',
    url: PAGE_URL,
    description:
      '50+ AI tools for .NET developers that run on your real C# codebase. AI code review, EF Core, security, observability. Built on Claude, MCP-ready. 7-day free trial.',
  },
  twitter: {
    title: 'AI for .NET Developers - Skills, Agents & MCP for C#',
    card: 'summary_large_image',
    site: '@TheCodeMan__',
    creator: '@TheCodeMan__',
    description:
      '50+ AI tools for .NET developers that run on your real C# code. Built on Claude, MCP-ready. 7-day free trial.',
  },
};

// TODO: prices and the optional demo embed
const TOOLKIT_URL = 'https://www.skool.com/thecodeman-ai-toolkit-9723'; // paid group (enable 7-day free trial in Skool)
const PRICE_MONTHLY = '$12';
const PRICE_ANNUAL = '$100';
// Paste a YouTube/Loom embed URL for the demo clip. Leave '' to show the placeholder.
const DEMO_EMBED_URL = '';

const card = {
  border: '1px solid var(--tk-line)',
  borderRadius: '16px',
  background: 'var(--tk-card-bg)',
} as const;

const findings = [
  'No distributed tracing across services. Metrics only.',
  'Only 1 of 75 endpoints actually required authorization.',
  'Sensitive data logging left on in every environment.',
  'In-memory filtering and N+1 queries hiding in the data layer.',
  'No central package management across 30+ NuGet packages.',
];

const features = [
  { title: '50+ AI tools, and growing', desc: 'Architecture, EF Core, performance, observability, testing, security and DevOps. New tools added all the time.' },
  { title: 'Runs on your real code', desc: 'A file, a folder, a whole project, or a GitHub link. It finds the relevant files itself. No pasting snippets.' },
  { title: 'AI code review for C#', desc: 'Senior-level review, security audits and EF Core optimization with findings down to file and line.' },
  { title: 'Built on Claude, MCP-ready', desc: 'Standard Claude skills and agents you can run in Claude Code or Cowork, designed to plug into MCP workflows.' },
  { title: 'A local dashboard', desc: 'One self-contained page that catalogs everything in the toolkit plus your run history. Just ask it to open.' },
  { title: 'New AI tools every week', desc: 'Something new or updated every week, and a changelog you can actually see.' },
];

const categories: string[] = [
  'Architecture', 'EF Core / Database', 'Performance', 'Observability', 'Testing',
  'Security', 'DevOps', 'Code Quality', 'AI Tooling',
];

const steps: [string, string][] = [
  ['Install a tool', 'Drop a skill or agent into your Claude / Cowork setup. One folder, zero dependencies.'],
  ['Point it at your code', '"Optimize the EF queries in src/Orders" or "Audit this repo for security". A file, folder, project, or GitHub link.'],
  ['Get senior-level output', 'Findings with file and line, ranked by impact, with the fix. It even tells you what is already good.'],
];

const faqs: [string, string][] = [
  ['What is TheCodeMan AI Toolkit?', 'It is a growing library of AI tools for .NET developers - skills, agents and more - plus a community. They run on your real C# codebase and cover architecture, EF Core, performance, observability, testing, security and DevOps.'],
  ['How do the AI tools work on my .NET code?', 'You point a tool at a target - a file, a folder, a whole project, or a GitHub link - and it finds the relevant files itself, then reports back like a senior engineer with findings down to file and line. You never paste code into a chat window.'],
  ['Is it built on Claude and does it work with MCP?', 'Yes. The tools are standard Claude skills and agents you run in Claude Code or Cowork. They are designed to fit modern AI workflows, including Model Context Protocol (MCP) setups.'],
  ['Can I use it for AI code review in C#?', 'Yes. There are dedicated tools for code review, security auditing (OWASP), architecture review, database performance and observability gaps - all tailored to .NET and C#.'],
  ['Is my code safe?', 'The tools run inside your own AI tooling on the target you choose. You stay in control of what each one is pointed at.'],
  ['Is there a free trial and can I cancel anytime?', 'Yes. You start with a 7-day free trial and can cancel anytime.'],
];

const yellowBtn = {
  display: 'inline-block', padding: '14px 30px', borderRadius: '999px',
  fontWeight: 800, fontSize: '1rem', textDecoration: 'none',
  background: '#ffbd39', color: '#2a003a',
} as const;

const toolNames = [
  'clean-architecture-scaffolder', 'cqrs-mediatr-setup', 'result-pattern-scaffolder', 'minimal-api-endpoint-scaffolder',
  'ddd-aggregate-generator', 'modular-monolith-generator', 'microservice-template-generator', 'ef-core-query-optimizer',
  'ef-migration-reviewer', 'ef-index-advisor', 'sql-linq-converter', 'dbcontext-config-auditor', 'temporal-tables-setup',
  'specification-pattern-generator', 'db-resiliency-setup', 'async-await-auditor', 'benchmarkdotnet-setup',
  'memory-allocation-analyzer', 'span-memory-refactor', 'caching-strategy-setup', 'gc-pressure-auditor',
  'hotpath-profiler-assistant', 'stj-serialization-optimizer', 'opentelemetry-setup', 'serilog-logging-setup',
  'healthchecks-setup', 'distributed-tracing-diagnostics', 'metrics-dashboard-generator', 'correlation-id-middleware',
  'xunit-test-generator', 'integration-test-setup', 'test-coverage-gap-finder', 'mutation-testing-setup',
  'test-data-builder-generator', 'netarchtest-generator', 'jwt-auth-setup', 'dependency-vuln-scanner',
  'secrets-config-auditor', 'authorization-policy-generator', 'dockerfile-generator', 'cicd-pipeline-generator',
  'nuget-dependency-analyzer', 'options-pattern-generator', 'toolkit-dashboard', 'dotnet-architecture-reviewer',
  'legacy-modernization-assistant', 'db-performance-auditor', 'dotnet-code-reviewer', 'aspnetcore-security-auditor',
  'observability-gap-finder', 'dotnet-upgrade-agent',
];

const softwareLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TheCodeMan AI Toolkit',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Windows, macOS, Linux',
  description:
    '50+ AI tools for .NET developers that run on your real C# codebase. AI code review, EF Core optimization, security audits, observability and DevOps. Built on Claude, MCP-ready.',
  url: PAGE_URL,
  author: { '@type': 'Person', name: 'Stefan Djokic', url: 'https://thecodeman.net' },
  offers: {
    '@type': 'Offer',
    price: '12.00',
    priceCurrency: 'USD',
    url: PAGE_URL,
    description: '7-day free trial, then $12/month or $100/year. Cancel anytime.',
  },
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const AiToolkit = () => {
  const marquee = [...toolNames, ...toolNames];

  return (
    <>
      <ScrollReveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">

        {/* ── Hero ── */}
        <div className="tk-hero-glow">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xs-12 col-sm-12 col-md-11 col-lg-9 heading-section text-center mt-5">
                <span className="tk-eyebrow" data-reveal>AI for .NET developers</span>

                <h1 className="text-white mb-4" data-reveal data-delay="1">
                  Real AI for your real <span className="text-yellow">.NET code</span>.
                </h1>

                <h4 className="text-white mb-4" style={{ fontWeight: 400, lineHeight: 1.6 }} data-reveal data-delay="2">
                  50+ AI tools for .NET and C# developers, and growing - code review, EF Core, performance, security,
                  observability, MCP, agents and more. They run on your actual code, not toy examples.
                </h4>

                <div className="d-flex flex-wrap justify-content-center gap-3 mb-2" data-reveal data-delay="3">
                  <a href={TOOLKIT_URL} className="tk-btn" style={yellowBtn} target="_blank" rel="noopener" data-cta="start-trial">Start your 7-day free trial</a>
                </div>
                <p className="text-white mb-4" style={{ opacity: 0.65, fontSize: '0.88rem' }} data-reveal data-delay="3">
                  Cancel anytime · no credit card to start the trial
                </p>

                {/* ── Demo video ── */}
                <div className="row justify-content-center" data-reveal data-delay="4">
                  <div className="col-xs-12 col-sm-12 col-md-10 col-lg-9">
                    <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--tk-line)', background: 'var(--tk-card-bg)' }}>
                      {DEMO_EMBED_URL ? (
                        <iframe
                          src={DEMO_EMBED_URL}
                          title="TheCodeMan AI Toolkit demo"
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ffbd39', color: '#2a003a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>▶</div>
                          <span className="text-white" style={{ opacity: 0.7, fontSize: '0.9rem' }}>Watch the toolkit run on a real .NET codebase</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-white mt-4 mb-0" style={{ opacity: 0.75, fontSize: '0.95rem' }} data-reveal>
                  <span className="text-yellow" style={{ fontWeight: 700 }}>1,500+</span> developers in the community · built by a Microsoft MVP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Marquee of tools ── */}
        <div className="container-fluid px-0 mt-5 mb-4" data-reveal>
          <div className="tk-marquee">
            <div className="tk-marquee-track">
              {marquee.map((name, i) => (
                <span className="tk-chip" key={`${name}-${i}`}>{name}</span>
              ))}
            </div>
          </div>
        </div>

        <hr className="background-yellow" />

        {/* ── Proof ── */}
        <div className="container">
          <div className="row justify-content-center text-center pt-4">
            <div className="col-md-12 mb-4">
              <span className="tk-eyebrow" data-reveal>The proof</span>
              <h2 className="text-white" data-reveal data-delay="1">I pointed the whole toolkit at a real production .NET 10 codebase</h2>
              <p className="text-white" style={{ opacity: 0.85 }} data-reveal data-delay="2">Real client project, so the name stays private. Here is some of what the AI caught.</p>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
              {findings.map((f, i) => (
                <div key={f} className="tk-card p-3 mb-2 d-flex align-items-start" style={{ ...card, textAlign: 'left', gap: '12px' }} data-reveal data-delay={String(Math.min(i + 1, 5))}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ff6b81', marginTop: '8px', flex: 'none' }}></span>
                  <span className="text-white" style={{ fontSize: '0.97rem' }}>{f}</span>
                </div>
              ))}
              <p className="mt-3" style={{ fontWeight: 600, color: '#46d39a' }} data-reveal>
                And the AI passed the parts that were already solid. No invented problems.
              </p>
            </div>
          </div>
        </div>

        <hr className="background-yellow" />

        {/* ── What you get ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>What you get</span>
              <h2 className="text-white" data-reveal data-delay="1">AI tools for every part of .NET</h2>
            </div>
  