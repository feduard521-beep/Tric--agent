/**
 * Pacotes comerciais de publicidade — adaptados ao Tricô (por sector).
 * Valores em Kz são exemplos de tabela; o admin fecha o contrato final.
 */
import type { SectorId } from "@/lib/types";

export type AdPackage = {
  id: string;
  name: string;
  tagline: string;
  priceFromKz: number;
  period: "semana" | "mês";
  placement: string;
  highlights: string[];
  recommended?: boolean;
};

export const AD_PACKAGES: AdPackage[] = [
  {
    id: "banner-topo",
    name: "Banner topo",
    tagline: "Visibilidade em todo o feed",
    priceFromKz: 85_000,
    period: "mês",
    placement: "feed-top",
    highlights: [
      "Faixa acima das notícias do dia",
      "Rótulo «Publicidade» transparente",
      "Relatório mensal de impressões e cliques",
    ],
  },
  {
    id: "sector-destaque",
    name: "Destaque de sector",
    tagline: "Só o público do teu mercado",
    priceFromKz: 120_000,
    period: "mês",
    placement: "feed-mid",
    recommended: true,
    highlights: [
      "Aparece em Economia, Tecnologia, Energia, Saúde ou Política",
      "Ideal para bancos, telcos, seguros e clínicas",
      "Combina com sidebar no mesmo sector",
    ],
  },
  {
    id: "landing-home",
    name: "Home Tricô",
    tagline: "Primeira impressão do portal",
    priceFromKz: 150_000,
    period: "mês",
    placement: "landing-mid",
    highlights: [
      "Slot na página de entrada",
      "Alcance de visitantes ainda sem conta",
      "Criativo com CTA para o teu site ou WhatsApp",
    ],
  },
  {
    id: "pack-semana",
    name: "Campanha rápida",
    tagline: "7 dias · lançamento ou evento",
    priceFromKz: 35_000,
    period: "semana",
    placement: "feed-top",
    highlights: [
      "Activação em 24–48 h após aprovação",
      "Um sector ou alcance geral",
      "Bom para conferências e promoções pontuais",
    ],
  },
];

export function getAdPackage(id: string) {
  return AD_PACKAGES.find((p) => p.id === id);
}

export const PARTNER_SECTORS: { id: SectorId | "todos"; label: string }[] = [
  { id: "todos", label: "Todos os sectores" },
  { id: "economia", label: "Economia & Finanças" },
  { id: "politica", label: "Política" },
  { id: "tecnologia", label: "Tecnologia" },
  { id: "energia", label: "Energia & Recursos" },
  { id: "saude", label: "Saúde" },
];
