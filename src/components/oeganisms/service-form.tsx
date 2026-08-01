"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { FilterSwitchRow } from "@/components/molecules/filter-switch-row";
import { IconPicker } from "@/components/molecules/icon-picker";
import { ColorPicker } from "@/components/molecules/color-picker";
import { DURATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ServiceDraft } from "@/lib/service-types";

export function ServiceForm({
  categoryId,
  initial,
  submitLabel,
  onSubmit,
}: {
  categoryId: string;
  initial?: Partial<ServiceDraft>;
  submitLabel: string;
  onSubmit: (draft: ServiceDraft) => void;
}) {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [description, setDescription] = React.useState(initial?.description ?? "");
  const [icon, setIcon] = React.useState(initial?.icon ?? "star");
  const [color, setColor] = React.useState(initial?.color ?? "bronze");
  const [suggestedPrice, setSuggestedPrice] = React.useState<string>(initial?.suggestedPrice ? String(initial.suggestedPrice) : "");
  const [suggestedDuration, setSuggestedDuration] = React.useState<30 | 45 | 60 | 90 | null>(initial?.suggestedDuration ?? null);
  const [active, setActive] = React.useState(initial?.active ?? true);

  const canSubmit = name.trim().length > 1;

  function submit() {
    if (!canSubmit) return;
    onSubmit({
      categoryId,
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      suggestedPrice: suggestedPrice ? Number(suggestedPrice) : undefined,
      suggestedDuration: suggestedDuration ?? undefined,
      active,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Nombre del servicio</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Masaje relajante"
          className="rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-sm focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Descripción</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Breve descripción de en qué consiste"
          className="resize-none rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-sm focus:outline-none"
        />
      </label>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Ícono</p>
        <IconPicker value={icon} onChange={setIcon} />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Color</p>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Precio sugerido (opcional)</span>
          <input
            type="number"
            value={suggestedPrice}
            onChange={(e) => setSuggestedPrice(e.target.value)}
            placeholder="Ej: 20000"
            className="rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-sm tabular-nums focus:outline-none"
          />
        </label>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Duración sugerida</span>
          <div className="flex flex-wrap gap-1.5">
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSuggestedDuration(suggestedDuration === d ? null : d)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  suggestedDuration === d ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:bg-white/5"
                )}
              >
                {d} min
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border px-4">
        <FilterSwitchRow label="Servicio activo" description="Si lo desactivás, se oculta de la plataforma" checked={active} onCheckedChange={setActive} />
      </div>

      <Button size="lg" disabled={!canSubmit} onClick={submit} className="self-start">
        {submitLabel}
      </Button>
    </div>
  );
}
