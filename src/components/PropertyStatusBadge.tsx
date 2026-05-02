// Small visual badge for a property's lifecycle status. Used in
// admin and owner property detail headers so the state is glanceable
// rather than a buried uppercase string. Kept dependency-light: just
// Tailwind classes, no client JS.

type Status = "ONBOARDING" | "ACTIVE" | "EXITED";
type Type = "LONG_TERM" | "SHORT_TERM";

const STYLES: Record<Status, { label: string; className: string }> = {
  ONBOARDING: {
    label: "Onboarding",
    className:
      "border-amber-200 bg-amber-50 text-amber-900",
  },
  // ACTIVE = the property has cleared Goldstay's onboarding review
  // (documents are on file and verified, owner KYC is signed off).
  // Surface that as "Verified" with a checkmark so the trust signal
  // is visible at a glance instead of buried behind ops jargon.
  ACTIVE: {
    label: "Verified",
    className:
      "border-emerald-300 bg-emerald-50 text-emerald-900",
  },
  EXITED: {
    label: "Exited",
    className: "border-stone-200 bg-stone-100 text-stone-700",
  },
};

export function PropertyStatusBadge({ status }: { status: Status }) {
  const { label, className } = STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider ${className}`}
    >
      {status === "ACTIVE" ? <VerifiedCheckIcon /> : null}
      {label}
    </span>
  );
}

function VerifiedCheckIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      aria-hidden
      fill="none"
    >
      <path
        d="M2.5 6.5l2.5 2.5L9.5 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TYPE_STYLES: Record<Type, { label: string; className: string }> = {
  LONG_TERM: {
    label: "Long-term",
    className: "border-stone-200 bg-stone-50 text-stone-700",
  },
  SHORT_TERM: {
    label: "Short-term",
    className: "border-violet-200 bg-violet-50 text-violet-900",
  },
};

export function PropertyTypeBadge({ type }: { type: Type }) {
  const { label, className } = TYPE_STYLES[type];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider ${className}`}
    >
      {label}
    </span>
  );
}
