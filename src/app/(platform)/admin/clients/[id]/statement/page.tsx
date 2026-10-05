// Admin statement preview: the screen for checking a statement is
// right before anybody receives it.
//
// Every number here comes from assembleStatement, which is also what
// renders the PDF and what the monthly email sends. That shared call
// is load-bearing rather than tidiness: this page used to run its own
// query that filtered archived transactions while the PDF paths did
// not, and it never loaded bookings at all, so the short-stay half of
// a short-let statement had nothing to check it against. A preview
// that disagrees with the document is worse than no preview.
//
//   - month picker (?month=YYYY-MM) with the last 12 periods
//   - per-currency totals, short-stay rollup, per-property ledger
//   - "Open PDF" renders this client's PDF via the sibling pdf route
//   - "Send to landlord" button that calls sendStatementForClient
//
// We never send PDFs unless the operator explicitly clicks the send
// button — accidentally clicking around shouldn't email anyone.

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { formatClientDisplayName } from "@/lib/format-client";
import { assembleStatement } from "@/lib/statements/assemble";
import {
  formatPeriod,
  isValidPeriod,
  recentPeriods,
  type Period,
} from "@/lib/statements/period";
import { sendStatementAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminStatementPreviewPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { month?: string };
}) {
  await requireAdmin();

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      email: true,
      fullName: true,
      companyName: true,
      preferredCurrency: true,
    },
  });
  if (!client) notFound();

  const period = parseMonthParam(searchParams.month) ?? defaultPeriod();

  // Same function the PDF and the emailed statement use, so what an
  // operator signs off on here is the arithmetic the client receives.
  const { statement, shortTerm } = await assembleStatement({
    prisma,
    client,
    period,
  });

  const monthOptions = recentPeriods(new Date(), 12);
  const lastSend = await prisma.statementSend.findFirst({
    where: {
      clientId: client.id,
      periodYear: period.year,
      periodMonth: period.month,
    },
    orderBy: { createdAt: "desc" },
  });

  const sendBound = sendStatementAction.bind(null, client.id);

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: "Clients", href: "/admin/clients" },
            {
              label: formatClientDisplayName(client),
              href: `/admin/clients/${client.id}`,
            },
            { label: "Statement preview" },
          ]}
        />
        <h2 className="mt-2 text-xl font-medium text-stone-900">
          Statement preview · {formatClientDisplayName(client)}
        </h2>
        <p className="text-sm text-stone-500">
          Built by the same code as the PDF and the monthly email, so
          what you check here is what the client receives. Archived
          transactions are excluded from all three. Use the picker to
          step through previous months.
        </p>
      </div>

      <section className="flex flex-wrap items-end justify-between gap-4 rounded-lg border border-stone-200 bg-white p-4">
        <form
          method="get"
          className="flex items-end gap-3"
        >
          <label className="text-xs uppercase tracking-wider text-stone-500">
            Period
            <select
              name="month"
              defaultValue={`${period.year}-${String(period.month).padStart(2, "0")}`}
              className="mt-1 block rounded-md border border-stone-300 px-3 py-1.5 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            >
              {monthOptions.map((p) => (
                <option
                  key={`${p.year}-${p.month}`}
                  value={`${p.year}-${String(p.month).padStart(2, "0")}`}
                >
                  {formatPeriod(p)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-900 hover:bg-stone-50"
          >
            Load
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/clients/${client.id}/statement/pdf?month=${
              period.year
            }-${String(period.month).padStart(2, "0")}`}
            target="_blank"
            rel="noopener"
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-900 hover:bg-stone-50"
          >
            Open PDF
          </Link>
          <form action={sendBound} className="inline">
            <input type="hidden" name="year" value={period.year} />
            <input type="hidden" name="month" value={period.month} />
            <button
              type="submit"
              className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
            >
              Send to landlord
            </button>
          </form>
        </div>
      </section>

      {lastSend ? (
        <p className="rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-xs text-stone-600">
          Last send: <strong>{lastSend.status}</strong> on{" "}
          {(lastSend.sentAt ?? lastSend.updatedAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
          {lastSend.error ? ` · ${lastSend.error.slice(0, 120)}` : ""}
        </p>
      ) : null}

      <section className="rounded-lg border border-stone-200 bg-white p-6">
        <h3 className="text-base font-medium text-stone-900">
          {formatPeriod(period)} · totals
        </h3>
        {statement.totalsByCurrency.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">
            No transactions recorded for this period.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-stone-500">
                <th className="py-2">Currency</th>
                <th className="py-2 text-right">Inflow</th>
                <th className="py-2 text-right">Outflow</th>
                <th className="py-2 text-right">Net</th>
              </tr>
            </thead>
            <tbody>
              {statement.totalsByCurrency.map((t) => (
                <tr key={t.currency} className="border-t border-stone-100">
                  <td className="py-2 text-stone-900">{t.currency}</td>
                  <td className="py-2 text-right text-stone-900">
                    {fmt(t.inflow)}
                  </td>
                  <td className="py-2 text-right text-stone-900">
                    {fmt(t.outflow)}
                  </td>
                  <td
                    className={`py-2 text-right ${
                      t.net >= 0 ? "text-stone-900" : "text-red-700"
                    }`}
                  >
                    {fmt(t.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </section>

      {shortTerm.length > 0 ? (
        <section className="rounded-lg border border-stone-200 bg-white p-6">
          <h3 className="text-base font-medium text-stone-900">
            Short stays
          </h3>
          <p className="mt-1 text-xs text-stone-500">
            Nights are clipped to this period. Gross and fees stay with
            the period the stay belongs to, so the figure matches the
            bank rather than the calendar.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm tabular-nums">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-stone-500">
                  <th className="py-2">Property</th>
                  <th className="py-2 text-right">Stays</th>
                  <th className="py-2 text-right">Nights</th>
                  <th className="py-2 text-right">Gross</th>
                  <th className="py-2 text-right">OTA fees</th>
                  <th className="py-2 text-right">Cleaning</th>
                  <th className="py-2 text-right">Goldstay</th>
                  <th className="py-2 text-right">Payout</th>
                  <th className="py-2">Currency</th>
                </tr>
              </thead>
              <tbody>
                {shortTerm.map((row) => (
                  <tr
                    key={`${row.propertyId}-${row.currency}`}
                    className="border-t border-stone-100"
                  >
                    <td className="py-2 text-stone-900">{row.propertyName}</td>
                    <td className="py-2 text-right text-stone-700">
                      {row.bookings}
                    </td>
                    <td className="py-2 text-right text-stone-700">
                      {row.nights}
                    </td>
                    <td className="py-2 text-right text-stone-900">
                      {fmt(row.gross)}
                    </td>
                    <td className="py-2 text-right text-red-700">
                      {row.otaFees ? `-${fmt(row.otaFees)}` : fmt(0)}
                    </td>
                    <td className="py-2 text-right text-red-700">
                      {row.cleaning ? `-${fmt(row.cleaning)}` : fmt(0)}
                    </td>
                    <td className="py-2 text-right text-red-700">
                      {row.goldstayCommission
                        ? `-${fmt(row.goldstayCommission)}`
                        : fmt(0)}
                    </td>
                    <td className="py-2 text-right font-medium text-stone-900">
                      {fmt(row.payout)}
                    </td>
                    <td className="py-2 text-xs text-stone-500">
                      {row.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {statement.propertyGroups.map((group) => (
        <section
          key={group.propertyId}
          className="rounded-lg border border-stone-200 bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-stone-900">
              {group.propertyName}
            </h3>
            <p className="text-xs text-stone-500">
              {group.transactions.length}{" "}
              {group.transactions.length === 1 ? "transaction" : "transactions"}
            </p>
          </div>
          <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-stone-500">
                <th className="py-2">Date</th>
                <th className="py-2">Description</th>
                <th className="py-2">Type</th>
                <th className="py-2 text-right">Amount</th>
                <th className="py-2">Currency</th>
              </tr>
            </thead>
            <tbody>
              {group.transactions.map((t) => (
                <tr key={t.id} className="border-t border-stone-100">
                  <td className="py-2 text-stone-700">
                    {t.occurredOn.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </td>
                  <td className="py-2 text-stone-900">
                    {t.description || t.tenantName || t.reference || (
                      <span className="italic text-stone-400">No description</span>
                    )}
                  </td>
                  <td className="py-2 text-xs uppercase tracking-wider text-stone-500">
                    {t.type}
                  </td>
                  <td
                    className={`py-2 text-right ${
                      t.direction === "INFLOW"
                        ? "text-stone-900"
                        : "text-red-700"
                    }`}
                  >
                    {t.direction === "INFLOW" ? "" : "-"}
                    {fmt(Number(t.amount))}
                  </td>
                  <td className="py-2 text-xs text-stone-500">{t.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </section>
      ))}
    </div>
  );
}

function fmt(n: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function defaultPeriod(): Period {
  const now = new Date();
  // Default to previous month — that's the one operators usually want
  // to look at when reviewing what we just billed.
  if (now.getUTCMonth() === 0) {
    return { year: now.getUTCFullYear() - 1, month: 12 };
  }
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() };
}

function parseMonthParam(raw: string | undefined): Period | null {
  if (!raw) return null;
  const m = /^(\d{4})-(\d{1,2})$/.exec(raw);
  if (!m) return null;
  const period = { year: Number(m[1]), month: Number(m[2]) };
  return isValidPeriod(period) ? period : null;
}
