// Admin statement preview.
//
// Mirrors the data the owner sees on /owner/statements/[year]/[month]
// (which is the PDF route), but rendered as HTML so an operator can
// scan it without downloading. Includes:
//
//   - month picker (?month=YYYY-MM) with the last 12 periods
//   - per-currency totals + per-property breakdown
//   - "Download PDF" link (proxies to the owner PDF route)
//   - "Send to landlord" button that calls sendStatementForOwner
//
// We never send PDFs unless the operator explicitly clicks the send
// button — accidentally clicking around shouldn't email anyone.

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { formatOwnerDisplayName } from "@/lib/format-owner";
import { buildStatement } from "@/lib/statements/aggregate";
import {
  formatPeriod,
  isValidPeriod,
  periodRange,
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

  const owner = await prisma.owner.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      email: true,
      fullName: true,
      companyName: true,
      preferredCurrency: true,
    },
  });
  if (!owner) notFound();

  const period = parseMonthParam(searchParams.month) ?? defaultPeriod();
  const { start, end } = periodRange(period);

  const transactions = await prisma.transaction.findMany({
    where: {
      occurredOn: { gte: start, lt: end },
      property: { ownerId: owner.id },
      archivedAt: null,
    },
    include: {
      property: { select: { id: true, name: true } },
      lease: { select: { id: true, tenantName: true } },
    },
    orderBy: { occurredOn: "asc" },
  });

  const statement = buildStatement(
    transactions.map((t) => ({
      id: t.id,
      occurredOn: t.occurredOn,
      type: t.type,
      direction: t.direction,
      amount: t.amount.toString(),
      currency: t.currency,
      description: t.description,
      reference: t.reference,
      propertyId: t.propertyId,
      propertyName: t.property.name,
      leaseId: t.leaseId,
      tenantName: t.lease?.tenantName ?? null,
    })),
    { preferredCurrency: owner.preferredCurrency },
  );

  const monthOptions = recentPeriods(new Date(), 12);
  const lastSend = await prisma.statementSend.findFirst({
    where: {
      ownerId: owner.id,
      periodYear: period.year,
      periodMonth: period.month,
    },
    orderBy: { createdAt: "desc" },
  });

  const sendBound = sendStatementAction.bind(null, owner.id);

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: "Owners", href: "/admin/owners" },
            {
              label: formatOwnerDisplayName(owner),
              href: `/admin/owners/${owner.id}`,
            },
            { label: "Statement preview" },
          ]}
        />
        <h2 className="mt-2 text-xl font-medium text-stone-900">
          Statement preview · {formatOwnerDisplayName(owner)}
        </h2>
        <p className="text-sm text-stone-500">
          Same numbers your owner sees in their portal and PDF. Use the picker
          to step through previous months.
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
            href={`/owner/statements/${period.year}/${period.month}`}
            target="_blank"
            rel="noopener"
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-900 hover:bg-stone-50"
          >
            Download PDF
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
          <table className="mt-3 w-full text-sm tabular-nums">
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
        )}
      </section>

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
          <table className="mt-3 w-full text-sm tabular-nums">
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
                    {t.description || t.tenantName || t.reference || "—"}
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
