// Computes which of the four owner-onboarding steps are complete.
//
// Pure: takes a snapshot of the owner row, their KYC documents and
// their payout methods, returns a four-row checklist. Same fixture
// can drive both the visual <SetupChecklist> and any "is this owner
// ready for a payout?" gate elsewhere in the app.
//
// What counts as complete:
//   * personal  — a parseable two-token name AND a non-empty phone
//   * business  — companyName present (KE/GH country always exists,
//                 it's required at owner creation)
//   * legal     — at least one ID_DOCUMENT on file. We treat the
//                 PROOF_OF_PAYOUT_ACCOUNT as part of the bank step
//                 because that's the doc that gates the wire.
//   * bank      — at least one payout method exists AND the
//                 supporting proof-of-account document is uploaded.
//                 (Verification is an admin step; we surface
//                 "verified" separately so an owner can still tick
//                 the box once they've done their part.)

export type SetupStepKey = "personal" | "business" | "legal" | "bank";

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
  const personalDone =
    isFullName(input.owner.fullName) && Boolean(input.owner.phone?.trim());
  const businessDone = Boolean(input.owner.companyName?.trim());
  const legalDone = input.hasIdDocument;
  const bankDone = input.payoutMethodCount > 0 && input.hasProofOfAccount;

  const steps: SetupStep[] = [
    {
      key: "personal",
      label: "Personal details",
      description: "Your full legal name and a callable phone number.",
      done: personalDone,
    },
    {
      key: "business",
      label: "Business",
      description:
        "The company that holds the property, if you let through one.",
      done: businessDone,
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
  const firstIncomplete =
    steps.find((s) => !s.done)?.key ?? null;

  return { steps, doneCount, totalCount: steps.length, firstIncomplete };
}
