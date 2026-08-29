import Link from "next/link";
import { Logo, LogoMark } from "@/components/trico/logo";
import { SectionBar } from "@/components/trico/section-bar";
import { SECTORS } from "@/lib/sectors";

const LINKEDIN =
  process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() ||
  "https://www.linkedin.com/";
const INSTAGRAM =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() ||
  "https://www.instagram.com/";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

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
              <LinkedInIcon className="size-4" />
            </a>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Tricô"
              className="inline-flex size-9 items-center justify-center border border-line text-navy transition hover:border-navy hover:bg-navy hover:text-white"
            >
              <InstagramIcon className="size-4" />
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
