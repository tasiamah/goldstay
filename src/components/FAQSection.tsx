"use client";

import { Plus, Minus } from "lucide-react";
import { faq as defaultFaq, localizedFaq } from "@/lib/site";
import { useCurrentCity } from "@/lib/useCurrentCity";
import { SectionHeader } from "./SectionHeader";

type FaqItem = { q: string; a: string };

// FAQ accordion built on the native <details> / <summary> disclosure
// widget instead of framer-motion's AnimatePresence. That saves the
// framer-motion import from this page, gives us built-in a11y
// (keyboard, screen readers, browser find-in-page reaches closed
// content), and the micro-animation is handled by a small CSS keyframe
// in globals.css. Still a client component only because we read the
// current city to pick the localized FAQ list.
export function FAQSection({
  items,
  eyebrow = "FAQ",
  title = "Straightforward answers to the questions we get most.",
  id = "faq",
  initialOpen = 0,
}: {
  items?: readonly FaqItem[];
  eyebrow?: string;
  title?: string;
  id?: string;
  initialOpen?: number | null;
} = {}) {
  // If the caller passed an explicit list (city pages, service-specific FAQs)
  // we respect it. Otherwise we pick the list by the current surface: on
  // goldstay.co.ke or any /nairobi route we show the Nairobi-scoped answers
  // (no KES/GHS duality, no "Kenya or Ghana" references), on goldstay.com.gh
  // or /accra the Accra-scoped ones, and on the neutral .com homepage the
  // dual-market default. This is what keeps /airbnb-management on .co.ke
  // from leaking Ghana copy.
  const currentCity = useCurrentCity();
  const list = items ?? (currentCity ? localizedFaq(currentCity) : defaultFaq);

  return (
    <section id={id} className="section bg-white/50">
      <div className="container-gs max-w-5xl">
        <SectionHeader eyebrow={eyebrow} title={title} />

        <div className="mt-14 divide-y divide-charcoal/10 border-y border-charcoal/10">
          {list.map((item, i) => (
            <details
              key={item.q}
              className="gs-faq group"
              open={initialOpen === i}
            >
              <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
                <span className="font-serif text-lg sm:text-xl md:text-2xl">
                  {item.q}
                </span>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/70">
                  <Plus className="gs-faq-plus h-4 w-4" />
                  <Minus className="gs-faq-minus h-4 w-4" />
                </span>
              </summary>
              <div className="gs-faq-content">
                <p className="max-w-3xl pb-6 pr-10 text-charcoal/75">
                  {item.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
