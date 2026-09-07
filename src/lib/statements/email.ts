// The statement email's text and HTML bodies.
//
// Split from send.ts so they can be tested. send.ts imports the
// react-pdf renderer at module scope, which the test runner cannot
// parse, so anything reachable from it was effectively untestable —
// and the body now contains a sentence that discloses to a co-owner
// what they are and are not allowed to do, which is exactly the kind
// of copy that should not go out unverified.
//
// Pure. No database, no Resend key, no environment.

import type { Client } from "@prisma/client";
import { formatPeriod, type Period } from "./period";

type Observer = { email: string; name: string | null };

// Who else is on this email, in a sentence.
//
// Returns null when nobody is, so the overwhelming majority of
// statements are unchanged. When somebody is, the same line is read
// by the account holder and by every observer, which is why it
// describes the account holder in the third person rather than saying
// "you asked us": most of the people reading it did not.
export function copiedLine(
  observers: Observer[],
  holderName: string,
): string | null {
  if (observers.length === 0) return null;
  const names = observers.map((o) => o.name?.trim() || o.email);
  const list =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  const holder = holderName.trim() || "the account holder";
  return `Copied to ${list}, at ${holder}'s request. They receive the statement only and cannot sign in or change anything. ${holder} can remove them under Account in the portal.`;
}

// Exported for the same reason renderAgreementEmail is: the body can
// then be asserted on without a Resend key or a database, and this
// one now has a sentence in it that a third party reads.
export function renderEmailBody(opts: {
  client: Pick<Client, "fullName" | "companyName">;
  period: Period;
  siteUrl: string;
  isEmpty: boolean;
  summary: string;
  observers?: Observer[];
}): string {
  const greeting = `Hi ${opts.client.fullName.split(/\s+/)[0] || "there"},`;
  const lead = opts.isEmpty
    ? `Your Goldstay statement for ${formatPeriod(opts.period)} is attached. There was no rent or booking activity to report this month — the cover page confirms a clean ledger.`
    : `Your Goldstay statement for ${formatPeriod(opts.period)} is attached. ${opts.summary}.`;
  const copied = copiedLine(opts.observers ?? [], opts.client.fullName);
  return [
    greeting,
    "",
    lead,
    "",
    `You can also browse the same statement, line-by-line, in your portal:`,
    `${opts.siteUrl}/client/statements/${opts.period.year}/${opts.period.month}`,
    "",
    "Net payouts are remitted by the 10th of every month per your management agreement. If anything in this statement looks off, reply to this email and we'll investigate same-day.",
    "",
    "— The Goldstay team",
    ...(copied ? ["", copied] : []),
  ].join("\n");
}

export function renderEmailHtml(opts: {
  client: Pick<Client, "fullName" | "companyName">;
  period: Period;
  siteUrl: string;
  isEmpty: boolean;
  summary: string;
  observers?: Observer[];
}): string {
  const firstName = opts.client.fullName.split(/\s+/)[0] || "there";
  const lead = opts.isEmpty
    ? `Your Goldstay statement for <strong>${formatPeriod(opts.period)}</strong> is attached. There was no rent or booking activity to report this month — the cover page confirms a clean ledger.`
    : `Your Goldstay statement for <strong>${formatPeriod(opts.period)}</strong> is attached. ${escapeHtml(opts.summary)}.`;
  const url = `${opts.siteUrl}/client/statements/${opts.period.year}/${opts.period.month}`;
  const copied = copiedLine(opts.observers ?? [], opts.client.fullName);
  // Observer names are free text typed by a client, so this is
  // escaped like every other interpolation in this template.
  const copiedBlock = copied
    ? `<p style="color:#a8a29e;font-size:12px;line-height:1.55;margin:16px 0 0 0">${escapeHtml(copied)}</p>`
    : "";
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1c1917">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafaf9;padding:40px 16px">
      <tr><td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e7e5e4;border-radius:12px;padding:40px">
          <tr><td>
            <p style="font-size:18px;font-family:Georgia,serif;color:#1c1917;margin:0 0 4px 0">Goldstay<span style="color:#b91c1c">.</span></p>
            <h1 style="font-size:22px;font-family:Georgia,serif;color:#1c1917;margin:24px 0 0 0;font-weight:normal">Hi ${escapeHtml(firstName)},</h1>
            <p style="color:#44403c;line-height:1.55;margin:16px 0 0 0">${lead}</p>
            <p style="margin:32px 0;text-align:center"><a href="${escapeAttr(url)}" style="background:#1c1917;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;font-size:14px;display:inline-block">Open statement in portal →</a></p>
            <p style="color:#78716c;font-size:13px;line-height:1.55;margin:32px 0 0 0;border-top:1px solid #e7e5e4;padding-top:24px">Net payouts are remitted by the 10th of every month per your management agreement. If anything in this statement looks off, reply and we'll investigate same-day.</p>
            ${copiedBlock}
          </td></tr>
        </table>
      </td></tr>
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
