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
    left: <Activity className="h-5 w-5 text-navy" strokeWidth={1.6} />,
    right: <Globe2 className="h-5 w-5 text-terracotta" strokeWidth={1.6} />,
  },
  politica: {
    left: <Landmark className="h-5 w-5 text-navy" strokeWidth={1.6} />,
    right: <Scale className="h-5 w-5 text-terracotta" strokeWidth={1.6} />,
  },
  tecnologia: {
    left: <LogoMark className="h-6 w-7" />,
    right: <Network className="h-5 w-5 text-navy" strokeWidth={1.6} />,
  },
  energia: {
    left: <SunMedium className="h-5 w-5 text-terracotta" strokeWidth={1.6} />,
    right: <Zap className="h-5 w-5 text-navy" strokeWidth={1.6} />,
  },
  saude: {
    left: <Building2 className="h-5 w-5 text-navy" strokeWidth={1.6} />,
    right: <HeartPulse className="h-5 w-5 text-terracotta" strokeWidth={1.6} />,
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
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                  className="data-checked:bg-navy"
                  aria-label={sector.short}
                />
              ) : null}
            </div>
            <div className="mt-3">
              <p className="font-bold text-navy">{sector.short}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {mode === "toggle"
                  ? on
                    ? "Ligado"
                    : "Desligado"
                  : sector.description}
              </p>
            </div>
          </>
        );

        if (mode === "link") {
          return (
            <Link
              key={sector.id}
              href={`/sector/${sector.id}`}
              className="border border-line bg-white p-4 transition hover:border-navy/40"
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
              "border p-4 text-left transition",
              on ? "border-navy bg-secondary" : "border-line bg-white hover:border-navy/30",
            )}
          >
            {body}
          </button>
        );
      })}
    </div>
  );
}
