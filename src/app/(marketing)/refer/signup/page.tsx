import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { alternateLanguagesFor, baseUrlFor } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { SignupForm } from "./SignupForm";

export function generateMetadata(): Metadata {
  return {
    // `absolute` because the title already names the brand, and the
    // layout's "%s | Goldstay" template would render it twice.
    title: { absolute: "Join the Goldstay Partner Programme" },
    description:
      "Sign up in two minutes. Refer landlords to Goldstay and earn a recurring share of every monthly management fee.",
    alternates: {
      canonical: "/refer/signup",
      languages: alternateLanguagesFor("/refer/signup"),
    },
  };
}

export default function Page({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  // Tier preselect from /refer landing CTAs. Defaults to AGENT
  // because that's the larger TAM and the form copy is the same
  // either way.
  const presetType =
    searchParams.type === "LANDLORD" || searchParams.type === "PARTNER"
      ? searchParams.type
      : "AGENT";

  const baseUrl = baseUrlFor(getServerCity());

  return (
    <>
      {/* Three levels, so this is the page that makes the /refer trail
          worth having at all. */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          { name: "Refer", url: `${baseUrl}/refer` },
          { name: "Sign up", url: `${baseUrl}/refer/signup` },
        ]}
      />
      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <div className="absolute inset-0 -z-10 grain opacity-40" />
        <div className="container-gs pb-12 md:pb-16">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">Join the programme</div>
              <h1 className="mt-6 font-serif text-display-lg balance">
                Sign up <em className="italic">in two minutes</em>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/75 pretty md:text-xl">
                We&rsquo;ll email you a referral link and a private dashboard
                URL. Bookmark it &mdash; that&rsquo;s how you check earnings,
                submit landlords directly, and update your payout details.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-16 md:py-24">
        <div className="container-gs max-w-3xl">
          <Reveal>
            <SignupForm presetType={presetType} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
