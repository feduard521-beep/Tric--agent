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
  const role = session.user.role;
  if (role !== "admin" && !isAdminEmail(session.user.email)) {
    return { ok: false as const, status: 403 as const, error: "Acesso de admin necessário." };
  }
  if (role !== "admin" && session.user.email) {
    await ensureAdminRole(session.user.id, session.user.email);
  }
  return { ok: true as const, session };
}
