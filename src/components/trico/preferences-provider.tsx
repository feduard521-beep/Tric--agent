"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_PREFS,
  loadPreferences,
  savePreferences,
} from "@/lib/preferences";
import type { UserPreferences } from "@/lib/types";

type PrefsContextValue = {
  prefs: UserPreferences;
  ready: boolean;
  setPrefs: (next: UserPreferences | ((p: UserPreferences) => UserPreferences)) => void;
};

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
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

  const setPrefs = useCallback(
    (next: UserPreferences | ((p: UserPreferences) => UserPreferences)) => {
      setPrefsState((prev) => {
        const value = typeof next === "function" ? next(prev) : next;
        savePreferences(value);
        return value;
      });
    },
    [],
  );

  return (
    <PrefsContext.Provider value={{ prefs, ready, setPrefs }}>
      {children}
    </PrefsContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}
