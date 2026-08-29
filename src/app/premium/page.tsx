"use client";

/**
 * Página Premium — 2000 Kz/mês.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AppHeader } from "@/components/trico/app-header";
import { BottomNav } from "@/components/trico/bottom-nav";
import { SiteFooter } from "@/components/trico/site-footer";
import { SectionBar } from "@/components/trico/section-bar";
import { Button } from "@/components/ui/button";
import {
  FREE_SECTOR_LIMIT,
  PLAN_FEATURES,
  PREMIUM_PRICE_KZ,
} from "@/lib/modules/billing/plans";

type BillingState = {
  plan: string;
  premiumUntil?: string | null;
  payments: { id: string; status: string; reference: string | null; amountKz: number; createdAt: string }[];
  instructions?: { amount: string; methods: string[]; note: string };
};

export default function PremiumPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<BillingState | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    if (status !== "authenticated") return;
    const res = await fetch("/api/billing");
    if (res.ok) setData(await res.json());
  }

  useEffect(() => {
    void load();
  }, [status]);

  async function requestPremium() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "request", method: "manual" }),
      });
      const json = await res.json();
      setMessage(json.message || (res.ok ? "Pedido enviado." : json.error));
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col pb-20 md:pb-0">
      <AppHeader solid />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <SectionBar title="Planos" />
        <h1 className="mt-2 text-3xl font-bold text-navy">Tricô Premium</h1>
        <p className="mt-2 text-muted-foreground">
          Notícias do teu sector, sem limites — a partir de{" "}
          <strong>{PREMIUM_PRICE_KZ.toLocaleString("pt-PT")} Kz</strong>/mês.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="border border-line p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Gratuito
            </p>
            <p className="mt-1 text-2xl font-bold text-navy">0 Kz</p>
            <ul className="mt-4 space-y-2 text-sm text-navy/80">
              {PLAN_FEATURES.gratuito.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          </div>
          <div className="border-2 border-navy bg-secondary/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-terracotta">
              Premium
            </p>
            <p className="mt-1 text-2xl font-bold text-navy">
              {PREMIUM_PRICE_KZ.toLocaleString("pt-PT")} Kz
              <span className="text-sm font-medium text-muted-foreground"> / mês</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-navy/80">
              {PLAN_FEATURES.premium.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>

            {status === "unauthenticated" ? (
              <Link href="/entrar">
                <Button className="mt-6 w-full bg-navy text-white hover:bg-navy/90">
                  Entrar para subscrever
                </Button>
              </Link>
            ) : data?.plan === "premium" ? (
              <p className="mt-6 border border-navy/20 bg-white px-3 py-2 text-sm font-semibold text-navy">
                Já és Premium
                {data.premiumUntil
                  ? ` até ${new Date(data.premiumUntil).toLocaleDateString("pt-PT")}`
                  : ""}
                .
              </p>
            ) : (
              <Button
                className="mt-6 w-full bg-terracotta text-white hover:bg-terracotta/90"
                disabled={busy}
                onClick={() => void requestPremium()}
              >
                {busy ? "A processar…" : `Pedir Premium · ${PREMIUM_PRICE_KZ} Kz`}
              </Button>
            )}
          </div>
        </div>

        {message ? (
          <p className="mt-4 border border-line bg-white px-4 py-3 text-sm text-navy">
            {message}
          </p>
        ) : null}

        <section className="mt-10 border border-line p-5 text-sm text-navy/80">
          <h2 className="font-bold text-navy">Como pagar</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>Cria o pedido Premium (botão acima) — gera uma referência.</li>
            <li>
              Transfere <strong>{PREMIUM_PRICE_KZ} Kz</strong> (IBAN / Multicaixa —
              dados que o admin indicar).
            </li>
            <li>O administrador confirma no painel Admin e o plano activa-se.</li>
          </ol>
          <p className="mt-3 text-muted-foreground">
            No plano gratuito podes seguir até {FREE_SECTOR_LIMIT} sectores. Premium
            remove o limite e desbloqueia o Resumo do Ano.
          </p>
          {data?.payments?.length ? (
            <div className="mt-4">
              <p className="font-bold text-navy">Os teus pedidos</p>
              <ul className="mt-2 divide-y divide-line border border-line">
                {data.payments.map((p) => (
                  <li key={p.id} className="flex justify-between gap-3 px-3 py-2 text-xs">
                    <span>
                      {p.reference} · {p.amountKz} Kz
                    </span>
                    <span className="font-semibold uppercase">{p.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
