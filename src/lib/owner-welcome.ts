// Owner welcome email. Fired from createOwnerAction the moment an
// admin links a new landlord into the platform. Closes the silent
// 24-48h gap between "we created your account" and "you logged in
// and saw your portfolio".
//
// Best-effort by design. Failures here MUST NOT roll back the owner
// row — a missing welcome email is recoverable (we can resend), a
// missing owner row is not. Both Supabase magic-link generation and
// Resend send happen inside try/catch and log on failure.
//
// Env vars used (all optional; we degrade gracefully if absent):
//   RESEND_API_KEY      → real send via Resend
//   RESEND_FROM_OWNERS  → from address; defaults to "Goldstay
//                          <hello@goldstay.co.ke>"
//   PUBLIC_SITE_URL     → base for the magic-link redirect; defaults
//                          to https://goldstay.co.ke
//   NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY → required to mint
//                          the magic link itself; if missing we skip
//                          the link and just send a "your account is
//                          ready, head to /login" note.

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type WelcomeInput = {
  email: string;
  fullName: string;
  companyName?: string | null;
  country: "KE" | "GH";
};

const DEFAULT_FROM = "Goldstay <hello@goldstay.co.ke>";
const DEFAULT_SITE = "https://goldstay.co.ke";

export async function sendOwnerWelcomeEmail(input: WelcomeInput): Promise<{
  ok: boolean;
  reason?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_OWNERS || DEFAULT_FROM;
  const siteUrl = process.env.PUBLIC_SITE_URL || DEFAULT_SITE;

  // Always try to mint a magic link, but tolerate failure: if Supabase
  // is misconfigured (missing service key in dev) we still want the
  // welcome note to land. The fallback note tells the landlord to use
  // /login, which is the same flow they'd land on anyway.
  let magicLink: string | null = null;
  try {
    magicLink = await mintMagicLink(input.email, siteUrl);
  } catch (err) {
    console.warn("[owner-welcome] magic-link generation failed", err);
  }

  const subject = "Welcome to Goldstay";
  const text = renderText({ ...input, magicLink, siteUrl });
  const html = renderHtml({ ...input, magicLink, siteUrl });

  if (!apiKey) {
    // Dev / preview without Resend — write to logs so the operator
    // can copy the magic link out of Vercel logs and email it
    // manually if needed. Production Vercel env always has the key.
    console.log(`[owner-welcome] would send to ${input.email}\n${text}`);
    return { ok: true, reason: "logged-only" };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: [input.email],
      subject,
      text,
      html,
    });
    return { ok: true };
  } catch (err) {
    console.error("[owner-welcome] Resend send failed", err);
    return { ok: false, reason: "send-failed" };
  }
}

async function mintMagicLink(
  email: string,
  siteUrl: string,
): Promise<string | null> {
  const supabase = createSupabaseAdminClient();
  const redirectTo = new URL("/auth/callback?next=/owner", siteUrl).toString();
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });
  if (error) {
    console.warn("[owner-welcome] generateLink error", error);
    return null;
  }
  return data?.properties?.action_link ?? null;
}

function renderText({
  fullName,
  companyName,
  country,
  magicLink,
  siteUrl,
}: WelcomeInput & { magicLink: string | null; siteUrl: string }): string {
  const greeting = `Hi ${fullName.split(/\s+/)[0] || "there"},`;
  const accountLine = companyName
    ? `Your Goldstay landlord account for ${companyName} is ready.`
    : "Your Goldstay landlord account is ready.";
  const market =
    country === "KE"
      ? "Kenya (Nairobi)"
      : country === "GH"
        ? "Ghana (Accra)"
        : "your market";

  const linkBlock = magicLink
    ? [
        "One-click sign-in (valid for 60 minutes):",
        magicLink,
        "",
        "If the link expires, just request a fresh one at",
        `${siteUrl}/login`,
      ].join("\n")
    : `Head to ${siteUrl}/login and we'll email you a one-click sign-in link.`;

  return [
    greeting,
    "",
    accountLine,
    `We've set you up for ${market}. From your portal you can:`,
    "",
    "  • See every property we manage for you, with live occupancy.",
    "  • Download your monthly statement as a PDF.",
    "  • Browse every transaction behind that statement.",
    "  • Sign your management agreement when it's ready.",
    "",
    linkBlock,
    "",
    "Questions? Reply to this email and you'll reach a real person at",
    "Goldstay. We answer within one business day.",
    "",
    "— The Goldstay team",
  ].join("\n");
}

function renderHtml({
  fullName,
  companyName,
  country,
  magicLink,
  siteUrl,
}: WelcomeInput & { magicLink: string | null; siteUrl: string }): string {
  const firstName = fullName.split(/\s+/)[0] || "there";
  const accountLine = companyName
    ? `Your Goldstay landlord account for <strong>${escapeHtml(companyName)}</strong> is ready.`
    : "Your Goldstay landlord account is ready.";
  const market =
    country === "KE" ? "Kenya (Nairobi)" : country === "GH" ? "Ghana (Accra)" : "your market";

  const cta = magicLink
    ? `<p style="margin:32px 0;text-align:center"><a href="${escapeAttr(magicLink)}" style="background:#1c1917;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:600;font-size:15px;display:inline-block">Open my landlord portal →</a></p><p style="color:#78716c;font-size:13px;margin:0;text-align:center">One-click sign-in. Link valid for 60 minutes.</p>`
    : `<p style="margin:32px 0;text-align:center"><a href="${escapeAttr(siteUrl)}/login" style="background:#1c1917;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:600;font-size:15px;display:inline-block">Sign in to my portal →</a></p><p style="color:#78716c;font-size:13px;margin:0;text-align:center">We'll email you a one-click sign-in link.</p>`;

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1c1917">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafaf9;padding:40px 16px">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e7e5e4;border-radius:12px;padding:40px">
            <tr>
              <td>
                <p style="font-size:18px;font-family:Georgia,'Times New Roman',serif;color:#1c1917;margin:0 0 4px 0">Goldstay<span style="color:#b91c1c">.</span></p>
                <h1 style="font-size:24px;font-family:Georgia,'Times New Roman',serif;color:#1c1917;margin:24px 0 0 0;font-weight:normal">Welcome, ${escapeHtml(firstName)}.</h1>
                <p style="color:#44403c;line-height:1.55;margin:16px 0 0 0">${accountLine} We've set you up for <strong>${market}</strong>. From your portal you can:</p>
                <ul style="color:#44403c;line-height:1.7;margin:16px 0 0 0;padding-left:20px">
                  <li>See every property we manage for you, with live occupancy.</li>
                  <li>Download your monthly statement as a PDF.</li>
                  <li>Browse every transaction behind that statement.</li>
                  <li>Sign your management agreement when it's ready.</li>
                </ul>
                ${cta}
                <p style="color:#78716c;font-size:13px;line-height:1.55;margin:32px 0 0 0;border-top:1px solid #e7e5e4;padding-top:24px">Questions? Reply to this email and you'll reach a real person at Goldstay. We answer within one business day.</p>
                <p style="color:#a8a29e;font-size:12px;margin:24px 0 0 0">Goldstay · Premium property management in Nairobi &amp; Accra</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}
