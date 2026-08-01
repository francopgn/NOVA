"use client";
import { Check } from "lucide-react";
import { COLOR_PALETTE } from "@/lib/color-palette";
import { cn } from "@/lib/utils";

export function ColorPicker({ value, onChange }: { value: string; onChange: (key: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_PALETTE.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => onChange(c.key)}
          aria-label={c.label}
          title={c.label}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-transform",
            value === c.key ? "scale-110 border-white/80" : "border-transparent"
          )}
          style={{ backgroundColor: c.hex }}
        >
          {value === c.key && <Check size={14} className="text-black/70" />}
        </button>
      ))}
    </div>
  );
}
