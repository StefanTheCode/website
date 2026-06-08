// GET /api/auth-session — returns the current login state for the browser.
// { authenticated: bool, email?, entitlements?: string[] }

import { json, preflight } from "./_shared/http.mjs";
import { getSession } from "./_shared/session.mjs";

export default async (req) => {
  if (req.method === "OPTIONS") return preflight(req);

  const s = await getSession(req);
  if (!s || s.purpose !== "session") {
    return json(req, 200, { authenticated: false });
  }
  return json(req, 200, {
    authenticated: true,
    email: s.email,
    entitlements: s.ent || [],
  });
};
