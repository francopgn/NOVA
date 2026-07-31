"use client";
import * as React from "react";
import Link from "next/link";
import { DollarSign, Eye, TrendingUp, Heart, ChevronRight, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { DashboardNav } from "@/components/organisms/dashboard-nav";
import { AvailabilityToggle } from "@/components/organisms/availability-toggle";
import { RevenueChart } from "@/components/organisms/revenue-chart";
import { RankingExplainer } from "@/components/organisms/ranking-explainer";
import { StatCard } from "@/components/molecules/stat-card";
import { BookingRow } from "@/components/molecules/booking-row";
import { SolicitudCard } from "@/components/organisms/solicitud-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getBookings, getCurrentProfessional } from "@/lib/api";
import { formatAmount } from "@/lib/utils";
import { mergeProviderProfile } from "@/lib/provider-profile";
import { useProviderProfile } from "@/hooks/use-provider-profile";
import type { Booking, Professional } from "@/lib/types";

export default function ProfessionalDashboardPage() {
  const [seed, setSeed] = React.useState<Professional | null>(null);
  const [bookings, setBookings] = React.useState<Booking[] | null>(null);
  const { profile, onboarded, hydrated } = useProviderProfile();

  React.useEffect(() => {
    getCurrentProfessional().then(setSeed);
    getBookings().then(setBookings);
  }, []);

  function updateBooking(id: string, patch: Partial<Booking>) {
    setBookings((prev) => (prev ? prev.map((b) => (b.id === id ? { ...b, ...patch } : b)) : prev));
  }

  const professional = seed ? mergeProviderProfile(seed, profile) : null;
  const today = bookings?.filter((b) => b.dateLabel === "Hoy") ?? [];
  const pending = bookings?.filter((b) => b.status === "pendiente") ?? [];

  if (!professional) {
    return (
      <SiteShell>
        <div className="container py-8">
          <Skeleton className="h-10 w-64 rounded-full" />
          <Skeleton className="mt-6 h-40 w-full rounded-3xl" />
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="container py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Panel profesional</h1>
            <p className="text-sm text-muted-foreground">Hola, {professional.name.split(" ")[0]} — así viene tu semana.</p>
          </div>
          {hydrated && onboarded && (
            <Link href="/panel/alta">
              <Button variant="outline" size="sm">Editar perfil</Button>
            </Link>
          )}
        </div>

        <DashboardNav />

        {hydrated && !onboarded && (
          <Link
            href="/panel/alta"
            className="mb-6 flex items-center gap-4 rounded-2xl border border-primary/30 bg-primary/[0.06] p-4 transition-colors hover:bg-primary/[0.1]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
              <Sparkles size={17} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">Todavía no completaste tu perfil público</p>
              <p className="text-xs text-muted-foreground">Sumá tu foto, categoría y tarifas para que los clientes te encuentren.</p>
            </div>
            <Button size="sm">Completar ahora</Button>
          </Link>
        )}

        <div className="mb-8">
          <AvailabilityToggle initialAvailable={professional.status === "disponible"} />
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Ingresos del mes" value={`AR$ ${formatAmount(334000)}`} icon={DollarSign} trend={{ value: "15% vs. mes anterior", positive: true }} />
          <StatCard label="Visitas al perfil" value="1.284" icon={Eye} trend={{ value: "8%", positive: true }} hint="últimos 30 días" />
          <StatCard label="Tasa de conversión" value="18,4%" icon={TrendingUp} trend={{ value: "2,1%", positive: true }} hint="visitas → reservas" />
          <StatCard label="Favoritos" value="212" icon={Heart} hint="clientes que te siguen" />
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Ingresos mensuales</h3>
              <span className="text-xs text-muted-foreground">Últimos 6 meses</span>
            </div>
            <RevenueChart />
          </div>
          <RankingExplainer professional={professional} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Agenda de hoy</h3>
              <Link href="/panel/calendario" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                Ver calendario <ChevronRight size={13} />
              </Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {!bookings ? (
                <Skeleton className="h-20 w-full" />
              ) : today.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Sin sesiones agendadas para hoy.</p>
              ) : (
                today.map((b) => <BookingRow key={b.id} booking={b} avatarUrl={b.clientAvatar} name={b.clientName} subtitle={b.sessionType} />)
              )}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Solicitudes pendientes</h3>
              <span className="text-xs text-muted-foreground">{pending.length} por responder</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {!bookings ? (
                <Skeleton className="h-20 w-full" />
              ) : pending.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No tenés solicitudes pendientes.</p>
              ) : (
                pending.map((b) => (
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
        </div>
      </div>
    </SiteShell>
  );
}
