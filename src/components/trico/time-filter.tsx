"use client";

import Link from "next/link";
import type { TimeWindow } from "@/lib/types";
import { TIME_WINDOWS } from "@/lib/sectors";
import { usePreferences } from "./preferences-provider";
import { cn } from "@/lib/utils";

export function TimeFilter({
  value,
  onChange,
  basePath,
  showLabel = true,
}: {
  value: TimeWindow;
  onChange?: (v: TimeWindow) => void;
  basePath?: string;
  showLabel?: boolean;
}) {
  const { prefs } = usePreferences();
  const isPremium = prefs.plan === "premium";

  return (
    <div className="space-y-2">
      {showLabel ? <p className="filter-label">Filtro temporal</p> : null}
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Janela temporal"
      >
        {TIME_WINDOWS.map((tw) => {
          const locked = Boolean(tw.premium) && !isPremium;
          const active = value === tw.id;
          const className = cn("pill", active && "pill-active", locked && !active && "opacity-55");

          if (basePath) {
            return (
              <Link
                key={tw.id}
                href={`${basePath}?tempo=${tw.id}`}
                className={className}
                aria-selected={active}
                role="tab"
                title={locked ? "Resumo do Ano — Premium" : tw.hint}
              >
                {tw.label}
                {locked ? <span className="ml-1 text-[10px] uppercase opacity-70">Pro</span> : null}
              </Link>
            );
          }

          return (
            <button
              key={tw.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={className}
              title={locked ? "Resumo do Ano — Premium" : tw.hint}
              onClick={() => onChange?.(tw.id)}
            >
              {tw.label}
              {locked ? <span className="ml-1 text-[10px] uppercase opacity-70">Pro</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
