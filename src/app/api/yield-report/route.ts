// POST /api/yield-report — generates a branded PDF yield report and
// returns it as the response body. Side effect: writes the captured
// landlord to the Airtable Yield Reports table so the calculator
// becomes a real lead-magnet, not just a giveaway.
//
// The route is intentionally rate-limited (reuses the "lead" bucket
// since this is the same kind of high-intent inbound) and validates
// every input through zod so a malformed POST returns 400 instead of
// rendering a $0 PDF.

import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { z } from "zod";
import {
  airtableTables,
  createAirtableRecord,
  isAirtableConfigured,
} from "@/lib/airtable";
import { rateLimitOr429 } from "@/lib/rateLimit";
import { calculateYield } from "@/lib/yield/calc";
import { YieldReportDocument } from "@/lib/yield/YieldReportDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  // Lead capture fields. Email is required because the PDF download
  // is the value exchange; without an email it isn't a lead magnet.
  email: z.string().email(),
  name: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  // Calculator inputs.
  city: z.enum(["nairobi", "accra"]),
  neighbourhood: z.string().trim().min(1).max(80).optional(),
  bedrooms: z.coerce.number().int().min(0).max(10),
  monthlyMarketRentUsd: z.coerce.number().positive().max(100_000),
  strategy: z.enum(["long-term", "short-stay"]),
});

export async function POST(req: Request) {
  const limited = await rateLimitOr429(req, "lead");
  if (limited) return limited;

  let parsed: z.infer<typeof Body>;
  try {
    const json = await req.json();
    parsed = Body.parse(json);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Invalid input", details: (e as Error).message },
      { status: 400 },
    );
  }

  const result = calculateYield({
    city: parsed.city,
    bedrooms: parsed.bedrooms,
    monthlyMarketRentUsd: parsed.monthlyMarketRentUsd,
    strategy: parsed.strategy,
  });

  // Mirror to Airtable in the background so the PDF render isn't
  // delayed by it. Same fail-open pattern as /api/lead.
  const mirror = (async () => {
    if (!isAirtableConfigured()) return;
    await createAirtableRecord(airtableTables.yieldReports, {
      Email: parsed.email,
      Name: parsed.name,
      Phone: parsed.phone,
      City: parsed.city === "nairobi" ? "Nairobi" : "Accra",
      Neighbourhood: parsed.neighbourhood,
      Bedrooms: parsed.bedrooms,
      "Stay strategy":
        parsed.strategy === "long-term" ? "Long-term" : "Short-stay",
      "Self-managed monthly USD": result.selfManaged.netMonthly,
      "Goldstay net monthly USD": result.goldstayManaged.netMonthly,
      "Annual uplift USD": result.annualUplift,
      Submitted: new Date().toISOString(),
      Source: "yield-calculator",
      Status: "New",
    });
  })().catch((e) => console.error("[yield-report] airtable mirror failed", e));

  const pdfBuffer = await renderToBuffer(
    YieldReportDocument({
      result,
      recipientName: parsed.name,
      neighbourhood: parsed.neighbourhood,
    }),
  );

  // Don't block the response on the Airtable write, but don't lose it
  // either: tail the promise so a future Vercel "background tasks"
  // upgrade keeps working without a code change.
  void mirror;

  const filename = `goldstay-yield-${parsed.city}-${parsed.bedrooms}br.pdf`;
  // pdfBuffer is a Node Buffer; web standard BodyInit accepts a
  // typed array. Wrapping in Uint8Array is a zero-copy view.
  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}
