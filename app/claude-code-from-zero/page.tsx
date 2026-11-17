import { Metadata } from 'next'
import FreeMotion from '../../components/free/FreeMotion'
import { eoFormScript } from '../../components/thirdParty'

// EmailOctopus form "claude-code-from-zero" (tag: claude-code-from-zero).
// The automation "Claude Code from Zero" sends the playbook PDF + lesson 1 right away (public/downloads/claude-code-from-zero-playbook.pdf), then a short email every 2 days (which lesson to do next + one new tip).
const CCFZ_FORM_ID = 'd548b3d6-e2db-11f1-a85a-67d107d23a2d'

const PAGE_URL = 'https://thecodeman.net/claude-code-from-zero'
const IMAGE = '/images/claude-code-from-zero.jpg'
const TITLE = 'Claude Code from Zero - Free Playbook for Developers'
const DESCRIPTION =
  'Free Claude Code playbook for beginners: the whole course as one PDF, plus a short tip by email every second day. Install, your first safe session, CLAUDE.md, plan mode, permissions and undo - on your own project.'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'Claude Code course',
    'Claude Code for beginners',
    'Claude Code tutorial',
    'learn Claude Code',
    'CLAUDE.md',
    'Claude Code plan mode',
    'AI coding agent',
    'free Claude Code course',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    type: 'website',
    url: PAGE_URL,
    description: DESCRIPTION,
    siteName: 'TheCodeMan.net',
    images: [{ url: IMAGE, width: 1460, height: 752, alt: 'Claude Code from Zero - free playbook' }],
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

const lessons = [
  { n: '01', day: 'Day 0', title: 'What Claude Code actually is', description: 'Agent vs chat vs autocomplete, what it is great at, where it goes wrong, and what it really costs.', tags: ['agent loop', 'context', 'Pro plan'] },
  { n: '02', day: 'Day 2', title: 'Install it the right way', description: 'VS Code extension first, terminal second - and the setting that keeps you from paying per request.', tags: ['VS Code', 'claude doctor', '/status'] },
  { n: '03', day: 'Day 4', title: 'Your first safe session', description: 'Save point, questions first, one small change, review, test, commit. Then you practice undo on purpose.', tags: ['git', 'review', 'small steps'] },
  { n: '04', day: 'Day 6', title: 'Make it remember your project', description: 'One file that ends "it ignored our conventions" - and how to write rules it actually follows.', tags: ['/init', 'CLAUDE.md', 'AGENTS.md'] },
  { n: '05', day: 'Day 8', title: 'Plan mode', description: 'Make Claude think before it touches a file. A bad plan costs one read, a bad implementation costs a revert.', tags: ['Shift+Tab', '/plan', 'review'] },
  { n: '06', day: 'Day 10', title: 'Permissions and undo', description: 'Allow the boring commands, block your secrets, and know exactly what rewind can and cannot bring back.', tags: ['settings.json', 'deny rules', 'Esc Esc'] },
  { n: '07', day: 'Day 12', title: 'Keep every session sharp', description: 'Why Claude "gets dumber" after an hour, the three commands that fix it, and the 10 beginner mistakes.', tags: ['/context', '/compact', '/clear'] },
  { n: '08', day: 'Day 14', title: "What's next", description: 'The loop you now own, and what separates beginners from developers who ship real work with AI.', tags: ['hooks', 'skills', 'subagents'] },
]

const forWho = [
  ['You can code, but never really used an AI agent', 'Any language, any stack. Examples use C#, TypeScript and Python side by side.'],
  ['You tried it once and got a wall of code you did not ask for', 'This is the safe way in: you see and approve every change, and every mistake is undoable.'],
  ['You want habits, not hype', 'Every lesson is something you do on your own project in 10-30 minutes.'],
]

const card = { border: '1px solid var(--tk-line)', borderRadius: '16px', background: 'var(--tk-card-bg)' } as const
const yellowBtn = { display: 'inline-block', padding: '14px 34px', borderRadius: '999px', fontWeight: 800, fontSize: '1rem', textDecoration: 'none', background: 'var(--tcm-amber)', color: 'var(--tcm-amber-ink)' } as const
const tagStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.76rem', color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" } as const

const FORM = eoFormScript(CCFZ_FORM_ID)

