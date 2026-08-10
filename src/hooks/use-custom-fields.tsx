"use client";
import * as React from "react";
import type { CustomFieldDraft, ManagedCustomField } from "@/lib/custom-field-types";

// Fase B2 — mismo patrón que use-categories.tsx / use-services.tsx, ahora
// contra /api/fields.

interface CustomFieldsContextValue {
  fields: ManagedCustomField[];
  hydrated: boolean;
  fieldsFor: (categoryId: string) => ManagedCustomField[];
  activeFieldsFor: (categoryId: string) => ManagedCustomField[];
  getField: (id: string) => ManagedCustomField | undefined;
  createField: (draft: CustomFieldDraft) => Promise<ManagedCustomField>;
  updateField: (id: string, patch: Partial<CustomFieldDraft>) => Promise<void>;
  duplicateField: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
  moveField: (id: string, direction: "up" | "down") => Promise<void>;
  deleteField: (id: string) => Promise<void>;
}

const CustomFieldsContext = React.createContext<CustomFieldsContextValue | null>(null);

export function CustomFieldsProvider({ children }: { children: React.ReactNode }) {
  const [fields, setFields] = React.useState<ManagedCustomField[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/fields")
      .then((res) => res.json())
      .then((data: ManagedCustomField[]) => setFields(data))
      .catch(() => setFields([]))
      .finally(() => setHydrated(true));
  }, []);

  const fieldsFor = React.useCallback((categoryId: string) => fields.filter((f) => f.categoryId === categoryId).sort((a, b) => a.order - b.order), [fields]);
  const activeFieldsFor = React.useCallback((categoryId: string) => fieldsFor(categoryId).filter((f) => f.active), [fieldsFor]);
  const getField = React.useCallback((id: string) => fields.find((f) => f.id === id), [fields]);

  const createField = React.useCallback(async (draft: CustomFieldDraft): Promise<ManagedCustomField> => {
    const res = await fetch(`/api/categories/${draft.categoryId}/fields`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const created: ManagedCustomField = await res.json();
    setFields((prev) => [...prev, created]);
    return created;
  }, []);

  const updateField = React.useCallback(async (id: string, patch: Partial<CustomFieldDraft>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
    await fetch(`/api/fields/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
  }, []);

  const duplicateField = React.useCallback(async (id: string) => {
    const res = await fetch(`/api/fields/${id}/duplicate`, { method: "POST" });
    const copy: ManagedCustomField = await res.json();
    setFields((prev) => [...prev, copy]);
  }, []);

  const toggleActive = React.useCallback(
    async (id: string) => {
      const current = fields.find((f) => f.id === id);
      if (!current) return;
      await updateField(id, { active: !current.active });
    },
    [fields, updateField]
  );

  const moveField = React.useCallback(
    async (id: string, direction: "up" | "down") => {
      const target = fields.find((f) => f.id === id);
      if (!target) return;
      const siblings = [...fields.filter((f) => f.categoryId === target.categoryId)].sort((a, b) => a.order - b.order);
      const idx = siblings.findIndex((f) => f.id === id);
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= siblings.length) return;
      const a = siblings[idx]!;
      const b = siblings[swapWith]!;
      setFields((prev) => prev.map((f) => (f.id === a.id ? { ...f, order: b.order } : f.id === b.id ? { ...f, order: a.order } : f)));
      await Promise.all([
        fetch(`/api/fields/${a.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: b.order }) }),
        fetch(`/api/fields/${b.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: a.order }) }),
      ]);
    },
    [fields]
  );

  const deleteField = React.useCallback(async (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    await fetch(`/api/fields/${id}`, { method: "DELETE" });
  }, []);

  return (
    <CustomFieldsContext.Provider
      value={{ fields, hydrated, fieldsFor, activeFieldsFor, getField, createField, updateField, duplicateField, toggleActive, moveField, deleteField }}
    >
      {children}
    </CustomFieldsContext.Provider>
  );
}

export function useCustomFields() {
  const ctx = React.useContext(CustomFieldsContext);
  if (!ctx) throw new Error("useCustomFields must be used within CustomFieldsProvider");
  return ctx;
}
