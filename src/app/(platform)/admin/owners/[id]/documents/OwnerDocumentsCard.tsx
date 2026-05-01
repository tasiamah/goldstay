// Owner-level documents card (KYC + ID + proof-of-payout-account).
// Companion to the per-property documents block; this surfaces
// docs that belong to the *person* not a specific asset.
//
// Order is reverse-chronological so the most recently uploaded doc
// (usually the one the operator was just discussing on a call) is
// at the top. Delete is a soft action backed by an audit row.

import { prisma } from "@/lib/db";
import { OwnerDocumentUploader } from "./OwnerDocumentUploader";
import { OwnerDocumentRow } from "./OwnerDocumentRow";

const KIND_LABEL: Record<string, string> = {
  ID_DOCUMENT: "ID document",
  KYC: "KYC",
  PROOF_OF_PAYOUT_ACCOUNT: "Proof of payout account",
  OTHER: "Other",
};

export async function OwnerDocumentsCard({ ownerId }: { ownerId: string }) {
  const documents = await prisma.document.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      kind: true,
      mimeType: true,
      sizeBytes: true,
      createdAt: true,
      uploadedBy: true,
      storagePath: true,
    },
  });

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-medium text-stone-900">
            Owner documents
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Identity (passport / national ID), proof of payout account,
            and any KYC artefacts. These belong to the person, not a
            single property.
          </p>
        </div>
        <span className="text-xs uppercase tracking-wider text-stone-500">
          {documents.length}{" "}
          {documents.length === 1 ? "doc" : "docs"}
        </span>
      </div>

      {documents.length === 0 ? (
        <p className="mt-5 rounded-md border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-stone-600">
          No owner documents on file yet. Upload at least one ID
          document and a proof of payout account before scheduling
          the first payout.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-stone-100">
          {documents.map((d) => (
            <li
              key={d.id}
              className="flex items-start justify-between gap-3 py-3"
            >
              <div>
                <p className="text-sm font-medium text-stone-900">{d.title}</p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {KIND_LABEL[d.kind] ?? d.kind} · uploaded{" "}
                  {d.createdAt.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  {d.uploadedBy ? ` by ${d.uploadedBy}` : ""}
                </p>
              </div>
              <OwnerDocumentRow
                documentId={d.id}
                ready={d.storagePath !== "pending"}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 border-t border-stone-100 pt-5">
        <OwnerDocumentUploader ownerId={ownerId} />
      </div>
    </div>
  );
}
