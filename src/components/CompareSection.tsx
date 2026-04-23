import { Check, Minus, X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";

type Cell =
  | { kind: "yes"; label?: string }
  | { kind: "no"; label?: string }
  | { kind: "partial"; label?: string };

type Row = {
  feature: string;
  self: Cell;
  agent: Cell;
  goldstay: Cell;
};

const buildRows = (cityName: string, localCurrency: string): Row[] => [
  {
    feature: `Lives in ${cityName}, visits your property in person`,
    self: { kind: "no", label: "You're abroad" },
    agent: { kind: "partial", label: "Sometimes" },
    goldstay: { kind: "yes" },
  },
  {
    feature: "Paid to you in USD, wired to your overseas account",
    self: { kind: "no", label: "Manual FX" },
    agent: { kind: "no", label: `${localCurrency} only` },
    goldstay: { kind: "yes" },
  },
  {
    feature: "Responds to tenants within 48 hours, 24/7 for emergencies",
    self: { kind: "no" },
    agent: { kind: "partial", label: "Office hours" },
    goldstay: { kind: "yes" },
  },
  {
    feature: "Monthly statement with receipts for every expense",
    self: { kind: "partial", label: "If you ask" },
    agent: { kind: "no" },
    goldstay: { kind: "yes" },
  },
  {
    feature: "Runs long-term and short-stay under the same roof",
    self: { kind: "no" },
    agent: { kind: "no" },
    goldstay: { kind: "yes" },
  },
  {
    feature: "Vetted tenants with employment and reference checks",
    self: { kind: "partial", label: "DIY" },
    agent: { kind: "partial", label: "Inconsistent" },
    goldstay: { kind: "yes" },
  },
  {
    feature: "Transparent fee with no kickbacks or surprise deductions",
    self: { kind: "yes" },
    agent: { kind: "no", label: "Opaque" },
    goldstay: { kind: "yes" },
  },
  {
    feature: "Your time spent every month",
    self: { kind: "no", label: "10 to 20 hrs" },
    agent: { kind: "partial", label: "5 to 10 hrs" },
    goldstay: { kind: "yes", label: "Under 30 min" },
  },
];

function CellBadge({ cell }: { cell: Cell }) {
  const iconCls =
    "h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]";
  if (cell.kind === "yes") {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-700">
          <Check className={iconCls} strokeWidth={2.5} />
        </span>
        {cell.label ? (
          <span className="text-sm text-charcoal/80">{cell.label}</span>
        ) : null}
      </div>
    );
  }
  if (cell.kind === "no") {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-charcoal/5 text-charcoal/40">
          <X className={iconCls} strokeWidth={2.5} />
        </span>
        {cell.label ? (
          <span className="text-sm text-charcoal/55">{cell.label}</span>
        ) : null}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-charcoal/5 text-charcoal/55">
        <Minus className={iconCls} strokeWidth={2.5} />
      </span>
      {cell.label ? (
        <span className="text-sm text-charcoal/70">{cell.label}</span>
      ) : null}
    </div>
  );
}

export function CompareSection({
  city,
}: {
  city?: "nairobi" | "accra";
}) {
  const cityName =
    city === "nairobi" ? "Nairobi" : city === "accra" ? "Accra" : "Nairobi or Accra";
  const localCurrency =
    city === "nairobi" ? "KES" : city === "accra" ? "GHS" : "KES / GHS";
  const rows = buildRows(cityName, localCurrency);
  return (
    <section className="section bg-cream">
      <div className="container-gs">
        <SectionHeader
          eyebrow="Compared honestly"
          title="Self-manage, local agent, or Goldstay?"
          lede={`An honest look at how the three options stack up against each other for a diaspora landlord with property in ${cityName}.`}
        />

        {/* Desktop / tablet: proper table */}
        <div className="mt-14 hidden overflow-hidden rounded-3xl border border-charcoal/10 bg-white/70 shadow-soft md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-charcoal/10 bg-cream-100/60">
                <th className="py-5 pl-6 pr-4 text-xs uppercase tracking-widest-xl text-charcoal/50 font-mono font-normal">
                  What you need
                </th>
                <th className="py-5 px-4 text-xs uppercase tracking-widest-xl text-charcoal/50 font-mono font-normal">
                  Self-managing
                </th>
                <th className="py-5 px-4 text-xs uppercase tracking-widest-xl text-charcoal/50 font-mono font-normal">
                  Local agent
                </th>
                <th className="py-5 px-4 pr-6 text-xs uppercase tracking-widest-xl font-mono font-normal text-gold-700">
                  Goldstay
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.feature}
                  className={
                    i % 2 === 0
                      ? "border-b border-charcoal/5 bg-white/30"
                      : "border-b border-charcoal/5"
                  }
                >
                  <td className="py-5 pl-6 pr-4 text-sm text-charcoal/90">
                    {r.feature}
                  </td>
                  <td className="py-5 px-4">
                    <CellBadge cell={r.self} />
                  </td>
                  <td className="py-5 px-4">
                    <CellBadge cell={r.agent} />
                  </td>
                  <td className="py-5 px-4 pr-6">
                    <CellBadge cell={r.goldstay} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked cards per feature */}
        <div className="mt-12 space-y-4 md:hidden">
          {rows.map((r, i) => (
            <Reveal key={r.feature} delay={i * 0.03}>
              <div className="rounded-2xl border border-charcoal/10 bg-white/70 p-5 shadow-soft">
                <div className="text-sm font-medium text-charcoal">
                  {r.feature}
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/50">
                      Self-manage
                    </span>
                    <CellBadge cell={r.self} />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/50">
                      Local agent
                    </span>
                    <CellBadge cell={r.agent} />
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-charcoal/5 pt-3">
                    <span className="font-mono text-[0.65rem] uppercase tracking-widest-xl text-gold-700">
                      Goldstay
                    </span>
                    <CellBadge cell={r.goldstay} />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-xs text-charcoal/55">
          A fair comparison: some landlords are genuinely better off self-managing
          or with a trusted local agent. If that&apos;s you, we&apos;ll tell you.
        </div>
      </div>
    </section>
  );
}
