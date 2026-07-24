import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import FreeMotion from '../../components/free/FreeMotion'

const PAGE_URL = 'https://thecodeman.net/builder-pattern-free-stuff'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: 'Builder Pattern Free Stuff',
  description:
    "TheCodeMan's FREE Builder Pattern Chapter from Design Patterns that Deliver ebook.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Builder Pattern Free Stuff',
    type: 'website',
    url: PAGE_URL,
    description:
      "TheCodeMan's FREE Builder Pattern Chapter from Design Patterns that Deliver ebook.",
  },
  twitter: {
    title: 'Builder Pattern Free Stuff',
    card: 'summary_large_image',
    site: '@TheCodeMan__',
    creator: '@TheCodeMan__',
    description:
      "TheCodeMan's FREE Builder Pattern Chapter from Design Patterns that Deliver ebook.",
  },
}

const card = {
  border: '1px solid var(--tk-line)',
  borderRadius: '16px',
  background: 'var(--tk-card-bg)',
} as const

const yellowBtn = {
  display: 'inline-block', padding: '14px 34px', borderRadius: '999px',
  fontWeight: 800, fontSize: '1rem', textDecoration: 'none',
  background: '#ffbd39', color: '#2a003a',
} as const

const stats: { target: number; suffix?: string; comma?: boolean; label: string }[] = [
  { target: 600, suffix: '+', label: 'Engineers trust it' },
  { target: 1, label: 'Full chapter free' },
  { target: 100, suffix: '%', label: 'Ready-to-run code' },
]

const insideItems = [
  { title: 'The full Builder Pattern chapter', desc: 'The complete chapter from Design Patterns that Deliver - not a teaser, the real thing.' },
  { title: 'A clear, practical example', desc: 'One simple, real-world example that shows exactly when and why to reach for the Builder Pattern.' },
  { title: 'Ready-to-use GitHub code', desc: 'Working C# code you can clone, run, and drop straight into your own projects.' },
]

const CodeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
)

const BuilderPatternFreeStuff = () => {
  return (
    <>
      <FreeMotion />
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">

        {/* ── Hero ── */}
        <div className="tk-hero-glow crk-hero-glow">
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-xs-12 col-sm-12 col-md-11 col-lg-7 heading-section text-center text-lg-left mt-5">
                <span className="tk-eyebrow" data-reveal>Free ebook chapter</span>

                <div className="d-flex justify-content-center justify-content-lg-start mb-4" data-reveal data-delay="1">
                  <div className="d-inline-flex align-items-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '8px 16px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#46d39a', display: 'inline-block', marginRight: '10px' }} />
                    <span className="text-white" style={{ fontSize: '0.92rem' }}><strong>600+ engineers</strong> already grabbed it</span>
                  </div>
                </div>

                <h1 className="text-white mb-4" data-reveal data-delay="1">
                  The Builder Pattern, done right.
                  <br />
                  <span className="text-yellow crk-shimmer">Get the full chapter free.</span>
                </h1>

                <h4 className="text-white mb-4" style={{ fontWeight: 400, lineHeight: 1.6 }} data-reveal data-delay="2">
                  A complete chapter from <span className="text-yellow">Design Patterns that Deliver</span> - one clear example,
                  real C# code on GitHub, and no fluff.
                </h4>

                <div id="download-chapter" data-reveal data-delay="3">
                  <div className="tk-card crk-form-card p-4 p-md-5" style={card}>
                    <h5 className="text-white mb-3">Get the free chapter in your inbox</h5>
                    <div dangerouslySetInnerHTML={{ __html: `<script async src="https://eomail4.com/form/7ff08dac-bd74-11ef-b66e-1fbfad4a9056.js" data-form="7ff08dac-bd74-11ef-b66e-1fbfad4a9056"></script>` }} />
                  </div>
                </div>

                <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mt-4" data-reveal data-delay="4">
                  {['Free chapter', 'GitHub code', 'No credit card'].map((b) => (
                    <span key={b} className="text-white d-inline-flex align-items-center" style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                      <span className="text-yellow" style={{ marginRight: '8px' }}>✓</span>{b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="col-xs-12 col-sm-12 col-md-8 col-lg-5 text-center mt-5" data-reveal data-delay="2">
                <div className="tk-card p-3" style={{ ...card, display: 'inline-block' }}>
                  <Image src={'/images/builder-pattern-free.webp'} priority alt={'Design Patterns that Deliver - Builder Pattern chapter cover'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="container mt-5" data-reveal>
          <div className="row justify-content-center text-center">
            {stats.map((s, i) => (
              <div className="col-6 col-md-3 mb-4" key={s.label} data-reveal data-delay={String((i % 4) + 1)}>
                <div className="tk-card p-4 h-100" style={card}>
                  <div className="text-yellow crk-count" style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }} data-target={s.target} data-suffix={s.suffix ?? ''} data-comma={s.comma ? '1' : '0'}>
                    0{s.suffix ?? ''}
                  </div>
                  <div className="text-white mt-2" style={{ opacity: 0.75, fontSize: '0.9rem' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── What's inside ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>What you get</span>
              <h2 className="text-white" data-reveal data-delay="1">A real chapter, not a sample page</h2>
            </div>
            {insideItems.map((item, i) => (
              <div className="col-xs-12 col-sm-12 col-md-4 mb-4" key={item.title} data-reveal data-delay={String(i + 1)}>
                <div className={`tk-card crk-accent-card ${['crk-a-yellow', 'crk-a-teal', 'crk-a-purple'][i % 3]} p-4 p-md-5 h-100`} style={{ ...card, textAlign: 'left' }}>
                  <div className="crk-ico"><CodeIcon /></div>
                  <h5 className="text-white mb-3">{item.title}</h5>
                  <p className="text-white mb-0" style={{ opacity: 0.85 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Final CTA ── */}
        <div className="container pt-4 pb-5">
          <div className="row justify-content-center" data-reveal>
            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-9">
              <div className="tk-card p-5 text-center" style={{ ...card, background: 'rgba(255,189,57,0.06)', borderColor: 'rgba(255,189,57,0.3)' }}>
                <h2 className="text-white mb-3">Master one pattern today.</h2>
                <p className="text-white mb-4" style={{ opacity: 0.85 }}>
                  Grab the free Builder Pattern chapter, or explore the full{' '}
                  <Link href="/design-patterns-that-deliver-ebook" className="text-yellow">Design Patterns that Deliver</Link> ebook.
                </p>
                <a href="#download-chapter" className="tk-btn" style={yellowBtn}>Get the free chapter</a>
                <p className="text-white mt-3 mb-0" style={{ opacity: 0.6, fontSize: '0.85rem' }}>No credit card · unsubscribe anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default BuilderPatternFreeStuff
