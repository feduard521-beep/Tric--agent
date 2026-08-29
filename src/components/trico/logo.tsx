import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      {/* yarn ball */}
      <circle cx="26" cy="32" r="18" fill="none" stroke="currentColor" strokeWidth="3.2" className="text-terracotta" />
      <path
        d="M12 28c6 2 12-2 18 1M11 34c7 3 14-1 20 2M14 22c5 4 11 1 17 4M16 42c6-1 12 2 18-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="text-terracotta"
      />
      <path
        d="M10 44c-3 4-5 8-4 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="text-terracotta"
      />
      {/* network mesh */}
      <g className="text-navy" stroke="currentColor" strokeWidth="2.2" fill="currentColor">
        <circle cx="44" cy="22" r="3.2" />
        <circle cx="54" cy="30" r="3.2" />
        <circle cx="46" cy="40" r="3.2" />
        <circle cx="36" cy="28" r="3.2" />
        <path d="M44 22L54 30L46 40L36 28Z" fill="none" />
        <path d="M44 22L36 28L54 30" fill="none" />
      </g>
    </svg>
  );
}

export function Logo({
  href = "/",
  withTagline = false,
  className,
}: {
  href?: string;
  withTagline?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-10 w-10 transition-transform duration-500 group-hover:rotate-6" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-semibold tracking-tight text-navy">
          Tricô
        </span>
        {withTagline ? (
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-navy/55">
            Notícias tecidas
          </span>
        ) : null}
      </span>
    </Link>
  );
}
