import { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'

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
    canonical: 'https://thecodeman.net/dotnet-code-rules-starter-kit',
  },
  openGraph: {
    title: 'Pragmatic .NET Code Rules Starter Kit',
    type: 'website',
    url: 'https://thecodeman.net/dotnet-code-rules-starter-kit',
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

const CodeRulesStarterKit = () => {
  return (
    <>
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 heading-section text-center">
              <div className="d-flex justify-content-center align-items-center flex-wrap gap-3 mb-4">
                <div
                  className="d-inline-flex align-items-center"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '999px',
                    padding: '8px 16px',
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      display: 'inline-block',
                      marginRight: '10px',
                    }}
                  />
                  <span className="text-white">
                    <strong>1,635 developers</strong> downloaded this kit
                  </span>
                </div>
              </div>

              <h1 className="text-white mb-4">
                Stop arguing about code style in .NET projects.
                <br />
                <span className="text-yellow">
                  Get the exact starter setup I use.
                </span>
              </h1>

              <h3 className="text-white mb-4">
                Drop these files into any .NET solution and get consistent code style,
                CI quality gates, architecture tests, and PR hygiene out of the box.
              </h3>

              <div className="d-flex justify-content-center mb-4">
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    color: '#bbf7d0',
                    padding: '10px 16px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  <span>🟢</span>
                  <span>New in the Kit → CI Quality Gate, Architecture Tests, Dependabot & more</span>
                </div>
              </div>

              <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
                <div className="text-white">✅ No theory </div>
                <div className="text-white"> ✅ No bloated frameworks </div>
                <div className="text-white"> ✅ Defaults that work on day one</div>
              </div>

              <div className="row justify-content-center" id="download-kit">
                <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
                  <div
                    className="p-4 p-md-5"     
                  >
                    <h4 className="text-white mb-3">
                      Download the Starter Kit
                    </h4>
                    <div id="eomail-form-hero" dangerouslySetInnerHTML={{
                        __html: `<script async src="https://eomail4.com/form/4bf59088-e262-11f0-9f42-355d711e4cd9.js" data-form="4bf59088-e262-11f0-9f42-355d711e4cd9"></script>`
                      }} />

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="background-yellow" />

        <div className="container">
          <div className="row text-center pt-5">
            <div className="col-md-12 mb-5">
              <h2 className="text-white">What’s inside the kit</h2>
              <p className="text-white">
                Not vague advice. Actual files, setup guidance, and practical
                defaults you can use right away.
              </p>
            </div>

            {starterKitItems.map((item, index) => (
              <div
                className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mb-4"
                key={index}
              >
                <div
                  className="p-4 h-100"
                  style={{
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    textAlign: 'left',
                    position: 'relative',
                  }}
                >
                  {item.isNew && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(34, 197, 94, 0.14)',
                        border: '1px solid rgba(34, 197, 94, 0.35)',
                        color: '#bbf7d0',
                        borderRadius: '999px',
                        padding: '5px 12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      NEW
                    </div>
                  )}

                  <h5
                    className="text-white mb-3"
                    style={{ paddingRight: item.isNew ? '70px' : 0 }}
                  >
                    <span className="text-yellow">✓</span> {item.title}
                  </h5>
                  <p className="text-white mb-0">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="row pt-4 pb-3">
            <div className="col-md-12 text-center mb-4">
              <h2 className="text-white">Why this matters</h2>
              <p className="text-white">
                Most teams do not struggle because they lack talent. They
                struggle because they lack shared defaults.
              </p>
            </div>

            <div className="col-md-6 mb-4">
              <div
                className="p-4 h-100"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <h3 className="text-white mb-4">Before</h3>

                {beforeAfterItems.map((item, index) => (
                  <div key={index} className="mb-3">
                    <p className="text-white mb-0">❌ {item.before}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div
                className="p-4 h-100"
                style={{
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <h3 className="text-white mb-4">After</h3>

                {beforeAfterItems.map((item, index) => (
                  <div key={index} className="mb-3">
                    <p className="text-white mb-0">✅ {item.after}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="row pt-4 pb-5">
            <div className="col-md-6 mb-4">
              <div
                className="p-4 h-100"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  textAlign: 'left',
                }}
              >
                <h3 className="text-white mb-3">What is this exactly?</h3>
                <p className="text-white mb-0">
                  This starter kit is Module 01 material from{' '}
                  <Link
                    href="/pragmatic-dotnet-code-rules"
                    target="_blank"
                    className="text-yellow"
                  >
                    Pragmatic .NET Code Rules
                  </Link>
                  . The full course goes deeper into advanced EditorConfig patterns,
                  static code analysis, full architecture test suites, and more.
                </p>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div
                className="p-4 h-100"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  textAlign: 'left',
                }}
              >
                <h3 className="text-white mb-3">Who is it for?</h3>
                <p className="text-white mb-0">
                  .NET developers who want cleaner project defaults, fewer
                  style-related review comments, and a more predictable setup
                  for new or existing codebases.
                </p>
              </div>
            </div>
          </div>

          <div className="row pt-2 pb-5">
            <div className="col-md-12 text-center">
              <a
                href="#download-kit"
                className="btn btn-primary py-3 px-5"
                style={{
                  borderRadius: '12px',
                  fontWeight: 700,
                }}
              >
                Download the Starter Kit
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default CodeRulesStarterKit