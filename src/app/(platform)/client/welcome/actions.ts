"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/auth";

// Marks the first-visit hint as dismissed for this client. One-way:
// once welcomeCompletedAt is set, the per-section ? hints take over
// permanently and we never re-show the inline banner. Keeping the
// timestamp monotonic also lets us use it later as a proxy for
// "this account has been activated by a real human" without
// worrying about it bouncing.
export async function dismissWelcomeAction() {
  const { client } = await requireClient();

  if (!client.welcomeCompletedAt) {
    await prisma.client.update({
      where: { id: client.id },
      data: { welcomeCompletedAt: new Date() },
    });
    revalidatePath("/client");
  }

  // Then start a fresh request, or the banner does not go away.
  //
  // getCurrentClient is wrapped in React `cache`, which memoises for
  // the lifetime of one request. A server action and the re-render
  // Next.js does afterwards to produce the new RSC payload are the
  // same request, so the sequence is:
  //
  //   1. this action calls requireClient  -> row memoised, still null
  //   2. we write welcomeCompletedAt
  //   3. /client re-renders, calls requireClient, gets the memo from
  //      step 1 -- the pre-write row -- and renders the banner again
  //
  // revalidatePath cannot help: it clears Next's data and router
  // caches, not React's per-request memo, and there is no API to
  // clear that one. Redirecting ends this request and the navigation
  // that follows gets a fresh memo, so the page finally reads the row
  // it just wrote. The dismissal was always persisting; only the
  // render was stale.
  redirect("/client");
}
