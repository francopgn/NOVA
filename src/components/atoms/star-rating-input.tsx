"use client";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRatingInput({ value, onChange, size = 20 }: { value: number; onChange: (v: number) => void; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} estrellas`} className="transition-transform active:scale-90">
          <Star size={size} className={cn(n <= value ? "fill-primary text-primary" : "text-muted-foreground")} />
        </button>
      ))}
    </div>
  );
}
