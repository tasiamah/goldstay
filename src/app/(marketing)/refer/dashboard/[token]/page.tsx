import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";
import {
  findReferrerByDashboardToken,
  summariseReferrer,
} from "@/lib/referrals/db";
import { resolveTermsForReferrer } from "@/lib/referrals/payouts";
import { SubmitReferralForm } from "./SubmitReferralForm";

// Private dashboard for a single referrer. The token in the URL is
// the only credential; whoever holds it sees this page. The route is
// not indexed (noindex meta below) so a leaked URL doesn't show up
// in Google.

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return {
    title: "Goldstay Partner Dashboard",
    robots: { index: false, follow: false },
  };
}

const STATUS_COPY: Record<string, string> = {
  ATTRIBUTED: "Tracked",
  CONTACTED: "Ops in touch",
  QUALIFIED: "Qualified",
  SIGNED: "Signed",
  CHURNED: "Churned",
  REJECTED: "Closed",
};

const STATUS_TONE: Record<string, string> = {
  ATTRIBUTED: "bg-stone-100 text-stone-700",
  CONTACTED: "bg-amber-50 text-amber-800",
  QUALIFIED: "bg-amber-50 text-amber-800",
  SIGNED: "bg-emerald-50 text-emerald-800",
  CHURNED: "bg-stone-100 text-stone-500",
  REJECTED: "bg-stone-100 text-stone-500",
};

export default async function Page({
  params,
}: {
  params: { token: string };
}) {
  const referrer = await findReferrerByDashboardToken(params.token);
  if (!referrer) notFound();
  if (referrer.status === "TERMINATED") notFound();

  const summary = summariseReferrer(referrer);
  const terms = resolveTermsForReferrer(referrer);
  const referralUrl = `https://${site.domains.main}/list-your-property?ref=${referrer.code}`;

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-36">
        <div className="absolute inset-0 -z-10 grain opacity-40" />
        <div className="container-gs pb-12">
          <Reveal>
            <div className="eyebrow text-gold-400">Partner dashboard</div>
            <h1 className="mt-4 font-serif text-display-md balance">
              Hi {referrer.fullName.split(" ")[0]}
            </h1>
            <p className="mt-3 max-w-2xl text-cream/75">
              Your referral link, your earnings, and a direct line to submit a
              landlord. Bookmark this page &mdash; it&rsquo;s the only way back
              in.
            </p>

            {referrer.status === "PAUSED" && (
              <div className="mt-6 rounded-lg bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                Your account is paused while ops finalises payout details. New
                referrals are still tracked; payouts will release once
                we&rsquo;re cleared. Email{" "}
                <a
                  className="underline"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </a>{" "}
                if you&rsquo;re unsure why.
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-12 md:py-16">
        <div className="container-gs">
          <div className="grid gap-4 md:grid-cols-4">
            <Stat
              label="Tracked landlords"
              value={String(summary.counts.attributed + summary.counts.contacted)}
            />
            <Stat label="Signed" value={String(summary.counts.signed)} />
            <Stat
              label="Earned (paid)"
              value={`$${summary.lifetimeEarnedUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
            <Stat
              label="Scheduled"
              value={`$${summary.scheduledUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-soft lg:col-span-2">
              <h2 className="font-serif text-xl text-charcoal">
                Your referral link
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                Anyone who fills in our landlord form within 90 days of
                clicking this link is credited to you.
              </p>
              <code className="mt-4 block break-all rounded-md bg-cream-100 px-3 py-2 font-mono text-xs text-charcoal">
                {referralUrl}
              </code>
              <p className="mt-3 text-xs text-stone-500">
                Code: <span className="font-mono">{referrer.code}</span>
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-soft">
              <h2 className="font-serif text-xl text-charcoal">Your terms</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-stone-700">
                <li>
                  Long-term:{" "}
                  <strong>{Math.round(terms.longTermPct * 100)}%</strong> of
                  monthly fee
                </li>
                <li>
                  Short-stay:{" "}
                  <strong>{Math.round(terms.shortStayPct * 100)}%</strong> of
                  monthly fee
                </li>
                <li>
                  Duration: <strong>{terms.payoutMonths}</strong> month
                  {terms.payoutMonths === 1 ? "" : "s"} per landlord
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-soft">
              <h2 className="font-serif text-xl text-charcoal">
                Submit a landlord directly
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                Best when you already have the conversation. We&rsquo;ll take
                it from here and credit you the moment they&rsquo;re in our
                pipeline.
              </p>
              <div className="mt-4">
                <SubmitReferralForm token={referrer.dashboardToken} />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-soft">
              <h2 className="font-serif text-xl text-charcoal">
                Your referrals
              </h2>
              {referrer.referrals.length === 0 ? (
                <p className="mt-3 text-sm text-stone-500">
                  No referrals yet. Share your link or submit a landlord using
                  the form on the left.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-stone-100">
                  {referrer.referrals.map((r) => {
                    const earned = r.payouts
                      .filter((p) => p.status === "PAID")
                      .reduce(
                        (acc, p) => acc + Number(p.amountUsd.toString()),
                        0,
                      );
                    return (
                      <li key={r.id} className="grid gap-1 py-3 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium text-charcoal">
                            {r.landlordName}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_TONE[r.status] ?? "bg-stone-100 text-stone-700"}`}
                          >
                            {STATUS_COPY[r.status] ?? r.status}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500">
                          {[r.city, r.landlordEmail || r.landlordPhone, formatDate(r.createdAt)]
                            .filter(Boolean)
                            .join(" · ")}
                        </div>
                        {earned > 0 && (
                          <div className="text-xs text-emerald-700">
                            Paid so far: $
                            {earned.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-10 rounded-2xl bg-forest p-6 text-cream md:p-8">
            <h2 className="font-serif text-xl">Need help?</h2>
            <p className="mt-2 text-sm text-cream/85">
              Email{" "}
              <a className="underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>{" "}
              or read{" "}
              <Link href="/refer" className="underline">
                how the programme works
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-soft">
      <div className="text-xs uppercase tracking-wider text-stone-500">
        {label}
      </div>
      <div className="mt-1 font-serif text-2xl text-charcoal">{value}</div>
    </div>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
