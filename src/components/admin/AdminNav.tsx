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
// On viewports below `md` we collapse to a hamburger sheet so the
// 10+ links don't overflow the header on a phone (Operations team
// triages from the road on iPhones; the desktop strip used to push
// the Sign-out button off-screen). The sheet is just absolute-
// positioned divs with a click-outside dismiss — no library, no
// portal, keeps the bundle thin.
//
// The links list is colocated here rather than in the layout so a
// future admin can add a section by editing one file. New entries
// must also be allowed by the role matrix; we surface a link only
// when `visibleToRoles` is omitted or includes the current role.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { AdminRole } from "@prisma/client";

type NavItem = {
  href: string;
  label: string;
  // /admin is "exact" because every other admin path also starts
  // with it. Other entries match by prefix.
  exact?: boolean;
  visibleToRoles?: readonly AdminRole[];
};

// `visibleToRoles` here mirrors the permission matrix in
// `src/lib/admin/roles.ts` for the corresponding action key —
// e.g. Archive is gated to roles with `archive.write` so a SUPPORT
// hire doesn't see a tab that silently bounces them back to /admin
// when clicked. Keep the two in sync when adding actions there.
const ITEMS: readonly NavItem[] = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/owners", label: "Owners" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/leases", label: "Leases" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/transactions", label: "Transactions" },
  { href: "/admin/tasks", label: "Tasks" },
  { href: "/admin/health", label: "Health" },
  {
    href: "/admin/archive",
    label: "Archive",
    visibleToRoles: ["SUPER_ADMIN", "OPS", "COUNTRY_MANAGER"],
  },
  {
    href: "/admin/finance",
    label: "Finance",
    visibleToRoles: ["SUPER_ADMIN"],
  },
  {
    href: "/admin/team",
    label: "Team",
    visibleToRoles: ["SUPER_ADMIN"],
  },
];

export function AdminNav({ role }: { role: AdminRole }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Auto-close the sheet on route change. usePathname tells us when
  // the user actually navigates, even via Link (no full reload).
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Click-outside + Escape to dismiss the sheet. Both wired up only
  // while open so we don't leak listeners.
  useEffect(() => {
    if (!mobileOpen) return;
    function onPointer(e: PointerEvent) {
      if (!sheetRef.current) return;
      if (sheetRef.current.contains(e.target as Node)) return;
      setMobileOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const visibleItems = ITEMS.filter(
    (item) => !item.visibleToRoles || item.visibleToRoles.includes(role),
  );

  const activeItem = visibleItems.find((item) => isActive(pathname, item));

  return (
    <>
      {/* ≥ md: full inline row, unchanged from the original layout. */}
      <nav className="hidden items-center gap-1 text-sm md:flex">
        {visibleItems.map((item) => {
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

      {/* < md: hamburger button + slide-down sheet. We render the
          button always-visible at this breakpoint and let the sheet
          float underneath; the layout header is `relative` so the
          absolute-positioned sheet pins to its right edge. */}
      <div className="relative md:hidden" ref={sheetRef}>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="admin-mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
        >
          {mobileOpen ? (
            <X className="h-4 w-4" aria-hidden />
          ) : (
            <Menu className="h-4 w-4" aria-hidden />
          )}
          <span className="font-medium">
            {activeItem ? activeItem.label : "Menu"}
          </span>
        </button>

        {mobileOpen ? (
          <div
            id="admin-mobile-nav"
            role="menu"
            className="absolute right-0 z-30 mt-2 w-56 origin-top-right overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg"
          >
            <ul className="max-h-[70vh] overflow-y-auto py-1">
              {visibleItems.map((item) => {
                const active = isActive(pathname, item);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      role="menuitem"
                      aria-current={active ? "page" : undefined}
                      className={
                        active
                          ? "block bg-stone-100 px-4 py-2.5 text-sm font-medium text-stone-900"
                          : "block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li className="border-t border-stone-100">
                <form action="/auth/sign-out" method="post">
                  <button
                    type="submit"
                    className="block w-full px-4 py-2.5 text-left text-sm text-stone-700 hover:bg-stone-50"
                  >
                    Sign out
                  </button>
                </form>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </>
  );
}

function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
