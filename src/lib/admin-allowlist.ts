// Pure admin allowlist check. Lives in its own module so the test
// suite can import without dragging next/headers and the Prisma
// client (which `lib/auth.ts` re-exports for the rest of the app) into
// the Node test environment.
//
// The allowlist is stored as a comma-separated env var so we can
// promote new staff to admin without redeploying — change the var
// in Vercel, restart, done.
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}
