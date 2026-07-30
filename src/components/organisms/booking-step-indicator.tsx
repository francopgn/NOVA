import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const BOOKING_STEPS = ["Fecha", "Horario", "Duración", "Adicionales", "Resumen"];

export function BookingStepIndicator({ current, steps = BOOKING_STEPS }: { current: number; steps?: string[] }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <div key={label} className="flex flex-1 items-center gap-1.5 sm:gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  done ? "bg-primary text-primary-foreground" : active ? "border-2 border-primary text-primary" : "border border-border text-muted-foreground"
                )}
              >
                {done ? <Check size={14} /> : stepNum}
              </div>
              <span className={cn("hidden text-[11px] sm:block", active ? "font-medium text-foreground" : "text-muted-foreground")}>{label}</span>
            </div>
            {stepNum < steps.length && <div className={cn("h-px flex-1", done ? "bg-primary" : "bg-border")} />}
          </div>
        );
      })}
    </div>
  );
}
