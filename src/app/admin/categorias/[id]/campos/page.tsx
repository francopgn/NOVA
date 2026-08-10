"use client";
import Link from "next/link";
import { Plus, ChevronUp, ChevronDown, Copy, Pencil, ChevronLeft, Trash2, ListChecks } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { AdminNav } from "@/components/organisms/admin-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import { useCustomFields } from "@/hooks/use-custom-fields";

const TYPE_LABEL = { boolean: "Sí / No", text: "Texto", select: "Selección" } as const;

export default function CategoryCustomFieldsPage({ params }: { params: { id: string } }) {
  const { getCategory, hydrated: categoriesHydrated } = useCategories();
  const { fieldsFor, hydrated, toggleActive, duplicateField, moveField, deleteField } = useCustomFields();
  const category = getCategory(params.id);
  const fields = fieldsFor(params.id);

  return (
    <SiteShell>
      <div className="container py-8">
        <Link href="/admin/categorias" className="mb-3 flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronLeft size={13} /> Volver a categorías
        </Link>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Campos personalizados {categoriesHydrated && category ? `de ${category.label}` : ""}
            </h1>
            <p className="text-sm text-muted-foreground">Se muestran automáticamente en el alta de prestadores de este rubro.</p>
          </div>
          <Link href={`/admin/categorias/${params.id}/campos/nueva`}>
            <Button className="gap-1.5"><Plus size={16} /> Nuevo campo</Button>
          </Link>
        </div>

        <AdminNav />

        {categoriesHydrated && !category ? (
          <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No encontramos esa categoría.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {!hydrated ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
            ) : fields.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                Todavía no hay campos personalizados para esta categoría.
              </p>
            ) : (
              fields.map((f, i) => (
                <div key={f.id} className={`flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-4 ${!f.active ? "opacity-50" : "border-border"}`}>
                  <div className="flex flex-col gap-0.5">
                    <button disabled={i === 0} onClick={() => moveField(f.id, "up")} className="rounded p-0.5 text-muted-foreground hover:bg-white/5 disabled:opacity-20" aria-label="Subir">
                      <ChevronUp size={15} />
                    </button>
                    <button disabled={i === fields.length - 1} onClick={() => moveField(f.id, "down")} className="rounded p-0.5 text-muted-foreground hover:bg-white/5 disabled:opacity-20" aria-label="Bajar">
                      <ChevronDown size={15} />
                    </button>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <ListChecks size={17} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{f.label}</p>
                      {f.required && <Badge variant="warning">Obligatorio</Badge>}
                      {!f.active && <Badge variant="muted">Inactivo</Badge>}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {TYPE_LABEL[f.type]}{f.type === "select" && f.options.length > 0 ? `: ${f.options.join(", ")}` : ""}
                    </p>
                  </div>

                  <Switch checked={f.active} onCheckedChange={() => toggleActive(f.id)} />

                  <div className="flex items-center gap-1.5">
                    <Button size="icon-sm" variant="ghost" aria-label="Duplicar" onClick={() => duplicateField(f.id)}>
                      <Copy size={14} />
                    </Button>
                    <Link href={`/admin/categorias/${params.id}/campos/${f.id}/editar`}>
                      <Button size="icon-sm" variant="ghost" aria-label="Editar">
                        <Pencil size={14} />
                      </Button>
                    </Link>
                    <Button size="icon-sm" variant="ghost" aria-label="Eliminar" onClick={() => deleteField(f.id)}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
