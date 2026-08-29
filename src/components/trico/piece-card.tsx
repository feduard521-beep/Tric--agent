import Link from "next/link";
import { Link2, Sparkles } from "lucide-react";
import type { Piece } from "@/lib/types";
import { getSector } from "@/lib/sectors";
import { formatRelativeTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
        "group relative flex flex-col gap-3 border-b border-navy/10 py-5 transition-colors first:pt-0 last:border-0",
        featured && "md:gap-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge
          variant="secondary"
          className="rounded-md bg-navy/8 font-medium text-navy hover:bg-navy/12"
        >
          {sector?.short}
        </Badge>
        {piece.isBreaking ? (
          <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide text-terracotta">
            <Sparkles className="h-3 w-3" /> Breaking
          </span>
        ) : null}
        <span className="text-navy/45">{formatRelativeTime(piece.publishedAt)}</span>
      </div>
      <div className="space-y-2">
        <h3
          className={cn(
            "font-display font-semibold text-navy transition-colors group-hover:text-terracotta",
            featured ? "text-2xl leading-snug sm:text-3xl" : "text-lg leading-snug sm:text-xl",
          )}
        >
          <Link href={`/peca/${piece.id}`} className="stretched-link outline-none">
            {piece.title}
          </Link>
        </h3>
        <p
          className={cn(
            "text-navy/70",
            featured ? "text-base leading-relaxed sm:text-lg" : "text-sm leading-relaxed",
          )}
        >
          {piece.summary}
        </p>
      </div>
      <div className="flex items-center gap-3 text-xs text-navy/50">
        <span className="inline-flex items-center gap-1">
          <Link2 className="h-3.5 w-3.5" />
          {piece.sourceCount} fontes
        </span>
        <span className="capitalize">{piece.timeWindow}</span>
        <span className="capitalize">impacto {piece.impact}</span>
      </div>
    </article>
  );
}

export function PieceGrid({ pieces }: { pieces: Piece[] }) {
  if (pieces.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-navy/15 bg-white/40 px-6 py-12 text-center">
        <p className="font-display text-xl text-navy">Nenhuma peça neste fio</p>
        <p className="mt-2 text-sm text-navy/60">
          Experimenta outro período ou sector — o tear ainda está a aquecer.
        </p>
      </div>
    );
  }
  const [first, ...rest] = pieces;
  return (
    <div>
      <PieceCard piece={first} featured />
      <div className="grid gap-0 md:grid-cols-2 md:gap-x-10">
        {rest.map((piece) => (
          <PieceCard key={piece.id} piece={piece} />
        ))}
      </div>
    </div>
  );
}
