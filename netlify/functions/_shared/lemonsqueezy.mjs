// Lemon Squeezy helpers: resolve what a customer owns, validate license keys,
// and match order numbers. No transactional email needed — LS emails the key.
//
// Map your LS product IDs to entitlements with env vars:
//   LS_PRODUCT_SIMPLIFIED = "123456"
//   LS_PRODUCT_DELIVER    = "234567"
//   LS_PRODUCT_BUNDLE     = "345678"
// Comma-separated lists are supported (multiple variants/products).

const LS_API = "https://api.lemonsqueezy.com/v1";

function idSet(envVal) {
  return new Set((envVal || "").split(",").map((s) => s.trim()).filter(Boolean));
}

/** Map a single LS product id -> entitlement list. */
export function entitlementsFromProductId(productId) {
  const pid = String(productId || "");
  const ent = new Set();
  if (idSet(process.env.LS_PRODUCT_SIMPLIFIED).has(pid)) ent.add("simplified");
  if (idSet(process.env.LS_PRODUCT_DELIVER).has(pid)) ent.add("deliver");
  if (idSet(process.env.LS_PRODUCT_BUNDLE).has(pid)) {
    ent.add("bundle");
    ent.add("deliver");
    ent.add("simplified");
  }
  return [...ent];
}

async function fetchOrders(email) {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) throw new Error("LEMONSQUEEZY_API_KEY is not configured");

  const orders = [];
  let url = `${LS_API}/orders?filter[user_email]=${encodeURIComponent(email)}&page[size]=100`;
  for (let guard = 0; guard < 10 && url; guard++) {
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Lemon Squeezy API error ${res.status}: ${detail.slice(0, 300)}`);
    }
    const data = await res.json();
    for (const o of data.data || []) orders.push(o);
    url = data.links?.next || null;
  }
  return orders;
}

function isPaid(a) {
  const status = (a.status || "").toLowerCase();
  const refunded = a.refunded === true || status === "refunded";
  return !refunded && (!status || ["paid", "active", "completed"].includes(status));
}

/** Entitlements the email owns (subset of simplified/deliver/bundle). */
export async function entitlementsForEmail(email) {
  const ent = new Set();
  for (const order of await fetchOrders(email)) {
    const a = order.attributes || {};
    if (!isPaid(a)) continue;
    const pid = String(a.product_id ?? a.first_order_item?.product_id ?? "");
    for (const e of entitlementsFromProductId(pid)) ent.add(e);
  }
  return [...ent];
}

/** True if `key` matches one of this email's paid order numbers / ids. */
export async function emailHasOrderKey(email, key) {
  const k = String(key || "").trim().replace(/^#/, "");
  if (!k) return false;
  for (const order of await fetchOrders(email)) {
    const a = order.attributes || {};
    if (!isPaid(a)) continue;
    if (String(a.order_number) === k || String(order.id) === k) return true;
  }
  return false;
}

/**
 * Validate a Lemon Squeezy license key (no store API key needed for this call).
 * Returns { valid, email, productId } — meta carries the buyer's email + product.
 */
export async function validateLicenseKey(licenseKey) {
  const res = await fetch(`${LS_API}/licenses/validate`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ license_key: String(licenseKey || "").trim() }),
  });
  if (!res.ok) return { valid: false };
  const data = await res.json().catch(() => ({}));
  if (!data.valid) return { valid: false };
  const meta = data.meta || {};
  return {
    valid: true,
    email: (meta.customer_email || "").toLowerCase(),
    productId: String(meta.product_id || ""),
    status: data.license_key?.status,
  };
}

/** Does this set of entitlements grant access to a given book slug? */
export function canRead(entitlements, bookSlug) {
  const e = new Set(entitlements || []);
  if (e.has("bundle")) return true;
  if (bookSlug === "design-patterns-that-deliver") return e.has("deliver");
  if (bookSlug === "design-patterns-simplified") return e.has("simplified") || e.has("deliver");
  return false;
}

/** Full AI tools (Ask the Book) require owning Deliver or the bundle. */
export function hasFullAI(entitlements) {
  const e = new Set(entitlements || []);
  return e.has("deliver") || e.has("bundle");
}
