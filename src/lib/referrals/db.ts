// Prisma-backed helpers for the referral programme.
//
// All side-effecting database access goes through this module so the
// API routes stay thin and the dashboard server component reads its
// data through a single, typed surface. Pure logic (codes, payouts)
// lives in sibling modules and is unit-tested.

import { Prisma } from "@prisma/client";
import type {
  Referral,
  Referrer,
  ReferrerType,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  generateDashboardToken,
  generateReferrerCode,
  isValidReferrerCode,
} from "./codes";
import {
  buildPayoutSchedule,
  resolveTermsForReferrer,
  type ResolvedTerms,
} from "./payouts";

// Caps the retry loop on code generation. 32^8 ≈ 1.1e12 keys means
// a collision after a handful of retries indicates an RNG bug, not
// a populated keyspace; bail loudly rather than spin.
const MAX_CODE_GENERATION_RETRIES = 8;

export type CreateReferrerInput = {
  type: ReferrerType;
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  country?: string;
};

// Atomic create with retry-on-collision. Email and code are both
// uniquely indexed, so an existing email returns a duplicate-error
// to the caller (the route handler turns it into a 409 + "use the
// dashboard link in your inbox" message).
export async function createReferrer(
  input: CreateReferrerInput,
): Promise<Referrer> {
  for (let attempt = 0; attempt < MAX_CODE_GENERATION_RETRIES; attempt++) {
    try {
      return await prisma.referrer.create({
        data: {
          ...input,
          code: generateReferrerCode(),
          dashboardToken: generateDashboardToken(),
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        const target = (err.meta?.target as string[] | undefined) ?? [];
        if (target.includes("code") || target.includes("dashboardToken")) {
          // Code collision — retry. Email collision is a real
          // duplicate user; surface that to the route handler.
          continue;
        }
      }
      throw err;
    }
  }
  throw new Error("Failed to allocate a unique referrer code after retries");
}

export function findReferrerByCode(code: string) {
  if (!isValidReferrerCode(code)) return Promise.resolve(null);
  return prisma.referrer.findUnique({
    where: { code },
  });
}

export function findReferrerByDashboardToken(token: string) {
  // Tokens are 43-char base64url; reject anything obviously not a
  // token before we hit Postgres.
  if (typeof token !== "string" || token.length < 32 || token.length > 64) {
    return Promise.resolve(null);
  }
  return prisma.referrer.findUnique({
    where: { dashboardToken: token },
    include: {
      referrals: {
        orderBy: { createdAt: "desc" },
        include: { payouts: { orderBy: { monthIndex: "asc" } } },
      },
    },
  });
}

// Records a referral when an inbound landlord lead either:
//   1. Carries a `gs_ref` cookie set by the middleware, OR
//   2. Was submitted manually from the referrer's dashboard form.
//
// Idempotent on (referrerId, airtableLeadId): the same lead can't
// be attributed twice, so a re-fired form submission doesn't double-
// count. When airtableLeadId is null (Airtable down), we still create
// the row so attribution survives an outage.
export async function attachLeadToReferrer(args: {
  code: string;
  airtableLeadId: string | null;
  landlordName: string;
  landlordEmail?: string | null;
  landlordPhone?: string | null;
  city?: string | null;
  notes?: string | null;
}): Promise<Referral | null> {
  const referrer = await findReferrerByCode(args.code);
  if (!referrer) return null;
  if (referrer.status !== "ACTIVE") return null;

  if (args.airtableLeadId) {
    const existing = await prisma.referral.findFirst({
      where: {
        referrerId: referrer.id,
        airtableLeadId: args.airtableLeadId,
      },
    });
    if (existing) return existing;
  }

  return prisma.referral.create({
    data: {
      referrerId: referrer.id,
      airtableLeadId: args.airtableLeadId ?? undefined,
      landlordName: args.landlordName,
      landlordEmail: args.landlordEmail ?? undefined,
      landlordPhone: args.landlordPhone ?? undefined,
      city: args.city ?? undefined,
      notes: args.notes ?? undefined,
    },
  });
}

// Called by ops once a referred landlord has signed a management
// agreement. Snapshots the management terms onto the Referral row
// and atomically generates the full payout schedule for it.
//
// Idempotent: re-running on an already-SIGNED referral returns the
// existing schedule unchanged because the (referralId, monthIndex)
// uniqueness on ReferralPayout absorbs duplicate inserts.
export async function markReferralSigned(args: {
  referralId: string;
  signedAt?: Date;
  monthlyRentUsd: number;
  managementFeePct: number;
  strategy?: "long-term" | "short-stay";
}) {
  const signedAt = args.signedAt ?? new Date();
  const strategy = args.strategy ?? "long-term";

  return prisma.$transaction(async (tx) => {
    const referral = await tx.referral.update({
      where: { id: args.referralId },
      data: {
        status: "SIGNED",
        signedAt,
        monthlyRentUsd: new Prisma.Decimal(args.monthlyRentUsd),
        managementFeePct: new Prisma.Decimal(args.managementFeePct),
      },
      include: { referrer: true },
    });

    const terms: ResolvedTerms = resolveTermsForReferrer(referral.referrer);
    const schedule = buildPayoutSchedule({
      signedAt,
      monthlyRentUsd: args.monthlyRentUsd,
      managementFeePct: args.managementFeePct,
      strategy,
      terms,
    });

    if (schedule.length > 0) {
      await tx.referralPayout.createMany({
        data: schedule.map((row) => ({
          referralId: referral.id,
          monthIndex: row.monthIndex,
          amountUsd: new Prisma.Decimal(row.amountUsd),
          scheduledFor: row.scheduledFor,
        })),
        skipDuplicates: true,
      });
    }

    return referral;
  });
}

// Aggregates that the dashboard server component renders. Pulled
// together in one place so the dashboard page stays a thin presenter.
export function summariseReferrer(
  referrer: Referrer & {
    referrals: (Referral & {
      payouts: { amountUsd: Prisma.Decimal; status: string }[];
    })[];
  },
) {
  const counts = { attributed: 0, contacted: 0, signed: 0, churned: 0 };
  let lifetimeEarnedUsd = 0;
  let scheduledUsd = 0;

  for (const r of referrer.referrals) {
    if (r.status === "ATTRIBUTED" || r.status === "CONTACTED" || r.status === "QUALIFIED") {
      counts[r.status === "ATTRIBUTED" ? "attributed" : "contacted"]++;
    } else if (r.status === "SIGNED") {
      counts.signed++;
    } else if (r.status === "CHURNED") {
      counts.churned++;
    }
    for (const p of r.payouts) {
      const v = Number(p.amountUsd.toString());
      if (p.status === "PAID") lifetimeEarnedUsd += v;
      else if (p.status === "SCHEDULED") scheduledUsd += v;
    }
  }

  return {
    counts,
    lifetimeEarnedUsd: Math.round(lifetimeEarnedUsd * 100) / 100,
    scheduledUsd: Math.round(scheduledUsd * 100) / 100,
  };
}

// ---------------------------------------------------------------------
// Operator side
// ---------------------------------------------------------------------
//
// Everything above serves the public programme: signing up, being
// attributed a lead, checking your own dashboard. None of it let
// anybody at Goldstay see or act on any of it, which is why the
// programme ran for months with a working signup form, a working
// attribution cookie and nobody able to answer an agent asking where
// their money was.

export type ReferrerListRow = {
  id: string;
  fullName: string;
  email: string;
  companyName: string | null;
  code: string;
  type: ReferrerType;
  status: Referrer["status"];
  createdAt: Date;
  referralCount: number;
  signedCount: number;
  paidUsd: number;
  scheduledUsd: number;
  dueNowUsd: number;
};

// The referrer list, with the money already aggregated.
//
// Done in one query with nested selects rather than a count per row:
// the list is the first thing an operator opens and "how much do we
// owe this person" is the question it exists to answer, so it should
// not need a second click to find out.
export async function listReferrersForAdmin(
  now: Date = new Date(),
): Promise<ReferrerListRow[]> {
  const rows = await prisma.referrer.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      companyName: true,
      code: true,
      type: true,
      status: true,
      createdAt: true,
      referrals: {
        select: {
          status: true,
          payouts: {
            select: { amountUsd: true, status: true, scheduledFor: true },
          },
        },
      },
    },
  });

  return rows.map((r) => {
    let paidUsd = 0;
    let scheduledUsd = 0;
    let dueNowUsd = 0;
    let signedCount = 0;

    for (const referral of r.referrals) {
      if (referral.status === "SIGNED") signedCount++;
      for (const p of referral.payouts) {
        const amount = Number(p.amountUsd.toString());
        if (p.status === "PAID") paidUsd += amount;
        else if (p.status === "SCHEDULED") {
          scheduledUsd += amount;
          if (p.scheduledFor.getTime() <= now.getTime()) dueNowUsd += amount;
        }
      }
    }

    return {
      id: r.id,
      fullName: r.fullName,
      email: r.email,
      companyName: r.companyName,
      code: r.code,
      type: r.type,
      status: r.status,
      createdAt: r.createdAt,
      referralCount: r.referrals.length,
      signedCount,
      paidUsd: round2(paidUsd),
      scheduledUsd: round2(scheduledUsd),
      dueNowUsd: round2(dueNowUsd),
    };
  });
}

