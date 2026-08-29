"use client";

/**
 * Painel lateral Preferences (mockup desktop).
 */
import Link from "next/link";
import { UserRound } from "lucide-react";
import { usePreferences } from "./preferences-provider";
import { SECTORS } from "@/lib/sectors";
import type { Piece } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PreferencesPanel({ pieces }: { pieces: Piece[] }) {
  const { prefs, setPrefs } = usePreferences();
  const primary = prefs.sectors[0] || "economia";

  return (
    <div className="sticky top-24 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_20px_50px_-36px_rgba(0,33,71,0.55)]">
      <div className="flex items-center gap-2 border-b border-navy/8 px-4 py-3">
        <UserRound className="h-4 w-4 text-navy/60" />
        <h2 className="text-sm font-bold text-navy">Preferences</h2>
      </div>

      <div className="space-y-4 p-4">
        <label className="block text-xs font-semibold uppercase tracking-wide text-navy/45">
          Sector em destaque
          <select
            className="mt-1.5 h-10 w-full rounded-lg border border-navy/15 bg-cream/60 px-3 text-sm font-medium text-navy"
            value={primary}
            onChange={(e) => {
              const id = e.target.value as (typeof SECTORS)[number]["id"];
              const rest = prefs.sectors.filter((s) => s !== id);
              setPrefs({ ...prefs, sectors: [id, ...rest] });
            }}
          >
            {SECTORS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.short}
              </option>
            ))}
          </select>
        </label>

        <ul className="divide-y divide-navy/8">
          {pieces.length === 0 ? (
            <li className="py-3 text-sm text-navy/45">Sem peças ainda.</li>
          ) : (
            pieces.map((p, i) => (
              <li key={p.id}>
                <Link
                  href={`/peca/${p.id}`}
                  className="flex items-start justify-between gap-2 py-3 text-sm text-navy hover:text-terracotta"
                >
                  <span className="line-clamp-2 font-medium leading-snug">
                    {p.title}
                  </span>
                  {i < 2 ? (
                    <span className="shrink-0 rounded bg-terracotta/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-terracotta">
                      New
                    </span>
                  ) : null}
                </Link>
              </li>
            ))
          )}
        </ul>

        <Link
          href="/perfil"
          className={cn(
            "flex h-11 w-full items-center justify-center rounded-xl bg-navy/5 text-sm font-semibold text-navy transition hover:bg-navy hover:text-cream",
          )}
        >
          Use preferences
        </Link>
      </div>
    </div>
  );
}
