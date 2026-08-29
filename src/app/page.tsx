import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/trico/logo";
import { PieceFeature, PieceRow } from "@/components/trico/piece-card";
import { SectionBar } from "@/components/trico/section-bar";
import { SiteFooter } from "@/components/trico/site-footer";
import { ScrollReveal } from "@/components/trico/scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { getDailyDigestPieces } from "@/lib/modules/pieces/repository";
import { SECTORS } from "@/lib/sectors";
import { cn } from "@/lib/utils";

export default async function LandingPage() {
  const digest = await getDailyDigestPieces();
  const hero = digest[0];
  const rest = digest.slice(1, 5);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <div className="border-b border-line bg-navy text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <ScrollReveal variant="right" duration={800}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">
                Angola · Tecnologia · Sectores
              </p>
              <p className="mt-2 max-w-xl text-lg font-semibold leading-snug sm:text-xl">
                O futuro dos sectores estratégicos começa com notícias bem tecidas.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="left" delay={120} duration={800}>
            <Link
              href="/entrar"
              className="hidden shrink-0 bg-terracotta px-4 py-2 text-sm font-bold text-white hover:bg-terracotta/90 sm:inline-flex"
            >
              Começar grátis
            </Link>
          </ScrollReveal>
        </div>
      </div>

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo withTagline size="md" />
        <div className="flex items-center gap-2">
          <Link
            href="/feed"
            className="hidden text-sm font-bold uppercase text-navy hover:text-terracotta sm:inline"
          >
            Ver feed
          </Link>
          <Link
            href="/entrar"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-9 border-navy/20 text-navy hover:bg-navy hover:text-white",
            )}
          >
            Entrar
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-12 sm:px-6">
        <ScrollReveal variant="down" duration={700}>
          <nav className="mb-5 flex flex-wrap gap-x-4 gap-y-1 border-y border-line py-2 text-xs font-bold uppercase tracking-wide text-navy/70">
            <Link href="/feed" className="hover:text-terracotta">
              Início
            </Link>
            {SECTORS.map((s) => (
              <Link key={s.id} href={`/sector/${s.id}`} className="hover:text-terracotta">
                {s.short}
              </Link>
            ))}
          </nav>
        </ScrollReveal>

        <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          {hero ? (
            <PieceFeature piece={hero} />
          ) : (
            <ScrollReveal variant="up" duration={800}>
              <div className="border border-line p-8">
                <h1 className="text-3xl font-bold text-navy">Tricô</h1>
                <p className="mt-2 text-muted-foreground">
                  As notícias do teu sector, tecidas para ti.
                </p>
                <Link
                  href="/entrar"
                  className="mt-5 inline-flex h-10 items-center bg-navy px-4 text-sm font-bold text-white"
                >
                  Começar grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>
          )}
          <aside>
            <ScrollReveal variant="zoom" duration={800}>
              <SectionBar title="Últimas notícias" />
            </ScrollReveal>
            <div className="space-y-2">
              {rest.map((p, i) => (
                <PieceRow key={p.id} piece={p} delay={80 * (i + 1)} />
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10">
          <ScrollReveal variant="down" duration={700}>
            <SectionBar title="Sectores" />
          </ScrollReveal>
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {SECTORS.map((s, i) => (
              <ScrollReveal key={s.id} variant="up" delay={60 * i} duration={700}>
                <Link
                  href={`/sector/${s.id}`}
                  className="block h-full bg-white p-4 transition hover:bg-secondary"
                >
                  <p className="text-sm font-bold uppercase tracking-wide text-navy">
                    {s.short}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <ScrollReveal variant="zoom" duration={800} className="mt-10">
          <section className="flex flex-wrap items-center justify-between gap-4 border border-navy bg-navy px-5 py-6 text-white">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/50">
                Conta Tricô
              </p>
              <p className="mt-1 text-lg font-bold">
                Personaliza sectores e recebe o fio do dia.
              </p>
            </div>
            <Link
              href="/onboarding"
              className="inline-flex h-10 items-center bg-terracotta px-4 text-sm font-bold text-white hover:bg-terracotta/90"
            >
              Escolher temas
            </Link>
          </section>
        </ScrollReveal>
      </main>
      <SiteFooter />
    </div>
  );
}
