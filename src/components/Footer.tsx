import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import { Logo } from "./Logo";
import { site, waLink } from "@/lib/site";
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
            <div className="eyebrow mb-4">Company</div>
            <ul className="space-y-3 text-sm">
              {showNairobi ? (
                <li>
                  <Link href="/nairobi" className="link-underline">
                    Nairobi
                  </Link>
                </li>
              ) : null}
              {showAccra ? (
                <li>
                  <Link href="/accra" className="link-underline">
                    Accra
                  </Link>
                </li>
              ) : null}
              <li>
                <Link href="/airbnb-management" className="link-underline">
                  Airbnb
                </Link>
              </li>
              {showNairobi ? (
                <li>
                  <Link href="/nairobi/buy" className="link-underline">
                    Buy in Nairobi
                  </Link>
                </li>
              ) : null}
              {showAccra ? (
                <li>
                  <Link href="/accra/buy" className="link-underline">
                    Buy in Accra
                  </Link>
                </li>
              ) : null}
              <li>
                <Link href="/yield-calculator" className="link-underline">
                  Yield calculator
                </Link>
              </li>
              <li>
                <Link href="/list-your-property" className="link-underline">
                  List your property
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="eyebrow mb-4">Contact</div>
            <ul className="space-y-3 text-sm">
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
