import { NextResponse } from "next/server";
import {
  scoreTenantApplication,
  type TenantApplicationInput,
} from "@/lib/tenantScore";

export const runtime = "nodejs";

// Internal tenant application endpoint. Receives the form payload from
// /apply, scores it, and emails the Goldstay ops inbox with three things:
//
//   1. The full applicant dossier formatted for a human reviewer.
//   2. A provisional grade (A..D) and scoring rationale. Never shown to
//      the applicant.
//   3. A separate callout whenever the applicant disclosed a previous
//      landlord, because that landlord is about to have a vacant unit. Ops
//      can reach out to them within the same week with a Goldstay pitch.
//
// No database yet. V1 uses email as the system of record, matching the
// existing /api/lead flow. Storage is a follow-up (Supabase is the likely
// target so we can build the landlord-facing dossier later).

type Payload = Record<string, unknown> & {
  fullName?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  monthlyIncomeUsd?: number;
  targetRentUsd?: number;
  employmentMonths?: number;
  employmentType?: TenantApplicationInput["employmentType"];
  currentlyEmployed?: boolean;
  hasGuarantor?: boolean;
  hasPreviousLandlord?: boolean;
  previousLandlordDisputeDisclosed?: boolean;
  evictedBefore?: boolean;
  consentBackgroundCheck?: boolean;
  consentLandlordReference?: boolean;
  consentDataProcessing?: boolean;
  token?: string;
};

function countFilled(data: Payload): number {
  return Object.values(data).filter((v) => {
    if (v === null || v === undefined) return false;
    if (typeof v === "string") return v.trim().length > 0;
    if (typeof v === "number") return !Number.isNaN(v);
    if (typeof v === "boolean") return true;
    return true;
  }).length;
}

