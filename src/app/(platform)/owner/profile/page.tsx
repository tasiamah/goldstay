// /owner/profile — legacy URL kept alive as a redirect to
// /owner/account. Personal details now live alongside KYC and
// bank account on a single Account page; this redirect keeps any
// pre-existing links and bookmarks working.

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function OwnerProfileRedirect({
  searchParams,
}: {
  searchParams?: { step?: string };
}) {
  const step = searchParams?.step ?? "details";
  redirect(
    `/owner/account?step=${encodeURIComponent(step)}#${encodeURIComponent(step)}`,
  );
}
