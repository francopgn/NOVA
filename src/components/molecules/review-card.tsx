import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { RatingStars } from "@/components/atoms/rating-stars";
import type { Review } from "@/lib/types";

export function ReviewCard({ review }: { review: Review }) {
  const overall = (review.rating.calidad + review.rating.puntualidad + review.rating.comunicacion + review.rating.profesionalismo + review.rating.precioCalidad) / 5;
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Image src={review.authorAvatar} alt={review.authorName} fill sizes="40px" className="object-cover" />
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium">
            {review.authorName}
            {review.verifiedClient && <BadgeCheck size={13} className="text-accent" />}
          </p>
          <p className="text-xs text-muted-foreground">hace {review.daysAgo} días</p>
        </div>
        <RatingStars value={overall} size={12} className="ml-auto text-xs" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
    </div>
  );
}
