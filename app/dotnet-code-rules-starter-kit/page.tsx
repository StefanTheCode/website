import { Metadata } from 'next'
import Link from 'next/link'
import FreeMotion from '../../components/free/FreeMotion'
import TerminalDemo, { DemoTab } from '../../components/free/TerminalDemo'

const PAGE_URL = 'https://thecodeman.net/dotnet-code-rules-starter-kit'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: 'Pragmatic .NET Code Rules Starter Kit',
  description:
    'Production-ready code quality defaults for .NET teams. .editorconfig, Directory.Build.props, CI quality gate, architecture tests, pre-commit hooks, and more.',
  keywords: [
    '.NET code rules',
    '.editorconfig .NET',
    'Directory.Build.props',
    '.NET code style',
    '.NET starter kit',
    'Visual Studio code cleanup',
    'dotnet format',
    'CI quality gate .NET',
    'Pragmatic .NET Code Rules',
    'C# code style',
    'NetArchTest',
    'architecture tests .NET',
    'pre-commit hook dotnet',
    'dependabot .NET',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Pragmatic .NET Code Rules Starter Kit',
    type: 'website',
    url: PAGE_URL,
    description:
      'Production-ready code quality defaults for .NET teams. .editorconfig, Directory.Build.props, CI quality gate, architecture tests, pre-commit hooks, and more.',
    siteName: 'TheCodeMan.net',
  },
  twitter: {
    title: 'Pragmatic .NET Code Rules Starter Kit',
    card: 'summary_large_image',
    site: '@TheCodeMan__',
    creator: '@TheCodeMan__',
    description:
      'Production-ready code quality defaults for .NET teams. .editorconfig, Directory.Build.props, CI quality gate, architecture tests, pre-commit hooks, and more.',
  },
}

const starterKitItems = [
  {
    title: 'Production-ready .editorconfig',
    description:
      'Code style, naming conventions, formatting rules, and diagnostic severities for C# and .NET.',
    isNew: false,
  },
  {
    title: 'Centralized build rules with Directory.Build.props',
    description:
      'Centralized compiler settings, analyzers, and pragmatic warnings-as-errors - applied to every project in the solution.',
    isNew: false,
  },
  {
    title: 'Pinned .NET SDK with global.json',
    description:
      'Pins the .NET SDK version with rollForward for reproducible builds across machines and CI.',
    isNew: false,
  },
  {
    title: 'CI Quality Gate (GitHub Actions)',
    description:
      'Restore → format check → build → test. Runs on every push and PR. SDK version read from global.json.',
    isNew: true,
  },
  {
    title: 'PR Template & Issue Templates',
    description:
      'PR checklist focused on code quality and consistency, plus clean bug report and feature request templates.',
    isNew: true,
  },
  {
    title: 'Dependabot Configuration',
    description:
      'Automated dependency updates - NuGet and GitHub Actions, grouped and low-noise. Max 5 open PRs at a time.',
    isNew: true,
  },
  {
    title: 'Git Pre-Commit Hook',
    description:
      'Runs dotnet format --verify-no-changes before every commit - no more messy diffs.',
    isNew: false,
  },
  {
    title: 'Architecture Tests (NetArchTest)',
    description:
      'Starter architecture tests that enforce interface naming, layer dependency rules, and naming smell detection.',
    isNew: true,
  },
  {
    title: 'Visual Studio Cleanup Checklist',
    description:
      'Step-by-step VS setup for format-on-save and code cleanup.',
    isNew: false,
  },
  {
    title: 'dotnet format Guide',
    description:
      'How to run dotnet format locally, common commands, and pre-commit setup.',
    isNew: true,
  },
]

const beforeAfterItems = [
  {
    before: 'Inconsistent formatting across the codebase',
    after: 'Consistent code style enforced by .editorconfig',
  },
  {
    before: 'Endless pull request comments about styling',
    after: 'Formatting verified automatically in CI',
  },
  {
    before: 'Warnings and rules handled differently by each developer',
    after: 'Nullable warnings treated as errors - the ones that matter',
  },
  {
    before: 'No architectural guardrails in the codebase',
    after: 'Architecture test starters ready to adapt',
  },
  {
    before: 'Messy project setup when starting from scratch',
    after: 'PR hygiene and dependency management out of the box',
  },
]

type Stat = { target: number; suffix?: string; comma?: boolean; label: string }
const stats: Stat[] = [
  { target: 10, label: 'Files & guides' },
  { target: 1635, comma: true, suffix: '+', label: 'Developers' },
  { target: 0, label: 'Config needed' },
  { target: 100, suffix: '%', label: 'Yours to edit' },
]

const trustBadges = ['Secure delivery', 'Instant access', 'No credit card']

