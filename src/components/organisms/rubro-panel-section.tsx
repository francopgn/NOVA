"use client";
import Link from "next/link";
import { CheckCircle2, XCircle, Pencil, Layers } from "lucide-react";
import { iconFor } from "@/lib/icon-registry";
import { colorHex } from "@/lib/color-palette";
import { useCategories } from "@/hooks/use-categories";
import { useServices } from "@/hooks/use-services";
import { useCustomFields } from "@/hooks/use-custom-fields";
import type { ProviderProfileDraft } from "@/lib/provider-profile";

export function RubroPanelSection({ categoryId, profile }: { categoryId: string; profile: ProviderProfileDraft | null }) {
  const { getCategory } = useCategories();
  const { activeServicesFor } = useServices();
  const { activeFieldsFor } = useCustomFields();

  const category = getCategory(categoryId);
  const services = activeServicesFor(categoryId);
  const selectedServices = services.filter((s) => profile?.selectedServiceIds?.includes(s.id));
  const fields = activeFieldsFor(categoryId);

  if (services.length === 0 && fields.length === 0) return null;

  return (
    <div className="mb-8 grid gap-6 lg:grid-cols-2">
      {services.length > 0 && (
        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold">
              <Layers size={16} className="text-primary" /> Tus servicios de {category?.label ?? "tu rubro"}
            </h3>
            <Link href="/panel/alta" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <Pencil size={12} /> Editar
            </Link>
          </div>
          {selectedServices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no elegiste qué servicios ofrecés dentro de tu rubro.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedServices.map((svc) => {
                const Icon = iconFor(svc.icon);
                return (
                  <span
                    key={svc.id}
                    className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium"
                    style={{ color: colorHex(svc.color) }}
                  >
                    <Icon size={13} /> {svc.name}
                  </span>
                );
              })}
            </div>
          )}
        </section>
      )}

      {fields.length > 0 && (
        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Datos de tu rubro</h3>
            <Link href="/panel/alta" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <Pencil size={12} /> Editar
            </Link>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {fields.map((field) => {
              const value = profile?.customFieldValues?.[field.id];
              return (
                <div key={field.id} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                  <span className="text-muted-foreground">{field.label}</span>
                  {field.type === "boolean" ? (
                    value ? (
                      <span className="flex items-center gap-1 font-medium text-status-available"><CheckCircle2 size={14} /> Sí</span>
                    ) : (
                      <span className="flex items-center gap-1 text-muted-foreground"><XCircle size={14} /> No</span>
                    )
                  ) : (
                    <span className="font-medium">{(value as string) || "—"}</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
