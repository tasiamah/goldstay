import { Star } from "lucide-react";
import { ratingClaim } from "@/lib/site";

// The rating claim and its proof, as one component.
//
// The link is not decoration and it is not optional. A superlative a
// reader cannot check is just an assertion, and this audience —
// diaspora landlords who have usually been burned by an agent already
// — has learned to discount exactly that. The one-click check is what
// makes the sentence worth more than "best in Nairobi", which every
// competitor also says.
//
// It also has to be here for a mechanical reason: Google Ads will not
// run a superlative in an ad unless third-party verification is
// visible on the landing page it points at. So the claim and the link
// ship together rather than being two things a future edit could
// separate.
//
// Styled for the dark hero surfaces, which is where both current call
// sites live. See ratingClaim in site.ts for when to re-verify it.
export function RatingClaim({ className = "" }: { className?: string }) {
  return (
    <p
      // Alignment is left to the call site rather than defaulted here.
      // Two Tailwind justify- classes on one element is decided by
      // stylesheet order, not by which one the caller wrote last, so a
      // default would be unoverridable in the places it is wrong.
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-cream/75 ${className}`}
    >
      <Star
        className="h-4 w-4 shrink-0 fill-gold-400 text-gold-400"
        aria-hidden
      />
      <span>{ratingClaim.text}</span>
      <a
        href={ratingClaim.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="link-underline text-gold-400"
      >
        {ratingClaim.sourceLabel}
      </a>
    </p>
  );
}
