// /client/profile — legacy URL kept alive as a redirect to
// /client/account. Personal details now live alongside KYC and
// bank account on a single Account page; this redirect keeps any
// pre-existing links and bookmarks working.

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function ClientProfileRedirect({
  searchParams,
}: {
  searchParams?: { step?: string };
}) {
  const step = searchParams?.step ?? "details";
  redirect(
    `/client/account?step=${encodeURIComponent(step)}#${encodeURIComponent(step)}`,
  );
}
