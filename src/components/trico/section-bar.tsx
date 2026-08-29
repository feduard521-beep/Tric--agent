import Link from "next/link";
import { cn } from "@/lib/utils";

/** Barra de secção estilo portal (corte angular). */
export function SectionBar({
  title,
  href,
  className,
}: {
  title: string;
  href?: string;
  className?: string;
}) {
  const label = (
    <span className={cn("section-bar", className)}>{title}</span>
  );
  return (
    <div className="section-rule">
      {href ? (
        <Link href={href} className="hover:opacity-90">
          {label}
        </Link>
      ) : (
        label
      )}
    </div>
  );
}
