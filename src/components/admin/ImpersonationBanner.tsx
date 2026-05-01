// Renders at the top of every /owner/* page when an admin is
// currently impersonating an owner. Reads the cookie set by
// startImpersonationAction; absent cookie = nothing rendered.
//
// Stop-impersonating is intentionally a server action that clears
// the cookie + records an audit event before redirecting back to
// /admin. We don't sign the admin out of Supabase here because the
// magic link gave them an owner-scoped session anyway; clearing the
// cookie is enough to stop the banner from showing.

import { readImpersonationCookie } from "@/lib/admin/impersonation";
import { stopImpersonationAction } from "@/app/(platform)/admin/owners/[id]/impersonate-actions";

export async function ImpersonationBanner() {
  const cookie = await readImpersonationCookie();
  if (!cookie) return null;

  return (
    <div className="sticky top-0 z-40 -mt-10 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-b-md border-x border-b border-amber-300 bg-amber-100 px-4 py-2 text-sm text-amber-950 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-amber-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
          Impersonating
        </span>
        <span>
          Acting as <strong>{cookie.ownerLabel}</strong> · admin{" "}
          <span className="font-mono text-xs">{cookie.adminEmail}</span>
        </span>
      </div>
      <form action={stopImpersonationAction}>
        <button
          type="submit"
          className="rounded-md border border-amber-400 bg-white px-3 py-1 text-xs font-medium text-amber-900 hover:bg-amber-50"
        >
          Stop impersonating
        </button>
      </form>
    </div>
  );
}
