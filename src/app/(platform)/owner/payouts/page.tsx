// /owner/payouts — owner self-service for payout details and the
// account-setup checklist. The page is laid out as a four-step
// onboarding flow rather than a single payouts list, because the
// senior risk in this surface is an owner who's "set up" their
// payout method but skipped the legal docs / personal details and
// gets blocked at the first wire run. The checklist makes the
// missing piece obvious.
//
// Each step has its own anchored section below the checklist:
//   #personal  — full name + phone (Personal details)
//   #business  — company + country (Business)
//   #legal     — KYC documents (existing OwnerKycCard)
//   #bank      — payout methods + add-new form (existing components)

import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  PAYOUT_METHOD_LABEL,
  listPayoutMethodsFor,
  summarisePayoutMethod,
} from "@/lib/payouts";
import { computeSetupChecklist } from "@/lib/owner/setup-status";
import { SetupChecklist } from "@/components/owner/SetupChecklist";
import type { SetupStepKey } from "@/lib/owner/setup-status";
import { OwnerPayoutMethodActions } from "./OwnerPayoutMethodActions";
import { OwnerAddPayoutMethodForm } from "./OwnerAddPayoutMethodForm";
import { OwnerKycCard } from "./OwnerKycCard";
import { PersonalDetailsForm } from "./PersonalDetailsForm";
import { BusinessForm } from "./BusinessForm";

export const dynamic = "force-dynamic";

const VALID_STEPS = new Set<SetupStepKey>([
  "personal",
  "business",
  "legal",
  "bank",
]);

export default async function OwnerPayoutsPage({
  searchParams,
}: {
  searchParams?: { step?: string };
}) {
  const { owner } = await requireOwner();

  const [methods, kycCounts] = await Promise.all([
    listPayoutMethodsFor(owner.id, { includeArchived: false }),
    prisma.document.groupBy({
      by: ["kind"],
      where: { ownerId: owner.id, kind: { in: ["ID_DOCUMENT", "PROOF_OF_PAYOUT_ACCOUNT"] } },
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
      companyName: owner.companyName,
    },
    hasIdDocument: (kycByKind.ID_DOCUMENT ?? 0) > 0,
    hasProofOfAccount: (kycByKind.PROOF_OF_PAYOUT_ACCOUNT ?? 0) > 0,
    payoutMethodCount: methods.length,
  });

  // Active step: explicit ?step=… wins, otherwise the first
  // incomplete row (or "personal" if everything's done so the page
  // doesn't look unanchored).
  const requested = searchParams?.step as SetupStepKey | undefined;
  const activeKey: SetupStepKey =
    requested && VALID_STEPS.has(requested)
      ? requested
      : (checklist.firstIncomplete ?? "personal");

  const allDone = checklist.doneCount === checklist.totalCount;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-xl font-medium text-stone-900">
          Account setup
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          {allDone
            ? "Everything we need is on file. You can update any of these later from this page."
            : `Finish the ${
                checklist.totalCount - checklist.doneCount
              } of ${checklist.totalCount} steps below before your first payout. Each step takes about a minute.`}
        </p>
      </header>

      <SetupChecklist
        data={checklist}
        activeKey={activeKey}
        hrefFor={(key) => `/owner/payouts?step=${key}#${key}`}
      />

      <SetupSection
        id="personal"
        title="Personal details"
        description="Used on every monthly statement and on KYC paperwork."
        active={activeKey === "personal"}
      >
        <PersonalDetailsForm
          defaultFullName={owner.fullName}
          defaultPhone={owner.phone ?? ""}
        />
      </SetupSection>

      <SetupSection
        id="business"
        title="Business"
        description="The legal entity that holds the property, if you let through one."
        active={activeKey === "business"}
      >
        <BusinessForm
          defaultCompanyName={owner.companyName ?? ""}
          defaultCountry={owner.country}
        />
      </SetupSection>

      <SetupSection
        id="legal"
        title="Legal documents"
        description="KYC paperwork — passport / national ID and proof of payout-account ownership."
        active={activeKey === "legal"}
      >
        <OwnerKycCard ownerId={owner.id} />
      </SetupSection>

      <SetupSection
        id="bank"
        title="Bank account"
        description="Where Goldstay sends your net rent every month. Add as many methods as you like — only one is the default at any time."
        active={activeKey === "bank"}
      >
        {methods.length === 0 ? (
          <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-stone-600">
            <p>
              You haven&apos;t added a payout method yet. Add one below — the
              Goldstay team will verify it before the first payout, so do
              this at least 5 working days before your first statement is
              due.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-100 rounded-lg border border-stone-200 bg-white">
            {methods.map((m) => (
              <li
                key={m.id}
                className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    {m.label}
                    {m.isDefault ? (
                      <span className="ml-2 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                        Default
                      </span>
                    ) : null}
                    {m.verifiedAt ? (
                      <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                        Verified
                      </span>
                    ) : (
                      <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                        Awaiting Goldstay verification
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {PAYOUT_METHOD_LABEL[m.kind]} ·{" "}
                    {summarisePayoutMethod(m)}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    Beneficiary: {m.beneficiaryName}
                  </p>
                </div>
                <OwnerPayoutMethodActions
                  payoutMethodId={m.id}
                  isDefault={m.isDefault}
                />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 rounded-lg border border-stone-200 bg-white p-6">
          <h4 className="text-base font-medium text-stone-900">
            Add a new payout method
          </h4>
          <p className="mt-1 text-sm text-stone-500">
            Wise is usually cheapest for diaspora remittance into KES /
            GHS. Use a local bank if you have a Goldstay-country account.
          </p>
          <div className="mt-4">
            <OwnerAddPayoutMethodForm
              defaultCurrency={owner.preferredCurrency}
            />
          </div>
        </div>
      </SetupSection>

      <p className="text-xs text-stone-500">
        For your protection, we never display the full account number of
        an existing method — only the last 4 digits. To change a number,
        archive the old method and add a new one.
      </p>
    </div>
  );
}

function SetupSection({
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
      // The active step gets a brighter card; the others keep a quieter
      // surface so the whole page doesn't compete for attention. The
      // `scroll-mt-6` accounts for the sticky-ish header gap when
      // jumping via #fragment from the checklist above.
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
