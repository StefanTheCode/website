import { Metadata } from 'next'
import FreeMotion from '../../components/free/FreeMotion'
import BfAiStrip from '@/components/BfAiStrip';
import { AI_COMMUNITY_JOIN_URL } from '@/components/aiCommunity';

// Landing page for the .NET Pack (Legacy Pack + Migration Pack beta), which is
// available to AI for Developers community members only. No public repo links here:
// every "get it" CTA goes to the community. The sample report is public on purpose.
const PAGE_URL = 'https://thecodeman.net/legacy-dotnet'
const IMAGE = '/images/legacy-dotnet/og.webp'
const SAMPLE_REPORT_URL = '/downloads/legacy-shop-migration-assessment.html'
const TITLE = 'Migrate .NET Framework to .NET 10 with AI - the Migration Pack'
const DESCRIPTION =
  'Claude Code and GitHub Copilot skills that move a .NET Framework app to .NET 10 piece by piece: an HTML assessment report, parity tests, a YARP strangler host and slice-by-slice migration of WebForms, MVC 5, Web API 2, WCF and EF6.'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    '.NET Framework to .NET 10',
    'migrate .NET Framework',
    'WebForms migration',
    'WCF to CoreWCF',
    'EF6 to EF Core',
    'strangler fig YARP',
    'System.Web adapters',
    'legacy .NET modernization',
    'Claude Code skills',
    'GitHub Copilot agents',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    type: 'website',
    url: PAGE_URL,
    description: DESCRIPTION,
    siteName: 'TheCodeMan.net',
    images: [{ url: IMAGE, width: 1200, height: 630, alt: 'Migrate .NET Framework to .NET 10 piece by piece, with AI' }],
  },
  twitter: {
    title: TITLE,
    card: 'summary_large_image',
    site: '@TheCodeMan__',
    creator: '@TheCodeMan__',
    description: DESCRIPTION,
    images: [IMAGE],
  },
}

const steps = [
  { label: 'Step 1 · Assess', title: 'One prompt, one HTML report', text: 'The scanner reads your solution and the report shows what has to change, how big the job is, days with and without AI, blockers, risks and the questions your team has to answer. Diagrams included, works offline.' },
  { label: 'Step 2 · Safety net', title: 'Tests before code', text: 'Parity tests record what the old app answers today: normalized HTML and JSON, status codes, headers. Flow tests cover postback screens, characterization tests lock the business rules - quirks included.' },
  { label: 'Step 3 · New host', title: '.NET 10 in front, both apps run', text: 'A new ASP.NET Core app with YARP sits in front of the old one. Migrated routes stay in .NET 10, everything else falls through. Session and sign-in are shared through the System.Web adapters.' },
  { label: 'Step 4 · Slice by slice', title: 'One slice, one commit, green tests', text: 'One page, controller, service or DbContext at a time. A route moves only when its parity tests are green. The orchestrator agent keeps the state in MIGRATION.md and stops for you at every decision.' },
]

const slices = [
  { from: 'WebForms page', to: 'Razor Pages or Blazor Server', note: 'picked per page by the report' },
  { from: 'MVC 5 / Web API 2', to: 'ASP.NET Core', note: 'same routes, status codes and JSON' },
  { from: 'WCF service', to: 'CoreWCF', note: 'same contract, clients don\'t change' },
  { from: 'EF6', to: 'EF 6.5 on .NET 10, then EF Core', note: 'context by context, with query-parity tests' },
  { from: 'web.config, Forms auth, machineKey', to: 'appsettings, cookie auth, Data Protection', note: 'plus session and BinaryFormatter' },
]

const migrationSkills = [
  ['migration-assessment-report', 'The scan and the HTML report'],
  ['migration-safety-net', 'Parity, flow and characterization tests'],
  ['yarp-strangler-setup', 'The .NET 10 host with YARP, remote session and auth'],
  ['webforms-page-migrator', 'One WebForms page to its target'],
  ['aspnet-mvc-webapi-migrator', 'MVC 5 and Web API 2 controllers'],
  ['wcf-service-migrator', 'WCF to CoreWCF with contract tests'],
  ['ef6-to-efcore-migrator', 'EF 6.5 bridge, then EF Core'],
  ['legacy-config-auth-migrator', 'Config, auth, session, Data Protection'],
]

const legacySkills = [
  ['legacy-package-migrator', 'packages.config to Central Package Management'],
  ['adonet-data-access-auditor', 'SQL injection and leaks in classic ADO.NET'],
  ['winforms-maintainer', 'Cross-thread, frozen UI and leak fixes'],
  ['span-memory-refactor', 'Span<T> / Memory<T> for hot code'],
]

