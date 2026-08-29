/**
 * Resolução de secrets — fail-closed em runtime de produção.
 *
 * Atenção: `next build` corre com NODE_ENV=production e avalia rotas
 * API; não podemos lançar erro nessa fase ou o build rebenta.
 */
import { timingSafeEqual, randomBytes } from "crypto";

function isNextBuildPhase() {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NEXT_PRIVATE_BUILD_WORKER === "1"
  );
}

/** Runtime real na Vercel (não o passo de compile). */
function isVercelRuntime() {
  return Boolean(process.env.VERCEL) && !isNextBuildPhase();
}

export function requireAuthSecret(): string {
  const secret = (process.env.AUTH_SECRET || "").trim();
  if (secret.length >= 32) return secret;

  // Placeholder só para o compile — nunca usado em pedidos reais se o env estiver certo
  if (isNextBuildPhase()) {
    return "trico-build-placeholder-not-for-runtime-use-32b";
  }

  if (isVercelRuntime() || process.env.VERCEL_ENV === "production") {
    throw new Error(
      "[auth] AUTH_SECRET em falta ou demasiado curto (≥32 chars). Define na Vercel → Settings → Environment Variables.",
    );
  }

  // Dev local
  return "trico-local-dev-only-secret-do-not-use-in-prod";
}

export function requireIngestSecret(): string | null {
  const secret = (
    process.env.CRON_SECRET ||
    process.env.INGEST_SECRET ||
    ""
  ).trim();
  if (secret.length >= 16) return secret;
  if (isNextBuildPhase()) return "trico-build-ingest-placeholder";
  if (isVercelRuntime() || process.env.VERCEL_ENV === "production") return null;
  return (process.env.INGEST_SECRET || "trico-ingest-local-dev").trim();
}

export function timingSafeStringEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) {
    const pad = randomBytes(Math.max(ba.length, 1));
    timingSafeEqual(pad, pad);
    return false;
  }
  return timingSafeEqual(ba, bb);
}
