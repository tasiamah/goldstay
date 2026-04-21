"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";
import { waLink } from "@/lib/site";

// Appears after the user has scrolled past the hero on mobile only. Keeps the
// two primary CTAs (WhatsApp · send property details) always within thumb reach
// without competing with the floating WhatsApp circle or the top nav.
export function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 md:hidden pointer-events-none transition-all duration-500 ease-premium ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div
        className="pointer-events-auto mx-3 mb-3 flex items-stretch gap-2 rounded-2xl border border-charcoal/15 bg-cream/95 p-2 shadow-lift backdrop-blur supports-[backdrop-filter]:bg-cream/85"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <a
          href={waLink(
            "Hi Goldstay, I'd like to chat about managing my property",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3 text-sm font-medium text-white transition-colors duration-300 active:bg-[#1ebe5b]"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={2} />
          WhatsApp us
        </a>
        <Link
          href="/list-your-property"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-charcoal px-3 py-3 text-sm font-medium text-cream transition-colors duration-300 active:bg-charcoal/85"
        >
          List property
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
