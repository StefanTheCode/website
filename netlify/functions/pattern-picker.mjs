// Pattern Picker (FREE tool) — describe a problem, get a recommended design
// pattern grounded in TheCodeMan's catalog, with links to the blog post and
// (where available) the paid book chapter.
//
// POST /api/pattern-picker  { problem: string, email?: string }
// Returns: { recommendations: [{id,name,why,blogUrl,bookUrl}], related: [...] }

import { readFile } from "node:fs/promises";
import path from "node:path";
import { askLLM } from "./_shared/llm.mjs";
import { json, preflight, readJson, clientIp } from "./_shared/http.mjs";
import { checkRateLimit } from "./_shared/ratelimit.mjs";

const SITE = "https://thecodeman.net";

let CATALOG = null;
async function loadCatalog() {
  if (CATALOG) return CATALOG;
  const candidates = [
    path.join(process.cwd(), "components", "data", "patternCatalog.json"),
    path.join(process.cwd(), "patternCatalog.json"),
  ];
  for (const p of candidates) {
    try {
      CATALOG = JSON.parse(await readFile(p, "utf8")).patterns;
      return CATALOG;
    } catch {
      /* next */
    }
  }
  throw new Error("patternCatalog.json not found");
}

function urls(p) {
  return {
    blogUrl: p.blog ? `${SITE}/posts/${p.blog}` : null,
    bookUrl: p.book ? `${SITE}/read/design-patterns-that-deliver/${p.book}` : null,
  };
}

export default async (req, context) => {
  if (req.method === "OPTIONS") return preflight(req);
  if (req.method !== "POST") return json(req, 405, { error: "Method not allowed" });

  const { problem, email } = await readJson(req);
  if (!problem || typeof problem !== "string" || problem.trim().length < 8) {
    return json(req, 400, { error: "Please describe your problem (at least a sentence)." });
  }
  if (problem.length > 2000) {
    return json(req, 400, { error: "That's a bit long — please keep it under 2000 characters." });
  }

  // Free tool: looser limit for email-captured users, tighter for anonymous.
  const ip = clientIp(req, context);
  const limit = email ? 30 : 8;
  const rl = await checkRateLimit(`picker:${email || ip}`, limit);
  if (!rl.ok) {
    return json(req, 429, {
      error: "Daily limit reached. Drop your email for more, or come back tomorrow.",
    });
  }

  const catalog = await loadCatalog();
  const compact = catalog
    .map((p) => `${p.id} | ${p.name} (${p.group}): ${p.intent} Use when: ${p.useWhen}`)
    .join("\n");

  const system = `You are the Pattern Picker on TheCodeMan.net, written by Microsoft MVP Stefan Đokić for .NET/C# developers.
You ONLY recommend patterns from the catalog below. Never invent patterns or IDs.
Pick the 1-3 best-fitting patterns for the developer's problem. Be specific and practical, in a .NET/C# context.

CATALOG (id | name (group): intent. Use when ...):
${compact}

Respond with STRICT JSON only, no markdown, no prose outside JSON:
{"recommendations":[{"id":"<catalog id>","why":"<2-3 sentences, concrete and .NET-specific>"}],"related":["<catalog id>", ...]}
- 1 to 3 recommendations, best first.
- "related" = up to 3 other catalog ids worth considering (may be empty).`;

  let parsed;
  try {
    const raw = await askLLM({
      system,
      tier: "fast",
      maxTokens: 700,
      temperature: 0.2,
      messages: [{ role: "user", content: problem.trim() }],
    });
    parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, "").trim());
  } catch (e) {
    return json(req, 502, { error: "The AI is busy right now — please try again in a moment." });
  }

  const byId = Object.fromEntries(catalog.map((p) => [p.id, p]));
  const recommendations = (parsed.recommendations || [])
    .map((r) => {
      const p = byId[r.id];
      if (!p) return null;
      return { id: p.id, name: p.name, group: p.group, why: r.why, ...urls(p) };
    })
    .filter(Boolean)
    .slice(0, 3);

  const related = (parsed.related || [])
    .map((id) => byId[id])
    .filter(Boolean)
    .filter((p) => !recommendations.find((r) => r.id === p.id))
    .slice(0, 3)
    .map((p) => ({ id: p.id, name: p.name, ...urls(p) }));

  if (recommendations.length === 0) {
    return json(req, 502, { error: "Couldn't match a pattern — try rephrasing your problem." });
  }

  // NOTE: when an email is provided, also forward it to the newsletter
  // provider here (left as a TODO so no keys are required for the prototype).
  return json(req, 200, { recommendations, related, remaining: rl.remaining });
};