// One referrer with everything needed to act on them.
export async function findReferrerForAdmin(id: string) {
  return prisma.referrer.findUnique({
    where: { id },
    include: {
      referrals: {
        orderBy: { createdAt: "desc" },
        include: {
          payouts: { orderBy: { monthIndex: "asc" } },
          client: { select: { id: true, fullName: true, email: true } },
        },
      },
    },
  });
}

// Everything payable now, across all referrers, so paying people is
// one screen rather than a hunt through profiles. Ordered oldest
// first because the oldest unpaid commission is the one costing us
// goodwill.
export async function listPayoutsDue(now: Date = new Date()) {
  return prisma.referralPayout.findMany({
    where: { status: "SCHEDULED", scheduledFor: { lte: now } },
    orderBy: { scheduledFor: "asc" },
    include: {
      referral: {
        select: {
          id: true,
          landlordName: true,
          referrer: {
            select: { id: true, fullName: true, email: true, status: true },
          },
        },
      },
    },
  });
}

// Change a referrer's standing.
//
// TERMINATED additionally cancels every payout not yet paid, which
// the schema documents as the difference between pausing and
// terminating. Done in one transaction so a referrer can never be
// left terminated with live payouts still scheduled against them.
// PAID rows are untouched by design — that money has left the
// building and the record of it is not ours to revise.
export async function setReferrerStatus(args: {
  id: string;
  status: Referrer["status"];
}) {
  return prisma.$transaction(async (tx) => {
    const referrer = await tx.referrer.update({
      where: { id: args.id },
      data: { status: args.status },
    });

    if (args.status === "TERMINATED") {
      await tx.referralPayout.updateMany({
        where: {
          status: "SCHEDULED",
          referral: { referrerId: args.id },
        },
        data: { status: "CANCELLED" },
      });
    }

    return referrer;
  });
}

