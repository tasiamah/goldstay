// /owner/transactions → /owner/statements
//
// The transactions ledger and the monthly statements page were
// merged into a single /owner/statements surface. We keep this
// route alive purely to forward existing bookmarks (and any
// emails / WhatsApp messages we sent linking here in the past)
// without 404'ing them.
//
// Query-param translation:
//   - period stays as-is
//   - year + month gets folded into period=YYYY-MM (the old
//     ledger accepted both shapes)
//   - propertyId and page pass through unchanged

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function OwnerTransactionsRedirect({
  searchParams,
}: {
  searchParams?: {
    period?: string;
    year?: string;
    month?: string;
    propertyId?: string;
    page?: string;
  };
}) {
  const params = new URLSearchParams();

  if (searchParams?.period) {
    params.set("period", searchParams.period);
  } else if (searchParams?.year && searchParams?.month) {
    const mm = String(Number(searchParams.month)).padStart(2, "0");
    params.set("period", `${searchParams.year}-${mm}`);
  }
  if (searchParams?.propertyId) {
    params.set("propertyId", searchParams.propertyId);
  }
  if (searchParams?.page) {
    params.set("page", searchParams.page);
  }

  const qs = params.toString();
  redirect(qs ? `/owner/statements?${qs}` : "/owner/statements");
}
