import type { Sector } from "./types";

export const SECTORS: Sector[] = [
  {
    id: "economia",
    name: "Economia & Finanças",
    short: "Economia",
    description: "Mercados, banca, inflação e decisões de negócio em Angola.",
    icon: "chart",
  },
  {
    id: "politica",
    name: "Política",
    short: "Política",
    description: "Governo, Assembleia e agenda nacional.",
    icon: "landmark",
  },
  {
    id: "tecnologia",
    name: "Tecnologia",
    short: "Tecnologia",
    description: "Digitalização, startups e inovação com impacto local.",
    icon: "cpu",
  },
  {
    id: "energia",
    name: "Energia & Recursos",
    short: "Energia",
    description: "Petróleo, gás, mineração e transição energética.",
    icon: "zap",
  },
  {
    id: "saude",
    name: "Saúde",
    short: "Saúde",
    description: "Sistema de saúde, políticas públicas e bem-estar.",
    icon: "heart",
  },
];

export const TIME_WINDOWS = [
  { id: "hora" as const, label: "Hora", hint: "Última hora" },
  { id: "dia" as const, label: "Dia", hint: "Hoje" },
  { id: "semana" as const, label: "Semana", hint: "Esta semana" },
  { id: "ano" as const, label: "Ano", hint: "Este ano", premium: true },
];

export function getSector(id: string) {
  return SECTORS.find((s) => s.id === id);
}
