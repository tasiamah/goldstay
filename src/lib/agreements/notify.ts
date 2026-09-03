// "Your management agreement is ready" email.
//
// Fired whenever an agreement is issued, which is now the moment a
// property is created rather than a button an operator remembers to
// press. Without this the only signal a client got was a row in
// their notification bell, which they see on their next sign-in —
// and since an unaccepted agreement blocks the property from going
// live, "next sign-in" could be weeks of the property earning
// nothing.
//
// Best-effort, exactly like the welcome email: a send failure must
// never roll back the agreement. The agreement is the record; the
// email is a nudge towards it, and the client can always reach it
// from their portal. Callers therefore ignore the result.
//
// Env vars (all optional, degrades gracefully):
//   RESEND_API_KEY      → real send; absent means log-only
//   RESEND_FROM_CLIENTS → from address, falling back to
//                         RESEND_FROM_OWNERS (its pre-rename name)
//   PUBLIC_SITE_URL     → base for links

import { prisma } from "@/lib/db";
import { mintCallbackLink } from "@/lib/supabase/magic-link";
import { logCommunication } from "@/lib/comms";
import { formatPropertyDisplayName } from "@/lib/format-property";
import type { CurrentActor } from "@/lib/auth";

export type AgreementIssuedInput = {
  agreementId: string;
  // Human-facing GS-YYYY-### reference. Null on rows issued before
  // references existed, in which case we just omit it.
  reference: string | null;
  // Already-formatted "Riverside Apartments 4B" style label.
  propertyLabel: string;
  client: {
    id: string;
    email: string;
    fullName: string;
  };
  // The admin whose action issued the agreement, so the send is
  // attributed to them on the client's Communications tab rather
  // than appearing to come from nowhere.
  actor?: CurrentActor | null;
};

const DEFAULT_FROM = "Goldstay <hello@goldstay.co.ke>";
const DEFAULT_SITE = "https://goldstay.co.ke";

// What every issue site actually calls: looks up who to email and
// what to call the property, then sends. Swallows everything, so
// callers can treat notifying as fire-and-forget without wrapping it
// — an agreement that exists but whose email failed is fine, an
// agreement that failed to exist is not.
export async function notifyClientOfAgreement(input: {
  agreementId: string;
  reference: string | null;
  propertyId: string;
  actor?: CurrentActor | null;
}): Promise<void> {
  try {
    const property = await prisma.property.findUnique({
      where: { id: input.propertyId },
      select: {
        name: true,
        unitNumber: true,
        client: { select: { id: true, email: true, fullName: true } },
      },
    });
    if (!property) return;
    await sendAgreementIssuedEmail({
      agreementId: input.agreementId,
      reference: input.reference,
      propertyLabel: formatPropertyDisplayName(
        property.name,
        property.unitNumber,
      ),
      client: property.client,
      actor: input.actor ?? null,
    });
  } catch (err) {
    console.error("[agreement-notify] notify failed", err);
  }
}

// Same ok/delivered split as sendClientWelcomeEmail: `ok` means
// nothing failed, `delivered` means Resend accepted it. They diverge
// when RESEND_API_KEY is absent and the send is a no-op.
export async function sendAgreementIssuedEmail(
  input: AgreementIssuedInput,
): Promise<{ ok: boolean; delivered: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_CLIENTS ||
    process.env.RESEND_FROM_OWNERS ||
    DEFAULT_FROM;
  const siteUrl = process.env.PUBLIC_SITE_URL || DEFAULT_SITE;

  const agreementPath = `/client/agreements/${input.agreementId}`;

  // Land them on the agreement itself, signed in. The plain deep
  // link would bounce a signed-out client to /login, which drops the
  // destination and leaves them hunting for the agreement — the
  // opposite of the one-click acceptance this is meant to enable.
  // Falls back to the deep link if minting fails, since a link that
  // needs a sign-in still beats no link.
  let link = `${siteUrl}${agreementPath}`;
  try {
    const minted = await mintCallbackLink({
      email: input.client.email,
      siteUrl,
      next: agreementPath,
    });
    if (minted) link = minted;
  } catch (err) {
    console.warn("[agreement-notify] link generation failed", err);
  }

  const { subject, text, html } = renderAgreementEmail({ ...input, link });

  if (!apiKey) {
    console.log(
      `[agreement-notify] would send to ${input.client.email}\n${text}`,
    );
    await mirrorToComms(input, "QUEUED", null, subject);
    return { ok: true, delivered: false, reason: "logged-only" };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: [input.client.email],
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
    console.error("[agreement-notify] Resend send failed", err);
    await mirrorToComms(input, "FAILED", null, subject);
    return { ok: false, delivered: false, reason: "send-failed" };
  }
}

