import {
  CATEGORIES,
  LANGUAGES,
  SERVICE_MODES,
  SESSION_TYPES,
  SPECIALTIES_BY_CATEGORY,
  ZONES,
  type CategoryId,
  type Language,
  type ServiceModeId,
  type SessionType,
  type Zone,
} from "./constants";
import type {
  AppNotification,
  Booking,
  FrequentClient,
  Professional,
  Promotion,
  RatingBreakdown,
  Review,
  Story,
} from "./types";

// ---------- deterministic RNG (mulberry32) so SSR/CSR output always matches ----------
function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260127);
const rInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const rFloat = (min: number, max: number, d = 1) => Number((rng() * (max - min) + min).toFixed(d));
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rng() * arr.length)] as T;
const sample = <T,>(arr: readonly T[], n: number) => {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0] as T);
  }
  return out;
};
const chance = (p: number) => rng() < p;

const FIRST_NAMES = [
  "Sofía", "Martina", "Valentina", "Lucía", "Camila", "Julieta", "Agustina", "Florencia",
  "Mateo", "Benjamín", "Santiago", "Joaquín", "Tomás", "Nicolás", "Franco", "Ignacio",
  "Delfina", "Catalina", "Pilar", "Rocío", "Carla", "Bruno", "Emiliano", "Gonzalo",
  "Victoria", "Milagros", "Guadalupe", "Ramiro", "Federico", "Lautaro", "Ariadna", "Renata",
];
const LAST_NAMES = [
  "Fernández", "Gómez", "Rodríguez", "López", "Díaz", "Martínez", "Pérez", "Sosa",
  "Romero", "Álvarez", "Torres", "Ruiz", "Acosta", "Molina", "Herrera", "Suárez",
  "Ibáñez", "Vega", "Correa", "Paz", "Cabrera", "Núñez", "Bianchi", "Ferreyra",
];

const TITLES: Record<CategoryId, string[]> = {
  "coaches-ejecutivos": ["Coach Ejecutivo ICF", "Coach de Liderazgo", "Executive & Career Coach", "Coach Ontológico"],
  "terapeutas-holisticos": ["Terapeuta Holística", "Facilitadora en Reiki y Sonoterapia", "Terapeuta en Constelaciones", "Especialista en Ayurveda"],
  "consultores-financieros": ["Consultor Financiero CFA", "Asesora en Finanzas Personales", "Planificador Patrimonial", "Consultora en Inversiones"],
  "mentores-tech": ["Mentor de Producto & Ingeniería", "Staff Engineer Mentor", "Mentora de Carrera Tech", "Coach de Equipos Ágiles"],
  "especialistas-marketing": ["Estratega de Marca", "Especialista en Growth Marketing", "Consultora de Marketing Digital", "Experto en Performance & Contenido"],
  "formadores": ["Formador Corporativo", "Facilitadora de Capacitaciones", "Instructor de Habilidades Blandas", "Formadora en Comunicación"],
  "nutricionistas-deportivos": ["Nutricionista Deportiva", "Lic. en Nutrición del Deporte", "Especialista en Rendimiento Físico", "Nutricionista Funcional"],
  "especialistas-bienestar": ["Especialista en Bienestar Integral", "Instructora de Mindfulness", "Coach de Hábitos Saludables", "Especialista en Manejo del Estrés"],
};

const SPECIALTIES = SPECIALTIES_BY_CATEGORY;

const TECHNIQUES: Record<CategoryId, string[]> = {
  "coaches-ejecutivos": ["Coaching ontológico", "Feedback 360°", "Modelo GROW", "Assessment de liderazgo"],
  "terapeutas-holisticos": ["PNF", "Mindfulness", "Reiki Usui", "Sonoterapia con cuencos"],
  "consultores-financieros": ["Planificación 50/30/20", "Análisis de cartera", "Proyección de flujo de caja"],
  "mentores-tech": ["Mock interviews", "Revisión de arquitectura", "Plan de carrera técnica"],
  "especialistas-marketing": ["Framework AARRR", "Auditoría de marca", "Testing A/B"],
  "formadores": ["Aprendizaje experiencial", "Role playing", "Gamificación"],
  "nutricionistas-deportivos": ["Antropometría", "Plan periodizado", "Bioimpedancia"],
  "especialistas-bienestar": ["Mindfulness", "Respiración consciente", "Journaling guiado"],
};

