"use client";

/**
 * Menu da conta no header — mostra nome (não o email) e atalhos de perfil.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Settings2, Sparkles, UserRound } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export function displayNameFromUser(user?: {
  name?: string | null;
  email?: string | null;
} | null) {
  const name = user?.name?.trim();
  if (name) return name;
  const email = user?.email?.trim();
  if (!email) return "Conta";
  return email.split("@")[0] || "Conta";
}

export function UserMenu({ className }: { className?: string }) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (status === "loading") {
    return (
      <span className={cn("text-[11px] font-semibold text-white/50", className)}>
        …
      </span>
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/entrar"
        className={cn(
          "shrink-0 font-semibold text-white/90 hover:text-white",
          className,
        )}
      >
        Entrar / Registar
      </Link>
    );
  }

  const label = displayNameFromUser(session.user);
  const isAdmin = session.user.role === "admin";

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex max-w-[11rem] items-center gap-1 font-semibold text-white/90 hover:text-white sm:max-w-[14rem]"
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          className={cn("size-3.5 shrink-0 opacity-80 transition", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 border border-line bg-white py-1 text-navy shadow-lg"
        >
          <div className="border-b border-line px-3 py-2.5">
            <p className="truncate text-sm font-bold">{label}</p>
            <p className="truncate text-xs text-muted-foreground">
              {session.user.email}
            </p>
          </div>
          <Link
            href="/perfil"
            role="menuitem"
            className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary"
            onClick={() => setOpen(false)}
          >
            <Settings2 className="size-4 text-navy/50" />
            Perfil e preferências
          </Link>
          <Link
            href="/premium"
            role="menuitem"
            className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary"
            onClick={() => setOpen(false)}
          >
            <Sparkles className="size-4 text-navy/50" />
            Plano Premium
          </Link>
          {isAdmin ? (
            <Link
              href="/admin"
              role="menuitem"
              className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary"
              onClick={() => setOpen(false)}
            >
              <UserRound className="size-4 text-navy/50" />
              Administração
            </Link>
          ) : null}
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-red-700 hover:bg-red-50"
            onClick={() => {
              setOpen(false);
              void signOut({ callbackUrl: "/" });
            }}
          >
            <LogOut className="size-4" />
            Terminar sessão
          </button>
        </div>
      ) : null}
    </div>
  );
}
