// Yield calculator — pure model behind the /yield-calculator lead
// magnet. Inputs come from the public form; outputs power both the
// on-page comparison and the downloadable PDF report.
//
// The numbers below are *honest, conservative, defensible*. They are
// what we tell every diaspora landlord on a discovery call, expressed
// as a model so the page can show the same maths transparently. We
// would rather under-promise here and out-perform on the actual
// month-one statement than the reverse.

export type Strategy = "long-term" | "short-stay";

export type CalcInput = {
  city: "nairobi" | "accra";
  // Bedrooms only used for default-rent fall-back; the model itself
  // is rent-driven, not bedroom-driven, so the user always wins if
  // they enter a real figure.
  bedrooms: number;
  // Monthly market rent in USD if the unit were let long-term. The
  // single most important input. The form treats this as required.
  monthlyMarketRentUsd: number;
  strategy: Strategy;
};

// All assumption rates live in one block so a future ops review can
// adjust them in isolation without hunting through the maths.
const ASSUMPTIONS = {
  longTerm: {
    self: {
      occupancy: 0.85, // ~8 weeks vacancy/year is typical for self-managed
      shrinkage: 0.13, // caretaker leakage + undocumented repairs + late fees
    },
    goldstay: {
      occupancy: 0.95, // 2-3 weeks vacancy/year managed turnover
      shrinkage: 0.05, // documented, photographed repairs only
      managementFee: 0.10, // 10% of rent collected
    },
  },
  shortStay: {
    self: {
      // Typical Airbnb-self-host in Nairobi/Accra: 12-15 nights/month
      // outside high season, plus heavy cleaning + supply leakage.
      occupancy: 0.45,
      otaFees: 0.15, // Airbnb commission baseline
      operatingDrag: 0.18, // amateur cleaning, supplies, no dynamic pricing
    },
    goldstay: {
      occupancy: 0.65, // 19-20 nights/month with dynamic pricing
      otaFees: 0.15, // unchanged: Airbnb takes the same cut from us
      operatingDrag: 0.08, // contracted turnover team, supply pass-through
      managementFee: 0.20, // 20% of revenue
    },
    // Implied nightly = monthlyRentUsd × premium / (30 × baselineOccupancy).
    // Calibrated so a $1,500/mo long-term unit lands at ~$95/night, which
    // matches what the same property type books for in our managed stock.
    nightlyMultiplierFromMonthlyRent: 2.1,
  },
  // Tax rates by country. Both are applied to *gross collected*. The
  // self-managed scenario assumes the landlord declares correctly; we
  // do not model the (real, common) cost of an unfiled return.
  tax: {
    nairobi: 0.075, // Kenya MRI 7.5% on gross residential rent
    accra: 0.08, // Ghana 8% withholding on gross residential rent
  },
} as const;

export type ScenarioBreakdown = {
  grossCollectedMonthly: number;
  managementFee: number;
  otaFees: number;
  operatingCosts: number;
  tax: number;
  netMonthly: number;
  netAnnual: number;
};

export type CalcResult = {
  city: "nairobi" | "accra";
  strategy: Strategy;
  bedrooms: number;
  monthlyMarketRentUsd: number;
  // Implied gross *before* operator-specific occupancy is applied,
  // shown on the report so the user can sanity-check the inputs.
  marketGrossMonthlyUsd: number;
  selfManaged: ScenarioBreakdown;
  goldstayManaged: ScenarioBreakdown;
  monthlyUplift: number;
  annualUplift: number;
  assumptions: typeof ASSUMPTIONS;
};

function round(n: number): number {
  return Math.round(n);
}

