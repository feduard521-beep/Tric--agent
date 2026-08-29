"use client";

/**
 * Revelação ao scroll (estilo AOS / Aliva Saúde).
 * Variantes: up | down | left | right | zoom
 *
 * Aguarda um frame antes de activar a transição para o fade
 * inicial (acima da dobra) ser visível — não só o estado final.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "up" | "down" | "left" | "right" | "zoom";

export function ScrollReveal({
  children,
  variant = "up",
  delay = 0,
  duration = 800,
  className,
  once = true,
  threshold = 0.15,
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setReady(true);
      setVisible(true);
      return;
    }

    let io: IntersectionObserver | null = null;
    let cancelled = false;
    let raf2 = 0;

    // Dois frames: pinta o estado oculto, depois liga a transição + observer
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (cancelled) return;
        setReady(true);
        io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisible(true);
              if (once) io?.disconnect();
            } else if (!once) {
              setVisible(false);
            }
          },
          // offset ~120px (padrão AOS) — só anima quando entra bem no ecrã
          { threshold, rootMargin: "0px 0px -120px 0px" },
        );
        io.observe(el);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      io?.disconnect();
    };
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        "sr-base",
        `sr-${variant}`,
        ready && "sr-ready",
        visible && "sr-in",
        className,
      )}
      style={{
        transitionDuration: ready ? `${duration}ms` : undefined,
        transitionDelay: visible ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
}
