"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/feed", label: "Todos" },
  { href: "/sectores", label: "Categorias" },
  { href: "/pesquisar", label: "Pesquisar" },
  { href: "/perfil", label: "Perfil" },
];

export function AppHeader({ solid = false }: { solid?: boolean }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const links = isAdmin
    ? [...NAV.slice(0, 3), { href: "/admin", label: "Admin" }, NAV[3]]
    : NAV;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-navy/8",
        solid ? "bg-cream/95 backdrop-blur-md" : "bg-cream/85 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo href="/feed" size="sm" />

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Principal"
        >
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/feed" && pathname.startsWith(link.href + "/")) ||
              (link.href === "/feed" && pathname.startsWith("/feed") && !pathname.includes("sector"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-semibold transition-colors",
                  active ? "text-navy" : "text-navy/55 hover:text-navy",
                )}
              >
                {link.label}
                {active ? (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-navy" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <Link
            href="/pesquisar"
            className="inline-flex size-9 items-center justify-center rounded-full text-navy/70 hover:bg-navy/5 hover:text-navy"
            aria-label="Pesquisar"
          >
            <Search className="h-5 w-5" strokeWidth={1.8} />
          </Link>
          <button
            type="button"
            className="relative inline-flex size-9 items-center justify-center rounded-full text-navy/70 hover:bg-navy/5 hover:text-navy"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" strokeWidth={1.8} />
            <span className="absolute right-1.5 top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white">
              1
            </span>
          </button>
          <Link
            href="/perfil"
            className="hidden size-9 items-center justify-center rounded-full text-navy/70 hover:bg-navy/5 hover:text-navy sm:inline-flex"
            aria-label="Definições"
          >
            <Settings className="h-5 w-5" strokeWidth={1.8} />
          </Link>
          <Link
            href={session?.user ? "/perfil" : "/entrar"}
            className="inline-flex size-9 items-center justify-center rounded-full border border-navy/15 bg-white text-navy hover:bg-navy hover:text-cream"
            aria-label="Conta"
          >
            <UserRound className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </header>
  );
}
