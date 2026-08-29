/**
 * Resolução de secrets — fail-closed em produção.
 */
import { timingSafeEqual, randomBytes } from "crypto";

function isProductionRuntime() {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
  );
}

export function requireAuthSecret(): string {
  const secret = (process.env.AUTH_SECRET || "").trim();
  if (secret.length >= 32) return secret;
  if (isProductionRuntime()) {
    throw new Error(
      "[auth] AUTH_SECRET em falta ou demasiado curto (≥32 chars). Sem fallback em produção.",
    );
  }
  // Dev only — previsível de propósito; nunca em prod
  return "trico-local-dev-only-secret-do-not-use-in-prod";
}

export function requireIngestSecret(): string | null {
  const secret = (
    process.env.CRON_SECRET ||
    process.env.INGEST_SECRET ||
    ""
  ).trim();
  if (secret.length >= 16) return secret;
  if (isProductionRuntime()) return null;
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
