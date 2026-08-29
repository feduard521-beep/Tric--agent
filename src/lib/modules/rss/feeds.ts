/**
 * Fontes RSS do MVP Tricô (Angola + cobertura regional/africana).
 * Começar só com RSS evita scraping e problemas legais (secção 4.1 do documento).
 *
 * Teste: `npx tsx src/lib/modules/rss/feeds.ts` (exporta a lista)
 */
export type FeedDefinition = {
  name: string;
  url: string;
  /** Sugestão de sector; a IA/heurística pode corrigir. */
  sectorHint?: string;
};

export const RSS_FEEDS: FeedDefinition[] = [
  {
    name: "Google News — Angola",
    url: "https://news.google.com/rss/search?q=Angola&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "politica",
  },
  {
    name: "Google News — Economia Angola",
    url: "https://news.google.com/rss/search?q=Angola+economia+OR+kwanza+OR+BNA&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "economia",
  },
  {
    name: "Google News — Petróleo Angola",
    url: "https://news.google.com/rss/search?q=Angola+petr%C3%B3leo+OR+energia+OR+Sonangol&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "energia",
  },
  {
    name: "Google News — Saúde Angola",
    url: "https://news.google.com/rss/search?q=Angola+sa%C3%BAde+OR+hospital+OR+vacina&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "saude",
  },
  {
    name: "Google News — Tecnologia Angola",
    url: "https://news.google.com/rss/search?q=Angola+tecnologia+OR+digital+OR+fintech&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "tecnologia",
  },
  {
    name: "BBC África (PT via Google News)",
    url: "https://news.google.com/rss/search?q=site:bbc.com+Angola&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "politica",
  },
];
