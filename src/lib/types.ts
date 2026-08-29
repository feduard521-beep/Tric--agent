export type SectorId =
  | "economia"
  | "politica"
  | "tecnologia"
  | "energia"
  | "saude";

export type TimeWindow = "hora" | "dia" | "semana" | "ano";

export type NotificationPref = "app" | "email" | "alertas";

export type Plan = "gratuito" | "premium";

export interface Sector {
  id: SectorId;
  name: string;
  short: string;
  description: string;
  icon: string;
}

export interface Source {
  name: string;
  url: string;
}

export interface Piece {
  id: string;
  sectorId: SectorId;
  title: string;
  summary: string;
  fullSummary: string;
  timeWindow: TimeWindow;
  sourceCount: number;
  sources: Source[];
  publishedAt: string;
  themeId: string;
  impact: "alto" | "medio" | "baixo";
  isBreaking?: boolean;
}

export interface UserPreferences {
  sectors: SectorId[];
  notifications: NotificationPref;
  plan: Plan;
  onboarded: boolean;
}
