"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { faq as defaultFaq } from "@/lib/site";
import { SectionHeader } from "./SectionHeader";

type FaqItem = { q: string; a: string };

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
  const [open, setOpen] = useState<number | null>(initialOpen);
  const list = items ?? defaultFaq;

  return (
    <section id={id} className="section bg-white/50">
      <div className="container-gs max-w-5xl">
        <SectionHeader eyebrow={eyebrow} title={title} />

        <div className="mt-14 divide-y divide-charcoal/10 border-y border-charcoal/10">
          {list.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg sm:text-xl md:text-2xl">
                    {item.q}
                  </span>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/70">
                    {isOpen ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-3xl pb-6 pr-10 text-charcoal/75">
                        {item.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
