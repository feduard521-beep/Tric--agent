"use client";

/**
 * Anunciar no Tricô — pacotes de publicidade por sector + formulário de parceiro.
 * Inspirado em portais (ex. Jornal de Angola), adaptado ao modelo sectorial.
 */
import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/trico/app-header";
import { BottomNav } from "@/components/trico/bottom-nav";
import { SiteFooter } from "@/components/trico/site-footer";
import { SectionBar } from "@/components/trico/section-bar";
import { ScrollReveal } from "@/components/trico/scroll-reveal";
import { AdSlot } from "@/components/trico/ad-slot";
import { Button } from "@/components/ui/button";
import {
  AD_PACKAGES,
  PARTNER_SECTORS,
  type AdPackage,
} from "@/lib/modules/ads/packages";
import { cn } from "@/lib/utils";

function formatKz(n: number) {
  return `${n.toLocaleString("pt-PT")} Kz`;
}

export default function AnunciarPage() {
  const [selected, setSelected] = useState<AdPackage>(
    AD_PACKAGES.find((p) => p.recommended) || AD_PACKAGES[0],
  );
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formDefaults = useMemo(
    () => ({
      company: "",
      contactName: "",
      email: "",
      phone: "",
      sectorId: "economia",
      message: "",
    }),
    [],
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setDone(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/partner-leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          company: String(fd.get("company") || ""),
          contactName: String(fd.get("contactName") || ""),
          email: String(fd.get("email") || ""),
          phone: String(fd.get("phone") || ""),
          packageId: selected.id,
          sectorId: String(fd.get("sectorId") || "todos"),
          message: String(fd.get("message") || ""),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Falha ao enviar.");
        return;
      }
      setDone(json.message || "Pedido enviado.");
      e.currentTarget.reset();
    } catch {
      setError("Sem ligação. Tenta outra vez.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col pb-20 md:pb-0">
      <AppHeader solid />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <ScrollReveal variant="down" duration={700}>
          <SectionBar title="Parceiros" />
          <h1 className="mt-2 font-display text-3xl font-semibold text-navy sm:text-4xl">
            Anunciar no Tricô
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Chega a profissionais e decisores por sector — Economia, Tecnologia,
            Energia, Saúde e Política — com publicidade clara e mensurável.
            Valores abaixo são tabela de partida; o contrato fecha-se com a
            nossa equipa.
          </p>
        </ScrollReveal>

        <ScrollReveal variant="up" duration={750} className="mt-6">
          <AdSlot placement="landing-mid" sectorId="economia" />
        </ScrollReveal>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {AD_PACKAGES.map((pkg, i) => (
            <ScrollReveal key={pkg.id} variant="up" delay={60 * i} duration={700}>
              <button
                type="button"
                onClick={() => setSelected(pkg)}
                className={cn(
                  "h-full w-full border p-5 text-left transition",
                  selected.id === pkg.id
                    ? "border-navy bg-secondary/50"
                    : "border-line bg-white hover:border-navy/40",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-terracotta">
                      {pkg.period === "mês" ? "Mensal" : "Semanal"}
                      {pkg.recommended ? " · recomendado" : ""}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-navy">{pkg.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{pkg.tagline}</p>
                  </div>
                  <p className="shrink-0 text-right">
                    <span className="block text-xs text-muted-foreground">desde</span>
                    <span className="text-lg font-bold text-navy">
                      {formatKz(pkg.priceFromKz)}
                    </span>
                  </p>
                </div>
                <ul className="mt-4 space-y-1.5 text-sm text-navy/80">
                  {pkg.highlights.map((h) => (
                    <li key={h}>· {h}</li>
                  ))}
                </ul>
              </button>
            </ScrollReveal>
          ))}
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal variant="right" duration={750}>
            <SectionBar title="Como funciona" />
            <ol className="mt-4 space-y-4 text-sm leading-relaxed text-navy/80">
              <li>
                <strong className="text-navy">1. Escolhe o pacote</strong> — topo do
                feed, destaque por sector, home ou campanha de 7 dias.
              </li>
              <li>
                <strong className="text-navy">2. Envia o pedido</strong> — empresa,
                contacto e sector-alvo. Em 1–2 dias úteis respondemos com slots
                livres.
              </li>
              <li>
                <strong className="text-navy">3. Criativo + activação</strong> —
                envias título, texto e link (ou arte). Nós publicamos com o
                rótulo «Publicidade».
              </li>
              <li>
                <strong className="text-navy">4. Relatório</strong> — impressões e
                cliques no período do contrato. Utilizadores Premium não vêem
                anúncios (público mais engajado no plano gratuito/visitantes).
              </li>
            </ol>
            <p className="mt-6 text-sm text-muted-foreground">
              Já és assinante?{" "}
              <Link href="/premium" className="font-semibold text-navy underline">
                Tricô Premium
              </Link>{" "}
              remove publicidade na leitura — a receita de parceiros financia o
              agregador para quem usa a versão gratuita.
            </p>
          </ScrollReveal>

          <ScrollReveal variant="left" duration={750}>
            <div className="border border-navy bg-white p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-terracotta">
                Pedido de parceiro
              </p>
              <h2 className="mt-1 text-xl font-bold text-navy">
                {selected.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Desde {formatKz(selected.priceFromKz)} / {selected.period}
              </p>

              <form className="mt-5 space-y-3" onSubmit={(e) => void onSubmit(e)}>
                <label className="block text-xs font-bold uppercase text-navy/60">
                  Empresa
                  <input
                    name="company"
                    required
                    defaultValue={formDefaults.company}
                    className="mt-1 h-10 w-full border border-line px-3 text-sm font-normal text-navy outline-none focus:border-navy"
                  />
                </label>
                <label className="block text-xs font-bold uppercase text-navy/60">
                  Nome do contacto
                  <input
                    name="contactName"
                    required
                    className="mt-1 h-10 w-full border border-line px-3 text-sm font-normal text-navy outline-none focus:border-navy"
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-xs font-bold uppercase text-navy/60">
                    Email
                    <input
                      name="email"
                      type="email"
                      required
                      className="mt-1 h-10 w-full border border-line px-3 text-sm font-normal text-navy outline-none focus:border-navy"
                    />
                  </label>
                  <label className="block text-xs font-bold uppercase text-navy/60">
                    Telefone / WhatsApp
                    <input
                      name="phone"
                      className="mt-1 h-10 w-full border border-line px-3 text-sm font-normal text-navy outline-none focus:border-navy"
                    />
                  </label>
                </div>
                <label className="block text-xs font-bold uppercase text-navy/60">
                  Sector-alvo
                  <select
                    name="sectorId"
                    defaultValue={formDefaults.sectorId}
                    className="mt-1 h-10 w-full border border-line bg-white px-3 text-sm font-normal text-navy outline-none focus:border-navy"
                  >
                    {PARTNER_SECTORS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-bold uppercase text-navy/60">
                  Mensagem (opcional)
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Datas da campanha, objectivo, link do criativo…"
                    className="mt-1 w-full border border-line px-3 py-2 text-sm font-normal text-navy outline-none focus:border-navy"
                  />
                </label>

                {error ? (
                  <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                ) : null}
                {done ? (
                  <p className="border border-navy/20 bg-secondary px-3 py-2 text-sm text-navy">
                    {done}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  disabled={busy}
                  className="h-11 w-full bg-navy text-white hover:bg-navy/90"
                >
                  {busy ? "A enviar…" : "Enviar pedido de publicidade"}
                </Button>
              </form>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
