/**
 * Conectores de APIs de notícias (NewsData / GNews / NewsAPI).
 * Activa com variáveis de ambiente; sem chave a ingestão usa só RSS.
 *
 * NewsData: NEWSDATA_API_KEY  https://newsdata.io
 * GNews:    GNEWS_API_KEY     https://gnews.io
 * NewsAPI:  NEWS_API_KEY      https://newsapi.org (dev/test)
 */
export type ApiArticle = {
  title: string;
  url: string;
  summary: string;
  content: string;
  publishedAt: Date;
  sourceName: string;
  sectorHint?: string;
  imageUrl?: string;
};

const SECTOR_QUERIES: { sector: string; q: string }[] = [
  { sector: "economia", q: "Angola economia OR kwanza OR BNA" },
  { sector: "politica", q: "Angola governo OR política OR Assembleia" },
  { sector: "tecnologia", q: "Angola tecnologia OR digital OR fintech" },
  { sector: "energia", q: "Angola petróleo OR Sonangol OR energia" },
  { sector: "saude", q: "Angola saúde OR hospital OR vacina" },
];

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/** NewsData.io — bom para país/idioma. */
export async function fetchNewsData(): Promise<ApiArticle[]> {
  const key = process.env.NEWSDATA_API_KEY?.trim();
  if (!key) return [];

  const out: ApiArticle[] = [];
  for (const { sector, q } of SECTOR_QUERIES) {
    try {
      const url = new URL("https://newsdata.io/api/1/latest");
      url.searchParams.set("apikey", key);
      url.searchParams.set("q", q);
      url.searchParams.set("language", "pt");
      url.searchParams.set("size", "8");

      const res = await fetch(url.toString(), { next: { revalidate: 0 } });
      if (!res.ok) {
        console.warn("[newsdata]", sector, res.status);
        continue;
      }
      const data = await safeJson(res);
      for (const item of data?.results || []) {
        if (!item?.title || !item?.link) continue;
        out.push({
          title: String(item.title),
          url: String(item.link),
          summary: String(item.description || "").slice(0, 4000),
          content: String(item.content || item.description || "").slice(0, 12000),
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          sourceName: String(item.source_id || item.source_name || "NewsData"),
          sectorHint: sector,
          imageUrl: item.image_url || undefined,
        });
      }
    } catch (err) {
      console.warn("[newsdata]", err instanceof Error ? err.message : err);
    }
  }
  return out;
}

/** GNews.io */
export async function fetchGNews(): Promise<ApiArticle[]> {
  const key = process.env.GNEWS_API_KEY?.trim();
  if (!key) return [];

  const out: ApiArticle[] = [];
  for (const { sector, q } of SECTOR_QUERIES) {
    try {
      const url = new URL("https://gnews.io/api/v4/search");
      url.searchParams.set("token", key);
      url.searchParams.set("q", q);
      url.searchParams.set("lang", "pt");
      url.searchParams.set("max", "8");

      const res = await fetch(url.toString(), { next: { revalidate: 0 } });
      if (!res.ok) {
        console.warn("[gnews]", sector, res.status);
        continue;
      }
      const data = await safeJson(res);
      for (const item of data?.articles || []) {
        if (!item?.title || !item?.url) continue;
        out.push({
          title: String(item.title),
          url: String(item.url),
          summary: String(item.description || "").slice(0, 4000),
          content: String(item.content || item.description || "").slice(0, 12000),
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
          sourceName: String(item.source?.name || "GNews"),
          sectorHint: sector,
          imageUrl: item.image || undefined,
        });
      }
    } catch (err) {
      console.warn("[gnews]", err instanceof Error ? err.message : err);
    }
  }
  return out;
}

/** NewsAPI.org — útil em desenvolvimento (restrições de produção no plano free). */
export async function fetchNewsApi(): Promise<ApiArticle[]> {
  const key = process.env.NEWS_API_KEY?.trim();
  if (!key) return [];

  const out: ApiArticle[] = [];
  for (const { sector, q } of SECTOR_QUERIES) {
    try {
      const url = new URL("https://newsapi.org/v2/everything");
      url.searchParams.set("q", q);
      url.searchParams.set("language", "pt");
      url.searchParams.set("sortBy", "publishedAt");
      url.searchParams.set("pageSize", "8");
      url.searchParams.set("apiKey", key);

      const res = await fetch(url.toString(), { next: { revalidate: 0 } });
      if (!res.ok) {
        console.warn("[newsapi]", sector, res.status);
        continue;
      }
      const data = await safeJson(res);
      for (const item of data?.articles || []) {
        if (!item?.title || !item?.url) continue;
        out.push({
          title: String(item.title),
          url: String(item.url),
          summary: String(item.description || "").slice(0, 4000),
          content: String(item.content || item.description || "").slice(0, 12000),
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
          sourceName: String(item.source?.name || "NewsAPI"),
          sectorHint: sector,
          imageUrl: item.urlToImage || undefined,
        });
      }
    } catch (err) {
      console.warn("[newsapi]", err instanceof Error ? err.message : err);
    }
  }
  return out;
}

export async function fetchAllApiArticles(): Promise<ApiArticle[]> {
  const [a, b, c] = await Promise.all([
    fetchNewsData(),
    fetchGNews(),
    fetchNewsApi(),
  ]);
  const seen = new Set<string>();
  const merged: ApiArticle[] = [];
  for (const item of [...a, ...b, ...c]) {
    const key = item.url.split("?")[0];
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }
  return merged;
}

export function getActiveNewsProviders() {
  return {
    newsdata: Boolean(process.env.NEWSDATA_API_KEY?.trim()),
    gnews: Boolean(process.env.GNEWS_API_KEY?.trim()),
    newsapi: Boolean(process.env.NEWS_API_KEY?.trim()),
  };
}
