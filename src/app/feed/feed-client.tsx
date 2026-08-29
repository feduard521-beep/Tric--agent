"use client";

/**
 * Feed editorial — grelha tipo portal de notícias, identidade Tricô.
 */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppHeader } from "@/components/trico/app-header";
import { BottomNav } from "@/components/trico/bottom-nav";
import {
  PieceFeature,
  PieceRow,
  PieceSectorGrid,
} from "@/components/trico/piece-card";
import { SectionBar } from "@/components/trico/section-bar";
import { TimeFilter } from "@/components/trico/time-filter";
import { usePreferences } from "@/components/trico/preferences-provider";
import { SiteFooter } from "@/components/trico/site-footer";
import { ScrollReveal } from "@/components/trico/scroll-reveal";
import { SECTORS } from "@/lib/sectors";
import type { Piece, SectorId, TimeWindow } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function FeedPage() {
  const searchParams = useSearchParams();
  const { prefs } = usePreferences();
  const tempo = (searchParams.get("tempo") as TimeWindow) || "dia";
  const sectorParam = searchParams.get("sector") as SectorId | null;

  const validSectorIds = useMemo(() => SECTORS.map((s) => s.id), []);
  const followedSectors = useMemo(() => {
    const followedRaw = prefs.sectors.length ? prefs.sectors : validSectorIds;
    const followed = followedRaw.filter((id) => validSectorIds.includes(id));
    return followed.length ? followed : validSectorIds;
  }, [prefs.sectors, validSectorIds]);
  const isPremium = prefs.plan === "premium";
  const yearLocked = tempo === "ano" && !isPremium;

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryKey = useMemo(
    () =>
      `${tempo}|${sectorParam || "all"}|${followedSectors.join(",")}|${yearLocked}`,
    [tempo, sectorParam, followedSectors, yearLocked],
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
        if (res.status === 403 && data?.code === "PREMIUM_REQUIRED") {
          if (!cancelled) {
            setPieces([]);
            setError(null);
          }
          return;
        }
        if (!res.ok) {
          throw new Error(data?.error || "Erro");
        }
        let list = (data.pieces || []) as Piece[];
        if (!sectorParam) {
          list = list.filter((p) => followedSectors.includes(p.sectorId));
        }
        if (!cancelled) setPieces(list);
      } catch {
        if (!cancelled) setError("Não foi possível carregar as peças.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [queryKey, yearLocked, tempo, sectorParam, followedSectors]);

  const bySector = useMemo(() => {
    const map = new Map<SectorId, Piece[]>();
    for (const s of SECTORS) map.set(s.id, []);
    for (const p of pieces) {
      const arr = map.get(p.sectorId);
      if (arr) arr.push(p);
    }
    return map;
  }, [pieces]);

  const hero = pieces[0];
  const secondary = pieces.slice(1, 3);
  const latest = pieces.slice(0, 8);

  return (
    <div className="flex min-h-full flex-col pb-20 md:pb-0">
      <AppHeader solid />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TimeFilter value={tempo} basePath="/feed" showLabel />
          <div className="flex flex-wrap gap-1">
            <Link
              href={`/feed?tempo=${tempo}`}
              className={cn(
                "px-2.5 py-1 text-xs font-bold uppercase",
                !sectorParam ? "bg-navy text-white" : "text-navy/60 hover:text-navy",
              )}
            >
              Todos
            </Link>
            {SECTORS.map((s) => (
              <Link
                key={s.id}
                href={`/feed?tempo=${tempo}&sector=${s.id}`}
                className={cn(
                  "px-2.5 py-1 text-xs font-bold uppercase",
                  sectorParam === s.id
                    ? "bg-navy text-white"
                    : "text-navy/60 hover:text-navy",
                )}
              >
                {s.short}
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-4 flex items-center gap-3 border border-navy bg-navy px-3 py-2 text-sm text-white">
          <span className="font-bold uppercase tracking-wide text-terracotta">
            Brevemente
          </span>
          <span className="text-white/85">
            Resumo semanal personalizado por sector — plano Premium.
          </span>
        </div>

        {error ? (
          <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {yearLocked ? (
          <div className="border border-navy bg-navy px-6 py-10 text-white">
            <p className="text-xs font-bold uppercase tracking-wide text-white/50">
              Premium
            </p>
            <h2 className="mt-2 text-2xl font-bold">Resumo do Ano</h2>
            <p className="mt-2 max-w-lg text-sm text-white/70">
              A retrospectiva anual dos teus sectores. Disponível no plano Premium.
            </p>
            <Link
              href="/premium"
              className="mt-5 inline-flex h-10 items-center bg-terracotta px-4 text-sm font-bold text-white hover:bg-terracotta/90"
            >
              Ver Premium · 2000 Kz
            </Link>
          </div>
        ) : loading ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="h-64 animate-pulse bg-secondary lg:col-span-2" />
            <div className="h-64 animate-pulse bg-secondary" />
          </div>
        ) : sectorParam ? (
          <section>
            <ScrollReveal variant="down" duration={700}>
              <SectionBar
                title={SECTORS.find((s) => s.id === sectorParam)?.name || "Sector"}
              />
            </ScrollReveal>
            <PieceSectorGrid pieces={pieces} />
          </section>
        ) : (
          <>
            <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr_0.9fr]">
              <div>{hero ? <PieceFeature piece={hero} /> : null}</div>
              <div className="space-y-3">
                {secondary.map((p, i) => (
                  <PieceFeature key={p.id} piece={p} delay={100 * (i + 1)} />
                ))}
              </div>
              <aside>
                <ScrollReveal variant="zoom" duration={700}>
                  <SectionBar title="Últimas notícias" />
                </ScrollReveal>
                <ul className="divide-y divide-line border border-line">
                  {latest.map((p, i) => (
                    <ScrollReveal key={p.id} variant="up" delay={50 * i} duration={650}>
                      <li>
                        <Link
                          href={`/peca/${p.id}`}
                          className="block px-3 py-2.5 text-sm font-semibold leading-snug text-navy hover:bg-secondary hover:text-terracotta"
                        >
                          {p.title}
                        </Link>
                      </li>
                    </ScrollReveal>
                  ))}
                </ul>
              </aside>
            </section>

            {SECTORS.filter((s) => followedSectors.includes(s.id)).map((sector) => {
              const list = bySector.get(sector.id) || [];
              if (list.length === 0) return null;
              return (
                <section key={sector.id} className="mt-8">
                  <ScrollReveal variant="down" duration={700}>
                    <SectionBar
                      title={sector.short}
                      href={`/feed?tempo=${tempo}&sector=${sector.id}`}
                    />
                  </ScrollReveal>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {list.slice(0, 4).map((p, i) => (
                      <PieceRow key={p.id} piece={p} delay={70 * i} />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
