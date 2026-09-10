// Copy for the four agreement reminder emails, plus the internal
// escalation notice that ends the ladder.
//
// Pure renderers, exported so the wording can be asserted on without a
// Resend key or a database — property names are operator free text, and
// one called "Ochieng & Sons <Westlands>" must not be able to break the
// markup of an email we send on a client's behalf.
//
// The four emails escalate in firmness but never in volume: each is
// shorter than the last. A client ignoring reminder three is not going
// to read a longer version of reminder two, and the shrinking length is
// itself a signal that this is the end of the road rather than the
// start of a drip campaign.

import { formatHours, REMINDER_LADDER } from "./reminder-schedule";
import { launchedCityPhrase } from "@/lib/site";

export type ReminderCopy = {
  subject: string;
  /** Opening line under the greeting. */
  lead: string;
  /** Middle paragraph. Carries the reason to act. */
  body: string;
  /** Text on the button / the line above the bare link. */
  cta: string;
  /** Small print under the button. */
  footnote: string;
};

// Keyed by ladder step. Step 5 is the escalation and has no client
// email, so it is absent here by design.
const COPY: Record<number, ReminderCopy> = {
  1: {
    subject: "Your management agreement is waiting",
    lead: "We sent your management agreement yesterday and it is still unsigned, so this is just in case it went astray.",
    body: "Nothing has changed since we sent it. It sets out our commission, the term, the notice period and what we handle on your behalf. Reading it takes a couple of minutes and agreeing takes one click.",
    cta: "Review & accept my agreement",
    footnote: "Already signed it? Then this crossed with you — ignore it.",
  },
  2: {
    subject: "Your property is waiting on one signature",
    lead: "Your management agreement has been sitting unsigned for a few days now.",
    body: "We cannot list or let the property until it is accepted, so every day it waits is a day the property earns nothing. That is the only thing standing between it and going live.",
    cta: "Accept and get the property live",
    footnote:
      "If something in the contract is holding you up, reply and tell us which clause. We would rather fix it than have you sit on it.",
  },
  3: {
    subject: "Still waiting on your management agreement",
    lead: "It has been a week since we sent your management agreement and we have not heard back.",
    body: "If you have questions about the commission, the term or the exit terms, reply to this email and a real person will talk you through them. If you have changed your mind, tell us that too — we would rather know than keep emailing you.",
    cta: "Read the agreement",
    footnote: "The property stays off the market until it is accepted.",
  },
  4: {
    subject: "Last email about your management agreement",
    lead: "This is the last email we will send about your management agreement.",
    body: "It has been two weeks. After this we will stop emailing and someone from the team will call you instead, so if email is not the right way to reach you, this sorts itself out.",
    cta: "Accept it now and save us the call",
    footnote:
      "Prefer to talk it through first? Reply and we will arrange a time.",
  },
};

export function reminderCopy(step: number): ReminderCopy | null {
  return COPY[step] ?? null;
}

export type ReminderEmailInput = {
  step: number;
  clientName: string;
  propertyLabel: string;
  /**
   * Human title of the template being chased, e.g. "Short-let property
   * management agreement". Optional so a caller without it still sends
   * a reminder rather than none.
   */
  agreementTitle?: string | null;
  reference: string | null;
  link: string;
};

export function renderReminderEmail(
  input: ReminderEmailInput,
): { subject: string; text: string; html: string } | null {
  const copy = reminderCopy(input.step);
  if (!copy) return null;

  // The property is in the subject so a client with several of them can
  // tell which one is being chased from the inbox list alone.
  //
  // The property alone is not always enough. One unit can carry a
  // short-let and a long-let agreement at the same time, on different
  // commission, and on 10 Sep 2026 a client received two reminders 310
  // milliseconds apart that were identical down to the unit number. The
  // agreement that was issued said which contract it was; every chase
  // after it did not. Appending the template title costs nothing when
  // there is only one agreement and is the whole message when there are
  // two.
  const subject = input.agreementTitle
    ? `${copy.subject} · ${input.propertyLabel} · ${input.agreementTitle}`
    : `${copy.subject} · ${input.propertyLabel}`;
  return {
    subject,
    text: renderText(input, copy),
    html: renderHtml(input, copy),
  };
}

function renderText(input: ReminderEmailInput, copy: ReminderCopy): string {
  const referenceLine = input.reference
    ? `Reference ${input.reference}.`
    : null;

  return [
    `Hi ${firstNameOf(input.clientName)},`,
    "",
    copy.lead,
    "",
    `Property: ${input.propertyLabel}`,
    ...(input.agreementTitle ? [`Agreement: ${input.agreementTitle}`] : []),
    ...(referenceLine ? [referenceLine] : []),
    "",
    copy.body,
    "",
    `${copy.cta}:`,
    input.link,
    "",
    copy.footnote,
    "",
    "Best,",
    "The Goldstay team",
  ].join("\n");
}

