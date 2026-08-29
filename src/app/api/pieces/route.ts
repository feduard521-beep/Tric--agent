/**
 * API de peças — consumível pela web e clientes móveis.
 * Janela `ano` exige sessão Premium activa (servidor).
 * Teste: GET /api/pieces?tempo=dia&sector=economia&q=kwanza
 */
import { NextResponse } from "next/server";
import { auth } from "@/lib/modules/auth/config";
import { userHasActivePremium } from "@/lib/modules/billing/premium";
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

  if (tempo === "ano") {
    const session = await auth();
    const ok = await userHasActivePremium(session?.user?.id);
    if (!ok) {
      return NextResponse.json(
        {
          error: "Resumo do Ano disponível no plano Premium.",
          code: "PREMIUM_REQUIRED",
          count: 0,
          pieces: [],
        },
        { status: 403 },
      );
    }
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
