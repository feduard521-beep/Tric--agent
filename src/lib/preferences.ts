import type { NotificationPref, SectorId, UserPreferences } from "./types";

const KEY = "trico-preferences-v1";

export const DEFAULT_PREFS: UserPreferences = {
  sectors: [],
  notifications: "app",
  plan: "gratuito",
  onboarded: false,
};

export function loadPreferences(): UserPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) } as UserPreferences;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePreferences(prefs: UserPreferences) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(prefs));
  window.dispatchEvent(new Event("trico-prefs"));
}

export function updatePreferences(partial: Partial<UserPreferences>) {
  const next = { ...loadPreferences(), ...partial };
  savePreferences(next);
  return next;
}

export function toggleSector(id: SectorId, sectors: SectorId[]): SectorId[] {
  return sectors.includes(id)
    ? sectors.filter((s) => s !== id)
    : [...sectors, id];
}

export const NOTIFICATION_OPTIONS: {
  id: NotificationPref;
  label: string;
  description: string;
}[] = [
  {
    id: "app",
    label: "Na app",
    description: "Alertas quando abrires a Tricô.",
  },
  {
    id: "email",
    label: "Email diário",
    description: "A peça do dia no teu correio, de manhã.",
  },
  {
    id: "alertas",
    label: "Alto impacto",
    description: "Só breaking news e temas de impacto alto.",
  },
];
