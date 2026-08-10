"use client";
import Link from "next/link";
import { Plus, ChevronUp, ChevronDown, Copy, Pencil, ChevronLeft, Trash2 } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { AdminNav } from "@/components/organisms/admin-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { iconFor } from "@/lib/icon-registry";
import { colorHex } from "@/lib/color-palette";
import { formatPrice } from "@/lib/utils";
import { useCategories } from "@/hooks/use-categories";
import { useServices } from "@/hooks/use-services";

export default function CategoryServicesPage({ params }: { params: { id: string } }) {
  const { getCategory, hydrated: categoriesHydrated } = useCategories();
  const { servicesFor, hydrated, toggleActive, duplicateService, moveService, deleteService } = useServices();
  const category = getCategory(params.id);
  const services = servicesFor(params.id);

  return (
    <SiteShell>
      <div className="container py-8">
        <Link href="/admin/categorias" className="mb-3 flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronLeft size={13} /> Volver a categorías
        </Link>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Servicios {categoriesHydrated && category ? `de ${category.label}` : ""}
            </h1>
            <p className="text-sm text-muted-foreground">La lista de servicios propia de este rubro.</p>
          </div>
          <Link href={`/admin/categorias/${params.id}/servicios/nueva`}>
            <Button className="gap-1.5"><Plus size={16} /> Nuevo servicio</Button>
          </Link>
        </div>

        <AdminNav />

        {categoriesHydrated && !category ? (
          <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No encontramos esa categoría.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {!hydrated ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
            ) : services.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                Todavía no hay servicios cargados para esta categoría.
              </p>
            ) : (
              services.map((svc, i) => {
                const Icon = iconFor(svc.icon);
                return (
                  <div key={svc.id} className={`flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-4 ${!svc.active ? "opacity-50" : "border-border"}`}>
                    <div className="flex flex-col gap-0.5">
                      <button disabled={i === 0} onClick={() => moveService(svc.id, "up")} className="rounded p-0.5 text-muted-foreground hover:bg-white/5 disabled:opacity-20" aria-label="Subir">
                        <ChevronUp size={15} />
                      </button>
                      <button disabled={i === services.length - 1} onClick={() => moveService(svc.id, "down")} className="rounded p-0.5 text-muted-foreground hover:bg-white/5 disabled:opacity-20" aria-label="Bajar">
                        <ChevronDown size={15} />
                      </button>
                    </div>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${colorHex(svc.color)}26`, color: colorHex(svc.color) }}>
                      <Icon size={17} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">{svc.name}</p>
                        {!svc.active && <Badge variant="muted">Inactivo</Badge>}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{svc.description || "Sin descripción"}</p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {svc.suggestedDuration && <span>{svc.suggestedDuration} min</span>}
                      {svc.suggestedPrice && <span className="font-medium text-foreground">{formatPrice(svc.suggestedPrice)}</span>}
                    </div>

                    <Switch checked={svc.active} onCheckedChange={() => toggleActive(svc.id)} />

                    <div className="flex items-center gap-1.5">
                      <Button size="icon-sm" variant="ghost" aria-label="Duplicar" onClick={() => duplicateService(svc.id)}>
                        <Copy size={14} />
                      </Button>
                      <Link href={`/admin/categorias/${params.id}/servicios/${svc.id}/editar`}>
                        <Button size="icon-sm" variant="ghost" aria-label="Editar">
                          <Pencil size={14} />
                        </Button>
                      </Link>
                      <Button size="icon-sm" variant="ghost" aria-label="Eliminar" onClick={() => deleteService(svc.id)}>
                        <Trash2 size={14} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
