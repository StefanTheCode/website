import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import EbookNewsletter from '@/components/ebookTestimonials';
import FreePreviewButton from '@/components/FreePreviewButton';
import './coderules.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: "Pragmatic .NET Code Rules - Stop Arguing About Code Style and Let the Build Enforce It",
  alternates: {
    canonical: 'https://thecodeman.net/pragmatic-dotnet-code-rules',
  },
  description: "A practical course for .NET teams that replaces subjective code reviews with EditorConfig, Roslyn analyzers, TreatWarningsAsErrors, Visual Studio code cleanup, Git hooks, and CI quality gates. Production-ready configs included.",
  keywords: [
    'editorconfig c#',
    'editorconfig dotnet',
    'roslyn analyzers',
    'dotnet code style',
    'c# coding standards',
    'enforce code style dotnet',
    'dotnet format',
    'c# naming conventions',
    'visual studio code cleanup',
    'EnforceCodeStyleInBuild',
    'c# code quality',
    '.NET analyzers',
    'dotnet format ci pipeline',
    'code style enforcement',
    'StyleCop vs Roslyn analyzers',
  ],
  openGraph: {
    title: "Pragmatic .NET Code Rules - Stop Arguing About Code Style and Let the Build Enforce It",
    type: "website",
    url: "https://thecodeman.net/pragmatic-dotnet-code-rules",
    description: "A practical .NET code quality system. EditorConfig, Roslyn analyzers, TreatWarningsAsErrors, code cleanup, Git hooks, CI gates. Built for real teams, not blog posts.",
    images: [
      {
        url: 'https://thecodeman.net/og-course.webp',
        width: "1000px",
        height: "700px"
      }
    ],
  },
  twitter: {
    title: "Pragmatic .NET Code Rules - Stop Arguing About Code Style and Let the Build Enforce It",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "A practical .NET code quality system. EditorConfig, Roslyn analyzers, TreatWarningsAsErrors, code cleanup, Git hooks, CI gates. Built for real teams, not blog posts.",
    images: [
      {
        url: 'https://thecodeman.net/og-course.webp',
        width: "1000px",
        height: "700px"
      }
    ]
  }
}

const CHECKOUT_URL = 'https://stefandjokic.lemonsqueezy.com/checkout/buy/105be4cc-816d-4ccb-b588-858cf96e958e';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://thecodeman.net/pragmatic-dotnet-code-rules',
      url: 'https://thecodeman.net/pragmatic-dotnet-code-rules',
      name: 'Pragmatic .NET Code Rules - Stop Arguing About Code Style and Let the Build Enforce It',
      description:
        'A practical course for .NET teams that replaces subjective code reviews with EditorConfig, Roslyn analyzers, TreatWarningsAsErrors, Visual Studio code cleanup, Git hooks, and CI quality gates. Production-ready configs included.',
      isPartOf: { '@id': 'https://thecodeman.net/#website' },
      about: {
        '@type': 'Thing',
        name: '.NET Code Quality and Style Enforcement',
      },
      author: {
        '@type': 'Person',
        name: 'Stefan Djokic',
        url: 'https://thecodeman.net',
        jobTitle: 'Microsoft MVP',
      },
    },
    {
      '@type': 'Course',
      name: 'Pragmatic .NET Code Rules',
      description:
        'A practical .NET code quality system using EditorConfig, Roslyn analyzers, TreatWarningsAsErrors, Visual Studio code cleanup, Git hooks, and CI quality gates. 12 modules, 60+ video lessons with production-ready configs.',
      provider: {
        '@type': 'Person',
        name: 'Stefan Djokic',
        url: 'https://thecodeman.net',
      },
      offers: {
        '@type': 'Offer',
        price: '74.89',
        priceCurrency: 'USD',
        availability: 'https://schema.org/PreOrder',
        url: 'https://thecodeman.net/pragmatic-dotnet-code-rules',
      },
      coursePrerequisites: 'Basic C# and .NET development experience',
      educationalLevel: 'Intermediate',
      teaches: [
        '.editorconfig configuration for .NET and C# projects',
        'Roslyn analyzer configuration and severity levels',
        'Visual Studio Code Cleanup Profiles',
        'dotnet format in CI/CD pipelines',
        'EnforceCodeStyleInBuild and warnings-as-errors',
        'Architecture tests with NetArchTest',
        'Structured logging with Serilog and OpenTelemetry',
        'AI-assisted dependency updates and PR review',
      ],
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        courseWorkload: 'Self-paced',
      },
      url: 'https://thecodeman.net/pragmatic-dotnet-code-rules',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What platform is the Pragmatic .NET Code Rules course hosted on?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The course is hosted on Skool. Video lessons, community, and discussions in one place. You watch in the browser, no extra software.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I enforce C# code style rules in CI/CD?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Run dotnet format --verify-no-changes in your pipeline, set EnforceCodeStyleInBuild to true in your .csproj, and configure Roslyn analyzer severities as errors in your .editorconfig. Combined with TreatWarningsAsErrors, CI rejects unformatted or non-compliant code before a human reviews it. This course walks through the full setup.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is .editorconfig and why does my .NET project need one?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '.editorconfig is the foundation of code style in modern .NET. It defines formatting, naming conventions, and analyzer severities for your solution, and is respected by Visual Studio, Rider, VS Code, and the .NET SDK. Without one, every developer’s IDE applies a different style and nobody can agree on what "correct" means.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between Roslyn analyzers and StyleCop?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Roslyn analyzers ship with the .NET SDK and cover both code quality (CA) and code style (IDE) rules. StyleCop.Analyzers is a third-party NuGet package focused on style and documentation. SonarAnalyzer adds deeper code smell and bug detection. The course shows when to use each and how to combine them without drowning the team in warnings.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use this course with .NET 6, 7, 8, or 9?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. EditorConfig, Roslyn analyzers, and dotnet format are part of the SDK and are not tied to a specific .NET version. Everything in the course is forward-compatible.',
          },
        },
        {
          '@type': 'Question',
          name: 'What knowledge level do I need for this .NET code rules course?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You should be comfortable with C# and basic .NET projects. You don’t need to know analyzers, MSBuild internals, or CI to start. By the end you will. The course is also useful for seniors and tech leads who want a system to roll out across a team.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I set up .editorconfig for a .NET project?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You add a .editorconfig file at the root of your solution and configure formatting, naming, and analyzer severities. Rules cascade through subfolders, so larger solutions can override specific layers. The course ships a production-ready .editorconfig you can copy in and adjust.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is EnforceCodeStyleInBuild in .NET?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'EnforceCodeStyleInBuild is an MSBuild property that tells the compiler to evaluate IDE code style rules during build, not just inside the IDE. Combined with TreatWarningsAsErrors, code style violations fail the build - locally and in CI.',
          },
        },
        {
          '@type': 'Question',
          name: 'Will the course price increase after presale?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Presale is $74.89, launch price is $149. The presale price does not come back.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I get lifetime access to the course?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Lifetime access to all lessons and every future update. No subscription, no renewal.',
          },
        },
      ],
    },
  ],
};

