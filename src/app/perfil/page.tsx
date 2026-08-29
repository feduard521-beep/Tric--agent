"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { AppHeader } from "@/components/trico/app-header";
import { BottomNav } from "@/components/trico/bottom-nav";
import { SectorPicker } from "@/components/trico/sector-picker";
import { usePreferences } from "@/components/trico/preferences-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { NOTIFICATION_OPTIONS, toggleSector } from "@/lib/preferences";
import type { NotificationPref, SectorId } from "@/lib/types";
import { clampSectorsForPlan, FREE_SECTOR_LIMIT } from "@/lib/modules/billing/plans";
import { cn } from "@/lib/utils";

export default function PerfilPage() {
  const { prefs, setPrefs } = usePreferences();
  const { data: session } = useSession();

  function setSectors(next: SectorId[]) {
    const clamped = clampSectorsForPlan(next, prefs.plan);
    setPrefs({ ...prefs, sectors: clamped });
  }

  function setNotifications(id: NotificationPref) {
    setPrefs({ ...prefs, notifications: id });
  }

  return (
    <div className="flex min-h-full flex-col pb-24 md:pb-10">
      <AppHeader solid />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
          Perfil
        </h1>
        <p className="mt-2 text-navy/65">
          Sectores, notificações e plano — o tear à tua medida.
        </p>

        <section className="mt-6 rounded-2xl border border-navy/10 bg-white/55 p-4 text-sm">
          {session?.user ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p>
                  Sessão: <strong>{session.user.email}</strong>
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Terminar sessão
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-navy/70">Modo local (sem conta na BD).</p>
              <Link
                href="/entrar"
                className={cn(buttonVariants(), "bg-navy text-cream")}
              >
                Entrar / Registar
              </Link>
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-navy">
            Sectores seguidos
          </h2>
          <p className="mt-1 text-sm text-navy/55">
            Liga ou desliga os fios que queres acompanhar
            {prefs.plan !== "premium"
              ? ` (máx. ${FREE_SECTOR_LIMIT} no gratuito)`
              : ""}
            .
          </p>
          <div className="mt-4">
            <SectorPicker
              selected={prefs.sectors}
              onToggle={(id) => setSectors(toggleSector(id, prefs.sectors))}
            />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-navy">
            Notificações
          </h2>
          <div className="mt-4 space-y-3">
            {NOTIFICATION_OPTIONS.map((opt) => {
              const active = prefs.notifications === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setNotifications(opt.id)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition",
                    active
                      ? "border-terracotta/50 bg-white"
                      : "border-navy/10 bg-white/50",
                  )}
                >
                  <p className="font-medium text-navy">{opt.label}</p>
                  <p className="mt-1 text-sm text-navy/55">{opt.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-10 border border-navy bg-navy p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
            Plano
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {prefs.plan === "premium" ? "Premium" : "Gratuito"}
          </h2>
          <p className="mt-2 text-sm text-white/70">
            {prefs.plan === "premium"
              ? "Sectores ilimitados e Resumo do Ano desbloqueados."
              : "No gratuito: até 2 sectores. Premium (2000 Kz/mês) desbloqueia tudo."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/premium"
              className={cn(
                buttonVariants(),
                "bg-terracotta text-white hover:bg-terracotta/90",
              )}
            >
              {prefs.plan === "premium" ? "Gerir Premium" : "Ver Premium · 2000 Kz"}
            </Link>
            <Link
              href="/onboarding"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-white hover:bg-white/10",
              )}
            >
              Refazer onboarding
            </Link>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
