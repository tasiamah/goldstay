// /api/admin/search?q=...
//
// JSON endpoint backing the command palette. Authenticates as an
// admin (so impersonation tokens / owner sessions can't drain the
// dataset by guessing this URL), then delegates to lib/admin/search.

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { adminSearch } from "@/lib/admin/search";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const admin = await requireAdmin();
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const results = await adminSearch(q, admin);
  return NextResponse.json(results);
}
