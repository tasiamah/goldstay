// The contracting entity, in one place.
//
// GoldStay is a trading name, not a company: the entity that actually
// signs management agreements and receives booking revenue is EAR
// TADCO LIMITED. Contracts previously named a "Goldstay Limited",
// which is not a registered company, so any agreement naming it had a
// party that does not exist. Both contract templates and the PDF
// signature block now read from here.

export const MANAGER = {
  legalName: "EAR TADCO LIMITED",
  tradingName: "GoldStay",
  companyNumber: "PVT-KW1927VE",
  registeredOffice: "Pinetree Plaza, Kindaruma Road, Kilimani, Nairobi",
} as const;

// "EAR TADCO LIMITED trading as GoldStay" — how the entity is named in
// a signature block or a Schedule.
export const MANAGER_SIGNING_NAME = `${MANAGER.legalName} trading as ${MANAGER.tradingName}`;
