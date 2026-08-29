/**
 * Publicidade de parceiros — exemplos + repositório.
 */
import { prisma } from "@/lib/db";
import { safeHttpUrl } from "@/lib/security/urls";
import type { AdPlacement, AdPublic } from "@/lib/modules/ads/types";

export type { AdPlacement, AdPublic };

const EXAMPLE_ADS: Omit<AdPublic, "id">[] = [
  {
    partnerName: "Banco Atlântico (exemplo)",
    headline: "Crédito PME com taxa preferencial para o teu sector",
    body: "Linha de financiamento pensada para negócios em crescimento em Angola.",
    ctaLabel: "Pedir simulação",
    targetUrl: "https://trico-agent.vercel.app/premium",
    placement: "feed-top",
    sectorId: null,
    accent: "navy",
  },
  {
    partnerName: "Unitel Empresas (exemplo)",
    headline: "Dados e cloud para redacções e startups",
    body: "Pacotes B2B com prioridade de rede nas capitais provinciais.",
    ctaLabel: "Ver planos",
    targetUrl: "https://trico-agent.vercel.app/premium",
    placement: "feed-mid",
    sectorId: "tecnologia",
    accent: "teal",
  },
  {
    partnerName: "ENSA Seguros (exemplo)",
    headline: "Protege a tua operação energética",
    body: "Seguro industrial e responsabilidade civil para operadores do sector.",
    ctaLabel: "Falar com consultor",
    targetUrl: "https://trico-agent.vercel.app/premium",
    placement: "feed-mid",
    sectorId: "energia",
    accent: "emerald",
  },
  {
    partnerName: "Clínica Girassol (exemplo)",
    headline: "Check-up executivo em 48 horas",
    body: "Pacotes de saúde ocupacional para empresas e profissionais liberais.",
    ctaLabel: "Marcar",
    targetUrl: "https://trico-agent.vercel.app/premium",
    placement: "feed-sidebar",
    sectorId: "saude",
    accent: "terracotta",
  },
  {
    partnerName: "Multicaixa Express (exemplo)",
    headline: "Recebe pagamentos digitais no teu negócio",
    body: "Integração simples para PMEs — destaque no Tricô Economia.",
    ctaLabel: "Quero ser parceiro",
    targetUrl: "https://trico-agent.vercel.app/premium",
    placement: "landing-mid",
    sectorId: "economia",
    accent: "navy",
  },
  {
    partnerName: "Tricô Premium",
    headline: "Sem publicidade · sectores ilimitados",
    body: "2000 Kz/mês — Resumo do Ano e alertas do teu sector.",
    ctaLabel: "Ver Premium",
    targetUrl: "https://trico-agent.vercel.app/premium",
    placement: "piece-bottom",
    sectorId: null,
    accent: "terracotta",
  },
];

function mockId(i: number) {
  return `example-ad-${i + 1}`;
}

export function getExampleAds(): AdPublic[] {
  return EXAMPLE_ADS.map((ad, i) => ({ ...ad, id: mockId(i) }));
}

function isLive(ad: {
  active: boolean;
  startsAt: Date;
  endsAt: Date | null;
}) {
  const now = Date.now();
  if (!ad.active) return false;
  if (ad.startsAt.getTime() > now) return false;
  if (ad.endsAt && ad.endsAt.getTime() < now) return false;
  return true;
}

function toPublic(ad: {
  id: string;
  partnerName: string;
  headline: string;
  body: string;
  ctaLabel: string;
  targetUrl: string;
  placement: string;
  sectorId: string | null;
  accent: string;
}): AdPublic | null {
  const url = safeHttpUrl(ad.targetUrl);
  if (!url) return null;
  return {
    id: ad.id,
    partnerName: ad.partnerName,
    headline: ad.headline,
    body: ad.body,
    ctaLabel: ad.ctaLabel,
    targetUrl: url,
    placement: ad.placement as AdPlacement,
    sectorId: ad.sectorId,
    accent: ad.accent,
  };
}

/** Garante campanhas de exemplo na BD (idempotente). */
export async function ensureExampleAds() {
  if (!prisma) return;
  const count = await prisma.adCampaign.count();
  if (count > 0) return;
  await prisma.adCampaign.createMany({
    data: EXAMPLE_ADS.map((ad) => ({
      partnerName: ad.partnerName,
      headline: ad.headline,
      body: ad.body,
      ctaLabel: ad.ctaLabel,
      targetUrl: ad.targetUrl,
      placement: ad.placement,
      sectorId: ad.sectorId,
      accent: ad.accent,
      active: true,
      priority: 10,
    })),
  });
}

export async function listActiveAds(opts: {
  placement?: AdPlacement;
  sectorId?: string | null;
}): Promise<AdPublic[]> {
  await ensureExampleAds().catch(() => undefined);

  if (!prisma) {
    return getExampleAds().filter((ad) => {
      if (opts.placement && ad.placement !== opts.placement) return false;
      if (opts.sectorId) {
        return !ad.sectorId || ad.sectorId === opts.sectorId;
      }
      return true;
    });
  }

  const rows = await prisma.adCampaign.findMany({
    where: {
      active: true,
      ...(opts.placement ? { placement: opts.placement } : {}),
      OR: opts.sectorId
        ? [{ sectorId: null }, { sectorId: opts.sectorId }]
        : undefined,
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    take: 40,
  });

  return rows
    .filter(isLive)
    .map(toPublic)
    .filter((x): x is AdPublic => Boolean(x));
}

export async function pickAd(opts: {
  placement: AdPlacement;
  sectorId?: string | null;
}): Promise<AdPublic | null> {
  const list = await listActiveAds(opts);
  if (!opts.sectorId) {
    return list.find((a) => !a.sectorId) || list[0] || null;
  }
  return (
    list.find((a) => a.sectorId === opts.sectorId) ||
    list.find((a) => !a.sectorId) ||
    list[0] ||
    null
  );
}

export async function recordAdEvent(
  id: string,
  type: "impression" | "click",
) {
  if (!prisma || id.startsWith("example-ad-")) return;
  try {
    await prisma.adCampaign.update({
      where: { id },
      data:
        type === "impression"
          ? { impressions: { increment: 1 } }
          : { clicks: { increment: 1 } },
    });
  } catch {
    /* ignore missing */
  }
}

export async function listAllAdsAdmin() {
  if (!prisma) return getExampleAds().map((a) => ({ ...a, active: true, impressions: 0, clicks: 0 }));
  await ensureExampleAds().catch(() => undefined);
  return prisma.adCampaign.findMany({
    orderBy: [{ active: "desc" }, { priority: "desc" }, { createdAt: "desc" }],
  });
}
