import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { alternateLanguagesFor, site, waLink } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";
import { defaultsForType } from "@/lib/referrals/payouts";

// Public landing page for the referral programme. Three audiences in
// one page — landlords, agents, partners — because separating them
// out felt over-engineered for the volume we expect; if conversion
// data later shows the agent-tier needs its own URL we'll split.

export function generateMetadata(): Metadata {
  return {
    title: "Earn with Goldstay: Referral Programme",
    description:
      "Refer landlords to Goldstay and earn a share of the management fee for the next 12 months. For agents, brokers and existing landlords.",
    alternates: {
      canonical: "/refer",
      languages: alternateLanguagesFor("/refer"),
    },
  };
}

const agent = defaultsForType("AGENT");
const landlord = defaultsForType("LANDLORD");

export default function Page() {
  const city = getServerCity();

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <div className="absolute inset-0 -z-10 grain opacity-40" />
        <div className="container-gs pb-12 md:pb-20">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">
                Goldstay Partners
              </div>
              <h1 className="mt-6 font-serif text-display-lg balance">
                Send us a landlord.{" "}
                <em className="italic">Earn for a year.</em>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/75 pretty md:text-xl">
                Most diaspora landlords find their property manager through a
                trusted introduction, not a Google ad. If you&rsquo;re an
                agent, broker, or already work with us, refer a landlord and
                we&rsquo;ll pay you a recurring share of every monthly
                management fee for {agent.payoutMonths} months.
              </p>
              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link href="/refer/signup" className="btn-primary">
                  Join the programme
                </Link>
                <a
                  href={waLink(
                    "Hi Goldstay, I'd like to discuss the referral programme.",
                    city ?? undefined,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-light"
                >
                  Talk to us first →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-16 md:py-24">
        <div className="container-gs">
          <Reveal>
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
              How it pays
            </h2>
            <p className="mt-3 max-w-2xl text-stone-600">
              Two tracks. Pick whichever fits how you reach landlords.
              Conservative defaults; ops can negotiate up for serious volume.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Tier
              type="Agent or broker"
              headline={`${pct(agent.longTermPct)} of every monthly fee`}
              duration={`for ${agent.payoutMonths} months`}
              detail={[
                `Long-term landlord: ${pct(agent.longTermPct)} of monthly management fee, paid every month for ${agent.payoutMonths} months.`,
                `Short-stay landlord: ${pct(agent.shortStayPct)} of monthly revenue share, paid every month for ${agent.payoutMonths} months.`,
                `Worked example: a $1,500/mo unit at our 10% fee earns you $${(1500 * 0.1 * agent.longTermPct).toFixed(2)} every month, or ${(1500 * 0.1 * agent.longTermPct * agent.payoutMonths).toFixed(0)} dollars over the first year.`,
              ]}
              cta="Apply as an agent"
              ctaHref="/refer/signup?type=AGENT"
            />
            <Tier
              type="Existing or past landlord"
              headline={`${pct(landlord.longTermPct)} of one month's fee`}
              duration="paid once"
              detail={[
                `Long-term: ${pct(landlord.longTermPct)} of one month's management fee on every landlord you sign.`,
                `Short-stay: ${pct(landlord.shortStayPct)} of one month's revenue share on every landlord you sign.`,
                `Paid as a one-off thank-you 30 days after the landlord's first rent collection, in USD or local currency.`,
              ]}
              cta="Refer another landlord"
              ctaHref="/refer/signup?type=LANDLORD"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-gs">
          <Reveal>
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
              How it works
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            <Step
              n="01"
              title="Sign up in two minutes"
              body="Tell us who you are and how to pay you. We email you a tracking link and a private dashboard URL."
            />
            <Step
              n="02"
              title="Send us landlords"
              body="Share your link, or submit landlords directly from your dashboard. Either way, we credit you the moment it&rsquo;s tracked."
            />
            <Step
              n="03"
              title="Get paid monthly"
              body="Once the landlord signs and rent collects, your earnings appear in your dashboard. Wired on the 5th of each month."
            />
          </ol>
        </div>
      </section>

      <section className="bg-cream-100 py-16 md:py-24">
        <div className="container-gs">
          <Reveal>
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
              The fine print, in plain English
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Note
              title="Attribution lasts 90 days"
              body="When a landlord clicks your link, you&rsquo;re credited for any signup in the next 90 days. First click wins; we don&rsquo;t play attribution games."
            />
            <Note
              title="Paid only on real revenue"
              body="No payout for leads that don&rsquo;t sign or for periods the landlord didn&rsquo;t pay. Same accountability we hold ourselves to."
            />
            <Note
              title="No double-dipping"
              body="If you&rsquo;re already the landlord&rsquo;s local agent, you can refer them, but you can&rsquo;t also charge them a fee for the same management we&rsquo;re providing."
            />
            <Note
              title="Transparent dashboard"
              body="Every referral, every status change, every scheduled payout is visible to you in real time at your dashboard URL. We don&rsquo;t hide anything."
            />
          </div>

          <Reveal>
            <div className="mt-16 rounded-2xl bg-forest p-8 text-cream md:p-12">
              <h2 className="font-serif text-2xl md:text-3xl">
                Ready to start?
              </h2>
              <p className="mt-2 max-w-2xl text-cream/85">
                Sign up and your dashboard is live in under two minutes. The
                first payout lands the month after your first landlord signs.
              </p>
              <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link href="/refer/signup" className="btn-primary">
                  Join the programme
                </Link>
                <a
                  href={`mailto:${site.email}?subject=Goldstay%20referral%20programme`}
                  className="btn-ghost-light"
                >
                  Email us first →
                </a>
              </div>
              <p className="mt-4 text-xs text-cream/60">
                Goldstay · A TADCO Company · {site.email}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function pct(p: number) {
  return `${Math.round(p * 100)}%`;
}

function Tier({
  type,
  headline,
  duration,
  detail,
  cta,
  ctaHref,
}: {
  type: string;
  headline: string;
  duration: string;
  detail: string[];
  cta: string;
  ctaHref: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-soft">
      <div className="eyebrow text-gold-600">{type}</div>
      <div className="mt-3 font-serif text-2xl text-charcoal md:text-3xl">
        {headline}
      </div>
      <div className="text-sm uppercase tracking-wider text-stone-500">
        {duration}
      </div>
      <ul className="mt-5 space-y-2 text-sm text-stone-700">
        {detail.map((d) => (
          <li key={d} className="flex gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
            <span>{d}</span>
          </li>
        ))}
      </ul>
      <Link href={ctaHref} className="btn-primary mt-7 inline-flex">
        {cta}
      </Link>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="rounded-xl bg-cream-100 p-6">
      <div className="font-serif text-3xl text-gold-600">{n}</div>
      <div className="mt-2 font-serif text-lg text-charcoal">{title}</div>
      <p className="mt-2 text-sm text-stone-600">{body}</p>
    </li>
  );
}

function Note({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-soft">
      <div className="font-serif text-lg text-charcoal">{title}</div>
      <p className="mt-2 text-sm text-stone-600">{body}</p>
    </div>
  );
}
