"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Video } from "lucide-react";
import type { Professional } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { StatusDot, statusShortLabel } from "@/components/atoms/status-dot";
import { RatingStars } from "@/components/atoms/rating-stars";
import { FavoriteButton } from "@/components/molecules/favorite-button";
import { categoryById } from "@/lib/constants";

export function ProfessionalCard({ professional, priority = false }: { professional: Professional; priority?: boolean }) {
  const cat = categoryById(professional.categoryId);
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group w-[260px] shrink-0 sm:w-[280px]"
    >
      <Link href={`/profesional/${professional.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary">
          <Image
            src={professional.gallery[0] ?? professional.avatarUrl}
            alt={professional.name}
            fill
            sizes="280px"
            priority={priority}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/10" />

          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            {cat && (
              <span className="glass flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-white/90">
                <cat.icon size={12} />
                {cat.label}
              </span>
            )}
          </div>

          <div className="absolute right-3 top-3">
            <FavoriteButton id={professional.id} />
          </div>

          {professional.hasVideo && (
            <span className="absolute right-3 top-14 flex h-8 w-8 items-center justify-center rounded-full bg-black/35 backdrop-blur-md">
              <Video size={14} className="text-white" />
            </span>
          )}

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-white">
              <StatusDot status={professional.status} size="sm" />
              {statusShortLabel(professional.status)}
            </span>
            <span className="glass inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-white/85">
              <MapPin size={11} />
              {professional.distanceKm} km
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-0.5 px-0.5">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate font-medium leading-tight">{professional.name}</p>
            <RatingStars value={professional.ratingOverall} reviewsCount={professional.reviewsCount} size={13} className="shrink-0 text-xs" />
          </div>
          <p className="truncate text-sm text-muted-foreground">{professional.title}</p>
          <p className={cn("mt-1 text-sm")}>
            <span className="font-semibold tabular-nums">{formatPrice(professional.priceFrom, professional.currency)}</span>
            <span className="text-muted-foreground"> / sesión</span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
