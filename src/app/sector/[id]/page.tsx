import { notFound } from "next/navigation";
import Link from "next/link";
import { AppHeader } from "@/components/trico/app-header";
import { BottomNav } from "@/components/trico/bottom-nav";
import { PieceGrid } from "@/components/trico/piece-card";
import { SectorIcon } from "@/components/trico/sector-icon";
import { TimeFilter } from "@/components/trico/time-filter";
import { filterPieces } from "@/lib/data";
import { getSector } from "@/lib/sectors";
import type { TimeWindow } from "@/lib/types";

export default async function SectorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tempo?: string }>;
}) {
  const { id } = await params;
  const { tempo: tempoRaw } = await searchParams;
  const sector = getSector(id);
  if (!sector) notFound();

  const tempo = ((tempoRaw as TimeWindow) || "dia") as TimeWindow;
  const pieces = filterPieces({ sectorId: sector.id, timeWindow: tempo });

  return (
    <div className="flex min-h-full flex-col pb-24 md:pb-10">
      <AppHeader solid />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-terracotta">
              <SectorIcon id={sector.id} />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Sector
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold text-navy sm:text-4xl">
              {sector.name}
            </h1>
            <p className="mt-2 max-w-xl text-navy/65">{sector.description}</p>
          </div>
          <TimeFilter value={tempo} basePath={`/sector/${sector.id}`} />
        </div>

        <div className="mt-10">
          <PieceGrid pieces={pieces} />
        </div>

        <p className="mt-8 text-sm text-navy/50">
          Ver também o{" "}
          <Link href="/feed" className="font-medium text-navy underline">
            feed completo
          </Link>
          .
        </p>
      </main>
      <BottomNav />
    </div>
  );
}
