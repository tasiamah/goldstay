import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import { Logo } from "./Logo";
import { cities, neighbourhoodSlug, site, waLink } from "@/lib/site";
import { FooterContactEmail } from "./FooterContactEmail";
import { FooterOffice } from "./FooterOffice";
import { getServerCity } from "@/lib/getServerCity";

export function Footer() {
  // On goldstay.co.ke we remove the Accra links and the Ghana domain tag so
  // the footer doesn't contradict the rest of the Kenya-only surface. Same
  // for Accra on goldstay.com.gh. The neutral .com keeps both markets
  // because that page IS the dual-city homepage.
  const city = getServerCity();
  const showNairobi = city !== "accra";
  const showAccra = city !== "nairobi";

  // Neighbourhood links surface every static page we ship to the
  // crawler from every page on the site. Internal linking with
  // descriptive anchor text is the cheapest ranking lever we own and
  // each neighbourhood page targets a distinct long-tail query
  // ("property management Kilimani" etc.).
  const neighbourhoodLinks = (cityKey: "nairobi" | "accra") =>
    cities[cityKey].neighbourhoods.map((n) => ({
      href: `/${cityKey}/${neighbourhoodSlug(n.name)}`,
      label: n.name,
    }));

  const brandLine =
    city === "nairobi"
      ? "Premium property management in Nairobi. Built for diaspora landlords. Remittances in US dollars."
      : city === "accra"
        ? "Premium property management in Accra. Built for diaspora landlords. Remittances in US dollars."
        : "Premium property management in Nairobi and Accra. Built for diaspora landlords. Remittances in US dollars.";

  return (
    <footer className="border-t border-charcoal/10 bg-cream-100">
      <div className="container-gs py-20">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-sm text-charcoal/70">{brandLine}</p>
            <div className="mt-8 flex items-center gap-3">
              <a
                aria-label="Instagram"
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/70 transition-colors hover:border-gold-500 hover:text-charcoal"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                aria-label="LinkedIn"
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/70 transition-colors hover:border-gold-500 hover:text-charcoal"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="eyebrow mb-4">Services</div>
            <ul className="space-y-3 text-sm">
              {showNairobi ? (
                <li>
                  <Link href="/nairobi" className="link-underline">
                    Property management Nairobi
                  </Link>
                </li>
              ) : null}
              {showAccra ? (
                <li>
                  <Link href="/accra" className="link-underline">
                    Property management Accra
                  </Link>
                </li>
              ) : null}
              <li>
                <Link href="/airbnb-management" className="link-underline">
                  Airbnb &amp; short-stay management
                </Link>
              </li>
              <li>
                <Link href="/property-sourcing" className="link-underline">
                  Property sourcing
                </Link>
              </li>
              {showNairobi ? (
                <li>
                  <Link href="/nairobi/buy" className="link-underline">
                    Buy property in Nairobi
                  </Link>
                </li>
              ) : null}
              {showAccra ? (
                <li>
                  <Link href="/accra/buy" className="link-underline">
                    Buy property in Accra
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="eyebrow mb-4">More</div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/find-a-home" className="link-underline">
                  Find a home
                </Link>
              </li>
              <li>
                <Link href="/list-your-property" className="link-underline">
                  List your property
                </Link>
              </li>
              <li>
                <Link href="/yield-calculator" className="link-underline">
                  Yield calculator
                </Link>
              </li>
              <li>
                <Link href="/about" className="link-underline">
                  About Goldstay
                </Link>
              </li>
              <li>
                <FooterContactEmail />
              </li>
              <li>
                <a
                  href={waLink("Hi Goldstay", city ?? undefined)}
                  className="link-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <FooterOffice />
            <ul className="mt-8 space-y-3 text-sm text-charcoal/70">
              {showNairobi ? (
                <li>
                  <span className="font-mono text-[0.7rem] uppercase tracking-widest-xl text-charcoal/50">
                    Kenya
                  </span>
                  <div>{site.domains.nairobi}</div>
                </li>
              ) : null}
              {showAccra ? (
                <li>
                  <span className="font-mono text-[0.7rem] uppercase tracking-widest-xl text-charcoal/50">
                    Ghana
                  </span>
                  <div>{site.domains.accra}</div>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        {/* Neighbourhoods strip. Keeps every neighbourhood landing page
            one click from every other page on the site, which gives
            them the crawl depth they need to actually rank for
            "property management <neighbourhood>" queries. Hidden on
            the localised domains' opposite city to stay on-message. */}
        <div className="mt-16 border-t border-charcoal/10 pt-10">
          <div className="grid gap-10 md:grid-cols-2">
            {showNairobi ? (
              <div>
                <div className="eyebrow mb-4">Nairobi neighbourhoods</div>
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {neighbourhoodLinks("nairobi").map((n) => (
                    <li key={n.href}>
                      <Link href={n.href} className="link-underline text-charcoal/70 hover:text-charcoal">
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {showAccra ? (
              <div>
                <div className="eyebrow mb-4">Accra neighbourhoods</div>
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {neighbourhoodLinks("accra").map((n) => (
                    <li key={n.href}>
                      <Link href={n.href} className="link-underline text-charcoal/70 hover:text-charcoal">
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-charcoal/10 pt-8 text-xs text-charcoal/50 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Goldstay. {site.parent}.</div>
          <div className="flex gap-6">
            <Link href="/privacy" className="link-underline">
              Privacy
            </Link>
            <Link href="/terms" className="link-underline">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
