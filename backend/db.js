import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

function getDbUrl() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        // In a real app, you'd want to throw an error or handle this case
        return undefined;
    }
    const separator = dbUrl.includes('?') ? '&' : '?';
    // Append parameters for Render specifically
    return `${dbUrl}${separator}connect_timeout=30&pool_timeout=30`;
}


export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: getDbUrl(),
    log: ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
