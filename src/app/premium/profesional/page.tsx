"use client";
import * as React from "react";
import { Crown, Eye, Sparkles, BadgeCheck, BarChart3, Palette, Check } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { PremiumBenefitCard } from "@/components/molecules/premium-benefit-card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

const BENEFITS = [
  { icon: Eye, title: "Mayor visibilidad", description: "Aparecés más arriba en categorías y búsquedas relevantes." },
  { icon: Sparkles, title: "Historias destacadas", description: "Tus historias se muestran primero en la barra de la semana." },
  { icon: BadgeCheck, title: "Perfil destacado", description: "Insignia Premium visible en tu perfil y en resultados." },
  { icon: BarChart3, title: "Estadísticas avanzadas", description: "Métricas detalladas de visitas, conversión y audiencia." },
  { icon: Palette, title: "Personalización de perfil", description: "Colores de acento y portada personalizada." },
];

export default function ProfessionalPremiumPage() {
  const [subscribed, setSubscribed] = React.useState(false);

  return (
    <SiteShell>
      <div className="container max-w-4xl py-12">
        <div className="mb-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Crown size={26} />
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Sessio Premium para profesionales</h1>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">Más visibilidad y herramientas para hacer crecer tu agenda de sesiones.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <PremiumBenefitCard key={b.title} {...b} />
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-sm rounded-3xl border border-primary/30 bg-primary/[0.06] p-7 text-center">
          <p className="text-sm text-muted-foreground">Plan mensual profesional</p>
          <p className="mt-1 text-4xl font-semibold tabular-nums">{formatPrice(14900)}</p>
          <p className="text-sm text-muted-foreground">por mes, cancelás cuando quieras</p>
          <Button size="lg" className="mt-5 w-full gap-1.5" onClick={() => setSubscribed(true)} disabled={subscribed}>
            {subscribed ? <><Check size={16} /> ¡Ya sos Premium!</> : "Suscribirme"}
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
