import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({ className, label = "Verificado" }: { className?: string; label?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent", className)}>
      <BadgeCheck size={14} className="fill-accent text-accent-foreground" />
      {label}
    </span>
  );
}
