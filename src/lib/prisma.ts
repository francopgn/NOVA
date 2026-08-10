import { PrismaClient } from "@prisma/client";

// En desarrollo, Next.js recarga módulos con cada cambio de archivo. Sin este
// patrón, cada recarga crearía una nueva conexión a la base y eventualmente
// se agotarían las conexiones disponibles. Guardamos la instancia en `global`
// para reutilizarla entre recargas.

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
