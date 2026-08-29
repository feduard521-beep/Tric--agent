"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  Building2,
  Globe2,
  HeartPulse,
  Landmark,
  Network,
  Scale,
  SunMedium,
  Zap,
} from "lucide-react";
import { SECTORS } from "@/lib/sectors";
import type { SectorId } from "@/lib/types";
import { LogoMark } from "./logo";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const PAIR: Record<SectorId, { left: ReactNode; right: ReactNode }> = {
  economia: {
    left: <Activity className="h-7 w-7 text-navy" strokeWidth={1.6} />,
    right: <Globe2 className="h-7 w-7 text-terracotta" strokeWidth={1.6} />,
  },
  politica: {
    left: <Landmark className="h-7 w-7 text-navy" strokeWidth={1.6} />,
    right: <Scale className="h-7 w-7 text-terracotta" strokeWidth={1.6} />,
  },
  tecnologia: {
    left: <LogoMark className="h-8 w-9" />,
    right: <Network className="h-7 w-7 text-navy" strokeWidth={1.6} />,
  },
  energia: {
    left: <SunMedium className="h-7 w-7 text-terracotta" strokeWidth={1.6} />,
    right: <Zap className="h-7 w-7 text-navy" strokeWidth={1.6} />,
  },
  saude: {
    left: <Building2 className="h-7 w-7 text-navy" strokeWidth={1.6} />,
    right: <HeartPulse className="h-7 w-7 text-terracotta" strokeWidth={1.6} />,
  },
};

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
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {SECTORS.map((sector) => {
        const on = selected.includes(sector.id);
        const icons = PAIR[sector.id];
        const body = (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {icons.left}
                {icons.right}
              </div>
              {mode === "toggle" ? (
                <Switch
                  checked={on}
                  onCheckedChange={() => onToggle?.(sector.id)}
                  className="data-checked:bg-terracotta"
                  aria-label={sector.short}
                />
              ) : null}
            </div>
            <div className="mt-auto pt-4">
              <p className="text-base font-bold text-navy sm:text-lg">
                {sector.short}
              </p>
              {mode === "toggle" ? (
                <p
                  className={cn(
                    "mt-1 text-[10px] font-bold uppercase tracking-[0.14em]",
                    on ? "text-terracotta" : "text-navy/35",
                  )}
                >
                  {on ? "On · Ligado" : "Desligado"}
                </p>
              ) : (
                <p className="mt-1 line-clamp-2 text-xs text-navy/55">
                  {sector.description}
                </p>
              )}
            </div>
          </>
        );

        if (mode === "link") {
          return (
            <Link
              key={sector.id}
              href={`/sector/${sector.id}`}
              className="flex min-h-[148px] flex-col rounded-2xl bg-tan p-4 transition hover:bg-sand"
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
              "flex min-h-[148px] flex-col rounded-2xl p-4 text-left transition",
              on
                ? "bg-tan ring-2 ring-terracotta/35"
                : "bg-tan/80 hover:bg-tan",
            )}
          >
            {body}
          </button>
        );
      })}
    </div>
  );
}
