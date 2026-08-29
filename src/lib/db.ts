/**
 * Cliente Prisma — SQLite local (dev) via better-sqlite3.
 * Na Vercel (`VERCEL=1`) devolvemos null: filesystem efémero + native addon.
 * A UI/API usam fallback mock quando `prisma` é null.
 *
 * Teste local: verificar que `isDbEnabled === true` e `prisma` não é null.
 */
import { PrismaClient } from "@/generated/prisma/client";
import path from "node:path";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient | null;
  prismaInit?: boolean;
};

/** false na Vercel / quando DISABLE_DB=1 */
export const isDbEnabled =
  process.env.DISABLE_DB !== "1" && process.env.VERCEL !== "1";

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

function createPrisma(): PrismaClient | null {
  if (!isDbEnabled) {
    console.info("[db] SQLite desactivado (Vercel) — fallback mock activo.");
    return null;
  }

  try {
    // Import dinâmico: evita que o bundler da Vercel resolva o native addon.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3") as {
      PrismaBetterSqlite3: new (args: { url: string }) => ConstructorParameters<
        typeof PrismaClient
      >[0] extends { adapter?: infer A }
        ? A
        : never;
    };
    const adapter = new PrismaBetterSqlite3({ url: resolveDbUrl() });
    return new PrismaClient({ adapter });
  } catch (err) {
    console.warn(
      "[db] Falha ao iniciar Prisma/SQLite:",
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}

function getPrisma(): PrismaClient | null {
  if (globalForPrisma.prismaInit) return globalForPrisma.prisma ?? null;
  const client = createPrisma();
  globalForPrisma.prisma = client;
  globalForPrisma.prismaInit = true;
  return client;
}

export const prisma: PrismaClient | null = getPrisma();
