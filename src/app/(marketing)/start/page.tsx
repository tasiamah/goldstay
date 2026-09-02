import type { Metadata } from "next";
import type { LeadSource } from "@prisma/client";
import { StartForm } from "./StartForm";
import { getServerCity } from "@/lib/getServerCity";
import type { PropertyCity } from "@/lib/lead-options";

// /start — the intake link ops paste into a WhatsApp thread.
//
// Most landlords reach Goldstay through the WhatsApp button on the
// marketing site, which is a plain wa.me deep link: the conversation
// happens entirely off-platform and nothing is recorded. Ops were then
// re-typing the landlord's details by hand into /admin/leads/new, and
// again into /admin/clients/new on conversion.
//
// This page moves that typing to the person who actually has the
// details. Paste the link into the chat, the landlord fills it in on the
// phone they're already holding, and the lead lands in /admin/leads
// already enriched and tiered, ready for one-click conversion.
//
// Unlisted rather than secret: no access key, because a landlord we're
// mid-conversation with should never hit a wall, and the endpoint behind
// it is rate-limited and creates nothing more privileged than a lead
// row. It stays out of the nav, out of the sitemap, and out of search
// (noindex below plus a Disallow in robots.ts) so it doesn't compete
// with /list-your-property for the same intent.
export const metadata: Metadata = {
  title: "Start with Goldstay",
  description:
    "Send Goldstay your property details and we'll come back to you within two business hours.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

// ?c= tags the channel the link was shared through, so /admin/leads can
// filter on it. The link ops copy carries c=wa; anything unrecognised or
// absent is treated as a plain website visit rather than being guessed
// at, because a mis-tagged source is worse than an untagged one.
const CHANNEL_TO_SOURCE: Record<string, LeadSource> = {
  wa: "WHATSAPP",
  whatsapp: "WHATSAPP",
  ref: "REFERRAL",
  email: "EMAIL",
};

type SearchParams = Promise<{ c?: string }>;

export default async function StartPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { c } = await searchParams;
  const leadSource =
    CHANNEL_TO_SOURCE[(c ?? "").trim().toLowerCase()] ?? "WEBSITE";

  // On goldstay.co.ke the property is almost always in Nairobi, so the
  // domain picks the default and saves the landlord a tap.
  const domainCity = getServerCity();
  const defaultCity: PropertyCity =
    domainCity === "accra" ? "Accra" : "Nairobi";

  return (
    <main className="section bg-cream pt-32 md:pt-40">
      <div className="container-gs">
        <div className="mx-auto max-w-xl">
          <div className="eyebrow">Goldstay · Property details</div>
          <h1 className="mt-5 font-serif text-display-md text-charcoal balance">
            Tell us about your property.
          </h1>
          <p className="mt-5 text-lg text-charcoal/75 pretty">
            Two minutes, nine questions, and only your name and number are
            required. Once it&apos;s in, a Goldstay specialist reviews it and
            comes back to you within two business hours with what your
            property should earn and what we&apos;d do with it.
          </p>

          <div className="mt-10">
            <StartForm leadSource={leadSource} defaultCity={defaultCity} />
          </div>

          <p className="mt-8 text-center font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/45">
            Goldstay, a TADCO company · Your details are never shared with
            third parties
          </p>
        </div>
      </div>
    </main>
  );
}
