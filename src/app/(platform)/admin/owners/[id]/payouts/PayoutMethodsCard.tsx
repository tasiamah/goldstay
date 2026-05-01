// Server component rendering the owner's payout methods + an
// "Add new" toggle that mounts the client form. Verified rows show
// a tick; unverified rows show a "Verify" button (which an admin
// clicks after reviewing the matching PROOF_OF_PAYOUT_ACCOUNT
// document on the owner). Default is exactly one row, marked with
// a star; promoting another demotes the previous default
// atomically inside the helper layer.

import {
  PAYOUT_METHOD_LABEL,
  listPayoutMethodsFor,
  summarisePayoutMethod,
} from "@/lib/payouts";
import { PayoutMethodActions } from "./PayoutMethodActions";
import { AddPayoutMethodForm } from "./AddPayoutMethodForm";

export async function PayoutMethodsCard({
  ownerId,
  preferredCurrency,
}: {
  ownerId: string;
  preferredCurrency: string;
}) {
  const methods = await listPayoutMethodsFor(ownerId, { includeArchived: false });
  const verifiedCount = methods.filter((m) => m.verifiedAt).length;
  const hasDefault = methods.some((m) => m.isDefault);

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-medium text-stone-900">
            Payout methods
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Where Goldstay remits the owner&apos;s net rent each month.
            Verification gate: the platform refuses to record a PAYOUT
            transaction against an unverified row.
          </p>
        </div>
        <span className="text-xs uppercase tracking-wider text-stone-500">
          {methods.length}{" "}
          {methods.length === 1 ? "method" : "methods"}
        </span>
      </div>

      {methods.length === 0 ? (
        <p className="mt-5 rounded-md border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-stone-600">
          No payout method on file yet. Once added and verified, the
          owner can be paid out programmatically.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-stone-100">
          {methods.map((m) => (
            <li key={m.id} className="py-4">
              <div className="flex items-start justify-between gap-3">
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
                        Awaiting verification
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {PAYOUT_METHOD_LABEL[m.kind]} · {summarisePayoutMethod(m)}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    Beneficiary: {m.beneficiaryName}
                  </p>
                </div>
                <PayoutMethodActions
                  ownerId={ownerId}
                  payoutMethodId={m.id}
                  isVerified={Boolean(m.verifiedAt)}
                  isDefault={m.isDefault}
                />
              </div>
              {m.internalNotes ? (
                <p className="mt-2 rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-600">
                  <span className="font-medium text-stone-700">Notes: </span>
                  {m.internalNotes}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {!hasDefault && verifiedCount > 0 ? (
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          No default payout method set. Mark one as default before the
          next monthly payout run, or the operator running payouts will
          have to pick manually.
        </p>
      ) : null}

      <div className="mt-6 border-t border-stone-100 pt-5">
        <AddPayoutMethodForm
          ownerId={ownerId}
          defaultCurrency={preferredCurrency}
        />
      </div>
    </div>
  );
}
