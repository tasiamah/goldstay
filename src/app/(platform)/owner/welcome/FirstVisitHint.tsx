// Tiny one-line banner shown on a landlord's first ever visit to
// the owner portal. Replaces the previous full-page "tour" card;
// the actual explanations now live in <HelpHint> popovers next to
// each section heading, so this banner only has to point the eye
// at the new affordance.
//
// Dismissed via the existing dismissWelcomeAction, which flips
// owner.welcomeCompletedAt — once set, this banner is gone for
// good and the per-section ? hints take over.

import { dismissWelcomeAction } from "./actions";

export function FirstVisitHint({
  ownerFirstName,
  hasPendingAgreement,
}: {
  ownerFirstName: string;
  hasPendingAgreement: boolean;
}) {
  // If they have an agreement to sign, the amber action banner
  // immediately below already steals the eye — don't compete with it.
  // We still render but with quieter copy that defers to the action.
  const message = hasPendingAgreement
    ? `Welcome, ${ownerFirstName}. Sign your agreement first; once that's done, the ? icons next to each section explain what you're looking at.`
    : `Welcome, ${ownerFirstName}. Click the ? icons next to each section heading to learn what it shows — they stay there for whenever you want a refresher.`;

  return (
    <section className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700">
      <p className="min-w-0 flex-1">
        <span aria-hidden="true" className="mr-1.5">
          👋
        </span>
        {message}
      </p>
      <form action={dismissWelcomeAction} className="shrink-0">
        <button
          type="submit"
          className="rounded-md border border-stone-300 px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-white"
        >
          Got it
        </button>
      </form>
    </section>
  );
}
