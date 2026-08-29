"use client";

import Link from "next/link";
import { SECTORS } from "@/lib/sectors";
import type { SectorId } from "@/lib/types";
import { SectorIcon } from "./sector-icon";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function SectorPicker({
  selected,
  onToggle,
  mode = "toggle",
}: {
  selected: SectorId[];
  onToggle?: (id: SectorId) => void;
  mode?: "toggle" | "link";
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {SECTORS.map((sector) => {
        const on = selected.includes(sector.id);
        const body = (
          <>
            <div className="flex items-start justify-between gap-3">
              <span
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-lg",
                  on ? "bg-terracotta/15 text-terracotta" : "bg-navy/5 text-navy",
                )}
              >
                <SectorIcon id={sector.id} />
              </span>
              {mode === "toggle" ? (
                <Switch
                  checked={on}
                  onCheckedChange={() => onToggle?.(sector.id)}
                  className="data-checked:bg-terracotta"
                  aria-label={sector.short}
                />
              ) : null}
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-navy">
                {sector.short}
              </p>
              <p className="mt-1 text-sm leading-snug text-navy/60">
                {sector.description}
              </p>
            </div>
            {mode === "toggle" ? (
              <p
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  on ? "text-terracotta" : "text-navy/35",
                )}
              >
                {on ? "Ligado" : "Desligado"}
              </p>
            ) : null}
          </>
        );

        if (mode === "link") {
          return (
            <Link
              key={sector.id}
              href={`/sector/${sector.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-navy/10 bg-white/55 p-4 transition hover:border-terracotta/40 hover:bg-white"
            >
              {body}
            </Link>
          );
        }

        return (
          <button
            key={sector.id}
            type="button"
            onClick={() => onToggle?.(sector.id)}
            className={cn(
              "flex flex-col gap-3 rounded-2xl border p-4 text-left transition",
              on
                ? "border-terracotta/45 bg-white shadow-[0_10px_30px_-18px_rgba(196,92,38,0.55)]"
                : "border-navy/10 bg-white/50 hover:border-navy/20",
            )}
          >
            {body}
          </button>
        );
      })}
    </div>
  );
}
