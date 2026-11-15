import { Metadata } from 'next';
import TestimonialWall, { TestimonialRating } from '@/components/TestimonialWall';
import Image from 'next/image';
import Script from 'next/script';
import FreePreviewButton from '@/components/FreePreviewButton';
import FreeMotion from '@/components/free/FreeMotion';
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

// Pricing. PRICE_NUM must match the Lemon Squeezy checkout price.
const PRICE_NUM = '74.89';
const FULL_PRICE_NUM = 150;
const PRICE = `$${PRICE_NUM}`;
const FULL_PRICE = `$${FULL_PRICE_NUM}`;
const SAVE = `$${Math.round(FULL_PRICE_NUM - Number(PRICE_NUM))}`;

// Curriculum. When a module is released, flip `live` to true -
// the "x/12 modules live" progress, badges and lesson counts update everywhere.
type Lesson = { n: string; title: string; preview?: string; tag?: 'ai' | 'bonus' };
type CourseModule = { icon: string; num: string; title: string; live: boolean; lessons: Lesson[] };

const CURRICULUM: CourseModule[] = [
  {
    icon: '🧱', num: '00', title: 'Course Introduction', live: true,
    lessons: [
      { n: '00.01', title: 'Welcome', preview: 'vlJhmURwVSM' },
      { n: '00.02', title: 'What You Will Learn', preview: 'o9rwJhYA-P4' },
      { n: '00.03', title: 'Who This Course Is For', preview: 'poQCgDSWfdw' },
      { n: '00.04', title: 'Tools & Requirements', preview: 'PMqs_dSs0LU' },
      { n: '00.05', title: 'How to follow the course', preview: '2fUxoUnMpI0' },
    ],
  },
  {
    icon: '🗂️', num: '01', title: 'The Foundation: EditorConfig', live: true,
    lessons: [
      { n: '01.00', title: 'Module Intro', preview: 'vBLHCsSoHP0' },
      { n: '01.01', title: 'Why Code Style Consistency Matters', preview: 'L8BtAQO1t4I' },
      { n: '01.02', title: 'Creating the CleanStart Solution Structure' },
      { n: '01.03', title: 'What EditorConfig Is & How It Works' },
      { n: '01.04', title: 'Adding the .editorconfig File' },
      { n: '01.05', title: 'Running Code Cleanup to Apply Rules' },
      { n: '01.06', title: 'EditorConfig Tips, Tricks & Best Practices' },
      { n: '01.07', title: 'Chapter Recap' },
    ],
  },
  {
    icon: '🧹', num: '02', title: 'Automating Code Cleanup', live: true,
    lessons: [
      { n: '02.00', title: 'Module Intro', preview: 'CzkPS4jzgsY' },
      { n: '02.01', title: 'Visual Studio Code Cleanup Profiles' },
      { n: '02.02', title: 'Running Cleanup Automatically on Save' },
      { n: '02.03', title: 'One-Click Full Solution Cleanup' },
      { n: '02.04', title: 'Git Pre-Commit Hooks for Formatting' },
      { n: '02.05', title: 'Chapter Recap' },
    ],
  },
  {
    icon: '🚨', num: '03', title: 'Diagnostics & Warnings as Errors', live: true,
    lessons: [
      { n: '03.01', title: 'Understanding Diagnostic Severities' },
      { n: '03.02', title: 'Organizing Rules: Suggestion, Warning, Error' },
      { n: '03.03', title: 'Enforcing Warnings as Errors in .NET Projects' },
      { n: '03.04', title: 'How This Prevents Future Bugs' },
      { n: '03.05', title: 'Chapter Recap' },
    ],
  },
  {
    icon: '🔍', num: '04', title: 'Static Analysis in .NET', live: true,
    lessons: [
      { n: '04.01', title: 'Introduction to .NET Analyzers' },
      { n: '04.02', title: 'Adding StyleCop to the Project' },
      { n: '04.03', title: 'Adding SonarAnalyzer for Deeper Analysis' },
      { n: '04.04', title: 'Configuring Analyzer Rules in EditorConfig' },
      { n: '04.05', title: 'Identifying Real-World Issues with Static Analysis' },
      { n: '04.06', title: 'Chapter Recap' },
    ],
  },
  {
    icon: '🏗️', num: '05', title: 'Centralized Settings: Directory.Build.props', live: true,
    lessons: [
      { n: '05.01', title: 'Why Centralized Build Settings Matter' },
      { n: '05.02', title: 'Creating Directory.Build.props' },
      { n: '05.03', title: 'Adding Global Usings, LangVersion & Nullable' },
      { n: '05.04', title: 'Unifying All Projects with Shared Rules' },
      { n: '05.B', title: 'Central Package Management', tag: 'bonus' },
      { n: '05.05', title: 'Chapter Recap' },
    ],
  },
  {
    icon: '⚙️', num: '06', title: 'Visual Studio Productivity & Clean Code', live: true,
    lessons: [
      { n: '06.01', title: 'Essential VS Formatting Features' },
      { n: '06.02', title: 'File Header Templates' },
      { n: '06.03', title: 'Custom Snippets for Faster Development' },
      { n: '06.04', title: 'Format on Save, Run Cleanup on Build' },
      { n: '06.05', title: 'Chapter Recap' },
    ],
  },
  {
    icon: '🧹', num: '07', title: 'Project Cleanup & Consistency', live: true,
    lessons: [
      { n: '07.00', title: 'Module Intro' },
      { n: '07.01', title: 'Standard Project Folder Structure' },
      { n: '07.02', title: 'Enabling Nullable & Analyzing Warnings' },
      { n: '07.03', title: 'Removing Unused Files, Refs & Dependencies' },
      { n: '07.04', title: 'Normalizing Namespaces & Usings' },
      { n: '07.05', title: 'Tools Find, AI Fixes, the Build Verifies', tag: 'ai' },
      { n: '07.06', title: 'Chapter Recap' },
    ],
  },
  {
    icon: '🧱', num: '08', title: 'Architecture Tests', live: true,
    lessons: [
      { n: '08.00', title: 'Module Intro' },
      { n: '08.01', title: 'Why Architecture Tests Matter' },
      { n: '08.02', title: 'Adding NetArchTest' },
      { n: '08.03', title: 'Testing Domain → Application → Infrastructure' },
      { n: '08.04', title: 'Preventing Cycles & Wrong References' },
      { n: '08.05', title: 'Architecture Tests as Guardrails for Agents', tag: 'ai' },
      { n: '08.06', title: 'Chapter Recap' },
    ],
  },
  {
    icon: '🔄', num: '09', title: 'Integrating Code Quality into CI/CD', live: true,
    lessons: [
      { n: '09.00', title: 'Module Intro' },
      { n: '09.01', title: 'dotnet format in CI' },
      { n: '09.02', title: 'Running Analyzers in CI' },
      { n: '09.03', title: 'Enforcing Warnings as Errors in the Pipeline' },
      { n: '09.04', title: 'Preventing "Dirty Code" from Entering Main' },
      { n: '09.05', title: 'Same Gates for Human and AI Pull Requests', tag: 'ai' },
      { n: '09.06', title: 'Chapter Recap' },
    ],
  },
  {
    icon: '🧭', num: '10', title: 'Logging & Observability', live: false,
    lessons: [
      { n: '10.00', title: 'Module Intro' },
      { n: '10.01', title: 'Adding Serilog to the Project' },
      { n: '10.02', title: 'Structured Logging Best Practices' },
      { n: '10.03', title: 'Keeping Sensitive Data Out of Logs' },
      { n: '10.04', title: 'Adding OpenTelemetry (OTEL) Basics' },
      { n: '10.05', title: 'Tracing Requests in an API' },
      { n: '10.06', title: 'AI Writes Bad Logs - and Reads Your Traces', tag: 'ai' },
      { n: '10.07', title: 'Chapter Recap' },
    ],
  },
  {
    icon: '🎁', num: '11', title: 'Bonus: Your Own Clean .NET Template', live: false,
    lessons: [
      { n: '11.01', title: 'Turning the CleanStart Solution Into a Template' },
      { n: '11.02', title: 'Exporting as a Visual Studio Template' },
      { n: '11.03', title: 'Exporting as a dotnet new Template' },
      { n: '11.04', title: 'Sharing the Template with Your Team' },
      { n: '11.05', title: 'Course Wrap-Up' },
    ],
  },
  {
    icon: '🤖', num: '12', title: 'AI-Assisted Dependency & PR Review', live: false,
    lessons: [
      { n: '12.01', title: 'Why Use AI for Dependency Updates' },
      { n: '12.02', title: 'Setting Up Dependabot for NuGet in .NET' },
      { n: '12.03', title: 'Creating a GitHub Action for AI PR Review' },
      { n: '12.04', title: 'Designing Effective Prompts for Safe Updates' },
      { n: '12.05', title: 'Optional: Labels, Changelog & Notifications' },
      { n: '12.06', title: 'Chapter Recap' },
    ],
  },
];

