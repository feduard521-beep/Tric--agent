"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/trico/logo";
import { SectorPicker } from "@/components/trico/sector-picker";
import { usePreferences } from "@/components/trico/preferences-provider";
import { buttonVariants } from "@/components/ui/button";
import { NOTIFICATION_OPTIONS, toggleSector } from "@/lib/preferences";
import type { NotificationPref, SectorId } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const { prefs, setPrefs } = usePreferences();
  const [step, setStep] = useState<1 | 2>(1);
  const [sectors, setSectors] = useState<SectorId[]>(
    prefs.sectors.length ? prefs.sectors : ["economia", "tecnologia"],
  );
  const [notifications, setNotifications] = useState<NotificationPref>(
    prefs.notifications,
  );

  function finish(skip = false) {
    setPrefs({
      ...prefs,
      sectors: skip && sectors.length === 0 ? ["economia"] : sectors,
      notifications,
      onboarded: true,
    });
    router.push("/feed");
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-xl flex-col px-4 py-8 sm:px-6">
      <div className="mb-8 flex justify-center">
        <Logo withTagline href="/" />
      </div>

      <div className="mb-6 flex items-center justify-center gap-2" aria-hidden>
        {[1, 2].map((n) => (
          <span
            key={n}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              step === n ? "w-6 bg-terracotta" : "bg-navy/20",
            )}
          />
        ))}
      </div>

      {step === 1 ? (
        <div className="reveal space-y-6">
          <div className="text-center">
            <h1 className="font-display text-3xl font-semibold text-navy">
              Escolhe os teus temas
            </h1>
            <p className="mt-2 text-navy/65">
              Mínimo um sector. Podes ajustar depois no perfil.
            </p>
          </div>
          <SectorPicker
            selected={sectors}
            onToggle={(id) => setSectors((prev) => toggleSector(id, prev))}
          />
          <div className="space-y-3 pt-2">
            <button
              type="button"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 w-full bg-terracotta text-base text-white hover:bg-terracotta/90 disabled:opacity-50",
              )}
              disabled={sectors.length === 0}
              onClick={() => setStep(2)}
            >
              Continuar
            </button>
            <button
              type="button"
              className="w-full text-center text-sm font-medium text-navy underline-offset-4 hover:underline"
              onClick={() => finish(true)}
            >
              Pular
            </button>
          </div>
        </div>
      ) : (
        <div className="reveal space-y-6">
          <div className="text-center">
            <h1 className="font-display text-3xl font-semibold text-navy">
              Como queres ser avisado?
            </h1>
            <p className="mt-2 text-navy/65">
              Escolhe o ritmo das notificações — podes mudar quando quiseres.
            </p>
          </div>
          <div className="space-y-3">
            {NOTIFICATION_OPTIONS.map((opt) => {
              const active = notifications === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setNotifications(opt.id)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition",
                    active
                      ? "border-terracotta/50 bg-white shadow-[0_10px_30px_-18px_rgba(196,92,38,0.5)]"
                      : "border-navy/10 bg-white/50 hover:border-navy/20",
                  )}
                >
                  <p className="font-display text-lg font-semibold text-navy">
                    {opt.label}
                  </p>
                  <p className="mt-1 text-sm text-navy/60">{opt.description}</p>
                </button>
              );
            })}
          </div>
          <div className="space-y-3 pt-2">
            <button
              type="button"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 w-full bg-terracotta text-base text-white hover:bg-terracotta/90",
              )}
              onClick={() => finish()}
            >
              Ver o meu feed
            </button>
            <button
              type="button"
              className="w-full text-center text-sm font-medium text-navy/70"
              onClick={() => setStep(1)}
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      <p className="mt-auto pt-10 text-center text-xs text-navy/40">
        Sem conta real neste MVP — as preferências ficam neste dispositivo.{" "}
        <Link href="/feed" className="underline">
          Ir directo ao feed
        </Link>
      </p>
    </div>
  );
}
