"use client";

/**
 * Pesquisa transversal via /api/pieces?q=
 * Teste: escrever "kwanza" e ver resultados em tempo real.
 */
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/trico/app-header";
import { BottomNav } from "@/components/trico/bottom-nav";
import { PieceGrid } from "@/components/trico/piece-card";
import type { Piece } from "@/lib/types";

function SearchInner() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [results, setResults] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/pieces?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.pieces || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(handle);
  }, [query]);

  return (
    <div className="flex min-h-full flex-col pb-24 md:pb-10">
      <AppHeader solid />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
          Pesquisar
        </h1>
        <p className="mt-2 text-navy/65">
          Pesquisa transversal a sectores e períodos.
        </p>
        <div className="mt-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: kwanza, vacinação, solar…"
            className="h-12 w-full rounded-lg border border-navy/15 bg-white/70 px-3 text-base text-navy outline-none ring-terracotta/40 placeholder:text-navy/40 focus:border-terracotta focus:ring-3"
            autoFocus
            aria-label="Pesquisar peças"
          />
        </div>
        <div className="mt-8">
          {query.trim() ? (
            <>
              <p className="mb-3 text-sm text-navy/50">
                {loading
                  ? "A procurar…"
                  : `${results.length} peça${results.length === 1 ? "" : "s"} encontrada${results.length === 1 ? "" : "s"}`}
              </p>
              <PieceGrid pieces={results} />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-navy/15 bg-white/40 px-6 py-12 text-center">
              <p className="font-display text-xl text-navy">
                Começa a tecer a pesquisa
              </p>
              <p className="mt-2 text-sm text-navy/60">
                Escreve um tema, sector ou palavra-chave.
              </p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

export default function PesquisarPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center text-navy/60">
          A preparar pesquisa…
        </div>
      }
    >
      <SearchInner />
    </Suspense>
  );
}
