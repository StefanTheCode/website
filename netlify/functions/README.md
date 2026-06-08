# AI Tools — Netlify Functions

This folder holds the serverless backend for TheCodeMan AI tools. The site stays
a static Next.js export; only these functions touch secrets, paid content, and
the LLM.

## Endpoints

| Route (clean) | Function | Tier | Notes |
|---|---|---|---|
| `POST /api/pattern-picker` | `pattern-picker.mjs` | **Free** (email-gated for more) | Recommends a pattern from the catalog, links blog + book |
| `POST /api/ask-the-book` | `ask-the-book.mjs` | **Teaser now → Paid at Phase 3** | RAG over the book, answers cited by chapter |

Netlify also serves them directly at `/.netlify/functions/<name>`; the `/api/*`
redirect in `netlify.toml` gives the clean URL.

## Shared library (`_shared/`, not deployed as endpoints)

- `claude.mjs` — Anthropic Messages API client (fast = Haiku, smart = Sonnet).
- `embeddings.mjs` — provider-agnostic embeddings (OpenAI default, Voyage optional) + cosine similarity.
- `rag.mjs` — loads `public/ai/embeddings.json`, retrieves top-k chunks, builds the grounded context.
- `ratelimit.mjs` — per-key daily limit via Netlify Blobs (fails open).
- `http.mjs` — CORS, JSON helpers, client IP.

## Required environment variables (Netlify → Site settings → Environment)

By default everything runs on **OpenAI** (one key powers both generation and embeddings):

| Var | Required? | Notes |
|---|---|---|
| `OPENAI_API_KEY` | **Yes** | Powers Pattern Picker + Ask the Book generation AND embeddings |
| `LLM_PROVIDER` | optional | `openai` (default) or `anthropic` |
| `OPENAI_MODEL_FAST` / `OPENAI_MODEL_SMART` | optional | defaults: `gpt-4o-mini` / `gpt-4o` |
| `ANTHROPIC_API_KEY` | only if `LLM_PROVIDER=anthropic` | needs separate API billing — Claude Pro does NOT include API access |
| `EMBEDDINGS_PROVIDER` | optional | `openai` (default) or `voyage` |
| `VOYAGE_API_KEY` | only if `EMBEDDINGS_PROVIDER=voyage` | |

> **Claude Pro ≠ Anthropic API.** The claude.ai Pro subscription does not grant API
> access; that's billed separately at console.anthropic.com. Since the default is
> OpenAI, you only need `OPENAI_API_KEY`.

Netlify Blobs (rate limiting) needs no key — it's built into the runtime.

## Build the RAG index (run before deploy, and whenever book content changes)

```bash
# needs OPENAI_API_KEY (or VOYAGE_API_KEY + EMBEDDINGS_PROVIDER=voyage)
npm run build:embeddings
```

This writes `public/ai/embeddings.json`, which `netlify.toml` bundles with the
functions (`included_files`). Pattern Picker does **not** need this file (it's
grounded in `components/data/patternCatalog.json`); Ask the Book does.

> Tip: add `build:embeddings` to your CI/deploy step so the index is always
> regenerated with the latest chapters.

## Local development

```bash
npm i -g netlify-cli   # once
netlify dev            # serves the static site AND the functions on :8888
```

`npm run dev` alone runs Next but **not** the functions, so the tool UIs will
show a network error when they call `/api/*`. Use `netlify dev` to test the
tools end to end.

## Tool pages

- `/tools/pattern-picker` — public, indexable (free lead-magnet + SEO).
- `/tools/ask-the-book` — demo page (noindex). The `AskTheBook` widget is
  reusable and is intended to be embedded inside the `/read` reader per chapter.

## Phase 3 hook (auth/entitlements)

`ask-the-book.mjs` currently runs in **teaser mode** (rate-limited for everyone).
When the Lemon Squeezy + session-cookie auth from Phase 3 lands, read the session
in the function, and lift the teaser cap for Deliver/bundle owners. The same
session check will gate the full Interview Simulator and Refactor-with-Pattern
tools (next in Phase 4).

## Authentication & gating (Phase 3)

Login is **magic-link by email** — no license keys. The customer enters the email
they purchased with; we verify the purchase via the Lemon Squeezy Orders API and
email a short-lived sign-in link that sets a signed session cookie.

Endpoints:
- `POST /api/auth-request`  { email } → emails a sign-in link if the email owns a product (always returns a generic message — no enumeration).
- `GET  /api/auth-verify?token=…` → sets the session cookie, redirects to `/read`.
- `GET  /api/auth-session` → `{ authenticated, email, entitlements }`.
- `POST /api/auth-logout` → clears the cookie.
- `GET  /api/content-chapter?book=&chapter=` → returns a PAID chapter's HTML only to an entitled session (401 anon / 403 not owned).

`ask-the-book` now lifts the teaser cap (4/day) to 100/day for Deliver/bundle owners.

### Extra env vars for Phase 3

| Var | Required | Notes |
|---|---|---|
| `SESSION_SECRET` | **Yes** | long random string; signs magic-link + session tokens |
| `LEMONSQUEEZY_API_KEY` | **Yes** | from app.lemonsqueezy.com → Settings → API |
| `LS_PRODUCT_DELIVER` | **Yes** | Lemon Squeezy product id(s) for "Design Patterns that Deliver" (comma-separated ok) |
| `LS_PRODUCT_SIMPLIFIED` | optional | product id(s) for "Design Patterns Simplified" |
| `LS_PRODUCT_BUNDLE` | optional | product id(s) for a bundle (grants both) |
| `EMAIL_PROVIDER` | for real emails | `console` (default, logs link), `resend`, or `ses` |
| `RESEND_API_KEY` | if provider=resend | |
| `EMAIL_FROM` | recommended | e.g. `TheCodeMan <login@thecodeman.net>` |
| `URL` | auto on Netlify | site origin used to build the magic link |

> EmailOctopus has no transactional API, so it can't send the magic link. Keep it
> for the newsletter; use Resend (easy) or Amazon SES (via EmailOctopus Connect).

To find product IDs: Lemon Squeezy dashboard → Products → open the product → the id
is in the URL, or query `GET https://api.lemonsqueezy.com/v1/products` with your API key.

## Simpler login: email + key (no email sending by us)

Primary login is now **email + key** via `POST /api/auth-key` — Lemon Squeezy
already emails the key to the buyer, so we send nothing:

- **New buyers:** enable **License keys** on the product in Lemon Squeezy. LS then
  auto-generates a key and includes it in the receipt email + the customer's
  "My Orders". The buyer signs in with that license key (validated via the LS
  License API; we check it's for your product).
- **Existing ~1100 buyers:** they have no license key. The same form also accepts
  the **order number** from their receipt (validated against their email's orders).
  Send it to them in your manual email.

Env needed for this path: `LEMONSQUEEZY_API_KEY`, `LS_PRODUCT_DELIVER` (+ optional
`LS_PRODUCT_SIMPLIFIED` / `LS_PRODUCT_BUNDLE`), and `SESSION_SECRET`. **No email
provider required.** The magic-link endpoints (`auth-request`/`auth-verify`) remain
available as an optional fallback if you ever wire up Resend/SES.

> Enable license keys: Lemon Squeezy → Products → your product → Licensing → turn on.
