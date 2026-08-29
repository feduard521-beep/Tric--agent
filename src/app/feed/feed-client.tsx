"use client";

/**
 * Feed — grelha visual alinhada às mockups Tricô.
 */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppHeader } from "@/components/trico/app-header";
import { BottomNav } from "@/components/trico/bottom-nav";
import { PieceGrid } from "@/components/trico/piece-card";
import { TimeFilter } from "@/components/trico/time-filter";
import { usePreferences } from "@/components/trico/preferences-provider";
import { PreferencesPanel } from "@/components/trico/preferences-panel";
import { SECTORS } from "@/lib/sectors";
import type { Piece, TimeWindow } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function FeedPage() {
  const searchParams = useSearchParams();
  const { prefs, ready } = usePreferences();
  const tempo = (searchParams.get("tempo") as TimeWindow) || "dia";
  const sectorParam = searchParams.get("sector");

  const followed = prefs.sectors.length ? prefs.sectors : SECTORS.map((s) => s.id);
  const isPremium = prefs.plan === "premium";
  const yearLocked = tempo === "ano" && !isPremium;

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryKey = useMemo(
    () => `${tempo}|${sectorParam || "all"}|${followed.join(",")}|${yearLocked}`,
    [tempo, sectorParam, followed, yearLocked],
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (yearLocked) {
          if (!cancelled) setPieces([]);
          return;
        }

        const params = new URLSearchParams({ tempo });
        if (sectorParam) params.set("sector", sectorParam);
        const res = await fetch(`/api/pieces?${params.toString()}`);
        const data = await res.json();
        let list = (data.pieces || []) as Piece[];
        if (!sectorParam) {
          list = list.filter((p) => followed.includes(p.sectorId));
        }
        if (!cancelled) setPieces(list);
      } catch {
        if (!cancelled) setError("Não foi possível carregar as peças.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [queryKey, yearLocked, tempo, sectorParam, followed]);

  return (
    <div className="relative flex min-h-full flex-col pb-24 md:pb-10">
      <div className="pointer-events-none absolute inset-0 yarn-watermark" aria-hidden />
      <AppHeader solid />
      <main className="relative mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-7">
            <div className="space-y-5">
              <TimeFilter value={tempo} basePath="/feed" />

              <div className="space-y-2">
                <p className="filter-label">Categorias de sector</p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/feed?tempo=${tempo}`}
                    className={cn("pill", !sectorParam && "pill-active")}
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
                          "pill",
                          active && "pill-active",
                          !followedSector && "opacity-50",
                        )}
                      >
                        {s.short}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <h1 className="font-display text-2xl font-semibold text-navy sm:text-3xl">
                {ready && prefs.onboarded
                  ? "O teu dia, tecido"
                  : "Resumo Geral do Dia"}
              </h1>
              <p className="mt-1 text-sm text-navy/55">
                Peças agregadas por sector e período.
              </p>
            </div>

            {error ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

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
                  className="mt-5 inline-flex h-10 items-center rounded-full bg-terracotta px-5 text-sm font-semibold text-white hover:bg-terracotta/90"
                >
                  Ver planos no perfil
                </Link>
              </div>
            ) : loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 animate-pulse rounded-[1.15rem] bg-navy/5"
                  />
                ))}
              </div>
            ) : (
              <PieceGrid pieces={pieces} />
            )}
          </div>

          <aside className="hidden w-72 shrink-0 xl:block">
            <PreferencesPanel pieces={pieces.slice(0, 6)} />
          </aside>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