// scrolling ribbon of what ships in the kit
const marqueeFiles = [
  '.editorconfig', 'Directory.Build.props', 'global.json', 'ci.yml',
  'dependabot.yml', 'PULL_REQUEST_TEMPLATE.md', 'ArchitectureTests', 'pre-commit',
  'vs-cleanup-checklist.md', 'dotnet-format-guide.md',
]

const steps: [string, string][] = [
  ['Get the kit', 'Drop your email and the full starter kit lands in your inbox - every file and guide, zipped and ready.'],
  ['Drop it into your solution', 'Copy the files into any new or existing .NET repo. No packages to install, no configuration to wire up.'],
  ['Commit with confidence', 'Push once and the CI quality gate, format checks, and architecture tests start guarding your code.'],
]

// File tree of what actually ships in the kit
type TreeLine = { text: string; comment?: string; accent?: boolean }
const fileTree: TreeLine[] = [
  { text: 'dotnet-code-rules/', accent: true },
  { text: '├─ .editorconfig', comment: 'style + naming + severities' },
  { text: '├─ Directory.Build.props', comment: 'analyzers, warnings-as-errors' },
  { text: '├─ global.json', comment: 'pinned SDK' },
  { text: '├─ .github/' },
  { text: '│  ├─ workflows/ci.yml', comment: 'restore → format → build → test' },
  { text: '│  ├─ dependabot.yml' },
  { text: '│  └─ PULL_REQUEST_TEMPLATE.md' },
  { text: '├─ tests/' },
  { text: '│  └─ ArchitectureTests/', comment: 'NetArchTest starters' },
  { text: '├─ hooks/pre-commit', comment: 'dotnet format guard' },
  { text: '└─ docs/' },
  { text: '   ├─ vs-cleanup-checklist.md' },
  { text: '   └─ dotnet-format-guide.md' },
]

const softwareLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Pragmatic .NET Code Rules Starter Kit',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Windows, macOS, Linux',
  description:
    'Production-ready code quality defaults for .NET teams. .editorconfig, Directory.Build.props, CI quality gate, architecture tests, pre-commit hooks, and more.',
  url: PAGE_URL,
  author: { '@type': 'Person', name: 'Stefan Djokic', url: 'https://thecodeman.net' },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', url: PAGE_URL },
}

const demoTabs: DemoTab[] = [
  {
    id: 'format', label: 'dotnet format', command: 'dotnet format --verify-no-changes',
    lines: [
      { text: 'Loading rules from .editorconfig…', tone: 'muted' },
      { text: 'Checking 128 files across 6 projects', tone: 'muted' },
      { text: '✔ Formatting matches .editorconfig', tone: 'green' },
      { text: '0 files need changes · 0.9s', tone: 'green' },
    ],
  },
  {
    id: 'ci', label: 'CI quality gate', command: 'gh workflow run ci.yml',
    lines: [
      { text: '▸ restore   ✓  3.1s', tone: 'plain' },
      { text: '▸ format    ✓  verified against .editorconfig', tone: 'green' },
      { text: '▸ build     ✓  0 warnings (warnings-as-errors on)', tone: 'green' },
      { text: '▸ test      ✓  214 passed', tone: 'green' },
      { text: 'CI passed — safe to merge', tone: 'green' },
    ],
  },
  {
    id: 'hook', label: 'pre-commit hook', command: 'git commit -m "add order endpoint"',
    lines: [
      { text: 'running pre-commit hook…', tone: 'muted' },
      { text: '✖ DateTime.Now found in OrderService.cs:42', tone: 'red' },
      { text: '✖ commit blocked — inject TimeProvider instead', tone: 'red' },
      { text: 'fix the issue, then commit again', tone: 'yellow' },
    ],
  },
  {
    id: 'arch', label: 'architecture tests', command: 'dotnet test ArchitectureTests',
    lines: [
      { text: 'Domain must not depend on Infrastructure   ✓', tone: 'green' },
      { text: "Interfaces must start with 'I'             ✓", tone: 'green' },
      { text: 'Handlers must be sealed                    ✓', tone: 'green' },
      { text: '3 rules enforced · 0 violations', tone: 'green' },
    ],
  },
]

const card = {
  border: '1px solid var(--tk-line)',
  borderRadius: '16px',
  background: 'var(--tk-card-bg)',
} as const

const yellowBtn = {
  display: 'inline-block',
  padding: '14px 34px',
  borderRadius: '999px',
  fontWeight: 800,
  fontSize: '1rem',
  textDecoration: 'none',
  background: '#ffbd39',
  color: '#2a003a',
} as const

