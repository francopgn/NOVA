"use client";
import * as React from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSwitchRow } from "@/components/molecules/filter-switch-row";
import { cn } from "@/lib/utils";
import type { CustomFieldDraft, CustomFieldType } from "@/lib/custom-field-types";

const TYPE_LABELS: Record<CustomFieldType, string> = {
  boolean: "Sí / No (checkbox)",
  text: "Texto libre",
  select: "Selección única",
};

export function CustomFieldForm({
  categoryId,
  initial,
  submitLabel,
  onSubmit,
}: {
  categoryId: string;
  initial?: Partial<CustomFieldDraft>;
  submitLabel: string;
  onSubmit: (draft: CustomFieldDraft) => void;
}) {
  const [label, setLabel] = React.useState(initial?.label ?? "");
  const [type, setType] = React.useState<CustomFieldType>(initial?.type ?? "boolean");
  const [options, setOptions] = React.useState<string[]>(initial?.options ?? []);
  const [optionDraft, setOptionDraft] = React.useState("");
  const [required, setRequired] = React.useState(initial?.required ?? false);
  const [active, setActive] = React.useState(initial?.active ?? true);

  const canSubmit = label.trim().length > 1 && (type !== "select" || options.length >= 2);

  function addOption() {
    const v = optionDraft.trim();
    if (!v || options.includes(v)) return;
    setOptions((prev) => [...prev, v]);
    setOptionDraft("");
  }

  function submit() {
    if (!canSubmit) return;
    onSubmit({ categoryId, label: label.trim(), type, options: type === "select" ? options : [], required, active });
  }

  return (
    <div className="flex flex-col gap-6">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Etiqueta del campo</span>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ej: Trabaja con gas"
          className="rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-sm focus:outline-none"
        />
      </label>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Tipo de campo</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TYPE_LABELS) as CustomFieldType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                type === t ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:bg-white/5"
              )}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {type === "select" && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Opciones (mínimo 2)</p>
          <div className="mb-2 flex flex-wrap gap-2">
            {options.map((o) => (
              <span key={o} className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 py-1 pl-3 pr-1.5 text-xs">
                {o}
                <button onClick={() => setOptions((prev) => prev.filter((x) => x !== o))} className="rounded-full p-0.5 hover:bg-white/10">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={optionDraft}
              onChange={(e) => setOptionDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOption())}
              placeholder="Ej: Femenino"
              className="rounded-full border border-border bg-secondary/50 px-3.5 py-1.5 text-sm focus:outline-none"
            />
            <Button size="sm" variant="outline" className="gap-1" onClick={addOption}>
              <Plus size={13} /> Agregar
            </Button>
          </div>
        </div>
      )}

      <div className="divide-y divide-border rounded-2xl border border-border px-4">
        <FilterSwitchRow label="Campo obligatorio" description="El prestador no puede omitirlo en el alta" checked={required} onCheckedChange={setRequired} />
        <FilterSwitchRow label="Campo activo" description="Si lo desactivás, se oculta del formulario" checked={active} onCheckedChange={setActive} />
      </div>

      <Button size="lg" disabled={!canSubmit} onClick={submit} className="self-start">
        {submitLabel}
      </Button>
    </div>
  );
}
