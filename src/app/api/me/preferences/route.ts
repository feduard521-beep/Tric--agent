/**
 * Preferências do utilizador autenticado (sincroniza com a BD).
 * Plano Premium só via /api/billing (não via este endpoint).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/modules/auth/config";
import { prisma } from "@/lib/db";
import {
  clampSectorsForPlan,
  FREE_SECTOR_LIMIT,
} from "@/lib/modules/billing/plans";

const schema = z.object({
  sectors: z.array(z.string()).max(12),
  notifications: z.enum(["app", "email", "alertas"]),
  onboarded: z.boolean(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json({
      sectors: [],
      notifications: "app",
      onboarded: false,
      plan: "gratuito",
      sectorLimit: FREE_SECTOR_LIMIT,
      user: { email: session.user.email, name: session.user.name },
      database: false,
    });
  }

  const prefs = await prisma.userPreference.findUnique({
    where: { userId: session.user.id },
  });
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, premiumUntil: true, email: true, name: true },
  });

  // Expirar premium se passou a data
  let plan = user?.plan ?? "gratuito";
  if (
    plan === "premium" &&
    user?.premiumUntil &&
    user.premiumUntil.getTime() < Date.now()
  ) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { plan: "gratuito" },
    });
    plan = "gratuito";
  }

  return NextResponse.json({
    sectors: prefs ? (JSON.parse(prefs.sectorsJson) as string[]) : [],
    notifications: prefs?.notifications ?? "app",
    onboarded: prefs?.onboarded ?? false,
    plan,
    premiumUntil: user?.premiumUntil,
    sectorLimit: plan === "premium" ? 99 : FREE_SECTOR_LIMIT,
    user,
    database: true,
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json(
      { error: "BD indisponível neste ambiente." },
      { status: 503 },
    );
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });
  const plan = user?.plan ?? "gratuito";
  const sectors = clampSectorsForPlan(parsed.data.sectors, plan);

  await prisma.userPreference.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      sectorsJson: JSON.stringify(sectors),
      notifications: parsed.data.notifications,
      onboarded: parsed.data.onboarded,
    },
    update: {
      sectorsJson: JSON.stringify(sectors),
      notifications: parsed.data.notifications,
      onboarded: parsed.data.onboarded,
    },
  });

  return NextResponse.json({
    ok: true,
    sectors,
    plan,
    sectorLimit: plan === "premium" ? 99 : FREE_SECTOR_LIMIT,
    truncated: sectors.length < parsed.data.sectors.length,
  });
}
