"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";

type Tile = {
  title: string;
  meta: string;
  src: string;
  alt: string;
  gradient: string;
  span?: "col" | "row" | "both";
};

const tiles: Tile[] = [
  {
    title: "Westlands 2-bed",
    meta: "Nairobi · Short-stay · $3,400 / mo avg",
    src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80",
    alt: "Minimal boutique apartment interior, Nairobi",
    gradient: "from-[#3b2a1e] via-[#6b4a2d] to-[#1b3a2d]",
    span: "both",
  },
  {
    title: "Cantonments 3-bed",
    meta: "Accra · Long-term · $2,800 / mo",
    src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    alt: "Warm, modern living room with natural light",
    gradient: "from-[#4a2a1a] via-[#b07a3a] to-[#1c1c1c]",
  },
  {
    title: "Kilimani studio",
    meta: "Nairobi · Short-stay · 78% occupancy",
    src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    alt: "Soft-lit bedroom with linen textures",
    gradient: "from-[#2b1a10] via-[#8a5a2c] to-[#1b3a2d]",
  },
  {
    title: "Airport Residential",
    meta: "Accra · Corporate lease · 24 mo",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    alt: "Premium apartment exterior at golden hour",
    gradient: "from-[#3a2818] via-[#a8783e] to-[#0f0f0f]",
    span: "col",
  },
  {
    title: "Lavington 3-bed",
    meta: "Nairobi · Long-term · $2,200 / mo",
    src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    alt: "Bright, contemporary living space with plants",
    gradient: "from-[#1f1a10] via-[#5a4020] to-[#1b3a2d]",
  },
];

function Tile({ tile, index }: { tile: Tile; index: number }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const spanClass =
    tile.span === "both"
      ? "md:col-span-2 md:row-span-2"
      : tile.span === "col"
        ? "md:col-span-2"
        : tile.span === "row"
          ? "md:row-span-2"
          : "";

  return (
    <Reveal delay={index * 0.04}>
      <div
        className={`group relative overflow-hidden rounded-3xl border border-charcoal/10 ${spanClass}`}
      >
        <div className="relative aspect-[4/3] w-full md:aspect-auto md:h-full md:min-h-[280px]">
          <div className={`absolute inset-0 bg-gradient-to-br ${tile.gradient}`} />
          <div className="absolute inset-0 opacity-60 mix-blend-overlay grain" />
          {!errored ? (
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`object-cover transition-all duration-[1200ms] ease-premium group-hover:scale-[1.04] ${loaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setLoaded(true)}
              onError={() => setErrored(true)}
            />
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-cream sm:p-6">
            <div className="font-serif text-xl sm:text-2xl">{tile.title}</div>
            <div className="mt-1 font-mono text-[0.7rem] uppercase tracking-widest-xl text-gold-400">
              {tile.meta}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function PortfolioGallery() {
  return (
    <section className="section bg-white/50">
      <div className="container-gs">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeader
            eyebrow="Portfolio"
            title="A quiet portfolio. Deliberately."
            lede="A small selection of properties we manage. Names withheld out of respect for our landlords' privacy."
          />
        </div>

        <div className="mt-16 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {tiles.map((t, i) => (
            <Tile key={t.title} tile={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
