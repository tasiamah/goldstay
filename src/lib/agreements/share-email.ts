// "A client has asked us to share their agreement with you" email.
//
// Goes to a third party, usually the client's advocate, and that makes
// it different from every other email in this codebase. The recipient
// did not ask us for anything and has no relationship with us. So the
// body has to establish, in the first two lines, who we are, who asked
// for this, and what they are being sent. Otherwise it reads like
// phishing, which is exactly what a lawyer is trained to assume.
//
// It also has to be explicit that nothing is being asked of them. An
// unsolicited email containing a contract and a link invites the
// reading that a signature is wanted; the one thing this link cannot
// do is accept the agreement.
//
// Env vars, same conventions as notify.ts:
//   RESEND_API_KEY      → real send; absent means log-only
//   RESEND_FROM_CLIENTS → from address, falling back to
//                         RESEND_FROM_OWNERS
//   PUBLIC_SITE_URL     → base for the link

import { logCommunication } from "@/lib/comms";
import type { CurrentActor } from "@/lib/auth";
import { launchedCityPhrase } from "@/lib/site";

const DEFAULT_FROM = "Goldstay <hello@goldstay.co.ke>";
const DEFAULT_SITE = "https://goldstay.co.ke";

export type AgreementShareEmailInput = {
  shareUrl: string;
  agreementTitle: string;
  propertyLabel: string;
  reference: string | null;
  expiresAt: Date;
  isSigned: boolean;
  recipient: { email: string; name?: string | null };
  client: { id: string; fullName: string; email: string };
  actor?: CurrentActor | null;
};

export async function sendAgreementShareEmail(
  input: AgreementShareEmailInput,
): Promise<{ ok: boolean; delivered: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_CLIENTS ||
    process.env.RESEND_FROM_OWNERS ||
    DEFAULT_FROM;

  const { subject, text, html } = renderAgreementShareEmail(input);

  if (!apiKey) {
    console.log(
      `[agreement-share] would send to ${input.recipient.email}\n${text}`,
    );
    await mirrorToComms(input, "QUEUED", null, subject);
    return { ok: true, delivered: false, reason: "logged-only" };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: [input.recipient.email],
      // Copying the client is not a courtesy, it is the point. They
      // asked for this to happen and should see that it did, and it
      // means a share they did not authorise cannot happen quietly.
      cc: [input.client.email],
      // Questions about the contract should reach the client, not our
      // inbox: it is their agreement and their adviser.
      replyTo: input.client.email,
      subject,
      text,
      html,
    });
    await mirrorToComms(
      input,
      "SENT",
      (result?.data?.id as string | undefined) ?? null,
      subject,
    );
    return { ok: true, delivered: true };
  } catch (err) {
    console.error("[agreement-share] Resend send failed", err);
    await mirrorToComms(input, "FAILED", null, subject);
    return { ok: false, delivered: false, reason: "send-failed" };
  }
}

// Logged against the client, not the recipient, because
// CommunicationLog is the record of one client's dealings with us and
// this is an event in theirs. The subject names the recipient so the
// Communications tab reads as "we shared your contract with X".
async function mirrorToComms(
  input: AgreementShareEmailInput,
  status: "QUEUED" | "SENT" | "FAILED",
  providerId: string | null,
  subject: string,
): Promise<void> {
  try {
    await logCommunication({
      clientId: input.client.id,
      channel: "EMAIL",
      direction: "OUTBOUND",
      subject,
      status,
      providerId,
      actor: input.actor ?? null,
    });
  } catch (err) {
    console.warn("[agreement-share] logCommunication failed", err);
  }
}

// Pure, so the body can be asserted on without a Resend key. Property
// names and recipient names are operator free text, so every
// interpolation into the HTML is escaped.
export function renderAgreementShareEmail(
  input: AgreementShareEmailInput,
): { subject: string; text: string; html: string } {
  return {
    subject: `${input.client.fullName} has shared a Goldstay agreement with you`,
    text: renderText(input),
    html: renderHtml(input),
  };
}

