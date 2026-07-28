import { cn } from "@/lib/utils";
import type { AvailabilityStatus } from "@/lib/types";

const STATUS_COLOR: Record<AvailabilityStatus, string> = {
  disponible: "bg-status-available",
  ocupada: "bg-status-busy",
  desconectado: "bg-status-offline",
};

export function StatusDot({ status, size = "md", className }: { status: AvailabilityStatus; size?: "sm" | "md" | "lg"; className?: string }) {
  const dim = size === "sm" ? "h-2.5 w-2.5" : size === "lg" ? "h-4 w-4" : "h-3 w-3";
  return (
    <span className={cn("relative inline-flex", dim, className)}>
      {status === "disponible" && (
        <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75 animate-pulse-ring", STATUS_COLOR[status])} />
      )}
      <span className={cn("relative inline-flex rounded-full ring-2 ring-background", dim, STATUS_COLOR[status])} />
    </span>
  );
}

export function statusLabel(status: AvailabilityStatus, minutesAgo?: number, busyUntilLabel?: string, lastConnectionLabel?: string) {
  if (status === "disponible") return `Disponible para sesión inmediata · hace ${minutesAgo ?? 1} min`;
  if (status === "ocupada") return `Ocupada${busyUntilLabel ? ` · ${busyUntilLabel}` : ""}`;
  return `Desconectado · ${lastConnectionLabel ?? ""}`;
}

export function statusShortLabel(status: AvailabilityStatus) {
  if (status === "disponible") return "Disponible ahora";
  if (status === "ocupada") return "Ocupada";
  return "Desconectado";
}
