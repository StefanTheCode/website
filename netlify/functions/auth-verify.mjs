// Step 2 of magic-link login.
// GET /api/auth-verify?token=...
// Verifies the magic-link token, sets the session cookie, and redirects to /read.

import { verify, sign, sessionCookie } from "./_shared/session.mjs";

function siteOrigin(req) {
  return process.env.URL || process.env.DEPLOY_PRIME_URL || new URL(req.url).origin;
}

function redirect(to, cookie) {
  const headers = { Location: to };
  if (cookie) headers["Set-Cookie"] = cookie;
  return new Response(null, { status: 302, headers });
}

export default async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const origin = siteOrigin(req);

  const payload = await verify(token);
  if (!payload || payload.purpose !== "login") {
    return redirect(`${origin}/read?login=expired`);
  }

  const session = await sign({
    email: payload.email,
    ent: payload.ent || [],
    purpose: "session",
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return redirect(`${origin}/read?login=ok`, sessionCookie(session));
};
