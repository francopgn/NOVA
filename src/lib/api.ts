import { CATEGORIES } from "./constants";
import {
  BOOKINGS,
  CURRENT_PROFESSIONAL,
  FREQUENT_CLIENTS,
  NOTIFICATIONS,
  PROFESSIONALS,
  professionalById,
  reviewsFor,
  storiesFor,
} from "./mock-data";
import type { Booking, Professional, SearchFilters } from "./types";

/**
 * ---------------------------------------------------------------------------
 * API layer — currently backed by in-memory mock data.
 *
 * To connect a real backend, replace the body of each function with a call
 * through `fetchJSON`, e.g.:
 *
 *   export async function getProfessionals() {
 *     return fetchJSON<Professional[]>("/professionals");
 *   }
 *
 * Every function already returns a Promise and every payload shape lives in
 * `lib/types.ts`, so consuming components require no changes.
 * ---------------------------------------------------------------------------
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getCategories() {
  await delay(0);
  return CATEGORIES;
}

export interface HomeSections {
  disponiblesAhora: Professional[];
  mejorValorados: Professional[];
  mejorCalidadPrecio: Professional[];
  nuevosVerificados: Professional[];
  cercanos: Professional[];
}

export async function getHomeSections(): Promise<HomeSections> {
  await delay();
  const sorted = [...PROFESSIONALS];
  return {
    disponiblesAhora: sorted.filter((p) => p.status === "disponible").sort((a, b) => a.statusMinutesAgo - b.statusMinutesAgo).slice(0, 10),
    mejorValorados: [...sorted].sort((a, b) => b.ratingOverall - a.ratingOverall).slice(0, 10),
    mejorCalidadPrecio: [...sorted].sort((a, b) => b.rating.precioCalidad - a.rating.precioCalidad).slice(0, 10),
    nuevosVerificados: sorted.filter((p) => p.newAndVerified && p.verified.identidad).slice(0, 10),
    cercanos: [...sorted].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 10),
  };
}

export const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  categoryIds: [],
  priceMin: 0,
  priceMax: 100000,
  ageMin: 25,
  ageMax: 65,
  experienceMin: 0,
  distanceMaxKm: 20,
  onlyAvailableNow: false,
  onlyVerified: false,
  onlyWithVideo: false,
  onlyWithStories: false,
  onlyWithPromotions: false,
  onlyOwnSpace: false,
  onlyTravelsToClient: false,
  onlyVirtual: false,
  languages: [],
  sessionTypes: [],
  specialties: [],
  acceptsCards: false,
  acceptsTransfer: false,
  zones: [],
  sortBy: "populares",
};

export async function searchProfessionals(filters: Partial<SearchFilters>): Promise<Professional[]> {
  await delay();
  const f = { ...DEFAULT_FILTERS, ...filters };
  let results = PROFESSIONALS.filter((p) => {
    if (f.query && !`${p.name} ${p.title} ${p.specialties.join(" ")}`.toLowerCase().includes(f.query.toLowerCase())) return false;
    if (f.categoryIds.length && !f.categoryIds.includes(p.categoryId)) return false;
    if (p.priceFrom < f.priceMin || p.priceFrom > f.priceMax) return false;
    if (p.age < f.ageMin || p.age > f.ageMax) return false;
    if (p.yearsExperience < f.experienceMin) return false;
    if (p.distanceKm > f.distanceMaxKm) return false;
    if (f.onlyAvailableNow && p.status !== "disponible") return false;
    if (f.onlyVerified && !(p.verified.identidad && p.verified.profesional)) return false;
    if (f.onlyWithVideo && !p.hasVideo) return false;
    if (f.onlyWithStories && !p.hasStories) return false;
    if (f.onlyWithPromotions && !p.hasPromotions) return false;
    if (f.onlyOwnSpace && !p.ownSpace) return false;
    if (f.onlyTravelsToClient && !p.travelsToClient) return false;
    if (f.onlyVirtual && !p.serviceModes.includes("virtual")) return false;
    if (f.languages.length && !f.languages.some((l) => p.languages.includes(l))) return false;
    if (f.sessionTypes.length && !f.sessionTypes.some((s) => p.sessionTypes.includes(s))) return false;
    if (f.specialties.length && !f.specialties.some((s) => p.specialties.includes(s))) return false;
    if (f.acceptsCards && !p.acceptsCards) return false;
    if (f.acceptsTransfer && !p.acceptsTransfer) return false;
    if (f.zones.length && !f.zones.includes(p.zone)) return false;
    return true;
  });

  switch (f.sortBy) {
    case "cercanos": results = results.sort((a, b) => a.distanceKm - b.distanceKm); break;
    case "precio-asc": results = results.sort((a, b) => a.priceFrom - b.priceFrom); break;
    case "precio-desc": results = results.sort((a, b) => b.priceFrom - a.priceFrom); break;
    case "puntuacion": results = results.sort((a, b) => b.ratingOverall - a.ratingOverall); break;
    case "populares": results = results.sort((a, b) => b.popularityScore - a.popularityScore); break;
    case "calidad-precio": results = results.sort((a, b) => b.rating.precioCalidad - a.rating.precioCalidad); break;
    case "nuevos": results = results.sort((a, b) => Number(b.newAndVerified) - Number(a.newAndVerified)); break;
  }
  return results;
}

export async function getProfessional(idOrSlug: string) {
  await delay(160);
  return professionalById(idOrSlug);
}

export async function getReviews(professionalId: string) {
  await delay(160);
  return reviewsFor(professionalId);
}

export async function getStories(professionalId: string) {
  await delay(120);
  return storiesFor(professionalId);
}

export async function getNearbyProfessionals(): Promise<Professional[]> {
  await delay();
  return [...PROFESSIONALS].sort((a, b) => a.distanceKm - b.distanceKm);
}

export async function getNotifications() {
  await delay(150);
  return NOTIFICATIONS;
}

export async function getCurrentProfessional() {
  await delay(150);
  return CURRENT_PROFESSIONAL;
}

export async function getBookings(): Promise<Booking[]> {
  await delay(180);
  return BOOKINGS;
}

export async function getFrequentClients() {
  await delay(150);
  return FREQUENT_CLIENTS;
}

export interface CreateBookingPayload {
  professionalId: string;
  dateLabel: string;
  startTime: string;
  duration: 30 | 45 | 60 | 90;
  sessionType: Booking["sessionType"];
  mode: Booking["mode"];
  addOnIds: string[];
  paymentMethod?: "tarjeta" | "transferencia";
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  await delay(500);
  const prof = professionalById(payload.professionalId);
  const option = prof?.pricing.find((p) => p.duration === payload.duration);
  return {
    id: `b-${Math.round(rngLike())}`,
    professionalId: payload.professionalId,
    clientName: "Vos",
    clientAvatar: "https://i.pravatar.cc/100?img=68",
    dateLabel: payload.dateLabel,
    startTime: payload.startTime,
    duration: payload.duration,
    sessionType: payload.sessionType,
    mode: payload.mode,
    addOns: [],
    status: "pendiente",
    totalPrice: option?.price ?? prof?.priceFrom ?? 0,
    currency: prof?.currency ?? "ARS",
    paymentMethod: payload.paymentMethod,
  };
}

function rngLike() {
  return Math.floor(1000 + Math.random() * 8999);
}
