/**
 * Índice dos módulos de backend da Tricô.
 * Cada subpasta tem comentários PT-PT e instruções de teste no cabeçalho.
 */
export { runIngest, ensureFeedSources } from "@/lib/modules/rss/ingest";
export { RSS_FEEDS } from "@/lib/modules/rss/feeds";
export { processUnprocessedArticles, seedMockPiecesIfEmpty } from "@/lib/modules/ai/pipeline";
export {
  classifyArticle,
  summarizeArticle,
  getAiProviderName,
} from "@/lib/modules/ai/provider";
export {
  listPieces,
  getPieceById,
  getDailyDigestPieces,
  getContentStats,
} from "@/lib/modules/pieces/repository";
export { auth, getAuthFlags } from "@/lib/modules/auth/config";
export { MOBILE_API_CONTRACT } from "@/lib/modules/mobile/contract";
