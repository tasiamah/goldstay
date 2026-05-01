// /admin/properties/import — same shape as the owner import. The
// only twist is the ownerEmail join: we resolve each row's email to
// an existing Owner and skip rows whose email doesn't match. We
// surface the unmatched count in the redirect query so the apply
// step gives feedback.

import { requireRole } from "@/lib/auth";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { ImportClient } from "./ImportClient";

export const dynamic = "force-dynamic";

const SAMPLE = `ownerEmail,name,unitNumber,city,address,neighbourhood,country,propertyType,bedrooms,bathrooms,sizeSqm
asha@example.com,Luminara Apartments,3B,Nairobi,123 Riverside Drive,Westlands,KE,LONG_TERM,2,2,80
kwame@example.com,Cantonments House,,Accra,12 Cantonments Rd,Cantonments,GH,SHORT_TERM,3,2,120`;

export default async function PropertyImportPage() {
  await requireRole("import.write");

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: "Properties", href: "/admin/properties" },
            { label: "Import CSV" },
          ]}
        />
        <h2 className="mt-2 text-xl font-medium text-stone-900">
          Import properties from CSV
        </h2>
        <p className="text-sm text-stone-500">
          Each row is attached to an existing owner via{" "}
          <code>ownerEmail</code>. Rows whose email doesn&apos;t match an
          owner are skipped (we never auto-create owners during a property
          import — that would hide data quality issues).
        </p>
      </div>

      <section className="rounded-lg border border-stone-200 bg-white p-6">
        <h3 className="text-base font-medium text-stone-900">
          Required columns
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-700">
          <li>
            <code>ownerEmail</code> · the existing owner row&apos;s email
          </li>
          <li>
            <code>name</code> · building / property name
          </li>
          <li>
            <code>city</code>, <code>address</code>, <code>country</code>{" "}
            (KE / GH)
          </li>
        </ul>
        <h4 className="mt-4 text-sm font-medium text-stone-900">
          Optional columns
        </h4>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-stone-700">
          <li>
            <code>unitNumber</code>, <code>neighbourhood</code>,{" "}
            <code>propertyType</code> (LONG_TERM | SHORT_TERM, default
            LONG_TERM), <code>bedrooms</code>, <code>bathrooms</code>,{" "}
            <code>sizeSqm</code>
          </li>
        </ul>
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