const HIDE_GLOBAL_CHROME = `
body{padding-top:0 !important}
.promo-bar{display:none !important}
nav#ftco-navbar.header-nav{display:none !important}
`;

const PAGE_JS = `
(function(){
  document.documentElement.classList.add('cr-js');
  var END = new Date('2026-06-30T23:59:59+02:00').getTime();
  function pad(n){return String(n).padStart(2,'0');}
  function tick(){
    var diff = Math.max(0, END - Date.now());
    var d=Math.floor(diff/864e5); diff-=d*864e5;
    var h=Math.floor(diff/36e5); diff-=h*36e5;
    var m=Math.floor(diff/6e4); diff-=m*6e4;
    var s=Math.floor(diff/1e3);
    var top=document.getElementById('cr-cd-top');
    if(top){var qd=top.querySelector('[data-d]'),qh=top.querySelector('[data-h]'),qm=top.querySelector('[data-m]'),qs=top.querySelector('[data-s]');if(qd){qd.textContent=pad(d)+'d';qh.textContent=pad(h)+'h';qm.textContent=pad(m)+'m';qs.textContent=pad(s)+'s';}}
    var bar=document.getElementById('cr-cd-bar');
    if(bar){bar.textContent=pad(d)+'d '+pad(h)+'h '+pad(m)+'m '+pad(s)+'s';}
  }
  tick(); setInterval(tick,1000);
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('cr-in');io.unobserve(e.target);}});},{threshold:.12});
    document.querySelectorAll('.cr-reveal').forEach(function(el){io.observe(el);});
    var sticky=document.getElementById('cr-stickybar');
    var hero=document.getElementById('cr-hero');
    if(sticky&&hero){var so=new IntersectionObserver(function(es){es.forEach(function(e){sticky.classList.toggle('cr-show', !e.isIntersecting);});},{threshold:0}); so.observe(hero);}
  } else {
    document.querySelectorAll('.cr-reveal').forEach(function(el){el.classList.add('cr-in');});
  }
})();
`;

const MS = (
  <span className="cr-ms"><i></i><i></i><i></i><i></i></span>
);

