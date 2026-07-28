"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, Crown, Settings } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfessionalCard } from "@/components/molecules/professional-card";
import { BookingRow } from "@/components/molecules/booking-row";
import { getBookings } from "@/lib/api";
import { PROFESSIONALS } from "@/lib/mock-data";
import { useFavorites } from "@/hooks/use-favorites";
import type { Booking } from "@/lib/types";

const CLIENT = {
  name: "Vos",
  avatarUrl: "https://i.pravatar.cc/200?img=68",
  memberSince: "Miembro desde marzo de 2025",
};

export default function ClientProfilePage() {
  const { favorites } = useFavorites();
  const [bookings, setBookings] = React.useState<Booking[] | null>(null);

  React.useEffect(() => {
    getBookings().then(setBookings);
  }, []);

  const favoriteProfessionals = PROFESSIONALS.filter((p) => favorites.has(p.id));
  const followedProfessionals = PROFESSIONALS.slice(0, 4);
  const upcoming = bookings?.filter((b) => ["pendiente", "confirmada", "reprogramada"].includes(b.status)) ?? [];
  const history = bookings?.filter((b) => ["completada", "cancelada", "rechazada"].includes(b.status)) ?? [];

  return (
    <SiteShell>
      <div className="container py-8">
        <div className="mb-8 flex flex-wrap items-center gap-5 rounded-3xl border border-border bg-card p-6">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
            <Image src={CLIENT.avatarUrl} alt={CLIENT.name} fill sizes="80px" className="object-cover" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{CLIENT.name}</h1>
            <p className="text-sm text-muted-foreground">{CLIENT.memberSince}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/notificaciones">
              <Button variant="outline" size="icon" aria-label="Notificaciones"><Bell size={16} /></Button>
            </Link>
            <Button variant="outline" size="icon" aria-label="Configuración"><Settings size={16} /></Button>
          </div>
        </div>

        <Link href="/premium" className="mb-8 flex items-center gap-4 rounded-3xl border border-primary/30 bg-primary/[0.06] p-5 transition-colors hover:bg-primary/[0.1]">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Crown size={20} />
          </span>
          <div className="flex-1">
            <p className="font-semibold">Sessio Premium</p>
            <p className="text-sm text-muted-foreground">Perfiles destacados, descuentos exclusivos y alertas de disponibilidad prioritarias.</p>
          </div>
          <Button size="sm">Ver beneficios</Button>
        </Link>

        <Tabs defaultValue="reservas">
          <TabsList>
            <TabsTrigger value="reservas">Reservas</TabsTrigger>
            <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
            <TabsTrigger value="siguiendo">Siguiendo</TabsTrigger>
          </TabsList>

          <TabsContent value="reservas">
            <div className="flex flex-col gap-3">
              {!bookings
                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
                : upcoming.length === 0
                ? <EmptyState message="Todavía no tenés reservas próximas." ctaHref="/buscar" ctaLabel="Buscar especialistas" />
                : upcoming.map((b) => {
                    const prof = PROFESSIONALS.find((p) => p.id === b.professionalId);
                    return prof ? <BookingRow key={b.id} booking={b} avatarUrl={prof.avatarUrl} name={prof.name} subtitle={prof.title} /> : null;
                  })}
            </div>
          </TabsContent>

          <TabsContent value="favoritos">
            {favoriteProfessionals.length === 0 ? (
              <EmptyState message="Todavía no marcaste especialistas como favoritos." ctaHref="/buscar" ctaLabel="Explorar especialistas" />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {favoriteProfessionals.map((p) => (
                  <ProfessionalCard key={p.id} professional={p} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="historial">
            <div className="flex flex-col gap-3">
              {!bookings
                ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
                : history.length === 0
                ? <EmptyState message="Todavía no tenés sesiones pasadas." />
                : history.map((b) => {
                    const prof = PROFESSIONALS.find((p) => p.id === b.professionalId);
                    return prof ? <BookingRow key={b.id} booking={b} avatarUrl={prof.avatarUrl} name={prof.name} subtitle={prof.title} /> : null;
                  })}
            </div>
          </TabsContent>

          <TabsContent value="siguiendo">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {followedProfessionals.map((p) => (
                <ProfessionalCard key={p.id} professional={p} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SiteShell>
  );
}

function EmptyState({ message, ctaHref, ctaLabel }: { message: string; ctaHref?: string; ctaLabel?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      {ctaHref && ctaLabel && (
        <Link href={ctaHref}>
          <Button size="sm" variant="outline">{ctaLabel}</Button>
        </Link>
      )}
    </div>
  );
}
