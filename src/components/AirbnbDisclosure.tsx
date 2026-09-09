// Airbnb trademark disclosure.
//
// Airbnb's brand guidelines ask any short-term rental management
// company that mentions them to carry a prominent notice that it is
// not affiliated, and they name two surfaces specifically: an earnings
// calculator, and anywhere user data is captured. The wording below is
// theirs rather than ours, so it is not paraphrased.
//
// Why it is worth having beyond politeness. Goldstay markets "Airbnb
// management" heavily, because that is what owners here search for and
// giving up the phrase would cost real traffic. The same guidelines
// treat using the mark as a service name as prohibited branded use, so
// the phrase and the disclosure are a pair: the notice is what makes
// the usage descriptive rather than a claim of endorsement. The
// practical exposure is not a lawsuit, it is a trademark complaint to
// Google taking down the paid search campaign, which is the channel
// the phrase is most valuable in.
//
// Rendered in the footer on every page, and again directly under the
// calculator and lead-form CTAs, which is where the guidelines ask for
// it and also where a visitor is deciding whether we are who we say.

const DISCLOSURE =
  "Goldstay is an independent third party and is not endorsed by or associated with Airbnb, Inc. or its affiliates.";

// Under a CTA. Small and quiet, but present rather than hidden behind
// a link, because "prominent" is the word the guidelines use.
//
// The colour is the caller's to set, not baked in: this appears on the
// cream forms and on the dark CTA band of the paid landing page, and a
// charcoal default would render invisible on the second — the one page
// where a Google Ads reviewer is most likely to look for it.
export function AirbnbDisclosure({ className }: { className?: string }) {
  return <p className={`text-xs ${className ?? "text-charcoal/50"}`}>{DISCLOSURE}</p>;
}

// Footer variant. Inherits the surrounding bottom-bar colour rather
// than setting its own, so it reads as part of the legal line it sits
// with instead of as a warning.
export function AirbnbDisclosureLine() {
  return <span>{DISCLOSURE}</span>;
}
