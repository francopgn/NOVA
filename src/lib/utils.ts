import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a price as an Argentine-peso-style string, e.g. 25000 -> "25.000". No currency symbol. */
export function formatAmount(value: number) {
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(value);
}

export function formatPrice(value: number, currency: "ARS" | "USD" = "ARS") {
  return currency === "ARS" ? `AR$ ${formatAmount(value)}` : `US$ ${formatAmount(value)}`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
