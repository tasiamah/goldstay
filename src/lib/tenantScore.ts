// Internal tenant application scoring. Produces a provisional grade (A..D)
// from the self-reported data on the application form. This is a first-pass
// signal for the Goldstay ops team: every A and B applicant still gets a
// human check (employer call, previous landlord call, ID/KRA/Ghana card
// verification) before any landlord sees the name. The rubric is deliberately
// conservative so we never over-promise to a landlord.
//
// The score is intentionally not exposed to the applicant. It lives in the
// ops email, the internal record and (future) the landlord-facing dossier.

export type TenantApplicationInput = {
  monthlyIncomeUsd: number;
  targetRentUsd: number;
  employmentMonths: number;
  employmentType:
    | "salaried"
    | "self-employed"
    | "contract"
    | "business-owner"
    | "unemployed"
    | "student"
    | "other";
  hasGuarantor: boolean;
  hasPreviousLandlord: boolean;
  previousLandlordDisputeDisclosed: boolean;
  evictedBefore: boolean;
  currentlyEmployed: boolean;
  completenessRatio: number; // 0..1, share of fields meaningfully filled
};

export type TenantScoreBreakdown = {
  incomeRatio: number;
  incomeRatioPoints: number;
  employmentPoints: number;
  landlordHistoryPoints: number;
  guarantorPoints: number;
  completenessPoints: number;
  penalties: number;
  total: number;
  grade: "A" | "B" | "C" | "D";
  rationale: string[];
};

// Grade bands are public within the ops team so assessments stay consistent
// between analysts. Never share the band with the applicant.
export function gradeForScore(total: number): "A" | "B" | "C" | "D" {
  if (total >= 85) return "A";
  if (total >= 70) return "B";
  if (total >= 55) return "C";
  return "D";
}

export function scoreTenantApplication(
  input: TenantApplicationInput,
): TenantScoreBreakdown {
  const rationale: string[] = [];

  // Income ratio: 40 points. Landlords in Nairobi and Accra typically require
  // 2.5x to 3x rent in verified income. We reward 3x+, accept 2x as baseline,
  // and penalise below 1.5x heavily because those applications almost always
  // end in arrears within the first six months.
  const rawRatio =
    input.targetRentUsd > 0 ? input.monthlyIncomeUsd / input.targetRentUsd : 0;
  let incomeRatioPoints = 0;
  if (rawRatio >= 3.5) incomeRatioPoints = 40;
  else if (rawRatio >= 3) incomeRatioPoints = 35;
  else if (rawRatio >= 2.5) incomeRatioPoints = 28;
  else if (rawRatio >= 2) incomeRatioPoints = 20;
  else if (rawRatio >= 1.5) incomeRatioPoints = 10;
  else incomeRatioPoints = 0;
  rationale.push(
    `Income to rent ratio ${rawRatio.toFixed(2)}x, ${incomeRatioPoints}/40 points`,
  );

  // Employment stability: 25 points. Salaried applicants with 24+ months of
  // tenure are the gold standard. Self-employed and business owners can still
  // score well but need the verification layer (statement, registration).
  let employmentPoints = 0;
  if (!input.currentlyEmployed) {
    employmentPoints = 0;
    rationale.push("Not currently employed, 0/25 points");
  } else {
    const months = Math.max(0, input.employmentMonths);
    let base = 0;
    if (months >= 24) base = 20;
    else if (months >= 12) base = 15;
    else if (months >= 6) base = 10;
    else base = 5;

    const typeBonus =
      input.employmentType === "salaried"
        ? 5
        : input.employmentType === "business-owner"
          ? 4
          : input.employmentType === "contract"
            ? 3
            : input.employmentType === "self-employed"
              ? 3
              : 1;

    employmentPoints = base + typeBonus;
    rationale.push(
      `${months} months ${input.employmentType}, ${employmentPoints}/25 points`,
    );
  }

  // Previous landlord history: 20 points. The single most predictive signal
  // we have, because it is the one data point we can actually verify by
  // phone. A disclosed dispute does not zero out the score on its own, it
  // just flags the file for a careful reference call.
  let landlordHistoryPoints = 0;
  if (input.hasPreviousLandlord && !input.previousLandlordDisputeDisclosed) {
    landlordHistoryPoints = 20;
    rationale.push("Previous landlord on file, no disputes disclosed, 20/20");
  } else if (input.hasPreviousLandlord) {
    landlordHistoryPoints = 10;
    rationale.push(
      "Previous landlord on file but dispute disclosed, 10/20 (call reference)",
    );
  } else {
    landlordHistoryPoints = 5;
    rationale.push("No previous landlord on file, 5/20 (first-time renter)");
  }

  // Guarantor: 8 points. Nice to have, especially for first-time renters and
  // self-employed applicants, but not required for a strong salaried file.
  const guarantorPoints = input.hasGuarantor ? 8 : 0;
  rationale.push(
    input.hasGuarantor ? "Guarantor provided, 8/8" : "No guarantor, 0/8",
  );

  // Form completeness: 7 points. We care because sparse forms correlate with
  // sparse tenants. Below 70% complete we hold the file until the applicant
  // fills the gaps.
  const completenessPoints = Math.round(input.completenessRatio * 7);
  rationale.push(
    `Form ${Math.round(input.completenessRatio * 100)}% complete, ${completenessPoints}/7`,
  );

  // Hard penalties. Prior eviction is a 25 point penalty, not a block, so
  // strong income plus a plausible explanation can still produce a B.
  let penalties = 0;
  if (input.evictedBefore) {
    penalties += 25;
    rationale.push("Prior eviction disclosed, -25 penalty");
  }

  const rawTotal =
    incomeRatioPoints +
    employmentPoints +
    landlordHistoryPoints +
    guarantorPoints +
    completenessPoints -
    penalties;

  const total = Math.max(0, Math.min(100, rawTotal));
  const grade = gradeForScore(total);

  return {
    incomeRatio: rawRatio,
    incomeRatioPoints,
    employmentPoints,
    landlordHistoryPoints,
    guarantorPoints,
    completenessPoints,
    penalties,
    total,
    grade,
    rationale,
  };
}
