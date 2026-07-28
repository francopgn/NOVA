import { Building2, Home, Building, Video, Plane, Users, GraduationCap, Wand2, type LucideIcon } from "lucide-react";
import type { ServiceModeId } from "@/lib/constants";

const MODE_META: Record<ServiceModeId, { label: string; icon: LucideIcon }> = {
  estudio: { label: "En estudio propio", icon: Building2 },
  domicilio: { label: "A domicilio", icon: Home },
  oficina: { label: "En oficina corporativa", icon: Building },
  virtual: { label: "Virtual (online)", icon: Video },
  "in-company": { label: "Viajes (in-company)", icon: Plane },
};

export function ServiceModesGrid({ modes, sessionTypes, techniques }: { modes: ServiceModeId[]; sessionTypes: string[]; techniques: string[] }) {
  const items: Array<{ label: string; icon: LucideIcon }> = [
    ...modes.map((m) => MODE_META[m]),
    ...(sessionTypes.includes("Grupal") ? [{ label: "Sesiones grupales", icon: Users }] : []),
    { label: "Formación a medida", icon: GraduationCap },
    ...techniques.map((t) => ({ label: t, icon: Wand2 })),
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2.5 rounded-2xl border border-border bg-card p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <item.icon size={16} />
          </span>
          <span className="text-sm leading-snug">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
