// Image tuning that applies across the marketing site.

// Quality for a full-bleed hero photograph.
//
// Every hero on the site sits behind a charcoal gradient running from
// 65% to 95% opacity, because the headline has to stay legible over a
// photograph we did not art-direct. Almost nothing of the image
// survives that, which makes the detail we were paying for invisible:
// the pixels arrive, get multiplied by 0.2, and land as texture.
//
// 80 was the default nobody chose. At 60, behind that overlay, there
// is no difference anyone can point at, and the hero is the LCP
// element on every one of these pages — `/images/locations/nairobi.jpg`
// alone is referenced from 251 of them.
//
// A named constant rather than the number sixteen times over, so this
// reasoning lives in one place and a future hero cannot quietly go
// back to 80. If a page ever needs a hero without an overlay, it
// should pass its own value and say why, not raise this one.
export const HERO_IMAGE_QUALITY = 60;
