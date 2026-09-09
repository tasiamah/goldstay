// /admin/referrals/[id] — one referrer: their link, their terms, the
// landlords they introduced and the commission owed on each.
//
// The commission terms are shown resolved rather than raw, because
// what an operator needs to know is what this person actually earns,
// not whether the number came from a per-referrer override or the
// default for their type.

import Link from "next/link";
import { notFound } from "next/navigation";
import { adminCan, requireRole } from "@/lib/auth";
import { findReferrerForAdmin, suggestedTermsForReferral } from "@/lib/referrals/db";
import { listAuditFor } from "@/lib/audit";
import {
  defaultsForType,
  projectScheduleFromReferral,
  resolveTermsForReferrer,
} from "@/lib/referrals/payouts";
import { pct, shortDate, usd } from "@/lib/referrals/format";
import { site } from "@/lib/site";
import { ReferrerStatusPill, ReferrerTypePill } from "../pills";
import { ReferrerControls } from "./ReferrerControls";
import { ReferralCard } from "./ReferralCard";

export const dynamic = "force-dynamic";

export default async function ReferrerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("referral.read");
  const { id } = await params;

  const referrer = await findReferrerForAdmin(id);
  if (!referrer) notFound();

  const [canWrite, canPay, audit] = await Promise.all([
    adminCan("referral.write"),
    adminCan("referral.payout"),
    listAuditFor("REFERRER", id),
  ]);

  const terms = resolveTermsForReferrer(referrer);
  const defaults = defaultsForType(referrer.type);
  const referralUrl = `https://${site.domains.main}/list-your-property?ref=${referrer.code}`;

  // Prefill suggestions for referrals not yet signed, resolved here
  // so each card is a plain presenter. Only fetched for referrals
  // that could still be signed.
  const suggestions = Object.fromEntries(
    await Promise.all(
      referrer.referrals
        .filter((r) => r.status !== "SIGNED" && r.status !== "CHURNED" && r.status !== "REJECTED")
        .map(async (r) => [r.id, await suggestedTermsForReferral(r.id)] as const),
    ),
  );

  const paid = referrer.referrals
    .flatMap((r) => r.payouts)
    .filter((p) => p.status === "PAID")
    .reduce((s, p) => s + Number(p.amountUsd.toString()), 0);

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin/referrals"
          className="text-sm text-stone-500 underline hover:text-stone-900"
        >
          ← Referrals
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl text-stone-900">
            {referrer.fullName}
          </h1>
          <ReferrerTypePill type={referrer.type} />
          <ReferrerStatusPill status={referrer.status} />
        </div>
        <p className="mt-1 text-sm text-stone-600">
          {referrer.companyName ? `${referrer.companyName} · ` : ""}
          <a href={`mailto:${referrer.email}`} className="underline">
            {referrer.email}
          </a>
          {referrer.phone ? ` · ${referrer.phone}` : ""}
          {referrer.country ? ` · ${referrer.country}` : ""}
        </p>
        <p className="mt-1 text-xs text-stone-500">
          Joined {shortDate(referrer.createdAt)} · paid {usd(paid)} to date
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-3">
            <h2 className="font-medium text-stone-900">
              Landlords introduced
              <span className="ml-2 text-sm font-normal text-stone-500">
                {referrer.referrals.length}
              </span>
            </h2>
            {referrer.referrals.length === 0 ? (
              <p className="rounded-lg border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-600">
                Nobody yet. Their link is below — attribution happens
                automatically when a landlord submits the form through it.
              </p>
            ) : (
              referrer.referrals.map((referral) => (
                <ReferralCard
                  key={referral.id}
                  referral={referral}
                  schedule={projectScheduleFromReferral(referral, terms)}
                  suggestion={suggestions[referral.id] ?? null}
                  canWrite={canWrite}
                  canPay={canPay}
                />
              ))
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <h2 className="font-medium text-stone-900">Their link</h2>
            <p className="mt-2 break-all rounded-md bg-stone-50 p-2 font-mono text-xs text-stone-700">
              {referralUrl}
            </p>
            <p className="mt-2 text-xs text-stone-500">
              Code <span className="font-mono">{referrer.code}</span>. A
              landlord who arrives through this link is attributed for 30 days,
              {/* Stating the condition rather than leaving it implied:
                  a paused referrer's link silently stops attributing,
                  which is otherwise invisible from this screen. */}
              {referrer.status === "ACTIVE"
                ? " and the link is tracking."
                : ` but the link is not tracking while they are ${referrer.status.toLowerCase()}.`}
            </p>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <h2 className="font-medium text-stone-900">Commission</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <Row
                label="Long-term share"
                value={pct(terms.longTermPct)}
                overridden={terms.longTermPct !== defaults.longTermPct}
              />
              <Row
                label="Short-stay share"
                value={pct(terms.shortStayPct)}
                overridden={terms.shortStayPct !== defaults.shortStayPct}
              />
              <Row
                label="Paid for"
                value={`${terms.payoutMonths} month${terms.payoutMonths === 1 ? "" : "s"}`}
                overridden={terms.payoutMonths !== defaults.payoutMonths}
              />
            </dl>
            <p className="mt-3 text-xs text-stone-500">
              Of the monthly management fee, per signed landlord.
            </p>
          </section>

          {canWrite ? (
            <ReferrerControls
              referrerId={referrer.id}
              status={referrer.status}
              terms={terms}
              defaults={defaults}
              hasOverrides={{
                longTerm: referrer.longTermPctOverride !== null,
                shortStay: referrer.shortStayPctOverride !== null,
                payoutMonths: referrer.payoutMonthsOverride !== null,
              }}
            />
          ) : null}

          {audit.length > 0 ? (
            <section className="rounded-lg border border-stone-200 bg-white p-4">
              <h2 className="font-medium text-stone-900">Activity</h2>
              <ul className="mt-3 space-y-2 text-xs">
                {audit.slice(0, 12).map((e) => (
                  <li key={e.id} className="text-stone-600">
                    <span className="text-stone-900">{e.summary}</span>
                    <div className="text-stone-400">
                      {shortDate(e.createdAt)} · {e.actorEmail}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  overridden,
}: {
  label: string;
  value: string;
  overridden: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-stone-600">{label}</dt>
      <dd className="text-right text-stone-900">
        {value}
        {overridden ? (
          <span className="ml-1 text-xs text-indigo-600">custom</span>
        ) : null}
      </dd>
    </div>
  );
}
