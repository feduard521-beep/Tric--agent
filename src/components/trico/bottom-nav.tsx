"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Search, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/feed", label: "Início", icon: Home },
  { href: "/sectores", label: "Sectores", icon: Layers },
  { href: "/pesquisar", label: "Pesquisar", icon: Search },
  { href: "/perfil", label: "Perfil", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white md:hidden"
      aria-label="Navegação principal"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-semibold transition-colors",
                  active ? "text-navy" : "text-muted-foreground hover:text-navy",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
