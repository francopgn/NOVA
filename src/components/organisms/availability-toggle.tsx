"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AvailabilityToggle({ initialAvailable }: { initialAvailable: boolean }) {
  const [available, setAvailable] = React.useState(initialAvailable);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={() => setAvailable((v) => !v)}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-3xl border p-6 text-left transition-colors sm:w-auto sm:min-w-[340px]",
        available ? "border-status-available/40 bg-status-available/10" : "border-status-offline/40 bg-status-offline/10"
      )}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Estado de disponibilidad</p>
        <p className={cn("mt-1 text-xl font-semibold", available ? "text-status-available" : "text-muted-foreground")}>
          {available ? "🟢 Estoy disponible para reservas" : "🔴 No disponible"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {available ? "Los clientes te ven como disponible ahora mismo." : "No vas a recibir solicitudes de sesión inmediata."}
        </p>
      </div>
      <span
        className={cn(
          "flex h-9 w-16 shrink-0 items-center rounded-full p-1 transition-colors",
          available ? "bg-status-available justify-end" : "bg-secondary justify-start"
        )}
      >
        <span className="h-7 w-7 rounded-full bg-white shadow" />
      </span>
    </motion.button>
  );
}
