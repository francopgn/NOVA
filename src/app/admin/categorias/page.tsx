"use client";
import Image from "next/image";
import Link from "next/link";
import { Plus, ChevronUp, ChevronDown, Copy, Pencil, Home, Search, ListTree } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { AdminNav } from "@/components/organisms/admin-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { iconFor } from "@/lib/icon-registry";
import { colorHex } from "@/lib/color-palette";
import { useCategories } from "@/hooks/use-categories";
import { useServices } from "@/hooks/use-services";

export default function AdminCategoriesPage() {
  const { categories, hydrated, toggleActive, duplicateCategory, updateCategory, moveCategory } = useCategories();
  const { servicesFor } = useServices();

  return (
    <SiteShell>
      <div className="container py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Categorías</h1>
            <p className="text-sm text-muted-foreground">Se guardan en este navegador — listas para conectarse a una API cuando exista el backend.</p>
          </div>
          <Link href="/admin/categorias/nueva">
            <Button className="gap-1.5"><Plus size={16} /> Nueva categoría</Button>
          </Link>
        </div>

        <AdminNav />

        <div className="flex flex-col gap-2.5">
          {!hydrated ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
          ) : categories.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Todavía no creaste ninguna categoría.
            </p>
          ) : (
            categories.map((cat, i) => {
              const Icon = iconFor(cat.icon);
              return (
                <div key={cat.id} className={`flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-4 ${!cat.active ? "opacity-50" : "border-border"}`}>
                  <div className="flex flex-col gap-0.5">
                    <button
                      disabled={i === 0}
                      onClick={() => moveCategory(cat.id, "up")}
                      className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-white/5 disabled:opacity-20"
                      aria-label="Subir"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      disabled={i === categories.length - 1}
                      onClick={() => moveCategory(cat.id, "down")}
                      className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-white/5 disabled:opacity-20"
                      aria-label="Bajar"
                    >
                      <ChevronDown size={15} />
                    </button>
                  </div>

                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                    <Image src={cat.coverImageUrl} alt={cat.label} fill sizes="64px" className="object-cover" />
                  </div>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${colorHex(cat.color)}26`, color: colorHex(cat.color) }}>
                    <Icon size={16} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{cat.label}</p>
                      {!cat.active && <Badge variant="muted">Inactiva</Badge>}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">/{cat.slug}</p>
                  </div>

                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Home size={13} /> <Switch checked={cat.showInHome} onCheckedChange={(v) => updateCategory(cat.id, { showInHome: v })} />
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Search size={13} /> <Switch checked={cat.showInSearch} onCheckedChange={(v) => updateCategory(cat.id, { showInSearch: v })} />
                  </label>

                  <Switch checked={cat.active} onCheckedChange={() => toggleActive(cat.id)} />

                  <div className="flex items-center gap-1.5">
                    <Link href={`/admin/categorias/${cat.id}/servicios`}>
                      <Button size="icon-sm" variant="ghost" aria-label="Servicios" title={`${servicesFor(cat.id).length} servicios`}>
                        <ListTree size={14} />
                      </Button>
                    </Link>
                    <Button size="icon-sm" variant="ghost" aria-label="Duplicar" onClick={() => duplicateCategory(cat.id)}>
                      <Copy size={14} />
                    </Button>
                    <Link href={`/admin/categorias/${cat.id}/editar`}>
                      <Button size="icon-sm" variant="ghost" aria-label="Editar">
                        <Pencil size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </SiteShell>
  );
}
