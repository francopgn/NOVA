"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/panel", label: "Resumen" },
  { href: "/panel/calendario", label: "Calendario y turnos" },
  { href: "/panel/promociones", label: "Promociones" },
  { href: "/panel/clientes", label: "Clientes frecuentes" },
];

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <div className="no-scrollbar mb-8 flex gap-1.5 overflow-x-auto rounded-full border border-border bg-secondary/40 p-1.5">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            pathname === l.href ? "bg-primary text-primary-foreground shadow-glow-primary" : "text-muted-foreground hover:bg-white/5"
          )}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}
