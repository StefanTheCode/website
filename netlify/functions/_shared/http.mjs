// Shared HTTP helpers for Netlify Functions v2 (Request/Response).

const ALLOWED_ORIGINS = [
  "https://thecodeman.net",
  "https://www.thecodeman.net",
  "http://localhost:3000",
];

export function corsHeaders(req) {
  const origin = req.headers.get("origin") || "";
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function json(req, status, data, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(req),
      ...extraHeaders,
    },
  });
}

export function preflight(req) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

export function clientIp(req, context) {
  return (
    context?.ip ||
    req.headers.get("x-nf-client-connection-ip") ||
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "unknown"
  );
}

export async function readJson(req) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}
