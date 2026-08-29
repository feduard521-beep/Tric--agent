/**
 * Estado Premium do utilizador autenticado (servidor).
 */
import { prisma } from "@/lib/db";

export async function userHasActivePremium(userId?: string | null) {
  if (!userId || !prisma) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, premiumUntil: true },
  });
  if (!user || user.plan !== "premium") return false;
  if (user.premiumUntil && user.premiumUntil.getTime() < Date.now()) {
    await prisma.user.update({
      where: { id: userId },
      data: { plan: "gratuito" },
    });
    return false;
  }
  return true;
}
