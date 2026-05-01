import { startImpersonationAction } from "@/app/(platform)/admin/owners/[id]/impersonate-actions";

// Server-rendered button bound to the impersonation server action.
// Wrapped in a form so the browser handles the POST; no client JS.

export function ImpersonateButton({ ownerId }: { ownerId: string }) {
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
