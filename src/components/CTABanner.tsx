import Link from "next/link";
import { phone, waLink } from "@/lib/site";
import { Reveal } from "./Reveal";

export function CTABanner({
  headline = "Ready to stop worrying about your property?",
  subheadline = "Join diaspora landlords across Europe, the UAE and North America who trust Goldstay.",
  city,
}: {
  headline?: string;
  subheadline?: string;
  city?: "nairobi" | "accra";
}) {
  const message = city
    ? `Hi Goldstay, I'd like to discuss managing my property in ${city === "nairobi" ? "Nairobi" : "Accra"}`
    : "Hi Goldstay, I'd like to discuss managing my property";
  return (
    <section className="relative overflow-hidden bg-charcoal text-cream">
      <div className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-gold-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-10 h-80 w-80 rounded-full bg-forest-700/40 blur-3xl" />
      <div className="container-gs relative py-20 md:py-28">
        <Reveal>
          <div className="max-w-3xl">
            <div className="eyebrow text-gold-400">Get started</div>
            <h2 className="mt-5 font-serif text-display-md balance text-white md:text-display-lg">
              {headline}
            </h2>
            <p className="mt-5 max-w-2xl text-base text-cream/75 pretty md:text-xl">
              {subheadline}
            </p>
            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <a
                href={waLink(message, city)}
                data-wa-source="cta-banner"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                WhatsApp Us Now
              </a>
              <Link href="/list-your-property" className="btn-ghost-light">
                Or use the form →
              </Link>
            </div>
            {/* Some landlords will not start a conversation on WhatsApp
                with a company they have just found, and an older
                diaspora owner deciding who to trust with a house often
                wants to hear a voice. Costs nothing to offer. */}
            <p className="mt-6 text-sm text-cream/60">
              Prefer to call?{" "}
              <a
                href={phone.nairobi.href}
                className="text-cream underline decoration-cream/30 underline-offset-4 transition-colors hover:decoration-cream"
              >
                {phone.nairobi.display}
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
