import { startImpersonationAction } from "@/app/(platform)/admin/owners/[id]/impersonate-actions";
import { adminCan } from "@/lib/auth";

// Server-rendered button bound to the impersonation server action.
// Wrapped in a form so the browser handles the POST; no client JS.
//
// We gate the render on `adminCan("impersonate.owner")` so SUPPORT
// and ACCOUNTING — who lack the permission per the role matrix —
// don't see a button that would throw on submit. The action
// itself also calls requireRole, so even a hand-crafted POST is
// rejected. UI gate is the friendlier failure mode.

export async function ImpersonateButton({ ownerId }: { ownerId: string }) {
  const allowed = await adminCan("impersonate.owner");
  if (!allowed) return null;

  const action = startImpersonationAction.bind(null, ownerId);
  return (
    <form action={action} className="inline">
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100"
      >
        Open as owner
      </button>
    </form>
  );
}
