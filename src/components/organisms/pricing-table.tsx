import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Professional } from "@/lib/types";

const DURATION_LABEL: Record<number, string> = {
  30: "30 minutos",
  45: "45 minutos",
  60: "60 minutos",
  90: "90 minutos",
};

export function PricingTable({ professional }: { professional: Professional }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border">
      <div className="divide-y divide-border">
        {professional.pricing.map((option) => (
          <div key={option.duration} className="flex flex-wrap items-center justify-between gap-4 bg-card p-5 sm:p-6">
            <div>
              <p className="text-sm text-muted-foreground">{DURATION_LABEL[option.duration]}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums sm:text-3xl">
                {formatPrice(option.price, professional.currency)}
              </p>
            </div>
            <Link href={`/reservar/${professional.slug}`}>
              <Button size="lg">Reservar</Button>
            </Link>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 bg-secondary/30 p-5 sm:p-6">
          <div>
            <p className="text-sm text-muted-foreground">Extensión por hora adicional</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{formatPrice(professional.extraHourPrice, professional.currency)}</p>
          </div>
          <Plus className="text-muted-foreground" size={18} />
        </div>
      </div>

      <div className="grid gap-6 border-t border-border bg-card p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <p className="mb-2 text-sm font-semibold">Incluye</p>
          <ul className="flex flex-col gap-1.5">
            {professional.includes.map((inc) => (
              <li key={inc} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check size={14} className="text-status-available" /> {inc}
              </li>
            ))}
          </ul>
        </div>
        {professional.extraCosts.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold">Costo adicional</p>
            <ul className="flex flex-col gap-1.5">
              {professional.extraCosts.map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Plus size={14} /> {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
