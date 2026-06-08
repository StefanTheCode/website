// Minimal, dependency-free Anthropic Claude client (Messages API).
// Uses global fetch (Node 22). Key comes from ANTHROPIC_API_KEY env var.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

// Model tiers — keep cheap models for high-volume tools.
export const MODELS = {
  fast: process.env.CLAUDE_MODEL_FAST || "claude-haiku-4-5-20251001",
  smart: process.env.CLAUDE_MODEL_SMART || "claude-sonnet-4-6",
};

/**
 * Call Claude and return the concatenated text output.
 * @param {object} opts
 * @param {string} opts.system - system prompt
 * @param {Array<{role:string,content:string}>} opts.messages
 * @param {string} [opts.model]
 * @param {number} [opts.maxTokens]
 * @param {number} [opts.temperature]
 */
export async function askClaude({
  system,
  messages,
  model = MODELS.fast,
  maxTokens = 1024,
  temperature = 0.3,
}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
      "content-type": "application/json",
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, temperature, system, messages }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Anthropic API error ${res.status}: ${detail.slice(0, 500)}`);
  }

  const data = await res.json();
  return (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}
