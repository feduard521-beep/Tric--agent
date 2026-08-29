/**
 * Registo local por email + palavra-passe.
 * Com RESEND_API_KEY: envia confirmação e não faz login até verificar.
 */
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import {
  isEmailConfigured,
  issueEmailVerification,
} from "@/lib/modules/auth/verification";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  name: z.string().min(1).max(80).optional(),
});

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`register:${ip}`, 5, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Demasiados pedidos. Tenta mais tarde." },
        {
          status: 429,
          headers: { "Retry-After": String(rl.retryAfterSec) },
        },
      );
    }

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
      return NextResponse.json(
        {
          error:
            "Não foi possível criar a conta. Se já tens conta, entra ou recupera a password.",
        },
        { status: 400 },
      );
    }

    const name = parsed.data.name || email.split("@")[0];
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        emailVerified: null,
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

    const verification = await issueEmailVerification({
      email,
      name: user.name || name,
    });

    const emailRequired = isEmailConfigured();

    return NextResponse.json(
      {
        user,
        requiresVerification: emailRequired,
        emailSent: verification.emailSent,
        message: emailRequired
          ? verification.emailSent
            ? "Conta criada. Verifica o email para confirmares o endereço e depois entra."
            : "Conta criada, mas o email de confirmação falhou. Usa «Reenviar confirmação» em Entrar."
          : "Conta criada. (Email de confirmação desactivo — define RESEND_API_KEY na Vercel.)",
        // Só em dev sem Resend: ajuda a testar o link
        ...(verification.verifyUrl && !emailRequired
          ? { devVerifyUrl: verification.verifyUrl }
          : {}),
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[auth/register]", err);
    return NextResponse.json({ error: "Falha no registo." }, { status: 500 });
  }
}
