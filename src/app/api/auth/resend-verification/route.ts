/**
 * Reenvia email de confirmação.
 * POST { email }
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import {
  isEmailConfigured,
  issueEmailVerification,
} from "@/lib/modules/auth/verification";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`resend-verify:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Demasiados pedidos. Tenta mais tarde." },
      { status: 429 },
    );
  }

  if (!isEmailConfigured()) {
    return NextResponse.json(
      {
        error:
          "Envio de email não configurado (RESEND_API_KEY). Usa Google ou contacta o admin.",
      },
      { status: 503 },
    );
  }

  if (!prisma) {
    return NextResponse.json({ error: "Sem base de dados." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  // Resposta genérica — não revelar se o email existe
  const generic = {
    ok: true,
    message:
      "Se existir uma conta por confirmar com este email, enviámos um novo link.",
  };

  if (!user?.passwordHash) {
    return NextResponse.json(generic);
  }
  if (user.emailVerified) {
    return NextResponse.json({
      ok: true,
      message: "Este email já está confirmado. Podes entrar.",
    });
  }

  await issueEmailVerification({
    email,
    name: user.name || email.split("@")[0],
  });

  return NextResponse.json(generic);
}
