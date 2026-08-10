export type CustomFieldType = "boolean" | "text" | "select";

export interface ManagedCustomField {
  id: string;
  categoryId: string;
  label: string;
  type: CustomFieldType;
  options: string[]; // only meaningful when type === "select"
  required: boolean;
  active: boolean;
  order: number;
  createdAt: number;
}

export type CustomFieldDraft = Omit<ManagedCustomField, "id" | "order" | "createdAt">;