const ZONE_CENTER: Record<Zone, { lat: number; lng: number; detail: string }> = {
  Capital: { lat: -34.6037, lng: -58.3816, detail: "CABA — Palermo, Recoleta y alrededores" },
  Norte: { lat: -34.472, lng: -58.545, detail: "Zona Norte — Vicente López, San Isidro, Tigre" },
  Oeste: { lat: -34.653, lng: -58.658, detail: "Zona Oeste — Morón, Ramos Mejía, Ituzaingó" },
  Sur: { lat: -34.756, lng: -58.402, detail: "Zona Sur — Avellaneda, Lomas de Zamora, Quilmes" },
  Este: { lat: -34.598, lng: -58.31, detail: "Costa Este — Puerto Madero, La Boca, Barracas" },
};

const PRICE_RANGE: Record<CategoryId, [number, number]> = {
  "coaches-ejecutivos": [22000, 55000],
  "terapeutas-holisticos": [12000, 30000],
  "consultores-financieros": [25000, 60000],
  "mentores-tech": [20000, 48000],
  "especialistas-marketing": [18000, 42000],
  "formadores": [30000, 70000],
  "nutricionistas-deportivos": [14000, 28000],
  "especialistas-bienestar": [10000, 24000],
};

const BIO_TEMPLATES = [
  "Acompaño procesos de transformación con foco en resultados concretos y sostenibles en el tiempo.",
  "Combino formación académica y experiencia de campo para ofrecer sesiones prácticas y personalizadas.",
  "Trabajo desde un enfoque cercano, sin tecnicismos, adaptando cada sesión a tu momento y objetivos.",
  "Más de una década ayudando a personas y equipos a atravesar cambios con herramientas concretas.",
  "Mi enfoque combina escucha activa, evidencia y seguimiento entre sesiones para sostener el progreso.",
];

function makeRatingBreakdown(): RatingBreakdown {
  return {
    calidad: rFloat(4.1, 5.0, 1),
    puntualidad: rFloat(4.0, 5.0, 1),
    comunicacion: rFloat(4.2, 5.0, 1),
    profesionalismo: rFloat(4.2, 5.0, 1),
    precioCalidad: rFloat(3.9, 5.0, 1),
  };
}
function overall(r: RatingBreakdown) {
  const v = (r.calidad + r.puntualidad + r.comunicacion + r.profesionalismo + r.precioCalidad) / 5;
  return Number(v.toFixed(1));
}

const PROMO_TEMPLATES: Array<Pick<Promotion, "kind" | "title" | "description" | "discountLabel">> = [
  { kind: "happy-hour", title: "Happy Hour", description: "Última sesión del día con descuento especial.", discountLabel: "-20% después de las 18 h" },
  { kind: "tiempo-extra", title: "30 minutos extra gratis", description: "Reservá 60 minutos y sumá media hora sin cargo.", discountLabel: "+30 min sin costo" },
  { kind: "primera-consulta", title: "Descuento primera consulta", description: "Para quienes se agendan por primera vez.", discountLabel: "-25% primera sesión" },
  { kind: "combo", title: "2 horas al precio de 1,5", description: "Ideal para procesos que necesitan más tiempo de trabajo.", discountLabel: "Combo 2h" },
];

const N_PER_CATEGORY = 4;
let counter = 0;
const professionals: Professional[] = [];

