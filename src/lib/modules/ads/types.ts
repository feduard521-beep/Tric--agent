/** Tipos públicos de publicidade (sem imports de servidor). */
export type AdPlacement =
  | "feed-top"
  | "feed-mid"
  | "feed-sidebar"
  | "landing-mid"
  | "piece-bottom"
  | "sector-top";

export type AdPublic = {
  id: string;
  partnerName: string;
  headline: string;
  body: string;
  ctaLabel: string;
  targetUrl: string;
  placement: AdPlacement;
  sectorId: string | null;
  accent: string;
};
