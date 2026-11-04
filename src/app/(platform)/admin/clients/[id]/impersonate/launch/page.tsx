// Landing page after startImpersonationAction. Renders the minted
// magic link as an ordinary anchor for the admin to click.
//
// It used to open the link itself, from a useEffect on mount. That
// needs transient user activation: a budget of a few seconds that
// starts when the admin clicks "Open as client" and is spent by the
// time the action has done three database round trips and a Supabase
// generateLink call. When that was quick the tab opened; when it was
// not, the browser blocked it with no dialog and the admin reported
// that clicking impersonate did nothing. The audit log shows the
// shape of it clearly, the same admin starting two impersonations a
// minute apart and then giving up.
//
// The blocked-popup detection could not have caught it either:
// window.open returns null whenever "noopener" is in the feature
// string, so the warning fired on success as well.
//
// Opening from the admin's own click has no activation budget to run
// out of, so it works every time.

import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

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
        Ready to open the client portal
      </h2>

      {token ? (
        <>
          <p className="mt-2 text-sm text-stone-600">
            The sign-in link is ready. It can only be used once, so open it
            from the button below rather than reloading this page.
          </p>

          <a
            href={token}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            Open client portal
          </a>

          {/* The portal tab signs this browser in as the client, and
              Supabase keeps one session per domain, so it replaces the
              admin session in every tab rather than sitting alongside
              it. Saying so here because the surprise otherwise lands
              later, as an admin page that has quietly become a login
              screen. */}
          <p className="mt-5 rounded-md bg-amber-50 px-3 py-2 text-left text-xs text-amber-900">
            <strong>This signs you out of the admin.</strong> The new tab takes
            over your session for this browser, so you will need to sign in
            again afterwards. To keep the admin signed in, copy the link
            instead (right click the button) and open it in a private window.
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-stone-600">
          This link has no sign-in token attached, which usually means the page
          was reloaded or opened from history. Go back to the client and press
          &ldquo;Open as client&rdquo; again to mint a fresh one.
        </p>
      )}

      <p className="mt-6 text-xs text-stone-500">
        Every action you take in that tab is attributed to your admin email in
        the audit log.
      </p>

      <div className="mt-6 flex items-center justify-center gap-4 text-sm">
        <Link
          href={`/admin/clients/${params.id}`}
          className="text-stone-700 underline hover:text-stone-900"
        >
          Back to client
        </Link>
      </div>
    </div>
  );
}
