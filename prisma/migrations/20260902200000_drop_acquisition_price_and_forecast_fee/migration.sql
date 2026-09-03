-- Drop the acquisition price and the Forecast Monthly Management Fee.
--
-- acquisitionPrice / acquisitionCurrency were collected on the admin
-- property form and never read back anywhere in the app: no report,
-- KPI or contract consumed them.
--
-- forecastMonthlyFee backed the Forecast Monthly Management Fee in the
-- short-let agreement, which v2 of that contract removes along with
-- limb (b) of the clause 10.3 early-exit calculation. It was never
-- populated on a single property or agreement row, so every contract
-- issued under v1 already printed it as "to be confirmed" with limb
-- (b) yielding nothing.
--
-- Destructive and deliberate: one property carried an acquisition
-- price and that figure is not recoverable after this runs.

ALTER TABLE "Property"
  DROP COLUMN "acquisitionPrice",
  DROP COLUMN "acquisitionCurrency",
  DROP COLUMN "forecastMonthlyFee";

ALTER TABLE "ManagementAgreement"
  DROP COLUMN "forecastMonthlyFee";
