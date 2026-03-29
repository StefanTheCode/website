import SponsorsNewsletter from '@/components/sponsorsTestimonials';
import Image from 'next/image';
import config from '@/config.json';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: 'Sponsorship | TheCodeMan',
  description:
    'Sponsor TheCodeMan and reach a highly engaged audience of .NET developers, backend engineers, architects, and technical decision-makers through newsletter sponsorships.',
  openGraph: {
    title: 'Sponsorship | TheCodeMan',
    type: 'website',
    url: 'https://thecodeman.net/sponsorship',
    description:
      'Partner with TheCodeMan to promote your product to a highly engaged .NET developer audience through newsletter sponsorships and long-term website visibility.'
  },
  twitter: {
    title: 'Sponsorship | TheCodeMan',
    card: 'summary_large_image',
    site: '@TheCodeMan__',
    creator: '@TheCodeMan__',
    description:
      'Reach .NET developers, backend engineers, and software architects through TheCodeMan newsletter sponsorships.'
  }
};

const sponsors = [
  { src: '/images/sponsors/microsoft.svg', alt: 'Microsoft' },
  { src: '/images/sponsors/jetbrains.png', alt: 'JetBrains' },
  { src: '/images/sponsors/mongodb.svg', alt: 'MongoDB' },
  { src: '/images/sponsors/sentry.svg', alt: 'Sentry' },
  { src: '/images/sponsors/heroku.svg', alt: 'Heroku' },
  { src: '/images/sponsors/brilliant.svg', alt: 'Brilliant' },
  { src: '/images/sponsors/iron-software.svg', alt: 'Iron Software' },
  { src: '/images/sponsors/zzz-projects.svg', alt: 'ZZZ Projects' },
  { src: '/images/sponsors/uno-platform.svg', alt: 'Uno Platform' },
  { src: '/images/sponsors/coderabbit.svg', alt: 'CodeRabbit' },
];

