import Link from "next/link";
import { ArrowRight, Clock3, Layers3, Sparkles } from "lucide-react";
import { Logo, LogoMark } from "@/components/trico/logo";
import { PieceCard } from "@/components/trico/piece-card";
import { buttonVariants } from "@/components/ui/button";
import { getDailyDigestPieces } from "@/lib/modules/pieces/repository";
import { SECTORS } from "@/lib/sectors";
import { cn } from "@/lib/utils";

export default async function LandingPage() {
  const digest = await getDailyDigestPieces();

  return (
    <div className="relative flex min-h-full flex-col">
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo withTagline />
        <Link
          href="/entrar"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-navy/20 bg-white/50 text-navy hover:bg-white",
          )}
        >
          Entrar
        </Link>
      </header>

      <main className="relative flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 yarn-ring" aria-hidden />
          <div
            className="pointer-events-none absolute -right-24 top-10 opacity-[0.12] sm:-right-10"
            aria-hidden
          >
            <LogoMark className="h-72 w-72 text-navy sm:h-[26rem] sm:w-[26rem]" />
          </div>
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:pb-24 lg:pt-10">
            <div className="max-w-2xl">
              <p className="reveal text-sm font-semibold uppercase tracking-[0.22em] text-terracotta">
                Angola · MVP
              </p>
              <h1 className="reveal reveal-delay-1 mt-4 font-display text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-tight text-navy">
                Tricô
              </h1>
              <p className="reveal reveal-delay-2 mt-5 max-w-xl text-lg leading-relaxed text-navy/75 sm:text-xl">
                As notícias do teu sector, tecidas para ti.
              </p>
              <div className="reveal reveal-delay-3 mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/entrar"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 bg-terracotta px-6 text-base text-white hover:bg-terracotta/90",
                  )}
                >
                  Começar Grátis
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
                <Link
                  href="#resumo"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "ghost" }),
                    "h-12 text-navy hover:bg-navy/5",
                  )}
                >
                  Ver resumo do dia
                </Link>
              </div>
            </div>

            <aside className="reveal reveal-delay-2 relative overflow-hidden rounded-3xl border border-navy/10 bg-navy text-cream shadow-[0_30px_80px_-40px_rgba(13,39,68,0.8)]">
              <div className="mesh-bg absolute inset-0 opacity-40" aria-hidden />
              <div className="relative p-6 sm:p-7">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cream/60">
                  <Sparkles className="h-3.5 w-3.5 text-terracotta" />
                  Peça do dia
                </div>
                <p className="mt-4 font-display text-2xl font-semibold leading-snug">
                  Cinco sectores. Um fio só.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">
                  Economia, política, tecnologia, energia e saúde — resumidas sem
                  precisares de saltar entre jornais.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-cream/80">
                  <li className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-terracotta" /> Hora · Dia ·
                    Semana · Ano
                  </li>
                  <li className="flex items-center gap-2">
                    <Layers3 className="h-4 w-4 text-terracotta" /> Fontes
                    agregadas por tema
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section id="resumo" className="border-t border-navy/10 bg-white/35">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="mb-8 max-w-2xl">
              <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
                Resumo Geral do Dia
              </h2>
              <p className="mt-3 text-navy/65">
                Pré-visualização sem registo — o essencial de Angola, já tecido.
              </p>
            </div>
            <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
              <div>
                {digest.map((piece) => (
                  <PieceCard key={piece.id} piece={piece} />
                ))}
              </div>
              <aside className="h-fit rounded-2xl border border-navy/10 bg-cream/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy/45">
                  Sectores do MVP
                </p>
                <ul className="mt-4 space-y-3">
                  {SECTORS.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-medium text-navy">{s.short}</span>
                      <span className="text-navy/40">activo</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/onboarding"
                  className={cn(
                    buttonVariants(),
                    "mt-6 w-full bg-navy text-cream hover:bg-navy/90",
                  )}
                >
                  Personalizar o meu fio
                </Link>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-navy/10 px-4 py-8 text-center text-sm text-navy/50 sm:px-6">
        Tricô — cada notícia, um ponto. Juntos, formam o quadro completo.
      </footer>
    </div>
  );
}
