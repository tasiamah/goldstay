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
  ACTIVE: {
    label: "Active",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-900",
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
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider ${className}`}
    >
      {label}
    </span>
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
