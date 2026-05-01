// CurrencyTotals — month-to-date inflow / outflow / net for every
// currency we transacted in this calendar month. We never convert
// across currencies; the operator wants to see the actual amounts
// hitting our rails, not a fictitious USD aggregation.

import type { CurrencyTotal } from "@/lib/admin/queue";

const CURRENCY_FORMATTERS = new Map<string, Intl.NumberFormat>();

function format(amount: number, currency: string): string {
  let f = CURRENCY_FORMATTERS.get(currency);
  if (!f) {
    try {
      f = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      });
    } catch {
      f = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
    }
    CURRENCY_FORMATTERS.set(currency, f);
  }
  return f.format(amount);
}

export function CurrencyTotals({
  monthLabel,
  totals,
}: {
  monthLabel: string;
  totals: CurrencyTotal[];
}) {
  return (
    <section>
      <header className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-base font-medium text-stone-900">
            Money this month
          </h2>
          <p className="text-sm text-stone-500">
            {monthLabel} · per-currency totals; we don&apos;t convert across
            currencies because rate noise hides real movements.
          </p>
        </div>
      </header>

      {totals.length === 0 ? (
        <p className="rounded-lg border border-dashed border-stone-200 bg-white p-6 text-sm text-stone-500">
          No transactions recorded this month yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {totals.map((t) => (
            <div
              key={t.currency}
              className="rounded-lg border border-stone-200 bg-white p-5"
            >
              <p className="text-xs uppercase tracking-wider text-stone-500">
                {t.currency}
              </p>
              <p className="mt-1 font-serif text-2xl text-stone-900">
                {format(t.net, t.currency)}
              </p>
              <p className="mt-1 text-xs text-stone-500">net to landlords</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-stone-500">Inflow</dt>
                  <dd className="text-stone-900">
                    {format(t.inflow, t.currency)}
                  </dd>
                </div>
                <div>
                  <dt className="text-stone-500">Outflow</dt>
                  <dd className="text-stone-900">
                    {format(t.outflow, t.currency)}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
