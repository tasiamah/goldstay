"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { waLink } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({
  eyebrow = "Nairobi · Accra",
  headline = "Premium property management in Nairobi & Accra.",
  subheadline = "We handle everything. You receive monthly USD transfers. Zero headaches.",
  city,
}: {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  city?: "nairobi" | "accra";
}) {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-charcoal text-cream">
      {/* background image */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url('${
            city === "accra"
              ? "https://images.unsplash.com/photo-1580745294621-26a2b2f15cef?auto=format&fit=crop&w=2400&q=80"
              : city === "nairobi"
                ? "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=2400&q=80"
                : "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=2400&q=80"
          }')`,
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/70 via-charcoal/60 to-charcoal/95" />
      <div className="absolute inset-0 -z-10 grain opacity-40" />

      <div className="container-gs relative flex min-h-[100svh] flex-col justify-end pb-16 pt-40 md:justify-center md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="max-w-4xl"
        >
          <div className="eyebrow text-gold-400">{eyebrow}</div>
          <h1 className="mt-6 font-serif text-display-xl text-cream balance">
            {headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
            {subheadline}
          </p>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <a
              href={waLink(
                city === "nairobi"
                  ? "Hi Goldstay, I'd like to discuss managing my property in Nairobi"
                  : city === "accra"
                    ? "Hi Goldstay, I'd like to discuss managing my property in Accra"
                    : "Hi Goldstay, I'd like to discuss managing my property",
                city,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              List Your Property
            </a>
            <Link href="#services" className="btn-ghost-light">
              Learn More
              <ArrowDown className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
          className="mt-16 grid max-w-4xl grid-cols-3 gap-6 border-t border-cream/15 pt-8"
        >
          {[
            { k: "2", label: "Cities" },
            { k: "USD", label: "Remittance" },
            { k: "24/7", label: "Landlord Support" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-serif text-3xl text-cream md:text-4xl">
                {s.k}
              </div>
              <div className="mt-1 font-mono text-[0.7rem] uppercase tracking-widest-xl text-cream/60">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
