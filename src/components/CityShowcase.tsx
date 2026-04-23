import Image from "next/image";
import { cities } from "@/lib/site";
import { Reveal } from "./Reveal";

// Editorial "sense of place" band for the city-scoped homepages
// (goldstay.co.ke, goldstay.com.gh and /nairobi, /accra on the neutral
// domain). Mirrors the LocationsSection cards from the dual-market home:
// same local skyline photo, same gradient fallback, same bottom-overlay
// legibility treatment, but full-width and without the link because we
// are already on the city page. This gives the localized home the same
// cinematic anchor a visitor sees on the .com picker, instead of the
// skyline only appearing as a heavily washed Hero backdrop.
const cityImage = {
  nairobi: {
    src: "/images/locations/nairobi.jpg",
    alt: "Nairobi Upper Hill skyline at golden hour, Kenya",
    gradient: "from-[#3b2a1e] via-[#6b4a2d] to-[#1b3a2d]",
    position: "center",
  },
  accra: {
    src: "/images/locations/accra.jpg",
    alt: "Accra downtown skyline from a rooftop, Ghana",
    gradient: "from-[#4a2a1a] via-[#b07a3a] to-[#1c1c1c]",
    position: "center 38%",
  },
} as const;

export function CityShowcase({ city }: { city: "nairobi" | "accra" }) {
  const c = cities[city];
  const img = cityImage[city];
  const cityName = city === "nairobi" ? "Nairobi" : "Accra";

  return (
    <section className="bg-charcoal">
      <Reveal>
        <div className="relative w-full overflow-hidden">
          <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
            {/* Gradient fallback always present, so even if the image
                never loads (bad connection, CDN blip) the band still
                reads as intentional art direction. */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${img.gradient}`}
            />
            <div className="absolute inset-0 opacity-60 mix-blend-overlay grain" />
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="100vw"
              quality={80}
              className="object-cover"
              style={{ objectPosition: img.position }}
            />
            {/* Legibility overlay. Lighter at top so the skyline can
                breathe, heavier at bottom where the wordmark sits. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-charcoal/10" />
          </div>

          <div className="absolute inset-x-0 bottom-0">
            <div className="container-gs pb-8 sm:pb-12 md:pb-16">
              <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-widest-xl text-gold-400">
                <span className="inline-block h-px w-10 bg-gold-400/70" />
                {c.country}
              </div>
              <h2 className="mt-3 font-serif text-5xl text-cream sm:text-6xl md:text-7xl">
                <em className="italic">{cityName}</em>
              </h2>
              <p className="mt-4 max-w-xl text-sm text-cream/75 sm:text-base">
                {c.neighbourhoods.map((n) => n.name).join(" · ")}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
