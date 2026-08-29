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
  const [step, setStep] = useState<1 | 2 | 3>(1);
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
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col px-4 py-8 sm:px-6">
      <div className="mb-8 flex justify-center">
        <Logo withTagline size="lg" href="/" />
      </div>

      <div className="mb-6 flex items-center justify-center gap-2.5" aria-hidden>
        {[1, 2, 3].map((n) => (
          <span key={n} className="relative flex flex-col items-center">
            {step === n ? (
              <span className="absolute -top-4 text-[10px] font-bold text-terracotta">
                {n}
              </span>
            ) : null}
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all",
                step === n ? "scale-110 bg-terracotta" : "bg-sand",
              )}
            />
          </span>
        ))}
      </div>

      {step === 1 ? (
        <div className="reveal space-y-6">
          <h1 className="text-center text-2xl font-bold text-navy sm:text-[1.7rem]">
            Escolha Seus Temas
          </h1>
          <SectorPicker
            selected={sectors}
            onToggle={(id) => setSectors((prev) => toggleSector(id, prev))}
          />
          <div className="space-y-3 pt-2">
            <button
              type="button"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 w-full rounded-full bg-terracotta text-base font-semibold text-navy hover:bg-terracotta/90 disabled:opacity-50",
              )}
              disabled={sectors.length === 0}
              onClick={() => setStep(2)}
            >
              Continuar
            </button>
            <button
              type="button"
              className="w-full text-center text-sm font-semibold text-navy underline underline-offset-4"
              onClick={() => finish(true)}
            >
              Pular
            </button>
          </div>
        </div>
      ) : step === 2 ? (
        <div className="reveal space-y-6">
          <h1 className="text-center text-2xl font-bold text-navy">
            Como queres ser avisado?
          </h1>
          <div className="space-y-3">
            {NOTIFICATION_OPTIONS.map((opt) => {
              const active = notifications === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setNotifications(opt.id)}
                  className={cn(
                    "w-full rounded-2xl p-4 text-left transition",
                    active ? "bg-tan ring-2 ring-terracotta/35" : "bg-tan/70 hover:bg-tan",
                  )}
                >
                  <p className="text-lg font-bold text-navy">{opt.label}</p>
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
                "h-12 w-full rounded-full bg-terracotta text-base font-semibold text-navy hover:bg-terracotta/90",
              )}
              onClick={() => setStep(3)}
            >
              Continuar
            </button>
            <button
              type="button"
              className="w-full text-center text-sm font-semibold text-navy underline underline-offset-4"
              onClick={() => setStep(1)}
            >
              Voltar
            </button>
          </div>
        </div>
      ) : (
        <div className="reveal space-y-6 text-center">
          <h1 className="text-2xl font-bold text-navy">Tudo pronto</h1>
          <p className="text-navy/65">
            O teu fio está alinhado. Podes ajustar temas a qualquer momento no
            perfil.
          </p>
          <button
            type="button"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 w-full rounded-full bg-terracotta text-base font-semibold text-navy hover:bg-terracotta/90",
            )}
            onClick={() => finish()}
          >
            Ver o meu feed
          </button>
          <button
            type="button"
            className="w-full text-center text-sm font-semibold text-navy underline underline-offset-4"
            onClick={() => setStep(2)}
          >
            Voltar
          </button>
        </div>
      )}

      <p className="mt-auto pt-10 text-center text-xs text-navy/40">
        <Link href="/feed" className="underline">
          Ir directo ao feed
        </Link>
      </p>
    </div>
  );
}
