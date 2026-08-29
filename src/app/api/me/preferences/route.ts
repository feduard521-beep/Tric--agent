/**
 * Preferências do utilizador autenticado (sincroniza com a BD).
 * Teste: GET/PUT /api/me/preferences (com sessão).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/modules/auth/config";
import { prisma } from "@/lib/db";

const schema = z.object({
  sectors: z.array(z.string()).max(12),
  notifications: z.enum(["app", "email", "alertas"]),
  onboarded: z.boolean(),
  plan: z.enum(["gratuito", "premium"]).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const prefs = await prisma.userPreference.findUnique({
    where: { userId: session.user.id },
  });
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, email: true, name: true },
  });

  return NextResponse.json({
    sectors: prefs ? (JSON.parse(prefs.sectorsJson) as string[]) : [],
    notifications: prefs?.notifications ?? "app",
    onboarded: prefs?.onboarded ?? false,
    plan: user?.plan ?? "gratuito",
    user,
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const data = parsed.data;
  await prisma.userPreference.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      sectorsJson: JSON.stringify(data.sectors),
      notifications: data.notifications,
      onboarded: data.onboarded,
    },
    update: {
      sectorsJson: JSON.stringify(data.sectors),
      notifications: data.notifications,
      onboarded: data.onboarded,
    },
  });

  if (data.plan) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { plan: data.plan },
    });
  }

  return NextResponse.json({ ok: true });
}
