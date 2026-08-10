"use client";
import * as React from "react";
import { CheckCheck, Inbox } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { NotificationItem } from "@/components/molecules/notification-item";
import { SolicitudCard } from "@/components/organisms/solicitud-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { mapApiBooking, labelToISO } from "@/lib/booking-adapters";
import { mapApiNotification } from "@/lib/notification-adapters";
import type { AppNotification, Booking } from "@/lib/types";

// Fase B3 — antes esta pantalla leía de getNotifications()/getBookings()
// (mock-data.ts). Ahora habla con /api/notifications y /api/bookings
// reales, con los mismos adaptadores que ya usa /panel para no tener que
// tocar NotificationItem ni SolicitudCard.
export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<AppNotification[] | null>(null);
  const [bookings, setBookings] = React.useState<Booking[] | null>(null);

  function refetchAll() {
    fetch("/api/notifications")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setNotifications(data.map(mapApiNotification)))
      .catch(() => setNotifications([]));
    fetch("/api/bookings?as=profesional")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setBookings(data.map(mapApiBooking)))
      .catch(() => setBookings([]));
  }

  React.useEffect(refetchAll, []);

  async function handleAccept(id: string) {
    await fetch(`/api/bookings/${id}/accept`, { method: "POST" });
    refetchAll();
  }
  async function handleReject(id: string) {
    await fetch(`/api/bookings/${id}/reject`, { method: "POST" });
    refetchAll();
  }
  async function handlePropose(id: string, dateLabel: string, time: string) {
    await fetch(`/api/bookings/${id}/propose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposedDate: labelToISO(dateLabel), proposedStartTime: time }),
    });
    refetchAll();
  }
  async function markAllRead() {
    setNotifications((prev) => prev?.map((n) => ({ ...n, read: true })) ?? prev);
    await fetch("/api/notifications/read-all", { method: "POST" });
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
          <Button variant="outline" size="sm" className="gap-1.5" onClick={markAllRead}>
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
                  onAccept={() => handleAccept(b.id)}
                  onReject={() => handleReject(b.id)}
                  onPropose={(dateLabel, startTime) => handlePropose(b.id, dateLabel, startTime)}
                />
              ))
            )}
          </div>
        </section>

        <Separator className="mb-6" />

        <div className="flex flex-col gap-2.5">
          {!notifications
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
            : notifications.length === 0
            ? <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Sin notificaciones todavía.</p>
            : notifications.map((n) => <NotificationItem key={n.id} notification={n} />)}
        </div>
      </div>
    </SiteShell>
  );
}
