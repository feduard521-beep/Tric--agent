import Link from "next/link";
import { Logo } from "@/components/trico/logo";
import { SectionBar } from "@/components/trico/section-bar";
import { SECTORS } from "@/lib/sectors";

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <Logo size="sm" href="/" />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Agregador de notícias angolano: junta fontes, classifica por sector e
            resume o essencial — hora, dia, semana e ano.
          </p>
          <p className="mt-3 text-sm text-navy">
            <a href="mailto:feduard521@gmail.com" className="hover:text-terracotta">
              feduard521@gmail.com
            </a>
          </p>
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
      </div>
      <div className="border-t border-line py-3 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Tricô · Plataforma de agregador de notícias
      </div>
    </footer>
  );
}
