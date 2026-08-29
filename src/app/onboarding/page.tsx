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
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col bg-white px-4 py-8 sm:px-6">
      <div className="mb-8 flex justify-center border-b border-line pb-6">
        <Logo withTagline size="md" href="/" />
      </div>

      <div className="mb-6 flex items-center gap-2" aria-hidden>
        {[1, 2].map((n) => (
          <span
            key={n}
            className={cn(
              "h-1 flex-1",
              step >= n ? "bg-navy" : "bg-line",
            )}
          />
        ))}
      </div>

      {step === 1 ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">Escolha os seus temas</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Mínimo um sector. Pode alterar depois no perfil.
            </p>
          </div>
          <SectorPicker
            selected={sectors}
            onToggle={(id) => setSectors((prev) => toggleSector(id, prev))}
          />
          <div className="space-y-2 pt-2">
            <button
              type="button"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 w-full bg-navy text-base font-bold text-white hover:bg-navy/90 disabled:opacity-50",
              )}
              disabled={sectors.length === 0}
              onClick={() => setStep(2)}
            >
              Continuar
            </button>
            <button
              type="button"
              className="w-full py-2 text-center text-sm font-semibold text-navy underline"
              onClick={() => finish(true)}
            >
              Pular
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">Notificações</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Escolha como quer ser avisado.
            </p>
          </div>
          <div className="space-y-2">
            {NOTIFICATION_OPTIONS.map((opt) => {
              const active = notifications === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setNotifications(opt.id)}
                  className={cn(
                    "w-full border p-4 text-left transition",
                    active
                      ? "border-navy bg-secondary"
                      : "border-line hover:border-navy/40",
                  )}
                >
                  <p className="font-bold text-navy">{opt.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>
          <div className="space-y-2 pt-2">
            <button
              type="button"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 w-full bg-navy text-base font-bold text-white hover:bg-navy/90",
              )}
              onClick={() => finish()}
            >
              Ver o meu feed
            </button>
            <button
              type="button"
              className="w-full py-2 text-center text-sm font-semibold text-navy underline"
              onClick={() => setStep(1)}
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      <p className="mt-auto pt-10 text-center text-xs text-muted-foreground">
        <Link href="/feed" className="underline">
          Ir directo ao feed
        </Link>
      </p>
    </div>
  );
}
