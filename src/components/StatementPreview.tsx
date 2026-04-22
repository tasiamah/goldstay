import { ArrowUpRight, FileText, ShieldCheck } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";

const rows = [
  { label: "Gross rental income", value: "$2,450.00" },
  { label: "Platform fees", value: "- $343.00", muted: true },
  { label: "Cleaning (3 turnovers)", value: "- $195.00", muted: true },
  { label: "Minor maintenance", value: "- $60.00", muted: true },
  { label: "Goldstay management fee (20%)", value: "- $490.00", muted: true },
];

const net = "$1,362.00";

export function StatementPreview({
  city,
}: {
  city?: "nairobi" | "accra";
}) {
  const cityName =
    city === "nairobi" ? "Nairobi" : city === "accra" ? "Accra" : "Nairobi";
  const neighbourhood = city === "accra" ? "East Legon" : "Westlands";
  return (
    <section className="section bg-cream">
      <div className="container-gs">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-24">
          <div>
            <SectionHeader
              eyebrow="Transparency by default"
              title="You see every number. Every month."
              lede="A clean statement, wired to your bank in USD on the 5th. No chasing. No translations. No surprises."
            />

            <ul className="mt-10 space-y-5">
              {[
                {
                  icon: FileText,
                  title: "Line-by-line breakdown",
                  body: "Gross revenue, platform fees, cleaning, maintenance, our fee and net payout. In that order.",
                },
                {
                  icon: ShieldCheck,
                  title: "Receipts attached",
                  body: "Every cost over $50 comes with a photo receipt and vendor reference.",
                },
                {
                  icon: ArrowUpRight,
                  title: "Bank wire, not promises",
                  body: "Paid on the 5th, every month. If we're a day late, you hear about it from us first.",
                },
              ].map((b, i) => (
                <Reveal key={b.title} delay={i * 0.05}>
                  <li className="flex gap-4">
                    <div className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-700">
                      <b.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-serif text-xl">{b.title}</div>
                      <p className="mt-1 text-charcoal/70">{b.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.1}>
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-6 h-64 w-64 rounded-full bg-gold-500/20 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-forest-700/20 blur-3xl"
              />

              <div className="relative overflow-hidden rounded-3xl bg-charcoal text-cream shadow-lift ring-1 ring-white/5">
                {/* Mac-style title bar */}
                <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  </div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-widest-xl text-cream/55">
                    Statement · April 2026
                  </div>
                  <div className="w-10" />
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="eyebrow text-gold-400">Property</div>
                      <div className="mt-2 font-serif text-xl text-cream">
                        {neighbourhood} 2-bed · Short-stay
                      </div>
                      <div className="font-mono text-xs text-cream/55">
                        {cityName} · Unit GS-0142
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="eyebrow text-gold-400">Occupancy</div>
                      <div className="mt-2 font-serif text-xl text-cream">78%</div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    {rows.map((r) => (
                      <div
                        key={r.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className={r.muted ? "text-cream/55" : "text-cream/85"}>
                          {r.label}
                        </span>
                        <span className={r.muted ? "text-cream/70 font-mono" : "text-cream font-mono"}>
                          {r.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="my-6 h-px w-full bg-cream/10" />

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="eyebrow text-gold-400">Net to landlord</div>
                      <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest-xl text-cream/50">
                        Wired 05 May 2026 · USD
                      </div>
                    </div>
                    <div className="font-serif text-4xl text-gold-400 sm:text-5xl">
                      {net}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-center font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/45">
                Illustrative statement preview
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