const CodeRules = () => {
  return (
    <div className="cr-page">
      <style dangerouslySetInnerHTML={{ __html: HIDE_GLOBAL_CHROME }} />
      <Script
        id="code-rules-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="cr-ambience" aria-hidden="true"></div>
      <div className="cr-grain" aria-hidden="true"></div>

      {/* 1. ANNOUNCEMENT / COUNTDOWN BAR */}
      <div className="cr-topbar">
        <span>🔥 <b>Presale - 50% off.</b> Price goes up at launch - permanently.</span>
        <span className="cr-cd" id="cr-cd-top">
          <span data-d>00d</span><span data-h>00h</span><span data-m>00m</span><span data-s>00s</span>
        </span>
      </div>

      {/* 2. COURSE-ONLY STICKY NAV */}
      <nav className="cr-nav">
        <div className="cr-wrap cr-nav-row">
          <a className="cr-brand" href="#cr-top"><span className="cr-glyph">&lt;/&gt;</span> Pragmatic .NET Code Rules</a>
          <div className="cr-nav-links">
            <a href="#cr-problem">The Problem</a>
            <a href="#cr-learn">What You Learn</a>
            <a href="#cr-pricing">Pricing</a>
            <a href="#cr-curriculum">Curriculum</a>
            <a href="#cr-faq">FAQ</a>
          </div>
          <div className="cr-nav-right">
            <span className="cr-nav-price"><span className="cr-s">$149</span><b>$74.89</b></span>
            <a href={CHECKOUT_URL} className="cr-btn cr-btn-primary lemonsqueezy-button">Reserve Your Spot</a>
          </div>
        </div>
      </nav>

      <div id="cr-top"></div>

      {/* 3. HERO */}
      <header className="cr-hero" id="cr-hero">
        <div className="cr-wrap cr-hero-grid">
          <div className="cr-reveal">
            <span className="cr-chip">{MS} By Stefan Đokić · Microsoft MVP</span>
            <h1>Make your .NET codebase <span className="cr-amber">enforce itself.</span></h1>
            <p className="cr-lead">Get the exact <code>.editorconfig</code>, Roslyn analyzers, CI quality gates, and automation I use in production. Stop arguing about code style - let the build do it. Copy, apply, ship.</p>
            <div className="cr-cta">
              <a href={CHECKOUT_URL} className="cr-btn cr-btn-primary lemonsqueezy-button">Reserve Your Spot - $74.89 →</a>
              <a href="#cr-curriculum" className="cr-btn cr-btn-ghost">See the curriculum</a>
            </div>
            <p className="cr-reassure">Presale price <span className="cr-dot"></span> 100% refundable until release <span className="cr-dot"></span> lifetime access</p>
            <div className="cr-rating">
              <div className="cr-rating-av">
                <span>SD</span><span>AM</span><span>KK</span><span>JS</span><span>+</span>
              </div>
              <div className="cr-rating-txt">
                <div className="cr-rating-top"><span className="cr-stars">★★★★★</span><span className="cr-rating-score">4.9</span></div>
                <span className="cr-rating-sub">Loved by .NET devs (1000+ reviews)</span>
              </div>
            </div>
          </div>
          <div className="cr-cover cr-reveal">
            <div className="cr-glow"></div>
            <div className="cr-frame">
              {/* Save the chosen Higgsfield render as public/images/course-hero.webp
                  (recommended: the "Stefan holding the box" image). */}
              <Image src="/images/course-hero.webp" alt="Stefan Đokić holding the Pragmatic .NET Code Rules course" width={0} height={0} sizes="(max-width:940px) 100vw, 50vw" style={{ width: '100%', height: 'auto', display: 'block' }} priority />
            </div>
          </div>
        </div>
      </header>

      {/* 4. CREDIBILITY STRIP */}
      <div className="cr-cred">
        <div className="cr-wrap cr-cred-row">
          <span><b>Microsoft MVP</b></span><span className="cr-sep"></span>
          <span><b>20,000+</b> newsletter readers</span><span className="cr-sep"></span>
          <span><b>102k+</b> LinkedIn</span><span className="cr-sep"></span>
          <span><b>12</b> modules · <b>60+</b> lessons</span><span className="cr-sep"></span>
          <span className="cr-stars">★★★★★</span>
        </div>
      </div>

      {/* 4.5 MAIN TESTIMONIAL SPOTLIGHT */}
      <section className="cr-spotlight-sec">
        <div className="cr-wrap cr-reveal">
          <div className="cr-spotlight">
            <span className="cr-mvp-pill">{MS} Recommended by a Microsoft MVP</span>
            <span className="cr-stars cr-spot-stars">★★★★★</span>
            <blockquote className="cr-spot-q">&quot;This is the most in-depth course on .NET quality that I have ever seen. Stefan explains, really in depth, how <span className="cr-amber">.editorconfig</span>, props files and static code analysis work and how to set them up from scratch. <span className="cr-amber">I highly recommend it</span> - it will increase your code quality, cut review time, and reduce bugs.&quot;</blockquote>
            <div className="cr-spot-who">
              <div className="cr-spot-av">AM</div>
              <div className="cr-spot-meta">
                <div className="cr-spot-nm">Anton Martyniuk</div>
                <div className="cr-spot-rl">Microsoft MVP · .NET Software Architect</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="cr-divider"></div>

      {/* 5. PROBLEM */}
      <section id="cr-problem">
        <div className="cr-wrap cr-pain-grid">
          <div className="cr-reveal">
            <span className="cr-eyebrow">The hidden tax</span>
            <h2 className="cr-sec-title">Messy code doesn&apos;t just look bad. It silently kills your team&apos;s velocity.</h2>
            <ul className="cr-pain-list">
              <li><span className="cr-x">✕</span> &quot;Please format this.&quot; - on every single PR</li>
              <li><span className="cr-x">✕</span> Endless nitpicking instead of real code review</li>
              <li><span className="cr-x">✕</span> Styling conflicts instead of merge conflicts</li>
              <li><span className="cr-x">✕</span> Warnings in one project, silence in another</li>
              <li><span className="cr-x">✕</span> No one knows which style rules are &quot;correct&quot; anymore</li>
            </ul>
            <p className="cr-kicker">You don&apos;t need more discipline.<br /><span className="cr-amber">You need a system that enforces itself.</span></p>
          </div>
          <div className="cr-reveal">
            <div className="cr-media-frame">
              <Image src="/images/course2.webp" alt="Code inconsistency across a .NET team" width={0} height={0} sizes="(max-width:860px) 100vw, 40vw" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      <div className="cr-divider"></div>

      {/* 6. BEFORE / AFTER */}
      <section>
        <div className="cr-wrap">
          <div className="cr-sec-head cr-center cr-reveal">
            <span className="cr-eyebrow cr-center">The transformation</span>
            <h2 className="cr-sec-title">What changes after you apply this</h2>
          </div>
          <div className="cr-ba cr-reveal">
            <div className="cr-ba-card cr-before">
              <h3>Before</h3>
              <ul>
                <li><span className="cr-ic">✕</span> PRs full of &quot;fix formatting&quot; comments</li>
                <li><span className="cr-ic">✕</span> Every developer uses different style rules</li>
                <li><span className="cr-ic">✕</span> CI passes dirty code all the time</li>
                <li><span className="cr-ic">✕</span> New team members take weeks to ramp up</li>
                <li><span className="cr-ic">✕</span> Time wasted on manual cleanup after every merge</li>
                <li><span className="cr-ic">✕</span> &quot;Tabs vs spaces&quot; debates in Slack</li>
              </ul>
            </div>
            <div className="cr-ba-card cr-after">
              <h3>After</h3>
              <ul>
                <li><span className="cr-ic">✔</span> PRs focus on logic, architecture, and real issues</li>
                <li><span className="cr-ic">✔</span> Every file follows the same rules - automatically</li>
                <li><span className="cr-ic">✔</span> CI rejects unformatted code before a human sees it</li>
                <li><span className="cr-ic">✔</span> New devs are productive on day one</li>
                <li><span className="cr-ic">✔</span> Cleanup happens on save - zero manual effort</li>
                <li><span className="cr-ic">✔</span> The codebase looks like one person wrote it</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="cr-divider"></div>

      {/* 7. WHAT YOU'LL LEARN */}
      <section id="cr-learn">
        <div className="cr-wrap">
          <div className="cr-sec-head cr-center cr-reveal">
            <span className="cr-eyebrow cr-center">The system</span>
            <h2 className="cr-sec-title">What you&apos;ll learn</h2>
            <p className="cr-sec-sub">Production-tested techniques across 12 modules and 60+ lessons.</p>
          </div>

          <div className="cr-learn-row cr-reveal">
            <div>
              <div className="cr-learn-num">01</div>
              <h3>The Code Consistency Mindset</h3>
              <p>Why unified code isn&apos;t &quot;nice to have&quot; - it&apos;s a force multiplier for velocity and maintainability.</p>
              <ul className="cr-pts">
                <li><span className="cr-ic">→</span> See how inconsistent code silently kills delivery speed</li>
                <li><span className="cr-ic">→</span> The mindset top engineering teams use to stay aligned</li>
              </ul>
            </div>
            <div className="cr-media"><div className="cr-media-frame"><Image src="/images/mindset.webp" alt="The code consistency mindset" width={0} height={0} sizes="(max-width:860px) 100vw, 50vw" style={{ width: '100%', height: 'auto', display: 'block' }} /></div></div>
          </div>

          <div className="cr-learn-row cr-flip cr-reveal">
            <div>
              <div className="cr-learn-num">02</div>
              <h3>.editorconfig Deep Dive</h3>
              <p>Master the most underrated tool in .NET and make every IDE follow the same rules automatically.</p>
              <ul className="cr-pts">
                <li><span className="cr-ic">→</span> Build rock-solid formatting, naming &amp; analyzer rules</li>
                <li><span className="cr-ic">→</span> Structure it for small projects and massive solutions</li>
              </ul>
            </div>
            <div className="cr-media"><div className="cr-media-frame"><Image src="/images/editorconfig.webp" alt=".editorconfig deep dive" width={0} height={0} sizes="(max-width:860px) 100vw, 50vw" style={{ width: '100%', height: 'auto', display: 'block' }} /></div></div>
          </div>

          <div className="cr-learn-row cr-reveal">
            <div>
              <div className="cr-learn-num">03</div>
              <h3>Visual Studio Cleanup Automation</h3>
              <p>Turn Visual Studio into a self-cleaning machine that formats code before you even think about it.</p>
              <ul className="cr-pts">
                <li><span className="cr-ic">→</span> Create Cleanup Profiles that fix styling instantly</li>
                <li><span className="cr-ic">→</span> Remove 90% of manual cleanup from your workflow</li>
              </ul>
            </div>
            <div className="cr-media"><div className="cr-media-frame"><Image src="/images/cleanup.webp" alt="Visual Studio cleanup automation" width={0} height={0} sizes="(max-width:860px) 100vw, 50vw" style={{ width: '100%', height: 'auto', display: 'block' }} /></div></div>
          </div>

          <div className="cr-learn-row cr-flip cr-reveal">
            <div>
              <div className="cr-learn-num">04</div>
              <h3>Analyzers &amp; Warnings-As-Errors</h3>
              <p>Catch quality issues at the source instead of wasting reviewer time on low-value comments.</p>
              <ul className="cr-pts">
                <li><span className="cr-ic">→</span> Configure analyzers that actually matter</li>
                <li><span className="cr-ic">→</span> Enforce rules without drowning devs in noise</li>
              </ul>
            </div>
            <div className="cr-media"><div className="cr-media-frame"><Image src="/images/errors.webp" alt="Analyzers and warnings as errors" width={0} height={0} sizes="(max-width:860px) 100vw, 50vw" style={{ width: '100%', height: 'auto', display: 'block' }} /></div></div>
          </div>

          <div className="cr-learn-row cr-reveal">
            <div>
              <div className="cr-learn-num">05</div>
              <h3>dotnet format + CI Enforcement</h3>
              <p>Build a CI pipeline that refuses messy code and guarantees consistency across your org.</p>
              <ul className="cr-pts">
                <li><span className="cr-ic">→</span> Add dotnet format to local and CI workflows</li>
                <li><span className="cr-ic">→</span> Fail PRs automatically when rules are violated</li>
              </ul>
            </div>
            <div className="cr-media"><div className="cr-media-frame"><Image src="/images/ci.png" alt="dotnet format and CI enforcement" width={0} height={0} sizes="(max-width:860px) 100vw, 50vw" style={{ width: '100%', height: 'auto', display: 'block' }} /></div></div>
          </div>

          <div className="cr-learn-row cr-flip cr-reveal">
            <div>
              <div className="cr-learn-num">06</div>
              <h3>Team-Wide Adoption Strategies</h3>
              <p>Roll out code rules across your team smoothly, confidently, and without the usual resistance.</p>
              <ul className="cr-pts">
                <li><span className="cr-ic">→</span> Introduce new rules gradually and strategically</li>
                <li><span className="cr-ic">→</span> Build a culture where clean code is the default</li>
              </ul>
            </div>
            <div className="cr-media"><div className="cr-media-frame"><Image src="/images/slack.webp" alt="Team-wide adoption strategies" width={0} height={0} sizes="(max-width:860px) 100vw, 50vw" style={{ width: '100%', height: 'auto', display: 'block' }} /></div></div>
          </div>
        </div>
      </section>

      <div className="cr-divider"></div>

      {/* 8. BONUSES */}
      <section>
        <div className="cr-wrap">
          <div className="cr-sec-head cr-center cr-reveal">
            <span className="cr-eyebrow cr-center">Presale-only · removed at launch</span>
            <h2 className="cr-sec-title">Join now and get <span className="cr-amber">$107 in bonuses</span>, free.</h2>
          </div>
          <div className="cr-bonus-grid cr-reveal">
            <div className="cr-bonus-card">
              <div className="cr-gift">🎁</div>
              <h3>Starter Kit</h3>
              <p>A pre-configured .NET solution with <code className="cr-mono" style={{ fontSize: '.85em', color: 'var(--amber-bright)' }}>.editorconfig</code>, Directory.Build.props, analyzer setup, and CI pipeline - clone and use.</p>
              <span className="cr-val">Value $49</span>
            </div>
            <div className="cr-bonus-card">
              <div className="cr-gift">🎁</div>
              <h3>CI Quality Gate Template</h3>
              <p>A GitHub Actions workflow that runs dotnet format, analyzers, and architecture tests - fails the PR if anything is off.</p>
              <span className="cr-val">Value $29</span>
            </div>
            <div className="cr-bonus-card">
              <div className="cr-gift">🎁</div>
              <h3>Bonus Video: Automating PR Cleanup</h3>
              <p>A walkthrough on AI-assisted dependency updates and automated PR review with Dependabot + GitHub Actions.</p>
              <span className="cr-val">Value $29</span>
            </div>
          </div>
          <p className="cr-bonus-foot cr-reveal">Bonuses total <s>$107</s> · <b>Yours free with the presale</b></p>
        </div>
      </section>

      <div className="cr-divider"></div>

      {/* 9. EVERYTHING YOU GET */}
      <section>
        <div className="cr-wrap">
          <div className="cr-sec-head cr-center cr-reveal">
            <span className="cr-eyebrow cr-center">The full package</span>
            <h2 className="cr-sec-title">Everything you get</h2>
          </div>
          <div className="cr-eg-grid cr-reveal">
            <div className="cr-eg-card">
              <div className="cr-eg-ico">📹</div><h3>The Course</h3>
              <ul>
                <li><span className="cr-ic">✔</span> 12 modules, 60+ video lessons</li>
                <li><span className="cr-ic">✔</span> Step-by-step, production-focused</li>
                <li><span className="cr-ic">✔</span> Lifetime access + all updates</li>
                <li><span className="cr-ic">✔</span> Hosted on Skool - watch anywhere</li>
              </ul>
            </div>
            <div className="cr-eg-card">
              <div className="cr-eg-ico">📦</div><h3>Ready-to-Use Files</h3>
              <ul>
                <li><span className="cr-ic">✔</span> Production-ready .editorconfig</li>
                <li><span className="cr-ic">✔</span> Directory.Build.props best practices</li>
                <li><span className="cr-ic">✔</span> GitHub Actions CI configs</li>
                <li><span className="cr-ic">✔</span> Copy-paste into any .NET project</li>
              </ul>
            </div>
            <div className="cr-eg-card">
              <div className="cr-eg-ico">👥</div><h3>Community Access</h3>
              <ul>
                <li><span className="cr-ic">✔</span> Private Skool community (free)</li>
                <li><span className="cr-ic">✔</span> Q&amp;A with the instructor</li>
                <li><span className="cr-ic">✔</span> Share setups, get feedback</li>
                <li><span className="cr-ic">✔</span> Connect with other .NET devs</li>
              </ul>
            </div>
            <div className="cr-eg-card">
              <div className="cr-eg-ico">📋</div><h3>Clean Commit Checklist</h3>
              <ul>
                <li><span className="cr-ic">✔</span> Step-by-step checklist (PDF)</li>
                <li><span className="cr-ic">✔</span> Printable - pin by your monitor</li>
                <li><span className="cr-ic">✔</span> Share with your team</li>
                <li><span className="cr-ic">✔</span> Use it as your PR quality gate</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="cr-divider"></div>

      {/* 10. TESTIMONIALS (Senja widget + cards) */}
      <section>
        <div className="cr-wrap">
          <div className="cr-sec-head cr-center cr-reveal">
            <span className="cr-eyebrow cr-center">Proof</span>
            <h2 className="cr-sec-title">What developers are saying</h2>
            <p className="cr-sec-sub">Specific feedback from engineers who already had opinions about code quality before they bought this.</p>
          </div>

          {/* Live Senja reviews widget */}
          <EbookNewsletter />

          <div className="cr-tg cr-reveal">
            <div className="cr-tcard">
              <span className="cr-stars">★★★★★</span>
              <p className="cr-q">&quot;This is the most in-depth course on .NET quality that I have ever seen. Stefan explains, really in depth, how .editorconfig, props files and static code analysis work and how to set them up from scratch. I highly recommend it - it will increase your code quality, cut review time, and reduce bugs.&quot;</p>
              <div className="cr-who"><div className="cr-av">AM</div><div><div className="cr-nm">Anton Martyniuk</div><div className="cr-rl">Microsoft MVP · .NET Software Architect</div></div></div>
            </div>
            <div className="cr-tcard">
              <span className="cr-stars">★★★★★</span>
              <p className="cr-q">&quot;I really enjoyed the chapters on EditorConfig and automating code cleanup. The step-by-step explanation made the concept easy to understand. The sections on Visual Studio cleanup profiles and Git pre-commit hooks were especially useful - they show how to automate formatting without manual checks.&quot;</p>
              <div className="cr-who"><div className="cr-av">KK</div><div><div className="cr-nm">Kanaiya Katarmal</div><div className="cr-rl">.NET Developer</div></div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="cr-divider"></div>

      {/* 11. ABOUT */}
      <section>
        <div className="cr-wrap cr-about">
          <div className="cr-reveal">
            <div className="cr-media-frame"><Image src="/images/ebook-stefan.webp" alt="Stefan Đokić, Microsoft MVP" width={0} height={0} sizes="(max-width:860px) 100vw, 360px" style={{ width: '100%', height: 'auto', display: 'block' }} /></div>
          </div>
          <div className="cr-reveal">
            <span className="cr-mvp-pill">{MS} Microsoft MVP</span>
            <h2>This isn&apos;t theory - it&apos;s how I ship production code.</h2>
            <p>Hi, I&apos;m <b>Stefan Đokić</b> - Microsoft MVP, Senior Software Engineer, and creator of TheCodeMan.net.</p>
            <p>For more than 10 years I&apos;ve been building large-scale .NET solutions where consistency, clarity, and automation aren&apos;t optional - they&apos;re the only way teams ship fast and reliably.</p>
            <p>Everything in this course comes from real production experience. These are the exact files and configs I use every day - not theory, not &quot;ideal world&quot; scenarios.</p>
            <div className="cr-about-stats">
              <div><div className="cr-v">20,000+</div><div className="cr-l">Newsletter</div></div>
              <div><div className="cr-v">102k+</div><div className="cr-l">LinkedIn</div></div>
              <div><div className="cr-v">8,000+</div><div className="cr-l">Twitter / X</div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="cr-divider"></div>

      {/* 12. PRICING */}
      <section id="cr-pricing">
        <div className="cr-wrap">
          <div className="cr-sec-head cr-center cr-reveal">
            <span className="cr-eyebrow cr-center">Presale pricing</span>
            <h2 className="cr-sec-title">Lock in the lowest price it will ever be.</h2>
          </div>
          <div className="cr-pricing cr-reveal">
            <div className="cr-price-card">
              <div className="cr-ribbon">50% OFF</div>
              <h3>Pragmatic .NET Code Rules</h3>
              <p className="cr-psub">Complete course + bonuses + community</p>
              <div className="cr-amt"><span className="cr-now">$74.89</span><span className="cr-was">$149</span></div>
              <p className="cr-save">Save $74 · Presale price never comes back</p>
              <ul>
                <li><span className="cr-ic">✔</span> 12 modules, 60+ video lessons</li>
                <li><span className="cr-ic">✔</span> Production-ready config files</li>
                <li><span className="cr-ic">✔</span> CI quality gate template + Starter Kit</li>
                <li><span className="cr-ic">✔</span> Clean Commit Checklist (PDF)</li>
                <li><span className="cr-ic">✔</span> Bonus: AI-assisted PR review video</li>
                <li><span className="cr-ic">✔</span> Community access (free, lifetime)</li>
                <li><span className="cr-ic">✔</span> Lifetime access + all future updates</li>
              </ul>
              <a href={CHECKOUT_URL} className="cr-btn cr-btn-primary lemonsqueezy-button">Reserve Your Spot →</a>
              <p className="cr-grt">Refundable until release · Secure checkout via Lemon Squeezy</p>
            </div>
            <div className="cr-why">
              <h3>Why join the presale?</h3>
              <div className="cr-why-item"><span className="cr-ic">🔄</span><div><div className="cr-t">Zero risk</div><div className="cr-d">Refundable up until the official course release.</div></div></div>
              <div className="cr-why-item"><span className="cr-ic">⏰</span><div><div className="cr-t">Lowest price ever</div><div className="cr-d">50% off the planned launch price - permanently gone after.</div></div></div>
              <div className="cr-why-item"><span className="cr-ic">🎁</span><div><div className="cr-t">Exclusive bonuses</div><div className="cr-d">Starter Kit, CI template &amp; bonus video - presale only.</div></div></div>
              <div className="cr-why-item"><span className="cr-ic">🔓</span><div><div className="cr-t">Early access</div><div className="cr-d">Get modules as they drop, before the official launch.</div></div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="cr-divider"></div>

      {/* 13. FIT CHECK */}
      <section>
        <div className="cr-wrap">
          <div className="cr-sec-head cr-center cr-reveal">
            <span className="cr-eyebrow cr-center">Honest fit check</span>
            <h2 className="cr-sec-title">Is this course right for you?</h2>
          </div>
          <div className="cr-fit cr-reveal">
            <div className="cr-fit-card cr-no">
              <h3>Not for developers who…</h3>
              <ul>
                <li><span className="cr-ic">✕</span> Prefer manual cleanup</li>
                <li><span className="cr-ic">✕</span> Believe &quot;style doesn&apos;t matter&quot;</li>
                <li><span className="cr-ic">✕</span> Don&apos;t want automation in their workflow</li>
              </ul>
            </div>
            <div className="cr-fit-card cr-yes">
              <h3>Built for developers who…</h3>
              <ul>
                <li><span className="cr-ic">✔</span> Work in .NET teams of any size</li>
                <li><span className="cr-ic">✔</span> Want predictable, standardized code</li>
                <li><span className="cr-ic">✔</span> Are tired of PRs full of style corrections</li>
                <li><span className="cr-ic">✔</span> Want CI/CD to enforce consistency</li>
                <li><span className="cr-ic">✔</span> Care about maintainability and professionalism</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="cr-divider"></div>

      {/* 14. CURRICULUM */}
      <section id="cr-curriculum">
        <div className="cr-wrap">
          <div className="cr-sec-head cr-center cr-reveal">
            <span className="cr-eyebrow cr-center">The full curriculum</span>
            <h2 className="cr-sec-title">12 modules. 60+ lessons.</h2>
            <p className="cr-sec-sub">Click any module to expand. Lessons marked <span className="cr-good">Free preview</span> are open before you buy.</p>
          </div>
          <div className="cr-acc cr-reveal">
            <details open>
              <summary>🧱 00 · Course Introduction <span className="cr-meta">5 lessons</span><span className="cr-tog">+</span></summary>
              <div className="cr-acc-body">
                <div className="cr-lesson"><span className="cr-n">00.01</span> Welcome <FreePreviewButton videoId="vlJhmURwVSM" /></div>
                <div className="cr-lesson"><span className="cr-n">00.02</span> What You Will Learn <FreePreviewButton videoId="o9rwJhYA-P4" /></div>
                <div className="cr-lesson"><span className="cr-n">00.03</span> Who This Course Is For <FreePreviewButton videoId="poQCgDSWfdw" /></div>
                <div className="cr-lesson"><span className="cr-n">00.04</span> Tools &amp; Requirements <FreePreviewButton videoId="PMqs_dSs0LU" /></div>
                <div className="cr-lesson"><span className="cr-n">00.05</span> How to follow the course <FreePreviewButton videoId="2fUxoUnMpI0" /></div>
              </div>
            </details>
            <details>
              <summary>🗂️ 01 · The Foundation: EditorConfig <span className="cr-meta">8 lessons</span><span className="cr-tog">+</span></summary>
              <div className="cr-acc-body">
                <div className="cr-lesson"><span className="cr-n">01.00</span> Module Intro <FreePreviewButton videoId="vBLHCsSoHP0" /></div>
                <div className="cr-lesson"><span className="cr-n">01.01</span> Why Code Style Consistency Matters <FreePreviewButton videoId="L8BtAQO1t4I" /></div>
                <div className="cr-lesson"><span className="cr-n">01.02</span> Creating the CleanStart Solution Structure</div>
                <div className="cr-lesson"><span className="cr-n">01.03</span> What EditorConfig Is &amp; How It Works</div>
                <div className="cr-lesson"><span className="cr-n">01.04</span> Adding the .editorconfig File</div>
                <div className="cr-lesson"><span className="cr-n">01.05</span> Running Code Cleanup to Apply Rules</div>
                <div className="cr-lesson"><span className="cr-n">01.06</span> EditorConfig Tips, Tricks &amp; Best Practices</div>
                <div className="cr-lesson"><span className="cr-n">01.07</span> Chapter Recap</div>
              </div>
            </details>
            <details>
              <summary>🧹 02 · Automating Code Cleanup <span className="cr-meta">6 lessons</span><span className="cr-tog">+</span></summary>
              <div className="cr-acc-body">
                <div className="cr-lesson"><span className="cr-n">02.00</span> Module Intro <FreePreviewButton videoId="CzkPS4jzgsY" /></div>
                <div className="cr-lesson"><span className="cr-n">02.01</span> Visual Studio Code Cleanup Profiles</div>
                <div className="cr-lesson"><span className="cr-n">02.02</span> Running Cleanup Automatically on Save</div>
                <div className="cr-lesson"><span className="cr-n">02.03</span> One-Click Full Solution Cleanup</div>
                <div className="cr-lesson"><span className="cr-n">02.04</span> Git Pre-Commit Hooks for Formatting</div>
                <div className="cr-lesson"><span className="cr-n">02.05</span> Chapter Recap</div>
              </div>
            </details>
            <details>
              <summary>🚨 03 · Diagnostics &amp; Warnings as Errors <span className="cr-meta">5 lessons</span><span className="cr-tog">+</span></summary>
              <div className="cr-acc-body">
                <div className="cr-lesson"><span className="cr-n">03.01</span> Understanding Diagnostic Severities</div>
                <div className="cr-lesson"><span className="cr-n">03.02</span> Organizing Rules: Suggestion, Warning, Error</div>
                <div className="cr-lesson"><span className="cr-n">03.03</span> Enforcing Warnings as Errors in .NET Projects</div>
                <div className="cr-lesson"><span className="cr-n">03.04</span> How This Prevents Future Bugs</div>
                <div className="cr-lesson"><span className="cr-n">03.05</span> Chapter Recap</div>
              </div>
            </details>
            <details>
              <summary>🔍 04 · Static Analysis in .NET <span className="cr-meta">6 lessons</span><span className="cr-tog">+</span></summary>
              <div className="cr-acc-body">
                <div className="cr-lesson"><span className="cr-n">04.01</span> Introduction to .NET Analyzers</div>
                <div className="cr-lesson"><span className="cr-n">04.02</span> Adding StyleCop to the Project</div>
                <div className="cr-lesson"><span className="cr-n">04.03</span> Adding SonarAnalyzer for Deeper Analysis</div>
                <div className="cr-lesson"><span className="cr-n">04.04</span> Configuring Analyzer Rules in EditorConfig</div>
                <div className="cr-lesson"><span className="cr-n">04.05</span> Identifying Real-World Issues with Static Analysis</div>
                <div className="cr-lesson"><span className="cr-n">04.06</span> Chapter Recap</div>
              </div>
            </details>
            <details>
              <summary>🏗️ 05 · Centralized Settings: Directory.Build.props <span className="cr-meta">5 lessons</span><span className="cr-tog">+</span></summary>
              <div className="cr-acc-body">
                <div className="cr-lesson"><span className="cr-n">05.01</span> Why Centralized Build Settings Matter</div>
                <div className="cr-lesson"><span className="cr-n">05.02</span> Creating Directory.Build.props</div>
                <div className="cr-lesson"><span className="cr-n">05.03</span> Adding Global Usings, LangVersion &amp; Nullable</div>
                <div className="cr-lesson"><span className="cr-n">05.04</span> Unifying All Projects with Shared Rules</div>
                <div className="cr-lesson"><span className="cr-n">05.05</span> Chapter Recap</div>
              </div>
            </details>
            <details>
              <summary>⚙️ 06 · Visual Studio Productivity &amp; Clean Code <span className="cr-meta">5 lessons</span><span className="cr-tog">+</span></summary>
              <div className="cr-acc-body">
                <div className="cr-lesson"><span className="cr-n">06.01</span> Essential VS Formatting Features</div>
                <div className="cr-lesson"><span className="cr-n">06.02</span> File Header Templates</div>
                <div className="cr-lesson"><span className="cr-n">06.03</span> Custom Snippets for Faster Development</div>
                <div className="cr-lesson"><span className="cr-n">06.04</span> Format on Save, Run Cleanup on Build</div>
                <div className="cr-lesson"><span className="cr-n">06.05</span> Chapter Recap</div>
              </div>
            </details>
            <details>
              <summary>🧹 07 · Project Cleanup &amp; Consistency <span className="cr-meta">5 lessons</span><span className="cr-tog">+</span></summary>
              <div className="cr-acc-body">
                <div className="cr-lesson"><span className="cr-n">07.01</span> Standard Project Folder Structure</div>
                <div className="cr-lesson"><span className="cr-n">07.02</span> Enabling nullable &amp; analyzing warnings</div>
                <div className="cr-lesson"><span className="cr-n">07.03</span> Removing unused files, refs &amp; dependencies</div>
                <div className="cr-lesson"><span className="cr-n">07.04</span> Normalizing namespaces &amp; usings</div>
                <div className="cr-lesson"><span className="cr-n">07.05</span> Chapter Recap</div>
              </div>
            </details>
            <details>
              <summary>🧱 08 · Architecture Tests <span className="cr-meta">5 lessons</span><span className="cr-tog">+</span></summary>
              <div className="cr-acc-body">
                <div className="cr-lesson"><span className="cr-n">08.01</span> Why Architecture Tests Matter</div>
                <div className="cr-lesson"><span className="cr-n">08.02</span> Adding NetArchTest</div>
                <div className="cr-lesson"><span className="cr-n">08.03</span> Testing Domain → Application → Infrastructure</div>
                <div className="cr-lesson"><span className="cr-n">08.04</span> Preventing Cycles &amp; Wrong References</div>
                <div className="cr-lesson"><span className="cr-n">08.05</span> Chapter Recap</div>
              </div>
            </details>
            <details>
              <summary>🔄 09 · Integrating Code Quality into CI/CD <span className="cr-meta">5 lessons</span><span className="cr-tog">+</span></summary>
              <div className="cr-acc-body">
                <div className="cr-lesson"><span className="cr-n">09.01</span> dotnet format in CI</div>
                <div className="cr-lesson"><span className="cr-n">09.02</span> Running Analyzers in CI</div>
                <div className="cr-lesson"><span className="cr-n">09.03</span> Enforcing Warnings as Errors in the Pipeline</div>
                <div className="cr-lesson"><span className="cr-n">09.04</span> Preventing &quot;Dirty Code&quot; from Entering Main</div>
                <div className="cr-lesson"><span className="cr-n">09.05</span> Chapter Recap</div>
              </div>
            </details>
            <details>
              <summary>🧭 10 · Logging &amp; Observability <span className="cr-meta">5 lessons</span><span className="cr-tog">+</span></summary>
              <div className="cr-acc-body">
                <div className="cr-lesson"><span className="cr-n">10.01</span> Adding Serilog to the Project</div>
                <div className="cr-lesson"><span className="cr-n">10.02</span> Structured Logging Best Practices</div>
                <div className="cr-lesson"><span className="cr-n">10.03</span> Adding OpenTelemetry (OTEL) Basics</div>
                <div className="cr-lesson"><span className="cr-n">10.04</span> Tracing Requests in an API</div>
                <div className="cr-lesson"><span className="cr-n">10.05</span> Chapter Recap</div>
              </div>
            </details>
            <details>
              <summary>🎁 11 · Bonus: Your Own Clean .NET Template <span className="cr-meta">5 lessons</span><span className="cr-tog">+</span></summary>
              <div className="cr-acc-body">
                <div className="cr-lesson"><span className="cr-n">11.01</span> Turning the CleanStart Solution Into a Template</div>
                <div className="cr-lesson"><span className="cr-n">11.02</span> Exporting as a Visual Studio Template</div>
                <div className="cr-lesson"><span className="cr-n">11.03</span> Exporting as a dotnet new Template</div>
                <div className="cr-lesson"><span className="cr-n">11.04</span> Sharing the Template with Your Team</div>
                <div className="cr-lesson"><span className="cr-n">11.05</span> Course Wrap-Up</div>
              </div>
            </details>
            <details>
              <summary>🤖 12 · AI-Assisted Dependency &amp; PR Review <span className="cr-meta">6 lessons</span><span className="cr-tog">+</span></summary>
              <div className="cr-acc-body">
                <div className="cr-lesson"><span className="cr-n">12.01</span> Why Use AI for Dependency Updates</div>
                <div className="cr-lesson"><span className="cr-n">12.02</span> Setting Up Dependabot for NuGet in .NET</div>
                <div className="cr-lesson"><span className="cr-n">12.03</span> Creating a GitHub Action for AI PR Review</div>
                <div className="cr-lesson"><span className="cr-n">12.04</span> Designing Effective Prompts for Safe Updates</div>
                <div className="cr-lesson"><span className="cr-n">12.05</span> Optional: Labels, Changelog &amp; Notifications</div>
                <div className="cr-lesson"><span className="cr-n">12.06</span> Chapter Recap</div>
              </div>
            </details>
          </div>
        </div>
      </section>

      <div className="cr-divider"></div>

      {/* 15. FAQ */}
      <section id="cr-faq">
        <div className="cr-wrap">
          <div className="cr-sec-head cr-center cr-reveal">
            <span className="cr-eyebrow cr-center">Questions</span>
            <h2 className="cr-sec-title">Frequently asked questions</h2>
          </div>
          <div className="cr-acc cr-reveal">
            <details><summary>What platform is the course hosted on?<span className="cr-tog">+</span></summary><div className="cr-acc-body"><p>The course is hosted on Skool, a modern platform that combines video lessons, community, and discussions in one place.</p></div></details>
            <details><summary>Is there a community included?<span className="cr-tog">+</span></summary><div className="cr-acc-body"><p>Yes. You get access to a private Skool community where we discuss code rules, share setups, and ask questions. Community access is completely free and included.</p></div></details>
            <details><summary>Who is this course for?<span className="cr-tog">+</span></summary><div className="cr-acc-body"><p>.NET developers who want clean, consistent, automated code. Great for individual developers, teams maintaining long-lived projects, and tech leads running code-quality initiatives.</p></div></details>
            <details><summary>What knowledge level do I need?<span className="cr-tog">+</span></summary><div className="cr-acc-body"><p>You should be comfortable with C# and basic .NET projects. The content is practical for beginner+ and intermediate developers, and still very useful for seniors and team leads who want a system to roll out.</p></div></details>
            <details><summary>Can I use this with .NET 6/7/8/9?<span className="cr-tog">+</span></summary><div className="cr-acc-body"><p>Yes. EditorConfig, analyzers, and dotnet format are part of the .NET SDK - not tied to a specific version. Everything is forward-compatible.</p></div></details>
            <details><summary>Do I get lifetime access?<span className="cr-tog">+</span></summary><div className="cr-acc-body"><p>Yes. Lifetime access to all lessons and every future update. No subscription, no renewal.</p></div></details>
            <details><summary>Will the price increase later?<span className="cr-tog">+</span></summary><div className="cr-acc-body"><p>Yes. The presale is 50% off the planned launch price ($149). When the course officially launches, the price goes up permanently.</p></div></details>
            <details><summary>Is there a refund policy?<span className="cr-tog">+</span></summary><div className="cr-acc-body"><p>Pre-orders are refundable up until the official course release. If you feel it&apos;s not for you, just reach out before launch.</p></div></details>
            <details><summary>What if I already have an .editorconfig?<span className="cr-tog">+</span></summary><div className="cr-acc-body"><p>Even better. The course shows you how to audit, improve, and enforce your existing setup - turning a basic config into a complete automated system.</p></div></details>
          </div>
        </div>
      </section>

      {/* 16. FINAL CTA */}
      <section className="cr-final">
        <div className="cr-wrap cr-reveal">
          <span className="cr-eyebrow cr-center">Stop arguing. Start enforcing.</span>
          <h2>Your codebase, clean - without relying on humans.</h2>
          <a href={CHECKOUT_URL} className="cr-btn cr-btn-primary lemonsqueezy-button">Reserve Your Spot - $74.89 →</a>
          <p className="cr-reassure" style={{ justifyContent: 'center', marginTop: 18 }}>Presale price · 50% off launch · Refundable until release · Lifetime access</p>
        </div>
      </section>

      {/* 18. STICKY BOTTOM CTA */}
      <div className="cr-stickybar" id="cr-stickybar">
        <div className="cr-wrap cr-sb-row">
          <div className="cr-sb-info">
            <span className="cr-sb-nm">Pragmatic .NET Code Rules</span>
            <span className="cr-sb-cd">Presale ends in <span id="cr-cd-bar">-</span></span>
          </div>
          <div className="cr-sb-right">
            <span className="cr-sb-pr">$74.89<span className="cr-s">$149</span></span>
            <a href={CHECKOUT_URL} className="cr-btn cr-btn-primary lemonsqueezy-button">Reserve</a>
          </div>
        </div>
      </div>

      <Script id="code-rules-page-js" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: PAGE_JS }} />
    </div>
  )
}

export default CodeRules;
