// Step 1 of magic-link login.
// POST /api/auth-request  { email }
// Looks up the email's purchases in Lemon Squeezy. If they own something,
// emails a short-lived sign-in link. Always returns the same generic response
// so the endpoint can't be used to enumerate who bought what.

import { json, preflight, readJson, clientIp } from "./_shared/http.mjs";
import { checkRateLimit } from "./_shared/ratelimit.mjs";
import { entitlementsForEmail } from "./_shared/lemonsqueezy.mjs";
import { sign } from "./_shared/session.mjs";
import { sendMagicLink } from "./_shared/email.mjs";

const GENERIC = {
  ok: true,
  message: "If that email has a purchase, we've sent a sign-in link. Check your inbox.",
};

function siteOrigin(req) {
  return process.env.URL || process.env.DEPLOY_PRIME_URL || new URL(req.url).origin;
}

export default async (req, context) => {
  if (req.method === "OPTIONS") return preflight(req);
  if (req.method !== "POST") return json(req, 405, { error: "Method not allowed" });

  const { email } = await readJson(req);
  const clean = (email || "").trim().toLowerCase();
  if (!clean || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) {
    return json(req, 400, { error: "Please enter a valid email." });
  }

  // Throttle by email and IP to prevent abuse / spam.
  const ipRl = await checkRateLimit(`authreq-ip:${clientIp(req, context)}`, 15);
  const emailRl = await checkRateLimit(`authreq-email:${clean}`, 5);
  if (!ipRl.ok || !emailRl.ok) {
    return json(req, 429, { error: "Too many attempts. Please try again later." });
  }

  try {
    const ent = await entitlementsForEmail(clean);
    if (ent.length > 0) {
      const token = await sign({
        email: clean,
        ent,
        purpose: "login",
        exp: Date.now() + 15 * 60 * 1000, // 15 minutes
      });
      const url = `${siteOrigin(req)}/api/auth-verify?token=${encodeURIComponent(token)}`;
      await sendMagicLink(clean, url);
    }
    // else: no purchase — stay silent (generic response below).
  } catch (e) {
    return json(req, 502, { error: "Couldn't verify your purchase right now. Please try again." });
  }

  return json(req, 200, GENERIC);
};
