"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { waLink } from "@/lib/site";
import { useCurrentCity } from "@/lib/useCurrentCity";
import clsx from "./clsx";

// Pages that open on a dark hero. The navbar starts in light mode on these.
// Pages with a light/cream hero background — navbar should use dark content there from load.
// Pages NOT in this set will start transparent-over-dark (light content).
const DARK_HERO_PATHS = new Set([
  "/",
  "/nairobi",
  "/nairobi/buy",
  "/accra",
  "/accra/buy",
  "/airbnb-management",
  "/property-sourcing",
  "/list-your-property",
  "/find-a-home",
]);

// Pages whose hero is on a light background. Navbar should pin to dark content from the start.
const LIGHT_HERO_PATHS = new Set(["/yield-calculator"]);

type NavLink = { href: string; label: string };

// Nav links are city-aware. On city pages (either /nairobi, /accra or a
// country domain that rewrites to one of those) we drop the two city picker
// links, you are already in a city context, and retarget Services, Buy and
// FAQ at the current city so those verbs always mean "this city" for the
// reader. On the neutral .com homepage we keep the city picker.
function getNavLinks(city: "nairobi" | "accra" | null): NavLink[] {
  if (city) {
    const base = `/${city}`;
    return [
      { href: `${base}#services`, label: "Services" },
      { href: "/yield-calculator", label: "Yield" },
      { href: "/airbnb-management", label: "Airbnb" },
      { href: `${base}/buy`, label: "Buy" },
      { href: "/find-a-home", label: "Find a home" },
      { href: `${base}#faq`, label: "FAQ" },
    ];
  }

  return [
    { href: "/#services", label: "Services" },
    { href: "/yield-calculator", label: "Yield" },
    { href: "/nairobi", label: "Nairobi" },
    { href: "/accra", label: "Accra" },
    { href: "/airbnb-management", label: "Airbnb" },
    { href: "/property-sourcing", label: "Buy" },
    { href: "/find-a-home", label: "Find a home" },
    { href: "/#faq", label: "FAQ" },
  ];
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const city = useCurrentCity();
  const hasDarkHero = DARK_HERO_PATHS.has(pathname);
  const hasLightHero = LIGHT_HERO_PATHS.has(pathname);
  const navLinks = getNavLinks(city);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // At top of a dark-hero page the nav sits over charcoal → light content.
  // On light-background pages, or once scrolled anywhere, the nav pins to a cream backdrop → dark content.
  const onDark = hasDarkHero && !scrolled;
  const pinned = scrolled || !hasDarkHero || hasLightHero;

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-premium",
        pinned
          ? "bg-cream/90 backdrop-blur-md border-b border-charcoal/5 shadow-[0_1px_0_rgba(28,28,28,0.03)]"
          : "bg-transparent",
      )}
    >
      <div className="container-gs flex h-20 items-center justify-between">
        <Logo variant={onDark ? "light" : "dark"} />

        <nav className="hidden items-center gap-8 lg:flex xl:gap-10">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "link-underline text-sm transition-colors duration-300",
                onDark
                  ? "text-cream/85 hover:text-cream"
                  : "text-charcoal/80 hover:text-charcoal",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/list-your-property"
            className={clsx(
              "btn transition-colors duration-300",
              onDark
                ? "border border-cream/30 text-cream hover:border-cream hover:bg-cream hover:text-charcoal"
                : "btn-secondary",
            )}
          >
            List Your Property
          </Link>
          <a
            href={waLink(
              "Hi Goldstay, I'd like to discuss managing my property",
              city ?? undefined,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            WhatsApp Us
          </a>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className={clsx(
            "lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300",
            onDark
              ? "border-cream/30 text-cream hover:bg-cream/10"
              : "border-charcoal/15 text-charcoal hover:bg-charcoal/5",
          )}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          "fixed inset-0 z-50 overflow-y-auto bg-charcoal text-cream transition-opacity duration-500 ease-premium lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        <div className="container-gs flex h-20 items-center justify-between">
          <Logo variant="light" />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/15"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="container-gs mt-8 flex flex-col gap-5 pb-12">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-serif text-3xl text-cream sm:text-4xl"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/list-your-property"
              onClick={() => setOpen(false)}
              className="btn border border-cream/20 text-cream"
            >
              List Your Property
            </Link>
            <a
              href={waLink(
                "Hi Goldstay, I'd like to discuss managing my property",
                city ?? undefined,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              WhatsApp Us
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
