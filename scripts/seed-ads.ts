import "dotenv/config";
import { ensureExampleAds, listActiveAds } from "../src/lib/modules/ads/repository";

async function main() {
  console.log("db url?", Boolean(process.env.DATABASE_URL));
  await ensureExampleAds();
  const ads = await listActiveAds({});
  console.log("ads", ads.length);
  for (const a of ads) {
    console.log("-", a.placement, a.sectorId || "*", a.partnerName);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
