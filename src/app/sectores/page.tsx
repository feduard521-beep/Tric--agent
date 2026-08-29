import { AppHeader } from "@/components/trico/app-header";
import { BottomNav } from "@/components/trico/bottom-nav";
import { SectorPicker } from "@/components/trico/sector-picker";
import { SECTORS } from "@/lib/sectors";

export default function SectoresPage() {
  return (
    <div className="flex min-h-full flex-col pb-24 md:pb-10">
      <AppHeader solid />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
          Sectores
        </h1>
        <p className="mt-2 text-navy/65">
          Cinco fios do MVP em Angola. Clica para abrir a vista do sector.
        </p>
        <div className="mt-8">
          <SectorPicker selected={SECTORS.map((s) => s.id)} mode="link" />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
