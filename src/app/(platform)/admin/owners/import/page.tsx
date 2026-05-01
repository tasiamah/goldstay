// /admin/owners/import — drop a CSV, see a preview with per-row
// validation, then click apply to create rows. We intentionally keep
// the upload + preview + apply as three separate operator steps:
// silent batch creation makes data quality issues invisible.

import { requireRole } from "@/lib/auth";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { ImportClient } from "./ImportClient";

export const dynamic = "force-dynamic";

const SAMPLE = `fullName,email,country,companyName,phone,preferredCurrency
Asha Kimani,asha@example.com,KE,Pinetree Holdings,+254700000000,KES
Kwame Mensah,kwame@example.com,GH,,+233200000000,GHS`;

export default async function OwnerImportPage() {
  await requireRole("import.write");

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: "Owners", href: "/admin/owners" },
            { label: "Import CSV" },
          ]}
        />
        <h2 className="mt-2 text-xl font-medium text-stone-900">
          Import owners from CSV
        </h2>
        <p className="text-sm text-stone-500">
          Upload a CSV with one owner per row. We&apos;ll validate every row
          before creating anything; only valid rows get inserted on apply.
        </p>
      </div>

      <section className="rounded-lg border border-stone-200 bg-white p-6">
        <h3 className="text-base font-medium text-stone-900">
          Required columns
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-700">
          <li>
            <code>fullName</code> · personal name on the account
          </li>
          <li>
            <code>email</code> · used for the magic-link login
          </li>
          <li>
            <code>country</code> · KE or GH
          </li>
        </ul>
        <h4 className="mt-4 text-sm font-medium text-stone-900">
          Optional columns
        </h4>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-stone-700">
          <li>
            <code>companyName</code> — promoted to the display name when set
          </li>
          <li>
            <code>phone</code>
          </li>
          <li>
            <code>preferredCurrency</code> — 3-letter ISO code; defaults to USD
          </li>
        </ul>
        <p className="mt-3 text-xs text-stone-500">
          Aliases accepted: <code>full_name</code>, <code>name</code>,{" "}
          <code>company_name</code>, <code>currency</code>.
        </p>
        <details className="mt-3 text-xs text-stone-600">
          <summary className="cursor-pointer text-stone-700 hover:text-stone-900">
            Show sample
          </summary>
          <pre className="mt-2 overflow-x-auto rounded-md bg-stone-50 p-3">
            {SAMPLE}
          </pre>
        </details>
      </section>

      <ImportClient />
    </div>
  );
}
