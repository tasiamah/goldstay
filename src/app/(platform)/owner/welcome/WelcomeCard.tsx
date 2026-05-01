// First-login welcome panel for new landlords. Inspired by Apollo's
// "Get started" guide grid: a stack of cards explaining where the
// most useful surfaces live, plus a single one-click dismiss.
//
// Rendered conditionally from the owner dashboard:
//   - if owner.welcomeCompletedAt is null → first session, auto-show
//   - if ?welcome=1 → an existing landlord asked for a refresher
// The dismiss action only fires when the panel is shown for the
// first time; replay sessions get a "Hide tour" button that just
// strips the query param.

import Link from "next/link";
import { dismissWelcomeAction } from "./actions";

const CONTACT_EMAIL = "hello@goldstay.co.ke";

type GuideCardProps = {
  step: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  external?: boolean;
};

function GuideCard({
  step,
  title,
  description,
  href,
  cta,
  external,
}: GuideCardProps) {
  const Anchor = external ? "a" : Link;
  const linkProps = external
    ? ({ href, target: "_blank", rel: "noopener" } as const)
    : ({ href } as const);
  return (
    <Anchor
      {...linkProps}
      className="group flex h-full flex-col justify-between rounded-md border border-stone-200 bg-white p-5 transition-colors hover:border-stone-400"
    >
      <div>
        <p className="text-xs uppercase tracking-wider text-stone-400">
          {step}
        </p>
        <h3 className="mt-1 font-serif text-lg text-stone-900">{title}</h3>
        <p className="mt-2 text-sm text-stone-600">{description}</p>
      </div>
      <p className="mt-5 text-sm font-medium text-stone-900">
        {cta}
        <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </p>
    </Anchor>
  );
}

export function WelcomeCard({
  ownerFirstName,
  hasProperties,
  hasPendingAgreement,
  isReplay,
}: {
  ownerFirstName: string;
  hasProperties: boolean;
  hasPendingAgreement: boolean;
  isReplay: boolean;
}) {
  // The first card adapts to where the owner is in setup so the
  // primary CTA always advances them. We never want this panel to
  // feel like a static brochure on top of an account that already
  // has signing or activation work to do.
  const firstCard: GuideCardProps = hasPendingAgreement
    ? {
        step: "Step 1",
        title: "Sign your management agreement",
        description:
          "Goldstay has issued a 12-month management contract for your property. It takes about two minutes; statements and payouts depend on it being in place.",
        href: "/owner",
        cta: "Open the agreement",
      }
    : !hasProperties
      ? {
          step: "Step 1",
          title: "We're setting up your portfolio",
          description:
            "Your account manager is finalising paperwork and will attach your properties here within one business day. You'll get an email once they're live.",
          href: `mailto:${CONTACT_EMAIL}`,
          cta: "Email your account manager",
          external: true,
        }
      : {
          step: "Step 1",
          title: "Your portfolio",
          description:
            "Every property Goldstay manages for you. Tap into a property to see live occupancy, recent bookings, and the documents we hold for it.",
          href: "/owner",
          cta: "See your properties",
        };

  return (
    <section className="rounded-lg border border-stone-200 bg-stone-50 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-stone-500">
            {isReplay ? "Quick tour" : "Welcome to Goldstay"}
          </p>
          <h2 className="mt-1 font-serif text-2xl text-stone-900">
            {isReplay
              ? "Here's where everything lives"
              : `Welcome, ${ownerFirstName}.`}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            {isReplay
              ? "A quick refresher on the four corners of your owner portal. Hide it again whenever you're done."
              : "This is your owner portal. Goldstay handles the day-to-day; you get a single place to track how your property is performing. Here's a tour of where everything lives — it'll take less than a minute."}
          </p>
        </div>
        {isReplay ? (
          <Link
            href="/owner"
            className="shrink-0 rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-white"
          >
            Hide tour
          </Link>
        ) : (
          <form action={dismissWelcomeAction}>
            <button
              type="submit"
              className="shrink-0 rounded-md bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800"
            >
              Got it, hide this
            </button>
          </form>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <GuideCard {...firstCard} />
        <GuideCard
          step="Step 2"
          title="Your monthly statement"
          description="A signed PDF on the 5th of every month showing rent collected, expenses paid on your behalf, Goldstay's commission, and your net payout. All historical statements stay here."
          href="/owner/statements"
          cta="Open statements"
        />
        <GuideCard
          step="Step 3"
          title="Every transaction, line by line"
          description="The numbers behind your statement: every rent payment, expense, refund, and payout. Filterable by property and month, exportable on request."
          href="/owner/transactions"
          cta="Browse transactions"
        />
        <GuideCard
          step="Step 4"
          title="Talk to your account manager"
          description="Email is the fastest channel for anything portfolio-related — agreements, owner instructions, payout queries. We reply within one business day."
          href={`mailto:${CONTACT_EMAIL}`}
          cta={`Email ${CONTACT_EMAIL}`}
          external
        />
      </div>

      {!isReplay ? (
        <p className="mt-5 text-xs text-stone-500">
          You can replay this tour any time from the &ldquo;Take the
          tour&rdquo; link at the bottom of your dashboard.
        </p>
      ) : null}
    </section>
  );
}
