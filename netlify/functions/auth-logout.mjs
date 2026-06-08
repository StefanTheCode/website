// POST /api/auth-logout — clears the session cookie.

import { json, preflight, corsHeaders } from "./_shared/http.mjs";
import { clearCookie } from "./_shared/session.mjs";

export default async (req) => {
  if (req.method === "OPTIONS") return preflight(req);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(req),
      "Set-Cookie": clearCookie(),
    },
  });
};
