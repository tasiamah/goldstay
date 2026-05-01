// Permission-denied flash banner shown on the admin overview when
// requireRole bounced the user here from a route or action they
// can't access. Pure server component — reads the action key from
// the URL, maps it to a human-readable area name, and renders a
// short, neutral explanation with a "who to ask" hint.
//
// The banner is dismissed by clicking the close link, which simply
// reloads /admin with no query params. Persistent across reloads
// while the param sticks (so a refresh doesn't lose the message);
// gone the moment the operator navigates away or hits Dismiss.

import Link from "next/link";
import type { AdminAction } from "@/lib/admin/roles";

// Friendly labels for every gated action key. New entries in
// roles.ts should add a row here so denied banners stay
// recognisable instead of falling back to the raw key.
const AREA_LABEL: Partial<Record<AdminAction, string>> = {
  "admin.write": "Team management",
  "finance.read": "the Finance dashboard",
  "archive.write": "the Archive",
  "impersonate.owner": "owner impersonation",
  "import.write": "the CSV import tools",
  "property.verify": "property verification",
  "owner.write": "owner edits",
  "property.write": "property edits",
  "transaction.write": "transaction edits",
  "lease.write": "lease edits",
  "booking.write": "booking edits",
  "agreement.write": "management-agreement edits",
  "document.write": "document uploads",
  "task.write": "task edits",
  "note.write": "internal note edits",
  "comms.write": "logging communications",
  "health.read": "the Health dashboard",
};

export function PermissionDeniedBanner({
  deniedRaw,
}: {
  deniedRaw: string | string[] | undefined;
}) {
  const denied = typeof deniedRaw === "string" ? deniedRaw : null;
  if (!denied) return null;
  const area = (AREA_LABEL as Record<string, string | undefined>)[denied];

  return (
    <section
      role="status"
      className="rounded-lg border border-rose-200 bg-rose-50 p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-rose-800">
            Access denied
          </p>
          <h2 className="mt-1 text-sm font-medium text-rose-950">
            You don&rsquo;t have permission for{" "}
            {area ?? <code className="font-mono text-xs">{denied}</code>}.
          </h2>
          <p className="mt-1 text-xs text-rose-900/80">
            If you think you should have access, ask a super-admin to
            grant it from{" "}
            <span className="font-medium">/admin/team</span>. Your role
            and the action key are both shown so they can match it
            against the role matrix.
          </p>
        </div>
        <Link
          href="/admin"
          className="shrink-0 rounded-md border border-rose-300 bg-white px-3 py-1.5 text-xs font-medium text-rose-900 hover:bg-rose-100"
        >
          Dismiss
        </Link>
      </div>
    </section>
  );
}
