"use client";
import { ICON_KEYS, iconFor } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

export function IconPicker({ value, onChange }: { value: string; onChange: (key: string) => void }) {
  return (
    <div className="grid grid-cols-8 gap-2 sm:grid-cols-12">
      {ICON_KEYS.map((key) => {
        const Icon = iconFor(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-label={key}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl border transition-colors",
              value === key ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:bg-white/5"
            )}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
