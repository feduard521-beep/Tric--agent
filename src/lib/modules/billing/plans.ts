/**
 * Plano e preços Tricô (AOA).
 * Gratuito: até FREE_SECTOR_LIMIT sectores, sem Resumo do Ano.
 * Premium: 2000 Kz/mês — todos os sectores, Ano, alertas.
 */
export const PREMIUM_PRICE_KZ = 2000;
export const FREE_SECTOR_LIMIT = 2;
export const PREMIUM_DURATION_DAYS = 30;

export const PLAN_FEATURES = {
  gratuito: [
    `Até ${FREE_SECTOR_LIMIT} sectores de interesse`,
    "Resumos Hora / Dia / Semana",
    "Feed personalizado",
  ],
  premium: [
    "Todos os sectores ilimitados",
    "Resumo do Ano desbloqueado",
    "Prioridade nas actualizações",
    "Alertas de alto impacto",
  ],
} as const;

export function isPremiumPlan(plan?: string | null) {
  return plan === "premium";
}

export function canUseYearWindow(plan?: string | null) {
  return isPremiumPlan(plan);
}

export function maxSectorsForPlan(plan?: string | null) {
  return isPremiumPlan(plan) ? 99 : FREE_SECTOR_LIMIT;
}

export function clampSectorsForPlan<T>(sectors: T[], plan?: string | null): T[] {
  const max = maxSectorsForPlan(plan);
  return sectors.slice(0, max);
}
