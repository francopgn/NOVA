"use client";
import * as React from "react";
import Image from "next/image";
import { AlertTriangle, Clock3 } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { DashboardNav } from "@/components/organisms/dashboard-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingStatusBadge } from "@/components/molecules/booking-status-badge";
import { mapApiBooking, labelToISO } from "@/lib/booking-adapters";
import { cn, formatPrice } from "@/lib/utils";
import type { Booking } from "@/lib/types";

const WEEK_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Fase B3 — antes leía de getBookings() (mock-data.ts) con solapamiento
// simulado a mano. Ahora habla con /api/bookings real; la detección de
// solapamiento queda como UI lista para cuando calculemos superposición de
// verdad del lado del servidor (no la calculamos todavía, así que el
// aviso rojo no va a aparecer con datos reales — no es un bug).
export default function CalendarPage() {
  const [bookings, setBookings] = React.useState<Booking[] | null>(null);
  const [activeDay, setActiveDay] = React.useState("Hoy");
  const [rescheduling, setRescheduling] = React.useState<string | null>(null);
  const [rescheduleDay, setRescheduleDay] = React.useState("Hoy");
  const [rescheduleTime, setRescheduleTime] = React.useState("");
  const [dismissedWarnings, setDismissedWarnings] = React.useState<Set<string>>(new Set());

  function refetch() {
    fetch("/api/bookings?as=profesional")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setBookings(data.map(mapApiBooking)))
      .catch(() => setBookings([]));
  }

  React.useEffect(refetch, []);

  async function handleCancel(id: string) {
    await fetch(`/api/bookings/${id}/cancel`, { method: "POST" });
    refetch();
  }

  async function submitReschedule(id: string) {
    if (!rescheduleTime) return;
    await fetch(`/api/bookings/${id}/propose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposedDate: labelToISO(rescheduleDay), proposedStartTime: rescheduleTime }),
    });
    setRescheduling(null);
    setRescheduleTime("");
    refetch();
  }

  const dayTabs = React.useMemo(() => {
    const labels = new Set(["Hoy", "Mañana"]);
    (bookings ?? []).forEach((b) => labels.add(b.dateLabel));
    return Array.from(labels);
  }, [bookings]);

  const dayBookings = (bookings ?? []).filter((b) => b.dateLabel === activeDay).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const bookingsByDay = WEEK_LABELS.map((label, i) => ({
    label,
    count: (bookings ?? []).filter((b) => (i === 0 ? b.dateLabel === "Hoy" : i === 1 ? b.dateLabel === "Mañana" : false)).length,
  }));

  return (
    <SiteShell>
      <div className="container py-8">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Calendario y gestión de turnos</h1>
        <DashboardNav />

        <Tabs defaultValue="diaria">
          <TabsList>
            <TabsTrigger value="mensual">Mensual</TabsTrigger>
            <TabsTrigger value="semanal">Semanal</TabsTrigger>
            <TabsTrigger value="diaria">Diaria</TabsTrigger>
          </TabsList>

          <TabsContent value="mensual">
            <div className="grid grid-cols-7 gap-2 rounded-3xl border border-border bg-card p-5">
              {Array.from({ length: 30 }).map((_, i) => {
                const hasBooking = [0, 1, 4, 7, 11, 15, 18, 22].includes(i);
                return (
                  <div key={i} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-border/60 text-xs">
                    <span className="text-muted-foreground">{i + 1}</span>
                    {hasBooking && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="semanal">
            <div className="grid grid-cols-7 gap-2">
              {bookingsByDay.map((d) => (
                <div key={d.label} className="rounded-2xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-medium text-muted-foreground">{d.label}</p>
                  <p className="mt-3 text-2xl font-semibold tabular-nums">{d.count}</p>
                  <p className="text-[11px] text-muted-foreground">{d.count === 1 ? "sesión" : "sesiones"}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="diaria">
            <div className="mb-4 flex gap-2">
              {dayTabs.map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  className={cn("rounded-full border px-4 py-2 text-sm font-medium", activeDay === d ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground")}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {!bookings ? (
                <Skeleton className="h-24 w-full" />
              ) : dayBookings.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Sin turnos para este día.</p>
              ) : (
                dayBookings.map((b) => {
                  const hasOverlap = !!b.overlapsWith && !dismissedWarnings.has(b.id);
                  const overlapPartner = b.overlapsWith ? dayBookings.find((x) => x.id === b.overlapsWith) : null;
                  return (
                    <div key={b.id} className="flex flex-col gap-3">
                      {hasOverlap && overlapPartner && (
                        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4">
                          <AlertTriangle size={18} className="shrink-0 text-destructive" />
                          <p className="flex-1 text-sm text-destructive">
                            Este turno se solapa con otro agendado ({overlapPartner.clientName}, {overlapPartner.startTime}).
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setDismissedWarnings((prev) => new Set(prev).add(b.id))}>
                              Aceptar igualmente
                            </Button>
                            <Button size="sm" onClick={() => setRescheduling(b.id)}>Reprogramar</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleCancel(b.id)}>Cancelar</Button>
                          </div>
                        </div>
                      )}

                      <div className={cn("flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-4", hasOverlap ? "border-destructive/40" : "border-border")}>
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                          <Image src={b.clientAvatar} alt={b.clientName} fill sizes="44px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{b.clientName}</p>
                          <p className="text-xs text-muted-foreground">{b.sessionType} · {b.mode}</p>
                        </div>
                        <span className="flex items-center gap-1 text-sm tabular-nums text-muted-foreground">
                          <Clock3 size={13} /> {b.startTime} · {b.duration} min
                        </span>
                        <p className="text-sm font-semibold tabular-nums">{formatPrice(b.totalPrice, b.currency)}</p>
                        <BookingStatusBadge status={b.status} />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setRescheduling(rescheduling === b.id ? null : b.id);
                            setRescheduleDay(b.dateLabel);
                            setRescheduleTime(b.startTime);
                          }}
                        >
                          Reprogramar
                        </Button>
                        {(b.status === "pendiente" || b.status === "confirmada") && (
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleCancel(b.id)}>
                            Cancelar
                          </Button>
                        )}
                      </div>

                      {rescheduling === b.id && (
                        <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Reprogramación rápida</p>
                          <div className="flex flex-wrap items-center gap-2">
                            {["Hoy", "Mañana", "Pasado mañana", "Esta semana"].map((label) => (
                              <button
                                key={label}
                                onClick={() => setRescheduleDay(label)}
                                className={cn(
                                  "rounded-full border px-3 py-1.5 text-xs font-medium",
                                  rescheduleDay === label ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground"
                                )}
                              >
                                {label}
                              </button>
                            ))}
                            <input
                              type="time"
                              value={rescheduleTime}
                              onChange={(e) => setRescheduleTime(e.target.value)}
                              className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm"
                            />
                            <Button size="sm" onClick={() => submitReschedule(b.id)}>Enviar propuesta</Button>
                          </div>
                          <p className="mt-2 text-[11px] text-muted-foreground">
                            Se crea una propuesta de horario — el cliente la tiene que aceptar para que quede confirmada.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SiteShell>
  );
}
