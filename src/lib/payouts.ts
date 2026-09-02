// Client payout method helper.
//
// One client has zero or more payout methods; exactly one is the
// default. Each row is unverified at creation; an admin reviews
// the matching PROOF_OF_PAYOUT_ACCOUNT document and flips
// `verifiedAt`. Server-side guards (see recordPayoutAction) refuse
// to create a Transaction.PAYOUT against an unverified row, so the
// platform can't accidentally remit money to an unverified
// beneficiary.
//
// The shape captured varies by `kind`. We keep all fields on a
// single denormalised row rather than four sub-tables because the
// total field count is small (~12), the access pattern is always
// "load the row, render it" not "query by bank name", and the
// admin form is materially simpler when there's one row to write.

import {
  Prisma,
  type ClientPayoutMethod,
  type PayoutMethodKind,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { recordAudit, type AuditActor } from "@/lib/audit";

export type CreatePayoutMethodInput = {
  clientId: string;
  kind: PayoutMethodKind;
  label: string;
  currency: string;
  beneficiaryName: string;
  // Bank-shaped (LOCAL_BANK, SWIFT_BANK).
  bankName?: string | null;
  bankCountry?: string | null;
  branchCode?: string | null;
  accountNumber?: string | null;
  iban?: string | null;
  swift?: string | null;
  // Wise-shaped.
  wiseEmail?: string | null;
  // M-Pesa-shaped.
  mpesaPhone?: string | null;
  // Optional address line for SWIFT remittances.
  beneficiaryAddress?: string | null;
  internalNotes?: string | null;
  // Whether to make this the new default for the client. The action
  // promotes atomically; if the client has another default, it gets
  // demoted in the same transaction.
  isDefault?: boolean;
  actor: AuditActor;
};

// Each kind requires a different minimum field set. We validate
// here (not just at the form layer) so a stale form payload or a
// direct API call can't land a half-populated row that later
// breaks the payout flow.
function requiredFieldErrors(
  kind: PayoutMethodKind,
  input: Partial<CreatePayoutMethodInput>,
): string[] {
  const missing: string[] = [];
  if (!input.label?.trim()) missing.push("label");
  if (!input.currency?.trim()) missing.push("currency");
  if (!input.beneficiaryName?.trim()) missing.push("beneficiaryName");

  if (kind === "WISE") {
    if (!input.wiseEmail?.trim()) missing.push("wiseEmail");
  } else if (kind === "MPESA") {
    if (!input.mpesaPhone?.trim()) missing.push("mpesaPhone");
  } else if (kind === "LOCAL_BANK" || kind === "SWIFT_BANK") {
    if (!input.bankName?.trim()) missing.push("bankName");
    if (!input.accountNumber?.trim() && !input.iban?.trim()) {
      missing.push("accountNumber|iban");
    }
    if (kind === "SWIFT_BANK" && !input.swift?.trim()) missing.push("swift");
  }
  return missing;
}

export type PayoutMethodResult =
  | { ok: true; method: ClientPayoutMethod }
  | { ok: false; error: string; missing?: string[] };

export async function createPayoutMethod(
  input: CreatePayoutMethodInput,
): Promise<PayoutMethodResult> {
  const missing = requiredFieldErrors(input.kind, input);
  if (missing.length > 0) {
    return { ok: false, error: "Missing required fields.", missing };
  }

  const client = await prisma.client.findUnique({
    where: { id: input.clientId },
    select: { id: true },
  });
  if (!client) return { ok: false, error: "Client not found." };

  // Promote-as-default is atomic with the create so we never have
  // a momentary state of two defaults (which the application layer
  // is the only thing enforcing single-default-per-client against).
  const method = await prisma.$transaction(async (tx) => {
    if (input.isDefault) {
      await tx.clientPayoutMethod.updateMany({
        where: {
          clientId: input.clientId,
          isDefault: true,
          archivedAt: null,
        },
        data: { isDefault: false },
      });
    }
    return tx.clientPayoutMethod.create({
      data: {
        clientId: input.clientId,
        kind: input.kind,
        label: input.label.trim(),
        currency: input.currency.trim().toUpperCase(),
        beneficiaryName: input.beneficiaryName.trim(),
        bankName: input.bankName?.trim() || null,
        bankCountry: input.bankCountry?.trim() || null,
        branchCode: input.branchCode?.trim() || null,
        accountNumber: input.accountNumber?.trim() || null,
        iban: input.iban?.trim() || null,
        swift: input.swift?.trim() || null,
        wiseEmail: input.wiseEmail?.trim() || null,
        mpesaPhone: input.mpesaPhone?.trim() || null,
        beneficiaryAddress: input.beneficiaryAddress?.trim() || null,
        internalNotes: input.internalNotes?.trim() || null,
        isDefault: Boolean(input.isDefault),
      },
    });
  });

  // Twin audit rows: PAYOUT_METHOD-keyed for the per-method
  // timeline + activity feed, CLIENT-keyed so the client detail's
  // overall timeline keeps a continuous account of significant
  // changes. Same pattern used by lead.converted.
  await Promise.all([
    recordAudit({
      actor: input.actor,
      entity: "PAYOUT_METHOD",
      entityId: method.id,
      action: "payout.added",
      summary: `Payout method "${method.label}" added (${method.kind})`,
      metadata: { payoutMethodId: method.id, clientId: input.clientId, kind: method.kind },
    }),
    recordAudit({
      actor: input.actor,
      entity: "CLIENT",
      entityId: input.clientId,
      action: "payout.added",
      summary: `Payout method "${method.label}" added (${method.kind})`,
      metadata: { payoutMethodId: method.id, kind: method.kind },
    }),
  ]);

  return { ok: true, method };
}

export async function setDefaultPayoutMethod(
  payoutMethodId: string,
  actor: AuditActor,
): Promise<PayoutMethodResult> {
  const target = await prisma.clientPayoutMethod.findUnique({
    where: { id: payoutMethodId },
  });
  if (!target) return { ok: false, error: "Payout method not found." };
  if (target.archivedAt) {
    return { ok: false, error: "Cannot set an archived method as default." };
  }
  const updated = await prisma.$transaction(async (tx) => {
    await tx.clientPayoutMethod.updateMany({
      where: {
        clientId: target.clientId,
        isDefault: true,
        id: { not: payoutMethodId },
      },
      data: { isDefault: false },
    });
    return tx.clientPayoutMethod.update({
      where: { id: payoutMethodId },
      data: { isDefault: true },
    });
  });
  await Promise.all([
    recordAudit({
      actor,
      entity: "PAYOUT_METHOD",
      entityId: payoutMethodId,
      action: "payout.defaulted",
      summary: `Set as default payout method`,
      metadata: { clientId: target.clientId },
    }),
    recordAudit({
      actor,
      entity: "CLIENT",
      entityId: target.clientId,
      action: "payout.defaulted",
      summary: `Default payout set to "${updated.label}"`,
      metadata: { payoutMethodId },
    }),
  ]);
  return { ok: true, method: updated };
}

export async function verifyPayoutMethod(
  payoutMethodId: string,
  actor: AuditActor,
): Promise<PayoutMethodResult> {
  if (!actor.adminId) {
    return { ok: false, error: "Only admins can verify payout methods." };
  }
  const target = await prisma.clientPayoutMethod.findUnique({
    where: { id: payoutMethodId },
  });
  if (!target) return { ok: false, error: "Payout method not found." };
  if (target.archivedAt) {
    return { ok: false, error: "Cannot verify an archived method." };
  }
  const updated = await prisma.clientPayoutMethod.update({
    where: { id: payoutMethodId },
    data: {
      verifiedAt: new Date(),
      verifiedByAdminId: actor.adminId,
    },
  });
  await Promise.all([
    recordAudit({
      actor,
      entity: "PAYOUT_METHOD",
      entityId: payoutMethodId,
      action: "payout.verified",
      summary: `Payout method verified`,
      metadata: { clientId: target.clientId },
    }),
    recordAudit({
      actor,
      entity: "CLIENT",
      entityId: target.clientId,
      action: "payout.verified",
      summary: `Payout method "${updated.label}" verified`,
      metadata: { payoutMethodId },
    }),
  ]);
  return { ok: true, method: updated };
}

export async function archivePayoutMethod(
  payoutMethodId: string,
  actor: AuditActor,
): Promise<PayoutMethodResult> {
  const target = await prisma.clientPayoutMethod.findUnique({
    where: { id: payoutMethodId },
  });
  if (!target) return { ok: false, error: "Payout method not found." };
  if (target.archivedAt) {
    return { ok: true, method: target };
  }
  const updated = await prisma.clientPayoutMethod.update({
    where: { id: payoutMethodId },
    data: {
      archivedAt: new Date(),
      // Archiving a default also drops the default flag so the next
      // payout dialog doesn't autoselect a dead method.
      isDefault: false,
    },
  });
  await Promise.all([
    recordAudit({
      actor,
      entity: "PAYOUT_METHOD",
      entityId: payoutMethodId,
      action: "payout.archived",
      summary: `Payout method archived`,
      metadata: { clientId: target.clientId },
    }),
    recordAudit({
      actor,
      entity: "CLIENT",
      entityId: target.clientId,
      action: "payout.archived",
      summary: `Payout method "${updated.label}" archived`,
      metadata: { payoutMethodId },
    }),
  ]);
  return { ok: true, method: updated };
}

// Used by the admin record-payout dialog and the cron statement
// note: only verified, non-archived methods are payable.
export async function listPayablePayoutMethods(
  clientId: string,
): Promise<ClientPayoutMethod[]> {
  return prisma.clientPayoutMethod.findMany({
    where: {
      clientId,
      archivedAt: null,
      verifiedAt: { not: null },
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function listPayoutMethodsFor(
  clientId: string,
  options: { includeArchived?: boolean } = {},
): Promise<ClientPayoutMethod[]> {
  const where: Prisma.ClientPayoutMethodWhereInput = { clientId };
  if (!options.includeArchived) where.archivedAt = null;
  return prisma.clientPayoutMethod.findMany({
    where,
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

// ---------- Pure helpers ----------

export const PAYOUT_METHOD_LABEL: Record<PayoutMethodKind, string> = {
  WISE: "Wise",
  SWIFT_BANK: "International bank (SWIFT)",
  LOCAL_BANK: "Local bank",
  MPESA: "M-Pesa",
};

// One-line render of the destination, suitable for confirmation
// dialogs and statement footers. Never includes secrets in full —
// account numbers and IBANs get masked except for the last four
// digits, which is enough to disambiguate without leaking on
// shared screens.
export function summarisePayoutMethod(method: ClientPayoutMethod): string {
  if (method.kind === "WISE") {
    return `Wise · ${method.wiseEmail ?? "?"} (${method.currency})`;
  }
  if (method.kind === "MPESA") {
    return `M-Pesa · ${method.mpesaPhone ?? "?"}`;
  }
  const accountTail = lastFour(method.iban ?? method.accountNumber ?? "");
  const bank = method.bankName ?? "Bank";
  return `${bank} · ${method.currency} · …${accountTail}`;
}

function lastFour(s: string): string {
  const trimmed = s.replace(/\s+/g, "");
  if (trimmed.length <= 4) return trimmed;
  return trimmed.slice(-4);
}
