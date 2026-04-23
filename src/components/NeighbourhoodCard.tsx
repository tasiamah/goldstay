import Image from "next/image";
import type { Neighbourhood } from "@/lib/site";

// Deterministic, tasteful gradient based on the neighbourhood name, so
// each card has a distinct background even before the photo loads (and if
// a photo ever fails or is absent, the card still looks finished rather
// than showing a broken image icon).
function gradientFor(name: string): string {
  const palettes = [
    "from-[#1f2a3a] via-[#2a3a4f] to-[#3a4a62]",
    "from-[#2b1f2a] via-[#3a2a35] to-[#4f3a48]",
    "from-[#1f2a24] via-[#2a3a32] to-[#3a4f44]",
    "from-[#2a241f] via-[#3a322a] to-[#4f443a]",
    "from-[#1f242a] via-[#2a313a] to-[#3a424f]",
    "from-[#241f2a] via-[#322a3a] to-[#443a4f]",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return palettes[Math.abs(hash) % palettes.length];
}

export function NeighbourhoodCard({
  n,
  cityLabel,
}: {
  n: Neighbourhood;
  cityLabel: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-charcoal/10 bg-gradient-to-br ${gradientFor(
        n.name,
      )} aspect-[4/3] shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
    >
      {n.image && (
        <Image
          src={n.image}
          alt={`${n.name}, ${cityLabel}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      )}
      {/* Dark gradient overlay so the white text stays readable over any photo. */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/35 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-5 text-cream">
        <div className="flex items-end justify-between gap-3">
          <span className="font-serif text-2xl leading-tight drop-shadow-sm">
            {n.name}
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-widest-xl text-cream/80">
            {cityLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
