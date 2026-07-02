import { Metadata } from 'next';

// TODO: Create a NEW EmailOctopus form for the simulator waitlist
// (separate list/tag so you can email only waitlist signups at launch)
// and paste its form ID here:
const WAITLIST_FORM_ID = 'REPLACE_WITH_NEW_EMAILOCTOPUS_FORM_ID';

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  alternates: {
    canonical: 'https://thecodeman.net/tools/interview-simulator',
  },
  title: 'AI Interview Simulator for .NET Developers — Join the Waitlist',
  description:
    'Practice real .NET interviews with an AI interviewer that asks follow-up questions, scores your answers, and tells you exactly what to study. Built on the 250-question Pass Your Interview kit.',
  openGraph: {
    title: 'AI Interview Simulator for .NET Developers',
    description:
      'An AI interviewer that pushes back, asks follow-ups, and scores you like a real senior engineer. Join the waitlist for early-bird pricing.',
    url: 'https://thecodeman.net/tools/interview-simulator',
    type: 'website',
  },
  twitter: {
    title: 'AI Interview Simulator for .NET Developers',
    card: 'summary_large_image',
    site: '@TheCodeMan__',
    creator: '@TheCodeMan__',
    description:
      'An AI interviewer that pushes back, asks follow-ups, and scores you like a real senior engineer. Join the waitlist for early-bird pricing.',
  },
};

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '16px',
  background: 'rgba(255,255,255,0.03)',
  textAlign: 'left',
};

const steps = [
  {
    icon: '🎙️',
    title: '1. Start the interview',
    description:
      'Pick a category (Arrays, Lists, Trees, General .NET/C#/SQL), your level (Junior → Mid-Senior), and session length. The AI interviewer takes it from there.',
  },
  {
    icon: '🔁',
    title: '2. Get grilled — like in a real interview',
    description:
      '"What if the collection has a million items?" "Why not IEnumerable here?" The interviewer reads your actual answer and digs deeper — no scripted quiz, a real conversation.',
  },
  {
    icon: '📊',
    title: '3. Get your report',
    description:
      'Score per category, a transcript with comments showing exactly where a real interviewer would have rejected you, and which of the 250 questions to review next.',
  },
];

const modes = [
  {
    icon: '💬',
    title: 'Theory Mode',
    badge: 'At launch',
    description:
      'Conversational mock interview over the full 250-question bank. Follow-up questions, pushback on shallow answers, full scoring report.',
  },
  {
    icon: '⌨️',
    title: 'Coding Mode',
    badge: 'Coming next',
    description:
      'Solve Arrays/Lists/Trees problems in a live C# editor. The AI reviews correctness, Big-O and clean code — then asks: "Can you do better than O(n²)?"',
  },
  {
    icon: '⏱️',
    title: 'Pressure Mode',
    badge: 'Planned',
    description:
      'Timed answers, interruptions, "justify that decision" — training for the nerves, not just the knowledge.',
  },
];

const InterviewSimulatorWaitlist = () => {
  return (
    <>
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
        <div className="container">
          {/* ── Hero ── */}
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
                      backgroundColor: '#f59e0b',
                      display: 'inline-block',
                      marginRight: '10px',
                    }}
                  />
                  <span className="text-white">
                    <strong>Coming soon</strong> — join the waitlist for early-bird pricing
                  </span>
                </div>
              </div>

              <h1 className="text-white mb-3">
                You read the 250 questions.
                <br />
                Could you answer them <span className="text-yellow">under pressure?</span>
              </h1>
              <h3 className="text-white mb-4">
                An AI interviewer that asks follow-ups, pushes back on shallow answers,
                and scores you like a real senior engineer.
              </h3>

              <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mb-5">
                <div className="text-white">✅ Built on the 250-question kit</div>
                <div className="text-white">✅ Real follow-up questions</div>
                <div className="text-white">✅ Score &amp; study report</div>
              </div>

              {/* ── Waitlist form ── */}
              <div className="row justify-content-center" id="waitlist">
                <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
                  <div
                    className="p-4 p-md-5"
                    style={{
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      borderRadius: '16px',
                      background: 'rgba(245, 158, 11, 0.06)',
                    }}
                  >
                    <h4 className="text-white mb-2">Join the waitlist</h4>
                    <p className="text-white mb-3">
                      First 100 on the list get <strong className="text-yellow">lifetime access for $29</strong> (launch price: $49).
                      No spam — you&apos;ll hear from me when it&apos;s ready.
                    </p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `<script async src="https://eomail4.com/form/${WAITLIST_FORM_ID}.js" data-form="${WAITLIST_FORM_ID}"></script>`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="background-yellow" />

        {/* ── How it works ── */}
        <div className="container">
          <div className="row text-center pt-5">
            <div className="col-md-12 mb-5">
              <h2 className="text-white">How it works</h2>
              <p className="text-white">
                Not another static quiz. A conversation that adapts to what you actually say.
              </p>
            </div>

            {steps.map((step, index) => (
              <div className="col-xs-12 col-sm-12 col-md-4 mb-4" key={index}>
                <div className="p-4 h-100" style={cardStyle}>
                  <h4 className="text-white mb-2">
                    <span style={{ marginRight: '8px' }}>{step.icon}</span>
                    {step.title}
                  </h4>
                  <p className="text-white mb-0">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Modes ── */}
          <div className="row text-center pt-4">
            <div className="col-md-12 mb-4">
              <h2 className="text-white">Three modes, one goal: pass the real thing</h2>
            </div>

            {modes.map((mode, index) => (
              <div className="col-xs-12 col-sm-12 col-md-4 mb-4" key={index}>
                <div className="p-4 h-100" style={{ ...cardStyle, position: 'relative' }}>
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
                    {mode.badge}
                  </div>
                  <h4 className="text-white mb-2" style={{ paddingRight: '90px' }}>
                    <span style={{ marginRight: '8px' }}>{mode.icon}</span>
                    {mode.title}
                  </h4>
                  <p className="text-white mb-0">{mode.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Why it isn't free ── */}
          <div className="row pt-4 pb-3 justify-content-center">
            <div className="col-md-10 mb-4">
              <div className="p-4 p-md-5" style={cardStyle}>
                <h3 className="text-white mb-3">Why isn&apos;t this just another free quiz?</h3>
                <p className="text-white mb-2">
                  Every session runs real AI inference. The interviewer actually reads your answer
                  and decides what to ask next — nothing is pre-scripted. That&apos;s the difference
                  between a quiz and an interview.
                </p>
                <p className="text-white mb-2">
                  A one-hour mock interview with a human engineer costs $100–200.
                  Unlimited sessions here: <strong className="text-yellow">$49, once</strong> —
                  or <strong className="text-yellow">$29</strong> if you&apos;re among the first 100 on the waitlist.
                </p>
                <p className="text-white mb-0">
                  The 250 questions stay free, forever. The simulator is for when you want to know
                  if you can actually deliver them when it counts.
                </p>
              </div>
            </div>
          </div>

          {/* ── Bottom CTA ── */}
          <div className="row pb-5 justify-content-center text-center">
            <div className="col-md-8">
              <h3 className="text-white mb-3">
                Your next interview is coming. <span className="text-yellow">Practice before it counts.</span>
              </h3>
              <a
                href="#waitlist"
                className="btn"
                style={{
                  background: '#f59e0b',
                  color: '#111',
                  fontWeight: 700,
                  borderRadius: '999px',
                  padding: '12px 32px',
                }}
              >
                Join the waitlist →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InterviewSimulatorWaitlist;