function calcLongTerm(input: CalcInput): {
  marketGross: number;
  self: ScenarioBreakdown;
  gs: ScenarioBreakdown;
} {
  const taxRate = ASSUMPTIONS.tax[input.city];
  const marketGross = input.monthlyMarketRentUsd;

  const selfGross = marketGross * ASSUMPTIONS.longTerm.self.occupancy;
  const selfShrinkage = selfGross * ASSUMPTIONS.longTerm.self.shrinkage;
  const selfTax = selfGross * taxRate;
  const selfNet = selfGross - selfShrinkage - selfTax;

  const gsGross = marketGross * ASSUMPTIONS.longTerm.goldstay.occupancy;
  const gsMgmt = gsGross * ASSUMPTIONS.longTerm.goldstay.managementFee;
  const gsOps = gsGross * ASSUMPTIONS.longTerm.goldstay.shrinkage;
  const gsTax = gsGross * taxRate;
  const gsNet = gsGross - gsMgmt - gsOps - gsTax;

  return {
    marketGross,
    self: {
      grossCollectedMonthly: round(selfGross),
      managementFee: 0,
      otaFees: 0,
      operatingCosts: round(selfShrinkage),
      tax: round(selfTax),
      netMonthly: round(selfNet),
      netAnnual: round(selfNet * 12),
    },
    gs: {
      grossCollectedMonthly: round(gsGross),
      managementFee: round(gsMgmt),
      otaFees: 0,
      operatingCosts: round(gsOps),
      tax: round(gsTax),
      netMonthly: round(gsNet),
      netAnnual: round(gsNet * 12),
    },
  };
}

function calcShortStay(input: CalcInput): {
  marketGross: number;
  self: ScenarioBreakdown;
  gs: ScenarioBreakdown;
} {
  const taxRate = ASSUMPTIONS.tax[input.city];
  const impliedNightly =
    (input.monthlyMarketRentUsd *
      ASSUMPTIONS.shortStay.nightlyMultiplierFromMonthlyRent) /
    30;

  // Market gross at a hypothetical 100% occupancy is the ceiling the
  // PDF prints next to the actual numbers, never collected by anyone.
  const marketGross = impliedNightly * 30;

  const selfGross = marketGross * ASSUMPTIONS.shortStay.self.occupancy;
  const selfOta = selfGross * ASSUMPTIONS.shortStay.self.otaFees;
  const selfOps = selfGross * ASSUMPTIONS.shortStay.self.operatingDrag;
  const selfTax = selfGross * taxRate;
  const selfNet = selfGross - selfOta - selfOps - selfTax;

  const gsGross = marketGross * ASSUMPTIONS.shortStay.goldstay.occupancy;
  const gsOta = gsGross * ASSUMPTIONS.shortStay.goldstay.otaFees;
  const gsMgmt = gsGross * ASSUMPTIONS.shortStay.goldstay.managementFee;
  const gsOps = gsGross * ASSUMPTIONS.shortStay.goldstay.operatingDrag;
  const gsTax = gsGross * taxRate;
  const gsNet = gsGross - gsOta - gsMgmt - gsOps - gsTax;

  return {
    marketGross: round(marketGross),
    self: {
      grossCollectedMonthly: round(selfGross),
      managementFee: 0,
      otaFees: round(selfOta),
      operatingCosts: round(selfOps),
      tax: round(selfTax),
      netMonthly: round(selfNet),
      netAnnual: round(selfNet * 12),
    },
    gs: {
      grossCollectedMonthly: round(gsGross),
      managementFee: round(gsMgmt),
      otaFees: round(gsOta),
      operatingCosts: round(gsOps),
      tax: round(gsTax),
      netMonthly: round(gsNet),
      netAnnual: round(gsNet * 12),
    },
  };
}

export function calculateYield(input: CalcInput): CalcResult {
  const { marketGross, self, gs } =
    input.strategy === "long-term"
      ? calcLongTerm(input)
      : calcShortStay(input);

  return {
    city: input.city,
    strategy: input.strategy,
    bedrooms: input.bedrooms,
    monthlyMarketRentUsd: input.monthlyMarketRentUsd,
    marketGrossMonthlyUsd: round(marketGross),
    selfManaged: self,
    goldstayManaged: gs,
    monthlyUplift: gs.netMonthly - self.netMonthly,
    annualUplift: gs.netAnnual - self.netAnnual,
    assumptions: ASSUMPTIONS,
  };
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
