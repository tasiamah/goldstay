// Prisma client singleton. Next.js dev mode hot-reloads server modules,
// which would otherwise spawn a fresh PrismaClient on every change and
// quickly exhaust the Postgres connection pool. We cache the client on
// globalThis in development; production gets a fresh instance per cold
// start, which is what we want.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
