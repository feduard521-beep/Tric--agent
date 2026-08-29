/**
 * Script CLI de ingestão RSS + IA.
 * Uso: `npm run ingest`
 */
import "dotenv/config";
import { runIngest } from "../lib/modules/rss/ingest";
import { seedMockPiecesIfEmpty } from "../lib/modules/ai/pipeline";

async function main() {
  console.log("[trico] a semear mock se necessário…");
  console.log(await seedMockPiecesIfEmpty());
  console.log("[trico] a correr ingestão RSS…");
  const result = await runIngest();
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.status === "ok" ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
