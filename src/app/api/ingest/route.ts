/**
 * Dispara ingestão RSS + APIs + pipeline IA.
 * Auth: header x-ingest-secret OU Authorization: Bearer <CRON_SECRET|INGEST_SECRET>
 * Vercel Cron envia Authorization: Bearer <CRON_SECRET>
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runIngest } from "@/lib/modules/rss/ingest";
import { getActiveNewsProviders } from "@/lib/modules/news/providers";

export const maxDuration = 60;

function authorize(req: Request) {
  const expected =
    process.env.CRON_SECRET ||
    process.env.INGEST_SECRET ||
    "trico-ingest-local";
  const headerSecret = req.headers.get("x-ingest-secret");
  const auth = req.headers.get("authorization") || "";
  const bearer = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : "";
  return headerSecret === expected || bearer === expected;
}

export async function POST(req: Request) {
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
  // Vercel Cron pode chamar GET — autenticar igual
  if (req.headers.get("authorization") || req.headers.get("x-ingest-secret")) {
    return POST(req);
  }
  return NextResponse.json({
    ok: true,
    hint: "POST/GET autenticado com x-ingest-secret ou Bearer CRON_SECRET.",
    providers: getActiveNewsProviders(),
  });
}
