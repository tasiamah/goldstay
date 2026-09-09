// Google Ads conversion reporting.
//
// Google's setup flow offers a snippet to paste into the <head> of a
// "conversion page", triggered on page load. That does not fit this
// site and would undercount badly if forced to: the WhatsApp CTA
// leaves for wa.me and never returns, so there is no thank-you page
// to load, and the forms post with fetch and re-render in place
// rather than navigating anywhere. A page-load trigger would have to
// be attached to something that is not actually the conversion.
//
// So the conversion is reported from the same two places that already
// emit GA4's `generate_lead`, on the same success conditions. One
// definition of "a lead happened", reported to both platforms, which
// is also what makes the GA4 number and the Ads number reconcilable
// rather than two figures nobody can explain the gap between.
//
// Configured by environment rather than hard-coded because the ID and
// the label are account-specific, and a wrong character produces a
// conversion action that silently never fires. Absent config is a
// no-op, which is the correct behaviour in dev, in preview and on the
// partner embed where no tag is mounted at all.

const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;

// Pure, so the parsing is testable without a DOM or a gtag stub.
//
// Accepts the label on its own, which is what the Ads UI shows in its
// own field, and also tolerates the whole `AW-123/label` string being
// pasted into either variable. That paste is the most likely way to
// misconfigure this, it is unambiguous to detect, and silently doing
// nothing would be indistinguishable from the campaign not working.
export function adsSendTo(
  id: string | undefined,
  label: string | undefined,
): string | null {
  const rawId = id?.trim();
  const rawLabel = label?.trim();

  const combined = [rawId, rawLabel].find((v) => v?.includes("/"));
  if (combined) {
    return /^AW-\d{6,}\/[\w-]+$/.test(combined) ? combined : null;
  }

  if (!rawId || !rawLabel) return null;
  if (!/^AW-\d{6,}$/.test(rawId)) return null;
  if (!/^[\w-]+$/.test(rawLabel)) return null;
  return `${rawId}/${rawLabel}`;
}

export function adsLeadSendTo(): string | null {
  return adsSendTo(ADS_ID, LEAD_LABEL);
}

// Call on the same success condition as trackFormLead and the
// WhatsApp click handler, never on submit or on render.
//
// Wrapped and optional-chained for the reason the GA calls are: this
// runs on the success path of the only interactions that produce
// revenue, and an analytics error surfacing to a landlord who has in
// fact just submitted fine would be a real cost to avoid an imaginary
// one.
export function trackAdsLead(): void {
  if (typeof window === "undefined") return;
  const sendTo = adsLeadSendTo();
  if (!sendTo) return;
  try {
    window.gtag?.("event", "conversion", { send_to: sendTo });
  } catch {
    // Never worth failing a submitted enquiry over.
  }
}
