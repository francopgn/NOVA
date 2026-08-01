"use client";
import * as React from "react";
import type { ManagedService, ServiceDraft } from "@/lib/service-types";

const STORAGE_KEY = "sessio:services";

interface ServicesContextValue {
  services: ManagedService[];
  hydrated: boolean;
  servicesFor: (categoryId: string) => ManagedService[];
  activeServicesFor: (categoryId: string) => ManagedService[];
  getService: (id: string) => ManagedService | undefined;
  createService: (draft: ServiceDraft) => ManagedService;
  updateService: (id: string, patch: Partial<ServiceDraft>) => void;
  duplicateService: (id: string) => void;
  toggleActive: (id: string) => void;
  moveService: (id: string, direction: "up" | "down") => void;
  deleteService: (id: string) => void;
}

const ServicesContext = React.createContext<ServicesContextValue | null>(null);

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = React.useState<ManagedService[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setServices(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    } finally {
      setHydrated(true);
    }
  }, []);

  const persist = React.useCallback((next: ManagedService[]) => {
    setServices(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, []);

  const servicesFor = React.useCallback(
    (categoryId: string) => services.filter((s) => s.categoryId === categoryId).sort((a, b) => a.order - b.order),
    [services]
  );
  const activeServicesFor = React.useCallback((categoryId: string) => servicesFor(categoryId).filter((s) => s.active), [servicesFor]);
  const getService = React.useCallback((id: string) => services.find((s) => s.id === id), [services]);

  const createService = React.useCallback(
    (draft: ServiceDraft): ManagedService => {
      const siblings = services.filter((s) => s.categoryId === draft.categoryId);
      const created: ManagedService = { ...draft, id: `svc-${Date.now().toString(36)}`, order: siblings.length, createdAt: Date.now() };
      persist([...services, created]);
      return created;
    },
    [services, persist]
  );

  const updateService = React.useCallback(
    (id: string, patch: Partial<ServiceDraft>) => {
      persist(services.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    },
    [services, persist]
  );

  const duplicateService = React.useCallback(
    (id: string) => {
      const source = services.find((s) => s.id === id);
      if (!source) return;
      const siblings = services.filter((s) => s.categoryId === source.categoryId);
      const copy: ManagedService = { ...source, id: `svc-${Date.now().toString(36)}`, name: `${source.name} (copia)`, order: siblings.length, active: false, createdAt: Date.now() };
      persist([...services, copy]);
    },
    [services, persist]
  );

  const toggleActive = React.useCallback(
    (id: string) => persist(services.map((s) => (s.id === id ? { ...s, active: !s.active } : s))),
    [services, persist]
  );

  const moveService = React.useCallback(
    (id: string, direction: "up" | "down") => {
      const target = services.find((s) => s.id === id);
      if (!target) return;
      const siblings = [...services.filter((s) => s.categoryId === target.categoryId)].sort((a, b) => a.order - b.order);
      const idx = siblings.findIndex((s) => s.id === id);
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= siblings.length) return;
      const a = siblings[idx]!;
      const b = siblings[swapWith]!;
      const aOrder = a.order;
      a.order = b.order;
      b.order = aOrder;
      persist(services.map((s) => (s.id === a.id ? a : s.id === b.id ? b : s)));
    },
    [services, persist]
  );

  const deleteService = React.useCallback((id: string) => persist(services.filter((s) => s.id !== id)), [services, persist]);

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
