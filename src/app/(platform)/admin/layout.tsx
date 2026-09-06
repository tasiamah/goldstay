import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminToaster } from "@/components/admin/Toaster";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { ROLE_LABEL } from "@/lib/admin/roles";
import { APP_VERSION, formatBuildLabel } from "@/lib/version";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    // Tighter horizontal padding at < sm — at 390px the previous
    // `px-6 py-10` shrank the content well below 360px once the
    // border-rounded card insets were applied. Per-breakpoint pads
    // give touch screens the full visual width while keeping the
    // generous desktop frame.
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <header className="relative mb-8 flex flex-wrap items-start justify-between gap-3 border-b border-stone-200 pb-5 sm:mb-10 sm:items-center sm:gap-4 sm:pb-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Goldstay admin
          </p>
          <h1 className="mt-1 text-xl font-serif text-stone-900 sm:text-2xl">
            Operations
          </h1>
          {/* The identity strip wraps badly on narrow screens because
              the email is the longest single token. Stacking name +
              email on small viewports keeps it readable; the role
              chip stays on its own line so it's never visually
              attached to the email address. */}
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-stone-500">
            <span>{admin.fullName}</span>
            <span aria-hidden className="hidden sm:inline">
              ·
            </span>
            <span className="break-all">{admin.email}</span>
            <span aria-hidden className="hidden sm:inline">
              ·
            </span>
            <span className="text-stone-700">{ROLE_LABEL[admin.role]}</span>
            {admin.country ? (
              <span className="text-stone-500"> ({admin.country})</span>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {/* Which build you are looking at. Links to the health page,
              where the sha and environment are spelled out — an
              operator reporting a bug can read the version off any
              screen without being asked to go and find it. */}
          <Link
            href="/admin/health"
            title={`Goldstay platform ${formatBuildLabel()}`}
            className="hidden items-center rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs tabular-nums text-stone-500 hover:bg-stone-50 hover:text-stone-700 sm:inline-flex"
          >
            v{APP_VERSION}
          </Link>
          <span
            className="hidden items-center gap-1.5 rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-stone-500 lg:inline-flex"
            aria-hidden="true"
          >
            <kbd className="font-sans">⌘</kbd>
            <kbd className="font-sans">K</kbd>
            <span>to search</span>
          </span>
          <AdminNav role={admin.role} />
        </div>
      </header>
      {children}
      <AdminToaster />
      <CommandPalette />
    </div>
  );
}
