export interface ManagedService {
  id: string;
  categoryId: string;
  name: string;
  icon: string;
  description: string;
  suggestedPrice?: number;
  suggestedDuration?: 30 | 45 | 60 | 90;
  color: string;
  active: boolean;
  order: number;
  createdAt: number;
}

export type ServiceDraft = Omit<ManagedService, "id" | "order" | "createdAt">;
