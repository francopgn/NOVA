"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { AdminNav } from "@/components/organisms/admin-nav";
import { CustomFieldForm } from "@/components/organisms/custom-field-form";
import { useCategories } from "@/hooks/use-categories";
import { useCustomFields } from "@/hooks/use-custom-fields";

export default function NewCustomFieldPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getCategory } = useCategories();
  const { createField } = useCustomFields();
  const category = getCategory(params.id);

  return (
    <SiteShell>
      <div className="container max-w-2xl py-8">
        <Link href={`/admin/categorias/${params.id}/campos`} className="mb-3 flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronLeft size={13} /> Volver a campos
        </Link>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Nuevo campo personalizado</h1>
        <p className="mb-6 text-sm text-muted-foreground">{category ? `Para la categoría ${category.label}.` : ""}</p>
        <AdminNav />
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <CustomFieldForm
            categoryId={params.id}
            submitLabel="Crear campo"
            onSubmit={async (draft) => {
              await createField(draft);
              router.push(`/admin/categorias/${params.id}/campos`);
            }}
          />
        </div>
      </div>
    </SiteShell>
  );
}
