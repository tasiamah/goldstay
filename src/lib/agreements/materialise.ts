// Materialises a SIGNED ManagementAgreement as a PDF stored in
// Supabase Storage and attached to the property as a Document row.
// Idempotent: the second call returns the existing Document without
// re-rendering or re-uploading.
//
// Called from the client PDF route on first download after signature
// (so the user doesn't pay the render latency at sign time) and can
// also be invoked from a backfill script.

import { renderToBuffer } from "@react-pdf/renderer";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  DOCUMENTS_BUCKET,
  buildStoragePath,
  ensureDocumentsBucket,
} from "@/lib/storage";
import { prisma } from "@/lib/db";
import { AgreementDocument } from "./AgreementDocument";
import { AGREEMENT_TEMPLATE_TITLE, renderAgreement } from "./template";
import { formatCommissionPct, formatMoney } from "./format";
import { formatPropertyDisplayName } from "@/lib/format-property";

export type MaterialisedAgreement = {
  documentId: string;
  storagePath: string;
};

export async function materialiseSignedAgreement(
  agreementId: string,
): Promise<MaterialisedAgreement> {
  const agreement = await prisma.managementAgreement.findUnique({
    where: { id: agreementId },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          unitNumber: true,
          city: true,
          address: true,
          propertyType: true,
          bedrooms: true,
          maxOccupancy: true,
          launchedAt: true,
          client: {
            select: {
              fullName: true,
              email: true,
              companyName: true,
              companyRegistrationNumber: true,
              idNumber: true,
              kraPin: true,
              address: true,
              preferredCurrency: true,
            },
          },
        },
      },
      document: { select: { id: true, storagePath: true } },
    },
  });
  if (!agreement) throw new Error("agreement not found");
  if (agreement.status !== "SIGNED") {
    throw new Error("agreement is not signed");
  }
  if (!agreement.signedAt || !agreement.signedByName) {
    throw new Error("agreement is missing signature record");
  }

  // Already materialised — fast path. We trust the document row over
  // a re-render so a previously executed PDF stays bit-for-bit
  // identical across downloads.
  if (agreement.document?.id) {
    return {
      documentId: agreement.document.id,
      storagePath: agreement.document.storagePath,
    };
  }

  const propertyDisplayName = formatPropertyDisplayName(
    agreement.property.name,
    agreement.property.unitNumber,
  );
  const client = agreement.property.client;
  const currency = agreement.earlyExitFeeCurrency;
  const money = (value: typeof agreement.startupCostsBudget) =>
    value === null ? null : formatMoney(value.toString(), currency);

  const commissionPct = formatCommissionPct(agreement.commissionRate.toString());
  const earlyExitFeeFormatted = formatMoney(
    agreement.earlyExitFee.toString(),
    currency,
  );
  const title = AGREEMENT_TEMPLATE_TITLE[agreement.template];

  // Rendered from the row's stored template, so an agreement reprints
  // as the contract it was accepted under even after we add or change
  // templates.
  const sections = renderAgreement({
    template: agreement.template,
    clientName: client.fullName,
    clientCompany: client.companyName,
    clientIdNumber: client.companyName
      ? client.companyRegistrationNumber
      : client.idNumber,
    clientKraPin: client.kraPin,
    clientAddress: client.address,
    propertyName: propertyDisplayName,
    propertyAddress: agreement.property.address,
    propertyCity: agreement.property.city,
    bedrooms: agreement.property.bedrooms,
    maxOccupancy: agreement.property.maxOccupancy,
    isShortTerm: agreement.property.propertyType === "SHORT_TERM",
    signingCapacity: agreement.signingCapacity,
    governingLaw: agreement.governingLaw,
    termMonths: agreement.termMonths,
    commissionPct,
    earlyExitFeeFormatted,
    noticePeriodDays: agreement.noticePeriodDays,
    payoutCurrency: client.preferredCurrency,
    startupCostsBudgetFormatted: money(agreement.startupCostsBudget),
    operatingReserveFormatted: money(agreement.operatingReserve),
    reference: agreement.reference,
    startDate: agreement.sentAt ?? agreement.generatedAt,
    launchDate: agreement.property.launchedAt,
  });

  const pdfBuffer = await renderToBuffer(
    AgreementDocument({
      agreementId: agreement.id,
      clientName: client.fullName,
      clientEmail: client.email,
      propertyDisplayName,
      governingLaw: agreement.governingLaw,
      termMonths: agreement.termMonths,
      commissionPct,
      noticePeriodDays: agreement.noticePeriodDays,
      earlyExitFeeFormatted,
      sections,
      title,
      templateVersion: agreement.templateVersion,
      reference: agreement.reference,
      signingCapacity: agreement.signingCapacity,
      signedAt: agreement.signedAt,
      signedByName: agreement.signedByName,
      signedByIp: agreement.signedByIp,
      signedByUserAgent: agreement.signedByUserAgent,
      acceptedByUserId: agreement.acceptedByUserId,
      acceptanceReference: agreement.acceptanceReference,
    }),
  );

  await ensureDocumentsBucket();

  // Generate the document id up front so we can use it in the
  // storage path AND use the same id on the row insert. Cuid via
  // Prisma's default isn't accessible at this layer, so we lean on
  // Postgres to generate it via a transaction-wrapped create.
  const created = await prisma.$transaction(async (tx) => {
    const docRow = await tx.document.create({
      data: {
        propertyId: agreement.property.id,
        kind: "MANAGEMENT_AGREEMENT",
        title: `GoldStay ${title.toLowerCase()}: ${propertyDisplayName}`,
        // Real path is filled in immediately below; keeping a
        // sentinel here means a half-failed upload doesn't leave a
        // misleading "this row points to a real file" record around.
        storagePath: "pending",
        mimeType: "application/pdf",
        sizeBytes: pdfBuffer.byteLength,
      },
    });
    const path = buildStoragePath({
      propertyId: agreement.property.id,
      documentId: docRow.id,
      filename: "goldstay-management-agreement.pdf",
    });
    return { docRow, path };
  });

  const supabase = createSupabaseAdminClient();
  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(created.path, new Uint8Array(pdfBuffer), {
      contentType: "application/pdf",
      upsert: true,
    });
  if (uploadError) {
    // Roll back the bookkeeping rows so a transient storage failure
    // doesn't leave a "pending" Document row around forever.
    await prisma.document.delete({ where: { id: created.docRow.id } });
    throw uploadError;
  }

  const [updatedDoc] = await prisma.$transaction([
    prisma.document.update({
      where: { id: created.docRow.id },
      data: { storagePath: created.path },
    }),
    prisma.managementAgreement.update({
      where: { id: agreement.id },
      data: { documentId: created.docRow.id },
    }),
  ]);

  return { documentId: updatedDoc.id, storagePath: updatedDoc.storagePath };
}
