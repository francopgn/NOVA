"use client";
import * as React from "react";
import Image from "next/image";
import { Send, Tag, Megaphone } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { DashboardNav } from "@/components/organisms/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getFrequentClients } from "@/lib/api";
import type { FrequentClient } from "@/lib/types";

const TAG_VARIANT: Record<FrequentClient["tag"], "default" | "accent" | "muted"> = {
  VIP: "default",
  Frecuente: "accent",
  Nuevo: "muted",
};

export default function FrequentClientsPage() {
  const [clients, setClients] = React.useState<FrequentClient[] | null>(null);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [toast, setToast] = React.useState<string | null>(null);

  React.useEffect(() => {
    getFrequentClients().then(setClients);
  }, []);

  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <SiteShell>
      <div className="container py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Clientes frecuentes</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" disabled={selected.size === 0} onClick={() => setToast(`Promoción enviada a ${selected.size} cliente(s).`)}>
              <Tag size={14} /> Enviar promoción
            </Button>
            <Button size="sm" className="gap-1.5" disabled={selected.size === 0} onClick={() => setToast(`Mensaje masivo enviado a ${selected.size} cliente(s).`)}>
              <Megaphone size={14} /> Mensaje masivo
            </Button>
          </div>
        </div>
        <DashboardNav />

        <div className="flex flex-col gap-2.5">
          {clients?.map((c) => (
            <label key={c.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <Checkbox checked={selected.has(c.id)} onCheckedChange={() => toggle(c.id)} />
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                <Image src={c.avatarUrl} alt={c.name} fill sizes="44px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.sessionsCount} sesiones · última hace {c.lastSessionDaysAgo} días</p>
              </div>
              <Badge variant={TAG_VARIANT[c.tag]}>{c.tag}</Badge>
              <Button size="icon-sm" variant="ghost" aria-label="Enviar mensaje" onClick={(e) => { e.preventDefault(); setToast(`Mensaje enviado a ${c.name}.`); }}>
                <Send size={14} />
              </Button>
            </label>
          ))}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full glass-strong px-5 py-3 text-sm shadow-glass">
          {toast}
        </div>
      )}
    </SiteShell>
  );
}
