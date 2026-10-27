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

import { createInvite, INVITE_TTL_DAYS, inviteUrl } from "@/lib/clients/invite";
import { logCommunication } from "@/lib/comms";
import { recordAudit } from "@/lib/audit";
import type { CurrentActor } from "@/lib/auth";
import { launchedCityPhrase } from "@/lib/site";

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
  // Why we are writing. A nudge to someone who never reached the
  // portal opens differently to a first hello, and the invite row
  // records the same reason so the two are distinguishable later.
  tone?: "welcome" | "never-signed-in" | "self-requested";
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

  // A Goldstay invite link, not a Supabase one.
  //
  // We used to mint a magic link here and email it. It lasted an hour
  // and could be used once, and because /auth/callback spends the
  // token on a GET, any mail scanner that prefetched the URL burned
  // it before the landlord clicked. Three of the first seventeen
  // clients never completed login. See lib/clients/invite.
  //
  // Still best-effort: if this fails we send the note anyway, telling
  // them to use /login, which is where they would end up regardless.
  let magicLink: string | null = null;
  if (input.clientId) {
    try {
      const token = await createInvite({
        clientId: input.clientId,
        reason:
          input.tone === "never-signed-in"
            ? "NEVER_SIGNED_IN"
            : input.tone === "self-requested"
              ? "SELF_REQUESTED"
              : input.auditAction === "client.welcomed.resent"
                ? "RESEND"
                : "WELCOME",
      });
      magicLink = inviteUrl(token, siteUrl);
    } catch (err) {
      console.warn("[client-welcome] invite link generation failed", err);
    }
  }

  const subject =
    input.tone === "never-signed-in"
      ? "Your Goldstay portal is waiting \u2014 here\u2019s a fresh link"
      : input.tone === "self-requested"
        ? "Your new Goldstay sign-in link"
        : "Welcome to Goldstay";
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

function renderText({
  fullName,
  companyName,
  country,
  tone,
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
        "Open your portal and set a password:",
        magicLink,
        "",
        `This link works for ${INVITE_TTL_DAYS} days and you can use it more than once —`,
        "open it on your phone now and your laptop later.",
      ].join("\n")
    : `Head to ${siteUrl}/login, enter your email and click "Forgot password?" — we'll email you a link to set your password.`;

  // Someone who never reached the portal does not need telling what
  // Goldstay is. They need to know we noticed, that it was our fault
  // and not theirs, and that this link behaves differently.
  const opening =
    tone === "self-requested"
      ? [
          greeting,
          "",
          "Here is the fresh link you just asked for.",
        ]
      : tone === "never-signed-in"
      ? [
          greeting,
          "",
          "We were going through our records and realised you have never",
          "managed to get into your Goldstay portal — and that is on us, not",
          "you. The first link we sent was only valid for an hour, and some",
          "email providers quietly open links to scan them, which used a few",
          "of them up before anyone had a chance to click.",
          "",
          "We have fixed that. Here is a new link that lasts a week and can be",
          "used as many times as you like.",
        ]
      : [
          greeting,
          "",
          accountLine,
          `We've set you up for ${market}. From your portal you can:`,
          "",
          "  • See every property we manage for you, with live occupancy.",
          "  • Download your monthly statement as a PDF.",
          "  • Browse every transaction behind that statement.",
          "  • Accept your management agreement in one click.",
        ];

  const closing =
    tone === "never-signed-in" || tone === "self-requested"
      ? [
          "Everything that has happened on your property while you were locked",
          "out is in there waiting for you — nothing has been missed.",
          "",
          "If it gives you any trouble at all, just reply to this email and a",
          "real person will sort it out.",
          "",
          "Best,",
          "The Goldstay team",
        ]
      : [
          "Questions? Reply to this email and you'll reach a real person at",
          "Goldstay. We answer within one business day.",
          "",
          "Best,",
          "The Goldstay team",
        ];

  return [...opening, "", linkBlock, "", ...closing].join("\n");
}

function renderHtml({
  fullName,
  companyName,
  country,
  tone,
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
    ? `<p style="margin:32px 0;text-align:center"><a href="${escapeAttr(magicLink)}" style="background:#1c1917;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:600;font-size:15px;display:inline-block">Open my portal &rarr;</a></p><p style="color:#78716c;font-size:13px;margin:0;text-align:center">This link works for ${INVITE_TTL_DAYS} days and you can use it more than once.</p>`
    : `<p style="margin:32px 0;text-align:center"><a href="${escapeAttr(siteUrl)}/login" style="background:#1c1917;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:600;font-size:15px;display:inline-block">Sign in to my portal &rarr;</a></p><p style="color:#78716c;font-size:13px;margin:0;text-align:center">Use \u201cForgot password?\u201d to set a password — sign-ins are instant after that.</p>`;

  const headline =
    tone === "self-requested"
      ? `<h1 style="font-size:24px;font-family:Georgia,'Times New Roman',serif;color:#1c1917;margin:24px 0 0 0;font-weight:normal">Here you go, ${escapeHtml(firstName)}.</h1>`
      : tone === "never-signed-in"
      ? `<h1 style="font-size:24px;font-family:Georgia,'Times New Roman',serif;color:#1c1917;margin:24px 0 0 0;font-weight:normal">Let\u2019s get you in, ${escapeHtml(firstName)}.</h1>`
      : `<h1 style="font-size:24px;font-family:Georgia,'Times New Roman',serif;color:#1c1917;margin:24px 0 0 0;font-weight:normal">Welcome, ${escapeHtml(firstName)}.</h1>`;

  const intro =
    tone === "self-requested"
      ? `<p style="color:#44403c;line-height:1.55;margin:16px 0 0 0">Here is the fresh link you just asked for. It works for ${INVITE_TTL_DAYS} days and you can use it more than once.</p>`
      : tone === "never-signed-in"
      ? `<p style="color:#44403c;line-height:1.55;margin:16px 0 0 0">We were going through our records and realised you have never managed to get into your Goldstay portal \u2014 and that is on us, not you. The first link we sent was only valid for an hour, and some email providers quietly open links to scan them, which used a few of them up before anyone had a chance to click.</p><p style="color:#44403c;line-height:1.55;margin:16px 0 0 0">We have fixed that. The link below lasts ${INVITE_TTL_DAYS} days and can be used as many times as you like.</p>`
      : `<p style="color:#44403c;line-height:1.55;margin:16px 0 0 0">${accountLine} We've set you up for <strong>${market}</strong>. From your portal you can:</p>
                <ul style="color:#44403c;line-height:1.7;margin:16px 0 0 0;padding-left:20px">
                  <li>See every property we manage for you, with live occupancy.</li>
                  <li>Download your monthly statement as a PDF.</li>
                  <li>Browse every transaction behind that statement.</li>
                  <li>Accept your management agreement in one click.</li>
                </ul>`;

  const signoff =
    tone === "never-signed-in" || tone === "self-requested"
      ? "Everything that has happened on your property while you were locked out is in there waiting for you \u2014 nothing has been missed. If the link gives you any trouble at all, just reply to this email and it comes straight to a real person."
      : "Questions? Reply to this email and you'll reach a real person at Goldstay. We answer within one business day.";

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
                ${headline}
                ${intro}
                ${cta}
                <p style="color:#78716c;font-size:13px;line-height:1.55;margin:32px 0 0 0;border-top:1px solid #e7e5e4;padding-top:24px">${signoff}</p>
                <p style="color:#a8a29e;font-size:12px;margin:24px 0 0 0">Goldstay · Premium property management in ${launchedCityPhrase()}</p>
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
