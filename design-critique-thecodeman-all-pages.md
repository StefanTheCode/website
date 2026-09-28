# Design Critique: thecodeman.net — Blog, Blog Post, Courses & Ebooks

*Reviewed live at 1440px desktop on 2026-06-20. Follow-up to the homepage critique. Context: creator/personal-brand site for a Microsoft MVP selling a newsletter, courses, and ebooks to .NET developers. Stage: live/production — feedback is fix-and-polish oriented.*

## TL;DR

The product sales pages (course + ebooks) are genuinely excellent — among the best work on the site. The blog system is clean and functional. The recurring damage is **consistency**: the subscriber/social-proof number changes on almost every page (20k → 18k → 20,000 → 25,000 → 1250), the promo discount disagrees with itself (40% vs 50%), and a few small bugs (a broken logo, a run-together 404 link, a course mislabeled in the nav) chip at an otherwise very professional impression.

---

## 1. Blog Listing (`/blog`)

### What works
- Clean two-column layout (title + excerpt on the left, branded thumbnail on the right) with a generous, scannable rhythm.
- Category filter pills with counts (ALL 128, .NET 57, Design Patterns 22…) are a great way to navigate a large archive.
- Thumbnails load reliably here and share one consistent "newsletter card" template — this confirms the **broken thumbnails are a homepage-only bug**, not a blog-wide one.
- The sticky "Subscribe to TheCodeMan.net" sidebar keeps the primary conversion goal in view while browsing.

### Findings
| Finding | Severity | Recommendation |
|---|---|---|
| Page top renders on **pure black**, while the rest of the site uses the deep-purple brand background. | 🟡 Moderate | Use the same purple base so the blog feels part of the same brand, or make the black intentional site-wide. |
| Article excerpts are **justified**, creating uneven word spacing / "rivers" of white space. | 🟢 Minor | Left-align body text — it's more readable and on-brand for a dev audience. |
| Meta label is inconsistent: one row reads "Read Time: 10 minutes," the next just "12 minutes." | 🟢 Minor | Pick one format ("10 min read") and apply to every row. |

---

## 2. Blog Post (`/posts/…`)

### What works
- Strong article scaffold: breadcrumb → amber H1 → meta line → **Table of Contents card** → body.
- A thin amber **reading-progress bar** at the top is a nice, subtle touch.
- Body typography is the highlight: good line length (~70–75 chars), comfortable white-on-purple, amber section headings, and tidy inline-code pills.
- The weekly **sponsor block** is clearly demarcated ("A WORD FROM THIS WEEK'S SPONSOR") so it doesn't masquerade as editorial — good practice.
- "Recommended for .NET Engineers" sidebar with real product mockups keeps cross-sell present without crowding the article.

### Findings
| Finding | Severity | Recommendation |
|---|---|---|
| Sponsor CTA button is **blue/purple** ("Get it here for free →"), breaking the site's amber button system. | 🟡 Moderate | Use the standard amber (or a single defined secondary style). One button system across the site. |
| Hand-drawn diagrams render as a **bright white box** on the dark page — a jarring flash of light in a dark theme. | 🟡 Moderate | Put diagrams on a dark or tinted panel, or add a framed container so they don't blow out the page. |
| **404 page bug:** the two recovery links render as "Go HomeBrowse Blog" with no space/separator between them. | 🟡 Moderate | Add spacing/a separator (or make them two clearly distinct buttons). Discovered via a mistyped post URL — easy to hit. |
| Sidebar product cards show a blank dark area before their image lazy-loads. | 🟢 Minor | Add a branded placeholder/skeleton so the card never looks empty. |

---

## 3. Courses

Reviewed **Pragmatic .NET Code Rules** (`/pragmatic-dotnet-code-rules`). This is a dedicated sales-page template, separate from the main site shell.

### What works
- **Best-designed page on the site.** Confident hero ("Make your .NET codebase enforce itself."), a polished 3D product-box mockup, and a clear value prop.
- Dual CTA done right: solid amber primary ("Reserve Your Spot – $74.89") + ghost secondary ("See the curriculum").
- Trust strip (Microsoft MVP · 25,000+ readers · 110k+ LinkedIn · 12 modules · 60+ lessons), star rating, and a **real-photo named testimonial** — far stronger social proof than the homepage's placeholder avatar.
- Countdown timer + **sticky bottom purchase bar** that follows the scroll — strong, standard sales-funnel mechanics.
- The **Before/After** comparison (red ✗ vs green ✓) is crisp and persuasive.

