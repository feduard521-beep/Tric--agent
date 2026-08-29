"use client";

import Link from "next/link";
import { AppHeader } from "@/components/trico/app-header";
import { BottomNav } from "@/components/trico/bottom-nav";
import { SectorPicker } from "@/components/trico/sector-picker";
import { usePreferences } from "@/components/trico/preferences-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { NOTIFICATION_OPTIONS, toggleSector } from "@/lib/preferences";
import type { NotificationPref, SectorId } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function PerfilPage() {
  const { prefs, setPrefs, ready } = usePreferences();

  function setSectors(next: SectorId[]) {
    setPrefs({ ...prefs, sectors: next });
  }

  function setNotifications(id: NotificationPref) {
    setPrefs({ ...prefs, notifications: id });
  }

  function setPlan(plan: "gratuito" | "premium") {
    setPrefs({ ...prefs, plan });
  }

  if (!ready) {
    return (
      <div className="flex min-h-full items-center justify-center text-navy/60">
        A carregar perfil…
      </div>
    );
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

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-navy">
            Sectores seguidos
          </h2>
          <p className="mt-1 text-sm text-navy/55">Liga ou desliga os fios que queres acompanhar.</p>
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

        <section className="mt-10 rounded-3xl border border-navy/10 bg-navy p-6 text-cream">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/50">
            Plano
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            {prefs.plan === "premium" ? "Premium" : "Gratuito"}
          </h2>
          <p className="mt-2 text-sm text-cream/70">
            {prefs.plan === "premium"
              ? "Resumo do Ano, sectores ilimitados e histórico completo desbloqueados neste dispositivo."
              : "No gratuito: sectores limitados e resumo diário. Premium desbloqueia o Resumo do Ano."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {prefs.plan === "gratuito" ? (
              <Button
                className="bg-terracotta text-white hover:bg-terracotta/90"
                onClick={() => setPlan("premium")}
              >
                Experimentar Premium
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-cream/30 bg-transparent text-cream hover:bg-cream/10"
                onClick={() => setPlan("gratuito")}
              >
                Voltar ao Gratuito
              </Button>
            )}
            <Link
              href="/onboarding"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-cream hover:bg-cream/10",
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
