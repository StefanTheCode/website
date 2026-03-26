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
  '/images/sponsors/postman.png',
  '/images/sponsors/jetbrains.png',
  '/images/sponsors/neon.png',
  '/images/sponsors/abp.png'
];

const Sponsorship = () => {
  return (
    <section className="sponsorship-page">
      <div className="container">
        {/* HERO */}
        <div className="hero-card">
          <span className="eyebrow">Sponsor TheCodeMan</span>

          <h1 className="hero-title">
            Reach .NET Developers Who
            <span className="text-yellow d-block">Actually Build Real Products</span>
          </h1>

          <p className="hero-description">
            Promote your product to a highly engaged audience of .NET developers,
            backend engineers, software architects, and technical decision-makers
            through a trusted weekly newsletter built around real-world .NET content.
          </p>

          <div className="hero-meta">
            <span className="hero-badge">Growing by 1,000+ subscribers every month</span>
            <span className="hero-badge">Only 2 sponsor spots per issue</span>
          </div>

          <div className="hero-cta">
            <a className="btn btn-primary border-radius-5px" href="#reserveSpotForm">
              Book a Sponsorship
            </a>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid section-spacing-sm">
          <div className="stat-card">
            <div className="stat-value">{config.NewsletterSubCount}</div>
            <div className="stat-label">Newsletter subscribers</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">1,000+</div>
            <div className="stat-label">New subscribers every month</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{config.OpenRate}</div>
            <div className="stat-label">Average open rate</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">100–400</div>
            <div className="stat-label">Typical sponsor clicks</div>
          </div>
        </div>

        {/* EXTRA REACH */}
        <div className="content-card section-spacing-sm">
          <div className="section-header">
            <h2>Newsletter-first, backed by a strong developer brand</h2>
          </div>

          <p className="mb-2">
            The main focus here is newsletter sponsorship, but the audience extends beyond email.
          </p>

          <p className="mb-0">
            TheCodeMan also reaches developers across <b className="text-yellow">100k+ on LinkedIn</b>,{' '}
            <b className="text-yellow">9k+ on X</b>, and{' '}
            <b className="text-yellow">3.5k+ on YouTube</b> — all built around practical .NET education and real-world software engineering content.
          </p>
        </div>

        {/* WHY + WHY BRANDS */}
        <div className="two-column-grid section-spacing">
          <div className="content-card">
            <div className="section-header">
              <h2>Why sponsor TheCodeMan?</h2>
            </div>

            <p>
              Most developer ads fail because they feel generic, interruptive,
              and disconnected from the actual work developers do every day.
            </p>

            <p>
              My audience follows me because I create practical, real-world
              .NET content focused on architecture, performance, APIs,
              production lessons, tools, and modern development workflows.
            </p>

            <p className="mb-0">
              That means your sponsorship appears inside a trusted environment
              where developers are already looking for better tools, better
              workflows, and better ways to build software.
            </p>
          </div>

          <div className="content-card">
            <div className="section-header">
              <h2>Why brands work with TheCodeMan</h2>
            </div>

            <ul className="clean-list">
              <li>Trusted personal brand in the .NET ecosystem</li>
              <li>Highly engaged developer-first audience</li>
              <li>Native ad placement inside valuable content</li>
              <li>Permanent website visibility after the issue is sent</li>
            </ul>
          </div>
        </div>

        {/* WHO THIS IS FOR */}
        <div className="section-spacing">
          <div className="section-header">
            <h2>Best fit for sponsors like</h2>
          </div>

          <div className="feature-grid">
            <div className="feature-card">Developer tools</div>
            <div className="feature-card">Cloud platforms</div>
            <div className="feature-card">Databases & infrastructure products</div>
            <div className="feature-card">Testing & observability tools</div>
            <div className="feature-card">AI tools for developers</div>
            <div className="feature-card">Technical education products</div>
            <div className="feature-card">Hiring campaigns</div>
            <div className="feature-card">Products built for software teams</div>
          </div>
        </div>

        {/* TRUSTED BY */}
        <div className="section-spacing">
          <div className="section-header text-center">
            <h2>Trusted by sponsors</h2>
            <p>Companies use TheCodeMan to reach developers building real-world applications.</p>
          </div>

          <div className="logo-strip">
            {sponsors.map((src) => (
              <div className="logo-card" key={src}>
                <Image
                  src={src}
                  alt="Sponsor logo"
                  width={220}
                  height={80}
                  className="logo-image"
                />
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="section-spacing">
          <div className="section-header">
            <h2>How it works</h2>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">01</span>
              <h3>Book your spot</h3>
              <p className="mb-0">
                Reserve your sponsorship date using the form below so your placement is secured.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">02</span>
              <h3>Send your copy</h3>
              <p className="mb-0">
                Share your message, links, and key positioning. I can also help refine the copy.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">03</span>
              <h3>Go live</h3>
              <p className="mb-0">
                Your sponsorship appears in the newsletter and stays published on the website archive.
              </p>
            </div>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="section-spacing">
          <div className="section-header">
            <h2>What sponsors say</h2>
          </div>
          <div className="content-card">
            <SponsorsNewsletter />
          </div>
        </div>

        {/* WHAT YOU GET + CREATIVE */}
        <div className="two-column-grid section-spacing">
          <div className="content-card">
            <div className="section-header">
              <h2>What you get</h2>
            </div>

            <ul className="clean-list">
              <li>Featured in one weekly issue</li>
              <li>Maximum 2 sponsors per issue</li>
              <li>Up to 2 links maximum</li>
              <li>Short native copy placement</li>
              <li>Permanent website archive placement</li>
              <li>Optional copy refinement for better fit</li>
            </ul>
          </div>

          <div className="content-card">
            <div className="section-header">
              <h2>Ad creative requirements</h2>
            </div>

            <ul className="clean-list">
              <li>1–2 strong sentences</li>
              <li>Up to 2 links</li>
              <li>Clear product value</li>
              <li>Clear CTA</li>
              <li>Developer-relevant messaging</li>
              <li>Subject to editorial approval</li>
            </ul>
          </div>
        </div>

        {/* PRICING */}
        <div className="section-spacing">
          <div className="pricing-card">
            <div className="pricing-content">
              <span className="pricing-eyebrow">Newsletter Sponsorship</span>
              <h2>{config.SharedPrice}</h2>
              <p>
                A premium placement inside one weekly issue, with permanent website visibility
                and a targeted .NET developer audience.
              </p>

              <div className="pricing-points">
                <span>1 weekly issue</span>
                <span>Only 2 sponsors max</span>
                <span>100–400 typical clicks</span>
                <span>Permanent listing</span>
              </div>
            </div>

            <div className="pricing-action">
              <a className="btn btn-primary border-radius-5px" href="#reserveSpotForm">
                Reserve your spot
              </a>
            </div>
          </div>
        </div>

        {/* EXAMPLE */}
        <div className="two-column-grid section-spacing">
          <div className="content-card">
            <div className="section-header">
              <h2>Example sponsorship</h2>
            </div>

            <p className="mb-2">
              <a
                href="https://eomail4.com/web-version?p=a57fbf8c-8545-11ef-ae7d-85df232e2a82&pt=campaign&t=1728379993&s=784b945bc08f7b01ba1243c91db3cc19b19e59426863f51d69a39e55bbd61185"
                target="_blank"
                rel="noreferrer"
              >
                View newsletter example
              </a>
            </p>

            <p className="mb-0">
              <a
                href="https://thecodeman.net/posts/how-to-use-singleton-in-multithreading?utm_source=sponsorship"
                target="_blank"
                rel="noreferrer"
              >
                View website example
              </a>
            </p>
          </div>

          <div className="content-card">
            <div className="section-header">
              <h2>Long-term visibility matters</h2>
            </div>

            <p className="mb-0">
              Each sponsored issue stays published on the site, giving your placement
              ongoing visibility long after the email goes out.
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="form-shell section-spacing" id="reserveSpotForm">
          <div className="form-copy">
            <span className="eyebrow">Book your sponsorship</span>
            <h2>Let’s talk about your next placement</h2>
            <p>
              Use the form to reserve your spot, ask for availability, or check whether
              your product is the right fit for this audience.
            </p>
          </div>

          <div
            className="form-embed"
            dangerouslySetInnerHTML={{
              __html: `
                <script async src="https://eomail4.com/form/9ade17e6-9c87-11ef-86b3-890d9e639bbe.js" data-form="9ade17e6-9c87-11ef-86b3-890d9e639bbe"></script>
              `
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Sponsorship;