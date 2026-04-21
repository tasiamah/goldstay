import type { Metadata } from "next";
import { ListPropertyForm } from "@/components/ListPropertyForm";
import { Reveal } from "@/components/Reveal";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "List Your Property",
  description:
    "Tell us about your property in Nairobi or Accra. We'll call you within 2 hours and take it from there.",
  alternates: { canonical: "/list-your-property" },
};

export default function Page() {
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
          </aside>
        </div>
      </section>
    </>
  );
}
