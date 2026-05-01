"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// Marks the welcome card on the admin overview as dismissed for the
// current admin. Idempotent — clicking twice in quick succession is
// fine. We deliberately don't audit this; the welcome card is UI
// chrome, not a state change anyone reading the timeline cares
// about.
export async function dismissAdminWelcomeAction(): Promise<void> {
  const admin = await requireAdmin();
  if (admin.welcomeCompletedAt) return;
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { welcomeCompletedAt: new Date() },
  });
  revalidatePath("/admin");
}
