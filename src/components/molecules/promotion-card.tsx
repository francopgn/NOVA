import { Zap, Clock, Sparkles, Layers, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Promotion } from "@/lib/types";

const KIND_ICON: Record<Promotion["kind"], LucideIcon> = {
  "happy-hour": Zap,
  "tiempo-extra": Clock,
  "primera-consulta": Sparkles,
  combo: Layers,
};

export function PromotionCard({ promotion }: { promotion: Promotion }) {
  const Icon = KIND_ICON[promotion.kind];
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/[0.06] p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
        <Icon size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">{promotion.title}</p>
          <Badge variant="default">{promotion.discountLabel}</Badge>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{promotion.description}</p>
        <p className="mt-1.5 text-[11px] text-primary/80">Vence en {promotion.expiresInHours} h</p>
      </div>
    </div>
  );
}
