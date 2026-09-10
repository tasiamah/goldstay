// Maps an extracted Airbnb listing onto the fields the admin property
// form actually has.
//
// The two records are not the same thing and this is where that shows.
// A Property here is an operations record: `name` is the building, and
// `description` is internal ops notes marked not-visible-to-client. An
// Airbnb listing is a sales document: its title is marketing copy and
// its description is written for guests. So this fills the form in as
// a starting point and returns a warning for every field where the
// import means something different from the label above the box.
//
// The warnings are computed here rather than written into the UI so
// they can be tested, and so a field cannot quietly start importing
// without its caveat coming along.

import {
  findCanonicalNairobiNeighbourhood,
  isNairobiCity,
} from "@/lib/nairobi-neighbourhoods";
import type { AirbnbListing } from "./listing";

export type ImportedPropertyDefaults = {
  name: string | null;
  description: string | null;
  city: string | null;
  neighbourhood: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  maxOccupancy: number | null;
  propertyType: "SHORT_TERM";
};

export type ImportMapping = {
  defaults: ImportedPropertyDefaults;
  // Things the operator has to know before saving, in the order they
  // will hit them on the form.
  warnings: string[];
  // Extracted, real, and with nowhere to go in the current schema.
  // Surfaced so the value is visible even though it is not saved,
  // rather than silently dropped.
  unmapped: {
    photoCount: number;
    rating: number | null;
    reviewCount: number | null;
    latitude: number | null;
    longitude: number | null;
    listingUrl: string;
  };
};

export function mapListingToProperty(listing: AirbnbListing): ImportMapping {
  const warnings: string[] = [];

  // Airbnb's addressLocality is inconsistent: sometimes the city
  // ("Nairobi"), sometimes the neighbourhood ("Westlands"). Checking
  // it against our own list is the only reliable way to tell which we
  // were handed, and it also normalises the spelling to the one the
  // dropdown expects so the value actually selects an option.
  const asNeighbourhood = findCanonicalNairobiNeighbourhood(listing.locality);
  const city = asNeighbourhood
    ? "Nairobi"
    : isNairobiCity(listing.locality)
      ? "Nairobi"
      : listing.locality;

  if (listing.name) {
    warnings.push(
      "The name came from the Airbnb title, which is marketing copy. Change it to the building name before saving, or the property will be called that on the management agreement.",
    );
  }

  // The street address is genuinely not available. Airbnb withholds it
  // from a logged-out page on purpose and only reveals it once a
  // booking is confirmed, and the published coordinates are offset by
  // a few hundred metres for the same reason. Saying so is better than
  // an operator hunting for a field we were never going to fill.
  warnings.push(
    "Address is blank and has to be typed in. Airbnb hides the street address until a booking is confirmed, and it offsets the map pin deliberately.",
  );

  if (!asNeighbourhood && listing.locality) {
    warnings.push(
      `Airbnb only gave the area as "${listing.locality}", which is not one of our neighbourhoods. Pick the neighbourhood by hand.`,
    );
  }

  // bathrooms is an Int in the schema and Airbnb reports halves. A
  // rounded value beats a blank field, but only if the operator is
  // told it was rounded.
  let bathrooms = listing.bathrooms;
  if (bathrooms !== null && !Number.isInteger(bathrooms)) {
    const rounded = Math.round(bathrooms);
    warnings.push(
      `Airbnb lists ${bathrooms} bathrooms and this field only takes whole numbers, so it has been set to ${rounded}.`,
    );
    bathrooms = rounded;
  }

  if (listing.description) {
    warnings.push(
      "The description is Airbnb's guest-facing copy, dropped into a field meant for internal ops notes. Trim it to what ops need.",
    );
  }

  if (listing.images.length > 0) {
    warnings.push(
      `${listing.images.length} photos were found but there is nowhere to store them yet, so they have not been imported.`,
    );
  }

  return {
    defaults: {
      name: listing.name,
      description: listing.description,
      city,
      neighbourhood: asNeighbourhood,
      bedrooms: listing.bedrooms,
      bathrooms,
      maxOccupancy: listing.maxOccupancy,
      // Importing from Airbnb is about as clear a signal of intent as
      // the form gets, and picking the wrong rental model is locked
      // afterwards on an existing property.
      propertyType: "SHORT_TERM",
    },
    warnings,
    unmapped: {
      photoCount: listing.images.length,
      rating: listing.rating,
      reviewCount: listing.reviewCount,
      latitude: listing.latitude,
      longitude: listing.longitude,
      listingUrl: listing.url,
    },
  };
}
