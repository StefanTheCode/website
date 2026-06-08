// Pluggable transactional email. Choose with EMAIL_PROVIDER:
//   "console" (default) — logs the link to the function log (great for local/dev)
//   "resend"            — RESEND_API_KEY
//   "ses"               — Amazon SES (works with EmailOctopus Connect setups):
//                         AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
//
// EmailOctopus itself has no transactional API, so it's not a sender here —
// keep it for the newsletter. (Optionally add the buyer to a list elsewhere.)

const FROM = process.env.EMAIL_FROM || "TheCodeMan <login@thecodeman.net>";
const PROVIDER = process.env.EMAIL_PROVIDER || "console";

function magicLinkHtml(url) {
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#140A2E;color:#D4CDE6;padding:32px">
  <div style="max-width:480px;margin:0 auto;background:#22184C;border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:32px">
    <h1 style="color:#F3EFFA;font-size:22px;margin:0 0 12px">Your sign-in link</h1>
    <p style="margin:0 0 20px;line-height:1.6">Click the button below to open your books and the AI tutor. This link expires in 15 minutes.</p>
    <a href="${url}" style="display:inline-block;background:#FFB31B;color:#2a1500;font-weight:700;text-decoration:none;padding:13px 26px;border-radius:10px">Open my library →</a>
    <p style="margin:22px 0 0;font-size:13px;color:#9C92B8">If you didn't request this, you can ignore this email.</p>
  </div></body></html>`;
}

async function sendResend(to, subject, html) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

// Minimal SES v2 SendEmail via SigV4 would add a lot of code; for SES we use the
// simpler approach of the AWS SDK if present. Kept lazy so it's optional.
async function sendSes(to, subject, html) {
  const { SESv2Client, SendEmailCommand } = await import("@aws-sdk/client-sesv2");
  const client = new SESv2Client({ region: process.env.AWS_REGION || "eu-central-1" });
  await client.send(
    new SendEmailCommand({
      FromEmailAddress: FROM,
      Destination: { ToAddresses: [to] },
      Content: { Simple: { Subject: { Data: subject }, Body: { Html: { Data: html } } } },
    })
  );
}

export async function sendMagicLink(email, url) {
  const subject = "Your TheCodeMan sign-in link";
  const html = magicLinkHtml(url);

  if (PROVIDER === "resend") return sendResend(email, subject, html);
  if (PROVIDER === "ses") return sendSes(email, subject, html);

  // console (dev) fallback — never throws, just logs.
  console.log(`[email:console] Magic link for ${email}: ${url}`);
}
