// /admin/owners/[id]/payouts/record — single-form page for an
// admin to record a money-out PAYOUT against a verified
// OwnerPayoutMethod. The dropdowns are pre-filtered to only show
// the owner's properties + their verified, non-archived methods,
// so the operator physically cannot pick the wrong destination.

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { listPayablePayoutMethods, summarisePayoutMethod, PAYOUT_METHOD_LABEL } from "@/lib/payouts";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { formatOwnerDisplayName } from "@/lib/format-owner";
import { formatPropertyDisplayName } from "@/lib/format-property";
import { RecordPayoutForm } from "./RecordPayoutForm";

export const dynamic = "force-dynamic";

export default async function RecordPayoutPage({
  params,
}: {
  params: { id: string };
}) {
  const owner = await prisma.owner.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      fullName: true,
      companyName: true,
      preferredCurrency: true,
    },
  });
  if (!owner) notFound();

  const [properties, methods] = await Promise.all([
    prisma.property.findMany({
      where: { ownerId: owner.id, archivedAt: null },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, unitNumber: true },
    }),
    listPayablePayoutMethods(owner.id),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { label: "Owners", href: "/admin/owners" },
            {
              label: formatOwnerDisplayName(owner),
              href: `/admin/owners/${owner.id}`,
            },
            { label: "Record payout" },
          ]}
        />
        <h2 className="mt-2 text-xl font-medium text-stone-900">
          Record a payout
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Adds an OUTFLOW transaction tied to a verified payout method.
          The owner sees this on their next statement and on the
          transactions page immediately.
        </p>
      </div>

      {methods.length === 0 ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-medium">
            No verified payout method on file for this owner.
          </p>
          <p className="mt-1">
            Verify a payout method on the owner detail page before
            recording any payouts.
          </p>
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600">
          This owner has no active properties, so there&apos;s nothing to
          pay out for. Add a property first.
        </div>
      ) : (
        <div className="max-w-2xl rounded-lg border border-stone-200 bg-white p-6">
          <RecordPayoutForm
            ownerId={owner.id}
            properties={properties.map((p) => ({
              id: p.id,
              label: formatPropertyDisplayName(p.name, p.unitNumber),
            }))}
            methods={methods.map((m) => ({
              id: m.id,
              label: m.label,
              currency: m.currency,
              kind: PAYOUT_METHOD_LABEL[m.kind],
              summary: summarisePayoutMethod(m),
              isDefault: m.isDefault,
            }))}
            defaultCurrency={owner.preferredCurrency}
          />
        </div>
      )}
    </div>
  );
}
