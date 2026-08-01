"use client";
import * as React from "react";
import { CATEGORIES } from "@/lib/constants";
import type { CategoryDraft, ManagedCategory } from "@/lib/category-types";

const STORAGE_KEY = "sessio:categories";

const SEED_ICON_KEY: Record<string, string> = {
  "coaches-ejecutivos": "briefcase",
  "terapeutas-holisticos": "sparkles",
  "consultores-financieros": "line-chart",
  "mentores-tech": "cpu",
  "especialistas-marketing": "megaphone",
  formadores: "graduation-cap",
  "nutricionistas-deportivos": "apple",
  "especialistas-bienestar": "heart-pulse",
};
const SEED_COLOR_KEY: Record<string, string> = {
  "coaches-ejecutivos": "bronze",
  "terapeutas-holisticos": "sage",
  "consultores-financieros": "sky",
  "mentores-tech": "violet",
  "especialistas-marketing": "coral",
  formadores: "amber",
  "nutricionistas-deportivos": "emerald",
  "especialistas-bienestar": "rose",
};

function seedCategories(): ManagedCategory[] {
  return CATEGORIES.map((c, i) => ({
    id: c.id,
    slug: c.id,
    label: c.label,
    blurb: c.blurb,
    icon: SEED_ICON_KEY[c.id] ?? "star",
    color: SEED_COLOR_KEY[c.id] ?? "bronze",
    coverImageUrl: `https://picsum.photos/seed/cat-${c.id}/800/500`,
    seoTitle: `${c.label} | Sessio`,
    seoDescription: c.blurb,
    order: i,
    active: true,
    showInHome: true,
    showInSearch: true,
    createdAt: Date.now(),
  }));
}

function slugify(label: string) {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface CategoriesContextValue {
  categories: ManagedCategory[];
  hydrated: boolean;
  homeCategories: ManagedCategory[];
  searchCategories: ManagedCategory[];
  getCategory: (idOrSlug: string) => ManagedCategory | undefined;
  createCategory: (draft: CategoryDraft) => ManagedCategory;
  updateCategory: (id: string, patch: Partial<CategoryDraft>) => void;
  duplicateCategory: (id: string) => void;
  toggleActive: (id: string) => void;
  moveCategory: (id: string, direction: "up" | "down") => void;
}

const CategoriesContext = React.createContext<CategoriesContextValue | null>(null);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = React.useState<ManagedCategory[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      setCategories(raw ? (JSON.parse(raw) as ManagedCategory[]) : seedCategories());
    } catch {
      setCategories(seedCategories());
    } finally {
      setHydrated(true);
    }
  }, []);

  const persist = React.useCallback((next: ManagedCategory[]) => {
    setCategories(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, []);

  const getCategory = React.useCallback((idOrSlug: string) => categories.find((c) => c.id === idOrSlug || c.slug === idOrSlug), [categories]);

  const createCategory = React.useCallback(
    (draft: CategoryDraft): ManagedCategory => {
      const slug = draft.slug || slugify(draft.label);
      const created: ManagedCategory = {
        ...draft,
        slug,
        id: `${slug}-${Date.now().toString(36)}`,
        order: categories.length,
        createdAt: Date.now(),
      };
      persist([...categories, created]);
      return created;
    },
    [categories, persist]
  );

  const updateCategory = React.useCallback(
    (id: string, patch: Partial<CategoryDraft>) => {
      persist(categories.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    },
    [categories, persist]
  );

  const duplicateCategory = React.useCallback(
    (id: string) => {
      const source = categories.find((c) => c.id === id);
      if (!source) return;
      const slug = `${source.slug}-copia`;
      const copy: ManagedCategory = {
        ...source,
        id: `${slug}-${Date.now().toString(36)}`,
        slug,
        label: `${source.label} (copia)`,
        order: categories.length,
        active: false,
        createdAt: Date.now(),
      };
      persist([...categories, copy]);
    },
    [categories, persist]
  );

  const toggleActive = React.useCallback(
    (id: string) => {
      persist(categories.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
    },
    [categories, persist]
  );

  const moveCategory = React.useCallback(
    (id: string, direction: "up" | "down") => {
      const sorted = [...categories].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((c) => c.id === id);
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (idx === -1 || swapWith < 0 || swapWith >= sorted.length) return;
      const a = sorted[idx]!;
      const b = sorted[swapWith]!;
      const aOrder = a.order;
      a.order = b.order;
      b.order = aOrder;
      persist(categories.map((c) => (c.id === a.id ? a : c.id === b.id ? b : c)));
    },
    [categories, persist]
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
