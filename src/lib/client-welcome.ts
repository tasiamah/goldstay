// Client welcome email. Fired from createClientAction the moment an
// admin links a new landlord into the platform. Closes the silent
// 24-48h gap between "we created your account" and "you logged in
// and saw your portfolio".
//
// Best-effort by design. Failures here MUST NOT roll back the client
// row — a missing welcome email is recoverable (we can resend), a
// missing client row is not. Both Supabase magic-link generation and
// Resend send happen inside try/catch and log on failure.
//
// Env vars used (all optional; we degrade gracefully if absent):
//   RESEND_API_KEY      → real send via Resend
//   RESEND_FROM_CLIENTS  → from address; defaults to "Goldstay
//                          <hello@goldstay.co.ke>". Still falls back to
//                          RESEND_FROM_OWNERS, its name before the
//                          owner -> client rename, so a deploy that
//                          runs before the Vercel env var is renamed
//                          keeps sending from the right address.
//   PUBLIC_SITE_URL     → base for the magic-link redirect; defaults
//                          to https://goldstay.co.ke
//   NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY → required to mint
//                          the magic link itself; if missing we skip
//                          the link and just send a "your account is
//                          ready, head to /login" note.

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { logCommunication } from "@/lib/comms";
import { recordAudit } from "@/lib/audit";
import type { CurrentActor } from "@/lib/auth";

type WelcomeInput = {
  email: string;
  fullName: string;
  companyName?: string | null;
  country: "KE" | "GH";
  // Client row id, if known. When supplied, we mirror the send into
  // CommunicationLog so the client detail page renders it under
  // "Communications". Optional so this module can still be called
  // from places where we don't have the id (e.g. ad-hoc scripts).
  clientId?: string | null;
  // The admin who triggered the send (for manual resends). System-
  // initiated sends pass null and the audit trail attributes the
  // event to "system".
  actor?: CurrentActor | null;
  // Which event this send represents on the client's audit timeline.
  // An operator reading the history needs to tell "we welcomed them"
  // apart from "we welcomed them again", so the two get distinct
  // actions. Defaults to the initial send, which is every caller
  // except the resend button.
  auditAction?: "client.welcomed" | "client.welcomed.resent";
};

const DEFAULT_FROM = "Goldstay <hello@goldstay.co.ke>";
const DEFAULT_SITE = "https://goldstay.co.ke";

// Whether outbound email can actually leave the building. False means
// every send in the app is a no-op that still reports success, so the
// admin UI needs to say so rather than showing a clean confirmation.
export function isEmailDeliveryConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

// `ok` means "nothing went wrong". `delivered` means "Resend actually
// accepted it". They come apart when RESEND_API_KEY is missing: the
// send is a no-op, ok stays true because the client row is fine and
// there is nothing for the operator to retry, but nothing reached the
// landlord. Callers that report success to a human must branch on
// `delivered`, not `ok`.
export async function sendClientWelcomeEmail(input: WelcomeInput): Promise<{
  ok: boolean;
  delivered: boolean;
  reason?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_CLIENTS ||
    process.env.RESEND_FROM_OWNERS ||
    DEFAULT_FROM;
  const siteUrl = process.env.PUBLIC_SITE_URL || DEFAULT_SITE;

  // Always try to mint a "set your password" recovery link, but
  // tolerate failure: if Supabase is misconfigured (missing service
  // key in dev) we still want the welcome note to land. The fallback
  // note tells the landlord to use /login, which is the same flow
  // they'd land on anyway.
  //
  // We deliberately use a recovery link rather than a one-shot magic
  // link here: new clients should leave their first session with a
  // password set so subsequent sign-ins are instant. The recovery
  // landing page (/account/password) is gated on a valid session, so
  // the same link both authenticates them and drops them into the
  // form to choose credentials.
  let magicLink: string | null = null;
  try {
    magicLink = await mintSetPasswordLink(input.email, siteUrl);
  } catch (err) {
    console.warn("[client-welcome] set-password link generation failed", err);
  }

  const subject = "Welcome to Goldstay";
  const text = renderText({ ...input, magicLink, siteUrl });
  const html = renderHtml({ ...input, magicLink, siteUrl });

  if (!apiKey) {
    // Dev / preview without Resend — write to logs so the operator
    // can copy the magic link out of Vercel logs and email it
    // manually if needed. Production Vercel env always has the key.
    console.log(`[client-welcome] would send to ${input.email}\n${text}`);
    await maybeLogComms(input, "QUEUED", null, subject);
    await maybeRecordAudit(input, false);
    return { ok: true, delivered: false, reason: "logged-only" };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: [input.email],
      subject,
      text,
      html,
    });
    await maybeLogComms(
      input,
      "SENT",
      (result?.data?.id as string | undefined) ?? null,
      subject,
    );
    await maybeRecordAudit(input, true);
    return { ok: true, delivered: true };
  } catch (err) {
    console.error("[client-welcome] Resend send failed", err);
    await maybeLogComms(input, "FAILED", null, subject);
    return { ok: false, delivered: false, reason: "send-failed" };
  }
}

