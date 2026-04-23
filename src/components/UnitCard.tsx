import type { PublicUnit } from "@/lib/airtable";
import { waLink } from "@/lib/site";
import { BedDouble, MapPin, Users, CalendarDays } from "lucide-react";

// A single available unit on /find-a-home. Shows the key economics for the
// current stay type (monthly rent for long-term, nightly rate for
// short-stay), the practical constraints that would disqualify a prospect
// before they message us (max guests, min stay, earliest availability),
// and a WhatsApp CTA prefilled with the unit ID so the agent on the other
// end has instant context.
export function UnitCard({
  unit,
  stayType,
}: {
  unit: PublicUnit;
  stayType: "Long-term" | "Short-stay";
}) {
  const city = unit.city === "Nairobi" ? "nairobi" : "accra";
  const rentLabel =
    stayType === "Long-term"
      ? unit.monthlyRentUsd !== null
        ? `USD ${unit.monthlyRentUsd.toLocaleString()} / month`
        : "Price on request"
      : unit.nightlyRateUsd !== null
        ? `USD ${unit.nightlyRateUsd.toLocaleString()} / night`
        : "Price on request";

  const available = unit.earliestAvailable
    ? new Date(unit.earliestAvailable).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Available now";

  const message =
    stayType === "Long-term"
      ? `Hi Goldstay, I'm interested in long-term rental of ${unit.unitId} — ${unit.title} in ${unit.neighbourhood}, ${unit.city}. Can we talk?`
      : `Hi Goldstay, I'm looking at a short stay in ${unit.unitId} — ${unit.title} in ${unit.neighbourhood}, ${unit.city}. Is it available?`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-charcoal/10 bg-cream transition-all duration-500 ease-premium hover:-translate-y-0.5 hover:border-gold-500/40 hover:shadow-lift">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal/10">
        {unit.photoUrl ? (
          // Airtable serves user-uploaded assets from a CDN under
          // airtableusercontent.com. We use a plain <img> instead of next/image
          // so we don't have to whitelist every host, and so the page still
          // shows something when the CDN reference has rotated.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={unit.photoUrl}
            alt={`${unit.title} in ${unit.neighbourhood}, ${unit.city}`}
            className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-charcoal/85 to-charcoal text-cream/70">
            <span className="font-serif text-3xl italic">
              {unit.city}
            </span>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full border border-cream/40 bg-charcoal/65 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest-xl text-cream backdrop-blur-sm">
          {unit.unitId}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-2xl text-charcoal">{unit.title}</h3>
        <p className="mt-1 inline-flex items-center gap-2 text-sm text-charcoal/70">
          <MapPin className="h-3.5 w-3.5" />
          {unit.neighbourhood}
          {unit.neighbourhood ? ", " : ""}
          {unit.city}
        </p>

        <div className="mt-5 font-serif text-2xl text-gold-700">
          {rentLabel}
        </div>

        <ul className="mt-5 space-y-2 text-sm text-charcoal/75">
          <li className="flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-charcoal/50" />
            {unit.bedrooms === 0
              ? "Studio"
              : `${unit.bedrooms} bedroom${unit.bedrooms > 1 ? "s" : ""}`}
          </li>
          {stayType === "Short-stay" && unit.maxGuests ? (
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 text-charcoal/50" />
              Sleeps up to {unit.maxGuests}
              {unit.minStayNights
                ? ` · Min stay ${unit.minStayNights} night${unit.minStayNights > 1 ? "s" : ""}`
                : ""}
            </li>
          ) : null}
          <li className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-charcoal/50" />
            {unit.earliestAvailable ? `Available ${available}` : available}
          </li>
        </ul>

        {unit.description ? (
          <p className="mt-5 line-clamp-3 text-sm text-charcoal/65">
            {unit.description}
          </p>
        ) : null}

        <div className="mt-auto pt-6">
          <a
            href={waLink(message, city)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center"
          >
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
