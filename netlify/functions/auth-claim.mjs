// Permanent personal access link.
// GET /api/auth-claim?id=<order_id>&k=<order_identifier_uuid>
// Validates the order against Lemon Squeezy (the UUID is the unguessable secret),
// sets a session cookie, and redirects into the reader. The link is permanent —
// customers can bookmark it. Delivered via the LS receipt button (new buyers)
// or a one-time broadcast (existing buyers).

import { clientIp } from "./_shared/http.mjs";
import { checkRateLimit } from "./_shared/ratelimit.mjs";
import { sign, sessionCookie } from "./_shared/session.mjs";
import {
  getOrderById,
  entitlementsFromProductId,
  entitlementsForEmail,
} from "./_shared/lemonsqueezy.mjs";

function siteOrigin(req) {
  return process.env.URL || process.env.DEPLOY_PRIME_URL || new URL(req.url).origin;
}
function redirect(to, cookie) {
  const headers = { Location: to };
  if (cookie) headers["Set-Cookie"] = cookie;
  return new Response(null, { status: 302, headers });
}

export default async (req, context) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const k = url.searchParams.get("k");
  const base = siteOrigin(req);

  const rl = await checkRateLimit(`claim:${clientIp(req, context)}`, 40);
  if (!rl.ok) return redirect(`${base}/read?login=ratelimited`);
  if (!id || !k) return redirect(`${base}/read?login=invalid`);

  let order;
  try {
    order = await getOrderById(id);
  } catch {
    return redirect(`${base}/read?login=error`);
  }

  // The UUID identifier must match — that's the secret an attacker can't guess.
  if (!order || order.identifier !== k || order.refunded) {
    return redirect(`${base}/read?login=invalid`);
  }

  let ent = entitlementsFromProductId(order.productId);
  if (ent.length === 0) {
    try { ent = await entitlementsForEmail(order.email); } catch { /* ignore */ }
  }
  if (ent.length === 0) return redirect(`${base}/read?login=invalid`);

  const session = await sign({
    email: order.email,
    ent,
    purpose: "session",
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });
  return redirect(`${base}/read?login=ok`, sessionCookie(session));
};
