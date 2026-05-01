// Computes which of the three owner-onboarding steps are complete.
//
// Pure: takes a snapshot of the owner row, their KYC documents and
// their payout methods, returns a three-row checklist. Same fixture
// can drive both the visual <SetupChecklist> and any "is this owner
// ready for a payout?" gate elsewhere in the app.
//
// What counts as complete:
//   * details   — a parseable two-token name, a non-empty phone, a
//                 postal address, AND (only when entityType is
//                 COMPANY) a companyName. companyRegistrationNumber
//                 is collected if available but never required, so it
//                 doesn't influence this gate. The previous build
//                 split this into two separate steps; we collapsed
//                 them because the personal/business distinction was
//                 confusing and "business" was hardly ever the active
//                 step (companyName defaults to the owner's name at
//                 record creation).
//   * legal     — at least one ID_DOCUMENT on file. We treat the
//                 PROOF_OF_PAYOUT_ACCOUNT as part of the bank step
//                 because that's the doc that gates the wire.
//   * bank      — at least one payout method exists AND the
//                 supporting proof-of-account document is uploaded.
//                 (Verification is an admin step; we surface
//                 "verified" separately so an owner can still tick
//                 the box once they've done their part.)

import type { OwnerEntityType } from "@prisma/client";

export type SetupStepKey = "details" | "legal" | "bank";

export type SetupStep = {
  key: SetupStepKey;
  label: string;
  description: string;
  done: boolean;
};

export type SetupChecklist = {
  steps: SetupStep[];
  doneCount: number;
  totalCount: number;
  // The first step that still needs work — what the UI defaults to
  // expanding when nothing else is selected.
  firstIncomplete: SetupStepKey | null;
};

export type SetupInput = {
  owner: {
    fullName: string | null;
    phone: string | null;
    address: string | null;
    entityType: OwnerEntityType;
    companyName: string | null;
  };
  hasIdDocument: boolean;
  hasProofOfAccount: boolean;
  payoutMethodCount: number;
};

function isFullName(name: string | null): boolean {
  if (!name) return false;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return false;
  return parts[0]!.length >= 2 && parts[parts.length - 1]!.length >= 2;
}

export function computeSetupChecklist(input: SetupInput): SetupChecklist {
  const personalCore =
    isFullName(input.owner.fullName) &&
    Boolean(input.owner.phone?.trim()) &&
    Boolean(input.owner.address?.trim());
  const businessOk =
    input.owner.entityType === "COMPANY"
      ? Boolean(input.owner.companyName?.trim())
      : true;
  const detailsDone = personalCore && businessOk;
  const legalDone = input.hasIdDocument;
  const bankDone = input.payoutMethodCount > 0 && input.hasProofOfAccount;

  const steps: SetupStep[] = [
    {
      key: "details",
      label: "Your details",
      description:
        "Your full legal name, a callable phone number, and a postal address. If you let through a company, we also collect the company name.",
      done: detailsDone,
    },
    {
      key: "legal",
      label: "Legal documents",
      description: "Passport or national ID, for KYC.",
      done: legalDone,
    },
    {
      key: "bank",
      label: "Bank account",
      description:
        "At least one verified payout method plus proof of ownership.",
      done: bankDone,
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const firstIncomplete = steps.find((s) => !s.done)?.key ?? null;

  return { steps, doneCount, totalCount: steps.length, firstIncomplete };
}
