"use client";

/**
 * Slot de publicidade de parceiros — rótulo "Publicidade" obrigatório.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { AdPlacement, AdPublic } from "@/lib/modules/ads/types";
import { ScrollReveal } from "@/components/trico/scroll-reveal";

const ACCENT: Record<string, string> = {
  navy: "from-navy to-navy-deep",
  terracotta: "from-terracotta to-[#8a4a24]",
  teal: "from-teal-700 to-teal-900",
  emerald: "from-emerald-700 to-emerald-950",
};

export function AdSlot({
  placement,
  sectorId,
  className,
  compact = false,
}: {
  placement: AdPlacement;
  sectorId?: string | null;
  className?: string;
  compact?: boolean;
}) {
  const [ad, setAd] = useState<AdPublic | null>(null);
  const [hidden, setHidden] = useState(false);
  const seen = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const params = new URLSearchParams({ placement });
      if (sectorId) params.set("sector", sectorId);
      try {
        const res = await fetch(`/api/ads?${params.toString()}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.premium) {
          setHidden(true);
          return;
        }
        setAd(data.ad || null);
      } catch {
        if (!cancelled) setAd(null);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [placement, sectorId]);

  useEffect(() => {
    if (!ad || seen.current) return;
    seen.current = true;
    void fetch(`/api/ads/${ad.id}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: "impression" }),
    });
  }, [ad]);

  if (hidden || !ad) return null;

  const gradient = ACCENT[ad.accent] || ACCENT.navy;

  async function onClick() {
    void fetch(`/api/ads/${ad!.id}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: "click" }),
    });
  }

  return (
    <ScrollReveal variant="up" duration={700} className={className}>
      <aside
        className={cn(
          "relative overflow-hidden border border-line",
          compact ? "p-3" : "p-4 sm:p-5",
        )}
        aria-label="Publicidade"
      >
        <div
          className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-[0.08]", gradient)}
          aria-hidden
        />
        <p className="relative text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Publicidade · {ad.partnerName}
        </p>
        <h3
          className={cn(
            "relative mt-1.5 font-bold leading-snug text-navy",
            compact ? "text-sm" : "text-base sm:text-lg",
          )}
        >
          {ad.headline}
        </h3>
        {!compact && ad.body ? (
          <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {ad.body}
          </p>
        ) : null}
        <a
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => void onClick()}
          className={cn(
            "relative mt-3 inline-flex h-9 items-center bg-navy px-3 text-xs font-bold uppercase tracking-wide text-white hover:bg-navy/90",
            ad.accent === "terracotta" && "bg-terracotta hover:bg-terracotta/90",
          )}
        >
          {ad.ctaLabel}
        </a>
      </aside>
    </ScrollReveal>
  );
}
