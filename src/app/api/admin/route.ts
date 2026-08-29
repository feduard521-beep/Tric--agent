/**
 * API admin — stats, utilizadores, ingestão e pagamentos Premium.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/modules/auth/admin";
import { runIngest } from "@/lib/modules/rss/ingest";
import { getContentStats } from "@/lib/modules/pieces/repository";
import { getActiveNewsProviders } from "@/lib/modules/news/providers";
import { PREMIUM_DURATION_DAYS } from "@/lib/modules/billing/plans";

export const maxDuration = 60;

function addDays(d: Date, days: number) {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n;
}

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  if (!prisma) {
    return NextResponse.json(
      { error: "Base de dados indisponível." },
      { status: 503 },
    );
  }

  const [users, pieceStats, lastIngest, feedCount, payments, ads] =
    await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        premiumUntil: true,
        createdAt: true,
        image: true,
      },
    }),
    getContentStats(),
    prisma.ingestRun.findFirst({ orderBy: { startedAt: "desc" } }),
    prisma.feedSource.count(),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: { select: { email: true, name: true } } },
    }),
    (async () => {
      const { listAllAdsAdmin, ensureExampleAds } = await import(
        "@/lib/modules/ads/repository"
      );
      await ensureExampleAds().catch(() => undefined);
      return listAllAdsAdmin();
    })(),
  ]);

  return NextResponse.json({
    users,
    payments,
    ads,
    providers: getActiveNewsProviders(),
    stats: {
      ...pieceStats,
      feeds: feedCount,
      userCount: users.length,
      lastIngest,
    },
  });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  if (!prisma) {
    return NextResponse.json(
      { error: "Base de dados indisponível." },
      { status: 503 },
    );
  }

  let body: {
    action?: string;
    userId?: string;
    role?: string;
    paymentId?: string;
    adId?: string;
    active?: boolean;
  } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  if (body.action === "ingest") {
    const result = await runIngest();
    return NextResponse.json(result, {
      status: result.status === "ok" ? 200 : 500,
    });
  }

  if (body.action === "setRole" && body.userId && body.role) {
    if (body.role !== "admin" && body.role !== "user") {
      return NextResponse.json({ error: "Role inválida." }, { status: 400 });
    }
    const updated = await prisma.user.update({
      where: { id: body.userId },
      data: { role: body.role },
      select: { id: true, email: true, role: true },
    });
    return NextResponse.json({ user: updated });
  }

  if (body.action === "confirmPayment" && body.paymentId) {
    const payment = await prisma.payment.findUnique({
      where: { id: body.paymentId },
    });
    if (!payment) {
      return NextResponse.json({ error: "Pagamento não encontrado." }, { status: 404 });
    }
    const until = addDays(new Date(), PREMIUM_DURATION_DAYS);
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "confirmed", confirmedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: payment.userId },
        data: { plan: "premium", premiumUntil: until },
      }),
    ]);
    return NextResponse.json({ ok: true, premiumUntil: until });
  }

  if (body.action === "grantPremium" && body.userId) {
    const until = addDays(new Date(), PREMIUM_DURATION_DAYS);
    const user = await prisma.user.update({
      where: { id: body.userId },
      data: { plan: "premium", premiumUntil: until },
      select: { id: true, email: true, plan: true, premiumUntil: true },
    });
    return NextResponse.json({ user });
  }

  if (body.action === "toggleAd" && body.adId) {
    const ad = await prisma.adCampaign.findUnique({ where: { id: body.adId } });
    if (!ad) {
      return NextResponse.json({ error: "Anúncio não encontrado." }, { status: 404 });
    }
    const updated = await prisma.adCampaign.update({
      where: { id: body.adId },
      data: { active: typeof body.active === "boolean" ? body.active : !ad.active },
    });
    return NextResponse.json({ ad: updated });
  }

  if (body.action === "seedAds") {
    const { ensureExampleAds, listAllAdsAdmin } = await import(
      "@/lib/modules/ads/repository"
    );
    await prisma.adCampaign.deleteMany({});
    await ensureExampleAds();
    return NextResponse.json({ ads: await listAllAdsAdmin() });
  }

  return NextResponse.json({ error: "Acção desconhecida." }, { status: 400 });
}
