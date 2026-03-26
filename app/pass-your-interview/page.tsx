import { Metadata } from 'next';
import ogImage from '../pass-your-interview.png'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net/pass-your-interview'),
  alternates: {
    canonical: 'https://thecodeman.net/pass-your-interview',
  },
  openGraph: {
    title: "Pass Your .NET Interview - 250 Questions with Answers & Code",
    description: "Free .NET 10 interview preparation kit: 250 questions covering Arrays, Lists, Trees, and General .NET/C#/SQL - with clean C# implementations and full complexity analysis.",
    images: [
      {
        url: '../pass-your-interview.png',
        width: ogImage.width,
        height: ogImage.height
      }
    ],
    type: "website",
    url: "https://thecodeman.net/pass-your-interview"
  },
  title: "Pass Your .NET Interview - 250 Questions with Answers & Code",
  description: "Free .NET 10 interview preparation kit: 250 questions covering Arrays, Lists, Trees, and General .NET/C#/SQL - with clean C# implementations and full complexity analysis.",
  twitter: {
    title: "Pass Your .NET Interview - 250 Questions with Answers & Code",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "Free .NET 10 interview preparation kit: 250 questions covering Arrays, Lists, Trees, and General .NET/C#/SQL - with clean C# implementations and full complexity analysis.",
    images: [
      {
        url: '/images/pass-your-interview.png',
        width: ogImage.width,
        height: ogImage.height
      }
    ]
  }
}

const questionCategories = [
  {
    icon: '📦',
    title: 'Arrays - 20 Questions',
    description:
      'Reversal, rotation, searching, frequency counting, duplicates, subarray problems (Kadane\'s, max product), binary search, sorting, and shuffling.',
    highlights: ['2–3 solutions per problem', 'Brute force → optimal', 'Big-O analysis included'],
    isNew: false,
  },
  {
    icon: '📋',
    title: 'Lists - 20 Questions',
    description:
      'Duplicates, sorting, reversing, merging, splitting, flattening, searching, frequency counting, contiguous sums, and equality comparison.',
    highlights: ['List<T> focused', 'LINQ integration', 'Real-world patterns'],
    isNew: true,
  },
  {
    icon: '🌳',
    title: 'Trees - 20 Questions',
    description:
      'DFS & BFS traversals, depth/balance/symmetry checks, BST operations (insert, search, validate), path sums, diameter, LCA, and serialize/deserialize.',
    highlights: ['Recursive thinking', 'Divide & conquer', 'TreeNode model included'],
    isNew: true,
  },
  {
    icon: '💡',
    title: 'General .NET / C# / SQL - 70 Questions',
    description:
      'Language fundamentals, async/await, SOLID, DI, middleware, EF, MVC, Blazor, SignalR, unit testing, CI/CD, JOINs, indexes, normalization, and more.',
    highlights: ['Basic → Advanced', 'Code examples', 'SQL section included'],
    isNew: false,
  },
]

const statItems = [
  { value: '250', label: 'Interview Questions' },
  { value: '4', label: 'Topic Categories' },
  { value: '2–3', label: 'Solutions Per Problem' },
  { value: '.NET 10', label: 'Framework' },
]

const highPriorityQuestions = [
  'Reverse & Rotate arrays',
  'Remove Duplicates',
  'Max Subarray Sum (Kadane\'s)',
  'DFS / BFS Traversals',
  'Validate BST',
  'async/await & SOLID principles',
  'Value vs Reference types',
  'Dependency Injection',
  'SQL JOINs & Indexes',
  'Unit Testing & Mocking',
]

const bonusItems = [
  {
    title: 'Design Patterns Interview Questions Ebook',
    bullets: ['100+ questions with answers (20 pages)', 'Code-based questions', 'Dark and Light mode PDF'],
  },
  {
    title: 'The Job-Seeking .NET Developer\'s LinkedIn Handbook',
    bullets: ['Short ebook with ready-to-start actions', 'Real examples, checklists & tools', 'Casual, recruiter-friendly language'],
  },
]

