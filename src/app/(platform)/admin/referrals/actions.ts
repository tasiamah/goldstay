"use server";

// Operator actions for the referral programme.
//
// Three permissions rather than one, because the actions differ in
// kind. Reading tells you who introduced whom; writing moves a
// referral along and can originate a year of commission; paying
// declares that money left Goldstay. The person chasing an agent for
// introductions is not usually the person who should be able to say
// they have been paid, so `referral.payout` is held by accounting
// while `referral.write` is held by operations.
//
// Every mutation records an audit row against the referrer, so a
// question about an agent's money has one place to be answered from.

import { revalidatePath } from "next/cache";
import type { ReferralStatus, ReferrerStatus } from "@prisma/client";
import { currentAuditActor, requireRole } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import {
  cancelPayout,
  linkReferralToClient,
  markPayoutPaid,
  markReferralSigned,
  setReferralStatus,
  setReferrerStatus,
  setReferrerTerms,
} from "@/lib/referrals/db";
import {
  canSettlePayout,
  canTransitionReferral,
  REFERRAL_STATUS_LABEL,
  REFERRER_STATUS_LABEL,
} from "@/lib/referrals/lifecycle";

export type ActionResult = { ok: true; message: string } | { ok: false; error: string };

function refresh(referrerId: string) {
  revalidatePath("/admin/referrals");
  revalidatePath(`/admin/referrals/${referrerId}`);
}

// Resolves the referrer a referral belongs to. Needed because audit
// rows are keyed to the referrer and because every redirect after a
// referral-level action goes back to their page.
async function referrerIdFor(referralId: string): Promise<string | null> {
  const row = await prisma.referral.findUnique({
    where: { id: referralId },
    select: { referrerId: true },
  });
  return row?.referrerId ?? null;
}

export async function setReferrerStatusAction(
  referrerId: string,
  status: ReferrerStatus,
): Promise<ActionResult> {
  await requireRole("referral.write");
  const actor = await currentAuditActor();

  const referrer = await prisma.referrer.findUnique({
    where: { id: referrerId },
    select: { fullName: true, status: true },
  });
  if (!referrer) return { ok: false, error: "That referrer no longer exists." };
  if (referrer.status === status) {
    return { ok: false, error: `They are already ${REFERRER_STATUS_LABEL[status].toLowerCase()}.` };
  }

  // Terminating cancels every unpaid commission, which is not
  // something to discover afterwards.
  const cancelled =
    status === "TERMINATED"
      ? await prisma.referralPayout.count({
          where: { status: "SCHEDULED", referral: { referrerId } },
        })
      : 0;

  await setReferrerStatus({ id: referrerId, status });

  await recordAudit({
    actor,
    entity: "REFERRER",
    entityId: referrerId,
    action: `referrer.${status.toLowerCase()}`,
    summary:
      status === "TERMINATED" && cancelled > 0
        ? `Terminated ${referrer.fullName} and cancelled ${cancelled} scheduled payout${cancelled === 1 ? "" : "s"}`
        : `Set ${referrer.fullName} to ${REFERRER_STATUS_LABEL[status].toLowerCase()}`,
    metadata: { from: referrer.status, to: status, cancelledPayouts: cancelled },
  });

  refresh(referrerId);
  return {
    ok: true,
    message:
      status === "TERMINATED" && cancelled > 0
        ? `Terminated. ${cancelled} scheduled payout${cancelled === 1 ? "" : "s"} cancelled; anything already paid stands.`
        : `Now ${REFERRER_STATUS_LABEL[status].toLowerCase()}.`,
  };
}

export async function setReferrerTermsAction(
  referrerId: string,
  input: {
    longTermPct: number | null;
    shortStayPct: number | null;
    payoutMonths: number | null;
  },
): Promise<ActionResult> {
  await requireRole("referral.write");
  const actor = await currentAuditActor();

  // Percentages are stored as ratios (0.25 = 25%). Anything above 1
  // would pay a referrer more than the whole management fee.
  for (const [label, value] of [
    ["long-term share", input.longTermPct],
    ["short-stay share", input.shortStayPct],
  ] as const) {
    if (value !== null && (!Number.isFinite(value) || value < 0 || value > 1)) {
      return { ok: false, error: `The ${label} must be between 0% and 100%.` };
    }
  }
  if (
    input.payoutMonths !== null &&
    (!Number.isInteger(input.payoutMonths) ||
      input.payoutMonths < 1 ||
      input.payoutMonths > 60)
  ) {
    return { ok: false, error: "Payout months must be a whole number between 1 and 60." };
  }

  await setReferrerTerms({ id: referrerId, ...input });

  await recordAudit({
    actor,
    entity: "REFERRER",
    entityId: referrerId,
    action: "referrer.terms_changed",
    summary: "Changed commission terms",
    metadata: { ...input },
  });

  refresh(referrerId);
  return {
    ok: true,
    // Existing schedules are snapshots, so this only affects future
    // signings. Saying so avoids someone changing the rate to fix a
    // payout that has already been generated.
    message: "Terms saved. They apply to referrals signed from now on, not to schedules already generated.",
  };
}