function formatSection(title: string, rows: [string, unknown][]) {
  const body = rows
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `  ${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
    .join("\n");
  if (!body) return "";
  return `\n== ${title} ==\n${body}\n`;
}

export async function POST(req: Request) {
  let data: Payload;
  try {
    data = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !data.consentBackgroundCheck ||
    !data.consentLandlordReference ||
    !data.consentDataProcessing
  ) {
    return NextResponse.json(
      { error: "All three consents are required." },
      { status: 400 },
    );
  }

  if (!data.fullName || !data.email || !data.phone) {
    return NextResponse.json(
      { error: "Missing required identity fields." },
      { status: 400 },
    );
  }

  const employmentType =
    (data.employmentType as TenantApplicationInput["employmentType"]) ??
    "salaried";

  const currentlyEmployed =
    employmentType !== "unemployed" && employmentType !== "student";

  const totalFieldSlots = 45; // rough denominator, not exact
  const completenessRatio = Math.min(
    1,
    Math.max(0, countFilled(data) / totalFieldSlots),
  );

  const scoreInput: TenantApplicationInput = {
    monthlyIncomeUsd: Number(data.monthlyIncomeUsd ?? 0),
    targetRentUsd: Number(data.targetRentUsd ?? 0),
    employmentMonths: Number(data.employmentMonths ?? 0),
    employmentType,
    hasGuarantor: Boolean(data.hasGuarantor),
    hasPreviousLandlord: Boolean(data.hasPreviousLandlord),
    previousLandlordDisputeDisclosed: Boolean(
      data.previousLandlordDisputeDisclosed,
    ),
    evictedBefore: Boolean(data.evictedBefore),
    currentlyEmployed,
    completenessRatio,
  };

  const score = scoreTenantApplication(scoreInput);

  const submittedAt = new Date().toISOString();

  const header = [
    `Goldstay tenant application`,
    `Submitted: ${submittedAt}`,
    `Token: ${data.token || "(none)"}`,
    "",
    `Applicant: ${data.fullName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone} · WhatsApp: ${data.whatsapp ?? "(same)"}`,
    `Applying for: ${data.applyingFor ?? "(not specified)"}`,
    `Referred by: ${data.referredBy ?? "(none)"}`,
    "",
    `Provisional grade: ${score.grade}  (score ${score.total}/100)`,
    `Income to rent ratio: ${score.incomeRatio.toFixed(2)}x`,
    "",
    "Scoring rationale:",
    ...score.rationale.map((r) => `  - ${r}`),
  ].join("\n");

  const body =
    header +
    "\n" +
    formatSection("Identity", [
      ["Full name", data.fullName],
      ["Date of birth", data.dob],
      ["Nationality", data.nationality],
      ["ID type", data.idType],
      ["ID number", data.idNumber],
      ["Marital status", data.maritalStatus],
      ["Dependants", data.dependants],
      ["Current city", data.currentCity],
      ["Current address", data.currentAddress],
    ]) +
    formatSection("Employment & income", [
      ["Employment type", data.employmentType],
      ["Employer", data.employer],
      ["Job title", data.jobTitle],
      ["Months in role", data.employmentMonths],
      ["Employer phone", data.employerPhone],
      ["Employer email", data.employerEmail],
      ["Monthly income (USD)", data.monthlyIncomeUsd],
      ["Other monthly income (USD)", data.secondaryIncomeUsd],
      ["Bank / mobile money", data.bankName],
      ["Can provide statement", data.canProvideStatement],
    ]) +
    formatSection("The property", [
      ["Current rent (USD)", data.currentRentUsd],
      ["Target rent (USD)", data.targetRentUsd],
      ["Move-in date", data.moveInDate],
      ["Reason for moving", data.reasonForMoving],
    ]) +
    formatSection("Previous landlord", [
      ["Has previous landlord", data.hasPreviousLandlord],
      ["Name", data.previousLandlordName],
      ["Phone", data.previousLandlordPhone],
      ["Property", data.previousLandlordProperty],
      ["Months tenure", data.previousLandlordMonthsTenure],
      ["Rent paid (USD)", data.previousLandlordRentUsd],
      ["Dispute disclosed", data.previousLandlordDisputeDisclosed],
      ["Notes", data.previousLandlordNotes],
    ]) +
    formatSection("Guarantor & next of kin", [
      ["Has guarantor", data.hasGuarantor],
      ["Guarantor name", data.guarantorName],
      ["Guarantor relation", data.guarantorRelation],
      ["Guarantor phone", data.guarantorPhone],
      ["Guarantor email", data.guarantorEmail],
      ["Next of kin name", data.nextOfKinName],
      ["Next of kin relation", data.nextOfKinRelation],
      ["Next of kin phone", data.nextOfKinPhone],
    ]) +
    formatSection("Disclosures", [
      ["Evicted before", data.evictedBefore],
      ["Eviction explanation", data.evictionExplanation],
      ["Fraud conviction", data.convictedOfFraud],
      ["Conviction explanation", data.convictionExplanation],
    ]);

  // Landlord vacancy lead: when the applicant named a previous landlord with a
  // phone number, that landlord is about to have a vacant unit. We surface it
  // to ops as a separate block so they can reach out with a Goldstay pitch
  // before someone else fills the gap.
  const landlordLead =
    data.hasPreviousLandlord && data.previousLandlordPhone
      ? [
          "",
          "== VACANCY LEAD ==",
          `Landlord ${data.previousLandlordName ?? "(name not given)"} at ${data.previousLandlordPhone}`,
          `Property: ${data.previousLandlordProperty ?? "(not given)"}`,
          `Tenant ${data.fullName} is moving out around ${data.moveInDate ?? "soon"}.`,
          "Suggested action: WhatsApp the landlord this week to introduce Goldstay.",
          "",
        ].join("\n")
      : "";

  const finalBody = body + landlordLead;

  const inbox = process.env.TENANT_OPS_INBOX || process.env.CONTACT_INBOX || "hello@goldstay.com";
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "Goldstay Ops <ops@goldstay.com>",
        to: [inbox],
        replyTo: (data.email as string) || undefined,
        subject: `Tenant application · ${data.fullName} · Grade ${score.grade} (${score.total}/100)`,
        text: finalBody,
      });
    } catch (e) {
      console.error("Tenant application email failed", e);
    }
  } else {
    console.log("[goldstay tenant-application]\n" + finalBody);
  }

  return NextResponse.json({ ok: true });
}
