"use client";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { Professional } from "@/lib/types";
import { StatusDot, statusShortLabel } from "@/components/atoms/status-dot";
import { RatingStars } from "@/components/atoms/rating-stars";
import { categoryById } from "@/lib/constants";

export function ProfessionalListRow({
  professional,
  active,
  onHover,
}: {
  professional: Professional;
  active?: boolean;
  onHover?: (id: string | null) => void;
}) {
  const cat = categoryById(professional.categoryId);
  return (
    <Link
      href={`/profesional/${professional.slug}`}
      onMouseEnter={() => onHover?.(professional.id)}
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        "flex gap-3 rounded-2xl border p-2.5 transition-colors",
        active ? "border-primary/60 bg-primary/5" : "border-border bg-card hover:bg-white/[0.03]"
      )}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
        <Image src={professional.gallery[0] ?? professional.avatarUrl} alt={professional.name} fill sizes="80px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-center gap-1.5">
          <StatusDot status={professional.status} size="sm" />
          <span className="text-[11px] text-muted-foreground">{statusShortLabel(professional.status)}</span>
        </div>
        <p className="mt-0.5 truncate text-sm font-medium">{professional.name}</p>
        <p className="truncate text-xs text-muted-foreground">{cat?.label ?? professional.title}</p>
        <div className="mt-1 flex items-center justify-between">
          <RatingStars value={professional.ratingOverall} size={11} className="text-[11px]" />
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin size={10} /> {professional.distanceKm} km
          </span>
        </div>
        <p className="mt-0.5 text-xs font-semibold tabular-nums">{formatPrice(professional.priceFrom, professional.currency)}</p>
      </div>
    </Link>
  );
}
