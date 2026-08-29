/**
 * Corre `prisma migrate deploy` se DATABASE_URL for Postgres.
 * Usado no build da Vercel para criar/actualizar tabelas.
 */
const url = (process.env.DATABASE_URL || "").trim();
const isPg = url.startsWith("postgresql://") || url.startsWith("postgres://");

if (!isPg) {
  console.log("[db-migrate] Sem DATABASE_URL Postgres — a saltar migrate deploy.");
  process.exit(0);
}

const { spawnSync } = require("node:child_process");
const result = spawnSync(
  "npx",
  ["prisma", "migrate", "deploy"],
  { stdio: "inherit", shell: true, env: process.env },
);
process.exit(result.status ?? 1);
