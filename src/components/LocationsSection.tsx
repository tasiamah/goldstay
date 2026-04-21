"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, ArrowUpRight } from "lucide-react";
import { cities } from "@/lib/site";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";

const cityImage = {
  nairobi: {
    // Nairobi skyline, Kenyatta International Conference Centre & UAP towers
    src: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1800&q=80",
    alt: "Nairobi skyline at dusk, Kenya",
    gradient: "from-[#3b2a1e] via-[#6b4a2d] to-[#1b3a2d]",
  },
  accra: {
    // Accra waterfront / Jamestown at golden hour
    src: "https://images.unsplash.com/photo-1580745294621-26a2b2f15cef?auto=format&fit=crop&w=1800&q=80",
    alt: "Accra, Ghana — Atlantic coast",
    gradient: "from-[#4a2a1a] via-[#b07a3a] to-[#1c1c1c]",
  },
} as const;

function CityCard({ cityKey, index }: { cityKey: "nairobi" | "accra"; index: number }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const c = cities[cityKey];
  const img = cityImage[cityKey];
  const cityName = cityKey === "nairobi" ? "Nairobi" : "Accra";

  return (
    <Reveal delay={index * 0.05}>
      <Link
        href={`/${cityKey}`}
        className="group relative block overflow-hidden rounded-3xl border border-charcoal/10"
      >
        <div className="relative aspect-[4/3] w-full">
          {/* Always-present premium gradient background acts as the fallback */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${img.gradient}`}
          />
          <div className="absolute inset-0 opacity-60 mix-blend-overlay grain" />

          {/* Image layered on top, fades in on load, stays hidden on error */}
          {!errored ? (
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`object-cover transition-all duration-[1200ms] ease-premium group-hover:scale-[1.04] ${loaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setLoaded(true)}
              onError={() => setErrored(true)}
              priority={index === 0}
            />
          ) : null}
        </div>

        {/* Bottom gradient for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 text-cream sm:p-8">
          <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest-xl text-gold-400">
            <MapPin className="h-3 w-3" />
            {c.country}
          </div>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h3 className="font-serif text-4xl sm:text-5xl">{cityName}</h3>
            <ArrowUpRight className="h-6 w-6 shrink-0 transition-transform duration-500 ease-premium group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
          <p className="mt-4 max-w-md text-sm text-cream/80">
            {c.neighbourhoods.join(" · ")}
          </p>
        </div>
      </Link>
    </Reveal>
  );
}

export function LocationsSection() {
  return (
    <section id="locations" className="section bg-white/50">
      <div className="container-gs">
        <SectionHeader
          eyebrow="Locations"
          title="Two cities. One standard."
          lede="We focus deeply on the neighbourhoods diaspora landlords actually own property in, where tenant demand is strongest."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <CityCard cityKey="nairobi" index={0} />
          <CityCard cityKey="accra" index={1} />
        </div>
      </div>
    </section>
  );
}