// Mirror the send into CommunicationLog when we have the client row.
// Errors here are intentionally swallowed: a logging hiccup must
// never roll back the actual send. Status reflects what we attempted
// rather than what eventually delivered (Resend webhooks would tell
// us the latter; that's a separate plumbing pass).
async function maybeLogComms(
  input: WelcomeInput,
  status: "QUEUED" | "SENT" | "FAILED",
  providerId: string | null,
  subject: string,
): Promise<void> {
  if (!input.clientId) return;
  try {
    await logCommunication({
      clientId: input.clientId,
      channel: "EMAIL",
      direction: "OUTBOUND",
      subject,
      status,
      providerId,
      actor: input.actor ?? null,
    });
  } catch (err) {
    console.warn("[client-welcome] logCommunication failed", err);
  }
}

// Record the send on the client's audit timeline.
//
// Separate from maybeLogComms, which feeds the client-facing
// "Communications" tab. This is the operator-facing "who did what"
// trail, and until now it only ever showed resends: the audit label
// `client.welcomed` was defined but never recorded anywhere, so a
// client's history could open with "welcome email resent" and no
// original send above it.
//
// Swallows its own errors for the same reason as the comms mirror —
// a bookkeeping failure must never make a successful send look like
// a failed one. Requires an actor because recordAudit attributes
// every row to an admin email, and a system-initiated send has
// nobody to attribute it to.
async function maybeRecordAudit(
  input: WelcomeInput,
  delivered: boolean,
): Promise<void> {
  if (!input.clientId || !input.actor) return;
  const action = input.auditAction ?? "client.welcomed";
  const resent = action === "client.welcomed.resent";
  try {
    await recordAudit({
      actor: input.actor,
      entity: "CLIENT",
      entityId: input.clientId,
      action,
      // The summary has to distinguish a real send from a no-op. An
      // entry reading "Welcome email sent" when RESEND_API_KEY was
      // missing is worse than no entry: it tells an operator chasing
      // a landlord who never got their link that the email went out.
      summary: delivered
        ? resent
          ? `Welcome email resent to ${input.email}`
          : `Welcome email sent to ${input.email}`
        : `Welcome email for ${input.email} was logged only, not delivered — email sending is not configured`,
      metadata: { delivered, resent },
    });
  } catch (err) {
    console.warn("[client-welcome] recordAudit failed", err);
  }
}

async function mintSetPasswordLink(
  email: string,
  siteUrl: string,
): Promise<string | null> {
  const supabase = createSupabaseAdminClient();
  // We point the post-exchange redirect at /account/password so the
  // first thing a brand-new client sees after clicking the link is
  // the "choose a password" form. The form's onward redirect, in
  // turn, puts them on /client once saved — same end state as the
  // old magic-link flow but with credentials on file so future
  // sign-ins are instant.
  //
  // We stick with type: "magiclink" rather than "recovery" because
  // magiclink works for both existing and brand-new auth users
  // (Supabase provisions on demand), whereas recovery requires the
  // user to already exist. The first call from createClientAction is
  // always for a fresh email, so this matters.
  const redirectTo = new URL(
    "/auth/callback?next=/account/password",
    siteUrl,
  ).toString();
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });
  if (error) {
    console.warn("[client-welcome] generateLink error", error);
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
    ? `Your Goldstay account for ${companyName} is ready.`
    : "Your Goldstay account is ready.";
  const market =
    country === "KE"
      ? "Kenya (Nairobi)"
      : country === "GH"
        ? "Ghana (Accra)"
        : "your market";

  const linkBlock = magicLink
    ? [
        "Set your password and open your portal (link valid for 60 minutes):",
        magicLink,
        "",
        "If the link expires, request a fresh one at",
        `${siteUrl}/login`,
        "by entering your email and clicking \"Forgot password?\".",
      ].join("\n")
    : `Head to ${siteUrl}/login, enter ${"your email"} and click "Forgot password?" — we'll email you a link to set your password.`;

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
    "Best,",
    "The Goldstay team",
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
    ? `Your Goldstay account for <strong>${escapeHtml(companyName)}</strong> is ready.`
    : "Your Goldstay account is ready.";
  const market =
    country === "KE" ? "Kenya (Nairobi)" : country === "GH" ? "Ghana (Accra)" : "your market";

  const cta = magicLink
    ? `<p style="margin:32px 0;text-align:center"><a href="${escapeAttr(magicLink)}" style="background:#1c1917;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:600;font-size:15px;display:inline-block">Set my password &amp; open my portal &rarr;</a></p><p style="color:#78716c;font-size:13px;margin:0;text-align:center">Link valid for 60 minutes. You\u2019ll set a password so future sign-ins are instant.</p>`
    : `<p style="margin:32px 0;text-align:center"><a href="${escapeAttr(siteUrl)}/login" style="background:#1c1917;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:600;font-size:15px;display:inline-block">Sign in to my portal &rarr;</a></p><p style="color:#78716c;font-size:13px;margin:0;text-align:center">Use \u201cForgot password?\u201d to set a password — sign-ins are instant after that.</p>`;

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
