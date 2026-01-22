import { PrismaClient } from '@prisma/client';
// No need to pass URL here, Prisma 6 reads from .env automatically
export const prisma = new PrismaClient();