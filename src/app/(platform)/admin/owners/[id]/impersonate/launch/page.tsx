// Tiny launcher rendered after startImpersonationAction. It opens the
// Supabase magic-link URL in a new tab using window.open so popup
// blockers warn the operator instead of silently swallowing the link.
//
// Pure server component for the wrapper; the actual window.open is
// run from a small inline client island below to avoid a separate
// file for ten lines of code.

import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { ImpersonationLauncher } from "./Launcher";

export const dynamic = "force-dynamic";

export default async function ImpersonationLaunchPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { token?: string };
}) {
  await requireAdmin();
  const token = searchParams.token ?? "";

  return (
    <div className="mx-auto max-w-md rounded-lg border border-stone-200 bg-white p-8 text-center">
      <p className="text-xs uppercase tracking-wider text-amber-700">
        Impersonation
      </p>
      <h2 className="mt-2 text-xl font-medium text-stone-900">
        Opening the owner portal
      </h2>
      <p className="mt-2 text-sm text-stone-600">
        A new tab is opening with this owner&apos;s session. If your browser
        blocked the popup, click the button below.
      </p>

      {token ? <ImpersonationLauncher token={token} /> : null}

      <p className="mt-6 text-xs text-stone-500">
        Every action you take in that tab is attributed to your admin email
        in the audit log.
      </p>

      <div className="mt-6 flex items-center justify-center gap-4 text-sm">
        <Link
          href={`/admin/owners/${params.id}`}
          className="text-stone-700 underline hover:text-stone-900"
        >
          Back to owner
        </Link>
      </div>
    </div>
  );
}
