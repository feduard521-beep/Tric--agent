/**
 * Registo local por email + palavra-passe.
 * Na Vercel sem BD devolve 503 (usar Postgres numa fase seguinte).
 */
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  name: z.string().min(1).max(80).optional(),
});

export async function POST(req: Request) {
  try {
    if (!prisma) {
      return NextResponse.json(
        {
          error:
            "Registo indisponível neste ambiente (sem base de dados). Corre localmente ou liga Postgres na Vercel.",
        },
        { status: 503 },
      );
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos. Password mín. 8 caracteres." },
        { status: 400 },
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email já registado." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name: parsed.data.name || email.split("@")[0],
        passwordHash,
        preferences: {
          create: {
            sectorsJson: "[]",
            notifications: "app",
            onboarded: false,
          },
        },
      },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("[auth/register]", err);
    return NextResponse.json({ error: "Falha no registo." }, { status: 500 });
  }
}
