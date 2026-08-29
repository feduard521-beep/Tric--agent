"use client";

/**
 * Preferências: localStorage + sincronização opcional com /api/me/preferences
 * quando o utilizador está autenticado.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import {
  DEFAULT_PREFS,
  loadPreferences,
  savePreferences,
} from "@/lib/preferences";
import type { UserPreferences } from "@/lib/types";
import { clampSectorsForPlan } from "@/lib/modules/billing/plans";

type PrefsContextValue = {
  prefs: UserPreferences;
  ready: boolean;
  setPrefs: (
    next: UserPreferences | ((p: UserPreferences) => UserPreferences),
  ) => void;
};

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [prefs, setPrefsState] = useState<UserPreferences>(DEFAULT_PREFS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPrefsState(loadPreferences());
    setReady(true);
    const onStorage = () => setPrefsState(loadPreferences());
    window.addEventListener("trico-prefs", onStorage);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("trico-prefs", onStorage);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Sincroniza a partir da BD se houver sessão
  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/me/preferences");
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const next: UserPreferences = {
          sectors: data.sectors || [],
          notifications: data.notifications || "app",
          plan: data.plan || "gratuito",
          onboarded: Boolean(data.onboarded),
        };
        savePreferences(next);
        setPrefsState(next);
      } catch {
        /* mantém local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  const setPrefs = useCallback(
    (next: UserPreferences | ((p: UserPreferences) => UserPreferences)) => {
      setPrefsState((prev) => {
        const raw = typeof next === "function" ? next(prev) : next;
        const value: UserPreferences = {
          ...raw,
          sectors: clampSectorsForPlan(raw.sectors, raw.plan),
        };
        savePreferences(value);
        // Fire-and-forget sync se autenticado
        if (status === "authenticated") {
          void fetch("/api/me/preferences", {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              sectors: value.sectors,
              notifications: value.notifications,
              onboarded: value.onboarded,
            }),
          });
        }
        return value;
      });
    },
    [status],
  );

  return (
    <PrefsContext.Provider value={{ prefs, ready, setPrefs }}>
      {children}
    </PrefsContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PrefsContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return ctx;
}
