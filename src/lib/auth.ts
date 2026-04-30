// Auth helpers used by Server Components and Server Actions to gate
// platform routes. Pure server module; never import from the browser.
//
// Admin access is hard-allowlisted via the ADMIN_EMAILS env var (comma
// separated). This is intentional: until we have more than two staff
// users, there is no reason to model role rows in the database. When
// the team grows past that, swap in an `admin_users` table and update
// the `isAdmin` helper without touching the rest of the app.
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!isAdminEmail(user.email)) redirect("/owner");
  return user;
}

// Resolves the Owner row for the logged-in Supabase user. Owner rows
// are created by an admin during onboarding; we look up by authUserId
// first (set when the owner first logs in) and fall back to email
// match so the very first login automatically claims their record.
export async function requireOwner() {
  const user = await requireUser();

  let owner = await prisma.owner.findUnique({
    where: { authUserId: user.id },
  });

  if (!owner && user.email) {
    owner = await prisma.owner.findUnique({ where: { email: user.email } });
    if (owner) {
      owner = await prisma.owner.update({
        where: { id: owner.id },
        data: { authUserId: user.id },
      });
    }
  }

  if (!owner) {
    // Logged in but not yet an owner in our DB. Send them somewhere
    // safe; the page itself decides what to show.
    redirect("/owner/pending");
  }

  return { user, owner };
}
