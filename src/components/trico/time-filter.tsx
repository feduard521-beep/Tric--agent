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
}: {
  value: TimeWindow;
  onChange?: (v: TimeWindow) => void;
  basePath?: string;
}) {
  const { prefs } = usePreferences();
  const isPremium = prefs.plan === "premium";

  return (
    <div
      className="inline-flex flex-wrap gap-1 rounded-xl bg-navy/[0.04] p-1"
      role="tablist"
      aria-label="Janela temporal"
    >
      {TIME_WINDOWS.map((tw) => {
        const locked = Boolean(tw.premium) && !isPremium;
        const active = value === tw.id;
        const className = cn(
          "rounded-lg px-3.5 py-2 text-sm font-medium transition-all",
          active
            ? "bg-navy text-cream shadow-sm"
            : "text-navy/65 hover:bg-white/70 hover:text-navy",
          locked && !active && "opacity-60",
        );

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
              {locked ? <span className="ml-1 text-[10px] uppercase">Pro</span> : null}
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
            {locked ? <span className="ml-1 text-[10px] uppercase">Pro</span> : null}
          </button>
        );
      })}
    </div>
  );
}