for (const cat of CATEGORIES) {
  for (let i = 0; i < N_PER_CATEGORY; i++) {
    counter += 1;
    const id = `p-${counter}`;
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    const name = `${first} ${last}`;
    const slug = `${first}-${last}-${counter}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
    const zone = pick(ZONES);
    const zc = ZONE_CENTER[zone];
    const [pmin, pmax] = PRICE_RANGE[cat.id];
    const base60 = rInt(pmin, pmax);
    const currency = chance(0.16) ? "USD" : "ARS";
    const priceScale = currency === "USD" ? 1 / 38 : 1;
    const p60 = currency === "USD" ? Math.round((base60 * priceScale) / 5) * 5 : base60;
    const pricing = [
      { duration: 30 as const, price: Math.round(p60 * 0.62) },
      { duration: 45 as const, price: Math.round(p60 * 0.82) },
      { duration: 60 as const, price: p60 },
      { duration: 90 as const, price: Math.round(p60 * 1.42) },
    ];
    const statusRoll = rng();
    const status = statusRoll < 0.4 ? "disponible" : statusRoll < 0.72 ? "ocupada" : "desconectado";
    const reviewsCount = rInt(6, 340);
    const ratingBreakdown = makeRatingBreakdown();
    const hasPromotions = chance(0.4);
    const promotions: Promotion[] = hasPromotions
      ? sample(PROMO_TEMPLATES, rInt(1, 2)).map((t, idx) => ({
          id: `${id}-promo-${idx}`,
          professionalId: id,
          active: true,
          expiresInHours: rInt(3, 96),
          ...t,
        }))
      : [];

    professionals.push({
      id,
      slug,
      name,
      title: pick(TITLES[cat.id]),
      categoryId: cat.id,
      specialties: sample(SPECIALTIES[cat.id], 3),
      age: rInt(27, 58),
      yearsExperience: rInt(3, 25),
      zone,
      coverageDetail: zc.detail,
      languages: ["Español", ...sample(LANGUAGES.filter((l) => l !== "Español"), rInt(0, 2))] as Language[],
      bio: pick(BIO_TEMPLATES),
      avatarUrl: `https://i.pravatar.cc/300?img=${(counter % 70) + 1}`,
      gallery: Array.from({ length: rInt(4, 6) }, (_, g) => `https://picsum.photos/seed/${slug}-g${g}/1200/900`),
      hasVideo: chance(0.55),
      videoThumbnailUrl: `https://picsum.photos/seed/${slug}-video/900/1200`,
      verified: { identidad: chance(0.82), profesional: chance(0.7) },
      status,
      statusMinutesAgo: status === "disponible" ? rInt(1, 40) : 0,
      busyUntilLabel: status === "ocupada" ? `hasta las ${rInt(13, 21)}:${pick(["00", "15", "30", "45"])}` : undefined,
      lastConnectionLabel: status === "desconectado" ? pick(["hace 2 h", "hace 5 h", "ayer", "hace 2 días", "hace 3 días"]) : "ahora",
      currency,
      priceFrom: pricing[0]!.price,
      pricing,
      extraHourPrice: Math.round(p60 * 0.9),
      includes: ["Sesión 1 a 1", "Resumen post-sesión", "Seguimiento por chat"],
      extraCosts: chance(0.5) ? ["Materiales de trabajo", "Informe extendido"] : [],
      serviceModes: sample(SERVICE_MODES.map((m) => m.id), rInt(2, 4)) as ServiceModeId[],
      sessionTypes: sample(SESSION_TYPES, rInt(1, 3)) as SessionType[],
      techniques: sample(TECHNIQUES[cat.id], rInt(2, 3)),
      rating: ratingBreakdown,
      ratingOverall: overall(ratingBreakdown),
      reviewsCount,
      acceptsCards: chance(0.85),
      acceptsTransfer: chance(0.92),
      ownSpace: chance(0.5),
      travelsToClient: chance(0.35),
      hasStories: chance(0.6),
      hasPromotions,
      premium: chance(0.28),
      newAndVerified: reviewsCount < 20 && chance(0.6),
      responseTimeMin: rInt(2, 90),
      popularityScore: Math.round(reviewsCount * overall(ratingBreakdown)),
      distanceKm: rFloat(0.6, 19, 1),
      lat: zc.lat + rFloat(-0.045, 0.045, 4),
      lng: zc.lng + rFloat(-0.045, 0.045, 4),
      social: {
        whatsapp: chance(0.8) ? "+54 9 11 5555-0000" : undefined,
        instagram: chance(0.75) ? `@${first.toLowerCase()}.${last.toLowerCase()}` : undefined,
        linkedin: chance(0.6) ? `${first.toLowerCase()}-${last.toLowerCase()}` : undefined,
        youtube: chance(0.25) ? `${first}${last}` : undefined,
        tiktok: chance(0.3) ? `@${first.toLowerCase()}${last.toLowerCase()}` : undefined,
        website: chance(0.4) ? `www.${first.toLowerCase()}${last.toLowerCase()}.com` : undefined,
      },
      promotions,
      completionProfile: rInt(58, 100),
    });
  }
}

export const PROFESSIONALS: Professional[] = professionals;

// ---------- reviews ----------
const REVIEW_COMMENTS = [
  "Superó mis expectativas, mucha claridad y calidez en cada sesión.",
  "Muy profesional y puntual. Se nota la experiencia.",
  "Me ayudó a ordenar ideas que tenía hace tiempo dando vueltas.",
  "Excelente relación precio-calidad, ya reservé una segunda sesión.",
  "La comunicación antes y después de la sesión fue impecable.",
  "Un espacio muy cómodo y de mucha confianza desde el primer minuto.",
  "Volvería a reservar sin dudarlo, recomendado totalmente.",
  "Buen manejo del tiempo y devoluciones concretas para aplicar.",
];

