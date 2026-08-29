/**
 * Pedidos de parceiros (leads comerciais).
 */
import { prisma } from "@/lib/db";
import { getAdPackage } from "@/lib/modules/ads/packages";

export type PartnerLeadInput = {
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  packageId: string;
  sectorId?: string | null;
  message?: string;
};

const memoryLeads: (PartnerLeadInput & { id: string; status: string; createdAt: string })[] =
  [];

export async function createPartnerLead(input: PartnerLeadInput) {
  const pkg = getAdPackage(input.packageId);
  if (!pkg) throw new Error("Pacote inválido.");

  if (!prisma) {
    const row = {
      id: `lead-${Date.now()}`,
      ...input,
      phone: input.phone || "",
      sectorId: input.sectorId || null,
      message: input.message || "",
      status: "new",
      createdAt: new Date().toISOString(),
    };
    memoryLeads.unshift(row);
    return row;
  }

  return prisma.partnerLead.create({
    data: {
      company: input.company,
      contactName: input.contactName,
      email: input.email,
      phone: input.phone || "",
      packageId: input.packageId,
      sectorId: input.sectorId || null,
      message: input.message || "",
    },
  });
}

export async function listPartnerLeads(limit = 50) {
  if (!prisma) return memoryLeads.slice(0, limit);
  return prisma.partnerLead.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function updatePartnerLeadStatus(
  id: string,
  status: "new" | "contacted" | "closed",
) {
  if (!prisma) {
    const row = memoryLeads.find((l) => l.id === id);
    if (row) row.status = status;
    return row;
  }
  return prisma.partnerLead.update({
    where: { id },
    data: { status },
  });
}
