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
  showLabel = false,
}: {
  value: TimeWindow;
  onChange?: (v: TimeWindow) => void;
  basePath?: string;
  showLabel?: boolean;
}) {
  const { prefs } = usePreferences();
  const isPremium = prefs.plan === "premium";

  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2 border border-line bg-secondary/40 px-2 py-1.5">
      {showLabel ? (
        <span className="mr-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Período
        </span>
      ) : null}
      {TIME_WINDOWS.map((tw) => {
        const locked = Boolean(tw.premium) && !isPremium;
        const active = value === tw.id;
        const className = cn(
          "px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition",
          active ? "bg-navy text-white" : "text-navy/70 hover:bg-white hover:text-navy",
          locked && !active && "opacity-50",
        );
        if (basePath) {
          return (
            <Link
              key={tw.id}
              href={`${basePath}?tempo=${tw.id}`}
              className={className}
              title={locked ? "Premium" : tw.hint}
            >
              {tw.label}
              {locked ? " · Pro" : ""}
            </Link>
          );
        }
        return (
          <button
            key={tw.id}
            type="button"
            className={className}
            title={locked ? "Premium" : tw.hint}
            onClick={() => onChange?.(tw.id)}
          >
            {tw.label}
            {locked ? " · Pro" : ""}
          </button>
        );
      })}
    </div>
  );
}