const PassYourInterview = () => {
  return (
    <>
      {/* ── Hero ── */}
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 heading-section text-center">

              <div className="d-flex justify-content-center align-items-center flex-wrap gap-3 mb-4 mt-5">
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
                    <strong>800+ GitHub stars</strong> - trusted by the .NET community
                  </span>
                </div>
              </div>

              <h1 className="text-white mb-3">
                Pass Your <span className="text-yellow">.NET Interview</span>
              </h1>
              <h3 className="text-white mb-4">
                250 questions with answers, clean C# code, and full complexity analysis -
                <span className="text-yellow"> completely free.</span>
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
                  <span>Updated to .NET 10 - now with Lists &amp; Trees sections</span>
                </div>
              </div>

              <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mb-4">
                <div className="text-white">✅ Arrays, Lists &amp; Trees</div>
                <div className="text-white">✅ General .NET / C# / SQL</div>
                <div className="text-white">✅ Junior → Mid-Senior</div>
              </div>

              {/* ── Stats row ── */}
              <div className="row justify-content-center mb-5">
                {statItems.map((stat, i) => (
                  <div className="col-6 col-md-3 mb-3" key={i}>
                    <div
                      className="p-3 text-center"
                      style={{
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.03)',
                      }}
                    >
                      <h2 className="text-yellow mb-1" style={{ fontSize: '2rem', marginTop: '0px' }}>{stat.value}</h2>
                      <p className="text-white mb-0" style={{ fontSize: '0.9rem' }}>{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── CTA form ── */}
              <div className="row justify-content-center" id="download-kit">
                <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
                  <div className="p-4 p-md-5">
                    <h4 className="text-white mb-3">Get the Free Interview Kit</h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `<script async src="https://eomail4.com/form/ab931ff0-e1c4-11ef-907b-c3a9263edd62.js" data-form="ab931ff0-e1c4-11ef-907b-c3a9263edd62"></script>`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="background-yellow" />

        {/* ── Question categories ── */}
        <div className="container">
          <div className="row text-center pt-5">
            <div className="col-md-12 mb-5">
              <h2 className="text-white">What&apos;s inside - 250 questions across 4 categories</h2>
              <p className="text-white">
                Every coding question includes 2–3 solutions, time &amp; space complexity, edge-case discussion, and clean C# code ready to run.
              </p>
            </div>

            {questionCategories.map((cat, index) => (
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mb-4" key={index}>
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
                  {cat.isNew && (
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
                  <h4
                    className="text-white mb-2"
                    style={{ paddingRight: cat.isNew ? '70px' : 0 }}
                  >
                    <span style={{ marginRight: '8px' }}>{cat.icon}</span>{cat.title}
                  </h4>
                  <p className="text-white mb-3">{cat.description}</p>
                  {cat.highlights.map((h, hi) => (
                    <span
                      key={hi}
                      className="text-white"
                      style={{
                        display: 'inline-block',
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: '999px',
                        padding: '4px 12px',
                        fontSize: '0.85rem',
                        marginRight: '8px',
                        marginBottom: '6px',
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── High-priority questions ── */}
          <div className="row pt-4 pb-3">
            <div className="col-md-12 text-center mb-4">
              <h2 className="text-white">Top questions interviewers actually ask</h2>
              <p className="text-white">
                Based on real interviews - focus on these if you&apos;re short on time.
              </p>
            </div>

          </div>

          {/* ── Bonus materials ── */}
          <div className="row  pb-3">
            <div className="col-md-12 text-center mb-4">
              <h2 className="text-yellow">Bonus - you also get these</h2>
            </div>

            {bonusItems.map((item, index) => (
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mb-4" key={index}>
                <div
                  className="p-4 h-100"
                  style={{
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    textAlign: 'left',
                  }}
                >
                  <h4 className="text-white mb-3">
                    <span className="text-yellow" style={{ marginRight: '8px' }}>🎁</span>{item.title}
                  </h4>
                  {item.bullets.map((b, bi) => (
                    <p className="text-white mb-1" key={bi}>🟡 {b}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Who is this for / GitHub ── */}
          <div className="row pt-4 pb-3">
            <div className="col-md-12 mb-4">
              <div
                className="p-4 h-100"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  textAlign: 'left',
                }}
              >
                <h3 className="text-white mb-3">Who is this for?</h3>
                <p className="text-white mb-2">✅ Junior to mid-senior .NET developers preparing for interviews</p>
                <p className="text-white mb-2">✅ Developers brushing up on data structures &amp; algorithms in C#</p>
                <p className="text-white mb-2">✅ Anyone who wants structured, practical interview prep - not just theory</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PassYourInterview;
