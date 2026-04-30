// Shared zod schemas for the admin Server Actions. Each schema lives
// in one place so the test suite can hit them directly and the Server
// Actions can import without dragging extra weight into the bundle.
import { z } from "zod";
import {
  BookingSource,
  BookingStatus,
  Country,
  LeaseStatus,
  PropertyStatus,
  PropertyType,
  TransactionDirection,
  TransactionType,
  UnitStatus,
} from "@prisma/client";
import {
  optionalDate,
  optionalDecimal,
  optionalInt,
  optionalString,
  requiredAmount,
  requiredDate,
} from "./preprocessors";

export const OwnerInput = z.object({
  email: z.string().trim().toLowerCase().email(),
  fullName: z.string().trim().min(2, "Name is too short").max(120),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v ? v : undefined)),
  companyName: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => (v ? v : undefined)),
  country: z.nativeEnum(Country),
  preferredCurrency: z
    .string()
    .trim()
    .toUpperCase()
    .min(3)
    .max(3)
    .default("USD"),
});

export const PropertyInput = z.object({
  ownerId: z.string().min(1),
  name: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(80),
  neighbourhood: optionalString,
  address: z.string().trim().min(3).max(240),
  description: optionalString,
  bedrooms: optionalInt,
  bathrooms: optionalInt,
  sizeSqm: optionalInt,
  acquisitionPrice: optionalDecimal,
  acquisitionCurrency: z.string().trim().toUpperCase().min(3).max(3).optional(),
  status: z.nativeEnum(PropertyStatus).default("ONBOARDING"),
  propertyType: z.nativeEnum(PropertyType).default("LONG_TERM"),
  hostawayListingId: optionalString,
});

export const BookingInput = z.object({
  propertyId: z.string().min(1),
  source: z.nativeEnum(BookingSource),
  externalId: optionalString,
  guestName: z.string().trim().min(1).max(120),
  guestEmail: z
    .preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
      z.string().email().optional(),
    )
    .optional(),
  checkIn: requiredDate,
  checkOut: requiredDate,
  grossAmount: requiredAmount,
  otaCommission: optionalDecimal,
  cleaningFee: optionalDecimal,
  netPayout: requiredAmount,
  currency: z.string().trim().toUpperCase().min(3).max(3).default("KES"),
  status: z.nativeEnum(BookingStatus).default("CONFIRMED"),
  notes: optionalString,
});

export const UnitInput = z.object({
  propertyId: z.string().min(1),
  label: z.string().trim().min(1).max(60),
  bedrooms: optionalInt,
  bathrooms: optionalInt,
  sizeSqm: optionalInt,
  status: z.nativeEnum(UnitStatus).default("VACANT"),
});

export const LeaseInput = z.object({
  unitId: z.string().min(1),
  tenantName: z.string().trim().min(2).max(120),
  tenantEmail: z
    .preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
      z.string().email().optional(),
    )
    .optional(),
  tenantPhone: optionalString,
  startDate: requiredDate,
  endDate: optionalDate,
  monthlyRent: requiredAmount,
  currency: z.string().trim().toUpperCase().min(3).max(3).default("KES"),
  depositAmount: optionalDecimal,
  status: z.nativeEnum(LeaseStatus).default("ACTIVE"),
  notes: optionalString,
});

export const TransactionInput = z.object({
  propertyId: z.string().min(1),
  leaseId: optionalString,
  bookingId: optionalString,
  occurredOn: requiredDate,
  type: z.nativeEnum(TransactionType),
  direction: z.nativeEnum(TransactionDirection),
  amount: requiredAmount,
  currency: z.string().trim().toUpperCase().min(3).max(3).default("KES"),
  description: optionalString,
  reference: optionalString,
});
