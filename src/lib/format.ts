export function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `há ${days} d`;
  return date.toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatClock(iso: string) {
  return new Date(iso).toLocaleString("pt-AO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