export async function setReferralStatusAction(
  referralId: string,
  status: ReferralStatus,
): Promise<ActionResult> {
  await requireRole("referral.write");
  const actor = await currentAuditActor();

  const referral = await prisma.referral.findUnique({
    where: { id: referralId },
    select: {
      status: true,
      landlordName: true,
      referrerId: true,
      referrer: { select: { fullName: true } },
    },
  });
  if (!referral) return { ok: false, error: "That referral no longer exists." };

  if (status === "SIGNED") {
    // Signing needs the rent and the fee to build a schedule from.
    // Routing it through here would leave a referral that looks
    // settled with nothing scheduled against it.
    return {
      ok: false,
      error: "Use the sign form so the commission schedule is generated.",
    };
  }

  if (!canTransitionReferral(referral.status, status)) {
    return {
      ok: false,
      error: `Cannot go from ${REFERRAL_STATUS_LABEL[referral.status].toLowerCase()} to ${REFERRAL_STATUS_LABEL[status].toLowerCase()}.`,
    };
  }

  await setReferralStatus({ id: referralId, status });

  await recordAudit({
    actor,
    entity: "REFERRER",
    entityId: referral.referrerId,
    action: `referral.${status.toLowerCase()}`,
    summary: `${referral.landlordName} marked ${REFERRAL_STATUS_LABEL[status].toLowerCase()}`,
    metadata: { referralId, from: referral.status, to: status },
  });

  refresh(referral.referrerId);
  return { ok: true, message: `Marked ${REFERRAL_STATUS_LABEL[status].toLowerCase()}.` };
}

export async function linkReferralToClientAction(
  referralId: string,
  clientId: string | null,
): Promise<ActionResult> {
  await requireRole("referral.write");
  const actor = await currentAuditActor();

  const referrerId = await referrerIdFor(referralId);
  if (!referrerId) return { ok: false, error: "That referral no longer exists." };

  if (clientId) {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { fullName: true },
    });
    if (!client) return { ok: false, error: "That client no longer exists." };

    await linkReferralToClient({ referralId, clientId });
    await recordAudit({
      actor,
      entity: "REFERRER",
      entityId: referrerId,
      action: "referral.linked",
      summary: `Linked a referral to ${client.fullName}`,
      metadata: { referralId, clientId },
    });
    refresh(referrerId);
    return { ok: true, message: `Linked to ${client.fullName}.` };
  }

  await linkReferralToClient({ referralId, clientId: null });
  await recordAudit({
    actor,
    entity: "REFERRER",
    entityId: referrerId,
    action: "referral.unlinked",
    summary: "Unlinked a referral from its client",
    metadata: { referralId },
  });
  refresh(referrerId);
  return { ok: true, message: "Unlinked." };
}

