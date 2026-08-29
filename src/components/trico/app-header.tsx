"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/feed", label: "Início" },
  { href: "/sectores", label: "Notícias" },
  { href: "/pesquisar", label: "Artigos" },
  { href: "/perfil", label: "Perfil" },
];

export function AppHeader({ solid = false }: { solid?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [q, setQ] = useState("");
  const isAdmin = session?.user?.role === "admin";

  const links = isAdmin
    ? [...NAV, { href: "/admin", label: "Admin" }]
    : NAV;

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/pesquisar?q=${encodeURIComponent(term)}` : "/pesquisar");
  }

  return (
    <header className={cn("border-b border-line bg-white", solid && "sticky top-0 z-30")}>
      {/* Brand strip */}
      <div className="border-b border-line bg-navy text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-[11px] sm:px-6">
          <p className="truncate font-medium tracking-wide">
            As notícias do teu sector, tecidas para ti · Angola
          </p>
          <Link href="/entrar" className="shrink-0 font-semibold text-white/90 hover:text-white">
            {session?.user ? session.user.email : "Entrar / Registar"}
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
        <Logo href="/feed" size="sm" />
        <form
          onSubmit={onSearch}
          className="order-3 flex w-full flex-1 items-stretch sm:order-none sm:min-w-[220px] md:max-w-md"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquisar notícias…"
            className="h-10 w-full border border-line px-3 text-sm outline-none focus:border-navy"
          />
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center bg-navy px-3 text-white hover:bg-navy/90"
            aria-label="Pesquisar"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
        <Link
          href={session?.user ? "/perfil" : "/entrar"}
          className="ml-auto inline-flex size-9 items-center justify-center border border-line text-navy hover:bg-navy hover:text-white"
          aria-label="Conta"
        >
          <UserRound className="h-4 w-4" />
        </Link>
      </div>

      <nav className="border-t border-line bg-white" aria-label="Principal">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-2 sm:px-4">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "shrink-0 px-3 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors",
                  active
                    ? "border-b-2 border-terracotta text-navy"
                    : "text-navy/60 hover:text-navy",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <span className="ml-auto hidden shrink-0 px-3 py-2.5 text-xs text-muted-foreground md:inline">
            {new Date().toLocaleDateString("pt-PT", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </nav>
    </header>
  );
}
