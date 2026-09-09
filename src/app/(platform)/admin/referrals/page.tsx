// /admin/referrals — who introduces landlords to us, and what we owe them.
//
// The referral programme shipped with a public signup form, a working
// attribution cookie and a per-referrer dashboard, but nothing on the
// operator side. An agent could sign up, introduce a landlord and
// watch their dashboard, while nobody at Goldstay could see they
// existed or move the referral along. This page is the missing half.
//
// Money owed is aggregated into the list rather than left behind a
// click, because "what do we owe this person" is the question the
// page exists to answer.

import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { listPayoutsDue, listReferrersForAdmin } from "@/lib/referrals/db";
import { usd } from "@/lib/referrals/format";
import { ReferrerStatusPill, ReferrerTypePill } from "./pills";

export const dynamic = "force-dynamic";

export const metadata = { title: "Referrals" };

export default async function ReferralsPage() {
  await requireRole("referral.read");

  const [referrers, due] = await Promise.all([
    listReferrersForAdmin(),
    listPayoutsDue(),
  ]);

  const dueTotal = due.reduce(
    (sum, p) => sum + Number(p.amountUsd.toString()),
    0,
  );
  const active = referrers.filter((r) => r.status === "ACTIVE").length;
  const signedTotal = referrers.reduce((s, r) => s + r.signedCount, 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-stone-900">Referrals</h1>
          <p className="mt-1 max-w-2xl text-sm text-stone-600">
            Agents, partners and landlords who introduce property to us. Their
            commission is generated when you mark a referral signed.
          </p>
        </div>
        <Link
          href="/refer"
          className="rounded-md border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
        >
          View the public page
        </Link>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Active referrers" value={String(active)} />
        <Stat label="Landlords signed" value={String(signedTotal)} />
        <Stat
          label="Owed now"
          value={usd(dueTotal)}
          tone={dueTotal > 0 ? "warn" : undefined}
          href={due.length > 0 ? "/admin/referrals/due" : undefined}
          hint={
            due.length > 0
              ? `${due.length} payout${due.length === 1 ? "" : "s"} past their date`
              : "Nothing outstanding"
          }
        />
      </div>

      {referrers.length === 0 ? <EmptyState /> : <ReferrerTable rows={referrers} />}
    </div>
  );
}

function ReferrerTable({
  rows,
}: {
  rows: Awaited<ReturnType<typeof listReferrersForAdmin>>;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3 font-medium">Referrer</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 text-right font-medium">Referrals</th>
              <th className="px-4 py-3 text-right font-medium">Signed</th>
              <th className="px-4 py-3 text-right font-medium">Paid</th>
              <th className="px-4 py-3 text-right font-medium">Owed now</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/referrals/${r.id}`}
                    className="font-medium text-stone-900 underline decoration-stone-300 hover:decoration-stone-900"
                  >
                    {r.fullName}
                  </Link>
                  <div className="text-xs text-stone-500">
                    {r.companyName ? `${r.companyName} · ` : ""}
                    {r.email}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <ReferrerTypePill type={r.type} />
                </td>
                <td className="px-4 py-3">
                  <ReferrerStatusPill status={r.status} />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-stone-600">
                  {r.code}
                </td>
                <td className="px-4 py-3 text-right text-stone-700">
                  {r.referralCount}
                </td>
                <td className="px-4 py-3 text-right text-stone-700">
                  {r.signedCount}
                </td>
                <td className="px-4 py-3 text-right text-stone-700">
                  {usd(r.paidUsd)}
                </td>
                <td className="px-4 py-3 text-right">
                  {r.dueNowUsd > 0 ? (
                    <span className="font-medium text-amber-700">
                      {usd(r.dueNowUsd)}
                    </span>
                  ) : (
                    <span className="text-stone-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// The state this page will be in until somebody is sent the link, so
// it says what to do about that rather than just "no data".
function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
      <h2 className="font-medium text-stone-900">Nobody has signed up yet</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-stone-600">
        The programme is live at{" "}
        <Link href="/refer" className="underline">
          goldstay.co.ke/refer
        </Link>
        . Agents will not find it on their own — send it to the estate agents,
        relocation agents and building managers you already deal with.
      </p>
      <p className="mx-auto mt-3 max-w-lg text-sm text-stone-600">
        Anyone who signs up appears here with their own tracking link, and their
        introductions are attributed automatically.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  tone,
  href,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "warn";
  href?: string;
}) {
  const body = (
    <>
      <div className="text-xs uppercase tracking-wide text-stone-500">
        {label}
      </div>
      <div
        className={`mt-1 text-2xl ${tone === "warn" ? "text-amber-700" : "text-stone-900"}`}
      >
        {value}
      </div>
      {hint ? <div className="mt-1 text-xs text-stone-500">{hint}</div> : null}
    </>
  );

  const className =
    "rounded-lg border border-stone-200 bg-white p-4" +
    (href ? " block transition hover:border-stone-300 hover:bg-stone-50" : "");

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
