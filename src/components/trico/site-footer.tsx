import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import { Logo, LogoMark } from "@/components/trico/logo";
import { SectionBar } from "@/components/trico/section-bar";
import { SECTORS } from "@/lib/sectors";

const LINKEDIN =
  process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() ||
  "https://www.linkedin.com/";
const INSTAGRAM =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() ||
  "https://www.instagram.com/";

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div>
          <Logo size="sm" href="/" />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Agregador de notícias angolano: junta fontes, classifica por sector e
            resume o essencial — hora, dia, semana e ano.
          </p>

          {/* Exemplar da marca Tricô */}
          <div className="mt-5 flex items-center gap-3 border border-line bg-secondary/40 p-3">
            <LogoMark className="h-12 w-14" />
            <div>
              <p className="font-brand text-lg leading-none text-navy">Tricô</p>
              <p className="mt-1.5 text-[11px] font-semibold uppercase leading-snug tracking-[0.12em] text-navy/65">
                As notícias do teu sector,
                <br />
                tecidas para ti
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn da Tricô"
              className="inline-flex size-9 items-center justify-center border border-line text-navy transition hover:border-navy hover:bg-navy hover:text-white"
            >
              <Linkedin className="size-4" />
            </a>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Tricô"
              className="inline-flex size-9 items-center justify-center border border-line text-navy transition hover:border-navy hover:bg-navy hover:text-white"
            >
              <Instagram className="size-4" />
            </a>
          </div>
        </div>
        <div>
          <SectionBar title="Mais lidas" />
          <ul className="space-y-2 text-sm font-semibold text-navy">
            {SECTORS.slice(0, 4).map((s) => (
              <li key={s.id}>
                <Link href={`/sector/${s.id}`} className="hover:text-terracotta">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionBar title="Sectores" />
          <ul className="divide-y divide-line border border-line text-sm font-semibold text-navy">
            {SECTORS.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/feed?sector=${s.id}`}
                  className="block px-3 py-2 hover:bg-secondary hover:text-terracotta"
                >
                  {s.short}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionBar title="Comercial" />
          <ul className="space-y-2 text-sm font-semibold text-navy">
            <li>
              <Link href="/anunciar" className="hover:text-terracotta">
                Anunciar no Tricô
              </Link>
            </li>
            <li>
              <Link href="/premium" className="hover:text-terracotta">
                Premium · 2000 Kz
              </Link>
            </li>
            <li>
              <Link href="/feed" className="hover:text-terracotta">
                Ver feed
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-3 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Tricô · Plataforma de agregador de notícias
      </div>
    </footer>
  );
}
