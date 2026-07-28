import { CalendarCheck, CalendarClock, CalendarX, Tag, Sparkle, UserCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/lib/types";

const ICONS: Record<NotificationType, React.ElementType> = {
  "reserva-aceptada": CalendarCheck,
  "reserva-rechazada": CalendarX,
  reprogramacion: CalendarClock,
  "nueva-propuesta": Clock,
  promocion: Tag,
  historia: Sparkle,
  disponible: UserCheck,
};

const COLORS: Record<NotificationType, string> = {
  "reserva-aceptada": "bg-status-available/15 text-status-available",
  "reserva-rechazada": "bg-destructive/15 text-destructive",
  reprogramacion: "bg-status-busy/15 text-status-busy",
  "nueva-propuesta": "bg-primary/15 text-primary",
  promocion: "bg-accent/15 text-accent",
  historia: "bg-accent/15 text-accent",
  disponible: "bg-status-available/15 text-status-available",
};

export function NotificationItem({ notification }: { notification: AppNotification }) {
  const Icon = ICONS[notification.type];
  return (
    <div className={cn("flex items-start gap-3 rounded-2xl border border-border p-4 transition-colors", !notification.read && "bg-white/[0.03]")}>
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", COLORS[notification.type])}>
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{notification.title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{notification.message}</p>
        <p className="mt-1 text-xs text-muted-foreground">hace {notification.minutesAgo} min</p>
      </div>
      {!notification.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
    </div>
  );
}
