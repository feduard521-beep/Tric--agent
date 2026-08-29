/**
 * Ingestão unificada: RSS + APIs de notícias → Article → pipeline IA.
 *
 * Teste:
 *   curl -X POST http://127.0.0.1:43123/api/ingest -H "x-ingest-secret: ..."
 */
import Parser from "rss-parser";
import { prisma } from "@/lib/db";
import { RSS_FEEDS } from "./feeds";
import { fetchAllApiArticles } from "@/lib/modules/news/providers";
import { processUnprocessedArticles } from "@/lib/modules/ai/pipeline";

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "TricoBot/1.0 (+https://trico.ao; news-aggregator)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

export type IngestResult = {
  fetchedCount: number;
  apiCount: number;
  createdPieces: number;
  message: string;
  status: "ok" | "error";
};

function db() {
  if (!prisma) throw new Error("BD indisponível — ingestão requer Postgres.");
  return prisma;
}

export async function ensureFeedSources() {
  const client = db();
  for (const feed of RSS_FEEDS) {
    await client.feedSource.upsert({
      where: { url: feed.url },
      create: {
        name: feed.name,
        url: feed.url,
        sectorHint: feed.sectorHint ?? null,
      },
      update: {
        name: feed.name,
        sectorHint: feed.sectorHint ?? null,
        active: true,
      },
    });
  }

  // Fonte virtual para artigos vindos de APIs
  await client.feedSource.upsert({
    where: { url: "trico://api-news" },
    create: {
      name: "APIs de notícias (NewsData/GNews/NewsAPI)",
      url: "trico://api-news",
      sectorHint: null,
      active: true,
    },
    update: { name: "APIs de notícias (NewsData/GNews/NewsAPI)", active: true },
  });
}

function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchFeedItems(url: string) {
  try {
    const feed = await parser.parseURL(url);
    return feed.items ?? [];
  } catch (err) {
    console.warn(`[rss] falha ao ler ${url}:`, err instanceof Error ? err.message : err);
    return [];
  }
}

export async function runIngest(): Promise<IngestResult> {
  const client = db();
  const run = await client.ingestRun.create({ data: { status: "running" } });
  let fetchedCount = 0;
  let apiCount = 0;

  try {
    await ensureFeedSources();
    const sources = await client.feedSource.findMany({
      where: { active: true, NOT: { url: "trico://api-news" } },
    });

    for (const source of sources) {
      const items = await fetchFeedItems(source.url);
      for (const item of items.slice(0, 18)) {
        const guid = item.guid || item.id || item.link || `${item.title}-${item.pubDate}`;
        const link = item.link || item.guid || "";
        if (!guid || !item.title || !link) continue;

        const publishedAt = item.isoDate
          ? new Date(item.isoDate)
          : item.pubDate
            ? new Date(item.pubDate)
            : new Date();

        const summary = stripHtml(item.contentSnippet || item.summary || item.content || "");
        const content = stripHtml(item.content || item["content:encoded"] || summary);

        await client.article.upsert({
          where: {
            feedId_guid: { feedId: source.id, guid: String(guid).slice(0, 500) },
          },
          create: {
            feedId: source.id,
            guid: String(guid).slice(0, 500),
            title: item.title.slice(0, 500),
            summary: summary.slice(0, 4000),
            content: content.slice(0, 12000),
            url: link.slice(0, 2000),
            publishedAt,
            sectorId: source.sectorHint,
            processed: false,
          },
          update: {
            title: item.title.slice(0, 500),
            summary: summary.slice(0, 4000),
            content: content.slice(0, 12000),
            url: link.slice(0, 2000),
            publishedAt,
          },
        });
        fetchedCount += 1;
      }

      await client.feedSource.update({
        where: { id: source.id },
        data: { lastFetch: new Date() },
      });
    }

    // --- APIs externas ---
    const apiFeed = await client.feedSource.findUnique({
      where: { url: "trico://api-news" },
    });
    if (apiFeed) {
      const apiArticles = await fetchAllApiArticles();
      for (const item of apiArticles) {
        const guid = item.url.slice(0, 500);
        await client.article.upsert({
          where: { feedId_guid: { feedId: apiFeed.id, guid } },
          create: {
            feedId: apiFeed.id,
            guid,
            title: item.title.slice(0, 500),
            summary: item.summary.slice(0, 4000),
            content: item.content.slice(0, 12000),
            url: item.url.slice(0, 2000),
            publishedAt: item.publishedAt,
            sectorId: item.sectorHint,
            processed: false,
          },
          update: {
            title: item.title.slice(0, 500),
            summary: item.summary.slice(0, 4000),
            content: item.content.slice(0, 12000),
            publishedAt: item.publishedAt,
            sectorId: item.sectorHint,
          },
        });
        apiCount += 1;
        fetchedCount += 1;
      }
      await client.feedSource.update({
        where: { id: apiFeed.id },
        data: { lastFetch: new Date() },
      });
    }

    const { createdPieces } = await processUnprocessedArticles(60);

    const message = `Ingestão OK: ${fetchedCount} artigos (${apiCount} via API), ${createdPieces} peças.`;
    await client.ingestRun.update({
      where: { id: run.id },
      data: {
        status: "ok",
        finishedAt: new Date(),
        fetchedCount,
        createdPieces,
        message,
      },
    });

    console.log(`[ingest] ${message}`);
    return { fetchedCount, apiCount, createdPieces, message, status: "ok" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido na ingestão";
    try {
      await client.ingestRun.update({
        where: { id: run.id },
        data: {
          status: "error",
          finishedAt: new Date(),
          fetchedCount,
          message,
        },
      });
    } catch {
      /* ignore */
    }
    console.error(`[ingest] ${message}`);
    return { fetchedCount, apiCount, createdPieces: 0, message, status: "error" };
  }
}
