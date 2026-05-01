// Owner-side property status badge. Replaces the raw enum text the
// dashboard used to render so the owner sees a human label and,
// when ONBOARDING, a "what's missing" explainer.
//
// The badge itself is a static pill; the inline blocker list lives
// in a sibling <PropertyReadinessSummary> so callers can place the
// pill in tight UI (a row trailer) and the explainer somewhere with
// room to breathe (a card body, a tooltip target).

import Link from "next/link";
import type { PropertyStatus } from "@prisma/client";
import type {
  PropertyReadiness,
  ReadinessBlocker,
} from "@/lib/owner/property-readiness";

const TONE_FOR_STATUS: Record<
  PropertyStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Active",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  ONBOARDING: {
    label: "Setup in progress",
    className: "border-amber-200 bg-amber-50 text-amber-900",
  },
  EXITED: {
    label: "Exited",
    className: "border-stone-200 bg-stone-100 text-stone-600",
  },
};

export function PropertyReadinessBadge({
  status,
  // When the owner side is fully done but Goldstay hasn't flipped
  // the property yet, the message changes to "Awaiting verification"
  // so the owner doesn't keep hunting for something to do.
  ownerSideDone = false,
}: {
  status: PropertyStatus;
  ownerSideDone?: boolean;
}) {
  const tone = TONE_FOR_STATUS[status];
  const label =
    status === "ONBOARDING" && ownerSideDone
      ? "Awaiting Goldstay verification"
      : tone.label;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${tone.className}`}
    >
      {label}
    </span>
  );
}

// Inline list of what's blocking activation, suitable for a small
// callout under the property name on the dashboard "Your portfolio"
// list. Renders nothing for ACTIVE / EXITED properties.
export function PropertyReadinessSummary({
  readiness,
}: {
  readiness: PropertyReadiness;
}) {
  if (readiness.isActive || readiness.blockers.length === 0) return null;

  return (
    <div className="mt-2 rounded-md border border-amber-200 bg-amber-50/60 px-3 py-2">
      <p className="text-[11px] font-medium uppercase tracking-wider text-amber-900">
        Before this property goes live
      </p>
      <ul className="mt-1 space-y-1">
        {readiness.blockers.map((b) => (
          <BlockerRow key={b.key} blocker={b} />
        ))}
      </ul>
    </div>
  );
}

function BlockerRow({ blocker }: { blocker: ReadinessBlocker }) {
  const dot = (
    <span
      aria-hidden
      className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
        blocker.key === "goldstay_review" ? "bg-stone-400" : "bg-amber-500"
      }`}
    />
  );
  const label = (
    <span className="text-xs text-amber-900/90">{blocker.label}</span>
  );

  return (
    <li className="flex items-center gap-2">
      {dot}
      {blocker.href ? (
        <Link
          href={blocker.href}
          className="text-xs font-medium text-amber-900 underline-offset-2 hover:underline"
        >
          {blocker.label}
        </Link>
      ) : (
        label
      )}
    </li>
  );
}
