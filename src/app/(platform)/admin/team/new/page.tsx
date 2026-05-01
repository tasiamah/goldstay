// /admin/team/new — invite a new operator.
//
// SUPER_ADMIN only. Renders the bare-minimum invite form; the action
// inserts the AdminUser row, mints a Supabase magic link, and
// redirects to the new admin's detail page.

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { ALL_ROLES, ROLE_LABEL } from "@/lib/admin/roles";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { inviteAdminAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function InviteAdminPage() {
  const me = await requireAdmin();
  if (me.role !== "SUPER_ADMIN") redirect("/admin");

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: "Team", href: "/admin/team" },
            { label: "Invite" },
          ]}
        />
        <h2 className="mt-2 text-xl font-medium text-stone-900">
          Invite an admin
        </h2>
        <p className="text-sm text-stone-500">
          A magic-link invite will be emailed to the address below. They get
          access the moment they click it; you can change role or country
          later from the team page.
        </p>
      </div>

      <form
        action={inviteAdminAction}
        className="space-y-4 rounded-lg border border-stone-200 bg-white p-6"
      >
        <Field label="Email" name="email">
          <input
            type="email"
            name="email"
            required
            autoComplete="off"
            className="block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            placeholder="kwame@goldstay.co.ke"
          />
        </Field>
        <Field label="Full name" name="fullName">
          <input
            type="text"
            name="fullName"
            required
            minLength={2}
            className="block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            placeholder="Kwame Mensah"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Role" name="role">
            <select
              name="role"
              defaultValue="OPS"
              className="block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Country (optional)" name="country">
            <select
              name="country"
              defaultValue=""
              className="block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            >
              <option value="">Global</option>
              <option value="KE">Kenya</option>
              <option value="GH">Ghana</option>
            </select>
          </Field>
        </div>

        <p className="text-xs text-stone-500">
          Country managers are restricted to the country selected here. All
          other roles see both countries regardless.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            Send invite
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  children,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={name} className="block">
      <span className="text-xs uppercase tracking-wider text-stone-500">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
