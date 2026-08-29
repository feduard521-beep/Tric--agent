import "dotenv/config";
import { createPartnerLead, listPartnerLeads } from "../src/lib/modules/ads/leads";

async function main() {
  const lead = await createPartnerLead({
    company: "Banco Exemplo SA",
    contactName: "Ana Silva",
    email: "ana@exemplo.ao",
    phone: "923000111",
    packageId: "sector-destaque",
    sectorId: "economia",
    message: "Campanha Q3 — teste",
  });
  console.log("created", lead.id);
  const all = await listPartnerLeads(5);
  console.log(
    "list",
    all.map((l) => `${l.company}/${l.status}`),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
