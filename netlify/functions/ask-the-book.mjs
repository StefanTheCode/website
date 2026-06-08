// Ask the Book (RAG tutor) — answers grounded in the book content, with
// citations back to the chapter. Flagship feature for book owners.
//
// POST /api/ask-the-book  { question: string, chapter?: string, history?: [{role,content}] }
// Returns: { answer: string, sources: [{chapter, url}], remaining }
//
// Owners (Deliver/bundle) get the full tutor; everyone else gets a rate-limited teaser.

import { askLLM } from "./_shared/llm.mjs";
import { retrieve, buildContext } from "./_shared/rag.mjs";
import { json, preflight, readJson, clientIp } from "./_shared/http.mjs";
import { checkRateLimit } from "./_shared/ratelimit.mjs";
import { getSession } from "./_shared/session.mjs";
import { hasFullAI } from "./_shared/lemonsqueezy.mjs";

const TEASER_LIMIT = 4; // messages/day for non-owners
const OWNER_LIMIT = 100; // generous daily limit for Deliver/bundle owners

export default async (req, context) => {
  if (req.method === "OPTIONS") return preflight(req);
  if (req.method !== "POST") return json(req, 405, { error: "Method not allowed" });

  const { question, chapter, history } = await readJson(req);
  if (!question || typeof question !== "string" || question.trim().length < 3) {
    return json(req, 400, { error: "Please type a question." });
  }
  if (question.length > 1500) {
    return json(req, 400, { error: "Please keep your question under 1500 characters." });
  }

  // Owners (Deliver/bundle) get the full tutor; everyone else gets a teaser.
  const session = await getSession(req);
  const owner = session?.purpose === "session" && hasFullAI(session.ent);
  const rlKey = owner ? `askbook-owner:${session.email}` : `askbook:${clientIp(req, context)}`;
  const rl = await checkRateLimit(rlKey, owner ? OWNER_LIMIT : TEASER_LIMIT);
  if (!rl.ok) {
    return json(req, 429, {
      error: owner
        ? "You've hit today's usage limit. Please try again tomorrow."
        : "You've reached the free preview limit. Unlock the full AI tutor with the book.",
      paywall: !owner,
    });
  }

  // Retrieve grounded context. Optionally bias toward the current chapter.
  let chunks;
  try {
    const q = chapter ? `${question}\n(Focus on the ${chapter} chapter.)` : question;
    chunks = await retrieve(q, 6);
  } catch (e) {
    return json(req, 503, {
      error: "The AI tutor isn't initialized yet (missing embeddings index).",
    });
  }

  const context_block = buildContext(chunks);

  const system = `You are the AI tutor for the ebook "Design Patterns That Deliver" by Microsoft MVP Stefan Đokić, for .NET/C# developers.
Answer ONLY using the CONTEXT excerpts from the book below. The context is authoritative.
- If the answer isn't in the context, say so plainly and suggest the closest chapter — do NOT invent code or use generic internet examples.
- Be concrete and production-oriented (.NET, DI, MediatR, Scrutor, Polly where relevant).
- Prefer short explanations + a focused C# snippet when helpful.
- Cite the chapters you used by their names at the end as "Sources:".

CONTEXT:
${context_block}`;

  const messages = [
    ...(Array.isArray(history) ? history.slice(-6) : []),
    { role: "user", content: question.trim() },
  ];

  let answer;
  try {
    answer = await askLLM({
      system,
      tier: "smart",
      maxTokens: 900,
      temperature: 0.2,
      messages,
    });
  } catch (e) {
    return json(req, 502, { error: "The AI tutor is busy — please try again shortly." });
  }

  const seen = new Set();
  const sources = chunks
    .filter((c) => {
      const key = c.chapterSlug || c.chapter;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 3)
    .map((c) => ({ chapter: c.chapter, url: c.url }));

  return json(req, 200, { answer, sources, remaining: rl.remaining });
};
