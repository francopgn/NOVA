import type { Language, ServiceModeId, SessionType, Zone, CategoryId } from "./constants";
import type { Professional } from "./types";

export interface ProviderProfileDraft {
  name: string;
  title: string;
  categoryId: CategoryId;
  avatarUrl: string;
  bio: string;
  age: number;
  yearsExperience: number;
  zone: Zone;
  languages: Language[];
  serviceModes: ServiceModeId[];
  sessionTypes: SessionType[];
  currency: "ARS" | "USD";
  pricing: { duration: 30 | 45 | 60 | 90; price: number }[];
}

/** Curated avatar picker — stand-in for a real photo upload until there's a backend to store files. */
export const AVATAR_PRESETS = [3, 5, 8, 11, 14, 22, 25, 33, 44, 48, 52, 60].map((n) => `https://i.pravatar.cc/300?img=${n}`);

/**
 * Merges the provider's onboarding draft on top of a seed Professional record.
 * Keeps id/slug/reviews/gallery/stats from the seed (so the dashboard's demo
 * activity keeps working) while every field the provider actually filled in
 * during onboarding takes priority.
 */
export function mergeProviderProfile(base: Professional, draft: ProviderProfileDraft | null): Professional {
  if (!draft) return base;
  return {
    ...base,
    name: draft.name || base.name,
    title: draft.title || base.title,
    categoryId: draft.categoryId,
    avatarUrl: draft.avatarUrl || base.avatarUrl,
    bio: draft.bio || base.bio,
    age: draft.age || base.age,
    yearsExperience: draft.yearsExperience || base.yearsExperience,
    zone: draft.zone,
    languages: draft.languages.length ? draft.languages : base.languages,
    serviceModes: draft.serviceModes.length ? draft.serviceModes : base.serviceModes,
    sessionTypes: draft.sessionTypes.length ? draft.sessionTypes : base.sessionTypes,
    currency: draft.currency,
    pricing: draft.pricing,
    priceFrom: draft.pricing[0]?.price ?? base.priceFrom,
    extraHourPrice: draft.pricing.find((p) => p.duration === 60)?.price ?? base.extraHourPrice,
  };
}
