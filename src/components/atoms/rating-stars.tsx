import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  value,
  size = 14,
  showValue = true,
  reviewsCount,
  className,
}: {
  value: number;
  size?: number;
  showValue?: boolean;
  reviewsCount?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Star size={size} className="fill-primary text-primary" />
      {showValue && <span className="font-medium tabular-nums">{value.toFixed(1)}</span>}
      {typeof reviewsCount === "number" && <span className="text-muted-foreground">({reviewsCount})</span>}
    </span>
  );
}
