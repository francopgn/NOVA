"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/organisms/navbar";
import { ProfessionalListRow } from "@/components/molecules/professional-list-row";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { getNearbyProfessionals } from "@/lib/api";
import { ZONES, type CategoryId, type Zone } from "@/lib/constants";
import { useCategories } from "@/hooks/use-categories";
import type { Professional } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";

const MapView = dynamic(() => import("@/components/organisms/map-view").then((m) => m.MapView), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-none" />,
});

export default function MapPage() {
  const { searchCategories } = useCategories();
  const [all, setAll] = React.useState<Professional[] | null>(null);
  const [onlyAvailable, setOnlyAvailable] = React.useState(false);
  const [category, setCategory] = React.useState<CategoryId | "todas">("todas");
  const [zone, setZone] = React.useState<Zone | "todas">("todas");
  const [maxDistance, setMaxDistance] = React.useState(20);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  React.useEffect(() => {
    getNearbyProfessionals().then(setAll);
  }, []);

  const filtered = React.useMemo(() => {
    if (!all) return [];
    return all.filter((p) => {
      if (onlyAvailable && p.status !== "disponible") return false;
      if (category !== "todas" && p.categoryId !== category) return false;
      if (zone !== "todas" && p.zone !== zone) return false;
      if (p.distanceKm > maxDistance) return false;
      return true;
    });
  }, [all, onlyAvailable, category, zone, maxDistance]);

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-72px)] flex-col">
        <div className="z-20 flex flex-wrap items-center gap-2 border-b border-white/5 bg-background/80 px-4 py-3 backdrop-blur-xl">
          <Button variant={!onlyAvailable ? "default" : "secondary"} size="sm" onClick={() => setOnlyAvailable(false)}>
            Todas
          </Button>
          <Button variant={onlyAvailable ? "default" : "secondary"} size="sm" onClick={() => setOnlyAvailable(true)}>
            Solo disponibles
          </Button>
          <div className="mx-1 h-6 w-px bg-border" />
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            <button
              onClick={() => setZone("todas")}
              className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium", zone === "todas" ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground")}
            >
              Todas las zonas
            </button>
            {ZONES.map((z) => (
              <button
                key={z}
                onClick={() => setZone(z)}
                className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium", zone === z ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground")}
              >
                {z}
              </button>
            ))}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto gap-1.5">
                <SlidersHorizontal size={13} /> Más filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Especialidad</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId | "todas")}
                className="mb-4 w-full rounded-xl border border-border bg-secondary/60 px-3 py-2 text-sm"
              >
                <option value="todas">Todas las categorías</option>
                {searchCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Distancia</p>
                <p className="text-xs text-muted-foreground">{maxDistance} km</p>
              </div>
              <Slider min={1} max={25} value={[maxDistance]} onValueChange={(v) => setMaxDistance(v[0] as number)} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[380px_1fr]">
          <aside className="order-2 hidden overflow-y-auto border-r border-white/5 p-3 thin-scrollbar lg:order-1 lg:block">
            <p className="px-1 pb-3 text-sm text-muted-foreground">{filtered.length} especialistas en el área</p>
            <div className="flex flex-col gap-2">
              {!all
                ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
                : filtered.map((p) => (
                    <div key={p.id} onClick={() => setSelectedId(p.id)}>
                      <ProfessionalListRow professional={p} active={p.id === hoveredId || p.id === selectedId} onHover={setHoveredId} />
                    </div>
                  ))}
            </div>
          </aside>
          <div className="relative order-1 min-h-[50vh] lg:order-2">
            {all && <MapView professionals={filtered} selectedId={selectedId ?? hoveredId} onSelect={setSelectedId} />}
          </div>
        </div>
      </div>
    </>
  );
}
