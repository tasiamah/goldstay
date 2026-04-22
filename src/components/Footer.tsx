import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import { Logo } from "./Logo";
import { site, waLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-charcoal/10 bg-cream-100">
      <div className="container-gs py-20">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-sm text-charcoal/70">
              Premium property management in Nairobi and Accra. Built for diaspora
              landlords. Remittances in US dollars.
            </p>
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
              <li>
                <Link href="/nairobi" className="link-underline">
                  Nairobi
                </Link>
              </li>
              <li>
                <Link href="/accra" className="link-underline">
                  Accra
                </Link>
              </li>
              <li>
                <Link href="/airbnb-management" className="link-underline">
                  Airbnb
                </Link>
              </li>
              <li>
                <Link href="/nairobi/buy" className="link-underline">
                  Buy in Nairobi
                </Link>
              </li>
              <li>
                <Link href="/accra/buy" className="link-underline">
                  Buy in Accra
                </Link>
              </li>
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
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={waLink("Hi Goldstay")}
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
            <div className="eyebrow mb-4">Local Sites</div>
            <ul className="space-y-3 text-sm text-charcoal/70">
              <li>
                <span className="font-mono text-[0.7rem] uppercase tracking-widest-xl text-charcoal/50">
                  Kenya
                </span>
                <div>{site.domains.nairobi}</div>
              </li>
              <li>
                <span className="font-mono text-[0.7rem] uppercase tracking-widest-xl text-charcoal/50">
                  Ghana
                </span>
                <div>{site.domains.accra}</div>
              </li>
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
