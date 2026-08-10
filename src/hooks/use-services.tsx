"use client";
import * as React from "react";
import type { ManagedService, ServiceDraft } from "@/lib/service-types";

// Fase B2 — mismo patrón que use-categories.tsx: misma forma pública que la
// versión de la Fase 6 (localStorage), ahora contra /api/services.

interface ServicesContextValue {
  services: ManagedService[];
  hydrated: boolean;
  servicesFor: (categoryId: string) => ManagedService[];
  activeServicesFor: (categoryId: string) => ManagedService[];
  getService: (id: string) => ManagedService | undefined;
  createService: (draft: ServiceDraft) => Promise<ManagedService>;
  updateService: (id: string, patch: Partial<ServiceDraft>) => Promise<void>;
  duplicateService: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
  moveService: (id: string, direction: "up" | "down") => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

const ServicesContext = React.createContext<ServicesContextValue | null>(null);

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = React.useState<ManagedService[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data: ManagedService[]) => setServices(data))
      .catch(() => setServices([]))
      .finally(() => setHydrated(true));
  }, []);

  const servicesFor = React.useCallback(
    (categoryId: string) => services.filter((s) => s.categoryId === categoryId).sort((a, b) => a.order - b.order),
    [services]
  );
  const activeServicesFor = React.useCallback((categoryId: string) => servicesFor(categoryId).filter((s) => s.active), [servicesFor]);
  const getService = React.useCallback((id: string) => services.find((s) => s.id === id), [services]);

  const createService = React.useCallback(async (draft: ServiceDraft): Promise<ManagedService> => {
    const res = await fetch(`/api/categories/${draft.categoryId}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const created: ManagedService = await res.json();
    setServices((prev) => [...prev, created]);
    return created;
  }, []);

  const updateService = React.useCallback(async (id: string, patch: Partial<ServiceDraft>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    await fetch(`/api/services/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
  }, []);

  const duplicateService = React.useCallback(async (id: string) => {
    const res = await fetch(`/api/services/${id}/duplicate`, { method: "POST" });
    const copy: ManagedService = await res.json();
    setServices((prev) => [...prev, copy]);
  }, []);

  const toggleActive = React.useCallback(
    async (id: string) => {
      const current = services.find((s) => s.id === id);
      if (!current) return;
      await updateService(id, { active: !current.active });
    },
    [services, updateService]
  );

  const moveService = React.useCallback(
    async (id: string, direction: "up" | "down") => {
      const target = services.find((s) => s.id === id);
      if (!target) return;
      const siblings = [...services.filter((s) => s.categoryId === target.categoryId)].sort((a, b) => a.order - b.order);
      const idx = siblings.findIndex((s) => s.id === id);
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= siblings.length) return;
      const a = siblings[idx]!;
      const b = siblings[swapWith]!;
      setServices((prev) => prev.map((s) => (s.id === a.id ? { ...s, order: b.order } : s.id === b.id ? { ...s, order: a.order } : s)));
      await Promise.all([
        fetch(`/api/services/${a.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: b.order }) }),
        fetch(`/api/services/${b.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: a.order }) }),
      ]);
    },
    [services]
  );

  const deleteService = React.useCallback(async (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/services/${id}`, { method: "DELETE" });
  }, []);

  return (
    <ServicesContext.Provider
      value={{ services, hydrated, servicesFor, activeServicesFor, getService, createService, updateService, duplicateService, toggleActive, moveService, deleteService }}
    >
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const ctx = React.useContext(ServicesContext);
  if (!ctx) throw new Error("useServices must be used within ServicesProvider");
  return ctx;
}
