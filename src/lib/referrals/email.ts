// Outbound email for the referral programme.
//
// Three transactional sends today (welcome, lead-attributed, signed)
// rolled into one tiny module so all the copy lives in one place and
// stays consistent with the public landing page. Best-effort like
// the rest of the Resend integration: a missing API key logs the
// payload and returns true, so local dev and preview deploys don't
// silently swallow signups.

import type { Referrer } from "@prisma/client";
import { resolveTermsForReferrer } from "./payouts";
import { site } from "@/lib/site";

const FROM_DEFAULT = "Goldstay Partners <leads@goldstay.co.ke>";

function fromAddress(): string {
  return process.env.RESEND_FROM_REFERRALS || FROM_DEFAULT;
}

function dashboardUrl(token: string): string {
  // Always point at the canonical .com host. Even when the referrer
  // signed up on goldstay.co.ke, the dashboard is host-agnostic and
  // we want one URL pinned per referrer.
  const base = `https://${site.domains.main}`;
  return `${base}/refer/dashboard/${token}`;
}

function referralUrl(code: string): string {
  return `https://${site.domains.main}/list-your-property?ref=${code}`;
}

export async function sendReferrerWelcomeEmail(
  referrer: Pick<
    Referrer,
    | "type"
    | "fullName"
    | "email"
    | "code"
    | "dashboardToken"
    | "longTermPctOverride"
    | "shortStayPctOverride"
    | "payoutMonthsOverride"
  >,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const terms = resolveTermsForReferrer(referrer);
  const link = referralUrl(referrer.code);
  const dash = dashboardUrl(referrer.dashboardToken);

  const earnings = describeEarnings(referrer.type, terms);
  const subject = `You're in: your Goldstay referral link is live`;

  const text = [
    `Hi ${referrer.fullName.split(" ")[0] ?? referrer.fullName},`,
    "",
    "Welcome to the Goldstay partner programme.",
    "",
    `Your referral link:    ${link}`,
    `Your dashboard:        ${dash}`,
    "",
    "Two ways to refer:",
    "  1. Share the link above. Anyone who fills in our landlord form after",
    "     clicking it is attributed to you for the next 90 days.",
    "  2. Submit a landlord directly from your dashboard. Best when you've",
    "     already had the conversation and have the landlord's contact details.",
    "",
    `What you earn:`,
    earnings.split("\n").map((l) => `  ${l}`).join("\n"),
    "",
    "Payouts are wired in USD (or local currency on request) on the 5th of every",
    "month, as long as the referred landlord stays an active Goldstay client.",
    "",
    "Bookmark your dashboard URL. It's the only way back in. If you ever lose",
    "it, reply to this email and we'll send you a fresh one.",
    "",
    "Best,",
    "The Goldstay team",
    "leads@goldstay.co.ke · goldstay.co.ke",
  ].join("\n");

  if (!apiKey) {
    console.log(
      `[referrals] (dry run) welcome to ${referrer.email}\n${subject}\n${text}`,
    );
    return true;
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromAddress(),
      to: [referrer.email],
      subject,
      text,
    });
    return true;
  } catch (e) {
    console.error("[referrals] welcome send failed", e);
    return false;
  }
}

function describeEarnings(
  type: Referrer["type"],
  terms: ReturnType<typeof resolveTermsForReferrer>,
): string {
  const ltPct = Math.round(terms.longTermPct * 100);
  const ssPct = Math.round(terms.shortStayPct * 100);
  if (type === "LANDLORD") {
    return [
      `${ltPct}% of one month's management fee on every long-term landlord you sign.`,
      `${ssPct}% of one month's management fee on every short-stay landlord you sign.`,
      "Paid as a one-off 30 days after the landlord's first rent collection.",
    ].join("\n");
  }
  return [
    `${ltPct}% of every monthly long-term management fee, for ${terms.payoutMonths} months.`,
    `${ssPct}% of every monthly short-stay management fee, for ${terms.payoutMonths} months.`,
    "Example: a $1,500/mo long-term unit at our 10% fee earns you " +
      `$${Math.round(1500 * 0.1 * terms.longTermPct)} every month for ${terms.payoutMonths} months.`,
  ].join("\n");
}
