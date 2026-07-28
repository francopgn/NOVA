"use client";
import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { FiltersPanel } from "@/components/organisms/filters-panel";
import { ProfessionalCard } from "@/components/molecules/professional-card";
import { ProfessionalCardSkeleton } from "@/components/molecules/professional-card-skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DEFAULT_FILTERS, searchProfessionals } from "@/lib/api";
import type { Professional, SearchFilters } from "@/lib/types";
import type { CategoryId } from "@/lib/constants";

const SORT_OPTIONS: Array<{ value: SearchFilters["sortBy"]; label: string }> = [
  { value: "populares", label: "Más populares" },
  { value: "cercanos", label: "Más cercanos" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
  { value: "puntuacion", label: "Mejor puntuación" },
  { value: "calidad-precio", label: "Mejor calidad/precio" },
  { value: "nuevos", label: "Más nuevos" },
];

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = React.useState<SearchFilters>(() => ({
    ...DEFAULT_FILTERS,
    query: searchParams.get("q") ?? "",
    categoryIds: searchParams.get("category") ? [searchParams.get("category") as CategoryId] : [],
    onlyAvailableNow: searchParams.get("disponible") === "1",
    sortBy: (searchParams.get("orden") as SearchFilters["sortBy"]) ?? "populares",
  }));
  const [results, setResults] = React.useState<Professional[] | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  function patch(p: Partial<SearchFilters>) {
    setFilters((prev) => ({ ...prev, ...p }));
  }

  React.useEffect(() => {
    let active = true;
    setResults(null);
    searchProfessionals(filters).then((r) => {
      if (active) setResults(r);
    });
    return () => {
      active = false;
    };
  }, [filters]);

  return (
    <SiteShell>
      <div className="container py-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Buscar especialistas</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {results ? `${results.length} resultados` : "Buscando..."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 lg:hidden" onClick={() => setMobileFiltersOpen(true)}>
              <SlidersHorizontal size={14} /> Filtros
            </Button>
            <Select value={filters.sortBy} onValueChange={(v) => patch({ sortBy: v as SearchFilters["sortBy"] })}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-border bg-card p-5 thin-scrollbar">
              <FiltersPanel filters={filters} onChange={patch} />
            </div>
          </aside>

          <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
            {!results
              ? Array.from({ length: 6 }).map((_, i) => <ProfessionalCardSkeleton key={i} />)
              : results.length === 0
              ? (
                <div className="col-span-full flex flex-col items-center gap-2 py-20 text-center">
                  <p className="text-lg font-medium">No encontramos resultados</p>
                  <p className="text-sm text-muted-foreground">Probá ajustar o limpiar algunos filtros.</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => setFilters(DEFAULT_FILTERS)}>
                    Limpiar filtros
                  </Button>
                </div>
              )
              : results.map((p) => <ProfessionalCard key={p.id} professional={p} />)}
          </div>
        </div>
      </div>

      <Dialog open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <DialogContent hideClose className="max-h-[85vh] overflow-y-auto">
          <DialogHeader className="mb-1 flex-row items-center justify-between">
            <DialogTitle>Filtros</DialogTitle>
            <button onClick={() => setMobileFiltersOpen(false)} className="rounded-full p-1.5 hover:bg-white/10">
              <X size={16} />
            </button>
          </DialogHeader>
          <FiltersPanel filters={filters} onChange={patch} />
          <Button className="mt-2 w-full" onClick={() => setMobileFiltersOpen(false)}>
            Ver {results?.length ?? ""} resultados
          </Button>
        </DialogContent>
      </Dialog>
    </SiteShell>
  );
}
