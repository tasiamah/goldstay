// /owner/profile — owner self-service profile.
//
// Holds the "who you are" half of the setup flow (name, phone,
// address, business entity) and surfaces the read-only email so
// the landlord knows which account they're editing. Bank account
// + legal documents stay on /owner/payouts because those are
// operational settings tied to a payout, and the team works with
// them differently.
//
// We render the same setup checklist here as on /owner/payouts —
// it's the single source of "where am I in onboarding?" — but the
// per-step links route across pages: personal / business stay on
// this page (anchored sections), legal / bank deep-link to
// /owner/payouts. That way an owner can land on either page and
// always see the full picture.

import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeSetupChecklist } from "@/lib/owner/setup-status";
import { SetupChecklist } from "@/components/owner/SetupChecklist";
import type { SetupStepKey } from "@/lib/owner/setup-status";
import { listPayoutMethodsFor } from "@/lib/payouts";
import { PersonalDetailsForm } from "../payouts/PersonalDetailsForm";
import { BusinessForm } from "../payouts/BusinessForm";

export const dynamic = "force-dynamic";

const PROFILE_STEPS = new Set<SetupStepKey>(["personal", "business"]);

export default async function OwnerProfilePage({
  searchParams,
}: {
  searchParams?: { step?: string };
}) {
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
      companyName: owner.companyName,
    },
    hasIdDocument: (kycByKind.ID_DOCUMENT ?? 0) > 0,
    hasProofOfAccount: (kycByKind.PROOF_OF_PAYOUT_ACCOUNT ?? 0) > 0,
    payoutMethodCount: methods.length,
  });

  // Active step: explicit ?step=… wins (only personal / business
  // belong on this page; the others live on /owner/payouts), then
  // first-incomplete-on-this-page, then "personal" so we always
  // anchor somewhere.
  const requested = searchParams?.step as SetupStepKey | undefined;
  const activeKey: SetupStepKey =
    requested && PROFILE_STEPS.has(requested)
      ? requested
      : (checklist.steps.find((s) => PROFILE_STEPS.has(s.key) && !s.done)
          ?.key ?? "personal");

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
        activeKey={activeKey}
        hrefFor={(key) =>
          PROFILE_STEPS.has(key)
            ? `/owner/profile?step=${key}#${key}`
            : `/owner/payouts?step=${key}#${key}`
        }
      />

      <ProfileSection
        id="personal"
        title="Personal details"
        description="Used on every monthly statement and on KYC paperwork."
        active={activeKey === "personal"}
      >
        <PersonalDetailsForm
          defaultFullName={owner.fullName}
          defaultPhone={owner.phone ?? ""}
          defaultAddress={owner.address ?? ""}
          email={owner.email}
        />
      </ProfileSection>

      <ProfileSection
        id="business"
        title="Business"
        description="The legal entity that holds the property, if you let through one."
        active={activeKey === "business"}
      >
        <BusinessForm
          defaultCompanyName={owner.companyName ?? ""}
          defaultCountry={owner.country}
        />
      </ProfileSection>
    </div>
  );
}

function ProfileSection({
  id,
  title,
  description,
  active,
  children,
}: {
  id: string;
  title: string;
  description: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-6 rounded-lg border bg-white p-6 ${
        active ? "border-stone-300 shadow-sm" : "border-stone-200"
      }`}
    >
      <h3 className="text-base font-medium text-stone-900">{title}</h3>
      <p className="mt-1 text-sm text-stone-500">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}
