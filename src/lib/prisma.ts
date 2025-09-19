import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"], // Solo errores, no queries
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // ✅ CONFIGURACIÓN CORRECTA: Usar las opciones válidas de Prisma
    errorFormat: 'pretty', // Mejor formato de errores
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
