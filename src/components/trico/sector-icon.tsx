import {
  Activity,
  Cpu,
  HeartPulse,
  Landmark,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { SectorId } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<SectorId, LucideIcon> = {
  economia: Activity,
  politica: Landmark,
  tecnologia: Cpu,
  energia: Zap,
  saude: HeartPulse,
};

export function SectorIcon({
  id,
  className,
}: {
  id: SectorId;
  className?: string;
}) {
  const Icon = ICONS[id];
  return <Icon className={cn("h-5 w-5", className)} strokeWidth={1.75} />;
}
