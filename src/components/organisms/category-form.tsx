"use client";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FilterSwitchRow } from "@/components/molecules/filter-switch-row";
import { IconPicker } from "@/components/molecules/icon-picker";
import { ColorPicker } from "@/components/molecules/color-picker";
import type { CategoryDraft } from "@/lib/category-types";

export function CategoryForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Partial<CategoryDraft>;
  submitLabel: string;
  onSubmit: (draft: CategoryDraft) => void;
}) {
  const [label, setLabel] = React.useState(initial?.label ?? "");
  const [slug, setSlug] = React.useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(!!initial?.slug);
  const [blurb, setBlurb] = React.useState(initial?.blurb ?? "");
  const [icon, setIcon] = React.useState(initial?.icon ?? "star");
  const [color, setColor] = React.useState(initial?.color ?? "bronze");
  const [coverImageUrl, setCoverImageUrl] = React.useState(initial?.coverImageUrl ?? "https://picsum.photos/seed/nueva-categoria/800/500");
  const [seoTitle, setSeoTitle] = React.useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = React.useState(initial?.seoDescription ?? "");
  const [showInHome, setShowInHome] = React.useState(initial?.showInHome ?? true);
  const [showInSearch, setShowInSearch] = React.useState(initial?.showInSearch ?? true);
  const [active, setActive] = React.useState(initial?.active ?? true);

  function handleLabelChange(v: string) {
    setLabel(v);
    if (!slugTouched) {
      setSlug(
        v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      );
    }
  }

  const canSubmit = label.trim().length > 1 && slug.trim().length > 1;

  function submit() {
    if (!canSubmit) return;
    onSubmit({
      label: label.trim(),
      slug: slug.trim(),
      blurb: blurb.trim() || "Especialistas verificados en este rubro.",
      icon,
      color,
      coverImageUrl: coverImageUrl.trim() || "https://picsum.photos/seed/categoria/800/500",
      seoTitle: seoTitle.trim() || `${label.trim()} | Sessio`,
      seoDescription: seoDescription.trim() || blurb.trim() || `Encontrá especialistas en ${label.trim()}.`,
      showInHome,
      showInSearch,
      active,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Nombre</span>
          <input
            value={label}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="Ej: Plomeros"
            className="rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-sm focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Slug (URL)</span>
          <input
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
            placeholder="plomeros"
            className="rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-sm font-mono focus:outline-none"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Descripción breve</span>
        <textarea
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
          rows={2}
          placeholder="Ej: Destapaciones, pérdidas de agua e instalaciones"
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

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Imagen de portada (URL)</span>
          <input
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://..."
            className="rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-sm focus:outline-none"
          />
        </label>
        <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl border border-border">
          {coverImageUrl && <Image src={coverImageUrl} alt="Portada" fill sizes="112px" className="object-cover" />}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Título SEO</span>
          <input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder={label ? `${label} | Sessio` : "Título para buscadores"}
            className="rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-sm focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Descripción SEO</span>
          <input
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="Descripción para buscadores"
            className="rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-sm focus:outline-none"
          />
        </label>
      </div>

      <div className="divide-y divide-border rounded-2xl border border-border px-4">
        <FilterSwitchRow label="Mostrar en el Home" description="Aparece en la fila de categorías destacadas" checked={showInHome} onCheckedChange={setShowInHome} />
        <FilterSwitchRow label="Mostrar en el buscador" description="Aparece como filtro de categoría en /buscar" checked={showInSearch} onCheckedChange={setShowInSearch} />
        <FilterSwitchRow label="Categoría activa" description="Si la desactivás, se oculta de toda la plataforma" checked={active} onCheckedChange={setActive} />
      </div>

      <Button size="lg" disabled={!canSubmit} onClick={submit} className="self-start">
        {submitLabel}
      </Button>
    </div>
  );
}
