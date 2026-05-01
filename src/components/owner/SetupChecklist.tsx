// Three-step owner setup checklist. Visual matches the inspiration
// screenshot: stacked rows with a leading icon, a label, and a
// trailing status indicator (filled green check when complete,
// hollow ring while incomplete). The active row gets a tinted
// background so the eye knows where it left off.
//
// The component is presentational — it doesn't compute completion
// itself; pass in the result of computeSetupChecklist().

import {
  Banknote,
  Check,
  ChevronRight,
  FileCheck2,
  UserRound,
} from "lucide-react";
import type {
  SetupChecklist as SetupChecklistData,
  SetupStepKey,
} from "@/lib/owner/setup-status";

const ICON_FOR: Record<
  SetupStepKey,
  (props: { className?: string }) => React.ReactNode
> = {
  details: (p) => <UserRound aria-hidden className={p.className} />,
  legal: (p) => <FileCheck2 aria-hidden className={p.className} />,
  bank: (p) => <Banknote aria-hidden className={p.className} />,
};

export function SetupChecklist({
  data,
  activeKey,
  hrefFor,
}: {
  data: SetupChecklistData;
  activeKey: SetupStepKey | null;
  // Each row is a link rather than a button so it works without JS
  // and ports trivially across pages. Caller controls whether links
  // jump to a fragment on the same page or to a sub-route.
  hrefFor: (key: SetupStepKey) => string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <ul className="divide-y divide-stone-100">
        {data.steps.map((step) => {
          const Icon = ICON_FOR[step.key];
          const isActive = activeKey === step.key;
          // Incomplete rows are work-to-do, so they get an amber wash,
          // an amber leading icon and a "Start" affordance on the
          // trailing edge. The active row (the one the dashboard CTA
          // pointed at) deepens the wash so the eye lands on it
          // first. Completed rows quiet down to white + a green tick:
          // the owner doesn't need to look at them again.
          const rowClass = step.done
            ? "text-stone-500 hover:bg-stone-50"
            : isActive
              ? "bg-amber-50 font-medium text-amber-950 ring-1 ring-inset ring-amber-200 hover:bg-amber-100/70"
              : "bg-amber-50/40 text-stone-800 hover:bg-amber-50";
          const iconClass = step.done
            ? "text-stone-400"
            : isActive
              ? "text-amber-800"
              : "text-amber-700";
          return (
            <li key={step.key}>
              <a
                href={hrefFor(step.key)}
                aria-current={isActive ? "step" : undefined}
                className={`flex items-center gap-4 px-5 py-4 text-sm transition-colors ${rowClass}`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} />
                <span className="min-w-0 flex-1">
                  <span className="block">{step.label}</span>
                  {!step.done ? (
                    <span
                      className={`mt-0.5 block text-xs font-normal ${
                        isActive ? "text-amber-900/80" : "text-stone-600"
                      }`}
                    >
                      {step.description}
                    </span>
                  ) : null}
                </span>
                {step.done ? (
                  <span
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/40"
                    aria-label="Complete"
                  >
                    <Check aria-hidden className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                      isActive
                        ? "bg-amber-700 text-white"
                        : "bg-white text-amber-800 ring-1 ring-amber-300"
                    }`}
                    aria-label="Start this step"
                  >
                    Start
                    <ChevronRight aria-hidden className="h-3.5 w-3.5" />
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
