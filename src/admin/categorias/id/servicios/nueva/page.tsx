"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { AdminNav } from "@/components/organisms/admin-nav";
import { ServiceForm } from "@/components/organisms/service-form";
import { useCategories } from "@/hooks/use-categories";
import { useServices } from "@/hooks/use-services";

export default function NewServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getCategory } = useCategories();
  const { createService } = useServices();
  const category = getCategory(params.id);

  return (
    <SiteShell>
      <div className="container max-w-2xl py-8">
        <Link href={`/admin/categorias/${params.id}/servicios`} className="mb-3 flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronLeft size={13} /> Volver a servicios
        </Link>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Nuevo servicio</h1>
        <p className="mb-6 text-sm text-muted-foreground">{category ? `Para la categoría ${category.label}.` : ""}</p>
        <AdminNav />
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <ServiceForm
            categoryId={params.id}
            submitLabel="Crear servicio"
            onSubmit={(draft) => {
              createService(draft);
              router.push(`/admin/categorias/${params.id}/servicios`);
            }}
          />
        </div>
      </div>
    </SiteShell>
  );
}
