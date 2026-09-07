// "You've been added to X's Goldstay statements" — the notice we send
// an observer at the moment they are added.
//
// This email exists for the recipient's benefit, not the client's.
// Somebody has just put a stranger's address on a monthly report of
// their own rental income, and the person receiving it did not ask
// for that and has no Goldstay account to manage it from. So the
// notice has three jobs, in this order:
//
//   1. Tell them who added them and to what, so the first statement
//      is not a surprise from an unknown sender.
//   2. Tell them plainly that the link cannot sign them in and that
//      they have no account, which pre-empts both the "is this
//      phishing" reaction and the "so I can approve things now?"
//      misreading. The second matters: an observer who believed they
//      had authority over the account is the exact confusion this
//      whole design is built to prevent.
//   3. Give them a working way out that does not involve asking the
//      client's permission, because consent to receive somebody's
//      financial documents is theirs to withdraw.
//
// Carries no minted link, by construction and by test — see
// src/lib/clients/observers.test.ts.

import { unsubscribeUrl } from "./observers";

const DEFAULT_FROM = "Goldstay Statements <statements@goldstay.co.ke>";
const DEFAULT_SITE = "https://goldstay.co.ke";

export type ObserverNoticeInput = {
  observerEmail: string;
  observerName?: string | null;
  relationship?: string | null;
  unsubscribeToken: string;
  clientName: string;
  clientEmail: string;
  // True when the client added them from their own portal, false when
  // an operator did it. Changes one sentence: "asked us to" is not an
  // honest description of something we did on a phone call.
  addedByClient: boolean;
};

// Same ok/delivered split as the rest of our senders: `ok` means
// nothing failed, `delivered` means Resend accepted it. They diverge
// when RESEND_API_KEY is absent and the send is a no-op.
export async function sendObserverNoticeEmail(
  input: ObserverNoticeInput,
): Promise<{ ok: boolean; delivered: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_STATEMENTS || DEFAULT_FROM;
  const siteUrl = process.env.PUBLIC_SITE_URL || DEFAULT_SITE;

  const { subject, text, html } = renderObserverNoticeEmail({
    ...input,
    stopUrl: unsubscribeUrl(input.unsubscribeToken, siteUrl),
  });

  if (!apiKey) {
    console.log(`[observers] would notify ${input.observerEmail}\n${text}`);
    return { ok: true, delivered: false, reason: "logged-only" };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: [input.observerEmail],
      // The client is copied so being added is never something that
      // happened to a third party invisibly — if an operator got the
      // address wrong, the client sees it immediately.
      cc: [input.clientEmail],
      // Hitting reply reaches the client, not us. The likely first
      // question is "why am I getting this", and the answer belongs
      // to the person who asked for it.
      replyTo: input.clientEmail,
      subject,
      text,
      html,
    });
    return { ok: true, delivered: true };
  } catch (err) {
    console.error("[observers] notice send failed", err);
    return { ok: false, delivered: false, reason: "send-failed" };
  }
}

// Pure, so the body can be asserted on without a Resend key. Client
// and observer names are free text typed into a form, so every
// interpolation here is escaped in the HTML branch.
export function renderObserverNoticeEmail(
  input: ObserverNoticeInput & { stopUrl: string },
): { subject: string; text: string; html: string } {
  const greeting = input.observerName?.trim()
    ? `Hi ${input.observerName.trim().split(/\s+/)[0]},`
    : "Hello,";

  const how = input.addedByClient
    ? `${input.clientName} has asked us to copy you on`
    : `${input.clientName} has asked Goldstay to copy you on`;

  const rel = input.relationship?.trim();
  const because = rel ? ` They listed you as ${rel}.` : "";

  const text = [
    greeting,
    "",
    `${how} the monthly statement for their property with us.${because}`,
    "",
    "Goldstay manages residential lettings in Nairobi. The statement is",
    "a PDF showing the month's rent or bookings, our fee, and the net",
    "amount paid out. You'll get one a month, usually a few days into",
    "the new month.",
    "",
    "Two things worth being clear about:",
    "",
    `  - You do not have a Goldstay account, and nothing in these emails`,
    `    can sign you in. Only ${input.clientName} can see the portal or`,
    `    agree to anything on the account.`,
    `  - If you would rather not receive these, you can stop them`,
    `    yourself. You do not need to ask ${input.clientName}:`,
    "",
    input.stopUrl,
    "",
    `Questions about why you were added are best put to ${input.clientName}`,
    "— just hit reply and it reaches them, not us.",
    "",
    "— The Goldstay team",
  ].join("\n");

  return {
    subject: `${input.clientName} has copied you on their Goldstay statements`,
    text,
    html: renderHtml({ ...input, greeting, how, because }),
  };
}

function renderHtml(
  input: ObserverNoticeInput & {
    stopUrl: string;
    greeting: string;
    how: string;
    because: string;
  },
): string {
  const client = escapeHtml(input.clientName);
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1c1917">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafaf9;padding:40px 16px">
      <tr><td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e7e5e4;border-radius:12px;padding:40px">
          <tr><td>
            <p style="font-size:18px;font-family:Georgia,'Times New Roman',serif;color:#1c1917;margin:0 0 4px 0">Goldstay<span style="color:#b91c1c">.</span></p>
            <h1 style="font-size:22px;font-family:Georgia,'Times New Roman',serif;color:#1c1917;margin:24px 0 0 0;font-weight:normal">${escapeHtml(input.greeting)}</h1>
            <p style="color:#44403c;line-height:1.55;margin:16px 0 0 0">${escapeHtml(input.how)} the monthly statement for their property with us.${escapeHtml(input.because)}</p>
            <p style="color:#44403c;line-height:1.55;margin:16px 0 0 0">Goldstay manages residential lettings in Nairobi. The statement is a PDF showing the month&rsquo;s rent or bookings, our fee, and the net amount paid out. You&rsquo;ll get one a month, usually a few days into the new month.</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0 0 0;background:#fafaf9;border:1px solid #e7e5e4;border-radius:8px">
              <tr><td style="padding:20px">
                <p style="color:#44403c;font-size:14px;line-height:1.55;margin:0">You do <strong>not</strong> have a Goldstay account, and nothing in these emails can sign you in. Only ${client} can see the portal or agree to anything on the account.</p>
              </td></tr>
            </table>
            <p style="color:#44403c;line-height:1.55;margin:24px 0 0 0">If you would rather not receive these, you can stop them yourself &mdash; you do not need to ask ${client}.</p>
            <p style="margin:24px 0;text-align:center"><a href="${escapeHtml(input.stopUrl)}" style="color:#1c1917;text-decoration:underline;font-size:14px">Stop sending me these statements</a></p>
            <p style="color:#78716c;font-size:13px;line-height:1.55;margin:32px 0 0 0;border-top:1px solid #e7e5e4;padding-top:24px">Questions about why you were added are best put to ${client} &mdash; just hit reply and it reaches them, not us.</p>
            <p style="color:#a8a29e;font-size:12px;margin:24px 0 0 0">Goldstay &middot; Property management in Nairobi &amp; Accra</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

// Private, matching every other email module in the codebase. There
// is no shared helper to import; introducing one means touching five
// senders, which is a change worth making on its own rather than in
// passing here.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
