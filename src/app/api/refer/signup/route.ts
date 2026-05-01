// POST /api/refer/signup — create a Referrer row, send the welcome
// email with referral link + dashboard URL, mirror to Airtable.
//
// Returns the dashboard URL on success so the form can route the
// browser straight to it; that doubles as a quiet sanity check that
// the email landed somewhere meaningful even before the referrer
// reads it.

import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  airtableTables,
  createAirtableRecord,
  isAirtableConfigured,
} from "@/lib/airtable";
import { rateLimitOr429 } from "@/lib/rateLimit";
import { createReferrer } from "@/lib/referrals/db";
import { sendReferrerWelcomeEmail } from "@/lib/referrals/email";
import { site } from "@/lib/site";
import { personFullName } from "@/lib/validation/preprocessors";

export const runtime = "nodejs";

const Body = z.object({
  fullName: personFullName,
  email: z.string().email(),
  phone: z.string().trim().max(40).optional(),
  companyName: z.string().trim().max(120).optional(),
  country: z.string().trim().max(80).optional(),
  type: z.enum(["LANDLORD", "AGENT", "PARTNER"]),
});

export async function POST(req: Request) {
  // Reuse the lead bucket: same intensity profile (one form per
  // human per hour is generous; spammers hit the limit at 5/h).
  const limited = await rateLimitOr429(req, "lead");
  if (limited) return limited;

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Invalid input", details: (e as Error).message },
      { status: 400 },
    );
  }

  let referrer;
  try {
    referrer = await createReferrer(parsed);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      // Email already exists. Don't leak whether the email is
      // registered to a logged-out attacker, but give the legit
      // user a useful next step.
      return NextResponse.json(
        {
          ok: false,
          error:
            "An account already exists for that email. Check your inbox for the dashboard link, or reply to leads@goldstay.co.ke and we'll resend it.",
        },
        { status: 409 },
      );
    }
    throw err;
  }

  // Fire-and-forget the side effects so the form returns fast. We
  // intentionally swallow failures: the Postgres row exists, ops can
  // resend the welcome from the Airtable mirror later.
  const dashUrl = `https://${site.domains.main}/refer/dashboard/${referrer.dashboardToken}`;

  const sendEmail = sendReferrerWelcomeEmail(referrer);
  const mirrorAirtable = (async () => {
    if (!isAirtableConfigured()) return;
    await createAirtableRecord(airtableTables.referrers, {
      Code: referrer.code,
      Type: referrer.type,
      Status: referrer.status,
      "Full name": referrer.fullName,
      Email: referrer.email,
      Phone: referrer.phone,
      Company: referrer.companyName,
      Country: referrer.country,
      "Dashboard URL": dashUrl,
      Joined: referrer.createdAt.toISOString(),
    });
  })();
  await Promise.allSettled([sendEmail, mirrorAirtable]);

  return NextResponse.json({
    ok: true,
    code: referrer.code,
    dashboardUrl: dashUrl,
    referralUrl: `https://${site.domains.main}/list-your-property?ref=${referrer.code}`,
  });
}