const faq = [
  { q: 'Is this a rewrite tool?', a: 'No. It does the opposite: the old app keeps running and the system moves over one slice at a time. Each slice is a small diff you can review, proven by tests.' },
  { q: 'Does it work with GitHub Copilot?', a: 'Yes. The skills are plain SKILL.md files that Copilot reads as they are, and every agent has a Copilot edition. It works in VS Code, Visual Studio and Copilot CLI.' },
  { q: 'How much can AI really do?', a: 'Most of the mechanical work, the first draft of the translated code and most of the tests. On the sample app the report puts it at about 62% of the hands-on work. Decisions about auth, session, hosting and data stay with you.' },
  { q: 'What isn\'t covered yet?', a: 'It scans C# projects only (no VB.NET yet). WinForms and WPF UI migration, and reporting tools like Crystal Reports or ActiveReports, are out of scope. It\'s a beta - tell me what it missed on your app.' },
  { q: 'How do I get it?', a: 'The pack is part of the AI for Developers community, together with the AI for Developers course, 50+ skills and agents with a lesson for each, weekly AI news and live calls. Members get the install steps for Claude Code and GitHub Copilot inside. The sample report on this page is free to open.' },
]

const card = { border: '1px solid var(--tk-line)', borderRadius: '16px', background: 'var(--tk-card-bg)' } as const
const yellowBtn = { display: 'inline-block', padding: '14px 34px', borderRadius: '999px', fontWeight: 800, fontSize: '1rem', textDecoration: 'none', background: 'var(--tcm-amber)', color: 'var(--tcm-amber-ink)' } as const
const outlineBtn = { display: 'inline-block', padding: '13px 30px', borderRadius: '999px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)', color: 'var(--tcm-h)' } as const
const mono = { fontFamily: "'JetBrains Mono', monospace" } as const
const codeBlock = { ...mono, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 18px', fontSize: '0.85rem', color: 'var(--tcm-h)', whiteSpace: 'pre-wrap', textAlign: 'left', margin: 0 } as const
const shot = { width: '100%', height: 'auto', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.14)', display: 'block' } as const

const LegacyDotnet = () => {
  return (
    <>
      <FreeMotion />
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">

        {/* ── Hero ── */}
        <div className="tk-hero-glow crk-hero-glow">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xs-12 col-sm-12 col-md-11 col-lg-9 heading-section text-center mt-5">
                <span className="tk-eyebrow" data-reveal>Beta · in the AI for Developers community</span>

                <div className="d-flex justify-content-center mb-4" data-reveal data-delay="1">
                  <div className="d-inline-flex align-items-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '8px 16px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#46d39a', display: 'inline-block', marginRight: '10px' }} />
                    <span className="text-white" style={{ fontSize: '0.92rem' }}>Works in <strong>Claude Code</strong> and <strong>GitHub Copilot</strong></span>
                  </div>
                </div>

                <h1 className="text-white mb-4" data-reveal data-delay="1">
                  Migrate <span className="text-yellow crk-shimmer">.NET Framework</span> to .NET 10, piece by piece
                </h1>

                <h4 className="text-white mb-4" style={{ fontWeight: 400, lineHeight: 1.6 }} data-reveal data-delay="2">
                  Skills and agents that move WebForms, MVC 5, Web API 2, WCF and EF6 to .NET 10 one slice at a time - with tests that prove nothing changed.
                </h4>

                <p className="text-white mb-4" style={{ opacity: 0.85, lineHeight: 1.7 }} data-reveal data-delay="2">
                  Big-bang rewrites of old .NET apps stall for the same reasons: months without shipping, no proof the new app behaves like the old one, and an estimate nobody can explain.
                  This pack starts with a report that shows the real size of the job, then moves the app over while it keeps running.
                </p>

                <div className="d-flex flex-wrap justify-content-center gap-3" data-reveal data-delay="3">
                  <a href={AI_COMMUNITY_JOIN_URL} className="tk-btn" style={yellowBtn} target="_blank" rel="noopener noreferrer" data-cta="legacy-dotnet-community-hero">Get it in the community</a>
                  <a href={SAMPLE_REPORT_URL} className="tk-btn" style={outlineBtn} target="_blank" rel="noopener" data-cta="legacy-dotnet-sample-report">Open a sample report</a>
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4" data-reveal data-delay="4">
                  {['WebForms', 'MVC 5', 'Web API 2', 'WCF', 'EF6', 'Forms auth'].map((b) => (
                    <span key={b} className="text-white d-inline-flex align-items-center" style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                      <span className="text-yellow" style={{ marginRight: '8px' }}>✓</span>{b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container"><BfAiStrip /></div>

        <hr className="crk-divider" />

        {/* ── How it works ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>How it works</span>
              <h2 className="text-white" data-reveal data-delay="1">No rewrite. Four steps.</h2>
            </div>
            {steps.map((s, index) => (
              <div className="col-xs-12 col-sm-12 col-md-6 mb-4" key={s.label} data-reveal data-delay={String((index % 2) + 1)}>
                <div className={`tk-card crk-accent-card ${['crk-a-yellow', 'crk-a-teal', 'crk-a-purple', 'crk-a-coral'][index % 4]} p-4 h-100`} style={{ ...card, textAlign: 'left' }}>
                  <div className="crk-pill">{s.label}</div>
                  <h3 className="text-white mb-3" style={{ fontSize: '1.3rem' }}>{s.title}</h3>
                  <p className="text-white mb-0" style={{ fontSize: '0.95rem', opacity: 0.85, lineHeight: 1.65 }}>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── The report ── */}
        <div className="container pt-4">
          <div className="row text-center">
            <div className="col-md-12 mb-4">
              <span className="tk-eyebrow" data-reveal>Step 1 up close</span>
              <h2 className="text-white" data-reveal data-delay="1">What the report looks like</h2>
              <p className="text-white mx-auto" style={{ opacity: 0.85, maxWidth: '720px', lineHeight: 1.7 }} data-reveal data-delay="2">
                This is the real report for LegacyShop, the sample app in the repo: a .NET Framework 4.8 web shop with WebForms, Web API 2, MVC 5, WCF and EF6.
                Every page, controller, service and DbContext becomes a unit of work with hours, and every hour is split between the AI agent and you.
              </p>
            </div>
            <div className="col-md-12 mb-4" data-reveal>
              <img src="/images/legacy-dotnet/report-summary.webp" alt="Migration assessment summary for LegacyShop: size M, 21-47 days without AI, 11-25 days with an AI agent, AI can take over about 62% of the hands-on work, 4 hard blockers" width={1600} height={479} loading="lazy" style={shot} />
            </div>
            <div className="col-md-6 mb-4" data-reveal data-delay="1">
              <img src="/images/legacy-dotnet/who-does-what.webp" alt="Who does what: mechanical changes AI 90%, translating code AI 70%, tests AI 80%, decisions human 100%, hosting and rollout human 70%" width={1084} height={1224} loading="lazy" style={shot} />
            </div>
            <div className="col-md-6 mb-4 d-flex flex-column justify-content-center" data-reveal data-delay="2" style={{ textAlign: 'left' }}>
              <h3 className="text-white mb-3" style={{ fontSize: '1.4rem' }}>What AI does. What you do.</h3>
              <p className="text-white" style={{ opacity: 0.85, lineHeight: 1.7 }}>
                Project files, packages, config and the first draft of the translated code are work an agent does well. Tests too - it writes the parity and contract tests, you decide what &quot;the same behavior&quot; means.
              </p>
              <p className="text-white" style={{ opacity: 0.85, lineHeight: 1.7 }}>
                Decisions are yours: how sign-in and session work while both apps run, where the new app is hosted, which WebForms pages become Razor Pages and which become Blazor.
              </p>
              <div className="mt-2">
                <a href={SAMPLE_REPORT_URL} className="tk-btn" style={outlineBtn} target="_blank" rel="noopener" data-cta="legacy-dotnet-sample-report-2">Open the full sample report</a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Slice by slice ── */}
        <div className="container pt-4">
          <div className="row justify-content-center">
            <div className="col-md-12 mb-4 text-center">
              <span className="tk-eyebrow" data-reveal>Step 4 up close</span>
              <h2 className="text-white" data-reveal data-delay="1">What moves where</h2>
            </div>
            <div className="col-xs-12 col-md-11 col-lg-10" data-reveal>
              {slices.map((s) => (
                <div key={s.from} className="tk-card p-3 mb-3 d-flex flex-wrap align-items-center" style={{ ...card, gap: '12px 20px' }}>
                  <strong className="text-white" style={{ flex: '1 1 220px' }}>{s.from}</strong>
                  <span className="text-yellow" style={{ fontWeight: 800 }}>→</span>
                  <span style={{ flex: '2 1 320px' }}>
                    <strong className="text-yellow">{s.to}</strong>
                    <span className="text-white" style={{ opacity: 0.65 }}> - {s.note}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── What's in the pack ── */}
        <div className="container pt-5">
          <div className="row text-center">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>What&apos;s in the pack</span>
              <h2 className="text-white" data-reveal data-delay="1">Two packs and a sample app</h2>
            </div>
            <div className="col-xs-12 col-md-6 mb-4" data-reveal data-delay="1">
              <div className="tk-card crk-accent-card crk-a-yellow p-4 h-100" style={{ ...card, textAlign: 'left' }}>
                <div className="crk-pill">Migration Pack · beta</div>
                <p className="text-white" style={{ opacity: 0.85 }}>8 skills + the <code style={mono}>dotnet-migration-orchestrator</code> agent that runs the whole migration.</p>
                {migrationSkills.map(([name, text]) => (
                  <div key={name} className="mb-2" style={{ fontSize: '0.9rem' }}>
                    <code className="text-yellow" style={mono}>{name}</code>
                    <span className="text-white" style={{ opacity: 0.7 }}> - {text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-md-6 mb-4" data-reveal data-delay="2">
              <div className="tk-card crk-accent-card crk-a-teal p-4 mb-4" style={{ ...card, textAlign: 'left' }}>
                <div className="crk-pill">Legacy Pack</div>
                <p className="text-white" style={{ opacity: 0.85 }}>For the apps that stay on .NET Framework for now. 4 skills + 2 agents.</p>
                {legacySkills.map(([name, text]) => (
                  <div key={name} className="mb-2" style={{ fontSize: '0.9rem' }}>
                    <code className="text-yellow" style={mono}>{name}</code>
                    <span className="text-white" style={{ opacity: 0.7 }}> - {text}</span>
                  </div>
                ))}
              </div>
              <div className="tk-card crk-accent-card crk-a-coral p-4" style={{ ...card, textAlign: 'left' }}>
                <div className="crk-pill">Sample app: LegacyShop</div>
                <p className="text-white mb-0" style={{ opacity: 0.85, lineHeight: 1.65 }}>
                  A .NET Framework 4.8 web shop that builds and runs, with 29 migration traps and 9 behavior quirks planted in it and an answer key.
                  <code style={mono}> verify.ps1</code> builds it, starts it and runs 17 smoke checks. Practice here before you touch your own code.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Install ── */}
        <div className="container pt-4">
          <div className="row justify-content-center text-center">
            <div className="col-md-12 mb-4">
              <span className="tk-eyebrow" data-reveal>How to get it</span>
              <h2 className="text-white" data-reveal data-delay="1">Join the community, then one prompt</h2>
            </div>
            <div className="col-xs-12 col-md-10 col-lg-8 mb-3" data-reveal>
              <p className="text-white" style={{ opacity: 0.85, lineHeight: 1.7 }}>
                The Legacy Pack and the Migration Pack are part of the AI for Developers community. Inside you get the install steps for Claude Code and GitHub Copilot (VS Code and Copilot CLI), a lesson for every skill and agent, and the LegacyShop sample app to practice on.
              </p>
              <p className="text-white" style={{ opacity: 0.85 }}>Then, in your solution folder:</p>
              <pre style={codeBlock}>{`Assess MySolution.sln for migration to .NET 10.`}</pre>
            </div>
            <div className="col-xs-12 col-md-10 col-lg-8" data-reveal>
              <a href={AI_COMMUNITY_JOIN_URL} className="tk-btn" style={yellowBtn} target="_blank" rel="noopener noreferrer" data-cta="legacy-dotnet-community-install">Join the community</a>
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="container pt-5">
          <div className="row justify-content-center">
            <div className="col-md-12 mb-4 text-center">
              <span className="tk-eyebrow" data-reveal>Questions</span>
              <h2 className="text-white" data-reveal data-delay="1">Before you start</h2>
            </div>
            <div className="col-xs-12 col-md-11 col-lg-9">
              {faq.map((f) => (
                <div key={f.q} className="tk-card p-4 mb-3" style={card} data-reveal>
                  <h3 className="text-white mb-2" style={{ fontSize: '1.1rem' }}>{f.q}</h3>
                  <p className="text-white mb-0" style={{ opacity: 0.8, lineHeight: 1.65 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Final CTA ── */}
        <div className="container pt-4 pb-5">
          <div className="row justify-content-center" data-reveal>
            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-9">
              <div className="tk-card p-5 text-center" style={{ ...card, background: 'rgba(var(--tcm-amber-rgb), 0.06)', borderColor: 'rgba(var(--tcm-amber-rgb), 0.3)' }}>
                <h2 className="text-white mb-3">Start with the report.</h2>
                <p className="text-white mb-4" style={{ opacity: 0.85 }}>Join the community, run it on your solution, read the numbers, then decide. Questions, or a case the pack missed? Bring it to the group.</p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <a href={AI_COMMUNITY_JOIN_URL} className="tk-btn" style={yellowBtn} target="_blank" rel="noopener noreferrer" data-cta="legacy-dotnet-community-final">Join the community</a>
                  <a href={SAMPLE_REPORT_URL} className="tk-btn" style={outlineBtn} target="_blank" rel="noopener" data-cta="legacy-dotnet-sample-report-3">Open the sample report</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default LegacyDotnet
