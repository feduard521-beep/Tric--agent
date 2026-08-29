import Link from "next/link";
import { Link2, Sparkles } from "lucide-react";
import type { Piece, SectorId } from "@/lib/types";
import { getSector } from "@/lib/sectors";
import { formatRelativeTime } from "@/lib/format";
import { LogoMark } from "@/components/trico/logo";
import { SectorIcon } from "@/components/trico/sector-icon";
import { cn } from "@/lib/utils";

const COVER: Record<SectorId, string> = {
  economia: "from-[#1a3a5c] via-[#0d2744] to-[#a65e2e]/40",
  politica: "from-[#002147] via-[#1a3a5c] to-[#5a6a7c]/30",
  tecnologia: "from-[#0a2540] via-[#002147] to-[#a65e2e]/25",
  energia: "from-[#a65e2e] via-[#8b4f28] to-[#002147]/50",
  saude: "from-[#1c4a5c] via-[#0d2744] to-[#a65e2e]/20",
};

function CardCover({ sectorId, title }: { sectorId: SectorId; title: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-t-[1.1rem] bg-gradient-to-br",
        COVER[sectorId],
      )}
    >
      <div className="mesh-bg absolute inset-0 opacity-30" aria-hidden />
      <LogoMark className="absolute -right-2 -top-2 h-28 w-32 opacity-25" />
      <div className="absolute inset-0 flex items-end p-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-cream/90 px-2.5 py-1 text-xs font-semibold text-navy backdrop-blur-sm">
          <SectorIcon id={sectorId} className="h-3.5 w-3.5" />
          {getSector(sectorId)?.short}
        </span>
      </div>
      <span className="sr-only">{title}</span>
    </div>
  );
}

export function PieceCard({
  piece,
  featured = false,
  className,
}: {
  piece: Piece;
  featured?: boolean;
  className?: string;
}) {
  const sector = getSector(piece.sectorId);
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[1.15rem] border border-navy/10 bg-white card-lift",
        featured && "md:col-span-2 lg:col-span-2",
        className,
      )}
    >
      <CardCover sectorId={piece.sectorId} title={piece.title} />
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-navy/45">
          <span>{sector?.short}</span>
          {piece.isBreaking ? (
            <span className="inline-flex items-center gap-1 text-terracotta">
              <Sparkles className="h-3 w-3" /> Breaking
            </span>
          ) : null}
        </div>
        <h3
          className={cn(
            "font-display font-semibold leading-snug text-navy transition-colors group-hover:text-terracotta",
            featured ? "text-2xl sm:text-[1.7rem]" : "text-lg sm:text-xl",
          )}
        >
          <Link href={`/peca/${piece.id}`} className="stretched-link outline-none">
            {piece.title}
          </Link>
        </h3>
        <p
          className={cn(
            "line-clamp-3 text-navy/65",
            featured ? "text-sm leading-relaxed sm:text-base" : "text-sm leading-relaxed",
          )}
        >
          {piece.summary}
        </p>
        <div className="mt-auto flex items-center gap-2 border-t border-navy/8 pt-3 text-[11px] text-navy/50">
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-navy/5">
            <LogoMark className="h-4 w-4" />
          </span>
          <span>{formatRelativeTime(piece.publishedAt)}</span>
          <span className="text-navy/25">|</span>
          <span className="inline-flex items-center gap-1">
            <Link2 className="h-3 w-3" />
            {piece.sourceCount} fontes
          </span>
          <span className="text-navy/25">|</span>
          <span>{sector?.short}</span>
        </div>
      </div>
    </article>
  );
}

export function PieceGrid({ pieces }: { pieces: Piece[] }) {
  if (pieces.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-navy/15 bg-white/60 px-6 py-14 text-center">
        <p className="font-display text-xl text-navy">Nenhuma peça neste fio</p>
        <p className="mt-2 text-sm text-navy/60">
          Experimenta outro período ou sector — o tear ainda está a aquecer.
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {pieces.map((piece, i) => (
        <PieceCard key={piece.id} piece={piece} featured={i === 0 && pieces.length > 3} />
      ))}
    </div>
  );
}
