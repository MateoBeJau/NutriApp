import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"], // agrega "query" si querés ver SQL
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
