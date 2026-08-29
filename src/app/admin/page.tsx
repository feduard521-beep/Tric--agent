"use client";

/**
 * Painel de administração Tricô.
 * Teste: login com email em ADMIN_EMAILS → /admin
 */
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/trico/app-header";
import { BottomNav } from "@/components/trico/bottom-nav";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  plan: string;
  createdAt: string;
  image: string | null;
};

type AdminPayload = {
  users: AdminUser[];
  stats: {
    pieces?: number;
    articles?: number;
    feeds?: number;
    userCount?: number;
    source?: string;
    lastIngest?: {
      id: string;
      status: string;
      startedAt: string;
      finishedAt?: string | null;
      fetchedCount?: number;
      createdPieces?: number;
    } | null;
  };
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AdminPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/admin");
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Sem acesso.");
      setData(null);
      return;
    }
    setData(json);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/entrar");
      return;
    }
    if (status === "authenticated") {
      void load();
    }
  }, [status, router, load]);

  async function runIngest() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "ingest" }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error || "Falha na ingestão.");
      } else {
        setMessage(
          `Ingestão: ${json.status} — ${json.fetchedCount ?? 0} artigos, ${json.createdPieces ?? 0} peças.`,
        );
        await load();
      }
    } finally {
      setBusy(false);
    }
  }

  async function setRole(userId: string, role: "admin" | "user") {
    setBusy(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "setRole", userId, role }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error || "Não foi possível alterar a role.");
      } else {
        setMessage(`${json.user.email} → ${json.user.role}`);
        await load();
      }
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading" || (status === "authenticated" && !data && !error)) {
    return (
      <div className="flex min-h-full flex-col pb-24">
        <AppHeader solid />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
          <p className="text-navy/60">A carregar painel…</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-full flex-col pb-24">
        <AppHeader solid />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
          <h1 className="font-display text-3xl font-semibold text-navy">Admin</h1>
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
          <Link href="/perfil" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
            Voltar ao perfil
          </Link>
        </main>
        <BottomNav />
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="flex min-h-full flex-col pb-24 md:pb-10">
      <AppHeader solid />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
              Admin
            </h1>
            <p className="mt-2 text-navy/65">
              Sessão: {session?.user?.email} · role {session?.user?.role || "—"}
            </p>
          </div>
          <Button
            onClick={() => void runIngest()}
            disabled={busy}
            className="bg-terracotta text-white hover:bg-terracotta/90"
          >
            {busy ? "A processar…" : "Correr ingestão RSS"}
          </Button>
        </div>

        {message ? (
          <p className="mt-4 rounded-lg border border-navy/10 bg-white/70 px-4 py-3 text-sm text-navy">
            {message}
          </p>
        ) : null}

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Peças", stats?.pieces ?? "—"],
            ["Artigos", stats?.articles ?? "—"],
            ["Feeds", stats?.feeds ?? "—"],
            ["Utilizadores", stats?.userCount ?? data?.users.length ?? "—"],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-navy/10 bg-white/55 px-4 py-4"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-navy/45">
                {label}
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-navy">
                {value}
              </p>
            </div>
          ))}
        </section>

        <p className="mt-3 text-xs text-navy/45">
          Fonte de conteúdo: {stats?.source || "—"}
          {stats?.lastIngest
            ? ` · última ingestão ${new Date(stats.lastIngest.startedAt).toLocaleString("pt-PT")} (${stats.lastIngest.status})`
            : " · ainda sem ingestão registada"}
        </p>

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-navy">
            Utilizadores
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-navy/10 bg-white/55">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-navy/10 text-navy/55">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Plano</th>
                  <th className="px-4 py-3 font-medium">Acções</th>
                </tr>
              </thead>
              <tbody>
                {(data?.users || []).map((u) => (
                  <tr key={u.id} className="border-b border-navy/5 last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-medium text-navy">{u.email}</div>
                      <div className="text-xs text-navy/45">{u.name || "—"}</div>
                    </td>
                    <td className="px-4 py-3 text-navy/80">{u.role}</td>
                    <td className="px-4 py-3 text-navy/80">{u.plan}</td>
                    <td className="px-4 py-3">
                      {u.role === "admin" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy || u.email === session?.user?.email}
                          onClick={() => void setRole(u.id, "user")}
                        >
                          Remover admin
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy}
                          onClick={() => void setRole(u.id, "admin")}
                        >
                          Tornar admin
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
