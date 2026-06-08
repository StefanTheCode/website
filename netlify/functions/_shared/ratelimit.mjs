// Simple per-key daily rate limiting backed by Netlify Blobs.
// Fails OPEN (allows the request) if Blobs is unavailable, so a storage
// hiccup never takes the tools down.

let getStore;
try {
  ({ getStore } = await import("@netlify/blobs"));
} catch {
  getStore = null;
}

/**
 * @returns {Promise<{ok:boolean, remaining:number, limit:number}>}
 */
export async function checkRateLimit(key, limit = 20, windowHours = 24) {
  if (!getStore) return { ok: true, remaining: limit, limit };

  try {
    const store = getStore("ai-rate-limits");
    const day = new Date().toISOString().slice(0, 10);
    const slot = windowHours >= 24 ? day : `${day}-${new Date().getUTCHours()}`;
    const id = `${key}:${slot}`;

    const current = Number((await store.get(id)) || 0);
    if (current >= limit) return { ok: false, remaining: 0, limit };

    await store.set(id, String(current + 1));
    return { ok: true, remaining: limit - current - 1, limit };
  } catch {
    return { ok: true, remaining: limit, limit }; // fail open
  }
}
