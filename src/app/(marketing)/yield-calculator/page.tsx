import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { alternateLanguagesFor, site, waLink } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";
import { YieldCalculatorClient } from "./YieldCalculatorClient";

// /yield-calculator is the lead-magnet surface. It exists on every
// domain because the maths is the same in every market; the city
// dropdown lets the user pick. We intentionally do NOT pre-select
// from getServerCity() because diaspora landlords often own in
// multiple markets and we want the dropdown visible.

export function generateMetadata(): Metadata {
  return {
    title: "Diaspora Landlord Yield Calculator",
    description:
      "Honest, transparent yield comparison: self-managed vs. Goldstay. Get a branded PDF with every assumption shown.",
    alternates: {
      canonical: "/yield-calculator",
      languages: alternateLanguagesFor("/yield-calculator"),
    },
  };
}

export default function Page() {
  const city = getServerCity();

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <div className="absolute inset-0 -z-10 grain opacity-40" />
        <div className="container-gs pb-12 md:pb-20">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">
                Diaspora yield calculator
              </div>
              <h1 className="mt-6 font-serif text-display-lg balance">
                What does your{" "}
                <em className="italic">
                  {city === "nairobi"
                    ? "Nairobi"
                    : city === "accra"
                      ? "Accra"
                      : "Nairobi or Accra"}
                </em>{" "}
                property actually net you?
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/75 pretty md:text-xl">
                A two-minute, honest comparison between self-managed and
                Goldstay-managed economics. The PDF you get back shows every
                assumption. We&apos;d rather you sanity-check us than take our
                word for it.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-16 md:py-24">
        <div className="container-gs">
          <Reveal>
            <YieldCalculatorClient />
          </Reveal>

          <Reveal>
            <div className="mt-16 grid gap-6 sm:grid-cols-3">
              <Pillar
                title="Honest assumptions"
                body="Every rate in the model is printed on the PDF. No black-box yield promises."
              />
              <Pillar
                title="Same maths we&rsquo;d show on a call"
                body="Real numbers from comparable units in our managed portfolio. Ask and we&rsquo;ll share them."
              />
              <Pillar
                title="No commitment, ever"
                body="Download the PDF, do nothing, never hear from us again. Or book a 20-minute call."
              />
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-16 rounded-2xl bg-forest p-8 text-cream md:p-12">
              <h2 className="font-serif text-2xl md:text-3xl">
                Already convinced?
              </h2>
              <p className="mt-2 max-w-2xl text-cream/85">
                Skip the calculator and tell us about your property directly.
                We&apos;ll call you within two business hours.
              </p>
              <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link href="/list-your-property" className="btn-primary">
                  List your property
                </Link>
                <a
                  href={waLink(
                    "Hi Goldstay, I just used the yield calculator and would like to talk.",
                    city ?? undefined,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-light"
                >
                  Or message us on WhatsApp →
                </a>
              </div>
              <p className="mt-4 text-xs text-cream/60">
                Goldstay · A TADCO Company · {site.email}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-soft">
      <div
        className="font-serif text-lg text-charcoal"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <p className="mt-2 text-sm text-stone-600">{body}</p>
    </div>
  );
}
