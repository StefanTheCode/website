import Image from "next/image";
import SponsorsNewsletter from "@/components/sponsorsTestimonials";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://thecodeman.net/media-kit"),
  title: "Media Kit",
  description:
    "TheCodeMan Media Kit — sponsorship packages across Newsletter, LinkedIn, X, and YouTube. Clean rates, audience insights, and deliverables for developer tool brands.",
  openGraph: {
    title: "Media Kit",
    type: "website",
    url: "https://thecodeman.net/media-kit",
    description:
      "TheCodeMan Media Kit — sponsorship packages across Newsletter, LinkedIn, X, and YouTube. Clean rates, audience insights, and deliverables for developer tool brands.",
  },
  twitter: {
    title: "Media Kit",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description:
      "TheCodeMan Media Kit — sponsorship packages across Newsletter, LinkedIn, X, and YouTube. Clean rates, audience insights, and deliverables for developer tool brands.",
  },
};

const MediaKit = () => {
  // TODO: kasnije ovo možeš da vučeš iz config.json ili CMS-a
  const stats = [
    { label: "LinkedIn followers", value: "~102,000+" },
    { label: "Avg LinkedIn reach", value: "~40,000" },
    { label: "Newsletter subscribers", value: "20,000+" },
    { label: "Newsletter open rate", value: "50–52%" },
    { label: "X followers", value: "~8,000" },
    { label: "Avg YouTube views", value: "~2,000" },
  ];

  const topCountries = [
    { name: "United States", pct: 71 },
    { name: "United Kingdom", pct: 6 },
    { name: "Canada", pct: 5 },
    { name: "Other", pct: 18 },
  ];

  const age = [
    { name: "13–17", pct: 0 },
    { name: "18–24", pct: 29 },
    { name: "25–34", pct: 48 },
    { name: "35–44", pct: 14 },
    { name: "45–54", pct: 5 },
    { name: "55–64", pct: 3 },
    { name: "65+", pct: 1 },
  ];

  return (
    <>
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
        <div className="container">
          <div className="pb-4">
            <div className="heading-section mt-5 text-align-center">
              <h2 className="mb-3">
                TheCodeMan <br />
                <span className="text-yellow">
                  <b>Media Kit</b>
                </span>
              </h2>
              <p className="mk-subtitle">
                Sponsorship packages across Newsletter, LinkedIn, X, and YouTube — designed for clean,
                developer-first campaigns.
              </p>
            </div>
          </div>

          {/* Rates */}
          <div className="mk-grid mk-grid-2">
            <div className="mk-card">
              <div className="mk-card-title">Rates</div>

              <div className="mk-rate-row">
                <div>
                  <div className="mk-rate-name">Newsletter + LinkedIn + X</div>
                  <div className="mk-muted">Packages start from</div>
                </div>
                <div className="mk-rate-pill">$1,700+</div>
              </div>

              <div className="mk-rate-row">
                <div>
                  <div className="mk-rate-name">YouTube collab</div>
                  <div className="mk-muted">Use-case driven tutorial</div>
                </div>
                <div className="mk-rate-pill">$1,200</div>
              </div>

              <div className="mk-rate-row">
                <div>
                  <div className="mk-rate-name">Dedicated newsletter article</div>
                  <div className="mk-muted">Published as newsletter + blog</div>
                </div>
                <div className="mk-rate-pill">$1,200</div>
              </div>

              <div className="mt-3">
                <a className="btn btn-primary border-radius-5px coming-soon" href="#reserveSpotForm">
                  Request availability
                </a>
              </div>
            </div>

            <div className="mk-card">
              <div className="mk-card-title">Brand partners</div>
              <div className="mk-logo-row">
                <Image src={"/images/sponsors/postman.png"} alt="Postman" width={500} height={80} className="mk-logo" />
                <Image src={"/images/sponsors/jetbrains.png"} alt="JetBrains" width={500} height={80} className="mk-logo" />
                <Image src={"/images/sponsors/neon.png"} alt="Neon" width={500} height={80} className="mk-logo" />
                <Image src={"/images/sponsors/abp.png"} alt="ABP" width={500} height={80} className="mk-logo" />
              </div>

              <div className="mk-divider" />

              <div className="mk-muted">
                Want a campaign that feels native to .NET developers? I help sponsors integrate into real content
                (tutorials, how-tos, and use cases) instead of “just ads”.
              </div>
            </div>
          </div>

          {/* Key stats */}
          <div className="mt-4 mk-card">
            <div className="mk-card-title">Key stats</div>

            <div className="mk-grid mk-grid-3">
              {stats.map((s) => (
                <div key={s.label} className="mk-stat">
                  <div className="mk-stat-value">{s.value}</div>
                  <div className="mk-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div className="mt-4 mk-grid mk-grid-2">
            <div className="mk-card">
              <div className="mk-card-title">Audience</div>

              <div className="mk-audience-grid">
                {/* Donut (simple CSS) */}
                <div className="mk-audience-box">
                  <div className="mk-mini-title">Gender</div>
                  <div className="mk-donut-wrap">
                    <div className="mk-donut" />
                    <div className="mk-donut-legend">
                      <div className="mk-legend-row">
                        <span className="mk-dot mk-dot-1" />
                        Male <b className="ml-2">77%</b>
                      </div>
                      <div className="mk-legend-row">
                        <span className="mk-dot mk-dot-2" />
                        Female <b className="ml-2">23%</b>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Age bars */}
                <div className="mk-audience-box">
                  <div className="mk-mini-title">Age</div>
                  <div className="mk-bars">
                    {age.map((a) => (
                      <div key={a.name} className="mk-bar-row">
                        <div className="mk-bar-label">{a.name}</div>
                        <div className="mk-bar-track">
                          <div className="mk-bar-fill" style={{ width: `${a.pct}%` }} />
                        </div>
                        <div className="mk-bar-pct">{a.pct}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Countries */}
                <div className="mk-audience-box mk-span-2">
                  <div className="mk-mini-title">Top countries</div>
                  <div className="mk-bars">
                    {topCountries.map((c) => (
                      <div key={c.name} className="mk-bar-row">
                        <div className="mk-bar-label">{c.name}</div>
                        <div className="mk-bar-track">
                          <div className="mk-bar-fill" style={{ width: `${c.pct}%` }} />
                        </div>
                        <div className="mk-bar-pct">{c.pct}%</div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            {/* CTA + form */}
            <div className="mk-card">
              <div className="mk-card-title">Contact & availability</div>
              <div className="mk-muted">
                Share your product, target audience, and launch window — I’ll reply with available slots and a best-fit plan.
              </div>

              <div
                className="mt-3"
                id="reserveSpotForm"
                dangerouslySetInnerHTML={{
                  __html: `
                    <script async src="https://eomail4.com/form/9ade17e6-9c87-11ef-86b3-890d9e639bbe.js" data-form="9ade17e6-9c87-11ef-86b3-890d9e639bbe"></script>
                  `,
                }}
              />
            </div>
          </div>

          {/* Packages */}
          <div className="mt-4 mk-card">
            <div className="mk-card-title">Packages</div>
            <div className="mk-muted">All plans include Newsletter + LinkedIn + X (frequency varies).</div>

            <div className="mk-grid mk-grid-4 mt-3">
              <div className="mk-package">
                <div className="mk-package-name">Startup Awareness</div>
                <div className="mk-package-price">$1,700 / month</div>
                <ul className="mk-list">
                  <li>1x Newsletter ad</li>
                  <li>1x LinkedIn post</li>
                  <li>1x X post</li>
                </ul>
              </div>

              <div className="mk-package mk-package-highlight">
                <div className="mk-badge">Recommended</div>
                <div className="mk-package-name">Recommended Plan</div>
                <div className="mk-package-price">$3,230 / month</div>
                <ul className="mk-list">
                  <li>2x Newsletter ads</li>
                  <li>2x LinkedIn posts</li>
                  <li>2x X posts</li>
                </ul>
              </div>

              <div className="mk-package">
                <div className="mk-package-name">Pro Partner</div>
                <div className="mk-package-price">$4,743 / month</div>
                <ul className="mk-list">
                  <li>3x Newsletter ads</li>
                  <li>3x LinkedIn posts</li>
                  <li>3x X posts</li>
                </ul>
              </div>

              <div className="mk-package">
                <div className="mk-package-name">Brand Blitz</div>
                <div className="mk-package-price">$6,188 / month</div>
                <ul className="mk-list">
                  <li>4x Newsletter ads</li>
                  <li>4x LinkedIn posts</li>
                  <li>4x X posts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Proof / testimonials */}
          <div className="mt-4 mk-card">
            <div className="mk-card-title">Others said about me</div>
            <div className="mt-3">
              <SponsorsNewsletter />
            </div>
          </div>

          <div className="pb-5" />
        </div>
      </section>
    </>
  );
};

export default MediaKit;