"use client";
import { useRouter } from "next/navigation";
import { SiteShell } from "@/components/organisms/site-shell";
import { AdminNav } from "@/components/organisms/admin-nav";
import { CategoryForm } from "@/components/organisms/category-form";
import { useCategories } from "@/hooks/use-categories";

export default function NewCategoryPage() {
  const router = useRouter();
  const { createCategory } = useCategories();

  return (
    <SiteShell>
      <div className="container max-w-3xl py-8">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Nueva categoría</h1>
        <p className="mb-6 text-sm text-muted-foreground">Aparece de inmediato en el Home, el buscador y el alta de prestadores.</p>
        <AdminNav />
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <CategoryForm
            submitLabel="Crear categoría"
            onSubmit={async (draft) => {
              await createCategory(draft);
              router.push("/admin/categorias");
            }}
          />
        </div>
      </div>
    </SiteShell>
  );
}
