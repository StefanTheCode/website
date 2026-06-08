// Provider-agnostic LLM client. Switch with LLM_PROVIDER ("openai" | "anthropic").
// Defaults to OpenAI so a single OPENAI_API_KEY powers both generation and
// embeddings. Set LLM_PROVIDER=anthropic (+ ANTHROPIC_API_KEY) to use Claude.
//
// Tiers: "fast" for high-volume/cheap calls, "smart" for the flagship tutor.

const PROVIDER = process.env.LLM_PROVIDER || "openai";

const MODELS = {
  openai: {
    fast: process.env.OPENAI_MODEL_FAST || "gpt-4o-mini",
    smart: process.env.OPENAI_MODEL_SMART || "gpt-4o",
  },
  anthropic: {
    fast: process.env.CLAUDE_MODEL_FAST || "claude-haiku-4-5-20251001",
    smart: process.env.CLAUDE_MODEL_SMART || "claude-sonnet-4-6",
  },
};

async function callOpenAI({ system, messages, model, maxTokens, temperature }) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not configured");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI API error ${res.status}: ${detail.slice(0, 400)}`);
  }
  const data = await res.json();
  return (data.choices?.[0]?.message?.content || "").trim();
}

async function callAnthropic({ system, messages, model, maxTokens, temperature }) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not configured");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, temperature, system, messages }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Anthropic API error ${res.status}: ${detail.slice(0, 400)}`);
  }
  const data = await res.json();
  return (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

/**
 * @param {object} o
 * @param {string} o.system
 * @param {Array<{role:'user'|'assistant',content:string}>} o.messages
 * @param {'fast'|'smart'} [o.tier]
 * @param {number} [o.maxTokens]
 * @param {number} [o.temperature]
 */
export async function askLLM({
  system,
  messages,
  tier = "fast",
  maxTokens = 1024,
  temperature = 0.3,
}) {
  const model = (MODELS[PROVIDER] || MODELS.openai)[tier];
  const args = { system, messages, model, maxTokens, temperature };
  return PROVIDER === "anthropic" ? callAnthropic(args) : callOpenAI(args);
}