const CodeRulesStarterKit = () => {
  return (
    <>
      <FreeMotion />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }} />

      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">

        {/* ── Hero ── */}
        <div className="tk-hero-glow crk-hero-glow">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xs-12 col-sm-12 col-md-11 col-lg-10 heading-section text-center mt-5">
                <span className="tk-eyebrow" data-reveal>Free .NET starter kit</span>

                <div className="d-flex justify-content-center mb-4" data-reveal data-delay="1">
                  <div
                    className="d-inline-flex align-items-center"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '999px',
                      padding: '8px 16px',
                    }}
                  >
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#46d39a', display: 'inline-block', marginRight: '10px' }} />
                    <span className="text-white" style={{ fontSize: '0.92rem' }}>
                      <strong>1,635 developers</strong> downloaded this kit
                    </span>
                  </div>
                </div>

                <h1 className="text-white mb-4" data-reveal data-delay="1">
                  Stop arguing about code style in .NET projects.
                  <br />
                  <span className="text-yellow crk-shimmer">Get the exact starter setup I use.</span>
                </h1>

                <h4 className="text-white mb-4" style={{ fontWeight: 400, lineHeight: 1.6 }} data-reveal data-delay="2">
                  Drop these files into any .NET solution and get consistent code style, CI quality gates,
                  architecture tests, and PR hygiene out of the box.
                </h4>

                {/* Email capture */}
                <div className="row justify-content-center" id="download-kit" data-reveal data-delay="3">
                  <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
                    <div className="tk-card crk-form-card p-4 p-md-5" style={card}>
                      <h5 className="text-white mb-3">Get the kit free, delivered to your inbox</h5>
                      <div
                        id="eomail-form-hero"
                        dangerouslySetInnerHTML={{
                          __html: `<script async src="https://eomail4.com/form/4bf59088-e262-11f0-9f42-355d711e4cd9.js" data-form="4bf59088-e262-11f0-9f42-355d711e4cd9"></script>`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Trust row */}
                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4" data-reveal data-delay="4">
                  {trustBadges.map((b) => (
                    <span key={b} className="text-white d-inline-flex align-items-center" style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                      <span className="text-yellow" style={{ marginRight: '8px' }}>✓</span>{b}
                    </span>
                  ))}
                </div>

                <div className="d-flex justify-content-center mt-4" data-reveal data-delay="4">
                  <span
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '10px',
                      background: 'rgba(70, 211, 154, 0.12)', border: '1px solid rgba(70, 211, 154, 0.35)',
                      color: '#bbf7d0', padding: '10px 16px', borderRadius: '999px',
                      fontWeight: 600, fontSize: '0.9rem',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#46d39a', display: 'inline-block' }} />
                    New in the kit → CI Quality Gate, Architecture Tests, Dependabot &amp; more
                  </span>
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
              <h2 className="text-white">The actual workflow</h2>
              <p className="text-white" style={{ opacity: 0.85 }}>Click a command to watch that part of the kit run.</p>
            </div>
          </div>
          <div className="row justify-content-center" data-reveal>
            <div className="col-xs-12 col-sm-12 col-md-11 col-lg-9">
              <TerminalDemo title="bash · dotnet-code-rules" tabs={demoTabs} />
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
                    <span className="crk-type" data-text="what's in the zip" />
                    <span className="crk-caret" />
                  </span>
                </div>
                <div style={{ padding: '20px 22px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', lineHeight: 1.9, overflowX: 'auto' }}>
                  {fileTree.map((line, i) => (
                    <div key={i} className="crk-tree-line" style={{ whiteSpace: 'pre' }}>
                      <span style={{ color: line.accent ? '#ffbd39' : 'rgba(255,255,255,0.9)', fontWeight: line.accent ? 700 : 400 }}>
                        {line.text}
                      </span>
                      {line.comment && (
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{`  # ${line.comment}`}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Marquee of files ── */}
        <div className="container-fluid px-0 mt-5" data-reveal>
          <div className="tk-marquee">
            <div className="tk-marquee-track">
              {[...marqueeFiles, ...marqueeFiles].map((name, i) => (
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
                  <div
                    className="text-yellow crk-count"
                    style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }}
                    data-target={s.target}
                    data-suffix={s.suffix ?? ''}
                    data-comma={s.comma ? '1' : '0'}
                  >
                    0{s.suffix ?? ''}
                  </div>
                  <div className="text-white mt-2" style={{ opacity: 0.75, fontSize: '0.9rem' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="background-yellow" />

        {/* ── What's inside ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>What&apos;s inside</span>
              <h2 className="text-white" data-reveal data-delay="1">Ten things you can use on day one</h2>
              <p className="text-white" style={{ opacity: 0.85 }} data-reveal data-delay="2">
                Not vague advice. Actual files, setup guidance, and practical defaults you can drop in right away.
              </p>
            </div>

            {starterKitItems.map((item, index) => (
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mb-4" key={index} data-reveal data-delay={String((index % 2) + 1)}>
                <div className={`tk-card crk-accent-card ${['crk-a-yellow', 'crk-a-teal', 'crk-a-purple', 'crk-a-coral'][index % 4]} p-4 h-100`} style={{ ...card, textAlign: 'left', position: 'relative' }}>
                  {item.isNew && (
                    <div
                      style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: 'rgba(70, 211, 154, 0.14)', border: '1px solid rgba(70, 211, 154, 0.35)',
                        color: '#bbf7d0', borderRadius: '999px', padding: '5px 12px',
                        fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em',
                      }}
                    >
                      NEW
                    </div>
                  )}
                  <h5 className="text-white mb-3" style={{ paddingRight: item.isNew ? '70px' : 0 }}>
                    <span className="crk-check">✓</span> {item.title}
                  </h5>
                  <p className="text-white mb-0" style={{ opacity: 0.85 }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="background-yellow" />

        {/* ── Before / After ── */}
        <div className="container">
          <div className="row pt-4">
            <div className="col-md-12 text-center mb-5">
              <span className="tk-eyebrow" data-reveal>Why this matters</span>
              <h2 className="text-white" data-reveal data-delay="1">Most teams don&apos;t lack talent. They lack shared defaults.</h2>
            </div>

            <div className="col-md-6 mb-4" data-reveal>
              <div className="tk-card p-4 p-md-5 h-100" style={card}>
                <h3 className="text-white mb-4" style={{ fontSize: '1.3rem' }}>Before</h3>
                {beforeAfterItems.map((item, index) => (
                  <p key={index} className="text-white mb-3" style={{ opacity: 0.85 }}>
                    <span style={{ color: '#ff6b81', marginRight: '8px' }}>✕</span>{item.before}
                  </p>
                ))}
              </div>
            </div>

            <div className="col-md-6 mb-4" data-reveal data-delay="1">
              <div className="tk-card p-4 p-md-5 h-100" style={{ ...card, borderColor: 'rgba(255,189,57,0.35)' }}>
                <h3 className="text-yellow mb-4" style={{ fontSize: '1.3rem' }}>After</h3>
                {beforeAfterItems.map((item, index) => (
                  <p key={index} className="text-white mb-3" style={{ opacity: 0.92 }}>
                    <span style={{ color: '#46d39a', marginRight: '8px' }}>✓</span>{item.after}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <hr className="background-yellow" />

        {/* ── How you start ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>How you start</span>
              <h2 className="text-white" data-reveal data-delay="1">From email to enforced in three steps</h2>
            </div>
            {steps.map(([title, desc], i) => (
              <div className="col-xs-12 col-sm-12 col-md-4 mb-4" key={title} data-reveal data-delay={String(i + 1)}>
                <div className="tk-card p-4 p-md-5 h-100" style={{ ...card, textAlign: 'left' }}>
                  <div className="tk-step-big">{i + 1}</div>
                  <h3 className="text-white mb-3" style={{ fontSize: '1.2rem' }}>{title}</h3>
                  <p className="text-white mb-0" style={{ opacity: 0.85 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="background-yellow" />

        {/* ── Context cards ── */}
        <div className="container">
          <div className="row pt-4">
            <div className="col-md-6 mb-4" data-reveal>
              <div className="tk-card p-4 p-md-5 h-100" style={{ ...card, textAlign: 'left' }}>
                <h3 className="text-white mb-3" style={{ fontSize: '1.3rem' }}>What is this exactly?</h3>
                <p className="text-white mb-0" style={{ opacity: 0.85 }}>
                  This starter kit is Module 01 material from{' '}
                  <Link href="/pragmatic-dotnet-code-rules" target="_blank" className="text-yellow">
                    Pragmatic .NET Code Rules
                  </Link>
                  . The full course goes deeper into advanced EditorConfig patterns, static code analysis,
                  full architecture test suites, and more.
                </p>
              </div>
            </div>

            <div className="col-md-6 mb-4" data-reveal data-delay="1">
              <div className="tk-card p-4 p-md-5 h-100" style={{ ...card, textAlign: 'left' }}>
                <h3 className="text-white mb-3" style={{ fontSize: '1.3rem' }}>Who is it for?</h3>
                <p className="text-white mb-0" style={{ opacity: 0.85 }}>
                  .NET developers who want cleaner project defaults, fewer style-related review comments,
                  and a more predictable setup for new or existing codebases.
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
                <h2 className="text-white mb-3">Stop reviewing style. Start shipping.</h2>
                <p className="text-white mb-4" style={{ opacity: 0.85 }}>
                  Every file and guide above, free, in your inbox, ready in two minutes.
                </p>
                <a href="#download-kit" className="tk-btn" style={yellowBtn} data-cta="download-kit">
                  Download the Starter Kit
                </a>
                <p className="text-white mt-3 mb-0" style={{ opacity: 0.6, fontSize: '0.85rem' }}>
                  No credit card · unsubscribe anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default CodeRulesStarterKit
