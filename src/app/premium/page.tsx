"use client";
import * as React from "react";
import { Crown, Star, Percent, BellRing, ListChecks, SlidersHorizontal, BellDot, Check } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { PremiumBenefitCard } from "@/components/molecules/premium-benefit-card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

const BENEFITS = [
  { icon: Star, title: "Perfiles destacados", description: "Accedé primero a los especialistas mejor valorados de cada categoría." },
  { icon: Percent, title: "Descuentos exclusivos", description: "Promociones especiales solo para miembros Premium." },
  { icon: BellRing, title: "Alertas de disponibilidad", description: "Te avisamos apenas tu especialista favorito esté disponible." },
  { icon: ListChecks, title: "Listas ilimitadas", description: "Guardá todos los favoritos que quieras, sin límites." },
  { icon: SlidersHorizontal, title: "Más filtros", description: "Filtros avanzados de búsqueda solo para Premium." },
  { icon: BellDot, title: "Notificaciones prioritarias", description: "Tus mensajes y reservas se procesan primero." },
];

export default function ClientPremiumPage() {
  const [subscribed, setSubscribed] = React.useState(false);

  return (
    <SiteShell>
      <div className="container max-w-4xl py-12">
        <div className="mb-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Crown size={26} />
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Sessio Premium</h1>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">Sacale el máximo provecho a la plataforma con beneficios pensados para quienes reservan seguido.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <PremiumBenefitCard key={b.title} {...b} />
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-sm rounded-3xl border border-primary/30 bg-primary/[0.06] p-7 text-center">
          <p className="text-sm text-muted-foreground">Plan mensual</p>
          <p className="mt-1 text-4xl font-semibold tabular-nums">{formatPrice(6900)}</p>
          <p className="text-sm text-muted-foreground">por mes, cancelás cuando quieras</p>
          <Button size="lg" className="mt-5 w-full gap-1.5" onClick={() => setSubscribed(true)} disabled={subscribed}>
            {subscribed ? <><Check size={16} /> ¡Ya sos Premium!</> : "Suscribirme"}
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
