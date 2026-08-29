/**
 * Pipeline IA: classifica artigos RSS e tece "peças" (resumos).
 * Agrupa por tema simples (normalização do título) e janela temporal.
 *
 * Teste: após ingestão, `await prisma.piece.count()` deve ser > 0.
 */
import { prisma } from "@/lib/db";
import {
  classifyArticle,
  getAiProviderName,
  summarizeArticle,
} from "./provider";
import type { TimeWindow } from "@/lib/types";

function db() {
  if (!prisma) throw new Error("BD indisponível para o pipeline de IA.");
  return prisma;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function inferTimeWindow(publishedAt: Date): TimeWindow {
  const ageMs = Date.now() - publishedAt.getTime();
  const hours = ageMs / 3_600_000;
  if (hours <= 2) return "hora";
  if (hours <= 30) return "dia";
  if (hours <= 24 * 8) return "semana";
  return "ano";
}

function inferImpact(title: string, body: string): "alto" | "medio" | "baixo" {
  const hay = `${title} ${body}`.toLowerCase();
  if (/(urgente|breaking|alerta|crise|explod|mort)/.test(hay)) return "alto";
  if (/(governo|bna|orçamento|petróleo|petroleo|epidemia)/.test(hay)) return "alto";
  if (/(festival|cultura|desporto)/.test(hay)) return "baixo";
  return "medio";
}

export async function processUnprocessedArticles(limit = 40) {
  const client = db();
  const articles = await client.article.findMany({
    where: { processed: false },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { feed: true },
  });

  let createdPieces = 0;
  const provider = getAiProviderName();

  for (const article of articles) {
    const sectorId = await classifyArticle(
      article.title,
      `${article.summary}\n${article.content}`,
      article.sectorId || article.feed.sectorHint,
    );

    await client.article.update({
      where: { id: article.id },
      data: { sectorId, processed: true },
    });

    const { summary, fullSummary } = await summarizeArticle(
      article.title,
      `${article.summary}\n${article.content}`,
      sectorId,
    );

    const themeId =
      slugify(article.title.split(/[:\-–|]/)[0] || article.title) || "tema";
    const timeWindow = inferTimeWindow(article.publishedAt);
    const impact = inferImpact(article.title, article.summary);
    const isBreaking = timeWindow === "hora" && impact !== "baixo";

    const since = new Date(Date.now() - 24 * 3_600_000);
    const existing = await client.piece.findFirst({
      where: {
        themeId,
        sectorId,
        timeWindow,
        publishedAt: { gte: since },
      },
      include: { sources: true },
    });

    if (existing) {
      const already = existing.sources.some((s) => s.articleId === article.id);
      if (!already) {
        await client.pieceSource.create({
          data: { pieceId: existing.id, articleId: article.id },
        });
        await client.piece.update({
          where: { id: existing.id },
          data: {
            sourceCount: existing.sourceCount + 1,
            fullSummary: `${existing.fullSummary}\n\n${fullSummary}`.slice(0, 2400),
            updatedAt: new Date(),
          },
        });
      }
    } else {
      await client.piece.create({
        data: {
          sectorId,
          title: article.title.slice(0, 240),
          summary,
          fullSummary,
          timeWindow,
          themeId,
          impact,
          isBreaking,
          sourceCount: 1,
          publishedAt: article.publishedAt,
          aiProvider: provider,
          sources: {
            create: { articleId: article.id },
          },
        },
      });
      createdPieces += 1;
    }
  }

  return { createdPieces, processed: articles.length, provider };
}

/** Semeia peças editoriais mock se a BD estiver vazia (dev sem rede). */
export async function seedMockPiecesIfEmpty() {
  if (!prisma) return { seeded: false, count: 0 };
  const client = prisma;
  const count = await client.piece.count();
  if (count > 0) return { seeded: false, count };

  const { PIECES } = await import("@/lib/data");
  for (const p of PIECES) {
    const feed = await client.feedSource.upsert({
      where: { url: "local://mock-seed" },
      create: {
        name: "Seed editorial Tricô",
        url: "local://mock-seed",
        sectorHint: p.sectorId,
        active: false,
      },
      update: {},
    });

    const article = await client.article.create({
      data: {
        feedId: feed.id,
        guid: `seed-${p.id}`,
        title: p.title,
        summary: p.summary,
        content: p.fullSummary,
        url: p.sources[0]?.url || "https://trico.ao",
        publishedAt: new Date(p.publishedAt),
        sectorId: p.sectorId,
        processed: true,
      },
    });

    await client.piece.create({
      data: {
        id: p.id,
        sectorId: p.sectorId,
        title: p.title,
        summary: p.summary,
        fullSummary: p.fullSummary,
        timeWindow: p.timeWindow,
        themeId: p.themeId,
        impact: p.impact,
        isBreaking: Boolean(p.isBreaking),
        sourceCount: p.sourceCount,
        publishedAt: new Date(p.publishedAt),
        aiProvider: "seed",
        sources: { create: { articleId: article.id } },
      },
    });
  }

  return { seeded: true, count: PIECES.length };
}
