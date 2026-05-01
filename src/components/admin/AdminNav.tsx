"use client";

// Admin top-nav with active-section highlighting.
//
// Active state is computed from `usePathname()` against each link's
// `prefix` (a section is "active" if the current pathname starts
// with the prefix, with /admin being a special case so it doesn't
// light up on every sub-route). Active links get a heavier weight
// + a subtle underline; inactive ones use the muted slate that the
// rest of the admin chrome uses.
//
// The links list is colocated here rather than in the layout so a
// future admin can add a section by editing one file. New entries
// must also be allowed by the role matrix; we surface a link only
// when `visibleToRoles` is omitted or includes the current role.

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminRole } from "@prisma/client";

type NavItem = {
  href: string;
  label: string;
  // /admin is "exact" because every other admin path also starts
  // with it. Other entries match by prefix.
  exact?: boolean;
  visibleToRoles?: readonly AdminRole[];
};

const ITEMS: readonly NavItem[] = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/owners", label: "Owners" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/transactions", label: "Transactions" },
  { href: "/admin/tasks", label: "Tasks" },
  { href: "/admin/health", label: "Health" },
  { href: "/admin/archive", label: "Archive" },
  {
    href: "/admin/team",
    label: "Team",
    visibleToRoles: ["SUPER_ADMIN"],
  },
];

export function AdminNav({ role }: { role: AdminRole }) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 text-sm">
      {ITEMS.filter(
        (item) => !item.visibleToRoles || item.visibleToRoles.includes(role),
      ).map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "rounded-md bg-stone-900 px-3 py-1.5 font-medium text-white"
                : "rounded-md px-3 py-1.5 text-stone-700 hover:bg-stone-100 hover:text-stone-900"
            }
          >
            {item.label}
          </Link>
        );
      })}
      <form action="/auth/sign-out" method="post" className="ml-2">
        <button
          type="submit"
          className="rounded-md border border-stone-300 px-3 py-1.5 text-stone-700 hover:bg-white"
        >
          Sign out
        </button>
      </form>
    </nav>
  );
}

function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
