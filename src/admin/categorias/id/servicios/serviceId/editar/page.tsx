"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { AdminNav } from "@/components/organisms/admin-nav";
import { ServiceForm } from "@/components/organisms/service-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useServices } from "@/hooks/use-services";

export default function EditServicePage({ params }: { params: { id: string; serviceId: string } }) {
  const router = useRouter();
  const { getService, updateService, hydrated } = useServices();
  const service = getService(params.serviceId);

  return (
    <SiteShell>
      <div className="container max-w-2xl py-8">
        <Link href={`/admin/categorias/${params.id}/servicios`} className="mb-3 flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronLeft size={13} /> Volver a servicios
        </Link>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Editar servicio</h1>
        <p className="mb-6 text-sm text-muted-foreground">Los cambios se reflejan al instante.</p>
        <AdminNav />
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          {!hydrated ? (
            <Skeleton className="h-80 w-full" />
          ) : !service ? (
            <p className="text-sm text-muted-foreground">No encontramos ese servicio.</p>
          ) : (
            <ServiceForm
              categoryId={params.id}
              initial={service}
              submitLabel="Guardar cambios"
              onSubmit={(draft) => {
                updateService(service.id, draft);
                router.push(`/admin/categorias/${params.id}/servicios`);
              }}
            />
          )}
        </div>
      </div>
    </SiteShell>
  );
}
