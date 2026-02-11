// lib/prisma.ts
import { PrismaClient } from "./generated/prisma/client"; // <- import the generated client
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // avoid creating multiple clients during HMR in dev
  var prisma: PrismaClient | undefined;
}

// create the Postgres adapter using your DATABASE_URL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// create client with adapter (Prisma v7 requires adapter or accelerateUrl)
const client = globalThis.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = client;
}

export const db = client;
