"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { waLink } from "@/lib/site";
import clsx from "./clsx";

// Pages that open on a dark hero. The navbar starts in light mode on these.
const DARK_HERO_PATHS = new Set([
  "/",
  "/nairobi",
  "/accra",
  "/airbnb-management",
  "/list-your-property",
]);

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/nairobi", label: "Nairobi" },
  { href: "/accra", label: "Accra" },
  { href: "/airbnb-management", label: "Airbnb" },
  { href: "/#faq", label: "FAQ" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const hasDarkHero = DARK_HERO_PATHS.has(pathname);

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
  const pinned = scrolled || !hasDarkHero;

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
            href={waLink("Hi Goldstay, I'd like to discuss managing my property")}
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
