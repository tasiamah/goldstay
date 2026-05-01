// /admin/leads/new — manual lead entry. Used when a landlord
// reaches Goldstay through a non-form channel (WhatsApp, a referral,
// a call) and ops wants the lead in the same pipeline as form
// submissions, so it shows up in the list, gets a status, and can
// be converted with one click later.

import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { ManualLeadForm } from "./ManualLeadForm";

export const dynamic = "force-dynamic";

export default function NewLeadPage() {
  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { label: "Leads", href: "/admin/leads" },
            { label: "Log a lead" },
          ]}
        />
        <h2 className="mt-2 text-xl font-medium text-stone-900">
          Log a lead manually
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Use this when a landlord reaches us off-platform — WhatsApp, a
          referral, an event. The lead lands in the same queue as website
          submissions.
        </p>
      </div>

      <div className="max-w-2xl rounded-lg border border-stone-200 bg-white p-6">
        <ManualLeadForm />
      </div>
    </div>
  );
}
