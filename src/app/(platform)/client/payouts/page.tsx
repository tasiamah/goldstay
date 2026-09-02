// /client/payouts — legacy URL kept alive as a redirect to
// /client/account, where bank account, KYC documents and personal
// details now live together. Old magic-link emails, client
// notification rows (which persisted hrefs like
// "/client/payouts?step=bank") and bookmarks all keep working.
//
// We also forward `?step=` so the destination page anchors to the
// right section.

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function ClientPayoutsRedirect({
  searchParams,
}: {
  searchParams?: { step?: string };
}) {
  const step = searchParams?.step;
  const target = step
    ? `/client/account?step=${encodeURIComponent(step)}#${encodeURIComponent(step)}`
    : "/client/account";
  redirect(target);
}
