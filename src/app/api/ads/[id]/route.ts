/**
 * Tracking de impressões / cliques de anúncios.
 * POST /api/ads/[id]  { event: "impression" | "click" }
 */
import { NextResponse } from "next/server";
import { recordAdEvent } from "@/lib/modules/ads/repository";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  if (!id || id.length > 64) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`ad-event:${ip}`, 120, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Rate limit." }, { status: 429 });
  }

  let body: { event?: string } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const event = body.event === "click" ? "click" : "impression";
  await recordAdEvent(id, event);
  return NextResponse.json({ ok: true });
}
