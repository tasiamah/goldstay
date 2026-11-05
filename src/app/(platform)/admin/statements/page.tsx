// /admin/statements — the month-end review screen.
//
// Statements are no longer emailed to landlords by the cron. It
// assembles them, emails the team a digest, and stops here: nothing
// reaches a client until somebody on this page presses send.
//
// The figures come from buildStatementReview, which calls the same
// assembleStatement the PDF and the email use, so the totals in this
// table are the totals in the document.
//
// Empty rows are called out rather than buried. A month with no
// transactions is also what a channel that has stopped reporting
// revenue looks like, and that is the case worth catching before an
// owner reads it as a quiet month.

import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { buildStatementReview } from "@/lib/statements/review";
import {
  formatPeriod,
  isValidPeriod,
  periodSlug,
  recentPeriods,
  type Period,
} from "@/lib/statements/period";
import { sendAllAction, sendOneAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminStatementsPage({
  searchParams,
}: {
  searchParams: { month?: string };
}) {
  await requireAdmin();

  const period = parseMonthParam(searchParams.month) ?? defaultPeriod();
  const review = await buildStatementReview({ prisma, period });
  const monthOptions = recentPeriods(new Date(), 12);

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs items={[{ label: "Statements" }]} />
        <h2 className="mt-2 text-xl font-medium text-stone-900">
          Statements · {formatPeriod(period)}
        </h2>
        <p className="text-sm text-stone-500">
          Nothing on this page has been sent to a client unless it says so.
          Check the figures, open a statement to see the detail, then send.
        </p>
      </div>

      <section className="flex flex-wrap items-end justify-between gap-4 rounded-lg border border-stone-200 bg-white p-4">
        <form method="get" className="flex items-end gap-3">
          <label className="text-xs uppercase tracking-wider text-stone-500">
            Period
            <select
              name="month"
              defaultValue={periodSlug(period)}
              className="mt-1 block rounded-md border border-stone-300 px-3 py-1.5 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            >
              {monthOptions.map((p) => (
                <option key={periodSlug(p)} value={periodSlug(p)}>
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

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-stone-600">
            <strong>{review.awaitingReview}</strong> ready ·{" "}
            {review.alreadySent} sent · {review.empty} empty
          </p>
          {review.awaitingReview > 0 ? (
            <form action={sendAllAction} className="inline">
              <input type="hidden" name="year" value={period.year} />
              <input type="hidden" name="month" value={period.month} />
              <button
                type="submit"
                className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
              >
                Send all {review.awaitingReview} to clients
              </button>
            </form>
          ) : null}
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-stone-500">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3 text-right">Transactions</th>
                <th className="px-4 py-3 text-right">Net</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {review.rows.map((row) => (
                <tr key={row.clientId} className="border-t border-stone-100">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/clients/${row.clientId}/statement?month=${periodSlug(period)}`}
                      className="text-stone-900 underline decoration-stone-300 hover:decoration-stone-900"
                    >
                      {row.clientName}
                    </Link>
                    <p className="text-xs text-stone-500">
                      {row.clientEmail}
                      {row.recipientCount > 1
                        ? ` and ${row.recipientCount - 1} copied`
                        : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right text-stone-700">
                    {row.transactionCount}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.totals.length === 0 ? (
                      <span className="text-stone-400">&mdash;</span>
                    ) : (
                      row.totals.map((t) => (
                        <div
                          key={t.currency}
                          className={
                            t.net >= 0 ? "text-stone-900" : "text-red-700"
                          }
                        >
                          {t.currency} {fmt(t.net)}
                        </div>
                      ))
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.alreadySent ? (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-900">
                        Sent
                        {row.sentAt
                          ? ` ${row.sentAt.toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })}`
                          : ""}
                      </span>
                    ) : row.isEmpty ? (
                      <span
                        className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900"
                        title="No transactions or bookings landed for this client in the period. Worth checking the channel is still reporting before sending."
                      >
                        Empty, check first
                      </span>
                    ) : (
                      <span className="rounded bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700">
                        Ready
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={sendOneAction.bind(null, row.clientId)}>
                      <input type="hidden" name="year" value={period.year} />
                      <input type="hidden" name="month" value={period.month} />
                      <button
                        type="submit"
                        className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-900 hover:bg-stone-50"
                      >
                        {row.alreadySent ? "Send again" : "Send"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {review.rows.length === 0 ? (
          <p className="px-4 py-6 text-sm text-stone-500">
            No clients with a live property, so there is nothing to send.
          </p>
        ) : null}
      </section>
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
