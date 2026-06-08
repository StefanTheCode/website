// Embeddings helper shared by the build script and the RAG runtime.
// Provider-agnostic: defaults to OpenAI text-embedding-3-small (cheap, solid).
// Set EMBEDDINGS_PROVIDER=voyage to use Voyage AI (Anthropic's recommended partner).

const PROVIDER = process.env.EMBEDDINGS_PROVIDER || "openai";

const CONFIG = {
  openai: {
    url: "https://api.openai.com/v1/embeddings",
    model: process.env.OPENAI_EMBEDDINGS_MODEL || "text-embedding-3-small",
    keyEnv: "OPENAI_API_KEY",
    auth: (k) => ({ Authorization: `Bearer ${k}` }),
    body: (input, model) => ({ input, model }),
    parse: (d) => d.data.map((x) => x.embedding),
  },
  voyage: {
    url: "https://api.voyageai.com/v1/embeddings",
    model: process.env.VOYAGE_EMBEDDINGS_MODEL || "voyage-3",
    keyEnv: "VOYAGE_API_KEY",
    auth: (k) => ({ Authorization: `Bearer ${k}` }),
    body: (input, model) => ({ input, model }),
    parse: (d) => d.data.map((x) => x.embedding),
  },
};

/**
 * Embed one or more strings. Returns an array of vectors (array of numbers).
 * @param {string|string[]} input
 */
export async function embed(input) {
  const cfg = CONFIG[PROVIDER];
  if (!cfg) throw new Error(`Unknown EMBEDDINGS_PROVIDER: ${PROVIDER}`);
  const key = process.env[cfg.keyEnv];
  if (!key) throw new Error(`${cfg.keyEnv} is not configured`);

  const inputs = Array.isArray(input) ? input : [input];
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { "content-type": "application/json", ...cfg.auth(key) },
    body: JSON.stringify(cfg.body(inputs, cfg.model)),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Embeddings API error ${res.status}: ${detail.slice(0, 300)}`);
  }
  return cfg.parse(await res.json());
}

export function cosineSimilarity(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}
