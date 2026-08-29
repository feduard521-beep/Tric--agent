import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Marca SVG — novelo terracotta + malha navy (brand Tricô). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 64"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      {/* yarn ball */}
      <g
        fill="none"
        stroke="#a65e2e"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="28" cy="32" rx="20" ry="19" />
        <path d="M14 24c8 4 16-1 24 3M12 32c9 5 18 0 26 4M15 40c8 2 15 4 23-1" />
        <path d="M18 18c6 5 14 3 20 7M20 46c7-1 14 2 20-2" />
        <path d="M10 46c-3 5-5 9-3 12" />
      </g>
      {/* network mesh */}
      <g stroke="#002147" strokeWidth="2.2" fill="#002147">
        <circle cx="42" cy="18" r="3" />
        <circle cx="56" cy="22" r="3" />
        <circle cx="62" cy="34" r="3" />
        <circle cx="52" cy="44" r="3" />
        <circle cx="38" cy="36" r="3" />
        <path
          d="M42 18L56 22L62 34L52 44L38 36Z"
          fill="none"
          strokeLinejoin="round"
        />
        <path d="M42 18L38 36M56 22L52 44M56 22L38 36" fill="none" />
      </g>
    </svg>
  );
}

export function Logo({
  href = "/",
  withTagline = false,
  className,
  size = "md",
}: {
  href?: string;
  withTagline?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const mark = size === "lg" ? "h-14 w-16" : size === "sm" ? "h-8 w-9" : "h-10 w-11";
  const title =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-xl" : "text-2xl";

  return (
    <Link href={href} className={cn("group inline-flex items-center gap-3", className)}>
      <span className="relative">
        <LogoMark className={cn(mark, "transition-transform duration-500 group-hover:rotate-3")} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-brand text-navy", title)}>Tricô</span>
        {withTagline ? (
          <span className="mt-1.5 max-w-[11rem] text-[9px] font-semibold uppercase leading-tight tracking-[0.14em] text-navy/70 sm:max-w-none sm:tracking-[0.16em]">
            Plataforma de agregador de notícias
          </span>
        ) : null}
      </span>
    </Link>
  );
}

/** Logo com imagem oficial (quando quiseres foto em vez de SVG). */
export function LogoPhoto({ className }: { className?: string }) {
  return (
    <Image
      src="/brand-logo.jpg"
      alt="Tricô"
      width={280}
      height={120}
      className={cn("h-auto w-[160px] object-contain", className)}
      priority
    />
  );
}
