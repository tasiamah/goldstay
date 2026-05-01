"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/auth";

// Marks the first-visit hint as dismissed for this owner. One-way:
// once welcomeCompletedAt is set, the per-section ? hints take over
// permanently and we never re-show the inline banner. Keeping the
// timestamp monotonic also lets us use it later as a proxy for
// "this account has been activated by a real human" without
// worrying about it bouncing.
export async function dismissWelcomeAction() {
  const { owner } = await requireOwner();

  if (!owner.welcomeCompletedAt) {
    await prisma.owner.update({
      where: { id: owner.id },
      data: { welcomeCompletedAt: new Date() },
    });
    revalidatePath("/owner");
  }
}
