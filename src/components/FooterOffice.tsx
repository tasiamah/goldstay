"use client";

import { MapPin } from "lucide-react";
import { offices } from "@/lib/site";
import { useCurrentCity } from "@/lib/useCurrentCity";

// Renders the physical office block for the current city. Falls back to the
// Nairobi HQ on the homepage and any shared page because that is the
// registered brand address. If a visitor is on an Accra surface and we do not
// yet have an Accra office, we hide the block entirely rather than ship a
// Nairobi address under an Accra header, which would read as dishonest. Add
// the Accra office to site.offices the moment the lease is signed.
export function FooterOffice() {
  const city = useCurrentCity();

  const key: "nairobi" | "accra" =
    city === "accra" ? "accra" : "nairobi";
  const office = offices[key];

  if (!office) return null;

  const mapsQuery = encodeURIComponent(
    `${office.building}, ${office.street}, ${office.locality}, ${office.city}`,
  );

  return (
    <div>
      <div className="eyebrow mb-4">Our {office.city} office</div>
      <address className="space-y-1 text-sm not-italic text-charcoal/70">
        <div className="text-charcoal">{office.building}</div>
        <div>{office.street}</div>
        <div>
          {office.locality}
          {office.district ? `, ${office.district}` : ""}
        </div>
        <div>
          {office.city}
          {office.postalCode ? ` ${office.postalCode}` : ""},{" "}
          {office.country}
        </div>
        {office.postalBox ? (
          <div className="pt-2 font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/50">
            {office.postalBox}
          </div>
        ) : null}
      </address>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-xs text-charcoal/60 transition-colors hover:text-gold-700"
      >
        <MapPin className="h-3 w-3" />
        Open in Google Maps
      </a>
    </div>
  );
}
