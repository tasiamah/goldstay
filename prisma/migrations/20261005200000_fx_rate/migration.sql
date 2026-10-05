-- Daily exchange rates, stored rather than fetched at render time.
--
-- A statement has to produce the same figure every time it is opened:
-- a rate looked up live would quietly restate a month already sent to
-- the owner. `rate` is units of `quote` per 1 `base`, so
-- ('USD','KES',129.748) reads "1 USD = 129.748 KES".
CREATE TABLE "FxRate" (
    "id" TEXT NOT NULL,
    "base" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "asOf" DATE NOT NULL,
    "rate" DECIMAL(18,8) NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FxRate_pkey" PRIMARY KEY ("id")
);

-- One rate per pair per day. The daily job upserts on this, so a
-- re-run cannot create a second, different rate for a day that has
-- already been used to value a statement.
CREATE UNIQUE INDEX "FxRate_base_quote_asOf_key" ON "FxRate"("base", "quote", "asOf");

CREATE INDEX "FxRate_base_quote_asOf_idx" ON "FxRate"("base", "quote", "asOf");