export async function markReferralSignedAction(
  referralId: string,
  input: {
    monthlyRentUsd: number;
    managementFeePct: number;
    strategy: "long-term" | "short-stay";
  },
): Promise<ActionResult> {
  await requireRole("referral.write");
  const actor = await currentAuditActor();

  const referral = await prisma.referral.findUnique({
    where: { id: referralId },
    select: { status: true, landlordName: true, referrerId: true },
  });
  if (!referral) return { ok: false, error: "That referral no longer exists." };

  if (!canTransitionReferral(referral.status, "SIGNED")) {
    return {
      ok: false,
      error:
        referral.status === "SIGNED"
          ? "This referral is already signed. Its commission schedule exists; changing the terms now would not be the terms the referrer was promised."
          : `Cannot sign a referral that is ${REFERRAL_STATUS_LABEL[referral.status].toLowerCase()}.`,
    };
  }

  // These numbers originate a year of payments, so they are checked
  // rather than trusted. The upper bounds are deliberately generous
  // but present: a mistyped rent is the failure mode that pays an
  // agent a hundred times what they earned.
  if (!Number.isFinite(input.monthlyRentUsd) || input.monthlyRentUsd <= 0) {
    return { ok: false, error: "Enter the monthly rent in USD." };
  }
  if (input.monthlyRentUsd > 100_000) {
    return {
      ok: false,
      error:
        "That rent is over $100,000 a month. If it is really in dollars, ask an engineer to raise the limit — otherwise it looks like a shilling figure.",
    };
  }
  if (
    !Number.isFinite(input.managementFeePct) ||
    input.managementFeePct <= 0 ||
    input.managementFeePct > 1
  ) {
    return { ok: false, error: "The management fee must be between 0% and 100%." };
  }

  await markReferralSigned({
    referralId,
    monthlyRentUsd: input.monthlyRentUsd,
    managementFeePct: input.managementFeePct,
    strategy: input.strategy,
  });

  const scheduled = await prisma.referralPayout.aggregate({
    where: { referralId },
    _count: { _all: true },
    _sum: { amountUsd: true },
  });
  const total = Number(scheduled._sum.amountUsd?.toString() ?? "0");

  await recordAudit({
    actor,
    entity: "REFERRER",
    entityId: referral.referrerId,
    action: "referral.signed",
    summary: `${referral.landlordName} signed — scheduled ${scheduled._count._all} payout${scheduled._count._all === 1 ? "" : "s"} totalling $${total.toFixed(2)}`,
    metadata: { referralId, ...input, payoutCount: scheduled._count._all, totalUsd: total },
  });

  refresh(referral.referrerId);
  return {
    ok: true,
    message: `Signed. ${scheduled._count._all} payout${scheduled._count._all === 1 ? "" : "s"} scheduled, $${total.toFixed(2)} in total.`,
  };
}

export async function markPayoutPaidAction(
  payoutId: string,
  reference: string,
): Promise<ActionResult> {
  await requireRole("referral.payout");
  const actor = await currentAuditActor();

  const payout = await prisma.referralPayout.findUnique({
    where: { id: payoutId },
    select: {
      status: true,
      amountUsd: true,
      monthIndex: true,
      referral: {
        select: { landlordName: true, referrerId: true },
      },
    },
  });
  if (!payout) return { ok: false, error: "That payout no longer exists." };
  if (!canSettlePayout(payout.status)) {
    return {
      ok: false,
      error:
        payout.status === "PAID"
          ? "This one is already paid. Marking it again would overwrite the reference of the payment that actually went out."
          : "This payout was cancelled.",
    };
  }

  const settled = await markPayoutPaid({ id: payoutId, reference });
  // False means somebody else settled it between the read and the
  // write. Their reference is the correct one; leave it alone.
  if (!settled) {
    return { ok: false, error: "Someone else marked this paid a moment ago. Reload to see it." };
  }

  const amount = Number(payout.amountUsd.toString());
  await recordAudit({
    actor,
    entity: "REFERRER",
    entityId: payout.referral.referrerId,
    action: "referral.payout_paid",
    summary: `Paid $${amount.toFixed(2)} — month ${payout.monthIndex} for ${payout.referral.landlordName}`,
    metadata: { payoutId, amountUsd: amount, reference: reference.trim() || null },
  });

  refresh(payout.referral.referrerId);
  revalidatePath("/admin/referrals/due");
  return { ok: true, message: `Marked $${amount.toFixed(2)} paid.` };
}

export async function cancelPayoutAction(payoutId: string): Promise<ActionResult> {
  await requireRole("referral.payout");
  const actor = await currentAuditActor();

  const payout = await prisma.referralPayout.findUnique({
    where: { id: payoutId },
    select: {
      status: true,
      amountUsd: true,
      monthIndex: true,
      referral: { select: { landlordName: true, referrerId: true } },
    },
  });
  if (!payout) return { ok: false, error: "That payout no longer exists." };
  if (!canSettlePayout(payout.status)) {
    return { ok: false, error: "Only a scheduled payout can be cancelled." };
  }

  const cancelled = await cancelPayout(payoutId);
  if (!cancelled) {
    return { ok: false, error: "Someone else changed this a moment ago. Reload to see it." };
  }

  const amount = Number(payout.amountUsd.toString());
  await recordAudit({
    actor,
    entity: "REFERRER",
    entityId: payout.referral.referrerId,
    action: "referral.payout_cancelled",
    summary: `Cancelled $${amount.toFixed(2)} — month ${payout.monthIndex} for ${payout.referral.landlordName}`,
    metadata: { payoutId, amountUsd: amount },
  });

  refresh(payout.referral.referrerId);
  revalidatePath("/admin/referrals/due");
  return { ok: true, message: "Cancelled." };
}
