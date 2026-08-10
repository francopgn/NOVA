"use client";
import * as React from "react";
import type { CategoryDraft, ManagedCategory } from "@/lib/category-types";

// Fase B2 — antes esto vivía en localStorage (hooks/use-categories.tsx
// original de la Fase 6). Ahora lee y escribe contra /api/categories, pero
// mantiene exactamente la misma forma pública (categories, hydrated,
// homeCategories, searchCategories, getCategory, createCategory,
// updateCategory, duplicateCategory, toggleActive, moveCategory) para que
// ningún componente que ya usa este hook necesite cambiar.
//
// Diferencia importante: createCategory/duplicateCategory ahora son
// asincrónicas de verdad (antes devolvían el objeto al toque porque todo
// pasaba en el navegador) — los call-sites en las páginas "nueva" ya están
// actualizados para esperarlas.

interface CategoriesContextValue {
  categories: ManagedCategory[];
  hydrated: boolean;
  homeCategories: ManagedCategory[];
  searchCategories: ManagedCategory[];
  getCategory: (idOrSlug: string) => ManagedCategory | undefined;
  createCategory: (draft: CategoryDraft) => Promise<ManagedCategory>;
  updateCategory: (id: string, patch: Partial<CategoryDraft>) => Promise<void>;
  duplicateCategory: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
  moveCategory: (id: string, direction: "up" | "down") => Promise<void>;
}

const CategoriesContext = React.createContext<CategoriesContextValue | null>(null);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = React.useState<ManagedCategory[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: ManagedCategory[]) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setHydrated(true));
  }, []);

  const getCategory = React.useCallback((idOrSlug: string) => categories.find((c) => c.id === idOrSlug || c.slug === idOrSlug), [categories]);

  const createCategory = React.useCallback(async (draft: CategoryDraft): Promise<ManagedCategory> => {
    const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
    const created: ManagedCategory = await res.json();
    setCategories((prev) => [...prev, created]);
    return created;
  }, []);

  const updateCategory = React.useCallback(async (id: string, patch: Partial<CategoryDraft>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))); // optimista
    await fetch(`/api/categories/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
  }, []);

  const duplicateCategory = React.useCallback(async (id: string) => {
    const res = await fetch(`/api/categories/${id}/duplicate`, { method: "POST" });
    const copy: ManagedCategory = await res.json();
    setCategories((prev) => [...prev, copy]);
  }, []);

  const toggleActive = React.useCallback(
    async (id: string) => {
      const current = categories.find((c) => c.id === id);
      if (!current) return;
      await updateCategory(id, { active: !current.active });
    },
    [categories, updateCategory]
  );

  const moveCategory = React.useCallback(
    async (id: string, direction: "up" | "down") => {
      const sorted = [...categories].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((c) => c.id === id);
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (idx === -1 || swapWith < 0 || swapWith >= sorted.length) return;
      const a = sorted[idx]!;
      const b = sorted[swapWith]!;
      setCategories((prev) => prev.map((c) => (c.id === a.id ? { ...c, order: b.order } : c.id === b.id ? { ...c, order: a.order } : c)));
      await Promise.all([
        fetch(`/api/categories/${a.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: b.order }) }),
        fetch(`/api/categories/${b.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: a.order }) }),
      ]);
    },
    [categories]
  );

  const sorted = [...categories].sort((a, b) => a.order - b.order);
  const homeCategories = sorted.filter((c) => c.active && c.showInHome);
  const searchCategories = sorted.filter((c) => c.active && c.showInSearch);

  return (
    <CategoriesContext.Provider
      value={{ categories: sorted, hydrated, homeCategories, searchCategories, getCategory, createCategory, updateCategory, duplicateCategory, toggleActive, moveCategory }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = React.useContext(CategoriesContext);
  if (!ctx) throw new Error("useCategories must be used within CategoriesProvider");
  return ctx;
}
