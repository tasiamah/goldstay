// Authorisation boundary for the referral programme.
//
// Two kinds of check here.
//
// The matrix checks pin who can do what. The one that matters is that
// declaring a commission paid is not the same permission as managing
// referrers: an operator chasing an agent for introductions should
// not also be able to record that the agent has been paid, because
// then a single compromised or careless login can both invent a
// commission and settle it.
//
// The structural check reads the actions file and asserts every
// exported action asks for a permission. An action that forgets is
// not a subtle bug — it is an unauthenticated write to a table that
// decides who receives money — and it is exactly the kind of thing
// that gets missed when a new action is added next to working ones.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { can } from "@/lib/admin/roles";
import type { AdminAction } from "@/lib/admin/roles";

const SOURCE = readFileSync(join(__dirname, "actions.ts"), "utf8");

describe("referral permissions", () => {
  it("lets operations manage referrers but not declare them paid", () => {
    expect(can("OPS", "referral.read")).toBe(true);
    expect(can("OPS", "referral.write")).toBe(true);
    // The separation of duties this whole area is arranged around.
    expect(can("OPS", "referral.payout")).toBe(false);
  });

  it("lets accounting pay but not invent commissions", () => {
    expect(can("ACCOUNTING", "referral.read")).toBe(true);
    expect(can("ACCOUNTING", "referral.payout")).toBe(true);
    // Marking a referral signed is what originates a payout schedule.
    // Accounting settling schedules it did not create is the point.
    expect(can("ACCOUNTING", "referral.write")).toBe(false);
  });

  it("lets support answer questions without touching anything", () => {
    expect(can("SUPPORT", "referral.read")).toBe(true);
    expect(can("SUPPORT", "referral.write")).toBe(false);
    expect(can("SUPPORT", "referral.payout")).toBe(false);
  });

  it("gives a super admin everything", () => {
    for (const action of [
      "referral.read",
      "referral.write",
      "referral.payout",
    ] as AdminAction[]) {
      expect(can("SUPER_ADMIN", action), action).toBe(true);
    }
  });

  it("never grants a write without the matching read", () => {
    for (const role of ["OPS", "ACCOUNTING", "SUPPORT"] as const) {
      if (can(role, "referral.write") || can(role, "referral.payout")) {
        expect(can(role, "referral.read"), role).toBe(true);
      }
    }
  });
});

describe("every referral action is gated", () => {
  // Exported server actions, by name, paired with the body between
  // this export and the next so each can be checked in isolation.
  const actions = (() => {
    const pattern = /export async function (\w+Action)\b/g;
    const found: { name: string; index: number }[] = [];
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(SOURCE)) !== null) {
      found.push({ name: match[1], index: match.index });
    }
    return found.map((f, i) => ({
      name: f.name,
      body: SOURCE.slice(
        f.index,
        i + 1 < found.length ? found[i + 1].index : SOURCE.length,
      ),
    }));
  })();

  it("finds the actions", () => {
    // Guards the parser itself: a regex that silently matches nothing
    // would make every assertion below vacuously true.
    expect(actions.length).toBeGreaterThanOrEqual(7);
  });

  it("has a requireRole in every one", () => {
    const ungated = actions
      .filter((a) => !a.body.includes("requireRole("))
      .map((a) => a.name);

    expect(
      ungated,
      `These server actions write to the referral tables without ` +
        `checking a permission. Anyone who can reach the admin app ` +
        `could move a referral or settle a commission. Add ` +
        `await requireRole("referral.write") — or "referral.payout" ` +
        `if it touches money — as the first line.`,
    ).toEqual([]);
  });

  it("gates the two money actions on referral.payout specifically", () => {
    // Named rather than inferred so that renaming one of these
    // without thinking about its permission fails here.
    for (const name of ["markPayoutPaidAction", "cancelPayoutAction"]) {
      const action = actions.find((a) => a.name === name);
      expect(action, `${name} is missing`).toBeDefined();
      expect(
        action!.body.includes('requireRole("referral.payout")'),
        `${name} must require referral.payout, not referral.write. ` +
          `Recording a payment is an accounting act; the person who ` +
          `created the schedule should not be the person who settles it.`,
      ).toBe(true);
    }
  });

  it("writes an audit row in every action", () => {
    const unaudited = actions
      .filter((a) => !a.body.includes("recordAudit("))
      .map((a) => a.name);

    expect(
      unaudited,
      `Every referral mutation must leave an audit row, because ` +
        `"has this agent been paid, and who says so" is a question ` +
        `that gets asked months later about money that has left.`,
    ).toEqual([]);
  });
});
