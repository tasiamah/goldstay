// Server component that wraps the two client-side KYC slots.
//
// We only ever consider the *most recent* document per kind: an
// client who replaces a smudged passport scan should be reviewed
// against the new file, not the old one. The greyed-out / pending
// state is purely visual — actual gating of payouts happens via
// ClientPayoutMethod.verifiedAt downstream.

import { prisma } from "@/lib/db";
import { ClientKycSlot } from "./ClientKycSlot";

type Kind = "ID_DOCUMENT" | "PROOF_OF_PAYOUT_ACCOUNT";

async function latestFor(clientId: string, kind: Kind) {
  const doc = await prisma.document.findFirst({
    where: { clientId, kind },
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true, sizeBytes: true },
  });
  if (!doc) return null;
  return {
    id: doc.id,
    uploadedAt: doc.createdAt,
    sizeBytes: doc.sizeBytes,
  };
}

export async function ClientKycCard({ clientId }: { clientId: string }) {
  const [proofDoc, idDoc] = await Promise.all([
    latestFor(clientId, "PROOF_OF_PAYOUT_ACCOUNT"),
    latestFor(clientId, "ID_DOCUMENT"),
  ]);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-6">
      <h3 className="text-base font-medium text-stone-900">
        Verification documents
      </h3>
      <p className="mt-1 text-sm text-stone-500">
        We&apos;ll need both before the first payout can leave Goldstay.
        Files go straight to encrypted storage and are only seen by
        the Goldstay verification team.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <ClientKycSlot
          kind="PROOF_OF_PAYOUT_ACCOUNT"
          title="Proof of payout-account ownership"
          description="Bank letter, voided cheque, M-Pesa till statement, or screenshot of your Wise account showing your name."
          existing={proofDoc}
        />
        <ClientKycSlot
          kind="ID_DOCUMENT"
          title="Proof of identity"
          description="Passport or national ID. Make sure all four corners are visible and the photo + numbers are readable."
          existing={idDoc}
        />
      </div>
    </section>
  );
}
