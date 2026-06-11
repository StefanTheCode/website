// Pattern Comparison (FREE tool) — "Strategy vs Factory?" Compare two C#/.NET
// design patterns: TL;DR, when to use each, the key difference, and the trap
// people fall into. Grounded in TheCodeMan's catalog, with chapter/tutorial links.
//
// POST /api/pattern-comparison  { a?: string, b?: string, query?: string, email?: string }
//   - a/b are catalog ids; OR pass a free-text query like "strategy vs factory".
// Returns: { a:{...}, b:{...}, comparison:{ tldr, whenA, whenB, difference, confusion } }

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

  const { a, b, query, email } = await readJson(req);
  const catalog = await loadCatalog();
  const byId = Object.fromEntries(catalog.map((p) => [p.id, p]));

  // Rate limit first (cheap).
  const ip = clientIp(req, context);
  const limit = email ? 30 : 8;
  const rl = await checkRateLimit(`compare:${email || ip}`, limit);
  if (!rl.ok) {
    return json(req, 429, {
      error: "Daily limit reached. Drop your email for more, or come back tomorrow.",
    });
  }

  // Resolve the two patterns: explicit ids win; otherwise let the model pick from the query.
  let pa = a ? byId[a] : null;
  let pb = b ? byId[b] : null;

  const compact = catalog
    .map((p) => `${p.id} | ${p.name} (${p.group})`)
    .join("\n");

  if (!pa || !pb) {
    if (!query || typeof query !== "string" || query.trim().length < 3) {
      return json(req, 400, { error: "Pick two patterns to compare (or type e.g. 'strategy vs factory')." });
    }
    // Ask the model to map the free text to two catalog ids.
    try {
      const idRaw = await askLLM({
        system: `Map the user's request to exactly two pattern ids from this catalog. Respond with STRICT JSON only: {"a":"<id>","b":"<id>"}.
CATALOG:
${compact}`,
        tier: "fast",
        maxTokens: 60,
        temperature: 0,
        messages: [{ role: "user", content: query.trim() }],
      });
      const ids = JSON.parse(idRaw.replace(/^```json\s*|\s*```$/g, "").trim());
      pa = pa || byId[ids.a];
      pb = pb || byId[ids.b];
    } catch {
      /* fall through to validation below */
    }
  }

  if (!pa || !pb || pa.id === pb.id) {
    return json(req, 400, { error: "Couldn't identify two distinct patterns — pick them from the lists." });
  }

  const system = `You are a senior .NET/C# architect writing for TheCodeMan.net (Microsoft MVP Stefan Đokić).
Compare two design patterns for a .NET/C# developer deciding between them: "${pa.name}" (${pa.group}) and "${pb.name}" (${pb.group}).

Context:
- ${pa.name}: ${pa.intent} Use when: ${pa.useWhen}
- ${pb.name}: ${pb.intent} Use when: ${pb.useWhen}

Be concrete and practical, modern .NET (DI, async, EF Core, ASP.NET Core where relevant). Do not invent facts.

Respond with STRICT JSON only, no markdown, no prose outside JSON:
{
  "tldr": "<1-2 sentence bottom line on how to choose>",
  "whenA": "<2-3 sentences: pick ${pa.name} when...>",
  "whenB": "<2-3 sentences: pick ${pb.name} when...>",
  "difference": "<2-3 sentences on the core conceptual difference>",
  "confusion": "<1-2 sentences on the common mistake people make confusing them>"
}`;

  let parsed;
  try {
    const raw = await askLLM({
      system,
      tier: "fast",
      maxTokens: 800,
      temperature: 0.3,
      messages: [{ role: "user", content: `Compare ${pa.name} vs ${pb.name} for a .NET developer.` }],
    });
    parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, "").trim());
  } catch {
    return json(req, 502, { error: "The AI is busy right now — please try again in a moment." });
  }

  return json(req, 200, {
    a: { id: pa.id, name: pa.name, group: pa.group, ...urls(pa) },
    b: { id: pb.id, name: pb.name, group: pb.group, ...urls(pb) },
    comparison: {
      tldr: parsed.tldr || "",
      whenA: parsed.whenA || "",
      whenB: parsed.whenB || "",
      difference: parsed.difference || "",
      confusion: parsed.confusion || "",
    },
    remaining: rl.remaining,
  });
};
