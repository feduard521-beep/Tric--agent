"use client";

/**
 * Formulário de entrada / registo (Credentials + OAuth opcional).
 * Teste: criar conta demo@trico.ao / trico1234 e autenticar.
 */
import { useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/trico/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mode = "entrar" | "registar";

export function AuthForm({
  googleEnabled,
  appleEnabled,
}: {
  googleEnabled: boolean;
  appleEnabled: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("entrar");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const title = useMemo(
    () => (mode === "entrar" ? "Entrar na Tricô" : "Criar conta"),
    [mode],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "registar") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password, name: name || undefined }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Falha no registo.");
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Email ou palavra-passe incorrectos.");
        return;
      }
      router.push("/onboarding");
      router.refresh();
    } catch {
      setError("Erro de rede. Tenta de novo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-4 py-10 sm:px-6">
      <div className="mb-8 flex justify-center">
        <Logo withTagline href="/" />
      </div>
      <h1 className="text-center font-display text-3xl font-semibold text-navy">
        {title}
      </h1>
      <p className="mt-2 text-center text-sm text-navy/65">
        Email sempre disponível. Google/Apple activam-se com variáveis de ambiente.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {mode === "registar" ? (
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">Nome</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-lg border border-navy/15 bg-white/70 px-3"
              autoComplete="name"
            />
          </label>
        ) : null}
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-navy">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-lg border border-navy/15 bg-white/70 px-3"
            autoComplete="email"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-navy">Palavra-passe</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-lg border border-navy/15 bg-white/70 px-3"
            autoComplete={mode === "entrar" ? "current-password" : "new-password"}
          />
        </label>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 w-full bg-terracotta text-white hover:bg-terracotta/90",
          )}
        >
          {loading ? "A processar…" : mode === "entrar" ? "Entrar" : "Registar"}
        </button>
      </form>

      <div className="mt-4 space-y-2">
        {googleEnabled ? (
          <button
            type="button"
            className={cn(buttonVariants({ variant: "outline" }), "h-11 w-full")}
            onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
          >
            Continuar com Google
          </button>
        ) : null}
        {appleEnabled ? (
          <button
            type="button"
            className={cn(buttonVariants({ variant: "outline" }), "h-11 w-full")}
            onClick={() => signIn("apple", { callbackUrl: "/onboarding" })}
          >
            Continuar com Apple
          </button>
        ) : null}
      </div>

      <button
        type="button"
        className="mt-6 text-center text-sm font-medium text-navy underline-offset-4 hover:underline"
        onClick={() => {
          setMode(mode === "entrar" ? "registar" : "entrar");
          setError(null);
        }}
      >
        {mode === "entrar" ? "Criar conta nova" : "Já tenho conta — entrar"}
      </button>

      <Link href="/feed" className="mt-4 text-center text-xs text-navy/45 underline">
        Continuar sem conta (modo local)
      </Link>
    </div>
  );
}
