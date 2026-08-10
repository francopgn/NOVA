import type { AppNotification, NotificationType } from "@/lib/types";

interface ApiNotification {
  id: string;
  type: string; // enum de Prisma, con guiones bajos (ej. "reserva_aceptada")
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
  professionalId?: string | null;
}

export function mapApiNotification(api: ApiNotification): AppNotification {
  return {
    id: api.id,
    type: api.type.replace(/_/g, "-") as NotificationType,
    title: api.title,
    message: api.message,
    minutesAgo: Math.max(1, Math.round((Date.now() - api.createdAt) / 60000)),
    read: api.read,
    professionalId: api.professionalId ?? undefined,
  };
}
