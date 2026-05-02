// /owner/account — single page for the entire owner setup.
//
// Replaces the previous /owner/profile + /owner/payouts split. The
// setup checklist treated all three steps (details, legal, bank) as
// siblings, but the URLs split them across two pages, which made
// the checklist links jump around. Here every step lives on this
// page and the checklist scrolls to the matching #anchor.
//
// /owner/payouts and /owner/profile both redirect to this page so
// bookmarks, magic-link emails and any pre-existing notification
// hrefs keep working.

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
import { YourDetailsForm } from "./YourDetailsForm";

export const dynamic = "force-dynamic";

const STEP_KEYS = new Set<SetupStepKey>(["details", "legal", "bank"]);

export default async function OwnerAccountPage({
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
      entityType: owner.entityType,
      companyName: owner.companyName,
    },
    hasIdDocument: (kycByKind.ID_DOCUMENT ?? 0) > 0,
    hasProofOfAccount: (kycByKind.PROOF_OF_PAYOUT_ACCOUNT ?? 0) > 0,
    payoutMethodCount: methods.length,
  });

  // Active step: an explicit ?step= wins if it's a valid key,
  // otherwise we surface the first incomplete step (or "details" so
  // the page never looks unanchored).
  const requested = searchParams?.step as SetupStepKey | undefined;
  const activeKey: SetupStepKey =
    requested && STEP_KEYS.has(requested)
      ? requested
      : (checklist.steps.find((s) => !s.done)?.key ?? "details");

  const allDone = checklist.doneCount === checklist.totalCount;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-xl font-medium text-stone-900">Account</h2>
        <p className="mt-1 text-sm text-stone-600">
          {allDone
            ? "Everything we need is on file. You can update any of these later from this page."
            : `Finish the ${
                checklist.totalCount - checklist.doneCount
              } of ${checklist.totalCount} setup steps below before your first payout. Each step takes about a minute.`}
        </p>
      </header>

      <SetupChecklist
        data={checklist}
        activeKey={activeKey}
        hrefFor={(key) => `/owner/account?step=${key}#${key}`}
      />

      <SetupSection
        id="details"
        title="Your details"
        description="Used on every monthly statement and on KYC paperwork."
        active={activeKey === "details"}
      >
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
      </SetupSection>

      <SetupSection
        id="legal"
        title="Legal documents"
        description="ID verification: passport or national ID, plus proof of payout-account ownership."
        active={activeKey === "legal"}
      >
        <OwnerKycCard ownerId={owner.id} />
      </SetupSection>

      <SetupSection
        id="bank"
        title="Bank account"
        description="Where Goldstay sends your net rent every month. Add as many methods as you like; only one is the default at any time."
        active={activeKey === "bank"}
      >
        {methods.length === 0 ? (
          <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-stone-600">
            <p>
              You haven&apos;t added a payout method yet. Add one below. The
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
        an existing method, only the last 4 digits. To change a number,
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
