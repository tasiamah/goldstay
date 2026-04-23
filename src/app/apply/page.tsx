import type { Metadata } from "next";
import { TenantApplicationForm } from "@/components/TenantApplicationForm";
import { getServerCity } from "@/lib/getServerCity";

// Unlisted tenant application page. Not in the nav, not in the sitemap, and
// explicitly blocked from search indexing below. Ops share the link with a
// prospective tenant privately (WhatsApp, email), optionally with query
// params to prefill property and city:
//   https://goldstay.com/apply?property=Gemini%201-bed&city=Nairobi&ref=TED
export const metadata: Metadata = {
  title: "Tenant application · Goldstay",
  description:
    "Private rental application form for tenants invited by Goldstay.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

type SearchParams = Promise<{
  property?: string;
  city?: string;
  ref?: string;
  token?: string;
}>;

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { property, city, token } = await searchParams;
  const domainCity = getServerCity();

  // Footer references to data protection laws are dropped when the applicant
  // is on a localized domain where only one law applies.
  const privacyCopy =
    domainCity === "nairobi"
      ? "Application data handled under Kenya Data Protection Act 2019"
      : domainCity === "accra"
        ? "Application data handled under Ghana Data Protection Act 2012"
        : "Application data handled under Kenya Data Protection Act 2019 and Ghana Data Protection Act 2012";

  return (
    <main className="section bg-cream pt-32 md:pt-40">
      <div className="container-gs">
        <div className="mx-auto max-w-3xl">
          <div className="eyebrow">Goldstay · Tenant application</div>
          <h1 className="mt-5 font-serif text-display-md text-charcoal balance md:text-display-lg">
            A private application, sent to you by Goldstay.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-charcoal/75 pretty">
            Fill this in once. We verify your details, call your employer and
            previous landlord, and only then share your file with the landlord
            of the property you&apos;re applying for. Takes most people ten to
            fifteen minutes. Your progress is not saved if you close the tab,
            so block out the time before you start.
          </p>

          <div className="mt-12">
            <TenantApplicationForm
              token={token}
              prefillProperty={property}
              prefillCity={city}
            />
          </div>

          <p className="mt-8 text-center font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/45">
            Goldstay, a TADCO company · {privacyCopy}
          </p>
        </div>
      </div>
    </main>
  );
}
