/**
 * Cliente Prisma com PostgreSQL (@prisma/adapter-pg + pg).
 * Activo quando DATABASE_URL começa por postgres/postgresql.
 * Sem URL válida → prisma=null e a UI usa dados mock.
 *
 * Teste: DATABASE_URL=postgresql://... npm run db:migrate
 */
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient | null;
  prismaInit?: boolean;
};

function getDatabaseUrl() {
  return (process.env.DATABASE_URL || "").trim();
}

/** true se temos uma connection string Postgres utilizável */
export function isPostgresUrl(url = getDatabaseUrl()) {
  return (
    url.startsWith("postgresql://") ||
    url.startsWith("postgres://")
  );
}

export const isDbEnabled =
  process.env.DISABLE_DB !== "1" && isPostgresUrl();

function createPrisma(): PrismaClient | null {
  if (!isDbEnabled) {
    console.info(
      "[db] Postgres inactivo — define DATABASE_URL=postgresql://... (Neon/Vercel). A usar mock.",
    );
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require("pg") as {
      Pool: new (config: { connectionString: string; ssl?: object }) => unknown;
    };
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaPg } = require("@prisma/adapter-pg") as {
      PrismaPg: new (pool: unknown) => ConstructorParameters<
        typeof PrismaClient
      >[0] extends { adapter?: infer A }
        ? A
        : never;
    };

    const connectionString = getDatabaseUrl();
    const needsSsl =
      process.env.PGSSL === "1" ||
      process.env.VERCEL === "1" ||
      /neon\.tech|vercel-storage|sslmode=require/i.test(connectionString);

    const pool = new Pool({
      connectionString,
      ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch (err) {
    console.warn(
      "[db] Falha ao iniciar Prisma/Postgres:",
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
