"use client";
import * as React from "react";
import { Plus, Zap, Clock, Sparkles, Layers } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { DashboardNav } from "@/components/organisms/dashboard-nav";
import { PromotionCard } from "@/components/molecules/promotion-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CURRENT_PROFESSIONAL } from "@/lib/mock-data";
import type { Promotion } from "@/lib/types";

const TEMPLATES: Array<Omit<Promotion, "id" | "professionalId" | "active">> = [
  { kind: "happy-hour", title: "Happy Hour", description: "Última hora del día con descuento especial.", discountLabel: "-20% después de las 18 h", expiresInHours: 24 },
  { kind: "tiempo-extra", title: "30 minutos extra gratis", description: "Reservá 60 minutos y sumá media hora sin cargo.", discountLabel: "+30 min sin costo", expiresInHours: 48 },
  { kind: "primera-consulta", title: "Descuento primera consulta", description: "Para quienes reservan por primera vez con vos.", discountLabel: "-25% primera sesión", expiresInHours: 72 },
  { kind: "combo", title: "2 horas al precio de 1,5", description: "Ideal para procesos que necesitan más tiempo.", discountLabel: "Combo 2h", expiresInHours: 96 },
];

const ICONS = { "happy-hour": Zap, "tiempo-extra": Clock, "primera-consulta": Sparkles, combo: Layers };

export default function PromotionsPage() {
  const [promotions, setPromotions] = React.useState<Promotion[]>(CURRENT_PROFESSIONAL.promotions);
  const [open, setOpen] = React.useState(false);

  function addPromotion(template: (typeof TEMPLATES)[number]) {
    setPromotions((prev) => [
      { ...template, id: `promo-${Date.now()}`, professionalId: CURRENT_PROFESSIONAL.id, active: true },
      ...prev,
    ]);
    setOpen(false);
  }

  return (
    <SiteShell>
      <div className="container py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Promociones</h1>
          <Button className="gap-1.5" onClick={() => setOpen(true)}>
            <Plus size={16} /> Nueva promoción
          </Button>
        </div>
        <DashboardNav />

        {promotions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-14 text-center text-sm text-muted-foreground">
            Todavía no creaste promociones. Las promociones activas aparecen destacadas en tu perfil.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.map((p) => (
              <PromotionCard key={p.id} promotion={p} />
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Elegí un tipo de promoción</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {TEMPLATES.map((t) => {
              const Icon = ICONS[t.kind];
              return (
                <button
                  key={t.kind}
                  onClick={() => addPromotion(t)}
                  className="flex flex-col items-start gap-2 rounded-2xl border border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon size={16} />
                  </span>
                  <p className="text-sm font-semibold">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </SiteShell>
  );
}
