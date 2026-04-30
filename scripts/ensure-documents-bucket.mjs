// One-shot bootstrap that ensures the goldstay-documents bucket
// exists in the project's Supabase Storage. Safe to run repeatedly.
//
// Usage:
//   pnpm storage:bootstrap
//
// Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY from .env.local
// (loaded via dotenv-cli). Service role secret only — never run this
// in the browser or on the marketing site.
import { createClient } from "@supabase/supabase-js";

const BUCKET = "goldstay-documents";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY env",
    );
    process.exit(1);
  }

  const admin = createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: buckets, error: listError } =
    await admin.storage.listBuckets();
  if (listError) {
    console.error("Failed to list buckets:", listError.message);
    process.exit(1);
  }

  if (buckets?.some((b) => b.name === BUCKET)) {
    console.log(`Bucket "${BUCKET}" already exists. No-op.`);
    return;
  }

  const { error: createError } = await admin.storage.createBucket(BUCKET, {
    public: false,
    fileSizeLimit: 25 * 1024 * 1024,
  });
  if (createError) {
    console.error("Failed to create bucket:", createError.message);
    process.exit(1);
  }

  console.log(`Created private bucket "${BUCKET}" (25 MB limit).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
