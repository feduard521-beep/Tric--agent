/**
 * Confirma email a partir do link enviado por Resend.
 * GET /api/auth/verify?token=...&email=...
 */
import { NextResponse } from "next/server";
import { consumeEmailVerification } from "@/lib/modules/auth/verification";
import { appBaseUrl } from "@/lib/modules/email/send";
import { ensureAdminRole } from "@/lib/modules/auth/roles";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const base = appBaseUrl();

  if (!token || !email) {
    return NextResponse.redirect(
      `${base}/entrar?error=${encodeURIComponent("Link de confirmação incompleto.")}`,
    );
  }

  const result = await consumeEmailVerification({ email, rawToken: token });
  if (!result.ok) {
    return NextResponse.redirect(
      `${base}/entrar?error=${encodeURIComponent(result.error)}`,
    );
  }

  // Promove admin se aplicável (email agora verificado)
  if (prisma) {
    const user = await prisma.user.findUnique({ where: { email: result.email } });
    if (user) {
      await ensureAdminRole(user.id, user.email, { emailVerified: true });
    }
  }

  return NextResponse.redirect(
    `${base}/entrar?verified=1&email=${encodeURIComponent(result.email)}`,
  );
}
