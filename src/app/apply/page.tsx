import type { Metadata } from "next";
import { TenantApplicationForm } from "@/components/TenantApplicationForm";
import { getServerCity } from "@/lib/getServerCity";
import { emailFor } from "@/lib/site";
import { isApplyAccessValid } from "@/lib/applyAccess";

// Unlisted tenant application page. Not in the nav, not in the sitemap, and
// explicitly blocked from search indexing below. Ops share the link with a
// prospective tenant privately (WhatsApp, email) with the shared access
// key appended as ?key=..., optionally with params to prefill property and
// tracking ref:
//   https://goldstay.com/apply?key=SECRET&property=Gemini%201-bed&city=Nairobi&ref=TED
//
// The `key` is checked server-side against APPLY_ACCESS_TOKEN. Any request
// without it, or with a wrong value, is shown the private-link stub and
// cannot reach the form. The API route /api/tenant-application re-checks
// the same header so direct POSTs to the API are also blocked.
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
  key?: string;
}>;

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { property, city, token, key } = await searchParams;
  const domainCity = getServerCity();
  const contactEmail = emailFor(domainCity ?? undefined);

  if (!isApplyAccessValid(key)) {
    return (
      <main className="section bg-cream pt-32 md:pt-40">
        <div className="container-gs">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">Private link required</div>
            <h1 className="mt-5 font-serif text-display-md text-charcoal balance md:text-display-lg">
              This page is by invitation only.
            </h1>
            <p className="mt-5 text-lg text-charcoal/75 pretty">
              The Goldstay tenant application is shared privately with
              applicants we&apos;ve invited to a specific property. If you were
              expecting to see a form here, the link you&apos;ve been given is
              either expired or missing the access key.
            </p>
            <p className="mt-3 text-lg text-charcoal/75 pretty">
              Please reply to the message you received from us, or write to{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-gold-700 underline"
              >
                {contactEmail}
              </a>{" "}
              and we&apos;ll send you a fresh invitation.
            </p>
          </div>
        </div>
      </main>
    );
  }

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
              accessKey={key}
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