// Same shell as the agreement-issued email in notify.ts, so a reminder
// looks like it came from the same company as the original.
function renderHtml(input: ReminderEmailInput, copy: ReminderCopy): string {
  const referenceLine = input.reference
    ? `<p style="color:#78716c;font-size:13px;margin:8px 0 0 0">Reference ${escapeHtml(input.reference)}</p>`
    : "";

  const agreementLine = input.agreementTitle
    ? `<p style="color:#78716c;font-size:13px;margin:4px 0 0 0">${escapeHtml(input.agreementTitle)}</p>`
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
                <h1 style="font-size:24px;font-family:Georgia,'Times New Roman',serif;color:#1c1917;margin:24px 0 0 0;font-weight:normal">Hi ${escapeHtml(firstNameOf(input.clientName))},</h1>
                <p style="color:#44403c;line-height:1.55;margin:16px 0 0 0">${escapeHtml(copy.lead)}</p>
                <p style="color:#44403c;line-height:1.55;margin:16px 0 0 0"><strong>${escapeHtml(input.propertyLabel)}</strong></p>
                ${agreementLine}
                ${referenceLine}
                <p style="color:#44403c;line-height:1.55;margin:16px 0 0 0">${escapeHtml(copy.body)}</p>
                <p style="margin:32px 0;text-align:center"><a href="${escapeHtml(input.link)}" style="background:#1c1917;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:600;font-size:15px;display:inline-block">${escapeHtml(copy.cta)} &rarr;</a></p>
                <p style="color:#78716c;font-size:13px;line-height:1.55;margin:0;text-align:center">${escapeHtml(copy.footnote)}</p>
                <p style="color:#a8a29e;font-size:12px;margin:32px 0 0 0;border-top:1px solid #e7e5e4;padding-top:24px">Goldstay &middot; Premium property management in ${launchedCityPhrase()}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// ---------------------------------------------------------------------
// Escalation — to us, not to the client.
// ---------------------------------------------------------------------

// Deliberately not mirrored into CommunicationLog. That table records
// what we have said to a client, and this is a message to ourselves;
// filing it there would make the client's Communications tab claim we
// emailed them when we didn't.

export type EscalationInput = {
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  propertyLabel: string;
  propertyCity: string;
  reference: string | null;
  sentAt: Date;
  emailsSent: number;
  adminLink: string;
  now: Date;
};

export function renderEscalationEmail(input: EscalationInput): {
  subject: string;
  text: string;
} {
  const days = Math.floor(
    (input.now.getTime() - input.sentAt.getTime()) / (24 * 60 * 60 * 1000),
  );
  const issued = input.sentAt.toLocaleDateString("en-GB", {
    dateStyle: "long",
    timeZone: "Africa/Nairobi",
  });

  return {
    subject: `Unsigned after ${days} days · ${input.propertyLabel} · ${input.clientName}`,
    text: [
      `${input.clientName} has not signed the management agreement for ${input.propertyLabel}, ${input.propertyCity}.`,
      "",
      `Issued ${issued} — ${days} days ago. We have sent ${input.emailsSent} ${
        input.emailsSent === 1 ? "reminder" : "reminders"
      } and had no response, so automated chasing has stopped here.`,
      "",
      "Someone needs to call them. A task has been added to the",
      "property so this does not get lost:",
      input.adminLink,
      "",
      "For the record",
      `  Client: ${input.clientName} <${input.clientEmail}>`,
      `  Phone: ${input.clientPhone ?? "not on file"}`,
      `  Agreement reference: ${input.reference ?? "none"}`,
      `  Reminder cadence: ${describeCadence()}`,
      "",
      "The property stays off the market until the agreement is",
      "accepted, so this is blocking revenue.",
    ].join("\n"),
  };
}

function describeCadence(): string {
  return REMINDER_LADDER.filter((s) => s.kind === "EMAIL")
    .map((s) => formatHours(s.afterHours))
    .join(", ");
}

export function escalationTaskTitle(input: {
  clientName: string;
  propertyLabel: string;
}): string {
  return `Call ${input.clientName} — agreement unsigned for ${input.propertyLabel}`;
}

export function escalationTaskNotes(input: {
  emailsSent: number;
  clientPhone: string | null;
  clientEmail: string;
}): string {
  return [
    `${input.emailsSent} email ${
      input.emailsSent === 1 ? "reminder" : "reminders"
    } sent with no response, so automated chasing has stopped.`,
    `Phone: ${input.clientPhone ?? "not on file"}`,
    `Email: ${input.clientEmail}`,
    "The property cannot go live until the agreement is accepted.",
  ].join("\n");
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
