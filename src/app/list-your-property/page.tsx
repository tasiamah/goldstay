import type { Metadata } from "next";
import Link from "next/link";
import { ListPropertyForm } from "@/components/ListPropertyForm";
import { Reveal } from "@/components/Reveal";
import { waLink } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

// Per-domain metadata so goldstay.co.ke reads as a Kenya-only brand in search
// results, link previews and tab titles. Keeps goldstay.com neutral.
export function generateMetadata(): Metadata {
  const city = getServerCity();
  const cityName =
    city === "nairobi" ? "Nairobi" : city === "accra" ? "Accra" : null;

  const description = cityName
    ? `Tell us about your property in ${cityName}. We'll call you within 2 hours and take it from there.`
    : "Tell us about your property in Nairobi or Accra. We'll call you within 2 hours and take it from there.";

  return {
    title: "List Your Property",
    description,
    alternates: { canonical: "/list-your-property" },
  };
}

export default function Page() {
  const city = getServerCity();
  const cityName =
    city === "nairobi" ? "Nairobi" : city === "accra" ? "Accra" : null;

  // Copy in the right-hand "Haven't bought yet?" card drops the cross-market
  // phrasing on a localized domain. The Property Sourcing link still works on
  // both domains because that page also filters cards by city.
  const sourcingCopy = cityName
    ? `If you're still looking for the right property in ${cityName}, start with our Property Sourcing service. On-the-ground search, inspection, negotiation and title verification, free for you as the buyer.`
    : "If you're still looking for the right property in Nairobi or Accra, start with our Property Sourcing service. On-the-ground search, inspection, negotiation and title verification, free for you as the buyer.";

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <div className="absolute inset-0 -z-10 grain opacity-40" />
        <div className="container-gs pb-16 md:pb-28">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">List your property</div>
              <h1 className="mt-6 font-serif text-display-lg balance">
                Tell us about your property. <em className="italic">We&apos;ll</em>{" "}
                take it from there.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/75 pretty md:text-xl">
                Fill in the form and we&apos;ll call you within two hours during
                business hours. Prefer to just talk?{" "}
                <a
                  href={waLink(
                    "Hi Goldstay, I'd like to list my property for management",
                    city ?? undefined,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-gold-400"
                >
                  WhatsApp us instead
                </a>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <ListPropertyForm />
          <aside className="space-y-8">
            <div>
              <div className="eyebrow">What happens next</div>
              <ol className="mt-5 space-y-5 text-charcoal/75">
                {[
                  "We review your property details and do a quick market read.",
                  "We call or WhatsApp you within 2 hours during business hours.",
                  "We arrange a virtual or in-person assessment.",
                  "We send a proposal with projected yield and our management plan.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-4">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-500/40 font-mono text-xs text-gold-700">
                      {i + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-3xl border border-charcoal/10 bg-white/60 p-8">
              <div className="eyebrow">No sales pressure</div>
              <p className="mt-4 text-charcoal/75">
                If Goldstay isn&apos;t the right fit, we&apos;ll tell you
                straight. Sometimes self-management is fine. Sometimes a
                neighbour is the better tenant. We only want you on board if
                we&apos;re genuinely the best option for you.
              </p>
            </div>
            <div className="rounded-3xl border border-gold-500/30 bg-gold-500/5 p-8">
              <div className="eyebrow text-gold-700">Haven&apos;t bought yet?</div>
              <p className="mt-4 text-charcoal/75">{sourcingCopy}</p>
              <Link
                href={city === "nairobi" ? "/nairobi/buy" : city === "accra" ? "/accra/buy" : "/property-sourcing"}
                className="mt-5 inline-block link-underline text-charcoal"
              >
                See how sourcing works →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
