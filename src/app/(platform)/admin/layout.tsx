import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminToaster } from "@/components/admin/Toaster";
import { ROLE_LABEL } from "@/lib/admin/roles";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Goldstay admin
          </p>
          <h1 className="mt-1 text-2xl font-serif text-stone-900">
            Operations
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {admin.fullName} · {admin.email} ·{" "}
            <span className="text-stone-700">{ROLE_LABEL[admin.role]}</span>
            {admin.country ? (
              <span className="text-stone-500"> ({admin.country})</span>
            ) : null}
          </p>
        </div>
        <AdminNav role={admin.role} />
      </header>
      {children}
      <AdminToaster />
    </div>
  );
}
