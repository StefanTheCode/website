import Image from "next/image";
import SponsorsNewsletter from "@/components/sponsorsTestimonials";
import { Metadata } from "next";

const PAGE_TITLE = "Sponsorship & Media Kit | TheCodeMan";
const PAGE_DESCRIPTION =
  "Partner with TheCodeMan to reach up to 140,000+ .NET developers through newsletter, LinkedIn, YouTube, X, and custom sponsorship campaigns.";

export const metadata: Metadata = {
  metadataBase: new URL("https://thecodeman.net"),
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    type: "website",
    url: "https://thecodeman.net/media-kit",
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    title: PAGE_TITLE,
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: PAGE_DESCRIPTION,
  },
};

const MediaKit = () => {
  const stats = [
    { label: "Newsletter subscribers", value: "20,000+" },
    { label: "Newsletter open rate", value: "50-52%" },
    { label: "LinkedIn followers", value: "110,000+" },
    { label: "X / Twitter followers", value: "9,000+" },
    { label: "YouTube subscribers", value: "3,500+" },
  ];

  const whyPartner = [
    "Deep technical content, not surface-level promotion",
    "Trusted audience built through educational content",
    "Native sponsor integrations that feel natural",
    "Multi-channel distribution across newsletter, LinkedIn, X, and YouTube",
    "Strong fit for developer tools, APIs, infrastructure, AI products, cloud platforms, and SaaS products for engineers",
  ];

  const placements = [
    {
      name: "LinkedIn Post",
      price: "$1,000",
      desc: "Native educational post created for a technical developer audience.",
    },
    {
      name: "Newsletter Dedicated",
      price: "$1,200",
      desc: "Dedicated section inside the newsletter sent to 20,000+ subscribers.",
    },
    {
      name: "YouTube Dedicated Video",
      price: "$1,200",
      desc: "Dedicated educational YouTube video built around your product.",
    },
    {
      name: "YouTube Ad",
      price: "$500",
      desc: "Short-form sponsor segment integrated inside an existing YouTube video.",
    },
    {
      name: "Newsletter Ad",
      price: "$450",
      desc: "Short-form promotional placement inside the newsletter.",
    },
    {
      name: "X / Twitter Post",
      price: "$200",
      desc: "Short-form amplification for product launches, developer tools, or campaign support.",
    },
  ];

  const collaborations = [
    { src: "/images/sponsors/postman.png", alt: "Postman" },
    { src: "/images/sponsors/jetbrains.png", alt: "JetBrains" },
    { src: "/images/sponsors/neon.png", alt: "Neon" },
    { src: "/images/sponsors/mongodb.png", alt: "MongoDB" },
    { src: "/images/sponsors/sentry.png", alt: "Sentry" },
    { src: "/images/sponsors/coderabbit.png", alt: "CodeRabbit" },
    { src: "/images/sponsors/abp.png", alt: "ABP" },
    { src: "/images/sponsors/iron.png", alt: "Iron Software" },
    { src: "/images/sponsors/uno-platform.png", alt: "Uno Platform" },
    { src: "/images/sponsors/brilliant.png", alt: "Brilliant" },
    { src: "/images/sponsors/heroku.png", alt: "Heroku" },
    { src: "/images/sponsors/zzz-projects.png", alt: "ZZZ Projects" },
  ];

  const contactEmail = "stefan@thecodeman.net";
  const linkedinUrl = "https://www.linkedin.com/in/djokic-stefan/";

  return (
    <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
      <div className="container">
        {/* 1. Hero */}
        <header className="mk-hero">
          <span className="mk-eyebrow">Sponsorship & Media Kit</span>
          <h1>
            Reach 140,000+ <span className="text-yellow">.NET developers</span> building production systems
          </h1>
          <p>
            Partner with TheCodeMan to reach a highly engaged audience of .NET developers, backend engineers,
            software architects, and developers interested in AI, APIs, cloud, and modern software architecture.
          </p>
          <div className="mk-cta-row">
            <a className="mk-btn mk-btn-primary" href="#placements">
              View sponsorship options
            </a>
            <a className="mk-btn mk-btn-ghost" href="#contact">
              Contact me
            </a>
          </div>
        </header>

        {/* 2. Audience Overview */}
        <section className="mk-section" aria-labelledby="audience-title">
          <div className="mk-section-head">
            <h2 id="audience-title">Audience Overview</h2>
            <p>
              The audience is primarily composed of .NET developers, backend engineers, software architects, and
              technical decision-makers interested in practical engineering content, developer tools, AI, APIs, cloud,
              DevOps, and software architecture.
            </p>
          </div>

          <div className="mk-grid mk-grid-3">
            {stats.map((s) => (
              <div key={s.label} className="mk-stat">
                <div className="mk-stat-value">{s.value}</div>
                <div className="mk-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Why Partner With Me */}
        <section className="mk-section" aria-labelledby="why-title">
          <div className="mk-section-head">
            <h2 id="why-title">Why Partner With Me</h2>
            <p>
              Sponsors choose TheCodeMan to reach engineers through trusted, educational content — not banner ads.
            </p>
          </div>

          <ul className="mk-feature-list">
            {whyPartner.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </section>

        {/* 4. Individual Placements */}
        <section className="mk-section" id="placements" aria-labelledby="placements-title">
          <div className="mk-section-head">
            <h2 id="placements-title">Individual Placements</h2>
            <p>Mix and match placements, or combine them into a campaign package below.</p>
          </div>

          <div className="mk-placement-grid">
            {placements.map((p) => (
              <article key={p.name} className="mk-placement">
                <div className="mk-placement-head">
                  <span className="mk-placement-name">{p.name}</span>
                  <span className="mk-placement-price">{p.price}</span>
                </div>
                <p className="mk-placement-desc">{p.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 5. Recommended Packages */}
        <section className="mk-section" aria-labelledby="packages-title">
          <div className="mk-section-head">
            <h2 id="packages-title">Recommended Campaign Packages</h2>
            <p>Curated bundles designed to balance reach, engagement, and value.</p>
          </div>

          <div className="mk-packages">
            <article className="mk-pkg">
              <div className="mk-pkg-label">Best for testing collaboration</div>
              <div className="mk-pkg-name">Starter Campaign</div>
              <div className="mk-pkg-price">$1,500</div>
              <ul className="mk-pkg-list">
                <li>LinkedIn post</li>
                <li>X / Twitter post</li>
                <li>Newsletter ad</li>
                <li>YouTube Community post</li>
              </ul>
              <div className="mk-pkg-value">Total value: $1,750</div>
            </article>

            <article className="mk-pkg mk-pkg-highlight">
              <span className="mk-pkg-ribbon">Most popular</span>
              <div className="mk-pkg-label">Most popular</div>
              <div className="mk-pkg-name">Growth Campaign</div>
              <div className="mk-pkg-price">$3,000</div>
              <ul className="mk-pkg-list">
                <li>YouTube dedicated video</li>
                <li>Newsletter dedicated</li>
                <li>LinkedIn post</li>
                <li>X / Twitter post</li>
              </ul>
              <div className="mk-pkg-value">Total value: $3,600</div>
            </article>

            <article className="mk-pkg">
              <div className="mk-pkg-label">Best for multi-touch awareness</div>
              <div className="mk-pkg-name">Full Funnel Campaign</div>
              <div className="mk-pkg-price">$4,500</div>
              <ul className="mk-pkg-list">
                <li>1× YouTube dedicated video</li>
                <li>1× Newsletter dedicated</li>
                <li>2× LinkedIn posts</li>
                <li>2× X / Twitter posts</li>
                <li>1× Newsletter ad</li>
              </ul>
              <div className="mk-pkg-value">
                Total value: $5,500 <br/>
                Multi-channel campaign across all major audience touchpoints
              </div>
            </article>
          </div>
        </section>

        {/* 6. Custom Campaign */}
        <section className="mk-section" aria-labelledby="custom-title">
          <div className="mk-custom">
            <h2 id="custom-title">Need something custom?</h2>
            <p>
              I also create tailored campaigns for developer-focused companies based on product goals, launch
              timelines, and preferred channels. This works especially well for AI tools, developer APIs,
              infrastructure products, cloud platforms, databases, monitoring tools, and engineering SaaS.
            </p>
            <a className="mk-btn mk-btn-primary" href="#contact">
              Contact me to discuss a custom campaign
            </a>
          </div>
        </section>

        {/* 7. Previous Collaborations */}
        <section className="mk-section" aria-labelledby="collabs-title">
          <div className="mk-section-head">
            <h2 id="collabs-title">Previous Collaborations</h2>
            <p>
              I have collaborated with developer-focused companies across AI, infrastructure, APIs, cloud, databases,
              and developer tooling.
            </p>
          </div>

          <div className="mk-collab-grid">
            {collaborations.map((logo) => (
              <div key={logo.alt} className="mk-collab-item" title={logo.alt}>
                <Image src={logo.src} alt={logo.alt} width={160} height={44} />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <SponsorsNewsletter />
          </div>
        </section>

        {/* 8. Contact */}
        <section className="mk-section" id="contact" aria-labelledby="contact-title">
          <div className="mk-contact">
            <h2 id="contact-title">Interested in working together?</h2>
            <p>
              Send me a short message with your campaign goals, product, preferred timeline, and the channels you are
              interested in.
            </p>
            <div className="mk-contact-links">
              <a className="mk-btn mk-btn-primary" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
              <a
                className="mk-btn mk-btn-ghost"
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Message on LinkedIn
              </a>
            </div>
          </div>
        </section>

        <div className="pb-5" />
      </div>
    </section>
  );
};

export default MediaKit;