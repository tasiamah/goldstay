"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { waLink } from "@/lib/site";
import clsx from "./clsx";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-premium",
        scrolled
          ? "bg-cream/85 backdrop-blur-md border-b border-charcoal/5"
          : "bg-transparent",
      )}
    >
      <div className="container-gs flex h-20 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="link-underline text-sm text-charcoal/80 hover:text-charcoal"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/list-your-property" className="btn-secondary">
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
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/15 text-charcoal"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          "fixed inset-0 z-50 bg-charcoal text-cream transition-opacity duration-500 ease-premium md:hidden",
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
        <nav className="container-gs mt-10 flex flex-col gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-serif text-4xl text-cream"
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
