"use client";
import { useRouter } from "next/navigation";
import { SiteShell } from "@/components/organisms/site-shell";
import { AdminNav } from "@/components/organisms/admin-nav";
import { CategoryForm } from "@/components/organisms/category-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getCategory, updateCategory, hydrated } = useCategories();
  const category = getCategory(params.id);

  return (
    <SiteShell>
      <div className="container max-w-3xl py-8">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Editar categoría</h1>
        <p className="mb-6 text-sm text-muted-foreground">Los cambios se reflejan al instante en toda la plataforma.</p>
        <AdminNav />
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          {!hydrated ? (
            <Skeleton className="h-96 w-full" />
          ) : !category ? (
            <p className="text-sm text-muted-foreground">No encontramos esa categoría.</p>
          ) : (
            <CategoryForm
              initial={category}
              submitLabel="Guardar cambios"
              onSubmit={async (draft) => {
                await updateCategory(category.id, draft);
                router.push("/admin/categorias");
              }}
            />
          )}
        </div>
      </div>
    </SiteShell>
  );
}