// Per-referrer commission overrides. Null clears an override and
// falls back to the type default, which is why each field is
// explicitly nullable rather than optional — "leave unchanged" and
// "reset to default" are different intentions and the form needs to
// express both.
export async function setReferrerTerms(args: {
  id: string;
  longTermPct: number | null;
  shortStayPct: number | null;
  payoutMonths: number | null;
}) {
  return prisma.referrer.update({
    where: { id: args.id },
    data: {
      longTermPctOverride:
        args.longTermPct === null ? null : new Prisma.Decimal(args.longTermPct),
      shortStayPctOverride:
        args.shortStayPct === null
          ? null
          : new Prisma.Decimal(args.shortStayPct),
      payoutMonthsOverride: args.payoutMonths,
    },
  });
}

// Move a referral along its lifecycle. Legality is the caller's to
// check via lifecycle.canTransitionReferral; this stamps the
// timestamp that goes with the destination.
//
// Deliberately refuses SIGNED. Signing originates a payout schedule
// and belongs to markReferralSigned, which needs the rent and fee to
// build one — routing it through here would produce a referral marked
// signed with nothing scheduled against it, which looks settled and
// pays nobody.
export async function setReferralStatus(args: {
  id: string;
  status: Exclude<Referral["status"], "SIGNED">;
}) {
  const data: Prisma.ReferralUpdateInput = { status: args.status };
  if (args.status === "CONTACTED") data.contactedAt = new Date();
  return prisma.referral.update({ where: { id: args.id }, data });
}

