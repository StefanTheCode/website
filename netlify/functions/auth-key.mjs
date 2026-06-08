// Direct login with email + key (no email sent by us).
// POST /api/auth-key  { email, key }
//   - key = Lemon Squeezy LICENSE KEY (new buyers; LS emails it automatically), or
//   - key = ORDER NUMBER (existing buyers; you send it manually).
// On success, sets the session cookie and returns the entitlements.

import { json, preflight, readJson, clientIp } from "./_shared/http.mjs";
import { checkRateLimit } from "./_shared/ratelimit.mjs";
import { sign, sessionCookie } from "./_shared/session.mjs";
import {
  validateLicenseKey,
  entitlementsFromProductId,
  entitlementsForEmail,
  emailHasOrderKey,
} from "./_shared/lemonsqueezy.mjs";

export default async (req, context) => {
  if (req.method === "OPTIONS") return preflight(req);
  if (req.method !== "POST") return json(req, 405, { error: "Method not allowed" });

  const body = await readJson(req);
  const email = (body.email || "").trim().toLowerCase();
  const key = (body.key || "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json(req, 400, { error: "Please enter a valid email." });
  }
  if (key.length < 3) {
    return json(req, 400, { error: "Please enter your license key or order number." });
  }

  // Throttle to stop brute force of order numbers / keys.
  const ipRl = await checkRateLimit(`authkey-ip:${clientIp(req, context)}`, 20);
  const emRl = await checkRateLimit(`authkey-email:${email}`, 10);
  if (!ipRl.ok || !emRl.ok) {
    return json(req, 429, { error: "Too many attempts. Please try again later." });
  }

  let identityEmail = email;
  let ent = [];

  try {
    // 1) Try as a Lemon Squeezy license key (the key itself proves ownership).
    const lic = await validateLicenseKey(key);
    if (lic.valid) {
      identityEmail = lic.email || email;
      ent = entitlementsFromProductId(lic.productId);
      if (ent.length === 0) ent = await entitlementsForEmail(identityEmail);
    } else {
      // 2) Fall back to order number tied to this email (existing customers).
      const match = await emailHasOrderKey(email, key);
      if (match) ent = await entitlementsForEmail(email);
    }
  } catch (e) {
    return json(req, 502, { error: "Couldn't verify right now. Please try again." });
  }

  if (ent.length === 0) {
    return json(req, 401, {
      error: "We couldn't match that email and key. Use the email you bought with and the key/order number from your receipt.",
    });
  }

  const token = await sign({
    email: identityEmail,
    ent,
    purpose: "session",
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });

  return new Response(JSON.stringify({ ok: true, email: identityEmail, entitlements: ent }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": req.headers.get("origin") || "https://thecodeman.net",
      "Access-Control-Allow-Credentials": "true",
      Vary: "Origin",
      "Set-Cookie": sessionCookie(token),
    },
  });
};
