// /owner/profile — owner self-service profile.
//
// Holds the consolidated "Your details" half of the setup flow
// (name, phone, address, entity type, optional company name +
// registration number, country) and surfaces the read-only email so
// the landlord knows which account they're editing. Bank account +
// legal documents stay on /owner/payouts because those are
// operational settings tied to a payout, and the team works with
// them differently.
//
// We render the same setup checklist here as on /owner/payouts —
// it's the single source of "where am I in onboarding?" — but the
// per-step links route across pages: details stays on this page
// (anchored section), legal / bank deep-link to /owner/payouts.
// That way an owner can land on either page and always see the full
// picture.

import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeSetupChecklist } from "@/lib/owner/setup-status";
import { SetupChecklist } from "@/components/owner/SetupChecklist";
import { listPayoutMethodsFor } from "@/lib/payouts";
import { YourDetailsForm } from "../payouts/YourDetailsForm";

export const dynamic = "force-dynamic";

export default async function OwnerProfilePage() {
  const { owner } = await requireOwner();

  const [methods, kycCounts] = await Promise.all([
    listPayoutMethodsFor(owner.id, { includeArchived: false }),
    prisma.document.groupBy({
      by: ["kind"],
      where: {
        ownerId: owner.id,
        kind: { in: ["ID_DOCUMENT", "PROOF_OF_PAYOUT_ACCOUNT"] },
      },
      _count: { _all: true },
    }),
  ]);

  const kycByKind = Object.fromEntries(
    kycCounts.map((c) => [c.kind, c._count._all]),
  );

  const checklist = computeSetupChecklist({
    owner: {
      fullName: owner.fullName,
      phone: owner.phone,
      address: owner.address,
      entityType: owner.entityType,
      companyName: owner.companyName,
    },
    hasIdDocument: (kycByKind.ID_DOCUMENT ?? 0) > 0,
    hasProofOfAccount: (kycByKind.PROOF_OF_PAYOUT_ACCOUNT ?? 0) > 0,
    payoutMethodCount: methods.length,
  });

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-xl font-medium text-stone-900">Profile</h2>
        <p className="mt-1 text-sm text-stone-600">
          Your contact details and the legal entity that holds your
          property. Bank account and legal documents are managed under{" "}
          <a
            href="/owner/payouts"
            className="font-medium text-stone-700 underline-offset-2 hover:underline"
          >
            Payouts
          </a>
          .
        </p>
      </header>

      <SetupChecklist
        data={checklist}
        activeKey="details"
        hrefFor={(key) =>
          key === "details"
            ? `/owner/profile#details`
            : `/owner/payouts?step=${key}#${key}`
        }
      />

      <section
        id="details"
        className="scroll-mt-6 rounded-lg border border-stone-300 bg-white p-6 shadow-sm"
      >
        <h3 className="text-base font-medium text-stone-900">Your details</h3>
        <p className="mt-1 text-sm text-stone-500">
          Used on every monthly statement and on KYC paperwork.
        </p>
        <div className="mt-5">
          <YourDetailsForm
            defaultFullName={owner.fullName}
            defaultPhone={owner.phone ?? ""}
            defaultAddress={owner.address ?? ""}
            defaultEntityType={owner.entityType}
            defaultCompanyName={owner.companyName ?? ""}
            defaultCompanyRegistrationNumber={
              owner.companyRegistrationNumber ?? ""
            }
            defaultCountry={owner.country}
            email={owner.email}
          />
        </div>
      </section>
    </div>
  );
}
