// Step 2 of magic-link login.
// GET /api/auth-verify?token=...
// Verifies the token, sets the session cookie, and redirects back to where the
// user started (returnTo) or /read.

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
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });

  const dest =
    typeof payload.returnTo === "string" &&
    payload.returnTo.startsWith("/") &&
    !payload.returnTo.startsWith("//")
      ? payload.returnTo
      : "/read";

  const sep = dest.includes("?") ? "&" : "?";
  return redirect(`${origin}${dest}${sep}login=ok`, sessionCookie(session));
};