export const REVIEWS: Review[] = professionals.flatMap((prof) =>
  Array.from({ length: rInt(3, 6) }, (_, i) => ({
    id: `${prof.id}-rev-${i}`,
    professionalId: prof.id,
    authorName: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)[0]}.`,
    authorAvatar: `https://i.pravatar.cc/100?img=${rInt(1, 70)}`,
    verifiedClient: chance(0.8),
    rating: makeRatingBreakdown(),
    comment: pick(REVIEW_COMMENTS),
    daysAgo: rInt(1, 240),
  }))
);

// ---------- stories ----------
export const STORIES: Story[] = professionals
  .filter((p) => p.hasStories)
  .flatMap((prof) =>
    Array.from({ length: rInt(2, 5) }, (_, i) => ({
      id: `${prof.id}-story-${i}`,
      professionalId: prof.id,
      kind: pick(["foto", "video", "promo"] as const),
      imageUrl: `https://picsum.photos/seed/${prof.slug}-story-${i}/600/1000`,
      caption: pick([
        "Tips para tu próxima sesión",
        "Cómo preparo cada encuentro",
        "Antes / después de un proceso",
        "Novedades de la semana",
        "Un vistazo a mi espacio de trabajo",
      ]),
      hoursAgo: rInt(1, 23),
    }))
  );

// ---------- "logged-in" professional for the dashboard ----------
export const CURRENT_PROFESSIONAL: Professional = professionals[2]!;

// ---------- "logged-in" client persona (used by auth + client profile) ----------
export const CURRENT_CLIENT = {
  id: "client-1",
  name: "Camila Ríos",
  email: "camila.rios@gmail.com",
  avatarUrl: "https://i.pravatar.cc/200?img=68",
  memberSince: "Miembro desde marzo de 2025",
};

const ADDONS_POOL = [
  { id: "add-informe", label: "Informe extendido", price: 3500 },
  { id: "add-material", label: "Material de trabajo", price: 2200 },
  { id: "add-seguimiento", label: "Seguimiento por 7 días", price: 4000 },
];

export const BOOKINGS: Booking[] = [
  {
    id: "b-1", professionalId: CURRENT_PROFESSIONAL.id, clientName: "Rocío Bianchi",
    clientAvatar: "https://i.pravatar.cc/100?img=32", dateLabel: "Hoy", startTime: "10:00",
    duration: 60, sessionType: "Individual", mode: "virtual", addOns: [ADDONS_POOL[0]!],
    status: "confirmada", totalPrice: 32000, currency: "ARS",
  },
  {
    id: "b-2", professionalId: CURRENT_PROFESSIONAL.id, clientName: "Franco Herrera",
    clientAvatar: "https://i.pravatar.cc/100?img=15", dateLabel: "Hoy", startTime: "10:30",
    duration: 45, sessionType: "Individual", mode: "estudio", addOns: [],
    status: "pendiente", totalPrice: 21000, currency: "ARS", overlapsWith: "b-1",
  },
  {
    id: "b-3", professionalId: CURRENT_PROFESSIONAL.id, clientName: "Milagros Paz",
    clientAvatar: "https://i.pravatar.cc/100?img=45", dateLabel: "Hoy", startTime: "14:00",
    duration: 90, sessionType: "Empresarial", mode: "oficina", addOns: [ADDONS_POOL[1]!, ADDONS_POOL[2]!],
    status: "confirmada", totalPrice: 58000, currency: "ARS",
  },
  {
    id: "b-4", professionalId: CURRENT_PROFESSIONAL.id, clientName: "Ignacio Molina",
    clientAvatar: "https://i.pravatar.cc/100?img=22", dateLabel: "Mañana", startTime: "09:00",
    duration: 60, sessionType: "Individual", mode: "virtual", addOns: [],
    status: "confirmada", totalPrice: 32000, currency: "ARS",
  },
  {
    id: "b-5", professionalId: CURRENT_PROFESSIONAL.id, clientName: "Ariadna Correa",
    clientAvatar: "https://i.pravatar.cc/100?img=48", dateLabel: "Mañana", startTime: "17:30",
    duration: 30, sessionType: "Individual", mode: "domicilio", addOns: [ADDONS_POOL[0]!],
    status: "reprogramada", totalPrice: 19800, currency: "ARS",
  },
  {
    id: "b-6", professionalId: CURRENT_PROFESSIONAL.id, clientName: "Bruno Sosa",
    clientAvatar: "https://i.pravatar.cc/100?img=51", dateLabel: "Viernes", startTime: "11:00",
    duration: 60, sessionType: "Parejas", mode: "estudio", addOns: [],
    status: "pendiente", totalPrice: 34000, currency: "ARS",
  },
  {
    id: "b-7", professionalId: CURRENT_PROFESSIONAL.id, clientName: "Rocío Bianchi",
    clientAvatar: "https://i.pravatar.cc/100?img=32", dateLabel: "Semana pasada", startTime: "10:00",
    duration: 60, sessionType: "Individual", mode: "virtual", addOns: [],
    status: "completada", totalPrice: 32000, currency: "ARS",
  },
  {
    id: "b-8", professionalId: CURRENT_PROFESSIONAL.id, clientName: "Nicolás Ibáñez",
    clientAvatar: "https://i.pravatar.cc/100?img=11", dateLabel: "Hace 2 semanas", startTime: "16:00",
    duration: 45, sessionType: "Individual", mode: "estudio", addOns: [],
    status: "cancelada", totalPrice: 21000, currency: "ARS",
  },
];