function validUntil(expiresAt: Date): string {
  return expiresAt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function renderText(input: AgreementShareEmailInput): string {
  const greeting = input.recipient.name
    ? `Hi ${firstNameOf(input.recipient.name)},`
    : "Hello,";

  return [
    greeting,
    "",
    `${input.client.fullName} has asked us to share their Goldstay`,
    `management agreement with you so you can review it.`,
    "",
    `Property: ${input.propertyLabel}`,
    `Agreement: ${input.agreementTitle}`,
    ...(input.reference ? [`Reference: ${input.reference}`] : []),
    "",
    "Read it here:",
    input.shareUrl,
    "",
    input.isSigned
      ? "This is the executed copy, and the signed PDF can be downloaded from that page."
      : `The agreement has not been accepted yet. Nothing is being asked of you: only ${input.client.fullName} can accept it, from their own signed-in portal, so there is nothing to sign on that page.`,
    "",
    `The link is read-only, reaches this one agreement and nothing`,
    `else, and stays open until ${validUntil(input.expiresAt)}.`,
    `${input.client.fullName} can withdraw it at any time.`,
    "",
    `${input.client.fullName} is copied on this email. Replying reaches`,
    "them directly. If you would rather put a question to us, write to",
    "hello@goldstay.co.ke and we will answer within one business day.",
    "",
    "Best,",
    "The Goldstay team",
    "",
    `Goldstay, property management in ${launchedCityPhrase()}`,
  ].join("\n");
}

function renderHtml(input: AgreementShareEmailInput): string {
  const greeting = input.recipient.name
    ? `Hi ${escapeHtml(firstNameOf(input.recipient.name))},`
    : "Hello,";
  const client = escapeHtml(input.client.fullName);
  const referenceRow = input.reference
    ? `<tr><td style="color:#78716c;font-size:13px;padding:2px 0">Reference</td><td style="color:#1c1917;font-size:13px;padding:2px 0 2px 16px">${escapeHtml(input.reference)}</td></tr>`
    : "";

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
                <h1 style="font-size:22px;font-family:Georgia,'Times New Roman',serif;color:#1c1917;margin:24px 0 0 0;font-weight:normal">${greeting}</h1>
                <p style="color:#44403c;line-height:1.55;margin:16px 0 0 0"><strong>${client}</strong> has asked us to share their Goldstay management agreement with you so you can review it.</p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:20px 0 0 0">
                  <tr><td style="color:#78716c;font-size:13px;padding:2px 0">Property</td><td style="color:#1c1917;font-size:13px;padding:2px 0 2px 16px">${escapeHtml(input.propertyLabel)}</td></tr>
                  <tr><td style="color:#78716c;font-size:13px;padding:2px 0">Agreement</td><td style="color:#1c1917;font-size:13px;padding:2px 0 2px 16px">${escapeHtml(input.agreementTitle)}</td></tr>
                  ${referenceRow}
                </table>
                <p style="margin:28px 0;text-align:center"><a href="${escapeAttr(input.shareUrl)}" style="background:#1c1917;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:600;font-size:15px;display:inline-block">Read the agreement &rarr;</a></p>
                <p style="color:#44403c;line-height:1.55;margin:0">${
                  input.isSigned
                    ? "This is the executed copy, and the signed PDF can be downloaded from that page."
                    : `The agreement has not been accepted yet, and nothing is being asked of you: only ${client} can accept it, from their own signed-in portal, so there is nothing to sign on that page.`
                }</p>
                <p style="color:#78716c;font-size:13px;line-height:1.55;margin:20px 0 0 0">The link is read-only, reaches this one agreement and nothing else, and stays open until ${escapeHtml(validUntil(input.expiresAt))}. ${client} can withdraw it at any time.</p>
                <p style="color:#78716c;font-size:13px;line-height:1.55;margin:32px 0 0 0;border-top:1px solid #e7e5e4;padding-top:24px">${client} is copied on this email, so replying reaches them directly. To put a question to us instead, write to <a href="mailto:hello@goldstay.co.ke" style="color:#1c1917">hello@goldstay.co.ke</a> and we will answer within one business day.</p>
                <p style="color:#a8a29e;font-size:12px;margin:24px 0 0 0">Goldstay &middot; Property management in ${launchedCityPhrase()}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function firstNameOf(fullName: string): string {
  return fullName.split(/\s+/)[0] || "there";
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

export function shareSiteUrl(): string {
  return process.env.PUBLIC_SITE_URL || DEFAULT_SITE;
}
