-- Additional addresses copied on a client's monthly statement, for
-- people who co-own or co-manage a unit but do not hold the account.
--
-- Additive only: one new table, no change to any existing column, so
-- it is safe to apply ahead of the deploy that reads it.
--
-- The rationale for a separate table rather than a second column on
-- Owner (the physical name for Client) is in the ClientObserver
-- comment in prisma/schema.prisma. In short: three of the four emails
-- a client receives carry a Supabase magic link that signs the clicker
-- in as the client, so a second address on the account row would have
-- been copied by a send site that could not tell the two apart, and
-- would have granted a co-owner the whole portal plus the ability to
-- accept a contract in the account holder's name.

-- CreateTable
CREATE TABLE "ClientObserver" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "relationship" TEXT,
    "addedByEmail" TEXT,
    "unsubscribeToken" TEXT NOT NULL,
    "unsubscribedAt" TIMESTAMP(3),
    "removedAt" TIMESTAMP(3),
    "lastSentAt" TIMESTAMP(3),
    "sendCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientObserver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientObserver_unsubscribeToken_key" ON "ClientObserver"("unsubscribeToken");

-- CreateIndex
-- One row per address per client: re-adding a previously removed
-- observer reactivates that row rather than creating a second, so the
-- record of who could see the numbers when stays in one place.
CREATE UNIQUE INDEX "ClientObserver_clientId_email_key" ON "ClientObserver"("clientId", "email");

-- CreateIndex
-- The read path is always "live observers for this client", so the
-- index carries removedAt to keep that a single index scan.
CREATE INDEX "ClientObserver_clientId_removedAt_idx" ON "ClientObserver"("clientId", "removedAt");

-- AddForeignKey
-- Cascade: an observer list is meaningless without the account it
-- observes, and a deleted client must not leave addresses behind that
-- a later statement run could still resolve.
ALTER TABLE "ClientObserver" ADD CONSTRAINT "ClientObserver_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
