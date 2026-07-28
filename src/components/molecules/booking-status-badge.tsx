import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/types";

const META: Record<BookingStatus, { label: string; variant: "success" | "warning" | "muted" | "outline" | "default" }> = {
  pendiente: { label: "Pendiente", variant: "warning" },
  confirmada: { label: "Confirmada", variant: "success" },
  rechazada: { label: "Rechazada", variant: "outline" },
  reprogramada: { label: "Reprogramada", variant: "default" },
  completada: { label: "Completada", variant: "muted" },
  cancelada: { label: "Cancelada", variant: "outline" },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const m = META[status];
  return <Badge variant={m.variant}>{m.label}</Badge>;
}
