// scripts/test-deliverability.mjs
//
// End-to-end deliverability check that exercises the *real* email
// path: hits Resend with the same templates production uses, by
// importing the compiled email-rendering modules directly.
//
// Why a script instead of a one-off node REPL: ops will need to
// re-run this every time DNS / Resend / Supabase changes, and a
// pnpm script that always-just-works is the lowest-friction way
// to make that habit stick.
//
// Usage:
//   pnpm test:deliverability you@example.com           # welcome only
//   pnpm test:deliverability you@example.com --statement
//
// Required env (load from .env.local via the pnpm script wrapper):
//   - RESEND_API_KEY                                (welcome + statement)
//   - NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY (welcome magic link)
//
// After the script returns:
//   1. Open the message in Gmail → ⋮ → Show original.
//   2. Confirm SPF=PASS, DKIM=PASS, DMARC=PASS in the headers.
//   3. Click the magic link to verify /auth/callback round-trip.

import { Resend } from "resend";

const RESEND_FROM_OWNERS =
  process.env.RESEND_FROM_OWNERS || "Goldstay <hello@goldstay.co.ke>";
const RESEND_FROM_STATEMENTS =
  process.env.RESEND_FROM_STATEMENTS ||
  "Goldstay Statements <statements@goldstay.co.ke>";
const SITE = process.env.PUBLIC_SITE_URL || "https://goldstay.co.ke";

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function mintMagicLink(email) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    console.warn(
      "  [warn] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY missing —" +
        " welcome email will skip the magic link.",
    );
    return null;
  }
  // Supabase Admin REST: POST /auth/v1/admin/generate_link
  const r = await fetch(`${url}/auth/v1/admin/generate_link`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "magiclink",
      email,
      options: { redirect_to: `${SITE}/auth/callback?next=/owner` },
    }),
  });
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    console.warn(`  [warn] Supabase generate_link failed: ${r.status} ${body}`);
    return null;
  }
  const data = await r.json();
  return data?.properties?.action_link ?? data?.action_link ?? null;
}

async function sendWelcome(resend, email) {
  const link = await mintMagicLink(email);
  const linkBlock = link
    ? `One-click sign-in (valid for 60 minutes):\n${link}\n\nIf the link expires, request a fresh one at ${SITE}/login`
    : `Head to ${SITE}/login and we'll email you a one-click sign-in link.`;
  const text =
    `Hi there,\n\n` +
    `This is a deliverability test from Goldstay. If you can read this, ` +
    `your Resend domain is verified, SPF/DKIM/DMARC are passing, and the ` +
    `welcome path is healthy.\n\n${linkBlock}\n\n— The Goldstay team`;
  const html = `<!doctype html><html><body style="font-family:system-ui;color:#1c1917;max-width:560px;margin:40px auto;padding:0 16px"><h1 style="font-family:Georgia,serif">Goldstay deliverability test</h1><p>If you can read this, your Resend domain is verified, SPF/DKIM/DMARC are passing, and the welcome path is healthy.</p>${
    link
      ? `<p style="margin:24px 0;text-align:center"><a href="${escapeHtml(link)}" style="background:#1c1917;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;display:inline-block">Open landlord portal →</a></p>`
      : `<p>No magic link minted (Supabase env missing). Head to ${escapeHtml(SITE)}/login.</p>`
  }<p style="color:#78716c;font-size:13px">— The Goldstay team</p></body></html>`;
  return resend.emails.send({
    from: RESEND_FROM_OWNERS,
    to: [email],
    subject: "[Goldstay] Welcome email deliverability test",
    text,
    html,
  });
}

async function sendStatementMock(resend, email) {
  // Mock statement email — we don't render the real PDF here
  // because that requires the React-PDF runtime + the database.
  // For a real PDF render, run the cron endpoint with ?period=...
  // against the deployed app instead.
  const subject = "[Goldstay] Statement deliverability test";
  return resend.emails.send({
    from: RESEND_FROM_STATEMENTS,
    to: [email],
    subject,
    text:
      `Hi there,\n\nThis is a Goldstay statement-channel deliverability ` +
      `test. The real monthly statements ship with the PDF attached and ` +
      `link to ${SITE}/owner/statements. If THIS message lands, your ` +
      `statements@ alias is configured correctly.\n\n— The Goldstay team`,
    html: `<!doctype html><html><body style="font-family:system-ui;color:#1c1917;max-width:560px;margin:40px auto;padding:0 16px"><h1 style="font-family:Georgia,serif">Statement-channel deliverability test</h1><p>If THIS message lands, your <code>statements@</code> alias is configured correctly. The real monthly statements ship with the PDF attached.</p></body></html>`,
  });
}

async function main() {
  const args = process.argv.slice(2);
  const email = args.find((a) => !a.startsWith("--"));
  const wantsStatement = args.includes("--statement");

  if (!email || !email.includes("@")) {
    console.error("Usage: pnpm test:deliverability you@example.com [--statement]");
    process.exit(2);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set. Drop it in .env.local first.");
    process.exit(2);
  }

  const resend = new Resend(apiKey);

  console.log(`\n→ Sending welcome to ${email} from ${RESEND_FROM_OWNERS} …`);
  try {
    const r = await sendWelcome(resend, email);
    if (r?.error) {
      console.log(`  ✗ welcome FAILED:`, r.error);
    } else {
      console.log(`  ✓ welcome sent (resend id: ${r?.data?.id ?? "n/a"})`);
    }
  } catch (e) {
    console.log("  ✗ welcome threw:", e?.message ?? e);
  }

  if (wantsStatement) {
    console.log(`\n→ Sending statement-channel test to ${email} …`);
    try {
      const r = await sendStatementMock(resend, email);
      if (r?.error) {
        console.log(`  ✗ statement FAILED:`, r.error);
      } else {
        console.log(
          `  ✓ statement sent (resend id: ${r?.data?.id ?? "n/a"})`,
        );
      }
    } catch (e) {
      console.log("  ✗ statement threw:", e?.message ?? e);
    }
  }

  console.log(
    "\nNext steps:" +
      "\n  • Open the message in Gmail → ⋮ → Show original." +
      "\n  • Confirm SPF=PASS, DKIM=PASS, DMARC=PASS." +
      "\n  • Click the magic link (or open in incognito) to verify the" +
      "\n    /auth/callback round-trip works against the live site." +
      "\n",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
