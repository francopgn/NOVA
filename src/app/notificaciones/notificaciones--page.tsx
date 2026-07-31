"use client";
import * as React from "react";
import { CheckCheck, Inbox } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { NotificationItem } from "@/components/molecules/notification-item";
import { SolicitudCard } from "@/components/organisms/solicitud-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { getBookings, getNotifications } from "@/lib/api";
import type { AppNotification, Booking } from "@/lib/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<AppNotification[] | null>(null);
  const [bookings, setBookings] = React.useState<Booking[] | null>(null);

  React.useEffect(() => {
    getNotifications().then(setNotifications);
    getBookings().then(setBookings);
  }, []);

  function updateBooking(id: string, patch: Partial<Booking>) {
    setBookings((prev) => (prev ? prev.map((b) => (b.id === id ? { ...b, ...patch } : b)) : prev));
  }

  const solicitudes = bookings?.filter((b) => b.status === "pendiente") ?? [];
  const unread = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <SiteShell>
      <div className="container max-w-2xl py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Notificaciones</h1>
            <p className="text-sm text-muted-foreground">{unread > 0 ? `${unread} sin leer` : "Estás al día"}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setNotifications((prev) => prev?.map((n) => ({ ...n, read: true })) ?? prev)}
          >
            <CheckCheck size={14} /> Marcar todas como leídas
          </Button>
        </div>

        {/* Solicitudes: siempre primero y agrupadas, con acciones inline */}
        <section className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Inbox size={15} className="text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Solicitudes{solicitudes.length > 0 ? ` (${solicitudes.length})` : ""}
            </h2>
          </div>
          <div className="flex flex-col gap-2.5">
            {!bookings ? (
              <Skeleton className="h-24 w-full" />
            ) : solicitudes.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
                No tenés solicitudes pendientes por responder.
              </p>
            ) : (
              solicitudes.map((b) => (
                <SolicitudCard
                  key={b.id}
                  booking={b}
                  onAccept={() => updateBooking(b.id, { status: "confirmada" })}
                  onReject={() => updateBooking(b.id, { status: "rechazada" })}
                  onPropose={(dateLabel, startTime) => updateBooking(b.id, { status: "reprogramada", dateLabel, startTime })}
                />
              ))
            )}
          </div>
        </section>

        <Separator className="mb-6" />

        <div className="flex flex-col gap-2.5">
          {!notifications
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
            : notifications.map((n) => <NotificationItem key={n.id} notification={n} />)}
        </div>
      </div>
    </SiteShell>
  );
}
