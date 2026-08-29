"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { AppHeader } from "@/components/trico/app-header";
import { BottomNav } from "@/components/trico/bottom-nav";
import { SectorPicker } from "@/components/trico/sector-picker";
import { usePreferences } from "@/components/trico/preferences-provider";
import { displayNameFromUser } from "@/components/trico/user-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { NOTIFICATION_OPTIONS, toggleSector } from "@/lib/preferences";
import type { NotificationPref, SectorId } from "@/lib/types";
import { clampSectorsForPlan, FREE_SECTOR_LIMIT } from "@/lib/modules/billing/plans";
import { cn } from "@/lib/utils";

export default function PerfilPage() {
  const { prefs, setPrefs } = usePreferences();
  const { data: session, update: updateSession, status } = useSession();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name?.trim() || displayNameFromUser(session.user));
    }
  }, [session?.user]);

  function setSectors(next: SectorId[]) {
    const clamped = clampSectorsForPlan(next, prefs.plan);
    setPrefs({ ...prefs, sectors: clamped });
  }

  function setNotifications(id: NotificationPref) {
    setPrefs({ ...prefs, notifications: id });
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/me/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não foi possível guardar.");
        return;
      }
      setMessage(data.message || "Guardado.");
      // Actualiza o JWT/sessão para o header mostrar o novo nome
      await updateSession({ name: data.user?.name });
    } catch {
      setError("Erro de rede.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col pb-24 md:pb-10">
      <AppHeader solid />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
          Perfil
        </h1>
        <p className="mt-2 text-navy/65">
          Conta, sectores e notificações — o tear à tua medida.
        </p>

        <section className="mt-6 border border-line bg-white p-5">
          {status === "authenticated" && session?.user ? (
            <>
              <h2 className="text-xs font-bold uppercase tracking-wide text-terracotta">
                Conta
              </h2>
              <form className="mt-4 space-y-4" onSubmit={(e) => void saveProfile(e)}>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-navy">Nome</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    maxLength={80}
                    className="h-11 w-full border border-line px-3 text-navy outline-none focus:border-navy"
                    autoComplete="name"
                  />
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Aparece no canto superior direito do site.
                  </span>
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-navy">Email</span>
                  <input
                    value={session.user.email || ""}
                    readOnly
                    className="h-11 w-full border border-line bg-secondary/40 px-3 text-navy/70"
                  />
                  <span className="mt-1 block text-xs text-muted-foreground">
                    O email não se altera aqui (é o identificador da conta).
                  </span>
                </label>
                {error ? (
                  <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                ) : null}
                {message ? (
                  <p className="border border-navy/15 bg-secondary px-3 py-2 text-sm text-navy">
                    {message}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-navy text-white hover:bg-navy/90"
                  >
                    {saving ? "A guardar…" : "Guardar nome"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Terminar sessão
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-navy/70">
                Entra na conta para editar o nome e sincronizar preferências.
              </p>
              <Link
                href="/entrar"
                className={cn(buttonVariants(), "bg-navy text-white")}
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
                    "w-full border p-4 text-left transition",
                    active
                      ? "border-navy bg-secondary/40"
                      : "border-line bg-white hover:border-navy/30",
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
              ? "Sectores ilimitados, sem publicidade e Resumo do Ano."
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
