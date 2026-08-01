import {
  Briefcase,
  HeartPulse,
  LineChart,
  Cpu,
  Megaphone,
  GraduationCap,
  Apple,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// Historically a fixed union of the 8 seed categories; now a plain string so
// admin-created categories (see hooks/use-categories.tsx) can be assigned to
// any field typed with CategoryId without touching this file again.
export type CategoryId = string;

// The original 8 seed categories, kept as a literal union ONLY for the
// internal generator pools below (TITLES/TECHNIQUES/PRICE_RANGE/
// SPECIALTIES_BY_CATEGORY) so those Records stay exhaustively typed.
export type SeedCategoryId =
  | "coaches-ejecutivos"
  | "terapeutas-holisticos"
  | "consultores-financieros"
  | "mentores-tech"
  | "especialistas-marketing"
  | "formadores"
  | "nutricionistas-deportivos"
  | "especialistas-bienestar";

export interface Category {
  id: SeedCategoryId;
  label: string;
  icon: LucideIcon;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { id: "coaches-ejecutivos", label: "Coaches ejecutivos", icon: Briefcase, blurb: "Liderazgo, decisiones y carrera" },
  { id: "terapeutas-holisticos", label: "Terapeutas holísticos", icon: Sparkles, blurb: "Cuerpo, energía y equilibrio" },
  { id: "consultores-financieros", label: "Consultores financieros", icon: LineChart, blurb: "Finanzas personales e inversión" },
  { id: "mentores-tech", label: "Mentores tech", icon: Cpu, blurb: "Producto, carrera e ingeniería" },
  { id: "especialistas-marketing", label: "Especialistas en marketing", icon: Megaphone, blurb: "Marca, growth y contenido" },
  { id: "formadores", label: "Formadores", icon: GraduationCap, blurb: "Capacitación a medida" },
  { id: "nutricionistas-deportivos", label: "Nutricionistas deportivos", icon: Apple, blurb: "Rendimiento y alimentación" },
  { id: "especialistas-bienestar", label: "Especialistas en bienestar", icon: HeartPulse, blurb: "Salud integral y hábitos" },
];

export const ZONES = ["Capital", "Norte", "Oeste", "Sur", "Este"] as const;
export type Zone = (typeof ZONES)[number];

export const LANGUAGES = ["Español", "Inglés", "Portugués", "Italiano", "Francés"] as const;
export type Language = (typeof LANGUAGES)[number];

export const SESSION_TYPES = ["Individual", "Grupal", "Empresarial", "Parejas"] as const;
export type SessionType = (typeof SESSION_TYPES)[number];

export const SERVICE_MODES = [
  { id: "estudio", label: "En estudio propio" },
  { id: "domicilio", label: "A domicilio" },
  { id: "oficina", label: "En oficina corporativa" },
  { id: "virtual", label: "Virtual (online)" },
  { id: "in-company", label: "Viajes (in-company)" },
] as const;
export type ServiceModeId = (typeof SERVICE_MODES)[number]["id"];

export const CURRENCIES = ["ARS", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const DURATIONS = [30, 45, 60, 90] as const;

export function categoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

export const SPECIALTIES_BY_CATEGORY: Record<SeedCategoryId, string[]> = {
  "coaches-ejecutivos": ["Liderazgo", "Toma de decisiones", "Comunicación directiva", "Gestión del cambio", "Plan de carrera", "Alta dirección"],
  "terapeutas-holisticos": ["Reiki", "Sonoterapia", "Constelaciones familiares", "Ayurveda", "Terapia floral", "Meditación guiada"],
  "consultores-financieros": ["Presupuesto personal", "Inversión bursátil", "Planificación jubilatoria", "Deuda y ahorro", "Finanzas para pymes", "Educación financiera"],
  "mentores-tech": ["Arquitectura de software", "Career switch a tech", "Liderazgo de equipos", "Entrevistas técnicas", "Producto digital", "Escalabilidad"],
  "especialistas-marketing": ["Branding", "Marketing de contenidos", "Performance ads", "SEO", "Redes sociales", "Estrategia de lanzamiento"],
  "formadores": ["Oratoria", "Trabajo en equipo", "Onboarding corporativo", "Ventas consultivas", "Comunicación no violenta", "Gestión del tiempo"],
  "nutricionistas-deportivos": ["Nutrición para running", "Composición corporal", "Suplementación deportiva", "Planes para triatlón", "Nutrición femenina", "Recuperación muscular"],
  "especialistas-bienestar": ["Manejo del estrés", "Higiene del sueño", "Mindfulness", "Hábitos saludables", "Balance vida-trabajo", "Respiración consciente"],
};

export const ALL_SPECIALTIES = Array.from(new Set(Object.values(SPECIALTIES_BY_CATEGORY).flat())).sort();
