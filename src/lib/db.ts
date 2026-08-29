/**
 * Cliente Prisma singleton (Prisma 7 + adapter better-sqlite3).
 *
 * Teste: `npx tsx -e "import { prisma } from './src/lib/db'; console.log(await prisma.user.count())"`
 */
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";
import path from "node:path";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function resolveDbUrl() {
  const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  if (raw.startsWith("file:")) {
    const rel = raw.replace(/^file:/, "");
    const abs = path.isAbsolute(rel)
      ? rel
      : path.join(/*turbopackIgnore: true*/ process.cwd(), rel);
    return `file:${abs}`;
  }
  return raw;
}

function createPrisma() {
  const adapter = new PrismaBetterSqlite3({ url: resolveDbUrl() });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
