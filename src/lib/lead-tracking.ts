// Conversion tracking for the form half of the funnel.
//
// WhatsAppTracking already reports CTA clicks. The five forms that post
// a real enquiry reported nothing, so with GA switched on the only
// "conversion" visible would have been a wa.me click — which, as that
// module's own comment says, is an upper bound on enquiries because the
// send happens where no browser can see it. A submitted form is the
// opposite: it is a completed action on our own origin, and it is the
// higher-intent lead of the two. Leaving it untracked would have made
// the weaker signal the only signal.
//
// Same event name as the WhatsApp path on purpose. GA4 key events are
// configured per event name, so emitting `generate_lead` from both and
// separating them by `method` gives one key event and one conversion
// count that can be broken down by source. A second name would need a
// second configuration and would split the number in every report.
//
// The pure payload builder is separated from the call so it can be
// tested without a DOM or a gtag stub, matching whatsapp-tracking.ts.

import { trackAdsLead } from "@/lib/ads/conversion";

// The forms that post an enquiry. A union rather than a free string so
// a typo cannot quietly create a second bucket in GA that looks like a
// real one; the reports group by this value.
//
// The landlord intake form under /embed is deliberately absent. It
// renders inside a partner's iframe under src/app/embed/layout.tsx,
// which does not mount <Analytics>, so gtag is never defined there and
// a call would be permanent dead code that reads as working coverage.
// Measuring partner embeds needs its own property and its own consent
// story, which is a separate piece of work.
export type LeadFormName =
  | "list-property"
  | "start"
  | "tenant-application"
  | "tenant-waitlist";

// Landlord-side forms are the commercial conversion. Tenant-side ones
// are supply for the letting business and worth counting separately
// rather than being mixed into the same number, so the audience is
// carried on the event instead of being inferred from the form name in
// a GA expression somebody has to maintain.
const TENANT_FORMS: ReadonlySet<LeadFormName> = new Set([
  "tenant-application",
  "tenant-waitlist",
]);

export function leadEventPayload(input: {
  form: LeadFormName;
  pathname: string;
}): {
  method: string;
  form: LeadFormName;
  audience: "landlord" | "tenant";
  page_path: string;
} {
  return {
    // Distinguishes these from the wa.me clicks sharing the event name.
    method: "form",
    form: input.form,
    audience: TENANT_FORMS.has(input.form) ? "tenant" : "landlord",
    // Trailing slash stripped so /pricing and /pricing/ do not report
    // as two pages, consistent with appendSourceRef.
    page_path:
      input.pathname.length > 1
        ? input.pathname.replace(/\/$/, "")
        : "/",
  };
}

// Call only once the POST has come back ok. Firing on submit instead
// would count failed and retried posts, which is how a conversion
// number ends up above the row count in the database.
//
// Silent when GA is not configured: window.gtag is simply absent until
// NEXT_PUBLIC_GA_MEASUREMENT_ID is set, and the optional call is a
// no-op. Wrapped anyway because this runs on the success path of the
// only forms that produce revenue, and a thrown analytics error there
// would surface to a landlord who had in fact just submitted fine.
export function trackFormLead(form: LeadFormName): void {
  if (typeof window === "undefined") return;

  try {
    const payload = leadEventPayload({
      form,
      pathname: window.location.pathname,
    });
    window.gtag?.("event", "generate_lead", payload);
    window.fbq?.("track", "Lead", { content_name: `form:${form}` });
    // Same success condition, so the Ads conversion count and the GA4
    // key event count are measuring one thing and any gap between
    // them is a tagging problem rather than a definition problem.
    trackAdsLead();
  } catch {
    // Never worth failing a submitted enquiry over.
  }
}
