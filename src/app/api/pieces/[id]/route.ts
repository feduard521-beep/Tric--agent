/**
 * Detalhe de uma peça + linha do tempo do tema.
 * Teste: GET /api/pieces/<id>
 */
import { NextResponse } from "next/server";
import {
  getPieceById,
  getThemeTimeline,
} from "@/lib/modules/pieces/repository";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const piece = await getPieceById(id);
  if (!piece) {
    return NextResponse.json({ error: "Peça não encontrada." }, { status: 404 });
  }
  const timeline = await getThemeTimeline(piece.themeId);
  return NextResponse.json({ piece, timeline });
}
