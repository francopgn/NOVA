import type { CategoryId, Currency, Language, ServiceModeId, SessionType, Zone } from "./constants";

export type AvailabilityStatus = "disponible" | "ocupada" | "desconectado";

export interface RatingBreakdown {
  calidad: number;
  puntualidad: number;
  comunicacion: number;
  profesionalismo: number;
  precioCalidad: number;
}

export interface PricingOption {
  duration: 30 | 45 | 60 | 90;
  price: number;
}

export interface Promotion {
  id: string;
  professionalId: string;
  title: string;
  description: string;
  kind: "happy-hour" | "tiempo-extra" | "primera-consulta" | "combo";
  discountLabel: string;
  active: boolean;
  expiresInHours: number;
}

export interface SocialLinks {
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  website?: string;
}

export interface Review {
  id: string;
  professionalId: string;
  authorName: string;
  authorAvatar: string;
  verifiedClient: boolean;
  rating: RatingBreakdown;
  comment: string;
  daysAgo: number;
}

export interface Story {
  id: string;
  professionalId: string;
  kind: "foto" | "video" | "promo";
  imageUrl: string;
  caption: string;
  hoursAgo: number;
}

export interface Professional {
  id: string;
  slug: string;
  name: string;
  title: string;
  categoryId: CategoryId;
  specialties: string[];
  age: number;
  yearsExperience: number;
  zone: Zone;
  coverageDetail: string;
  languages: Language[];
  bio: string;
  avatarUrl: string;
  gallery: string[];
  hasVideo: boolean;
  videoThumbnailUrl?: string;
  verified: {
    identidad: boolean;
    profesional: boolean;
  };
  status: AvailabilityStatus;
  statusMinutesAgo: number;
  busyUntilLabel?: string;
  lastConnectionLabel: string;
  currency: Currency;
  priceFrom: number;
  pricing: PricingOption[];
  extraHourPrice: number;
  includes: string[];
  extraCosts: string[];
  serviceModes: ServiceModeId[];
  sessionTypes: SessionType[];
  techniques: string[];
  rating: RatingBreakdown;
  ratingOverall: number;
  reviewsCount: number;
  acceptsCards: boolean;
  acceptsTransfer: boolean;
  ownSpace: boolean;
  travelsToClient: boolean;
  hasStories: boolean;
  hasPromotions: boolean;
  premium: boolean;
  newAndVerified: boolean;
  responseTimeMin: number;
  popularityScore: number;
  distanceKm: number;
  lat: number;
  lng: number;
  social: SocialLinks;
  promotions: Promotion[];
  completionProfile: number; // 0-100, feeds ranking explainer
}

export type BookingStatus =
  | "pendiente"
  | "confirmada"
  | "rechazada"
  | "reprogramada"
  | "completada"
  | "cancelada";

export interface AddOnService {
  id: string;
  label: string;
  price: number;
}

export interface Booking {
  id: string;
  professionalId: string;
  clientName: string;
  clientAvatar: string;
  dateLabel: string;
  startTime: string;
  duration: 30 | 45 | 60 | 90;
  sessionType: SessionType;
  mode: ServiceModeId;
  addOns: AddOnService[];
  status: BookingStatus;
  totalPrice: number;
  currency: Currency;
  overlapsWith?: string;
  notes?: string;
}

export interface ClientTag {
  label: "VIP" | "Frecuente" | "Nuevo";
}

export interface FrequentClient {
  id: string;
  name: string;
  avatarUrl: string;
  tag: "VIP" | "Frecuente" | "Nuevo";
  sessionsCount: number;
  lastSessionDaysAgo: number;
}

export type NotificationType =
  | "reserva-aceptada"
  | "reserva-rechazada"
  | "reprogramacion"
  | "nueva-propuesta"
  | "promocion"
  | "historia"
  | "disponible";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  minutesAgo: number;
  read: boolean;
  professionalId?: string;
}

export interface SearchFilters {
  query: string;
  categoryIds: CategoryId[];
  priceMin: number;
  priceMax: number;
  ageMin: number;
  ageMax: number;
  experienceMin: number;
  distanceMaxKm: number;
  onlyAvailableNow: boolean;
  onlyVerified: boolean;
  onlyWithVideo: boolean;
  onlyWithStories: boolean;
  onlyWithPromotions: boolean;
  onlyOwnSpace: boolean;
  onlyTravelsToClient: boolean;
  onlyVirtual: boolean;
  languages: Language[];
  sessionTypes: SessionType[];
  specialties: string[];
  acceptsCards: boolean;
  acceptsTransfer: boolean;
  zones: Zone[];
  sortBy:
    | "cercanos"
    | "precio-asc"
    | "precio-desc"
    | "puntuacion"
    | "populares"
    | "calidad-precio"
    | "nuevos";
}
