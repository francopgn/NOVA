import type { Booking } from "@/lib/types";

const WD = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function dateLabelFor(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (sameDay(date, today)) return "Hoy";
  if (sameDay(date, tomorrow)) return "Mañana";
  return `${WD[date.getDay()]} ${date.getDate()}`;
}

/** Inverso de dateLabelFor para las opciones fijas que ofrece SolicitudCard al proponer horario. */
export function labelToISO(label: string): string {
  const today = new Date();
  const days = label === "Hoy" ? 0 : label === "Mañana" ? 1 : label === "Pasado mañana" ? 2 : 3; // "Esta semana"
  const d = new Date(today);
  d.setDate(today.getDate() + days);
  return d.toISOString().slice(0, 10);
}

interface ApiBooking {
  id: string;
  professionalId: string;
  date: string;
  startTime: string;
  duration: 30 | 45 | 60 | 90;
  sessionType: Booking["sessionType"];
  mode: Booking["mode"];
  status: Booking["status"];
  totalPrice: number;
  currency: Booking["currency"];
  paymentMethod?: "tarjeta" | "transferencia";
  client?: { name: string | null; image: string | null };
  professional?: { name: string; avatarUrl: string | null };
}

/** Convierte una reserva tal como la devuelve /api/bookings al shape mock que ya usan BookingRow y SolicitudCard. */
export function mapApiBooking(api: ApiBooking): Booking {
  return {
    id: api.id,
    professionalId: api.professionalId,
    clientName: api.client?.name ?? "Cliente",
    clientAvatar: api.client?.image ?? "https://i.pravatar.cc/100",
    dateLabel: dateLabelFor(api.date),
    startTime: api.startTime,
    duration: api.duration,
    sessionType: api.sessionType,
    mode: api.mode,
    addOns: [],
    status: api.status,
    totalPrice: api.totalPrice,
    currency: api.currency,
    paymentMethod: api.paymentMethod,
  };
}
