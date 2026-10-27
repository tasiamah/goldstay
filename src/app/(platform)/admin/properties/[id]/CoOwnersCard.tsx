// Server wrapper that loads a property's co-owners and binds the
// admin actions for the panel.
//
// Split out for the same reason ObserversCard is: the property page
// is long already and this needs its own query.

import { prisma } from "@/lib/db";
import { CoOwnersPanel } from "@/components/admin/CoOwnersPanel";
import {
  adminAddCoOwnerAction,
  adminRemoveCoOwnerAction,
} from "./co-owner-actions";

export async function CoOwnersCard({
  propertyId,
  ownerOfRecord,
}: {
  propertyId: string;
  ownerOfRecord: string;
}) {
  const rows = await prisma.propertyCoOwner.findMany({
    where: { propertyId, removedAt: null },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      relationship: true,
      addedByEmail: true,
      createdAt: true,
      client: { select: { fullName: true, email: true } },
    },
  });

  const add = adminAddCoOwnerAction.bind(null, propertyId);
  const remove = adminRemoveCoOwnerAction.bind(null, propertyId);

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6">
      <h3 className="text-base font-medium text-stone-900">Co-owners</h3>
      <p className="mt-1 text-sm text-stone-500">
        Other Goldstay clients who own this unit alongside{" "}
        {ownerOfRecord.split(/\s+/)[0] || "the owner"}. They see the unit and
        how it is performing in their own portal, and nothing that belongs to{" "}
        {ownerOfRecord.split(/\s+/)[0] || "the owner"} personally — no
        statement, no payout method, no KYC. The agreement, the statement and
        the payout stay with {ownerOfRecord}.
      </p>
      <p className="mt-2 text-sm text-stone-500">
        A co-owner needs their own client record, because unlike a statement
        copy this grants a login. If they do not have one yet, create the
        client first.
      </p>

      <div className="mt-5">
        <CoOwnersPanel
          rows={rows}
          ownerOfRecord={ownerOfRecord}
          addAction={add}
          removeAction={remove}
        />
      </div>
    </div>
  );
}
