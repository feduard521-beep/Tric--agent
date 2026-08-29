/**
 * Dispara ingestão RSS + APIs + pipeline IA.
 * Auth: header x-ingest-secret OU Authorization: Bearer <CRON_SECRET|INGEST_SECRET>
 * Em produção exige secret configurado (sem fallback).
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runIngest } from "@/lib/modules/rss/ingest";
import { getActiveNewsProviders } from "@/lib/modules/news/providers";
import {
  requireIngestSecret,
  timingSafeStringEqual,
} from "@/lib/security/secrets";

export const maxDuration = 60;

function authorize(req: Request) {
  const expected = requireIngestSecret();
  if (!expected) return false;
  const headerSecret = req.headers.get("x-ingest-secret") || "";
  const auth = req.headers.get("authorization") || "";
  const bearer = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : "";
  return (
    timingSafeStringEqual(headerSecret, expected) ||
    timingSafeStringEqual(bearer, expected)
  );
}

export async function POST(req: Request) {
  if (!requireIngestSecret()) {
    return NextResponse.json(
      { error: "INGEST_SECRET/CRON_SECRET não configurado." },
      { status: 503 },
    );
  }
  if (!authorize(req)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json(
      {
        status: "error",
        message: "Ingestão indisponível sem BD.",
        fetchedCount: 0,
        createdPieces: 0,
      },
      { status: 503 },
    );
  }

  const result = await runIngest();
  return NextResponse.json(
    { ...result, providers: getActiveNewsProviders() },
    { status: result.status === "ok" ? 200 : 500 },
  );
}

export async function GET(req: Request) {
  // Só responde com ingestão se autenticado — sem info pública de providers
  if (req.headers.get("authorization") || req.headers.get("x-ingest-secret")) {
    return POST(req);
  }
  return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
}
