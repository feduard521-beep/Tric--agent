-- Publicidade de parceiros
CREATE TABLE IF NOT EXISTS "AdCampaign" (
    "id" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "ctaLabel" TEXT NOT NULL DEFAULT 'Saber mais',
    "targetUrl" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "sectorId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "accent" TEXT NOT NULL DEFAULT 'navy',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AdCampaign_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AdCampaign_active_placement_sectorId_idx"
  ON "AdCampaign"("active", "placement", "sectorId");

CREATE INDEX IF NOT EXISTS "AdCampaign_startsAt_endsAt_idx"
  ON "AdCampaign"("startsAt", "endsAt");