const ClaudeCodeFromZero = () => {
  return (
    <>
      <FreeMotion />
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">

        {/* ── Hero ── */}
        <div className="tk-hero-glow crk-hero-glow">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xs-12 col-sm-12 col-md-11 col-lg-9 heading-section text-center mt-5">
                <span className="tk-eyebrow" data-reveal>Free playbook</span>

                <div className="d-flex justify-content-center mb-4" data-reveal data-delay="1">
                  <div className="d-inline-flex align-items-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '8px 16px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#46d39a', display: 'inline-block', marginRight: '10px' }} />
                    <span className="text-white" style={{ fontSize: '0.92rem' }}><strong>The whole course</strong> · one PDF, 8 lessons</span>
                  </div>
                </div>

                <h1 className="text-white mb-4" data-reveal data-delay="1">
                  <span className="text-yellow crk-shimmer">Claude Code</span> from Zero
                </h1>

                <h4 className="text-white mb-4" style={{ fontWeight: 400, lineHeight: 1.6 }} data-reveal data-delay="2">
                  The whole course in one free playbook: from installing Claude Code to plan mode, permissions and undo - on your own project.
                </h4>

                <p className="text-white mb-4" style={{ opacity: 0.85, lineHeight: 1.7 }} data-reveal data-delay="2">
                  Most developers try Claude Code once, get a pile of code they didn&apos;t ask for, and go back to the chat window.
                  This course is the safe way in: you see every change, you understand every change, and every mistake is undoable.
                </p>

                <div className="row justify-content-center" id="get-the-course" data-reveal data-delay="3">
                  <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
                    <div className="tk-card crk-form-card p-4 p-md-5" style={card}>
                      <h5 className="text-white mb-3">Get the <span className="text-yellow">free playbook</span></h5>
                      <div dangerouslySetInnerHTML={{ __html: FORM }} />
                      <p className="text-white mt-3 mb-0" style={{ opacity: 0.6, fontSize: '0.85rem' }}>
                        Free. The full playbook (PDF) lands in your inbox right away, then a short email every second day with the next lesson and one new tip, plus my weekly newsletter on practical AI for developers. Unsubscribe anytime.
                        Already on the newsletter? Enter the same email - you&apos;ll still get the playbook.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4" data-reveal data-delay="4">
                  {['Install', 'First safe session', 'CLAUDE.md', 'Plan mode', 'Undo'].map((b) => (
                    <span key={b} className="text-white d-inline-flex align-items-center" style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                      <span className="text-yellow" style={{ marginRight: '8px' }}>✓</span>{b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── Lessons ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>Inside the playbook</span>
              <h2 className="text-white" data-reveal data-delay="1">8 lessons, one habit at a time</h2>
            </div>
            {lessons.map((l, index) => (
              <div className="col-xs-12 col-sm-12 col-md-6 mb-4" key={l.n} data-reveal data-delay={String((index % 2) + 1)}>
                <div className={`tk-card crk-accent-card ${['crk-a-yellow', 'crk-a-teal', 'crk-a-purple', 'crk-a-coral'][index % 4]} p-4 h-100`} style={{ ...card, textAlign: 'left' }}>
                  <div className="crk-pill">{l.n} · {l.day}</div>
                  <h5 className="text-white mb-2">{l.title}</h5>
                  <p className="text-white mb-4" style={{ fontSize: '0.95rem', opacity: 0.85 }}>{l.description}</p>
                  <div className="d-flex flex-wrap gap-2">
                    {l.tags.map((tag) => (
                      <span key={tag} style={tagStyle}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Who it's for ── */}
        <div className="container pt-2">
          <div className="row text-center">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>Who it&apos;s for</span>
              <h2 className="text-white" data-reveal data-delay="1">Developers starting with AI agents</h2>
            </div>
            {forWho.map(([t, d], index) => (
              <div className="col-xs-12 col-sm-12 col-md-4 mb-4" key={t} data-reveal data-delay={String(index + 1)}>
                <div className="tk-card p-4 h-100" style={{ ...card, textAlign: 'left' }}>
                  <h5 className="text-white mb-2" style={{ fontSize: '1.05rem' }}>{t}</h5>
                  <p className="text-white mb-0" style={{ fontSize: '0.92rem', opacity: 0.8 }}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Final CTA ── */}
        <div className="container pt-2 pb-5">
          <div className="row justify-content-center" data-reveal>
            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-9">
              <div className="tk-card p-5 text-center" style={{ ...card, background: 'rgba(var(--tcm-amber-rgb), 0.06)', borderColor: 'rgba(var(--tcm-amber-rgb), 0.3)' }}>
                <h2 className="text-white mb-3">Stop pasting snippets from a chat window.</h2>
                <p className="text-white mb-4" style={{ opacity: 0.85 }}>The whole playbook, free - straight to your inbox.</p>
                <a href="#get-the-course" className="tk-btn" style={yellowBtn}>Get the free playbook</a>
                <p className="text-white mt-3 mb-0" style={{ opacity: 0.6, fontSize: '0.85rem' }}>Free · unsubscribe anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ClaudeCodeFromZero
