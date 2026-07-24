import { Metadata } from 'next'
import ogImage from '../pass-your-interview.webp'
import FreeMotion from '../../components/free/FreeMotion'

const PAGE_URL = 'https://thecodeman.net/pass-your-interview'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Pass Your .NET Interview - 250 Questions with Answers & Code',
    description:
      'Free .NET 10 interview preparation kit: 250 questions covering Arrays, Lists, Trees, and General .NET/C#/SQL - with clean C# implementations and full complexity analysis.',
    images: [{ url: '../pass-your-interview.webp', width: ogImage.width, height: ogImage.height }],
    type: 'website',
    url: PAGE_URL,
  },
  title: 'Pass Your .NET Interview - 250 Questions with Answers & Code',
  description:
    'Free .NET 10 interview preparation kit: 250 questions covering Arrays, Lists, Trees, and General .NET/C#/SQL - with clean C# implementations and full complexity analysis.',
  twitter: {
    title: 'Pass Your .NET Interview - 250 Questions with Answers & Code',
    card: 'summary_large_image',
    site: '@TheCodeMan__',
    creator: '@TheCodeMan__',
    description:
      'Free .NET 10 interview preparation kit: 250 questions covering Arrays, Lists, Trees, and General .NET/C#/SQL - with clean C# implementations and full complexity analysis.',
    images: [{ url: '/images/pass-your-interview.webp', width: ogImage.width, height: ogImage.height }],
  },
}

const questionCategories = [
  { icon: '📦', title: 'Arrays - 20 Questions', description: "Reversal, rotation, searching, frequency counting, duplicates, subarray problems (Kadane's, max product), binary search, sorting, and shuffling.", highlights: ['2–3 solutions per problem', 'Brute force → optimal', 'Big-O analysis included'], isNew: false },
  { icon: '📋', title: 'Lists - 20 Questions', description: 'Duplicates, sorting, reversing, merging, splitting, flattening, searching, frequency counting, contiguous sums, and equality comparison.', highlights: ['List<T> focused', 'LINQ integration', 'Real-world patterns'], isNew: true },
  { icon: '🌳', title: 'Trees - 20 Questions', description: 'DFS & BFS traversals, depth/balance/symmetry checks, BST operations (insert, search, validate), path sums, diameter, LCA, and serialize/deserialize.', highlights: ['Recursive thinking', 'Divide & conquer', 'TreeNode model included'], isNew: true },
  { icon: '💡', title: 'General .NET / C# / SQL - 70 Questions', description: 'Language fundamentals, async/await, SOLID, DI, middleware, EF, MVC, Blazor, SignalR, unit testing, CI/CD, JOINs, indexes, normalization, and more.', highlights: ['Basic → Advanced', 'Code examples', 'SQL section included'], isNew: false },
]

type Stat = { target?: number; suffix?: string; raw?: string; label: string }
const statItems: Stat[] = [
  { target: 250, label: 'Interview Questions' },
  { target: 4, label: 'Topic Categories' },
  { raw: '2–3', label: 'Solutions Per Problem' },
  { raw: '.NET 10', label: 'Framework' },
]

const highPriorityQuestions = [
  'Reverse & Rotate arrays', 'Remove Duplicates', "Max Subarray Sum (Kadane's)", 'DFS / BFS Traversals',
  'Validate BST', 'async/await & SOLID principles', 'Value vs Reference types', 'Dependency Injection',
  'SQL JOINs & Indexes', 'Unit Testing & Mocking',
]

const bonusItems = [
  { title: 'Design Patterns Interview Questions Ebook', bullets: ['100+ questions with answers (20 pages)', 'Code-based questions', 'Dark and Light mode PDF'] },
  { title: "The Job-Seeking .NET Developer's LinkedIn Handbook", bullets: ['Short ebook with ready-to-start actions', 'Real examples, checklists & tools', 'Casual, recruiter-friendly language'] },
]

const card = { border: '1px solid var(--tk-line)', borderRadius: '16px', background: 'var(--tk-card-bg)' } as const
const yellowBtn = { display: 'inline-block', padding: '14px 34px', borderRadius: '999px', fontWeight: 800, fontSize: '1rem', textDecoration: 'none', background: '#ffbd39', color: '#2a003a' } as const