const Sponsorship = () => {
  return (
    <section className="sponsorship-page">
      <div className="container">
        {/* Hero */}
        <div className="sp-hero">
          <span className="sp-eyebrow">Sponsor TheCodeMan</span>

          <h1 className="sp-hero__title">
            Reach .NET Developers Who
            <span className="text-yellow d-block">Actually Build Real Products</span>
          </h1>

          <p className="sp-hero__desc">
            Promote your product to a highly engaged audience of .NET developers,
            backend engineers, software architects, and technical decision-makers
            through a trusted weekly newsletter built around real-world .NET content.
          </p>

          <div className="sp-hero__badges">
            <span className="sp-badge">Growing by 1,000+ subscribers every month</span>
            <span className="sp-badge">Only 2 sponsor spots per issue</span>
          </div>

          <div className="sp-hero__cta">
            <a className="sp-btn" href="#reserveSpotForm">
              Book a Sponsorship
            </a>
          </div>
        </div>

        {/* Metrics */}
        <div className="sp-metrics">
          <div className="sp-metrics__grid">
            <div className="sp-metric">
              <span className="sp-metric__value">{config.NewsletterSubCount}</span>
              <span className="sp-metric__label">Newsletter subscribers</span>
            </div>
            <div className="sp-metric">
              <span className="sp-metric__value">1,000+</span>
              <span className="sp-metric__label">New subscribers every month</span>
            </div>
            <div className="sp-metric">
              <span className="sp-metric__value">{config.OpenRate}</span>
              <span className="sp-metric__label">Average open rate</span>
            </div>
            <div className="sp-metric">
              <span className="sp-metric__value">100–400</span>
              <span className="sp-metric__label">Typical sponsor clicks</span>
            </div>
          </div>
        </div>

        {/* Reach */}
        <div className="sp-section">
          <h2 className="sp-heading">Newsletter-first, backed by a strong developer brand</h2>
          <p className="sp-text">
            The main focus here is newsletter sponsorship, but the audience extends beyond email.
          </p>
          <p className="sp-text">
            TheCodeMan also reaches developers across <b className="text-yellow">100k+ on LinkedIn</b>,{' '}
            <b className="text-yellow">9k+ on X</b>, and{' '}
            <b className="text-yellow">3.5k+ on YouTube</b> — all built around practical .NET education and real-world software engineering content.
          </p>
        </div>

        {/* Why sponsor + Why brands */}
        <div className="sp-section sp-cols">
          <div>
            <h2 className="sp-heading">Why sponsor TheCodeMan?</h2>
            <p className="sp-text">
              Most developer ads fail because they feel generic, interruptive,
              and disconnected from the actual work developers do every day.
            </p>
            <p className="sp-text">
              My audience follows me because I create practical, real-world
              .NET content focused on architecture, performance, APIs,
              production lessons, tools, and modern development workflows.
            </p>
            <p className="sp-text">
              That means your sponsorship appears inside a trusted environment
              where developers are already looking for better tools, better
              workflows, and better ways to build software.
            </p>
          </div>
          <div className="sp-aside">
            <h3 className="sp-heading--sm">Why brands work with TheCodeMan</h3>
            <ul className="sp-list">
              <li>Trusted personal brand in the .NET ecosystem</li>
              <li>Highly engaged developer-first audience</li>
              <li>Native ad placement inside valuable content</li>
              <li>Permanent website visibility after the issue is sent</li>
            </ul>
          </div>
        </div>

        {/* Best fit */}
        <div className="sp-section">
          <h2 className="sp-heading">Best fit for sponsors like</h2>
          <div className="sp-tags">
            <span className="sp-tag">Developer tools</span>
            <span className="sp-tag">Cloud platforms</span>
            <span className="sp-tag">Databases & infrastructure products</span>
            <span className="sp-tag">Testing & observability tools</span>
            <span className="sp-tag">AI tools for developers</span>
            <span className="sp-tag">Technical education products</span>
            <span className="sp-tag">Hiring campaigns</span>
            <span className="sp-tag">Products built for software teams</span>
          </div>
        </div>

        {/* Trusted by */}
        <div className="sp-trusted">
          <p className="sp-trusted__label">Trusted by leading developer brands</p>
          <div className="sp-logos">
            {sponsors.map(({ src, alt }) =>
              src.endsWith('.svg') ? (
                <img
                  key={src}
                  src={src}
                  alt={alt}
                  className="sp-logo"
                />
              ) : (
                <Image
                  key={src}
                  src={src}
                  alt={alt}
                  width={160}
                  height={40}
                  className="sp-logo"
                />
              )
            )}
          </div>
        </div>

        {/* How it works */}
        <div className="sp-section">
          <h2 className="sp-heading">How it works</h2>
          <div className="sp-steps">
            <div className="sp-step">
              <span className="sp-step__num">01</span>
              <h3>Book your spot</h3>
              <p>
                Reserve your sponsorship date using the form below so your placement is secured.
              </p>
            </div>
            <div className="sp-step">
              <span className="sp-step__num">02</span>
              <h3>Send your copy</h3>
              <p>
                Share your message, links, and key positioning. I can also help refine the copy.
              </p>
            </div>
            <div className="sp-step">
              <span className="sp-step__num">03</span>
              <h3>Go live</h3>
              <p>
                Your sponsorship appears in the newsletter and stays published on the website archive.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="sp-section sp-testimonials">
          <h2 className="sp-heading">What sponsors say</h2>
          <SponsorsNewsletter />
        </div>

        {/* What you get + Ad creative */}
        <div className="sp-section sp-cols sp-cols--even">
          <div>
            <h2 className="sp-heading">What you get</h2>
            <ul className="sp-list">
              <li>Featured in one weekly issue</li>
              <li>Maximum 2 sponsors per issue</li>
              <li>Up to 2 links maximum</li>
              <li>Short native copy placement</li>
              <li>Permanent website archive placement</li>
              <li>Optional copy refinement for better fit</li>
            </ul>
          </div>
          <div>
            <h2 className="sp-heading">Ad creative requirements</h2>
            <ul className="sp-list">
              <li>1–2 strong sentences</li>
              <li>Up to 2 links</li>
              <li>Clear product value</li>
              <li>Clear CTA</li>
              <li>Developer-relevant messaging</li>
              <li>Subject to editorial approval</li>
            </ul>
          </div>
        </div>

        {/* Pricing */}
        <div className="sp-pricing-band">
          <div className="sp-pricing">
            <div className="sp-pricing__content">
              <span className="sp-eyebrow">Newsletter Sponsorship</span>
              <div className="sp-pricing__price">{config.SharedPrice}</div>
              <p>
                A premium placement inside one weekly issue, with permanent website visibility
                and a targeted .NET developer audience.
              </p>
              <div className="sp-pricing__points">
                <span>1 weekly issue</span>
                <span>Only 2 sponsors max</span>
                <span>100–400 typical clicks</span>
                <span>Permanent listing</span>
              </div>
            </div>
            <div className="sp-pricing__action">
              <a className="sp-btn" href="#reserveSpotForm">
                Reserve your spot
              </a>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="sp-section sp-cols sp-cols--even">
          <div>
            <h2 className="sp-heading">Example sponsorship</h2>
            <p className="sp-text">
              <a
                href="https://eomail4.com/web-version?p=a57fbf8c-8545-11ef-ae7d-85df232e2a82&pt=campaign&t=1728379993&s=784b945bc08f7b01ba1243c91db3cc19b19e59426863f51d69a39e55bbd61185"
                target="_blank"
                rel="noreferrer"
              >
                View newsletter example ↗
              </a>
            </p>
            <p className="sp-text">
              <a
                href="https://thecodeman.net/posts/how-to-use-singleton-in-multithreading?utm_source=sponsorship"
                target="_blank"
                rel="noreferrer"
              >
                View website example ↗
              </a>
            </p>
          </div>
          <div>
            <h2 className="sp-heading">Long-term visibility matters</h2>
            <p className="sp-text">
              Each sponsored issue stays published on the site, giving your placement
              ongoing visibility long after the email goes out.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="sp-section" id="reserveSpotForm">
          <div className="sp-form">
            <div className="sp-form__copy">
              <span className="sp-eyebrow">Book your sponsorship</span>
              <h2>Let's talk about your next placement</h2>
              <p>
                Use the form to reserve your spot, ask for availability, or check whether
                your product is the right fit for this audience.
              </p>
            </div>
            <div
              className="sp-form__embed"
              dangerouslySetInnerHTML={{
                __html: `
                <script async src="https://eomail4.com/form/9ade17e6-9c87-11ef-86b3-890d9e639bbe.js" data-form="9ade17e6-9c87-11ef-86b3-890d9e639bbe"></script>
              `
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsorship;