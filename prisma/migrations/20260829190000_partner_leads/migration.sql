-- Pedidos de publicidade de parceiros
CREATE TABLE IF NOT EXISTS "PartnerLead" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "packageId" TEXT NOT NULL,
    "sectorId" TEXT,
    "message" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PartnerLead_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PartnerLead_status_createdAt_idx"
  ON "PartnerLead"("status", "createdAt");
