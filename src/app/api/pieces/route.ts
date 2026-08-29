/**
 * API pública de peças — consumível pela web e por clientes móveis futuros.
 * Teste: GET /api/pieces?tempo=dia&sector=economia&q=kwanza
 */
import { NextResponse } from "next/server";
import { listPieces, getContentStats } from "@/lib/modules/pieces/repository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tempo = searchParams.get("tempo") || undefined;
  const sector = searchParams.get("sector") || undefined;
  const q = searchParams.get("q") || undefined;
  const stats = searchParams.get("stats") === "1";

  if (stats) {
    return NextResponse.json(await getContentStats());
  }

  const pieces = await listPieces({
    timeWindow: tempo || undefined,
    sectorId: sector || undefined,
    query: q || undefined,
  });

  return NextResponse.json({
    count: pieces.length,
    pieces,
  });
}