export const FREQUENT_CLIENTS: FrequentClient[] = [
  { id: "c-1", name: "Rocío Bianchi", avatarUrl: "https://i.pravatar.cc/120?img=32", tag: "VIP", sessionsCount: 18, lastSessionDaysAgo: 3 },
  { id: "c-2", name: "Franco Herrera", avatarUrl: "https://i.pravatar.cc/120?img=15", tag: "Frecuente", sessionsCount: 9, lastSessionDaysAgo: 10 },
  { id: "c-3", name: "Milagros Paz", avatarUrl: "https://i.pravatar.cc/120?img=45", tag: "VIP", sessionsCount: 25, lastSessionDaysAgo: 1 },
  { id: "c-4", name: "Ignacio Molina", avatarUrl: "https://i.pravatar.cc/120?img=22", tag: "Nuevo", sessionsCount: 1, lastSessionDaysAgo: 15 },
  { id: "c-5", name: "Ariadna Correa", avatarUrl: "https://i.pravatar.cc/120?img=48", tag: "Frecuente", sessionsCount: 6, lastSessionDaysAgo: 22 },
  { id: "c-6", name: "Bruno Sosa", avatarUrl: "https://i.pravatar.cc/120?img=51", tag: "Nuevo", sessionsCount: 1, lastSessionDaysAgo: 2 },
];

export const NOTIFICATIONS: AppNotification[] = [
  { id: "n-1", type: "reserva-aceptada", title: "Reserva confirmada", message: `${CURRENT_PROFESSIONAL.name} aceptó tu sesión del viernes a las 11:00.`, minutesAgo: 12, read: false, professionalId: CURRENT_PROFESSIONAL.id },
  { id: "n-2", type: "nueva-propuesta", title: "Nueva propuesta de horario", message: "Te proponen mover tu sesión 30 minutos más tarde.", minutesAgo: 40, read: false },
  { id: "n-3", type: "promocion", title: "Promoción activada", message: "Happy Hour disponible después de las 18 h esta semana.", minutesAgo: 95, read: false },
  { id: "n-4", type: "historia", title: "Nueva historia", message: "Un profesional que seguís publicó contenido nuevo.", minutesAgo: 150, read: true },
  { id: "n-5", type: "disponible", title: "Profesional disponible", message: "Un especialista de tu lista de favoritos está disponible ahora.", minutesAgo: 210, read: true },
  { id: "n-6", type: "reprogramacion", title: "Sesión reprogramada", message: "Tu sesión del martes se movió a las 16:00.", minutesAgo: 320, read: true },
  { id: "n-7", type: "reserva-rechazada", title: "Reserva rechazada", message: "No se pudo confirmar tu sesión del jueves. Elegí otro horario.", minutesAgo: 480, read: true },
];

export function professionalById(id: string) {
  return PROFESSIONALS.find((p) => p.id === id || p.slug === id);
}
export function reviewsFor(professionalId: string) {
  return REVIEWS.filter((r) => r.professionalId === professionalId);
}
export function storiesFor(professionalId: string) {
  return STORIES.filter((s) => s.professionalId === professionalId);
}
