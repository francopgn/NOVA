import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ElementType;
  trend?: { value: string; positive: boolean };
  className?: string;
}) {
  return (
    <Card className={cn("glass border-white/10", className)}>
      <CardContent className="flex flex-col gap-2 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
          {Icon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Icon size={15} />
            </span>
          )}
        </div>
        <p className="font-mono text-3xl font-semibold tabular-nums">{value}</p>
        <div className="flex items-center gap-1.5 text-xs">
          {trend && (
            <span className={trend.positive ? "text-status-available" : "text-destructive"}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
