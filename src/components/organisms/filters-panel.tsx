"use client";
import { RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FilterSwitchRow } from "@/components/molecules/filter-switch-row";
import { ToggleChipGroup } from "@/components/molecules/toggle-chip-group";
import { ALL_SPECIALTIES, LANGUAGES, SESSION_TYPES, ZONES } from "@/lib/constants";
import { DEFAULT_FILTERS } from "@/lib/api";
import { useCategories } from "@/hooks/use-categories";
import type { SearchFilters } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";

export function FiltersPanel({
  filters,
  onChange,
  className,
}: {
  filters: SearchFilters;
  onChange: (patch: Partial<SearchFilters>) => void;
  className?: string;
}) {
  const { searchCategories } = useCategories();
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Filtros</p>
        <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs text-muted-foreground" onClick={() => onChange(DEFAULT_FILTERS)}>
          <RotateCcw size={12} /> Limpiar
        </Button>
      </div>

      <section>
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Categoría</p>
        <ToggleChipGroup
          options={searchCategories.map((c) => c.label)}
          value={searchCategories.filter((c) => filters.categoryIds.includes(c.id)).map((c) => c.label)}
          onChange={(labels) => onChange({ categoryIds: searchCategories.filter((c) => labels.includes(c.label)).map((c) => c.id) })}
        />
      </section>

      <Separator />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Precio por sesión</p>
          <p className="text-xs tabular-nums text-muted-foreground">
            {formatPrice(filters.priceMin)} – {formatPrice(filters.priceMax)}
          </p>
        </div>
        <Slider
          min={0}
          max={100000}
          step={1000}
          value={[filters.priceMin, filters.priceMax]}
          onValueChange={(v) => onChange({ priceMin: v[0] as number, priceMax: v[1] as number })}
        />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Edad del profesional</p>
          <p className="text-xs tabular-nums text-muted-foreground">{filters.ageMin} – {filters.ageMax} años</p>
        </div>
        <Slider min={22} max={70} step={1} value={[filters.ageMin, filters.ageMax]} onValueChange={(v) => onChange({ ageMin: v[0] as number, ageMax: v[1] as number })} />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Años de experiencia (mín.)</p>
          <p className="text-xs tabular-nums text-muted-foreground">{filters.experienceMin}+ años</p>
        </div>
        <Slider min={0} max={25} step={1} value={[filters.experienceMin]} onValueChange={(v) => onChange({ experienceMin: v[0] as number })} />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Distancia máxima</p>
          <p className="text-xs tabular-nums text-muted-foreground">{filters.distanceMaxKm} km</p>
        </div>
        <Slider min={1} max={25} step={1} value={[filters.distanceMaxKm]} onValueChange={(v) => onChange({ distanceMaxKm: v[0] as number })} />
      </section>

      <Separator />

      <section className="divide-y divide-border">
        <FilterSwitchRow label="Solo disponibles ahora" checked={filters.onlyAvailableNow} onCheckedChange={(v) => onChange({ onlyAvailableNow: v })} />
        <FilterSwitchRow label="Solo verificados" description="Con credenciales validadas" checked={filters.onlyVerified} onCheckedChange={(v) => onChange({ onlyVerified: v })} />
        <FilterSwitchRow label="Con video de presentación" checked={filters.onlyWithVideo} onCheckedChange={(v) => onChange({ onlyWithVideo: v })} />
        <FilterSwitchRow label="Con historias" description="Contenido formativo reciente" checked={filters.onlyWithStories} onCheckedChange={(v) => onChange({ onlyWithStories: v })} />
        <FilterSwitchRow label="Con promociones activas" checked={filters.onlyWithPromotions} onCheckedChange={(v) => onChange({ onlyWithPromotions: v })} />
        <FilterSwitchRow label="Con espacio propio" description="Oficina o estudio" checked={filters.onlyOwnSpace} onCheckedChange={(v) => onChange({ onlyOwnSpace: v })} />
        <FilterSwitchRow label="Con desplazamiento a domicilio" checked={filters.onlyTravelsToClient} onCheckedChange={(v) => onChange({ onlyTravelsToClient: v })} />
        <FilterSwitchRow label="Virtual (online)" checked={filters.onlyVirtual} onCheckedChange={(v) => onChange({ onlyVirtual: v })} />
        <FilterSwitchRow label="Acepta tarjetas" checked={filters.acceptsCards} onCheckedChange={(v) => onChange({ acceptsCards: v })} />
        <FilterSwitchRow label="Acepta transferencias" checked={filters.acceptsTransfer} onCheckedChange={(v) => onChange({ acceptsTransfer: v })} />
      </section>

      <Separator />

      <section>
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Idiomas</p>
        <ToggleChipGroup options={LANGUAGES} value={filters.languages} onChange={(v) => onChange({ languages: v })} />
      </section>

      <section>
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Tipo de sesión</p>
        <ToggleChipGroup options={SESSION_TYPES} value={filters.sessionTypes} onChange={(v) => onChange({ sessionTypes: v })} />
      </section>

      <section>
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Zona</p>
        <ToggleChipGroup options={ZONES} value={filters.zones} onChange={(v) => onChange({ zones: v })} />
      </section>

      <section>
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Especialidades</p>
        <ToggleChipGroup options={ALL_SPECIALTIES} value={filters.specialties} onChange={(v) => onChange({ specialties: v })} />
      </section>
    </div>
  );
}
