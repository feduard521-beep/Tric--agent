/**
 * Fontes RSS Tricô — Angola por sector + regionais.
 * Preferir RSS/Atom a scraping (mais estável e legal).
 */
export type FeedDefinition = {
  name: string;
  url: string;
  sectorHint?: string;
};

export const RSS_FEEDS: FeedDefinition[] = [
  // --- Economia ---
  {
    name: "Google News — Economia Angola",
    url: "https://news.google.com/rss/search?q=Angola+economia+OR+kwanza+OR+BNA+OR+banco&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "economia",
  },
  {
    name: "Google News — Negócios Angola",
    url: "https://news.google.com/rss/search?q=Angola+(neg%C3%B3cios+OR+investimento+OR+empresa)&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "economia",
  },
  {
    name: "Google News — Expansão Angola",
    url: "https://news.google.com/rss/search?q=site:expansao.co.ao&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "economia",
  },
  // --- Política ---
  {
    name: "Google News — Política Angola",
    url: "https://news.google.com/rss/search?q=Angola+(pol%C3%ADtica+OR+governo+OR+Assembleia+OR+PR)&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "politica",
  },
  {
    name: "Google News — Angola geral",
    url: "https://news.google.com/rss/search?q=Angola&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "politica",
  },
  {
    name: "BBC África — Angola",
    url: "https://news.google.com/rss/search?q=site:bbc.com+Angola&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "politica",
  },
  // --- Tecnologia ---
  {
    name: "Google News — Tecnologia Angola",
    url: "https://news.google.com/rss/search?q=Angola+(tecnologia+OR+digital+OR+fintech+OR+startup)&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "tecnologia",
  },
  {
    name: "Google News — Telecom Angola",
    url: "https://news.google.com/rss/search?q=Angola+(Unitel+OR+Movicel+OR+Africell+OR+5G)&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "tecnologia",
  },
  // --- Energia ---
  {
    name: "Google News — Petróleo Angola",
    url: "https://news.google.com/rss/search?q=Angola+(petr%C3%B3leo+OR+Sonangol+OR+energia+OR+g%C3%A1s)&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "energia",
  },
  {
    name: "Google News — Mineração Angola",
    url: "https://news.google.com/rss/search?q=Angola+(diamante+OR+mina+OR+Endiama+OR+minera%C3%A7%C3%A3o)&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "energia",
  },
  // --- Saúde ---
  {
    name: "Google News — Saúde Angola",
    url: "https://news.google.com/rss/search?q=Angola+(sa%C3%BAde+OR+hospital+OR+vacina+OR+MINSA)&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "saude",
  },
  {
    name: "Google News — OMS África Angola",
    url: "https://news.google.com/rss/search?q=Angola+(OMS+OR+epidemia+OR+mal%C3%A1ria)&hl=pt-PT&gl=AO&ceid=AO:pt-150",
    sectorHint: "saude",
  },
];
