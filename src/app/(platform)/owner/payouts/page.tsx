// /owner/payouts — legacy URL kept alive as a redirect to
// /owner/account, where bank account, KYC documents and personal
// details now live together. Old magic-link emails, owner
// notification rows (which persisted hrefs like
// "/owner/payouts?step=bank") and bookmarks all keep working.
//
// We also forward `?step=` so the destination page anchors to the
// right section.

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function OwnerPayoutsRedirect({
  searchParams,
}: {
  searchParams?: { step?: string };
}) {
  const step = searchParams?.step;
  const target = step
    ? `/owner/account?step=${encodeURIComponent(step)}#${encodeURIComponent(step)}`
    : "/owner/account";
  redirect(target);
}
