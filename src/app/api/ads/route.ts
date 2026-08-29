/**
 * API pública de anúncios de parceiros.
 * GET /api/ads?placement=feed-mid&sector=saude
 */
import { NextResponse } from "next/server";
import { auth } from "@/lib/modules/auth/config";
import { userHasActivePremium } from "@/lib/modules/billing/premium";
import {
  listActiveAds,
  pickAd,
  type AdPlacement,
} from "@/lib/modules/ads/repository";

const PLACEMENTS: AdPlacement[] = [
  "feed-top",
  "feed-mid",
  "feed-sidebar",
  "landing-mid",
  "piece-bottom",
  "sector-top",
];

export async function GET(req: Request) {
  const session = await auth();
  const premium = await userHasActivePremium(session?.user?.id);

  // Premium: sem publicidade (benefício do plano)
  if (premium) {
    return NextResponse.json({ ads: [], ad: null, premium: true });
  }

  const { searchParams } = new URL(req.url);
  const placement = searchParams.get("placement") as AdPlacement | null;
  const sectorId = searchParams.get("sector");
  const all = searchParams.get("all") === "1";

  if (placement && !PLACEMENTS.includes(placement)) {
    return NextResponse.json({ error: "Placement inválido." }, { status: 400 });
  }

  if (all) {
    const ads = await listActiveAds({
      placement: placement || undefined,
      sectorId: sectorId || undefined,
    });
    return NextResponse.json({ ads, premium: false });
  }

  if (!placement) {
    return NextResponse.json(
      { error: "Indica placement ou all=1." },
      { status: 400 },
    );
  }

  const ad = await pickAd({
    placement,
    sectorId: sectorId || undefined,
  });
  return NextResponse.json({ ad, premium: false });
}
