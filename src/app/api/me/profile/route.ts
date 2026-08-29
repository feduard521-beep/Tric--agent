/**
 * Perfil da conta autenticada — ler / actualizar nome.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/modules/auth/config";
import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";

const patchSchema = z.object({
  name: z.string().trim().min(2).max(80),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (!prisma) {
    return NextResponse.json({
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      plan: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`profile:${ip}`, 20, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Demasiados pedidos." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Nome inválido (2–80 caracteres)." },
      { status: 400 },
    );
  }

  if (!prisma) {
    return NextResponse.json(
      { error: "Perfil na BD indisponível neste ambiente." },
      { status: 503 },
    );
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      role: true,
    },
  });

  return NextResponse.json({ user, message: "Nome actualizado." });
}
