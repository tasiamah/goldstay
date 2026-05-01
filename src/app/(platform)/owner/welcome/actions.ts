"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/auth";

// Marks the welcome tour as dismissed for this owner. One-way: the
// "Take the tour" link below uses ?welcome=1 to re-render the panel
// for users who want a refresher, without flipping the flag back to
// null. Keeping welcomeCompletedAt monotonic means we can later use
// it as a proxy for "this account has been activated by a real human"
// without worrying about it bouncing.
export async function dismissWelcomeAction() {
  const { owner } = await requireOwner();

  if (!owner.welcomeCompletedAt) {
    await prisma.owner.update({
      where: { id: owner.id },
      data: { welcomeCompletedAt: new Date() },
    });
    revalidatePath("/owner");
  }

  // Drop ?welcome=1 if the user dismissed from a replay session, so a
  // subsequent reload doesn't immediately re-open the panel.
  redirect("/owner");
}
