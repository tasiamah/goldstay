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
