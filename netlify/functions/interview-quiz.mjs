// Interview Quiz (FREE tool) — generate C#/.NET design-pattern interview
// questions & answers for a chosen pattern, grounded in TheCodeMan's catalog.
//
// POST /api/interview-quiz  { patternId: string, difficulty?: 'junior'|'mid'|'senior', count?: number, email?: string }
// Returns: { pattern: {id,name,group,blogUrl,bookUrl}, questions: [{q, a}] }

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

  const { patternId, difficulty, count, email } = await readJson(req);

  const catalog = await loadCatalog();
  const pattern = catalog.find((p) => p.id === patternId);
  if (!pattern) {
    return json(req, 400, { error: "Please choose a pattern from the list." });
  }

  const level = ["junior", "mid", "senior"].includes(difficulty) ? difficulty : "mid";
  const n = Math.min(Math.max(parseInt(count, 10) || 5, 3), 8);

  // Free tool: looser limit for email-captured users, tighter for anonymous.
  const ip = clientIp(req, context);
  const limit = email ? 30 : 6;
  const rl = await checkRateLimit(`quiz:${email || ip}`, limit);
  if (!rl.ok) {
    return json(req, 429, {
      error: "Daily limit reached. Drop your email for more, or come back tomorrow.",
    });
  }

  const system = `You are an expert .NET/C# technical interviewer for TheCodeMan.net, written by Microsoft MVP Stefan Đokić.
Generate ${n} realistic, high-quality interview questions (with strong answers) about the "${pattern.name}" design pattern (${pattern.group}) for a ${level}-level C#/.NET developer.

Context about the pattern:
- Intent: ${pattern.intent}
- Use when: ${pattern.useWhen}

Rules:
- Questions must be specific and practical, in a modern .NET/C# context (DI, async, EF Core, ASP.NET Core where relevant). No trivia.
- Answers: 3-6 sentences, concrete, mention real .NET APIs/libraries where it helps. Include a one-line code snippet inside the answer only when it materially helps.
- Mix conceptual ("when would you reach for it / when NOT") with applied ("how would you wire this with DI"). For senior level, include trade-offs and pitfalls.
- Do NOT invent facts. Stay accurate to modern .NET.

Respond with STRICT JSON only, no markdown, no prose outside JSON:
{"questions":[{"q":"<question>","a":"<answer>"}]}`;

  let parsed;
  try {
    const raw = await askLLM({
      system,
      tier: "fast",
      maxTokens: 1600,
      temperature: 0.4,
      messages: [
        { role: "user", content: `Generate ${n} ${level}-level interview questions about the ${pattern.name} pattern.` },
      ],
    });
    parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, "").trim());
  } catch {
    return json(req, 502, { error: "The AI is busy right now — please try again in a moment." });
  }

  const questions = (parsed.questions || [])
    .filter((x) => x && typeof x.q === "string" && typeof x.a === "string")
    .slice(0, n);

  if (questions.length === 0) {
    return json(req, 502, { error: "Couldn't generate questions — please try again." });
  }

  return json(req, 200, {
    pattern: { id: pattern.id, name: pattern.name, group: pattern.group, ...urls(pattern) },
    difficulty: level,
    questions,
    remaining: rl.remaining,
  });
};
