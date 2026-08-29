import Link from "next/link";
import type { Piece, SectorId } from "@/lib/types";
import { getSector } from "@/lib/sectors";
import { formatRelativeTime } from "@/lib/format";
import { LogoMark } from "@/components/trico/logo";
import { cn } from "@/lib/utils";

function Thumb({
  sectorId,
  size = "md",
}: {
  sectorId: SectorId;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "lg"
      ? "aspect-[16/10] w-full"
      : size === "sm"
        ? "h-[72px] w-[96px] shrink-0"
        : "h-[88px] w-[120px] shrink-0";
  return (
    <div className={cn("news-thumb relative overflow-hidden", dims)}>
      <LogoMark className="absolute inset-0 m-auto h-10 w-11 opacity-40" />
      <span className="absolute bottom-1 left-1 bg-navy/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
        {getSector(sectorId)?.short}
      </span>
    </div>
  );
}

/** Cartão horizontal: miniatura + título + meta (estilo portal). */
export function PieceRow({
  piece,
  className,
}: {
  piece: Piece;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex gap-3 border border-line bg-white p-2 transition hover:border-navy/30",
        className,
      )}
    >
      <Thumb sectorId={piece.sectorId} size="sm" />
      <div className="min-w-0 flex-1 py-0.5">
        <h3 className="text-sm font-bold leading-snug text-navy group-hover:text-terracotta">
          <Link href={`/peca/${piece.id}`} className="stretched-link">
            {piece.title}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatRelativeTime(piece.publishedAt)} · {piece.sourceCount} fontes
        </p>
      </div>
    </article>
  );
}

/** Destaque vertical com imagem grande. */
export function PieceFeature({ piece }: { piece: Piece }) {
  const sector = getSector(piece.sectorId);
  return (
    <article className="group relative border border-line bg-white">
      <Thumb sectorId={piece.sectorId} size="lg" />
      <div className="space-y-2 p-3 sm:p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-terracotta">
          {sector?.short}
        </p>
        <h3 className="text-lg font-bold leading-snug text-navy group-hover:text-terracotta sm:text-xl">
          <Link href={`/peca/${piece.id}`} className="stretched-link">
            {piece.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {piece.summary}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatRelativeTime(piece.publishedAt)} · {piece.sourceCount} fontes
        </p>
      </div>
    </article>
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
  if (featured) {
    return (
      <div className={className}>
        <PieceFeature piece={piece} />
      </div>
    );
  }
  return <PieceRow piece={piece} className={className} />;
}

export function PieceGrid({ pieces }: { pieces: Piece[] }) {
  if (pieces.length === 0) {
    return (
      <div className="border border-dashed border-line px-6 py-12 text-center">
        <p className="font-bold text-navy">Nenhuma peça neste fio</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Experimenta outro período ou sector.
        </p>
      </div>
    );
  }
  const [hero, ...rest] = pieces;
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <PieceFeature piece={hero} />
      <div className="grid gap-2 content-start">
        {rest.slice(0, 6).map((p) => (
          <PieceRow key={p.id} piece={p} />
        ))}
      </div>
    </div>
  );
}

export function PieceSectorGrid({ pieces }: { pieces: Piece[] }) {
  if (pieces.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">Sem peças neste sector.</p>
    );
  }
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {pieces.map((p) => (
        <PieceRow key={p.id} piece={p} />
      ))}
    </div>
  );
}
