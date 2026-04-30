// Admin allowlist check. Lives in its own module so the test suite
// can import without dragging next/headers and the Prisma client
// (which `lib/auth.ts` re-exports for the rest of the app) into the
// Node test environment.
//
// Two paths grant admin:
//   1. Email belongs to one of the goldstay corporate domains. The
//      list is hardcoded because these never change without an
//      explicit business decision, and a typo in an env var should
//      not silently lock the founders out of /admin.
//   2. Email is in the comma-separated ADMIN_EMAILS env var. Used
//      for outside helpers (an accountant on gmail, a contractor)
//      that we want to grant admin without giving them a goldstay
//      mailbox.

const GOLDSTAY_ADMIN_DOMAINS = [
  "goldstay.co.ke",
  "goldstay.com.gh",
  "goldstay.com",
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalised = email.trim().toLowerCase();
  if (!normalised) return false;

  if (matchesGoldstayDomain(normalised)) return true;
  if (matchesEnvAllowlist(normalised)) return true;
  return false;
}

function matchesGoldstayDomain(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at === -1 || at === email.length - 1) return false;
  const domain = email.slice(at + 1);
  // Exact match only. We deliberately do NOT match subdomains
  // ("attacker@evil.goldstay.com" must fail) because Supabase Auth
  // accepts whatever email a user types in the magic-link form.
  return GOLDSTAY_ADMIN_DOMAINS.includes(domain);
}

function matchesEnvAllowlist(email: string): boolean {
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email);
}
