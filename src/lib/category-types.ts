export interface ManagedCategory {
  id: string;
  slug: string;
  label: string;
  blurb: string;
  icon: string; // key into ICON_REGISTRY
  color: string; // key into COLOR_PALETTE
  coverImageUrl: string;
  seoTitle: string;
  seoDescription: string;
  order: number;
  active: boolean;
  showInHome: boolean;
  showInSearch: boolean;
  createdAt: number;
}

export type CategoryDraft = Omit<ManagedCategory, "id" | "order" | "createdAt">;
