// /admin/health — system health dashboard.
//
// Snapshot of background jobs, iCal feed errors, recent statement
// sends, and integration configuration. Refreshed on every page
// load (no caching) because operators tend to land here when they
// want to know whether something just broke.

import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getSystemHealth } from "@/lib/admin/health";
import { formatOwnerDisplayName } from "@/lib/format-owner";
import { formatPropertyDisplayName } from "@/lib/format-property";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";

export const dynamic = "force-dynamic";

export default async function SystemHealthPage() {
  await requireAdmin();
  const health = await getSystemHealth();

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs items={[{ label: "System health" }]} />
        <h2 className="mt-2 text-xl font-medium text-stone-900">
          System health
        </h2>
        <p className="text-sm text-stone-500">
          Snapshot of background jobs, integrations and feeds. Refreshed{" "}
          {health.generatedAt.toLocaleTimeString("en-GB")}.
        </p>
      </div>

      <section className="rounded-lg border border-stone-200 bg-white p-6">
        <h3 className="text-base font-medium text-stone-900">
          Integrations
        </h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          <IntegrationStat
            label="Resend (email)"
            ok={health.resendConfigured}
            detail={
              health.resendConfigured
                ? "API key configured"
                : "RESEND_API_KEY missing"
            }
          />
          <IntegrationStat
            label="Supabase admin"
            ok={health.supabaseConfigured}
            detail={
              health.supabaseConfigured
                ? "Service key configured"
                : "Service key missing"
            }
          />
          <IntegrationStat
            label="Job recorder"
            ok={true}
            detail={`${health.jobs.length} job names · 24h`}
          />
        </ul>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-6">
        <h3 className="text-base font-medium text-stone-900">
          Background jobs (last 24h)
        </h3>
        {health.jobs.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">
            No job runs recorded in the last 24 hours.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-stone-500">
                <th className="py-2">Job</th>
                <th className="py-2 text-right">Runs</th>
                <th className="py-2 text-right">Successes</th>
                <th className="py-2 text-right">Failures</th>
                <th className="py-2">Last run</th>
              </tr>
            </thead>
            <tbody>
              {health.jobs.map((j) => {
                const last = j.lastRun;
                return (
                  <tr key={j.name} className="border-t border-stone-100">
                    <td className="py-2 font-mono text-xs text-stone-900">
                      {j.name}
                    </td>
                    <td className="py-2 text-right tabular-nums text-stone-900">
                      {j.total}
                    </td>
                    <td className="py-2 text-right tabular-nums text-emerald-700">
                      {j.successes}
                    </td>
                    <td
                      className={`py-2 text-right tabular-nums ${
                        j.failures > 0 ? "text-red-700" : "text-stone-400"
                      }`}
                    >
                      {j.failures}
                    </td>
                    <td className="py-2 text-xs text-stone-500">
                      {last ? (
                        <>
                          <span
                            className={
                              last.status === "SUCCESS"
                                ? "text-emerald-700"
                                : "text-red-700"
                            }
                          >
                            {last.status.toLowerCase()}
                          </span>{" "}
                          ·{" "}
                          {last.startedAt.toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {last.summary ? ` · ${last.summary}` : ""}
                        </>
                      ) : (
                        <span className="italic text-stone-400">
                          No runs yet
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-6">
        <h3 className="text-base font-medium text-stone-900">
          iCal feeds with errors
        </h3>
        {health.failingFeeds.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">
            No feeds reporting errors. Calendar occupancy should be in sync.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-stone-100">
            {health.failingFeeds.map((f) => (
              <li key={f.id} className="py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/admin/properties/${f.propertyId}/ical`}
                      className="text-sm font-medium text-stone-900 hover:underline"
                    >
                      {formatPropertyDisplayName(
                        f.property?.name ?? "Untitled property",
                        f.property?.unitNumber ?? null,
                      )}
                    </Link>{" "}
                    <span className="text-xs uppercase tracking-wider text-stone-500">
                      {f.source}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Last sync{" "}
                    {f.lastSyncedAt
                      ? f.lastSyncedAt.toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "never"}
                  </p>
                </div>
                <p className="mt-1 break-words rounded-md bg-red-50 px-3 py-2 text-xs text-red-900">
                  {f.lastError}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-6">
        <h3 className="text-base font-medium text-stone-900">
          Recent statement sends
        </h3>
        {health.recentSends.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">
            No statement sends recorded yet.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-stone-100">
            {health.recentSends.map((s) => (
              <li key={s.id} className="flex items-start justify-between py-3">
                <div>
                  <Link
                    href={`/admin/owners/${s.ownerId}/statement?month=${s.periodYear}-${String(s.periodMonth).padStart(2, "0")}`}
                    className="text-sm font-medium text-stone-900 hover:underline"
                  >
                    {s.owner ? formatOwnerDisplayName(s.owner) : s.ownerId}
                  </Link>
                  <p className="text-xs text-stone-500">
                    {s.periodYear}-{String(s.periodMonth).padStart(2, "0")} ·{" "}
                    {(s.sentAt ?? s.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {s.error ? ` · ${s.error.slice(0, 80)}` : ""}
                  </p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                    s.status === "SENT" || s.status === "DELIVERED"
                      ? "bg-emerald-100 text-emerald-800"
                      : s.status === "FAILED" || s.status === "BOUNCED"
                        ? "bg-red-100 text-red-800"
                        : "bg-stone-100 text-stone-700"
                  }`}
                >
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function IntegrationStat({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <li
      className={`rounded-md border p-3 ${
        ok ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
      }`}
    >
      <p className="text-xs uppercase tracking-wider text-stone-500">
        {label}
      </p>
      <p
        className={`mt-1 text-sm ${
          ok ? "text-emerald-900" : "text-amber-900"
        }`}
      >
        {ok ? "OK" : "Not configured"}
      </p>
      <p className="text-xs text-stone-500">{detail}</p>
    </li>
  );
}
