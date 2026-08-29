/**
 * Helpers de role admin (sem importar NextAuth — evita ciclo com config).
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

/** Promove a admin se o email estiver em ADMIN_EMAILS. */
export async function ensureAdminRole(userId: string, email?: string | null) {
  if (!prisma || !isAdminEmail(email)) return false;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  if (user.role === "admin") return true;
  await prisma.user.update({
    where: { id: userId },
    data: { role: "admin" },
  });
  return true;
}