// Attach a referral to the client it became, or detach it.
export async function linkReferralToClient(args: {
  referralId: string;
  clientId: string | null;
}) {
  return prisma.referral.update({
    where: { id: args.referralId },
    data: { clientId: args.clientId },
  });
}

export type ReferralTermsSuggestion = {
  propertyName: string;
  strategy: "long-term" | "short-stay";
  // From the signed agreement, so always known and always safe to
  // prefill: a rate is a ratio and carries no currency.
  managementFeePct: number;
  // The rent on the active lease, in whatever currency it was
  // recorded in. Null for short-stay properties, which have no lease.
  leaseRent: { amount: number; currency: string } | null;
  // Only set when the lease is already denominated in USD. See the
  // note below on why this is not simply leaseRent.amount.
  monthlyRentUsd: number | null;
};

// The terms to offer when marking a referral signed, read off the
// client's own records so nobody retypes them.
//
// The rent needs care. Payouts are denominated in USD — the schema
// field is monthlyRentUsd and both the public programme page and the
// referrer's dashboard quote dollars — but leases are recorded in the
// currency of the country they are in, which for Nairobi means KES.
// There is no conversion anywhere in the codebase.
//
// So this deliberately does not prefill a rent it cannot vouch for.
// A KES rent of 150,000 dropped into a USD field would pay an agent
// roughly a hundred and thirty times what they earned, every month
// for a year, and the dashboard would show them the inflated figure
// as fact. Instead the lease rent is returned with its currency for
// an operator to read, and monthlyRentUsd is offered only when the
// two already agree.
//
// Returns null when there is nothing to suggest, which is the normal
// case for a referral not yet linked to a client.
export async function suggestedTermsForReferral(
  referralId: string,
): Promise<ReferralTermsSuggestion | null> {
  const referral = await prisma.referral.findUnique({
    where: { id: referralId },
    select: { clientId: true },
  });
  if (!referral?.clientId) return null;

  const property = await prisma.property.findFirst({
    where: {
      clientId: referral.clientId,
      agreements: { some: { status: "SIGNED" } },
    },
    orderBy: { createdAt: "asc" },
    select: {
      name: true,
      propertyType: true,
      agreements: {
        where: { status: "SIGNED" },
        orderBy: { generatedAt: "desc" },
        take: 1,
        select: { commissionRate: true },
      },
      units: {
        select: {
          leases: {
            where: { status: "ACTIVE", archivedAt: null },
            orderBy: { startDate: "desc" },
            take: 1,
            select: { monthlyRent: true, currency: true },
          },
        },
      },
    },
  });
  if (!property) return null;

  const rate = toNumberOrNull(property.agreements[0]?.commissionRate);
  if (rate === null) return null;

  const lease = property.units.flatMap((u) => u.leases)[0] ?? null;
  const leaseAmount = lease ? toNumberOrNull(lease.monthlyRent) : null;
  const leaseRent =
    lease && leaseAmount !== null
      ? { amount: leaseAmount, currency: lease.currency }
      : null;

  return {
    propertyName: property.name,
    strategy:
      property.propertyType === "SHORT_TERM" ? "short-stay" : "long-term",
    managementFeePct: rate,
    leaseRent,
    monthlyRentUsd:
      leaseRent && leaseRent.currency.toUpperCase() === "USD"
        ? leaseRent.amount
        : null,
  };
}

// Settle a payout. updateMany with status in the predicate so a
// double-clicked button, or two operators paying the same agent at
// once, cannot overwrite the reference of the payment that actually
// went out.
export async function markPayoutPaid(args: {
  id: string;
  reference: string | null;
}): Promise<boolean> {
  const result = await prisma.referralPayout.updateMany({
    where: { id: args.id, status: "SCHEDULED" },
    data: {
      status: "PAID",
      paidAt: new Date(),
      paidReference: args.reference?.trim() || null,
    },
  });
  return result.count > 0;
}

export async function cancelPayout(id: string): Promise<boolean> {
  const result = await prisma.referralPayout.updateMany({
    where: { id, status: "SCHEDULED" },
    data: { status: "CANCELLED" },
  });
  return result.count > 0;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function toNumberOrNull(d: { toString(): string } | null | undefined): number | null {
  if (d === null || d === undefined) return null;
  const n = Number(d.toString());
  return Number.isFinite(n) ? n : null;
}
