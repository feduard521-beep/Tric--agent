import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GitBranch } from "lucide-react";
import { AppHeader } from "@/components/trico/app-header";
import { BottomNav } from "@/components/trico/bottom-nav";
import { PieceCard } from "@/components/trico/piece-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  getPieceById,
  getThemeTimeline,
} from "@/lib/modules/pieces/repository";
import { getSector } from "@/lib/sectors";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";
import { safeHttpUrl } from "@/lib/security/urls";

export default async function PiecePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ timeline?: string }>;
}) {
  const { id } = await params;
  const { timeline } = await searchParams;
  const piece = await getPieceById(id);
  if (!piece) notFound();

  const sector = getSector(piece.sectorId);
  const timelinePieces = await getThemeTimeline(piece.themeId);
  const showTimeline = timeline === "1";

  return (
    <div className="flex min-h-full flex-col pb-24 md:pb-10">
      <AppHeader solid />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 text-sm font-medium text-navy/60 hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao feed
        </Link>

        <article className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-navy/10 text-navy hover:bg-navy/15">
              {sector?.short}
            </Badge>
            <span className="text-sm text-navy/50">
              {formatClock(piece.publishedAt)}
            </span>
            <span className="text-sm capitalize text-navy/50">
              · {piece.timeWindow}
            </span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-navy sm:text-4xl">
            {piece.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy/80">
            {piece.fullSummary}
          </p>

          <section className="mt-10 border-t border-navy/10 pt-8">
            <h2 className="font-display text-xl font-semibold text-navy">
              Fontes originais
            </h2>
            <p className="mt-1 text-sm text-navy/55">
              {piece.sourceCount} fontes agregadas nesta peça
            </p>
            <ul className="mt-4 space-y-2">
              {piece.sources.map((source) => {
                const href = safeHttpUrl(source.url);
                if (!href) {
                  return (
                    <li key={source.url + source.name}>
                      <span className="inline-flex items-center gap-2 rounded-lg border border-navy/10 bg-white/60 px-3 py-2 text-sm font-medium text-navy">
                        {source.name}
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={href + source.name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-navy/10 bg-white/60 px-3 py-2 text-sm font-medium text-navy transition hover:border-terracotta/40"
                    >
                      {source.name}
                      <ExternalLink className="h-3.5 w-3.5 text-navy/40" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="mt-8">
            <Link
              href={
                showTimeline
                  ? `/peca/${piece.id}`
                  : `/peca/${piece.id}?timeline=1`
              }
              className={cn(
                buttonVariants(),
                "bg-terracotta text-white hover:bg-terracotta/90",
              )}
            >
              <GitBranch className="h-4 w-4" />
              {showTimeline
                ? "Ocultar linha do tempo"
                : "Ver linha do tempo deste tema"}
            </Link>
          </div>

          {showTimeline ? (
            <section className="mt-10 rounded-3xl border border-navy/10 bg-white/55 p-5 sm:p-7">
              <h2 className="font-display text-2xl font-semibold text-navy">
                Linha do tempo
              </h2>
              <p className="mt-2 text-sm text-navy/60">
                Evolução do tema «{piece.themeId.replace(/-/g, " ")}» ao longo do
                tempo.
              </p>
              <div className="mt-4">
                {timelinePieces.map((p) => (
                  <PieceCard key={p.id} piece={p} />
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </main>
      <BottomNav />
    </div>
  );
}
