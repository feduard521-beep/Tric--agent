/**
 * Helpers de role admin (sem importar NextAuth — evita ciclo com config).
 *
 * Promoção automática só se:
 * - email ∈ ADMIN_EMAILS, e
 * - email verificado (OAuth), OU bootstrap (ainda não há nenhum admin na BD).
 */
import { prisma } from "@/lib/db";

export function parseAdminEmails(raw = process.env.ADMIN_EMAILS || "") {
  return raw
    .split(/[,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return parseAdminEmails().includes(email.trim().toLowerCase());
}

async function hasAnyAdmin(): Promise<boolean> {
  if (!prisma) return false;
  const n = await prisma.user.count({ where: { role: "admin" } });
  return n > 0;
}

/** Promove a admin se o email estiver em ADMIN_EMAILS e for seguro promover. */
export async function ensureAdminRole(
  userId: string,
  email?: string | null,
  opts?: { emailVerified?: Date | boolean | null },
) {
  if (!prisma || !isAdminEmail(email)) return false;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  if (user.role === "admin") return true;

  const verifiedFlag = opts?.emailVerified ?? user.emailVerified;
  const verified = Boolean(verifiedFlag);
  const bootstrap = !verified && !(await hasAnyAdmin());

  if (!verified && !bootstrap) {
    return false;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      role: "admin",
      ...(verified && !user.emailVerified
        ? { emailVerified: new Date() }
        : {}),
    },
  });
  return true;
}
