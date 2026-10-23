-- Welcome links we own, replacing the forwarded Supabase magic link.
--
-- Additive only: no existing column changes, so a deploy running the
-- old code against this schema is unaffected.

CREATE TYPE "ClientInviteReason" AS ENUM ('WELCOME', 'NEVER_SIGNED_IN', 'RESEND');

CREATE TABLE "ClientInvite" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsedAt" TIMESTAMP(3),
    "retiredAt" TIMESTAMP(3),
    "reason" "ClientInviteReason" NOT NULL DEFAULT 'WELCOME',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientInvite_pkey" PRIMARY KEY ("id")
);

-- Unique because the hash is how we look an invite up on click.
CREATE UNIQUE INDEX "ClientInvite_tokenHash_key" ON "ClientInvite"("tokenHash");
CREATE INDEX "ClientInvite_clientId_idx" ON "ClientInvite"("clientId");
-- Supports the sweep that retires expired rows.
CREATE INDEX "ClientInvite_expiresAt_idx" ON "ClientInvite"("expiresAt");

-- The physical clients table predates the owner -> client rename, so
-- the FK points at "Owner" like every other client relation here.
ALTER TABLE "ClientInvite"
    ADD CONSTRAINT "ClientInvite_clientId_fkey"
    FOREIGN KEY ("clientId") REFERENCES "Owner"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
