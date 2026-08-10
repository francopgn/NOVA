"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { AdminNav } from "@/components/organisms/admin-nav";
import { CustomFieldForm } from "@/components/organisms/custom-field-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomFields } from "@/hooks/use-custom-fields";

export default function EditCustomFieldPage({ params }: { params: { id: string; fieldId: string } }) {
  const router = useRouter();
  const { getField, updateField, hydrated } = useCustomFields();
  const field = getField(params.fieldId);

  return (
    <SiteShell>
      <div className="container max-w-2xl py-8">
        <Link href={`/admin/categorias/${params.id}/campos`} className="mb-3 flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronLeft size={13} /> Volver a campos
        </Link>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Editar campo personalizado</h1>
        <p className="mb-6 text-sm text-muted-foreground">Los cambios se reflejan al instante en el alta de prestadores.</p>
        <AdminNav />
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          {!hydrated ? (
            <Skeleton className="h-72 w-full" />
          ) : !field ? (
            <p className="text-sm text-muted-foreground">No encontramos ese campo.</p>
          ) : (
            <CustomFieldForm
              categoryId={params.id}
              initial={field}
              submitLabel="Guardar cambios"
              onSubmit={async (draft) => {
                await updateField(field.id, draft);
                router.push(`/admin/categorias/${params.id}/campos`);
              }}
            />
          )}
        </div>
      </div>
    </SiteShell>
  );
}