### Findings
| Finding | Severity | Recommendation |
|---|---|---|
| The header **logo is a blank/empty circle** (it never loads) on the course page. | 🔴 Critical | Fix the logo source. On your top-converting page, a missing logo undercuts trust in the first 2 seconds. |
| **Discount mismatch:** this page says "Presale – 50% off" ($149 → $74.89), but the global site promo bar says "40% off." | 🔴 Critical | Make the discount figure identical everywhere it appears, or drive both from one source. Conflicting offers read as careless or "fake urgency." |
| "Design Patterns That Deliver" sits under the **Courses** menu, but its label/URL is an **ebook** (`/design-patterns-that-deliver-ebook`). | 🟡 Moderate | Put it under Ebooks, or rename consistently. Right now Courses vs Ebooks is blurred. |
| Subscriber/audience number here is **"25,000+"**, vs 20k/18k/20,000 elsewhere. | 🟡 Moderate | One canonical figure across the whole site (see cross-cutting). |

---

## 4. Ebooks

Reviewed **Design Patterns that Deliver** (`/design-patterns-that-deliver-ebook`) and **Design Patterns Simplified** (`/design-patterns-simplified`). Both share one consistent, polished template.

### What works
- Cohesive sales template: own compact nav (The Patterns · AI Tutor · What You Get · Pricing · FAQ), price + "Get the Ebook" CTA, contextual top bar, and a great **3D book mockup** (and a nice author-holding-the-book hero shot on "That Deliver").
- Clear, benefit-led headlines ("Stop guessing design patterns. Start shipping the right one.") with the amber-accent treatment used consistently.
- Pricing anchored against alternatives ("a 500+ page book that costs over $100") — effective framing.

### Findings
| Finding | Severity | Recommendation |
|---|---|---|
| The hero uses a **scroll-triggered fade-in**, so on initial load the hero area is **blank for a beat**, and the scroll-tied fade can leave hero text **semi-transparent mid-scroll**. Affects all three product pages. | 🟡 Moderate | Render the hero visible by default (animate in only as an enhancement). Invisible-until-scroll hurts the first impression and means content isn't reliably present for fast scrollers / reduced-motion / assistive tech. Respect `prefers-reduced-motion`. |
| **"1250+"** is used as the social-proof number on **both** ebook pages ("1250+ copies sold" / "1250+ developers"). | 🟡 Moderate | If both genuinely sold ~1,250, fine — but identical numbers on two products look like a reused placeholder. Use the real per-product figure. |
| Product-page **logo treatment varies**: blank circle (course), `</>` code icon (ebooks), wordmark (main site). | 🟢 Minor | Standardize one logo/lockup across all templates. |

---

## Cross-Cutting Themes (fix these once, win everywhere)

1. **One audience number, everywhere.** Currently: hero "20k+", homepage social proof "18k+", footer "20,000+", course page "25,000+", ebooks "1250+". This is the single most repeated credibility leak across the site. Decide on canonical figures (newsletter subscribers vs per-product sales) and pull them from one place.
2. **One promo/discount source of truth.** The global bar (40%) and the course page (50%) disagree. Conflicting offers undermine the urgency they're meant to create.
3. **One button system.** Amber primary + one defined secondary (ghost/outline). Eliminate the one-off blue sponsor button and standardize corner radius.
4. **One logo lockup** across the main shell and all product templates — and fix the blank-circle logo on the course page.
5. **Animations shouldn't hide content.** Make heroes and sections visible by default; treat reveal animations as progressive enhancement and honor reduced-motion.

## Priority Recommendations

1. **Fix the broken course-page logo and reconcile the 40% vs 50% discount.** — These sit on your highest-intent, money-making page; both are quick fixes with outsized trust impact.
2. **Unify every audience/social-proof number** (and de-duplicate the reused "1250+"). — One global change that lifts credibility across the entire site.
3. **Make product-page heroes visible on load** (animation as enhancement only). — Protects the first impression on the three pages built specifically to convert.

*Secondary: fix the 404 "Go HomeBrowse Blog" spacing, give blog post diagrams a dark frame, switch the sponsor button to amber, left-align blog excerpts, and align blog post background to the brand purple.*
