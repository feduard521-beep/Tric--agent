/**
 * Repositório de peças — camada de leitura para a UI e APIs móveis.
 * Preferência: BD; fallback: dados mock em memória (obrigatório na Vercel).
 *
 * Teste: GET /api/pieces?tempo=dia
 */
import { prisma } from "@/lib/db";
import {
  PIECES,
  getDailyDigest as mockDigest,
  getPiece as mockGetPiece,
  getPiecesByTheme as mockTheme,
  filterPieces as mockFilter,
} from "@/lib/data";
import type { Piece, SectorId, TimeWindow } from "@/lib/types";
import { seedMockPiecesIfEmpty } from "@/lib/modules/ai/pipeline";

function mapDbPiece(
  p: {
    id: string;
    sectorId: string;
    title: string;
    summary: string;
    fullSummary: string;
    timeWindow: string;
    themeId: string;
    impact: string;
    isBreaking: boolean;
    sourceCount: number;
    publishedAt: Date;
    sources: { article: { title: string; url: string; feed: { name: string } } }[];
  },
): Piece {
  return {
    id: p.id,
    sectorId: p.sectorId as SectorId,
    title: p.title,
    summary: p.summary,
    fullSummary: p.fullSummary,
    timeWindow: p.timeWindow as TimeWindow,
    themeId: p.themeId,
    impact: p.impact as Piece["impact"],
    isBreaking: p.isBreaking,
    sourceCount: p.sourceCount,
    publishedAt: p.publishedAt.toISOString(),
    sources: p.sources.map((s) => ({
      name: s.article.feed.name || s.article.title,
      url: s.article.url,
    })),
  };
}

const pieceInclude = {
  sources: {
    include: {
      article: { include: { feed: true } },
    },
  },
} as const;

export async function ensureContentReady() {
  if (!prisma) return;
  try {
    await seedMockPiecesIfEmpty();
  } catch (err) {
    console.warn("[pieces] seed falhou:", err instanceof Error ? err.message : err);
  }
}

export async function listPieces(opts: {
  sectorId?: string;
  timeWindow?: string;
  query?: string;
  sectorIds?: string[];
  limit?: number;
}): Promise<Piece[]> {
  try {
    if (!prisma) {
      return mockFilter({
        sectorId: opts.sectorId,
        timeWindow: opts.timeWindow,
        query: opts.query,
        sectorIds: opts.sectorIds,
      }).slice(0, opts.limit ?? 40);
    }
    await ensureContentReady();
    const where: Record<string, unknown> = {};
    if (opts.sectorId) where.sectorId = opts.sectorId;
    if (opts.sectorIds?.length) where.sectorId = { in: opts.sectorIds };
    if (opts.timeWindow) where.timeWindow = opts.timeWindow;
    if (opts.query?.trim()) {
      const q = opts.query.trim();
      where.OR = [
        { title: { contains: q } },
        { summary: { contains: q } },
        { fullSummary: { contains: q } },
      ];
    }

    const rows = await prisma.piece.findMany({
      where,
      include: pieceInclude,
      orderBy: { publishedAt: "desc" },
      take: opts.limit ?? 40,
    });
    if (rows.length) return rows.map(mapDbPiece);
  } catch (err) {
    console.warn(
      "[pieces] BD indisponível, a usar mock:",
      err instanceof Error ? err.message : err,
    );
  }

  return mockFilter({
    sectorId: opts.sectorId,
    timeWindow: opts.timeWindow,
    query: opts.query,
    sectorIds: opts.sectorIds,
  }).slice(0, opts.limit ?? 40);
}

export async function getPieceById(id: string): Promise<Piece | null> {
  try {
    if (!prisma) return mockGetPiece(id) ?? null;
    await ensureContentReady();
    const row = await prisma.piece.findUnique({
      where: { id },
      include: pieceInclude,
    });
    if (row) return mapDbPiece(row);
  } catch {
    /* fallback */
  }
  return mockGetPiece(id) ?? null;
}

export async function getThemeTimeline(themeId: string): Promise<Piece[]> {
  try {
    if (!prisma) return mockTheme(themeId);
    const rows = await prisma.piece.findMany({
      where: { themeId },
      include: pieceInclude,
      orderBy: { publishedAt: "desc" },
    });
    if (rows.length) return rows.map(mapDbPiece);
  } catch {
    /* fallback */
  }
  return mockTheme(themeId);
}

export async function getDailyDigestPieces(): Promise<Piece[]> {
  try {
    if (!prisma) return mockDigest();
    await ensureContentReady();
    const rows = await prisma.piece.findMany({
      where: { timeWindow: "dia" },
      include: pieceInclude,
      orderBy: { publishedAt: "desc" },
      take: 5,
    });
    if (rows.length) return rows.map(mapDbPiece);
  } catch {
    /* fallback */
  }
  return mockDigest();
}

export async function getContentStats() {
  try {
    if (!prisma) {
      return {
        pieces: PIECES.length,
        articles: 0,
        feeds: 0,
        lastIngest: null,
        source: "mock" as const,
        mockFallbackAvailable: PIECES.length,
      };
    }
    const [pieces, articles, feeds, runs] = await Promise.all([
      prisma.piece.count(),
      prisma.article.count(),
      prisma.feedSource.count({ where: { active: true } }),
      prisma.ingestRun.findFirst({ orderBy: { startedAt: "desc" } }),
    ]);
    return {
      pieces,
      articles,
      feeds,
      lastIngest: runs,
      source: "database" as const,
      mockFallbackAvailable: PIECES.length,
    };
  } catch {
    return {
      pieces: PIECES.length,
      articles: 0,
      feeds: 0,
      lastIngest: null,
      source: "mock" as const,
      mockFallbackAvailable: PIECES.length,
    };
  }
}
