/**
 * Tokens de confirmação de email (tabela VerificationToken do Auth.js).
 */
import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import {
  appBaseUrl,
  isEmailConfigured,
  sendEmail,
  verificationEmailHtml,
  welcomeEmailHtml,
} from "@/lib/modules/email/send";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function hashToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export async function issueEmailVerification(opts: {
  email: string;
  name: string;
}) {
  if (!prisma) {
    return { emailSent: false, reason: "Sem base de dados." as const };
  }

  const email = opts.email.trim().toLowerCase();
  const raw = randomBytes(32).toString("hex");
  const token = hashToken(raw);
  const expires = new Date(Date.now() + TOKEN_TTL_MS);

  // Limpa tokens antigos deste email
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  });

  const verifyUrl = `${appBaseUrl()}/api/auth/verify?token=${raw}&email=${encodeURIComponent(email)}`;

  if (!isEmailConfigured()) {
    console.info(`[email] Verificação criada para ${email} (sem Resend): ${verifyUrl}`);
    return {
      emailSent: false,
      reason: "RESEND_API_KEY não configurada." as const,
      verifyUrl,
    };
  }

  const sent = await sendEmail({
    to: email,
    subject: "Confirma a tua conta Tricô",
    html: verificationEmailHtml({ name: opts.name, verifyUrl }),
    text: `Confirma a tua conta Tricô: ${verifyUrl}`,
  });

  return {
    emailSent: sent.ok,
    reason: sent.error,
    verifyUrl: undefined as string | undefined,
  };
}

export async function consumeEmailVerification(opts: {
  email: string;
  rawToken: string;
}) {
  if (!prisma) return { ok: false as const, error: "Sem BD." };

  const email = opts.email.trim().toLowerCase();
  const token = hashToken(opts.rawToken);
  const row = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!row || row.identifier !== email) {
    return { ok: false as const, error: "Link inválido ou já usado." };
  }
  if (row.expires.getTime() < Date.now()) {
    await prisma.verificationToken.delete({ where: { token } }).catch(() => undefined);
    return { ok: false as const, error: "Link expirado. Pede um novo." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { ok: false as const, error: "Conta não encontrada." };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({ where: { token } }),
  ]);

  // Boas-vindas (melhor esforço)
  if (isEmailConfigured()) {
    void sendEmail({
      to: email,
      subject: "Bem-vindo à Tricô",
      html: welcomeEmailHtml({
        name: user.name || email.split("@")[0],
        feedUrl: `${appBaseUrl()}/feed`,
      }),
      text: `Bem-vindo à Tricô. Abre o feed: ${appBaseUrl()}/feed`,
    });
  }

  return { ok: true as const, email };
}

export { isEmailConfigured };