// Mirror into CommunicationLog so the client detail page shows the
// nudge under "Communications". Swallows its own errors: bookkeeping
// must never make a successful send look failed.
async function mirrorToComms(
  input: AgreementIssuedInput,
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
    console.warn("[agreement-notify] logCommunication failed", err);
  }
}

// Pure so the body can be asserted on without a Resend key or a
// database. Exported mainly for that: property names are operator
// free text, and one called "Ochieng & Sons <Westlands>" must not be
// able to break the markup of an email we send on their behalf.
export function renderAgreementEmail(
  input: AgreementIssuedInput & { link: string },
): { subject: string; text: string; html: string } {
  return {
    subject: `Your management agreement for ${input.propertyLabel}`,
    text: renderText(input),
    html: renderHtml(input),
  };
}

function renderText({
  reference,
  propertyLabel,
  client,
  link,
}: AgreementIssuedInput & { link: string }): string {
  const referenceLine = reference
    ? `Reference ${reference}.`
    : "It's waiting in your portal.";

  return [
    `Hi ${firstNameOf(client.fullName)},`,
    "",
    `We've prepared the management agreement for ${propertyLabel}.`,
    referenceLine,
    "",
    "It sets out our commission, the term, the notice period and what",
    "we handle on your behalf. Reading it takes a couple of minutes.",
    "Agreeing takes one click — nothing to print, sign or scan.",
    "",
    "Review and accept:",
    link,
    "",
    "The property stays off the market until the agreement is",
    "accepted, so it's worth doing now.",
    "",
    "Questions about any clause? Reply to this email and you'll reach",
    "a real person at Goldstay. We answer within one business day.",
    "",
    "Best,",
    "The Goldstay team",
  ].join("\n");
}

function renderHtml({
  reference,
  propertyLabel,
  client,
  link,
}: AgreementIssuedInput & { link: string }): string {
  const referenceLine = reference
    ? `<p style="color:#78716c;font-size:13px;margin:8px 0 0 0">Reference ${escapeHtml(reference)}</p>`
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
                <h1 style="font-size:24px;font-family:Georgia,'Times New Roman',serif;color:#1c1917;margin:24px 0 0 0;font-weight:normal">Hi ${escapeHtml(firstNameOf(client.fullName))},</h1>
                <p style="color:#44403c;line-height:1.55;margin:16px 0 0 0">We&rsquo;ve prepared the management agreement for <strong>${escapeHtml(propertyLabel)}</strong>. It sets out our commission, the term, the notice period and what we handle on your behalf.</p>
                ${referenceLine}
                <p style="color:#44403c;line-height:1.55;margin:16px 0 0 0">Reading it takes a couple of minutes. Agreeing takes one click &mdash; nothing to print, sign or scan.</p>
                <p style="margin:32px 0;text-align:center"><a href="${escapeAttr(link)}" style="background:#1c1917;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:600;font-size:15px;display:inline-block">Review &amp; accept my agreement &rarr;</a></p>
                <p style="color:#78716c;font-size:13px;margin:0;text-align:center">The property stays off the market until the agreement is accepted.</p>
                <p style="color:#78716c;font-size:13px;line-height:1.55;margin:32px 0 0 0;border-top:1px solid #e7e5e4;padding-top:24px">Questions about any clause? Reply to this email and you&rsquo;ll reach a real person at Goldstay. We answer within one business day.</p>
                <p style="color:#a8a29e;font-size:12px;margin:24px 0 0 0">Goldstay &middot; Premium property management in Nairobi &amp; Accra</p>
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
