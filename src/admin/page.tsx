"use client";
import Link from "next/link";
import { Layers, ListTree, SlidersHorizontal, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { AdminNav } from "@/components/organisms/admin-nav";
import { useCategories } from "@/hooks/use-categories";

export default function AdminHomePage() {
  const { categories, hydrated } = useCategories();
  const activeCount = categories.filter((c) => c.active).length;

  return (
    <SiteShell>
      <div className="container py-8">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Administración</h1>
        <p className="mb-6 text-sm text-muted-foreground">Gestioná los rubros de la plataforma sin tocar código.</p>
        <AdminNav />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/categorias" className="group rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Layers size={19} />
            </span>
            <p className="mt-4 font-semibold">Categorías</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {hydrated ? `${activeCount} activas de ${categories.length}` : "Cargando..."} — crear, editar, duplicar, reordenar y decidir dónde se muestran.
            </p>
            <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Administrar <ArrowRight size={14} />
            </span>
          </Link>

          <div className="rounded-3xl border border-dashed border-border p-6 opacity-60">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <ListTree size={19} />
            </span>
            <p className="mt-4 font-semibold">Servicios por categoría</p>
            <p className="mt-1 text-sm text-muted-foreground">Próxima etapa: la lista de servicios propia de cada rubro (ej. "Masaje relajante" dentro de Masajistas).</p>
          </div>

          <div className="rounded-3xl border border-dashed border-border p-6 opacity-60">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <SlidersHorizontal size={19} />
            </span>
            <p className="mt-4 font-semibold">Campos personalizados</p>
            <p className="mt-1 text-sm text-muted-foreground">Próxima etapa: campos propios por rubro que alimentan el alta de prestador y los filtros del buscador.</p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
