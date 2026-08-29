"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

const BASE_LINKS = [
  { href: "/feed", label: "Início" },
  { href: "/sectores", label: "Sectores" },
  { href: "/pesquisar", label: "Pesquisar" },
  { href: "/perfil", label: "Perfil" },
  { href: "/entrar", label: "Conta" },
];

export function AppHeader({ solid = false }: { solid?: boolean }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const links =
    session?.user?.role === "admin"
      ? [
          ...BASE_LINKS.slice(0, 4),
          { href: "/admin", label: "Admin" },
          BASE_LINKS[4],
        ]
      : BASE_LINKS;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-navy/8",
        solid ? "bg-cream/95 backdrop-blur-md" : "bg-cream/80 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo withTagline={false} href="/feed" />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-navy text-cream"
                    : "text-navy/70 hover:bg-navy/5 hover:text-navy",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/pesquisar"
          className="inline-flex size-9 items-center justify-center rounded-lg text-navy hover:bg-navy/5 md:hidden"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Pesquisar</span>
        </Link>
      </div>
    </header>
  );
}
