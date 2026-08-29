/**
 * Dispara ingestão RSS + pipeline IA.
 * Teste:
 *   curl -X POST http://127.0.0.1:43123/api/ingest \
 *     -H "x-ingest-secret: trico-ingest-local"
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runIngest } from "@/lib/modules/rss/ingest";

export const maxDuration = 60;

export async function POST(req: Request) {
  const secret = req.headers.get("x-ingest-secret");
  const expected = process.env.INGEST_SECRET || "trico-ingest-local";
  if (secret !== expected) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json(
      {
        status: "error",
        message: "Ingestão indisponível sem BD (Vercel). Corre npm run ingest em local.",
        fetchedCount: 0,
        createdPieces: 0,
      },
      { status: 503 },
    );
  }

  const result = await runIngest();
  return NextResponse.json(result, {
    status: result.status === "ok" ? 200 : 500,
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    hint: "POST com header x-ingest-secret para correr a ingestão.",
  });
}