const PassYourInterview = () => {
  return (
    <>
      <FreeMotion />
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">

        {/* ── Hero ── */}
        <div className="tk-hero-glow crk-hero-glow">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xs-12 col-sm-12 col-md-11 col-lg-10 heading-section text-center mt-5">
                <span className="tk-eyebrow" data-reveal>Free .NET interview kit</span>

                <div className="d-flex justify-content-center mb-4" data-reveal data-delay="1">
                  <div className="d-inline-flex align-items-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '8px 16px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#46d39a', display: 'inline-block', marginRight: '10px' }} />
                    <span className="text-white" style={{ fontSize: '0.92rem' }}><strong>800+ GitHub stars</strong> - trusted by the .NET community</span>
                  </div>
                </div>

                <h1 className="text-white mb-4" data-reveal data-delay="1">
                  Pass your <span className="text-yellow crk-shimmer">.NET interview.</span>
                </h1>

                <h4 className="text-white mb-4" style={{ fontWeight: 400, lineHeight: 1.6 }} data-reveal data-delay="2">
                  250 questions with answers, clean C# code, and full complexity analysis -{' '}
                  <span className="text-yellow">completely free.</span>
                </h4>

                <div className="d-flex justify-content-center mb-4" data-reveal data-delay="2">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(70, 211, 154, 0.12)', border: '1px solid rgba(70, 211, 154, 0.35)', color: '#bbf7d0', padding: '10px 16px', borderRadius: '999px', fontWeight: 600, fontSize: '0.9rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#46d39a', display: 'inline-block' }} />
                    Updated to .NET 10 - now with Lists &amp; Trees sections
                  </span>
                </div>

                {/* Stats */}
                <div className="row justify-content-center mb-4">
                  {statItems.map((s, i) => (
                    <div className="col-6 col-md-3 mb-3" key={s.label} data-reveal data-delay={String((i % 4) + 1)}>
                      <div className="tk-card p-3 text-center h-100" style={card}>
                        {s.raw ? (
                          <div className="text-yellow" style={{ fontSize: '1.9rem', fontWeight: 900, lineHeight: 1.1 }}>{s.raw}</div>
                        ) : (
                          <div className="text-yellow crk-count" style={{ fontSize: '2.1rem', fontWeight: 900, lineHeight: 1.1 }} data-target={s.target} data-suffix={s.suffix ?? ''} data-comma="0">0{s.suffix ?? ''}</div>
                        )}
                        <p className="text-white mb-0 mt-1" style={{ fontSize: '0.85rem', opacity: 0.75 }}>{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form */}
                <div className="row justify-content-center" id="download-kit" data-reveal data-delay="3">
                  <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
                    <div className="tk-card crk-form-card p-4 p-md-5" style={card}>
                      <h5 className="text-white mb-3">Get the free interview kit</h5>
                      <div dangerouslySetInnerHTML={{ __html: `<script async src="https://eomail4.com/form/ab931ff0-e1c4-11ef-907b-c3a9263edd62.js" data-form="ab931ff0-e1c4-11ef-907b-c3a9263edd62"></script>` }} />
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4" data-reveal data-delay="4">
                  {['Arrays, Lists & Trees', 'General .NET / C# / SQL', 'Junior → Mid-Senior'].map((b) => (
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

        {/* ── Question categories ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>What&apos;s inside</span>
              <h2 className="text-white" data-reveal data-delay="1">250 questions across 4 categories</h2>
              <p className="text-white" style={{ opacity: 0.85 }} data-reveal data-delay="2">
                Every coding question includes 2–3 solutions, time &amp; space complexity, edge-case discussion, and clean C# code ready to run.
              </p>
            </div>
            {questionCategories.map((cat, index) => (
              <div className="col-xs-12 col-sm-12 col-md-6 mb-4" key={index} data-reveal data-delay={String((index % 2) + 1)}>
                <div className={`tk-card crk-accent-card ${['crk-a-yellow', 'crk-a-teal', 'crk-a-purple', 'crk-a-coral'][index % 4]} p-4 h-100`} style={{ ...card, textAlign: 'left', position: 'relative' }}>
                  {cat.isNew && (
                    <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(70, 211, 154, 0.14)', border: '1px solid rgba(70, 211, 154, 0.35)', color: '#bbf7d0', borderRadius: '999px', padding: '5px 12px', fontSize: '0.72rem', fontWeight: 700 }}>NEW</div>
                  )}
                  <h4 className="text-white mb-2" style={{ paddingRight: cat.isNew ? '70px' : 0, fontSize: '1.15rem' }}>
                    <span style={{ marginRight: '8px' }}>{cat.icon}</span>{cat.title}
                  </h4>
                  <p className="text-white mb-3" style={{ opacity: 0.85 }}>{cat.description}</p>
                  {cat.highlights.map((h, hi) => (
                    <span key={hi} className="text-white" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--tk-line)', borderRadius: '999px', padding: '4px 12px', fontSize: '0.82rem', marginRight: '8px', marginBottom: '6px' }}>{h}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── High-priority questions ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-4">
              <span className="tk-eyebrow" data-reveal>Short on time?</span>
              <h2 className="text-white" data-reveal data-delay="1">Top questions interviewers actually ask</h2>
              <p className="text-white" style={{ opacity: 0.85 }} data-reveal data-delay="2">Based on real interviews - focus on these first.</p>
            </div>
          </div>
          <div className="row justify-content-center" data-reveal>
            <div className="col-md-11 col-lg-10">
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {highPriorityQuestions.map((q) => (
                  <span key={q} className="text-white" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--tk-line)', borderRadius: '999px', padding: '8px 16px', fontSize: '0.9rem' }}>
                    <span className="text-yellow" style={{ marginRight: '8px' }}>›</span>{q}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── Bonus ── */}
        <div className="container">
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-5">
              <span className="tk-eyebrow" data-reveal>Bonus</span>
              <h2 className="text-white" data-reveal data-delay="1">You also get these</h2>
            </div>
            {bonusItems.map((item, index) => (
              <div className="col-xs-12 col-sm-12 col-md-6 mb-4" key={index} data-reveal data-delay={String(index + 1)}>
                <div className={`tk-card crk-accent-card ${['crk-a-teal', 'crk-a-coral'][index % 2]} p-4 p-md-5 h-100`} style={{ ...card, textAlign: 'left' }}>
                  <h4 className="text-white mb-3" style={{ fontSize: '1.15rem' }}><span style={{ marginRight: '8px' }}>🎁</span>{item.title}</h4>
                  {item.bullets.map((b, bi) => (
                    <p className="text-white mb-2" key={bi} style={{ opacity: 0.85 }}><span className="text-yellow" style={{ marginRight: '8px' }}>•</span>{b}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="crk-divider" />

        {/* ── Who is this for ── */}
        <div className="container">
          <div className="row justify-content-center pt-4">
            <div className="col-md-11 col-lg-10 mb-4" data-reveal>
              <div className="tk-card p-4 p-md-5" style={{ ...card, textAlign: 'left' }}>
                <h3 className="text-white mb-3" style={{ fontSize: '1.3rem' }}>Who is this for?</h3>
                {['Junior to mid-senior .NET developers preparing for interviews', 'Developers brushing up on data structures & algorithms in C#', 'Anyone who wants structured, practical interview prep - not just theory'].map((w) => (
                  <p key={w} className="text-white mb-2" style={{ opacity: 0.88 }}><span style={{ color: '#46d39a', marginRight: '10px' }}>✓</span>{w}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Final CTA ── */}
        <div className="container pt-2 pb-5">
          <div className="row justify-content-center" data-reveal>
            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-9">
              <div className="tk-card p-5 text-center" style={{ ...card, background: 'rgba(255,189,57,0.06)', borderColor: 'rgba(255,189,57,0.3)' }}>
                <h2 className="text-white mb-3">Walk in prepared. Walk out hired.</h2>
                <p className="text-white mb-4" style={{ opacity: 0.85 }}>250 questions, answers, and clean C# code - free, in your inbox.</p>
                <a href="#download-kit" className="tk-btn" style={yellowBtn}>Get the free interview kit</a>
                <p className="text-white mt-3 mb-0" style={{ opacity: 0.6, fontSize: '0.85rem' }}>No credit card · unsubscribe anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PassYourInterview