const COURSE_MODULES = CURRICULUM.filter((m) => m.num !== '00');
const MODULES_TOTAL = COURSE_MODULES.length;
const MODULES_DONE = COURSE_MODULES.filter((m) => m.live).length;
const PROGRESS_PCT = Math.round((MODULES_DONE / MODULES_TOTAL) * 100);
const countLessons = (mods: CourseModule[]) => mods.reduce((sum, m) => sum + m.lessons.length, 0);
const tensPlus = (n: number) => `${Math.floor(n / 10) * 10}+`;
const LESSONS_TOTAL_LABEL = tensPlus(countLessons(CURRICULUM));
const LESSONS_LIVE_LABEL = tensPlus(countLessons(CURRICULUM.filter((m) => m.live)));

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
        `A practical .NET code quality system using EditorConfig, Roslyn analyzers, TreatWarningsAsErrors, Visual Studio code cleanup, Git hooks, and CI quality gates. ${MODULES_TOTAL} modules and ${LESSONS_TOTAL_LABEL} video lessons with production-ready configs, including AI Bonus lessons on guardrails for Claude Code and GitHub Copilot. ${MODULES_DONE} of ${MODULES_TOTAL} modules are live now.`,
      provider: {
        '@type': 'Person',
        name: 'Stefan Djokic',
        url: 'https://thecodeman.net',
      },
      offers: {
        '@type': 'Offer',
        price: PRICE_NUM,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
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
        'Keeping sensitive data out of logs with .NET redaction',
        'GitHub Actions quality gates, lock files, NuGetAudit and branch rulesets',
        'Guardrails for AI coding agents with CLAUDE.md and architecture tests',
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
          name: 'Can I use this course with .NET 6, 7, 8, 9, or 10?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. EditorConfig, Roslyn analyzers, and dotnet format are part of the SDK and are not tied to a specific .NET version. The course itself is recorded on .NET 10, and everything is forward-compatible.',
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
          name: 'Will the course price increase?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Yes. Right now the course is ${PRICE} instead of ${FULL_PRICE}, because the last modules are still being released. When all ${MODULES_TOTAL} modules are live, the price goes to ${FULL_PRICE}. If you buy now, you get every future module and update at no extra cost.`,
          },
        },
        {
          '@type': 'Question',
          name: 'Is the Pragmatic .NET Code Rules course finished?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${MODULES_DONE} of ${MODULES_TOTAL} modules are live (${LESSONS_LIVE_LABEL} lessons) and you get instant access to all of them. The remaining modules are released as they are finished, and you get them automatically.`,
          },
        },
        {
          '@type': 'Question',
          name: 'Is there a refund policy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. There is a 14-day money-back guarantee. If the course is not for you, reach out within 14 days of purchase for a full refund.',
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

      <FreeMotion />
      <div className="cr-ambience" aria-hidden="true"></div>
      <div className="cr-grain" aria-hidden="true"></div>

      {/* 1. ANNOUNCEMENT / PROGRESS BAR */}
      <div className="cr-topbar">
        <span>🔥 <b>{MODULES_DONE}/{MODULES_TOTAL} modules live.</b> Get instant access at {PRICE} - the price goes to {FULL_PRICE} when all {MODULES_TOTAL} are out.</span>
        <span className="cr-topbar-prog">
          <span className="cr-progress" role="progressbar" aria-label="Modules live" aria-valuemin={0} aria-valuemax={MODULES_TOTAL} aria-valuenow={MODULES_DONE}>
            <span className="cr-progress-fill" style={{ width: `${PROGRESS_PCT}%` }}></span>
          </span>
          <span className="cr-topbar-pct">{MODULES_DONE}/{MODULES_TOTAL}</span>
        </span>
      </div>

      {/* 2. COURSE-ONLY STICKY NAV */}
      <nav className="cr-nav">
        <div className="cr-wrap cr-nav-row">
          <a className="cr-brand" href="/" aria-label="TheCodeMan home">
            <Image
              src="/images/thecodeman-logo-96.webp"
              alt="Stefan Đokić"
              width={40}
              height={40}
              className="cr-brand-logo"
            />
          </a>
          <div className="cr-nav-links">
            <a href="#cr-problem">The Problem</a>
            <a href="#cr-learn">What You Learn</a>
            <a href="#cr-pricing">Pricing</a>
            <a href="#cr-curriculum">Curriculum</a>
            <a href="#cr-faq">FAQ</a>
          </div>
          <div className="cr-nav-right">
            <span className="cr-nav-price"><span className="cr-s">{FULL_PRICE}</span><b>{PRICE}</b></span>
            <a href={CHECKOUT_URL} className="cr-btn cr-btn-primary lemonsqueezy-button">Get Instant Access</a>
          </div>
        </div>
      </nav>

      <div id="cr-top"></div>

      {/* 3. HERO */}
      <header className="cr-hero" id="cr-hero">
        <div className="cr-wrap cr-hero-grid">
          <div className="cr-reveal">
            <span className="cr-chip">{MS} By Stefan Đokić · Microsoft MVP</span>
            <h1>Make your .NET codebase <span className="cr-amber crk-shimmer">enforce itself.</span></h1>
            <p className="cr-lead">Get the exact <code>.editorconfig</code>, Roslyn analyzers, CI quality gates, and automation I use in production. Stop arguing about code style - let the build do it. Copy, apply, ship.</p>
            <div className="cr-status">
              <div className="cr-status-row">
                <span><span className="cr-live-dot"></span><b>{MODULES_DONE} of {MODULES_TOTAL} modules live</b> · {LESSONS_LIVE_LABEL} lessons ready to watch</span>
                <span className="cr-pct">{PROGRESS_PCT}%</span>
              </div>
              <span className="cr-progress" role="progressbar" aria-label="Modules live" aria-valuemin={0} aria-valuemax={MODULES_TOTAL} aria-valuenow={MODULES_DONE}>
                <span className="cr-progress-fill" style={{ width: `${PROGRESS_PCT}%` }}></span>
              </span>
              <p className="cr-status-note">Discounted to {PRICE} (was {FULL_PRICE}) until the course is complete. New modules unlock for you the day they&apos;re released.</p>
            </div>
            <div className="cr-cta">
              <a href={CHECKOUT_URL} className="cr-btn cr-btn-primary lemonsqueezy-button">Get Instant Access - {PRICE} <span className="cr-old">{FULL_PRICE}</span> →</a>
              <a href="#cr-curriculum" className="cr-btn cr-btn-ghost">See the curriculum</a>
            </div>
            <p className="cr-reassure">Instant access <span className="cr-dot"></span> 14-day money-back guarantee <span className="cr-dot"></span> lifetime access + every new module</p>
            <div className="cr-hero-rating">
              <TestimonialRating slug="course" />
            </div>
          </div>
          <div className="cr-cover cr-reveal">
            <div className="cr-glow"></div>
            <div className="cr-frame">
              {/* Save the chosen Higgsfield render as public/images/course-hero.webp
                  (recommended: the "Stefan holding the box" image). */}
              <Image src="/images/course-hero.webp" alt="Stefan Đokić holding the Pragmatic .NET Code Rules course" width={1152} height={928} sizes="(max-width:940px) 100vw, 50vw" style={{ width: '100%', height: 'auto', display: 'block' }} priority />
            </div>
          </div>
        </div>
      </header>

      {/* 4. CREDIBILITY STRIP */}
      <div className="cr-cred">
        <div className="cr-wrap cr-cred-row">
          <span><b>Microsoft MVP</b></span><span className="cr-sep"></span>
          <span><b>21,000+</b> newsletter readers</span><span className="cr-sep"></span>
          <span><b>110k+</b> LinkedIn</span><span className="cr-sep"></span>
          <span><b>{MODULES_DONE}/{MODULES_TOTAL}</b> modules live · <b>{LESSONS_TOTAL_LABEL}</b> lessons</span><span className="cr-sep"></span>
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
              <div className="cr-spot-av"><Image src="/images/testimonials/testimonial2.jpg" alt="Anton Martyniuk" width={56} height={56} /></div>
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
              <Image src="/images/course2.webp" alt="Code inconsistency across a .NET team" width={1152} height={928} sizes="(max-width:860px) 100vw, 40vw" style={{ width: '100%', height: 'auto', display: 'block' }} />
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
            <p className="cr-sec-sub">Production-tested techniques across {MODULES_TOTAL} modules and {LESSONS_TOTAL_LABEL} lessons, including AI Bonus lessons for Claude Code and GitHub Copilot.</p>
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
            <div className="cr-media"><div className="cr-media-frame"><Image src="/images/mindset.webp" alt="The code consistency mindset" width={3800} height={2148} sizes="(max-width:860px) 100vw, 50vw" style={{ width: '100%', height: 'auto', display: 'block' }} /></div></div>
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
            <div className="cr-media"><div className="cr-media-frame"><Image src="/images/editorconfig.webp" alt=".editorconfig deep dive" width={4972} height={3608} sizes="(max-width:860px) 100vw, 50vw" style={{ width: '100%', height: 'auto', display: 'block' }} /></div></div>
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
            <div className="cr-media"><div className="cr-media-frame"><Image src="/images/cleanup.webp" alt="Visual Studio cleanup automation" width={860} height={620} sizes="(max-width:860px) 100vw, 50vw" style={{ width: '100%', height: 'auto', display: 'block' }} /></div></div>
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
            <div className="cr-media"><div className="cr-media-frame"><Image src="/images/errors.webp" alt="Analyzers and warnings as errors" width={600} height={383} sizes="(max-width:860px) 100vw, 50vw" style={{ width: '100%', height: 'auto', display: 'block' }} /></div></div>
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
            <div className="cr-media"><div className="cr-media-frame"><Image src="/images/ci.png" alt="dotnet format and CI enforcement" width={908} height={289} sizes="(max-width:860px) 100vw, 50vw" style={{ width: '100%', height: 'auto', display: 'block' }} /></div></div>
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
            <div className="cr-media"><div className="cr-media-frame"><Image src="/images/slack.webp" alt="Team-wide adoption strategies" width={1024} height={1467} sizes="(max-width:860px) 100vw, 50vw" style={{ width: '100%', height: 'auto', display: 'block' }} /></div></div>
          </div>
        </div>
      </section>

      <div className="cr-divider"></div>

      {/* 8. BONUSES */}
      <section>
        <div className="cr-wrap">
          <div className="cr-sec-head cr-center cr-reveal">
            <span className="cr-eyebrow cr-center">Included with your purchase</span>
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
          <p className="cr-bonus-foot cr-reveal">Bonuses total <s>$107</s> · <b>Yours free with the course</b></p>
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
                <li><span className="cr-ic">✔</span> {MODULES_DONE}/{MODULES_TOTAL} modules live, {LESSONS_LIVE_LABEL} lessons today</li>
                <li><span className="cr-ic">✔</span> AI Bonus lessons: Claude Code &amp; Copilot</li>
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

      {/* 10. TESTIMONIALS */}
      <section>
        <div className="cr-wrap">
          <div className="cr-sec-head cr-center cr-reveal">
            <span className="cr-eyebrow cr-center">Proof</span>
            <h2 className="cr-sec-title">What developers are saying</h2>
            <p className="cr-sec-sub">Specific feedback from engineers who already had opinions about code quality before they bought this.</p>
          </div>

          <div className="cr-reveal">

            <TestimonialWall slug="course" />

          </div>
        </div>
      </section>

      <div className="cr-divider"></div>

      {/* 11. ABOUT */}
      <section>
        <div className="cr-wrap cr-about">
          <div className="cr-reveal">
            <div className="cr-media-frame"><Image src="/images/ebook-stefan.webp" alt="Stefan Đokić, Microsoft MVP" width={1536} height={2040} sizes="(max-width:860px) 100vw, 360px" style={{ width: '100%', height: 'auto', display: 'block' }} /></div>
          </div>
          <div className="cr-reveal">
            <span className="cr-mvp-pill">{MS} Microsoft MVP</span>
            <h2>This isn&apos;t theory - it&apos;s how I ship production code.</h2>
            <p>Hi, I&apos;m <b>Stefan Đokić</b> - Microsoft MVP, Senior Software Engineer, and creator of TheCodeMan.net.</p>
            <p>For more than 10 years I&apos;ve been building large-scale .NET solutions where consistency, clarity, and automation aren&apos;t optional - they&apos;re the only way teams ship fast and reliably.</p>
            <p>Everything in this course comes from real production experience. These are the exact files and configs I use every day - not theory, not &quot;ideal world&quot; scenarios.</p>
            <div className="cr-about-stats">
              <div><div className="cr-v crk-count" data-target="25000" data-comma="1" data-suffix="+">0+</div><div className="cr-l">Newsletter</div></div>
              <div><div className="cr-v crk-count" data-target="110" data-suffix="k+">0k+</div><div className="cr-l">LinkedIn</div></div>
              <div><div className="cr-v crk-count" data-target="8000" data-comma="1" data-suffix="+">0+</div><div className="cr-l">Twitter / X</div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="cr-divider"></div>

      {/* 12. PRICING */}
      <section id="cr-pricing">
        <div className="cr-wrap">
          <div className="cr-sec-head cr-center cr-reveal">
            <span className="cr-eyebrow cr-center">Discounted until the course is complete</span>
            <h2 className="cr-sec-title">Get it now, before the price goes to {FULL_PRICE}.</h2>
          </div>
          <div className="cr-pricing cr-reveal">
            <div className="cr-price-card">
              <div className="cr-ribbon">50% OFF</div>
              <h3>Pragmatic .NET Code Rules</h3>
              <p className="cr-psub">Instant access to {MODULES_DONE}/{MODULES_TOTAL} modules + every new module as it&apos;s released</p>
              <div className="cr-amt"><span className="cr-now">{PRICE}</span><span className="cr-was">{FULL_PRICE}</span></div>
              <p className="cr-save">Save {SAVE} · Price goes to {FULL_PRICE} when all {MODULES_TOTAL} modules are live</p>
              <ul>
                <li><span className="cr-ic">✔</span> Instant access: {MODULES_DONE}/{MODULES_TOTAL} modules, {LESSONS_LIVE_LABEL} lessons today</li>
                <li><span className="cr-ic">✔</span> Remaining modules added free as they&apos;re released</li>
                <li><span className="cr-ic">✔</span> AI Bonus lessons: Claude Code &amp; Copilot inside your rules</li>
                <li><span className="cr-ic">✔</span> Production-ready config files</li>
                <li><span className="cr-ic">✔</span> CI quality gate template + Starter Kit</li>
                <li><span className="cr-ic">✔</span> Clean Commit Checklist (PDF)</li>
                <li><span className="cr-ic">✔</span> Bonus: AI-assisted PR review video</li>
                <li><span className="cr-ic">✔</span> Community access (free, lifetime)</li>
                <li><span className="cr-ic">✔</span> Lifetime access + all future updates</li>
              </ul>
              <a href={CHECKOUT_URL} className="cr-btn cr-btn-primary lemonsqueezy-button">Get Instant Access →</a>
              <p className="cr-grt">14-day money-back guarantee · Secure checkout via Lemon Squeezy</p>
            </div>
            <div className="cr-why">
              <h3>Why buy now?</h3>
              <div className="cr-why-item"><span className="cr-ic">🔓</span><div><div className="cr-t">Instant access</div><div className="cr-d">Start today with {MODULES_DONE} modules and {LESSONS_LIVE_LABEL} lessons. No waiting for a launch date.</div></div></div>
              <div className="cr-why-item"><span className="cr-ic">⏰</span><div><div className="cr-t">Lowest price it will ever be</div><div className="cr-d">{PRICE} instead of {FULL_PRICE}. The price goes up when all {MODULES_TOTAL} modules are live.</div></div></div>
              <div className="cr-why-item"><span className="cr-ic">🤖</span><div><div className="cr-t">AI Bonus lessons</div><div className="cr-d">Claude Code and Copilot working inside your rules, not around them.</div></div></div>
              <div className="cr-why-item"><span className="cr-ic">🔄</span><div><div className="cr-t">Zero risk</div><div className="cr-d">14-day money-back guarantee. Not for you? Get a full refund.</div></div></div>
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
            <h2 className="cr-sec-title">{MODULES_TOTAL} modules. {LESSONS_TOTAL_LABEL} lessons. {MODULES_DONE} live now.</h2>
            <p className="cr-sec-sub">Click any module to expand. <span className="cr-st cr-st-live">Live</span> modules are ready to watch today, <span className="cr-st cr-st-soon">Coming soon</span> ones unlock for you as they&apos;re released. <span className="cr-tag cr-tag-ai">🤖 AI Bonus</span> lessons show Claude Code and Copilot working inside your rules, and <span className="cr-good">Free preview</span> lessons are open before you buy.</p>
          </div>
          <div className="cr-acc cr-reveal">
            {CURRICULUM.map((m) => (
              <details key={m.num} open={m.num === '00'} className={m.live ? undefined : 'cr-soon'}>
                <summary>
                  {m.icon} {m.num} · {m.title}
                  <span className={m.live ? 'cr-st cr-st-live' : 'cr-st cr-st-soon'}>{m.live ? 'Live' : 'Coming soon'}</span>
                  <span className="cr-meta">{m.lessons.length} lessons</span><span className="cr-tog">+</span>
                </summary>
                <div className="cr-acc-body">
                  {m.lessons.map((l) => (
                    <div className="cr-lesson" key={l.n}>
                      <span className="cr-n">{l.n}</span> {l.title}
                      {l.tag === 'ai' && <span className="cr-tag cr-tag-ai">🤖 AI Bonus</span>}
                      {l.tag === 'bonus' && <span className="cr-tag">Bonus</span>}
                      {l.preview && <FreePreviewButton videoId={l.preview} />}
                    </div>
                  ))}
                </div>
              </details>
            ))}
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
            <details><summary>Can I use this with .NET 6/7/8/9/10?<span className="cr-tog">+</span></summary><div className="cr-acc-body"><p>Yes. EditorConfig, analyzers, and dotnet format are part of the .NET SDK - not tied to a specific version. The course itself is recorded on .NET 10, and everything is forward-compatible.</p></div></details>
            <details><summary>Do I get lifetime access?<span className="cr-tog">+</span></summary><div className="cr-acc-body"><p>Yes. Lifetime access to all lessons and every future update. No subscription, no renewal.</p></div></details>
            <details><summary>Is the course finished?<span className="cr-tog">+</span></summary><div className="cr-acc-body"><p>{MODULES_DONE} of {MODULES_TOTAL} modules are live ({LESSONS_LIVE_LABEL} lessons), and you get instant access to all of them. The remaining modules are released as they&apos;re finished, and they unlock for you automatically.</p></div></details>
            <details><summary>Will the price increase later?<span className="cr-tog">+</span></summary><div className="cr-acc-body"><p>Yes. Right now the course is {PRICE} instead of {FULL_PRICE}, because the last modules are still being released. When all {MODULES_TOTAL} modules are live, the price goes to {FULL_PRICE}. Buy now and you keep every future module and update at no extra cost.</p></div></details>
            <details><summary>Is there a refund policy?<span className="cr-tog">+</span></summary><div className="cr-acc-body"><p>Yes. There&apos;s a 14-day money-back guarantee. If you feel it&apos;s not for you, reach out within 14 days of purchase and you get a full refund.</p></div></details>
            <details><summary>What if I already have an .editorconfig?<span className="cr-tog">+</span></summary><div className="cr-acc-body"><p>Even better. The course shows you how to audit, improve, and enforce your existing setup - turning a basic config into a complete automated system.</p></div></details>
          </div>
        </div>
      </section>

      {/* 16. FINAL CTA */}
      <section className="cr-final">
        <div className="cr-wrap cr-reveal">
          <span className="cr-eyebrow cr-center">Stop arguing. Start enforcing.</span>
          <h2>Your codebase, clean - without relying on humans.</h2>
          <a href={CHECKOUT_URL} className="cr-btn cr-btn-primary lemonsqueezy-button">Get Instant Access - {PRICE} <span className="cr-old">{FULL_PRICE}</span> →</a>
          <p className="cr-reassure" style={{ justifyContent: 'center', marginTop: 18 }}>{MODULES_DONE}/{MODULES_TOTAL} modules live · 50% off until the course is complete · 14-day money-back · Lifetime access</p>
        </div>
      </section>

      {/* 18. STICKY BOTTOM CTA */}
      <div className="cr-stickybar" id="cr-stickybar">
        <div className="cr-wrap cr-sb-row">
          <div className="cr-sb-info">
            <span className="cr-sb-nm">Pragmatic .NET Code Rules</span>
            <span className="cr-sb-cd">{MODULES_DONE}/{MODULES_TOTAL} modules live · {FULL_PRICE} when complete</span>
          </div>
          <div className="cr-sb-right">
            <span className="cr-sb-pr">{PRICE}<span className="cr-s">{FULL_PRICE}</span></span>
            <a href={CHECKOUT_URL} className="cr-btn cr-btn-primary lemonsqueezy-button">Get Access</a>
          </div>
        </div>
      </div>

      <Script id="code-rules-page-js" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: PAGE_JS }} />
    </div>
  )
}

export default CodeRules;
