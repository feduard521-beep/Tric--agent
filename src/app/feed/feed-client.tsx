"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppHeader } from "@/components/trico/app-header";
import { BottomNav } from "@/components/trico/bottom-nav";
import { PieceGrid } from "@/components/trico/piece-card";
import { TimeFilter } from "@/components/trico/time-filter";
import { usePreferences } from "@/components/trico/preferences-provider";
import { SectorIcon } from "@/components/trico/sector-icon";
import { filterPieces, getDailyDigest } from "@/lib/data";
import { SECTORS } from "@/lib/sectors";
import type { TimeWindow } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function FeedPage() {
  const searchParams = useSearchParams();
  const { prefs, ready } = usePreferences();
  const tempo = (searchParams.get("tempo") as TimeWindow) || "dia";
  const sectorParam = searchParams.get("sector");

  const digest = useMemo(() => getDailyDigest(), []);
  const followed = prefs.sectors.length ? prefs.sectors : SECTORS.map((s) => s.id);

  const isPremium = prefs.plan === "premium";
  const yearLocked = tempo === "ano" && !isPremium;

  const pieces = useMemo(() => {
    if (yearLocked) return [];
    if (sectorParam) {
      return filterPieces({ sectorId: sectorParam, timeWindow: tempo });
    }
    return filterPieces({ sectorIds: followed, timeWindow: tempo });
  }, [followed, sectorParam, tempo, yearLocked]);

  return (
    <div className="flex min-h-full flex-col pb-24 md:pb-10">
      <AppHeader solid />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              Feed personalizado
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-navy sm:text-4xl">
              {ready && prefs.onboarded
                ? "O teu dia, tecido"
                : "Resumo Geral do Dia"}
            </h1>
            <p className="mt-2 max-w-xl text-navy/65">
              Peças agregadas por sector e período. Menos fios soltos, mais clareza.
            </p>
          </div>
          <TimeFilter value={tempo} basePath="/feed" />
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          <Link
            href={`/feed?tempo=${tempo}`}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
              !sectorParam
                ? "bg-navy text-cream"
                : "bg-white/60 text-navy/70 hover:bg-white",
            )}
          >
            Todos
          </Link>
          {SECTORS.map((s) => {
            const active = sectorParam === s.id;
            const followedSector = followed.includes(s.id);
            return (
              <Link
                key={s.id}
                href={`/feed?tempo=${tempo}&sector=${s.id}`}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                  active
                    ? "bg-navy text-cream"
                    : "bg-white/60 text-navy/70 hover:bg-white",
                  !followedSector && "opacity-55",
                )}
              >
                <SectorIcon id={s.id} className="h-4 w-4" />
                {s.short}
              </Link>
            );
          })}
        </div>

        {!sectorParam && tempo === "dia" ? (
          <section className="mt-10 rounded-3xl border border-navy/10 bg-white/55 p-5 sm:p-7">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-navy">
                Resumo Geral do Dia
              </h2>
              <span className="text-xs uppercase tracking-wider text-navy/40">
                5 sectores
              </span>
            </div>
            <PieceGrid pieces={digest} />
          </section>
        ) : null}

        <section className="mt-10">
          <h2 className="mb-4 font-display text-2xl font-semibold text-navy">
            {sectorParam
              ? SECTORS.find((s) => s.id === sectorParam)?.name
              : "Os teus sectores"}
          </h2>
          {yearLocked ? (
            <div className="rounded-3xl border border-navy/10 bg-navy px-6 py-10 text-cream">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/50">
                Premium
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold">
                Resumo do Ano
              </h3>
              <p className="mt-2 max-w-lg text-sm text-cream/70">
                A retrospectiva anual tece os padrões do teu sector num único
                quadro. Disponível no plano Premium.
              </p>
              <Link
                href="/perfil"
                className="mt-5 inline-flex h-10 items-center rounded-lg bg-terracotta px-4 text-sm font-medium text-white hover:bg-terracotta/90"
              >
                Ver planos no perfil
              </Link>
            </div>
          ) : (
            <PieceGrid pieces={pieces} />
          )}
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
