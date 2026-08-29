/**
 * Corre `prisma migrate deploy` se DATABASE_URL for Postgres.
 * Retenta em caso de lock P1002 (builds concurrentes na Vercel).
 */
const url = (process.env.DATABASE_URL || "").trim();
const isPg = url.startsWith("postgresql://") || url.startsWith("postgres://");

if (!isPg) {
  console.log("[db-migrate] Sem DATABASE_URL Postgres — a saltar migrate deploy.");
  process.exit(0);
}

const { spawnSync } = require("node:child_process");

function runOnce() {
  return spawnSync("npx", ["prisma", "migrate", "deploy"], {
    encoding: "utf8",
    shell: true,
    env: process.env,
  });
}

let last = null;
for (let attempt = 1; attempt <= 4; attempt++) {
  last = runOnce();
  const out = `${last.stdout || ""}${last.stderr || ""}`;
  if (last.status === 0) {
    if (last.stdout) process.stdout.write(last.stdout);
    if (last.stderr) process.stderr.write(last.stderr);
    process.exit(0);
  }
  const locked = /P1002|advisory lock/i.test(out);
  if (last.stdout) process.stdout.write(last.stdout);
  if (last.stderr) process.stderr.write(last.stderr);
  if (!locked || attempt === 4) break;
  const wait = attempt * 5000;
  console.warn(`[db-migrate] Lock Prisma (tentativa ${attempt}) — a aguardar ${wait}ms…`);
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, wait);
}

process.exit(last?.status ?? 1);
