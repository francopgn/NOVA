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
import { getBookings } from "@/lib/api";
import { cn, formatPrice } from "@/lib/utils";
import type { Booking } from "@/lib/types";

const DAY_TABS = ["Hoy", "Mañana", "Viernes"];
const WEEK_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function CalendarPage() {
  const [bookings, setBookings] = React.useState<Booking[] | null>(null);
  const [activeDay, setActiveDay] = React.useState("Hoy");
  const [rescheduling, setRescheduling] = React.useState<string | null>(null);
  const [dismissedWarnings, setDismissedWarnings] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    getBookings().then(setBookings);
  }, []);

  function updateBooking(id: string, patch: Partial<Booking>) {
    setBookings((prev) => (prev ? prev.map((b) => (b.id === id ? { ...b, ...patch } : b)) : prev));
  }

  const dayBookings = (bookings ?? []).filter((b) => b.dateLabel === activeDay).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const bookingsByDay = WEEK_LABELS.map((label, i) => ({
    label,
    count: (bookings ?? []).filter((b) => (i === 0 ? b.dateLabel === "Hoy" : i === 1 ? b.dateLabel === "Mañana" : i === 4 ? b.dateLabel === "Viernes" : false)).length,
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
              {DAY_TABS.map((d) => (
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
                            <Button size="sm" variant="destructive" onClick={() => updateBooking(b.id, { status: "cancelada" })}>Cancelar</Button>
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
                        <Button size="sm" variant="ghost" onClick={() => setRescheduling(rescheduling === b.id ? null : b.id)}>
                          Reprogramar
                        </Button>
                      </div>

                      {rescheduling === b.id && (
                        <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Reprogramación rápida</p>
                          <div className="flex flex-wrap items-center gap-2">
                            {["+15 min", "+30 min", "+1 h", "+2 h"].map((label) => (
                              <Button key={label} size="sm" variant="outline" onClick={() => setRescheduling(null)}>
                                {label}
                              </Button>
                            ))}
                            <input type="time" defaultValue={b.startTime} className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm" />
                            <Button size="sm" onClick={() => setRescheduling(null)}>Confirmar horario</Button>
                          </div>
                          <p className="mt-2 text-[11px] text-muted-foreground">La propuesta expira automáticamente en 30 minutos si el cliente no responde.</p>
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
