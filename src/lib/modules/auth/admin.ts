/**
 * Gate de rotas admin — requer sessão autenticada com role admin.
 */
import { auth } from "@/lib/modules/auth/config";
import { ensureAdminRole, isAdminEmail } from "@/lib/modules/auth/roles";

export { ensureAdminRole, isAdminEmail, parseAdminEmails } from "@/lib/modules/auth/roles";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false as const, status: 401 as const, error: "Não autenticado." };
  }
  if (session.user.role === "admin") {
    return { ok: true as const, session };
  }
  // Fallback: email em ADMIN_EMAILS só se já for admin na BD / verificado via ensure
  if (isAdminEmail(session.user.email)) {
    const promoted = await ensureAdminRole(session.user.id, session.user.email);
    if (promoted || session.user.role === "admin") {
      return { ok: true as const, session };
    }
  }
  return { ok: false as const, status: 403 as const, error: "Acesso de admin necessário." };
}
